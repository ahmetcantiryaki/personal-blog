import { cn } from '@/lib/utils'

import { buildCoverBackground, COVER_PALETTES, type CoverStyle } from './cover-palettes'

interface CoverArtProps {
  style: CoverStyle
  title: string
  /** Seed for deterministic blob placement — usually the post slug. */
  seed: string
  categoryLabel?: string | null
  /** `hero` renders large display type; `card` is compact. `plain` hides text. */
  variant?: 'hero' | 'card' | 'plain'
  className?: string
}

/**
 * Deterministic, image-free cover art. A muted radial-gradient mesh (driven by
 * coverStyle + seed) with a fine grain overlay, a legibility scrim, and the
 * category label + title set in editorial type. Looks designed, not random.
 */
export function CoverArt({
  style,
  title,
  seed,
  categoryLabel,
  variant = 'card',
  className,
}: CoverArtProps) {
  const palette = COVER_PALETTES[style]
  const background = buildCoverBackground(style, seed)
  const isHero = variant === 'hero'
  const showText = variant !== 'plain'

  return (
    <div
      aria-hidden={variant === 'plain'}
      className={cn(
        'relative isolate flex h-full w-full flex-col justify-end overflow-hidden',
        isHero ? 'p-7 sm:p-10' : 'p-5',
        className,
      )}
      style={{ background }}
    >
      {/* Fine grain — keeps flat gradients from looking synthetic */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay">
        <filter id={`grain-${style}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${style})`} />
      </svg>

      {/* Bottom scrim for text legibility */}
      {showText && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
      )}

      {showText && (
        <div className="relative z-10">
          {categoryLabel ? (
            <span
              className="mb-2 inline-block text-[0.7rem] font-medium uppercase tracking-[0.18em]"
              style={{ color: palette.ink }}
            >
              {categoryLabel}
            </span>
          ) : null}
          <p
            className={cn(
              'font-serif font-medium leading-tight text-white text-balance',
              isHero ? 'text-2xl sm:text-4xl' : 'text-lg',
            )}
          >
            {title}
          </p>
        </div>
      )}
    </div>
  )
}
