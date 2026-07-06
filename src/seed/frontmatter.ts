import { z } from 'zod'

import { slugify } from '@/utils/slugify'

export const LOCALES = ['tr', 'en'] as const
export type SeedLocale = (typeof LOCALES)[number]

/**
 * Front-matter contract for a single markdown article file.
 * `translationKey` pairs the tr/en versions of one article and is the stable,
 * non-localized upsert key. `category` and `tags` are stable slugs (identical
 * across locales); their display titles are localized separately.
 */
export const frontMatterSchema = z.object({
  translationKey: z.string().trim().min(1),
  title: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().optional(),
  status: z.enum(['draft', 'published']).default('published'),
  // YAML auto-parses ISO timestamps into Date objects, so accept both and
  // normalise to an ISO string for the Payload date field.
  publishedAt: z
    .union([z.string().trim(), z.date()])
    .optional()
    .transform((value) =>
      value === undefined ? undefined : value instanceof Date ? value.toISOString() : value,
    ),
  category: z.string().trim().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  // Optional: real content omits it, so the seed derives a deterministic style
  // from the translationKey. An explicit value (legacy content) still wins.
  coverStyle: z.enum(['aurora', 'dusk', 'meadow', 'ocean', 'ember']).optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
})

export type FrontMatter = z.infer<typeof frontMatterSchema>

export interface ParsedArticle {
  locale: SeedLocale
  frontMatter: FrontMatter
  markdown: string
  resolvedSlug: string
}

/** Validate raw front-matter data and resolve the effective slug. */
export const parseArticle = (
  locale: SeedLocale,
  rawFrontMatter: unknown,
  markdown: string,
): ParsedArticle => {
  const frontMatter = frontMatterSchema.parse(rawFrontMatter)
  const resolvedSlug = frontMatter.slug ? slugify(frontMatter.slug) : slugify(frontMatter.title)

  return { locale, frontMatter, markdown, resolvedSlug }
}
