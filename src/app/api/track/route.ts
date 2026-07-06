import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { LOCALES } from '@/i18n/config'
import { clientIp, rateLimit } from '@/lib/rate-limit'
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

const tooMany = (retryAfterSeconds: number): NextResponse =>
  NextResponse.json(
    { error: 'Too many requests' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
  )

/**
 * POST /api/track — increment the view counter for a page.
 * Body: { path: string, slug?: string }. Anonymous, no auth.
 *
 * Rate limited per IP (20/min) with a per-(IP,path) dedup (1/min) so a single
 * mount can't be replayed into inflated counts. Uses an ON CONFLICT upsert on
 * (path, date) so concurrent requests are race-tolerant. Never throws to the
 * client; failures are logged server-side.
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

    // Per-IP flood guard first, then a per-(IP,path) dedup window.
    const ip = clientIp(req.headers)
    const perIp = rateLimit(`track:${ip}`, 20, 60_000)
    if (!perIp.ok) return tooMany(perIp.retryAfterSeconds)
    const dedup = rateLimit(`track:${ip}:${path}`, 1, 60_000)
    if (!dedup.ok) return noContent // duplicate view within the minute — drop, don't double-count

    payload = await getPayload({ config })

    // Resolve the related post by slug in ANY locale (slugs differ per locale,
    // and fallback is disabled) so a view is attributed to the right post.
    let postId: number | string | null = null
    if (slug) {
      for (const locale of LOCALES) {
        const result = await payload.find({
          collection: 'posts',
          where: { slug: { equals: slug } },
          locale,
          limit: 1,
          depth: 0,
          overrideAccess: true,
          pagination: false,
        })
        if (result.docs[0]) {
          postId = result.docs[0].id
          break
        }
      }
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
      const { logger } = await import('@/lib/logger')
      logger.error('track: failed to record page view', { err: String(error) })
    }
    return noContent
  }
}
