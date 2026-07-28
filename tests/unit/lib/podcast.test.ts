// @vitest-environment jsdom
//
// jsdom is used purely for its strict `DOMParser`: it lets the tests assert the
// generated feed is well-formed XML rather than string-matching tag by tag.
import { describe, expect, it } from 'vitest'

import audioManifest from '../../../seed/content/audio-manifest.json'

import {
  buildPodcastXml,
  cdata,
  escapeXml,
  formatDuration,
  podcastChannelCopy,
  PODCAST_COVER_PATH,
  PODCAST_ITUNES_CATEGORY,
  toRfc822,
  type PodcastChannel,
  type PodcastEpisode,
} from '@/lib/podcast'
import { getPostAudioEntry } from '@/lib/post-audio'

const RFC_822 =
  /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT$/

const episode = (overrides: Partial<PodcastEpisode> = {}): PodcastEpisode => ({
  guid: 'en/advanced-typescript-patterns',
  title: 'Advanced TypeScript Patterns',
  link: 'https://woyable.com/en/posts/advanced-typescript-patterns',
  description: 'A tour of conditional types and inference.',
  publishedAt: '2026-07-14T14:37:26.601Z',
  audioUrl: 'https://example.com/audio/en-advanced-typescript-patterns.mp3',
  bytes: 3783201,
  seconds: 473,
  ...overrides,
})

const channel = (overrides: Partial<PodcastChannel> = {}): PodcastChannel => ({
  locale: 'en',
  title: 'Woyable — Narrated Articles',
  description: 'Narrated recordings of Woyable articles.',
  homeUrl: 'https://woyable.com/en',
  feedUrl: 'https://woyable.com/en/podcast.xml',
  imageUrl: 'https://woyable.com/images/ahmetcantryk.jpg',
  author: 'Woyable',
  episodes: [episode()],
  ...overrides,
})

/** Minimal well-formedness probe: every opened tag is closed, in order. */
function assertBalancedTags(xml: string): void {
  const stack: string[] = []
  const tag = /<(\/?)([a-zA-Z][\w:.-]*)([^>]*?)(\/?)>/g
  const body = xml.replace(/<\?xml[^>]*\?>/g, '').replace(/<!\[CDATA\[[\s\S]*?]]>/g, '')
  let match: RegExpExecArray | null
  while ((match = tag.exec(body)) !== null) {
    const [, closing, name, , selfClosing] = match
    if (selfClosing) continue
    if (closing) {
      expect(stack.pop()).toBe(name)
    } else {
      stack.push(name)
    }
  }
  expect(stack).toEqual([])
}

describe('escapeXml / cdata', () => {
  it('escapes all five predefined entities', () => {
    expect(escapeXml(`A & B < C > D "E" 'F'`)).toBe(
      'A &amp; B &lt; C &gt; D &quot;E&quot; &apos;F&apos;',
    )
  })

  it('neutralises an embedded CDATA terminator', () => {
    expect(cdata('evil ]]> payload')).toBe('<![CDATA[evil ]]]]><![CDATA[> payload]]>')
    expect(cdata('evil ]]> payload')).not.toMatch(/[^\]]]]> payload/)
  })
})

describe('toRfc822', () => {
  it('emits RFC-822 dates, not ISO-8601', () => {
    const formatted = toRfc822('2026-07-14T14:37:26.601Z')
    expect(formatted).toBe('Tue, 14 Jul 2026 14:37:26 GMT')
    expect(formatted).toMatch(RFC_822)
  })

  it('falls back to a valid date for unparseable or missing input', () => {
    expect(toRfc822('not-a-date')).toMatch(RFC_822)
    expect(toRfc822(null)).toMatch(RFC_822)
    expect(toRfc822(undefined)).toMatch(RFC_822)
  })
})

describe('formatDuration', () => {
  it('formats seconds as HH:MM:SS', () => {
    expect(formatDuration(473)).toBe('00:07:53')
    expect(formatDuration(3661)).toBe('01:01:01')
    expect(formatDuration(59)).toBe('00:00:59')
  })

  it('clamps invalid durations to zero', () => {
    expect(formatDuration(0)).toBe('00:00:00')
    expect(formatDuration(-10)).toBe('00:00:00')
    expect(formatDuration(Number.NaN)).toBe('00:00:00')
  })
})

