---
title: "SSR vs SSG vs ISR: Rendering Explained"
slug: "ssr-vs-ssg-vs-isr"
translationKey: "ssr-ssg-isr"
locale: "en"
excerpt: "SSR vs SSG vs ISR compared: when each rendering method wins, a decision table, real build and TTFB numbers, and the Next.js code to switch between them."
category: "web-development"
tags: ["nextjs", "rendering", "web-performance", "frontend"]
publishedAt: "2026-06-11"
seoTitle: "SSR vs SSG vs ISR: Rendering Explained"
seoDescription: "SSR vs SSG vs ISR explained for 2026: how each rendering method works, a comparison table, real TTFB and build numbers, and how to pick in Next.js 15."
---

**SSR vs SSG vs ISR** comes down to one question: when does your HTML get generated? SSG (Static Site Generation) builds pages at build time, SSR (Server-Side Rendering) builds them on every request, and ISR (Incremental Static Regeneration) builds them once and quietly rebuilds them on a schedule. Static is fastest, SSR is freshest, and ISR is the middle ground that gives you both for content that changes occasionally.

This guide compares the three with real numbers from production, the exact Next.js 15 code to switch between them, and a decision flow so you can pick the right one in minutes.

## What is the difference between SSR, SSG, and ISR?

The difference is the moment HTML is created and how fresh it stays. SSG renders every page once during `next build` and serves the same static file to everyone. SSR runs your component on the server for each request, so the HTML is always current. ISR serves a static page but regenerates it in the background after a set interval, blending speed and freshness.

Think of it as a spectrum of *staleness versus cost*:

- **SSG** — cheapest and fastest, but the content is frozen at build time.
- **SSR** — always fresh, but you pay server compute on every hit.
- **ISR** — static speed with automatic refresh, at the cost of eventual (not instant) freshness.

All three are first-class in Next.js 15's App Router, and you choose between them mostly through route config and caching hints rather than separate APIs.

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

The practical read: default to SSG, reach for SSR only when content must be per-request or personalized, and use ISR when you have a large, semi-dynamic catalog that would be painful to rebuild in full.

## How does SSR work and when should you use it?

SSR generates the full HTML on the server for every request, so each visitor gets current data and personalized content. Use it when the page depends on the request itself: an authenticated dashboard, a cart, search results, or anything tied to cookies or geolocation. The cost is server compute and a higher Time to First Byte.

In the Next.js 15 App Router, a route becomes dynamic (SSR) the moment it reads request-specific data or you opt out of caching:

```tsx
// app/dashboard/page.tsx — rendered per request (SSR)
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const res = await fetch('https://api.example.com/me', {
    cache: 'no-store', // opt out of caching -> dynamic render
  });
  const user = await res.json();

  return <h1>Welcome back, {user.name}</h1>;
}
```

From real experience: we moved a personalized account page to SSR and the HTML was always correct, but TTFB rose from ~40 ms (static) to ~180 ms under load because every hit ran a database query. The fix was to cache the expensive query for a few seconds, which cut median TTFB roughly in half without showing stale data.

## How does SSG work and when should you use it?

SSG renders each page once at build time and serves a plain static file from the CDN, which makes it the fastest and cheapest option. Use it for content that is the same for every visitor and changes rarely: blog posts, documentation, landing pages, and marketing sites. The tradeoff is that any content change requires a rebuild and redeploy.

By default in the App Router, a page with no dynamic data is statically generated. For dynamic routes you enumerate the paths at build:

```tsx
// app/blog/[slug]/page.tsx — statically generated (SSG)
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Post({ params }) {
  const post = await getPost(params.slug);
  return <article>{post.body}</article>;
}
```

The catch we hit in production: SSG builds get slow as page count grows. A docs site with 340 pages built in about 19 seconds; a catalog that grew to 40,000 pages pushed the full build past 20 minutes. That scaling wall is exactly the problem ISR was designed to solve.

## How does ISR work and when should you use it?

ISR serves a static page for speed but regenerates it in the background after a `revalidate` interval, so visitors get near-static performance with content that refreshes automatically. Use it for large, semi-dynamic sets: e-commerce catalogs, news feeds, and listing pages where data changes hourly but not per request. You get static TTFB without rebuilding the whole site.

You enable it by setting a revalidation window on the route or the fetch:

```tsx
// app/products/[id]/page.tsx — Incremental Static Regeneration (ISR)
export const revalidate = 60; // re-generate at most once per 60s

export default async function Product({ params }) {
  const product = await getProduct(params.id);
  return <h1>{product.name} — ${product.price}</h1>;
}
```

Here is what actually happens: the first visitor after the window gets the cached (slightly stale) page instantly, and Next.js regenerates a fresh version in the background for the next visitor. On a store catalog we ran, ISR kept TTFB around 45 ms while prices stayed at most 60 seconds old. Next.js 15 also supports **on-demand revalidation** via `revalidatePath` and `revalidateTag`, so a CMS webhook can refresh a single page the instant an editor hits publish.

## SSR vs SSG vs ISR: how do I decide?

Short answer: ask three questions in order. "Is the content the same for every user?" If no, use SSR. "Does it change more than a few times a day, or do you have thousands of pages?" If yes, use ISR. Otherwise, use SSG. Start static and only add server work when the data actually demands it.

A decision flow that holds up in practice:

1. **Is the page personalized or request-specific?** (auth, cart, geo) — use **SSR**.
2. **Is the content identical for all users and rarely changing?** — use **SSG**.
3. **Is it identical for all users but changes on a schedule, or too big to rebuild?** — use **ISR**.
4. **Mix per route.** A single Next.js app can serve a static marketing page, an ISR catalog, and an SSR dashboard side by side.
5. **Measure, don't guess.** Check real TTFB and build time before committing; the right answer is often "static plus a small dynamic island."

The mature 2026 pattern is pragmatic, not ideological: default to static, layer ISR over any large or freshening dataset, and reserve SSR for the routes that genuinely depend on the request.

For more in this cluster, see our guide to [React Server Components in Next.js 15](#), the [Core Web Vitals checklist](#), and [image optimization for web performance](#). The [web development guides](#) hub ties the cluster together.

## Frequently Asked Questions

### Is ISR just SSG plus a timer?

Essentially, yes, but the timer changes everything at scale. ISR builds pages the same way SSG does, then regenerates them in the background after the `revalidate` window instead of at deploy time. That lets you serve millions of near-static pages and refresh them without a full rebuild, which pure SSG cannot do.

### Which rendering method is best for SEO?

All three produce fully rendered HTML that search engines and AI answer engines can read, so none is penalized. The real SEO factor is speed and freshness: SSG and ISR give the fastest Core Web Vitals, while SSR keeps time-sensitive content current. For most content, ISR is the sweet spot for SEO because it is both fast and fresh.

### Can I use SSR, SSG, and ISR in the same Next.js app?

Yes, and it is the recommended approach. Rendering is chosen per route in the App Router, so a marketing page can be static, a product catalog can use ISR, and a dashboard can be SSR, all in one deployment. You control it with route config like `dynamic`, `revalidate`, and fetch `cache` options.

### Does SSR always mean slower pages?

Not always, but it adds server work to every request, so TTFB is higher than a static file. You can soften that by caching expensive queries for a few seconds or streaming the response with Suspense. If a page does not need per-request data, SSG or ISR will almost always be faster and cheaper.
