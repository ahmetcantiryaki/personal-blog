'use server'

import { revalidatePath } from 'next/cache'

import { isAdminUser } from '@/access/roles'
import { LOCALES, type Locale } from '@/i18n/config'
import { getCurrentUser } from '@/lib/auth'
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  tagCreateSchema,
  tagUpdateSchema,
} from '@/lib/panel/taxonomy-schema'
import { getPayloadClient } from '@/lib/payload'
import { routes } from '@/lib/routes'

/** Standard result envelope for taxonomy mutations. */
export interface ActionResult {
  ok: boolean
  error?: string
}

const forbidden: ActionResult = { ok: false, error: 'Bu işlem için yetkiniz yok.' }

async function requireAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return isAdminUser(user)
}

/** Pull a nested `<locale>.<field>` value out of the submitted FormData. */
function localeGroup(formData: FormData, locale: Locale) {
  return {
    title: String(formData.get(`${locale}.title`) ?? ''),
    slug: String(formData.get(`${locale}.slug`) ?? ''),
    description: String(formData.get(`${locale}.description`) ?? ''),
  }
}

function firstError(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? 'Geçersiz veri.'
}

function revalidateTaxonomy(slugs: { locale: Locale; slug: string }[], kind: 'category' | 'tag') {
  revalidatePath('/panel/taxonomy')
  for (const locale of LOCALES) {
    revalidatePath(routes.home(locale))
  }
  for (const { locale, slug } of slugs) {
    if (!slug) continue
    revalidatePath(kind === 'category' ? routes.category(locale, slug) : routes.tag(locale, slug))
  }
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function createCategory(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdmin())) return forbidden

  const parsed = categoryCreateSchema.safeParse({
    key: String(formData.get('key') ?? ''),
    tr: localeGroup(formData, 'tr'),
    en: localeGroup(formData, 'en'),
  })
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) }
  const { key, tr, en } = parsed.data

  try {
    const payload = await getPayloadClient()
    const created = await payload.create({
      collection: 'categories',
      locale: 'tr',
      data: {
        key,
        title: tr.title,
        slug: tr.slug,
        description: tr.description || null,
      },
    })
    await payload.update({
      collection: 'categories',
      id: created.id,
      locale: 'en',
      data: {
        title: en.title,
        slug: en.slug,
        description: en.description || null,
      },
    })
    revalidateTaxonomy(
      [
        { locale: 'tr', slug: tr.slug },
        { locale: 'en', slug: en.slug },
      ],
      'category',
    )
    return { ok: true }
  } catch (error) {
    return { ok: false, error: toMessage(error, 'Kategori oluşturulamadı.') }
  }
}

export async function updateCategory(id: number, formData: FormData): Promise<ActionResult> {
  if (!(await requireAdmin())) return forbidden

  const parsed = categoryUpdateSchema.safeParse({
    tr: localeGroup(formData, 'tr'),
    en: localeGroup(formData, 'en'),
  })
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) }
  const { tr, en } = parsed.data

  try {
    const payload = await getPayloadClient()
    // `key` is intentionally omitted — it is immutable after creation.
    await payload.update({
      collection: 'categories',
      id,
      locale: 'tr',
      data: {
        title: tr.title,
        slug: tr.slug,
        description: tr.description || null,
      },
    })
    await payload.update({
      collection: 'categories',
      id,
      locale: 'en',
      data: {
        title: en.title,
        slug: en.slug,
        description: en.description || null,
      },
    })
    revalidateTaxonomy(
      [
        { locale: 'tr', slug: tr.slug },
        { locale: 'en', slug: en.slug },
      ],
      'category',
    )
    return { ok: true }
  } catch (error) {
    return { ok: false, error: toMessage(error, 'Kategori güncellenemedi.') }
  }
}

export async function deleteCategory(id: number): Promise<ActionResult> {
  if (!(await requireAdmin())) return forbidden

  try {
    const payload = await getPayloadClient()
    const { totalDocs } = await payload.count({
      collection: 'posts',
      where: { category: { equals: id } },
    })
    if (totalDocs > 0) {
      return {
        ok: false,
        error: `Bu kategori ${totalDocs} yazıda kullanıldığı için silinemez. Önce ilgili yazıları düzenleyin.`,
      }
    }
    await payload.delete({ collection: 'categories', id })
    revalidateTaxonomy([], 'category')
    return { ok: true }
  } catch (error) {
    return { ok: false, error: toMessage(error, 'Kategori silinemedi.') }
  }
}

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export async function createTag(formData: FormData): Promise<ActionResult> {
  if (!(await requireAdmin())) return forbidden

  const parsed = tagCreateSchema.safeParse({
    key: String(formData.get('key') ?? ''),
    tr: localeGroup(formData, 'tr'),
    en: localeGroup(formData, 'en'),
  })
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) }
  const { key, tr, en } = parsed.data

  try {
    const payload = await getPayloadClient()
    const created = await payload.create({
      collection: 'tags',
      locale: 'tr',
      data: { key, title: tr.title, slug: tr.slug },
    })
    await payload.update({
      collection: 'tags',
      id: created.id,
      locale: 'en',
      data: { title: en.title, slug: en.slug },
    })
    revalidateTaxonomy(
      [
        { locale: 'tr', slug: tr.slug },
        { locale: 'en', slug: en.slug },
      ],
      'tag',
    )
    return { ok: true }
  } catch (error) {
    return { ok: false, error: toMessage(error, 'Etiket oluşturulamadı.') }
  }
}

export async function updateTag(id: number, formData: FormData): Promise<ActionResult> {
  if (!(await requireAdmin())) return forbidden

  const parsed = tagUpdateSchema.safeParse({
    tr: localeGroup(formData, 'tr'),
    en: localeGroup(formData, 'en'),
  })
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) }
  const { tr, en } = parsed.data

  try {
    const payload = await getPayloadClient()
    await payload.update({
      collection: 'tags',
      id,
      locale: 'tr',
      data: { title: tr.title, slug: tr.slug },
    })
    await payload.update({
      collection: 'tags',
      id,
      locale: 'en',
      data: { title: en.title, slug: en.slug },
    })
    revalidateTaxonomy(
      [
        { locale: 'tr', slug: tr.slug },
        { locale: 'en', slug: en.slug },
      ],
      'tag',
    )
    return { ok: true }
  } catch (error) {
    return { ok: false, error: toMessage(error, 'Etiket güncellenemedi.') }
  }
}

export async function deleteTag(id: number): Promise<ActionResult> {
  if (!(await requireAdmin())) return forbidden

  try {
    const payload = await getPayloadClient()
    const { totalDocs } = await payload.count({
      collection: 'posts',
      where: { tags: { equals: id } },
    })
    if (totalDocs > 0) {
      return {
        ok: false,
        error: `Bu etiket ${totalDocs} yazıda kullanıldığı için silinemez. Önce ilgili yazıları düzenleyin.`,
      }
    }
    await payload.delete({ collection: 'tags', id })
    revalidateTaxonomy([], 'tag')
    return { ok: true }
  } catch (error) {
    return { ok: false, error: toMessage(error, 'Etiket silinemedi.') }
  }
}

/** Best-effort extraction of a user-safe message from a Payload/unknown error. */
function toMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && /duplicate|unique/i.test(error.message)) {
    return 'Bu anahtar veya slug zaten kullanılıyor.'
  }
  return fallback
}
