import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { clientIp, rateLimit } from '@/lib/rate-limit'

/**
 * Edge proxy (Next 16's renamed `middleware`) that rate-limits the two Payload
 * built-in auth POST routes we cannot wrap with a custom handler:
 *   - POST /api/users        (registration) — 5 / hour  per IP
 *   - POST /api/users/login  (sign-in)      — 10 / 15min per IP
 *
 * Scoped tightly via `config.matcher` so it never touches page/ISR traffic or
 * any other API route. Counters are per-instance best-effort (see rate-limit).
 */
const HOUR_MS = 60 * 60 * 1000
const FIFTEEN_MIN_MS = 15 * 60 * 1000

export function proxy(req: NextRequest): NextResponse {
  if (req.method !== 'POST') return NextResponse.next()

  const ip = clientIp(req.headers)
  const path = req.nextUrl.pathname

  let result
  if (path === '/api/users/login') {
    result = rateLimit(`login:${ip}`, 10, FIFTEEN_MIN_MS)
  } else if (path === '/api/users') {
    result = rateLimit(`register:${ip}`, 5, HOUR_MS)
  } else {
    return NextResponse.next()
  }

  if (!result.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(result.retryAfterSeconds) } },
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/users', '/api/users/login'],
}
