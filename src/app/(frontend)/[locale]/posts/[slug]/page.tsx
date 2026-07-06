import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostContent } from '@/components/blog/post-content'
import { PostHero } from '@/components/blog/post-hero'
import { ReactionButtons } from '@/components/blog/reaction-buttons'
import { RelatedPosts } from '@/components/blog/related-posts'
import { ShareButtons } from '@/components/blog/share-buttons'
import { ViewTracker } from '@/components/blog/view-tracker'
import { Separator } from '@/components/ui/separator'
import { getDictionary } from '@/i18n'
import { isLocale, type Locale } from '@/i18n/config'
import { getCurrentUser } from '@/lib/auth'
import { getPostBySlug, getRelatedPosts } from '@/lib/posts'
import { getReactionState } from '@/lib/reactions'
import { routes } from '@/lib/routes'

export const revalidate = 300

interface PostPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const post = await getPostBySlug(locale, slug)
  if (!post) return {}
  return {
    title: post.seo?.seoTitle || post.title,
    description: post.seo?.seoDescription || post.excerpt || undefined,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const post = await getPostBySlug(locale as Locale, slug)
  if (!post) notFound()

  const user = await getCurrentUser()
  const [likes, bookmarks, related] = await Promise.all([
    getReactionState('likes', post.id, user),
    getReactionState('bookmarks', post.id, user),
    getRelatedPosts(locale as Locale, post),
  ])

  const dict = getDictionary(locale as Locale)
  const postUrl = routes.post(locale as Locale, slug)

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <ViewTracker path={postUrl} slug={slug} />

      <PostHero post={post} locale={locale as Locale} dict={dict} />

      <PostContent content={post.content} />

      <Separator className="my-10" />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <ReactionButtons
          postId={post.id}
          locale={locale as Locale}
          dict={dict}
          isLoggedIn={Boolean(user)}
          initialLikes={likes}
          initialBookmarks={bookmarks}
          returnTo={postUrl}
        />
        <ShareButtons url={postUrl} title={post.title} dict={dict} />
      </div>

      {related.length > 0 ? (
        <div className="mt-16">
          <RelatedPosts posts={related} locale={locale as Locale} dict={dict} />
        </div>
      ) : null}
    </article>
  )
}
