import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

// next/image needs the Next runtime/loader; stub it to a plain <img> so the
// branch logic can be asserted from static markup in a node env.
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, className } = props as { src: string; alt: string; className?: string }
    return <img src={src} alt={alt} className={className} />
  },
}))

import { PostCover } from '@/components/blog/post-cover'

/**
 * PostCover chooses between the real AI/uploaded cover image and the
 * deterministic SVG CoverArt fallback. The rule under test: when `coverImage` is
 * set, an <img> is rendered with the post title as alt and object-cover; when it
 * is absent, the SVG CoverArt (grain filter + editorial type) renders instead.
 */
describe('PostCover', () => {
  const base = {
    style: 'aurora' as const,
    title: 'How to Build a RAG System',
    seed: 'how-to-build-rag-system',
    categoryLabel: 'AI',
  }

  it('renders an <img> with the title as alt when coverImage is set', () => {
    const html = renderToStaticMarkup(
      <PostCover {...base} coverImage="/covers/build-rag-system.jpg" variant="card" />,
    )

    expect(html).toContain('<img')
    expect(html).toContain('src="/covers/build-rag-system.jpg"')
    expect(html).toContain('alt="How to Build a RAG System"')
    expect(html).toContain('object-cover')
    // Fallback SVG art must not render alongside the image.
    expect(html).not.toContain('feTurbulence')
  })

  it('falls back to the SVG CoverArt when coverImage is absent', () => {
    const html = renderToStaticMarkup(<PostCover {...base} coverImage={null} variant="card" />)

    expect(html).not.toContain('<img')
    // CoverArt signature: the fine-grain turbulence filter and the title text.
    expect(html).toContain('feTurbulence')
    expect(html).toContain('How to Build a RAG System')
  })

  it('treats an empty-string coverImage as absent (fallback to SVG art)', () => {
    const html = renderToStaticMarkup(<PostCover {...base} coverImage="" variant="plain" />)

    expect(html).not.toContain('<img')
    expect(html).toContain('feTurbulence')
  })
})
