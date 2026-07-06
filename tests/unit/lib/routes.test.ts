import { describe, expect, it } from 'vitest'

import { routes } from '@/lib/routes'

describe('routes builders', () => {
  it('builds locale-prefixed home + post + taxonomy paths', () => {
    expect(routes.home('tr')).toBe('/tr')
    expect(routes.post('en', 'how-to-build-rag-system')).toBe('/en/posts/how-to-build-rag-system')
    expect(routes.category('tr', 'yapay-zeka')).toBe('/tr/category/yapay-zeka')
    expect(routes.tag('en', 'ai')).toBe('/en/tag/ai')
    expect(routes.feed('tr')).toBe('/tr/feed.xml')
    expect(routes.profile('en')).toBe('/en/profile')
    expect(routes.about('tr')).toBe('/tr/about')
  })

  it('search encodes the query and omits it when absent', () => {
    expect(routes.search('tr')).toBe('/tr/search')
    expect(routes.search('en', 'RAG systems & more')).toBe(
      '/en/search?q=RAG%20systems%20%26%20more',
    )
  })

  it('login/register encode a returnTo when provided', () => {
    expect(routes.login('tr')).toBe('/tr/login')
    expect(routes.login('tr', '/tr/posts/x')).toBe('/tr/login?returnTo=%2Ftr%2Fposts%2Fx')
    expect(routes.register('en')).toBe('/en/register')
    expect(routes.register('en', '/en/posts/y')).toBe(
      '/en/register?returnTo=%2Fen%2Fposts%2Fy',
    )
  })
})
