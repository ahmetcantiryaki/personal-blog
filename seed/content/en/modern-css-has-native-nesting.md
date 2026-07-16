---
title: "Modern CSS: :has() and Native Nesting"
slug: "modern-css-has-native-nesting"
translationKey: "modern-css-has-nesting"
locale: "en"
excerpt: "Two CSS features quietly deleted a chunk of our JavaScript and our Sass build step: the :has() parent selector and native nesting. Here's what they replace."
category: "web-development"
tags: ["css", "frontend", "web-standards", "best-practices"]
publishedAt: "2026-07-16"
seoTitle: ":has() and Native CSS Nesting: A Practical Guide"
seoDescription: "CSS :has() and native nesting now ship in every modern browser. See what JavaScript and Sass they let you delete, with three copy-paste patterns."
---

CSS shipped a parent selector. That sentence alone should have been bigger news than it was: `:has()` lets you style an element based on what's inside it, something CSS authors have wanted since Sass first faked specificity tricks to work around it. Combined with native nesting, a good chunk of the JavaScript we wrote for class-toggling and the Sass build step we ran just to nest selectors are no longer load-bearing.

## :has() is the parent selector CSS never had

For twenty-plus years, CSS could only select an element based on its own attributes or its ancestors — never its descendants. `:has()` inverts that: `.card:has(img)` matches a `.card` that contains an `img`, and `label:has(input:checked)` matches a label whose checkbox is checked. As of 2026 it works in Chrome 105+, Edge 105+, Firefox 121+, Safari 15.4+, Opera 91+, and Samsung Internet 20+ — every modern engine — and reached [Baseline Widely Available](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has) status on June 19, 2026, meaning it's now safe to ship without a fallback on any project that doesn't need to support browsers from more than 2.5 years ago.

The two patterns that show up constantly:

```css
/* Style a card differently when it contains an image */
.card:has(img) {
  grid-template-rows: auto 1fr;
}

/* Drive form-validation UI without a single line of JS */
.field:has(input:invalid:not(:placeholder-shown)) {
  border-color: var(--color-danger);
}

.field:has(input:invalid:not(:placeholder-shown)) .error-message {
  display: block;
}
```

That second pattern used to require a `change` or `input` event listener toggling a class. Now it's a selector. The catch worth knowing: browser engines re-evaluate `:has()` on every relevant DOM mutation, and a `:has()` selector scoped near the document root against a huge subtree can measurably slow down layout on frequent updates. Scope it tight — to a component root, not `body:has(...)` — and it stays cheap.

## Native nesting replaces the reason most teams kept Sass

Sass gave CSS three things it didn't have natively: variables, nesting, and a build step to enforce discipline. CSS custom properties killed the first reason years ago. [Native CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting) — standardized and broadly supported since 2024, with parity across the same browser set `:has()` reached — kills the second. What's left is mostly the build step itself, and plenty of teams running Vite or PostCSS already get autoprefixing without Sass in the loop.

```css
/* Native nesting — no preprocessor, no build step required */
.card {
  padding: 1rem;
  border-radius: 0.5rem;

  & > h3 {
    font-size: 1.25rem;
  }

  &:has(img) {
    grid-template-rows: auto 1fr;
  }

  @media (min-width: 640px) {
    padding: 1.5rem;
  }
}
```

Note the `&` is required at the start of a nested compound selector when it's not a bare descendant combinator — `& > h3` and `&:has(img)` both need it, while a plain `h3 { ... }` nested inside also works as shorthand for a descendant. That trips up developers coming straight from Sass, where the `&` is optional in more places.

## Pairing :has() and nesting with container queries

The other 2026-era CSS feature worth combining these with is container queries, covered in more depth in our [practical container-queries how-to](/en/posts/css-container-queries-how-to). The three together cover most of what a component library needs without a single class-toggling script:

```css
.card {
  container-type: inline-size;

  &:has(img) {
    grid-template-columns: 120px 1fr;
  }

  @container (min-width: 400px) {
    &:has(img) {
      grid-template-columns: 180px 1fr;
    }
  }
}
```

That's a card whose layout responds to both its own container's width and whether it contains an image — zero JavaScript, zero Sass, one nested rule.

| Feature | Baseline status (2026) | Replaces |
|---|---|---|
| `:has()` | Widely Available (June 19, 2026) | class-toggling JS for content-based styling |
| Native nesting | Widely Available | Sass nesting |
| Container queries | Widely Available | media-query-only responsive components |
| CSS custom properties | Widely Available (since 2020) | Sass variables |

## Progressive enhancement with @supports

None of this means you can delete your fallback path if you have a real audience on older browsers. `@supports selector(:has(a))` lets you feature-detect `:has()` specifically — support-table entries for the selector syntax can lag the property syntax, so test the actual selector form you're shipping:

```css
.field .error-message {
  display: none;
}

@supports selector(:has(a)) {
  .field:has(input:invalid:not(:placeholder-shown)) .error-message {
    display: block;
  }
  .field .error-message {
    display: none;
  }
}
```

For nesting, the safer move if you support pre-2023 browsers is still to run your nested CSS through a build tool like [Lightning CSS or PostCSS](/en/posts/tailwind-css-mistakes) that flattens it at build time — you get the authoring ergonomics natively and a compiled fallback for free, with no runtime cost either way.

## A third pattern worth knowing: styling empty states

One more `:has()` trick that quietly replaces a common conditional-rendering hack: styling a container based on the *absence* of children, using `:not()` combined with `:has()`.

```css
/* Style a list container when it has zero items */
.list:not(:has(li)) {
  display: grid;
  place-items: center;
  min-height: 12rem;
}

.list:not(:has(li))::after {
  content: "Nothing here yet.";
  color: var(--color-muted);
}
```

That's a real empty state — no `items.length === 0 ? <EmptyState /> : <List />` branch in your component, no extra markup shipped just to conditionally hide it. It's a small pattern, but it's the kind of thing that used to require either a JavaScript conditional or a dedicated "empty" class the application had to remember to toggle, and now it's just CSS reading the DOM it's already attached to.

My take, after ripping about 200 lines of class-toggling logic out of a component library this quarter: `:has()` is the single highest-leverage CSS feature to land in the last five years, precisely because it deletes JavaScript rather than adding a CSS capability that JavaScript never needed to cover in the first place. Nesting is a smaller win — it saves a build step, not a runtime — but stacked together they make a strong case for auditing whether your project still needs Sass at all in 2026.

## Frequently Asked Questions

### Is :has() safe to use in production in 2026?

Yes, for any project that doesn't need to support browsers older than roughly 2.5 years. It reached Baseline Widely Available status on June 19, 2026 and works in every current major browser engine.

### Does native CSS nesting fully replace Sass?

It replaces Sass's nesting and, combined with CSS custom properties, its variables. Sass still offers mixins, functions, and loops that native CSS doesn't have equivalents for yet, so teams using those features still need a preprocessor or a build step.

### Can :has() hurt performance?

Yes, if scoped broadly against a large, frequently mutating subtree, since browsers re-evaluate `:has()` matches on relevant DOM changes. Scope selectors to a component root rather than a page-wide ancestor to keep the cost negligible.

### What's the difference between :has() and a plain descendant selector?

A descendant selector like `.card img` selects the descendant (the image). `:has()` selects the ancestor based on what it contains — `.card:has(img)` selects the card itself, not the image inside it. That's the part that makes it a genuine parent selector.
