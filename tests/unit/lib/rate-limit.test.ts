import { beforeEach, describe, expect, it } from 'vitest'

import { clientIp, rateLimit, resetRateLimits } from '@/lib/rate-limit'

describe('rateLimit', () => {
  beforeEach(() => resetRateLimits())

  it('allows up to the limit then blocks within the window', () => {
    const now = 1_000_000
    for (let i = 0; i < 3; i += 1) {
      expect(rateLimit('k', 3, 1000, now).ok).toBe(true)
    }
    const blocked = rateLimit('k', 3, 1000, now)
    expect(blocked.ok).toBe(false)
    expect(blocked.remaining).toBe(0)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('reports a decreasing remaining allowance', () => {
    const now = 5_000
    expect(rateLimit('k', 2, 1000, now).remaining).toBe(1)
    expect(rateLimit('k', 2, 1000, now).remaining).toBe(0)
  })

  it('slides: allows again once the window elapses', () => {
    for (let i = 0; i < 2; i += 1) rateLimit('k', 2, 1000, 0)
    expect(rateLimit('k', 2, 1000, 0).ok).toBe(false)
    expect(rateLimit('k', 2, 1000, 1001).ok).toBe(true)
  })

  it('keeps separate keys independent', () => {
    const now = 10
    expect(rateLimit('a', 1, 1000, now).ok).toBe(true)
    expect(rateLimit('a', 1, 1000, now).ok).toBe(false)
    expect(rateLimit('b', 1, 1000, now).ok).toBe(true)
  })

  it('computes retryAfter from the earliest live hit', () => {
    rateLimit('k', 1, 5000, 0)
    const blocked = rateLimit('k', 1, 5000, 1000)
    expect(blocked.ok).toBe(false)
    // earliest hit at t=0, window 5000 → free at 5000, now 1000 → 4s.
    expect(blocked.retryAfterSeconds).toBe(4)
  })
})

describe('clientIp', () => {
  it('takes the first x-forwarded-for hop', () => {
    expect(clientIp(new Headers({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }))).toBe('1.2.3.4')
  })

  it('falls back to x-real-ip', () => {
    expect(clientIp(new Headers({ 'x-real-ip': '9.9.9.9' }))).toBe('9.9.9.9')
  })

  it('falls back to a constant when no proxy header is present', () => {
    expect(clientIp(new Headers())).toBe('unknown')
  })
})