describe('podcastChannelCopy', () => {
  it('builds locale-specific title and description', () => {
    expect(podcastChannelCopy('en', 'Woyable').title).toBe('Woyable — Narrated Articles')
    expect(podcastChannelCopy('tr', 'Woyable').title).toBe('Woyable — Sesli Makaleler')
    expect(podcastChannelCopy('tr', 'Woyable').description).toContain('seslendirilmiş')
  })
})

describe('buildPodcastXml — channel level', () => {
  it('declares RSS 2.0 with the itunes and content namespaces', () => {
    const xml = buildPodcastXml(channel())
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"')
    expect(xml).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"')
    assertBalancedTags(xml)
  })

  it('includes every channel-level field Apple requires', () => {
    const xml = buildPodcastXml(channel())
    expect(xml).toContain('<title><![CDATA[Woyable — Narrated Articles]]></title>')
    expect(xml).toContain('<link>https://woyable.com/en</link>')
    expect(xml).toContain('<language>en</language>')
    expect(xml).toContain('<itunes:author><![CDATA[Woyable]]></itunes:author>')
    expect(xml).toContain(`<itunes:category text="${PODCAST_ITUNES_CATEGORY}" />`)
    expect(xml).toContain('<itunes:explicit>false</itunes:explicit>')
    expect(xml).toContain('<itunes:image href="https://woyable.com/images/ahmetcantryk.jpg" />')
    expect(xml).toMatch(/<description><!\[CDATA\[.+]]><\/description>/)
    expect(xml).toContain(
      '<atom:link href="https://woyable.com/en/podcast.xml" rel="self" type="application/rss+xml" />',
    )
  })

  it('emits itunes:owner only when an owner email is configured', () => {
    expect(buildPodcastXml(channel())).not.toContain('<itunes:owner>')
    const withOwner = buildPodcastXml(channel({ ownerEmail: 'hello@woyable.com' }))
    expect(withOwner).toContain('<itunes:email>hello@woyable.com</itunes:email>')
    assertBalancedTags(withOwner)
  })

  it('uses the locale code as <language> for the tr feed too', () => {
    const xml = buildPodcastXml(channel({ locale: 'tr', episodes: [] }))
    expect(xml).toContain('<language>tr</language>')
  })
})

describe('buildPodcastXml — episode level', () => {
  it('includes every episode-level field Apple requires', () => {
    const xml = buildPodcastXml(channel())
    expect(xml).toContain('<guid isPermaLink="false">en/advanced-typescript-patterns</guid>')
    expect(xml).toContain('<pubDate>Tue, 14 Jul 2026 14:37:26 GMT</pubDate>')
    expect(xml).toContain('<itunes:duration>00:07:53</itunes:duration>')
    expect(xml).toContain(
      '<enclosure url="https://example.com/audio/en-advanced-typescript-patterns.mp3" length="3783201" type="audio/mpeg" />',
    )
  })

  it('carries the manifest bytes/seconds straight into enclosure length and duration', () => {
    const xml = buildPodcastXml(
      channel({ episodes: [episode({ bytes: 4177920, seconds: 522 })] }),
    )
    expect(xml).toContain('length="4177920"')
    expect(xml).toContain('<itunes:duration>00:08:42</itunes:duration>')
  })

  it('emits an integer, non-negative enclosure length', () => {
    const xml = buildPodcastXml(channel({ episodes: [episode({ bytes: -5 })] }))
    expect(xml).toContain('length="0"')
    expect(xml).not.toMatch(/length="[^"]*\./)
  })

  it('every pubDate is RFC-822', () => {
    const xml = buildPodcastXml(
      channel({
        episodes: [
          episode({ guid: 'a', publishedAt: '2026-01-02T03:04:05.000Z' }),
          episode({ guid: 'b', publishedAt: '2025-12-31T23:59:59.000Z' }),
        ],
      }),
    )
    const dates = [...xml.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map((m) => m[1])
    expect(dates).toHaveLength(2)
    for (const date of dates) expect(date).toMatch(RFC_822)
    expect(xml).toMatch(/<lastBuildDate>[^<]+<\/lastBuildDate>/)
  })

  it('renders one item per episode, ordered as given', () => {
    const xml = buildPodcastXml(
      channel({ episodes: [episode({ guid: 'first' }), episode({ guid: 'second' })] }),
    )
    expect([...xml.matchAll(/<item>/g)]).toHaveLength(2)
    expect(xml.indexOf('first')).toBeLessThan(xml.indexOf('second'))
  })

  it('renders optional categories and skips empty ones', () => {
    const xml = buildPodcastXml(
      channel({ episodes: [episode({ categories: ['AI & Agents', ''] })] }),
    )
    expect(xml).toContain('<category><![CDATA[AI & Agents]]></category>')
    expect([...xml.matchAll(/<category>/g)]).toHaveLength(1)
  })
})

