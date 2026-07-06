'use client'

import * as React from 'react'

interface ViewTrackerProps {
  path: string
  slug: string
}

/**
 * Fire-and-forget page-view tracker. POSTs /api/track exactly once per mount.
 * Renders nothing and never blocks or surfaces errors to the reader.
 */
export function ViewTracker({ path, slug }: ViewTrackerProps) {
  const sent = React.useRef(false)

  React.useEffect(() => {
    if (sent.current) return
    sent.current = true
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, slug }),
      keepalive: true,
    }).catch(() => {
      /* analytics must never break the page */
    })
  }, [path, slug])

  return null
}
