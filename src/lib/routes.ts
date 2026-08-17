import type { Locale } from '@/i18n/config'

/** Centralized URL builders so locale prefixes stay consistent everywhere. */
export const routes = {
  home: (locale: Locale) => `/${locale}`,
  post: (locale: Locale, slug: string) => `/${locale}/posts/${slug}`,
  category: (locale: Locale, slug: string) => `/${locale}/category/${slug}`,
  tag: (locale: Locale, slug: string) => `/${locale}/tag/${slug}`,
  search: (locale: Locale, q?: string) =>
    q ? `/${locale}/search?q=${encodeURIComponent(q)}` : `/${locale}/search`,
  about: (locale: Locale) => `/${locale}/about`,
  tools: (locale: Locale) => `/${locale}/tools`,
  login: (locale: Locale, returnTo?: string) =>
    returnTo ? `/${locale}/login?returnTo=${encodeURIComponent(returnTo)}` : `/${locale}/login`,
  register: (locale: Locale, returnTo?: string) =>
    returnTo
      ? `/${locale}/register?returnTo=${encodeURIComponent(returnTo)}`
      : `/${locale}/register`,
  profile: (locale: Locale) => `/${locale}/profile`,
  feed: (locale: Locale) => `/${locale}/feed.xml`,
} as const
