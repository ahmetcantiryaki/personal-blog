import { describe, expect, it } from 'vitest'

import { coverStyleForKey } from '@/seed/coverStyle'

const STYLES = ['aurora', 'dusk', 'meadow', 'ocean', 'ember']

describe('coverStyleForKey', () => {
  it('always returns one of the known cover styles', () => {
    for (const key of ['a', 'rag-system', 'x'.repeat(50), 'çğş']) {
      expect(STYLES).toContain(coverStyleForKey(key))
    }
  })

  it('is deterministic for a given translationKey', () => {
    expect(coverStyleForKey('how-to-build-rag-system')).toBe(
      coverStyleForKey('how-to-build-rag-system'),
    )
  })

  it('spreads keys across multiple styles (not a constant)', () => {
    const keys = Array.from({ length: 40 }, (_, i) => `article-${i}`)
    const distinct = new Set(keys.map(coverStyleForKey))
    expect(distinct.size).toBeGreaterThan(1)
  })
})
