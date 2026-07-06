import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createFakePayload, findResult, type FakePayload } from '../helpers/payload-mock'

const fake: FakePayload = createFakePayload()
vi.mock('@/lib/payload', () => ({ getPayloadClient: async () => fake }))

import {
  getAllPostSlugs,
  getFeaturedPost,
  getPostBySlug,
  getPostsByIds,
  getRelatedPosts,
  getTranslatedSlug,
  listPosts,
  POSTS_PER_PAGE,
  searchPosts,
} from '@/lib/posts'
import type { PostWithRelations } from '@/lib/posts'

const cat = { id: 1, title: 'AI', slug: 'ai' }
const tag = { id: 2, title: 'RAG', slug: 'rag' }
const post = (over: Record<string, unknown> = {}) => ({
  id: 10,
  slug: 'how-to-build-rag-system',
  title: 'RAG',
  status: 'published',
  category: cat,
  tags: [tag],
  publishedAt: '2026-07-06',
  ...over,
})

beforeEach(() => vi.clearAllMocks())

describe('listPosts', () => {
  it('normalizes docs and returns pagination metadata', async () => {
    fake.find.mockResolvedValue(findResult([post()], { page: 2, totalPages: 5, totalDocs: 41 }))
    const result = await listPosts({ locale: 'en', page: 2 })
    expect(result.posts).toHaveLength(1)
    expect(result.posts[0].category).toEqual(cat)
    expect(result.posts[0].tags).toEqual([tag])
    expect(result).toMatchObject({ page: 2, totalPages: 5, totalDocs: 41 })
  })

  it('drops posts that lack a slug in the active locale', async () => {
    fake.find.mockResolvedValue(findResult([post(), post({ id: 11, slug: undefined })]))
    const result = await listPosts({ locale: 'tr' })
    expect(result.posts).toHaveLength(1)
  })

  it('adds category/tag filters to the where clause', async () => {
    fake.find.mockResolvedValue(findResult([]))
    await listPosts({ locale: 'tr', categorySlug: 'yapay-zeka', tagSlug: 'rag' })
    const where = fake.find.mock.calls[0][0].where
    expect(JSON.stringify(where)).toContain('category.slug')
    expect(JSON.stringify(where)).toContain('tags.slug')
  })

  it('exposes the default page size', () => {
    expect(POSTS_PER_PAGE).toBe(9)
  })
})

describe('getFeaturedPost', () => {
  it('returns the newest post or null', async () => {
    fake.find.mockResolvedValueOnce(findResult([post()]))
    expect((await getFeaturedPost('en'))?.slug).toBe('how-to-build-rag-system')
    fake.find.mockResolvedValueOnce(findResult([]))
    expect(await getFeaturedPost('en')).toBeNull()
  })
})

describe('getPostBySlug', () => {
  it('returns a normalized post or null', async () => {
    fake.find.mockResolvedValueOnce(findResult([post()]))
    expect((await getPostBySlug('en', 'how-to-build-rag-system'))?.id).toBe(10)
    fake.find.mockResolvedValueOnce(findResult([]))
    expect(await getPostBySlug('en', 'nope')).toBeNull()
  })
})

describe('getRelatedPosts', () => {
  it('returns [] when the post has no category', async () => {
    const result = await getRelatedPosts('en', { category: null } as PostWithRelations)
    expect(result).toEqual([])
    expect(fake.find).not.toHaveBeenCalled()
  })

  it('queries same-category posts excluding the current one', async () => {
    fake.find.mockResolvedValue(findResult([post({ id: 12 })]))
    const result = await getRelatedPosts('en', post() as unknown as PostWithRelations)
    expect(result).toHaveLength(1)
    const where = JSON.stringify(fake.find.mock.calls[0][0].where)
    expect(where).toContain('not_equals')
  })
})

describe('getTranslatedSlug', () => {
  it('returns the paired slug or null', async () => {
    fake.find.mockResolvedValueOnce(findResult([{ slug: 'rag-sistemi-nasil-kurulur' }]))
    expect(await getTranslatedSlug('rag-system', 'tr')).toBe('rag-sistemi-nasil-kurulur')
    fake.find.mockResolvedValueOnce(findResult([]))
    expect(await getTranslatedSlug('rag-system', 'tr')).toBeNull()
  })
})

describe('searchPosts', () => {
  it('returns [] for a blank query without hitting the DB', async () => {
    expect(await searchPosts('en', '   ')).toEqual([])
    expect(fake.find).not.toHaveBeenCalled()
  })

  it('searches title/excerpt for a non-empty query', async () => {
    fake.find.mockResolvedValue(findResult([post()]))
    const result = await searchPosts('en', 'RAG')
    expect(result).toHaveLength(1)
    expect(JSON.stringify(fake.find.mock.calls[0][0].where)).toContain('like')
  })
})

describe('getPostsByIds', () => {
  it('returns [] for an empty id list without hitting the DB', async () => {
    expect(await getPostsByIds('en', [])).toEqual([])
    expect(fake.find).not.toHaveBeenCalled()
  })

  it('fetches posts by id', async () => {
    fake.find.mockResolvedValue(findResult([post()]))
    expect(await getPostsByIds('en', [10])).toHaveLength(1)
  })
})

describe('getAllPostSlugs', () => {
  it('maps docs to slugs and drops falsy', async () => {
    fake.find.mockResolvedValue(findResult([{ slug: 'a' }, { slug: '' }, { slug: 'b' }]))
    expect(await getAllPostSlugs('en')).toEqual(['a', 'b'])
  })
})
