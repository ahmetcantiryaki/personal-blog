import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

/**
 * Narrow an unknown request user to a typed User (or null).
 * Payload types `req.user` loosely, so we centralise the narrowing here.
 */
export const getUser = (user: unknown): User | null => {
  if (user && typeof user === 'object' && 'role' in user) {
    return user as User
  }
  return null
}

export const isAdminUser = (user: unknown): boolean => getUser(user)?.role === 'admin'

/** Collection-level access: allow only authenticated admins. */
export const isAdmin: Access = ({ req }) => isAdminUser(req.user)

/** Collection-level access: allow any authenticated user. */
export const isAuthenticated: Access = ({ req }) => Boolean(req.user)

/** Public read for everyone. */
export const isPublic: Access = () => true

/** Field-level access: only admins may read/write the field. */
export const adminFieldAccess: FieldAccess = ({ req }) => isAdminUser(req.user)
