import { z } from 'zod'

/**
 * Validation + change-diffing for the admin post metadata editor.
 *
 * Pure, dependency-light module (no `server-only`, no Payload) so it can be
 * imported by both the client form and the server action, and unit-tested in
 * isolation. The `content` richText field is intentionally absent — the editor
 * never touches it.
 */

export const COVER_STYLE_VALUES = ['aurora', 'dusk', 'meadow', 'ocean', 'ember'] as const
export type CoverStyleValue = (typeof COVER_STYLE_VALUES)[number]

export const POST_STATUS_VALUES = ['draft', 'published'] as const
export type PostStatusValue = (typeof POST_STATUS_VALUES)[number]

const localizedInputSchema = z.object({
  excerpt: z.string().max(600).optional().default(''),
  seoTitle: z.string().max(200).optional().default(''),
  seoDescription: z.string().max(400).optional().default(''),
})

/** Shape the client form submits (and the server action validates). */
export const postMetadataSchema = z.object({
  status: z.enum(POST_STATUS_VALUES),
  publishedAt: z.string().max(40).optional().default(''),
  coverStyle: z.enum(COVER_STYLE_VALUES),
  coverImage: z.string().max(600).optional().default(''),
  category: z.union([z.number().int(), z.null()]).optional().default(null),
  tags: z.array(z.number().int()).optional().default([]),
  tr: localizedInputSchema,
  en: localizedInputSchema,
})

export type PostMetadataInput = z.infer<typeof postMetadataSchema>
export type LocalizedInput = z.infer<typeof localizedInputSchema>

export interface LocalizedValues {
  excerpt: string
  seoTitle: string
  seoDescription: string
}

/** Authoritative current values, read from the DB, used to diff the submission. */
export interface PostMetadataOriginal {
  status: PostStatusValue
  publishedAt: string | null
  coverStyle: CoverStyleValue
  coverImage: string | null
  category: number | null
  tags: number[]
  tr: LocalizedValues
  en: LocalizedValues
}

export interface LocaleUpdate {
  locale: 'tr' | 'en'
  data: Record<string, unknown>
}

/** Normalize an ISO timestamp to the `YYYY-MM-DD` value an `<input type=date>` uses. */
export function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function sameIdSet(a: readonly number[], b: readonly number[]): boolean {
  if (a.length !== b.length) return false
  const sortedA = [...a].sort((x, y) => x - y)
  const sortedB = [...b].sort((x, y) => x - y)
  return sortedA.every((value, index) => value === sortedB[index])
}

function localizedDiff(original: LocalizedValues, next: LocalizedInput): Record<string, unknown> {
  const data: Record<string, unknown> = {}

  const nextExcerpt = next.excerpt.trim()
  if (nextExcerpt !== (original.excerpt ?? '')) {
    data.excerpt = nextExcerpt === '' ? null : nextExcerpt
  }

  const nextTitle = next.seoTitle.trim()
  const nextDescription = next.seoDescription.trim()
  if (nextTitle !== (original.seoTitle ?? '') || nextDescription !== (original.seoDescription ?? '')) {
    // `seo` is a group field: send both members together so a partial edit does
    // not silently drop the untouched sibling.
    data.seo = {
      seoTitle: nextTitle === '' ? null : nextTitle,
      seoDescription: nextDescription === '' ? null : nextDescription,
    }
  }

  return data
}

/**
 * Compute the minimal set of per-locale Payload updates from the diff between
 * current DB values and the submitted form. Non-localized fields (status,
 * publishedAt, coverStyle, coverImage, category, tags) are attached to the `tr`
 * update since Payload applies them globally regardless of the `locale` arg.
 * Localized fields (excerpt, seo) are split per locale. Returns an empty array
 * when nothing changed.
 */
export function buildPostUpdates(
  original: PostMetadataOriginal,
  input: PostMetadataInput,
): LocaleUpdate[] {
  const shared: Record<string, unknown> = {}

  if (input.status !== original.status) shared.status = input.status

  const nextPublished = input.publishedAt.trim()
  if (nextPublished !== toDateInputValue(original.publishedAt)) {
    shared.publishedAt = nextPublished === '' ? null : nextPublished
  }

  if (input.coverStyle !== original.coverStyle) shared.coverStyle = input.coverStyle

  const nextCover = input.coverImage.trim()
  if (nextCover !== (original.coverImage ?? '')) {
    shared.coverImage = nextCover === '' ? null : nextCover
  }

  const nextCategory = input.category ?? null
  if (nextCategory !== original.category) shared.category = nextCategory

  if (!sameIdSet(input.tags, original.tags)) shared.tags = [...input.tags]

  const trData = { ...shared, ...localizedDiff(original.tr, input.tr) }
  const enData = localizedDiff(original.en, input.en)

  const updates: LocaleUpdate[] = []
  if (Object.keys(trData).length > 0) updates.push({ locale: 'tr', data: trData })
  if (Object.keys(enData).length > 0) updates.push({ locale: 'en', data: enData })
  return updates
}
