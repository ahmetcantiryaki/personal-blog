import { notFound } from 'next/navigation'

import { CategoryChips } from '@/components/blog/category-chips'
import { FeaturedPost } from '@/components/blog/featured-post'
import { Pagination } from '@/components/blog/pagination'
import { PostGrid } from '@/components/blog/post-grid'
import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import { listPosts } from '@/lib/posts'
import { listCategories } from '@/lib/taxonomy'
import { routes } from '@/lib/routes'

export const revalidate = 300

interface HomeProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}

const parsePage = (value?: string): number => {
  const n = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

export default async function Home({ params, searchParams }: HomeProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const page = parsePage((await searchParams).page)
  const dict = getDictionary(locale)

  const [{ posts, totalPages }, categories] = await Promise.all([
    listPosts({ locale, page }),
    listCategories(locale),
  ])

  const featured = page === 1 ? posts[0] : undefined
  const gridPosts = featured ? posts.slice(1) : posts

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          {dict.siteName}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{dict.tagline}</p>
      </header>

      <div className="mb-10">
        <CategoryChips categories={categories} locale={locale} dict={dict} activeSlug={null} />
      </div>

      {featured ? (
        <section aria-label={dict.home.featured} className="mb-14">
          <FeaturedPost post={featured} locale={locale} dict={dict} />
        </section>
      ) : null}

      <section aria-label={dict.home.latest}>
        {page === 1 ? (
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {dict.home.latest}
          </h2>
        ) : null}
        <PostGrid posts={gridPosts} locale={locale} dict={dict} />
      </section>

      <div className="mt-12">
        <Pagination
          page={page}
          totalPages={totalPages}
          hrefForPage={(p) => `${routes.home(locale)}?page=${p}`}
          labels={{ previous: dict.nav.home, next: dict.nav.home }}
        />
      </div>
    </div>
  )
}
