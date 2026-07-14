#!/usr/bin/env node
/**
 * Woyable TTS pipeline — generates per-article MP3 narration with Piper
 * (fully open-source, runs on CPU) and publishes it to a GitHub Release,
 * recording url + content hash in seed/content/audio-manifest.json so an
 * article is only ever re-synthesized when its readable text changes.
 *
 * Usage:
 *   node src/scripts/generate-audio.mjs --all            # every md pair
 *   node src/scripts/generate-audio.mjs --slug <slug> --locale tr
 *   node src/scripts/generate-audio.mjs --all --dry-run  # extract + hash only
 *   node src/scripts/generate-audio.mjs --all --no-upload
 *
 * Env (defaults suit the local Windows setup; the GitHub Action overrides):
 *   PIPER_EXE   piper binary            (default C:\Users\Ahmet\.piper\piper\piper.exe, or `piper` on PATH)
 *   VOICES_DIR  onnx voice models dir   (default C:\Users\Ahmet\.piper\voices)
 *   AUDIO_REPO  owner/repo for release  (default ahmetcantiryaki/personal-blog)
 *   AUDIO_TAG   release tag             (default audio-library)
 */
import { createHash } from 'node:crypto'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '../..')
const CONTENT = join(ROOT, 'seed', 'content')
const MANIFEST_PATH = join(CONTENT, 'audio-manifest.json')

const VOICES = {
  tr: process.env.VOICE_TR || 'tr_TR-fahrettin-medium',
  en: process.env.VOICE_EN || 'en_US-ryan-high',
}

// Which locales get narration. Turkish is parked until a voice the team likes
// exists — flip AUDIO_LOCALES=tr,en to enable it (voices stay wired above).
const ENABLED_LOCALES = (process.env.AUDIO_LOCALES || 'en').split(',')
const PIPER_EXE =
  process.env.PIPER_EXE ||
  (process.platform === 'win32' ? 'C:/Users/Ahmet/.piper/piper/piper.exe' : 'piper')
const VOICES_DIR = process.env.VOICES_DIR || 'C:/Users/Ahmet/.piper/voices'
const AUDIO_REPO = process.env.AUDIO_REPO || 'ahmetcantiryaki/personal-blog'
const AUDIO_TAG = process.env.AUDIO_TAG || 'audio-library'

const args = process.argv.slice(2)
const has = (f) => args.includes(f)
const val = (f) => {
  const i = args.indexOf(f)
  return i >= 0 ? args[i + 1] : undefined
}

const PLACEHOLDERS = {
  code: {
    tr: 'Kod örneği makalede yer alıyor.',
    en: 'A code example is available in the article.',
  },
  table: {
    tr: 'Karşılaştırma tablosu makalede yer alıyor.',
    en: 'A comparison table is available in the article.',
  },
}

/**
 * Markdown → speech text. Mirrors src/lib/lexical-speech.ts rules at the
 * markdown-source level: code fences and tables become a single locale
 * placeholder sentence, markdown syntax is stripped, headings end with a
 * period so the voice pauses.
 */
