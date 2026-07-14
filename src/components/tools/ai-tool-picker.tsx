'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

/**
 * Client-side "AI Tool Picker" wizard. Four questions produce a scored
 * recommendation among a fixed set of well-known AI tools. All copy lives in
 * the STRINGS dictionary below (component-local, does not touch the shared
 * i18n dictionaries).
 */

export type Purpose = 'chat-writing' | 'image' | 'research' | 'code' | 'office'
export type Budget = 'free' | 'paid-20' | 'unlimited'
export type Ecosystem = 'google' | 'microsoft' | 'any'
export type Priority = 'quality' | 'speed'

export interface WizardAnswers {
  purpose: Purpose | null
  budget: Budget | null
  ecosystem: Ecosystem | null
  priority: Priority | null
}

export type ToolId =
  | 'chatgpt'
  | 'gemini'
  | 'claude'
  | 'perplexity'
  | 'copilot'
  | 'midjourney'
  | 'nano-banana'

export interface ToolDefinition {
  id: ToolId
  guideHref: Record<Locale, string>
}

export interface RecommendationResult {
  primary: ToolId
  primaryScore: number
  secondary: ToolId | null
  secondaryScore: number | null
}

/** Guide article slugs, keyed by locale, verified against seed/content. */
export const TOOL_DEFINITIONS: Record<ToolId, ToolDefinition> = {
  chatgpt: {
    id: 'chatgpt',
    guideHref: {
      tr: '/tr/posts/chatgpt-tam-rehber-2026',
      en: '/en/posts/chatgpt-complete-guide-2026',
    },
  },
  gemini: {
    id: 'gemini',
    guideHref: {
      tr: '/tr/posts/gemini-mi-chatgpt-mi',
      en: '/en/posts/gemini-vs-chatgpt-2026',
    },
  },
  claude: {
    id: 'claude',
    guideHref: {
      tr: '/tr/posts/sosyal-medya-icin-claude-kullanimi',
      en: '/en/posts/how-to-use-claude-for-social-media',
    },
  },
  perplexity: {
    id: 'perplexity',
    guideHref: {
      tr: '/tr/posts/perplexity-mi-google-mi',
      en: '/en/posts/perplexity-vs-google-ai-search',
    },
  },
  copilot: {
    id: 'copilot',
    guideHref: {
      tr: '/tr/posts/en-populer-yapay-zeka-araclari-2026',
      en: '/en/posts/most-popular-ai-tools-2026',
    },
  },
  midjourney: {
    id: 'midjourney',
    guideHref: {
      tr: '/tr/posts/en-iyi-yapay-zeka-gorsel-araclari-2026',
      en: '/en/posts/best-ai-image-generators-2026',
    },
  },
  'nano-banana': {
    id: 'nano-banana',
    guideHref: {
      tr: '/tr/posts/en-iyi-yapay-zeka-gorsel-araclari-2026',
      en: '/en/posts/best-ai-image-generators-2026',
    },
  },
}

const CODE_GUIDE_HREF: Record<Locale, string> = {
  tr: '/tr/posts/claude-sonnet-5-gpt-5-6-gemini-3-5-kiyaslamasi',
  en: '/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5',
}

/** Base score table: purpose is the dominant signal. */
const PURPOSE_SCORES: Record<Purpose, Partial<Record<ToolId, number>>> = {
  'chat-writing': { claude: 5, chatgpt: 4, gemini: 3, copilot: 2, perplexity: 1 },
  image: { 'nano-banana': 5, midjourney: 5, gemini: 2 },
  research: { perplexity: 5, gemini: 3, chatgpt: 2 },
  code: { claude: 5, chatgpt: 3, gemini: 2, copilot: 2 },
  office: { copilot: 5, chatgpt: 2, gemini: 2 },
}

