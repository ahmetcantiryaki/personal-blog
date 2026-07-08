import { SettingsForm, type SettingsFormValues } from '@/components/panel/settings-form'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

/** Load the siteSettings global in both locales for the admin editor. */
async function loadSettings(): Promise<SettingsFormValues> {
  const payload = await getPayloadClient()
  const [tr, en] = await Promise.all([
    payload.findGlobal({ slug: 'siteSettings', locale: 'tr', depth: 0 }),
    payload.findGlobal({ slug: 'siteSettings', locale: 'en', depth: 0 }),
  ])

  const socialLinks = Array.isArray(tr.socialLinks)
    ? tr.socialLinks.map((l) => ({ label: l.label ?? '', url: l.url ?? '' }))
    : []

  return {
    tr: {
      siteName: tr.siteName ?? '',
      tagline: tr.tagline ?? '',
      footerText: tr.footerText ?? '',
    },
    en: {
      siteName: en.siteName ?? '',
      tagline: en.tagline ?? '',
      footerText: en.footerText ?? '',
    },
    socialLinks,
  }
}

export default async function SettingsPage() {
  const initial = await loadSettings()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Ayarlar</h1>
        <p className="text-muted-foreground">Site adı, slogan, alt bilgi ve sosyal bağlantılar.</p>
      </div>
      <SettingsForm initial={initial} />
    </div>
  )
}
