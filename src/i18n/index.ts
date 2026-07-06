import type { Locale } from './config'
import { en } from './dictionaries/en'
import { tr, type Dictionary } from './dictionaries/tr'

const DICTIONARIES: Record<Locale, Dictionary> = { tr, en }

/** Return the full UI string dictionary for a locale. Synchronous, no I/O. */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale]
}

export type { Dictionary } from './dictionaries/tr'
