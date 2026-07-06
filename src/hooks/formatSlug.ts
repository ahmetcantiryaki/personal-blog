import type { FieldHook } from 'payload'

import { slugify } from '@/utils/slugify'

/**
 * beforeValidate field hook for a localized `slug` field.
 * If the slug is empty, derive it from the given fallback field (e.g. `title`)
 * for the same locale. If a slug is provided, normalise it through slugify so
 * stored slugs are always URL-safe.
 */
export const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.trim().length > 0) {
      return slugify(value)
    }

    const fallback = data?.[fallbackField]
    if (typeof fallback === 'string' && fallback.trim().length > 0) {
      return slugify(fallback)
    }

    return value
  }
