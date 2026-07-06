import { Search } from 'lucide-react'
import Link from 'next/link'

import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { listCategories } from '@/lib/taxonomy'
import { routes } from '@/lib/routes'

import { AuthNav } from './auth-nav'
import { CategoriesNav } from './categories-nav'
import { LocaleSwitcher } from './locale-switcher'
import { MobileNav } from './mobile-nav'

interface HeaderProps {
  locale: Locale
  dict: Dictionary
  siteName: string
}

/**
 * Sticky site header: wordmark, nav, search, theme, locale, auth state.
 * Auth state is resolved client-side (AuthNav / MobileNav) so listing pages
 * remain statically renderable.
 */
export async function Header({ locale, dict, siteName }: HeaderProps) {
  const categories = await listCategories(locale)

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href={routes.home(locale)}
          className="font-serif text-xl font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {siteName}
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label={dict.nav.menu}>
          <Link
            href={routes.home(locale)}
            className="rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {dict.nav.home}
          </Link>
          <CategoriesNav categories={categories} locale={locale} label={dict.nav.categories} />
          <Link
            href={routes.about(locale)}
            className="rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {dict.nav.about}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild aria-label={dict.nav.search}>
            <Link href={routes.search(locale)}>
              <Search className="size-5" />
            </Link>
          </Button>
          <ThemeToggle
            labels={{
              light: dict.nav.light,
              dark: dict.nav.dark,
              system: dict.nav.system,
              toggle: dict.nav.toggleTheme,
            }}
          />
          <LocaleSwitcher locale={locale} ariaLabel={dict.nav.menu} />

          <div className="hidden md:flex md:items-center md:gap-2">
            <AuthNav locale={locale} dict={dict} />
          </div>

          <MobileNav locale={locale} dict={dict} categories={categories} />
        </div>
      </div>
    </header>
  )
}
