---
title: "CSS Anchor Positioning: Popovers Without JS"
slug: "css-anchor-positioning-popovers-2026"
translationKey: "css-anchor-positioning-2026"
locale: "en"
excerpt: "Short answer: anchor-name and position-anchor tie a tooltip to its trigger element, and @position-try flips it automatically when it would overflow."
category: "web-development"
tags: ["css", "frontend", "web-standards", "responsive-design"]
publishedAt: "2026-09-05"
seoTitle: "CSS Anchor Positioning: Tooltips and Popovers Without JS"
seoDescription: "Short answer: anchor-name and position-anchor tie a tooltip to its trigger element, and @position-try flips it automatically when it would overflow."
---

Short answer: CSS Anchor Positioning lets you tie one element (a tooltip, dropdown, or popover) to another directly in CSS using `anchor-name` and `position-anchor` — no JavaScript positioning library like Popper.js or Floating UI required. As of July 2026, caniuse puts support at roughly 81%.

## What problem does this actually solve?

Short answer: until now, pinning a tooltip to a button meant running a JavaScript library that recalculated the element's position on every scroll and resize event — Anchor Positioning hands that calculation off to the browser's own rendering engine.

Floating UI and Popper.js still work fine, but each adds 5–10 KB to your bundle and leaves you manually solving classic issues like z-index conflicts and an `overflow: hidden` container clipping the tooltip. Because Anchor Positioning resolves positioning at the browser's layout-engine level, most of those problems disappear on their own.

## How do anchor-name and position-anchor work?

Short answer: give the trigger element `anchor-name: --my-anchor`, then set `position-anchor: --my-anchor` and `position: absolute` on the element you want positioned — a value like `top: anchor(bottom)` then tells the browser exactly which edge to align against.

```css
.trigger-button {
  anchor-name: --my-tooltip-anchor;
}

.tooltip {
  position: absolute;
  position-anchor: --my-tooltip-anchor;
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 8px;
}
```

These few lines do exactly what a JavaScript library's `useFloating()` hook used to do, with zero runtime calculation.

## How does @position-try handle viewport overflow?

Short answer: the `@position-try` rule lets you define an alternative placement for cases where the tooltip's preferred position would overflow off-screen; the browser automatically switches to that fallback once it detects the preferred position doesn't fit. This is the CSS equivalent of what Popper.js's "flip" middleware used to do.

```css
.tooltip {
  position-try-fallbacks: flip-block, flip-inline;
}

@position-try --tooltip-above {
  top: anchor(top);
  bottom: unset;
}
```

The `position-area` property serves a similar purpose: it lets you define a position using a nine-region grid (like "top center" or "bottom end"). Note that this property used to be called `inset-area`; as of Chrome 129 it was renamed to `position-area`, with the old name kept as a backward-compatible alias through Chrome 131.

## How does it pair with the Popover API?

Short answer: combine HTML's built-in `popover` attribute with Anchor Positioning, and a `<div popover>` element gets automatic top-layer rendering plus CSS-driven positioning — you get click-outside dismissal and ESC-to-close behavior without writing any JavaScript.

```html
<button popovertarget="info-popover" style="anchor-name: --info-btn">Info</button>
<div id="info-popover" popover style="position-anchor: --info-btn; top: anchor(bottom);">
  Content goes here.
</div>
```

This pairing is a natural extension of the [native HTML dialog and popover approach without JavaScript](/en/posts/native-html-no-javascript-dialog-popover) — you get the popover's behavior from the `popover` attribute and its position from Anchor Positioning.

## What's the current browser support situation?

Short answer: Chrome, Edge, and Opera (all Chromium-based) have had stable support since March 2024 (Chrome 125); Safari 18.x supports the core `anchor-name`, `position-anchor`, and `anchor()` function but is still waiting on `@position-try` until Safari 19; Firefox has implemented the spec and is expected to ship it in a stable release by mid-2026.

