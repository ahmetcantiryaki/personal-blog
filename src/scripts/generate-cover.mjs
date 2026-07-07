// @ts-nocheck
/**
 * generate-cover.mjs — AI cover-image generator for Woyable posts.
 *
 * Bold-composite pipeline (default): a FLUX.1 [schnell] background in the site
 * palette (warm stone + per-category accent, energetic composition) with 1-3
 * OFFICIAL brand logos composited crisply on soft plates via sharp. Logos are
 * never distorted (editorial/nominative use); the model never draws logos or
 * text itself, so brand marks stay pixel-accurate.
 *
 * The visual identity (base system prompts + category accents + logo rules)
 * is documented verbatim in docs/COVER_ART.md — keep the two in sync.
 *
 * Usage:
 *   node src/scripts/generate-cover.mjs \
 *     --key build-rag-system \
 *     --category ai \
 *     --subject "oversized document planes sweeping toward a bright focal core" \
 *     --logos postgresql,python \
 *     [--style bold|calm]        (default bold)
 *
 * Logo sources, in priority order:
 *   1. assets/brand-logos/<slug>.svg — curated official press-kit SVGs (repo)
 *   2. https://cdn.simpleicons.org/<slug> — official brand path data fallback
 *
 * FAL_KEY is read from .env (gitignored). Never printed or committed.
 * sharp is a devDependency only — this script never runs in the prod bundle.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')

const QUEUE_URL = 'https://queue.fal.run/fal-ai/flux/schnell'
const WIDTH = 1216
const HEIGHT = 640

/**
 * Per-category accent, derived from the five existing SVG cover palettes
 * (src/components/blog/cover-palettes.ts) so AI covers and SVG fallbacks read as
 * one family. Each accent is the mid-tone hue of that palette's primary blob.
 */
const CATEGORY_ACCENT = {
  ai: { palette: 'aurora', hue: 'dusty teal', hex: '#2f7d78' },
  'web-development': { palette: 'ocean', hue: 'slate blue', hex: '#37609a' },
  'software-engineering': { palette: 'meadow', hue: 'muted sage green', hex: '#3f7d47' },
  'devops-cloud': { palette: 'ember', hue: 'warm amber / terracotta', hex: '#9a6237' },
  'career-productivity': { palette: 'dusk', hue: 'muted plum / mauve', hex: '#7d4a6c' },
}

const SHARED_EXCLUSIONS =
  'Absolutely no text, no letters, no words, no numbers, no logos, no watermark, no signature; ' +
  'no people, no faces, no hands, no bodies; no glossy 3D render, no photorealism, ' +
  'no stock photo, no neon, no cyberpunk, no purple-and-blue tech gradient, no busy collage.'

/** BOLD base system prompt (default) — energetic, still palette-disciplined. */
const buildBoldPrompt = (accent, subject) =>
  [
    'Bold dynamic abstract editorial tech banner, energetic diagonal composition.',
    'Large sweeping geometric shapes, oversized curved forms and angular translucent planes',
    'cutting across the frame with strong contrast, depth and confident motion,',
    'on a warm off-white stone background (#fdfcf9).',
    `Dominant accent colour: ${accent.hue} (${accent.hex}), in rich layered washes,`,
    'balanced with warm neutral greys and deep warm-charcoal shadow shapes.',
    'Dramatic scale contrast, focal energy concentrated on the left two-thirds of the frame,',
    'right third visually quieter. Subtle fine-grain texture, matte finish,',
    'flat 2D fine-art print aesthetic, wide landscape banner.',
    `Subject motif: ${subject}.`,
    SHARED_EXCLUSIONS,
  ].join(' ')

/** CALM base system prompt (alternative style, the original identity). */
const buildCalmPrompt = (accent, subject) =>
  [
    'Abstract editorial cover illustration, minimalist fine-art poster.',
    'Soft overlapping translucent gradient fields and layered organic-geometric shapes',
    'on a warm off-white stone background (#fdfcf9).',
    'Muted, desaturated palette of warm neutral greys with a single restrained accent colour:',
    `${accent.hue} (${accent.hex}).`,
    'Calm, quiet, sophisticated editorial mood. Generous negative space,',
    'gentle soft-focus gradients, subtle fine-grain paper texture, delicate thin linework.',
    'Matte finish, flat 2D risograph / fine-art print aesthetic, soft diffused lighting,',
    'balanced asymmetric composition, wide landscape banner.',
    `Subject motif: ${subject}.`,
    SHARED_EXCLUSIONS,
    'Understated, tasteful, museum-poster restraint.',
  ].join(' ')

