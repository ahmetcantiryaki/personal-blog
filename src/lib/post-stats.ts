import 'server-only'

import type { Payload } from 'payload'

import { getPayloadClient } from './payload'

/** Minimal shape we rely on from the underlying node-postgres pool. */
interface QueryablePool {
  query: (
    text: string,
    params?: unknown[],
  ) => Promise<{ rows: Array<Record<string, unknown>> }>
}

/** Real reader-facing numbers rendered on the post detail page. */
export interface PostStats {
  views: number
  likes: number
}

const EMPTY: PostStats = { views: 0, likes: 0 }

/**
 * Postgres returns `SUM(...)` of a `bigint` as a string, and NULL when there are
 * no rows. Coerce to a safe non-negative integer.
 */
function toCount(value: unknown): number {
  if (value == null) return 0
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 0
}

/** Access the node-postgres pool behind the Payload Drizzle adapter. */
function getPool(payload: Payload): QueryablePool {
  return (payload.db as unknown as { pool: QueryablePool }).pool
}

/** Sum of daily `page_views.count` rows attributed to a single post. */
async function sumViews(payload: Payload, postId: number): Promise<number> {
  const { rows } = await getPool(payload).query(
    'SELECT COALESCE(SUM("count"), 0) AS total FROM "page_views" WHERE "post_id" = $1',
    [postId],
  )
  return toCount(rows[0]?.total)
}

/**
 * Real view + like totals for a post. Views come from the daily `page_views`
 * aggregate (bots already filtered at ingest); likes are a row count. Never
 * throws — any failure degrades to zeros so the post page still renders.
 */
export async function getPostStats(postId: number): Promise<PostStats> {
  if (!Number.isInteger(postId) || postId <= 0) return EMPTY
  try {
    const payload = await getPayloadClient()
    const [views, likes] = await Promise.all([
      sumViews(payload, postId),
      payload
        .count({ collection: 'likes', where: { post: { equals: postId } }, overrideAccess: true })
        .then((r) => r.totalDocs),
    ])
    return { views, likes: toCount(likes) }
  } catch {
    return EMPTY
  }
}
