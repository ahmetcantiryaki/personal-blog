import type { ComponentType } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  /** Turkish label, e.g. "Toplam Yazı". */
  label: string
  /** Primary figure to display. */
  value: number | string
  /** Optional secondary line, e.g. "12 yayında · 3 taslak". */
  hint?: string
  icon: ComponentType<{ className?: string }>
  className?: string
}

/** Formats a number with Turkish thousands separators; passes strings through. */
function formatValue(value: number | string): string {
  return typeof value === 'number' ? value.toLocaleString('tr-TR') : value
}

/**
 * Compact metric tile for the admin dashboard. Warm-stone surface matching the
 * panel aesthetic, with a muted icon chip and an optional breakdown hint.
 */
export function StatCard({ label, value, hint, icon: Icon, className }: StatCardProps) {
  return (
    <Card className={cn('bg-card/60', className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <span className="font-serif text-3xl font-semibold tracking-tight tabular-nums">
            {formatValue(value)}
          </span>
          {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}
