'use client'

import { Bookmark, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { ReactionKind } from '@/lib/reactions'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

interface ReactionButtonsProps {
  postId: number
  locale: Locale
  dict: Dictionary
  /** Server-rendered public counts (static/ISR). Active state hydrates client-side. */
  initialLikes: number
  initialBookmarks: number
  /** Path to return to after login (this post's URL). */
  returnTo: string
}

interface ToggleState {
  count: number
  active: boolean
  pending: boolean
}

interface StateResponse {
  isLoggedIn: boolean
  likes: { active: boolean; count: number }
  bookmarks: { active: boolean; count: number }
}

/**
 * Like/bookmark buttons. Counts arrive from the server so the post page can be
 * statically rendered (ISR); the viewer's own active state + login status are
 * fetched on mount from `/api/reactions/state`. Toggling stays optimistic.
 */
export function ReactionButtons({
  postId,
  locale,
  dict,
  initialLikes,
  initialBookmarks,
  returnTo,
}: ReactionButtonsProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [likes, setLikes] = React.useState<ToggleState>({
    count: initialLikes,
    active: false,
    pending: false,
  })
  const [bookmarks, setBookmarks] = React.useState<ToggleState>({
    count: initialBookmarks,
    active: false,
    pending: false,
  })

  // Hydrate the viewer's active state + login status after mount.
  React.useEffect(() => {
    let active = true
    fetch(`/api/reactions/state?postId=${postId}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StateResponse | null) => {
        if (!active || !data) return
        setIsLoggedIn(data.isLoggedIn)
        setLikes((prev) => ({ ...prev, active: data.likes.active, count: data.likes.count }))
        setBookmarks((prev) => ({
          ...prev,
          active: data.bookmarks.active,
          count: data.bookmarks.count,
        }))
      })
      .catch(() => {
        /* keep server counts; toggling will prompt login as needed */
      })
    return () => {
      active = false
    }
  }, [postId])

  const toggle = React.useCallback(
    async (
      kind: ReactionKind,
      state: ToggleState,
      setState: React.Dispatch<React.SetStateAction<ToggleState>>,
    ) => {
      if (!isLoggedIn) {
        router.push(routes.login(locale, returnTo))
        return
      }
      if (state.pending) return

      const optimistic = {
        active: !state.active,
        count: state.count + (state.active ? -1 : 1),
        pending: true,
      }
      setState(optimistic)

      try {
        const res = await fetch('/api/reactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kind, postId }),
        })
        if (res.status === 401) {
          router.push(routes.login(locale, returnTo))
          setState({ ...state, pending: false })
          return
        }
        if (!res.ok) throw new Error('request failed')
        const data = (await res.json()) as { active: boolean; count: number }
        setState({ active: data.active, count: data.count, pending: false })
      } catch {
        setState({ ...state, pending: false })
        toast.error(dict.auth.genericError)
      }
    },
    [dict.auth.genericError, isLoggedIn, locale, postId, returnTo, router],
  )

  const btn =
    'inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60'

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => toggle('likes', likes, setLikes)}
        disabled={likes.pending}
        aria-pressed={likes.active}
        aria-label={likes.active ? dict.post.liked : dict.post.like}
        className={cn(btn, likes.active && 'border-primary/50 bg-primary/10 text-primary')}
      >
        <Heart className={cn('size-4', likes.active && 'fill-current')} />
        <span className="tabular-nums">{likes.count}</span>
      </button>

      <button
        type="button"
        onClick={() => toggle('bookmarks', bookmarks, setBookmarks)}
        disabled={bookmarks.pending}
        aria-pressed={bookmarks.active}
        aria-label={bookmarks.active ? dict.post.bookmarked : dict.post.bookmark}
        className={cn(btn, bookmarks.active && 'border-primary/50 bg-primary/10 text-primary')}
      >
        <Bookmark className={cn('size-4', bookmarks.active && 'fill-current')} />
        <span className="tabular-nums">{bookmarks.count}</span>
      </button>
    </div>
  )
}
