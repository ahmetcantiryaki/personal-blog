import { z } from 'zod'

/**
 * Zod schemas for the admin taxonomy forms (categories + tags). Kept free of
 * `server-only`/Payload imports so they can be shared by the client form and the
 * server actions, and unit-tested in isolation.
 */

const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Stable cross-locale identifier. Immutable after creation. */
export const keySchema = z
  .string()
  .trim()
  .min(1, 'Anahtar gerekli.')
  .max(80, 'Anahtar en fazla 80 karakter olabilir.')
  .regex(KEY_PATTERN, 'Anahtar yalnızca küçük harf, rakam ve tire içerebilir.')

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Optional per-locale slug. Empty means "auto-generate from the title". */
const optionalSlug = z
  .string()
  .trim()
  .max(120, 'Slug en fazla 120 karakter olabilir.')
  .refine((value) => value === '' || SLUG_PATTERN.test(value), {
    message: 'Slug yalnızca küçük harf, rakam ve tire içerebilir.',
  })
  .optional()
  .default('')

const requiredTitle = z
  .string()
  .trim()
  .min(1, 'Başlık gerekli.')
  .max(120, 'Başlık en fazla 120 karakter olabilir.')

const optionalDescription = z
  .string()
  .trim()
  .max(500, 'Açıklama en fazla 500 karakter olabilir.')
  .optional()
  .default('')

/** One locale's fields for a category. */
export const categoryLocaleSchema = z.object({
  title: requiredTitle,
  slug: optionalSlug,
  description: optionalDescription,
})

/** One locale's fields for a tag (no description). */
export const tagLocaleSchema = z.object({
  title: requiredTitle,
  slug: optionalSlug,
})

export const categoryCreateSchema = z.object({
  key: keySchema,
  tr: categoryLocaleSchema,
  en: categoryLocaleSchema,
})

export const categoryUpdateSchema = z.object({
  tr: categoryLocaleSchema,
  en: categoryLocaleSchema,
})

export const tagCreateSchema = z.object({
  key: keySchema,
  tr: tagLocaleSchema,
  en: tagLocaleSchema,
})

export const tagUpdateSchema = z.object({
  tr: tagLocaleSchema,
  en: tagLocaleSchema,
})

export type CategoryLocaleInput = z.infer<typeof categoryLocaleSchema>
export type TagLocaleInput = z.infer<typeof tagLocaleSchema>
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>
export type TagCreateInput = z.infer<typeof tagCreateSchema>
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>
