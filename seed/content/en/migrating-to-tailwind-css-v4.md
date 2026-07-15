---
title: "Migrating to Tailwind CSS v4"
slug: "migrating-to-tailwind-css-v4"
translationKey: "tailwind-v4-migration"
locale: "en"
excerpt: "Migrating to Tailwind CSS v4 means a CSS-first @theme config, a Rust-based Oxide engine, and renamed utilities. Field notes and a migration checklist."
category: "web-development"
tags: ["tailwind", "css", "frontend", "developer-experience"]
publishedAt: "2026-07-15"
seoTitle: "Migrating to Tailwind CSS v4: Field Notes for 2026"
seoDescription: "What changes when you migrate to Tailwind CSS v4? CSS-first @theme config, the Rust Oxide engine, renamed utilities, OKLCH colors, and the upgrade codemod."
---

Migrating to Tailwind CSS v4 replaces tailwind.config.js with a CSS-first @theme block, swaps the build engine for the Rust-based Oxide engine, renames a handful of common utilities, moves the default color palette to OKLCH, and drops support for older browsers. These are field notes from moving a mid-sized production app from v3 to v4 in July 2026.

## @theme: the CSS-first config replacing tailwind.config.js

In Tailwind v3, the entire theme lived as a JavaScript object in tailwind.config.js — colors, spacing, and font families all nested under theme.extend. As that file grew, it got harder to read and harder to get editor autocomplete on. In v4, theme configuration moves directly into CSS: it's now defined inside an @theme block as CSS custom properties. The old PostCSS-plugin-based JS-config flow still works, but it's deprecated in favor of the new engine.

Here's the same theme value expressed both ways:

```js
// tailwind.config.js (v3)
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#5b21b6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}
```

```css
/* app.css (v4) */
@import "tailwindcss";

@theme {
  --color-brand: #5b21b6;
  --font-sans: "Inter", sans-serif;
}
```

The side effect I like most in practice: since theme values are now real CSS custom properties, they show up directly in browser devtools and can be inspected like any other CSS variable. There's also no separate JS build step needed just for the theme — the CSS file becomes the single source of truth.

## The Oxide engine: a faster cold build in Rust

