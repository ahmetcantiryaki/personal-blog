import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Payload/Next App Router. Frontend team will extend (images, i18n rewrites, etc.).
  reactStrictMode: true,
  images: {
    // Hand-drawn covers are fine ink crosshatch — the default q75 smears the
    // linework when downscaled into card slots, so PostCover requests q92.
    // Next only serves quality values listed here (90 kept for cache overlap
    // during rollout of the previous q90 build).
    qualities: [75, 90, 92],
  },
  // Baseline security headers on every response. No CSP (Payload admin + inline
  // styles make a correct policy high-maintenance). X-Frame-Options is
  // SAMEORIGIN rather than DENY so Payload admin live-preview can iframe the
  // frontend on the same origin.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ]
  },
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
