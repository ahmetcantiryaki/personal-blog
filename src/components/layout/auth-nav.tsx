'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { routes } from '@/lib/routes'
import { useCurrentUser } from '@/lib/use-current-user'

import { UserMenu } from './user-menu'

interface AuthNavProps {
  locale: Locale
  dict: Dictionary
}

/** Desktop header auth widget: sign-in button or avatar menu (client-resolved). */
export function AuthNav({ locale, dict }: AuthNavProps) {
  const { user, loading } = useCurrentUser()

  if (loading) {
    return <Skeleton className="size-9 rounded-full" />
  }

  if (user) {
    return <UserMenu name={user.name} email={user.email} locale={locale} dict={dict} />
  }

  return (
    <Button asChild size="sm" variant="secondary">
      <Link href={routes.login(locale)}>{dict.auth.signIn}</Link>
    </Button>
  )
}
