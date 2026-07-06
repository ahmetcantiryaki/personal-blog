import 'server-only'

import type { Where } from 'payload'

import type { Locale } from '@/i18n/config'
import type { Category, Post, Tag } from '@/payload-types'

import { getPayloadClient } from './payload'

export const POSTS_PER_PAGE = 9

/** A post with its category/tags resolved to objects (depth 1). */
export interface PostWithRelations extends Omit<Post, 'category' | 'tags'> {
  category?: Category | null
  tags?: Tag[] | null
}

export interface PaginatedPosts {
  posts: PostWithRelations[]
  page: number
  totalPages: number
  totalDocs: number
}

const basePublished = { status: { equals: 'published' } } as const

const normalize = (doc: Post): PostWithRelations => ({
  ...doc,
  category: doc.category && typeof doc.category === 'object' ? doc.category : null,
  tags: Array.isArray(doc.tags)
    ? doc.tags.filter((t): t is Tag => typeof t === 'object' && t !== null)
    : null,
})

/**
 * Map docs to normalized cards, dropping any post that lacks a slug in the
 * active locale (partially-translated content still being seeded) — those
 * cannot be linked and would otherwise render broken.
 */
const toCards = (docs: Post[]): PostWithRelations[] =>
  docs.map(normalize).filter((post) => Boolean(post.slug))

interface ListArgs {
  locale: Locale
  page?: number
  limit?: number
  categorySlug?: string
  tagSlug?: string
  /**
   * Exclude a single post id from the results. The home page uses this to keep
   * the newest post (rendered as the featured hero) out of the grid on every
   * page, so the grid window stays a consistent `limit`-per-page over the
   * remaining posts with no post duplicated or skipped across pages.
   */
  excludeId?: number
}

/** Paginated list of published posts, newest first, optional category/tag filter. */
export async function listPosts({
  locale,
  page = 1,
  limit = POSTS_PER_PAGE,
  categorySlug,
  tagSlug,
  excludeId,
}: ListArgs): Promise<PaginatedPosts> {
  const payload = await getPayloadClient()

  const and: Where[] = [basePublished]
  if (categorySlug) and.push({ 'category.slug': { equals: categorySlug } })
  if (tagSlug) and.push({ 'tags.slug': { equals: tagSlug } })
  if (typeof excludeId === 'number') and.push({ id: { not_equals: excludeId } })

  const result = await payload.find({
    collection: 'posts',
    where: { and },
    locale,
    depth: 1,
    limit,
    page,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return {
    posts: toCards(result.docs),
    page: result.page ?? 1,
    totalPages: result.totalPages ?? 1,
    totalDocs: result.totalDocs ?? 0,
  }
}

/** The single newest published post (for the home hero). */
export async function getFeaturedPost(locale: Locale): Promise<PostWithRelations | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: basePublished,
    locale,
    depth: 1,
    limit: 5,
    overrideAccess: false,
    sort: '-publishedAt',
  })
  return toCards(result.docs)[0] ?? null
}

/** Resolve a single published post by its per-locale slug. */
export async function getPostBySlug(
  locale: Locale,
  slug: string,
): Promise<PostWithRelations | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { and: [basePublished, { slug: { equals: slug } }] },
    locale,
    depth: 1,
    limit: 1,
    overrideAccess: false,
    pagination: false,
  })
  const doc = result.docs[0]
  return doc ? normalize(doc) : null
}

/** Up to `limit` other published posts in the same category. */
export async function getRelatedPosts(
  locale: Locale,
  post: PostWithRelations,
  limit = 3,
): Promise<PostWithRelations[]> {
  if (!post.category) return []
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        basePublished,
        { category: { equals: post.category.id } },
        { id: { not_equals: post.id } },
      ],
    },
    locale,
    depth: 1,
    limit,
    overrideAccess: false,
    sort: '-publishedAt',
  })
  return toCards(result.docs)
}

/**
 * Find the slug of this post's translation in another locale, via the shared
 * non-localized `translationKey`. Returns null when no translation exists.
 */
export async function getTranslatedSlug(
  translationKey: string,
  targetLocale: Locale,
): Promise<string | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { and: [basePublished, { translationKey: { equals: translationKey } }] },
    locale: targetLocale,
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
  })
  return result.docs[0]?.slug ?? null
}

/** Full-text-ish search over title + excerpt for the active locale. */
export async function searchPosts(locale: Locale, query: string): Promise<PostWithRelations[]> {
  const trimmed = query.trim()
  if (!trimmed) return []
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        basePublished,
        { or: [{ title: { like: trimmed } }, { excerpt: { like: trimmed } }] },
      ],
    },
    locale,
    depth: 1,
    limit: 30,
    overrideAccess: false,
    sort: '-publishedAt',
  })
  return toCards(result.docs)
}

/** Fetch published posts by id (for profile liked/bookmarked lists). */
export async function getPostsByIds(
  locale: Locale,
  ids: number[],
): Promise<PostWithRelations[]> {
  if (ids.length === 0) return []
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { and: [basePublished, { id: { in: ids } }] },
    locale,
    depth: 1,
    limit: ids.length,
    overrideAccess: false,
    sort: '-publishedAt',
    pagination: false,
  })
  return toCards(result.docs)
}

/** All published post slugs for a locale — used by generateStaticParams. */
export async function getAllPostSlugs(locale: Locale): Promise<string[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: basePublished,
    locale,
    depth: 0,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return result.docs.map((d) => d.slug).filter(Boolean)
}
