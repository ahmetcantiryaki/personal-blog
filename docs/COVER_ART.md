# Woyable Cover Art — AI Image System

How every AI-generated post cover is art-directed so the whole catalogue shares
one visual identity — consistent with the site's warm-stone design tokens
(`src/app/(frontend)/globals.css`) and the five SVG cover palettes
(`src/components/blog/cover-palettes.ts`). AI covers and the SVG fallbacks are
deliberately **one family**: same per-category accent hue.

**Current direction: BOLD COMPOSITE** (architect's decision, 2026-07-07) — an
energetic FLUX schnell background in the site palette, with 1-3 **official
brand logos** composited crisply on soft plates via `sharp`. The model never
draws logos or text itself (it garbles them); real SVG marks are overlaid
programmatically, so they stay pixel-accurate. The earlier **calm** style
remains available as an alternative (`--style calm`).

- **Model**: fal.ai `fal-ai/flux/schnell` (FLUX.1 [schnell]) via the queue REST API.
- **Size**: landscape **1216×640** (an allowed FLUX custom size, ≈ the 1200×630 OG ratio).
- **Output**: JPEG, saved to `public/covers/<translationKey>.jpg`.
- **Generator**: `src/scripts/generate-cover.mjs` (the executable source of truth;
  this doc documents it verbatim — keep the two in sync). `sharp` is a
  devDependency only and never enters the production runtime bundle.
- **Fallback**: when no `coverImage` exists, the deterministic SVG `CoverArt` still
  renders. The fallback stays forever; AI covers are progressive enhancement.

## Design tokens echoed into the prompt

From `globals.css`: warm stone background `oklch(0.991 0.003 83)` ≈ **`#fdfcf9`**,
warm-charcoal foreground, one restrained dusty-teal primary `oklch(0.556 0.058 192)`.

The five SVG palettes (`cover-palettes.ts`, with sRGB approximations from
`src/lib/og-palette.ts`):

| Palette | Mood  | oklch base            | sRGB base | Primary blob (sRGB) |
|---------|-------|-----------------------|-----------|---------------------|
| aurora  | teal  | `oklch(0.32 0.045 200)` | `#123338` | `#2f7d78` |
| dusk    | plum  | `oklch(0.31 0.05 320)`  | `#331d3a` | `#7d4a6c` |
| meadow  | green | `oklch(0.33 0.045 150)` | `#1b3320` | `#3f7d47` |
| ocean   | blue  | `oklch(0.3 0.05 245)`   | `#172a44` | `#37609a` |
| ember   | amber | `oklch(0.32 0.05 45)`   | `#37271a` | `#9a6237` |

## BASE SYSTEM PROMPT — bold composite (default, verbatim)

`{ACCENT}` is the per-category hue + hex; `{SUBJECT}` is the per-article motif.
FLUX schnell has no negative-prompt input, so exclusions are inlined. Energy is
allowed; neon and purple-blue "AI-slop" gradients are not. The right third is
kept quieter so the composited logo plates have room.

```
Bold dynamic abstract editorial tech banner, energetic diagonal composition.
Large sweeping geometric shapes, oversized curved forms and angular translucent
planes cutting across the frame with strong contrast, depth and confident
motion, on a warm off-white stone background (#fdfcf9). Dominant accent colour:
{ACCENT}, in rich layered washes, balanced with warm neutral greys and deep
warm-charcoal shadow shapes. Dramatic scale contrast, focal energy concentrated
on the left two-thirds of the frame, right third visually quieter. Subtle
fine-grain texture, matte finish, flat 2D fine-art print aesthetic, wide
landscape banner. Subject motif: {SUBJECT}. Absolutely no text, no letters, no
words, no numbers, no logos, no watermark, no signature; no people, no faces, no
hands, no bodies; no glossy 3D render, no photorealism, no stock photo, no neon,
no cyberpunk, no purple-and-blue tech gradient, no busy collage.
```

## Logo compositing rules

- **Sources, in priority order**: (1) curated official press-kit SVGs dropped
  into `assets/brand-logos/<slug>.svg`; (2) `https://cdn.simpleicons.org/<slug>`
  (official brand path data + official brand colour) as fallback.
- **1-3 logos** per cover, topic-relevant only. Editorial/nominative use; marks
  are **never distorted, stretched, or recoloured** (`fit: contain`).
- Each logo sits on a soft warm-stone plate (`#fdfcf9` at 97% opacity, rounded
  corners ≈17% of plate size, hairline warm-charcoal border, subtle drop
  shadow) for legibility on any background.
- Fixed composed layouts on the quieter right third, gentle diagonal:
  1 logo → 208px plate centred at (924, 320); 2 logos → 176px plates at
  (880, 232) and (1042, 420); 3 logos → 150px plates at (822, 184), (968, 320),
  (1108, 456). Icon ≈58% of plate size.

## ALTERNATIVE STYLE — calm (original identity, verbatim)

Available via `--style calm`. Same accents, opposite energy; usually no logos.

```
Abstract editorial cover illustration, minimalist fine-art poster. Soft
overlapping translucent gradient fields and layered organic-geometric shapes on a
warm off-white stone background (#fdfcf9). Muted, desaturated palette of warm
neutral greys with a single restrained accent colour: {ACCENT}. Calm, quiet,
sophisticated editorial mood. Generous negative space, gentle soft-focus
gradients, subtle fine-grain paper texture, delicate thin linework. Matte finish,
flat 2D risograph / fine-art print aesthetic, soft diffused lighting, balanced
asymmetric composition, wide landscape banner. Subject motif: {SUBJECT}.
Absolutely no text, no letters, no words, no numbers, no logos, no watermark, no
signature; no people, no faces, no hands, no bodies; no glossy 3D render, no
photorealism, no stock photo, no neon, no cyberpunk, no purple-and-blue tech
gradient, no busy collage. Understated, tasteful, museum-poster restraint.
```

Calm reference renders of the two pilots are kept for comparison at
`public/covers/preview/calm-build-rag-system.jpg` and
`public/covers/preview/calm-kubernetes-cost-optimization.jpg`.

### Hard exclusions for the generated background (never)

model-drawn text / letters / words / numbers · model-drawn logos (real marks are
composited, never generated) · people / faces / hands · neon / cyberpunk ·
purple-blue "AI-slop" gradients · busy collages.

## Per-category accent mapping

Each of the five sections maps to one palette so readers distinguish sections at
a glance. The accent is the mid-tone hue of that palette's primary blob.

| Category                | Palette | Accent hue              | Hex       |
|-------------------------|---------|-------------------------|-----------|
| `ai`                    | aurora  | dusty teal              | `#2f7d78` |
| `web-development`       | ocean   | slate blue              | `#37609a` |
| `software-engineering`  | meadow  | muted sage green        | `#3f7d47` |
| `devops-cloud`          | ember   | warm amber / terracotta | `#9a6237` |
| `career-productivity`   | dusk    | muted plum / mauve      | `#7d4a6c` |

## Per-article subject motifs + logos

One short, still-abstract motif derived from the topic, plus 1-3 relevant logo
slugs. Pilot covers:

| translationKey | Category | Logos | Subject motif |
|----------------|----------|-------|---------------|
| `build-rag-system` | `ai` | `postgresql,python` | a dramatic cascade of oversized translucent document planes sweeping diagonally across the frame, converging toward a bright glowing focal core, thin taut connective lines suggesting retrieval and grounding |
| `kubernetes-cost-optimization` | `devops-cloud` | `kubernetes` | massive angular container blocks tumbling and packing tightly into a dense balanced cluster, one oversized sweeping arc descending across the frame like a falling cost curve |

Motif guidelines: one concrete-but-abstract metaphor for the article's core
idea, a single clause, bold scale words welcome ("oversized", "sweeping",
"dramatic"); never literal UI or screenshots. Logos: only marks genuinely
central to the article.

## Generating a cover

```bash
node src/scripts/generate-cover.mjs \
  --key build-rag-system \
  --category ai \
  --subject "oversized document planes sweeping toward a bright focal core" \
  --logos postgresql,python          # optional, 1-3 slugs
  # --style calm                     # optional alternative style
```

The seed is derived from a FNV-1a hash of the `translationKey`, so re-runs are
stable. FAL_KEY is read from `.env` (gitignored) and never printed. Output lands
in `public/covers/<translationKey>.jpg`; the next `pnpm seed` sets the post's
`coverImage` to `/covers/<translationKey>.jpg` (shared by both locales).
