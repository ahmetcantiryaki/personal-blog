import { describe, expect, it } from 'vitest'

import { formatDate } from '@/lib/format'

describe('formatDate', () => {
  const iso = '2026-07-06T10:30:00.000Z'

  it('formats a long date in Turkish', () => {
    // Locale month name for July in tr is "Temmuz".
    expect(formatDate(iso, 'tr')).toContain('Temmuz')
    expect(formatDate(iso, 'tr')).toContain('2026')
  })

  it('formats a long date in English', () => {
    expect(formatDate(iso, 'en')).toContain('July')
    expect(formatDate(iso, 'en')).toContain('2026')
  })

  it('returns empty string for an invalid date', () => {
    expect(formatDate('not-a-date', 'tr')).toBe('')
    expect(formatDate('', 'en')).toBe('')
  })

  it('accepts a date-only ISO string', () => {
    expect(formatDate('2026-01-15', 'en')).toContain('2026')
  })
})
