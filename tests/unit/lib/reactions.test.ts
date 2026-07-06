import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createFakePayload, findResult, type FakePayload } from '../helpers/payload-mock'

const fake: FakePayload = createFakePayload()
vi.mock('@/lib/payload', () => ({ getPayloadClient: async () => fake }))

import { getReactedPostIds, getReactionState } from '@/lib/reactions'
import type { User } from '@/payload-types'

const user = { id: 7 } as User

beforeEach(() => vi.clearAllMocks())

describe('getReactionState', () => {
  it('returns count plus active=true when the user has reacted', async () => {
    // countFor (public) then isActive (user)
    fake.count.mockResolvedValueOnce({ totalDocs: 5 }).mockResolvedValueOnce({ totalDocs: 1 })
    const state = await getReactionState('likes', 42, user)
    expect(state).toEqual({ count: 5, active: true })
  })

  it('reports active=false for an anonymous user without querying membership', async () => {
    fake.count.mockResolvedValueOnce({ totalDocs: 3 })
    const state = await getReactionState('bookmarks', 42, null)
    expect(state).toEqual({ count: 3, active: false })
    // Only the public count query runs (isActive short-circuits for null user).
    expect(fake.count).toHaveBeenCalledTimes(1)
  })
})

describe('getReactedPostIds', () => {
  it('extracts numeric post ids from populated and unpopulated relations', async () => {
    fake.find.mockResolvedValue(
      findResult([{ post: { id: 1 } }, { post: 2 }, { post: null }, { post: 3 }]),
    )
    const ids = await getReactedPostIds('likes', user)
    expect(ids).toEqual([1, 2, 3])
  })

  it('returns an empty array when the user has no reactions', async () => {
    fake.find.mockResolvedValue(findResult([]))
    expect(await getReactedPostIds('bookmarks', user)).toEqual([])
  })
})
