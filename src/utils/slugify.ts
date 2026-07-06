/**
 * Turn an arbitrary string into a URL-safe slug.
 * Handles Turkish-specific characters before the generic transliteration so
 * that e.g. "Yazılım Günü" → "yazilim-gunu".
 */
const TR_MAP: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  İ: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
}

export const slugify = (input: string): string => {
  if (!input) return ''

  const lowered = input
    .trim()
    .toLowerCase()
    .replace(/[çğıİöşü]/g, (ch) => TR_MAP[ch] ?? ch)

  return lowered
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip remaining diacritics
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumerics → hyphen
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
    .replace(/-{2,}/g, '-') // collapse repeats
}
