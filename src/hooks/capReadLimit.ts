import type { CollectionBeforeOperationHook } from 'payload'

/**
 * Hard cap on the page size a public REST/GraphQL caller may request.
 * Payload 3.x has no per-collection `maxLimit`, so we enforce it here to stop an
 * anonymous client from pulling an unbounded result set (`?limit=100000` or
 * `?pagination=false`) against a public collection.
 */
export const MAX_READ_LIMIT = 100

/**
 * `beforeOperation` guard for public collections. Only external API traffic
 * (REST/GraphQL) is clamped — internal Local API callers (sitemap, seed,
 * server components) legitimately page through everything with
 * `pagination: false` and are left untouched.
 */
export const capReadLimit: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (operation !== 'read') return args
  if (req.payloadAPI !== 'REST' && req.payloadAPI !== 'GraphQL') return args

  // `read` covers both find and findByID; only find carries limit/pagination.
  const findArgs = args as { limit?: number; pagination?: boolean }
  const overLimit =
    typeof findArgs.limit === 'number' && (findArgs.limit <= 0 || findArgs.limit > MAX_READ_LIMIT)
  const noPagination = findArgs.pagination === false
  if (!overLimit && !noPagination) return args

  return { ...args, limit: MAX_READ_LIMIT, pagination: true }
}
