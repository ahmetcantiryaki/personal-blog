import 'server-only'

import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

/**
 * Cached Payload Local API client for use in server components and route
 * handlers. `getPayload` already memoizes per-process, but we keep a thin
 * wrapper so call sites never import the raw config directly.
 */
export async function getPayloadClient(): Promise<Payload> {
  return getPayload({ config })
}
