import type { Payload } from 'payload'

import { LOCALES } from './frontmatter'

interface LocalizedSiteCopy {
  siteName: string
  tagline: string
  footerText: string
}

const SITE_COPY: Record<(typeof LOCALES)[number], LocalizedSiteCopy> = {
  tr: {
    siteName: 'Woyable',
    tagline: 'Yazılım, yapay zeka ve modern web üzerine derinlemesine rehberler',
    footerText: 'Woyable — yazılım, yapay zeka ve modern web üzerine derinlemesine rehberler.',
  },
  en: {
    siteName: 'Woyable',
    tagline: 'In-depth guides on software, AI, and the modern web',
    footerText: 'Woyable — in-depth guides on software, AI, and the modern web.',
  },
}

const SOCIAL_LINKS: { label: string; url: string }[] = []

/**
 * Idempotently populate the siteSettings global with localized copy and social
 * links. Globals are singletons, so updating per locale is naturally repeatable.
 */
export const seedSiteSettings = async (payload: Payload): Promise<void> => {
  for (const locale of LOCALES) {
    const copy = SITE_COPY[locale]
    await payload.updateGlobal({
      slug: 'siteSettings',
      locale,
      data: {
        siteName: copy.siteName,
        tagline: copy.tagline,
        footerText: copy.footerText,
        // socialLinks is non-localized; set once (the last write wins identically).
        socialLinks: SOCIAL_LINKS,
      },
      overrideAccess: true,
    })
  }
  payload.logger.info('seed: siteSettings populated (tr + en)')
}
