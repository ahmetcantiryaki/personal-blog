'use server'

import type { ReactNode } from 'react'

import { getDictionary } from '@/i18n'
import { isLocale, type Locale } from '@/i18n/config'
import { listPosts } from '@/lib/posts'

import { PostGrid } from './post-grid'

export interface LoadMoreResult {
  /** Server-rendered grid for the requested batch (RSC payload). */
  node: ReactNode
  /** Whether a further batch exists after this one. */
  hasMore: boolean
  /** The page number to request next. */
  nextPage: number
}

interface LoadMoreInput {
  locale: string
  page: number
  /** Featured post id, excluded from every grid batch (as on page 1). */
  excludeId?: number
}

/**
 * Server action backing the home page's progressive "load more" grid. Renders
 * the next 9-post batch (published, current locale, featured excluded) as an
 * RSC node so the real `PostCard` server component is reused verbatim — no
 * client-side card duplication. Inputs are validated at this trust boundary.
 */
export async function loadMoreHomePosts(input: LoadMoreInput): Promise<LoadMoreResult> {
  if (!isLocale(input.locale)) {
    return { node: null, hasMore: false, nextPage: input.page }
  }
  const locale: Locale = input.locale
  // Batch 1 is server-rendered by the page; the action only serves batch 2+.
  const page = Number.isFinite(input.page) ? Math.max(2, Math.floor(input.page)) : 2
  const excludeId =
    typeof input.excludeId === 'number' && Number.isFinite(input.excludeId)
      ? input.excludeId
      : undefined

  const { posts, totalPages } = await listPosts({ locale, page, excludeId })
  const dict = getDictionary(locale)

  return {
    node: <PostGrid posts={posts} locale={locale} dict={dict} />,
    hasMore: page < totalPages,
    nextPage: page + 1,
  }
}
