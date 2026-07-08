'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { savePostContent } from '@/app/(panel)/panel/(protected)/posts/[id]/content-actions'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Locale } from '@/i18n/config'

interface LocaleContent {
  slug: string
  markdown: string
  sha: string | null
  /** True when no source file was found for this locale. */
  missing: boolean
}

interface LocalePanelContent extends LocaleContent {
  locale: Locale
}

interface PostContentEditorProps {
  tr: LocaleContent
  en: LocaleContent
}

const textareaClass =
  'w-full min-h-[400px] h-[70vh] rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-relaxed shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50'

function LocalePanel({ initial }: { initial: LocalePanelContent }) {
  const [isPending, startTransition] = useTransition()
  const [markdown, setMarkdown] = useState(initial.markdown)
  const [sha, setSha] = useState<string | null>(initial.sha)

  const dirty = markdown !== initial.markdown
  const localeLabel = initial.slug

  const handleSave = (): void => {
    startTransition(async () => {
      const result = await savePostContent({
        locale: initial.locale,
        slug: initial.slug,
        markdown,
        sha: sha ?? undefined,
      })
      if (result.ok) {
        // A fresh commit invalidates the previous sha; force a page refresh next
        // load. We clear sha so a subsequent save re-reads (github path) — the
        // simplest correct behaviour without a round-trip.
        setSha(null)
        toast.success(
          result.source === 'github'
            ? 'Commit atıldı — site ~10-20 dk içinde deploy ile güncellenir.'
            : 'Dosya kaydedildi (lokal) — commit/push etmeyi unutma.',
        )
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {initial.missing ? (
        <div className="rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
          Bu dil için kaynak markdown dosyası bulunamadı ({localeLabel || 'slug yok'}).
          Kaydedersen yeni bir dosya oluşturulur.
        </div>
      ) : null}

      <div className="rounded-md border border-border/70 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        Front-matter alanlarını (---) dikkatli düzenle; slug/translationKey değiştirme.
      </div>

      <textarea
        className={textareaClass}
        value={markdown}
        spellCheck={false}
        onChange={(e) => setMarkdown(e.target.value)}
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {markdown.length.toLocaleString('tr-TR')} karakter
          {dirty ? <span className="ml-2 text-amber-600 dark:text-amber-400">• kaydedilmemiş değişiklik</span> : null}
        </p>
        <Button type="button" onClick={handleSave} disabled={isPending || !dirty}>
          {isPending ? 'Kaydediliyor…' : 'Kaydet'}
        </Button>
      </div>
    </div>
  )
}

export function PostContentEditor({ tr, en }: PostContentEditorProps) {
  const panels: Record<Locale, LocalePanelContent> = {
    tr: { ...tr, locale: 'tr' },
    en: { ...en, locale: 'en' },
  }

  return (
    <Tabs defaultValue="tr">
      <TabsList>
        <TabsTrigger value="tr">Türkçe</TabsTrigger>
        <TabsTrigger value="en">English</TabsTrigger>
      </TabsList>
      {(['tr', 'en'] as const).map((locale) => (
        <TabsContent key={locale} value={locale}>
          <LocalePanel initial={panels[locale]} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
