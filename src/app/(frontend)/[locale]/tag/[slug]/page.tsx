import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Pagination } from '@/components/blog/pagination'
import { PostGrid } from '@/components/blog/post-grid'
import { getDictionary } from '@/i18n'
import { isLocale, type Locale } from '@/i18n/config'
import { listPosts } from '@/lib/posts'
import { getTagBySlug } from '@/lib/taxonomy'
import { routes } from '@/lib/routes'

export const revalidate = 300

interface TagPageProps {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string }>
}

const parsePage = (value?: string): number => {
  const n = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const tag = await getTagBySlug(locale, slug)
  return tag ? { title: `#${tag.title}` } : {}
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const tag = await getTagBySlug(locale as Locale, slug)
  if (!tag) notFound()

  const page = parsePage((await searchParams).page)
  const dict = getDictionary(locale as Locale)
  const { posts, totalPages } = await listPosts({ locale: locale as Locale, page, tagSlug: slug })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {dict.tag.title}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          #{tag.title}
        </h1>
      </header>

      <PostGrid posts={posts} locale={locale as Locale} dict={dict} emptyMessage={dict.tag.empty} />

      <div className="mt-12">
        <Pagination
          page={page}
          totalPages={totalPages}
          hrefForPage={(p) => `${routes.tag(locale as Locale, slug)}?page=${p}`}
        />
      </div>
    </div>
  )
}
