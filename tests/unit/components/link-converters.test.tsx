import { Fragment, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { classifyLinkHref, linkJSXConverters } from '@/components/blog/link-converters'

/**
 * Unit test for the lexical link JSX converters (the reader-retention link
 * behaviour the post renderer emits for `link` / `autolink` nodes).
 *
 * The rule under test: INTERNAL links (root-relative `/…` or an absolute URL on
 * woyable.com / NEXT_PUBLIC_SERVER_URL) render in the SAME tab, without
 * `target="_blank"`; EXTERNAL links render in a NEW tab with `target="_blank"`
 * and `rel="noopener noreferrer"`. We assert the lexical-node → HTML half by
 * feeding synthetic link nodes shaped like the real serialized lexical output.
 */

/** A lexical node the converters accept. */
interface LexicalNode {
  type: string
  children?: LexicalNode[]
  [key: string]: unknown
}

const text = (value: string): LexicalNode => ({ type: 'text', text: value })

/** Recursive renderer mirroring RichText's `nodesToJSX`: text nodes render as
 *  plain text, link node types delegate back to the converters under test. */
const nodesToJSX = ({ nodes }: { nodes?: LexicalNode[] }): ReactNode =>
  (nodes ?? []).map((node, index) => {
    if (node.type === 'text') return <Fragment key={index}>{String(node.text ?? '')}</Fragment>
    const converter = linkJSXConverters[node.type as keyof typeof linkJSXConverters]
    if (!converter) return null
    return <Fragment key={index}>{converter({ node: node as never, nodesToJSX })}</Fragment>
  })

const linkNode = (url: string, label = 'link', type = 'link'): LexicalNode => ({
  type,
  fields: { url, linkType: 'custom', newTab: false },
  children: [text(label)],
})

const render = (node: LexicalNode): string =>
  renderToStaticMarkup(<>{nodesToJSX({ nodes: [node] })}</>)

describe('linkJSXConverters', () => {
  it('renders an internal root-relative link in the same tab (no target/rel)', () => {
    const html = render(linkNode('/tr/posts/some-post', 'İç bağlantı'))

    expect(html).toContain('href="/tr/posts/some-post"')
    expect(html).not.toContain('target="_blank"')
    expect(html).not.toContain('noopener')
    expect(html).toContain('İç bağlantı')
  })

  it('renders an external link in a new tab with rel="noopener noreferrer"', () => {
    const html = render(linkNode('https://code.claude.com/docs/en/changelog', 'changelog'))

    expect(html).toContain('href="https://code.claude.com/docs/en/changelog"')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
    expect(html).toContain('changelog')
  })

  it('treats an absolute woyable.com URL as internal and strips it to a relative path', () => {
    const html = render(linkNode('https://woyable.com/tr/about', 'hakkında'))

    expect(html).toContain('href="/tr/about"')
    expect(html).not.toContain('target="_blank"')
    expect(html).not.toContain('woyable.com')
  })

  it('applies the same rule to autolink nodes', () => {
    const html = render(linkNode('https://resources.anthropic.com', 'source', 'autolink'))

    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  describe('classifyLinkHref', () => {
    it('classifies root-relative and fragment links as internal', () => {
      expect(classifyLinkHref('/tr/posts/x')).toEqual({ href: '/tr/posts/x', isExternal: false })
      expect(classifyLinkHref('#section')).toEqual({ href: '#section', isExternal: false })
    })

    it('classifies off-site http(s) hosts as external', () => {
      expect(classifyLinkHref('https://example.com/a')).toEqual({
        href: 'https://example.com/a',
        isExternal: true,
      })
    })

    it('normalizes same-site absolute URLs to a relative path (same tab)', () => {
      const result = classifyLinkHref('https://www.woyable.com/en/category/ai?q=1#top')
      expect(result).toEqual({ href: '/en/category/ai?q=1#top', isExternal: false })
    })

    it('leaves non-http schemes (mailto/tel) in the same tab', () => {
      expect(classifyLinkHref('mailto:hi@woyable.com').isExternal).toBe(false)
      expect(classifyLinkHref('tel:+123').isExternal).toBe(false)
    })

    it('falls back to "#" for an empty href', () => {
      expect(classifyLinkHref(undefined)).toEqual({ href: '#', isExternal: false })
    })
  })
})
