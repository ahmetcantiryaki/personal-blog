---
title: "Modern Color in CSS: OKLCH and color-mix()"
slug: "modern-css-color-oklch-color-mix"
translationKey: "modern-css-color-oklch-color-mix"
locale: "en"
excerpt: "Short answer: OKLCH gives CSS a perceptually uniform lightness channel, so tints, shades, and hover states come from color-mix(), not hand-picked hex values."
category: "web-development"
tags: ["css", "frontend", "accessibility", "web-standards"]
publishedAt: "2026-11-08"
seoTitle: "Modern Color in CSS: OKLCH and color-mix()"
seoDescription: "Short answer: OKLCH gives CSS a perceptually uniform lightness channel, so tints, shades, and hover states come from color-mix(), not hand-picked hex values."
---

Short answer: use OKLCH instead of hex or HSL, because its Lightness channel stays perceptually uniform across every hue, while HSL's lightness does not — pure blue and pure yellow at the same HSL lightness look nowhere near equally bright, which breaks automatic tint, shade, and contrast math.

## What is OKLCH?

OKLCH is a color function from CSS Color Module Level 4 that defines a color with three values: L (Lightness), C (Chroma, how saturated the color is), and H (Hue, the angle on the color wheel). The syntax is `oklch(L C H)`: L runs from 0 to 1 (or 0% to 100%), C runs roughly from 0 to 0.4 for in-gamut sRGB colors, and H runs from 0 to 360 degrees.

For example, `oklch(0.7 0.15 250)` produces a muted blue, and `oklch(0.3 0.1 20)` produces a dark reddish-brown; add an optional alpha channel with `oklch(0.7 0.15 250 / 0.5)`. Because the three channels are independent, you can lighten, darken, or adjust the saturation of a color predictably by changing just one value.

## Why use OKLCH instead of hex or HSL?

Because HSL's lightness axis doesn't match what the eye actually perceives. `hsl(240 100% 50%)` (pure blue) and `hsl(60 100% 50%)` (pure yellow) share the same HSL lightness value, yet the yellow looks far brighter to the eye. That mismatch means any attempt to generate tints or shades automatically from an HSL palette produces colors that look too light or too dark in some hues.

OKLCH's L channel comes from the Oklab color space, so it stays perceptually even across hues — the same L value looks about equally bright no matter the hue.

| Property | Hex / RGB | HSL | OKLCH |
|---|---|---|---|
| Perceptually uniform lightness | No | No | Yes |
| Reliable automatic tint/shade generation | No | Partial, varies by hue | Yes |
| Can address out-of-sRGB (display-p3) color | No | No | Yes |
| Predictable mixing with color-mix() | Weak | Moderate | Good |
| 2026 browser support | Universal | Universal | Baseline (since 2023) |

The table shows you can fake the same job with hex or HSL, but OKLCH gets there with far less trial and error — the gap widens as soon as you need to derive a multi-step palette automatically instead of picking each value by eye.

## What does color-mix() do?

color-mix() blends two colors in a color space you choose, at percentages you set, with the syntax `color-mix(in oklch, colorA p1%, colorB p2%)`. The most practical use is deriving hover, active, and disabled states by mixing a brand color with white or black at fixed percentages.

Mixing inside the `oklch` or `oklab` color space gives smoother, more predictable transitions than mixing in `hsl` or `srgb`, because the in-between steps also stay perceptually even. One base color produces a consistent scale instead of hand-picked hex values for every state.

## How do you build a token scale with OKLCH and color-mix()?

Start from one base tone in OKLCH and let color-mix() compute the rest of the scale.

```css
:root {
  --brand-500: oklch(0.58 0.19 250);
  --brand-hover: color-mix(in oklch, var(--brand-500) 85%, black 15%);
  --brand-active: color-mix(in oklch, var(--brand-500) 70%, black 30%);
  --brand-tint-100: color-mix(in oklch, var(--brand-500) 15%, white 85%);
  --brand-disabled: color-mix(in oklch, var(--brand-500) 40%, white 60%);
}

.button {
  background: var(--brand-500);
}

.button:hover {
  background: var(--brand-hover);
}

.button:disabled {
  background: var(--brand-disabled);
}
```

