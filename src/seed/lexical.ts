import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { Payload } from 'payload'

import { blogEditor, CODE_LANGUAGES } from '@/fields/blogEditor'

export type MarkdownConverter = (markdown: string) => ReturnType<typeof convertMarkdownToLexical>

const OPENING_FENCE = /^(```)([A-Za-z0-9_+-]+)[ \t]*$/gm

/**
 * Downgrade unknown fence languages to `text` before conversion. The CodeBlock
 * validates its language select against CODE_LANGUAGES, so a single article
 * with an unlisted language (e.g. ```nginx before it was added) used to fail
 * the whole seed — and with it every deploy. Closing fences (bare ```) carry
 * no language and are left untouched.
 */
export const normalizeFenceLanguages = (markdown: string): string =>
  markdown.replace(OPENING_FENCE, (full, ticks: string, lang: string) =>
    lang in CODE_LANGUAGES ? full : `${ticks}text`,
  )

/**
 * Build a markdown → Lexical converter bound to the project's ACTUAL editor
 * config, so seeded content uses the exact same nodes the admin editor produces
 * — including the fenced-code block. `editorConfigFactory.default()` would
 * return the default feature set (no code block) and re-parse ``` fences as
 * markdown, so we derive the config from the shared `blogEditor` instead.
 */
export const createMarkdownConverter = async (payload: Payload): Promise<MarkdownConverter> => {
  const editorConfig = await editorConfigFactory.fromEditor({
    config: payload.config,
    editor: blogEditor,
  })
  return (markdown: string) =>
    convertMarkdownToLexical({ editorConfig, markdown: normalizeFenceLanguages(markdown) })
}
