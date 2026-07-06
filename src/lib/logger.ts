/**
 * Minimal, centralised server logger for route handlers and other non-Payload
 * call sites. Where a Payload instance is in scope, prefer `payload.logger`
 * (structured, pino-backed); this util covers everything else so the codebase
 * has one logging entry point instead of scattered `console.*` calls.
 */
type LogContext = Record<string, unknown>

function serialize(context?: LogContext): string {
  if (!context) return ''
  try {
    return ` ${JSON.stringify(context)}`
  } catch {
    return ' [uncerializable context]'
  }
}

export const logger = {
  error(message: string, context?: LogContext): void {
    // eslint-disable-next-line no-console
    console.error(`${message}${serialize(context)}`)
  },
  warn(message: string, context?: LogContext): void {
    // eslint-disable-next-line no-console
    console.warn(`${message}${serialize(context)}`)
  },
  info(message: string, context?: LogContext): void {
    // eslint-disable-next-line no-console
    console.info(`${message}${serialize(context)}`)
  },
}
