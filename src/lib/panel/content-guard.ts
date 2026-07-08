import { z } from 'zod'

import { LOCALES } from '@/i18n/config'

/**
 * Pure, dependency-light validation for the markdown content editor. No
 * `server-only`, no fetch, no fs — so it is safely importable by the client
 * form and the server action, and unit-testable in isolation. The actual
 * GitHub/filesystem I/O lives in `content-source.ts`.
 */

/** A post slug is a lowercase kebab token — the on-disk filename stem. */
const SLUG_PATTERN = /^[a-z0-9-]+$/

/**
 * Reject anything that could escape the `seed/content/<locale>/` directory or
 * is not a plain slug. Guards both path traversal and unexpected filenames.
 */
export function isValidSlug(slug: unknown): slug is string {
  if (typeof slug !== 'string') return false
  if (slug.length === 0 || slug.length > 200) return false
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) return false
  return SLUG_PATTERN.test(slug)
}

/**
 * A source markdown file must keep its YAML front matter intact: it has to
 * start with a `---` fence and still declare `translationKey:` (the field the
 * seed pipeline joins tr/en documents on). Editing that away would orphan the
 * translation, so the write is refused.
 */
export function hasRequiredFrontMatter(markdown: unknown): markdown is string {
  if (typeof markdown !== 'string') return false
  if (!markdown.startsWith('---')) return false
  return /(^|\n)translationKey:/.test(markdown)
}

/** Shape the content editor submits and the server action validates. */
export const contentActionSchema = z.object({
  locale: z.enum(LOCALES),
  slug: z.string().refine(isValidSlug, { message: 'Geçersiz slug.' }),
  markdown: z.string().min(1, 'İçerik boş olamaz.'),
  sha: z.string().optional(),
})

export type ContentActionInput = z.infer<typeof contentActionSchema>
