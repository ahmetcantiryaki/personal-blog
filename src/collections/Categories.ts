import type { CollectionConfig } from 'payload'

import { isAdmin, isPublic } from '@/access/roles'
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
  fields: [
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
