import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { PostWithRelations } from '@/lib/posts'
import { routes } from '@/lib/routes'
import { Badge } from '@/components/ui/badge'

import { PostCover } from './post-cover'
import { PostMeta } from './post-meta'

interface FeaturedPostProps {
  post: PostWithRelations
  locale: Locale
  dict: Dictionary
}

/** Large hero card for the newest post on the home page. */
export function FeaturedPost({ post, locale, dict }: FeaturedPostProps) {
  const href = routes.post(locale, post.slug)

  return (
    <article className="relative grid overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm md:grid-cols-2">
      <div className="aspect-[16/10] overflow-hidden md:aspect-auto">
        <div className="relative h-full w-full">
          <PostCover
            coverImage={post.coverImage}
            style={post.coverStyle}
            title={post.title}
            seed={post.slug}
            categoryLabel={post.category?.title}
            variant="hero"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 p-6 sm:p-9">
        <div className="flex items-center gap-2">
          <Badge>{dict.home.featured}</Badge>
          {post.category ? (
            <span className="text-sm text-muted-foreground">{post.category.title}</span>
          ) : null}
        </div>

        <h2 className="font-serif text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          <Link href={href} className="after:absolute after:inset-0 hover:text-primary">
            {post.title}
          </Link>
        </h2>

        {post.excerpt ? (
          <p className="line-clamp-3 leading-relaxed text-muted-foreground">{post.excerpt}</p>
        ) : null}

        <PostMeta
          locale={locale}
          dict={dict}
          publishedAt={post.publishedAt}
          readingTime={post.readingTime}
        />

        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          {dict.home.readMore}
          <ArrowRight className="size-4" />
        </span>
      </div>
    </article>
  )
}
