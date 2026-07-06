import type { Locale } from '@/i18n/config'

import { absoluteUrl, SITE_AUTHOR, SITE_NAME, SITE_URL } from './seo'

/** A minimal structural type for JSON-LD graph nodes. */
export type JsonLdNode = Record<string, unknown>

/**
 * Characters that must be escaped so JSON-LD can't break out of a `<script>`:
 * the HTML-significant `<` `>` `&`, plus the JS line/paragraph separators
 * (U+2028 / U+2029) which are valid in JSON strings but break inline scripts.
 * Built via `RegExp` from a string so the separators stay as escapes (a literal
 * regex can't contain real line terminators).
 */
const UNSAFE = new RegExp('[<>&\\u2028\\u2029]', 'g')

function escapeChar(char: string): string {
  return `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
}

/**
 * Serialize JSON-LD safely for inline `<script>` embedding. Prevents stored-XSS
 * via post content (titles, excerpts) flowing into JSON-LD.
 */
export function serializeJsonLd(data: JsonLdNode): string {
  return JSON.stringify(data).replace(UNSAFE, escapeChar)
}

const BCP47: Record<Locale, string> = { tr: 'tr-TR', en: 'en-US' }

/** The publishing Organization, reused as author/publisher across schemas. */
function organization(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
  }
}

/** Site-wide Organization node (root layout). */
export function organizationJsonLd(): JsonLdNode {
  return { '@context': 'https://schema.org', ...organization() }
}

/** WebSite + SearchAction for the home page. */
export function websiteJsonLd(locale: Locale, searchUrl: string): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: absoluteUrl(`/${locale}`),
    name: SITE_NAME,
    inLanguage: BCP47[locale],
    publisher: organization(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl(searchUrl)}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

interface ArticleInput {
  locale: Locale
  url: string
  title: string
  description?: string
  datePublished?: string
  dateModified?: string
  imageUrl?: string
  section?: string
  tags?: string[]
}

/** Article schema for a post detail page. */
export function articleJsonLd(input: ArticleInput): JsonLdNode {
  const url = absoluteUrl(input.url)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: input.title,
    description: input.description,
    inLanguage: BCP47[input.locale],
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    ...(input.imageUrl ? { image: [input.imageUrl] } : {}),
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.tags && input.tags.length ? { keywords: input.tags.join(', ') } : {}),
    author: { '@type': 'Organization', name: SITE_AUTHOR, url: SITE_URL },
    publisher: organization(),
  }
}

export interface Crumb {
  name: string
  url: string
}

/** BreadcrumbList from an ordered list of crumbs (relative or absolute urls). */
export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.url),
    })),
  }
}

interface CollectionInput {
  locale: Locale
  url: string
  name: string
  description?: string
}

/** CollectionPage schema for category / tag listing pages. */
export function collectionPageJsonLd(input: CollectionInput): JsonLdNode {
  const url = absoluteUrl(input.url)
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: BCP47[input.locale],
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: organization(),
  }
}
