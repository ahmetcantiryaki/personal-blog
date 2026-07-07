# Woyable Cover Art — AI Image System

How every AI-generated post cover is art-directed so the whole catalogue shares
one visual identity. Covers are saved to `public/covers/<translationKey>.jpg` and
consumed by the post's `coverImage` (shared by both locales). When no cover
exists, the deterministic SVG `CoverArt` fallback still renders — the fallback
stays forever; AI covers are progressive enhancement.

## OFFICIAL DIRECTION: HAND-DRAWN VINTAGE (2026-07)

The catalogue's official cover style is a **hand-drawn vintage illustration**:
ink + watercolour with detailed crosshatch on the **left half** (a whimsical
metaphor for the article's core idea, often featuring a small brass robot
mascot), and the **right half** left as white space carrying a **handwritten
Turkish hook** with a wobbly hand-drawn arrow curving toward the illustration.
The hook is a short, punchy question that makes the reader curious.

- **Model**: fal.ai `fal-ai/nano-banana` (Gemini Flash Image) via the queue REST
  API. Chosen because, unlike FLUX, it renders short handwritten text legibly.
- **Aspect ratio**: `16:9` (nano-banana is a ratio-model; it produces **1344×768**).
- **Seed**: a **new random seed every image** — this is trial-and-error art, not
  deterministic. Re-running makes a fresh variant; keep the one you like.
- **Output**: JPEG, `public/covers/<translationKey>.jpg` (100–600 KB is the sane band).
- **Cost**: ~**$0.0398/image** (~$2.40 for the full 66-post catalogue).
- **Generator**: `src/scripts/generate-kapak-batch.mjs` (the executable source of
  truth; this doc documents it verbatim — keep the two in sync). No `sharp`
  compositing — nano-banana draws the whole frame including the text.
- **Prompt library**: the 66 ready prompts live in `kapak-promptlari.md` (repo
  root, gitignored from deploy but kept locally). Each entry maps to a post's
  `translationKey` by exact Turkish title via `seed/content/link-map.json`.

### Fixed template (verbatim from `kapak-promptlari.md` header)

> **Sabit şablon:** Sol yarıda el çizimi metafor (mürekkep + suluboya,
> crosshatch), sağ yarıda beyaz boşluk + el yazısı kanca + illüstrasyona kıvrılan
> karalama ok.
>
> **Kullanım notları:**
> - `Spell exactly` satırındaki metin kapağa yazılacak kancadır.
> - ⚠ işaretli kancalar Türkçe özel karakter (ş, ğ, ı, ö, ü, ç) içerir — model
>   bozarsa parantezdeki karaktersiz alternatifi kullan ya da yazıyı sonradan ekle.
> - Stil tutarlılığı için ilk beğendiğin kapağı sonraki üretimlerde referans
>   görsel olarak ver.

Every prompt follows this exact skeleton (fill the CAPS placeholders):

```
Hand-drawn vintage illustration, 16:9. LEFT half: {SCENE — a whimsical ink +
watercolour metaphor for the article, detailed crosshatch, plain white paper
background}. RIGHT half: empty white space with handwritten text "{HOOK}" — thin
monoline felt-tip handwriting, slightly bouncy baseline, rounded letters, dark
sepia brown, text filling one third of image width, vertically centered[, two
lines]. One sketchy wobbly arrow above the text curving left toward the {SUBJECT}.
Spell exactly: "{HOOK}"
```

**Series identity — never change these fixed phrases** (they are what makes the
catalogue read as one series): `ink and watercolor`, `detailed crosshatch`,
`felt-tip handwriting`, `dark sepia brown`, `wobbly arrow`. The recurring
`small brass robot` mascot is intentional; drop it from a prompt only if a scene
genuinely has no place for it.

### Turkish-character caveat (important)

nano-banana renders **ASCII Latin handwriting reliably** but frequently garbles
Turkish diacritics (ş, ğ, ı, ö, ü, ç). So every hook is written in a **diacritic-free**
form (e.g. "Neden Uydurur?" instead of "Neden Uydurur?" with the real ü, or
"Garson Ne Getirir?"). If you must ship the fully-accented hook, generate the
frame **without text** and add the caption afterward in Canva/Figma with the
Caveat font. Incidental in-scene signage (labels drawn inside the left-half
illustration) may still garble — that is acceptable; only the **main hook** must
be clean and correctly spelled.

## Generating covers

### Full catalogue (batch)

```bash
node src/scripts/generate-kapak-batch.mjs
#   --dry-run       print the title→translationKey mapping only (no API, no writes)
#   --force-regen   ignore studio reuse and regenerate every row
```

Reads `kapak-promptlari.md` + `seed/content/link-map.json`, generates one image
per post at ≤3 concurrency, and writes `public/covers/<translationKey>.jpg`. Rows
that already have an approved attempt in `local-studio-output/kapak/` are
**reused** (their first attempt, `a1`, is copied — never regenerated). Each new
cover is generated **once** and the first output is accepted (no quality-based
regeneration); a hard API/network failure is retried at most once.

### Single cover (daily routine) — REQUIRED invocation

The daily cloud agent crafts a fresh prompt per new article, following the fixed
template above, and calls the generator in single mode:

```bash
# from a prompt file
node src/scripts/generate-kapak-batch.mjs --single <translationKey> --prompt-file <path>

# from an inline prompt
node src/scripts/generate-kapak-batch.mjs --single <translationKey> --prompt "<full prompt>"

# from stdin
echo "<full prompt>" | node src/scripts/generate-kapak-batch.mjs --single <translationKey>
```

The routine should: (1) write a prompt following the fixed template with a
diacritic-free hook; (2) pass the post's `translationKey`; (3) after generation,
eyeball `public/covers/<translationKey>.jpg` and confirm the hook is legible and
correctly spelled. No reseed is needed — the `coverImage` path is unchanged, so
the DB already points at the file.

---

## LEGACY ALTERNATIVE — BOLD COMPOSITE (superseded 2026-07)

The previous direction — kept documented and runnable as an alternative — was an
energetic FLUX schnell background in the site palette, with 1-3 **official brand
logos** composited crisply on soft plates via `sharp`. The model never draws
logos or text itself (it garbles them); real SVG marks are overlaid
programmatically, so they stay pixel-accurate. The **calm** style below is the
same pipeline with opposite energy.

- **Model**: fal.ai `fal-ai/flux/schnell` (FLUX.1 [schnell]) via the queue REST API.
- **Size**: landscape **1216×640** (an allowed FLUX custom size, ≈ the 1200×630 OG ratio).
- **Output**: JPEG, saved to `public/covers/<translationKey>.jpg`.
- **Generator**: `src/scripts/generate-cover.mjs` (still the executable source of
  truth for this legacy style). `sharp` is a devDependency only and never enters
  the production runtime bundle.

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
