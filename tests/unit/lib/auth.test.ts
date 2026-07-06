import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createFakePayload, type FakePayload } from '../helpers/payload-mock'

const fake: FakePayload = createFakePayload()
vi.mock('@/lib/payload', () => ({ getPayloadClient: async () => fake }))

// Mutable headers store the mocked next/headers() resolves to.
let currentHeaders = new Headers()
vi.mock('next/headers', () => ({
  headers: async () => currentHeaders,
}))

import { getCurrentUser } from '@/lib/auth'

beforeEach(() => {
  vi.clearAllMocks()
  currentHeaders = new Headers()
})

describe('getCurrentUser', () => {
  it('returns the authenticated user from the session', async () => {
    fake.auth.mockResolvedValue({ user: { id: 1, email: 'reader@woyable.test' } })
    const user = await getCurrentUser()
    expect(user).toMatchObject({ id: 1 })
  })

  it('injects a same-origin Origin header when none is present', async () => {
    fake.auth.mockResolvedValue({ user: null })
    await getCurrentUser()
    const passedHeaders: Headers = fake.auth.mock.calls[0][0].headers
    expect(passedHeaders.get('origin')).toBeTruthy()
  })

  it('preserves an existing Origin/Referer header', async () => {
    currentHeaders = new Headers({ origin: 'https://woyable-test.vercel.app' })
    fake.auth.mockResolvedValue({ user: null })
    await getCurrentUser()
    const passedHeaders: Headers = fake.auth.mock.calls[0][0].headers
    expect(passedHeaders.get('origin')).toBe('https://woyable-test.vercel.app')
  })

  it('returns null when payload.auth throws', async () => {
    fake.auth.mockRejectedValue(new Error('boom'))
    expect(await getCurrentUser()).toBeNull()
  })

  it('returns null when there is no user', async () => {
    fake.auth.mockResolvedValue({ user: undefined })
    expect(await getCurrentUser()).toBeNull()
  })
})
