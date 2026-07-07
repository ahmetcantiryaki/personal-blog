import 'server-only'

import type { Metadata } from 'next'

import type { Locale } from '@/i18n/config'
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/config'
import type { Post } from '@/payload-types'

import { getPayloadClient } from './payload'
import { routes } from './routes'

/** Canonical site origin, trailing slash stripped. Used as metadataBase + JSON-LD ids. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(
  /\/+$/,
  '',
)

export const SITE_NAME = 'Woyable'
export const SITE_AUTHOR = 'Woyable'

/** BCP-47 / OG locale tags per app locale. */
const OG_LOCALE: Record<Locale, string> = { tr: 'tr_TR', en: 'en_US' }

/** Build an absolute URL from a site-relative path (or pass through absolutes). */
export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

/** A path for each locale where a page exists (omit a locale to drop it from hreflang). */
export type PathByLocale = Partial<Record<Locale, string>>

/**
 * Build canonical + hreflang alternates. `x-default` points at the default
 * locale (tr) when present. Only locales with a real path are emitted, so a
 * post/taxonomy missing its translation pair advertises just the locale it has.
 * The RSS feed for the current locale is attached as a typed alternate so the
 * `<link rel="alternate" type="application/rss+xml">` survives per-page overrides.
 */
function buildAlternates(current: Locale, pathByLocale: PathByLocale): Metadata['alternates'] {
  const languages: Record<string, string> = {}
  for (const locale of LOCALES) {
    const path = pathByLocale[locale]
    if (path) languages[locale] = absoluteUrl(path)
  }
  const defaultPath = pathByLocale[DEFAULT_LOCALE]
  if (defaultPath) languages['x-default'] = absoluteUrl(defaultPath)

  const canonicalPath = pathByLocale[current]
  return {
    canonical: canonicalPath ? absoluteUrl(canonicalPath) : undefined,
    languages,
    types: {
      'application/rss+xml': [{ url: absoluteUrl(routes.feed(current)), title: `${SITE_NAME} — RSS` }],
    },
  }
}

/**
 * An explicit OG/Twitter share image (e.g. a hand-drawn cover). When supplied it
 * overrides the file-based `opengraph-image` convention for this page — Next
 * gives explicit metadata images precedence. Omit it to fall back to the
 * dynamic route.
 */
export interface OgImage {
  url: string
  width: number
  height: number
  alt: string
}

interface PageMetadataInput {
  locale: Locale
  title: string
  description?: string | null
  /** Path map for canonical + hreflang. Must include at least `locale`. */
  paths: PathByLocale
  type?: 'website' | 'article'
  /** Search / auth / profile pages: keep them out of the index. */
  noindex?: boolean
  /**
   * Explicit share image. When present it is emitted as both the Open Graph and
   * Twitter image, overriding the segment's `opengraph-image` file. When absent,
   * the file-based dynamic route remains the source of the card image.
   */
  image?: OgImage
  article?: {
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
    tags?: string[]
    section?: string
  }
}

/**
 * Single source of truth for a page's `<head>` SEO: title, description,
 * canonical + hreflang, Open Graph (full object so siteName/locale never get
 * dropped by Next's shallow per-segment override), and Twitter card. OG/Twitter
 * images are supplied by the file-based `opengraph-image` in each segment.
 */
export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const { locale, title, description, paths, type = 'website', noindex, image, article } = input
  const desc = description?.trim() || undefined
  const canonical = paths[locale] ? absoluteUrl(paths[locale] as string) : undefined

  // Only attach images when an explicit one is provided; otherwise leave the
  // key unset so Next's `opengraph-image` file convention supplies the card.
  const images = image
    ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt }]
    : undefined

  const ogBase = {
    title,
    description: desc,
    url: canonical,
    siteName: SITE_NAME,
    locale: OG_LOCALE[locale],
    alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    ...(images ? { images } : {}),
  }

  const openGraph: Metadata['openGraph'] =
    type === 'article' && article
      ? {
          ...ogBase,
          type: 'article',
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          authors: article.authors,
          tags: article.tags,
          section: article.section,
        }
      : { ...ogBase, type: 'website' }

  return {
    title,
    description: desc,
    alternates: buildAlternates(locale, paths),
    robots: noindex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      ...(image ? { images: [image.url] } : {}),
    },
  }
}

// ---------------------------------------------------------------------------
// Translation-pair slug resolution (for hreflang + locale switcher parity)
// ---------------------------------------------------------------------------

/** Resolve a post's published slug in every locale via its shared translationKey. */
export async function getPostAlternateSlugs(
  translationKey: string,
): Promise<Record<Locale, string | null>> {
  const payload = await getPayloadClient()
  const alternates: Record<Locale, string | null> = { tr: null, en: null }
  await Promise.all(
    LOCALES.map(async (locale) => {
      const res = await payload.find({
        collection: 'posts',
        where: {
          and: [
            { status: { equals: 'published' } },
            { translationKey: { equals: translationKey } },
          ],
        },
        locale,
        depth: 0,
        limit: 1,
        overrideAccess: false,
        pagination: false,
      })
      alternates[locale] = res.docs[0]?.slug ?? null
    }),
  )
  return alternates
}

/**
 * Resolve a category/tag's per-locale slug. Deniz's model is a single doc with
 * a localized slug, so the same id yields the right slug in each locale.
 */
export async function getTaxonomyAlternateSlugs(
  collection: 'categories' | 'tags',
  id: number,
): Promise<Record<Locale, string | null>> {
  const payload = await getPayloadClient()
  const alternates: Record<Locale, string | null> = { tr: null, en: null }
  await Promise.all(
    LOCALES.map(async (locale) => {
      try {
        const doc = await payload.findByID({
          collection,
          id,
          locale,
          depth: 0,
          overrideAccess: false,
        })
        alternates[locale] = (doc as { slug?: string | null })?.slug ?? null
      } catch {
        alternates[locale] = null
      }
    }),
  )
  return alternates
}

/** Turn a slug map into a route-path map for the given route builder. */
export function pathsFromSlugs(
  slugs: Record<Locale, string | null>,
  build: (locale: Locale, slug: string) => string,
): PathByLocale {
  const paths: PathByLocale = {}
  for (const locale of LOCALES) {
    const slug = slugs[locale]
    if (slug) paths[locale] = build(locale, slug)
  }
  return paths
}

// ---------------------------------------------------------------------------
// Lexical → plain text (descriptions, RSS, JSON-LD fallbacks)
// ---------------------------------------------------------------------------

interface LexicalNode {
  type?: string
  text?: string
  children?: LexicalNode[]
  [k: string]: unknown
}

function collectText(node: LexicalNode, out: string[]): void {
  if (typeof node.text === 'string') out.push(node.text)
  if (Array.isArray(node.children)) {
    for (const child of node.children) collectText(child, out)
    // Paragraph / block boundary → space so words don't run together.
    out.push(' ')
  }
}

/** Flatten Payload lexical content to a trimmed, length-capped plain string. */
export function lexicalToPlainText(content: Post['content'], max = 280): string {
  if (!content?.root) return ''
  const out: string[] = []
  collectText(content.root as unknown as LexicalNode, out)
  const text = out.join('').replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}
