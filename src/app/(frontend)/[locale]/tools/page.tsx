import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AiToolPicker } from '@/components/tools/ai-tool-picker'
import { isLocale, LOCALES, type Locale } from '@/i18n/config'
import { buildPageMetadata } from '@/lib/seo'
import { routes } from '@/lib/routes'

export const revalidate = 300

interface ToolsPageProps {
  params: Promise<{ locale: string }>
}

const PAGE_COPY: Record<Locale, { title: string; description: string }> = {
  tr: {
    title: 'AI Araç Seçici',
    description:
      '4 kısa soruya cevap ver, ihtiyacına en uygun yapay zeka aracını birlikte bulalım.',
  },
  en: {
    title: 'AI Tool Picker',
    description: 'Answer 4 quick questions and find the AI tool that fits your needs.',
  },
}

export async function generateMetadata({ params }: ToolsPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const copy = PAGE_COPY[locale]
  return buildPageMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    paths: Object.fromEntries(LOCALES.map((l) => [l, routes.tools(l)])) as Record<Locale, string>,
    type: 'website',
  })
}

export default async function ToolsPage({ params }: ToolsPageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const copy = PAGE_COPY[locale as Locale]

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {copy.title}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.description}
        </h1>
      </header>

      <AiToolPicker locale={locale as Locale} />
    </div>
  )
}
