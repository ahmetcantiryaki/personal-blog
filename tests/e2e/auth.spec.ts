import { expect, test } from '@playwright/test'

import { freshUser, loginUser, registerUser } from './helpers/api'

/** Journey 6 — Register a fresh user via the UI; header shows the user menu. */

// The header auth widget (useCurrentUser) re-resolves the session on the
// `auth-changed` event the login/register forms fire, so the avatar menu
// appears right after the SPA redirect — no reload required.

test('register through the form auto-logs-in and shows the avatar menu (en)', async ({
  page,
}) => {
  const user = freshUser('register-ui')

  await page.goto('/en/register')
  await expect(page.getByRole('heading', { level: 1, name: 'Sign up' })).toBeVisible()

  const form = page.locator('form')
  await form.getByLabel('Name').fill(user.name)
  await form.getByLabel('Email').fill(user.email)
  await form.getByLabel('Password').fill(user.password)
  await form.getByRole('button', { name: 'Sign up' }).click()

  // Successful register + auto-login lands back on the home page; the header
  // re-resolves the session via the `auth-changed` event — no reload needed.
  await expect(page).toHaveURL(/\/en$/)

  const avatarButton = page.getByRole('button', { name: 'Account' })
  await expect(avatarButton).toBeVisible()

  // The menu carries the user's identity and profile/sign-out entries.
  await avatarButton.click()
  await expect(page.getByText(user.email)).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Sign out' })).toBeVisible()
})

test('client-side validation rejects a short password (en)', async ({ page }) => {
  await page.goto('/en/register')
  const form = page.locator('form')
  await form.getByLabel('Name').fill('E2E Short Pass')
  await form.getByLabel('Email').fill('e2e-shortpass@woyable.test')
  await form.getByLabel('Password').fill('short')
  await form.getByRole('button', { name: 'Sign up' }).click()

  await expect(page.getByText('Password must be at least 8 characters.')).toBeVisible()
  await expect(page).toHaveURL(/\/en\/register/)
})

test('login form signs in an existing user (tr)', async ({ page }) => {
  // Create the account via API (registration UI is covered above).
  const user = freshUser('login-ui')
  await registerUser(page.request, user)

  await page.goto('/tr/login')
  const form = page.locator('form')
  await form.getByLabel('E-posta').fill(user.email)
  await form.getByLabel('Şifre').fill(user.password)
  await form.getByRole('button', { name: 'Giriş yap' }).click()

  await expect(page).toHaveURL(/\/tr$/)

  // No reload: the header updates via the `auth-changed` event.
  await expect(page.getByRole('button', { name: 'Hesap' })).toBeVisible()
})

test('login rejects wrong credentials with a friendly error (en)', async ({ page }) => {
  const user = freshUser('bad-login')
  await registerUser(page.request, user)

  await page.goto('/en/login')
  const form = page.locator('form')
  await form.getByLabel('Email').fill(user.email)
  await form.getByLabel('Password').fill('definitely-wrong-1')
  await form.getByRole('button', { name: 'Sign in' }).click()

  // Next's route announcer is also role=alert; filter to the form error.
  await expect(
    page.getByRole('alert').filter({ hasText: 'Incorrect email or password.' }),
  ).toBeVisible()
  await expect(page).toHaveURL(/\/en\/login/)
})

test('API login sets a session usable by server pages (profile)', async ({ page }) => {
  const user = freshUser('api-session')
  await registerUser(page.request, user)
  await loginUser(page.request, user)

  await page.goto('/en/profile')
  await expect(page.getByRole('heading', { level: 1, name: 'My profile' })).toBeVisible()
  await expect(page.getByText(`Hi, ${user.name}`)).toBeVisible()
})
