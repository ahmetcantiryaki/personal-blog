import { BadgeCheck, Compass, Headphones } from 'lucide-react'
import Link from 'next/link'
import type { ComponentType } from 'react'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'

interface HomeShowcaseProps {
  locale: Locale
  dict: Dictionary
  /** Destination for the "listen" card — the current featured post, if any. */
  listenHref?: string
}

interface ShowcaseItem {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>
  title: string
  description: string
  href: string
}

/**
 * The differentiators strip: what this blog offers that other blogs don't.
 * Three quiet cards — tool picker, listen-to-articles, transparency.
 */
export function HomeShowcase({ locale, dict, listenHref }: HomeShowcaseProps) {
  const s = dict.home.showcase
  const items: ShowcaseItem[] = [
    { icon: Compass, title: s.toolsTitle, description: s.toolsDesc, href: `/${locale}/tools` },
    {
      icon: Headphones,
      title: s.listenTitle,
      description: s.listenDesc,
      href: listenHref ?? `/${locale}`,
    },
    {
      icon: BadgeCheck,
      title: s.transparencyTitle,
      description: s.transparencyDesc,
      href: `/${locale}/transparency`,
    },
  ]

  return (
    <section aria-label={s.title} className="mb-14">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {s.title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardHeader>
                <item.icon className="mb-1 size-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-base">{item.title}</CardTitle>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
