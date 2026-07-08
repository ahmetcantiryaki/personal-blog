import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PostMetadataForm } from '@/components/panel/post-metadata-form'
import { getPayloadClient } from '@/lib/payload'
import {
  toDateInputValue,
  type CoverStyleValue,
  type PostStatusValue,
} from '@/lib/panel/post-schema'

export const dynamic = 'force-dynamic'

interface PostEditPageProps {
  params: Promise<{ id: string }>
}

type LocalizedRecord = Record<string, string | null | undefined>

function relationId(value: unknown): number | null {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

function localeExcerpt(excerpt: unknown, locale: string): string {
  return ((excerpt ?? {}) as LocalizedRecord)[locale] ?? ''
}

function localeSeo(seo: unknown, locale: string): { seoTitle: string; seoDescription: string } {
  const record = ((seo ?? {}) as Record<string, LocalizedRecord | undefined>)[locale] ?? {}
  return { seoTitle: record.seoTitle ?? '', seoDescription: record.seoDescription ?? '' }
}

/** Metadata editor for a single post. Loads current values in both locales. */
export default async function PostEditPage({ params }: PostEditPageProps) {
  const { id: rawId } = await params
  const id = Number.parseInt(rawId, 10)
  if (Number.isNaN(id)) notFound()

  const payload = await getPayloadClient()

  const post = await payload
    .findByID({ collection: 'posts', id, locale: 'all', depth: 0, overrideAccess: true })
    .catch(() => null)
  if (!post) notFound()

  const [categoriesResult, tagsResult] = await Promise.all([
    payload.find({ collection: 'categories', locale: 'tr', overrideAccess: true, limit: 200, sort: 'title', depth: 0 }),
    payload.find({ collection: 'tags', locale: 'tr', overrideAccess: true, limit: 500, sort: 'title', depth: 0 }),
  ])

  const slug = post.slug as unknown as LocalizedRecord
  const title = post.title as unknown as LocalizedRecord

  const initial = {
    status: post.status as PostStatusValue,
    publishedAt: toDateInputValue(post.publishedAt ?? null),
    coverStyle: post.coverStyle as CoverStyleValue,
    coverImage: post.coverImage ?? '',
    category: relationId(post.category),
    tags: Array.isArray(post.tags)
      ? post.tags.map(relationId).filter((v): v is number => v !== null)
      : [],
    tr: { excerpt: localeExcerpt(post.excerpt, 'tr'), ...localeSeo(post.seo, 'tr') },
    en: { excerpt: localeExcerpt(post.excerpt, 'en'), ...localeSeo(post.seo, 'en') },
  }

  const readOnly = {
    translationKey: post.translationKey,
    readingTime: post.readingTime ?? null,
    slugTr: slug.tr ?? '',
    slugEn: slug.en ?? '',
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link
          href="/panel/posts"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Yazılara dön
        </Link>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          {title.tr || title.en || 'Yazıyı düzenle'}
        </h1>
      </div>

      <PostMetadataForm
        postId={id}
        previewTitle={title.tr || title.en || ''}
        previewSeed={slug.tr || slug.en || String(id)}
        initial={initial}
        readOnly={readOnly}
        categories={categoriesResult.docs.map((c) => ({ id: c.id, title: c.title }))}
        tags={tagsResult.docs.map((t) => ({ id: t.id, title: t.title }))}
      />
    </div>
  )
}
