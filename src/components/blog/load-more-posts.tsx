'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'

import { loadMoreHomePosts } from './load-more-action'

export interface LoadMoreLabels {
  loadMore: string
  loading: string
}

interface LoadMorePostsProps {
  locale: string
  /** Featured post id, excluded from every batch. */
  excludeId?: number
  /** Whether a second batch exists (page 1 was server-rendered). */
  initialHasMore: boolean
  labels: LoadMoreLabels
}

/**
 * Progressive home-grid loader. Batch 1 is server-rendered by the page (SEO /
 * ISR); this appends batch 2+ via a server action, triggered either by an
 * IntersectionObserver near the bottom or the explicit "load more" button
 * (keyboard-accessible fallback). With JS disabled the first batch still
 * renders — the page is never broken, only the extra batches are unavailable.
 */
export function LoadMorePosts({
  locale,
  excludeId,
  initialHasMore,
  labels,
}: LoadMorePostsProps) {
  const [batches, setBatches] = useState<ReactNode[]>([])
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  // Guards against overlapping loads from the observer + button racing.
  const loadingRef = useRef(false)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)
    try {
      const result = await loadMoreHomePosts({ locale, page, excludeId })
      setBatches((prev) => [...prev, result.node])
      setPage(result.nextPage)
      setHasMore(result.hasMore)
    } catch {
      // Keep the control visible so the reader can retry a transient failure.
      setHasMore(true)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [excludeId, hasMore, locale, page])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore()
      },
      { rootMargin: '400px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  if (!initialHasMore) return null

  return (
    <>
      {batches.length > 0 ? <div className="mt-6 space-y-6">{batches}</div> : null}
      {hasMore ? (
        <>
          <div ref={sentinelRef} aria-hidden className="h-px w-full" />
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => void loadMore()}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? labels.loading : labels.loadMore}
            </Button>
          </div>
        </>
      ) : null}
    </>
  )
}