Tailwind v4 runs on Oxide, a Rust-based engine that unifies content scanning, class extraction, and CSS generation into a single pipeline. [Tailwind's official v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4) describes it as a ground-up rewrite. The numbers people cite span a wide range: full builds are reported as roughly 2–5x faster, with one commonly cited example dropping from around 600ms to 120ms, and incremental rebuilds reported as high as 100x+ faster in some cases. What I saw on my own project sits at the conservative end of that range — a **60–80% faster cold build** — and the exact number depends heavily on content volume and file count.

The difference is even more noticeable in watch mode: after a small class change, the refreshed styles in the browser feel nearly instant. On a mid-sized Next.js project (about 40 routes, a few hundred components), this was one of the rare upgrades that actually shortened the day-to-day dev loop.

## What utilities got renamed?

The most common breaking change during migration was utilities that got renamed outright. The three I ran into most:

| v3 class | v4 class | Note |
|---|---|---|
| `bg-gradient-to-r` | `bg-linear-to-r` | Gradient utilities now use a "linear" prefix |
| `flex-shrink-0` | `shrink-0` | The `flex-` prefix was dropped |
| `flex-grow` | `grow` | The `flex-` prefix was dropped |

Old names may keep working as aliases for a while, but leaving both old and new spellings scattered across a codebase is exactly the kind of inconsistency covered in our [Tailwind CSS mistakes to avoid](/en/posts/tailwind-css-mistakes) post. Try not to let a migration PR mix the two.

## OKLCH: why the default palette changed

Tailwind v4 moves the default color palette from RGB/sRGB to OKLCH, taking advantage of the wider P3 gamut on displays that support it. The Tailwind team deliberately kept the visual balance close to v3 — this isn't a redesign. A familiar class like blue-500 might render slightly more vivid on a P3-capable screen, but the overall feel and contrast ratios stay largely the same. If you already define brand colors through custom @theme values, this change may not touch you at all; it's most noticeable on projects still using the default palette (slate, blue, emerald, and so on).

## What native @layer cascade brings

v4 now implements its base, components, and utilities layers using the browser's native CSS cascade layers instead of Tailwind's own post-processing trick. The concrete payoff: overriding a third-party component library's styles (a date picker, a map widget) needs `!important` far less often, because cascade order is now handled predictably by the browser itself. This lines up with the same shift toward native browser capability you'll see in other modern CSS features; our guide to [CSS container queries](/en/posts/css-container-queries-how-to) covers a similar browser-native approach.

## Running the @tailwindcss/upgrade codemod

You don't do most of the migration by hand. The official codemod handles the dependency update, migrates the JS config to CSS, and automatically renames the large majority of aliased utility classes (reported at over 90%) across HTML, JSX, TSX, Vue, Astro, and CSS files:

```bash
npx @tailwindcss/upgrade
```

The [official upgrade guide](https://tailwindcss.com/docs/upgrade-guide) walks through the process step by step and calls out known edge cases; [botmonster's practical write-up](https://botmonster.com/web-dev/tailwind-css-v4-what-changed-how-to-migrate/) is also a good collection of the pitfalls real projects hit. The codemod doesn't solve everything — custom plugins, complex safelist definitions, and dynamically built class strings still need a manual pass. Because the resulting diff tends to be large, splitting the PR into reviewable chunks helps; our guide to [effective code reviews](/en/posts/effective-code-reviews) covers tactics for exactly that kind of oversized diff.

Here's my mildly opinionated take: rushing the v4 migration into the first available week is an unnecessary risk for most teams. The codemod covers roughly 90% of the work, but the remaining 10% — custom plugins, genuinely complex configs — eats real time. Make v4 the default for new projects immediately; for a large, actively developed existing product, treat the migration as a planned line item for a calm sprint, not an urgent patch.

## Migration checklist

- [ ] Update Node and your package manager, then run `npx @tailwindcss/upgrade`.
- [ ] Manually verify that everything under theme.extend in tailwind.config.js landed correctly inside the @theme block.
- [ ] Review the codemod's renamed classes (`bg-linear-to-*`, `shrink-0`, `grow`, and similar) in the diff.
- [ ] Test custom plugins and complex safelist definitions individually — the codemod doesn't migrate these automatically.
- [ ] Visually compare brand colors and the default OKLCH palette on critical screens (checkout, dashboard).
- [ ] Run visual regression tests in CI, or at minimum screenshot-diff your core pages.
- [ ] Check your analytics for browser distribution and measure the share below Safari 16.4, Chrome 111, and Firefox 128.
- [ ] Split the migration PR into small, reviewable chunks and get at least one thorough review.

## Rollback note for teams targeting older browsers

Tailwind v4 relies on modern CSS features like `@property` and `color-mix()`, so it only targets current browsers: Safari 16.4+, Chrome 111+, and Firefox 128+. If your audience includes a corporate intranet, older Android WebViews, or a large public-sector user base, and you see meaningful traffic below those versions, don't migrate yet. Tailwind v3.4 remains maintained and is a safe choice for production — defer the migration until your older-browser share drops below an acceptable threshold. Getting stuck halfway, trying to support both config systems at once, costs more than simply staying on v3 a while longer.

## Frequently Asked Questions

### Can Tailwind v3 and v4 coexist in the same project?

In the short term, during migration, yes — some teams move modules over in sequence. Long term, though, keeping both config systems (JS-based and CSS-first) running at once adds real complexity. It's healthier to compress the migration into as short a window as possible rather than let a hybrid setup become permanent.

### Does the codemod handle everything automatically?

No. It handles the dependency update, the config migration, and the large majority of renamed classes (reported at over 90%), but custom plugins, complex safelists, and class names built dynamically through string concatenation still need a manual review pass.

### Does migrating to v4 affect SEO or performance?

Not directly for SEO, but faster builds shorten the development loop, and smaller, cleaner CSS output can indirectly help page weight. The real win is developer experience — don't expect a dramatic difference in the CSS bytes shipped to users.

### When will Tailwind v3.4 stop being supported?

As of now, v3.4 remains a maintained release with no announced end-of-life date. That said, new features are landing on the v4 line going forward, so once your older-browser constraint goes away, it's worth not deferring the migration indefinitely.
