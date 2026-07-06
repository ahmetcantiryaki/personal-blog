import { expect, test, type Page } from '@playwright/test'

import { EN_POST_SLUG, TR_POST_SLUG } from './helpers/api'

/** Journey 3 — Locale switcher navigates to the PAIRED translated slug. */

/**
 * Open the globe dropdown and click the target locale once its menu link
 * points at the paired translated slug. The switcher resolves alternates via
 * /api/post-alternates after mount; toHaveAttribute retries until the link
 * flips from the prefix-swap fallback to the paired slug.
 */
async function switchLocale(page: Page, targetLabel: string, expectedHref: string): Promise<void> {
  // The trigger's accessible name is a generic aria-label; target it by its
  // visible short-locale text (TR / EN) inside the header instead.
  await page
    .locator('header button')
    .filter({ hasText: /^(TR|EN)$/ })
    .click()

  const item = page.getByRole('menuitem', { name: targetLabel })
  await expect(item).toHaveAttribute('href', expectedHref)
  await item.click()
}

test('tr post → English switches to the paired en slug', async ({ page }) => {
  await page.goto(`/tr/posts/${TR_POST_SLUG}`)
  await switchLocale(page, 'English', `/en/posts/${EN_POST_SLUG}`)
  await expect(page).toHaveURL(new RegExp(`/en/posts/${EN_POST_SLUG}$`))
  await expect(page.locator('article header h1')).toBeVisible()
})

test('en post → Türkçe switches back to the paired tr slug', async ({ page }) => {
  await page.goto(`/en/posts/${EN_POST_SLUG}`)
  await switchLocale(page, 'Türkçe', `/tr/posts/${TR_POST_SLUG}`)
  await expect(page).toHaveURL(new RegExp(`/tr/posts/${TR_POST_SLUG}$`))
  await expect(page.locator('article header h1')).toBeVisible()
})
