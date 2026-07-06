import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  /** Build the href for a given page number (keeps existing query params). */
  hrefForPage: (page: number) => string
  labels?: { previous: string; next: string }
}

/** Server-rendered numeric pagination driven by ?page= search params. */
export function Pagination({
  page,
  totalPages,
  hrefForPage,
  labels = { previous: 'Previous', next: 'Next' },
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const linkBase =
    'inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-md border border-border/70 px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  const disabled = 'pointer-events-none opacity-40'

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
      <Link
        href={hrefForPage(page - 1)}
        aria-label={labels.previous}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        className={cn(linkBase, page <= 1 && disabled)}
      >
        <ChevronLeft className="size-4" />
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={hrefForPage(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            linkBase,
            p === page && 'border-primary bg-primary/10 text-primary hover:bg-primary/10',
          )}
        >
          {p}
        </Link>
      ))}

      <Link
        href={hrefForPage(page + 1)}
        aria-label={labels.next}
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : undefined}
        className={cn(linkBase, page >= totalPages && disabled)}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  )
}
