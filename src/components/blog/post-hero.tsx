import Image from 'next/image'
import Link from 'next/link'

import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { PostWithRelations } from '@/lib/posts'
import { routes } from '@/lib/routes'

import { PostCover } from './post-cover'
import { PostMeta } from './post-meta'
import { TagList } from './tag-list'

interface PostHeroProps {
  post: PostWithRelations
  locale: Locale
  dict: Dictionary
}

/** Article hero: cover banner, category, title, excerpt, byline, tags. */
export function PostHero({ post, locale, dict }: PostHeroProps) {
  return (
    <header className="mb-10">
      <div className="overflow-hidden rounded-xl border border-border/70">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1344}
            height={768}
            sizes="(min-width: 768px) 768px, 100vw"
            quality={92}
            priority
            className="h-auto w-full"
          />
        ) : (
          <div className="relative aspect-video">
            <PostCover
              coverImage={post.coverImage}
              style={post.coverStyle}
              title={post.title}
              seed={post.slug}
              variant="plain"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>
        )}
      </div>

      <div className="mt-8">
        {post.category ? (
          <Link
            href={routes.category(locale, post.category.slug)}
            className="text-sm font-medium uppercase tracking-[0.14em] text-primary transition-colors hover:text-primary/80"
          >
            {post.category.title}
          </Link>
        ) : null}

        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl md:text-[2.75rem]">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{dict.author}</span>
          <span aria-hidden className="text-border">
            •
          </span>
          <PostMeta
            locale={locale}
            dict={dict}
            publishedAt={post.publishedAt}
            readingTime={post.readingTime}
          />
        </div>

        {post.tags && post.tags.length > 0 ? (
          <div className="mt-6">
            <TagList tags={post.tags} locale={locale} />
          </div>
        ) : null}
      </div>
    </header>
  )
}
