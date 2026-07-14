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

/**
 * Non-negative integer coercion for user-facing counts: NaN, negatives and
 * fractions collapse to a safe truncated integer (never below 0).
 */
function toSafeCount(n: number): number {
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 0
}

/**
 * Compact, locale-aware count for badges (e.g. 1200 → "1,2 B" in tr, "1.2K" in
 * en). Small numbers render in full. Negative/NaN inputs clamp to "0".
 */
export function formatCompactCount(n: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(toSafeCount(n))
}

/** Full grouped count for accessible labels (e.g. 1240 → "1.240" / "1,240"). */
export function formatFullCount(n: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale]).format(toSafeCount(n))
}
