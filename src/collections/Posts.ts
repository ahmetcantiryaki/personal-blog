import type { Access, CollectionConfig } from 'payload'

import { isAdmin, isAdminUser } from '@/access/roles'
import { computeReadingTime } from '@/hooks/computeReadingTime'
import { formatSlug } from '@/hooks/formatSlug'

/** Public visitors see only published posts; admins see everything. */
const readPublished: Access = ({ req }) => {
  if (isAdminUser(req.user)) return true
  return { status: { equals: 'published' } }
}

export const COVER_STYLES = ['aurora', 'dusk', 'meadow', 'ocean', 'ember'] as const

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'category', 'publishedAt'],
    group: 'Content',
  },
  access: {
    read: readPublished,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [computeReadingTime],
  },
  fields: [
    {
      // Non-localized stable key that pairs the tr/en versions of one article.
      // Used by the seed pipeline for idempotent upserts.
      name: 'translationKey',
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
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
      admin: {
        description: 'Per-locale URL slug. Auto-generated from the title if left blank.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
    {
      name: 'seo',
      type: 'group',
      localized: true,
      admin: {
        description: 'Per-locale SEO overrides. Falls back to title/excerpt when empty.',
      },
      fields: [
        {
          name: 'seoTitle',
          type: 'text',
        },
        {
          name: 'seoDescription',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      min: 1,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Estimated minutes, computed from content on save.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'coverStyle',
      type: 'select',
      required: true,
      defaultValue: 'aurora',
      options: COVER_STYLES.map((value) => ({ label: value, value })),
      admin: {
        position: 'sidebar',
        description: 'Gradient theme used by the generated OG/cover image.',
      },
    },
  ],
}
