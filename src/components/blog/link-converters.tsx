import type { SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'
import type { JSX, ReactNode } from 'react'

/**
 * JSX converters for the lexical `link` / `autolink` nodes.
 *
 * The library default renders every link's `target`/`rel` from the stored
 * `newTab` flag, which does not reflect the reader-retention rule we want: keep
 * readers on the site for INTERNAL destinations, and only spend a new tab on
 * EXTERNAL ones. So we override link rendering to decide purely from the href:
 *
 *   - INTERNAL  (root-relative `/…`, a fragment/query, or an absolute URL whose
 *               host is woyable.com / `NEXT_PUBLIC_SERVER_URL`): SAME tab. Absolute
 *               same-site URLs are normalized down to a relative path and rendered
 *               through `next/link` so navigation stays client-side.
 *   - EXTERNAL  (any other http(s) host): NEW tab via `target="_blank"` plus
 *               `rel="noopener noreferrer"` (avoids `window.opener` hijacking and
 *               referrer leakage).
 *
 * Non-http schemes (`mailto:`, `tel:`, …) are left untouched in the same tab —
 * a new tab is meaningless for them.
 */

/** Fields carried by a lexical link/autolink node (mirrors `LinkFields`). */
interface LinkFields {
  url?: string
  newTab?: boolean
  linkType?: 'custom' | 'internal'
  doc?: unknown
}

interface LinkNode extends SerializedLexicalNode {
  fields: LinkFields
  children?: SerializedLexicalNode[]
}

type NodesToJSX = (args: { nodes: SerializedLexicalNode[] }) => ReactNode

interface ConverterArgs {
  node: LinkNode
  nodesToJSX: NodesToJSX
}

/** Hosts that count as "this site" — same-tab, client-side navigation. */
const hostOf = (value: string | undefined): string | undefined => {
  if (!value) return undefined
  try {
    return new URL(value).host
  } catch {
    return undefined
  }
}

const SITE_HOSTS = new Set(
  ['woyable.com', 'www.woyable.com', hostOf(process.env.NEXT_PUBLIC_SERVER_URL)].filter(
    (host): host is string => Boolean(host),
  ),
)

export interface ClassifiedHref {
  /** The href to render — same-site absolute URLs are stripped to a relative path. */
  href: string
  /** Whether the link points off-site and should open in a new tab. */
  isExternal: boolean
}

/**
 * Classify a raw href as internal (same tab) or external (new tab), normalizing
 * same-site absolute URLs to a relative path so client-side navigation works.
 */
export function classifyLinkHref(rawHref: string | undefined): ClassifiedHref {
  const href = (rawHref ?? '').trim()
  if (!href) return { href: '#', isExternal: false }

  // Root-relative, fragment, or query-only links are always internal.
  if (href.startsWith('#') || href.startsWith('?')) return { href, isExternal: false }
  // Root-relative but NOT protocol-relative (`//host`).
  if (href.startsWith('/') && !href.startsWith('//')) return { href, isExternal: false }

  // Non-http(s) schemes (mailto:, tel:, …) stay in the same tab.
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) && !/^https?:/i.test(href)) {
    return { href, isExternal: false }
  }

  try {
    const url = new URL(href.startsWith('//') ? `https:${href}` : href)
    if (SITE_HOSTS.has(url.host)) {
      const relative = `${url.pathname}${url.search}${url.hash}`
      return { href: relative || '/', isExternal: false }
    }
    return { href, isExternal: true }
  } catch {
    // A relative path without a leading slash (e.g. `posts/foo`) — treat as internal.
    return { href, isExternal: false }
  }
}

function LinkConverter({ node, nodesToJSX }: ConverterArgs): JSX.Element {
  const children = nodesToJSX({ nodes: node.children ?? [] })
  const { href, isExternal } = classifyLinkHref(node.fields.url)

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return <Link href={href}>{children}</Link>
}

export const linkJSXConverters = {
  link: LinkConverter,
  autolink: LinkConverter,
}