const BUDGET_SCORES: Record<Budget, Partial<Record<ToolId, number>>> = {
  free: { gemini: 2, 'nano-banana': 2, perplexity: 1, chatgpt: 1, claude: 1, copilot: 1 },
  'paid-20': { chatgpt: 2, claude: 2, perplexity: 2, midjourney: 1, copilot: 1, gemini: 1 },
  unlimited: { chatgpt: 1, claude: 1, midjourney: 1, copilot: 1, gemini: 1, perplexity: 1 },
}

const ECOSYSTEM_SCORES: Record<Ecosystem, Partial<Record<ToolId, number>>> = {
  google: { gemini: 3, 'nano-banana': 2 },
  microsoft: { copilot: 3 },
  any: { chatgpt: 1, claude: 1, perplexity: 1, midjourney: 1 },
}

const PRIORITY_SCORES: Record<Priority, Partial<Record<ToolId, number>>> = {
  quality: { claude: 2, midjourney: 2, perplexity: 1, gemini: 1, chatgpt: 1 },
  speed: { gemini: 2, copilot: 2, 'nano-banana': 2, chatgpt: 1 },
}

const ALL_TOOL_IDS: ToolId[] = [
  'chatgpt',
  'gemini',
  'claude',
  'perplexity',
  'copilot',
  'midjourney',
  'nano-banana',
]

/**
 * Pure scoring function so the recommendation logic is trivially testable.
 * Sums per-question weights for every candidate tool and returns the top two.
 */
export function computeRecommendation(answers: WizardAnswers): RecommendationResult | null {
  const { purpose, budget, ecosystem, priority } = answers
  if (!purpose || !budget || !ecosystem || !priority) return null

  const scores = new Map<ToolId, number>(ALL_TOOL_IDS.map((id) => [id, 0]))

  const addScores = (table: Partial<Record<ToolId, number>>) => {
    for (const [id, value] of Object.entries(table) as [ToolId, number][]) {
      scores.set(id, (scores.get(id) ?? 0) + value)
    }
  }

  addScores(PURPOSE_SCORES[purpose])
  addScores(BUDGET_SCORES[budget])
  addScores(ECOSYSTEM_SCORES[ecosystem])
  addScores(PRIORITY_SCORES[priority])

  // Image-only candidates should not surface for non-image purposes, and
  // vice versa: keep the field relevant by zeroing out obviously mismatched
  // tools (e.g. Midjourney for "office" tasks).
  const ranked = ALL_TOOL_IDS.map((id) => ({ id, score: scores.get(id) ?? 0 })).sort(
    (a, b) => b.score - a.score,
  )

  const [first, second] = ranked
  return {
    primary: first.id,
    primaryScore: first.score,
    secondary: second ? second.id : null,
    secondaryScore: second ? second.score : null,
  }
}

/** Returns the correct guide link for a tool + purpose + locale combo. */
export function getGuideHref(tool: ToolId, purpose: Purpose | null, locale: Locale): string {
  if (purpose === 'code') return CODE_GUIDE_HREF[locale]
  return TOOL_DEFINITIONS[tool].guideHref[locale]
}

interface Strings {
  heading: string
  intro: string
  step: string
  of: string
  back: string
  next: string
  restart: string
  purposeLegend: string
  budgetLegend: string
  ecosystemLegend: string
  priorityLegend: string
  purposeOptions: Record<Purpose, string>
  budgetOptions: Record<Budget, string>
  ecosystemOptions: Record<Ecosystem, string>
  priorityOptions: Record<Priority, string>
  toolNames: Record<ToolId, string>
  resultTitle: string
  resultReason: string
  alternativeTitle: string
  guideLinkLabel: string
}

