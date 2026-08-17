import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
// src/seed -> project root -> public/covers
const coversDir = path.resolve(dirname, '../../public/covers')

/**
 * Resolve the public path of a post's cover image, in priority order:
 *
 * 1. `public/covers/<translationKey>.jpg` — a bespoke cover drawn for this one
 *    article, with its own metaphor and handwritten hook.
 * 2. `public/covers/categories/<categoryKey>.jpg` — the category cover. Every
 *    category has one, so any new article gets a real illustration without an
 *    image being generated for it. Each category has its own scene and colour
 *    wash, so sections stay distinguishable at a glance.
 * 3. `undefined` — the deterministic SVG cover art renders instead.
 *
 * Both locales share the file: category covers carry no text, so nothing in
 * them is language-specific.
 */
export const coverImageForKey = (
  translationKey: string,
  categoryKey?: string,
): string | undefined => {
  if (existsSync(path.join(coversDir, `${translationKey}.jpg`))) {
    return `/covers/${translationKey}.jpg`
  }

  if (categoryKey && existsSync(path.join(coversDir, 'categories', `${categoryKey}.jpg`))) {
    return `/covers/categories/${categoryKey}.jpg`
  }

  return undefined
}
