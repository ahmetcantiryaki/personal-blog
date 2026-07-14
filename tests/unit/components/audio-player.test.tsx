// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AudioPlayer, formatTime } from '@/components/blog/audio-player'

const labels = { listen: 'Sesli dinle', pause: 'Duraklat', resume: 'Devam et', speed: 'Hız' }

describe('formatTime', () => {
  it('formats whole minutes and seconds as mm:ss', () => {
    expect(formatTime(65)).toBe('1:05')
  })

  it('pads seconds under 10', () => {
    expect(formatTime(9)).toBe('0:09')
  })

  it('floors fractional seconds', () => {
    expect(formatTime(125.9)).toBe('2:05')
  })

  it('falls back to 0:00 for non-finite or negative input', () => {
    expect(formatTime(Number.NaN)).toBe('0:00')
    expect(formatTime(-5)).toBe('0:00')
  })
})

describe('AudioPlayer', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders a play button with the listen label', () => {
    render(<AudioPlayer src="/audio/test.mp3" title="Test Article" labels={labels} />)

    expect(screen.getByRole('button', { name: labels.listen })).toBeTruthy()
  })

  it('renders the group with the article title as its accessible name', () => {
    render(<AudioPlayer src="/audio/test.mp3" title="Test Article" labels={labels} />)

    expect(screen.getByRole('group', { name: 'Test Article' })).toBeTruthy()
  })

  it('renders the speed toggle starting at 1x', () => {
    render(<AudioPlayer src="/audio/test.mp3" title="Test Article" labels={labels} />)

    expect(screen.getByRole('button', { name: `${labels.speed} 1x` })).toBeTruthy()
  })

  it('renders an audio element pointing at the given src', () => {
    const { container } = render(
      <AudioPlayer src="/audio/test.mp3" title="Test Article" labels={labels} />,
    )

    const audio = container.querySelector('audio')
    expect(audio?.getAttribute('src')).toBe('/audio/test.mp3')
  })
})
