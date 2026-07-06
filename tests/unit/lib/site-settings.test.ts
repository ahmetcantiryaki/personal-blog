import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createFakePayload, type FakePayload } from '../helpers/payload-mock'

const fake: FakePayload = createFakePayload()
vi.mock('@/lib/payload', () => ({ getPayloadClient: async () => fake }))

import { getSiteSettings } from '@/lib/site-settings'

beforeEach(() => vi.clearAllMocks())

describe('getSiteSettings', () => {
  it('uses the global values and filters invalid social links', async () => {
    fake.findGlobal.mockResolvedValue({
      siteName: '  My Blog  ',
      tagline: 'Tagline',
      footerText: 'Footer',
      socialLinks: [
        { label: 'X', url: 'https://x.com/woyable' },
        { label: '', url: 'https://bad' }, // dropped: missing label
        { label: 'GH', url: '' }, // dropped: missing url
      ],
    })
    const settings = await getSiteSettings('en')
    expect(settings.siteName).toBe('My Blog') // trimmed
    expect(settings.tagline).toBe('Tagline')
    expect(settings.socialLinks).toEqual([{ label: 'X', url: 'https://x.com/woyable' }])
  })

  it('falls back to dictionary defaults when the global is empty', async () => {
    fake.findGlobal.mockResolvedValue(null)
    const settings = await getSiteSettings('tr')
    expect(settings.siteName).toBe('Woyable')
    expect(settings.tagline).toBeTruthy()
    expect(settings.socialLinks).toEqual([])
  })

  it('falls back gracefully when reading the global throws', async () => {
    fake.findGlobal.mockRejectedValue(new Error('db down'))
    const settings = await getSiteSettings('en')
    expect(settings.siteName).toBe('Woyable')
    expect(settings.socialLinks).toEqual([])
  })
})
