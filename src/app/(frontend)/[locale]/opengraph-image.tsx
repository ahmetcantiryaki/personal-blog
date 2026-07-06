import { ImageResponse } from 'next/og'

import { getDictionary } from '@/i18n'
import { isLocale } from '@/i18n/config'
import { OG_PALETTE, ogBackgroundImage } from '@/lib/og-palette'
import { SITE_NAME } from '@/lib/seo'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = SITE_NAME

interface OgProps {
  params: Promise<{ locale: string }>
}

/** Default site Open Graph image for home / listing / about pages. */
export default async function OpengraphImage({ params }: OgProps) {
  const { locale } = await params
  const dict = isLocale(locale) ? getDictionary(locale) : getDictionary('tr')
  const palette = OG_PALETTE.aurora

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px',
          backgroundColor: palette.base,
          backgroundImage: ogBackgroundImage('aurora', 'woyable-site'),
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: '-0.03em',
          }}
        >
          {dict.siteName}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 40,
            lineHeight: 1.25,
            maxWidth: '85%',
            color: palette.ink,
          }}
        >
          {dict.tagline}
        </div>
      </div>
    ),
    { ...size },
  )
}
