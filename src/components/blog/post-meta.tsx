import { Clock } from 'lucide-react'

import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

interface PostMetaProps {
  locale: Locale
  dict: Dictionary
  publishedAt?: string | null
  readingTime?: number | null
  className?: string
}

/** Compact date + reading-time line used on cards and the post hero. */
export function PostMeta({ locale, dict, publishedAt, readingTime, className }: PostMetaProps) {
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
          <span aria-hidden className="text-border">
            •
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />
            {readingTime} {dict.post.minRead}
          </span>
        </>
      ) : null}
    </div>
  )
}
