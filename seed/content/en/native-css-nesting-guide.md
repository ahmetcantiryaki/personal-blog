---
title: "How Do You Use Native CSS Nesting?"
slug: "native-css-nesting-guide"
translationKey: "css-native-nesting-2026"
locale: "en"
excerpt: "Short answer: every major browser has supported native CSS nesting since Chrome 120, Firefox 117, and Safari 17.2; drop Sass for most of what it did."
category: "web-development"
tags: ["css", "frontend", "web-standards", "best-practices"]
publishedAt: "2026-11-15"
seoTitle: "Native CSS Nesting: A Practical Migration Guide"
seoDescription: "CSS nesting is now Baseline, supported since Chrome 120, Firefox 117, and Safari 17.2. Here's the & rule, media query nesting, and specificity gotchas vs. Sass."
---

Short answer: yes, you can write most component styling in plain CSS today — native CSS nesting has worked in every major browser since Chrome 120, Edge 120, Firefox 117, and Safari 17.2, and it's been Baseline "widely available" since June 2026. You don't need to drop Sass entirely; loops, mixins, and functions still earn a preprocessor its place, but simple nested selectors no longer need a build step.

## How does the CSS nesting syntax work?

Nesting lets you write one selector inside another and tie it to its parent, with `&` representing the parent selector. Before Chrome 120, Firefox 117, and Safari 17.2, only nested rules starting with `&` — like `& h2` — were accepted; the "relaxed syntax" that shipped in those versions lets you start directly with a bare element selector like `h2` instead.

```css
.card {
  padding: 1rem;
  border-radius: 0.5rem;

  h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  }

  &.featured {
    border: 2px solid var(--accent);
  }
}
```

`&` is still required for compound selectors like `:hover` and `.featured`; it's only optional now for simple descendant selectors that start with a bare element name.

## How do you nest media queries?

You can write a media query directly inside a rule to keep a component's style and its responsive behavior in one block, which gives you natively what you used to fake in Sass with a mixin like `@include breakpoint`.

```css
.sidebar {
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
}
```

This structure keeps all of a component's breakpoint behavior in one place — you're no longer hunting through three separate media-query blocks scattered across the stylesheet to find how a sidebar behaves.

## How is CSS nesting's specificity different from Sass?

In native CSS nesting, `&` takes the highest specificity from the parent selector list — the same logic `:is()` uses. Sass, by contrast, compiles to a separate, flat descendant selector at build time, which can make the two systems calculate specificity differently. If a parent selector includes an ID, for example, a nested rule like `.card .title` can end up with unexpectedly high specificity, leading to unpredictable override bugs.

| | Sass nesting | Native CSS nesting |
|---|---|---|
| Build step | Required | Not required |
| Specificity calculation | Like a flat descendant selector | Highest specificity, `:is()`-style |
| Media query nesting | Faked with a mixin | Natively supported |
| Loops/functions/mixins | Yes | No |
| Browser support needed | No, resolved at build time | Yes, Chrome 120/Firefox 117/Safari 17.2+ |

## Should you drop your preprocessor entirely?

No, if your project is a design system that loops with `@each`, computes a color shade with a function, or shares mixins across multiple files, Sass still adds real value — none of that has a native CSS equivalent. But if your project's Sass use is mostly nested selectors — true for most small-to-medium component libraries — switching to native nesting can remove the build step entirely.

## How do you migrate a component from Sass to native CSS?

The example below walks through a typical Sass card component converted line by line to native CSS:

```css
/* Before: Sass */
.card {
  padding: 1rem;
  &__title {
    font-size: 1.25rem;
  }
  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  }
}

/* After: native CSS */
.card {
  padding: 1rem;

  .card__title {
    font-size: 1.25rem;
  }

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  }
}
```

The only real difference is that Sass's `&__title` shorthand has no native CSS equivalent — if you're using BEM-style naming, you have to spell out the full class name inside the nested selector. Beyond that, the conversion is nearly one-to-one.

## Is there a common way to misuse nesting?

The most frequent mistake is nesting too deep — a four- or five-level nested block hurts readability in Sass just as much as in native CSS, and it makes specificity unpredictable. A practical rule is to cap nesting at two, at most three, levels; needing a fourth level is usually a sign the component should be split into smaller pieces. The second common mistake is adding an ID to a parent selector without accounting for how `&` inherits specificity — this can make a nested rule unexpectedly override another one, and in a large stylesheet, that's the kind of bug you can spend hours chasing in DevTools before noticing the real cause.

## Can you use nesting without a build tool like PostCSS or Vite?

Yes, and that's the real win here — if your target browsers cover Chrome/Edge 120, Firefox 117, and Safari 17.2 or later, you can write it directly in your `.css` file with no compiler, plugin, or build step at all. On a static site, an Astro project, or a simple Next.js app, that removes the `sass` package, the matching webpack/Vite plugin, and the build step entirely. Fewer dependencies means less security-patch tracking and a shorter `npm install` — a small win individually, but one that saves real seconds off build time on a project with 50+ components.

## Which browser versions support nesting?

Chrome and Edge 120, Firefox 117, and Safari 17.2 support it with the relaxed syntax; earlier ranges like Chrome 112-119 and Safari 16.5-17.1 had a more restrictive older syntax requiring `&` in front of descendant selectors. If you're nesting with `:host` inside Shadow DOM, there are known issues in Safari versions before 18.1 — in that specific case, keeping an older fallback is reasonable.

My honest take: the real win from CSS nesting isn't "less code," it's "fewer tools" — removing a build step genuinely cuts build time and dependency surface, especially on static sites and small component libraries. But don't underestimate the specificity difference; if you have a parent selector that includes an ID, don't skip visual regression testing when migrating from Sass to native.

For more plain-CSS techniques, see our guide to [building a native CSS carousel without JavaScript](/en/posts/build-a-native-css-carousel-without-javascript); our [web development category](/en/category/web-development) has more practical guides like this.

Sourcing: [MDN's CSS nesting module](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting) and [Chrome's relaxed syntax announcement](https://developer.chrome.com/blog/css-nesting-relaxed-syntax-update).

## Frequently Asked Questions

### Which browsers support CSS nesting?

Chrome and Edge 120, Firefox 117, and Safari 17.2 support it with the relaxed syntax, and it's been Baseline "widely available" since June 2026. Older versions (Chrome 112-119, Safari 16.5-17.1) only supported a more restrictive syntax that required starting with `&`.

### Why is & required in CSS nesting, and when isn't it?

The `&` character represents the parent selector and is still required for compound selectors like `:hover` and `.featured`. Thanks to the relaxed syntax, you no longer need `&` for simple descendant selectors that start with a bare element name like `h2`.

### Does native CSS nesting produce less reliable specificity than Sass?

Not less reliable, but different: `&` takes the highest specificity from the parent selector list (the same way `:is()` works), while Sass compiles to a flat descendant selector. If a parent selector includes an ID, that difference can cause unexpected override bugs, so visual regression testing matters during migration.

### Can I drop Sass completely?

Yes, if your project only uses Sass for nested selectors, you can switch to native CSS nesting and remove the build step. But if you rely on `@each` loops, color-computing functions, or shared mixins, those have no native CSS equivalent, so Sass is still necessary.
