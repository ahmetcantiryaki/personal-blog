'use client'

import { Globe } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

interface LocaleSwitcherProps {
  locale: Locale
  ariaLabel: string
}

const POST_PATH = new RegExp(`^/(${LOCALES.join('|')})/posts/([^/?#]+)`)

/**
 * Locale switcher. On post pages it resolves the paired translation slug (via
 * /api/post-alternates) so the link points at the correct translated slug;
 * elsewhere it simply swaps the leading locale segment of the current path.
 */
export function LocaleSwitcher({ locale, ariaLabel }: LocaleSwitcherProps) {
  const pathname = usePathname()
  const [alternates, setAlternates] = React.useState<Record<Locale, string | null> | null>(null)

  const postMatch = pathname.match(POST_PATH)
  const postSlug = postMatch?.[2] ?? null

  React.useEffect(() => {
    if (!postSlug) {
      setAlternates(null)
      return
    }
    let active = true
    setAlternates(null)
    fetch(`/api/post-alternates?slug=${encodeURIComponent(postSlug)}&from=${locale}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Record<Locale, string | null> | null) => {
        if (active && data) setAlternates(data)
      })
      .catch(() => {
        /* fall back to prefix swap */
      })
    return () => {
      active = false
    }
  }, [postSlug, locale])

  const hrefFor = (target: Locale): string => {
    if (postSlug && alternates) {
      const slug = alternates[target]
      return slug ? `/${target}/posts/${slug}` : `/${target}`
    }
    // Swap the leading locale segment of the current path.
    const rest = pathname.replace(new RegExp(`^/(${LOCALES.join('|')})`), '')
    return `/${target}${rest || ''}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Accessible name must contain the visible "TR"/"EN" label
            (WCAG 2.5.3 label-in-name — Lighthouse label-content-name-mismatch). */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          aria-label={`${LOCALE_SHORT[locale]} — ${ariaLabel}`}
        >
          <Globe className="size-4" />
          <span className="text-xs font-semibold">{LOCALE_SHORT[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((target) => (
          <DropdownMenuItem key={target} asChild>
            <Link
              href={hrefFor(target)}
              className={cn(target === locale && 'font-semibold text-primary')}
            >
              {LOCALE_LABELS[target]}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
