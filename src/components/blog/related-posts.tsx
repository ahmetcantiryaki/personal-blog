import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { PostWithRelations } from '@/lib/posts'

import { PostCard } from './post-card'

interface RelatedPostsProps {
  posts: PostWithRelations[]
  locale: Locale
  dict: Dictionary
}

/** "Related posts" section shown below an article. */
export function RelatedPosts({ posts, locale, dict }: RelatedPostsProps) {
  if (posts.length === 0) return null
  return (
    <section aria-label={dict.post.related} className="border-t border-border/70 pt-10">
      <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">{dict.post.related}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} dict={dict} />
        ))}
      </div>
    </section>
  )
}
