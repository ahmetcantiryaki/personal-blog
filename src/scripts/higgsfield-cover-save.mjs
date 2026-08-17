/**
 * Download a Higgsfield generation result and write it as a cover JPEG.
 *
 *   node src/scripts/higgsfield-cover-save.mjs <url> <translationKey>
 *
 * Higgsfield returns PNGs around 1.4 MB; covers are served as JPEG and the rest
 * of the catalogue sits in the 100-600 KB band, so the PNG is re-encoded rather
 * than renamed. Output is `public/covers/<translationKey>.jpg`, shared by both
 * locales — see docs/COVER_ART.md.
 */
import { writeFile } from 'fs/promises'
import path from 'path'

import sharp from 'sharp'

const [url, key] = process.argv.slice(2)

if (!url || !key) {
  console.error('usage: higgsfield-cover-save.mjs <url> <translationKey>')
  process.exit(1)
}

const res = await fetch(url)
if (!res.ok) {
  console.error(`download failed ${res.status} for ${key}`)
  process.exit(1)
}

const png = Buffer.from(await res.arrayBuffer())
const jpg = await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toBuffer()

await writeFile(path.resolve(`public/covers/${key}.jpg`), jpg)

const { width, height } = await sharp(jpg).metadata()
console.log(`${key}.jpg  ${Math.round(jpg.length / 1024)} KB  ${width}x${height}`)
