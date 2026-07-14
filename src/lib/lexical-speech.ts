/**
 * Extract TTS-friendly plain text from a post's Lexical content tree, and
 * split long text into API-request-sized chunks for a speech-synthesis
 * endpoint (~300 chars per request).
 */

interface LexicalNode {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNode[]
  fields?: { blockType?: string }
}

export interface SpeechExtractOptions {
  locale: 'tr' | 'en'
}

const CODE_PLACEHOLDER: Record<SpeechExtractOptions['locale'], string> = {
  tr: 'Kod örneği makalede yer alıyor.',
  en: 'A code example is available in the article.',
}

const TABLE_PLACEHOLDER: Record<SpeechExtractOptions['locale'], string> = {
  tr: 'Karşılaştırma tablosu makalede yer alıyor.',
  en: 'A comparison table is available in the article.',
}

/** Node types whose content (and any nested content) is never read aloud. */
const SKIPPED_TYPES = new Set(['upload', 'image', 'embed', 'horizontalrule'])

const isCodeBlock = (node: LexicalNode): boolean =>
  node.type === 'block' && node.fields?.blockType === 'Code'

/** An `Image` block node (see src/fields/imageBlock.ts) — never read aloud. */
const isImageBlock = (node: LexicalNode): boolean =>
  node.type === 'block' && node.fields?.blockType === 'Image'

/** Depth-first plain-text of a node (bold/link/inline-code children flattened). */
const textOf = (node: LexicalNode): string => {
  if (SKIPPED_TYPES.has(node.type ?? '') || isCodeBlock(node) || isImageBlock(node)) return ''
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(textOf).join('')
}

/** Collapse repeated whitespace/blank lines produced by markdown remnants. */
const cleanText = (text: string): string => text.replace(/\s+/g, ' ').trim()

const SENTENCE_END = /[.!?…]$/

/** Ensures a spoken line ends with terminal punctuation for a natural pause. */
const ensureSentence = (text: string): string => (SENTENCE_END.test(text) ? text : `${text}.`)

/**
 * Walk root.children and build one spoken "line" per paragraph/heading/list
 * item, replacing code blocks and tables with a locale-appropriate spoken
 * placeholder. Consecutive code blocks collapse into a single placeholder.
 */
export function extractSpeechText(content: unknown, opts: SpeechExtractOptions): string {
  const root = (content as { root?: LexicalNode } | null | undefined)?.root
  if (!root?.children) return ''

  const lines: string[] = []
  let inCodeRun = false

  for (const node of root.children) {
    if (isCodeBlock(node)) {
      if (!inCodeRun) lines.push(CODE_PLACEHOLDER[opts.locale])
      inCodeRun = true
      continue
    }
    inCodeRun = false

    if (isImageBlock(node)) continue

    if (node.type === 'table') {
      lines.push(TABLE_PLACEHOLDER[opts.locale])
      continue
    }

    if (SKIPPED_TYPES.has(node.type ?? '')) continue

    if (node.type === 'heading') {
      const text = cleanText(textOf(node))
      if (text) lines.push(ensureSentence(text))
      continue
    }

    if (node.type === 'list') {
      for (const item of node.children ?? []) {
        const text = cleanText(textOf(item))
        if (text) lines.push(ensureSentence(text))
      }
      continue
    }

    const text = cleanText(textOf(node))
    if (text) lines.push(text)
  }

  return lines.join('\n').trim()
}

/** Splits text into sentences, keeping terminal punctuation attached. */
const splitSentences = (text: string): string[] => {
  const matches = text.match(/[^.!?…]+[.!?…]*\s*/g) ?? []
  return matches.map((sentence) => sentence.trim()).filter(Boolean)
}

/** Breaks a single sentence longer than maxLen at comma/word boundaries. */
const splitLongSentence = (sentence: string, maxLen: number): string[] => {
  const words = sentence.split(/\s+/).filter(Boolean)
  const parts: string[] = []
  let current = ''

  for (const word of words) {
    if (word.length > maxLen) {
      if (current) {
        parts.push(current)
        current = ''
      }
      let remaining = word
      while (remaining.length > maxLen) {
        parts.push(remaining.slice(0, maxLen))
        remaining = remaining.slice(maxLen)
      }
      current = remaining
      continue
    }

    const candidate = current ? `${current} ${word}` : word
    if (candidate.length <= maxLen) {
      current = candidate
    } else {
      if (current) parts.push(current)
      current = word
    }
  }

  if (current) parts.push(current)
  return parts
}

/** Packs sentences (or their sub-parts) into chunks that never exceed maxLen. */
const groupSentences = (sentences: string[], maxLen: number): string[] => {
  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    const pieces = sentence.length > maxLen ? splitLongSentence(sentence, maxLen) : [sentence]
    for (const piece of pieces) {
      const candidate = current ? `${current} ${piece}` : piece
      if (candidate.length <= maxLen) {
        current = candidate
      } else {
        if (current) chunks.push(current)
        current = piece
      }
    }
  }

  if (current) chunks.push(current)
  return chunks
}

/**
 * Splits `text` into chunks of at most `maxLen` characters, breaking on
 * sentence boundaries (`.`, `!`, `?`, `…`) where possible. A single sentence
 * longer than `maxLen` is further broken at word/comma boundaries. Never
 * returns empty chunks.
 */
export function splitForTts(text: string, maxLen: number): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []

  const sentences = splitSentences(trimmed)
  if (sentences.length === 0) return []

  return groupSentences(sentences, maxLen)
}
