import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { PostImage } from '@/components/blog/post-image'

/**
 * Unit test for the `Image` lexical block's JSX renderer (the design-system
 * <figure> the post renderer emits for `block` nodes whose blockType is
 * `Image`). Mirrors the table-converters test: given the fields carried by the
 * block node, assert the rendered HTML is a correct, lazy-loaded, captioned
 * figure.
 */
const render = (props: { src: string; alt?: string; caption?: string }): string =>
  renderToStaticMarkup(<PostImage {...props} />)

describe('PostImage', () => {
  it('renders a <figure> with a lazy, async-decoded <img>', () => {
    const html = render({ src: '/images/blog/foo/01.jpg', alt: 'Alt metin' })
    expect(html).toContain('<figure')
    expect(html).toContain('<img')
    expect(html).toContain('src="/images/blog/foo/01.jpg"')
    expect(html).toContain('alt="Alt metin"')
    expect(html).toContain('loading="lazy"')
    expect(html).toContain('decoding="async"')
  })

  it('applies design-system tokens: rounded border and responsive width', () => {
    const html = render({ src: '/x.jpg', alt: 'x' })
    expect(html).toContain('rounded-xl')
    expect(html).toContain('border-border/60')
    expect(html).toContain('h-auto')
    expect(html).toContain('w-full')
  })

  it('renders a <figcaption> with the source note when a caption is given', () => {
    const html = render({ src: '/x.jpg', alt: 'x', caption: 'Kaynak: Unsplash / Jane Doe' })
    expect(html).toContain('<figcaption')
    expect(html).toContain('Kaynak: Unsplash / Jane Doe')
    expect(html).toContain('text-muted-foreground')
  })

  it('omits the <figcaption> when no caption is provided', () => {
    const html = render({ src: '/x.jpg', alt: 'x' })
    expect(html).not.toContain('<figcaption')
  })

  it('renders an empty alt attribute when alt is missing (decorative)', () => {
    const html = render({ src: '/x.jpg' })
    expect(html).toContain('alt=""')
  })

  it('renders nothing when src is empty', () => {
    expect(render({ src: '' })).toBe('')
  })
})
