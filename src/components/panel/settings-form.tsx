'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { updateSiteSettings } from '@/app/(panel)/panel/(protected)/settings/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface SettingsLocaleValues {
  siteName: string
  tagline: string
  footerText: string
}

export interface SettingsSocialLink {
  label: string
  url: string
}

export interface SettingsFormValues {
  tr: SettingsLocaleValues
  en: SettingsLocaleValues
  socialLinks: SettingsSocialLink[]
}

interface SettingsFormProps {
  initial: SettingsFormValues
}

const LOCALES: { code: 'tr' | 'en'; label: string }[] = [
  { code: 'tr', label: 'Türkçe' },
  { code: 'en', label: 'English' },
]

/** Admin site-settings editor: per-locale text + shared social links. */
export function SettingsForm({ initial }: SettingsFormProps) {
  const router = useRouter()
  const [pending, setPending] = React.useState(false)
  const [links, setLinks] = React.useState<SettingsSocialLink[]>(initial.socialLinks)

  const addLink = () => setLinks((prev) => [...prev, { label: '', url: '' }])
  const removeLink = (index: number) =>
    setLinks((prev) => prev.filter((_, i) => i !== index))
  const updateLink = (index: number, field: keyof SettingsSocialLink, value: string) =>
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)))

  const handle = async (formData: FormData) => {
    setPending(true)
    const res = await updateSiteSettings(formData)
    setPending(false)
    if (res.ok) {
      toast.success('Ayarlar kaydedildi.')
      router.refresh()
    } else {
      toast.error(res.error ?? 'Ayarlar kaydedilemedi.')
    }
  }

  return (
    <form action={handle} className="flex flex-col gap-6">
      <Tabs defaultValue="tr" className="w-full">
        <TabsList>
          {LOCALES.map(({ code, label }) => (
            <TabsTrigger key={code} value={code}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {LOCALES.map(({ code }) => (
          <TabsContent key={code} value={code}>
            <Card>
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${code}.siteName`}>Site adı</Label>
                  <Input
                    id={`${code}.siteName`}
                    name={`${code}.siteName`}
                    defaultValue={initial[code].siteName}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${code}.tagline`}>Slogan</Label>
                  <Input
                    id={`${code}.tagline`}
                    name={`${code}.tagline`}
                    defaultValue={initial[code].tagline}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${code}.footerText`}>Alt bilgi metni</Label>
                  <textarea
                    id={`${code}.footerText`}
                    name={`${code}.footerText`}
                    rows={3}
                    defaultValue={initial[code].footerText}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Sosyal bağlantılar</h2>
            <p className="text-xs text-muted-foreground">
              Tüm diller için ortaktır (dile göre değişmez).
            </p>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={addLink}>
            Bağlantı ekle
          </Button>
        </div>

        {links.length === 0 ? (
          <p className="rounded-md border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">
            Henüz bağlantı eklenmedi.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {links.map((link, index) => (
              <li key={index} className="flex flex-wrap items-end gap-3">
                <div className="flex min-w-[8rem] flex-1 flex-col gap-1.5">
                  <Label htmlFor={`social.label.${index}`}>Etiket</Label>
                  <Input
                    id={`social.label.${index}`}
                    name="social.label"
                    value={link.label}
                    placeholder="ör. Twitter"
                    onChange={(e) => updateLink(index, 'label', e.target.value)}
                  />
                </div>
                <div className="flex min-w-[12rem] flex-[2] flex-col gap-1.5">
                  <Label htmlFor={`social.url.${index}`}>URL</Label>
                  <Input
                    id={`social.url.${index}`}
                    name="social.url"
                    value={link.url}
                    placeholder="https://…"
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeLink(index)}
                >
                  Kaldır
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <Button type="submit" disabled={pending}>
          {pending ? 'Kaydediliyor…' : 'Kaydet'}
        </Button>
      </div>
    </form>
  )
}
