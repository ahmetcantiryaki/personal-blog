'use client'

import { Menu, Search } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { CreatorCard } from '@/components/layout/creator-card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { Category } from '@/payload-types'
import { routes } from '@/lib/routes'
import { useCurrentUser } from '@/lib/use-current-user'

interface MobileNavProps {
  locale: Locale
  dict: Dictionary
  categories: Category[]
}

const linkCls =
  'block rounded-md px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground'
const subLinkCls =
  'block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground'

/** Hamburger → slide-in navigation for small screens. */
export function MobileNav({ locale, dict, categories }: MobileNavProps) {
  const [open, setOpen] = React.useState(false)
  const { user } = useCurrentUser()
  const isLoggedIn = Boolean(user)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={dict.nav.openMenu} className="md:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" closeLabel={dict.nav.closeMenu}>
        <SheetTitle className="font-serif text-lg font-semibold tracking-tight">
          {dict.siteName}
        </SheetTitle>

        <nav className="mt-2 flex flex-col gap-1" aria-label={dict.nav.menu}>
          <SheetClose asChild>
            <Link href={routes.home(locale)} className={linkCls} onClick={close}>
              {dict.nav.home}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href={routes.about(locale)} className={linkCls} onClick={close}>
              {dict.nav.about}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href={routes.search(locale)} className={linkCls} onClick={close}>
              <span className="inline-flex items-center gap-2">
                <Search className="size-4" />
                {dict.nav.search}
              </span>
            </Link>
          </SheetClose>
        </nav>

        {categories.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {dict.nav.categories}
              </p>
              <div className="flex flex-col gap-0.5">
                {categories.map((category) => (
                  <SheetClose asChild key={category.id}>
                    <Link
                      href={routes.category(locale, category.slug)}
                      className={subLinkCls}
                      onClick={close}
                    >
                      {category.title}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />
        <div className="flex flex-col gap-2">
          {isLoggedIn ? (
            <SheetClose asChild>
              <Button asChild variant="secondary">
                <Link href={routes.profile(locale)} onClick={close}>
                  {dict.auth.profile}
                </Link>
              </Button>
            </SheetClose>
          ) : (
            <>
              <SheetClose asChild>
                <Button asChild variant="secondary">
                  <Link href={routes.login(locale)} onClick={close}>
                    {dict.auth.signIn}
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild>
                  <Link href={routes.register(locale)} onClick={close}>
                    {dict.auth.signUp}
                  </Link>
                </Button>
              </SheetClose>
            </>
          )}
        </div>

        <Separator />
        <CreatorCard label={dict.footer.createdBy} />
      </SheetContent>
    </Sheet>
  )
}
