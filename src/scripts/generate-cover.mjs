// @ts-nocheck
/**
 * generate-cover.mjs — AI cover-image generator for Woyable posts.
 *
 * Plain Node (no TS deps). Calls the fal.ai FLUX.1 [schnell] queue REST API and
 * saves a landscape 1216x640 JPEG to public/covers/<translationKey>.jpg.
 *
 * The visual identity (base system prompt + per-category accent) lives here and
 * is documented verbatim in docs/COVER_ART.md — keep the two in sync.
 *
 * Usage:
 *   node src/scripts/generate-cover.mjs \
 *     --key build-rag-system \
 *     --category ai \
 *     --subject "layered translucent document planes converging into one glowing node"
 *
 * FAL_KEY is read from .env (gitignored). Never printed or committed.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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

/** Reusable BASE SYSTEM PROMPT shared by every cover for one visual identity. */
const buildPrompt = (accent, subject) =>
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
    'Absolutely no text, no letters, no words, no numbers, no logos, no watermark, no signature;',
    'no people, no faces, no hands, no bodies; no glossy 3D render, no photorealism,',
    'no stock photo, no neon, no cyberpunk, no purple-and-blue tech gradient, no busy collage.',
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

const main = async () => {
  const args = parseArgs(process.argv.slice(2))
  const key = typeof args.key === 'string' ? args.key.trim() : ''
  const category = typeof args.category === 'string' ? args.category.trim() : ''
  const subject = typeof args.subject === 'string' ? args.subject.trim() : ''

  if (!key || !category || !subject) {
    throw new Error('Usage: --key <translationKey> --category <cat> --subject "<motif>"')
  }
  const accent = CATEGORY_ACCENT[category]
  if (!accent) {
    throw new Error(
      `Unknown category "${category}". Expected one of: ${Object.keys(CATEGORY_ACCENT).join(', ')}`,
    )
  }

  const env = await readEnv()
  const falKey = env.FAL_KEY || process.env.FAL_KEY
  if (!falKey) throw new Error('FAL_KEY not found in .env')

  const prompt = buildPrompt(accent, subject)
  const seed = seedFromKey(key)
  const authHeaders = { Authorization: `Key ${falKey}` }

  console.log(`Generating cover for "${key}" (category=${category}, accent=${accent.hex}, seed=${seed})`)

  // 1. Submit to the queue.
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
  const statusUrl = submitJson.status_url
  const responseUrl = submitJson.response_url
  if (!statusUrl || !responseUrl) {
    throw new Error(`Unexpected submit response: ${JSON.stringify(submitJson)}`)
  }

  // 2. Poll until COMPLETED (schnell is fast — usually a few seconds).
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

  // 3. Fetch the result and download the image.
  const resultRes = await fetch(responseUrl, { headers: authHeaders })
  if (!resultRes.ok) throw new Error(`Result fetch failed: ${resultRes.status}`)
  const result = await resultRes.json()
  const image = result.images && result.images[0]
  if (!image || !image.url) throw new Error(`No image in result: ${JSON.stringify(result)}`)

  const imgRes = await fetch(image.url)
  if (!imgRes.ok) throw new Error(`Image download failed: ${imgRes.status}`)
  const bytes = Buffer.from(await imgRes.arrayBuffer())

  const outDir = path.join(projectRoot, 'public', 'covers')
  await mkdir(outDir, { recursive: true })
  const outPath = path.join(outDir, `${key}.jpg`)
  await writeFile(outPath, bytes)

  console.log(
    `Saved ${outPath} (${(bytes.length / 1024).toFixed(1)} KB, ${image.width}x${image.height}, ${image.content_type})`,
  )
}

main().catch((error) => {
  console.error('generate-cover failed:', error.message)
  process.exit(1)
})
