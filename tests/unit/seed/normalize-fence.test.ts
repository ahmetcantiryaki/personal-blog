import { describe, expect, it } from 'vitest'

import { normalizeFenceLanguages } from '@/seed/lexical'

describe('normalizeFenceLanguages', () => {
  it('bilinen dilleri olduğu gibi bırakır', () => {
    const md = '```javascript\nconst a = 1\n```\n\n```nginx\nserver {}\n```'
    expect(normalizeFenceLanguages(md)).toBe(md)
  })

  it('bilinmeyen dili text yapar, kapanış fence dokunulmaz', () => {
    const md = '```brainfuck\n++\n```'
    expect(normalizeFenceLanguages(md)).toBe('```text\n++\n```')
  })

  it('dilsiz fence olduğu gibi kalır', () => {
    const md = '```\nplain\n```'
    expect(normalizeFenceLanguages(md)).toBe(md)
  })
})
