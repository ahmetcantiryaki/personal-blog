import { readdir, readFile } from 'fs/promises'
import path from 'path'

import matter from 'gray-matter'

import { LOCALES, parseArticle, type ParsedArticle, type SeedLocale } from './frontmatter'
import { hashArticleSources } from './manifest'

export interface ArticleGroup {
  translationKey: string
  byLocale: Partial<Record<SeedLocale, ParsedArticle>>
  /**
   * Fingerprint of the group's raw markdown files (front-matter included), used
   * by the incremental seed to skip untouched articles. See ./manifest.ts.
   */
  contentHash: string
}

interface LoadedFile {
  article: ParsedArticle
  raw: string
}

const readLocaleDir = async (contentDir: string, locale: SeedLocale): Promise<LoadedFile[]> => {
  const dir = path.join(contentDir, locale)

  let entries: string[]
  try {
    entries = (await readdir(dir)).filter((f) => f.endsWith('.md'))
  } catch {
    return [] // locale dir may not exist yet — that's fine for a skeleton
  }

  const files = await Promise.all(
    entries.map(async (file) => {
      const raw = await readFile(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      return { article: parseArticle(locale, data, content), raw }
    }),
  )

  return files
}

/**
 * Load every markdown article under `contentDir/{tr,en}`, group the locale
 * variants by their shared `translationKey` and fingerprint each group.
 *
 * The hash covers the raw file bytes of every locale in a fixed locale order, so
 * it is stable across runs and changes whenever anything that feeds the upsert
 * (body *or* front-matter) changes.
 */
export const loadArticleGroups = async (contentDir: string): Promise<ArticleGroup[]> => {
  const perLocale = await Promise.all(LOCALES.map((locale) => readLocaleDir(contentDir, locale)))

  const byKey = new Map<string, Partial<Record<SeedLocale, LoadedFile>>>()
  for (const files of perLocale) {
    for (const file of files) {
      const key = file.article.frontMatter.translationKey
      byKey.set(key, { ...byKey.get(key), [file.article.locale]: file })
    }
  }

  return Array.from(byKey.entries()).map(([translationKey, files]) => {
    const present = LOCALES.flatMap((locale) => {
      const file = files[locale]
      return file ? [{ locale, file }] : []
    })

    return {
      translationKey,
      byLocale: Object.fromEntries(present.map(({ locale, file }) => [locale, file.article])),
      contentHash: hashArticleSources(
        present.map(({ locale, file }) => ({ locale, raw: file.raw })),
      ),
    }
  })
}
