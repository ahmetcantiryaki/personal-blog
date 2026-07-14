'use client'

import { Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

const SPEED_CYCLE = [1, 1.25, 1.5, 0.75] as const

interface AudioPlayerLabels {
  listen: string
  pause: string
  resume: string
  speed: string
}

interface AudioPlayerProps {
  /** MP3 URL to play. */
  src: string
  /** Article title, used for the accessible group label. */
  title: string
  labels: AudioPlayerLabels
}

/**
 * Formats a duration in seconds as `mm:ss`. Exported for unit testing.
 * Returns `0:00` for non-finite input (e.g. before metadata has loaded).
 */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const totalSeconds = Math.floor(seconds)
  const minutes = Math.floor(totalSeconds / 60)
  const remaining = totalSeconds % 60
  return `${minutes}:${remaining.toString().padStart(2, '0')}`
}

/**
 * Compact MP3 player for the "listen to this article" feature. Renders a
 * round play/pause button, a scrubbable progress bar, elapsed/total time,
 * and a cycling playback-speed toggle. Disabled (but still visible) if the
 * audio source fails to load, so the layout never jumps.
 */
export function AudioPlayer({ src, title, labels }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [speedIndex, setSpeedIndex] = useState(0)
  const [hasError, setHasError] = useState(false)

  const speed = SPEED_CYCLE[speedIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoadedMetadata = () => setDuration(audio.duration)
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnded = () => setIsPlaying(false)
    const onError = () => setHasError(true)

    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.playbackRate = speed
  }, [speed])

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current
    if (!audio || hasError) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(
        () => setIsPlaying(true),
        () => setHasError(true),
      )
    }
  }, [isPlaying, hasError])

  const handleSeek = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const nextTime = Number(event.target.value)
    audio.currentTime = nextTime
    setCurrentTime(nextTime)
  }, [])

  const cycleSpeed = useCallback(() => {
    setSpeedIndex((index) => (index + 1) % SPEED_CYCLE.length)
  }, [])

  const playPauseLabel = isPlaying ? labels.pause : labels.resume || labels.listen

  return (
    <div
      className="flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2 shadow-sm"
      role="group"
      aria-label={title}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        type="button"
        onClick={togglePlayback}
        disabled={hasError}
        aria-label={isPlaying ? labels.pause : labels.listen}
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity',
          'hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        )}
      >
        {isPlaying ? (
          <Pause className="size-4" aria-hidden="true" fill="currentColor" />
        ) : (
          <Play className="size-4 translate-x-0.5" aria-hidden="true" fill="currentColor" />
        )}
      </button>

      <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {formatTime(currentTime)}
      </span>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={handleSeek}
        disabled={hasError || duration === 0}
        aria-label={playPauseLabel}
        aria-valuetext={formatTime(currentTime)}
        className={cn(
          'h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-accent accent-primary',
          'disabled:cursor-not-allowed disabled:opacity-40',
        )}
      />

      <span className="w-9 shrink-0 text-xs tabular-nums text-muted-foreground">
        {formatTime(duration)}
      </span>

      <button
        type="button"
        onClick={cycleSpeed}
        disabled={hasError}
        aria-label={`${labels.speed} ${speed}x`}
        className={cn(
          'shrink-0 rounded-full border border-input bg-background px-2 py-1 text-xs font-medium text-muted-foreground',
          'hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        )}
      >
        {speed}x
      </button>
    </div>
  )
}
