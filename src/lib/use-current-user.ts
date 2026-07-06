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

/**
 * Client hook that resolves the signed-in user via Payload's /api/users/me.
 * Used by header/mobile auth widgets so listing pages can stay statically
 * rendered while still showing correct auth state.
 */
export function useCurrentUser(): CurrentUserState {
  const [state, setState] = React.useState<CurrentUserState>({ user: null, loading: true })

  React.useEffect(() => {
    let active = true
    fetch('/api/users/me', { headers: { 'Content-Type': 'application/json' } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { user?: CurrentUser | null } | null) => {
        if (active) setState({ user: data?.user ?? null, loading: false })
      })
      .catch(() => {
        if (active) setState({ user: null, loading: false })
      })
    return () => {
      active = false
    }
  }, [])

  return state
}
