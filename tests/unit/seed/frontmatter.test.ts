import { describe, expect, it } from 'vitest'

import { frontMatterSchema, parseArticle } from '@/seed/frontmatter'

describe('frontMatterSchema', () => {
  it('accepts a minimal valid front-matter and applies defaults', () => {
    const parsed = frontMatterSchema.parse({
      translationKey: 'rag-system',
      title: 'RAG Sistemi',
    })
    expect(parsed.status).toBe('published') // default
    expect(parsed.tags).toEqual([]) // default
  })

  it('rejects missing translationKey / title', () => {
    expect(() => frontMatterSchema.parse({ title: 'x' })).toThrow()
    expect(() => frontMatterSchema.parse({ translationKey: 'k' })).toThrow()
  })

  it('rejects an unknown status enum value', () => {
    expect(() =>
      frontMatterSchema.parse({ translationKey: 'k', title: 't', status: 'archived' }),
    ).toThrow()
  })

  it('rejects an unknown coverStyle', () => {
    expect(() =>
      frontMatterSchema.parse({ translationKey: 'k', title: 't', coverStyle: 'sunset' }),
    ).toThrow()
  })

  it('normalizes a Date publishedAt to an ISO string', () => {
    const date = new Date('2026-07-06T00:00:00.000Z')
    const parsed = frontMatterSchema.parse({
      translationKey: 'k',
      title: 't',
      publishedAt: date,
    })
    expect(parsed.publishedAt).toBe(date.toISOString())
  })

  it('passes through a string publishedAt', () => {
    const parsed = frontMatterSchema.parse({
      translationKey: 'k',
      title: 't',
      publishedAt: '2026-01-01',
    })
    expect(parsed.publishedAt).toBe('2026-01-01')
  })

  it('trims string fields', () => {
    const parsed = frontMatterSchema.parse({ translationKey: '  k  ', title: '  t  ' })
    expect(parsed.translationKey).toBe('k')
    expect(parsed.title).toBe('t')
  })
})

describe('parseArticle', () => {
  it('resolves the slug from an explicit slug field (slugified)', () => {
    const article = parseArticle(
      'en',
      { translationKey: 'rag', title: 'Ignored Title', slug: 'How To Build RAG' },
      '# body',
    )
    expect(article.resolvedSlug).toBe('how-to-build-rag')
    expect(article.locale).toBe('en')
    expect(article.markdown).toBe('# body')
  })

  it('derives the slug from the title when no slug is given', () => {
    const article = parseArticle('tr', { translationKey: 'rag', title: 'RAG Sistemi Nasıl' }, 'x')
    expect(article.resolvedSlug).toBe('rag-sistemi-nasil')
  })

  it('throws on invalid raw front-matter', () => {
    expect(() => parseArticle('tr', { title: 'no key' }, 'x')).toThrow()
  })
})
