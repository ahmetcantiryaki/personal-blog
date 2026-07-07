import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
// src/seed -> project root -> public/covers
const coversDir = path.resolve(dirname, '../../public/covers')

/**
 * Resolve the public path of a generated cover image for a translationKey, or
 * `undefined` when none exists on disk. Non-localized: both locales share it.
 * When absent, posts fall back to the deterministic SVG cover art.
 */
export const coverImageForKey = (translationKey: string): string | undefined => {
  const file = path.join(coversDir, `${translationKey}.jpg`)
  return existsSync(file) ? `/covers/${translationKey}.jpg` : undefined
}
