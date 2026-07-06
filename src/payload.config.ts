import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'

import { Bookmarks } from '@/collections/Bookmarks'
import { Categories } from '@/collections/Categories'
import { Likes } from '@/collections/Likes'
import { PageViews } from '@/collections/PageViews'
import { Posts } from '@/collections/Posts'
import { Tags } from '@/collections/Tags'
import { Users } from '@/collections/Users'
import { SiteSettings } from '@/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** Origins allowed for CORS/CSRF. Extend via NEXT_PUBLIC_SERVER_URL per env. */
const allowedOrigins = Array.from(
  new Set([serverURL, 'http://localhost:3000'].filter(Boolean)),
)

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Woyable Blog',
    },
  },
  collections: [Users, Posts, Categories, Tags, Likes, Bookmarks, PageViews],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  localization: {
    locales: [
      { label: 'Türkçe', code: 'tr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'tr',
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    // Schema changes flow through migrations only — never auto-push to a
    // shared remote database.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  cors: allowedOrigins,
  csrf: allowedOrigins,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // No file uploads in v1 → sharp intentionally omitted.
})
