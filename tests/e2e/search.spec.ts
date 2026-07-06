import { expect, test } from '@playwright/test'

/** Journey 5 — Search returns results for a term guaranteed in content. */

test('search for "RAG" returns results (tr)', async ({ page }) => {
  await page.goto('/tr/search')
  await page.getByRole('searchbox').fill('RAG')
  await page.getByRole('button', { name: 'Ara' }).click()

  await expect(page).toHaveURL(/\/tr\/search\?q=RAG/)
  await expect(page.getByText('Sonuçlar:')).toBeVisible()
  expect(await page.locator('article').count()).toBeGreaterThan(0)
  // The RAG post links from the results grid.
  await expect(
    page.locator('article a[href*="rag-sistemi-nasil-kurulur"]').first(),
  ).toBeVisible()
})

test('search for "RAG" returns results (en)', async ({ page }) => {
  await page.goto('/en/search')
  await page.getByRole('searchbox').fill('RAG')
  await page.getByRole('button', { name: 'Search', exact: true }).click()

  await expect(page).toHaveURL(/\/en\/search\?q=RAG/)
  await expect(page.getByText('Results for:')).toBeVisible()
  expect(await page.locator('article').count()).toBeGreaterThan(0)
  await expect(page.locator('article a[href*="how-to-build-rag-system"]').first()).toBeVisible()
})

test('blank search shows the prompt, not results (en)', async ({ page }) => {
  await page.goto('/en/search')
  await expect(page.getByText('Type something to search.')).toBeVisible()
})
