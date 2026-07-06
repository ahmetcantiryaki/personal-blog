import { describe, expect, it } from 'vitest'

import { slugify } from '@/utils/slugify'

describe('slugify', () => {
  it('lowercases and hyphenates plain ascii', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('transliterates Turkish-specific characters', () => {
    expect(slugify('Yazılım Günü')).toBe('yazilim-gunu')
    expect(slugify('İstanbul çöp şişe öğün')).toBe('istanbul-cop-sise-ogun')
  })

  it('strips remaining diacritics via NFD normalization', () => {
    expect(slugify('Café résumé naïve')).toBe('cafe-resume-naive')
  })

  it('collapses repeated separators and trims edges', () => {
    expect(slugify('  --Multiple   spaces & symbols!!--  ')).toBe('multiple-spaces-symbols')
  })

  it('removes non-alphanumerics entirely', () => {
    expect(slugify('a@b#c$d')).toBe('a-b-c-d')
  })

  it('returns empty string for empty or symbol-only input', () => {
    expect(slugify('')).toBe('')
    expect(slugify('!!!')).toBe('')
    expect(slugify('   ')).toBe('')
  })

  it('is idempotent on an already-slugified value', () => {
    const once = slugify('RAG Sistemi Nasıl Kurulur')
    expect(slugify(once)).toBe(once)
    expect(once).toBe('rag-sistemi-nasil-kurulur')
  })
})