/** Parse `--flag value` pairs into an object. */
const parseArgs = (argv) => {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token.startsWith('--')) {
      const key = token.slice(2)
      const next = argv[i + 1]
      if (next === undefined || next.startsWith('--')) {
        args[key] = true
      } else {
        args[key] = next
        i += 1
      }
    }
  }
  return args
}

/** Minimal .env reader — returns a key/value map. No external deps. */
const readEnv = async () => {
  const envPath = path.join(projectRoot, '.env')
  const raw = await readFile(envPath, 'utf8')
  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

/** Deterministic 32-bit FNV-1a hash → non-negative int seed (stable re-runs). */
const seedFromKey = (key) => {
  let hash = 0x811c9dc5
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0) % 2_147_483_647
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Generate the FLUX schnell background and return its JPEG bytes. */
const generateBackground = async (falKey, prompt, seed) => {
  const authHeaders = { Authorization: `Key ${falKey}` }

  const submitRes = await fetch(QUEUE_URL, {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      image_size: { width: WIDTH, height: HEIGHT },
      num_images: 1,
      num_inference_steps: 4,
      output_format: 'jpeg',
      enable_safety_checker: true,
      seed,
    }),
  })
  if (!submitRes.ok) {
    throw new Error(`Submit failed: ${submitRes.status} ${await submitRes.text()}`)
  }
  const submitJson = await submitRes.json()
  const { status_url: statusUrl, response_url: responseUrl } = submitJson
  if (!statusUrl || !responseUrl) {
    throw new Error(`Unexpected submit response: ${JSON.stringify(submitJson)}`)
  }

  const deadline = Date.now() + 120_000
  let status = 'IN_QUEUE'
  while (Date.now() < deadline) {
    const statusRes = await fetch(statusUrl, { headers: authHeaders })
    if (!statusRes.ok) throw new Error(`Status poll failed: ${statusRes.status}`)
    const statusJson = await statusRes.json()
    status = statusJson.status
    if (status === 'COMPLETED') break
    if (status === 'FAILED' || status === 'ERROR') {
      throw new Error(`Generation failed: ${JSON.stringify(statusJson)}`)
    }
    await sleep(1500)
  }
  if (status !== 'COMPLETED') throw new Error('Timed out waiting for generation')

  const resultRes = await fetch(responseUrl, { headers: authHeaders })
  if (!resultRes.ok) throw new Error(`Result fetch failed: ${resultRes.status}`)
  const result = await resultRes.json()
  const image = result.images && result.images[0]
  if (!image || !image.url) throw new Error(`No image in result: ${JSON.stringify(result)}`)

  const imgRes = await fetch(image.url)
  if (!imgRes.ok) throw new Error(`Image download failed: ${imgRes.status}`)
  return Buffer.from(await imgRes.arrayBuffer())
}

/**
 * Resolve a logo SVG: curated official press-kit file in assets/brand-logos/
 * first, simple-icons CDN (official brand path data + brand colour) as
 * fallback. Returns null (with a warning) when the slug resolves nowhere, so a
 * missing mark degrades to fewer logos instead of failing the whole cover.
 */
const fetchLogoSvg = async (slug) => {
  const localPath = path.join(projectRoot, 'assets', 'brand-logos', `${slug}.svg`)
  if (existsSync(localPath)) {
    console.log(`  logo "${slug}": using curated official SVG (assets/brand-logos)`)
    return readFile(localPath)
  }
  const url = `https://cdn.simpleicons.org/${encodeURIComponent(slug)}`
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`  logo "${slug}": SKIPPED — not local and CDN returned ${res.status}`)
    return null
  }
  console.log(`  logo "${slug}": fetched from simple-icons CDN`)
  return Buffer.from(await res.arrayBuffer())
}

/**
 * Fixed, composed layouts (canvas 1216x640). The bold background keeps its
 * right third quieter, so plates sit there on a gentle diagonal — prominent
 * but composed, never clipart-slapped.
 */
const LOGO_LAYOUTS = {
  1: { plate: 208, centers: [[924, 320]] },
  2: { plate: 176, centers: [[880, 232], [1042, 420]] },
  3: { plate: 150, centers: [[822, 184], [968, 320], [1108, 456]] },
}

