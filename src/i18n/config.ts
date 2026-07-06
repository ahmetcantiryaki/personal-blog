/** Locale configuration for the frontend. Mirrors Payload's localization. */
export const LOCALES = ['tr', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'tr'

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value)

/** Human labels for the locale switcher. */
export const LOCALE_LABELS: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
}

/** Short labels (used in compact switchers). */
export const LOCALE_SHORT: Record<Locale, string> = {
  tr: 'TR',
  en: 'EN',
}
