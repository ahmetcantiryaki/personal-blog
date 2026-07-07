// @ts-nocheck
/**
 * generate-kapak-batch.mjs — hand-drawn vintage cover generator for Woyable.
 *
 * OFFICIAL cover direction (2026-07): hand-drawn vintage illustration
 * (ink + watercolor, crosshatch) on the LEFT half + a handwritten Turkish hook
 * with a wobbly arrow on the RIGHT half. Full art direction lives verbatim in
 * kapak-promptlari.md (66 ready prompts) and is documented in docs/COVER_ART.md.
 *
 * Model: fal.ai `fal-ai/nano-banana` (Gemini Flash Image), aspect_ratio 16:9,
 * a NEW random seed per image, JPEG out. ~$0.0398 / image.
 *
 * Each entry's Turkish title is matched to a post translationKey via
 * seed/content/link-map.json (exact TR-title match).
 *
 * ── Batch mode (default): produce all 66 chosen covers into public/covers/ ──
 *   node src/scripts/generate-kapak-batch.mjs
 *     • Rows the user already generated in local-studio-output/kapak/ are REUSED:
 *       the FIRST attempt (a1) is copied to public/covers/<key>.jpg — never regen.
 *     • The rest are generated ONCE (accept first output; no quality-based
 *       regeneration). A hard API/network failure is retried at most once.
 *     • Concurrency is capped at 3.
 *   Flags: --dry-run (print mapping only, no API calls, no writes)
 *          --force-regen (ignore studio reuse; regenerate every row)
 *
 * ── Single mode (daily routine): one cover from a caller-supplied prompt ──
 *   node src/scripts/generate-kapak-batch.mjs --single <translationKey> --prompt-file <path>
 *   node src/scripts/generate-kapak-batch.mjs --single <translationKey> --prompt "<text>"
 *   echo "<prompt>" | node src/scripts/generate-kapak-batch.mjs --single <translationKey>
 *   (If no prompt is supplied, the prompt is looked up from kapak-promptlari.md
 *    by matching the key — only works for the original 66.)
 *
 * FAL_KEY is read from .env (gitignored). Never printed or committed.
 */

import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')

const kapakMd = path.join(projectRoot, 'kapak-promptlari.md')
const linkMapPath = path.join(projectRoot, 'seed', 'content', 'link-map.json')
const studioKapakDir = path.join(projectRoot, 'local-studio-output', 'kapak')
const coversDir = path.join(projectRoot, 'public', 'covers')

const MODEL = 'fal-ai/nano-banana'
const ASPECT_RATIO = '16:9'
const USD_PER_IMAGE = 0.0398
const CONCURRENCY = 3

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// --- .env (FAL_KEY) ----------------------------------------------------------
const readEnv = async () => {
  const raw = await readFile(path.join(projectRoot, '.env'), 'utf8')
  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    let v = t.slice(i + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    env[t.slice(0, i).trim()] = v
  }
  return env
}

// --- Turkish → ascii slug (mirrors falai-studio.mjs so filenames line up) ----
const TR_MAP = {
  ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
  Ç: 'c', Ğ: 'g', İ: 'i', I: 'i', Ö: 'o', Ş: 's', Ü: 'u',
}
const slugify = (s) =>
  s
    .replace(/[çğıöşüÇĞİIÖŞÜ]/g, (m) => TR_MAP[m])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// --- kapak-promptlari.md parser (num, nn, title, slug, prompt) ---------------
