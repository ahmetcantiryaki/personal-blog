// Stub for the `payload` package. Only the surface our modules import at load
// time is provided. `getPayload` throws if actually called without a test mock
// in place — unit tests mock `@/lib/payload#getPayloadClient` instead, so this
// path should never execute.
export async function getPayload(): Promise<never> {
  throw new Error(
    'payload#getPayload was called in a unit test. Mock @/lib/payload#getPayloadClient instead.',
  )
}

export type Payload = unknown
export type Where = unknown
