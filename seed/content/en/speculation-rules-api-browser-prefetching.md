---
title: "The Speculation Rules API: How Browsers Prefetch Pages"
slug: "speculation-rules-api-browser-prefetching"
translationKey: "speculation-rules-api-2026"
locale: "en"
excerpt: "Speculation Rules let a site tell Chromium browsers which pages to prefetch or prerender via JSON rules; Firefox and Safari don't support it yet."
category: "web-development"
tags: ["web-performance", "core-web-vitals", "frontend", "web-standards"]
publishedAt: "2026-10-18"
seoTitle: "Speculation Rules API: Prefetch and Prerender"
seoDescription: "The Speculation Rules API lets sites declare JSON prefetch/prerender rules for near-instant navigation. Here's the syntax and real browser support."
---

The Speculation Rules API lets a site declare, in a block of JSON, which pages the browser should prefetch (fetch the response early) or prerender (render the page in a hidden background tab) before the user clicks — making the eventual navigation feel instant. As of October 2026, it's shipped and stable in Chrome and Edge; Firefox doesn't support it at all, and Safari has it implemented but disabled by default.

## What problem does this replace?

It replaces the old `<link rel="prefetch">` and `<link rel="prerender">` tags, which gave the browser almost no control over when or how aggressively to act — either every linked page got fetched regardless of whether the user was likely to click it, wasting bandwidth, or browsers quietly ignored the hint to avoid that waste, making the tag unreliable in practice. Speculation Rules fix this by letting a site specify conditions and eagerness levels explicitly, so the browser's own heuristics decide the fetch using data the page provides, rather than guessing from a single static tag.

## How do you write a speculation rule?

