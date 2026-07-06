import type { CollectionBeforeValidateHook } from 'payload'
import { APIError } from 'payload'

/** Minimum password length enforced on the server for every auth write. */
export const MIN_PASSWORD_LENGTH = 8

/**
 * Server-side password policy for the auth collection. The frontend forms
 * already require 8+ characters, but a direct `POST /api/users` (or an admin
 * update) must not be able to set a weaker one. Only runs when a plaintext
 * password is present in the incoming data (create, or a password change).
 */
export const enforcePasswordPolicy: CollectionBeforeValidateHook = ({ data }) => {
  const password = (data as { password?: unknown } | undefined)?.password
  if (
    typeof password === 'string' &&
    password.length > 0 &&
    password.length < MIN_PASSWORD_LENGTH
  ) {
    throw new APIError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`, 400)
  }
  return data
}