/** Soft warm-stone plate with a subtle drop shadow, as an SVG buffer. */
const plateSvg = (size) => {
  const margin = 40 // room for the shadow blur
  const total = size + margin * 2
  const radius = Math.round(size * 0.17)
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}">
      <defs>
        <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="7" stdDeviation="11" flood-color="#3a3128" flood-opacity="0.30"/>
        </filter>
      </defs>
      <rect x="${margin}" y="${margin}" width="${size}" height="${size}" rx="${radius}"
        fill="#fdfcf9" fill-opacity="0.97" stroke="#3a3128" stroke-opacity="0.08"
        stroke-width="1.5" filter="url(#shadow)"/>
    </svg>`,
  )
}

/** Composite 1-3 logos (on plates) onto the background; returns JPEG bytes. */
const compositeLogos = async (backgroundJpeg, logoSvgs) => {
  const layout = LOGO_LAYOUTS[logoSvgs.length]
  if (!layout) throw new Error(`Supported logo counts: 1-3 (got ${logoSvgs.length})`)

  const plateMargin = 40
  const iconSize = Math.round(layout.plate * 0.58)

  const overlays = []
  for (let i = 0; i < logoSvgs.length; i += 1) {
    const [cx, cy] = layout.centers[i]

    const platePng = await sharp(plateSvg(layout.plate)).png().toBuffer()
    overlays.push({
      input: platePng,
      left: Math.round(cx - layout.plate / 2 - plateMargin),
      top: Math.round(cy - layout.plate / 2 - plateMargin),
    })

    // High density so the 24x24-viewBox brand SVG rasterizes crisply. Never
    // stretched or recoloured — fit:contain preserves the mark's proportions.
    const iconPng = await sharp(logoSvgs[i], { density: 300 })
      .resize(iconSize, iconSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
    overlays.push({
      input: iconPng,
      left: Math.round(cx - iconSize / 2),
      top: Math.round(cy - iconSize / 2),
    })
  }

  return sharp(backgroundJpeg)
    .composite(overlays)
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer()
}

const main = async () => {
  const args = parseArgs(process.argv.slice(2))
  const key = typeof args.key === 'string' ? args.key.trim() : ''
  const category = typeof args.category === 'string' ? args.category.trim() : ''
  const subject = typeof args.subject === 'string' ? args.subject.trim() : ''
  const style = typeof args.style === 'string' ? args.style.trim() : 'bold'
  const logoSlugs =
    typeof args.logos === 'string'
      ? args.logos.split(',').map((s) => s.trim()).filter(Boolean)
      : []

  if (!key || !category || !subject) {
    throw new Error(
      'Usage: --key <translationKey> --category <cat> --subject "<motif>" [--logos a,b] [--style bold|calm]',
    )
  }
  const accent = CATEGORY_ACCENT[category]
  if (!accent) {
    throw new Error(
      `Unknown category "${category}". Expected one of: ${Object.keys(CATEGORY_ACCENT).join(', ')}`,
    )
  }
  if (style !== 'bold' && style !== 'calm') {
    throw new Error(`Unknown style "${style}". Expected "bold" or "calm".`)
  }
  if (logoSlugs.length > 3) throw new Error('At most 3 logos per cover.')

  const env = await readEnv()
  const falKey = env.FAL_KEY || process.env.FAL_KEY
  if (!falKey) throw new Error('FAL_KEY not found in .env')

  const prompt =
    style === 'bold' ? buildBoldPrompt(accent, subject) : buildCalmPrompt(accent, subject)
  const seed = seedFromKey(key)

  console.log(
    `Generating ${style} cover for "${key}" (category=${category}, accent=${accent.hex}, seed=${seed}, logos=[${logoSlugs.join(', ')}])`,
  )

  const background = await generateBackground(falKey, prompt, seed)

  let finalBytes = background
  if (logoSlugs.length > 0) {
    const logoSvgs = []
    for (const slug of logoSlugs) {
      const svg = await fetchLogoSvg(slug)
      if (svg) logoSvgs.push(svg)
    }
    if (logoSvgs.length > 0) finalBytes = await compositeLogos(background, logoSvgs)
  }

  const outDir = path.join(projectRoot, 'public', 'covers')
  await mkdir(outDir, { recursive: true })
  const outPath = path.join(outDir, `${key}.jpg`)
  await writeFile(outPath, finalBytes)

  const meta = await sharp(finalBytes).metadata()
  console.log(
    `Saved ${outPath} (${(finalBytes.length / 1024).toFixed(1)} KB, ${meta.width}x${meta.height}, jpeg)`,
  )
}

main().catch((error) => {
  console.error('generate-cover failed:', error.message)
  process.exit(1)
})