A rule set is JSON, either inline in a `<script type="speculationrules">` tag or loaded from a separate document, naming URLs or a CSS-selector pattern, an action (`prefetch` or `prerender`), and an eagerness level that controls how early the browser acts. [web.dev's Speculation Rules guide](https://web.dev/articles/speculation-rules) documents the full rule grammar, including options this example skips, like restricting rules to same-origin targets only.

```html
<script type="speculationrules">
{
  "prerender": [
    {
      "where": { "selector_matches": "a[href^='/posts/']" },
      "eagerness": "moderate"
    }
  ],
  "prefetch": [
    {
      "urls": ["/pricing", "/docs"],
      "eagerness": "eager"
    }
  ]
}
</script>
```

The `prerender` rule here tells the browser to fully render any post page in the background once a visitor shows real intent — "moderate" eagerness, in practice, triggers on `pointerdown` or a sustained hover, not on a passing mouse movement. The `prefetch` rule names two specific URLs to fetch more aggressively, without fully rendering them.

## What do the eagerness levels actually control?

Eagerness decides the tradeoff between "feels instant" and "wastes bandwidth on pages nobody visits," and the right level depends on how confident you are the user will actually click.

| Eagerness | Trigger | Typical use |
|---|---|---|
| `immediate` | Fires as soon as the rule is parsed | A near-certain next page, e.g. step 2 of a known checkout flow |
| `eager` | Fires very early, close to `immediate` | High-traffic pages you're confident about (pricing, docs home) |
| `moderate` | Fires on `pointerdown` or sustained hover | Default-safe choice for most in-content links |
| `conservative` | Fires only on clear, near-certain intent signals | Low-confidence links where wasted prerenders would hurt |

Prerendering is more expensive than prefetching — it renders a full hidden page, including running its JavaScript — so pairing a cheap `eagerness` setting with `prerender` on a page with heavy client-side work can cost more than it saves. Prefetch-only rules are the safer default when you're unsure.

## Is Speculation Rules support the same across browsers?

No — as of October 2026, this is effectively a Chromium-only feature in production. Chrome and Edge have supported it since roughly version 109 and it's stable there, and [Chrome's own developer docs on prerendering](https://developer.chrome.com/docs/web-platform/prerender-pages) cover the activation lifecycle in detail. Firefox has no implementation; there's an open Mozilla bug tracking consideration of the API, with no committed ship date, so treat it as "under discussion," not "coming soon." Safari/WebKit has an experimental implementation that is disabled by default in recent Safari and Safari Technology Preview builds — present in the engine, but off unless a user has flipped an experimental flag. [Caniuse's Speculation Rules entry](https://caniuse.com/wf-speculation-rules) is the fastest way to re-check this matrix before you ship, since support shifts faster than most docs get updated.

| Browser | Status |
|---|---|
| Chrome / Edge (Chromium) | Supported since ~v109, stable |
| Firefox | Not implemented; open bug, no ship date |
| Safari / WebKit | Implemented, disabled by default |

## Is it safe to ship this if half my users are on unsupported browsers?

Yes — this is one of the rare "free" performance wins, because unsupported browsers simply ignore the `speculationrules` script tag entirely rather than erroring or breaking anything. There's no feature-detection branching required and no fallback code to write; a browser that doesn't understand the tag treats it as an inert script type and moves on. That asymmetry — real upside on Chromium, zero downside elsewhere — is a good argument for shipping a conservative rule set now rather than waiting for Firefox and Safari to catch up.

My honest take: given that it costs nothing to add and Chromium alone covers a large share of real-world traffic for most sites, there's little excuse not to add at least a `moderate`-eagerness prerender rule for your most-visited internal links today, even while Firefox and Safari support remains unresolved.

## How do you measure whether it's actually helping?

Watch navigation timing and Largest Contentful Paint on repeat, within-session visits to pages covered by your rules — that's where a prerendered page shows the clearest win, since the content is already rendered before the click lands. [Chrome's write-up on recent Speculation Rules improvements](https://developer.chrome.com/blog/speculation-rules-improvements) also covers how to read the `prefetch`/`prerender` status reporting Chrome exposes for debugging which rules actually fired. Comparing those numbers against the same journeys in a browser without support (or with the rules temporarily removed) gives you a real before/after rather than an assumption. If you're already working through a [Core Web Vitals checklist](/en/posts/core-web-vitals-checklist), add "speculation rules on high-traffic internal links" as a low-effort, Chromium-only line item rather than treating it as a separate project.

Teams that have already tuned [image loading for performance](/en/posts/optimize-images-web-performance) or picked a [bundler for speed](/en/posts/vite-turbopack-rspack-2026) are usually the ones with headroom left for this kind of navigation-level optimization, since the easier wins are already banked. If your app leans on [React Server Components](/en/posts/react-server-components-nextjs-15) for streaming, pair that server-side work with a client-side prerender rule on the links most likely to follow — the two compound rather than compete.

## Frequently Asked Questions

### Does the Speculation Rules API work in Firefox?
No. Firefox has no implementation of the Speculation Rules API as of October 2026. There's an open Mozilla bug tracking the proposal for consideration, but no committed timeline to ship it, so it should be treated as "not yet supported," not "coming soon."

### Is Speculation Rules the same as the old rel=prefetch tag?
No, it replaces it. `<link rel="prefetch">` gave the browser a single, all-or-nothing hint with no control over timing or confidence level. Speculation Rules let a site specify multiple rules with different URLs, actions (prefetch vs. prerender), and eagerness levels, so the browser can match its behavior to how likely a click actually is.

### Will adding speculation rules break my site in unsupported browsers?
No. Browsers that don't support the Speculation Rules API, including Firefox and default Safari configurations, simply ignore the `<script type="speculationrules">` tag as an inert script type. There's no error, no fallback code required, and no risk to functionality — you only gain the benefit where it's supported.

### What's the difference between prefetch and prerender in Speculation Rules?
Prefetch only fetches the page's response ahead of navigation, saving a network round trip. Prerender goes further and fully renders the page, including running its JavaScript, in a hidden background tab, so the navigation itself feels instant — at the cost of more CPU and memory than a prefetch, which matters most on pages with heavy client-side rendering.
