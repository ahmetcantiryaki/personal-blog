import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/roles'

/** Writes never happen through the Payload API — always denied here. */
const deny = () => false

/**
 * Aggregated page-view counters. One row per (path, date-day).
 * Increments happen exclusively through `POST /api/track`, which performs a
 * race-tolerant SQL upsert with access overridden. The Payload API exposes
 * read to admins only and blocks all writes.
 */
export const PageViews: CollectionConfig = {
  slug: 'pageViews',
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'date', 'count', 'post'],
    group: 'Analytics',
  },
  access: {
    read: isAdmin,
    create: deny,
    update: deny,
    delete: deny,
  },
  indexes: [
    {
      fields: ['path', 'date'],
      unique: true,
    },
  ],
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      // Nullable: non-post pages (home, category, etc.) are tracked too.
      index: true,
    },
    {
      name: 'path',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'count',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 0,
    },
  ],
}
