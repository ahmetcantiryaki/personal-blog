import { describe, expect, it } from 'vitest'

import {
  categoryCreateSchema,
  categoryUpdateSchema,
  keySchema,
  tagCreateSchema,
  tagUpdateSchema,
} from '@/lib/panel/taxonomy-schema'

describe('keySchema', () => {
  it('accepts kebab-case keys', () => {
    expect(keySchema.parse('yapay-zeka')).toBe('yapay-zeka')
    expect(keySchema.parse('ai')).toBe('ai')
    expect(keySchema.parse('web3')).toBe('web3')
  })

  it('trims surrounding whitespace', () => {
    expect(keySchema.parse('  ai  ')).toBe('ai')
  })

  it('rejects empty, uppercase, spaces and invalid punctuation', () => {
    expect(keySchema.safeParse('').success).toBe(false)
    expect(keySchema.safeParse('AI').success).toBe(false)
    expect(keySchema.safeParse('two words').success).toBe(false)
    expect(keySchema.safeParse('-lead').success).toBe(false)
    expect(keySchema.safeParse('trail-').success).toBe(false)
    expect(keySchema.safeParse('under_score').success).toBe(false)
  })
})

describe('categoryCreateSchema', () => {
  const base = {
    key: 'ai',
    tr: { title: 'Yapay Zeka' },
    en: { title: 'Artificial Intelligence' },
  }

  it('defaults slug + description to empty strings', () => {
    const parsed = categoryCreateSchema.parse(base)
    expect(parsed.tr.slug).toBe('')
    expect(parsed.tr.description).toBe('')
    expect(parsed.en.slug).toBe('')
  })

  it('accepts explicit valid slugs and descriptions', () => {
    const parsed = categoryCreateSchema.parse({
      key: 'ai',
      tr: { title: 'Yapay Zeka', slug: 'yapay-zeka', description: 'Açıklama' },
      en: { title: 'AI', slug: 'ai', description: 'Desc' },
    })
    expect(parsed.tr.slug).toBe('yapay-zeka')
    expect(parsed.en.description).toBe('Desc')
  })

  it('requires a title for each locale', () => {
    expect(
      categoryCreateSchema.safeParse({ key: 'ai', tr: { title: '' }, en: { title: 'AI' } }).success,
    ).toBe(false)
  })

  it('rejects invalid slugs', () => {
    expect(
      categoryCreateSchema.safeParse({
        key: 'ai',
        tr: { title: 'X', slug: 'Bad Slug' },
        en: { title: 'Y' },
      }).success,
    ).toBe(false)
  })

  it('rejects a missing/invalid key', () => {
    expect(
      categoryCreateSchema.safeParse({ ...base, key: 'Bad Key' }).success,
    ).toBe(false)
  })
})

describe('categoryUpdateSchema', () => {
  it('does not accept or require a key', () => {
    const parsed = categoryUpdateSchema.parse({
      tr: { title: 'A' },
      en: { title: 'B' },
    })
    expect('key' in parsed).toBe(false)
  })
})

describe('tag schemas', () => {
  it('creates without a description field', () => {
    const parsed = tagCreateSchema.parse({
      key: 'react',
      tr: { title: 'React' },
      en: { title: 'React' },
    })
    expect(parsed.tr).toEqual({ title: 'React', slug: '' })
    expect('description' in parsed.tr).toBe(false)
  })

  it('validates update payloads', () => {
    expect(
      tagUpdateSchema.safeParse({ tr: { title: 'React' }, en: { title: 'React' } }).success,
    ).toBe(true)
    expect(tagUpdateSchema.safeParse({ tr: { title: '' }, en: { title: 'React' } }).success).toBe(
      false,
    )
  })
})