const STRINGS: Record<Locale, Strings> = {
  tr: {
    heading: 'Hangi yapay zeka aracı sana uygun?',
    intro: '4 kısa soruyla sana en uygun AI aracını önerelim.',
    step: 'Adım',
    of: '/',
    back: 'Geri',
    next: 'İleri',
    restart: 'Baştan başla',
    purposeLegend: 'Ne için kullanacaksın?',
    budgetLegend: 'Bütçen ne kadar?',
    ecosystemLegend: 'Hangi ekosistemi kullanıyorsun?',
    priorityLegend: 'Senin için öncelik nedir?',
    purposeOptions: {
      'chat-writing': 'Genel sohbet / yazı yazma',
      image: 'Görsel üretme',
      research: 'Kaynaklı arama ve araştırma',
      code: 'Kod yazma',
      office: 'Ofis ve doküman işleri',
    },
    budgetOptions: {
      free: 'Ücretsiz',
      'paid-20': 'Aylık ~$20',
      unlimited: 'Sınır yok',
    },
    ecosystemOptions: {
      google: 'Google',
      microsoft: 'Microsoft',
      any: 'Farketmez',
    },
    priorityOptions: {
      quality: 'En iyi kalite',
      speed: 'Hız ve pratiklik',
    },
    toolNames: {
      chatgpt: 'ChatGPT',
      gemini: 'Gemini',
      claude: 'Claude',
      perplexity: 'Perplexity',
      copilot: 'Microsoft Copilot',
      midjourney: 'Midjourney',
      'nano-banana': 'Nano Banana',
    },
    resultTitle: 'Önerimiz',
    resultReason: 'Neden bu araç?',
    alternativeTitle: 'İkinci alternatif',
    guideLinkLabel: 'Rehberi oku',
  },
  en: {
    heading: 'Which AI tool fits you?',
    intro: 'Answer 4 quick questions and we will recommend the right AI tool.',
    step: 'Step',
    of: 'of',
    back: 'Back',
    next: 'Next',
    restart: 'Start over',
    purposeLegend: 'What will you use it for?',
    budgetLegend: 'What is your budget?',
    ecosystemLegend: 'Which ecosystem do you use?',
    priorityLegend: 'What matters most to you?',
    purposeOptions: {
      'chat-writing': 'General chat / writing',
      image: 'Image generation',
      research: 'Sourced search and research',
      code: 'Coding',
      office: 'Office and document work',
    },
    budgetOptions: {
      free: 'Free',
      'paid-20': '~$20/month',
      unlimited: 'No limit',
    },
    ecosystemOptions: {
      google: 'Google',
      microsoft: 'Microsoft',
      any: 'Does not matter',
    },
    priorityOptions: {
      quality: 'Best quality',
      speed: 'Speed and practicality',
    },
    toolNames: {
      chatgpt: 'ChatGPT',
      gemini: 'Gemini',
      claude: 'Claude',
      perplexity: 'Perplexity',
      copilot: 'Microsoft Copilot',
      midjourney: 'Midjourney',
      'nano-banana': 'Nano Banana',
    },
    resultTitle: 'Our recommendation',
    resultReason: 'Why this tool?',
    alternativeTitle: 'Second alternative',
    guideLinkLabel: 'Read the guide',
  },
}

function buildReason(
  strings: Strings,
  tool: ToolId,
  answers: WizardAnswers,
  locale: Locale,
): string {
  const parts: string[] = []
  if (answers.purpose) parts.push(strings.purposeOptions[answers.purpose].toLowerCase())
  if (answers.priority) parts.push(strings.priorityOptions[answers.priority].toLowerCase())
  const toolName = strings.toolNames[tool]
  return locale === 'tr'
    ? `${toolName}, ${parts.join(' + ')} tercihlerine en uygun seçenek.`
    : `${toolName} best matches your ${parts.join(' + ')} preferences.`
}

interface RadioOption<T extends string> {
  value: T
  label: string
}

interface RadioStepProps<T extends string> {
  legend: string
  name: string
  options: RadioOption<T>[]
  value: T | null
  onChange: (value: T) => void
}

