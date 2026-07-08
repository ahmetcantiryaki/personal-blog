import { describe, expect, it } from 'vitest'

import {
  siteSettingsSchema,
  socialLinkSchema,
} from '@/lib/panel/site-settings-schema'

describe('socialLinkSchema', () => {
  it('accepts a valid label + url', () => {
    expect(socialLinkSchema.parse({ label: 'Twitter', url: 'https://x.com/woyable' })).toEqual({
      label: 'Twitter',
      url: 'https://x.com/woyable',
    })
  })

  it('trims values', () => {
    const parsed = socialLinkSchema.parse({ label: '  X  ', url: '  https://x.com  ' })
    expect(parsed.label).toBe('X')
    expect(parsed.url).toBe('https://x.com')
  })

  it('rejects empty label, empty url and malformed url', () => {
    expect(socialLinkSchema.safeParse({ label: '', url: 'https://x.com' }).success).toBe(false)
    expect(socialLinkSchema.safeParse({ label: 'X', url: '' }).success).toBe(false)
    expect(socialLinkSchema.safeParse({ label: 'X', url: 'not-a-url' }).success).toBe(false)
  })
})

describe('siteSettingsSchema', () => {
  const base = {
    tr: { siteName: 'Woyable' },
    en: {},
    socialLinks: [],
  }

  it('defaults optional locale text to empty strings', () => {
    const parsed = siteSettingsSchema.parse(base)
    expect(parsed.tr.tagline).toBe('')
    expect(parsed.tr.footerText).toBe('')
    expect(parsed.en.siteName).toBe('')
  })

  it('accepts a populated payload', () => {
    const parsed = siteSettingsSchema.parse({
      tr: { siteName: 'Woyable', tagline: 'Slogan', footerText: 'Alt' },
      en: { siteName: 'Woyable', tagline: 'Tagline', footerText: 'Footer' },
      socialLinks: [{ label: 'X', url: 'https://x.com/woyable' }],
    })
    expect(parsed.socialLinks).toHaveLength(1)
    expect(parsed.en.tagline).toBe('Tagline')
  })

  it('rejects an invalid social link inside the array', () => {
    expect(
      siteSettingsSchema.safeParse({
        ...base,
        socialLinks: [{ label: 'X', url: 'bad' }],
      }).success,
    ).toBe(false)
  })

  it('rejects more than 20 social links', () => {
    const many = Array.from({ length: 21 }, () => ({ label: 'X', url: 'https://x.com' }))
    expect(siteSettingsSchema.safeParse({ ...base, socialLinks: many }).success).toBe(false)
  })
})
