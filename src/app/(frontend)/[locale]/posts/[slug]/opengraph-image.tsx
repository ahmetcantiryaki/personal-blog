import { ImageResponse } from 'next/og'

import { isLocale } from '@/i18n/config'
import { OG_PALETTE, ogBackgroundImage } from '@/lib/og-palette'
import { getPostBySlug } from '@/lib/posts'
import { SITE_NAME } from '@/lib/seo'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${SITE_NAME} — post cover`

interface OgProps {
  params: Promise<{ locale: string; slug: string }>
}

/** Dynamic Open Graph image reusing the post's cover palette + editorial type. */
export default async function OpengraphImage({ params }: OgProps) {
  const { locale, slug } = await params
  const post = isLocale(locale) ? await getPostBySlug(locale, slug) : null

  const style = post?.coverStyle ?? 'aurora'
  const palette = OG_PALETTE[style]
  const title = post?.title ?? SITE_NAME
  const category = post?.category && typeof post.category === 'object' ? post.category.title : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: palette.base,
          backgroundImage: ogBackgroundImage(style, slug),
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            {SITE_NAME}
          </div>
          {category ? (
            <div
              style={{
                fontSize: 22,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: palette.ink,
              }}
            >
              {category}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 58 : 72,
            fontWeight: 600,
            lineHeight: 1.1,
            maxWidth: '90%',
            textShadow: '0 2px 24px rgba(0,0,0,0.35)',
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 4, backgroundColor: palette.ink, borderRadius: 2 }} />
          <div style={{ fontSize: 24, color: palette.ink }}>{locale.toUpperCase()}</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
