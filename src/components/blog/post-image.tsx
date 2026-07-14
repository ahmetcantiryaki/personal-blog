import type { JSX } from 'react'

import { cn } from '@/lib/utils'

interface PostImageProps {
  src: string
  alt?: string
  /** Optional source/attribution note rendered as a <figcaption>. */
  caption?: string
}

/**
 * Renders an `Image` lexical block (see `src/fields/imageBlock.ts`) as a
 * semantic <figure>. The project has no upload collection, so `src` is a static
 * or external URL carried verbatim from the markdown.
 *
 * Width/height are unknown, so the image is constrained with `max-w-full h-auto`
 * to bound layout shift, lazy-loaded, and async-decoded. A caption (the markdown
 * image "title") renders as a centered, muted <figcaption>.
 */
export function PostImage({ src, alt, caption }: PostImageProps): JSX.Element | null {
  if (!src) return null
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ''}
        loading="lazy"
        decoding="async"
        className={cn('h-auto w-full max-w-full rounded-xl border border-border/60')}
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
