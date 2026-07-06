import type { Access } from 'payload'

import { getUser, isAdminUser } from './roles'

/**
 * Ownership-based access for user-owned rows (likes, bookmarks).
 * Admins get full access; other authenticated users are constrained to
 * documents whose `user` relationship equals their own id.
 * Anonymous requests are denied.
 */
export const isOwnerOrAdmin: Access = ({ req }) => {
  if (isAdminUser(req.user)) return true

  const user = getUser(req.user)
  if (!user) return false

  return {
    user: {
      equals: user.id,
    },
  }
}
