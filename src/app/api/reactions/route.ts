import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  kind: z.enum(['likes', 'bookmarks']),
  postId: z.coerce.number().int().positive(),
})

interface ToggleResult {
  active: boolean
  count: number
}

/**
 * POST /api/reactions — toggle the current user's like/bookmark on a post.
 * Requires an authenticated session (Payload cookie). Body: { kind, postId }.
 * Returns { active, count } with the fresh public count.
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const json = await req.json().catch(() => null)
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
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
    if (existing.docs[0]) {
      await payload.delete({
        collection: kind,
        id: existing.docs[0].id,
        overrideAccess: false,
        user,
      })
      active = false
    } else {
      await payload.create({
        collection: kind,
        data: { post: postId, user: user.id },
        overrideAccess: false,
        user,
      })
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
    console.error('reactions: toggle failed', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
