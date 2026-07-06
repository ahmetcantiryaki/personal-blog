import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Payload/Next 15 App Router. Frontend team will extend (images, i18n rewrites, etc.).
  reactStrictMode: true,
  experimental: {
    // Posts/categories/tags are prerendered (SSG + ISR) via generateStaticParams,
    // so the build renders 100+ pages that each hit Payload/Postgres. The Supabase
    // session pooler caps clients at 15, so keep static generation to a single
    // worker with bounded concurrency to stay under the connection limit.
    staticGenerationMaxConcurrency: 6,
    staticGenerationMinPagesPerWorker: 1000,
    // Retry a page whose prerender hits a transient Postgres blip (e.g. the
    // pooler briefly saturated during a concurrent reseed) instead of failing
    // the whole build on the first miss.
    staticGenerationRetryCount: 3,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
