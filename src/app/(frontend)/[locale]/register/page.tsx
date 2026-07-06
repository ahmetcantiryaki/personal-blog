import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { AuthCard } from '@/components/auth/auth-card'
import { RegisterForm } from '@/components/auth/register-form'
import { getDictionary } from '@/i18n'
import { isLocale, LOCALES, type Locale } from '@/i18n/config'
import { getCurrentUser } from '@/lib/auth'
import { buildPageMetadata } from '@/lib/seo'
import { routes } from '@/lib/routes'

export const dynamic = 'force-dynamic'

interface RegisterPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ returnTo?: string }>
}

export async function generateMetadata({ params }: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return buildPageMetadata({
    locale,
    title: dict.auth.registerTitle,
    description: dict.auth.registerSubtitle,
    paths: Object.fromEntries(LOCALES.map((l) => [l, routes.register(l)])) as Record<
      Locale,
      string
    >,
    noindex: true,
  })
}

const safeReturnTo = (value?: string): string | undefined =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : undefined

export default async function RegisterPage({ params, searchParams }: RegisterPageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const returnTo = safeReturnTo((await searchParams).returnTo)
  const user = await getCurrentUser()
  if (user) redirect(returnTo || routes.home(locale as Locale))

  const dict = getDictionary(locale as Locale)

  return (
    <AuthCard
      title={dict.auth.registerTitle}
      subtitle={dict.auth.registerSubtitle}
      footerPrompt={dict.auth.haveAccount}
      footerLinkLabel={dict.auth.signIn}
      footerHref={routes.login(locale as Locale, returnTo)}
    >
      <RegisterForm locale={locale as Locale} dict={dict} returnTo={returnTo} />
    </AuthCard>
  )
}
