import { describe, expect, it } from 'vitest'

import {
  computeRecommendation,
  getGuideHref,
  type WizardAnswers,
} from '@/components/tools/ai-tool-picker'

describe('computeRecommendation', () => {
  it('returns null when not all answers are set', () => {
    const partial: WizardAnswers = {
      purpose: 'chat-writing',
      budget: null,
      ecosystem: null,
      priority: null,
    }
    expect(computeRecommendation(partial)).toBeNull()
  })

  it('recommends Claude for general chat/writing with quality priority', () => {
    const answers: WizardAnswers = {
      purpose: 'chat-writing',
      budget: 'paid-20',
      ecosystem: 'any',
      priority: 'quality',
    }
    const result = computeRecommendation(answers)
    expect(result).not.toBeNull()
    expect(result?.primary).toBe('claude')
    expect(result?.secondary).not.toBeNull()
    expect(result?.secondary).not.toBe('claude')
  })

  it('recommends an image tool for image generation purpose', () => {
    const answers: WizardAnswers = {
      purpose: 'image',
      budget: 'free',
      ecosystem: 'any',
      priority: 'speed',
    }
    const result = computeRecommendation(answers)
    expect(['nano-banana', 'midjourney']).toContain(result?.primary)
  })

  it('recommends Microsoft Copilot for office work in the Microsoft ecosystem', () => {
    const answers: WizardAnswers = {
      purpose: 'office',
      budget: 'unlimited',
      ecosystem: 'microsoft',
      priority: 'speed',
    }
    const result = computeRecommendation(answers)
    expect(result?.primary).toBe('copilot')
  })

  it('recommends Perplexity for sourced research', () => {
    const answers: WizardAnswers = {
      purpose: 'research',
      budget: 'paid-20',
      ecosystem: 'any',
      priority: 'quality',
    }
    const result = computeRecommendation(answers)
    expect(result?.primary).toBe('perplexity')
  })
})

describe('getGuideHref', () => {
  it('links coding purpose to the model comparison guide regardless of tool', () => {
    expect(getGuideHref('claude', 'code', 'tr')).toBe(
      '/tr/posts/claude-sonnet-5-gpt-5-6-gemini-3-5-kiyaslamasi',
    )
    expect(getGuideHref('chatgpt', 'code', 'en')).toBe(
      '/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5',
    )
  })

  it('links each tool to its own guide for non-code purposes', () => {
    expect(getGuideHref('gemini', 'chat-writing', 'tr')).toBe('/tr/posts/gemini-mi-chatgpt-mi')
    expect(getGuideHref('gemini', 'chat-writing', 'en')).toBe('/en/posts/gemini-vs-chatgpt-2026')
  })
})
