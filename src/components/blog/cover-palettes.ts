import type { Post } from '@/payload-types'

export type CoverStyle = Post['coverStyle']

interface Palette {
  /** Deep base panel colour. */
  base: string
  /** Muted blob colours layered as soft radial gradients. */
  blobs: [string, string, string]
  /** Accent hairline used for the category label + rule. */
  ink: string
}

/**
 * Five restrained, muted palettes. Deep base panels with soft mesh blobs —
 * designed to read as calm editorial art, never neon or "AI gradient".
 */
export const COVER_PALETTES: Record<CoverStyle, Palette> = {
  aurora: {
    base: 'oklch(0.32 0.045 200)',
    blobs: ['oklch(0.55 0.07 190)', 'oklch(0.5 0.06 165)', 'oklch(0.46 0.06 260)'],
    ink: 'oklch(0.93 0.03 190)',
  },
  dusk: {
    base: 'oklch(0.31 0.05 320)',
    blobs: ['oklch(0.5 0.08 340)', 'oklch(0.45 0.07 285)', 'oklch(0.52 0.06 30)'],
    ink: 'oklch(0.93 0.03 330)',
  },
  meadow: {
    base: 'oklch(0.33 0.045 150)',
    blobs: ['oklch(0.55 0.08 140)', 'oklch(0.52 0.07 110)', 'oklch(0.48 0.05 165)'],
    ink: 'oklch(0.93 0.03 140)',
  },
  ocean: {
    base: 'oklch(0.3 0.05 245)',
    blobs: ['oklch(0.5 0.08 235)', 'oklch(0.52 0.07 200)', 'oklch(0.45 0.06 265)'],
    ink: 'oklch(0.93 0.03 230)',
  },
  ember: {
    base: 'oklch(0.32 0.05 45)',
    blobs: ['oklch(0.55 0.09 55)', 'oklch(0.5 0.08 30)', 'oklch(0.5 0.06 80)'],
    ink: 'oklch(0.94 0.03 60)',
  },
}

/** Stable 32-bit hash of a string (FNV-1a). Deterministic across renders. */
export function hashString(input: string): number {
  const value = input || 'woyable'
  let hash = 0x811c9dc5
  for (let i = 0; i < value.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

interface Blob {
  x: number
  y: number
  size: number
  color: string
}

/**
 * Deterministically place three soft radial blobs from a seed so every post
 * gets a distinct-but-consistent cover. Returns a CSS `background` value.
 */
export function buildCoverBackground(style: CoverStyle, seed: string): string {
  const palette = COVER_PALETTES[style]
  const h = hashString(seed || 'woyable')

  const blobs: Blob[] = palette.blobs.map((color, i) => {
    const n = (h >> (i * 7)) & 0xff
    const m = (h >> (i * 5 + 3)) & 0xff
    return {
      x: 12 + (n % 76),
      y: 10 + (m % 70),
      size: 55 + ((n ^ m) % 45),
      color,
    }
  })

  const layers = blobs
    .map(
      (b) =>
        `radial-gradient(${b.size}% ${b.size}% at ${b.x}% ${b.y}%, ${b.color} 0%, transparent 60%)`,
    )
    .join(', ')

  return `${layers}, ${palette.base}`
}
