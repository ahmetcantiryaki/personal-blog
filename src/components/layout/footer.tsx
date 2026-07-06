import Link from 'next/link'
import { Rss } from 'lucide-react'

import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { ResolvedSiteSettings } from '@/lib/site-settings'
import { routes } from '@/lib/routes'

interface FooterProps {
  locale: Locale
  dict: Dictionary
  settings: ResolvedSiteSettings
}

/** Minimal site footer: wordmark, footer text, social + RSS links. */
export function Footer({ locale, dict, settings }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-2">
          <p className="font-serif text-lg font-semibold tracking-tight">{settings.siteName}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{settings.footerText}</p>
        </div>

        <div className="flex flex-col gap-3">
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label={dict.nav.menu}>
            <Link
              href={routes.home(locale)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {dict.nav.home}
            </Link>
            <Link
              href={routes.about(locale)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {dict.nav.about}
            </Link>
            {settings.socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Link
              href={routes.feed(locale)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Rss className="size-3.5" />
              {dict.footer.rss}
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
          © {year} {settings.siteName}. {dict.footer.rights}
        </div>
      </div>
    </footer>
  )
}
