import { z } from 'zod'

/**
 * Zod schema for the admin site-settings form. Pure (no server-only/Payload
 * imports) so it is shared by the client form + server action and unit-testable.
 */

const optionalText = (max: number, label: string) =>
  z.string().trim().max(max, `${label} en fazla ${max} karakter olabilir.`).optional().default('')

export const socialLinkSchema = z.object({
  label: z.string().trim().min(1, 'Etiket gerekli.').max(60, 'Etiket en fazla 60 karakter olabilir.'),
  url: z
    .string()
    .trim()
    .min(1, 'URL gerekli.')
    .url('Geçerli bir URL girin.')
    .max(300, 'URL en fazla 300 karakter olabilir.'),
})

export const siteSettingsLocaleSchema = z.object({
  siteName: optionalText(120, 'Site adı'),
  tagline: optionalText(200, 'Slogan'),
  footerText: optionalText(500, 'Alt bilgi metni'),
})

/**
 * Full form payload: per-locale text fields plus the shared (non-localized)
 * social links array.
 */
export const siteSettingsSchema = z.object({
  tr: siteSettingsLocaleSchema,
  en: siteSettingsLocaleSchema,
  socialLinks: z.array(socialLinkSchema).max(20, 'En fazla 20 sosyal bağlantı ekleyebilirsiniz.'),
})

export type SocialLinkInput = z.infer<typeof socialLinkSchema>
export type SiteSettingsLocaleInput = z.infer<typeof siteSettingsLocaleSchema>
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>
