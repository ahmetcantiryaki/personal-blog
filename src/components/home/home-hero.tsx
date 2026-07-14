import { ArrowRight, Compass, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'

interface HomeHeroProps {
  locale: Locale
  dict: Dictionary
}

/**
 * Homepage hero: the site's value proposition and the two differentiator CTAs.
 * Startup-style layout (badge pill, bold headline with a highlighted word,
 * social-proof stat line) while staying inside the site's calm editorial
 * palette — no multicolor gradients, just a faint primary-tinted halo.
 */
export function HomeHero({ locale, dict }: HomeHeroProps) {
  const { hero } = dict.home

  return (
    <section className="relative mb-16 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 left-1/2 -z-10 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] bg-[size:24px_24px] opacity-[0.15] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
      />

      <div className="mx-auto max-w-3xl text-center">
        <Badge
          variant="outline"
          className="mb-5 gap-1.5 border-primary/30 bg-primary/5 px-3 py-1 text-primary"
        >
          <Sparkles className="size-3.5" aria-hidden="true" />
          {hero.badge}
        </Badge>

        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {hero.titleLead} <span className="text-primary">{hero.titleHighlight}</span>{' '}
          {hero.titleTail}
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {hero.subtitle}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href={`/${locale}/tools`}>
              <Compass className="size-4" aria-hidden="true" />
              {hero.ctaTools}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`/${locale}/transparency`}>
              {hero.ctaTransparency}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm font-medium text-muted-foreground">{hero.stats}</p>
      </div>
    </section>
  )
}
