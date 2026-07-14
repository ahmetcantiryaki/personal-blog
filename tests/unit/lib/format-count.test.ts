import { describe, expect, it } from 'vitest'

import { formatCompactCount, formatFullCount } from '@/lib/format'

describe('formatCompactCount', () => {
  it('leaves small numbers uncompacted', () => {
    expect(formatCompactCount(0, 'tr')).toBe('0')
    expect(formatCompactCount(42, 'en')).toBe('42')
    expect(formatCompactCount(999, 'en')).toBe('999')
  })

  it('compacts thousands with an English suffix', () => {
    expect(formatCompactCount(1200, 'en')).toBe('1.2K')
    expect(formatCompactCount(12000, 'en')).toBe('12K')
    expect(formatCompactCount(1_500_000, 'en')).toBe('1.5M')
  })

  it('compacts thousands with the Turkish "B" (bin) suffix and comma decimal', () => {
    const tr = formatCompactCount(1200, 'tr')
    expect(tr).toContain('1,2')
    expect(tr).toContain('B')
    expect(formatCompactCount(12000, 'tr')).toContain('B')
  })

  it('clamps negative, fractional and NaN inputs to a safe integer', () => {
    expect(formatCompactCount(-5, 'en')).toBe('0')
    expect(formatCompactCount(NaN, 'tr')).toBe('0')
    expect(formatCompactCount(1234.9, 'en')).toBe('1.2K')
  })
})

describe('formatFullCount', () => {
  it('groups thousands per locale', () => {
    expect(formatFullCount(1240, 'en')).toBe('1,240')
    expect(formatFullCount(1240, 'tr')).toBe('1.240')
  })

  it('clamps invalid input to 0', () => {
    expect(formatFullCount(-1, 'en')).toBe('0')
    expect(formatFullCount(NaN, 'tr')).toBe('0')
  })
})
