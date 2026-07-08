---
title: "View Transitions API: A Practical How-To"
slug: "view-transitions-api-how-to"
translationKey: "view-transitions-api-guide"
locale: "en"
excerpt: "Learn the View Transitions API: startViewTransition() for SPAs, the @view-transition CSS rule for MPAs, shared-element morphs, and reduced-motion fallbacks."
category: "web-development"
tags: ["css", "rendering", "web-standards", "frontend"]
publishedAt: "2026-07-08"
seoTitle: "View Transitions API: A Practical How-To Guide"
seoDescription: "Learn the View Transitions API: startViewTransition() for SPAs, the @view-transition CSS rule for MPAs, shared-element morphs, and reduced-motion fallbacks."
---

To use the View Transitions API, wrap a DOM update in `document.startViewTransition(callback)` for same-document apps, or add `@view-transition { navigation: auto; }` in your CSS for cross-document navigations — both animate old and new states automatically, no JavaScript animation library required.

## Setup: two entry points, one mental model

The API gives you two doors into the same mechanism. Pick based on architecture, not preference.

- **Same-document (SPA)**: call `document.startViewTransition()` around the DOM mutation that changes state. The browser snapshots the "before," runs your callback, snapshots the "after," and crossfades between them by default.
- **Cross-document (MPA)**: no JavaScript at all. You opt in with a CSS at-rule on both the source and destination pages, and the browser handles the navigation-to-navigation animation itself.

Both variants render into a temporary top-layer overlay of pseudo-elements — `::view-transition-old(name)` and `::view-transition-new(name)` — that you can style with normal CSS transitions and animations.

## The SPA case: `startViewTransition()`

The pattern that trips people up is timing. The callback you pass has to be synchronous with respect to the DOM — fetch your data first, then call `startViewTransition` with a callback that only applies already-available state:

```js
async function goToDetail(cardEl, item) {
  // 1. Fetch data BEFORE starting the transition, not inside it
  const detail = await fetchItemDetail(item.id);

  if (!document.startViewTransition) {
    renderDetailView(detail); // progressive enhancement fallback
    return;
  }

  const transition = document.startViewTransition(() => {
    renderDetailView(detail); // synchronous DOM swap only
  });

  transition.ready.then(() => {
    // safe hook for JS-driven extras, e.g. scrolling into view
  });
}
```

`startViewTransition()` returns a `ViewTransition` object with `.ready`, `.updateCallbackDone`, and `.finished` promises — useful when you need to sequence work around the animation instead of inside it.

## A concrete morph: card to detail view

Shared-element morphs come from one CSS property: `view-transition-name`. Give the card thumbnail and the detail hero image the same name, and the browser interpolates size and position between them instead of crossfading.

```css
/* List view */
.card[data-active="true"] .card-thumb {
  view-transition-name: product-hero;
  contain: layout; /* required alongside view-transition-name */
}

/* Detail view */
.detail-hero {
  view-transition-name: product-hero;
}

/* Fine-tune the morph itself */
::view-transition-group(product-hero) {
  animation-duration: 320ms;
  animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
}
```

The name must be unique among elements visible at the same time, so toggle it on and off with `data-active` rather than hardcoding it — two elements sharing a `view-transition-name` simultaneously throws and silently skips the transition.

## The MPA path: `@view-transition` and cross-document navigation

For plain multi-page sites, both the current and the next document need to declare the at-rule for the browser to animate the swap between them:

```css
/* On every page that should participate in cross-document transitions */
@view-transition {
  navigation: auto;
}

/* Reduced-motion fallback — applies to both variants */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

This is the part of the spec HTMX 4.0 leans on. According to [InfoWorld's coverage of HTMX 4.0](https://www.infoworld.com/article/4150864/htmx-4-0-hypermedia-finds-a-new-gear.html), the release wires the browser's native View Transitions API into swaps by default — a real change from HTMX 1.x/3.x, where you had to flip `htmx.config.globalViewTransitions` or add `transition:true` yourself. Worth noting: this default has already generated friction — a [reported GitHub issue](https://github.com/bigskysoftware/htmx/issues/3566) describes transitions-by-default blocking rapid successive requests for ~500ms, so treat "wired by default" as a starting point you may still need to tune, not a finished feature. If you're weighing hypermedia against a client framework for a project like this, our [HTMX vs React comparison](/en/posts/htmx-vs-react-when-to-use) covers where each approach actually wins.

## Browser support, as of July 2026

Support is split cleanly by variant, and the gap matters for how you ship this.

| Variant | Chrome / Edge | Safari | Firefox |
|---|---|---|---|
| Same-document (`startViewTransition()`) | 111+ | 18+ | 144+ (Baseline Newly Available, Oct 2025) |
| Cross-document (`@view-transition`) | 126+ | 18.2+ | Not yet — the at-rule is ignored, navigation just snaps |

Check the live matrices on [MDN's View Transition API reference](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) and [caniuse's cross-document view transitions table](https://caniuse.com/cross-document-view-transitions) before you ship, since these numbers move fast. Cross-document support is the newer, more fragile half of the spec — Firefox has shipped same-document transitions but not the navigation variant yet, so an MPA relying on `@view-transition` degrades to an ordinary unanimated navigation there. That degradation is free: it is not an error state, just a plain page load.

## Gotchas that actually bite

- **Layout shift during the morph.** The API captures a snapshot at a fixed size and interpolates it, so if the "new" element's intrinsic size differs a lot from the "old" one (a thumbnail expanding into a full hero image, say), the interpolation can look like a jump rather than a smooth scale. Keep aspect ratios close, or accept a slightly less literal morph.
- **Z-index stops working the way you expect.** Transition pseudo-elements live in a browser-managed top-layer stacking context, independent of your document's normal stacking order. You cannot fix an overlap between two named groups with a page-level `z-index`; you have to set it on `::view-transition-group(name)` itself.
- **Async data racing the snapshot.** If you call `startViewTransition()` before your data has arrived and then mutate the DOM again once it resolves, you get a double transition or a flash of stale content. Resolve your fetch first, and keep the callback purely synchronous.
- **Every unlabeled change still transitions.** Even without a single `view-transition-name`, the whole document root crossfades by default once you're inside `startViewTransition()`. If part of your UI shouldn't animate, that has to be explicit — either scope the mutation outside the callback, or set `view-transition-name: none` where needed.

## Progressive enhancement

Nothing here requires a fallback library — an unsupported browser without `document.startViewTransition` just runs your DOM update immediately, and an MPA page without `@view-transition` support just loads normally. Feature-detect for the SPA path, respect `prefers-reduced-motion` for both, and you're covered end to end:

```js
if (document.startViewTransition) {
  document.startViewTransition(() => updateDOM());
} else {
  updateDOM();
}
```

Pair this with the earlier `prefers-reduced-motion` block and you have a complete, copy-paste-ready baseline: feature detection in JS, a no-motion CSS override, and an at-rule for cross-document navigation. None of it blocks the underlying functionality if the browser does not support it — worst case, users get an instant, non-animated swap, which is exactly what they'd have gotten without this API at all.

This kind of visible, perceived-performance polish sits well alongside the metrics from our [Core Web Vitals checklist](/en/posts/core-web-vitals-checklist) — a view transition does not move your CLS or INP numbers on its own, but a badly sized one can hurt CLS, so test with the same rigor. If you're building the shared-element cards this article uses as an example, our [CSS container queries how-to](/en/posts/css-container-queries-how-to) pairs naturally, since responsive card layouts are exactly where these morphs get used. And if you're deciding how a page is rendered in the first place, our [SSR vs SSG vs ISR guide](/en/posts/ssr-vs-ssg-vs-isr) is the companion piece — cross-document transitions work regardless of which rendering mode served the page. For more on this space, browse the [Web Development](/en/category/web-development) category.

## Frequently Asked Questions

### Does the View Transitions API work without JavaScript?

Yes, for cross-document (MPA) navigations. The `@view-transition { navigation: auto; }` rule is pure CSS — declare it on both pages involved in the navigation and the browser animates the swap with no script. JavaScript is only required for the same-document `startViewTransition()` case.

### Can I use it with React, Vue, or another SPA framework?

Yes. Call `document.startViewTransition()` around whatever triggers your framework's state update — a route change, a list re-render — as long as the DOM mutation the callback wraps is synchronous. Some routers (Next.js's App Router, Astro's client router) already have thin wrappers around this; check whether yours does before hand-rolling it.

### Why doesn't my shared-element morph animate?

The most common cause is a `view-transition-name` collision: two elements with the same name being visible in the DOM at once, which silently disables the transition. The second is timing — if the "new" element is not yet in the DOM when the browser takes its snapshot, the transition captures a crossfade fallback instead of a morph. Check `document.startViewTransition` returned a rejected `ready` promise for details.

### Does this replace CSS transitions and animations?

No, it complements them. The View Transitions API decides *what* to animate — old state to new state, across a DOM swap or a navigation — while regular CSS transitions and `@keyframes` on the `::view-transition-*` pseudo-elements decide *how*. You still control duration, easing, and choreography with ordinary CSS.
