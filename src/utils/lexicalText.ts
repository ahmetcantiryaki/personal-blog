/**
 * Utilities for working with Lexical richText values stored by Payload.
 * A Lexical value is `{ root: { children: [...] } }` where text lives on
 * nodes with `type: 'text'` and a `text` string. We walk the tree defensively
 * because the shape is not statically typed at this boundary.
 */

interface LexicalNode {
  type?: string
  text?: string
  children?: LexicalNode[]
}

interface LexicalValue {
  root?: LexicalNode
}

const collectText = (node: LexicalNode | undefined, out: string[]): void => {
  if (!node || typeof node !== 'object') return

  if (node.type === 'text' && typeof node.text === 'string') {
    out.push(node.text)
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) collectText(child, out)
  }
}

export const extractPlainText = (value: unknown): string => {
  const lexical = value as LexicalValue | null | undefined
  if (!lexical?.root) return ''

  const parts: string[] = []
  collectText(lexical.root, parts)
  return parts.join(' ').trim()
}

const WORDS_PER_MINUTE = 200

/** Estimated reading time in whole minutes (minimum 1) for a Lexical value. */
export const estimateReadingTime = (value: unknown): number => {
  const text = extractPlainText(value)
  if (!text) return 1

  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
