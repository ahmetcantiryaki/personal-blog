---
title: "How Does CSS Subgrid Align Nested Grids?"
slug: "css-subgrid-align-nested-grids"
translationKey: "css-subgrid-align-nested-grids"
locale: "en"
excerpt: "Short answer: subgrid hands an inner grid's rows and columns to its parent grid's own tracks, so card headers, bodies, and CTAs line up across the row."
category: "web-development"
tags: ["css", "frontend", "responsive-design", "web-standards"]
publishedAt: "2026-11-09"
seoTitle: "How Does CSS Subgrid Align Nested Grids?"
seoDescription: "Short answer: subgrid hands an inner grid's rows and columns to its parent grid's own tracks, so card headers, bodies, and CTAs line up across the row."
---

Short answer: setting `grid-template-columns: subgrid` or `grid-template-rows: subgrid` on a grid item makes its inner grid inherit the parent's tracks instead of building its own. The result: a card's title, body, and button line up with every other card's. Subgrid has shipped in Chrome and Edge since version 117 (August 2023), Firefox since 2019, and Safari since 15.4 — over three years of support as of November 2026.

## What is CSS subgrid?

Subgrid is a value for `grid-template-columns` or `grid-template-rows` that lets a grid container hand its row or column tracks down to a grid item placed inside it. Normally, a nested `display: grid` element builds its own independent grid with no relationship to the outer one. The `subgrid` value removes that independence: the inner grid's tracks become exactly the same size as the matching tracks in the parent.

## What problem does subgrid actually solve?

The problem: in a card grid, if each card contains its own title, description, and button, one card's title wrapping to two lines pushes everything below it down — breaking alignment with the other cards. Before subgrid, fixing this meant measuring heights with JavaScript or manually syncing `grid-template-rows` values across every card. With subgrid, the parent grid defines three rows (title, body, CTA), each card inherits those three rows via `subgrid`, and the browser handles the alignment automatically.

## How does subgrid syntax actually work?

You first define a normal grid on the outer container, then set `subgrid` on the inner element. One thing trips up almost everyone: `gap` is not inherited — it has to be set again at each level.

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto auto;
  gap: 24px;
}

.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
  gap: 12px; /* subgrid does not inherit gap, so it's set again here */
}

.card-title {
  grid-row: 1;
}
.card-body {
  grid-row: 2;
}
.card-cta {
  grid-row: 3;
}
```

## When do you actually need subgrid?

The table below compares the scenarios where subgrid is the right tool against where another approach works just as well:

| Scenario | Needs subgrid? | Alternative |
|---|---|---|
| Aligning card titles/bodies/CTAs across a row | Yes | Measuring height in JS (fragile) |
| Aligning form labels and inputs vertically | Yes | Fixed widths (not responsive) |
| A single, self-contained component's internal layout | No | Plain `display: grid` is enough |
| A deliberately staggered, masonry-style layout | No | `grid-template-rows: masonry` (experimental in Firefox) |

## Does subgrid actually work well with container queries?

Yes, and the two complement each other directly: a container query changes a card's layout based on its own width, while subgrid keeps that card's rows aligned with the parent grid regardless. If a narrow container forces a card down to a single column, subgrid still keeps its row heights matched to the rest of the page. Our [piece on container queries](/en/posts/css-container-queries-how-to) covers how the two features combine into one responsive pattern in more detail.

## Is nesting depth a problem?

Subgrid isn't limited to one level — you can put a subgrid item inside another subgrid item, and each level inherits the grid above it. In practice, going more than two levels deep rarely solves a real problem and makes debugging harder: browser DevTools' grid inspector struggles to show which track came from which ancestor once nesting gets that deep.

## What about older browsers?

Versions before Chrome 117 (pre-August 2023) don't support subgrid, and while that version is nearly extinct among consumer users today, older Edge builds still turn up in some enterprise environments. Wrap the rule in `@supports (grid-template-columns: subgrid)` and fall back to each card defining its own `grid-template-rows: auto auto auto` — alignment breaks in that fallback case, but the layout itself doesn't.

## How do alignment properties like align-items and justify-items behave with subgrid?

Subgrid inherits track sizes, but alignment properties like `align-items`, `justify-items`, and `align-self` are set independently at each level, the same way `gap` is not inherited. Setting `align-items: stretch` on the parent grid doesn't automatically stretch the inner grid's items — you have to set the same rule on the subgrid element itself. Baseline alignment (`align-items: baseline`) is especially useful in text-heavy cards: headings with different font sizes align to the text baseline instead of the box's top or bottom edge. In practice, that keeps a price label and a heading sitting side by side with their numbers and letters visually lined up on the same line. To override alignment for a single cell, setting `align-self` or `justify-self` on that cell lets you carve out an exception without breaking the subgrid's overall rule.

## How does subgrid actually work in form layouts?

Outside card grids, one of subgrid's most practical uses is keeping labels and input fields vertically aligned in forms. With a plain `display: grid`, defining each form row separately means a label wrapping to two lines shifts the alignment of every input field below it. With subgrid, every form row shares the parent grid's tracks, so a wrapped label only affects its own row, not the rest of the form.

```css
.form-grid {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 16px 12px;
}

.form-row {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}

.form-label {
  grid-column: 1;
}
.form-input {
  grid-column: 2;
}
```

This pattern is especially useful in dynamically generated forms — fields built from an API schema, for instance — because even though each row has its own inner grid, they all share the same column widths, so input boxes always start on the same vertical line regardless of how long any one field's label happens to be.

## Can subgrid be combined with grid-template-areas?

Not directly. `grid-template-areas` needs its own `grid-template-columns`/`grid-template-rows` values to define named regions, and once those are set to `subgrid`, area names aren't inherited from the parent — a `grid-template-areas` defined on the outer grid isn't automatically visible to the inner one. Instead, you align tracks with `subgrid` and position items using numeric `grid-row`/`grid-column` values (`grid-row: 1`, or `grid-row: span 2`, for instance). That trades away some of `grid-template-areas`' readability, but the alignment payoff usually makes up for it — a common pattern in larger layouts is naming areas on the outer grid and falling back to numeric row/column references inside each card.

My honest take: subgrid is one of CSS Grid's least-known but highest-leverage features. Most teams are still solving the card-alignment problem with JavaScript simply because they don't know subgrid exists — a three-line CSS rule can replace a height-equalizing script that used to run hundreds of lines.

## Frequently Asked Questions

### Which browsers support CSS subgrid?

Subgrid has worked in Firefox since 2019, in Safari since 15.4, and in Chrome and Edge since version 117, released in August 2023. As of November 2026, that means every major browser engine has supported it for more than three years.

### Is subgrid the same thing as masonry layout?

No. Subgrid aligns an inner grid's tracks with its parent grid, and the resulting layout stays fully predictable. Masonry is a separate, experimental (Firefox-only as of now) layout mode that deliberately lets items stagger instead of aligning.

### Why doesn't subgrid inherit the gap value?

The CSS Grid spec defines `gap` as a property set independently at each grid level — subgrid only inherits track sizing, not spacing. That means you need to set `gap` again on the inner grid if you want spacing between its items.

### Does subgrid hurt performance?

There's no measurable performance cost: subgrid is an extension of the grid layout calculation the browser already runs, not an extra render pass. The real cost of deep nesting is harder debugging, not slower pages.
