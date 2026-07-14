import { Clock, Eye, Heart } from 'lucide-react'

import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { formatCompactCount, formatDate, formatFullCount } from '@/lib/format'
import { cn } from '@/lib/utils'

interface PostMetaProps {
  locale: Locale
  dict: Dictionary
  publishedAt?: string | null
  readingTime?: number | null
  /** Real total views; hidden when 0 (looks poor on brand-new posts). */
  views?: number
  /** Real total likes; hidden when 0. */
  likes?: number
  className?: string
}

const Dot = () => (
  <span aria-hidden className="text-border">
    •
  </span>
)

/** Compact date + reading-time (+ optional view/like) line for cards and hero. */
export function PostMeta({
  locale,
  dict,
  publishedAt,
  readingTime,
  views,
  likes,
  className,
}: PostMetaProps) {
  const showViews = typeof views === 'number' && views > 0
  const showLikes = typeof likes === 'number' && likes > 0

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground',
        className,
      )}
    >
      {publishedAt ? (
        <time dateTime={publishedAt}>{formatDate(publishedAt, locale)}</time>
      ) : null}
      {readingTime ? (
        <>
          <Dot />
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />
            {readingTime} {dict.post.minRead}
          </span>
        </>
      ) : null}
      {showViews ? (
        <>
          <Dot />
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" aria-hidden />
            <span aria-hidden>{formatCompactCount(views, locale)}</span>
            <span className="sr-only">
              {formatFullCount(views, locale)} {dict.post.views}
            </span>
          </span>
        </>
      ) : null}
      {showLikes ? (
        <>
          <Dot />
          <span className="inline-flex items-center gap-1">
            <Heart className="size-3.5" aria-hidden />
            <span aria-hidden>{formatCompactCount(likes, locale)}</span>
            <span className="sr-only">
              {formatFullCount(likes, locale)} {dict.post.likes}
            </span>
          </span>
        </>
      ) : null}
    </div>
  )
}
