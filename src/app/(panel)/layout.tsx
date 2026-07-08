import type { Metadata } from 'next'
import React from 'react'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { inter, newsreader } from '@/lib/fonts'

import '../(frontend)/globals.css'

export const metadata: Metadata = {
  title: 'Panel — Woyable',
  // The admin panel must never be indexed.
  robots: { index: false, follow: false },
}

/**
 * Root layout for the custom `/panel` admin route group. It renders its own
 * `<html>`/`<body>` shell (this is a separate Next.js root layout from the
 * public `(frontend)` group) and provides the shared theme + toast chrome.
 */
export default function PanelRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
