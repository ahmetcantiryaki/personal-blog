import type { Payload } from 'payload'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { seedArticles } from '@/seed/articles'
import type { MarkdownConverter } from '@/seed/lexical'
import type { ArticleGroup } from '@/seed/loader'
import type { SeedManifest } from '@/seed/manifest'
import type { SeededTaxonomy } from '@/seed/taxonomy'
import { upsertArticle } from '@/seed/upsert'

vi.mock('@/seed/upsert', () => ({ upsertArticle: vi.fn(async () => {}) }))

const upsertMock = vi.mocked(upsertArticle)

const logs: string[] = []
const payload = {
  logger: {
    info: (m: string) => logs.push(m),
    warn: (m: string) => logs.push(m),
  },
} as unknown as Payload

const convert = (() => ({})) as unknown as MarkdownConverter
const taxonomy: SeededTaxonomy = { categoryIds: new Map(), tagIds: new Map() }

const group = (translationKey: string, contentHash: string): ArticleGroup => ({
  translationKey,
  byLocale: {},
  contentHash,
})

const NOW = '2026-07-28T00:00:00.000Z'
const options = (manifest: SeedManifest, force = false) => ({
  manifest,
  force,
  now: () => NOW,
})

beforeEach(() => {
  upsertMock.mockClear()
  logs.length = 0
})

describe('seedArticles', () => {
  it('skips a group whose hash is unchanged', async () => {
    const manifest: SeedManifest = { a: { hash: 'h1', seededAt: 'earlier' } }

    const summary = await seedArticles(
      payload,
      convert,
      [group('a', 'h1')],
      taxonomy,
      options(manifest),
    )

    expect(upsertMock).not.toHaveBeenCalled()
    expect(summary).toMatchObject({ upserted: 0, skipped: 1 })
    // seededAt is preserved: nothing was written for this group
    expect(summary.manifest).toEqual({
      a: { hash: 'h1', seededAt: 'earlier' },
    })
    expect(logs).toContain('seed: skipped (unchanged) "a"')
  })

  it('upserts a group whose hash changed and records the new fingerprint', async () => {
    const manifest: SeedManifest = { a: { hash: 'old', seededAt: 'earlier' } }

    const summary = await seedArticles(
      payload,
      convert,
      [group('a', 'new')],
      taxonomy,
      options(manifest),
    )

    expect(upsertMock).toHaveBeenCalledTimes(1)
    expect(summary).toMatchObject({ upserted: 1, skipped: 0 })
    expect(summary.manifest).toEqual({ a: { hash: 'new', seededAt: NOW } })
    expect(logs).toContain('seed: upserted "a"')
  })

  it('upserts a group that is missing from the manifest', async () => {
    const summary = await seedArticles(
      payload,
      convert,
      [group('fresh', 'h')],
      taxonomy,
      options({}),
    )

    expect(upsertMock).toHaveBeenCalledTimes(1)
    expect(summary.manifest).toEqual({ fresh: { hash: 'h', seededAt: NOW } })
  })

  it('upserts everything when force is set, even on matching hashes', async () => {
    const manifest: SeedManifest = {
      a: { hash: 'h1', seededAt: 'earlier' },
      b: { hash: 'h2', seededAt: 'earlier' },
    }
    const groups = [group('a', 'h1'), group('b', 'h2')]

    const summary = await seedArticles(payload, convert, groups, taxonomy, options(manifest, true))

    expect(upsertMock).toHaveBeenCalledTimes(2)
    expect(summary).toMatchObject({ upserted: 2, skipped: 0 })
    expect(summary.manifest).toEqual({
      a: { hash: 'h1', seededAt: NOW },
      b: { hash: 'h2', seededAt: NOW },
    })
  })

  it('seeds everything when the manifest is empty (corrupt-manifest fallback)', async () => {
    const groups = [group('a', 'h1'), group('b', 'h2'), group('c', 'h3')]

    const summary = await seedArticles(payload, convert, groups, taxonomy, options({}))

    expect(upsertMock).toHaveBeenCalledTimes(3)
    expect(summary).toMatchObject({ upserted: 3, skipped: 0 })
  })

  it('only writes the changed groups in a mixed batch', async () => {
    const manifest: SeedManifest = {
      a: { hash: 'h1', seededAt: 'earlier' },
      b: { hash: 'stale', seededAt: 'earlier' },
    }
    const groups = [group('a', 'h1'), group('b', 'h2'), group('c', 'h3')]

    const summary = await seedArticles(payload, convert, groups, taxonomy, options(manifest))

    expect(upsertMock).toHaveBeenCalledTimes(2)
    expect(summary).toMatchObject({ upserted: 2, skipped: 1 })
  })

  it('prunes manifest entries for deleted article groups', async () => {
    const manifest: SeedManifest = {
      a: { hash: 'h1', seededAt: 'earlier' },
      gone: { hash: 'h9', seededAt: 'earlier' },
    }

    const summary = await seedArticles(
      payload,
      convert,
      [group('a', 'h1')],
      taxonomy,
      options(manifest),
    )

    expect(Object.keys(summary.manifest)).toEqual(['a'])
  })
})
