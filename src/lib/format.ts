import type { Locale } from '@/i18n/config'

const LOCALE_TAG: Record<Locale, string> = {
  tr: 'tr-TR',
  en: 'en-US',
}

/** Human-readable date (e.g. "6 Temmuz 2026" / "July 6, 2026"). */
export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
