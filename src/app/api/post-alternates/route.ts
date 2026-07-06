import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import { LOCALES, type Locale } from '@/i18n/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const querySchema = z.object({
  slug: z.string().trim().min(1).max(512),
  from: z.enum(LOCALES),
})

/**
 * GET /api/post-alternates?slug=&from= — resolve a post's per-locale slugs via
 * its shared translationKey. Powers the locale switcher on post pages so it can
 * link to the correct translated slug instead of blindly swapping the prefix.
 */
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const url = new URL(req.url)
    const parsed = querySchema.safeParse({
      slug: url.searchParams.get('slug'),
      from: url.searchParams.get('from'),
    })
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const source = await payload.find({
      collection: 'posts',
      where: { and: [{ status: { equals: 'published' } }, { slug: { equals: parsed.data.slug } }] },
      locale: parsed.data.from,
      depth: 0,
      limit: 1,
      overrideAccess: false,
      pagination: false,
    })

    const translationKey = source.docs[0]?.translationKey
    const alternates: Record<Locale, string | null> = { tr: null, en: null }
    if (!translationKey) {
      return NextResponse.json(alternates)
    }

    await Promise.all(
      LOCALES.map(async (locale) => {
        const res = await payload.find({
          collection: 'posts',
          where: {
            and: [
              { status: { equals: 'published' } },
              { translationKey: { equals: translationKey } },
            ],
          },
          locale,
          depth: 0,
          limit: 1,
          overrideAccess: false,
          pagination: false,
        })
        alternates[locale] = res.docs[0]?.slug ?? null
      }),
    )

    return NextResponse.json(alternates)
  } catch (error) {
    console.error('post-alternates: failed', error)
    return NextResponse.json({ tr: null, en: null })
  }
}