const parseKapak = async () => {
  const raw = await readFile(kapakMd, 'utf8')
  const lines = raw.split(/\r?\n/)
  const entries = []
  let entry = null
  let inCode = false
  let code = []

  for (const line of lines) {
    const em = line.match(/^###\s+(\d+)\.\s+(.+?)\s*$/)
    if (em) {
      entry = {
        num: Number(em[1]),
        nn: String(em[1]).padStart(2, '0'),
        title: em[2].trim(),
        slug: slugify(em[2].trim()),
        prompt: '',
      }
      entries.push(entry)
      inCode = false
      code = []
      continue
    }
    if (line.trim() === '```') {
      if (!inCode) {
        inCode = true
        code = []
      } else {
        inCode = false
        if (entry) entry.prompt = code.join('\n').trim()
      }
      continue
    }
    if (inCode) code.push(line)
  }
  return entries.filter((e) => e.prompt)
}

// --- title → translationKey map (exact TR title) -----------------------------
const buildKeyMap = async () => {
  const linkMap = JSON.parse(await readFile(linkMapPath, 'utf8'))
  const byTitle = new Map()
  for (const post of linkMap.posts) {
    byTitle.set(post.tr.title.trim(), {
      key: post.translationKey,
      category: post.category,
    })
  }
  return byTitle
}

// --- first (a1) studio attempt for a kapak row, if any -----------------------
const firstStudioAttempt = async (nn, slug) => {
  let files = []
  try {
    files = await readdir(studioKapakDir)
  } catch {
    return null
  }
  const esc = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp('^' + nn + '-' + esc + '-a(\\d+)\\.jpg$')
  const attempts = files
    .map((f) => {
      const m = f.match(re)
      return m ? { file: f, a: Number(m[1]) } : null
    })
    .filter(Boolean)
    .sort((x, y) => x.a - y.a)
  return attempts.length ? attempts[0].file : null // FIRST attempt
}

// --- one nano-banana generation (returns JPEG bytes + meta) ------------------
const generateImage = async (falKey, prompt) => {
  const auth = { Authorization: `Key ${falKey}` }
  const seed = Math.floor(Math.random() * 2_147_483_647) // new random seed each call
  const input = {
    prompt,
    num_images: 1,
    output_format: 'jpeg',
    aspect_ratio: ASPECT_RATIO,
    seed,
  }

  const submit = await fetch(`https://queue.fal.run/${MODEL}`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!submit.ok) throw new Error(`fal.ai submit ${submit.status}: ${await submit.text()}`)
  const { status_url, response_url } = await submit.json()

  const deadline = Date.now() + 300_000
  let done = false
  while (Date.now() < deadline) {
    const st = await (await fetch(status_url, { headers: auth })).json()
    if (st.status === 'COMPLETED') {
      done = true
      break
    }
    if (st.status === 'FAILED' || st.status === 'ERROR') {
      throw new Error(`generation failed: ${JSON.stringify(st)}`)
    }
    await sleep(1200)
  }
  if (!done) throw new Error('timed out waiting for generation')

  const result = await (await fetch(response_url, { headers: auth })).json()
  const image = result.images && result.images[0]
  if (!image || !image.url) throw new Error('no image in result')
  const bytes = Buffer.from(await (await fetch(image.url)).arrayBuffer())
  return { bytes, width: image.width || null, height: image.height || null, seed }
}

// --- generate once, with a single retry on HARD failure only -----------------
const generateWithRetry = async (falKey, prompt, label) => {
  try {
    return await generateImage(falKey, prompt)
  } catch (err) {
    console.warn(`  [${label}] first attempt failed (${err.message}); retrying once…`)
    await sleep(1500)
    return generateImage(falKey, prompt) // one retry; throws on second failure
  }
}

// --- simple concurrency pool -------------------------------------------------
const runPool = async (items, limit, worker) => {
  const results = []
  let cursor = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const idx = cursor
      cursor += 1
      results[idx] = await worker(items[idx], idx)
    }
  })
  await Promise.all(runners)
  return results
}

const parseArgs = (argv) => {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token.startsWith('--')) {
      const key = token.slice(2)
      const next = argv[i + 1]
      if (next === undefined || next.startsWith('--')) args[key] = true
      else {
        args[key] = next
        i += 1
      }
    }
  }
  return args
}

const readStdin = async () => {
  if (process.stdin.isTTY) return ''
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8').trim()
}

// ---------------------------------------------------------------------------
const runSingle = async (args) => {
  const key = typeof args.single === 'string' ? args.single.trim() : ''
  if (!key) throw new Error('--single requires a <translationKey>')

  let prompt = ''
  if (typeof args['prompt-file'] === 'string') {
    prompt = (await readFile(path.resolve(args['prompt-file']), 'utf8')).trim()
  } else if (typeof args.prompt === 'string') {
    prompt = args.prompt.trim()
  } else {
    prompt = await readStdin()
  }
  if (!prompt) {
    // fall back to the matching kapak-promptlari.md entry (original 66 only)
    const [entries, keyMap] = [await parseKapak(), await buildKeyMap()]
    const match = entries.find((e) => (keyMap.get(e.title) || {}).key === key)
    if (match) prompt = match.prompt
  }
  if (!prompt) {
    throw new Error(
      `No prompt supplied for "${key}". Pass --prompt-file <path>, --prompt "<text>", or pipe via stdin.`,
    )
  }

  const falKey = (await readEnv()).FAL_KEY || process.env.FAL_KEY
  if (!falKey) throw new Error('FAL_KEY not found in .env')

  await mkdir(coversDir, { recursive: true })
  console.log(`Generating single cover "${key}" via ${MODEL} (${ASPECT_RATIO})…`)
  const { bytes, width, height, seed } = await generateWithRetry(falKey, prompt, key)
  const outPath = path.join(coversDir, `${key}.jpg`)
  await writeFile(outPath, bytes)
  console.log(
    `Saved ${outPath} (${(bytes.length / 1024).toFixed(1)} KB, ${width || '?'}x${height || '?'}, seed=${seed})`,
  )
  console.log(`Cost: ~$${USD_PER_IMAGE.toFixed(4)}`)
}

