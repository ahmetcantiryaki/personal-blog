import type { Payload } from 'payload'

/**
 * Create the first admin user from ADMIN_EMAIL / ADMIN_PASSWORD if provided and
 * not already present. Passes a trusted context flag so the reader-role
 * enforcement hook does not downgrade this account.
 */
export const seedAdmin = async (payload: Payload): Promise<void> => {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    payload.logger.info('seed: ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin creation')
    return
  }

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    payload.logger.info(`seed: admin ${email} already exists — skipping`)
    return
  }

  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Admin', role: 'admin' },
    overrideAccess: true,
    context: { skipRoleEnforcement: true },
  })

  payload.logger.info(`seed: created admin ${email}`)
}
