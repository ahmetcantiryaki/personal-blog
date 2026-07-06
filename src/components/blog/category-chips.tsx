import Link from 'next/link'

import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { Category } from '@/payload-types'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

interface CategoryChipsProps {
  categories: Category[]
  locale: Locale
  dict: Dictionary
  /** slug of the active category, or null for the "All" filter. */
  activeSlug?: string | null
}

const chipBase =
  'inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/** Horizontal, scrollable category filter chips. */
export function CategoryChips({ categories, locale, dict, activeSlug = null }: CategoryChipsProps) {
  return (
    <nav aria-label={dict.nav.categories} className="-mx-1 overflow-x-auto pb-1">
      <ul className="flex w-max items-center gap-2 px-1">
        <li>
          <Link
            href={routes.home(locale)}
            aria-current={activeSlug === null ? 'page' : undefined}
            className={cn(
              chipBase,
              activeSlug === null
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/70 text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {dict.home.filterAll}
          </Link>
        </li>
        {categories.map((category) => {
          const active = category.slug === activeSlug
          return (
            <li key={category.id}>
              <Link
                href={routes.category(locale, category.slug)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  chipBase,
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/70 text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {category.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
