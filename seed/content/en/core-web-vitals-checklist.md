---
title: "Core Web Vitals Checklist for 2026"
slug: "core-web-vitals-checklist"
translationKey: "core-web-vitals-checklist"
locale: "en"
excerpt: "A practical Core Web Vitals checklist for 2026: measure LCP, INP, and CLS with real field data, then fix the most common issues step by step."
category: "web-development"
tags: ["core-web-vitals", "web-performance", "frontend", "seo"]
publishedAt: "2026-04-13"
seoTitle: "Core Web Vitals Checklist for 2026"
seoDescription: "A practical Core Web Vitals checklist for 2026: measure LCP, INP, and CLS with real field data and fix the most common issues step by step."
---

To pass Core Web Vitals, get all three metrics under their thresholds: **LCP below 2.5 seconds**, **INP below 200 milliseconds**, and **CLS below 0.1**. This Core Web Vitals checklist helps you measure with real user data (CrUX) instead of lab tests, prioritize the worst offender, and turn your pages green fast in 2026.

Work through the steps in order and you'll stop guessing and start fixing the issues that actually move the needle.

## What do Core Web Vitals measure in 2026?

Core Web Vitals are Google's set of metrics that summarize user experience across three dimensions: loading (LCP), responsiveness (INP), and visual stability (CLS). INP replaced FID in March 2024, and as of 2026 all three are ranking signals on mobile and desktop. The goal is passing the threshold at the 75th percentile of your field data.

In short, one fast load isn't enough. Google expects even the slowest quarter of your real visitors to stay under the threshold.

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

Switching to modern image formats (AVIF, WebP) and sizing correctly with `srcset` also frees up a lot of your LCP budget. For a deeper dive, see our [guide to modern image formats](/blog/modern-image-formats).

## Why does INP spike, and how do I fix it?

INP usually spikes because the main thread is clogged with long tasks. When a user taps a button and the browser is busy, the response is delayed and INP jumps. The fix is to shrink your JavaScript, split long tasks, and keep interaction logic as lightweight as possible.

Where to focus:

- **Audit third-party scripts.** Analytics, chat, and ad scripts are the most common INP offenders. Use `async`/`defer` or load them after the first interaction.
- **Break up long tasks.** Give the main thread room to breathe with `scheduler.yield()` or `setTimeout`; keep every task under 50 ms.
- **Kill unnecessary React re-renders.** Reduce wasted work with `useMemo`, `useCallback`, and list virtualization.
- **Use `content-visibility: auto`.** Deferring the render cost of off-screen sections speeds up interaction response.

On the framework side, your hydration strategy matters too. We covered server components and selective hydration in detail in our [React performance optimization article](/blog/react-performance-optimization).

## Quick ways to get CLS close to zero

The essence of lowering CLS is letting the browser know how much space an element will take before it paints. Most shifts come from unsized images, late-loading fonts, and dynamically inserted banners or ads. Reserve space up front and the shifting largely disappears.

- Give every media element an explicit `width` and `height` or an `aspect-ratio`.
- Reserve fixed-height containers for ads, embeds, and iframes.
- Position content injection (cookie banners, notifications) so it doesn't push existing content down.
- Reduce reflow on font swap with `size-adjust`.

## How do I monitor Core Web Vitals in production?

To catch regressions without waiting on field data, set up real user monitoring (RUM). Google's official `web-vitals` library measures all three metrics in the browser and sends them to your analytics endpoint. That way you see whether a deploy broke INP the same day, instead of waiting 28 days.

A practical setup looks like this:

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

## The most common Core Web Vitals mistakes

The mistakes we see over and over in audits that quietly sink a Core Web Vitals effort:

- **Trusting lab scores.** Scoring 100 in Lighthouse doesn't mean you pass in the field. CrUX decides.
- **Lazy-loading the hero image.** Adding `loading="lazy"` to an above-the-fold image directly delays LCP.
- **Over-optimizing a single metric.** If you fix CLS by shipping a huge JavaScript bundle, you'll wreck INP; monitor all three together.
- **Not auditing third-party scripts.** Most INP problems originate not in your code but in tags added after the fact.

Avoiding these traps alone turns many pages green. For a wider view, see our [web performance fundamentals article](/blog/web-performance-fundamentals) and the [other frontend guides on our category page](/blog/web-development).

## Frequently Asked Questions

### How long until Core Web Vitals improvements affect rankings?

After you ship a technical fix, the CrUX field data updates on a rolling 28-day window. So seeing the full effect in Search Console typically takes 4 to 8 weeks. Be patient and avoid re-editing the same page repeatedly during that period.

### Do lab scores or field scores matter more?

Field scores (CrUX) are decisive for ranking because Google uses real user data. Lab scores (Lighthouse) are valuable for debugging and catching regressions. Use both together: fix in the lab, verify in the field.

### Is INP measured across all pages or a single interaction?

INP reports a value close to the slowest of all interactions a user makes throughout the page (usually the worst one). That's why even a rare but heavy interaction can wreck your score; test all critical click and input flows.

### Which tools should I use for Core Web Vitals?

For field data, PageSpeed Insights and the CrUX Dashboard; for live monitoring, the `web-vitals` JavaScript library; for debugging, the Chrome DevTools Performance panel and Lighthouse. If you want continuous monitoring, add a real user monitoring (RUM) solution.
