import Link from 'next/link'
import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
  footerPrompt: string
  footerLinkLabel: string
  footerHref: string
}

/** Centered card shell shared by the login and register pages. */
export function AuthCard({
  title,
  subtitle,
  children,
  footerPrompt,
  footerLinkLabel,
  footerHref,
}: AuthCardProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14">
      <div className="rounded-xl border border-border/70 bg-card p-7 shadow-sm sm:p-8">
        <div className="mb-6 space-y-1.5">
          <h1 className="font-serif text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {footerPrompt}{' '}
        <Link href={footerHref} className="font-medium text-primary hover:underline">
          {footerLinkLabel}
        </Link>
      </p>
    </div>
  )
}
