import Link from 'next/link'
import {
  CloudCog,
  Code2,
  Cpu,
  Globe,
  Hash,
  LayoutGrid,
  type LucideIcon,
  Megaphone,
  Rocket,
  Share2,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

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

/** Icon + colored plate treatment for one category. */
interface CategoryVisual {
  Icon: LucideIcon
  /** Resting plate: soft tinted plate with a colored glyph. */
  plateInactive: string
  /** Active plate: solid fill with a light glyph (color + fill cue). */
  plateActive: string
}

// Keyed by the stable, non-localized category `key` (see src/seed/categories.ts)
// so the mapping holds across both tr and en. Class strings are written out in
// full — never interpolated — so Tailwind's scanner keeps every arbitrary color
// in the build. The tinted plate (`/10`) and fixed-hex glyph both read in light
// and dark themes; text sits outside the plate on a foreground token (AA-safe).
const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  ai: {
    Icon: Sparkles,
    plateInactive: 'bg-[#2f7d78]/10 text-[#2f7d78]',
    plateActive: 'bg-[#2f7d78] text-white',
  },
  'web-development': {
    Icon: Globe,
    plateInactive: 'bg-[#37609a]/10 text-[#37609a]',
    plateActive: 'bg-[#37609a] text-white',
  },
  'software-engineering': {
    Icon: Code2,
    plateInactive: 'bg-[#3f7d47]/10 text-[#3f7d47]',
    plateActive: 'bg-[#3f7d47] text-white',
  },
  'devops-cloud': {
    Icon: CloudCog,
    plateInactive: 'bg-[#9a6237]/10 text-[#9a6237]',
    plateActive: 'bg-[#9a6237] text-white',
  },
  'career-productivity': {
    Icon: TrendingUp,
    plateInactive: 'bg-[#7d4a6c]/10 text-[#7d4a6c]',
    plateActive: 'bg-[#7d4a6c] text-white',
  },
  'social-media': {
    Icon: Share2,
    plateInactive: 'bg-[#b05a7a]/10 text-[#b05a7a]',
    plateActive: 'bg-[#b05a7a] text-white',
  },
  'digital-marketing': {
    Icon: Megaphone,
    plateInactive: 'bg-[#8a6d2f]/10 text-[#8a6d2f]',
    plateActive: 'bg-[#8a6d2f] text-white',
  },
  technology: {
    Icon: Cpu,
    plateInactive: 'bg-[#4a6d8a]/10 text-[#4a6d8a]',
    plateActive: 'bg-[#4a6d8a] text-white',
  },
  business: {
    Icon: Rocket,
    plateInactive: 'bg-[#6d5a8a]/10 text-[#6d5a8a]',
    plateActive: 'bg-[#6d5a8a] text-white',
  },
}

// The "All" chip: neutral, theme-token treatment (no brand color).
const NEUTRAL_VISUAL: CategoryVisual = {
  Icon: LayoutGrid,
  plateInactive: 'bg-muted text-muted-foreground',
  plateActive: 'bg-foreground text-background',
}

// Any category missing from the map (e.g. a newly seeded key) degrades to a
// neutral icon rather than breaking the row.
const FALLBACK_VISUAL: CategoryVisual = {
  Icon: Hash,
  plateInactive: 'bg-muted text-muted-foreground',
  plateActive: 'bg-foreground text-background',
}

// Shares the technologies strip's skeleton (rounded, bordered, >=44px touch
// target) but carries a colored icon plate instead of a brand SVG. Left padding
// is tightened so the plate hugs the border.
const chipBase =
  'inline-flex min-h-[44px] items-center gap-2 rounded-xl border py-1.5 pl-2 pr-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

// Active chips carry two non-color cues (weight + plate fill) alongside the
// accent color so the active state is perceivable without relying on color
// (WCAG 1.4.1).
const chipActive = 'border-primary bg-primary/10 text-primary font-semibold'
const chipInactive =
  'border-border/70 text-foreground/85 hover:border-primary/40 hover:bg-accent hover:text-accent-foreground'

const plateBase =
  'inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors'

interface ChipProps {
  href: string
  active: boolean
  label: string
  visual: CategoryVisual
}

function Chip({ href, active, label, visual }: ChipProps) {
  const { Icon } = visual
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(chipBase, active ? chipActive : chipInactive)}
    >
      <span
        className={cn(plateBase, active ? visual.plateActive : visual.plateInactive)}
        aria-hidden
      >
        <Icon className="size-4" aria-hidden />
      </span>
      {label}
    </Link>
  )
}

/**
 * Category filter chips. Chips wrap onto multiple lines at every breakpoint —
 * no horizontal scrollbar; with 9 categories a two-line wrap reads cleaner
 * than a hidden scroll row. Each chip pairs a category-specific colored icon
 * plate with its title, mirroring the technologies strip's visual language.
 */
export function CategoryChips({ categories, locale, dict, activeSlug = null }: CategoryChipsProps) {
  return (
    <nav aria-label={dict.nav.categories} className="-mx-1 pb-1">
      <ul className="flex flex-wrap items-center gap-2 px-1">
        <li>
          <Chip
            href={routes.home(locale)}
            active={activeSlug === null}
            label={dict.home.filterAll}
            visual={NEUTRAL_VISUAL}
          />
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Chip
              href={routes.category(locale, category.slug)}
              active={category.slug === activeSlug}
              label={category.title}
              visual={CATEGORY_VISUALS[category.key] ?? FALLBACK_VISUAL}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
