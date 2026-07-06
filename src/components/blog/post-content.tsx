import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Post } from '@/payload-types'
import { cn } from '@/lib/utils'

interface PostContentProps {
  content: Post['content']
  className?: string
}

/** The `data` shape RichText accepts, derived from the component itself. */
type RichTextData = Parameters<typeof RichText>[0]['data']

/** Fields carried by the premade lexical Code block (see payload.config editor). */
interface CodeBlockFields {
  code?: string
  language?: string
}

/**
 * Render Payload lexical content as semantic HTML, styled by the `.prose`
 * layer (headings, lists, tables, code blocks — all dark-mode aware).
 *
 * Fenced code blocks are stored as a `Code` block node; render it as a real
 * <pre><code> so the `.prose pre` styles (incl. overflow-x scrolling and dark
 * mode) apply and long unbreakable lines never overflow the viewport.
 */
export function PostContent({ content, className }: PostContentProps) {
  if (!content) return null
  return (
    <div className={cn('prose', className)}>
      <RichText
        data={content as unknown as RichTextData}
        disableContainer
        converters={({ defaultConverters }) => ({
          ...defaultConverters,
          blocks: {
            Code: ({ node }: { node: { fields: CodeBlockFields } }) => {
              const { code, language } = node.fields
              return (
                <pre data-language={language || undefined}>
                  <code>{code ?? ''}</code>
                </pre>
              )
            },
          },
        })}
      />
    </div>
  )
}
