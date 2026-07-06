import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/config'

/**
 * Negotiate the preferred site locale from an `Accept-Language` header.
 *
 * Parses the header into weighted language tags (respecting `q=` quality
 * values), then returns the first supported locale by descending preference.
 * If English is preferred over Turkish, returns `en`; otherwise (Turkish
 * preferred, an unsupported language, or a missing/empty header) falls back to
 * the site default (`tr`), which is also the canonical `x-default`.
 *
 * Edge-safe: pure string parsing with no Node APIs, usable from `proxy.ts`.
 */
export function preferredLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const qParam = params.find((p) => p.trim().startsWith('q='))
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1
      return { base: tag.trim().toLowerCase().split('-')[0], q: Number.isFinite(q) ? q : 0 }
    })
    .filter((entry) => entry.base.length > 0)
    // Stable sort by descending quality; ties keep header order (en before tr).
    .sort((a, b) => b.q - a.q)

  for (const { base } of ranked) {
    if (isLocale(base)) return base
  }
  return DEFAULT_LOCALE
}
