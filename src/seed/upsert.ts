import type { Payload } from 'payload'

import { LOCALES, type ParsedArticle, type SeedLocale } from './frontmatter'
import type { ArticleGroup } from './loader'
import type { MarkdownConverter } from './lexical'

type ID = number

const titleCase = (slug: string): string =>
  slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

/** Find-or-create a taxonomy row by slug, keeping the per-locale title in sync. */
const ensureTaxonomy = async (
  payload: Payload,
  collection: 'categories' | 'tags',
  slug: string,
  locale: SeedLocale,
  title: string,
): Promise<ID> => {
  const found = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })

  const existing = found.docs[0]
  if (existing) {
    await payload.update({
      collection,
      id: existing.id,
      locale,
      data: { title, slug },
      overrideAccess: true,
    })
    return existing.id
  }

  const created = await payload.create({
    collection,
    locale,
    data: { title, slug },
    overrideAccess: true,
  })
  return created.id
}

const resolveCategory = async (payload: Payload, group: ArticleGroup): Promise<ID | undefined> => {
  let id: ID | undefined
  for (const locale of LOCALES) {
    const art = group.byLocale[locale]
    const slug = art?.frontMatter.category
    if (art && slug) {
      const title = art.frontMatter.categoryTitle ?? titleCase(slug)
      id = await ensureTaxonomy(payload, 'categories', slug, locale, title)
    }
  }
  return id
}

const resolveTags = async (payload: Payload, group: ArticleGroup): Promise<ID[]> => {
  const idBySlug = new Map<string, ID>()
  for (const locale of LOCALES) {
    const art = group.byLocale[locale]
    if (!art) continue
    for (const slug of art.frontMatter.tags) {
      const id = await ensureTaxonomy(payload, 'tags', slug, locale, titleCase(slug))
      idBySlug.set(slug, id)
    }
  }
  return Array.from(idBySlug.values())
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
 * secondary locale onto the same document.
 */
export const upsertArticle = async (
  payload: Payload,
  convert: MarkdownConverter,
  group: ArticleGroup,
): Promise<void> => {
  const primaryLocale: SeedLocale = group.byLocale.tr ? 'tr' : 'en'
  const primary = group.byLocale[primaryLocale]
  if (!primary) return

  const category = await resolveCategory(payload, group)
  const tags = await resolveTags(payload, group)

  const commonData = {
    translationKey: group.translationKey,
    status: primary.frontMatter.status,
    publishedAt: primary.frontMatter.publishedAt,
    coverStyle: primary.frontMatter.coverStyle,
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

  let id: ID
  const current = existing.docs[0]
  if (current) {
    const updated = await payload.update({
      collection: 'posts',
      id: current.id,
      locale: primaryLocale,
      data: primaryData,
      overrideAccess: true,
    })
    id = updated.id
  } else {
    const created = await payload.create({
      collection: 'posts',
      locale: primaryLocale,
      data: primaryData,
      overrideAccess: true,
    })
    id = created.id
  }

  const otherLocale: SeedLocale = primaryLocale === 'tr' ? 'en' : 'tr'
  const other = group.byLocale[otherLocale]
  if (other) {
    await payload.update({
      collection: 'posts',
      id,
      locale: otherLocale,
      data: buildLocalizedData(other, convert),
      overrideAccess: true,
    })
  }
}
