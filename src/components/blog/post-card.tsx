import Link from 'next/link'

import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { PostWithRelations } from '@/lib/posts'
import { routes } from '@/lib/routes'

import { CoverArt } from './cover-art'
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
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[16/10] overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
          <CoverArt
            style={post.coverStyle}
            title={post.title}
            seed={post.slug}
            categoryLabel={post.category?.title}
            variant="card"
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
