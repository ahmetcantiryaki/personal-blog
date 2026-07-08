'use server'

import { revalidatePath } from 'next/cache'

import { isAdminUser } from '@/access/roles'
import { getCurrentUser } from '@/lib/auth'
import { siteSettingsSchema, type SocialLinkInput } from '@/lib/panel/site-settings-schema'
import { getPayloadClient } from '@/lib/payload'

/** Standard result envelope for the settings mutation. */
export interface ActionResult {
  ok: boolean
  error?: string
}

async function requireAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return isAdminUser(user)
}

/** Reconstruct the social-links array from indexed FormData entries. */
function parseSocialLinks(formData: FormData): SocialLinkInput[] {
  const labels = formData.getAll('social.label').map((v) => String(v))
  const urls = formData.getAll('social.url').map((v) => String(v))
  const rows: SocialLinkInput[] = []
  for (let i = 0; i < labels.length; i += 1) {
    const label = (labels[i] ?? '').trim()
    const url = (urls[i] ?? '').trim()
    // Skip fully empty rows so a stray blank line is not a validation error.
    if (!label && !url) continue
    rows.push({ label, url })
  }
  return rows
}

export async function updateSiteSettings(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!isAdminUser(user)) return { ok: false, error: 'Bu işlem için yetkiniz yok.' }

  const parsed = siteSettingsSchema.safeParse({
    tr: {
      siteName: String(formData.get('tr.siteName') ?? ''),
      tagline: String(formData.get('tr.tagline') ?? ''),
      footerText: String(formData.get('tr.footerText') ?? ''),
    },
    en: {
      siteName: String(formData.get('en.siteName') ?? ''),
      tagline: String(formData.get('en.tagline') ?? ''),
      footerText: String(formData.get('en.footerText') ?? ''),
    },
    socialLinks: parseSocialLinks(formData),
  })
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Geçersiz veri.' }
  }
  const { tr, en, socialLinks } = parsed.data

  try {
    const payload = await getPayloadClient()
    // Social links are non-localized: write them once (with the `tr` pass) so
    // both locale rows share the same array.
    await payload.updateGlobal({
      slug: 'siteSettings',
      locale: 'tr',
      data: {
        siteName: tr.siteName || null,
        tagline: tr.tagline || null,
        footerText: tr.footerText || null,
        socialLinks: socialLinks.map((l) => ({ label: l.label, url: l.url })),
      },
    })
    await payload.updateGlobal({
      slug: 'siteSettings',
      locale: 'en',
      data: {
        siteName: en.siteName || null,
        tagline: en.tagline || null,
        footerText: en.footerText || null,
      },
    })
    // Site name / tagline / footer + social links surface in the shared frontend
    // layout for every locale, so revalidate the whole layout tree.
    revalidatePath('/', 'layout')
    revalidatePath('/panel/settings')
    return { ok: true }
  } catch {
    return { ok: false, error: 'Ayarlar kaydedilemedi. Lütfen tekrar deneyin.' }
  }
}
