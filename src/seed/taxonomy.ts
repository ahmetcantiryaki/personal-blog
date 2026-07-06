import type { Payload } from 'payload'

import type { TaxonomyEntry } from './categories'
import { CATEGORIES } from './categories'
import { LOCALES } from './frontmatter'
import { TAGS } from './tags'

type ID = number
export type KeyToId = ReadonlyMap<string, ID>

type TaxonomyCollection = 'categories' | 'tags'

/**
 * Idempotently upsert one taxonomy entry as a SINGLE document keyed by its
 * non-localized `key`, then patch every locale row (title + slug) onto it.
 * Returns the doc id so posts can reference it.
 */
const upsertEntry = async (
  payload: Payload,
  collection: TaxonomyCollection,
  entry: TaxonomyEntry,
): Promise<ID> => {
  const found = await payload.find({
    collection,
    where: { key: { equals: entry.key } },
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })

  const primaryLocale = LOCALES[0]
  const primaryTerm = entry.locales[primaryLocale]

  let id: ID
  const existing = found.docs[0]
  if (existing) {
    id = existing.id as ID
  } else {
    const created = await payload.create({
      collection,
      locale: primaryLocale,
      data: { key: entry.key, title: primaryTerm.title, slug: primaryTerm.slug },
      overrideAccess: true,
    })
    id = created.id as ID
  }

  // Patch each locale row so both title and slug are always in sync.
  for (const locale of LOCALES) {
    const term = entry.locales[locale]
    await payload.update({
      collection,
      id,
      locale,
      data: { key: entry.key, title: term.title, slug: term.slug },
      overrideAccess: true,
    })
  }

  return id
}

const upsertAll = async (
  payload: Payload,
  collection: TaxonomyCollection,
  entries: readonly TaxonomyEntry[],
): Promise<KeyToId> => {
  const map = new Map<string, ID>()
  for (const entry of entries) {
    map.set(entry.key, await upsertEntry(payload, collection, entry))
  }
  return map
}

export interface SeededTaxonomy {
  categoryIds: KeyToId
  tagIds: KeyToId
}

/** Seed all canonical categories and tags up front, returning key→id lookups. */
export const seedTaxonomy = async (payload: Payload): Promise<SeededTaxonomy> => {
  const categoryIds = await upsertAll(payload, 'categories', CATEGORIES)
  const tagIds = await upsertAll(payload, 'tags', TAGS)
  payload.logger.info(
    `seed: upserted ${categoryIds.size} categories and ${tagIds.size} tags (locale-paired)`,
  )
  return { categoryIds, tagIds }
}
