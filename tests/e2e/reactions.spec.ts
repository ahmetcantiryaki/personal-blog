import { expect, test, type Locator, type Page } from '@playwright/test'

import {
  cleanupReactions,
  getPostId,
  reactionState,
  registerAndLogin,
  shieldReactionPosts,
  toggleReaction,
  TR_POST_SLUG,
} from './helpers/api'

/**
 * Journey 7 — Like + bookmark toggle: counts increment, state survives reload
 * (hydrated via /api/reactions/state), profile lists the post, unlike works.
 * Journey 8 — Unauthenticated like redirects to login with returnTo.
 *
 * Hydration note: the post page is ISR/static; the viewer's active flags (and
 * isLoggedIn) arrive client-side from /api/reactions/state. To interact
 * deterministically, the authenticated test pre-sets a bookmark via API and
 * waits for its aria-pressed=true — observable proof that the hydration state
 * (including isLoggedIn) has been applied before any click.
 *
 * Reliability note (reported to the team): on Node 22.17.1, Next 15's request
 * body streaming intermittently dies under concurrent POSTs with
 * `TypeError: controller[kState].transformAlgorithm is not a function` — the
 * fetch fails at the network level (trace shows status -1), no row is written,
 * and the UI silently reverts its optimistic state. `shieldReactionPosts`
 * retries the transport transparently and `toggleViaUi` asserts on the exact
 * click→response exchange (single-flight; blind re-click loops double-toggle).
 */

const POST_PATH = `/tr/posts/${TR_POST_SLUG}`

function likeButton(page: Page): Locator {
  // aria-label toggles Beğen ↔ Beğenildi; the prefix matches both states.
  return page.getByRole('button', { name: /^Beğen/ })
}

function bookmarkButton(page: Page): Locator {
  // Inactive label is "Kaydet", active is "Kaydedildi" — note the differing
  // 6th letter (t/d), so a plain /^Kaydet/ prefix would miss the active state.
  return page.getByRole('button', { name: /^(Kaydet|Kaydedildi)$/ })
}

/**
 * Toggle via the UI with single-flight semantics: register the response
 * listener BEFORE one click, then assert on that exact exchange. Never blind
 * re-clicks in a poll loop — a slow in-flight POST plus a re-click would
 * double-toggle and undo itself. Only retries when the exchange produced no
 * response at all (transport died despite the route shield).
 */
async function toggleViaUi(page: Page, button: Locator, target: boolean): Promise<void> {
  await expect(async () => {
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/reactions') && res.request().method() === 'POST',
      { timeout: 8_000 },
    )
    await button.click()
    const response = await responsePromise
    expect(response.ok(), `toggle POST -> ${response.status()}`).toBe(true)
    await expect(button).toHaveAttribute('aria-pressed', String(target), { timeout: 3_000 })
  }).toPass({ timeout: 30_000 })
}

test.describe('reactions (authenticated)', () => {
  test('like + bookmark toggle, survive reload, appear on profile, unlike works', async ({
    page,
  }) => {
    await shieldReactionPosts(page)
    await registerAndLogin(page, 'reactions')
    const postId = await getPostId(page.request, 'tr', TR_POST_SLUG)

    try {
      // Pre-set a bookmark via API: its aria-pressed=true is the hydration
      // barrier for every page load in this test.
      await toggleReaction(page.request, 'bookmarks', postId)

      await page.goto(POST_PATH)
      const bookmark = bookmarkButton(page)
      await expect(bookmark).toHaveAttribute('aria-pressed', 'true')

      // --- Like via UI: state activates and the count reflects the server ---
      const likesBefore = (await reactionState(page.request, postId)).likes.count
      const like = likeButton(page)
      await toggleViaUi(page, like, true)

      const likesAfter = (await reactionState(page.request, postId)).likes.count
      expect(likesAfter).toBe(likesBefore + 1)
      await expect(like.locator('span.tabular-nums')).toHaveText(String(likesAfter))

      // --- Reload: active state re-hydrates from /api/reactions/state ---
      await page.reload()
      await expect(bookmarkButton(page)).toHaveAttribute('aria-pressed', 'true')
      await expect(likeButton(page)).toHaveAttribute('aria-pressed', 'true')

      // --- Profile lists the post under both tabs ---
      await page.goto('/tr/profile')
      await expect(page.getByRole('heading', { level: 1, name: 'Profilim' })).toBeVisible()

      await expect(page.getByRole('tab', { name: /Beğendiklerim \(1\)/ })).toBeVisible()
      await expect(page.locator(`article a[href="${POST_PATH}"]`).first()).toBeVisible()

      await page.getByRole('tab', { name: /Kaydettiklerim \(1\)/ }).click()
      await expect(
        page.getByRole('tabpanel').locator(`article a[href="${POST_PATH}"]`).first(),
      ).toBeVisible()

      // --- Unlike + un-bookmark via UI: counts decrement, state clears ---
      await page.goto(POST_PATH)
      const bookmark2 = bookmarkButton(page)
      await expect(bookmark2).toHaveAttribute('aria-pressed', 'true') // hydration barrier

      const like2 = likeButton(page)
      await toggleViaUi(page, like2, false)
      const likesFinal = (await reactionState(page.request, postId)).likes.count
      expect(likesFinal).toBe(likesBefore)
      await expect(like2.locator('span.tabular-nums')).toHaveText(String(likesFinal))

      await toggleViaUi(page, bookmarkButton(page), false)
      const bookmarksFinal = (await reactionState(page.request, postId)).bookmarks
      expect(bookmarksFinal.active).toBe(false)
    } finally {
      // Best-effort teardown so reruns don't accumulate counts (user may stay).
      await cleanupReactions(page.request, postId)
    }
  })
})

test.describe('reactions (anonymous)', () => {
  test('unauthenticated like redirects to login with returnTo', async ({ page }) => {
    await page.goto(POST_PATH)

    // Anonymous clicks redirect regardless of hydration timing (both the
    // pre-hydration default and the hydrated state have isLoggedIn=false).
    await likeButton(page).click()

    await expect(page).toHaveURL(/\/tr\/login\?returnTo=/)
    const returnTo = new URL(page.url()).searchParams.get('returnTo')
    expect(returnTo).toBe(POST_PATH)
    // The login page renders; completing it would return the reader to the post.
    await expect(page.getByRole('heading', { level: 1, name: 'Giriş yap' })).toBeVisible()
  })
})
