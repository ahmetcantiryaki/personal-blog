import { isLocale } from '@/i18n/config'
import { getPayloadClient } from '@/lib/payload'
import { logger } from '@/lib/logger'
import {
  buildPodcastXml,
  podcastChannelCopy,
  PODCAST_COVER_PATH,
  type PodcastEpisode,
} from '@/lib/podcast'
import { getPostAudioEntry } from '@/lib/post-audio'
import { absoluteUrl, SITE_AUTHOR, SITE_NAME } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { routes } from '@/lib/routes'

export const revalidate = 3600

/** Upper bound on episodes in one document — well past the current catalogue. */
const MAX_EPISODES = 300

/** Only the columns the feed renders; `content` is deliberately never selected. */
const EPISODE_SELECT = {
  title: true,
  slug: true,
  excerpt: true,
  publishedAt: true,
  updatedAt: true,
} as const

interface EpisodeSource {
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
}

/**
 * Published posts for a locale, newest first, with only the feed's columns
 * loaded. Returns an empty list (rather than throwing) so a database blip
 * degrades to a valid, episode-less feed instead of a 500 in podcast clients.
 */
async function fetchPublishedPosts(locale: 'tr' | 'en'): Promise<EpisodeSource[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      locale,
      depth: 0,
      limit: MAX_EPISODES,
      overrideAccess: false,
      sort: '-publishedAt',
      select: EPISODE_SELECT,
    })
    return result.docs as EpisodeSource[]
  } catch (error) {
    logger.error('podcast.xml: failed to load posts', {
      locale,
      message: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

/**
 * Podcast RSS feed of every published post that has a narrated MP3 in the
 * audio manifest for this locale. Locales whose narration is not switched on
 * yet (currently `tr`) return a valid channel with zero items.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
): Promise<Response> {
  const { locale } = await params
  if (!isLocale(locale)) {
    return new Response('Not found', { status: 404 })
  }

  const [docs, settings] = await Promise.all([
    fetchPublishedPosts(locale),
    getSiteSettings(locale),
  ])

  const siteName = settings.siteName || SITE_NAME
  const { title, description } = podcastChannelCopy(locale, siteName)

  const episodes = docs.reduce<PodcastEpisode[]>((acc, doc) => {
    const slug = doc.slug
    if (!slug || !doc.title) return acc

    const audio = getPostAudioEntry(slug, locale)
    if (!audio) return acc

    return [
      ...acc,
      {
        guid: `${locale}/${slug}`,
        title: doc.title,
        link: absoluteUrl(routes.post(locale, slug)),
        description: doc.excerpt?.trim() || description,
        publishedAt: doc.publishedAt || doc.updatedAt || audio.generatedAt,
        audioUrl: audio.url,
        bytes: audio.bytes,
        seconds: audio.seconds,
      },
    ]
  }, [])

  const xml = buildPodcastXml({
    locale,
    title,
    description,
    homeUrl: absoluteUrl(routes.home(locale)),
    feedUrl: absoluteUrl(routes.podcast(locale)),
    imageUrl: absoluteUrl(PODCAST_COVER_PATH),
    author: siteName || SITE_AUTHOR,
    ownerEmail: process.env.PODCAST_OWNER_EMAIL || null,
    episodes,
  })

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': `public, max-age=0, s-maxage=${revalidate}, stale-while-revalidate=7200`,
    },
  })
}
