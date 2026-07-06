import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { Payload } from 'payload'

import { blogEditor } from '@/fields/blogEditor'

export type MarkdownConverter = (markdown: string) => ReturnType<typeof convertMarkdownToLexical>

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
  return (markdown: string) => convertMarkdownToLexical({ editorConfig, markdown })
}
