import { afterEach, describe, expect, it, vi } from 'vitest'

import { logger } from '@/lib/logger'

afterEach(() => vi.restoreAllMocks())

describe('logger', () => {
  it('serializes context onto the message for each level', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})

    logger.error('boom', { code: 1 })
    logger.warn('careful')
    logger.info('fyi', { ok: true })

    expect(error).toHaveBeenCalledWith('boom {"code":1}')
    expect(warn).toHaveBeenCalledWith('careful')
    expect(info).toHaveBeenCalledWith('fyi {"ok":true}')
  })

  it('never throws on non-serializable context', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const circular: Record<string, unknown> = {}
    circular.self = circular
    expect(() => logger.error('cycle', circular)).not.toThrow()
    expect(spy).toHaveBeenCalledOnce()
  })
})
