import { mkdtemp, readFile, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import path from 'path'

import { describe, expect, it } from 'vitest'

import {
  hashArticleSources,
  isForceRequested,
  loadSeedManifest,
  parseSeedManifest,
  saveSeedManifest,
  sha256,
} from '@/seed/manifest'

const tempDir = () => mkdtemp(path.join(tmpdir(), 'seed-manifest-'))

describe('sha256', () => {
  it('is a deterministic 16-char digest', () => {
    expect(sha256('woyable')).toBe(sha256('woyable'))
    expect(sha256('woyable')).toHaveLength(16)
    expect(sha256('woyable')).not.toBe(sha256('woyable '))
  })
})

describe('hashArticleSources', () => {
  const tr = { locale: 'tr' as const, raw: '---\ntitle: A\n---\nbody' }
  const en = { locale: 'en' as const, raw: '---\ntitle: A\n---\nbody' }

  it('is stable for identical sources', () => {
    expect(hashArticleSources([tr, en])).toBe(hashArticleSources([tr, en]))
  })

  it('changes when the body changes', () => {
    expect(hashArticleSources([tr, en])).not.toBe(
      hashArticleSources([tr, { ...en, raw: `${en.raw} more` }]),
    )
  })

  it('changes when only front-matter changes (category/status/date)', () => {
    const changed = { ...tr, raw: '---\ntitle: A\ncategory: ai\n---\nbody' }
    expect(hashArticleSources([tr, en])).not.toBe(hashArticleSources([changed, en]))
  })

  it('distinguishes which locale a source belongs to', () => {
    expect(hashArticleSources([tr])).not.toBe(hashArticleSources([{ ...tr, locale: 'en' }]))
  })
})

describe('parseSeedManifest', () => {
  it('keeps well-formed entries', () => {
    const manifest = parseSeedManifest('{"a":{"hash":"x","seededAt":"2026-01-01T00:00:00.000Z"}}')
    expect(manifest).toEqual({
      a: { hash: 'x', seededAt: '2026-01-01T00:00:00.000Z' },
    })
  })

  it('drops entries that do not match the contract', () => {
    expect(parseSeedManifest('{"a":{"hash":1},"b":null,"c":"nope"}')).toEqual({})
  })

  it('degrades to an empty manifest for non-object JSON', () => {
    expect(parseSeedManifest('[1,2,3]')).toEqual({})
    expect(parseSeedManifest('"text"')).toEqual({})
  })

  it('throws on invalid JSON so callers can log and fall back', () => {
    expect(() => parseSeedManifest('{ not json')).toThrow()
  })
})

describe('loadSeedManifest', () => {
  it('returns {} when the file does not exist', async () => {
    const dir = await tempDir()
    expect(await loadSeedManifest(path.join(dir, 'missing.json'))).toEqual({})
  })

  it('returns {} and warns when the file is corrupt', async () => {
    const dir = await tempDir()
    const file = path.join(dir, 'seed-manifest.json')
    await writeFile(file, '{ this is not json', 'utf8')

    const warnings: string[] = []
    const manifest = await loadSeedManifest(file, {
      info: () => {},
      warn: (m) => warnings.push(m),
    })

    expect(manifest).toEqual({})
    expect(warnings).toHaveLength(1)
  })

  it('round-trips a saved manifest', async () => {
    const dir = await tempDir()
    const file = path.join(dir, 'seed-manifest.json')
    const manifest = {
      b: { hash: '2', seededAt: 'x' },
      a: { hash: '1', seededAt: 'y' },
    }

    expect(await saveSeedManifest(file, manifest)).toBe(true)
    expect(await loadSeedManifest(file)).toEqual(manifest)
    // keys are sorted on disk for reviewable diffs
    expect(Object.keys(JSON.parse(await readFile(file, 'utf8')))).toEqual(['a', 'b'])
  })
})

describe('saveSeedManifest', () => {
  it('reports failure instead of throwing when the path is unwritable', async () => {
    const dir = await tempDir()
    const impossible = path.join(dir, 'nope', 'deeper', 'seed-manifest.json')

    const warnings: string[] = []
    const ok = await saveSeedManifest(
      impossible,
      {},
      { info: () => {}, warn: (m) => warnings.push(m) },
    )

    expect(ok).toBe(false)
    expect(warnings).toHaveLength(1)
  })
})

describe('isForceRequested', () => {
  it('detects the --force argument', () => {
    expect(isForceRequested(['--force'], {})).toBe(true)
    expect(isForceRequested([], {})).toBe(false)
  })

  it('detects truthy SEED_FORCE values only', () => {
    expect(isForceRequested([], { SEED_FORCE: '1' })).toBe(true)
    expect(isForceRequested([], { SEED_FORCE: 'TRUE' })).toBe(true)
    expect(isForceRequested([], { SEED_FORCE: '0' })).toBe(false)
    expect(isForceRequested([], { SEED_FORCE: '' })).toBe(false)
    expect(isForceRequested([], {})).toBe(false)
  })
})
