import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { getDictionary } from '@/i18n'
import { DEFAULT_LOCALE } from '@/i18n/config'
import { routes } from '@/lib/routes'

/**
 * Localized 404. `not-found.tsx` does not receive route params, so it uses the
 * default locale's strings and links to the default-locale home.
 */
export default function NotFound() {
  const dict = getDictionary(DEFAULT_LOCALE)
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-6xl font-semibold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">{dict.error.notFoundTitle}</h1>
      <p className="mt-2 text-muted-foreground">{dict.error.notFoundBody}</p>
      <Button asChild className="mt-8">
        <Link href={routes.home(DEFAULT_LOCALE)}>{dict.error.goHome}</Link>
      </Button>
    </div>
  )
}
