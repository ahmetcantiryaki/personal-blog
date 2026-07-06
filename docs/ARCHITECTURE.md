# Woyable Blog — Architecture & Team Charter

A modern, multilingual, SEO-first blog platform. Not a "personal blog" — a full blog product
with reader accounts, likes/bookmarks, and analytics.

Production URL: https://woyable-test.vercel.app
Repo: github.com/ahmetcantiryaki/personal-blog (public, personal account)

## Tech Stack (FINAL — do not re-litigate)

- **Next.js 15** (App Router, RSC) — single app, Payload embedded
- **Payload CMS 3.x** — admin panel at `/admin`, Local API for data access
- **Database**: Supabase Postgres via `@payloadcms/db-postgres`
  - Local/migrations: session pooler (port 5432) → `DATABASE_URI`
  - Vercel runtime: transaction pooler (port 6543)
- **UI**: Tailwind CSS v4 + shadcn/ui (Radix primitives), `next-themes` for dark/light
- **Rich text**: Lexical (`@payloadcms/richtext-lexical`)
- **i18n**: two locales — `tr` (default) and `en`. Payload localization for content,
  route prefix `/[locale]/...` for the frontend, `next-intl` for UI strings.
- **Tests**: Vitest (unit/int) + Playwright (e2e)
- **No file uploads in v1**: Vercel has no persistent FS and we have no blob store token.
  Post cover images are generated OG-style via `next/og` (ImageResponse) + gradient/typography.
  The Media collection may exist but must not be required anywhere.

## Design Language

- Soft, cool, calm. NOT the generic "AI-generated" look (no purple-to-blue gradients on
  everything, no glassmorphism overload, no emoji headers).
- Neutral warm-gray base, one restrained accent color, generous whitespace,
  subtle borders (`border-border/50`), soft shadows, rounded-lg radii.
- Typography-led: readable serif or high-quality sans for article bodies, tight heading scale.
- Mobile-first: every page designed at 375px first, then scaled up.
- Dark AND light mode both first-class (test both).

## Data Model (Payload collections)

- `users` — auth-enabled. Fields: name, role (`admin` | `reader`). Public registration
  creates `reader`. Only `admin` accesses the Payload admin panel.
- `posts` — localized fields: title, excerpt, content (lexical), seo (title, description).
  Non-localized: slug (per-locale slugs via localized `slug` field — slug IS localized),
  category (rel), tags (rel, hasMany), publishedAt, readingTime, status (draft/published),
  coverStyle (enum used by the OG/cover generator).
- `categories` — localized title + slug, description.
- `tags` — localized title + slug.
- `likes` — user rel + post rel, unique compound. Access: owner create/delete.
- `bookmarks` — same shape as likes.
- `pageViews` — post rel (nullable for non-post pages), path, date (day), count.
  Incremented via `POST /api/track` route handler (SQL upsert, no auth).
- `globals`: `siteSettings` (site name, social links, footer text — localized).

## API Surface (custom route handlers under /app/api)

- `POST /api/track` — page view increment (rate-limit by IP+path best effort)
- Likes/bookmarks/auth go through Payload's built-in REST (`/api/users/login` etc.)
  or custom handlers using Payload Local API — keep consistent, validate everything.

## SEO Requirements (non-negotiable)

- `generateMetadata` on every route, canonical URLs, `hreflang` alternates (tr/en + x-default)
- Localized sitemaps (`/sitemap.xml` index → per-locale sitemaps), robots.txt
- JSON-LD: `Article`, `BreadcrumbList`, `WebSite` (+SearchAction), `Person` for author
- Dynamic OG images per post (`/[locale]/posts/[slug]/opengraph-image`)
- Semantic HTML (article, time, nav), Core Web Vitals friendly (static generation
  via `generateStaticParams` + ISR revalidate 300s for posts)
- RSS feed per locale (`/[locale]/feed.xml`)

## Conventions

- pnpm. TypeScript strict. Small files (<400 lines). Immutable patterns.
- All user input validated (zod at route boundaries).
- Never commit secrets — `.env` is gitignored, `.env.example` documents keys.
- Conventional commits (`feat:`, `fix:`, ...).

## Team (agent roster — Lead: Fable, the architect)

| Name   | Role                       | Scope |
|--------|----------------------------|-------|
| Deniz  | Backend/Payload engineer   | Scaffold, payload.config, collections, access control, track API |
| Mert   | Frontend engineer          | Design system, pages, theme, mobile UX |
| Zeynep | SEO & i18n engineer        | Metadata, sitemaps, JSON-LD, locale routing, RSS |
| Kerem  | Content lead               | 50 topics × TR/EN articles + seed pipeline |
| Elif   | QA engineer                | Vitest + Playwright e2e |
| Baran  | Reviewer                   | Code + security review |
| Selin  | DevOps                     | Build fixes, GitHub, Vercel deploy |

## Environment

- `DATABASE_URI`, `DATABASE_URI_TRANSACTION`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`
- Supabase project ref: `zlvlozscrooslgrsgdmm`, region eu-central-1
- Windows dev machine: Node 22, pnpm 8 — if a tool demands pnpm 9+, use `corepack` or npm.