describe('buildPodcastXml — XML safety', () => {
  it('does not leak raw & < > from titles or descriptions', () => {
    const xml = buildPodcastXml(
      channel({
        title: 'Woyable & Friends <Live>',
        episodes: [
          episode({
            title: 'RAG & Vector DBs: <embeddings> "explained"',
            description: 'Why a & b < c and d > e.',
          }),
        ],
      }),
    )

    expect(xml).toContain('<![CDATA[RAG & Vector DBs: <embeddings> "explained"]]>')
    assertBalancedTags(xml)

    // Outside CDATA sections nothing may contain a bare &, < or > that is not
    // part of a tag — that is what makes strict parsers reject a feed.
    const outsideCdata = xml.replace(/<!\[CDATA\[[\s\S]*?]]>/g, '')
    const bareAmpersand = outsideCdata.match(/&(?!(amp|lt|gt|quot|apos);)/g)
    expect(bareAmpersand).toBeNull()
  })

  it('escapes reserved characters inside attribute values', () => {
    const xml = buildPodcastXml(
      channel({
        episodes: [episode({ audioUrl: 'https://example.com/a.mp3?x=1&y="2"' })],
      }),
    )
    expect(xml).toContain('url="https://example.com/a.mp3?x=1&amp;y=&quot;2&quot;"')
  })
})

describe('buildPodcastXml — locale without narration', () => {
  it('produces an empty but valid feed rather than throwing', () => {
    const xml = buildPodcastXml(
      channel({
        locale: 'tr',
        title: 'Woyable — Sesli Makaleler',
        homeUrl: 'https://woyable.com/tr',
        feedUrl: 'https://woyable.com/tr/podcast.xml',
        episodes: [],
      }),
    )

    expect(xml).not.toContain('<item>')
    expect(xml).toContain('<language>tr</language>')
    expect(xml).toContain('<itunes:category text="Technology" />')
    expect(xml).toMatch(/<lastBuildDate>[^<]+<\/lastBuildDate>/)
    expect(xml.trimEnd().endsWith('</rss>')).toBe(true)
    assertBalancedTags(xml)
  })
})