export function markdownToSpeech(md, locale) {
  const normalized = md.replace(/\r\n/g, '\n')
  const fmMatch = normalized.match(/^---\n([\s\S]*?)\n---\n/)
  let title = ''
  let body = normalized
  if (fmMatch) {
    body = normalized.slice(fmMatch[0].length)
    const t = fmMatch[1].match(/^title:\s*["']?(.+?)["']?\s*$/m)
    if (t) title = t[1]
  }

  const out = []
  if (title) out.push(endWithPeriod(title))

  const lines = body.split('\n')
  let inFence = false
  let lastPlaceholder = null

  for (let raw of lines) {
    const line = raw.trimEnd()
    if (/^```/.test(line.trim())) {
      if (!inFence) {
        inFence = true
        if (lastPlaceholder !== 'code') {
          out.push(PLACEHOLDERS.code[locale])
          lastPlaceholder = 'code'
        }
      } else {
        inFence = false
      }
      continue
    }
    if (inFence) continue

    const trimmed = line.trim()
    if (!trimmed) continue

    // Table rows (| a | b |) and separator rows collapse into one placeholder.
    if (/^\|.*\|$/.test(trimmed)) {
      if (lastPlaceholder !== 'table') {
        out.push(PLACEHOLDERS.table[locale])
        lastPlaceholder = 'table'
      }
      continue
    }

    let text = trimmed
      .replace(/^#{1,6}\s+/, '') // heading marker
      .replace(/^>\s?/, '') // blockquote
      .replace(/^[-*+]\s+/, '') // list bullet
      .replace(/^\d+\.\s+/, '') // ordered list
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → text
      .replace(/`([^`]+)`/g, '$1') // inline code → text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
    if (!text) continue

    const isHeading = /^#{1,6}\s+/.test(trimmed)
    out.push(isHeading ? endWithPeriod(text) : text)
    lastPlaceholder = null
  }

  return out.join('\n').trim()
}

function endWithPeriod(s) {
  return /[.!?…:]$/.test(s) ? s : `${s}.`
}

function sha256(s) {
  return createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 16)
}

function loadManifest() {
  try {
    return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
  } catch {
    return {}
  }
}

function synthesize(text, locale, outMp3) {
  const voice = VOICES[locale]
  const model = join(VOICES_DIR, `${voice}.onnx`)
  const wav = join(tmpdir(), `woyable-${sha256(text)}.wav`)

  const piper = spawnSync(PIPER_EXE, ['-m', model, '-f', wav, '--sentence_silence', '0.45'], {
    input: text,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
  if (piper.status !== 0) {
    throw new Error(`piper failed (${piper.status}): ${piper.stderr?.slice(0, 500)}`)
  }

  execFileSync('ffmpeg', [
    '-y',
    '-i',
    wav,
    '-ac',
    '1',
    '-ar',
    '22050',
    '-b:a',
    '64k',
    '-loglevel',
    'error',
    outMp3,
  ])

  const seconds = Number(
    execFileSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', outMp3],
      { encoding: 'utf8' },
    ).trim(),
  )
  return { seconds: Math.round(seconds), voice }
}

function upload(file, assetName) {
  execFileSync(
    'gh',
    ['release', 'upload', AUDIO_TAG, `${file}#${assetName}`, '--clobber', '-R', AUDIO_REPO],
    { stdio: 'inherit' },
  )
  return `https://github.com/${AUDIO_REPO}/releases/download/${AUDIO_TAG}/${assetName}`
}

function collectTargets() {
  const targets = []
  for (const locale of ENABLED_LOCALES) {
    if (val('--locale') && val('--locale') !== locale) continue
    const dir = join(CONTENT, locale)
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const slug = f.replace(/\.md$/, '')
      if (val('--slug') && val('--slug') !== slug) continue
      targets.push({ locale, slug, path: join(dir, f) })
    }
  }
  // --shard i/N: deterministic split for parallel CI backfill jobs.
  const shard = val('--shard')
  if (shard) {
    const [i, n] = shard.split('/').map(Number)
    return targets.filter((_, idx) => idx % n === i)
  }
  return targets
}

async function main() {
  if (!has('--all') && !val('--slug')) {
    console.log('Pass --all or --slug <slug> (optionally --locale tr|en)')
    process.exit(1)
  }

  const manifest = loadManifest()
  // In sharded CI runs each job writes its new entries to a fragment file
  // (MANIFEST_FRAGMENT) so parallel jobs never race on the main manifest;
  // a merge job combines fragments and commits once.
  const fragmentPath = process.env.MANIFEST_FRAGMENT
  const fragment = {}
  const outDir = join(tmpdir(), 'woyable-audio')
  mkdirSync(outDir, { recursive: true })

  const targets = collectTargets()
  let made = 0
  let skipped = 0
  let failed = 0

  for (const { locale, slug, path } of targets) {
    const key = `${locale}/${slug}`
    const text = markdownToSpeech(readFileSync(path, 'utf8'), locale)
    if (text.length < 200) {
      console.log(`SKIP ${key} (too short: ${text.length} chars)`)
      continue
    }
    const hash = sha256(`${VOICES[locale]}|${text}`)
    if (manifest[key]?.hash === hash && !has('--force')) {
      skipped++
      continue
    }
    if (has('--dry-run')) {
      console.log(`DRY ${key} ${text.length} chars hash=${hash}`)
      continue
    }
    try {
      const assetName = `${locale}-${slug}.mp3`
      const mp3 = join(outDir, assetName)
      const t0 = Date.now()
      const { seconds, voice } = synthesize(text, locale, mp3)
      const url = has('--no-upload') ? manifest[key]?.url || '' : upload(mp3, assetName)
      const entry = {
        hash,
        url,
        seconds,
        voice,
        bytes: statSync(mp3).size,
        generatedAt: new Date().toISOString(),
      }
      manifest[key] = entry
      if (fragmentPath) {
        fragment[key] = entry
        writeFileSync(fragmentPath, `${JSON.stringify(fragment, null, 2)}\n`)
      } else {
        writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
      }
      made++
      console.log(`OK   ${key} ${seconds}s in ${Math.round((Date.now() - t0) / 1000)}s`)
    } catch (err) {
      failed++
      console.error(`FAIL ${key}: ${err.message}`)
    }
  }

  console.log(`\nDone: ${made} generated, ${skipped} up-to-date, ${failed} failed`)
  if (failed > 0) process.exit(2)
}

const isDirectRun =
  process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())
if (isDirectRun) {
  main()
}
