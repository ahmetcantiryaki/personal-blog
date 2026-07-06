import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { preferredLocale } from '@/lib/locale-negotiation'
import { clientIp, rateLimit } from '@/lib/rate-limit'

/**
 * Edge proxy (Next 16's renamed `middleware`) with two responsibilities:
 *
 *  1. Redirect the bare root `/` to the visitor's preferred locale home
 *     (`/en` when English is preferred, else `/tr`). The localized homepages
 *     stay the canonical/x-default URLs — the root never emits content, only a
 *     307 redirect.
 *  2. Rate-limit the two Payload built-in auth POST routes we cannot wrap with
 *     a custom handler:
 *       - POST /api/users        (registration) — 5 / hour  per IP
 *       - POST /api/users/login  (sign-in)      — 10 / 15min per IP
 *
 * Scoped tightly via `config.matcher` so it never touches page/ISR traffic or
 * any other API route. Counters are per-instance best-effort (see rate-limit).
 */
const HOUR_MS = 60 * 60 * 1000
const FIFTEEN_MIN_MS = 15 * 60 * 1000

export function proxy(req: NextRequest): NextResponse {
  const path = req.nextUrl.pathname

  // Root: send the visitor to their preferred locale homepage (canonical URL).
  if (path === '/') {
    const locale = preferredLocale(req.headers.get('accept-language'))
    return NextResponse.redirect(new URL(`/${locale}`, req.url), 307)
  }

  if (req.method !== 'POST') return NextResponse.next()

  const ip = clientIp(req.headers)

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
  matcher: ['/', '/api/users', '/api/users/login'],
}
