import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Tag } from '@/payload-types'
import { routes } from '@/lib/routes'

interface TagListProps {
  tags: Tag[]
  locale: Locale
}

/** Row of tag links (hash-prefixed), used on the post hero. */
export function TagList({ tags, locale }: TagListProps) {
  if (tags.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag.id}>
          <Link
            href={routes.tag(locale, tag.slug)}
            className="inline-flex items-center rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            #{tag.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
