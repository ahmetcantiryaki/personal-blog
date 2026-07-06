// Stub for the `@payload-config` alias. The real config boots the Postgres
// adapter and every collection; unit tests never touch a real DB, so we hand
// back an inert object. Modules that import it (e.g. src/lib/payload.ts) only
// pass it to `getPayload`, which is itself stubbed in payload-pkg.ts.
export default {}
