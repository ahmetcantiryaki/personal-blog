import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

/**
 * Allow crawling of content; keep admin, APIs and per-user / stateful routes
 * out of the index. Wildcard locale segments cover both `tr` and `en`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api/',
        '/*/profile',
        '/*/login',
        '/*/register',
        '/*/search',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
