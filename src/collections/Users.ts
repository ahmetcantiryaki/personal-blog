import type { Access, CollectionConfig } from 'payload'

import { adminFieldAccess, getUser, isAdmin, isAdminUser } from '@/access/roles'
import { enforcePasswordPolicy } from '@/hooks/enforcePasswordPolicy'
import { enforceReaderRole } from '@/hooks/enforceReaderRole'

/** Admins read everyone; authenticated users read only themselves. */
const readSelfOrAdmin: Access = ({ req }) => {
  if (isAdminUser(req.user)) return true
  const user = getUser(req.user)
  if (!user) return false
  return { id: { equals: user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Access',
  },
  access: {
    // Only admins may reach the Payload admin panel.
    admin: ({ req }) => isAdminUser(req.user),
    // Public self-registration is allowed; role is forced to `reader`.
    create: () => true,
    read: readSelfOrAdmin,
    update: readSelfOrAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [enforcePasswordPolicy],
    beforeChange: [enforceReaderRole],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'reader',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Reader', value: 'reader' },
      ],
      access: {
        // Only admins may read/create/update the role field. Non-admin writers
        // have this field stripped, so defaultValue `reader` always applies.
        create: adminFieldAccess,
        update: adminFieldAccess,
      },
      admin: {
        description: 'Only admins can change roles. Public sign-ups are always readers.',
      },
    },
  ],
}
