import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { ReadingProgress } from '@/components/blog/reading-progress'

/**
 * ReadingProgress renders a fixed progressbar at the top of the page. This
 * covers the accessible contract (role/aria) and the locale-aware label. The
 * scroll-driven fill percentage only updates client-side via useEffect, which
 * does not run during a static server render, so the initial markup always
 * carries aria-valuenow="0".
 */
describe('ReadingProgress', () => {
  it('renders a progressbar with the Turkish label', () => {
    const html = renderToStaticMarkup(<ReadingProgress locale="tr" />)

    expect(html).toContain('role="progressbar"')
    expect(html).toContain('aria-label="Okuma ilerlemesi"')
    expect(html).toContain('aria-valuenow="0"')
    expect(html).toContain('aria-valuemin="0"')
    expect(html).toContain('aria-valuemax="100"')
  })

  it('renders a progressbar with the English label', () => {
    const html = renderToStaticMarkup(<ReadingProgress locale="en" />)

    expect(html).toContain('aria-label="Reading progress"')
  })
})
