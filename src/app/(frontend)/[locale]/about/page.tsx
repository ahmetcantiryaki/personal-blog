import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getDictionary } from '@/i18n'
import { isLocale, LOCALES, type Locale } from '@/i18n/config'
import { buildPageMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { routes } from '@/lib/routes'

export const revalidate = 300

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const settings = await getSiteSettings(locale)
  return buildPageMetadata({
    locale,
    title: dict.about.title,
    description: settings.tagline,
    paths: Object.fromEntries(LOCALES.map((l) => [l, routes.about(l)])) as Record<Locale, string>,
    type: 'website',
  })
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale as Locale)
  const settings = await getSiteSettings(locale as Locale)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {dict.about.title}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {settings.siteName}
        </h1>
      </header>

      <div className="prose">
        <p className="lead text-xl text-muted-foreground">{settings.tagline}</p>
        <p>{settings.footerText}</p>
        {settings.socialLinks.length > 0 ? (
          <ul>
            {settings.socialLinks.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
