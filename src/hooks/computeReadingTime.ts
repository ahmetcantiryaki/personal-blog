import type { CollectionBeforeChangeHook } from 'payload'

import { estimateReadingTime } from '@/utils/lexicalText'

/**
 * beforeChange collection hook that recomputes `readingTime` from the post
 * `content` word count. Runs per-locale write, so the value reflects whichever
 * localized content is being saved.
 */
export const computeReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  if (data?.content) {
    return {
      ...data,
      readingTime: estimateReadingTime(data.content),
    }
  }
  return data
}
