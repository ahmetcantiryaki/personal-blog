import type { SeedLocale } from './frontmatter'

/** Localized presentation of one taxonomy term. */
export interface LocalizedTerm {
  title: string
  slug: string
}

/** A canonical taxonomy entry: one stable `key` with a localized term per locale. */
export interface TaxonomyEntry {
  key: string
  locales: Record<SeedLocale, LocalizedTerm>
}

/**
 * Canonical category mapping. Article front-matter references a category by its
 * stable `key`; the localized title + slug live here so the seed creates ONE
 * category doc per key carrying both locale rows (never separate docs per
 * locale). This keeps tr/en slugs paired for hreflang.
 */
export const CATEGORIES: readonly TaxonomyEntry[] = [
  {
    key: 'ai',
    locales: {
      tr: { title: 'Yapay Zeka', slug: 'yapay-zeka' },
      en: { title: 'AI', slug: 'ai' },
    },
  },
  {
    key: 'web-development',
    locales: {
      tr: { title: 'Web Geliştirme', slug: 'web-gelistirme' },
      en: { title: 'Web Development', slug: 'web-development' },
    },
  },
  {
    key: 'software-engineering',
    locales: {
      tr: { title: 'Yazılım Mühendisliği', slug: 'yazilim-muhendisligi' },
      en: { title: 'Software Engineering', slug: 'software-engineering' },
    },
  },
  {
    key: 'devops-cloud',
    locales: {
      tr: { title: 'DevOps & Bulut', slug: 'devops-bulut' },
      en: { title: 'DevOps & Cloud', slug: 'devops-cloud' },
    },
  },
  {
    key: 'career-productivity',
    locales: {
      tr: { title: 'Kariyer & Üretkenlik', slug: 'kariyer-uretkenlik' },
      en: { title: 'Career & Productivity', slug: 'career-productivity' },
    },
  },
] as const

export const CATEGORY_KEYS: ReadonlySet<string> = new Set(CATEGORIES.map((c) => c.key))
