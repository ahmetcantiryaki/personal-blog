import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CategoryChips } from '@/components/blog/category-chips'
import { Pagination } from '@/components/blog/pagination'
import { PostGrid } from '@/components/blog/post-grid'
import { JsonLd } from '@/components/seo/json-ld'
import { getDictionary } from '@/i18n'
import { isLocale, LOCALES, type Locale } from '@/i18n/config'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/json-ld'
import { listPosts } from '@/lib/posts'
import { buildPageMetadata, getTaxonomyAlternateSlugs, pathsFromSlugs } from '@/lib/seo'
import { getCategoryBySlug, listCategories } from '@/lib/taxonomy'
import { routes } from '@/lib/routes'

export const revalidate = 300
// All categories are prerendered; unknown slugs return a genuine 404.
export const dynamicParams = false

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string }>
}

const parsePage = (value?: string): number => {
  const n = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

/** Prerender each category in every locale; unknown slugs still render on demand. */
export async function generateStaticParams(): Promise<{ locale: Locale; slug: string }[]> {
  const params: { locale: Locale; slug: string }[] = []
  for (const locale of LOCALES) {
    const categories = await listCategories(locale)
    for (const category of categories) {
      if (category.slug) params.push({ locale, slug: category.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const category = await getCategoryBySlug(locale, slug)
  if (!category) return {}

  const dict = getDictionary(locale)
  const slugs = await getTaxonomyAlternateSlugs('categories', category.id)
  const paths = pathsFromSlugs(slugs, routes.category)

  return buildPageMetadata({
    locale,
    title: `${category.title} — ${dict.category.title}`,
    description: category.description || `${dict.category.postsIn} · ${category.title}`,
    paths,
    type: 'website',
  })
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const category = await getCategoryBySlug(locale, slug)
  if (!category) notFound()

  const page = parsePage((await searchParams).page)
  const dict = getDictionary(locale)

  const [{ posts, totalPages }, categories] = await Promise.all([
    listPosts({ locale, page, categorySlug: slug }),
    listCategories(locale),
  ])

  const canonicalPath = routes.category(locale, slug)
  const jsonLd = [
    collectionPageJsonLd({
      locale,
      url: canonicalPath,
      name: category.title,
      description: category.description || undefined,
    }),
    breadcrumbJsonLd([
      { name: dict.nav.home, url: routes.home(locale) },
      { name: category.title, url: canonicalPath },
    ]),
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={jsonLd} />
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
        <CategoryChips categories={categories} locale={locale} dict={dict} activeSlug={slug} />
      </div>

      <PostGrid posts={posts} locale={locale} dict={dict} emptyMessage={dict.category.empty} />

      <div className="mt-12">
        <Pagination
          page={page}
          totalPages={totalPages}
          hrefForPage={(p) => `${routes.category(locale, slug)}?page=${p}`}
        />
      </div>
    </div>
  )
}
