import { describe, expect, it } from 'vitest'

import { shapeTopPosts, toCount, type ViewAggregate } from '@/lib/panel/stats'

describe('toCount', () => {
  it('coerces Postgres bigint strings to numbers', () => {
    expect(toCount('42')).toBe(42)
  })

  it('treats null/undefined and non-positive values as 0', () => {
    expect(toCount(null)).toBe(0)
    expect(toCount(undefined)).toBe(0)
    expect(toCount('-5')).toBe(0)
    expect(toCount('nope')).toBe(0)
  })

  it('truncates fractional inputs', () => {
    expect(toCount(3.9)).toBe(3)
  })
})

describe('shapeTopPosts', () => {
  const aggregates: ViewAggregate[] = [
    { postId: 1, views: 100 },
    { postId: 2, views: 50 },
  ]

  it('joins aggregates with resolved post metadata, preserving order', () => {
    const postsById = new Map([
      [1, { title: 'İlk Yazı', slug: 'ilk-yazi' }],
      [2, { title: 'İkinci Yazı', slug: 'ikinci-yazi' }],
    ])
    expect(shapeTopPosts(aggregates, postsById)).toEqual([
      { id: 1, title: 'İlk Yazı', slug: 'ilk-yazi', views: 100 },
      { id: 2, title: 'İkinci Yazı', slug: 'ikinci-yazi', views: 50 },
    ])
  })

  it('drops aggregates with no matching post', () => {
    const postsById = new Map([[1, { title: 'İlk Yazı', slug: 'ilk-yazi' }]])
    const result = shapeTopPosts(aggregates, postsById)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('falls back to a placeholder title and null slug when missing', () => {
    const postsById = new Map([[1, { title: '  ', slug: null }]])
    expect(shapeTopPosts([{ postId: 1, views: 10 }], postsById)).toEqual([
      { id: 1, title: 'Başlıksız yazı', slug: null, views: 10 },
    ])
  })
})
