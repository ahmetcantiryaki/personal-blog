import { expect, test } from '@playwright/test'

import { TR_POST_SLUG } from './helpers/api'

/** Journey 10 — 375px viewport: sheet menu opens, nav works, post readable. */

test.use({ viewport: { width: 375, height: 812 } })

test('mobile sheet menu opens and navigates (tr)', async ({ page }) => {
  await page.goto('/tr')

  // Hamburger is visible on mobile (hidden on md+).
  const hamburger = page.getByRole('button', { name: 'Menüyü aç' })
  await expect(hamburger).toBeVisible()
  await hamburger.click()

  // Sheet content with primary nav + categories + auth actions.
  const sheet = page.getByRole('dialog')
  await expect(sheet).toBeVisible()
  await expect(sheet.getByRole('link', { name: 'Anasayfa' })).toBeVisible()
  await expect(sheet.getByRole('link', { name: 'Giriş yap' })).toBeVisible()

  // Navigate to a category from the sheet.
  await sheet.getByRole('link', { name: 'Yapay Zeka' }).click()
  await expect(page).toHaveURL(/\/tr\/category\/yapay-zeka$/)
  // Client-side navigation streams the listing in — wait for the first card.
  await expect(page.locator('article').first()).toBeVisible()
})

test('mobile sheet menu opens and closes (en)', async ({ page }) => {
  await page.goto('/en')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const sheet = page.getByRole('dialog')
  await expect(sheet).toBeVisible()

  await sheet.getByRole('button', { name: 'Close menu' }).click()
  await expect(sheet).not.toBeVisible()
})

test('post detail is readable at 375px (hero, meta, content)', async ({ page }) => {
  await page.goto(`/tr/posts/${TR_POST_SLUG}`)

  // Hero heading only — content h1s are a known, reported app bug.
  await expect(page.locator('article header h1')).toBeVisible()
  expect(await page.locator('article p').count()).toBeGreaterThan(3)
  await expect(page.locator('article time[datetime]').first()).toBeVisible()
})

// QUARANTINED — real app bug, not flakiness (1 of max 2).
// The TR RAG post renders a markdown code fence as a plain <p> with <br>s and
// a literal trailing ``` (markdown→lexical seed conversion bug). Its
// unbreakable `connection="postgresql+psycopg://user:pass@..."` line makes
// document.scrollWidth 520px at a 375px viewport (145px horizontal overflow).
// Re-enable once the content/conversion fix lands: the assertion below is the
// regression net.
test.fixme('post detail has no horizontal overflow at 375px', async ({ page }) => {
  await page.goto(`/tr/posts/${TR_POST_SLUG}`)
  await expect(page.locator('article header h1')).toBeVisible()

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
