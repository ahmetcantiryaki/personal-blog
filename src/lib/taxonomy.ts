import 'server-only'

import type { Locale } from '@/i18n/config'
import type { Category, Tag } from '@/payload-types'

import { getPayloadClient } from './payload'

/** All categories for a locale, alphabetical. Used for nav + filter chips. */
export async function listCategories(locale: Locale): Promise<Category[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'categories',
    locale,
    depth: 0,
    limit: 100,
    overrideAccess: false,
    sort: 'title',
    pagination: false,
  })
  return result.docs
}

/** Resolve a single category by its per-locale slug. */
export async function getCategoryBySlug(
  locale: Locale,
  slug: string,
): Promise<Category | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    locale,
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
  })
  return result.docs[0] ?? null
}

/** A tag resolved for the active locale together with its published-post count. */
export interface TagWithCount {
  /** Stable, non-localized identifier (front-matter key). */
  key: string
  /** Per-locale URL slug. */
  slug: string
  /** Per-locale display title. */
  title: string
  /** Number of published posts carrying this tag in the active locale. */
  count: number
}

/**
 * Resolve the given stable tag keys for a locale and attach a published-post
 * count to each. Returns a map keyed by the stable tag `key`.
 *
 * Robust to tags that do not exist yet (a parallel seed may still be adding
 * them): unknown keys are simply absent from the map. Tags with a zero count,
 * or missing a slug in the active locale, are also omitted — callers can treat
 * "present in the map" as "safe to render and link".
 */
export async function getTagsWithCounts(
  keys: readonly string[],
  locale: Locale,
): Promise<Map<string, TagWithCount>> {
  const result = new Map<string, TagWithCount>()
  if (keys.length === 0) return result

  const payload = await getPayloadClient()
  const tagsResult = await payload.find({
    collection: 'tags',
    where: { key: { in: [...keys] } },
    locale,
    depth: 0,
    limit: keys.length,
    overrideAccess: false,
    pagination: false,
  })

  const tags = tagsResult.docs.filter((tag) => Boolean(tag.slug))
  const counts = await Promise.all(
    tags.map((tag) =>
      payload
        .count({
          collection: 'posts',
          where: {
            and: [{ status: { equals: 'published' } }, { 'tags.key': { equals: tag.key } }],
          },
          locale,
          overrideAccess: false,
        })
        .then((r) => r.totalDocs)
        .catch(() => 0),
    ),
  )

  tags.forEach((tag, index) => {
    const count = counts[index]
    if (count > 0 && tag.slug) {
      result.set(tag.key, { key: tag.key, slug: tag.slug, title: tag.title, count })
    }
  })

  return result
}

/** Resolve a single tag by its per-locale slug. */
export async function getTagBySlug(locale: Locale, slug: string): Promise<Tag | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'tags',
    where: { slug: { equals: slug } },
    locale,
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
  })
  return result.docs[0] ?? null
}
