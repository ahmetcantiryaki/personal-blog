'use client'

import { LogOut, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { routes } from '@/lib/routes'

interface UserMenuProps {
  name: string
  email: string
  locale: Locale
  dict: Dictionary
}

const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || 'U'

/** Signed-in avatar menu: profile link + sign out. */
export function UserMenu({ name, email, locale, dict }: UserMenuProps) {
  const router = useRouter()
  const [pending, setPending] = React.useState(false)

  const logout = React.useCallback(async () => {
    if (pending) return
    setPending(true)
    try {
      await fetch('/api/users/logout', { method: 'POST' })
      router.push(routes.home(locale))
      router.refresh()
    } catch {
      toast.error(dict.auth.genericError)
      setPending(false)
    }
  }, [dict.auth.genericError, locale, pending, router])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={dict.auth.account}
        >
          <Avatar>
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span>{name}</span>
          <span className="text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={routes.profile(locale)}>
            <UserIcon />
            {dict.auth.profile}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} disabled={pending}>
          <LogOut />
          {dict.auth.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
