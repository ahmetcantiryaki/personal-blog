import { isLocale } from '@/i18n/config'
import { listPosts } from '@/lib/posts'
import { absoluteUrl, lexicalToPlainText, SITE_NAME } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { routes } from '@/lib/routes'

export const revalidate = 300

/** Escape the five XML predefined entities for use in element text/attributes. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Wrap free text in CDATA, neutralising any embedded `]]>` terminator. */
function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

/** RSS 2.0 feed of the latest 20 published posts for a locale. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
): Promise<Response> {
  const { locale } = await params
  if (!isLocale(locale)) {
    return new Response('Not found', { status: 404 })
  }

  const [{ posts }, settings] = await Promise.all([
    listPosts({ locale, limit: 20 }),
    getSiteSettings(locale),
  ])

  const feedUrl = absoluteUrl(routes.feed(locale))
  const homeUrl = absoluteUrl(routes.home(locale))
  const lastBuild = posts[0]?.publishedAt ?? posts[0]?.updatedAt ?? new Date().toISOString()

  const items = posts
    .map((post) => {
      const url = absoluteUrl(routes.post(locale, post.slug))
      const description = post.excerpt || lexicalToPlainText(post.content, 400)
      const pubDate = new Date(post.publishedAt || post.updatedAt).toUTCString()
      const categories = [
        post.category?.title,
        ...(post.tags?.map((tag) => tag.title) ?? []),
      ].filter((value): value is string => Boolean(value))

      return `    <item>
      <title>${cdata(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${cdata(description)}</description>
${categories.map((name) => `      <category>${cdata(name)}</category>`).join('\n')}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${cdata(settings.siteName || SITE_NAME)}</title>
    <link>${escapeXml(homeUrl)}</link>
    <description>${cdata(settings.tagline)}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
