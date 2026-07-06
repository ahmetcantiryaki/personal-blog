import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CategoryChips } from '@/components/blog/category-chips'
import { Pagination } from '@/components/blog/pagination'
import { PostGrid } from '@/components/blog/post-grid'
import { getDictionary } from '@/i18n'
import { isLocale, type Locale } from '@/i18n/config'
import { listPosts } from '@/lib/posts'
import { getCategoryBySlug, listCategories } from '@/lib/taxonomy'
import { routes } from '@/lib/routes'

export const revalidate = 300

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string }>
}

const parsePage = (value?: string): number => {
  const n = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const category = await getCategoryBySlug(locale, slug)
  return category ? { title: category.title, description: category.description || undefined } : {}
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const category = await getCategoryBySlug(locale as Locale, slug)
  if (!category) notFound()

  const page = parsePage((await searchParams).page)
  const dict = getDictionary(locale as Locale)

  const [{ posts, totalPages }, categories] = await Promise.all([
    listPosts({ locale: locale as Locale, page, categorySlug: slug }),
    listCategories(locale as Locale),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {dict.category.title}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {category.title}
        </h1>
        {category.description ? (
          <p className="mt-3 max-w-2xl text-muted-foreground">{category.description}</p>
        ) : null}
      </header>

      <div className="mb-10">
        <CategoryChips
          categories={categories}
          locale={locale as Locale}
          dict={dict}
          activeSlug={slug}
        />
      </div>

      <PostGrid
        posts={posts}
        locale={locale as Locale}
        dict={dict}
        emptyMessage={dict.category.empty}
      />

      <div className="mt-12">
        <Pagination
          page={page}
          totalPages={totalPages}
          hrefForPage={(p) => `${routes.category(locale as Locale, slug)}?page=${p}`}
        />
      </div>
    </div>
  )
}
