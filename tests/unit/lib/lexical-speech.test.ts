import { describe, expect, it } from 'vitest'

import { extractSpeechText, splitForTts } from '@/lib/lexical-speech'

const p = (text: string) => ({ type: 'paragraph', children: [{ text }] })
const h = (tag: 'h2' | 'h3' | 'h4', text: string) => ({ type: 'heading', tag, children: [{ text }] })
const list = (items: string[]) => ({
  type: 'list',
  children: items.map((text) => ({ type: 'listitem', children: [{ text }] })),
})
const code = () => ({ type: 'block', fields: { blockType: 'Code', code: 'const x = 1', language: 'ts' } })
const table = () => ({
  type: 'table',
  children: [
    {
      type: 'tablerow',
      children: [{ type: 'tablecell', children: [{ text: 'a' }] }],
    },
  ],
})
const upload = () => ({ type: 'upload', value: { id: '1' } })
const link = (text: string, url: string) => ({
  type: 'link',
  fields: { url },
  children: [{ text }],
})
const inlineCode = (text: string) => ({ text, format: 16 })
const doc = (children: unknown[]) => ({ root: { children } })

describe('extractSpeechText', () => {
  it('ardışık birden fazla kod bloğunu tek TR cümlesine indirger', () => {
    const content = doc([p('Giriş metni.'), code(), code(), p('Devam metni.')])
    expect(extractSpeechText(content, { locale: 'tr' })).toBe(
      'Giriş metni.\nKod örneği makalede yer alıyor.\nDevam metni.',
    )
  })

  it('kod bloklarını EN placeholder ile değiştirir', () => {
    const content = doc([code(), p('Text.')])
    expect(extractSpeechText(content, { locale: 'en' })).toBe(
      'A code example is available in the article.\nText.',
    )
  })

  it('tabloyu TR placeholder ile değiştirir', () => {
    const content = doc([p('Önce.'), table(), p('Sonra.')])
    expect(extractSpeechText(content, { locale: 'tr' })).toBe(
      'Önce.\nKarşılaştırma tablosu makalede yer alıyor.\nSonra.',
    )
  })

  it('tabloyu EN placeholder ile değiştirir', () => {
    const content = doc([table()])
    expect(extractSpeechText(content, { locale: 'en' })).toBe(
      'A comparison table is available in the article.',
    )
  })

  it('başlıklardan sonra nokta yoksa ekler', () => {
    const content = doc([h('h2', 'Bölüm Başlığı'), p('gövde metni')])
    expect(extractSpeechText(content, { locale: 'tr' })).toBe('Bölüm Başlığı.\ngövde metni')
  })

  it('zaten noktalı başlığa ikinci nokta eklemez', () => {
    const content = doc([h('h3', 'Soru mu?'), p('cevap.')])
    expect(extractSpeechText(content, { locale: 'tr' })).toBe('Soru mu?\ncevap.')
  })

  it('liste öğelerini okur ve her birine nokta ekler', () => {
    const content = doc([list(['ilk madde', 'ikinci madde.'])])
    expect(extractSpeechText(content, { locale: 'tr' })).toBe('ilk madde.\nikinci madde.')
  })

  it('satır içi kodu olduğu gibi okur, upload/embed node atlanır, link metni okunur', () => {
    const content = doc([
      { type: 'paragraph', children: [{ text: 'Komut: ' }, inlineCode('npm install'), { text: ' çalıştır.' }] },
      upload(),
      { type: 'paragraph', children: [link('Woyable', 'https://woyable.com')] },
    ])
    expect(extractSpeechText(content, { locale: 'tr' })).toBe(
      'Komut: npm install çalıştır.\nWoyable',
    )
  })

  it('null veya bozuk içerikte boş string döner', () => {
    expect(extractSpeechText(null, { locale: 'tr' })).toBe('')
    expect(extractSpeechText(undefined, { locale: 'tr' })).toBe('')
    expect(extractSpeechText({}, { locale: 'tr' })).toBe('')
    expect(extractSpeechText({ root: {} }, { locale: 'en' })).toBe('')
  })

  it('çoklu boşlukları ve boş satırları temizler', () => {
    const content = doc([
      { type: 'paragraph', children: [{ text: 'çok   fazla    boşluk' }] },
      { type: 'paragraph', children: [{ text: '' }] },
      p('son cümle.'),
    ])
    expect(extractSpeechText(content, { locale: 'tr' })).toBe('çok fazla boşluk\nson cümle.')
  })
})

describe('splitForTts', () => {
  it('kısa metni tek parça döner', () => {
    expect(splitForTts('Kısa bir cümle.', 300)).toEqual(['Kısa bir cümle.'])
  })

  it('cümle sınırında böler, maxLen aşılmaz', () => {
    const text = 'Bu ilk cümle. Bu ikinci cümle. Bu üçüncü cümle.'
    const chunks = splitForTts(text, 20)
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(20)
    }
    expect(chunks.join(' ')).toContain('ilk cümle')
    expect(chunks.every((c) => c.trim().length > 0)).toBe(true)
  })

  it('tam sınırda biten cümleyi doğru gruplar', () => {
    const text = 'Bu tam onaltı.' // 14 chars incl period; test exact boundary grouping
    const chunks = splitForTts(text, text.length)
    expect(chunks).toEqual([text])
  })

  it('maxLenden uzun tek cümleyi virgül/boşluktan böler', () => {
    const longSentence =
      'Bu çok uzun bir cümle, virgülden bölünmesi gerekiyor, çünkü tek başına sınırı aşıyor ve bölünmesi lazım'
    const chunks = splitForTts(longSentence, 30)
    expect(chunks.length).toBeGreaterThan(1)
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(30)
      expect(chunk.trim().length).toBeGreaterThan(0)
    }
  })

  it('boş metin için boş dizi döner', () => {
    expect(splitForTts('', 300)).toEqual([])
    expect(splitForTts('   ', 300)).toEqual([])
  })

  it('boş parça üretmez', () => {
    const text = 'Bir. İki. Üç. Dört. Beş.'
    const chunks = splitForTts(text, 5)
    expect(chunks.every((c) => c.length > 0)).toBe(true)
  })
})
