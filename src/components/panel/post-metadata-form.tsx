'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { updatePostMetadata } from '@/app/(panel)/panel/(protected)/posts/[id]/actions'
import { CoverArt } from '@/components/blog/cover-art'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { COVER_STYLE_VALUES, type CoverStyleValue, type PostStatusValue } from '@/lib/panel/post-schema'
import { cn } from '@/lib/utils'

interface Option {
  id: number
  title: string
}

interface LocalizedFields {
  excerpt: string
  seoTitle: string
  seoDescription: string
}

interface PostMetadataFormProps {
  postId: number
  previewTitle: string
  previewSeed: string
  initial: {
    status: PostStatusValue
    publishedAt: string
    coverStyle: CoverStyleValue
    coverImage: string
    category: number | null
    tags: number[]
    tr: LocalizedFields
    en: LocalizedFields
  }
  readOnly: {
    translationKey: string
    readingTime: number | null
    slugTr: string
    slugEn: string
  }
  categories: Option[]
  tags: Option[]
}

const STATUS_OPTIONS: { value: PostStatusValue; label: string }[] = [
  { value: 'draft', label: 'Taslak' },
  { value: 'published', label: 'Yayında' },
]

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50'

const textareaClass =
  'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function PostMetadataForm({
  postId,
  previewTitle,
  previewSeed,
  initial,
  readOnly,
  categories,
  tags,
}: PostMetadataFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [status, setStatus] = useState(initial.status)
  const [publishedAt, setPublishedAt] = useState(initial.publishedAt)
  const [coverStyle, setCoverStyle] = useState(initial.coverStyle)
  const [coverImage, setCoverImage] = useState(initial.coverImage)
  const [category, setCategory] = useState<number | null>(initial.category)
  const [selectedTags, setSelectedTags] = useState<number[]>(initial.tags)
  const [tr, setTr] = useState<LocalizedFields>(initial.tr)
  const [en, setEn] = useState<LocalizedFields>(initial.en)

  const updateLocale = (
    locale: 'tr' | 'en',
    field: keyof LocalizedFields,
    value: string,
  ): void => {
    const setter = locale === 'tr' ? setTr : setEn
    setter((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    startTransition(async () => {
      const result = await updatePostMetadata(postId, {
        status,
        publishedAt,
        coverStyle,
        coverImage,
        category,
        tags: selectedTags,
        tr,
        en,
      })
      if (result.ok) {
        toast.success('Yazı güncellendi.')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="tr">
          <TabsList>
            <TabsTrigger value="tr">Türkçe</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
          </TabsList>

          {(['tr', 'en'] as const).map((locale) => {
            const values = locale === 'tr' ? tr : en
            return (
              <TabsContent key={locale} value={locale} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`excerpt-${locale}`}>Özet</Label>
                  <textarea
                    id={`excerpt-${locale}`}
                    className={textareaClass}
                    value={values.excerpt}
                    onChange={(e) => updateLocale(locale, 'excerpt', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`seoTitle-${locale}`}>SEO Başlığı</Label>
                  <Input
                    id={`seoTitle-${locale}`}
                    value={values.seoTitle}
                    onChange={(e) => updateLocale(locale, 'seoTitle', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`seoDescription-${locale}`}>SEO Açıklaması</Label>
                  <textarea
                    id={`seoDescription-${locale}`}
                    className={textareaClass}
                    value={values.seoDescription}
                    onChange={(e) => updateLocale(locale, 'seoDescription', e.target.value)}
                  />
                </div>
              </TabsContent>
            )
          })}
        </Tabs>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Kategori</Label>
          <select
            id="category"
            className={selectClass}
            value={category ?? ''}
            onChange={(e) => setCategory(e.target.value === '' ? null : Number(e.target.value))}
          >
            <option value="">— Yok —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tags">Etiketler</Label>
          <select
            id="tags"
            multiple
            className={cn(selectClass, 'h-auto min-h-[120px]')}
            value={selectedTags.map(String)}
            onChange={(e) =>
              setSelectedTags(Array.from(e.target.selectedOptions, (o) => Number(o.value)))
            }
          >
            {tags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Birden fazla seçmek için Ctrl (Cmd) tuşunu basılı tutun.
          </p>
        </div>
      </div>

      <aside className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label>Kapak önizleme</Label>
          <div className="aspect-video overflow-hidden rounded-lg border border-border/70">
            <CoverArt style={coverStyle} title={previewTitle} seed={previewSeed} variant="card" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="coverStyle">Kapak stili</Label>
          <select
            id="coverStyle"
            className={selectClass}
            value={coverStyle}
            onChange={(e) => setCoverStyle(e.target.value as CoverStyleValue)}
          >
            {COVER_STYLE_VALUES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="coverImage">Kapak görseli (yol)</Label>
          <Input
            id="coverImage"
            value={coverImage}
            placeholder="/covers/ornek.jpg"
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Durum</Label>
          <select
            id="status"
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as PostStatusValue)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="publishedAt">Yayın tarihi</Label>
          <Input
            id="publishedAt"
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </div>

        <dl className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/30 p-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Çeviri anahtarı</dt>
            <dd className="truncate font-mono text-xs">{readOnly.translationKey}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Okuma süresi</dt>
            <dd>{readOnly.readingTime ? `${readOnly.readingTime} dk` : '—'}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Slug (TR)</dt>
            <dd className="truncate font-mono text-xs">{readOnly.slugTr || '—'}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Slug (EN)</dt>
            <dd className="truncate font-mono text-xs">{readOnly.slugEn || '—'}</dd>
          </div>
        </dl>

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Kaydediliyor…' : 'Kaydet'}
        </Button>
      </aside>
    </form>
  )
}
