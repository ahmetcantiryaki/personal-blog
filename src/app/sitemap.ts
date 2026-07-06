import type { MetadataRoute } from 'next'
import type { Where } from 'payload'

import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config'
import { logger } from '@/lib/logger'
import { getPayloadClient } from '@/lib/payload'
import { absoluteUrl } from '@/lib/seo'
import { routes } from '@/lib/routes'

export const revalidate = 300

/** Retry a DB-backed loader a few times to ride out a transient pooler blip. */
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 400 * (i + 1)))
    }
  }
  throw lastError
}

interface SlugDoc {
  slug?: string | null
  updatedAt: string
  translationKey?: string | null
  id: number
}

type PerLocale = Partial<Record<Locale, { slug: string; updatedAt: string }>>

/** Build the hreflang `languages` map (incl. x-default → tr) for a grouped entry. */
function languagesFor(
  perLocale: PerLocale,
  build: (locale: Locale, slug: string) => string,
): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of LOCALES) {
    const data = perLocale[locale]
    if (data) languages[locale] = absoluteUrl(build(locale, data.slug))
  }
  const def = perLocale[DEFAULT_LOCALE]
  if (def) languages['x-default'] = absoluteUrl(build(DEFAULT_LOCALE, def.slug))
  return languages
}

/**
 * Group a collection's docs across locales (posts pair via translationKey;
 * categories/tags are one doc so they pair via id) and emit one sitemap entry
 * per existing locale, each carrying the full hreflang alternates set.
 */
async function collectionEntries(
  collection: 'posts' | 'categories' | 'tags',
  keyOf: (doc: SlugDoc) => string | number,
  build: (locale: Locale, slug: string) => string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
  where?: Where,
): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const grouped = new Map<string | number, PerLocale>()

  for (const locale of LOCALES) {
    const res = await payload.find({
      collection,
      locale,
      depth: 0,
      limit: 1000,
      pagination: false,
      overrideAccess: false,
      where,
    })
    for (const raw of res.docs) {
      const doc = raw as unknown as SlugDoc
      if (!doc.slug) continue
      const key = keyOf(doc)
      const existing = grouped.get(key) ?? {}
      existing[locale] = { slug: doc.slug, updatedAt: doc.updatedAt }
      grouped.set(key, existing)
    }
  }

  const entries: MetadataRoute.Sitemap = []
  for (const perLocale of grouped.values()) {
    const languages = languagesFor(perLocale, build)
    for (const locale of LOCALES) {
      const data = perLocale[locale]
      if (!data) continue
      entries.push({
        url: absoluteUrl(build(locale, data.slug)),
        lastModified: new Date(data.updatedAt),
        changeFrequency,
        priority,
        alternates: { languages },
      })
    }
  }
  return entries
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const homeLanguages: Record<string, string> = {
    ...Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(routes.home(l))])),
    'x-default': absoluteUrl(routes.home(DEFAULT_LOCALE)),
  }
  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    {
      url: absoluteUrl(routes.home(locale)),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    {
      url: absoluteUrl(routes.about(locale)),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          ...Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(routes.about(l))])),
          'x-default': absoluteUrl(routes.about(DEFAULT_LOCALE)),
        },
      },
    },
  ])

  try {
    const [posts, categories, tags] = await withRetry(() =>
      Promise.all([
        collectionEntries(
          'posts',
          (doc) => doc.translationKey ?? doc.id,
          routes.post,
          'weekly',
          0.8,
          { status: { equals: 'published' } },
        ),
        collectionEntries('categories', (doc) => doc.id, routes.category, 'monthly', 0.5),
        collectionEntries('tags', (doc) => doc.id, routes.tag, 'monthly', 0.4),
      ]),
    )
    return [...staticEntries, ...posts, ...categories, ...tags]
  } catch (error) {
    logger.error('sitemap: failed to load collections', { err: String(error) })
    return staticEntries
  }
}
