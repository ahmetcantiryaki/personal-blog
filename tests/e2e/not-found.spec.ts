import { expect, test } from '@playwright/test'

/** Journey 11 — Unknown post slug is a hard 404. */

// KNOWN APP BUG (reported): with `dynamicParams = false` the rejection happens
// above the [locale] segment, so Next's DEFAULT not-found page renders instead
// of the branded src/app/(frontend)/[locale]/not-found.tsx. The HTTP status is
// still a proper 404, which is what SEO requires; assertions below stay
// agnostic to which 404 body ships so they hold after the fixer lands.

test('unknown post slug returns HTTP 404 with a 404 page', async ({ page }) => {
  const response = await page.goto('/tr/posts/this-post-does-not-exist-xyz')
  expect(response?.status()).toBe(404)

  await expect(page.getByText('404').first()).toBeVisible()
})

test('unknown en post slug also 404s', async ({ request }) => {
  const res = await request.get('/en/posts/nope-not-here-either')
  expect(res.status()).toBe(404)
})

test('unknown locale prefix 404s', async ({ request }) => {
  const res = await request.get('/fr/posts/anything')
  expect(res.status()).toBe(404)
})
