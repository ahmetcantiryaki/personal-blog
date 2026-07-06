import { describe, expect, it } from 'vitest'

import {
  articleJsonLd,
  breadcrumbJsonLd,
  collectionPageJsonLd,
  organizationJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from '@/lib/json-ld'

const SITE = 'http://localhost:3000'

describe('organizationJsonLd', () => {
  it('builds a schema.org Organization node', () => {
    const node = organizationJsonLd()
    expect(node['@context']).toBe('https://schema.org')
    expect(node['@type']).toBe('Organization')
    expect(node['@id']).toBe(`${SITE}/#organization`)
    expect(node.name).toBe('Woyable')
  })
})

describe('websiteJsonLd', () => {
  it('builds a WebSite node with a SearchAction', () => {
    const node = websiteJsonLd('tr', '/tr/search') as Record<string, any>
    expect(node['@type']).toBe('WebSite')
    expect(node.url).toBe(`${SITE}/tr`)
    expect(node.inLanguage).toBe('tr-TR')
    expect(node.potentialAction['@type']).toBe('SearchAction')
    expect(node.potentialAction.target.urlTemplate).toBe(
      `${SITE}/tr/search?q={search_term_string}`,
    )
    expect(node.publisher['@type']).toBe('Organization')
  })

  it('uses the en BCP-47 tag for the en locale', () => {
    const node = websiteJsonLd('en', '/en/search') as Record<string, any>
    expect(node.inLanguage).toBe('en-US')
  })
})

describe('articleJsonLd', () => {
  it('builds an Article node with optional fields included when present', () => {
    const node = articleJsonLd({
      locale: 'en',
      url: '/en/posts/how-to-build-rag-system',
      title: 'How to build a RAG system',
      description: 'A guide',
      datePublished: '2026-07-06T00:00:00.000Z',
      imageUrl: 'http://localhost:3000/img.png',
      section: 'AI',
      tags: ['rag', 'ai'],
    }) as Record<string, any>

    expect(node['@type']).toBe('Article')
    expect(node.headline).toBe('How to build a RAG system')
    expect(node.inLanguage).toBe('en-US')
    expect(node.image).toEqual(['http://localhost:3000/img.png'])
    expect(node.articleSection).toBe('AI')
    expect(node.keywords).toBe('rag, ai')
    // dateModified falls back to datePublished when not supplied.
    expect(node.dateModified).toBe('2026-07-06T00:00:00.000Z')
    expect(node.mainEntityOfPage).toBe(`${SITE}/en/posts/how-to-build-rag-system`)
  })

  it('omits image / section / keywords when absent', () => {
    const node = articleJsonLd({
      locale: 'tr',
      url: '/tr/posts/x',
      title: 'Başlık',
    }) as Record<string, any>
    expect(node).not.toHaveProperty('image')
    expect(node).not.toHaveProperty('articleSection')
    expect(node).not.toHaveProperty('keywords')
  })

  it('does not emit keywords for an empty tags array', () => {
    const node = articleJsonLd({ locale: 'tr', url: '/tr/posts/x', title: 't', tags: [] })
    expect(node).not.toHaveProperty('keywords')
  })
})

describe('breadcrumbJsonLd', () => {
  it('assigns 1-based positions and absolutizes urls', () => {
    const node = breadcrumbJsonLd([
      { name: 'Home', url: '/en' },
      { name: 'Post', url: '/en/posts/x' },
    ]) as Record<string, any>
    expect(node['@type']).toBe('BreadcrumbList')
    expect(node.itemListElement).toHaveLength(2)
    expect(node.itemListElement[0].position).toBe(1)
    expect(node.itemListElement[1].position).toBe(2)
    expect(node.itemListElement[1].item).toBe(`${SITE}/en/posts/x`)
  })
})

describe('collectionPageJsonLd', () => {
  it('builds a CollectionPage tied to the website node', () => {
    const node = collectionPageJsonLd({
      locale: 'tr',
      url: '/tr/category/yapay-zeka',
      name: 'Yapay Zeka',
      description: 'AI posts',
    }) as Record<string, any>
    expect(node['@type']).toBe('CollectionPage')
    expect(node.url).toBe(`${SITE}/tr/category/yapay-zeka`)
    expect(node.isPartOf['@id']).toBe(`${SITE}/#website`)
  })
})

describe('serializeJsonLd (XSS hardening)', () => {
  it('escapes <, >, & so JSON-LD cannot break out of a <script>', () => {
    const out = serializeJsonLd({ headline: '</script><script>alert(1)&more</script>' })
    expect(out).not.toContain('</script>')
    expect(out).not.toContain('<')
    expect(out).not.toContain('>')
    expect(out).toContain('\\u003c') // <
    expect(out).toContain('\\u003e') // >
    expect(out).toContain('\\u0026') // &
  })

  it('escapes U+2028 / U+2029 line separators', () => {
    const ls = String.fromCharCode(0x2028)
    const ps = String.fromCharCode(0x2029)
    const out = serializeJsonLd({ text: `a${ls}b${ps}c` })
    expect(out).toContain('\\u2028')
    expect(out).toContain('\\u2029')
    expect(out).not.toContain(ls)
    expect(out).not.toContain(ps)
  })

  it('round-trips to valid JSON after escaping', () => {
    const payload = { headline: 'Tom & Jerry <b>', nested: { x: 1 } }
    const out = serializeJsonLd(payload)
    expect(JSON.parse(out)).toEqual(payload)
  })

  it('leaves safe content untouched structurally', () => {
    const out = serializeJsonLd({ name: 'Woyable' })
    expect(JSON.parse(out)).toEqual({ name: 'Woyable' })
  })
})
