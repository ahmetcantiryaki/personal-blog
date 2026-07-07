import Image from 'next/image'

import { cn } from '@/lib/utils'

import { CoverArt } from './cover-art'
import type { CoverStyle } from './cover-palettes'

interface PostCoverProps {
  /** When set, an AI/uploaded cover image is rendered instead of the SVG art. */
  coverImage?: string | null
  style: CoverStyle
  title: string
  /** Seed for deterministic SVG blob placement — usually the post slug. */
  seed: string
  categoryLabel?: string | null
  variant?: 'hero' | 'card' | 'plain'
  /**
   * `sizes` for the responsive image. Defaults to full viewport width; callers
   * in narrower slots should pass a tighter value for better download sizing.
   */
  sizes?: string
  className?: string
}

/**
 * Post cover: renders the real `coverImage` (AI-generated or uploaded) as a
 * CLS-safe, object-cover `next/image` fill when present; otherwise falls back to
 * the deterministic SVG `CoverArt`. The image sits inside the caller's fixed
 * aspect-ratio box, so the treatment (rounding/border) matches the SVG art.
 */
export function PostCover({
  coverImage,
  style,
  title,
  seed,
  categoryLabel,
  variant = 'card',
  sizes = '100vw',
  className,
}: PostCoverProps) {
  if (coverImage) {
    return (
      <Image
        src={coverImage}
        alt={title}
        fill
        sizes={sizes}
        // Fine ink-crosshatch illustrations lose their linework at the default
        // q75 when downscaled into card slots; q92 keeps the linework crisp on
        // the white paper backgrounds (whitelisted via images.qualities).
        quality={92}
        className={cn('object-cover', className)}
      />
    )
  }

  return (
    <CoverArt
      style={style}
      title={title}
      seed={seed}
      categoryLabel={categoryLabel}
      variant={variant}
      className={className}
    />
  )
}
