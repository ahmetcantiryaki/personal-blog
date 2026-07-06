import type { CollectionConfig } from 'payload'

import { isAdmin, isPublic } from '@/access/roles'
import { capReadLimit } from '@/hooks/capReadLimit'
import { formatSlug } from '@/hooks/formatSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    group: 'Content',
  },
  access: {
    read: isPublic,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeOperation: [capReadLimit],
  },
  fields: [
    {
      // Non-localized stable identifier. One category doc per key, carrying both
      // locale rows. Used by the seed pipeline for idempotent upserts and to pair
      // localized slugs for hreflang.
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Stable key shared across locales. Do not change after creation.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      localized: true,
      index: true,
      unique: true,
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
      admin: {
        description: 'URL-safe identifier. Auto-generated from the title if left blank.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
  ],
}
