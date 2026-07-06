import type { GlobalConfig } from 'payload'

import { isAdmin, isPublic } from '@/access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: isPublic,
    update: isAdmin,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      localized: true,
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'footerText',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
