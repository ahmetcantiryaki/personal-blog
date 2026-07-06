import { describe, expect, it } from 'vitest'

import { preferredLocale } from '@/lib/locale-negotiation'

describe('preferredLocale', () => {
  it('defaults to tr when the header is missing or empty', () => {
    expect(preferredLocale(null)).toBe('tr')
    expect(preferredLocale(undefined)).toBe('tr')
    expect(preferredLocale('')).toBe('tr')
  })

  it('returns en when English is preferred', () => {
    expect(preferredLocale('en-US,en;q=0.9')).toBe('en')
    expect(preferredLocale('en')).toBe('en')
    expect(preferredLocale('en-GB')).toBe('en')
  })

  it('returns tr when Turkish is preferred', () => {
    expect(preferredLocale('tr-TR,tr;q=0.9')).toBe('tr')
    expect(preferredLocale('tr')).toBe('tr')
  })

  it('honors q-value ranking over header order', () => {
    // tr listed first but en has higher quality → en wins.
    expect(preferredLocale('tr;q=0.5,en;q=0.9')).toBe('en')
    // en listed first but tr has higher quality → tr wins.
    expect(preferredLocale('en;q=0.4,tr;q=0.8')).toBe('tr')
  })

  it('picks the first supported locale, skipping unsupported ones', () => {
    expect(preferredLocale('fr-FR,de;q=0.8,en;q=0.5')).toBe('en')
    expect(preferredLocale('fr-FR,de;q=0.8,tr;q=0.5')).toBe('tr')
  })

  it('falls back to tr for entirely unsupported languages', () => {
    expect(preferredLocale('fr-FR,de;q=0.8,es;q=0.5')).toBe('tr')
  })
})
