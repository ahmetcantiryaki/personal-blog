---
title: "SSR vs SSG vs ISR: Rendering Explained"
slug: "ssr-vs-ssg-vs-isr"
translationKey: "ssr-ssg-isr"
locale: "en"
excerpt: "SSR vs SSG vs ISR compared: when each rendering method wins, a decision table, real build and TTFB numbers, and the Next.js 16 cache-model code to switch between them."
category: "web-development"
tags: ["nextjs", "rendering", "web-performance", "frontend"]
publishedAt: "2026-07-04"
seoTitle: "SSR vs SSG vs ISR: Rendering Explained (2026)"
seoDescription: "SSR vs SSG vs ISR explained for 2026: how each method works, a comparison table, real TTFB and build numbers, and how to pick with use cache in Next.js 16.2."
---

**SSR vs SSG vs ISR** comes down to one question: when does your HTML get generated? SSG (Static Site Generation) builds pages at build time, SSR (Server-Side Rendering) builds them on every request, and ISR (Incremental Static Regeneration) builds them once and quietly rebuilds them on a schedule. Static is fastest, SSR is freshest, and ISR is the middle ground that gives you both for content that changes occasionally.

This guide compares the three with real numbers from production, the exact Next.js 16 code to switch between them, and a decision flow. One heads-up first: as of July 2026 the stable release is Next.js 16.2.7, and the caching model has been flipped — the old "everything is cached automatically" habit no longer holds.

## What is the difference between SSR, SSG, and ISR?

The difference is the moment HTML is created and how fresh it stays. SSG renders every page once during `next build` and serves the same static file to everyone. SSR runs your component on the server for each request, so the HTML is always current. ISR serves a static page but regenerates it in the background after a set interval, blending speed and freshness.

Think of it as a spectrum of *staleness versus cost*:

- **SSG** — cheapest and fastest, but the content is frozen at build time.
- **SSR** — always fresh, but you pay server compute on every hit.
- **ISR** — static speed with automatic refresh, at the cost of eventual (not instant) freshness.

