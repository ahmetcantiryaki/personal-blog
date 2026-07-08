import { describe, expect, it } from 'vitest'

import {
  buildPostUpdates,
  postMetadataSchema,
  toDateInputValue,
  type PostMetadataOriginal,
} from '@/lib/panel/post-schema'

const baseOriginal: PostMetadataOriginal = {
  status: 'draft',
  publishedAt: '2026-07-06T10:30:00.000Z',
  coverStyle: 'aurora',
  coverImage: null,
  category: 3,
  tags: [1, 2],
  tr: { excerpt: 'Merhaba', seoTitle: 'TR Başlık', seoDescription: 'TR açıklama' },
  en: { excerpt: 'Hello', seoTitle: 'EN Title', seoDescription: 'EN description' },
}

const baseInput = postMetadataSchema.parse({
  status: 'draft',
  publishedAt: '2026-07-06',
  coverStyle: 'aurora',
  coverImage: '',
  category: 3,
  tags: [1, 2],
  tr: { excerpt: 'Merhaba', seoTitle: 'TR Başlık', seoDescription: 'TR açıklama' },
  en: { excerpt: 'Hello', seoTitle: 'EN Title', seoDescription: 'EN description' },
})

describe('postMetadataSchema', () => {
  it('applies defaults for omitted optional fields', () => {
    const parsed = postMetadataSchema.parse({
      status: 'published',
      coverStyle: 'ocean',
      tr: {},
      en: {},
    })
    expect(parsed.publishedAt).toBe('')
    expect(parsed.coverImage).toBe('')
    expect(parsed.category).toBeNull()
    expect(parsed.tags).toEqual([])
    expect(parsed.tr).toEqual({ excerpt: '', seoTitle: '', seoDescription: '' })
  })

  it('rejects an invalid status', () => {
    expect(() =>
      postMetadataSchema.parse({ status: 'archived', coverStyle: 'aurora', tr: {}, en: {} }),
    ).toThrow()
  })

  it('rejects an unknown cover style', () => {
    expect(() =>
      postMetadataSchema.parse({ status: 'draft', coverStyle: 'neon', tr: {}, en: {} }),
    ).toThrow()
  })

  it('rejects non-integer tag ids', () => {
    expect(() =>
      postMetadataSchema.parse({
        status: 'draft',
        coverStyle: 'aurora',
        tags: ['x'],
        tr: {},
        en: {},
      }),
    ).toThrow()
  })
})

describe('toDateInputValue', () => {
  it('reduces an ISO timestamp to a date input value', () => {
    expect(toDateInputValue('2026-07-06T10:30:00.000Z')).toBe('2026-07-06')
  })
  it('returns empty for null / invalid', () => {
    expect(toDateInputValue(null)).toBe('')
    expect(toDateInputValue('nope')).toBe('')
  })
})

describe('buildPostUpdates', () => {
  it('returns no updates when nothing changed', () => {
    expect(buildPostUpdates(baseOriginal, baseInput)).toEqual([])
  })

  it('collects only changed non-localized fields onto the tr update', () => {
    const input = { ...baseInput, status: 'published' as const, coverStyle: 'ember' as const }
    const updates = buildPostUpdates(baseOriginal, input)
    expect(updates).toEqual([{ locale: 'tr', data: { status: 'published', coverStyle: 'ember' } }])
  })

  it('normalizes an emptied publishedAt / coverImage to null', () => {
    const input = { ...baseInput, publishedAt: '', coverImage: '' }
    const updates = buildPostUpdates({ ...baseOriginal, coverImage: 'x.jpg' }, input)
    expect(updates).toEqual([{ locale: 'tr', data: { publishedAt: null, coverImage: null } }])
  })

  it('does not flag publishedAt when only the time-of-day differs', () => {
    const input = { ...baseInput, publishedAt: '2026-07-06' }
    expect(buildPostUpdates(baseOriginal, input)).toEqual([])
  })

  it('detects category clearing and tag changes', () => {
    const input = { ...baseInput, category: null, tags: [2, 1, 5] }
    const updates = buildPostUpdates(baseOriginal, input)
    expect(updates).toEqual([{ locale: 'tr', data: { category: null, tags: [2, 1, 5] } }])
  })

  it('ignores tag reordering', () => {
    const input = { ...baseInput, tags: [2, 1] }
    expect(buildPostUpdates(baseOriginal, input)).toEqual([])
  })

  it('splits localized excerpt changes per locale', () => {
    const input = {
      ...baseInput,
      tr: { ...baseInput.tr, excerpt: 'Güncel' },
      en: { ...baseInput.en, excerpt: 'Updated' },
    }
    const updates = buildPostUpdates(baseOriginal, input)
    expect(updates).toEqual([
      { locale: 'tr', data: { excerpt: 'Güncel' } },
      { locale: 'en', data: { excerpt: 'Updated' } },
    ])
  })

  it('sends the whole seo group when one member changes', () => {
    const input = { ...baseInput, tr: { ...baseInput.tr, seoTitle: 'Yeni' } }
    const updates = buildPostUpdates(baseOriginal, input)
    expect(updates).toEqual([
      {
        locale: 'tr',
        data: { seo: { seoTitle: 'Yeni', seoDescription: 'TR açıklama' } },
      },
    ])
  })

  it('clears an emptied excerpt to null', () => {
    const input = { ...baseInput, en: { ...baseInput.en, excerpt: '' } }
    const updates = buildPostUpdates(baseOriginal, input)
    expect(updates).toEqual([{ locale: 'en', data: { excerpt: null } }])
  })

  it('merges shared and tr-localized changes into one tr update', () => {
    const input = {
      ...baseInput,
      status: 'published' as const,
      tr: { ...baseInput.tr, excerpt: 'Değişti' },
    }
    const updates = buildPostUpdates(baseOriginal, input)
    expect(updates).toEqual([
      { locale: 'tr', data: { status: 'published', excerpt: 'Değişti' } },
    ])
  })
})
