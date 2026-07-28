import type { Payload } from 'payload'

import type { MarkdownConverter } from './lexical'
import type { ArticleGroup } from './loader'
import type { SeedManifest, SeedManifestEntry } from './manifest'
import type { SeededTaxonomy } from './taxonomy'
import { upsertArticle } from './upsert'

export interface SeedArticlesOptions {
  /** Previously recorded fingerprints, keyed by translationKey. */
  readonly manifest: SeedManifest
  /** Ignore the manifest and rewrite every group (schema changes, repairs). */
  readonly force: boolean
  /** Injectable clock so tests get deterministic `seededAt` values. */
  readonly now?: () => string
}

export interface SeedArticlesSummary {
  /** Manifest to persist: one entry per group currently on disk. */
  readonly manifest: SeedManifest
  readonly upserted: number
  readonly skipped: number
}

/**
 * Upsert every article group whose content hash differs from the manifest.
 *
 * The returned manifest is rebuilt from the groups on disk, so entries for
 * deleted articles are pruned automatically; skipped groups keep their original
 * `seededAt` because nothing was written for them.
 */
export const seedArticles = async (
  payload: Payload,
  convert: MarkdownConverter,
  groups: readonly ArticleGroup[],
  taxonomy: SeededTaxonomy,
  options: SeedArticlesOptions,
): Promise<SeedArticlesSummary> => {
  const now = options.now ?? (() => new Date().toISOString())
  const entries: [string, SeedManifestEntry][] = []
  let upserted = 0
  let skipped = 0

  for (const group of groups) {
    const previous = options.manifest[group.translationKey]

    if (!options.force && previous && previous.hash === group.contentHash) {
      skipped += 1
      entries.push([group.translationKey, previous])
      payload.logger.info(`seed: skipped (unchanged) "${group.translationKey}"`)
      continue
    }

    await upsertArticle(payload, convert, group, taxonomy)
    upserted += 1
    entries.push([group.translationKey, { hash: group.contentHash, seededAt: now() }])
    payload.logger.info(`seed: upserted "${group.translationKey}"`)
  }

  return { manifest: Object.fromEntries(entries), upserted, skipped }
}
