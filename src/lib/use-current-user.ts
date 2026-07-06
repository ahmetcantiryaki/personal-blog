'use client'

import * as React from 'react'

export interface CurrentUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'reader'
}

interface CurrentUserState {
  user: CurrentUser | null
  loading: boolean
}

/** Window event the auth forms fire after a successful login/register. */
export const AUTH_CHANGED_EVENT = 'auth-changed'

/** Notify all `useCurrentUser` consumers to re-resolve the session immediately. */
export function notifyAuthChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
  }
}

/**
 * Client hook that resolves the signed-in user via Payload's /api/users/me.
 * Used by header/mobile auth widgets so listing pages can stay statically
 * rendered while still showing correct auth state.
 *
 * Re-fetches on mount and whenever an `auth-changed` event fires, so the header
 * avatar appears right after an SPA login/register without a hard reload.
 */
export function useCurrentUser(): CurrentUserState {
  const [state, setState] = React.useState<CurrentUserState>({ user: null, loading: true })

  React.useEffect(() => {
    let active = true

    const load = () => {
      fetch('/api/users/me', { headers: { 'Content-Type': 'application/json' } })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { user?: CurrentUser | null } | null) => {
          if (active) setState({ user: data?.user ?? null, loading: false })
        })
        .catch(() => {
          if (active) setState({ user: null, loading: false })
        })
    }

    load()
    window.addEventListener(AUTH_CHANGED_EVENT, load)
    return () => {
      active = false
      window.removeEventListener(AUTH_CHANGED_EVENT, load)
    }
  }, [])

  return state
}
