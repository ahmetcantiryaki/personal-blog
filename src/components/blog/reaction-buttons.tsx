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
  isLoggedIn: boolean
  initialLikes: { count: number; active: boolean }
  initialBookmarks: { count: number; active: boolean }
  /** Path to return to after login (this post's URL). */
  returnTo: string
}

interface ToggleState {
  count: number
  active: boolean
  pending: boolean
}

export function ReactionButtons({
  postId,
  locale,
  dict,
  isLoggedIn,
  initialLikes,
  initialBookmarks,
  returnTo,
}: ReactionButtonsProps) {
  const router = useRouter()
  const [likes, setLikes] = React.useState<ToggleState>({ ...initialLikes, pending: false })
  const [bookmarks, setBookmarks] = React.useState<ToggleState>({
    ...initialBookmarks,
    pending: false,
  })

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
