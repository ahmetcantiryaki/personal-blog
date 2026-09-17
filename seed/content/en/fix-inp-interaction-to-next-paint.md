---
title: "How Do You Fix INP? Interaction to Next Paint"
slug: "fix-inp-interaction-to-next-paint"
translationKey: "fix-inp-interaction-next-paint-2026"
locale: "en"
excerpt: "Fix poor INP by splitting long tasks over 50ms with scheduler.yield(); about 43% of sites still fail the 200ms good threshold, as of 2026 data."
category: "web-development"
tags: ["core-web-vitals", "web-performance", "performance", "frontend"]
publishedAt: "2026-09-17"
seoTitle: "How Do You Fix INP? Interaction to Next Paint"
seoDescription: "Fix poor INP by splitting long tasks over 50ms with scheduler.yield(); about 43% of sites still fail the 200ms good threshold, as of 2026 data."
---

Short answer: fixing poor INP means splitting long tasks over 50 milliseconds with `scheduler.yield()`, moving third-party scripts off the main thread, and cutting unnecessary work out of event handlers. As of September 2026, roughly 43% of sites still fail the 200ms good-INP threshold, making it the most commonly failed Core Web Vital.

## What does INP actually measure, and why did it replace FID?

INP (Interaction to Next Paint) measures the time from EVERY interaction during a visit — clicks, taps, key presses — to the browser painting the next frame, and reports the worst one; FID only looked at the delay of the FIRST interaction on the page.

That difference matters: a page can respond instantly to the first click and freeze on the fifth, something FID never caught. INP's threshold is 200ms, versus FID's 100ms, but the two metrics measure different things and aren't directly comparable. Our [Core Web Vitals checklist](/en/posts/core-web-vitals-checklist) covers all three metrics together; this piece focuses on INP alone.

## What are INP's three parts: input delay, processing, presentation?

INP breaks into three phases: input delay (the time from the user's click to the browser starting to process that event), processing time (how long the event handler itself runs), and presentation delay (the time from the handler finishing to the browser painting the new frame).

In practice, the biggest delay usually piles up during processing: a heavy event handler, unnecessary state updates, or a large list re-render blocks the main thread. Input delay tends to grow when another long task is already running on the main thread, so optimizing a single handler sometimes isn't enough — you need to audit every long task on the page.

| INP value | Rating |
|---|---|
| ≤ 200ms | Good |
| 200ms – 500ms | Needs improvement |
| > 500ms | Poor |

## How do you find the source of poor INP?

To find the source of poor INP, start with field data (the CrUX report or your own RUM) to identify which page and which interaction type produces the worst INP, then replay that exact interaction in Chrome DevTools' Performance panel and focus on the red blocks under Long Tasks.

Lab data (what you measure on your own machine) and field data (what real users experience) often disagree; a task that takes 50ms on your dev machine can easily take much longer on a low-end phone. That's why final verification should always come from field data — lab data is only for debugging.

In Chrome DevTools' Performance panel, the Bottom-Up tab ranks which function contributed the most to total time, and the top few rows usually point straight at the source of the problem. Logging interactions that exceed the 200ms threshold directly in production, using the `PerformanceObserver` API, is also a much faster diagnostic path than trying to reproduce the issue in a lab environment.

## How do you split long tasks with scheduler.yield()?

`scheduler.yield()` is a browser API that lets JavaScript explicitly hand control back to the browser in the middle of a long task, so the browser can process a pending user interaction before your code continues.

```javascript
// Falls back to setTimeout when the browser lacks scheduler.yield support
async function yieldToMain() {
  if ('scheduler' in globalThis && 'yield' in globalThis.scheduler) {
    return globalThis.scheduler.yield();
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function processLargeList(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
    // Hand control back to the main thread every 50 items
    if (i % 50 === 0) {
      await yieldToMain();
    }
  }
}
```

The key detail: `scheduler.yield()` doesn't stop the task, it just gives a pending user interaction a chance to run first if one exists. Where the browser doesn't support it, the `setTimeout(resolve, 0)` fallback provides the same behavior, just slightly slower and less precise.

## What do you do about third-party scripts and debouncing?

The most effective way to get third-party scripts (analytics, ads, live-chat widgets) off the main thread is moving them to a Web Worker where possible, or at minimum deferring their load with `defer`/`async` — these scripts routinely cause longer tasks than the page's own code.

Debouncing or throttling event handlers that fire on every keystroke, like a search box, cuts out redundant processing. If you're on React, reducing unnecessary re-renders also shortens processing time — we cover that in more depth in [React Compiler: goodbye useMemo?](/en/posts/react-compiler-goodbye-usememo)

## Which three patterns break the main thread most often?

The three patterns that break the main thread most often are search boxes that re-render an entire list on every keystroke, heavy third-party scripts loaded synchronously, and "layout thrashing" loops that read and write the DOM back to back; all three easily push a single event handler past the 50ms budget.

Instead of re-rendering a large list on every keystroke, debouncing the render until the user pauses typing, or using React's `startTransition`, keeps the main thread busy only when it actually needs to be, not on every character. To avoid layout thrashing, batching DOM reads (`offsetHeight`, `getBoundingClientRect`) at the start of a loop and writes (`style` changes) at the end stops the browser from recalculating layout more often than necessary. Most third-party scripts aren't under your direct control, so deferring them until after the page's main content has loaded is usually the only practical fix available.

## How do you verify the fix with RUM?

The only reliable way to confirm a change actually worked is watching whether the 75th percentile of INP in real-user monitoring (RUM) data drops over the following weeks; an immediate improvement right after a single deploy can be misleading.

Shipping INP to your own analytics with the `web-vitals` library lets you see weekly trends without waiting for the Search Console CrUX report to update. Slow-loading images can indirectly hurt INP too — our [optimizing images for web performance](/en/posts/optimize-images-web-performance) guide is a complementary read there.

My take: most teams shelve INP on a "we'll fix it someday" list because it isn't as visually dramatic as LCP — but a button that freezes when a user clicks it burns more trust than a page that simply loads slowly.

For more performance content, browse our [Web Development category](/en/category/web-development). [web.dev's INP guide](https://web.dev/articles/inp) and [MDN's scheduler.yield() documentation](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield) are the technical references behind this piece.

## Frequently Asked Questions

### What counts as a good INP value?

200 milliseconds or under is considered good, 200-500ms needs improvement, and anything over 500ms is poor. Google's Core Web Vitals report evaluates these thresholds at the 75th percentile, meaning at least 75% of your visitors need to experience a value under that threshold.

### Does scheduler.yield() work in every browser?

No, as of September 2026 it isn't fully supported across every major browser, so checking `globalThis.scheduler?.yield` and falling back to `setTimeout(resolve, 0)` when it's missing is the safe approach. The fallback produces the same result, just slightly slower.

### Does fixing INP also improve LCP?

Not directly — LCP measures how fast the page's largest content paints, while INP measures how fast interactions get a response. That said, reducing long tasks on the main thread, like shrinking a heavy JavaScript bundle, usually improves both at once, because they compete for the same resource: main-thread availability.

### Why does INP look worse on mobile devices?

Mobile processors run noticeably slower than desktop ones, so a task that takes 30ms on desktop can stretch to 100-150ms on a mid-range phone. Testing INP with CPU throttling enabled, rather than only on your own dev machine, gives a result far closer to what real users actually experience.
