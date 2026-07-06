'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Locale } from '@/i18n/config'
import type { Category } from '@/payload-types'
import { routes } from '@/lib/routes'

interface CategoriesNavProps {
  categories: Category[]
  locale: Locale
  label: string
}

/** Desktop "Categories" dropdown in the header. */
export function CategoriesNav({ categories, locale, label }: CategoriesNavProps) {
  if (categories.length === 0) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {label}
        <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
        {categories.map((category) => (
          <DropdownMenuItem key={category.id} asChild>
            <Link href={routes.category(locale, category.slug)}>{category.title}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
