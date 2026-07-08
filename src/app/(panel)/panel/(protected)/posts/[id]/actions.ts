'use server'

import { revalidatePath } from 'next/cache'

import { isAdminUser } from '@/access/roles'
import { LOCALES } from '@/i18n/config'
import { getCurrentUser } from '@/lib/auth'
import { logger } from '@/lib/logger'
import {
  buildPostUpdates,
  postMetadataSchema,
  type PostMetadataOriginal,
} from '@/lib/panel/post-schema'
import { getPayloadClient } from '@/lib/payload'
import { routes } from '@/lib/routes'

export type UpdatePostResult = { ok: true } | { ok: false; error: string }

type LocalizedRecord = Record<string, string | null | undefined>

function localizedFrom(
  excerpt: unknown,
  seo: unknown,
  locale: 'tr' | 'en',
): { excerpt: string; seoTitle: string; seoDescription: string } {
  const excerptRecord = (excerpt ?? {}) as LocalizedRecord
  const seoRecord = (seo ?? {}) as Record<string, LocalizedRecord | undefined>
  const localeSeo = (seoRecord[locale] ?? {}) as LocalizedRecord
  return {
    excerpt: excerptRecord[locale] ?? '',
    seoTitle: localeSeo.seoTitle ?? '',
    seoDescription: localeSeo.seoDescription ?? '',
  }
}

function relationId(value: unknown): number | null {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

/**
 * Update a post's metadata. Re-verifies the caller is an admin, validates the
 * payload with Zod, diffs it against the authoritative DB values, and applies
 * only the changed fields — per locale for localized fields. Never writes the
 * `content` richText field.
 */
export async function updatePostMetadata(
  id: number,
  values: unknown,
): Promise<UpdatePostResult> {
  const user = await getCurrentUser()
  if (!isAdminUser(user)) {
    return { ok: false, error: 'Bu işlem için yönetici yetkisi gerekiyor.' }
  }

  const parsed = postMetadataSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, error: 'Girdiğiniz bilgiler geçersiz. Lütfen kontrol edin.' }
  }

  try {
    const payload = await getPayloadClient()

    const current = await payload.findByID({
      collection: 'posts',
      id,
      locale: 'all',
      depth: 0,
      overrideAccess: true,
    })

    const original: PostMetadataOriginal = {
      status: current.status,
      publishedAt: current.publishedAt ?? null,
      coverStyle: current.coverStyle,
      coverImage: current.coverImage ?? null,
      category: relationId(current.category),
      tags: Array.isArray(current.tags)
        ? current.tags.map(relationId).filter((v): v is number => v !== null)
        : [],
      tr: localizedFrom(current.excerpt, current.seo, 'tr'),
      en: localizedFrom(current.excerpt, current.seo, 'en'),
    }

    const updates = buildPostUpdates(original, parsed.data)

    for (const update of updates) {
      await payload.update({
        collection: 'posts',
        id,
        locale: update.locale,
        data: update.data,
        overrideAccess: true,
      })
    }

    // Refresh frontend post pages (both locales) and the admin list.
    const slug = current.slug as unknown as LocalizedRecord
    for (const locale of LOCALES) {
      const localeSlug = slug[locale]
      if (localeSlug) revalidatePath(routes.post(locale, localeSlug))
    }
    revalidatePath('/panel/posts')
    revalidatePath(`/panel/posts/${id}`)

    return { ok: true }
  } catch (error) {
    logger.error('Post metadata update failed', { id, error })
    return { ok: false, error: 'Kaydetme sırasında bir hata oluştu.' }
  }
}
