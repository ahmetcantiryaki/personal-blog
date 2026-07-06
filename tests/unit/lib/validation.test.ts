import { describe, expect, it } from 'vitest'

import {
  postAlternatesQuerySchema,
  reactionBodySchema,
  reactionStateQuerySchema,
  trackBodySchema,
} from '@/lib/validation'

describe('trackBodySchema', () => {
  it('accepts a path with optional slug', () => {
    expect(trackBodySchema.safeParse({ path: '/tr/posts/x', slug: 'x' }).success).toBe(true)
    expect(trackBodySchema.safeParse({ path: '/tr' }).success).toBe(true)
  })

  it('trims the path', () => {
    const parsed = trackBodySchema.parse({ path: '  /tr/posts/x  ' })
    expect(parsed.path).toBe('/tr/posts/x')
  })

  it('rejects empty path, missing path, and over-long path', () => {
    expect(trackBodySchema.safeParse({ path: '' }).success).toBe(false)
    expect(trackBodySchema.safeParse({}).success).toBe(false)
    expect(trackBodySchema.safeParse({ path: 'a'.repeat(2049) }).success).toBe(false)
  })

  it('rejects a non-string path', () => {
    expect(trackBodySchema.safeParse({ path: 123 }).success).toBe(false)
  })
})

describe('reactionBodySchema', () => {
  it('accepts a valid kind + positive integer postId', () => {
    expect(reactionBodySchema.safeParse({ kind: 'likes', postId: 3 }).success).toBe(true)
    expect(reactionBodySchema.safeParse({ kind: 'bookmarks', postId: 3 }).success).toBe(true)
  })

  it('coerces a numeric-string postId', () => {
    const parsed = reactionBodySchema.parse({ kind: 'likes', postId: '42' })
    expect(parsed.postId).toBe(42)
  })

  it('rejects an unknown kind', () => {
    expect(reactionBodySchema.safeParse({ kind: 'love', postId: 1 }).success).toBe(false)
  })

  it('rejects non-positive, non-integer or unparseable postId', () => {
    expect(reactionBodySchema.safeParse({ kind: 'likes', postId: 0 }).success).toBe(false)
    expect(reactionBodySchema.safeParse({ kind: 'likes', postId: -1 }).success).toBe(false)
    expect(reactionBodySchema.safeParse({ kind: 'likes', postId: 1.5 }).success).toBe(false)
    expect(reactionBodySchema.safeParse({ kind: 'likes', postId: 'abc' }).success).toBe(false)
  })
})

describe('reactionStateQuerySchema', () => {
  it('coerces postId from the query string', () => {
    const parsed = reactionStateQuerySchema.parse({ postId: '7' })
    expect(parsed.postId).toBe(7)
  })

  it('rejects a null / missing postId', () => {
    expect(reactionStateQuerySchema.safeParse({ postId: null }).success).toBe(false)
    expect(reactionStateQuerySchema.safeParse({}).success).toBe(false)
  })
})

describe('postAlternatesQuerySchema', () => {
  it('accepts a slug with a valid from locale', () => {
    expect(postAlternatesQuerySchema.safeParse({ slug: 'x', from: 'tr' }).success).toBe(true)
    expect(postAlternatesQuerySchema.safeParse({ slug: 'x', from: 'en' }).success).toBe(true)
  })

  it('rejects an unknown from locale or empty slug', () => {
    expect(postAlternatesQuerySchema.safeParse({ slug: 'x', from: 'fr' }).success).toBe(false)
    expect(postAlternatesQuerySchema.safeParse({ slug: '', from: 'tr' }).success).toBe(false)
    expect(postAlternatesQuerySchema.safeParse({ slug: 'a'.repeat(513), from: 'tr' }).success).toBe(
      false,
    )
  })
})
