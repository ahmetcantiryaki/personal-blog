import { z } from 'zod'

import { LOCALES } from '@/i18n/config'

/**
 * Request-boundary validation schemas for the custom API route handlers.
 * Kept in one pure module so the contract is unit-testable in isolation without
 * booting Payload, and so every route validates identically.
 */

/**
 * Only locale-prefixed frontend paths are trackable. Anything else (probes,
 * bots hitting `/wp-admin`, `/api/...`) is rejected so it can't grow junk rows
 * in `pageViews`.
 */
const LOCALE_PATH_RE = new RegExp(`^/(${LOCALES.join('|')})(/|$)`)

/** Body of `POST /api/track` — anonymous page-view increment. */
export const trackBodySchema = z.object({
  path: z
    .string()
    .trim()
    .min(1)
    .max(2048)
    .regex(LOCALE_PATH_RE, 'Path must be a locale-prefixed route'),
  slug: z.string().trim().min(1).max(512).optional(),
})
export type TrackBody = z.infer<typeof trackBodySchema>

/** Body of `POST /api/reactions` — toggle a like/bookmark. */
export const reactionBodySchema = z.object({
  kind: z.enum(['likes', 'bookmarks']),
  postId: z.coerce.number().int().positive(),
})
export type ReactionBody = z.infer<typeof reactionBodySchema>

/** Query of `GET /api/reactions/state` — hydrate counts + active flags. */
export const reactionStateQuerySchema = z.object({
  postId: z.coerce.number().int().positive(),
})
export type ReactionStateQuery = z.infer<typeof reactionStateQuerySchema>

/** Query of `GET /api/post-alternates` — resolve per-locale paired slugs. */
export const postAlternatesQuerySchema = z.object({
  slug: z.string().trim().min(1).max(512),
  from: z.enum(LOCALES),
})
export type PostAlternatesQuery = z.infer<typeof postAlternatesQuerySchema>
