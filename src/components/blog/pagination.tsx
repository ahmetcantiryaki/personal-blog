import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface PaginationLabels {
  /** Accessible name for the <nav> landmark. */
  label: string
  previous: string
  next: string
  /** Word for "page", used to label the compact current/total indicator. */
  page: string
}

interface PaginationProps {
  page: number
  totalPages: number
  /** Build the href for a given page number (keeps existing query params). */
  hrefForPage: (page: number) => string
  labels?: PaginationLabels
}

const DEFAULT_LABELS: PaginationLabels = {
  label: 'Pagination',
  previous: 'Previous',
  next: 'Next',
  page: 'Page',
}

type PageItem = number | 'gap'

/**
 * Windowed page list capped to ~5 numeric items: first, last, and the current
 * page ±1, with 'gap' markers standing in for the elided ranges. Scales to any
 * number of pages without ever widening the control (e.g. 1 … 5 6 7 … 14).
 */
function buildPageItems(current: number, total: number): PageItem[] {
  const wanted = new Set<number>([1, total, current - 1, current, current + 1])
  const pages = [...wanted].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  const items: PageItem[] = []
  let previous = 0
  for (const p of pages) {
    if (previous && p - previous > 1) items.push('gap')
    items.push(p)
    previous = p
  }
  return items
}

/**
 * Server-rendered, mobile-first pagination driven by plain `?page=` links
 * (never client history patching, which was fragile under Next's query-only
 * navigation). Below `sm` it collapses to a compact `‹ 6 / 14 ›` indicator;
 * from `sm` up it shows the windowed number row with ellipses.
 */
export function Pagination({
  page,
  totalPages,
  hrefForPage,
  labels = DEFAULT_LABELS,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const items = buildPageItems(page, totalPages)
  const isFirst = page <= 1
  const isLast = page >= totalPages

  const linkBase =
    'inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-md border border-border/70 px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  const disabled = 'pointer-events-none opacity-40'

  return (
    <nav aria-label={labels.label} className="flex items-center justify-center gap-1.5">
      <Link
        href={hrefForPage(page - 1)}
        rel="prev"
        aria-label={labels.previous}
        aria-disabled={isFirst}
        tabIndex={isFirst ? -1 : undefined}
        className={cn(linkBase, isFirst && disabled)}
      >
        <ChevronLeft className="size-4" aria-hidden />
        <span className="hidden sm:inline">{labels.previous}</span>
      </Link>

      {/* Compact current/total indicator — mobile only. */}
      <span
        className="min-w-16 text-center text-sm font-medium tabular-nums text-muted-foreground sm:hidden"
        aria-current="page"
        aria-label={`${labels.page} ${page} / ${totalPages}`}
      >
        {page} / {totalPages}
      </span>

      {/* Windowed number row — sm and up. */}
      <ul className="hidden items-center gap-1.5 sm:flex">
        {items.map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} aria-hidden className="px-1 text-sm text-muted-foreground">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefForPage(item)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`${labels.page} ${item}`}
                className={cn(
                  linkBase,
                  item === page &&
                    'border-primary bg-primary/10 text-primary hover:bg-primary/10',
                )}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>

      <Link
        href={hrefForPage(page + 1)}
        rel="next"
        aria-label={labels.next}
        aria-disabled={isLast}
        tabIndex={isLast ? -1 : undefined}
        className={cn(linkBase, isLast && disabled)}
      >
        <span className="hidden sm:inline">{labels.next}</span>
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </nav>
  )
}