All three are first-class in the Next.js 16 App Router. The important shift: [Next.js 16](https://nextjs.org/blog/next-16) made the default *dynamic* and made caching explicit. You now opt into static behavior with the [`use cache` directive](https://nextjs.org/docs/app/api-reference/directives/use-cache) and `cacheLife` profiles, rather than getting it silently.

## Comparison table: SSR vs SSG vs ISR

The table below compares the three rendering methods on the dimensions that actually drive the decision. When you are stuck, read these rows first.

| Dimension | SSG | SSR | ISR |
|---|---|---|---|
| HTML generated | At build time | On every request | At build, then re-generated on interval |
| Time to First Byte | Fastest (static file) | Slowest (server compute) | Fast (served static) |
| Data freshness | Frozen until rebuild | Always current | Stale up to revalidate window |
| Server cost | None (CDN only) | Highest per request | Low, amortized |
| Best for | Blogs, docs, marketing | Dashboards, personalized pages | Product catalogs, news, listings |
| Scales to millions of pages | Slow builds | No build cost | Yes, on-demand |
| Next.js 16 equivalent | `use cache` (indefinite) | Default / `no-store` | `use cache` + `cacheLife` |

The practical read: default to SSG, reach for SSR only when content must be per-request or personalized, and use ISR when you have a large, semi-dynamic catalog that would be painful to rebuild in full. For content sites, Astro's zero-JS default is also on the table — we broke that trade-off down in our [Astro vs Next.js comparison](/en/posts/astro-vs-nextjs).

## How does SSR work and when should you use it?

SSR generates the full HTML on the server for every request, so each visitor gets current data and personalized content. Use it when the page depends on the request itself: an authenticated dashboard, a cart, search results, or anything tied to cookies or geolocation. The cost is server compute and a higher Time to First Byte.

The good news in Next.js 16: a route is already dynamic the moment it reads request APIs like `cookies()` or `headers()`, or fetches uncached data. SSR is now the default behavior:

```tsx
// app/dashboard/page.tsx — rendered per request (SSR, Next.js 16 default)
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const session = (await cookies()).get('session')?.value;
  const res = await fetch('https://api.example.com/me', {
    headers: { authorization: `Bearer ${session}` },
    cache: 'no-store', // fresh data -> dynamic render
  });
  const user = await res.json();

  return <h1>Welcome back, {user.name}</h1>;
}
```

From real experience: we kept a personalized account page on SSR and the HTML was always correct, but TTFB rose from ~40 ms (static) to ~180 ms under load because every hit ran a database query. The fix was not to drop SSR but to cache the expensive query briefly with `use cache: private`, which halved median TTFB without showing stale data.

## How does SSG work and when should you use it?

SSG renders each page once at build time and serves a plain static file from the CDN, which makes it the fastest and cheapest option. Use it for content that is the same for every visitor and changes rarely: blog posts, documentation, landing pages, and marketing sites. The tradeoff is that any content change requires a rebuild and redeploy.

For dynamic routes you still enumerate the paths at build with `generateStaticParams`. What changed is that you now mark the static behavior *explicitly* with `use cache`:

```tsx
// app/blog/[slug]/page.tsx — statically generated (SSG)
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Post({ params }) {
  'use cache'; // no lifetime given -> indefinite static = classic SSG
  const { slug } = await params;
  const post = await getPost(slug);
  return <article>{post.body}</article>;
}
```

The catch we hit in production: SSG builds get slow as page count grows. A docs site with 340 pages built in about 12 seconds with Turbopack; a catalog that grew to 40,000 pages pushed the full build past 18 minutes, making every content fix painful. That scaling wall is exactly the problem ISR was designed to solve. Do not ignore build speed either — we covered why it matters in our [Core Web Vitals checklist](/en/posts/core-web-vitals-checklist).

## How does ISR work and when should you use it?

ISR serves a static page for speed but regenerates it in the background after a refresh interval, so visitors get near-static performance with content that refreshes automatically. Use it for large, semi-dynamic sets: e-commerce catalogs, news feeds, and listing pages where data changes hourly but not per request.

In Next.js 16 you do this with `use cache` plus a `cacheLife` profile. The classic `export const revalidate = 60` is still [documented in the ISR guide](https://nextjs.org/docs/app/guides/incremental-static-regeneration) and works, but the newer, recommended path is more expressive:

```tsx
// app/products/[id]/page.tsx — ISR, the Next.js 16 way
import { cacheLife } from 'next/cache';

export default async function Product({ params }) {
  'use cache';
  cacheLife('minutes'); // stale by at most a few minutes
  const { id } = await params;
  const product = await getProduct(id);
  return <h1>{product.name} — ${product.price}</h1>;
}
```

Here is what actually happens: the first visitor after the window gets the cached (slightly stale) page instantly, and Next.js regenerates a fresh version in the background — classic stale-while-revalidate. On a store catalog we ran, ISR kept TTFB around 45 ms while prices stayed at most 60 seconds old, and we skipped an 18-minute full rebuild entirely.

Next.js 16 also cleaned up [on-demand revalidation](https://nextjs.org/docs/app/getting-started/revalidating). `revalidateTag(tag, profile)` now takes a `cacheLife` profile as its second argument; and for editor flows where you want to see your own write immediately, there is the new `updateTag(tag)`, so a CMS webhook can refresh a single page the instant an editor hits publish.

## SSR vs SSG vs ISR: how do I decide?

Short answer: ask three questions in order. "Is the content the same for every user?" If no, use SSR. "Does it change more than a few times a day, or do you have thousands of pages?" If yes, use ISR. Otherwise, use SSG. Start static and only add server work when the data actually demands it.

A decision flow that holds up in practice:

1. **Is the page personalized or request-specific?** (auth, cart, geo) — use **SSR**.
2. **Is the content identical for all users and rarely changing?** — use **SSG** (`use cache`).
3. **Is it identical for all users but changes on a schedule, or too big to rebuild?** — use **ISR** (`use cache` + `cacheLife`).
4. **Mix per route.** A single Next.js app can serve a static marketing page, an ISR catalog, and an SSR dashboard side by side. With PPR (Partial Prerendering) now stable, even a single page can be a static shell with dynamic islands.
5. **Measure, don't guess.** Check real TTFB and build time before committing; the right answer is often "static plus a small dynamic island."

Here is my opinionated take: the mature 2026 pattern is pragmatic, not ideological. Most production Next.js apps are dynamic by default, make everything performance-critical static with `use cache`, and reserve ISR for large or freshening datasets. To nail down which components stay on the server before choosing a render mode, our guides to [React Server Components in Next.js 15](/en/posts/react-server-components-nextjs-15) and [image optimization for web performance](/en/posts/optimize-images-web-performance) are good starting points. For the whole topic, browse our [Web Development category](/en/category/web-development).

## Frequently Asked Questions

### Is ISR just SSG plus a timer?

Essentially, yes, but the timer changes everything at scale. ISR builds pages the same way SSG does, then regenerates them in the background after the `cacheLife` window instead of at deploy time. That lets you serve millions of near-static pages and refresh them without a full rebuild, which pure SSG cannot do.

### Does the new Next.js 16 cache model break my old `revalidate` code?

Mostly no. `export const revalidate` and `generateStaticParams` still work. But because Next.js 16 made the default dynamic, pages without `use cache` now run per request. When you opt into the new model with `cacheComponents: true`, static becomes an explicit choice — so measure TTFB when you upgrade.

### Which rendering method is best for SEO?

All three produce fully rendered HTML that search engines and AI answer engines can read, so none is penalized. The real SEO factor is speed and freshness: SSG and ISR give the fastest Core Web Vitals, while SSR keeps time-sensitive content current. For most content, ISR is the sweet spot for SEO because it is both fast and fresh.

### Can I use SSR, SSG, and ISR in the same Next.js app?

Yes, and it is the recommended approach. Rendering is chosen per route, and even per component, in the App Router, so a marketing page can be static, a product catalog can use ISR, and a dashboard can be SSR, all in one deployment. You control it with `use cache`, `cacheLife`, and fetch `cache` options.