| Browser | Core Anchor Positioning | @position-try | Status (September 2026) |
|---|---|---|---|
| Chrome/Edge/Opera | Yes (v125+, March 2024) | Yes | Full support |
| Safari 18.x | Yes | No | Partial, v19 pending |
| Firefox | Implemented | Implemented | Close to stable |

Overall support sits at 81% per caniuse as of July 2026, but the newer Anchor Positioning Level 2 features (like multiple `position-try-fallbacks` values) reach only 64% of users. That gap matters when you're deciding which feature to actually reach for.

## How do you build a dropdown menu with it?

Short answer: give the button that opens the menu an `anchor-name`, give the menu itself `position-anchor`, and use a value like `position-area: bottom span-right` so the menu positions itself below the button and expands to the right. That replaces a classic dropdown library's default behavior with a single CSS declaration.

```css
.menu-trigger {
  anchor-name: --dropdown-anchor;
}

.dropdown-menu {
  position: absolute;
  position-anchor: --dropdown-anchor;
  position-area: bottom span-right;
  margin-top: 4px;
  min-width: anchor-size(width);
}
```

The `anchor-size()` function is also useful here: it lets you match the menu's width to the trigger button's width — something that previously required reading the button's `getBoundingClientRect()` value in JavaScript and applying it to the menu.

## Can you build complex layouts with multiple anchors?

Short answer: yes — an element can carry more than one `anchor-name`, and a positioned element can reference different anchors for different edges, which lets you align an element's top edge to one element and its left edge to another. That level of flexibility used to require hand-written JavaScript calculations.

That said, multi-anchor usage is a newer Anchor Positioning Level 2 feature, so browser support (64% of users) is more limited than single-anchor usage. If you're building a complex, multi-anchor layout, you'll want a more thorough `@supports` feature check.

## How do you build in progressive enhancement?

Short answer: use `@supports (anchor-name: --test)` to serve native CSS positioning in browsers that support it, and a fixed fallback position (like `position: fixed; bottom: 16px;`) everywhere else — for a non-critical tooltip, that gives you a reasonable-looking result on Safari 18 and older browsers without breaking the experience.

```css
.tooltip {
  position: fixed;
  bottom: 16px;
  right: 16px;
}

@supports (anchor-name: --test) {
  .tooltip {
    position: absolute;
    position-anchor: --my-tooltip-anchor;
    top: anchor(bottom);
    position-try-fallbacks: flip-block;
  }
}
```

My take: switch to Anchor Positioning today for non-critical UI elements (tooltips, simple dropdowns) and keep the fallback simple; but for a component that needs complex, multi-directional positioning logic (a date picker, say), holding onto Floating UI is the safer bet until Firefox's stable support is widespread.

Paired with [CSS container queries](/en/posts/css-container-queries-how-to), you can make the internal layout of an Anchor-Positioned popover responsive too — the two solve different problems, but they sit side by side in the same component.

## Frequently Asked Questions

### Is CSS Anchor Positioning worth using today?

Yes, for non-critical UI elements like tooltips and simple dropdowns — you can ship it to production today with an `@supports` fallback. Support sits at 81% as of July 2026, though Safari is still missing `@position-try`.

### Does Anchor Positioning fully replace Floating UI?

For simple positioning scenarios (tooltips, basic popovers), yes — no JavaScript library needed. For components that need complex, multi-variable positioning logic, Floating UI remains the safer choice until Firefox's support stabilizes.

### What's the difference between position-area and inset-area?

They're the same property — `inset-area` was renamed to `position-area` starting with Chrome 129. The old name is kept for backward compatibility through Chrome 131, but new code should use `position-area`.

### What does @position-try actually do?

It lets you define an alternative placement that kicks in automatically when an element's preferred position would overflow the viewport. This replaces what Popper.js's "flip" middleware used to do, in pure CSS — though it isn't supported in Safari yet.
