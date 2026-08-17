import type { Locale } from '@/i18n/config'

/**
 * Podcast RSS generation for the narrated-article feed.
 *
 * Everything in this module is pure: the route handler gathers posts + manifest
 * entries and hands them over, so the XML shape is unit-testable without a
 * database. The output targets the strictest of the two big directories
 * (Apple Podcasts; Spotify accepts the same document).
 */

/** iTunes top-level category the show is filed under. */
export const PODCAST_ITUNES_CATEGORY = 'Technology'

/**
 * Channel artwork: 2048x2048 JPEG, inside Apple's required 1400-3000 square
 * range. Same ink-and-watercolour language as the article covers, with the
 * title lettered large enough to hold up at the 55px thumbnail size directories
 * render it at.
 */
export const PODCAST_COVER_PATH = '/images/podcast-cover.jpg'

/** Per-locale channel copy. Kept here so the route stays a thin adapter. */
const CHANNEL_COPY: Record<Locale, { titleSuffix: string; description: string }> = {
  tr: {
    titleSuffix: 'Sesli Makaleler',
    description:
      'Woyable makalelerinin seslendirilmiş kayıtları: yazılım, yapay zekâ ve geliştirici araçları üzerine yazılar, dinlenebilir halde.',
  },
  en: {
    titleSuffix: 'Narrated Articles',
    description:
      'Narrated recordings of Woyable articles: software, AI and developer tooling writing, in listenable form.',
  },
}

/** Channel title/description for a locale, built from the configured site name. */
export function podcastChannelCopy(
  locale: Locale,
  siteName: string,
): { title: string; description: string } {
  const copy = CHANNEL_COPY[locale]
  return { title: `${siteName} — ${copy.titleSuffix}`, description: copy.description }
}

/** Escape the five XML predefined entities for use in element text/attributes. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Wrap free text in CDATA, neutralising any embedded `]]>` terminator. */
export function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

/**
 * RFC-822 date, as required for `<pubDate>`. Feed validators reject ISO-8601
 * here, so an unparseable input falls back to `now` rather than emitting an
 * invalid string that would fail the whole feed.
 */
export function toRfc822(value: string | Date | null | undefined): string {
  const date = value ? new Date(value) : new Date()
  const safe = Number.isNaN(date.getTime()) ? new Date() : date
  return safe.toUTCString()
}

/** Seconds → `HH:MM:SS` for `<itunes:duration>`. Negative/NaN clamps to zero. */
export function formatDuration(seconds: number): string {
  const total = Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds) : 0
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
}

export interface PodcastEpisode {
  /** Stable, non-permalink guid source (usually `<locale>/<slug>`). */
  readonly guid: string
  readonly title: string
  /** Canonical article URL — the episode's `<link>`. */
  readonly link: string
  readonly description: string
  readonly publishedAt: string
  readonly audioUrl: string
  readonly bytes: number
  readonly seconds: number
  readonly categories?: readonly string[]
}

export interface PodcastChannel {
  readonly locale: Locale
  readonly title: string
  readonly description: string
  readonly homeUrl: string
  readonly feedUrl: string
  readonly imageUrl: string
  readonly author: string
  /** Apple requires an owner email at submission time; omitted when unset. */
  readonly ownerEmail?: string | null
  readonly episodes: readonly PodcastEpisode[]
}

function renderItem(episode: PodcastEpisode): string {
  const categories = (episode.categories ?? [])
    .filter((name) => Boolean(name))
    .map((name) => `      <category>${cdata(name)}</category>`)

  return [
    '    <item>',
    `      <title>${cdata(episode.title)}</title>`,
    `      <link>${escapeXml(episode.link)}</link>`,
    `      <guid isPermaLink="false">${escapeXml(episode.guid)}</guid>`,
    `      <pubDate>${toRfc822(episode.publishedAt)}</pubDate>`,
    `      <description>${cdata(episode.description)}</description>`,
    `      <content:encoded>${cdata(episode.description)}</content:encoded>`,
    `      <enclosure url="${escapeXml(episode.audioUrl)}" length="${Math.max(0, Math.trunc(episode.bytes))}" type="audio/mpeg" />`,
    `      <itunes:title>${cdata(episode.title)}</itunes:title>`,
    `      <itunes:summary>${cdata(episode.description)}</itunes:summary>`,
    `      <itunes:duration>${formatDuration(episode.seconds)}</itunes:duration>`,
    '      <itunes:explicit>false</itunes:explicit>',
    '      <itunes:episodeType>full</itunes:episodeType>',
    ...categories,
    '    </item>',
  ].join('\n')
}

/**
 * Serialize a full RSS 2.0 + iTunes podcast document. An empty `episodes` list
 * yields a valid, episode-less channel (the state of any locale whose narration
 * pipeline has not been switched on yet) rather than a malformed feed.
 */
export function buildPodcastXml(channel: PodcastChannel): string {
  const lastBuild = toRfc822(channel.episodes[0]?.publishedAt)
  const owner = channel.ownerEmail
    ? [
        '    <itunes:owner>',
        `      <itunes:name>${cdata(channel.author)}</itunes:name>`,
        `      <itunes:email>${escapeXml(channel.ownerEmail)}</itunes:email>`,
        '    </itunes:owner>',
      ]
    : []

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${cdata(channel.title)}</title>`,
    `    <link>${escapeXml(channel.homeUrl)}</link>`,
    `    <description>${cdata(channel.description)}</description>`,
    `    <language>${escapeXml(channel.locale)}</language>`,
    `    <copyright>${cdata(channel.author)}</copyright>`,
    `    <lastBuildDate>${lastBuild}</lastBuildDate>`,
    `    <generator>woyable-podcast</generator>`,
    `    <atom:link href="${escapeXml(channel.feedUrl)}" rel="self" type="application/rss+xml" />`,
    `    <image>`,
    `      <url>${escapeXml(channel.imageUrl)}</url>`,
    `      <title>${cdata(channel.title)}</title>`,
    `      <link>${escapeXml(channel.homeUrl)}</link>`,
    `    </image>`,
    `    <itunes:author>${cdata(channel.author)}</itunes:author>`,
    `    <itunes:summary>${cdata(channel.description)}</itunes:summary>`,
    `    <itunes:type>episodic</itunes:type>`,
    `    <itunes:explicit>false</itunes:explicit>`,
    `    <itunes:image href="${escapeXml(channel.imageUrl)}" />`,
    `    <itunes:category text="${escapeXml(PODCAST_ITUNES_CATEGORY)}" />`,
    ...owner,
    ...channel.episodes.map(renderItem),
    '  </channel>',
    '</rss>',
  ]

  return lines.join('\n')
}