With this setup, changing a single `--brand-500` value updates hover, active, and disabled states automatically — no need to hand-match five separate hex codes in Figma.

My honest take: most teams still hand-pick five or six hex shades in Figma, when color-mix() could derive every one of them from a single base color and keep design and code in sync automatically; hand-picked palettes start drifting from the codebase within a few sprints.

## How do you derive a dark theme from OKLCH tokens?

Short answer: invert each token's L value, roughly `1 - L`, while keeping C and H fixed, then check the result by eye and with a contrast checker before shipping it.

If `oklch(0.3 0.1 20)` is a dark accent in light mode, something near `oklch(0.7 0.1 20)` gives a similar impression in dark mode. This inversion is not exact — some hues need a small chroma adjustment too — so treat it as a fast first draft, not a guaranteed-correct transform.

## When does wide-gamut (display-p3) support matter?

OKLCH can describe colors outside the sRGB triangle, which matters once you want more saturated colors on display-p3 screens. When an OKLCH value falls outside what the current display can show, supporting browsers map it down to the closest color the screen can render, so the result degrades gracefully instead of clipping harshly.

Browsers that don't support OKLCH simply ignore the line, so declare an sRGB fallback (hex or rgb()) first and the OKLCH value second on the same property. CSS applies the last valid value for a property, so a supporting browser uses OKLCH automatically while an older one falls back to sRGB.

## Do all browsers support OKLCH and color-mix()?

As of 2026, yes, in every current major browser. The oklch(), oklab(), lch(), and lab() color functions and color-mix() reached Baseline status in 2023, after shipping in Chrome 111, Edge 111, Firefox 113, and Safari 16.2 earlier that same year — Baseline means all four major engines support it safely.

Third-party usage trackers put global support in the mid-90s percent range as of 2026; treat that figure as an approximate, third-party estimate rather than an exact official number.

A note on accessibility: using OKLCH doesn't guarantee accessible contrast on its own. Check every derived tint and shade — especially any lightness-inverted dark-theme value — with a contrast checker before you ship it.

You can fit this color system into the layer structure from [our CSS @layer guide](/en/posts/css-cascade-layers-at-layer), and reuse the same tokens inside responsive components built with [container queries](/en/posts/css-container-queries-how-to). Verify your color decisions against [our accessibility checklist](/en/posts/web-accessibility-checklist), and see [our CSS if() guide](/en/posts/conditional-styling-with-css-if) for conditional styling needs. Browse more posts on our [web development category page](/en/category/web-development).

For technical details, see MDN's [oklch() reference](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) and [color-mix() reference](https://developer.mozilla.org/en-US/docs/Web/CSS/color-mix), web.dev's [Baseline 2023 announcement](https://web.dev/blog/baseline2023), and the [W3C CSS Color 4 spec](https://www.w3.org/TR/css-color-4/).

## Frequently Asked Questions

### Is OKLCH safe to use in production?

Yes. oklch() and color-mix() began shipping across Chrome, Edge, Firefox, and Safari within the same year, 2023, and reached Baseline status that year. As of 2026, the vast majority of current browsers support both functions, and only very old browser versions lack them.

### How is color-mix() different from Sass functions like darken()?

Sass's `darken()` and `lighten()` run at build time and usually operate on HSL, while color-mix() runs in the browser, works with CSS custom properties, and can mix colors in a perceptually uniform space like OKLCH. That gives more predictable results than Sass's HSL-based functions.

### Do I need to convert my hex palette to OKLCH by hand?

No. The browser converts an OKLCH value to the display's color space automatically. To move an existing hex palette to OKLCH, use your browser's developer-tools color picker or an OKLCH converter tool; you don't need to calculate the values yourself.

### Should I build a separate OKLCH palette for dark mode?

Usually not — you can reuse the same token set by inverting the Lightness value. Keep Chroma and Hue fixed, invert L to roughly `1 - L` as a starting point, then check the result by eye and with a contrast checker, adjusting chroma slightly where needed.
