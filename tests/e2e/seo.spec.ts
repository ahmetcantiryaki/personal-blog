import { expect, test } from '@playwright/test'

import { EN_POST_SLUG, TR_POST_SLUG } from './helpers/api'

/** Journey 9 — SEO endpoints: sitemap, robots, feeds, OG image, hreflang. */

test('sitemap.xml is served and contains both paired post URLs', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('xml')

  const xml = await res.text()
  expect(xml).toContain('<urlset')
  expect(xml).toContain(`/tr/posts/${TR_POST_SLUG}`)
  expect(xml).toContain(`/en/posts/${EN_POST_SLUG}`)
  // Locale-paired category slugs are also present.
  expect(xml).toContain('/tr/category/yapay-zeka')
  expect(xml).toContain('/en/category/ai')
  // hreflang alternates are embedded (xhtml:link entries).
  expect(xml).toMatch(/hreflang="x-default"/)
})

test('robots.txt is served and references the sitemap', async ({ request }) => {
  const res = await request.get('/robots.txt')
  expect(res.status()).toBe(200)
  const body = await res.text()
  expect(body.toLowerCase()).toContain('user-agent')
  expect(body.toLowerCase()).toContain('sitemap')
})

for (const locale of ['tr', 'en'] as const) {
  test(`RSS feed serves valid rss for ${locale}`, async ({ request }) => {
    const res = await request.get(`/${locale}/feed.xml`)
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('application/rss+xml')
    const xml = await res.text()
    expect(xml).toContain('<rss')
    expect(xml).toContain(`<language>${locale}</language>`)
    expect(xml).toContain('<item>')
  })
}

test('per-post opengraph-image returns a PNG', async ({ page, request }) => {
  // The generated OG route carries a per-build hash suffix
  // (e.g. /opengraph-image-abc123), so resolve the real URL from the page meta.
  await page.goto(`/tr/posts/${TR_POST_SLUG}`)
  const ogImageUrl = await page
    .locator('meta[property="og:image"]')
    .first()
    .getAttribute('content')
  expect(ogImageUrl, 'post page should declare an og:image').toBeTruthy()

  const res = await request.get(ogImageUrl as string)
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('image/png')
  const body = await res.body()
  expect(body.length).toBeGreaterThan(1000)
})

test('post page carries canonical + hreflang link tags for both locales', async ({ page }) => {
  await page.goto(`/en/posts/${EN_POST_SLUG}`)

  const canonical = page.locator('link[rel="canonical"]')
  await expect(canonical).toHaveAttribute('href', new RegExp(`/en/posts/${EN_POST_SLUG}$`))

  const trAlt = page.locator('link[rel="alternate"][hreflang="tr"]')
  await expect(trAlt).toHaveAttribute('href', new RegExp(`/tr/posts/${TR_POST_SLUG}$`))

  const enAlt = page.locator('link[rel="alternate"][hreflang="en"]')
  await expect(enAlt).toHaveAttribute('href', new RegExp(`/en/posts/${EN_POST_SLUG}$`))

  const xDefault = page.locator('link[rel="alternate"][hreflang="x-default"]')
  await expect(xDefault).toHaveAttribute('href', new RegExp(`/tr/posts/${TR_POST_SLUG}$`))
})

test('post page embeds Article + BreadcrumbList JSON-LD', async ({ page }) => {
  await page.goto(`/tr/posts/${TR_POST_SLUG}`)
  const scripts = page.locator('script[type="application/ld+json"]')
  const contents = await scripts.allInnerTexts()
  const types = contents.flatMap((raw) => {
    const parsed = JSON.parse(raw) as { '@type'?: string }
    return parsed['@type'] ? [parsed['@type']] : []
  })
  expect(types).toContain('Article')
  expect(types).toContain('BreadcrumbList')
})

test('search page is noindex', async ({ page }) => {
  await page.goto('/en/search')
  const robots = page.locator('meta[name="robots"]')
  await expect(robots).toHaveAttribute('content', /noindex/)
})

test('login and profile pages are noindex', async ({ page }) => {
  await page.goto('/en/login')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)

  await page.goto('/en/register')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
})
