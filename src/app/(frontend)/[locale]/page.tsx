import config from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

const LOCALES = ['tr', 'en'] as const
type Locale = (typeof LOCALES)[number]

const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value)

export function generateStaticParams(): { locale: Locale }[] {
  return LOCALES.map((locale) => ({ locale }))
}

interface PageProps {
  params: Promise<{ locale: string }>
}

/**
 * Phase 1 placeholder home page. Lists published post titles for the locale via
 * the Payload Local API to prove end-to-end data flow. The frontend team
 * replaces this with the real design.
 */
export default async function LocaleHome({ params }: PageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    locale,
    depth: 0,
    limit: 50,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui' }}>
      <h1>Woyable Blog</h1>
      <p>Locale: {locale}</p>
      {docs.length === 0 ? (
        <p>No published posts yet.</p>
      ) : (
        <ul>
          {docs.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </main>
  )
}
