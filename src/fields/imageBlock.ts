import type { Block } from 'payload'

/**
 * Matches a standalone markdown image line — `![alt](src "optional caption")`.
 *
 * Capture groups: 1 = alt text, 2 = src (no spaces/`)`), 3 = optional caption
 * (the markdown "title"). Anchored to a full line (`^…$`) so it only fires for
 * block-level images on their own line, never inline image references inside a
 * sentence.
 */
export const IMAGE_MARKDOWN_REGEX = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/

/** Fields carried by an `Image` lexical block node. */
export interface ImageBlockFields {
  src: string
  alt?: string
  caption?: string
}

/**
 * A lexical `Image` block: the project has no upload collection, so Payload's
 * upload node can't carry static/external image URLs. Instead we mirror the
 * `CodeBlock` pattern — a `BlocksFeature` block whose `jsx` converter round-trips
 * markdown image syntax to/from a `block` node (`fields.blockType === 'Image'`).
 *
 * Because the seed's markdown→lexical converter derives its config from the
 * shared `blogEditor` (which registers this block), `convertMarkdownToLexical`
 * turns each standalone `![alt](src "caption")` line into an `Image` block node
 * automatically — the same mechanism that makes ``` fences become `Code` blocks.
 * The admin editor gets the default block UI (src/alt/caption text fields) plus
 * markdown round-tripping for free, so nothing breaks there.
 */
export const imageBlock: Block = {
  slug: 'Image',
  interfaceName: 'ImageBlock',
  fields: [
    { name: 'src', type: 'text', required: true },
    { name: 'alt', type: 'text' },
    { name: 'caption', type: 'text' },
  ],
  jsx: {
    // A single-line construct: the start regex consumes the whole image line and
    // the (optional) end regex matches a blank line, so no children are spanned.
    customStartRegex: IMAGE_MARKDOWN_REGEX,
    customEndRegex: { optional: true, regExp: /^\s*$/ },
    export: ({ fields }) => exportImageMarkdown(fields as ImageBlockFields),
    import: ({ openMatch }) => importImageFields(openMatch),
  },
}

/** Serialise `Image` block fields back to a markdown image line (JSX → markdown). */
export const exportImageMarkdown = (fields: ImageBlockFields): string => {
  const alt = fields.alt ?? ''
  const caption = fields.caption ? ` "${fields.caption}"` : ''
  return `![${alt}](${fields.src}${caption})`
}

/** Parse a matched markdown image line into `Image` block fields (markdown → JSX). */
export const importImageFields = (openMatch: RegExpMatchArray | undefined): ImageBlockFields => ({
  alt: openMatch?.[1] ?? '',
  src: openMatch?.[2] ?? '',
  caption: openMatch?.[3] ?? '',
})
