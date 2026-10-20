---
title: "Stop Guessing Browser Support: Baseline"
slug: "web-platform-baseline-guide"
translationKey: "web-platform-baseline-guide-2026"
locale: "en"
excerpt: "Short answer: Baseline labels whether a feature works across every major browser in one tag. Widely available means it cleared that bar 30+ months ago."
category: "web-development"
tags: ["web-standards", "css", "best-practices", "developer-experience"]
publishedAt: "2026-10-20"
seoTitle: "What Is Web Platform Baseline? A 2026 Guide"
seoDescription: "Stop reading caniuse tables row by row. Newly vs Widely available, the 30-month rule, MDN badges, and wiring Baseline into your ESLint config."
---

Short answer: Web Platform Baseline summarizes whether a web feature works across Chrome, Edge, Firefox, and Safari's desktop and mobile versions in a single tag — "newly available" or "widely available." A "widely available" tag means that feature has been supported across all of those browsers for at least 30 months, which usually makes it safe to ship without a polyfill.

## What Is Web Platform Baseline?

Baseline replaces the older habit of reading a caniuse table row by row and answering "which browser version supports this" yourself. Per web.dev's definition, a feature becomes "newly available" the moment it's supported across the entire core browser set: desktop Safari, macOS and iOS Safari, desktop and Android Firefox, desktop and Android Chrome, and desktop Edge. Including mobile browsers in that core set is a key part of Baseline's current definition — desktop support alone no longer qualifies.

## What's the Difference Between Newly and Widely Available?

A feature becomes "newly available" the moment it's supported across the core browser set, but that doesn't mean every user's browser is current — some share of users are still on older versions. Per web.dev's Baseline definition update, a feature moves to "widely available" **30 months** after that "newly" date. The 30-month threshold isn't arbitrary: web.dev says it's based on usage data showing most features reach roughly 95% of global users within that window.

| Status | Meaning | Practical Result |
|---|---|---|
| Newly available | Just became supported across all core browsers | Works for most users, polyfill recommended |
| Widely available | 30+ months past "newly" | ~95% global reach, safe without a polyfill |
| Limited availability | Not yet supported across all core browsers | Feature detection or polyfill required |

## Where Do You See Baseline Badges?

MDN Web Docs shows a Baseline badge on every web API and CSS feature page; the badge carries the "newly available" or "widely available" label directly, so you don't need a separate trip to a caniuse page. web.dev's own Baseline page presents the same data as a browsable dashboard and lists which features made it into a given year's "Baseline" set, like "Baseline 2026."

In practice, this changes the step you take before using a feature. You used to search "which browsers support this CSS property" and read down the version columns on caniuse; now you just check the badge at the top of the MDN page. If the badge is green and says "widely available," the decision is already made; if it says "newly available," you need to ask the question in the next section.

## What Do the Yearly Baseline Sets Do?

web.dev publishes a "Baseline <year>" set every year — a list of features that reached "widely available" status as of that calendar year. Targeting "Baseline 2026" gives your team a shared, concrete reference point for what's safe to use; saying "we target Baseline 2024" is a far more precise, measurable statement than "we don't support IE11." These yearly sets are also the easiest way to put a product's minimum browser support policy in writing.

## How Do You Wire Baseline Into Linting?

If eyeballing a badge isn't enough, you can pull Baseline data directly into your build process. **eslint-plugin-baseline-js** (repository: 3ru/eslint-plugin-baseline-js), the first-place winner of the 2025 Baseline Tooling Hackathon, detects JavaScript features in your source code and flags anything newer than the Baseline level you target — newly, widely, or a specific Baseline year. The tool uses the web-features dataset as its source of truth and integrates with ESLint core and with eslint-plugin-es-x. web.dev also notes that ESLint can now check CSS code and enforce the use of Baseline CSS features in a project.

```json
{
  "rules": {
    "baseline-js/compat": ["error", { "target": "widely" }]
  }
}
```

This config forces your team to use only "widely available" features; if a developer tries to use an API that's still at "newly available," they get a build-time warning.

## When Is It Safe to Ship a Feature Without a Polyfill?

The rule of thumb: if your target audience looks like the general internet population, shipping a "widely available" feature without a polyfill is considered safe, since that feature has already reached roughly 95% of global users. A "newly available" feature is a more nuanced call: if you know your users' browser and version distribution and most are on a current browser, you can reasonably take the risk; if you don't know, add feature detection or wait for "widely" status.

In narrower, known environments — internal enterprise tools, for instance — this threshold can be cleared earlier; if there's a company-wide Chrome policy in place, using a "newly available" feature right away causes no problem. But for a product open to a broad, unknown general audience, waiting for the "widely" threshold is the cheapest way to prevent a flood of support tickets before they start.

A common mistake here is confusing "newly available" with "experimental." A feature at "newly available" already has a real, stable implementation across every core browser — it isn't sitting behind an experimental flag. CSS features like [`:has()` and native nesting](/en/posts/modern-css-has-native-nesting) went through exactly this lifecycle: experimental, then newly available, then widely available within a couple of years. The risk isn't in the browser version itself, it's in whether your users have actually upgraded to it yet. Clearing up that distinction stops a team's "new feature = risky" reflex from braking unnecessarily.

## Should You Drop caniuse Entirely?

No, but its role changes. caniuse remains the more detailed source when you need to know exactly when a specific browser version added a feature — say, because you still have to support an old enterprise browser build. Baseline instead gives you a faster summary layer for everyday "can I use this" decisions; the two aren't mutually exclusive, and Baseline just removes the need to visit caniuse most of the time.

This tracks with a trend we covered in our piece on [Biome and Oxlint replacing ESLint](/en/posts/biome-vs-oxlint-eslint-migration), one of several shifts in our [web development coverage](/en/category/web-development): the toolchain keeps moving decisions that used to require manual developer judgment into build-time, automated checks. Baseline's lint integration is part of the same pattern — it moves "can I use this feature" out of human memory and into tooling. The result is one more category that no longer gets debated in code review: if a Baseline rule is red on a PR, the decision is already made before the discussion starts.

## What Is webstatus.dev For?

webstatus.dev turns Baseline data into a queryable dashboard: you can filter a specific feature's current status, which browser versions support it, and how much time is left before it reaches "widely available." This is also useful for understanding, as we touched on in our [Astro vs Next.js comparison](/en/posts/astro-vs-nextjs), which framework feature actually rests on which underlying web platform support — a "modern" feature a framework offers can still be fragile if the underlying web platform API is still at "limited availability."

## Frequently Asked Questions

### When does a feature count as "widely available"?

A feature moves to "widely available" 30 months after it becomes "newly available" — meaning supported across all core browsers (Chrome, Edge, Firefox, Safari, both desktop and mobile). That 30-month threshold is based on usage data showing features typically reach about 95% of global users within that window.

### Does Baseline replace caniuse entirely?

No. Baseline gives you a fast summary for everyday "can I use this" decisions, but caniuse remains the more detailed resource when you need to know a specific browser version's exact support date — for example, when supporting an old enterprise browser build.

### How do I wire Baseline data into my build process?

An ESLint plugin like eslint-plugin-baseline-js checks the features in your source code against the web-features dataset and flags anything newer than the Baseline level you target — newly, widely, or a specific year — directly at build time.

### Is it safe to use a "newly available" feature in production?

Yes, if you know your users' browser distribution and most run a current browser, the risk stays acceptable. For a product open to a broad, unknown audience, adding feature detection or waiting for "widely available" status is the safer choice.
