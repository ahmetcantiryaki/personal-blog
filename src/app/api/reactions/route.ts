import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { logger } from '@/lib/logger'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { reactionBodySchema } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = reactionBodySchema

type Payload = Awaited<ReturnType<typeof getPayload>>
type ReactionKind = 'likes' | 'bookmarks'

interface ToggleResult {
  active: boolean
  count: number
}

/** Whether the user currently has a row for (kind, post). Count-based, override. */
async function reactionExists(
  payload: Payload,
  kind: ReactionKind,
  postId: number,
  userId: number,
): Promise<boolean> {
  const { totalDocs } = await payload.count({
    collection: kind,
    where: { and: [{ post: { equals: postId } }, { user: { equals: userId } }] },
    overrideAccess: true,
  })
  return totalDocs > 0
}

/**
 * POST /api/reactions — toggle the current user's like/bookmark on a post.
 * Requires an authenticated session (Payload cookie). Body: { kind, postId }.
 * Rate limited to 30/min per IP. Idempotent under double-tap: a create that
 * loses the unique (user,post) race resolves to active:true, and a delete of an
 * already-removed row resolves to active:false — neither 500s. Returns
 * { active, count } with the fresh public count.
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const json = await req.json().catch(() => null)
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const ip = clientIp(req.headers)
    const limited = rateLimit(`reactions:${ip}`, 30, 60_000)
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfterSeconds) } },
      )
    }

    const payload = await getPayload({ config })
    // Ensure a same-origin header is present so Payload honours cookie auth.
    const authHeaders = new Headers(req.headers)
    if (!authHeaders.has('origin') && !authHeaders.has('referer')) {
      authHeaders.set('origin', process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000')
    }
    const { user } = await payload.auth({ headers: authHeaders })
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { kind, postId } = parsed.data

    // Confirm the post exists and is published before recording a reaction.
    const post = await payload.findByID({
      collection: 'posts',
      id: postId,
      depth: 0,
      overrideAccess: false,
    })
    if (!post || post.status !== 'published') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const existing = await payload.find({
      collection: kind,
      where: { and: [{ post: { equals: postId } }, { user: { equals: user.id } }] },
      depth: 0,
      limit: 1,
      overrideAccess: false,
      user,
      pagination: false,
    })

    let active: boolean
    const current = existing.docs[0]
    if (current) {
      try {
        await payload.delete({ collection: kind, id: current.id, overrideAccess: false, user })
      } catch (err) {
        // Idempotent: if the row is already gone (concurrent double-tap), the
        // desired end state is reached; only rethrow a genuine failure.
        if (await reactionExists(payload, kind, postId, user.id)) throw err
      }
      active = false
    } else {
      try {
        await payload.create({
          collection: kind,
          data: { post: postId, user: user.id },
          overrideAccess: false,
          user,
        })
      } catch (err) {
        // Idempotent: a concurrent create won the unique (user,post) race, so a
        // row now exists — treat as active; only rethrow if it truly failed.
        if (!(await reactionExists(payload, kind, postId, user.id))) throw err
      }
      active = true
    }

    const { totalDocs } = await payload.count({
      collection: kind,
      where: { post: { equals: postId } },
      overrideAccess: true,
    })

    const result: ToggleResult = { active, count: totalDocs }
    return NextResponse.json(result)
  } catch (error) {
    logger.error('reactions: toggle failed', { err: String(error) })
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
