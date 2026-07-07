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

test('a post with a hand-drawn cover exposes it as og:image + twitter:image', async ({
  page,
  request,
}) => {
  // The RAG post ships a hand-drawn cover, so explicit metadata images override
  // the dynamic opengraph-image file (that precedence is the whole point).
  await page.goto(`/tr/posts/${TR_POST_SLUG}`)

  const ogImageUrl = await page
    .locator('meta[property="og:image"]')
    .first()
    .getAttribute('content')
  expect(ogImageUrl, 'post page should declare an og:image').toBeTruthy()
  // Absolute URL pointing at the static cover JPG (never the dynamic route).
  expect(ogImageUrl).toMatch(/^https?:\/\/[^/]+\/covers\/.+\.jpg$/)

  // Correct intrinsic dimensions are advertised for the 1344×768 covers.
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1344')
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '768')

  // Twitter mirrors the same image (card is summary_large_image site-wide).
  const twitterImageUrl = await page
    .locator('meta[name="twitter:image"]')
    .first()
    .getAttribute('content')
  expect(twitterImageUrl).toBe(ogImageUrl)

  // The cover actually resolves and is a JPEG. og:image is an absolute
  // production URL (SITE_URL), so fetch its path against the server under test.
  const coverPath = new URL(ogImageUrl as string).pathname
  const res = await request.get(coverPath)
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('image/jpeg')
  const body = await res.body()
  expect(body.length).toBeGreaterThan(1000)
})

test('pages without an explicit cover fall back to the dynamic opengraph-image PNG', async ({
  page,
  request,
}) => {
  // The home page sets no explicit image, so the file-convention opengraph-image
  // route supplies its card — proving that fallback (and the route) still works.
  await page.goto('/tr')
  const ogImageUrl = await page
    .locator('meta[property="og:image"]')
    .first()
    .getAttribute('content')
  expect(ogImageUrl, 'home page should declare a dynamic og:image').toBeTruthy()
  // It is the generated route, not a static cover JPG.
  expect(ogImageUrl).not.toMatch(/\/covers\//)

  // Absolute (SITE_URL) URL → fetch its path against the server under test.
  const ogPath = new URL(ogImageUrl as string).pathname
  const res = await request.get(ogPath)
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
