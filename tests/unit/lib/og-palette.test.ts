import { describe, expect, it } from 'vitest'

import { hashString, OG_PALETTE, ogBackgroundImage } from '@/lib/og-palette'

const STYLES = ['aurora', 'dusk', 'meadow', 'ocean', 'ember'] as const

describe('OG_PALETTE', () => {
  it('defines a palette for every cover style', () => {
    for (const style of STYLES) {
      const palette = OG_PALETTE[style]
      expect(palette.base).toMatch(/^#[0-9a-f]{6}$/i)
      expect(palette.ink).toMatch(/^#[0-9a-f]{6}$/i)
      expect(palette.blobs).toHaveLength(3)
      palette.blobs.forEach((c) => expect(c).toMatch(/^#[0-9a-f]{6}$/i))
    }
  })
})

describe('hashString', () => {
  it('is deterministic for the same seed', () => {
    expect(hashString('rag-sistemi')).toBe(hashString('rag-sistemi'))
  })

  it('differs across distinct seeds', () => {
    expect(hashString('aurora')).not.toBe(hashString('ember'))
  })

  it('returns an unsigned 32-bit integer', () => {
    const h = hashString('woyable-blog')
    expect(Number.isInteger(h)).toBe(true)
    expect(h).toBeGreaterThanOrEqual(0)
    expect(h).toBeLessThanOrEqual(0xffffffff)
  })

  it('falls back to a stable value for empty input', () => {
    expect(hashString('')).toBe(hashString('woyable'))
  })
})

describe('ogBackgroundImage', () => {
  it('produces three radial-gradient layers', () => {
    const bg = ogBackgroundImage('ocean', 'how-to-build-rag-system')
    const layers = bg.split('radial-gradient').length - 1
    expect(layers).toBe(3)
  })

  it('embeds the palette blob colors for the style', () => {
    const bg = ogBackgroundImage('ember', 'seed-1')
    for (const color of OG_PALETTE.ember.blobs) {
      expect(bg).toContain(color)
    }
  })

  it('is deterministic per (style, seed)', () => {
    expect(ogBackgroundImage('meadow', 'x')).toBe(ogBackgroundImage('meadow', 'x'))
  })

  it('keeps blob positions within the documented bounds', () => {
    const bg = ogBackgroundImage('dusk', 'position-check')
    const coords = [...bg.matchAll(/at (\d+)% (\d+)%/g)]
    expect(coords).toHaveLength(3)
    for (const [, xStr, yStr] of coords) {
      const x = Number(xStr)
      const y = Number(yStr)
      expect(x).toBeGreaterThanOrEqual(12)
      expect(x).toBeLessThanOrEqual(12 + 75)
      expect(y).toBeGreaterThanOrEqual(10)
      expect(y).toBeLessThanOrEqual(10 + 69)
    }
  })
})
