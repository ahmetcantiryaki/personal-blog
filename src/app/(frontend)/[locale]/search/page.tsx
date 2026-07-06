import { Search } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostGrid } from '@/components/blog/post-grid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getDictionary } from '@/i18n'
import { isLocale, LOCALES, type Locale } from '@/i18n/config'
import { searchPosts } from '@/lib/posts'
import { buildPageMetadata } from '@/lib/seo'
import { routes } from '@/lib/routes'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return buildPageMetadata({
    locale,
    title: dict.search.title,
    description: dict.search.placeholder,
    paths: Object.fromEntries(LOCALES.map((l) => [l, routes.search(l)])) as Record<Locale, string>,
    noindex: true,
  })
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const query = ((await searchParams).q ?? '').trim()
  const dict = getDictionary(locale as Locale)
  const results = query ? await searchPosts(locale as Locale, query) : []

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {dict.search.title}
        </h1>
        <form
          action={routes.search(locale as Locale)}
          method="get"
          role="search"
          className="mt-6 flex gap-2"
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              name="q"
              type="search"
              defaultValue={query}
              placeholder={dict.search.placeholder}
              aria-label={dict.search.title}
              className="pl-9"
              autoFocus
            />
          </div>
          <Button type="submit">{dict.search.submit}</Button>
        </form>
      </header>

      {query ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            {dict.search.resultsFor}{' '}
            <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>{' '}
            <span aria-hidden>·</span> {results.length}{' '}
            {results.length === 1 ? dict.search.resultOne : dict.search.resultMany}
          </p>
          <PostGrid
            posts={results}
            locale={locale as Locale}
            dict={dict}
            emptyMessage={dict.search.noResults}
          />
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border/70 px-6 py-16 text-center text-muted-foreground">
          {dict.search.prompt}
        </p>
      )}
    </div>
  )
}
