import { readdir, readFile } from 'fs/promises'
import path from 'path'

import matter from 'gray-matter'

import { LOCALES, parseArticle, type ParsedArticle, type SeedLocale } from './frontmatter'

export interface ArticleGroup {
  translationKey: string
  byLocale: Partial<Record<SeedLocale, ParsedArticle>>
}

const readLocaleDir = async (contentDir: string, locale: SeedLocale): Promise<ParsedArticle[]> => {
  const dir = path.join(contentDir, locale)

  let entries: string[]
  try {
    entries = (await readdir(dir)).filter((f) => f.endsWith('.md'))
  } catch {
    return [] // locale dir may not exist yet — that's fine for a skeleton
  }

  const articles = await Promise.all(
    entries.map(async (file) => {
      const raw = await readFile(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      return parseArticle(locale, data, content)
    }),
  )

  return articles
}

/**
 * Load every markdown article under `contentDir/{tr,en}` and group the locale
 * variants by their shared `translationKey`.
 */
export const loadArticleGroups = async (contentDir: string): Promise<ArticleGroup[]> => {
  const perLocale = await Promise.all(LOCALES.map((locale) => readLocaleDir(contentDir, locale)))

  const groups = new Map<string, ArticleGroup>()
  for (const articles of perLocale) {
    for (const article of articles) {
      const key = article.frontMatter.translationKey
      const group = groups.get(key) ?? { translationKey: key, byLocale: {} }
      group.byLocale[article.locale] = article
      groups.set(key, group)
    }
  }

  return Array.from(groups.values())
}
