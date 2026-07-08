import { describe, expect, it } from 'vitest'

import {
  contentActionSchema,
  hasRequiredFrontMatter,
  isValidSlug,
} from '@/lib/panel/content-guard'

describe('isValidSlug', () => {
  it('accepts lowercase kebab slugs', () => {
    expect(isValidSlug('acik-kaynak-saas-alternatifleri-2026')).toBe(true)
    expect(isValidSlug('a')).toBe(true)
    expect(isValidSlug('post-123')).toBe(true)
  })

  it('rejects path traversal and separators', () => {
    expect(isValidSlug('../secret')).toBe(false)
    expect(isValidSlug('a/b')).toBe(false)
    expect(isValidSlug('a\\b')).toBe(false)
    expect(isValidSlug('..')).toBe(false)
    expect(isValidSlug('foo/../bar')).toBe(false)
  })

  it('rejects uppercase, spaces, and non-string input', () => {
    expect(isValidSlug('MyPost')).toBe(false)
    expect(isValidSlug('my post')).toBe(false)
    expect(isValidSlug('emoji-🚀')).toBe(false)
    expect(isValidSlug('')).toBe(false)
    expect(isValidSlug(undefined)).toBe(false)
    expect(isValidSlug(42)).toBe(false)
  })

  it('rejects overly long slugs', () => {
    expect(isValidSlug('a'.repeat(201))).toBe(false)
    expect(isValidSlug('a'.repeat(200))).toBe(true)
  })
})

describe('hasRequiredFrontMatter', () => {
  it('accepts markdown with a front-matter fence and translationKey', () => {
    const md = ['---', 'title: "Hi"', 'translationKey: "x"', '---', '', 'Body'].join('\n')
    expect(hasRequiredFrontMatter(md)).toBe(true)
  })

  it('matches translationKey on the first line after the fence', () => {
    const md = '---\ntranslationKey: "y"\ntitle: "t"\n---\nBody'
    expect(hasRequiredFrontMatter(md)).toBe(true)
  })

  it('rejects markdown that does not start with a fence', () => {
    const md = 'Some intro\n---\ntranslationKey: "x"\n---'
    expect(hasRequiredFrontMatter(md)).toBe(false)
  })

  it('rejects markdown missing translationKey', () => {
    const md = '---\ntitle: "Hi"\nslug: "hi"\n---\nBody'
    expect(hasRequiredFrontMatter(md)).toBe(false)
  })

  it('rejects non-string input', () => {
    expect(hasRequiredFrontMatter(undefined)).toBe(false)
    expect(hasRequiredFrontMatter(123)).toBe(false)
  })

  it('does not match a translationKey substring mid-line', () => {
    const md = '---\ntitle: "notranslationKey here"\n---\nBody'
    expect(hasRequiredFrontMatter(md)).toBe(false)
  })
})

describe('contentActionSchema', () => {
  const valid = {
    locale: 'tr',
    slug: 'my-post',
    markdown: '---\ntranslationKey: "x"\n---\nBody',
  }

  it('parses a valid payload', () => {
    const result = contentActionSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('accepts an optional sha', () => {
    const result = contentActionSchema.safeParse({ ...valid, sha: 'abc123' })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid locale', () => {
    expect(contentActionSchema.safeParse({ ...valid, locale: 'de' }).success).toBe(false)
  })

  it('rejects an invalid slug', () => {
    expect(contentActionSchema.safeParse({ ...valid, slug: '../x' }).success).toBe(false)
  })

  it('rejects empty markdown', () => {
    expect(contentActionSchema.safeParse({ ...valid, markdown: '' }).success).toBe(false)
  })
})
