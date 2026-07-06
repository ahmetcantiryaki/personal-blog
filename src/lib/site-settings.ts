import 'server-only'

import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import type { SiteSetting } from '@/payload-types'

import { getPayloadClient } from './payload'

export interface ResolvedSiteSettings {
  siteName: string
  tagline: string
  footerText: string
  socialLinks: { label: string; url: string }[]
}

/**
 * Read the siteSettings global, falling back to dictionary defaults when the
 * global is empty (it may be unconfigured in some environments).
 */
export async function getSiteSettings(locale: Locale): Promise<ResolvedSiteSettings> {
  const dict = getDictionary(locale)
  let global: SiteSetting | null = null

  try {
    const payload = await getPayloadClient()
    global = await payload.findGlobal({ slug: 'siteSettings', locale, depth: 0 })
  } catch {
    global = null
  }

  const socialLinks = Array.isArray(global?.socialLinks)
    ? global.socialLinks
        .filter((l) => l.label && l.url)
        .map((l) => ({ label: l.label, url: l.url }))
    : []

  return {
    siteName: global?.siteName?.trim() || dict.siteName,
    tagline: global?.tagline?.trim() || dict.tagline,
    footerText: global?.footerText?.trim() || dict.footer.builtWith,
    socialLinks,
  }
}
