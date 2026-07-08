'use client'

import { FileText, LayoutDashboard, Settings, Tags } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: readonly NavItem[] = [
  { href: '/panel', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/panel/posts', label: 'Yazılar', icon: FileText },
  { href: '/panel/taxonomy', label: 'Taksonomi', icon: Tags },
  { href: '/panel/settings', label: 'Ayarlar', icon: Settings },
]

/** Left navigation for the admin panel with active-route highlighting. */
export function PanelSidebar() {
  const pathname = usePathname()

  const isActive = (href: string): boolean =>
    href === '/panel' ? pathname === '/panel' : pathname.startsWith(href)

  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="Panel navigasyonu">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(href) ? 'page' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive(href)
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
