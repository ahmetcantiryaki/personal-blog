import type { Metadata } from 'next'
import React from 'react'

import { SITE_NAME, SITE_URL } from '@/lib/seo'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: 'A calm, multilingual journal on software, AI and the web.',
}

/**
 * Route-group wrapper for the public frontend. The `<html>`/`<body>` shell is
 * rendered in `[locale]/layout.tsx` so the `lang` attribute is locale-correct.
 */
export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return children
}
