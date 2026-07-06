import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createFakePayload, findResult, type FakePayload } from '../helpers/payload-mock'

const fake: FakePayload = createFakePayload()
vi.mock('@/lib/payload', () => ({ getPayloadClient: async () => fake }))

import { getCategoryBySlug, getTagBySlug, listCategories } from '@/lib/taxonomy'

beforeEach(() => vi.clearAllMocks())

describe('listCategories', () => {
  it('returns the category docs for a locale', async () => {
    fake.find.mockResolvedValue(findResult([{ id: 1, slug: 'ai', title: 'AI' }]))
    const cats = await listCategories('en')
    expect(cats).toHaveLength(1)
    expect(fake.find.mock.calls[0][0]).toMatchObject({ collection: 'categories', locale: 'en' })
  })
})

describe('getCategoryBySlug', () => {
  it('returns the matching category or null', async () => {
    fake.find.mockResolvedValueOnce(findResult([{ id: 1, slug: 'yapay-zeka' }]))
    expect((await getCategoryBySlug('tr', 'yapay-zeka'))?.slug).toBe('yapay-zeka')
    fake.find.mockResolvedValueOnce(findResult([]))
    expect(await getCategoryBySlug('tr', 'nope')).toBeNull()
  })
})

describe('getTagBySlug', () => {
  it('returns the matching tag or null', async () => {
    fake.find.mockResolvedValueOnce(findResult([{ id: 2, slug: 'rag' }]))
    expect((await getTagBySlug('en', 'rag'))?.slug).toBe('rag')
    fake.find.mockResolvedValueOnce(findResult([]))
    expect(await getTagBySlug('en', 'nope')).toBeNull()
  })
})
