import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { PostGrid } from '@/components/blog/post-grid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getDictionary } from '@/i18n'
import { isLocale, LOCALES, type Locale } from '@/i18n/config'
import { getCurrentUser } from '@/lib/auth'
import { getPostsByIds } from '@/lib/posts'
import { getReactedPostIds } from '@/lib/reactions'
import { buildPageMetadata } from '@/lib/seo'
import { routes } from '@/lib/routes'

export const dynamic = 'force-dynamic'

interface ProfilePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return buildPageMetadata({
    locale,
    title: dict.profile.title,
    paths: Object.fromEntries(LOCALES.map((l) => [l, routes.profile(l)])) as Record<
      Locale,
      string
    >,
    noindex: true,
  })
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const user = await getCurrentUser()
  if (!user) redirect(routes.login(locale as Locale, routes.profile(locale as Locale)))

  const dict = getDictionary(locale as Locale)

  const [likedIds, bookmarkedIds] = await Promise.all([
    getReactedPostIds('likes', user),
    getReactedPostIds('bookmarks', user),
  ])
  const [likedPosts, bookmarkedPosts] = await Promise.all([
    getPostsByIds(locale as Locale, likedIds),
    getPostsByIds(locale as Locale, bookmarkedIds),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">
          {dict.profile.greeting}, {user.name}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {dict.profile.title}
        </h1>
      </header>

      <Tabs defaultValue="liked">
        <TabsList>
          <TabsTrigger value="liked">
            {dict.profile.liked} ({likedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="bookmarked">
            {dict.profile.bookmarked} ({bookmarkedPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liked">
          <PostGrid
            posts={likedPosts}
            locale={locale as Locale}
            dict={dict}
            emptyMessage={dict.profile.likedEmpty}
          />
        </TabsContent>
        <TabsContent value="bookmarked">
          <PostGrid
            posts={bookmarkedPosts}
            locale={locale as Locale}
            dict={dict}
            emptyMessage={dict.profile.bookmarkedEmpty}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
