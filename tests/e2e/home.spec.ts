import { expect, test } from '@playwright/test'

import { EN_CATEGORY_SLUG, TR_CATEGORY_SLUG } from './helpers/api'

/** Journey 1 — Home renders posts, pagination works, category chips navigate. */

// The "latest" grid section is an aria-labelled landmark on every page; the
// featured hero lives in its own region shown on page 1 only.
const LATEST_LABEL = { tr: 'Son yazılar', en: 'Latest posts' } as const
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

    test('page 2 keeps a full 9-card grid with fresh posts', async ({ page }) => {
      await page.goto(`/${locale}`)

      // Page 1 exposes a working link to page 2, and its first grid title is
      // captured to prove page 2 renders a different window of posts.
      const pageTwoLink = page
        .getByRole('navigation', { name: 'Pagination' })
        .getByRole('link', { name: '2', exact: true })
      await expect(pageTwoLink).toHaveAttribute('href', new RegExp(`/${locale}\\?page=2`))
      const firstGridTitlePage1 = await gridRegion(page)
        .first()
        .locator('h3 a, h2 a')
        .textContent()

      // Navigate directly to page 2 (deterministic; avoids flaky RSC streaming).
      await page.goto(`/${locale}?page=2`)

      // Page 2 marks itself current in the pagination control…
      await expect(
        page.getByRole('navigation', { name: 'Pagination' }).locator('[aria-current="page"]'),
      ).toHaveText('2')

      // …and still shows exactly 9 grid cards (consistent per-page window).
      await expect(gridRegion(page)).toHaveCount(GRID_PER_PAGE)

      const firstGridTitlePage2 = await gridRegion(page)
        .first()
        .locator('h3 a, h2 a')
        .textContent()
      expect(firstGridTitlePage2).not.toBe(firstGridTitlePage1)
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
