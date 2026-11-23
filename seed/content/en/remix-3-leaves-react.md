---
title: "Remix 3 Drops React: What It Means for You"
slug: "remix-3-leaves-react"
translationKey: "remix-3-leaves-react-2026"
locale: "en"
excerpt: "Remix 3 is a React-free rebuild on web-platform primitives, shipped as standalone packages with no automated migration path from Remix 2 or React Router."
category: "web-development"
tags: ["react", "frontend", "web-standards", "open-source"]
publishedAt: "2026-11-23"
seoTitle: "Remix 3 Without React: What Changed, Who Should Care"
seoDescription: "Remix 3 is a React-free rebuild on web-platform primitives, shipped as standalone packages with no automated migration path from Remix 2 or React Router."
---

Short answer: Remix 3 is not an update to the Remix you know — it's a ground-up rebuild that drops React entirely in favor of web-platform primitives, shipped as a set of focused, independently usable packages. Existing Remix 2 apps aren't meant to adopt it; the team has pointed that line of work to React Router v7 instead, and there's no official automated migration tool between Remix 2 and Remix 3.

## What is Remix 3, exactly?

Remix 3 is a new, separate framework line announced in the Remix team's "Wake Up, Remix" post, built around standalone packages — things like async-context middleware, auth, and auth-middleware — that developers can use independently instead of adopting one monolithic framework. It targets web-platform APIs directly rather than routing everything through a React component tree, which is the core architectural break from Remix 2.

As of the beta preview covered by InfoQ in mid-2026, several of Remix 3's core packages are still marked experimental and not described as production-ready. That status matters more than the framework's ambition: a rewrite with no React dependency is a bigger platform bet than a typical major version bump, and betas are where that kind of bet gets tested against real apps, not just demos.

## Why did the Remix team actually drop React?

The team's stated direction is a shift "back to the platform" — leaning on native browser and server APIs instead of a component abstraction layer, on the theory that a thinner dependency stack ages better and gives more direct control over rendering and state. This mirrors a broader 2026 current: web components, native form and streaming APIs, and frameworks like Astro and HTMX treating the platform itself as the baseline rather than something to paper over.

That doesn't mean React was holding Remix 2 back technically — React Router v7 (the continuation of Remix 2's React-based line) keeps shipping and is the team's own recommended path for existing Remix apps. Remix 3 reads less like "React was broken" and more like "we wanted to build something that isn't React," a different and much riskier kind of bet.

## Who actually benefits from this, and who shouldn't touch it yet?

Teams building new, small-to-medium apps who want fewer abstraction layers and are comfortable depending on packages still labeled experimental are Remix 3's actual early audience — not teams with an existing Remix 2 or React Router codebase in production. If your app ships revenue today, the risk-reward here doesn't favor migrating: you'd be trading a stable, actively maintained React Router v7 app for an unproven rewrite with no official upgrade tooling.

| Situation | Recommendation |
|---|---|
| New greenfield project, team wants to try web-platform-native patterns | Reasonable to pilot Remix 3, scoped to one app |
| Existing Remix 2 app in production | Stay on React Router v7; it's the team's own continuation path |
| Team invested in the React ecosystem (component libraries, hooks, testing tools) | Don't migrate — Remix 3's lack of React is the whole point, and it costs you that ecosystem |
| Curious about "post-React" patterns generally | Worth reading the source, not worth a production rewrite yet |

## What does migration from Remix 2 actually look like?

There's no official automated migration path from Remix 2 to Remix 3 as of the beta — the two are different frameworks that happen to share a name, not sequential versions of the same one. Existing Remix 2 users are explicitly directed to React Router v7 rather than Remix 3, which is the opposite of how most "v2 to v3" naming usually works and is the detail most likely to confuse a team skimming release notes.

```text
Remix 2 app → staying on React → migrate to React Router v7 (same team, React-based)
Remix 2 app → want to drop React → new build on Remix 3 (separate framework, no auto-migration)
```

Practically, that means budget a Remix 3 adoption as a new build, not a migration sprint. Teams that have weighed [Astro, Next.js, and SvelteKit against each other](/en/posts/astro-nextjs-sveltekit-compared) will recognize the calculation: picking a framework with a smaller but more platform-aligned footprint trades ecosystem size for architectural leanness, and that trade only pays off on a fresh codebase.

## What does Remix 3 actually look like in code?

Because Remix 3 ships as standalone packages instead of one framework import, adopting it looks more like assembling middleware than scaffolding an app. A minimal setup pulls in only the pieces a given route actually needs — auth, routing, and server rendering as separate dependencies rather than one `remix` package that bundles everything, React included, whether you use it or not.

```text
# Remix 2 style: one framework dependency, React required
remix, react, react-dom

# Remix 3 style: compose only what the route needs
@remix-run/async-context, @remix-run/auth, @remix-run/auth-middleware
```

That packaging choice is itself a bet: it trades the one-import convenience Remix 2 shared with most React meta-frameworks for a smaller footprint per route, at the cost of more decisions a team has to make up front about which pieces to pull in.

My take: shipping a framework with a new name but no version-to-version migration path from its own predecessor is an unusually honest move — it tells you plainly that Remix 3 is a different bet, not Remix 2 plus improvements, and you should budget for it that way rather than expecting an upgrade guide to appear.

If you're specifically weighing whether you need React's component model at all for a given project, [HTMX vs React: when do you actually need React?](/en/posts/htmx-vs-react-when-to-use) covers the adjacent question from a different angle, and the ["back to the platform" question also shows up in why AI coding tools keep reaching for React by default](/en/posts/why-ai-tools-pick-react) despite this broader shift.

Primary sources: Remix's own [Wake Up, Remix announcement](https://remix.run/blog/wake-up-remix) and [InfoQ's Remix 3 beta preview coverage](https://infoq.com/news/2026/07/remix-3-beta-preview).

## Frequently Asked Questions

### Does Remix 3 use React?

No. Remix 3 is a ground-up rebuild that drops React entirely in favor of web-platform primitives, distributed as standalone packages. It's a separate framework line from Remix 2, which stays React-based and continues as React Router v7.

### How do I migrate my Remix 2 app to Remix 3?

There's no official automated migration tool as of the beta, because Remix 2 and Remix 3 are different frameworks, not sequential versions. The Remix team directs existing Remix 2 apps to React Router v7 instead; adopting Remix 3 means budgeting a new build, not a migration.

### Is Remix 3 production-ready?

Not fully, as of the beta preview covered in mid-2026 — several of its core packages are still marked experimental. Treat it as suitable for a pilot or greenfield experiment rather than a production app you depend on for revenue today.

### Why is Remix dropping React instead of just releasing React Router v7?

React Router v7 already is the continuation of Remix 2's React-based approach. Remix 3 is a separate, additional bet on web-platform primitives instead of a component framework — the team wanted to try building without React, not to replace the React-based line that already exists.
