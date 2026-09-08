---
title: "Scroll-Driven Animations in CSS: A How-To"
slug: "scroll-driven-animations-in-css"
translationKey: "css-scroll-driven-animations-2026"
locale: "en"
excerpt: "CSS scroll-driven animations use animation-timeline to tie animations to scroll position, no JavaScript needed. Supported in every major browser by 2026."
category: "web-development"
tags: ["css", "web-performance", "frontend", "responsive-design"]
publishedAt: "2026-09-08"
seoTitle: "Scroll-Driven Animations in CSS: A How-To"
seoDescription: "CSS scroll-driven animations use animation-timeline to tie animations to scroll position without JavaScript, and are supported in every major browser in 2026."
---

Short answer: set `animation-timeline` to `scroll()` or `view()` and an animation's progress ties to scroll position or an element's visibility — with no JavaScript scroll listener at all. As of 2026, current versions of Chrome, Edge, Firefox, and Safari all support this.

## What are CSS scroll-driven animations, and why skip JavaScript?

A scroll-driven animation ties a CSS `@keyframes` animation's timeline to scroll position instead of a fixed duration. Normally, `animation-duration: 3s` plays the animation over three seconds; set `animation-timeline: scroll()` instead, and `animation-duration` is ignored entirely — scroll position, not time, now determines where the animation is.

The practical effect: you no longer need JavaScript that attaches a `scroll` listener and recalculates styles inside `requestAnimationFrame` on every frame. The browser runs this on the compositor thread, meaning the main thread never gets touched — the animation stays smooth even while your JavaScript is busy doing something else during scroll.

This gap is especially visible on lower-powered devices. A JavaScript-based scroll listener risks "layout thrashing" by bouncing between reading layout and writing styles on every scroll event, forcing the browser to recompute on every frame. Native `animation-timeline` hands that computation off to the browser's own render pipeline instead, so the animation stays smooth even on lower-end phones.

## What's the difference between scroll() and view()?

A `scroll()` timeline converts a scroll container's total scroll distance (usually `<body>` or a div with `overflow: scroll`) into a 0-100% progress value, answering "how far down the page has the user scrolled?" — the right fit for reading progress bars or parallax backgrounds. A `view()` timeline answers a different question: "how visible is this element in the viewport right now?" The animation starts as the element enters the screen, completes once it's fully visible, and reverses as it exits.

| Timeline type | Tied to | Typical use case |
|---|---|---|
| `scroll()` | Container's total scroll distance | Reading progress bars, parallax backgrounds |
| `view()` | Element's visibility in the viewport | Reveal-on-scroll cards, in-page reveal effects |

## How do you build a reading progress bar?

The most common use of a `scroll()` timeline is a bar at the top of the page showing how much of an article has been read:

```css
@keyframes progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  width: 100%;
  transform-origin: left;
  background: var(--primary);
  animation: progress linear;
  animation-timeline: scroll(root block);
}
```

`scroll(root block)` uses the `<html>` element's vertical (block) scroll as the timeline. Note there's no `animation-duration` — it would be ignored anyway, so it's not worth writing.

## How do you build reveal-on-scroll elements?

To make cards or sections fade in as they enter the viewport, use a `view()` timeline instead:

```css
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
```

`animation-range: entry 0% cover 40%` means the animation starts the moment the element begins entering the viewport (entry 0%) and finishes once the element is 40% visible. Adjusting this range fine-tunes how "early" or "late" the effect triggers.

## How do you build a parallax background?

A parallax effect creates a sense of depth by scrolling a background image slower than the foreground content. You can build this with a `scroll()` timeline and zero lines of JavaScript:

```css
@keyframes parallax-shift {
  from { transform: translateY(0); }
  to { transform: translateY(-15%); }
}

.hero-background {
  animation: parallax-shift linear;
  animation-timeline: scroll(nearest block);
  animation-range: cover 0% cover 100%;
}
```

`scroll(nearest block)` uses the nearest scrollable ancestor container as the timeline — usually `<body>`, but you can target a different one on a page with nested scroll containers.

If you need to share one named scroll timeline across separate parts of the DOM tree, the `timeline-scope` property lets elements outside the timeline's defining element reference it too — so an element in a completely different branch of the DOM can animate off the scroll progress of a container elsewhere on the page:

```css
.container {
  timeline-scope: --main-scroll;
  scroll-timeline: --main-scroll block;
}

/* An element outside .container, in a different branch of the DOM */
.remote-element {
  animation: reveal linear;
  animation-timeline: --main-scroll;
}
```

This is especially useful when you want a header indicator to animate off the scroll progress of a section much further down the page.

If you attach dozens of cards to a `view()` timeline on one page, keep in mind each card runs independently based on its own visibility — the browser computes this per element rather than tracking one global scroll value. In practice that doesn't hurt performance, since the work runs on the compositor thread, but using very different `animation-range` values across many elements does take some care to keep the design consistent.

## Is browser support good enough to ship this?

As of mid-2026, Chrome 115+, Edge 115+, Firefox 132+, and Safari 18+ all support scroll-driven animations; global browser support sits above 84%, with some measurements putting it above 90%. Projects that still need to support older browsers should still apply progressive enhancement with an `@supports` query:

```css
.card {
  opacity: 1; /* default: always visible */
}

@supports (animation-timeline: scroll()) {
  .card {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 40%;
  }
}
```

With this pattern, an unsupported browser just shows the element as always visible — missing animation degrades to a plainer experience, not a broken one.

## How do you respect prefers-reduced-motion?

Scroll-linked animations can be especially disruptive for motion-sensitive users, since the user can't pause them — every scroll gesture retriggers the animation. Use the `prefers-reduced-motion: reduce` media query to turn these animations off entirely, or fall back to a gentler transition like opacity alone:

```css
@media (prefers-reduced-motion: reduce) {
  .card {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

For scroll-driven animations, this isn't an optional nicety — it's a practically mandatory accessibility step.

If you're combining this with responsive layout work, see [our guide to CSS container queries](/en/posts/css-container-queries-how-to). For `:has()` and native nesting, check [our modern CSS post](/en/posts/modern-css-has-native-nesting). For positioned popovers without JavaScript, [our CSS anchor positioning guide](/en/posts/css-anchor-positioning-popovers-2026) is a useful companion. To improve page performance more broadly, see [our image optimization guide](/en/posts/optimize-images-web-performance). For more web development coverage, browse [our web development category](/en/category/web-development).

For the full specification and syntax, see [MDN's scroll-driven animations guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations).

## Frequently Asked Questions

### Why doesn't animation-duration work with scroll-driven animations?

When `animation-timeline` is set to `scroll()` or `view()`, scroll position — not time — determines the animation's progress. Even if you set `animation-duration`, the browser ignores it, so it's not worth writing; leaving it at `auto` is sufficient.

### Can scroll() and view() be used together on the same element?

No, a single `animation-timeline` property binds to one timeline type. If you want an element to react to both scroll position and visibility, define two separate animations and give each its own `animation-timeline` value.

### Do these animations fully replace GSAP or Framer Motion?

For simple scroll-triggered effects — fade-ins, progress bars, parallax — yes, native CSS is sufficient and more performant. But for complex sequenced timing, physics-based spring animations, or effects synced to triggers other than scroll, JavaScript-based libraries still offer more flexible control.

### What should I do if I still need to support older browsers?

Use progressive enhancement with `@supports (animation-timeline: scroll())`: elements stay visible by default in unsupported browsers, and the animation layers on top only where it's supported. This guarantees critical content is never invisible in any browser.