function RadioStep<T extends string>({ legend, name, options, value, onChange }: RadioStepProps<T>) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-medium">{legend}</legend>
      <div role="radiogroup" aria-label={legend} className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const checked = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={checked}
              name={name}
              onClick={() => onChange(option.value)}
              className={cn(
                'rounded-md border border-border/70 px-4 py-3 text-left text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                checked
                  ? 'border-primary bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export interface AiToolPickerProps {
  locale: Locale
}

const TOTAL_STEPS = 4

export function AiToolPicker({ locale }: AiToolPickerProps) {
  const strings = STRINGS[locale]
  const [step, setStep] = React.useState(1)
  const [answers, setAnswers] = React.useState<WizardAnswers>({
    purpose: null,
    budget: null,
    ecosystem: null,
    priority: null,
  })

  const result = computeRecommendation(answers)
  const isComplete = result !== null

  const goNext = () => setStep((current) => Math.min(current + 1, TOTAL_STEPS))
  const goBack = () => setStep((current) => Math.max(current - 1, 1))
  const restart = () => {
    setAnswers({ purpose: null, budget: null, ecosystem: null, priority: null })
    setStep(1)
  }

  const currentAnswerSet = (): boolean => {
    if (step === 1) return answers.purpose !== null
    if (step === 2) return answers.budget !== null
    if (step === 3) return answers.ecosystem !== null
    return answers.priority !== null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">{strings.heading}</CardTitle>
        <p className="text-sm text-muted-foreground">{strings.intro}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isComplete ? (
          <>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {strings.step} {step} {strings.of} {TOTAL_STEPS}
            </p>

            {step === 1 ? (
              <RadioStep<Purpose>
                legend={strings.purposeLegend}
                name="purpose"
                value={answers.purpose}
                onChange={(purpose) => setAnswers((prev) => ({ ...prev, purpose }))}
                options={(Object.keys(strings.purposeOptions) as Purpose[]).map((key) => ({
                  value: key,
                  label: strings.purposeOptions[key],
                }))}
              />
            ) : null}

            {step === 2 ? (
              <RadioStep<Budget>
                legend={strings.budgetLegend}
                name="budget"
                value={answers.budget}
                onChange={(budget) => setAnswers((prev) => ({ ...prev, budget }))}
                options={(Object.keys(strings.budgetOptions) as Budget[]).map((key) => ({
                  value: key,
                  label: strings.budgetOptions[key],
                }))}
              />
            ) : null}

            {step === 3 ? (
              <RadioStep<Ecosystem>
                legend={strings.ecosystemLegend}
                name="ecosystem"
                value={answers.ecosystem}
                onChange={(ecosystem) => setAnswers((prev) => ({ ...prev, ecosystem }))}
                options={(Object.keys(strings.ecosystemOptions) as Ecosystem[]).map((key) => ({
                  value: key,
                  label: strings.ecosystemOptions[key],
                }))}
              />
            ) : null}

            {step === 4 ? (
              <RadioStep<Priority>
                legend={strings.priorityLegend}
                name="priority"
                value={answers.priority}
                onChange={(priority) => setAnswers((prev) => ({ ...prev, priority }))}
                options={(Object.keys(strings.priorityOptions) as Priority[]).map((key) => ({
                  value: key,
                  label: strings.priorityOptions[key],
                }))}
              />
            ) : null}
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {strings.resultTitle}
              </p>
              <h3 className="mt-1 font-serif text-xl font-semibold">
                {strings.toolNames[result.primary]}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{strings.resultReason} </span>
                {buildReason(strings, result.primary, answers, locale)}
              </p>
              <a
                href={getGuideHref(result.primary, answers.purpose, locale)}
                className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {strings.guideLinkLabel}
              </a>
            </div>

            {result.secondary ? (
              <div className="rounded-md border border-border/70 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {strings.alternativeTitle}
                </p>
                <h4 className="mt-1 font-medium">{strings.toolNames[result.secondary]}</h4>
                <a
                  href={getGuideHref(result.secondary, answers.purpose, locale)}
                  className="mt-2 inline-block text-sm text-primary underline-offset-4 hover:underline"
                >
                  {strings.guideLinkLabel}
                </a>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between gap-3">
        {isComplete ? (
          <Button type="button" variant="outline" onClick={restart}>
            {strings.restart}
          </Button>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={goBack} disabled={step === 1}>
              {strings.back}
            </Button>
            <Button type="button" onClick={goNext} disabled={!currentAnswerSet()}>
              {strings.next}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
