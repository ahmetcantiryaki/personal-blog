import 'server-only'

import type { User } from '@/payload-types'

import { getPayloadClient } from './payload'

export type ReactionKind = 'likes' | 'bookmarks'

export interface ReactionState {
  count: number
  active: boolean
}

/** Public count of a reaction kind for a post. */
async function countFor(kind: ReactionKind, postId: number): Promise<number> {
  const payload = await getPayloadClient()
  const { totalDocs } = await payload.count({
    collection: kind,
    where: { post: { equals: postId } },
    overrideAccess: true,
  })
  return totalDocs
}

/** Whether `user` has an active reaction of `kind` on `post`. */
async function isActive(
  kind: ReactionKind,
  postId: number,
  user: User | null,
): Promise<boolean> {
  if (!user) return false
  const payload = await getPayloadClient()
  const { totalDocs } = await payload.count({
    collection: kind,
    where: { and: [{ post: { equals: postId } }, { user: { equals: user.id } }] },
    overrideAccess: true,
  })
  return totalDocs > 0
}

/** Combined count + per-user active flag for a single reaction kind. */
export async function getReactionState(
  kind: ReactionKind,
  postId: number,
  user: User | null,
): Promise<ReactionState> {
  const [count, active] = await Promise.all([countFor(kind, postId), isActive(kind, postId, user)])
  return { count, active }
}

/** Post ids the user has reacted to (for the profile page). */
export async function getReactedPostIds(kind: ReactionKind, user: User): Promise<number[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: kind,
    where: { user: { equals: user.id } },
    depth: 0,
    limit: 500,
    overrideAccess: false,
    sort: '-createdAt',
    pagination: false,
  })
  return result.docs
    .map((d) => (typeof d.post === 'object' && d.post ? d.post.id : (d.post as number)))
    .filter((id): id is number => typeof id === 'number')
}
