'use client'

import { ProgressProvider } from '@bprogress/next/app'
import type { ReactNode } from 'react'

interface RouteProgressProps {
  children: ReactNode
}

/**
 * Thin top progress bar shown during App Router route transitions.
 *
 * Uses @bprogress/next (Next 16-compatible): it listens to anchor clicks rather
 * than patching window.history.pushState, so query-only navigations (e.g.
 * ?page=2 pagination) still commit normally — unlike the previous
 * nextjs-toploader, which broke them.
 *
 * Styling follows the calm design language: tinted with the theme accent
 * (var(--primary), adapts to light/dark), ~2.5px tall, no spinner.
 */
export function RouteProgress({ children }: RouteProgressProps) {
  return (
    <ProgressProvider
      color="var(--primary)"
      height="2.5px"
      options={{ showSpinner: false }}
    >
      {children}
    </ProgressProvider>
  )
}
