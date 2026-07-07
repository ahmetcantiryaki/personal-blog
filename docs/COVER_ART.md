# Woyable Cover Art — AI Image System

How every AI-generated post cover is art-directed so the whole catalogue shares
one calm, editorial visual identity — consistent with the site's warm-stone
design tokens (`src/app/(frontend)/globals.css`) and the five SVG cover palettes
(`src/components/blog/cover-palettes.ts`). AI covers and the SVG fallbacks are
deliberately **one family**: same per-category accent hue, different luminance.

- **Model**: fal.ai `fal-ai/flux/schnell` (FLUX.1 [schnell]) via the queue REST API.
- **Size**: landscape **1216×640** (an allowed FLUX custom size, ≈ the 1200×630 OG ratio).
- **Output**: JPEG, saved to `public/covers/<translationKey>.jpg`.
- **Generator**: `src/scripts/generate-cover.mjs` (the executable source of truth;
  this doc documents it verbatim — keep the two in sync).
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

The SVG covers use these as **deep panels** (dark base + muted blobs). The AI
covers invert the luminance: a **light warm-stone field** with the *same accent
hue* as a soft gradient. Same hue family, opposite tone — so a category's SVG
fallback and its AI cover feel unmistakably related.

## BASE SYSTEM PROMPT (verbatim)

Prepended to every cover. `{ACCENT}` is the per-category hue + hex; `{SUBJECT}`
is the per-article motif. Because FLUX schnell is a distilled model with no
negative-prompt input, all exclusions are inlined into the positive prompt.

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

### Hard exclusions (never)

text / letters / words / numbers · logos · people / faces / hands · glossy 3D
renders · neon / cyberpunk · purple-blue "AI-slop" gradients · stock-photo
realism · busy collages.

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

## Per-article subject motifs

One short, still-abstract motif derived from the topic. Examples (pilot covers):

| translationKey              | Category      | Subject motif |
|-----------------------------|---------------|---------------|
| `build-rag-system`          | `ai`          | layered translucent document planes drifting and converging into a single softly glowing focal node, thin connective lines suggesting retrieval and grounding |
| `kubernetes-cost-optimization` | `devops-cloud` | a loose grid of soft rounded container tiles of varying sizes settling into balanced clusters, a few dimming to near-empty, suggesting bin-packing and trimmed waste |

Motif guidelines: pick one concrete-but-abstract metaphor for the article's core
idea; keep it to a single clause; never literal UI, screenshots, or mascots.

## Generating a cover

```bash
node src/scripts/generate-cover.mjs \
  --key build-rag-system \
  --category ai \
  --subject "layered translucent document planes converging into a single glowing node"
```

The seed is derived from a FNV-1a hash of the `translationKey`, so re-runs are
stable. FAL_KEY is read from `.env` (gitignored) and never printed. Output lands
in `public/covers/<translationKey>.jpg`; the next `pnpm seed` sets the post's
`coverImage` to `/covers/<translationKey>.jpg` (shared by both locales).
