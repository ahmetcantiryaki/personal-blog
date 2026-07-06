import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Post } from '@/payload-types'
import { cn } from '@/lib/utils'

interface PostContentProps {
  content: Post['content']
  className?: string
}

/** The `data` shape RichText accepts, derived from the component itself. */
type RichTextData = Parameters<typeof RichText>[0]['data']

/**
 * Render Payload lexical content as semantic HTML, styled by the `.prose`
 * layer (headings, lists, tables, code blocks — all dark-mode aware).
 */
export function PostContent({ content, className }: PostContentProps) {
  if (!content) return null
  return (
    <div className={cn('prose', className)}>
      <RichText data={content as unknown as RichTextData} disableContainer />
    </div>
  )
}
