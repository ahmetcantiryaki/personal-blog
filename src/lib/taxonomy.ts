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
