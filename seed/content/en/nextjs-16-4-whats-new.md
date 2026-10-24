---
title: "Next.js 16.4: What Changed?"
slug: "nextjs-16-4-whats-new"
translationKey: "nextjs-16-4-whats-new-2026"
locale: "en"
excerpt: "Next.js 16.4 made Cache Components the default on October 6, 2026; an out-of-band security release (16.4.1) then patched two critical RCEs on October 14."
category: "web-development"
tags: ["nextjs", "web-security", "performance", "frontend"]
publishedAt: "2026-10-24"
seoTitle: "Next.js 16.4: New Features and Critical Security Patch"
seoDescription: "Next.js 16.4 made Cache Components the default; the 16.4.1 security patch fixes two critical RCEs and one DoS bug. Here's what to check before upgrading."
---

Short answer: Next.js 16.4 went stable on October 6, 2026, making Cache Components the recommended default architecture for every app; eight days later, on October 14, 2026, Vercel shipped an out-of-band security release (16.4.1) patching two critical remote code execution (RCE) vulnerabilities in `use cache` functions and SVG image processing. If you're running Next.js 16.4 or earlier, your priority isn't trying the new features — it's upgrading to 16.4.1 (or 15.5.28 if you're on the 15.x line) right now.

## What's actually new in Next.js 16.4?

Short answer: the biggest change is that Cache Components are no longer an experimental option — Vercel now recommends them as the default architecture for every app, and `create-next-app` enables them by default for new projects. Alongside that, 16.4 adds `ensureStatic` to guarantee static routes, new navigation and prefetch APIs for finer control over prefetch behavior, and `next upgrade --agent`, a tool that lets AI agents manage the upgrade process automatically.

On performance, Turbopack got a shared runtime, the disk cache got smaller, server-side Hot Module Replacement (HMR) now runs lazily, and production bundle sizes shrank. Next.js 16.4 also ships on React 19.3.

## What did the October 14 security update actually fix?

Short answer: Vercel released an out-of-band security update on October 14, 2026, patching two critical and one high-severity vulnerability in 16.4.1 (Active LTS) and 15.5.28 (Maintenance LTS). One of these is severe enough to allow remote code execution without any unusual precondition.

| Vulnerability | Severity | Affected | Fix |
|---|---|---|---|
| RCE in `use cache` functions (GHSA-673q-mjm6-r5xr) | Critical | 16.x < 16.4.1 | Upgrade to 16.4.1 (no workaround) |
| SVG processing RCE (GHSA-2464-fhr4-w9xw / CVE-2026-96889) | Critical | 10.x–15.x < 15.5.28, 16.x < 16.4.1 | Upgrade Sharp to 0.35.5+ or update to the patched version |
| DoS in Server Actions (GHSA-p3m5-59mp-jv5r) | High | 13.0.0–15.5.27, 16.0.0–16.4.0 | Upgrade to the patched version |

For the `use cache` RCE, Vercel does not list any workaround — the only safe path is upgrading directly to 16.4.1. For the SVG processing flaw, the documented workaround is upgrading the Sharp image library to version 0.35.5 or later. Applications that don't do server-side React rendering (no React Server Components) are not affected by the Server Actions DoS bug.

```bash
# If you're on the Next.js 16.x line
npm install next@16.4.1

# If you're on the 15.x Maintenance LTS line
npm install next@15.5.28
```

If you manage your React Server Components packages directly, you also need to update React to 19.0.9, 19.1.10, 19.2.9, or 19.3.1, whichever matches your setup.

## Has either critical RCE been exploited in the wild?

Short answer: according to Vercel's disclosure, there's no report of any of these three vulnerabilities being exploited in the wild — but that doesn't reduce the urgency. Exploitation attempts for a disclosed critical RCE typically start within hours of public disclosure, so the patch window here is days, not weeks.

