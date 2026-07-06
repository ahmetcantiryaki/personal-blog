import { notFound } from 'next/navigation'
import React from 'react'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { JsonLd } from '@/components/seo/json-ld'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { getDictionary } from '@/i18n'
import { LOCALES, isLocale, type Locale } from '@/i18n/config'
import { inter, newsreader } from '@/lib/fonts'
import { organizationJsonLd } from '@/lib/json-ld'
import { getSiteSettings } from '@/lib/site-settings'

export function generateStaticParams(): { locale: Locale }[] {
  return LOCALES.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

/** Renders the localized HTML shell, theme provider and site chrome. */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const settings = await getSiteSettings(locale)

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <JsonLd data={organizationJsonLd()} />
        {/* NOTE: nextjs-toploader removed — its history.pushState override breaks
            Next 16 App Router query-only navigation (e.g. ?page=2). Re-add a
            route progress bar via @bprogress/next (Next 16-compatible) if desired. */}
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            {dict.nav.home}
          </a>
          <div className="flex min-h-dvh flex-col">
            <Header locale={locale} dict={dict} siteName={settings.siteName} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer locale={locale} dict={dict} settings={settings} />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
