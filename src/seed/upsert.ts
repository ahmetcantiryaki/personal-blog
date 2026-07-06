import type { Payload } from 'payload'

import { coverStyleForKey } from './coverStyle'
import { LOCALES, type ParsedArticle, type SeedLocale } from './frontmatter'
import type { ArticleGroup } from './loader'
import type { MarkdownConverter } from './lexical'
import type { SeededTaxonomy } from './taxonomy'

type ID = number

/** Resolve the article's category key to a pre-seeded category doc id. */
const resolveCategory = (
  payload: Payload,
  group: ArticleGroup,
  taxonomy: SeededTaxonomy,
): ID | undefined => {
  for (const locale of LOCALES) {
    const key = group.byLocale[locale]?.frontMatter.category
    if (!key) continue
    const id = taxonomy.categoryIds.get(key)
    if (id !== undefined) return id
    payload.logger.warn(`seed: unknown category key "${key}" in "${group.translationKey}"`)
  }
  return undefined
}

/** Resolve the union of the article's tag keys to pre-seeded tag doc ids. */
const resolveTags = (payload: Payload, group: ArticleGroup, taxonomy: SeededTaxonomy): ID[] => {
  const ids = new Set<ID>()
  for (const locale of LOCALES) {
    const keys = group.byLocale[locale]?.frontMatter.tags ?? []
    for (const key of keys) {
      const id = taxonomy.tagIds.get(key)
      if (id !== undefined) {
        ids.add(id)
      } else {
        payload.logger.warn(`seed: unknown tag key "${key}" in "${group.translationKey}"`)
      }
    }
  }
  return Array.from(ids)
}

const buildLocalizedData = (art: ParsedArticle, convert: MarkdownConverter) => ({
  title: art.frontMatter.title,
  slug: art.resolvedSlug,
  excerpt: art.frontMatter.excerpt,
  content: convert(art.markdown),
  seo: {
    seoTitle: art.frontMatter.seoTitle,
    seoDescription: art.frontMatter.seoDescription,
  },
})

/**
 * Idempotently upsert one article (all its locale variants) keyed by
 * translationKey. Creates/updates in the primary locale first, then patches the
 * secondary locale onto the same document. Category and tags are resolved from
 * the pre-seeded, locale-paired taxonomy.
 */
export const upsertArticle = async (
  payload: Payload,
  convert: MarkdownConverter,
  group: ArticleGroup,
  taxonomy: SeededTaxonomy,
): Promise<void> => {
  const primaryLocale: SeedLocale = group.byLocale.tr ? 'tr' : 'en'
  const primary = group.byLocale[primaryLocale]
  if (!primary) return

  const category = resolveCategory(payload, group, taxonomy)
  const tags = resolveTags(payload, group, taxonomy)

  const commonData = {
    translationKey: group.translationKey,
    status: primary.frontMatter.status,
    publishedAt: primary.frontMatter.publishedAt,
    coverStyle: primary.frontMatter.coverStyle ?? coverStyleForKey(group.translationKey),
    ...(category !== undefined ? { category } : {}),
    ...(tags.length > 0 ? { tags } : {}),
  }

  const existing = await payload.find({
    collection: 'posts',
    where: { translationKey: { equals: group.translationKey } },
    locale: primaryLocale,
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })

  const primaryData = { ...commonData, ...buildLocalizedData(primary, convert) }

  // Surface a slug/unique collision (or any write failure) with the offending
  // translationKey + locale + slug instead of a raw Postgres/Payload stack.
  const surface = async <T>(locale: SeedLocale, slug: string, op: () => Promise<T>): Promise<T> => {
    try {
      return await op()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(
        `seed: failed to upsert "${group.translationKey}" [${locale}] slug="${slug}": ${message}`,
      )
    }
  }

  let id: ID
  const current = existing.docs[0]
  if (current) {
    const updated = await surface(primaryLocale, primary.resolvedSlug, () =>
      payload.update({
        collection: 'posts',
        id: current.id,
        locale: primaryLocale,
        data: primaryData,
        overrideAccess: true,
      }),
    )
    id = updated.id
  } else {
    const created = await surface(primaryLocale, primary.resolvedSlug, () =>
      payload.create({
        collection: 'posts',
        locale: primaryLocale,
        data: primaryData,
        overrideAccess: true,
      }),
    )
    id = created.id
  }

  const otherLocale: SeedLocale = primaryLocale === 'tr' ? 'en' : 'tr'
  const other = group.byLocale[otherLocale]
  if (other) {
    await surface(otherLocale, other.resolvedSlug, () =>
      payload.update({
        collection: 'posts',
        id,
        locale: otherLocale,
        data: buildLocalizedData(other, convert),
        overrideAccess: true,
      }),
    )
  }
}
