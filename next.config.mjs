import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Payload/Next 15 App Router. Frontend team will extend (images, i18n rewrites, etc.).
  reactStrictMode: true,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
