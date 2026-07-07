import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createFakePayload, findResult, type FakePayload } from '../helpers/payload-mock'

const fake: FakePayload = createFakePayload()
vi.mock('@/lib/payload', () => ({ getPayloadClient: async () => fake }))

import {
  absoluteUrl,
  buildPageMetadata,
  getPostAlternateSlugs,
  getTaxonomyAlternateSlugs,
  lexicalToPlainText,
  pathsFromSlugs,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo'
import { routes } from '@/lib/routes'

const SITE = 'http://localhost:3000'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('SITE constants', () => {
  it('defaults SITE_URL to localhost and strips trailing slash', () => {
    expect(SITE_URL).toBe(SITE)
    expect(SITE_NAME).toBe('Woyable')
  })
})

describe('absoluteUrl', () => {
  it('prefixes a site-relative path', () => {
    expect(absoluteUrl('/tr/posts/x')).toBe(`${SITE}/tr/posts/x`)
  })
  it('adds a slash when the path is missing one', () => {
    expect(absoluteUrl('tr')).toBe(`${SITE}/tr`)
  })
  it('passes absolute http(s) urls through unchanged', () => {
    expect(absoluteUrl('https://example.com/a')).toBe('https://example.com/a')
  })
  it('returns SITE_URL for an empty path', () => {
    expect(absoluteUrl('')).toBe(SITE)
  })
})

describe('buildPageMetadata', () => {
  it('builds canonical + hreflang alternates including x-default', () => {
    const meta = buildPageMetadata({
      locale: 'tr',
      title: 'Başlık',
      description: '  A description  ',
      paths: { tr: '/tr/posts/a', en: '/en/posts/b' },
    })
    const alt = meta.alternates as any
    expect(alt.canonical).toBe(`${SITE}/tr/posts/a`)
    expect(alt.languages.tr).toBe(`${SITE}/tr/posts/a`)
    expect(alt.languages.en).toBe(`${SITE}/en/posts/b`)
    expect(alt.languages['x-default']).toBe(`${SITE}/tr/posts/a`)
    // trimmed description
    expect(meta.description).toBe('A description')
  })

  it('attaches the RSS feed as a typed alternate for the current locale', () => {
    const meta = buildPageMetadata({ locale: 'en', title: 't', paths: { en: '/en' } })
    const alt = meta.alternates as any
    expect(alt.types['application/rss+xml'][0].url).toBe(`${SITE}${routes.feed('en')}`)
  })

  it('omits a locale from hreflang when it has no path (no en x-default)', () => {
    const meta = buildPageMetadata({ locale: 'en', title: 't', paths: { en: '/en/posts/b' } })
    const alt = meta.alternates as any
    expect(alt.languages.tr).toBeUndefined()
    expect(alt.languages['x-default']).toBeUndefined()
    expect(alt.canonical).toBe(`${SITE}/en/posts/b`)
  })

  it('sets noindex robots when requested', () => {
    const meta = buildPageMetadata({ locale: 'tr', title: 't', paths: { tr: '/tr/search' }, noindex: true })
    expect(meta.robots).toMatchObject({ index: false, follow: false })
  })

  it('defaults to indexable website open-graph', () => {
    const meta = buildPageMetadata({ locale: 'tr', title: 't', paths: { tr: '/tr' } })
    expect(meta.robots).toMatchObject({ index: true, follow: true })
    expect((meta.openGraph as any).type).toBe('website')
  })

  it('emits explicit OG + Twitter images when a cover image is supplied', () => {
    const meta = buildPageMetadata({
      locale: 'tr',
      title: 'Kapaklı yazı',
      paths: { tr: '/tr/posts/x' },
      type: 'article',
      image: {
        url: `${SITE}/covers/build-rag-system.jpg`,
        width: 1344,
        height: 768,
        alt: 'Kapaklı yazı',
      },
    })
    const og = meta.openGraph as any
    expect(og.images).toEqual([
      { url: `${SITE}/covers/build-rag-system.jpg`, width: 1344, height: 768, alt: 'Kapaklı yazı' },
    ])
    const tw = meta.twitter as any
    expect(tw.images).toEqual([`${SITE}/covers/build-rag-system.jpg`])
  })

  it('omits images entirely when no cover is supplied (falls back to opengraph-image file)', () => {
    const meta = buildPageMetadata({
      locale: 'tr',
      title: 'Kapaksız yazı',
      paths: { tr: '/tr/posts/y' },
      type: 'article',
    })
    expect((meta.openGraph as any).images).toBeUndefined()
    expect((meta.twitter as any).images).toBeUndefined()
  })

  it('builds an article open-graph with article metadata', () => {
    const meta = buildPageMetadata({
      locale: 'en',
      title: 'Post',
      paths: { en: '/en/posts/x' },
      type: 'article',
      article: {
        publishedTime: '2026-07-06',
        authors: ['Woyable'],
        tags: ['ai'],
        section: 'AI',
      },
    })
    const og = meta.openGraph as any
    expect(og.type).toBe('article')
    expect(og.publishedTime).toBe('2026-07-06')
    expect(og.section).toBe('AI')
    expect(og.locale).toBe('en_US')
    expect(og.alternateLocale).toContain('tr_TR')
  })
})

describe('pathsFromSlugs', () => {
  it('maps present slugs through a route builder and drops nulls', () => {
    const paths = pathsFromSlugs({ tr: 'a', en: null }, routes.post)
    expect(paths).toEqual({ tr: '/tr/posts/a' })
  })
})

describe('lexicalToPlainText', () => {
  const doc = (text: string) => ({
    root: { type: 'root', children: [{ type: 'paragraph', children: [{ text }] }] },
  })

  it('returns empty string for empty content', () => {
    expect(lexicalToPlainText(null as any)).toBe('')
    expect(lexicalToPlainText({ root: undefined } as any)).toBe('')
  })

  it('flattens nested lexical text nodes', () => {
    expect(lexicalToPlainText(doc('Hello world') as any)).toBe('Hello world')
  })

  it('collapses whitespace and truncates with an ellipsis at the cap', () => {
    const long = 'word '.repeat(100)
    const out = lexicalToPlainText(doc(long) as any, 40)
    expect(out.length).toBeLessThanOrEqual(40)
    expect(out.endsWith('…')).toBe(true)
  })
})

describe('getPostAlternateSlugs (mocked payload)', () => {
  it('resolves the published slug per locale', async () => {
    fake.find
      .mockResolvedValueOnce(findResult([{ slug: 'rag-sistemi-nasil-kurulur' }])) // tr
      .mockResolvedValueOnce(findResult([{ slug: 'how-to-build-rag-system' }])) // en
    const slugs = await getPostAlternateSlugs('rag-system')
    expect(slugs.tr).toBe('rag-sistemi-nasil-kurulur')
    expect(slugs.en).toBe('how-to-build-rag-system')
  })

  it('yields null for a locale with no translation', async () => {
    fake.find.mockResolvedValue(findResult([]))
    const slugs = await getPostAlternateSlugs('missing')
    expect(slugs).toEqual({ tr: null, en: null })
  })
})

describe('getTaxonomyAlternateSlugs (mocked payload)', () => {
  it('resolves per-locale slugs via findByID', async () => {
    fake.findByID
      .mockResolvedValueOnce({ slug: 'yapay-zeka' })
      .mockResolvedValueOnce({ slug: 'ai' })
    const slugs = await getTaxonomyAlternateSlugs('categories', 1)
    expect(slugs.tr).toBe('yapay-zeka')
    expect(slugs.en).toBe('ai')
  })

  it('returns null for a locale when findByID throws', async () => {
    fake.findByID.mockRejectedValue(new Error('not found'))
    const slugs = await getTaxonomyAlternateSlugs('tags', 999)
    expect(slugs).toEqual({ tr: null, en: null })
  })
})
