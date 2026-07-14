'use client'

import { Pause, Play, Square } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STRINGS = {
  tr: {
    listen: 'Sesli dinle',
    pause: 'Duraklat',
    resume: 'Devam et',
    stop: 'Durdur',
    speed: 'Hız',
  },
  en: {
    listen: 'Listen',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    speed: 'Speed',
  },
} as const

const SPEEDS = [1, 1.25, 1.5] as const
const MAX_CHUNK_LENGTH = 1500
const LANG_BY_LOCALE: Record<'tr' | 'en', string> = { tr: 'tr-TR', en: 'en-US' }

interface ListenButtonProps {
  locale: 'tr' | 'en'
  /** DOM id of the article container whose text should be read aloud. */
  targetId: string
}

type PlaybackState = 'idle' | 'playing' | 'paused'

/**
 * Extracts readable text from the target container, skipping <pre> (code
 * blocks) and <table> elements so listeners don't hear raw code or tabular
 * data read out of context.
 */
function extractReadableText(container: HTMLElement): string {
  const clone = container.cloneNode(true) as HTMLElement
  clone.querySelectorAll('pre, table').forEach((el) => el.remove())
  return clone.innerText || clone.textContent || ''
}

/**
 * Splits text into sentence-bounded chunks no longer than maxLength. Long
 * single utterances get cut off silently in some browsers (notably Chrome),
 * so we break at sentence boundaries and queue multiple utterances instead.
 */
function chunkText(text: string, maxLength: number): string[] {
  const sentences = text.split(/(?<=[.!?。？！])\s+/)
  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    if (current.length + sentence.length + 1 > maxLength && current.length > 0) {
      chunks.push(current.trim())
      current = sentence
    } else {
      current = current ? `${current} ${sentence}` : sentence
    }
  }
  if (current.trim()) chunks.push(current.trim())

  return chunks.filter((chunk) => chunk.length > 0)
}

function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  const exact = voices.find((v) => v.lang === lang)
  if (exact) return exact
  const prefix = lang.split('-')[0]
  const partial = voices.find((v) => v.lang.startsWith(prefix))
  return partial ?? null
}

/**
 * Reads the target article aloud using the browser's Web Speech API.
 * Renders nothing when speechSynthesis is unavailable (older Safari/Firefox
 * on some platforms, or non-browser environments).
 */
export function ListenButton({ locale, targetId }: ListenButtonProps) {
  const [supported, setSupported] = useState(false)
  const [state, setState] = useState<PlaybackState>('idle')
  const [rate, setRate] = useState<(typeof SPEEDS)[number]>(1)
  const chunksRef = useRef<string[]>([])
  const chunkIndexRef = useRef(0)
  const rateRef = useRef(rate)

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  useEffect(() => {
    rateRef.current = rate
  }, [rate])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const strings = STRINGS[locale]
  const lang = LANG_BY_LOCALE[locale]

  const speakFrom = useCallback(
    (index: number) => {
      const chunks = chunksRef.current
      if (index >= chunks.length) {
        setState('idle')
        return
      }

      const utterance = new SpeechSynthesisUtterance(chunks[index])
      utterance.lang = lang
      utterance.rate = rateRef.current
      const voice = pickVoice(window.speechSynthesis.getVoices(), lang)
      if (voice) utterance.voice = voice

      utterance.onend = () => {
        chunkIndexRef.current = index + 1
        speakFrom(index + 1)
      }
      utterance.onerror = () => {
        setState('idle')
      }

      window.speechSynthesis.speak(utterance)
    },
    [lang],
  )

  const handlePlay = useCallback(() => {
    const container = document.getElementById(targetId)
    if (!container) return

    if (state === 'paused') {
      window.speechSynthesis.resume()
      setState('playing')
      return
    }

    window.speechSynthesis.cancel()
    const text = extractReadableText(container)
    chunksRef.current = chunkText(text, MAX_CHUNK_LENGTH)
    chunkIndexRef.current = 0
    setState('playing')
    speakFrom(0)
  }, [state, targetId, speakFrom])

  const handlePause = useCallback(() => {
    window.speechSynthesis.pause()
    setState('paused')
  }, [])

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel()
    chunksRef.current = []
    chunkIndexRef.current = 0
    setState('idle')
  }, [])

  const handleSpeedChange = useCallback(
    (speed: (typeof SPEEDS)[number]) => {
      setRate(speed)
      if (state === 'playing') {
        // Restart current chunk at the new rate; speechSynthesis has no
        // live rate adjustment for an in-flight utterance.
        window.speechSynthesis.cancel()
        speakFrom(chunkIndexRef.current)
      }
    },
    [state, speakFrom],
  )

  if (!supported) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {state === 'idle' ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-pressed={false}
          aria-label={strings.listen}
          onClick={handlePlay}
        >
          <Play className="size-4" aria-hidden="true" />
          {strings.listen}
        </Button>
      ) : (
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={state === 'playing'}
            aria-label={state === 'playing' ? strings.pause : strings.resume}
            onClick={state === 'playing' ? handlePause : handlePlay}
          >
            {state === 'playing' ? (
              <Pause className="size-4" aria-hidden="true" />
            ) : (
              <Play className="size-4" aria-hidden="true" />
            )}
            {state === 'playing' ? strings.pause : strings.resume}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={strings.stop}
            onClick={handleStop}
          >
            <Square className="size-4" aria-hidden="true" />
            {strings.stop}
          </Button>
        </>
      )}

      <div className="flex items-center gap-1" role="group" aria-label={strings.speed}>
        {SPEEDS.map((speed) => (
          <button
            key={speed}
            type="button"
            aria-pressed={rate === speed}
            aria-label={`${strings.speed} ${speed}x`}
            onClick={() => handleSpeedChange(speed)}
            className={cn(
              'rounded-md border px-2 py-1 text-xs',
              rate === speed
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input bg-background text-muted-foreground hover:bg-accent',
            )}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  )
}
