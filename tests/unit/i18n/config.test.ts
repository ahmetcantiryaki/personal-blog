import { describe, expect, it } from 'vitest'

import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_LABELS,
  LOCALE_SHORT,
  LOCALES,
} from '@/i18n/config'
import { getDictionary } from '@/i18n'

describe('i18n/config', () => {
  it('exposes exactly tr and en', () => {
    expect(LOCALES).toEqual(['tr', 'en'])
  })

  it('defaults to Turkish', () => {
    expect(DEFAULT_LOCALE).toBe('tr')
  })

  it('isLocale narrows valid locales and rejects others', () => {
    expect(isLocale('tr')).toBe(true)
    expect(isLocale('en')).toBe(true)
    expect(isLocale('fr')).toBe(false)
    expect(isLocale('')).toBe(false)
    expect(isLocale('TR')).toBe(false)
  })

  it('has a label and short label for every locale', () => {
    for (const locale of LOCALES) {
      expect(LOCALE_LABELS[locale]).toBeTruthy()
      expect(LOCALE_SHORT[locale]).toBeTruthy()
    }
    expect(LOCALE_SHORT.tr).toBe('TR')
    expect(LOCALE_SHORT.en).toBe('EN')
  })
})

describe('getDictionary', () => {
  it('returns the Turkish dictionary for tr', () => {
    expect(getDictionary('tr').nav.home).toBe('Anasayfa')
  })

  it('returns the English dictionary for en', () => {
    expect(getDictionary('en').nav.home).toBe('Home')
  })
})
