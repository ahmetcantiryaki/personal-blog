import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Dev/maintenance utility: delete all content rows (posts, taxonomy, reactions,
 * page views, siteSettings) while preserving users. Runs raw SQL through
 * Payload's own connection pool so it works even before pending schema
 * migrations are applied. Never invoked by the seed itself — run explicitly:
 *   pnpm payload run src/seed/wipe.ts
 */
const run = async (): Promise<void> => {
  const payload = await getPayload({ config })

  // FK-safe order: child/relationship tables before their parents.
  const statements = [
    'DELETE FROM posts_rels',
    'DELETE FROM posts_locales',
    'DELETE FROM likes',
    'DELETE FROM bookmarks',
    'DELETE FROM page_views',
    'DELETE FROM posts',
    'DELETE FROM categories_locales',
    'DELETE FROM categories',
    'DELETE FROM tags_locales',
    'DELETE FROM tags',
    'DELETE FROM site_settings_locales',
    'DELETE FROM site_settings_social_links',
    'DELETE FROM site_settings',
    'DELETE FROM payload_locked_documents_rels',
    'DELETE FROM payload_locked_documents',
  ]

  // The postgres adapter exposes the underlying node-pg pool.
  const pool = (payload.db as unknown as { pool: { query: (sql: string) => Promise<unknown> } }).pool

  for (const statement of statements) {
    await pool.query(statement)
    payload.logger.info(`wipe: ${statement}`)
  }

  payload.logger.info('wipe: done')
  process.exit(0)
}

try {
  await run()
} catch (error) {
  console.error('wipe: failed', error)
  process.exit(1)
}
