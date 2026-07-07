---
title: "Core Web Vitals Checklist for 2026"
slug: "core-web-vitals-checklist"
translationKey: "core-web-vitals-checklist"
locale: "en"
excerpt: "A field-tested Core Web Vitals checklist for 2026: measure LCP, INP, and CLS with real CrUX data, fix the worst metric first, and verify with July 2026 tooling."
category: "web-development"
tags: ["core-web-vitals", "web-performance", "frontend", "seo"]
publishedAt: "2026-07-02"
seoTitle: "Core Web Vitals Checklist for 2026"
seoDescription: "A practical Core Web Vitals checklist for 2026: measure LCP, INP, and CLS with real CrUX field data and fix the most common issues step by step."
---

If dozens of site audits taught us one thing, it's this: Core Web Vitals work starts with data, not guesses. Memorize the three thresholds and get under them: **LCP below 2.5 seconds**, **INP below 200 milliseconds**, **CLS below 0.1**. This Core Web Vitals checklist gets you measuring with real user data (CrUX) instead of fiddling with Lighthouse scores, closing the metric that bleeds the most first, and turning pages green fast.

Work the steps in order and you'll stop asking "is this the thing slowing us down?" and go straight for the issue that actually moves the needle.

## What do Core Web Vitals measure in 2026?

Core Web Vitals are Google's set of metrics summarizing user experience across three dimensions: loading (LCP), responsiveness (INP), and visual stability (CLS). INP replaced FID in March 2024, and as of July 2026 all three are ranking signals on mobile and desktop. The goal is passing the threshold at the **75th percentile** of your field data — meaning even the slowest quarter of your real visitors has to stay under it.

Our experience is blunt: of the three, INP is the hardest to pass. LCP and CLS you can tidy up with a few correct `preload`s and size declarations; INP won't budge until you pay down the JavaScript debt on the main thread.

| Metric | What it measures | Good | Needs work | Poor |
|--------|------------------|------|------------|------|
| LCP | Time for largest content to render | ≤ 2.5 s | 2.5–4.0 s | > 4.0 s |
| INP | Delay in responding to interactions | ≤ 200 ms | 200–500 ms | > 500 ms |
| CLS | Unexpected layout shifts | ≤ 0.1 | 0.1–0.25 | > 0.25 |

## The Core Web Vitals checklist (step by step)

Follow this order for the fastest wins. Each step builds on the data from the last, so don't skip ahead:

1. **Pull your field data.** Use PageSpeed Insights or the CrUX Dashboard to get the 75th-percentile values from the last 28 days. Field scores decide, not lab scores.
2. **Pick the worst metric.** Don't fix all three at once; put the metric that overshoots its threshold the most at the top.
3. **Identify the LCP element.** In the Chrome DevTools Performance panel, look at the "LCP" marker; it's usually a hero image or heading block.
4. **Prioritize the LCP resource.** Add `fetchpriority="high"` to the hero image, `preload` it, and remove lazy-loading from that element.
5. **Free up the main thread.** Break up long tasks (over 50 ms), `defer` third-party scripts, or move work to a web worker; this directly lowers INP.
6. **Lock down layout shifts.** Set `width`/`height` on every `<img>` and `<video>`, and reserve fixed height for ad and embed slots.
7. **Stabilize your fonts.** Use `font-display: optional` or `swap` and `preload` your critical font.
8. **Re-measure and ship.** Deploy the change, wait 28 days for the CrUX window to update, then move to the next metric.

## How do I get LCP under 2.5 seconds?

The most effective way to lower LCP is to start downloading the largest visible element as early as possible. The usual culprit is a late-discovered hero image, render-blocking CSS, or a slow server response (TTFB). Identify the LCP element first, then remove every delay in its download path.

The three interventions that pay off most in practice:

- **`fetchpriority="high"` + `preload`:** Makes the browser fetch the hero image before other resources. On one e-commerce client, this single change dropped LCP from 3.8 s to 2.3 s.
- **Cut your TTFB:** Get the server response under 600 ms; a CDN, edge cache, and static generation (SSG/ISR) are decisive here.
- **Defer render-blocking resources:** Inline critical CSS and load the rest asynchronously.

```html
<!-- Fetch the LCP hero image early and with priority -->
<link rel="preload" as="image" href="/hero.avif" fetchpriority="high" />
<img src="/hero.avif" width="1200" height="600" fetchpriority="high" alt="Product image" />
```

Switching to modern image formats (AVIF, WebP) and sizing correctly with `srcset` frees up a lot of your LCP budget — see our [guide to optimizing images for web performance](/en/posts/optimize-images-web-performance). Which rendering strategy to use to speed up that server response is exactly what our [SSR vs SSG vs ISR breakdown](/en/posts/ssr-vs-ssg-vs-isr) covers.

## Why does INP spike, and how do I fix it?

