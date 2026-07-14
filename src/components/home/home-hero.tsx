import { ArrowRight, Compass } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'

interface HomeHeroProps {
  locale: Locale
  dict: Dictionary
}

/**
 * Homepage hero: the site's value proposition and the two differentiator CTAs.
 * Replaces the old plain siteName header so the locale homepage reads as a real
 * homepage rather than a bare feed. Calm editorial look — serif display type,
 * generous whitespace, no gradients.
 */
export function HomeHero({ locale, dict }: HomeHeroProps) {
  return (
    <section className="mb-14 max-w-3xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
        {dict.siteName}
      </p>
      <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {dict.home.hero.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        {dict.home.hero.subtitle}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href={`/${locale}/tools`}>
            <Compass className="size-4" aria-hidden="true" />
            {dict.home.hero.ctaTools}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/${locale}/transparency`}>
            {dict.home.hero.ctaTransparency}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
