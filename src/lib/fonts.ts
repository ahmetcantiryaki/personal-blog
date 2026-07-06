import { Inter, Newsreader } from 'next/font/google'

/** UI sans — Inter, with Turkish glyph coverage (latin-ext). */
export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
})

/** Editorial serif for article display + body — Newsreader. */
export const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-newsreader',
  style: ['normal', 'italic'],
})
