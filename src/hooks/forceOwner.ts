import type { CollectionBeforeChangeHook } from 'payload'

import { getUser, isAdminUser } from '@/access/roles'

/**
 * beforeChange hook for user-owned rows (likes, bookmarks).
 * On create, forces the `user` relationship to the authenticated request user
 * so a client can never like/bookmark on behalf of someone else. Admins may
 * write an explicit user (e.g. for seeding/backfills).
 */
export const forceOwner: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (operation !== 'create') return data

  if (isAdminUser(req.user) && data?.user) return data

  const user = getUser(req.user)
  if (!user) return data // access control will already have rejected this

  return { ...data, user: user.id }
}
