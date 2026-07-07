// @ts-nocheck
/**
 * generate-covers-batch.mjs — run generate-cover.mjs for every entry in
 * cover-manifest.json, with modest concurrency (polite to the fal.ai queue).
 *
 * Usage:
 *   node src/scripts/generate-covers-batch.mjs [--skip-existing] [--concurrency 3]
 *
 * Exit code 0 only when every cover succeeded; failed keys are listed at the
 * end so a re-run (with --skip-existing) can pick up just the stragglers.
 */

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const generator = path.join(__dirname, 'generate-cover.mjs')

const args = process.argv.slice(2)
const skipExisting = args.includes('--skip-existing')
const concIdx = args.indexOf('--concurrency')
const concurrency = concIdx !== -1 ? Math.max(1, Number(args[concIdx + 1]) || 3) : 3

const manifest = JSON.parse(
  await readFile(path.join(__dirname, 'cover-manifest.json'), 'utf8'),
)

const queue = manifest.covers.filter((entry) => {
  if (!skipExisting) return true
  return !existsSync(path.join(projectRoot, 'public', 'covers', `${entry.key}.jpg`))
})

console.log(
  `batch: ${queue.length} cover(s) to generate (of ${manifest.covers.length} in manifest), concurrency=${concurrency}`,
)

const runOne = (entry) =>
  new Promise((resolve) => {
    const cliArgs = [
      generator,
      '--key', entry.key,
      '--category', entry.category,
      '--subject', entry.subject,
    ]
    if (entry.logos && entry.logos.length > 0) cliArgs.push('--logos', entry.logos.join(','))

    const child = spawn(process.execPath, cliArgs, { cwd: projectRoot })
    let out = ''
    child.stdout.on('data', (d) => { out += d })
    child.stderr.on('data', (d) => { out += d })
    child.on('close', (code) => {
      const status = code === 0 ? 'ok' : 'FAILED'
      console.log(`[${status}] ${entry.key}\n${out.trim().split('\n').map((l) => '    ' + l).join('\n')}`)
      resolve({ key: entry.key, ok: code === 0 })
    })
  })

const results = []
let cursor = 0
const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
  while (cursor < queue.length) {
    const entry = queue[cursor]
    cursor += 1
    results.push(await runOne(entry))
  }
})
await Promise.all(workers)

const failed = results.filter((r) => !r.ok).map((r) => r.key)
console.log(`\nbatch done: ${results.length - failed.length}/${results.length} succeeded`)
if (failed.length > 0) {
  console.log(`FAILED keys: ${failed.join(', ')}`)
  process.exit(1)
}
