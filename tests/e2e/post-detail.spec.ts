import { expect, test } from '@playwright/test'

import { EN_POST_SLUG, TR_POST_SLUG } from './helpers/api'

/** Journey 2 — Post detail: h1, <time>, reading time, content, related, cover. */

// KNOWN APP BUG (reported): lexical content renders markdown `#` headings as
// literal <h1> elements, so a post page carries multiple h1s. Tests scope to
// the hero heading; the fixer should demote in-content headings to h2+.
const heroH1 = 'article header h1'

const CASES = [
  { locale: 'tr', slug: TR_POST_SLUG, minRead: 'dk okuma', related: 'İlgili yazılar' },
  { locale: 'en', slug: EN_POST_SLUG, minRead: 'min read', related: 'Related posts' },
] as const

for (const { locale, slug, minRead, related } of CASES) {
  test.describe(`post detail (${locale})`, () => {
    test(`renders the full article at /${locale}/posts/${slug}`, async ({ page }) => {
      await page.goto(`/${locale}/posts/${slug}`)

      // Title (hero heading, not in-content headings).
      const h1 = page.locator(heroH1)
      await expect(h1).toBeVisible()
      await expect(h1).not.toBeEmpty()

      // Published date as a semantic <time> element with datetime attr.
      const time = page.locator('article time[datetime]').first()
      await expect(time).toBeVisible()
      await expect(time).not.toBeEmpty()

      // Reading time chip.
      await expect(page.getByText(minRead).first()).toBeVisible()

      // Lexical content rendered: the article body has real paragraphs/headings.
      await expect(page.locator('article p').first()).toBeVisible()
      expect(await page.locator('article p').count()).toBeGreaterThan(3)

      // Cover art banner is visible at the top of the article.
      const cover = page.locator('article header .aspect-\\[16\\/7\\]').first()
      await expect(cover).toBeVisible()

      // Related posts section with linked cards.
      const relatedSection = page.getByRole('region', { name: related })
      await expect(relatedSection).toBeVisible()
      await expect(relatedSection.locator('article').first()).toBeVisible()
    })
  })
}
