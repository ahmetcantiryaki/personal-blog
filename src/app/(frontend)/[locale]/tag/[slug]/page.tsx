import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Pagination } from '@/components/blog/pagination'
import { PostGrid } from '@/components/blog/post-grid'
import { JsonLd } from '@/components/seo/json-ld'
import { getDictionary } from '@/i18n'
import { isLocale, LOCALES, type Locale } from '@/i18n/config'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/json-ld'
import { getPayloadClient } from '@/lib/payload'
import { listPosts } from '@/lib/posts'
import { buildPageMetadata, getTaxonomyAlternateSlugs, pathsFromSlugs } from '@/lib/seo'
import { getTagBySlug } from '@/lib/taxonomy'
import { routes } from '@/lib/routes'

export const revalidate = 300
// All tags are prerendered; unknown slugs return a genuine 404.
export const dynamicParams = false

interface TagPageProps {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string }>
}

const parsePage = (value?: string): number => {
  const n = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

/** Prerender each tag in every locale; unknown slugs still render on demand. */
export async function generateStaticParams(): Promise<{ locale: Locale; slug: string }[]> {
  const payload = await getPayloadClient()
  const params: { locale: Locale; slug: string }[] = []
  for (const locale of LOCALES) {
    const result = await payload.find({
      collection: 'tags',
      locale,
      depth: 0,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
    })
    for (const tag of result.docs) {
      if (tag.slug) params.push({ locale, slug: tag.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const tag = await getTagBySlug(locale, slug)
  if (!tag) return {}

  const dict = getDictionary(locale)
  const slugs = await getTaxonomyAlternateSlugs('tags', tag.id)
  const paths = pathsFromSlugs(slugs, routes.tag)

  return buildPageMetadata({
    locale,
    title: `#${tag.title} — ${dict.tag.title}`,
    description: `${dict.tag.postsWith} · #${tag.title}`,
    paths,
    type: 'website',
  })
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const tag = await getTagBySlug(locale, slug)
  if (!tag) notFound()

  const page = parsePage((await searchParams).page)
  const dict = getDictionary(locale)
  const { posts, totalPages } = await listPosts({ locale, page, tagSlug: slug })

  const canonicalPath = routes.tag(locale, slug)
  const jsonLd = [
    collectionPageJsonLd({
      locale,
      url: canonicalPath,
      name: `#${tag.title}`,
      description: `${dict.tag.postsWith} · #${tag.title}`,
    }),
    breadcrumbJsonLd([
      { name: dict.nav.home, url: routes.home(locale) },
      { name: `#${tag.title}`, url: canonicalPath },
    ]),
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={jsonLd} />
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {dict.tag.title}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          #{tag.title}
        </h1>
      </header>

      <PostGrid posts={posts} locale={locale} dict={dict} emptyMessage={dict.tag.empty} />

      <div className="mt-12">
        <Pagination
          page={page}
          totalPages={totalPages}
          hrefForPage={(p) => `${routes.tag(locale, slug)}?page=${p}`}
        />
      </div>
    </div>
  )
}
