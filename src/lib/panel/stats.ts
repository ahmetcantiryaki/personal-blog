import 'server-only'

import type { Payload } from 'payload'

import { getPayloadClient } from '../payload'

/** Minimal shape we rely on from the underlying node-postgres pool. */
interface QueryablePool {
  query: (
    text: string,
    params?: unknown[],
  ) => Promise<{ rows: Array<Record<string, unknown>> }>
}

/** One aggregated (post_id, views) row as returned by the SUM/GROUP BY query. */
export interface ViewAggregate {
  postId: number
  views: number
}

/** A resolved entry for the "En Çok Okunanlar" list. */
export interface TopPost {
  id: number
  title: string
  slug: string | null
  views: number
}

/** The full set of numbers rendered on the dashboard. */
export interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  totalLikes: number
  totalBookmarks: number
  topPosts: TopPost[]
}

/**
 * Postgres returns `SUM(...)`/`COUNT(...)` of a `bigint` as a string, and NULL
 * when there are no rows. Coerce to a safe non-negative integer.
 */
export function toCount(value: unknown): number {
  if (value == null) return 0
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 0
}

/**
 * Join the raw view aggregates with per-post metadata (resolved separately in
 * the `tr` locale) into the ordered top list. Aggregates missing a matching
 * post (e.g. a deleted post) are dropped. Ordering follows the input, which is
 * already sorted by views desc from SQL.
 */
export function shapeTopPosts(
  aggregates: readonly ViewAggregate[],
  postsById: ReadonlyMap<number, { title?: string | null; slug?: string | null }>,
): TopPost[] {
  const shaped: TopPost[] = []
  for (const { postId, views } of aggregates) {
    const post = postsById.get(postId)
    if (!post) continue
    shaped.push({
      id: postId,
      title: post.title?.trim() || 'Başlıksız yazı',
      slug: post.slug ?? null,
      views,
    })
  }
  return shaped
}

/** Access the node-postgres pool behind the Payload Drizzle adapter. */
function getPool(payload: Payload): QueryablePool {
  return (payload.db as unknown as { pool: QueryablePool }).pool
}

/** Sum of every `count` across all page-view rows. */
async function getTotalViews(payload: Payload): Promise<number> {
  const { rows } = await getPool(payload).query(
    'SELECT COALESCE(SUM("count"), 0) AS total FROM "page_views"',
  )
  return toCount(rows[0]?.total)
}

/** Top 5 posts by summed views (posts with attributed views only). */
async function getTopViewAggregates(payload: Payload): Promise<ViewAggregate[]> {
  const { rows } = await getPool(payload).query(
    `SELECT "post_id", SUM("count") AS views
     FROM "page_views"
     WHERE "post_id" IS NOT NULL
     GROUP BY "post_id"
     ORDER BY views DESC
     LIMIT 5`,
  )
  return rows
    .map((row) => ({ postId: toCount(row.post_id), views: toCount(row.views) }))
    .filter((row) => row.postId > 0)
}

/** Resolve titles/slugs (in the `tr` locale) for the given post ids. */
async function resolvePostMeta(
  payload: Payload,
  ids: readonly number[],
): Promise<Map<number, { title?: string | null; slug?: string | null }>> {
  const map = new Map<number, { title?: string | null; slug?: string | null }>()
  if (ids.length === 0) return map

  const result = await payload.find({
    collection: 'posts',
    where: { id: { in: [...ids] } },
    locale: 'tr',
    depth: 0,
    limit: ids.length,
    pagination: false,
    overrideAccess: true,
  })

  for (const doc of result.docs) {
    map.set(doc.id as number, { title: doc.title, slug: doc.slug })
  }
  return map
}

/**
 * Gather every figure the dashboard renders in one pass. All queries run with
 * access overridden — this is admin-only, server-side reporting.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const payload = await getPayloadClient()

  const [totalPosts, publishedPosts, totalLikes, totalBookmarks, totalViews, aggregates] =
    await Promise.all([
      payload
        .count({ collection: 'posts', overrideAccess: true })
        .then((r) => r.totalDocs),
      payload
        .count({
          collection: 'posts',
          where: { status: { equals: 'published' } },
          overrideAccess: true,
        })
        .then((r) => r.totalDocs),
      payload.count({ collection: 'likes', overrideAccess: true }).then((r) => r.totalDocs),
      payload
        .count({ collection: 'bookmarks', overrideAccess: true })
        .then((r) => r.totalDocs),
      getTotalViews(payload),
      getTopViewAggregates(payload),
    ])

  const postsById = await resolvePostMeta(
    payload,
    aggregates.map((a) => a.postId),
  )

  return {
    totalPosts,
    publishedPosts,
    draftPosts: Math.max(totalPosts - publishedPosts, 0),
    totalViews,
    totalLikes,
    totalBookmarks,
    topPosts: shapeTopPosts(aggregates, postsById),
  }
}
