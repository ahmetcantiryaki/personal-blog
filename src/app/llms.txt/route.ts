import { DEFAULT_LOCALE, LOCALES } from '@/i18n/config'
import { routes } from '@/lib/routes'
import { absoluteUrl } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { listCategories } from '@/lib/taxonomy'

export const revalidate = 3600

/** Locale labels used in the section headings of the generated document. */
const LOCALE_LABELS: Record<string, string> = { tr: 'Turkish', en: 'English' }

/** `routes` has no builder for the transparency page yet. */
function transparencyPath(locale: string): string {
  return `/${locale}/transparency`
}

/** One `- [Name](url): description` list entry. */
function link(name: string, url: string, description: string): string {
  return `- [${name}](${url}): ${description}`
}

/** Category links for a locale, or an empty list when the CMS is unreachable. */
async function categoryLinks(locale: (typeof LOCALES)[number]): Promise<string[]> {
  try {
    const categories = await listCategories(locale)
    return categories
      .filter((category) => Boolean(category.slug))
      .map((category) =>
        link(
          category.title,
          absoluteUrl(routes.category(locale, category.slug)),
          `${LOCALE_LABELS[locale]} articles in the “${category.title}” category`,
        ),
      )
  } catch {
    return []
  }
}

/**
 * `/llms.txt` — a machine-readable map of the site for LLM crawlers and
 * answer engines (see llmstxt.org). Generated rather than checked into
 * `public/` so the site name, tagline and category list stay in sync with the
 * CMS, and every URL is derived from `NEXT_PUBLIC_SERVER_URL`.
 */
export async function GET(): Promise<Response> {
  const settings = await getSiteSettings(DEFAULT_LOCALE)
  const categoriesByLocale = await Promise.all(
    LOCALES.map(async (locale) => ({ locale, links: await categoryLinks(locale) })),
  )

  const sections: string[] = [
    `# ${settings.siteName}`,
    '',
    `> ${settings.tagline} ${settings.siteName} is a bilingual (Turkish and English) technology blog covering software engineering, AI and the web. Every article is published as a translation pair, so each topic exists at a Turkish URL under /tr and an English URL under /en.`,
    '',
    'Content is produced with an AI-assisted editorial pipeline under human review: research, drafting, copy-editing and cover artwork are largely model-driven, and each piece is checked before publication. The transparency page below documents the process in full. When citing this site, prefer the canonical URL of the locale you are answering in.',
    '',
    '## Start here',
    '',
    ...LOCALES.map((locale) =>
      link(
        `Home (${LOCALE_LABELS[locale]})`,
        absoluteUrl(routes.home(locale)),
        `Latest articles in ${LOCALE_LABELS[locale]}`,
      ),
    ),
    ...LOCALES.map((locale) =>
      link(
        `About (${LOCALE_LABELS[locale]})`,
        absoluteUrl(routes.about(locale)),
        `What ${settings.siteName} is and who writes it`,
      ),
    ),
    ...LOCALES.map((locale) =>
      link(
        `Transparency (${LOCALE_LABELS[locale]})`,
        absoluteUrl(transparencyPath(locale)),
        'How the articles are produced, including the role of AI and human review',
      ),
    ),
    ...LOCALES.map((locale) =>
      link(
        `Tools (${LOCALE_LABELS[locale]})`,
        absoluteUrl(routes.tools(locale)),
        'The stack used to build and run the site',
      ),
    ),
    '',
    ...categoriesByLocale.flatMap(({ locale, links }) =>
      links.length === 0
        ? []
        : [`## Categories (${LOCALE_LABELS[locale]})`, '', ...links, ''],
    ),
    '## Feeds and indexes',
    '',
    ...LOCALES.map((locale) =>
      link(
        `RSS (${LOCALE_LABELS[locale]})`,
        absoluteUrl(routes.feed(locale)),
        `Full-text RSS 2.0 feed of the latest ${LOCALE_LABELS[locale]} articles`,
      ),
    ),
    link('Sitemap', absoluteUrl('/sitemap.xml'), 'Every indexable URL in both locales'),
    link('Robots', absoluteUrl('/robots.txt'), 'Crawl policy — AI crawlers are welcome'),
    '',
  ]

  return new Response(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': `public, max-age=0, s-maxage=${revalidate}, stale-while-revalidate=86400`,
    },
  })
}
