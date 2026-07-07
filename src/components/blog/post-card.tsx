import Link from 'next/link'

import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { PostWithRelations } from '@/lib/posts'
import { routes } from '@/lib/routes'

import { PostCover } from './post-cover'
import { PostMeta } from './post-meta'

interface PostCardProps {
  post: PostWithRelations
  locale: Locale
  dict: Dictionary
}

/** Standard post card used across grids, related and profile lists. */
export function PostCard({ post, locale, dict }: PostCardProps) {
  const href = routes.post(locale, post.slug)

  return (
    <article className="relative flex flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
      <div className="aspect-[16/10] overflow-hidden">
        <div className="relative h-full w-full">
          <PostCover
            coverImage={post.coverImage}
            style={post.coverStyle}
            title={post.title}
            seed={post.slug}
            categoryLabel={post.category?.title}
            variant="card"
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <PostMeta
          locale={locale}
          dict={dict}
          publishedAt={post.publishedAt}
          readingTime={post.readingTime}
        />
        <h3 className="text-lg font-semibold leading-snug tracking-tight">
          <Link
            href={href}
            className="after:absolute after:inset-0 hover:text-primary focus-visible:text-primary"
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  )
}
