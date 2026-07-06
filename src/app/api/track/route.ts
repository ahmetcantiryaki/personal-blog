import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { trackBodySchema } from '@/lib/validation'

/** Minimal shape we rely on from the underlying node-postgres pool. */
interface QueryablePool {
  query: (text: string, params: unknown[]) => Promise<unknown>
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = trackBodySchema

/** UTC midnight of "now" as an ISO string, so all views on a day share a row. */
const startOfUtcDay = (): string => {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString()
}

const noContent = new NextResponse(null, { status: 204 })

/**
 * POST /api/track — increment the view counter for a page.
 * Body: { path: string, slug?: string }. Anonymous, no auth.
 * Uses an ON CONFLICT upsert on (path, date) so concurrent requests are
 * race-tolerant. Never throws to the client; failures are logged server-side.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let payload: Awaited<ReturnType<typeof getPayload>> | undefined

  try {
    const json = await req.json().catch(() => null)
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { path, slug } = parsed.data
    payload = await getPayload({ config })

    // Resolve the related post by slug (any locale) when provided.
    let postId: number | string | null = null
    if (slug) {
      const result = await payload.find({
        collection: 'posts',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        pagination: false,
      })
      postId = result.docs[0]?.id ?? null
    }

    const day = startOfUtcDay()

    // Raw upsert against the generated Postgres table. The unique index on
    // (path, "date") backs the ON CONFLICT target.
    const pool = (payload.db as unknown as { pool: QueryablePool }).pool
    await pool.query(
      `INSERT INTO "page_views" ("path", "date", "count", "post_id", "updated_at", "created_at")
       VALUES ($1, $2, 1, $3, now(), now())
       ON CONFLICT ("path", "date")
       DO UPDATE SET "count" = "page_views"."count" + 1, "updated_at" = now()`,
      [path, day, postId],
    )

    return noContent
  } catch (error) {
    // Analytics must never break the page: swallow and log.
    if (payload) {
      payload.logger.error({ err: error }, 'track: failed to record page view')
    } else {
      console.error('track: failed to record page view', error)
    }
    return noContent
  }
}
