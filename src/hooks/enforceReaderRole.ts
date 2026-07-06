import type { CollectionBeforeChangeHook } from 'payload'

import { isAdminUser } from '@/access/roles'

/**
 * Defense-in-depth for public self-registration.
 *
 * Field-level access already strips the `role` field for non-admin writers,
 * but we ALSO force `role: 'reader'` here so that no anonymous or reader
 * request can ever create/escalate to an admin account — even if field access
 * config is later changed by mistake. Admin requests are left untouched.
 */
export const enforceReaderRole: CollectionBeforeChangeHook = ({ data, req, operation, context }) => {
  // Trusted server-side callers (e.g. the seed script) may opt out explicitly.
  if (context?.skipRoleEnforcement === true) return data

  if (isAdminUser(req.user)) return data

  // Non-admin (including anonymous) create: force reader.
  if (operation === 'create') {
    return { ...data, role: 'reader' }
  }

  // Non-admin update: never allow role to change.
  if (operation === 'update' && data && 'role' in data) {
    const { role: _role, ...rest } = data
    return rest
  }

  return data
}
