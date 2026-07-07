import { expect, test } from '@playwright/test'

import { EN_CATEGORY_SLUG, TR_CATEGORY_SLUG } from './helpers/api'

/** Journey 1 — Home renders posts, pagination works, category chips navigate. */

// The "latest" grid section is an aria-labelled landmark on every page; the
// featured hero lives in its own region shown on page 1 only.
const LATEST_LABEL = { tr: 'Son yazılar', en: 'Latest posts' } as const
// The home feed grows via a localized "load more" button (no pagination).
const LOAD_MORE_LABEL = { tr: 'Daha fazla yükle', en: 'Load more' } as const
const GRID_PER_PAGE = 9

for (const locale of ['tr', 'en'] as const) {
  const gridRegion = (page: import('@playwright/test').Page) =>
    page.getByRole('region', { name: LATEST_LABEL[locale] }).locator('article')

  test.describe(`home (${locale})`, () => {
    test('renders the wordmark, featured post and a full 9-card grid', async ({ page }) => {
      await page.goto(`/${locale}`)

      await expect(page.getByRole('heading', { level: 1, name: 'Woyable' })).toBeVisible()

      // The grid shows exactly 9 posts on page 1 (featured hero is separate).
      await expect(gridRegion(page)).toHaveCount(GRID_PER_PAGE)

      // Every card links into /{locale}/posts/…
      const firstLink = page.locator('article h3 a, article h2 a').first()
      await expect(firstLink).toHaveAttribute('href', new RegExp(`^/${locale}/posts/`))
    })

    test('load more appends a second 9-card batch with no duplicates', async ({ page }) => {
      await page.goto(`/${locale}`)

      // First batch is server-rendered: exactly 9 cards.
      await expect(gridRegion(page)).toHaveCount(GRID_PER_PAGE)
      const initialTitles = (
        await gridRegion(page).locator('h3 a, h2 a').allTextContents()
      ).map((t) => t.trim())

      // The localized "load more" fallback button appends the next batch.
      const loadMore = page.getByRole('button', { name: LOAD_MORE_LABEL[locale] })
      await expect(loadMore).toBeVisible()
      await loadMore.click()

      // The grid grows to 18 cards (batch 1 + batch 2).
      await expect(gridRegion(page)).toHaveCount(GRID_PER_PAGE * 2)

      const allTitles = (
        await gridRegion(page).locator('h3 a, h2 a').allTextContents()
      ).map((t) => t.trim())

      // No post appears twice across the two batches…
      expect(new Set(allTitles).size).toBe(allTitles.length)
      // …and the original batch is retained (append, not replace/reshuffle).
      for (const title of initialTitles) expect(allTitles).toContain(title)
    })
  })
}

test.describe('root locale redirect', () => {
  test('bare / redirects to /tr for a non-English visitor (default)', async ({ browser }) => {
    // The `locale` option drives the context's Accept-Language header.
    const context = await browser.newContext({ locale: 'tr-TR' })
    const page = await context.newPage()
    const response = await page.goto('/')
    await expect(page).toHaveURL(/\/tr$/)
    // Landed on the Turkish homepage via a redirect (not content at /).
    await expect(page.getByRole('heading', { level: 1, name: 'Woyable' })).toBeVisible()
    expect(response?.request().redirectedFrom()).not.toBeNull()
    await context.close()
  })

  test('bare / redirects to /en when Accept-Language prefers English', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'en-US' })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page).toHaveURL(/\/en$/)
    await context.close()
  })
})

test('category chips navigate to the category listing (tr)', async ({ page }) => {
  await page.goto('/tr')
  await page
    .getByRole('navigation', { name: 'Kategoriler' })
    .getByRole('link', { name: 'Yapay Zeka' })
    .click()
  await expect(page).toHaveURL(new RegExp(`/tr/category/${TR_CATEGORY_SLUG}$`))
  // Client-side navigation streams the listing in — wait for the first card.
  await expect(page.locator('article').first()).toBeVisible()
})

test('category chips navigate to the category listing (en)', async ({ page }) => {
  await page.goto('/en')
  await page
    .getByRole('navigation', { name: 'Categories' })
    .getByRole('link', { name: 'AI', exact: true })
    .click()
  await expect(page).toHaveURL(new RegExp(`/en/category/${EN_CATEGORY_SLUG}$`))
  await expect(page.locator('article').first()).toBeVisible()
})
