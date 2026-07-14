/**
 * Extract the FAQ section from a post's Lexical content so it can be emitted
 * as schema.org FAQPage JSON-LD. Every Woyable article ends with an
 * "## Sıkça Sorulan Sorular" / "## Frequently Asked Questions" section whose
 * H3s are questions and following paragraphs are answers.
 */

interface LexicalNode {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNode[]
}

export interface FaqEntry {
  question: string
  answer: string
}

const FAQ_HEADINGS = new Set(['sıkça sorulan sorular', 'frequently asked questions'])

/** Depth-first plain-text of a node (bold/link/code children flattened). */
const textOf = (node: LexicalNode): string => {
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(textOf).join('')
}

/**
 * Walk the top-level Lexical nodes; after the FAQ H2, each H3 starts a
 * question and subsequent non-heading blocks form its answer. Stops at the
 * next H2 (or end of document). Returns [] when no FAQ section exists.
 */
export function extractFaq(content: unknown): FaqEntry[] {
  const root = (content as { root?: LexicalNode } | null | undefined)?.root
  if (!root?.children) return []

  const entries: FaqEntry[] = []
  let inFaq = false
  let current: FaqEntry | null = null

  const push = (): void => {
    if (current && current.answer.trim()) entries.push({ ...current, answer: current.answer.trim() })
    current = null
  }

  for (const node of root.children) {
    const isHeading = node.type === 'heading'
    if (isHeading && node.tag === 'h2') {
      if (inFaq) break
      inFaq = FAQ_HEADINGS.has(textOf(node).trim().toLowerCase())
      continue
    }
    if (!inFaq) continue

    if (isHeading && node.tag === 'h3') {
      push()
      const question = textOf(node).trim()
      current = question ? { question, answer: '' } : null
    } else if (current) {
      const text = textOf(node).trim()
      if (text) current.answer = current.answer ? `${current.answer}\n\n${text}` : text
    }
  }
  push()
  return entries
}
