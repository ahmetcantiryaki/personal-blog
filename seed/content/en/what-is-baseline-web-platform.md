---
title: "What Does 'Baseline' Mean for Web Features?"
slug: "what-is-baseline-web-platform"
translationKey: "baseline-web-platform-2026"
locale: "en"
excerpt: "Baseline is a shared label that tells you when a CSS, JS, or HTML feature works in Chrome, Firefox, Safari, and Edge without needing a polyfill."
category: "web-development"
tags: ["web-standards", "css", "frontend", "best-practices"]
publishedAt: "2026-11-21"
seoTitle: "What Is Baseline for Web Features?"
seoDescription: "Baseline is the shared label that tells developers when a CSS or JS feature is safe to ship across major browsers. Here is how its three tiers work."
---

Short answer: Baseline is a shared classification that tells you whether a web platform feature, such as a CSS property, a JavaScript API, or an HTML element, works in production across Chrome, Firefox, Safari, and Edge without a polyfill. It is maintained by the Web Features / WebDX community group, backed by the major browser vendors and the Interop project. If a feature carries a Baseline label, you can rely on it.

## What is Baseline and who defines it?

Baseline is not a single vendor's opinion. It is a classification produced jointly by browser makers, and the same underlying data powers MDN, web.dev, and the machine-readable "web-features" dataset, so you get the same answer no matter where you look it up.

The goal is straightforward: let developers answer "can I ship this CSS feature today, or do I need a fallback?" quickly and reliably. Before Baseline, developers often tried to infer this from raw usage percentages on sites such as caniuse.com. Baseline replaces that guesswork with clear, defined thresholds instead.

The idea behind Baseline is to treat cross-browser compatibility as a fact the platform publishes, not a risk each developer has to estimate alone. A team no longer needs to read four separate changelogs before adopting a new feature; checking one label does the job. That also speeds up code review, because "is this safe to use?" becomes a verifiable data point instead of an open debate.

## What are the three tiers of Baseline?

Baseline uses a three-stage timeline, and every feature sits at exactly one point on it. A feature moves from "limited," to "newly available," and eventually to "widely available."

| Tier | Meaning |
|---|---|
| Limited availability | The feature has not yet shipped in the latest stable release of every core browser engine (Chromium, Gecko, WebKit). |
| Newly available | The feature now works in at least the latest stable version of each of the Baseline browsers (Chrome, Edge, Firefox, and Safari, desktop and mobile), but it may not work in older browsers and devices. |
| Widely available | Reached 30 months (two and a half years) after the "newly available" date, once the feature has a long, stable track record across all of them. |

This definition changed over time. The original version counted a feature as Baseline once it worked in both the current and the previous version of every major browser. The governance group later redefined it into the two-point "newly" and "widely" timeline above, turning "Baseline" from a single snapshot into a maturity timeline for each feature.

That distinction matters in practice. A team can match its risk tolerance to the tier instead of treating every feature the same way. An internal admin panel, where most users run a current browser, can adopt a "newly available" feature right away. A public-facing site serving a broad, varied audience might prefer to wait for the "widely available" threshold on the same feature.

## How does the `:has()` example show Baseline in action?

The CSS `:has()` relational pseudo-class is a useful real-world case for watching Baseline's three tiers play out. According to MDN, `:has()` has worked across the latest device and browser versions since December 2023, which is when it crossed the "newly available" threshold.

A Baseline tracker put `:has()`'s "widely available" date at exactly 30 months later, on June 19, 2026. As of today, November 21, 2026, that date has already passed, so `:has()` now counts as "widely available" both by the official metric and in day-to-day practice. According to tracking sites, `:has()` already has upward of 94% real-world global browser support as of 2026; that figure comes from a secondary source rather than an official one, but it confirms how mainstream the selector has become. For a deeper look at using it in real layouts, see our post on [modern CSS with :has() and native nesting](/en/posts/modern-css-has-native-nesting).

## How do you use a feature safely before it reaches Baseline?

