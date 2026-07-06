import { expect, test } from '@playwright/test'

import { EN_CATEGORY_SLUG, TR_CATEGORY_SLUG } from './helpers/api'

/** Journey 1 — Home renders posts, pagination works, category chips navigate. */

for (const locale of ['tr', 'en'] as const) {
  test.describe(`home (${locale})`, () => {
    test('renders the wordmark, featured post and post grid', async ({ page }) => {
      await page.goto(`/${locale}`)

      await expect(page.getByRole('heading', { level: 1, name: 'Woyable' })).toBeVisible()

      // Featured post + grid cards are <article> elements with linked titles.
      const cards = page.locator('main article, article')
      expect(await cards.count()).toBeGreaterThanOrEqual(4)

      // Every card links into /{locale}/posts/…
      const firstLink = page.locator('article h3 a, article h2 a').first()
      await expect(firstLink).toHaveAttribute('href', new RegExp(`^/${locale}/posts/`))
    })

    test('pagination navigates to page 2 with fresh cards', async ({ page }) => {
      await page.goto(`/${locale}`)

      const pagination = page.getByRole('navigation', { name: 'Pagination' })
      await expect(pagination).toBeVisible()

      await pagination.getByRole('link', { name: '2', exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`/${locale}\\?page=2`))

      // Page 2 marks itself current and still renders cards.
      await expect(
        page.getByRole('navigation', { name: 'Pagination' }).locator('[aria-current="page"]'),
      ).toHaveText('2')
      expect(await page.locator('article').count()).toBeGreaterThan(0)
    })
  })
}

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
