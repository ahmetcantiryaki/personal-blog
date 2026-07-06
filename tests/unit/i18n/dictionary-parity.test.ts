import { describe, expect, it } from 'vitest'

import { en } from '@/i18n/dictionaries/en'
import { tr } from '@/i18n/dictionaries/tr'

/**
 * Structural parity: every leaf key present in the tr dictionary must also exist
 * in en (and vice-versa), recursively. Guards against a translator adding a UI
 * string in one locale but forgetting the other — which would render `undefined`
 * in the app.
 */
function collectKeyPaths(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix]
  const paths: string[] = []
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key
    paths.push(...collectKeyPaths(value, path))
  }
  return paths
}

describe('dictionary parity', () => {
  const trPaths = collectKeyPaths(tr).sort()
  const enPaths = collectKeyPaths(en).sort()

  it('tr and en expose an identical set of key paths', () => {
    const missingInEn = trPaths.filter((p) => !enPaths.includes(p))
    const missingInTr = enPaths.filter((p) => !trPaths.includes(p))
    expect(missingInEn, `keys missing in en: ${missingInEn.join(', ')}`).toEqual([])
    expect(missingInTr, `keys missing in tr: ${missingInTr.join(', ')}`).toEqual([])
  })

  it('every leaf value is a non-empty string in both locales', () => {
    for (const dict of [tr, en]) {
      for (const path of collectKeyPaths(dict)) {
        const value = path
          .split('.')
          .reduce<unknown>((acc, key) => (acc as Record<string, unknown>)[key], dict)
        expect(typeof value, `${path} should be a string`).toBe('string')
        expect((value as string).length, `${path} should be non-empty`).toBeGreaterThan(0)
      }
    }
  })

  it('covers a representative sample of nested sections', () => {
    // Sanity that collectKeyPaths reaches deep leaves, not just top-level keys.
    expect(trPaths).toContain('auth.loginTitle')
    expect(trPaths).toContain('footer.builtWith')
    expect(enPaths).toContain('error.notFoundTitle')
  })
})
