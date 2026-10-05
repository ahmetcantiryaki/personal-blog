---
title: "Partial Prerendering: Static and Dynamic in One Page"
slug: "partial-prerendering-static-dynamic"
translationKey: "partial-prerendering-nextjs-2026"
locale: "en"
excerpt: "Short answer: Next.js 16 makes Partial Prerendering the default—a static shell ships instantly from the CDN while personalized parts stream in via Suspense."
category: "web-development"
tags: ["nextjs", "rendering", "web-performance", "server-components"]
publishedAt: "2026-10-05"
seoTitle: "Partial Prerendering: Static and Dynamic Together"
seoDescription: "Short answer: Next.js 16 makes Partial Prerendering the default—a static shell ships instantly from the CDN while personalized parts stream in via Suspense."
---

Short answer: a page no longer has to be entirely static or entirely dynamic. Partial Prerendering (PPR), the default rendering model as of Next.js 16, ships the page's unchanging shell straight from the CDN while the personalized pieces stream in behind Suspense boundaries, inside the same HTTP response. You get the speed of a static page and the relevance of a dynamic one, at the same time.

"Static or dynamic" has driven rendering-strategy debates for years, but it's a false choice for most real pages. A typical page in 2026 is 90% identical for every visitor and 10% personalized—a cart badge, a greeting, a recommendation strip. PPR exists specifically for that shape of page, not for the extremes.

## What is Partial Prerendering?

Partial Prerendering is Next.js's rendering model for combining static and dynamic content inside a single HTTP response. It shipped as stable in Next.js 16, released in October 2025, graduating out of experimental status and becoming the framework's default.

Previously, enabling it meant adding the `experimental.ppr` flag to `next.config.js`. Next.js 16 removed that flag entirely. In its place is `cacheComponents: true`, part of a broader feature called Cache Components. That removal is itself the signal: PPR stopped being a flag you opt into and became the baseline behavior teams build on.

Here's the mechanism in practice: when a request comes in, the server first sends the statically prerendered shell—header, navigation, product description, anything identical for every visitor—from the CDN's edge layer, instantly. Anything tied to the user or session—a cart icon, a "Welcome back" message, a recommendation rail—is wrapped in a Suspense boundary and streams in from the origin before that same response finishes.

## Static or dynamic—or both?

The honest answer: for most production pages, this is already the wrong question. A product page is typically 90% identical across visitors (images, description, price, reviews) and only a thin slice—a cart count, a "picked for you" rail—is personal to the viewer.

Older rendering models forced a binary choice on that page. Pick static site generation and personalization either gets bolted on client-side with JavaScript after the fact, or doesn't happen at all. Pick server-side rendering and the entire page recomputes on every request just because one small part of it is dynamic—losing the speed advantage the static majority of the page should have earned.

PPR removes that forced choice. Instead of deciding "static or dynamic" at the page level, a developer marks which individual components are actually dynamic, and the framework prerenders everything else as the shell and streams the marked holes. My take: moving that decision from the page to the component is the most practical rendering change of the last several years, precisely because real product pages were never one thing or the other to begin with.

## How does PPR actually work? Suspense and the static shell

A Suspense boundary is a React wrapper that shows a placeholder (a fallback) in place of a component until that component's data is ready. PPR uses this mechanism at build and request time: anything not wrapped in Suspense gets prerendered into the static shell at build time. Anything wrapped in Suspense is marked as a hole, and its real content is computed only at request time, on the origin server.

When a visitor opens the page, the browser gets exactly one HTTP response: it starts with the static shell, and the dynamic holes get appended to that same connection as a stream, as soon as each one's content is ready. The visitor sees and can interact with the shell immediately, even while the personalized pieces are still filling in behind it.

A minimal example looks like this:

```tsx
import { Suspense } from "react";
import { CartBadge } from "./cart-badge";
import { ProductInfo } from "./product-info";

export default function ProductPage() {
  return (
    <main>
      {/* Static shell: prerendered at build time */}
      <ProductInfo />

      {/* Dynamic hole: streamed from the origin at request time */}
      <Suspense fallback={<CartBadgeSkeleton />}>
        <CartBadge />
      </Suspense>
    </main>
  );
}
```

