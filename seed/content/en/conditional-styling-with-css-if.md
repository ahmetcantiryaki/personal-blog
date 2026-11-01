---
title: "Conditional Styling with CSS if()"
slug: "conditional-styling-with-css-if"
translationKey: "css-if-conditional-styling-2026"
locale: "en"
excerpt: "Short answer: CSS if() picks a property's value from a style(), media(), or supports() test. It runs in Chromium today, not yet in Firefox or Safari."
category: "web-development"
tags: ["css", "web-standards", "frontend", "responsive-design"]
publishedAt: "2026-11-01"
seoTitle: "CSS if(): Syntax, Browser Support, and Fallbacks"
seoDescription: "What is the CSS if() function, how do style(), media(), and supports() conditions work, which browsers support it, and when should it replace JS toggles?"
---

Short answer: CSS `if()` is a value function that picks a property's value based on a `style()`, `media()`, or `supports()` test. As of November 2026 it only runs in Chromium-based browsers (Chrome and Edge 137+); Firefox is still implementing it and Safari has no support yet, so you need an `@supports` guard before shipping it.

## What is CSS if() and why does it exist?

CSS `if()` moves simple conditional styling decisions — the kind previously pushed to JavaScript or `data-*` attributes — directly into CSS. It lets you choose a property's value with "if this condition is true, use X, otherwise Y" logic, and the browser resolves that decision on every repaint without waiting for a `classList.toggle()` call.

The practical payoff is that small variant logic stops leaking out of your stylesheet. Changing a button's color based on a theme custom property no longer requires maintaining a separate `data-theme` attribute or a dedicated class per theme — one `color` line can handle it.

## Which browsers support CSS if() right now?

`if()` is not Baseline as of November 2026 — MDN marks it "limited availability" because it does not work in several widely used browsers. Chrome and Edge support it from version 137 onward, Firefox has it under active development with no shipping date announced, and Safari has not shipped support yet.

| Browser | Status (November 2026) |
|---|---|
| Chrome / Edge | Supported (137+) |
| Firefox | In development, no date given |
| Safari | Not yet supported |
| Chrome for Android | Supported |

That table has one practical consequence: ship `if()` today and a chunk of your visitors — Safari and Firefox users — see zero conditional styling, so you always need a plain fallback value sitting underneath it.

## How do you write style(), media(), and supports() conditions?

Inside `if()` you can use three different condition tests, and each answers a different question: `style()` checks a custom property or computed style on the *same* element, `media()` behaves like an inline media query, and `supports()` tests whether the browser supports a given declaration at all.

```css
.card {
  /* style(): reads a custom property on this same element, no parent needed */
  background: if(style(--theme: dark): #111; else: #fff);

  /* media(): acts like an inline media query */
  margin: if(media(width > 700px): 0 auto; else: 1rem);

  /* supports(): tests browser feature support */
  color: if(supports(color: lch(75% 0 0)): lch(75% 0 0); else: #333);
}
```

Each condition is followed by a colon and a value, branches are separated by semicolons, and an optional `else:` branch supplies the fallback. Inside `style()` tests you can also combine conditions with `not`, `and`, and `or` — so you can write something like "if the theme isn't dark and the viewport is wider than 700px."

This differs from container style queries in one key way: `style()` doesn't need a parent element to query against — it reads the custom property directly off the element it's styling.

## How does if() replace JS-driven toggles?

Instead of managing a button variant through a `data-variant="primary"` attribute toggled by JavaScript, you can keep the variant in a custom property and read it with `if()` — moving the styling decision into CSS without JS ever touching the DOM's class list.

```css
.button {
  --variant: primary;
  background: if(
    style(--variant: primary): var(--color-brand);
    style(--variant: danger): var(--color-danger);
    else: var(--color-neutral)
  );
}
```

Here JavaScript's only job is updating the `--variant` custom property via inline style; every dependent decision — background, border, text color — stays in CSS. Much like the type-safety discipline covered in [advanced TypeScript patterns](/en/posts/advanced-typescript-patterns), centralizing this logic in one place (CSS, in this case) cuts the risk of inconsistent variant code scattered across a component's different states.

Under the old approach, adding a new variant meant updating both the `classList` logic in JavaScript and the matching class selector in CSS. With `if()`, that second step disappears, because the full variant list lives entirely in the stylesheet — a real maintenance win for small, three- or four-variant components like badges, tags, or notification chips in a component library.

## Does if() carry a performance cost?

`if()` conditions are simple comparisons the browser re-evaluates during style recalculation, so using a few `if()` calls on one element doesn't carry a measurable performance cost. The real risk isn't performance — it's readability: stacking more than five nested `if()` conditions on a single element can make a stylesheet harder to follow than the JavaScript it replaced.

## How does if() interact with custom properties and @property?

When the custom property `if()` reads is typed through `@property`, the condition test compares the value in a type-safe way; on an untyped custom property, the comparison falls back to raw text matching. The practical effect: define something like `@property --variant { syntax: "primary | danger | neutral"; }`, and an invalid value assignment falls back to the registered default, keeping the `if()` test predictable.

That combination matters most in a large design system, where typo-proofing variant names saves real debugging time — an untyped custom property lets a typo like "primray" pass through silently, while a typed definition rejects it outright.

## When is if() the wrong tool?

`if()` fits a single element making one simple value decision based on its own state; but if you need to change several properties at once based on a parent's size or a breakpoint, [container queries](/en/posts/css-container-queries-how-to) or [cascade layers](/en/posts/css-cascade-layers-at-layer) are the better tool. Container queries are built to restyle an entire block's layout, while `if()` is built to swap out one value.

My take: trying to use `if()` to replace every `data-*` attribute in a codebase is a refactor that invites bugs. For simple color or spacing decisions with three variants or fewer, `if()` is a genuine win; for a complex component with five or more variants, a class-based approach or cascade layers still reads more clearly.

A practical rule: when writing a new component, ask whether the decision affects a single value or several properties together. If it's a single value, reach for `if()`; if it's several properties, reach for a container query or cascade layers — that one distinction settles most of the "which tool" debate before it starts.

## How do you write a fallback for unsupported browsers?

The safe pattern is wrapping `if()` inside an `@supports` block and leaving a plain default value outside it, so the stylesheet guarantees the enhanced behavior where `if()` is supported and a plain, functional look everywhere else.

```css
.card {
  background: #fff; /* default, stays in place if if() isn't supported */
}

@supports (background: if(style(--x: 1): red; else: blue)) {
  .card {
    background: if(style(--theme: dark): #111; else: #fff);
  }
}
```

This is the same progressive-enhancement logic highlighted in [building accessible forms](/en/posts/building-accessible-forms-checklist): keep the baseline experience working with zero dependency on the new feature, then layer the enhanced behavior on top for browsers that support it.

## Frequently Asked Questions

### What is CSS if()?

CSS `if()` is a value function that picks a property's value based on a `style()`, `media()`, or `supports()` condition. It moves conditional styling logic out of JavaScript or `data-*` attributes and directly into CSS.

### Which browsers support CSS if()?

As of November 2026, it works in Chrome and Edge from version 137 onward; Firefox has it under development and Safari has no support yet. Always pair it with an `@supports` guard and a plain fallback value in production.

### What's the difference between if() and a media query?

An `@media` block makes an entire rule conditional, while the `media()` test inside `if()` only makes a single property value conditional. If you need to change several properties together, `@media` or a container query is still the right tool.

### When should if() be used instead of a container query?

Use `if()` for a single value decision tied to one element's own custom property or a simple media/support test. If you need to change multiple properties together based on a parent element's size, a container query is the better fit.
