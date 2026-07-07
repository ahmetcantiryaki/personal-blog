---
title: "CSS Container Queries: A Practical How-To"
slug: "css-container-queries-how-to"
translationKey: "css-container-queries"
locale: "en"
excerpt: "A practical CSS container queries how-to for 2026: set a containment context, query the parent's width, and use the new style and scroll-state queries that just went cross-browser."
category: "web-development"
tags: ["css", "frontend", "responsive-design"]
publishedAt: "2026-07-03"
seoTitle: "CSS Container Queries: A Practical How-To (2026)"
seoDescription: "CSS container queries how-to for 2026: define a container with container-type, query its width with @container, and use the new style and scroll-state queries."
---

Here is CSS container-queries how-to in one breath: give a parent `container-type: inline-size`, then style its children with `@container (min-width: ...)` so they respond to the **container's** size instead of the viewport. As of July 2026 every evergreen browser supports the size version, and it's the cleanest way to build a component that adapts to wherever you drop it.

Media queries ask "how big is the screen?" Container queries ask "how big is my parent?" That one shift is what finally makes a card, sidebar, or widget genuinely reusable. And 2026 is the year the feature grew up: style queries went cross-browser in May, and Chrome shipped scroll-state queries that kill a whole class of JavaScript scroll listeners.

## What are CSS container queries?

CSS container queries let an element respond to the size of its containing element rather than the browser viewport. You mark an ancestor as a query container with `container-type`, then write `@container` rules that apply based on that container's width, height, style, or scroll state. The same component renders compact in a sidebar and wide in a main column, with zero viewport math.

This fixes the core weakness of media queries: a component styled for a 1200px viewport breaks the moment you reuse it in a narrow slot. Container queries move the decision to where it belongs — the component's actual available space.

## How do they differ from media queries?

Short answer: media queries respond to the viewport, container queries respond to a parent element. Media queries are global and layout-level; container queries are local and component-level. You still use both: media queries for the page shell and global breakpoints, container queries for reusable components that live in unpredictable slots.

| Aspect | Media queries | Container queries |
|--------|---------------|-------------------|
| Responds to | Viewport / device | Nearest query container |
| Scope | Global, page-wide | Local, per component |
| Best for | Page shell, print styles | Reusable components, widgets |
| Reusability | Breaks in new contexts | Portable anywhere |
| Syntax | `@media (min-width: 600px)` | `@container (min-width: 400px)` |
| Support (July 2026) | Universal | ~93%+ global, Baseline since 2023 |

## How do you actually set one up?

Follow these in order. Each step builds on the last, so don't skip the containment context:

1. **Wrap the component in a container element.** You need an ancestor to query, a wrapping `<div>` or the component's own root.
2. **Declare the containment type.** Add `container-type: inline-size` so the browser tracks the inline (horizontal) size.
3. **Name the container.** Add `container-name: card` so you target it explicitly and avoid querying the wrong ancestor.
4. **Write your `@container` rules** against the named container: `@container card (min-width: 400px) { ... }`.
5. **Set mobile-first defaults** outside any query, then layer wider layouts on top.
6. **Test in multiple slots**: a sidebar, a grid cell, and a full-width row.

The most common pattern is a card that switches from stacked to side-by-side based on its own width:

```css
/* 1. Establish the query container */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* 2. Mobile-first default: image stacked on top */
.card {
  display: grid;
  gap: 1rem;
}

/* 3. When the CONTAINER is at least 400px, go side-by-side */
@container card (min-width: 400px) {
  .card {
    grid-template-columns: 40% 1fr;
    align-items: center;
  }
}

/* 4. Scale the title with the container, not the viewport */
.card h3 {
  font-size: clamp(1rem, 4cqi, 1.5rem);
}
```

Drop `.card-wrapper` into a 300px sidebar and it stacks; drop it into an 800px column and it goes horizontal. The markup never changes. That's the whole point. The [official MDN container queries guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) is the reference I keep open while building these.

## When should you reach for container query units?

Use container query units (`cqi`, `cqw`, `cqh`, `cqb`) when you want typography and spacing to scale with the component instead of the screen. `1cqi` equals 1% of the container's inline size, so `font-size: 4cqi` grows and shrinks with the container. It's the container-scoped equivalent of `vw`, and it pairs beautifully with `clamp()` for fluid, bounded type.

- **`cqi`** — 1% of the container's inline size (usually width). The one you'll reach for most.
- **`cqw` / `cqh`** — 1% of container width / height explicitly.
- **`cqmin` / `cqmax`** — 1% of the smaller / larger container dimension.

Wrap them in `clamp()` so text never gets absurdly small or large: `clamp(1rem, 4cqi, 2rem)` keeps a floor and ceiling while staying fluid. If you're already tuning fluid type for performance, this dovetails with our [Core Web Vitals checklist](/en/posts/core-web-vitals-checklist).

