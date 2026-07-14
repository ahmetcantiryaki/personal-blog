import { Sparkles } from 'lucide-react'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'

interface AiTransparencyBadgeProps {
  locale: Locale
  className?: string
}

const LABEL: Record<Locale, string> = {
  tr: 'AI destekli üretim · İnsan gözetiminde',
  en: 'AI-assisted · Human-supervised',
}

export function AiTransparencyBadge({ locale, className }: AiTransparencyBadgeProps) {
  return (
    <Link
      href={`/${locale}/transparency`}
      className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground ${className ?? ''}`}
    >
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{LABEL[locale]}</span>
    </Link>
  )
}
