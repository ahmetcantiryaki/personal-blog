import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { reactionStateQuerySchema } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const querySchema = reactionStateQuerySchema

interface ReactionStateResponse {
  isLoggedIn: boolean
  likes: { active: boolean; count: number }
  bookmarks: { active: boolean; count: number }
}

async function countFor(
  payload: Awaited<ReturnType<typeof getPayload>>,
  kind: 'likes' | 'bookmarks',
  postId: number,
): Promise<number> {
  const { totalDocs } = await payload.count({
    collection: kind,
    where: { post: { equals: postId } },
    overrideAccess: true,
  })
  return totalDocs
}

async function activeFor(
  payload: Awaited<ReturnType<typeof getPayload>>,
  kind: 'likes' | 'bookmarks',
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
 * GET /api/reactions/state?postId= — public counts plus the current user's
 * active like/bookmark flags. Lets the post detail page render statically (ISR)
 * while the client hydrates the viewer's own reaction state after mount.
 */
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const url = new URL(req.url)
    const parsed = querySchema.safeParse({ postId: url.searchParams.get('postId') })
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
    }
    const { postId } = parsed.data

    const payload = await getPayload({ config })

    // Inject same-origin header so Payload honours cookie auth on direct fetch.
    const authHeaders = new Headers(req.headers)
    if (!authHeaders.has('origin') && !authHeaders.has('referer')) {
      authHeaders.set('origin', process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000')
    }
    const { user } = await payload.auth({ headers: authHeaders })

    const [likesCount, bookmarksCount] = await Promise.all([
      countFor(payload, 'likes', postId),
      countFor(payload, 'bookmarks', postId),
    ])

    let likesActive = false
    let bookmarksActive = false
    if (user) {
      ;[likesActive, bookmarksActive] = await Promise.all([
        activeFor(payload, 'likes', postId, user.id),
        activeFor(payload, 'bookmarks', postId, user.id),
      ])
    }

    const body: ReactionStateResponse = {
      isLoggedIn: Boolean(user),
      likes: { active: likesActive, count: likesCount },
      bookmarks: { active: bookmarksActive, count: bookmarksCount },
    }
    return NextResponse.json(body)
  } catch (error) {
    console.error('reactions/state: failed', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