## What's new in 2026: style and scroll-state queries

Here's my opinionated take: in 2026, "container queries" no longer means just size. Two additions crossed the line into production-ready this year, and they're the reason to revisit the feature.

**Style queries** let you query a container's custom properties, not its dimensions. Set `--theme: dark` on a parent and any descendant can react with `@container style(--theme: dark)`. Perfect for theming and variant systems without prop-drilling classes. These shipped in Chrome and Edge 111 back in 2023 and Safari 18 in 2024, and Firefox 151 (released May 19, 2026) finally added support for custom-property `style()` queries, making them Baseline Newly Available.

**Scroll-state queries** are the flashier arrival. Set `container-type: scroll-state` and a container can style its children based on whether it's `stuck`, `snapped`, `scrollable`, or `scrolled`, no JavaScript scroll listeners. This powers sticky-header shadows, scroll-hint arrows, and hidey-bar headers in pure CSS. Chrome and Edge 133 shipped `stuck`, `snapped`, and `scrollable`; Chrome 144 added `scrolled`, which tracks scroll direction.

| Feature | Chrome / Edge | Safari | Firefox | Baseline status |
|---------|---------------|--------|---------|-----------------|
| Size queries (`inline-size`) | 105+ (2022) | 16+ (2022) | 110+ (2023) | Widely available |
| Style queries (custom props) | 111+ (2023) | 18+ (2024) | 151+ (May 2026) | Newly available |
| Scroll-state queries | 133/144 | Not yet | Not yet | Chrome/Edge only |

The honest caveat: [scroll-state queries](https://developer.chrome.com/blog/css-scroll-state-queries) are Chromium-only in July 2026, so treat them as progressive enhancement until WebKit and Gecko catch up. The [MDN size and style queries guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_size_and_style_queries) documents the stable parts.

## What broke when we shipped this

Two things bit us in production. First, containment context collapse: setting `container-type: inline-size` establishes containment, and if you put it on an element whose children rely on `height: 100%`, the height can compute to zero. We fixed it by moving `container-type` to a dedicated wrapper instead of the flex parent.

Second, you cannot query an element based on its own container. The `@container` rule targets descendants, not the container itself. We tried styling `.card-wrapper` from its own query and nothing happened. Add an inner element and query that.

- **Don't** put `container-type` on the element you want to restyle. Put it on the parent.
- **Do** give the container a `container-name` so nested containers don't cross-fire.
- **Watch** for `height: 100%` children inside a size container, size containment can zero out their block size.

For deeper component work, cross-reference our take on [Tailwind CSS mistakes to avoid](/en/posts/tailwind-css-mistakes) and the [web accessibility checklist](/en/posts/web-accessibility-checklist) so responsive components stay usable, not just adaptive.

## Do you still need media queries in 2026?

Yes, but for a narrower job. Keep media queries for things that genuinely depend on the device or viewport: the overall page shell, global navigation, print styles, and user preferences like `prefers-color-scheme` or `prefers-reduced-motion`. Reach for container queries whenever a component adapts to its slot rather than the screen.

A simple rule of thumb: if the thing you're styling could appear in more than one width of container, use a container query. If it's a one-off page section tied to the viewport, a media query is fine. For component libraries and design systems, container queries are the default, and they sit alongside the other [frontend guides in Web Development](/en/category/web-development).

## Frequently Asked Questions

### Do CSS container queries work in all browsers in 2026?

Size queries, yes, universally. They shipped in Chrome/Edge (2022), Safari 16 (2022), and Firefox 110 (2023), with global support above 93% as of July 2026. Style queries for custom properties reached cross-browser support with Firefox 151 in May 2026. Scroll-state queries are Chrome and Edge only, so use them as progressive enhancement.

### Why isn't my `@container` rule applying?

The most common cause is a missing `container-type` on the ancestor, without it there's no container to query. The second is trying to style the container element itself; `@container` only affects descendants. Also confirm your `container-name` matches and that no closer ancestor is unintentionally acting as the container.

### What is the difference between `cqi` and `vw`?

`vw` is 1% of the viewport width, so it scales with the browser window. `cqi` is 1% of the nearest query container's inline size, so it scales with the component's parent. Use `cqi` when you want text and spacing to respond to where the component sits, not to the whole screen.

### Can I query scroll position without JavaScript now?

In Chromium, yes. With `container-type: scroll-state` you can style children based on `stuck`, `snapped`, `scrollable`, or `scrolled` states, replacing common scroll-event listeners. Safari and Firefox haven't shipped it yet in July 2026, so keep a JavaScript fallback for those browsers.
