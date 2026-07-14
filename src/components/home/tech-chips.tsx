import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import { routes } from '@/lib/routes'
import { getTagsWithCounts } from '@/lib/taxonomy'

/** One entry in the technologies strip. `icon` is the basename under
 *  `/public/icons/brands/` (self-hosted, no runtime CDN dependency). */
interface TechChip {
  tagKey: string
  label: string
  icon: string
}

/**
 * The technologies & tools we write about, in display order. The `tagKey`
 * matches the stable, non-localized tag key stored in the CMS; a chip only
 * renders when that tag exists and has at least one published post.
 */
const TECH_CHIPS: readonly TechChip[] = [
  { tagKey: 'claude', label: 'Claude', icon: 'claude' },
  { tagKey: 'chatgpt', label: 'ChatGPT', icon: 'openai' },
  { tagKey: 'gemini', label: 'Gemini', icon: 'gemini' },
  { tagKey: 'react', label: 'React', icon: 'react' },
  { tagKey: 'nextjs', label: 'Next.js', icon: 'nextjs' },
  { tagKey: 'typescript', label: 'TypeScript', icon: 'typescript' },
  { tagKey: 'python', label: 'Python', icon: 'python' },
  { tagKey: 'postgresql', label: 'PostgreSQL', icon: 'postgresql' },
  { tagKey: 'kubernetes', label: 'Kubernetes', icon: 'kubernetes' },
  { tagKey: 'docker', label: 'Docker', icon: 'docker' },
  { tagKey: 'tailwind', label: 'Tailwind CSS', icon: 'tailwind' },
  { tagKey: 'aws', label: 'AWS', icon: 'aws' },
]

interface TechChipsProps {
  locale: Locale
  /** Localized noun for "posts" used only in the accessible name (e.g. "yazı" / "articles"). */
  postsWord: string
  'aria-label': string
}

// White plate in BOTH themes with a dark, fixed-contrast label so the colored
// brand SVGs always read. Touch target is kept at >=44px via min-h.
const chipClass =
  'inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/**
 * Technologies & tools strip for the home page. Server component: it resolves
 * each configured tag's localized slug + published-post count, then renders a
 * wrapping row of chips linking to the tag pages. Renders nothing when none of
 * the configured tags exist yet or all have zero posts.
 */
export async function TechChips({ locale, postsWord, 'aria-label': ariaLabel }: TechChipsProps) {
  const counts = await getTagsWithCounts(
    TECH_CHIPS.map((chip) => chip.tagKey),
    locale,
  )

  const visible = TECH_CHIPS.filter((chip) => counts.has(chip.tagKey))
  if (visible.length === 0) return null

  return (
    <nav aria-label={ariaLabel} className="-mx-1 pb-1">
      <ul className="flex flex-wrap items-center gap-2 px-1">
        {visible.map((chip) => {
          const data = counts.get(chip.tagKey)
          if (!data) return null
          return (
            <li key={chip.tagKey}>
              <Link
                href={routes.tag(locale, data.slug)}
                aria-label={`${chip.label} — ${data.count} ${postsWord}`}
                className={chipClass}
              >
                <img
                  src={`/icons/brands/${chip.icon}.svg`}
                  width={20}
                  height={20}
                  alt=""
                  aria-hidden
                  className="h-5 w-5 shrink-0"
                />
                <span className="text-stone-700" aria-hidden>
                  {chip.label}
                </span>
                <span className="text-stone-400 tabular-nums" aria-hidden>
                  {data.count}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