INP usually spikes because the main thread is clogged with long tasks. When a user taps a button and the browser is busy, the response is delayed and INP jumps. The fix is to shrink your JavaScript, split long tasks, and keep interaction logic as lightweight as possible.

Where to focus:

- **Audit third-party scripts.** Analytics, chat, and ad scripts are the most common INP offenders. Use `async`/`defer` or load them after the first interaction.
- **Break up long tasks.** `scheduler.yield()` gives the main thread room to breathe while letting the task keep its place in the queue. As of July 2026 it ships in Chrome and Firefox 142; since it isn't in every browser yet, keep a `setTimeout` fallback.
- **Kill unnecessary React re-renders.** Reduce wasted work with `useMemo`, `useCallback`, and list virtualization.
- **Use `content-visibility: auto`.** Deferring the render cost of off-screen sections speeds up interaction response.

On the framework side, your hydration strategy matters too. We covered how server components and selective hydration affect INP in detail in our [React Server Components in Next.js 15 guide](/en/posts/react-server-components-nextjs-15).

## Quick ways to get CLS close to zero

The essence of lowering CLS is letting the browser know how much space an element will take before it paints. Most shifts come from unsized images, late-loading fonts, and dynamically inserted banners or ads. Reserve space up front and the shifting largely disappears.

- Give every media element an explicit `width` and `height` or an `aspect-ratio`.
- Reserve fixed-height containers for ads, embeds, and iframes.
- Position content injection (cookie banners, notifications) so it doesn't push existing content down.
- Reduce reflow on font swap with `size-adjust`.

## How do I monitor Core Web Vitals in production?

To catch regressions without waiting 28 days on field data, set up real user monitoring (RUM). Google's official `web-vitals` library (at 5.3 as of July 2026) measures all three metrics in the browser and sends them to your analytics endpoint. That way you see whether a deploy broke INP the same day.

```js
import { onLCP, onINP, onCLS } from 'web-vitals';

function send(metric) {
  navigator.sendBeacon('/rum', JSON.stringify(metric));
}

onLCP(send);
onINP(send);
onCLS(send);
```

Slice this data by page template, device type, and connection speed. Most teams look at the average and miss the problem sitting at the 75th percentile; always report by percentile.

Which lever moves which metric? This matrix helps you orient in the first 30 minutes of an audit:

| Intervention | Primary impact | Effort | When |
|--------------|----------------|--------|------|
| `fetchpriority` + `preload` on hero | LCP | Low | LCP > 2.5 s and the element is an image |
| TTFB / edge cache (SSG-ISR) | LCP | Medium | Server response > 600 ms |
| Split long tasks with `scheduler.yield()` | INP | Medium | INP > 200 ms |
| Defer third-party scripts | INP | Low | Analytics/chat/ads present |
| Set `width`/`height` on media | CLS | Low | Shifting during load |

## The most common Core Web Vitals mistakes

The mistakes we see over and over in audits that quietly sink a well-meant effort:

- **Trusting lab scores.** Scoring 100 in Lighthouse doesn't mean you pass in the field. CrUX decides.
- **Lazy-loading the hero image.** Adding `loading="lazy"` to an above-the-fold image directly delays LCP.
- **Over-optimizing a single metric.** If you fix CLS by shipping a huge JavaScript bundle, you'll wreck INP; monitor all three together.
- **Not auditing third-party scripts.** Most INP problems originate not in your code but in tags added after the fact.

Avoiding these traps alone turns many pages green. Style mistakes that bloat your utilities indirectly strain INP too; our [Tailwind CSS mistakes to avoid](/en/posts/tailwind-css-mistakes) and the [other guides in the Web Development category](/en/category/web-development) are a good next stop.

## Frequently Asked Questions

### How long until Core Web Vitals improvements affect rankings?

After you ship a technical fix, the CrUX field data updates on a rolling 28-day window. So seeing the full effect in Search Console typically takes 4 to 8 weeks. Be patient and avoid re-editing the same page repeatedly during that period.

### Do lab scores or field scores matter more?

Field scores (CrUX) are decisive for ranking because Google uses real user data. Lab scores (Lighthouse) are valuable for debugging and catching regressions. Use both together: fix in the lab, verify in the field.

### Is INP measured across all pages or a single interaction?

INP reports a value close to the slowest of all interactions a user makes throughout the page (usually the worst one). That's why even a rare but heavy interaction can wreck your score; test all critical click and input flows.

### Which tools should I use for Core Web Vitals?

For field data, PageSpeed Insights and the CrUX Dashboard; for live monitoring, the official [`web-vitals`](https://github.com/GoogleChrome/web-vitals) library; for debugging, the Chrome DevTools Performance panel and Lighthouse. For metric-moving tactics, Google's [top CWV improvements](https://web.dev/articles/top-cwv) and the [`scheduler.yield()` guide](https://developer.chrome.com/blog/use-scheduler-yield) are the primary sources.
