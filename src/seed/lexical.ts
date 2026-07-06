import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { Payload } from 'payload'

export type MarkdownConverter = (markdown: string) => ReturnType<typeof convertMarkdownToLexical>

/**
 * Build a markdown → Lexical converter bound to the project's editor config,
 * so seeded content uses the exact same nodes the admin editor produces.
 */
export const createMarkdownConverter = async (payload: Payload): Promise<MarkdownConverter> => {
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  return (markdown: string) => convertMarkdownToLexical({ editorConfig, markdown })
}
