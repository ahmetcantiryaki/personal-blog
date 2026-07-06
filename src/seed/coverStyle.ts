import { COVER_STYLES } from '@/collections/Posts'

export type CoverStyle = (typeof COVER_STYLES)[number]

/**
 * Deterministically pick a cover style from the article's translationKey so
 * covers vary across the catalogue without any per-article configuration. A
 * stable string hash keeps the same key mapping to the same style on every run.
 */
export const coverStyleForKey = (translationKey: string): CoverStyle => {
  let hash = 0
  for (let i = 0; i < translationKey.length; i += 1) {
    hash = (hash * 31 + translationKey.charCodeAt(i)) >>> 0
  }
  return COVER_STYLES[hash % COVER_STYLES.length]
}