If a feature has not yet reached "widely available" status, feature detection with `@supports` in your CSS is the safest approach. It lets you check, at runtime, whether the browser actually supports the feature, and define a fallback style for browsers that do not.

```css
/* Use the richer selector when :has() is supported */
@supports selector(:has(*)) {
  .card:has(img) {
    grid-template-columns: 1fr 2fr;
  }
}

/* Fall back to a simpler layout otherwise */
.card {
  display: grid;
  grid-template-columns: 1fr;
}
```

Instead of repeating this check file by file, teams can write lint rules against the open "web-features" dataset to flag use of not-yet-Baseline features automatically during code review. A rule like that can warn, or block a build outright, the moment someone commits a feature that is still "limited availability," so the decision does not rely on one person's memory. You can apply the same discipline when managing style precedence with cascade layers, which we cover in [CSS @layer: tame your large stylesheets](/en/posts/css-cascade-layers-at-layer).

## Is Baseline more reliable than raw caniuse percentages?

Baseline is a more reliable decision tool than raw usage percentages, because percentages answer "how many people currently support this?" while Baseline answers "has this feature matured from an engineering standpoint?" Even 90% support does not tell you where the remaining 10% is concentrated; Baseline answers the more direct question of whether every core browser engine supports the feature at all.

| Approach | What it measures | Risk |
|---|---|---|
| Baseline | Whether the feature is supported across every core browser engine | Low; based on clear, defined thresholds |
| Raw caniuse percentage | How much of the global user base runs a supporting browser | Medium-to-high; old-browser distribution varies by market |

That makes Baseline the first reference point when evaluating newer CSS features such as container queries, which we walk through in [how to use CSS container queries](/en/posts/css-container-queries-how-to).

## Where is Baseline status published?

You can track Baseline status in three main places: badges on MDN's API reference pages, the [web.dev/baseline](https://web.dev/baseline) page, and the web-platform-dx.github.io/web-features-explorer browser for the machine-readable "web-features" dataset. web.dev also publishes a recurring "Baseline digest" roundup summarizing features that recently crossed into Baseline status; a June 2026 digest, for example, was one of these roundups.

Tracking which features are production-ready also feeds directly into performance work, since the two are closely linked; we cover that connection in our [Core Web Vitals checklist for 2026](/en/posts/core-web-vitals-checklist). We applied the same Baseline logic to newer, still-maturing features like popovers and anchor positioning in [CSS anchor positioning: popovers and tooltips without JS](/en/posts/css-anchor-positioning-popovers-2026). For more practical CSS coverage, browse our [web development category](/en/category/web-development).

For the primary sources behind this definition, read MDN's [Baseline/Compatibility glossary entry](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility) and the [Baseline project page](https://web-platform-dx.github.io/baseline/).

## Frequently Asked Questions

### Who maintains Baseline?

Baseline is maintained by the Web Features / WebDX community group, with backing from major browser vendors, including Chrome, Firefox, Safari/WebKit, and Edge, plus the Interop project. That means the classification rests on consensus across the browser ecosystem rather than on any single company's decision.

### Can I use a feature as soon as it becomes "newly available"?

Yes, you can, but you should plan for it not working in older browsers and devices. "Newly available" only guarantees support in the latest stable version of each Baseline browser, so adding `@supports` feature detection is a cheap, safe extra step for critical user flows.

### What Baseline tier is `:has()` at right now?

`:has()` reached "newly available" status in December 2023, and a Baseline tracker put its move to "widely available" status at June 19, 2026, exactly 30 months later. As of November 2026, that date has passed, so the selector counts as production-safe both by the official Baseline metric and by its roughly 94% real-world usage share.

### How is Baseline different from caniuse usage percentages?

Baseline is a defined threshold system based on whether a feature works across every core browser engine, while caniuse percentages are a variable statistic showing how much of the global user base currently runs a supporting browser. For production decisions, Baseline offers a more predictable foundation because its thresholds do not shift with regional browser-market swings.
