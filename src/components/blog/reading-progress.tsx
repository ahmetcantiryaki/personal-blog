'use client'

import { useEffect, useRef, useState } from 'react'

const STRINGS = {
  tr: { label: 'Okuma ilerlemesi' },
  en: { label: 'Reading progress' },
} as const

interface ReadingProgressProps {
  locale: 'tr' | 'en'
}

/**
 * Fixed 2-3px bar at the very top of the viewport that fills as the reader
 * scrolls through the page. Progress is measured against the full document
 * scroll range (not a specific article container) since the page has hero +
 * meta + related-posts sections around the article body.
 *
 * Scroll handling is throttled via requestAnimationFrame and the listener is
 * passive so it never blocks the main thread during scroll.
 */
export function ReadingProgress({ locale }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const computeProgress = () => {
      rafId.current = null
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const ratio = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(Math.min(1, Math.max(0, ratio)))
    }

    const onScroll = () => {
      if (rafId.current !== null) return
      rafId.current = requestAnimationFrame(computeProgress)
    }

    computeProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [])

  const percent = Math.round(progress * 100)
  const strings = STRINGS[locale]

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={strings.label}
    >
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
