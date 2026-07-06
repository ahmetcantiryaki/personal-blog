/**
 * In-memory sliding-window rate limiter.
 *
 * Best-effort and PER-INSTANCE by design: there is no Redis in this deployment,
 * so counters live in the memory of whichever serverless/edge instance handled
 * the request. Under horizontal scaling the effective limit is roughly
 * `limit × instances`. This is an accepted trade-off — it still defends against
 * single-source floods (the dominant abuse vector for a small blog) without new
 * infrastructure. Swap `hit()` for a Redis/Upstash-backed store to make limits
 * global.
 */

export interface RateLimitResult {
  /** Whether this request is within the limit. */
  ok: boolean
  /** Requests still allowed in the current window (0 when blocked). */
  remaining: number
  /** Seconds until the caller may retry (0 when allowed). */
  retryAfterSeconds: number
}

/** key → ascending list of hit timestamps (ms) inside the active window. */
const buckets = new Map<string, number[]>()

/** Drop empty buckets occasionally so the map can't grow without bound. */
let lastSweep = 0
const SWEEP_INTERVAL_MS = 60_000

function sweep(now: number, windowMs: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return
  lastSweep = now
  const cutoff = now - windowMs
  for (const [key, hits] of buckets) {
    const live = hits.filter((t) => t > cutoff)
    if (live.length === 0) buckets.delete(key)
    else buckets.set(key, live)
  }
}

/**
 * Record a hit for `key` and report whether it is within `limit` per `windowMs`.
 * Pure aside from the shared in-memory store; `now` is injectable for tests.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  const cutoff = now - windowMs
  const hits = (buckets.get(key) ?? []).filter((t) => t > cutoff)

  if (hits.length >= limit) {
    buckets.set(key, hits)
    const earliest = hits[0]
    const retryAfterSeconds = Math.max(1, Math.ceil((earliest + windowMs - now) / 1000))
    return { ok: false, remaining: 0, retryAfterSeconds }
  }

  hits.push(now)
  buckets.set(key, hits)
  sweep(now, windowMs)
  return { ok: true, remaining: limit - hits.length, retryAfterSeconds: 0 }
}

/** Test/util helper: forget all recorded hits. */
export function resetRateLimits(): void {
  buckets.clear()
  lastSweep = 0
}

/**
 * Best-effort client IP from proxy headers. Vercel/most proxies set
 * `x-forwarded-for` to a comma-separated chain whose FIRST entry is the client.
 * Falls back to `x-real-ip`, then a constant so a missing header can't become a
 * shared unlimited bucket.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip')?.trim() || 'unknown'
}
