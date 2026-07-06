import type { Post } from '@/payload-types'

type CoverStyle = Post['coverStyle']

interface OgPalette {
  base: string
  blobs: [string, string, string]
  ink: string
}

/**
 * Hex approximations of the oklch cover palettes (`cover-palettes.ts`). Satori
 * / `next/og` can't parse oklch, so OG images use these sRGB equivalents while
 * keeping each style's hue + mood: aurora=teal, dusk=plum, meadow=green,
 * ocean=blue, ember=amber.
 */
export const OG_PALETTE: Record<CoverStyle, OgPalette> = {
  aurora: { base: '#123338', blobs: ['#2f7d78', '#2f7a5c', '#37507f'], ink: '#cdeae4' },
  dusk: { base: '#331d3a', blobs: ['#7d4a6c', '#5a4e8f', '#7d5340'], ink: '#ead4e6' },
  meadow: { base: '#1b3320', blobs: ['#3f7d47', '#5f7d33', '#2f6a4f'], ink: '#d6ead6' },
  ocean: { base: '#172a44', blobs: ['#37609a', '#2f7a9a', '#374f8f'], ink: '#d3e2ee' },
  ember: { base: '#37271a', blobs: ['#9a6237', '#9a472f', '#8f6a2f'], ink: '#eaded0' },
}

/** Deterministic 32-bit hash (FNV-1a) so a slug always yields the same layout. */
export function hashString(input: string): number {
  const value = input || 'woyable'
  let hash = 0x811c9dc5
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/** Build a comma-separated `backgroundImage` of three soft radial blobs. */
export function ogBackgroundImage(style: CoverStyle, seed: string): string {
  const palette = OG_PALETTE[style]
  const h = hashString(seed)
  return palette.blobs
    .map((color, i) => {
      const x = 12 + ((h >> (i * 7)) & 0xff) % 76
      const y = 10 + ((h >> (i * 5 + 3)) & 0xff) % 70
      return `radial-gradient(60% 60% at ${x}% ${y}%, ${color} 0%, transparent 60%)`
    })
    .join(', ')
}
