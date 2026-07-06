import type { APIRequestContext, Page } from '@playwright/test'
import { expect } from '@playwright/test'

/** Real, paired content guaranteed to exist in the live catalogue. */
export const TR_POST_SLUG = 'rag-sistemi-nasil-kurulur'
export const EN_POST_SLUG = 'how-to-build-rag-system'
export const TR_CATEGORY_SLUG = 'yapay-zeka'
export const EN_CATEGORY_SLUG = 'ai'

export interface TestUser {
  name: string
  email: string
  password: string
}

/**
 * Retry a request-shaped operation a few times.
 *
 * Rationale (reported to the team): on Node 22.17.1, Next 15's request body
 * streaming intermittently crashes under concurrent POSTs
 * (`TypeError: controller[kState].transformAlgorithm is not a function`), the
 * connection dies mid-flight and no handler runs. A short retry rides out the
 * blip without masking real 4xx/5xx contract failures (those throw normally).
 */
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 300 * (i + 1)))
    }
  }
  throw lastError
}

/** Unique reader credentials per call so tests stay independent. */
export function freshUser(tag: string): TestUser {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return {
    name: `E2E ${tag}`,
    email: `e2e-${tag}-${unique}@woyable.test`,
    password: 'e2e-Password-1',
  }
}

/**
 * Register a reader through Payload REST. Public create access forces the
 * `reader` role server-side.
 */
export async function registerUser(request: APIRequestContext, user: TestUser): Promise<void> {
  await withRetry(async () => {
    const res = await request.post('/api/users', {
      data: { name: user.name, email: user.email, password: user.password },
    })
    if (!res.ok()) throw new Error(`register ${user.email}: ${res.status()}`)
  })
}

/** Log in via Payload REST; the auth cookie lands in the context's cookie jar. */
export async function loginUser(request: APIRequestContext, user: TestUser): Promise<void> {
  await withRetry(async () => {
    const res = await request.post('/api/users/login', {
      data: { email: user.email, password: user.password },
    })
    if (!res.ok()) throw new Error(`login ${user.email}: ${res.status()}`)
  })
}

/**
 * Fast path used by journeys that need an authenticated session but are not
 * themselves testing the register/login UI. Shares the page's cookie jar.
 */
export async function registerAndLogin(page: Page, tag: string): Promise<TestUser> {
  const user = freshUser(tag)
  await registerUser(page.request, user)
  await loginUser(page.request, user)
  return user
}

/** Resolve a published post's numeric id by slug via Payload REST (public read). */
export async function getPostId(
  request: APIRequestContext,
  locale: 'tr' | 'en',
  slug: string,
): Promise<number> {
  return withRetry(async () => {
    const res = await request.get(
      `/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&locale=${locale}&limit=1&depth=0`,
    )
    if (!res.ok()) throw new Error(`posts lookup for ${slug}: ${res.status()}`)
    const body = (await res.json()) as { docs: { id: number }[] }
    expect(body.docs.length, `post ${slug} should exist`).toBeGreaterThan(0)
    return body.docs[0].id
  })
}

/**
 * Toggle a reaction through the app API using the context's session cookie.
 * Used for setup/teardown so UI journeys stay lean.
 */
export async function toggleReaction(
  request: APIRequestContext,
  kind: 'likes' | 'bookmarks',
  postId: number,
): Promise<{ active: boolean; count: number }> {
  return withRetry(async () => {
    const res = await request.post('/api/reactions', { data: { kind, postId } })
    if (!res.ok()) throw new Error(`toggle ${kind} on ${postId}: ${res.status()}`)
    return (await res.json()) as { active: boolean; count: number }
  })
}

/** Current reaction state for a post as seen by the context's session. */
export async function reactionState(
  request: APIRequestContext,
  postId: number,
): Promise<{
  isLoggedIn: boolean
  likes: { active: boolean; count: number }
  bookmarks: { active: boolean; count: number }
}> {
  return withRetry(async () => {
    const res = await request.get(`/api/reactions/state?postId=${postId}`)
    if (!res.ok()) throw new Error(`reactions/state for ${postId}: ${res.status()}`)
    return res.json()
  })
}

/** Force the session user's reaction of `kind` into the desired state. */
export async function setReaction(
  request: APIRequestContext,
  kind: 'likes' | 'bookmarks',
  postId: number,
  active: boolean,
): Promise<void> {
  const state = await reactionState(request, postId)
  if (state[kind].active !== active) {
    await toggleReaction(request, kind, postId)
  }
}

/**
 * Best-effort cleanup: remove the session user's likes/bookmarks on a post so
 * repeated runs don't accumulate counts. Never fails the test.
 */
export async function cleanupReactions(
  request: APIRequestContext,
  postId: number,
): Promise<void> {
  try {
    await setReaction(request, 'likes', postId, false)
    await setReaction(request, 'bookmarks', postId, false)
  } catch {
    // cleanup is best-effort by design
  }
}

/**
 * Route-level shield for UI toggle clicks: transparently retry the
 * POST /api/reactions exchange if the connection dies mid-flight (see
 * withRetry rationale), so the optimistic UI never silently reverts on a
 * transport blip. Real HTTP statuses (401/404/…) pass through untouched.
 */
export async function shieldReactionPosts(page: Page): Promise<void> {
  await page.route('**/api/reactions', async (route) => {
    if (route.request().method() !== 'POST') return route.continue()
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await route.fetch()
        return await route.fulfill({ response })
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)))
      }
    }
    return route.abort()
  })
}