Applications that use `use cache` functions and process user input close to the caching layer are the highest-risk group for this specific bug. Every team running Next.js in production should check their current version (`npm ls next`) right now.

## Should you switch to Cache Components now?

Short answer: yes for new projects, since `create-next-app` already enables it by default; teams migrating a large existing app should test cache behavior in staging first. Vercel elevating this to "default recommendation" status means the feature is no longer considered experimental — but if you have an existing `fetch`/`revalidate`-based caching strategy, cache invalidation behavior may change during the migration.

## Is upgrading from 16.3 to 16.4 risky?

Short answer: the real risk isn't in 16.4's own features — it's in staying on 16.4.0 or earlier, which carries the unpatched security bugs. Compatibility issues from 16.3's Turbopack changes (shared runtime, smaller disk cache) are rare, but clearing your build cache once (`rm -rf .next`) is recommended for large monorepos.

## How do you check if your deployment is actually patched?

Short answer: run `npm ls next` (or check your lockfile) to confirm the resolved version is `16.4.1` or later on the 16.x line, or `15.5.28` or later on the 15.x line — a version string alone tells you whether the fix is applied, no further testing needed. If you deploy on Vercel, the platform's own build logs show the exact `next` version used for the live deployment, which is worth checking directly rather than trusting what's in your repository's `package.json`, since a stale lockfile can leave a project pinned below the patched version even after the dependency is bumped.

Teams running Next.js behind a CDN or reverse proxy should also confirm that cached responses built before the patch get invalidated, since a cached page generated by a vulnerable server process doesn't become safe just because the server binary was updated afterward. This is a one-time check, not an ongoing process: once `npm ls next` confirms the patched version and your cache has cycled, there's nothing further to monitor for these three specific CVEs.

My own take: Next.js shipping a major architectural recommendation (Cache Components as default) and a critical security patch eight days apart is a sign the framework now moves at a pace that genuinely needs active tracking. For teams without automated dependency updates, missing one of these out-of-band security releases is a far more expensive mistake than missing a feature release.

For more on Next.js's React Server Components architecture, see our [RSC guide](/en/posts/react-server-components-nextjs-15); for a broader framework comparison, check our [2026 Astro vs Next.js vs SvelteKit coverage](/en/posts/astro-nextjs-sveltekit-compared). For more web development coverage, visit our [Web Development category page](/en/category/web-development).

## Frequently Asked Questions

### How do I upgrade to Next.js 16.4.1?

Run `npm install next@16.4.1` to update. If you're on the Next.js 15.x line, use `npm install next@15.5.28` instead. If you manage React Server Components packages directly, also upgrade React to 19.0.9, 19.1.10, 19.2.9, or 19.3.1.

### Were the Next.js 16.4 security vulnerabilities exploited?

According to Vercel's October 14, 2026 disclosure, there's no report of real-world exploitation for any of the three vulnerabilities (two critical RCEs, one high-severity DoS). Still, since there's no workaround for the critical `use cache` RCE, upgrading promptly is strongly recommended rather than optional.

### What are Cache Components and why are they the default now?

Cache Components are Next.js's architecture for controlling page and data caching behavior at the component level. With Next.js 16.4, Vercel marked them as no longer experimental, recommending them as the default approach for every app and enabling them automatically in `create-next-app`.

### How do I protect against the SVG processing vulnerability (CVE-2026-96889)?

You can mitigate it by upgrading the Sharp image-processing library used by your Next.js app to version 0.35.5 or later. For a permanent fix, upgrade Next.js itself to 16.4.1 or 15.5.28.

Sources:
- [Next.js Security Update (October 14, 2026)](https://nextjs.org/blog/nextjs-security-update-october-14-2026)
- [Upcoming Next.js Security Update (October 2026)](https://nextjs.org/blog/upcoming-nextjs-security-update-october-2026)
- [Next.js 16.4.0 GitHub Release](https://github.com/vercel/next.js/releases/tag/v16.4.0)
