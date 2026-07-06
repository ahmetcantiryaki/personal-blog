import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { PostWithRelations } from '@/lib/posts'

import { PostCard } from './post-card'

interface PostGridProps {
  posts: PostWithRelations[]
  locale: Locale
  dict: Dictionary
  emptyMessage?: string
}

/** Responsive 1 → 2 → 3 column grid of post cards. */
export function PostGrid({ posts, locale, dict, emptyMessage }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border/70 px-6 py-16 text-center text-muted-foreground">
        {emptyMessage ?? dict.home.empty}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} locale={locale} dict={dict} />
      ))}
    </div>
  )
}
