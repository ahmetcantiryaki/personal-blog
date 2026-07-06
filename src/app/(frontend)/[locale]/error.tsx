'use client'

import Link from 'next/link'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { getDictionary } from '@/i18n'
import { DEFAULT_LOCALE } from '@/i18n/config'
import { routes } from '@/lib/routes'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/** Localized route error boundary (client). Uses default-locale strings. */
export default function Error({ error, reset }: ErrorProps) {
  const dict = getDictionary(DEFAULT_LOCALE)

  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{dict.error.genericTitle}</h1>
      <p className="mt-2 text-muted-foreground">{dict.error.genericBody}</p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>{dict.error.retry}</Button>
        <Button asChild variant="secondary">
          <Link href={routes.home(DEFAULT_LOCALE)}>{dict.error.goHome}</Link>
        </Button>
      </div>
    </div>
  )
}
