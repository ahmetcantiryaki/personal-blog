import type { FieldHook, Where } from 'payload'

import { slugify } from '@/utils/slugify'

type Hook = Parameters<FieldHook>[0]

/**
 * Find a free slug within the field's locale by suffixing `-2`, `-3`, … until
 * no other document owns it. Only used for auto-generated slugs; an explicitly
 * typed slug is respected as-is and guarded by the DB unique index instead.
 */
async function uniqueSlug(hook: Hook, base: string): Promise<string> {
  const { req, collection, originalDoc } = hook
  if (!base || !collection || !req?.payload) return base

  const currentId = (originalDoc as { id?: number | string } | undefined)?.id
  let candidate = base
  let n = 1

  // A localized-field query is scoped to the current locale; 'all' isn't valid
  // for a single-locale uniqueness check, so fall back to the default resolution.
  const locale = req.locale === 'all' ? undefined : req.locale

  while (n < 100) {
    const where: Where =
      currentId != null
        ? { and: [{ slug: { equals: candidate } }, { id: { not_equals: currentId } }] }
        : { slug: { equals: candidate } }

    const { totalDocs } = await req.payload.count({
      collection: collection.slug,
      where,
      locale,
      overrideAccess: true,
    })

    if (totalDocs === 0) return candidate
    n += 1
    candidate = `${base}-${n}`
  }

  return candidate
}

/**
 * beforeValidate field hook for a localized `slug` field.
 * If a slug is provided, normalise it through slugify (stored slugs are always
 * URL-safe). If empty, derive one from the given fallback field (e.g. `title`)
 * for the same locale, suffixing on collision so auto-generated slugs stay
 * unique within the locale.
 */
export const formatSlug =
  (fallbackField: string): FieldHook =>
  async (hook) => {
    const { value, data } = hook

    if (typeof value === 'string' && value.trim().length > 0) {
      return slugify(value)
    }

    const fallback = data?.[fallbackField]
    if (typeof fallback === 'string' && fallback.trim().length > 0) {
      return uniqueSlug(hook, slugify(fallback))
    }

    return value
  }
