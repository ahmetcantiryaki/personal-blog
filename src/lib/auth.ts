import 'server-only'

import { headers as nextHeaders } from 'next/headers'

import type { User } from '@/payload-types'

import { getPayloadClient } from './payload'

const SERVER_ORIGIN = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Resolve the currently authenticated user from the request cookies, or null
 * when signed out. Safe to call from any server component / route handler.
 *
 * Payload only honours cookie auth when the request presents a same-origin
 * `Origin`/`Referer` (CSRF protection). Top-level document requests (hard
 * refresh, direct URL) may omit both, so we inject the server origin to keep
 * server-side auth reliable.
 */
export async function getCurrentUser(): Promise<User | null> {
  // Read headers OUTSIDE the try so Next's dynamic-rendering bailout is never
  // swallowed — otherwise pages that need per-user data prerender as static.
  const incoming = await nextHeaders()
  const headers = new Headers(incoming)
  if (!headers.has('origin') && !headers.has('referer')) {
    headers.set('origin', SERVER_ORIGIN)
  }

  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers })
    return user ?? null
  } catch {
    return null
  }
}
