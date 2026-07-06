import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Woyable Blog',
  description: 'A multilingual, SEO-first blog platform.',
}

/**
 * Root layout for the public frontend route group. Intentionally bare — the
 * frontend team (Mert) owns the design system, theming and typography.
 */
export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