Turning this on takes one line in `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

## When does PPR actually help—and when doesn't it?

Short answer: PPR pays off when most of the page is static and the dynamic surface is a few bounded slots; it pays off far less when most of the page is already personalized. A news article, a product detail page, or a documentation page all fit the first shape—fixed content dominates, dynamic slots are small and countable.

A fully personalized feed or a user-specific dashboard, on the other hand, gets little out of PPR, because there's barely any shell left to prerender. Teams should profile which sections of a given page are genuinely static before reaching for PPR—otherwise they add configuration complexity without a measurable win.

Lining up the three models side by side:

| Metric | Fully Static | Fully Dynamic | PPR |
|---|---|---|---|
| TTFB (time to first byte) | Very low | High—recomputed every request | Low—shell is instant, holes stream in |
| Personalization | None, or client-side only | Full support | Full support on a bounded surface |
| Cache hit rate | Very high | Low or zero | High for the shell, low for the holes |
| Infrastructure cost | Low | High—origin handles every request | Moderate—origin only handles the holes |

## What's PPR's status in Next.js 16?

Short answer: Next.js 16, released in October 2025, ships PPR as stable and default, as part of the Cache Components feature. The `experimental.ppr` flag is gone from the codebase; the only thing left to do is set `cacheComponents: true` in `next.config.ts`.

That shift is exactly what moved PPR, by 2026, from "interesting experiment" to "default choice"—on sites where the dynamic surface stays bounded. On a page that's mostly personalized, PPR can still apply, but the payoff shrinks; the framework makes it possible, not mandatory.

## What does PPR do to caching and TTFB?

Short answer: TTFB—the time between a request and the first byte of the response—drops close to zero for the static shell because it's served straight from CDN cache; only the dynamic holes carry origin latency, and that latency is now streamed instead of blocking the whole page.

That changes how you think about cache strategy, too: the static shell follows classic CDN caching rules (long edge retention, invalidation at build time), while the dynamic holes can carry their own cache or revalidation rules independently. For a deeper framework on when and how to invalidate the shell, see our piece on [caching strategies and invalidation](/en/posts/caching-strategies-and-invalidation).

If you're weighing PPR against static site generators more broadly, [Astro vs. Next.js](/en/posts/astro-vs-nextjs) covers where island-based architectures land on a similar "keep what's dynamic dynamic, prerender the rest" idea. To see Suspense boundaries doing similar work in a streaming UI, [Streaming AI chat with the Vercel AI SDK](/en/posts/streaming-ai-chat-vercel-ai-sdk) is a useful companion read. And if origin runtime choice factors into your performance math, [Bun vs. Node.js](/en/posts/bun-vs-nodejs-2026-runtime) covers the other half of that equation.

For the primary sources, see the [Next.js PPR documentation](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering) and the [Next.js blog](https://nextjs.org/blog) for the Next.js 16 release notes.

## Frequently Asked Questions

### What Next.js version made Partial Prerendering stable?

Partial Prerendering became stable in Next.js 16, released in October 2025. The `experimental.ppr` flag is no longer needed—PPR is enabled through `cacheComponents: true` in `next.config.ts`, as part of the Cache Components feature, and it's the framework's default rendering behavior.

### What's the difference between PPR and SSR?

The difference comes down to scope: SSR recomputes the entire page on every request, even when only a small part of it is actually dynamic. PPR computes only the Suspense-marked dynamic parts at request time; the static shell is prerendered at build time and served instantly from the CDN.

### Should every page use PPR?

No. PPR earns its keep when most of a page is static and the dynamic surface is a handful of bounded slots. A page that's already fully personalized, like a user dashboard, has little static shell left to benefit from—adopting PPR there without profiling the page first just adds configuration overhead for no measurable gain.

### Does PPR work without a Suspense boundary?

No. PPR needs to know which components are dynamic in order to separate them from the static shell, and that marking happens through React's Suspense boundary. Anything not wrapped in Suspense is automatically treated as part of the static shell.
