import type { CollectionConfig, FieldAccess } from 'payload'

import { isAuthenticated, isPublic } from '@/access/roles'
import { isOwnerOrAdmin } from '@/access/ownership'
import { forceOwner } from '@/hooks/forceOwner'

/** The `user` relationship is immutable once created. */
const denyFieldUpdate: FieldAccess = () => false

interface ReactionOptions {
  slug: 'likes' | 'bookmarks'
  labelSingular: string
  labelPlural: string
}

/**
 * Likes and bookmarks share an identical shape and rules:
 * - a user may create their own row (owner is forced server-side),
 * - only the owner (or an admin) may delete,
 * - reads are public so counts can be shown,
 * - (user, post) is unique so a user cannot react twice.
 */
export const reactionCollection = ({
  slug,
  labelSingular,
  labelPlural,
}: ReactionOptions): CollectionConfig => ({
  slug,
  labels: {
    singular: labelSingular,
    plural: labelPlural,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'post', 'createdAt'],
    group: 'Engagement',
  },
  access: {
    read: isPublic,
    create: isAuthenticated,
    update: isOwnerOrAdmin,
    delete: isOwnerOrAdmin,
  },
  hooks: {
    beforeChange: [forceOwner],
  },
  indexes: [
    {
      fields: ['user', 'post'],
      unique: true,
    },
  ],
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      defaultValue: ({ user }) => user?.id,
      access: {
        update: denyFieldUpdate,
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      index: true,
    },
  ],
})
