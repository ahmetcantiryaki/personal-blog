import { describe, expect, it } from 'vitest'

import {
  IMAGE_MARKDOWN_REGEX,
  exportImageMarkdown,
  importImageFields,
  imageBlock,
} from '@/fields/imageBlock'

/**
 * Unit test for the `Image` lexical block's markdown round-trip converters.
 *
 * The full markdown-string → lexical-nodes step runs inside Payload's editor
 * config (stubbed in the unit env), so — mirroring the table converters — the
 * end-to-end wiring is proven by seed verification. Here we assert the pure
 * halves: the line regex that fires the block, `import` (markdown → fields), and
 * `export` (fields → markdown). Together these are exactly what Payload's
 * BlocksFeature jsx pipeline calls to produce/serialize the `Image` block node.
 */
describe('imageBlock markdown converter', () => {
  it('block is registered under the Image slug with src/alt/caption fields', () => {
    expect(imageBlock.slug).toBe('Image')
    const names = imageBlock.fields.map((f) => ('name' in f ? f.name : undefined))
    expect(names).toEqual(['src', 'alt', 'caption'])
  })

  it('regex matches a standalone image line and captures alt/src/caption', () => {
    const match = '![Alt metin](/images/blog/foo/01.jpg "Kaynak: Unsplash / Jane Doe")'.match(
      IMAGE_MARKDOWN_REGEX,
    )
    expect(match).not.toBeNull()
    expect(match?.[1]).toBe('Alt metin')
    expect(match?.[2]).toBe('/images/blog/foo/01.jpg')
    expect(match?.[3]).toBe('Kaynak: Unsplash / Jane Doe')
  })

  it('regex matches an image with no caption (title omitted)', () => {
    const match = '![Sadece alt](/images/blog/foo/02.png)'.match(IMAGE_MARKDOWN_REGEX)
    expect(match).not.toBeNull()
    expect(match?.[1]).toBe('Sadece alt')
    expect(match?.[2]).toBe('/images/blog/foo/02.png')
    expect(match?.[3]).toBeUndefined()
  })

  it('regex does NOT match an inline image inside a sentence', () => {
    expect('Bak ![x](/y.jpg) buraya'.match(IMAGE_MARKDOWN_REGEX)).toBeNull()
  })

  it('import turns a matched line into Image block fields', () => {
    const match = '![Alt](/img.jpg "Kaynak: X")'.match(IMAGE_MARKDOWN_REGEX) ?? undefined
    expect(importImageFields(match)).toEqual({
      alt: 'Alt',
      src: '/img.jpg',
      caption: 'Kaynak: X',
    })
  })

  it('import defaults missing groups to empty strings', () => {
    const match = '![](/img.jpg)'.match(IMAGE_MARKDOWN_REGEX) ?? undefined
    expect(importImageFields(match)).toEqual({ alt: '', src: '/img.jpg', caption: '' })
  })

  it('export serialises fields back to markdown image syntax', () => {
    expect(exportImageMarkdown({ src: '/img.jpg', alt: 'Alt', caption: 'Kaynak: X' })).toBe(
      '![Alt](/img.jpg "Kaynak: X")',
    )
  })

  it('export omits the caption title when caption is empty', () => {
    expect(exportImageMarkdown({ src: '/img.jpg', alt: 'Alt', caption: '' })).toBe(
      '![Alt](/img.jpg)',
    )
  })

  it('import ∘ export round-trips a full image line', () => {
    const line = '![Alt metin](/images/blog/foo/01.jpg "Kaynak: Jane")'
    const fields = importImageFields(line.match(IMAGE_MARKDOWN_REGEX) ?? undefined)
    expect(exportImageMarkdown(fields)).toBe(line)
  })
})
