import { describe, expect, it } from 'vitest'

import { extractFaq } from '@/lib/lexical-faq'

const h = (tag: 'h2' | 'h3', text: string) => ({ type: 'heading', tag, children: [{ text }] })
const p = (text: string) => ({ type: 'paragraph', children: [{ text }] })
const doc = (children: unknown[]) => ({ root: { children } })

describe('extractFaq', () => {
  it('TR FAQ bölümünden soru-cevap çiftlerini çıkarır', () => {
    const content = doc([
      h('h2', 'Giriş'),
      p('gövde'),
      h('h2', 'Sıkça Sorulan Sorular'),
      h('h3', 'Claude ücretsiz mi?'),
      p('Evet, ücretsiz plan var.'),
      h('h3', 'Görsel üretir mi?'),
      p('Hayır.'),
      p('Ama SVG yapabilir.'),
    ])
    expect(extractFaq(content)).toEqual([
      { question: 'Claude ücretsiz mi?', answer: 'Evet, ücretsiz plan var.' },
      { question: 'Görsel üretir mi?', answer: 'Hayır.\n\nAma SVG yapabilir.' },
    ])
  })

  it('EN başlığını tanır ve sonraki H2 ile durur', () => {
    const content = doc([
      h('h2', 'Frequently Asked Questions'),
      h('h3', 'Is it free?'),
      p('Yes.'),
      h('h2', 'Conclusion'),
      h('h3', 'Not a question'),
      p('Should not appear.'),
    ])
    expect(extractFaq(content)).toEqual([{ question: 'Is it free?', answer: 'Yes.' }])
  })

  it('FAQ bölümü yoksa boş döner', () => {
    expect(extractFaq(doc([h('h2', 'Giriş'), p('metin')]))).toEqual([])
    expect(extractFaq(null)).toEqual([])
    expect(extractFaq({})).toEqual([])
  })

  it('cevapsız soruyu atlar, kalın/link içeren metni düzleştirir', () => {
    const content = doc([
      h('h2', 'Sıkça Sorulan Sorular'),
      h('h3', 'Cevapsız soru?'),
      h('h3', 'Dolu soru?'),
      { type: 'paragraph', children: [{ text: 'Cevap ' }, { children: [{ text: 'kalın' }] }] },
    ])
    expect(extractFaq(content)).toEqual([{ question: 'Dolu soru?', answer: 'Cevap kalın' }])
  })
})
