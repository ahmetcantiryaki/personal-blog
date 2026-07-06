import { vi } from 'vitest'

/**
 * A minimal fake of the Payload Local API surface our `src/lib` modules use.
 * Each method is a vi.fn so tests can queue return values per call. Wire it up
 * with `mockGetPayloadClient(fake)` after `vi.mock('@/lib/payload', ...)`.
 */
export interface FakePayload {
  find: ReturnType<typeof vi.fn>
  findByID: ReturnType<typeof vi.fn>
  count: ReturnType<typeof vi.fn>
  findGlobal: ReturnType<typeof vi.fn>
  auth: ReturnType<typeof vi.fn>
}

export function createFakePayload(overrides: Partial<FakePayload> = {}): FakePayload {
  return {
    find: vi.fn(async () => ({ docs: [], page: 1, totalPages: 1, totalDocs: 0 })),
    findByID: vi.fn(async () => null),
    count: vi.fn(async () => ({ totalDocs: 0 })),
    findGlobal: vi.fn(async () => null),
    auth: vi.fn(async () => ({ user: null })),
    ...overrides,
  }
}

/** Build a `find` result envelope shaped like Payload's paginated response. */
export function findResult<T>(docs: T[], extra: Record<string, unknown> = {}) {
  return {
    docs,
    page: 1,
    totalPages: 1,
    totalDocs: docs.length,
    hasNextPage: false,
    hasPrevPage: false,
    ...extra,
  }
}
