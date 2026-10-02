---
title: "How Do You Deploy a Frontend to the Edge?"
slug: "edge-deployment-frontend"
translationKey: "edge-deployment-frontend-2026"
locale: "en"
excerpt: "Short answer: run SSR, middleware and personalization at the edge, leave heavy database work to a regional server, and TTFB drops from 200ms to 30-50ms."
category: "web-development"
tags: ["frontend", "deployment", "performance", "cloud"]
publishedAt: "2026-10-02"
seoTitle: "Deploying Your Frontend to the Edge: A 2026 Guide"
seoDescription: "A practical guide to deploying your frontend to the edge: what runs well there, cold starts and runtime limits, data-locality gotchas, and the real TTFB gains."
---

Short answer: move server-side rendering, middleware, personalization, and A/B test logic to the edge, and leave heavy database queries and long-running jobs on a regional server. Get that split right and TTFB (time to first byte) drops from 150-250ms to 30-50ms — but edge runtimes come with hard limits like 30-50ms of CPU time and 128MB of memory, so not every workload belongs there.

## What is edge deployment, and why did it become standard in 2026?

Edge deployment means running your code at points geographically close to the user instead of in one regional data center. Platforms like Cloudflare Workers, Vercel Edge Functions, and Deno Deploy now handle full API logic and AI inference work within 50ms of the user worldwide, not just request routing and A/B testing.

The driver behind this shift is measurable: Cloudflare Workers' V8-isolate cold start time is under 5ms in most benchmarks — effectively zero from a user's perspective, roughly a 9x improvement over traditional serverless functions. Vercel's V8-based Edge Runtime lands in the 50-250ms range for cold starts; Vercel has pushed Fluid Compute, which keeps functions warm longer, to close that gap.

## What should run at the edge, and what shouldn't?

Workloads that belong at the edge: SSR, middleware, personalization, A/B test routing, and authentication checks. All of these need low latency and typically finish in milliseconds — exactly what the edge is built for.

Workloads that don't belong at the edge: large file processing, long-running batch jobs, libraries that need the full Node.js API surface (filesystem access, certain native modules), and database writes that require strong consistency in a single region. Edge functions typically carry a 10-30 second execution limit and a 128MB memory cap; traditional serverless functions can run for minutes and use gigabytes of memory.

| Criteria | Edge Runtime | Traditional Serverless |
|---|---|---|
| Cold start | <5ms (Cloudflare Workers) | 200-1000ms |
| CPU time limit | 30-50ms (10-30s on some platforms) | Minutes |
| Memory limit | 128MB | 1-10GB |
| Node.js API support | Limited (V8 isolate) | Full |
| Best workload | SSR, middleware, personalization | Batch processing, heavy compute |

## Why does data locality break edge performance?

Even if your edge function itself runs close to the user, if your database still sits in a single region, most of your latency win disappears at that database call. A request that starts in 10ms at the edge for a user in Singapore can still end up at 150ms of network latency if the database lives in Virginia — the total time ends up no better than a regional server.

The practical fix is to keep read-heavy data in an edge-adjacent KV store or a replicated database (Cloudflare D1, or a multi-region replica setup like PlanetScale's), while leaving writes in a single primary region. Workers support this pattern through KV, R2 (object storage), and Durable Objects (stateful edge compute).

## How do you deploy to the edge? An example middleware

This example shows a Next.js middleware running personalization logic in the edge runtime:

```typescript
export const config = { runtime: 'edge' }

export default async function middleware(request: Request) {
  const country = request.headers.get('x-vercel-ip-country') ?? 'US'
  const url = new URL(request.url)

  if (country === 'US' && !url.pathname.startsWith('/en')) {
    url.pathname = `/en${url.pathname}`
    return Response.redirect(url)
  }

  return new Response(null, { status: 200 })
}
```

This middleware redirects based on the user's country and runs in milliseconds at the edge — on a regional server, this check would add the full round-trip latency between the user and the server.

## How much does TTFB actually improve?

For an SSR page moved to the edge, the typical gain is TTFB dropping from 150-250ms to 30-50ms, and that difference is most visible for mobile users and users in distant regions. But that number depends entirely on the workload: if the function hits a remote database on every request, most of the gain evaporates at that call.

Don't rely on a single metric when measuring this — track TTFB alongside LCP and INP from Core Web Vitals. A page can have a lower TTFB and still feel slow to the user if client-side JavaScript hydration is heavy.

## What mistakes do teams most often make moving to the edge?

The most common mistake is a "move everything to the edge" approach. A team moves its SSR pages to the edge, then applies the same logic to API routes that run database queries, and ends up with functions that time out past the 30-50ms CPU limit. Measuring each function's actual runtime and memory footprint before migrating it prevents this mistake from the start.

The second common mistake is pulling in a Node.js library the edge runtime doesn't support — an image-processing library requiring filesystem access, for example — without noticing until it fails. This usually shows up as a "Module not supported" error at runtime, not at build time, so verifying your dependencies are edge-compatible before deploying matters.

## How does edge deployment affect cost?

Edge functions are typically billed per request and bounded by duration, so used correctly they can come out cheaper than traditional serverless functions — a short-lived function consumes fewer resources than a long-running server process. But if a team uses the edge for the wrong workload, like a long process requiring retry logic, timeouts and retries can push the cost above what a traditional server would have charged.

A practical comparison: for a middleware handling 10 million requests a month at an average 20ms runtime, edge costs typically come in 30-50% below a regional serverless function. But if that same workload runs longer than 2 seconds — pushing against the edge's limits — the cost comparison can flip, since timed-out requests get retried and billed again.

## When is a regional server still the better choice?

For workloads doing complex, multi-table database transactions, requiring strong consistency, or depending on the full Node.js ecosystem (specific native modules, filesystem access), a regional server is still simpler and more predictable. The edge's real strength is lightweight "read and decide" logic, not heavy "write and process" work.

If you're also deciding on a framework before committing to an edge architecture, see our [Astro vs Next.js](/en/posts/astro-vs-nextjs) comparison, and for runtime performance questions, [Bun vs Node.js](/en/posts/bun-vs-nodejs-2026-runtime) covers the tradeoffs. Building something that runs at the edge from the browser side, too? Our guide to [building a browser extension in 2026](/en/posts/build-browser-extension-2026) covers an adjacent deployment model.

## Frequently Asked Questions

### What's the difference between edge runtime and Node.js runtime?

Edge runtime runs on V8 isolates and doesn't support the full Node.js API surface, such as filesystem access, but its cold start is nearly instant. Node.js runtime supports the full API but can take 200-1000ms to cold start and uses more resources.

### Which workloads shouldn't move to the edge?

Large file processing, long-running batch jobs, libraries that depend on the full Node.js API, and database writes requiring strong consistency in a single region shouldn't move to the edge — they can exceed the edge's 30-50ms CPU time and 128MB memory limits.

### Does moving to the edge actually lower TTFB?

Yes, if your data source is also edge-adjacent — TTFB typically drops from 150-250ms to 30-50ms. But if the function hits a remote database on every request, most of that gain disappears into the network latency of that call.

### Is Cloudflare Workers faster than Vercel Edge Functions?

Cloudflare Workers' V8-isolate cold start is under 5ms in most benchmarks, while Vercel's Edge Runtime lands at 50-250ms, though Fluid Compute narrows that gap by keeping functions warm longer. The right choice usually depends on which platform's broader ecosystem — storage tools like KV, R2, or D1 — fits your stack.