describe('sample document', () => {
  it('matches the expected serialized shape end to end', () => {
    const xml = buildPodcastXml(
      channel({
        ownerEmail: 'hello@woyable.com',
        episodes: [episode({ description: 'Types & inference.' })],
      }),
    )

    expect(xml).toBe(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[Woyable — Narrated Articles]]></title>
    <link>https://woyable.com/en</link>
    <description><![CDATA[Narrated recordings of Woyable articles.]]></description>
    <language>en</language>
    <copyright><![CDATA[Woyable]]></copyright>
    <lastBuildDate>Tue, 14 Jul 2026 14:37:26 GMT</lastBuildDate>
    <generator>woyable-podcast</generator>
    <atom:link href="https://woyable.com/en/podcast.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>https://woyable.com/images/ahmetcantryk.jpg</url>
      <title><![CDATA[Woyable — Narrated Articles]]></title>
      <link>https://woyable.com/en</link>
    </image>
    <itunes:author><![CDATA[Woyable]]></itunes:author>
    <itunes:summary><![CDATA[Narrated recordings of Woyable articles.]]></itunes:summary>
    <itunes:type>episodic</itunes:type>
    <itunes:explicit>false</itunes:explicit>
    <itunes:image href="https://woyable.com/images/ahmetcantryk.jpg" />
    <itunes:category text="Technology" />
    <itunes:owner>
      <itunes:name><![CDATA[Woyable]]></itunes:name>
      <itunes:email>hello@woyable.com</itunes:email>
    </itunes:owner>
    <item>
      <title><![CDATA[Advanced TypeScript Patterns]]></title>
      <link>https://woyable.com/en/posts/advanced-typescript-patterns</link>
      <guid isPermaLink="false">en/advanced-typescript-patterns</guid>
      <pubDate>Tue, 14 Jul 2026 14:37:26 GMT</pubDate>
      <description><![CDATA[Types & inference.]]></description>
      <content:encoded><![CDATA[Types & inference.]]></content:encoded>
      <enclosure url="https://example.com/audio/en-advanced-typescript-patterns.mp3" length="3783201" type="audio/mpeg" />
      <itunes:title><![CDATA[Advanced TypeScript Patterns]]></itunes:title>
      <itunes:summary><![CDATA[Types & inference.]]></itunes:summary>
      <itunes:duration>00:07:53</itunes:duration>
      <itunes:explicit>false</itunes:explicit>
      <itunes:episodeType>full</itunes:episodeType>
    </item>
  </channel>
</rss>`)
  })
})

describe('getPostAudioEntry (manifest reuse)', () => {
  it('returns bytes + seconds for a narrated English post', () => {
    const entry = getPostAudioEntry('advanced-typescript-patterns', 'en')
    expect(entry).not.toBeNull()
    expect(entry?.bytes).toBeGreaterThan(0)
    expect(entry?.seconds).toBeGreaterThan(0)
    expect(entry?.url).toMatch(/^https:\/\/.+\.mp3$/)
  })

  it('returns null for a locale with no narration and for unknown slugs', () => {
    expect(getPostAudioEntry('advanced-typescript-patterns', 'tr')).toBeNull()
    expect(getPostAudioEntry('no-such-post-anywhere', 'en')).toBeNull()
  })
})

describe('strict XML parse of the whole real catalogue', () => {
  /** Parse with a real XML parser; jsdom reports failures as a <parsererror>. */
  const parse = (xml: string): Document =>
    new DOMParser().parseFromString(xml, 'application/xml')

  it('serializes every manifest entry into a document a strict parser accepts', () => {
    const entries = audioManifest as Record<
      string,
      { url: string; bytes: number; seconds: number; generatedAt: string }
    >
    // Hostile titles/descriptions on every episode: the escaping must hold for
    // the full catalogue, not just the hand-written fixture above.
    const episodes: PodcastEpisode[] = Object.entries(entries).map(([key, entry]) => ({
      guid: key,
      title: `AI & Agents: <deep> "dive" — ${key}`,
      link: `https://woyable.com/en/posts/${key.split('/')[1]}`,
      description: 'Ampersands & angle brackets < > plus a ]]> terminator.',
      publishedAt: entry.generatedAt,
      audioUrl: `${entry.url}?a=1&b=2`,
      bytes: entry.bytes,
      seconds: entry.seconds,
    }))

    expect(episodes.length).toBeGreaterThan(0)

    const doc = parse(buildPodcastXml(channel({ episodes })))
    expect(doc.getElementsByTagName('parsererror')).toHaveLength(0)
    expect(doc.getElementsByTagName('item')).toHaveLength(episodes.length)

    const enclosure = doc.getElementsByTagName('enclosure')[0]
    expect(enclosure.getAttribute('type')).toBe('audio/mpeg')
    expect(enclosure.getAttribute('url')).toContain('&b=2')
    expect(Number(enclosure.getAttribute('length'))).toBeGreaterThan(0)
  })

  it('accepts the empty tr feed as well', () => {
    const doc = parse(buildPodcastXml(channel({ locale: 'tr', episodes: [] })))
    expect(doc.getElementsByTagName('parsererror')).toHaveLength(0)
    expect(doc.getElementsByTagName('item')).toHaveLength(0)
    expect(doc.getElementsByTagName('channel')).toHaveLength(1)
  })
})

describe('podcast cover placeholder', () => {
  it('points at an existing site asset until square artwork exists', () => {
    expect(PODCAST_COVER_PATH.startsWith('/')).toBe(true)
    expect(PODCAST_COVER_PATH).toMatch(/\.(jpg|jpeg|png)$/)
  })
})