const runBatch = async (args) => {
  const dryRun = Boolean(args['dry-run'])
  const forceRegen = Boolean(args['force-regen'])

  const [entries, keyMap] = [await parseKapak(), await buildKeyMap()]

  // Resolve each entry → translationKey, and decide reuse vs generate.
  const rows = []
  const unmatched = []
  for (const e of entries) {
    const mapped = keyMap.get(e.title)
    if (!mapped) {
      unmatched.push(e.title)
      continue
    }
    const studioFile = forceRegen ? null : await firstStudioAttempt(e.nn, e.slug)
    rows.push({ ...e, key: mapped.key, category: mapped.category, studioFile })
  }

  console.log(`Parsed ${entries.length} prompts; matched ${rows.length}; unmatched ${unmatched.length}.`)
  if (unmatched.length) {
    console.log('UNMATCHED (need fuzzy matching):')
    for (const t of unmatched) console.log(`  - ${t}`)
  }

  const reuse = rows.filter((r) => r.studioFile)
  const gen = rows.filter((r) => !r.studioFile)
  console.log(`Reuse (a1 studio): ${reuse.length}`)
  console.log(`Generate (nano-banana): ${gen.length}`)
  console.log(`Estimated cost: ~$${(gen.length * USD_PER_IMAGE).toFixed(4)}`)

  if (dryRun) {
    console.log('\n--- MAPPING (dry run) ---')
    for (const r of rows) {
      console.log(`  #${r.nn} ${r.key.padEnd(36)} ${r.studioFile ? 'REUSE ' + r.studioFile : 'GENERATE'}`)
    }
    return
  }

  const falKey = (await readEnv()).FAL_KEY || process.env.FAL_KEY
  if (!falKey && gen.length) throw new Error('FAL_KEY not found in .env')

  await mkdir(coversDir, { recursive: true })

  // Copy reused a1 studio images.
  for (const r of reuse) {
    const src = path.join(studioKapakDir, r.studioFile)
    const dest = path.join(coversDir, `${r.key}.jpg`)
    await copyFile(src, dest)
    console.log(`REUSE  ${r.key} ← ${r.studioFile}`)
  }

  // Generate the rest, ≤3 concurrent, once each (retry only on hard failure).
  const failures = []
  let retries = 0
  await runPool(gen, CONCURRENCY, async (r) => {
    try {
      let usedRetry = false
      const attempt = async () => {
        try {
          return await generateImage(falKey, r.prompt)
        } catch (err) {
          usedRetry = true
          console.warn(`  [${r.key}] first attempt failed (${err.message}); retrying once…`)
          await sleep(1500)
          return generateImage(falKey, r.prompt)
        }
      }
      const { bytes, width, height, seed } = await attempt()
      if (usedRetry) retries += 1
      const dest = path.join(coversDir, `${r.key}.jpg`)
      await writeFile(dest, bytes)
      console.log(
        `GEN    ${r.key} (${(bytes.length / 1024).toFixed(1)} KB, ${width || '?'}x${height || '?'}, seed=${seed})`,
      )
    } catch (err) {
      failures.push({ key: r.key, error: err.message })
      console.error(`FAIL   ${r.key}: ${err.message}`)
    }
  })

  const produced = gen.length - failures.length
  console.log('\n--- SUMMARY ---')
  console.log(`Reused (a1):      ${reuse.length}`)
  console.log(`Generated:        ${produced}`)
  console.log(`Hard-fail retries: ${retries}`)
  console.log(`Failures:         ${failures.length}`)
  if (failures.length) for (const f of failures) console.log(`  - ${f.key}: ${f.error}`)
  console.log(`Total in public/covers this run: ${reuse.length + produced} / ${rows.length}`)
  console.log(`Actual generation cost: ~$${(produced * USD_PER_IMAGE).toFixed(4)}`)
  if (failures.length) process.exitCode = 1
}

const main = async () => {
  const args = parseArgs(process.argv.slice(2))
  if (args.single) await runSingle(args)
  else await runBatch(args)
}

main().catch((error) => {
  console.error('generate-kapak-batch failed:', error.message)
  process.exit(1)
})
