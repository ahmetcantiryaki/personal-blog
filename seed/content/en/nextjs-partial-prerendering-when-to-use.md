---
title: "Next.js Partial Prerendering: When to Use It"
slug: "nextjs-partial-prerendering-when-to-use"
translationKey: "nextjs-partial-prerendering-2026"
locale: "en"
excerpt: "Short answer: use PPR when most of a page is shared but a small slice needs per-user data; it's shipped stable via Cache Components since Next.js 16."
category: "web-development"
tags: ["nextjs", "rendering", "performance", "web-performance"]
publishedAt: "2026-09-18"
seoTitle: "Next.js Partial Prerendering: When to Use It"
seoDescription: "Short answer: use PPR when most of a page is shared but a small slice needs per-user data; it's shipped stable via Cache Components since Next.js 16."
---

Short answer: reach for Partial Prerendering (PPR) when most of a page is identical for every visitor but a small part needs per-user data — the static shell serves instantly from the server while the dynamic part streams in behind a Suspense boundary. Since Next.js 16 (October 2025), PPR graduated from the experimental `experimental.ppr` flag to being the default behavior of an opt-in model called Cache Components.

## What is Next.js Partial Prerendering, and what problem does it solve?

PPR is a technique for mixing static and dynamic rendering in a single route: at build time, Next.js generates a static HTML shell plus a "postponed state" blob for the route; at request time, the shell serves immediately while the dynamic parts render on the server and stream into the shell. It solves a specific problem: on a product page where the description and images are static but stock status or a personalized price is dynamic, you can serve both without converting the whole page to full SSR.

Before PPR, the usual workarounds were either rendering the entire page dynamically (giving up the speed of the static parts) or fetching the dynamic slice client-side after the page loaded (an extra round trip and layout-shift risk). PPR removes that tradeoff.

## Is PPR stable in 2026, or still experimental?

Stable. As of Next.js 16, PPR became the App Router's default behavior as part of an opt-in model called Cache Components, and the `experimental.ppr` config flag along with the route-segment `experimental_ppr` setting are no longer necessary — both were removed. In practice, on a project running Next.js 16 or later you don't need to flip an experimental flag to get PPR; you adopt the `cacheComponents` model and place your Suspense boundaries correctly.

On Next.js 15 and earlier, PPR was still experimental and required a flag such as `experimental: { ppr: 'incremental' }` in `next.config.js` — teams on those versions were advised to test on a limited set of routes before shipping broadly.

## How does the static-shell-plus-Suspense flow actually work?

To use PPR on a route segment, wrap the component that reads dynamic data in a `Suspense` boundary; Next.js bakes everything else into the static shell at build time and streams the Suspense content in at request time.

```tsx
// app/products/[id]/page.tsx
import { Suspense } from 'react'

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Static shell: pre-rendered at build time */}
      <ProductHeader id={params.id} />
      <ProductDescription id={params.id} />

      {/* Dynamic hole: streams in at request time */}
      <Suspense fallback={<StockSkeleton />}>
        <LiveStockAndPrice id={params.id} />
      </Suspense>
    </div>
  )
}
```

When `LiveStockAndPrice` calls request-time APIs like `cookies()` or `headers()`, Next.js automatically treats that component as dynamic and excludes it from the static shell — you don't need to flag it yourself.

## PPR vs. Cache Components: what's the difference?

PPR is a rendering strategy that operates at the route-segment level, while Cache Components combines it with Dynamic IO and the `use cache` directive to offer a finer-grained model that works at the component boundary, below the route level. In Next.js 16, the `dynamicIO` flag was renamed to `cacheComponents`, and PPR now runs as part of that unified model.

The practical difference: PPR says "this segment of this route is dynamic," while Cache Components says "this specific function call is cacheable" — a function or component marked with `use cache` can be cached independently of the route segment it lives in. If you're starting a new project, designing around the Cache Components model from day one causes less friction than retrofitting it later.

## How does this affect caching and revalidation?

The static shell caches at the CDN like any other static page and revalidates based on your `revalidate` settings; the dynamic hole fetches fresh data on every request, so you need a separate caching strategy for it (for example, a short TTL via `use cache`). Updating the static shell still needs an ISR-style revalidation trigger, but the dynamic hole is recomputed on every request, so there's no "staleness" question for it.

A common mistake here is putting too much inside the dynamic hole. Keeping the Suspense boundary as narrow as possible — covering only genuinely per-user data like stock, price, or session state — maximizes how much of the page the static shell covers. Widen that boundary to cover half the page and you lose most of PPR's build-time advantage, since Next.js now has to render that expanded area at request time too.

## Does your deploy platform support PPR?

Short answer: it works out of the box on Vercel, since the platform is built to merge the static shell with streaming dynamic content in a single response; self-hosting on your own Node.js server or a different host means you need to verify streaming and `postponedState` support are configured correctly. Next.js's official PPR platform guide lists the extra configuration non-Vercel environments need.

## When is ISR or full SSR still the better call?

If an entire page is per-user (say, a dashboard that's entirely session-bound), you don't get PPR's static-shell benefit at all — full SSR gives you a simpler architecture in that case. If a page is identical for everyone and rarely changes (a blog post, say), you don't need PPR's added complexity; plain ISR is enough and means fewer moving parts.

PPR earns its keep in the middle ground — most of the page is static, but a small, genuinely per-user slice needs to be live. Typical examples are product pages, personalized recommendation strips, and session-bound notification badges.

| Strategy | Shell speed | Personalization | Complexity |
|---|---|---|---|
| Full SSR | Slow (server-rendered every request) | Fully supported | Low |
| SSG/ISR | Very fast (static + periodic refresh) | None/limited | Low |
| PPR | Instant (static shell) + streamed dynamic hole | Fully supported in the hole | Medium |

## Frequently Asked Questions

### When did Next.js Partial Prerendering become stable?

With Next.js 16, in October 2025; from that release, PPR became the default behavior of the opt-in Cache Components model and the experimental `experimental.ppr` flag was removed.

### Is PPR the same thing as ISR?

No. ISR re-statics an entire page at set intervals, while PPR combines a static shell with a genuinely real-time streaming dynamic section inside the same page — in PPR the dynamic part is fresh on every request, while in ISR the whole page refreshes periodically. You can also combine the two in one project: revalidate the static shell on an ISR schedule while leaving the dynamic hole inside it to PPR's Suspense streaming. For the full rendering-strategy comparison, see our [SSR vs SSG vs ISR guide](/en/posts/ssr-vs-ssg-vs-isr).

### What Next.js version do you need for PPR?

Next.js 16 or later is recommended, since PPR is stable there and doesn't need the `experimental.ppr` flag; on Next.js 15 and earlier it still runs behind an experimental flag, and limited testing before a production rollout is advised. If you're upgrading an older Next.js 14 project, moving to Next.js 15 first, trying incremental PPR on a few routes, then jumping to Next.js 16 for the full Cache Components model is a lower-risk path.

### Can I use PPR together with Edge Functions?

Yes — the static shell serves from the CDN while the dynamic hole can run on either the Edge or Node.js runtime; see our [Edge Functions and Rendering guide](/en/posts/edge-functions-rendering-guide) for more on edge rendering options.

For other Next.js rendering decisions, see our [React Server Components guide](/en/posts/react-server-components-nextjs-15), and for a broader framework comparison, our [Astro vs Next.js piece](/en/posts/astro-vs-nextjs). Browse more web development coverage in our [Web Development category](/en/category/web-development).

Sources: [Next.js's official PPR documentation](https://nextjs.org/docs/app/guides/ppr-platform-guide) and the [Next.js Cache Components documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents).
