import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { AuthCard } from '@/components/auth/auth-card'
import { LoginForm } from '@/components/auth/login-form'
import { getDictionary } from '@/i18n'
import { isLocale, type Locale } from '@/i18n/config'
import { getCurrentUser } from '@/lib/auth'
import { routes } from '@/lib/routes'

export const dynamic = 'force-dynamic'

interface LoginPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ returnTo?: string }>
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { title: getDictionary(locale).auth.loginTitle }
}

/** Only accept same-origin relative return paths to avoid open redirects. */
const safeReturnTo = (value?: string): string | undefined =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : undefined

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const returnTo = safeReturnTo((await searchParams).returnTo)
  const user = await getCurrentUser()
  if (user) redirect(returnTo || routes.home(locale as Locale))

  const dict = getDictionary(locale as Locale)

  return (
    <AuthCard
      title={dict.auth.loginTitle}
      subtitle={dict.auth.loginSubtitle}
      footerPrompt={dict.auth.noAccount}
      footerLinkLabel={dict.auth.signUp}
      footerHref={routes.register(locale as Locale, returnTo)}
    >
      <LoginForm locale={locale as Locale} dict={dict} returnTo={returnTo} />
    </AuthCard>
  )
}
