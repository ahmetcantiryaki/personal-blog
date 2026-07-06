import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostContent } from '@/components/blog/post-content'
import { PostHero } from '@/components/blog/post-hero'
import { ReactionButtons } from '@/components/blog/reaction-buttons'
import { RelatedPosts } from '@/components/blog/related-posts'
import { ShareButtons } from '@/components/blog/share-buttons'
import { ViewTracker } from '@/components/blog/view-tracker'
import { JsonLd } from '@/components/seo/json-ld'
import { Separator } from '@/components/ui/separator'
import { getDictionary } from '@/i18n'
import { isLocale, LOCALES, type Locale } from '@/i18n/config'
import { articleJsonLd, breadcrumbJsonLd, type Crumb } from '@/lib/json-ld'
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/lib/posts'
import { getReactionState } from '@/lib/reactions'
import {
  absoluteUrl,
  buildPageMetadata,
  getPostAlternateSlugs,
  lexicalToPlainText,
  pathsFromSlugs,
  SITE_AUTHOR,
} from '@/lib/seo'
import { routes } from '@/lib/routes'

export const revalidate = 300
// Every published post is prerendered; unknown slugs are a genuine 404 (proper
// status) rather than a soft-404 shell flushed by the loading boundary.
export const dynamicParams = false

interface PostPageProps {
  params: Promise<{ locale: string; slug: string }>
}

/** Prerender every published post in both locales (ISR revalidate 300). */
export async function generateStaticParams(): Promise<{ locale: Locale; slug: string }[]> {
  const params: { locale: Locale; slug: string }[] = []
  for (const locale of LOCALES) {
    const slugs = await getAllPostSlugs(locale)
    for (const slug of slugs) params.push({ locale, slug })
  }
  return params
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const post = await getPostBySlug(locale, slug)
  if (!post) return {}

  const description =
    post.seo?.seoDescription || post.excerpt || lexicalToPlainText(post.content, 200) || undefined
  const slugs = await getPostAlternateSlugs(post.translationKey)
  const paths = pathsFromSlugs(slugs, routes.post)

  return buildPageMetadata({
    locale,
    title: post.seo?.seoTitle || post.title,
    description,
    paths,
    type: 'article',
    article: {
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt,
      authors: [SITE_AUTHOR],
      tags: post.tags?.map((t) => t.title) ?? undefined,
      section: post.category?.title ?? undefined,
    },
  })
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const post = await getPostBySlug(locale, slug)
  if (!post) notFound()

  // Counts only (passing user=null skips the per-user query and never reads
  // cookies) so the page stays statically renderable / ISR. Per-user active
  // state is resolved client-side by ReactionButtons.
  const [likes, bookmarks, related] = await Promise.all([
    getReactionState('likes', post.id, null),
    getReactionState('bookmarks', post.id, null),
    getRelatedPosts(locale, post),
  ])

  const dict = getDictionary(locale)
  const postUrl = routes.post(locale, slug)
  const description =
    post.seo?.seoDescription || post.excerpt || lexicalToPlainText(post.content, 200) || undefined

  const crumbs: Crumb[] = [{ name: dict.nav.home, url: routes.home(locale) }]
  if (post.category?.slug) {
    crumbs.push({ name: post.category.title, url: routes.category(locale, post.category.slug) })
  }
  crumbs.push({ name: post.title, url: postUrl })

  const jsonLd = [
    articleJsonLd({
      locale,
      url: postUrl,
      title: post.title,
      description,
      datePublished: post.publishedAt || undefined,
      dateModified: post.updatedAt,
      imageUrl: absoluteUrl(`${postUrl}/opengraph-image`),
      section: post.category?.title ?? undefined,
      tags: post.tags?.map((t) => t.title),
    }),
    breadcrumbJsonLd(crumbs),
  ]

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={jsonLd} />
      <ViewTracker path={postUrl} slug={slug} />

      <PostHero post={post} locale={locale} dict={dict} />

      <PostContent content={post.content} />

      <Separator className="my-10" />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <ReactionButtons
          postId={post.id}
          locale={locale}
          dict={dict}
          initialLikes={likes.count}
          initialBookmarks={bookmarks.count}
          returnTo={postUrl}
        />
        <ShareButtons url={postUrl} title={post.title} dict={dict} />
      </div>

      {related.length > 0 ? (
        <div className="mt-16">
          <RelatedPosts posts={related} locale={locale} dict={dict} />
        </div>
      ) : null}
    </article>
  )
}
