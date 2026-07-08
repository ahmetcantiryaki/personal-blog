'use server'

import { isAdminUser } from '@/access/roles'
import { getCurrentUser } from '@/lib/auth'
import { logger } from '@/lib/logger'
import {
  contentActionSchema,
  hasRequiredFrontMatter,
} from '@/lib/panel/content-guard'
import { writePostMarkdown, type ContentSource } from '@/lib/panel/content-source'

export type SavePostContentResult =
  | { ok: true; source: ContentSource }
  | { ok: false; error: string }

/**
 * Persist edited post-body markdown to its SOURCE file. Re-verifies the caller
 * is an admin, validates the payload with Zod, enforces that front matter is
 * still intact (`---` fence + `translationKey:`), then commits to GitHub (or
 * writes the local file in dev). Never touches the DB directly — the change
 * reaches the live site via the deploy+seed pipeline.
 */
export async function savePostContent(
  values: unknown,
): Promise<SavePostContentResult> {
  const user = await getCurrentUser()
  if (!isAdminUser(user)) {
    return { ok: false, error: 'Bu işlem için yönetici yetkisi gerekiyor.' }
  }

  const parsed = contentActionSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, error: 'Girdiğiniz içerik geçersiz. Lütfen kontrol edin.' }
  }

  if (!hasRequiredFrontMatter(parsed.data.markdown)) {
    return {
      ok: false,
      error:
        'İçerik front-matter (---) ile başlamalı ve translationKey alanını korumalı. Kaydetme iptal edildi.',
    }
  }

  try {
    const result = await writePostMarkdown({
      locale: parsed.data.locale,
      slug: parsed.data.slug,
      markdown: parsed.data.markdown,
      sha: parsed.data.sha ?? null,
    })
    return { ok: true, source: result.source }
  } catch (error) {
    logger.error('Post content save failed', {
      locale: parsed.data.locale,
      slug: parsed.data.slug,
      error,
    })
    const message =
      error instanceof Error ? error.message : 'Kaydetme sırasında bir hata oluştu.'
    return { ok: false, error: message }
  }
}
