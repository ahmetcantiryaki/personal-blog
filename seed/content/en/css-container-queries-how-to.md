---
title: "CSS Container Queries: A Practical How-To"
slug: "css-container-queries-how-to"
translationKey: "css-container-queries"
locale: "en"
excerpt: "Learn CSS container queries how to work in practice: set a containment context, query the parent's width, and build components that adapt anywhere."
category: "web-development"
tags: ["css", "frontend", "responsive-design"]
publishedAt: "2026-04-23"
seoTitle: "CSS Container Queries: A Practical How-To"
seoDescription: "CSS container queries how to guide: define a container with container-type, query its width with @container, and build truly reusable responsive components."
---

Here is CSS container queries how to in one breath: give a parent `container-type: inline-size`, then style its children with `@container (min-width: ...)` so they respond to the **container's** size instead of the viewport. As of 2026 every major browser supports this, and it's the cleanest way to build components that adapt to wherever you drop them.

Media queries ask "how big is the screen?" Container queries ask "how big is my parent?" That one shift is what finally makes a card, sidebar, or widget truly reusable.

## What are CSS container queries?

CSS container queries let an element respond to the size of its containing element rather than the browser viewport. You mark an ancestor as a query container with `container-type`, then write `@container` rules that apply based on that container's width or height. The same component can render compact in a sidebar and wide in a main column, with no viewport math.

This solves the core weakness of media queries: a component styled for a 1200px viewport breaks the moment you reuse it in a narrow slot. Container queries move the decision to where it belongs, the component's actual available space.

## How do container queries differ from media queries?

The short answer: media queries respond to the viewport, container queries respond to a parent element. Media queries are global and layout-level; container queries are local and component-level. You'll still use both, media queries for page shell and global breakpoints, container queries for reusable components that live in unpredictable slots.

| Aspect | Media queries | Container queries |
|--------|---------------|-------------------|
| Responds to | Viewport / device | Nearest query container |
| Scope | Global, page-wide | Local, per component |
| Best for | Page layout, shell | Reusable components, widgets |
| Reusability | Breaks in new contexts | Portable anywhere |
| Syntax | `@media (min-width: 600px)` | `@container (min-width: 400px)` |
| Browser support (2026) | Universal | All evergreen browsers |

## CSS container queries how to: the step-by-step setup

Follow these steps in order to convert a component to container-based responsiveness. Each one builds on the last, so don't skip the containment context:

1. **Wrap the component in a container element.** You need an ancestor to query. A wrapping `<div>` or the component's own root element works.
2. **Declare the containment type.** Add `container-type: inline-size` to that wrapper so the browser tracks its inline (horizontal) size.
3. **Name the container (optional but recommended).** Add `container-name: card` so you can target it explicitly and avoid querying the wrong ancestor.
4. **Write your `@container` rules.** Style the children based on the container width: `@container card (min-width: 400px) { ... }`.
5. **Set mobile-first defaults.** Style the narrow layout first, outside any query, then layer wider layouts on top.
6. **Add container query units where useful.** Use `cqi`, `cqw`, or `cqh` to size fonts and spacing relative to the container.
7. **Test in multiple slots.** Drop the component into a sidebar, a grid cell, and a full-width row to confirm it adapts on its own.

## What does the code look like?

The most common pattern is a card that switches from stacked to side-by-side based on its own width. Define the container once, then write a single `@container` rule. Here is a complete, runnable example:

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

Drop `.card-wrapper` into a 300px sidebar and it stacks; drop it into an 800px column and it goes horizontal. The markup never changes. That's the whole point.

## When should you use container query units?

Use container query units (`cqi`, `cqw`, `cqh`, `cqb`) when you want typography and spacing to scale with the component instead of the screen. `1cqi` equals 1% of the container's inline size, so `font-size: 4cqi` grows and shrinks with the container. It's the container-scoped equivalent of `vw`, and it pairs beautifully with `clamp()` for fluid, bounded type.

- **`cqi`** — 1% of the container's inline size (usually width). The one you'll reach for most.
- **`cqw` / `cqh`** — 1% of container width / height explicitly.
- **`cqmin` / `cqmax`** — 1% of the smaller / larger container dimension.

Wrap them in `clamp()` so text never gets absurdly small or large: `clamp(1rem, 4cqi, 2rem)` keeps a floor and ceiling while staying fluid in between.

## What broke when we shipped this (and how we fixed it)

Two things bit us in production, and both are worth flagging up front. First, the containment context collapse: setting `container-type: inline-size` establishes containment, and if you accidentally put it on an element whose children rely on `height: 100%`, the height can compute to zero. We fixed it by moving the `container-type` to a dedicated wrapper instead of the flex parent.

Second, you cannot query an element based on its own container. The `@container` rule targets descendants, not the container itself. We tried styling `.card-wrapper` from its own query and nothing happened, the query only sees children. Add an inner element and query that.

- **Don't** put `container-type` on the element you want to restyle. Put it on the parent.
- **Do** give the container a `container-name` so nested containers don't cross-fire.
- **Watch** for `height: 100%` children inside a size container, size containment can zero out their block size.

For deeper layout patterns, see our [guide to modern CSS layout with grid and flexbox](/blog/modern-css-layout) and the broader [responsive design fundamentals article](/blog/responsive-design-fundamentals). If you're auditing performance impact, cross-reference our [Core Web Vitals checklist](/blog/core-web-vitals-checklist).

## Do you still need media queries in 2026?

Yes, but for a narrower job. Keep media queries for things that genuinely depend on the device or viewport: the overall page shell, global navigation, print styles, and user preferences like `prefers-color-scheme` or `prefers-reduced-motion`. Reach for container queries whenever a component needs to adapt to its slot rather than the screen. Most 2026 codebases use both, and that's the right call.

A simple rule of thumb: if the thing you're styling could appear in more than one width of container, use a container query. If it's a one-off page section tied to the viewport, a media query is fine. For component libraries and design systems, container queries have become the default, and they play nicely with the other [frontend guides on our category page](/blog/web-development).

## Frequently Asked Questions

### Do CSS container queries work in all browsers in 2026?

Yes. Size container queries shipped in Chrome and Edge (2022), Safari 16 (2022), and Firefox 110 (2023), so every evergreen browser has supported them for years by 2026. Style container queries (querying custom properties) are also broadly available now. You can use size queries in production without a fallback for the vast majority of users.

### Why isn't my `@container` rule applying?

The most common cause is a missing `container-type` on the ancestor, without it, there's no container to query. The second is trying to style the container element itself; `@container` only affects descendants. Also confirm your `container-name` matches, and that no closer ancestor is unintentionally acting as the container.

### What is the difference between `cqi` and `vw`?

`vw` is 1% of the viewport width, so it scales with the browser window. `cqi` is 1% of the nearest query container's inline size, so it scales with the component's parent. Use `cqi` when you want text and spacing to respond to where the component sits, not to the whole screen.

### Can I use container queries with height instead of width?

Yes, but carefully. Set `container-type: size` (not `inline-size`) to query both dimensions, then use `@container (min-height: ...)`. The catch is that `container-type: size` applies containment on both axes, which can collapse elements that derive their height from content. Prefer `inline-size` unless you truly need height-based queries.
