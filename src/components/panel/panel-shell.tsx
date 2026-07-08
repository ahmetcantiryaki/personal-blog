import Link from 'next/link'
import React from 'react'

import { PanelLogoutButton } from '@/components/panel/panel-logout-button'
import { PanelSidebar } from '@/components/panel/panel-sidebar'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { User } from '@/payload-types'

interface PanelShellProps {
  user: User
  children: React.ReactNode
}

const THEME_LABELS = {
  light: 'Açık',
  dark: 'Koyu',
  system: 'Sistem',
  toggle: 'Temayı değiştir',
} as const

const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || 'U'

/** Chrome for the admin panel: fixed sidebar + top header, warm-stone look. */
export function PanelShell({ user, children }: PanelShellProps) {
  return (
    <div className="flex min-h-dvh">
      <aside className="hidden w-60 shrink-0 border-r border-border/70 bg-card md:flex md:flex-col">
        <div className="flex h-16 items-center px-5">
          <Link href="/panel" className="font-serif text-lg font-semibold tracking-tight">
            Woyable
          </Link>
        </div>
        <PanelSidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border/70 px-5">
          <span className="font-serif text-base font-medium md:hidden">Woyable</span>
          <div className="flex flex-1 items-center justify-end gap-2">
            <ThemeToggle labels={THEME_LABELS} />
            <PanelLogoutButton />
            <div className="flex items-center gap-2 pl-1">
              <Avatar>
                <AvatarFallback>{initials(user.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
