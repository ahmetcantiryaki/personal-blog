---
title: "React Compiler: Do You Still Need useMemo?"
slug: "react-compiler-memoization"
translationKey: "react-compiler-memoization-2026"
locale: "en"
excerpt: "Short answer: mostly no. React Compiler applies automatic memoization at build time; 95% of Meta's production surfaces run it, cutting re-renders by 40-60%."
category: "web-development"
tags: [react, performance, frontend, web-performance]
publishedAt: "2026-10-01"
seoTitle: "What Is React Compiler? Goodbye Manual Memoization"
seoDescription: "React Compiler went stable at 1.0 on October 7, 2025. It runs on 95% of Meta's production surfaces and cuts unneeded re-renders by 40-60%; the adoption guide."
---

Short answer: mostly no, not anymore. React Compiler analyzes your components at build time and automatically adds memoization where it's needed. 95% of Meta's production React surfaces now run with the compiler enabled, cutting unnecessary re-renders by 40-60%. Manual `useMemo`/`useCallback` still exist, but they're no longer the default reflex — they're the exception.

## What is React Compiler?

React Compiler is a compiler that statically analyzes your React components at build time and automatically detects which values need recomputing and which functions need recreating. You keep writing normal code; the compiler does, at build time, what you used to do by hand with `useMemo(() => ..., [deps])`.

React Compiler 1.0 shipped stable on October 7, 2025, and is production-tested. It's a separate tool from React 19, not bundled with it — it works with React 17 and later. That means you can turn on React Compiler without first migrating to React 19.

## How do you adopt React Compiler?

If you're starting a new Vite, Next.js, or Expo project, React Compiler now ships enabled by default — no separate setup required. For an existing app, the React team has published a step-by-step adoption guide covering compatibility checks, incremental rollout (enabling it in one directory first, for instance), and the required tooling.

```bash
npm install babel-plugin-react-compiler eslint-plugin-react-hooks@latest
```

The key step after installation is turning on the compiler's lint rules. React Compiler's diagnostics are now integrated into `eslint-plugin-react-hooks`'s recommended rule set, so your normal Hooks lint pass now also catches violations the compiler flags.

## What breaks when you turn on React Compiler?

The most common issue comes from code that doesn't follow the Rules of React — components that produce side effects during render or call hooks conditionally, for instance. The compiler can't safely optimize that kind of code, so it either skips the component or raises a lint warning. The practical debugging step: enable the compiler on one route or directory first, fix the lint violations it surfaces one by one, then widen the scope.

| Scenario | Compiler behavior |
|---|---|
| Component follows Rules of React | Automatically memoized |
| Conditional hook call | Compiler skips the component, raises a lint warning |
| Side effect during render | Lint error; needs a manual fix |
| Code with existing manual `useMemo` | No conflict; compiler can flag memoization that's now redundant |

## How much speed does React Compiler actually buy you?

The numbers vary by use case, but they point the same direction. In Meta's internal testing, the compiler cut unnecessary re-renders by 40-60% with zero code changes; initial loads and cross-page navigations improved by up to 12%, and some interactions ran more than 2.5x faster, while memory usage stayed neutral.

Third-party examples back that up. A review site's tech team, built on Next.js and React, reported a 30% improvement in Lighthouse performance scores after enabling the compiler. Sanity Studio reported a 20-30% reduction in render time and noticeable latency improvements in its complex form editors.

Bundle size is a different story — don't expect a clear win there. Meta's own benchmarks show bundle size staying largely neutral, with a slight increase from the compiler's added runtime code. Some teams report smaller bundles in their own projects, but that isn't React Compiler's primary promise — the real gain is in render performance.

## How do you verify React Compiler's optimization actually worked?

React DevTools added a badge that shows whether a component was memoized by the compiler — a "Memo ✨" marker means React Compiler automatically optimized that component. If a component doesn't get the badge, either it violates the Rules of React, or it lives in a file outside the compiler's scope (a package the compiler hasn't scanned yet, for instance).

A practical verification flow looks like this: run lint first and check the compiler's diagnostics, then confirm critical components actually carry the "Memo" badge in DevTools, and finally measure whether there's a real performance difference using Lighthouse or real-user metrics (Core Web Vitals). Rather than flipping the compiler on and assuming "it must be faster now," this three-step check confirms React Compiler is actually optimizing the components you expect it to.

## How does React Compiler differ from Svelte's and Vue's compile-time approach?

Svelte and Vue were designed around compile-time optimization from the start; React Compiler is a compilation layer added after the fact to an existing, runtime-oriented library. That difference matters: a Svelte component compiles down to plain JavaScript at build time, while React Compiler preserves React's existing render model and only optimizes which values get recomputed — React's virtual DOM is still running at runtime.

That means React Compiler can't reach Svelte's zero-runtime approach, but it can optimize existing React codebases without a rewrite. As covered in our [Astro vs Next.js vs SvelteKit comparison](/en/posts/astro-nextjs-sveltekit-compared), SvelteKit's small bundle size comes largely from that compile-time, runtime-free approach; React Compiler is trying to reach a similar performance gain by a different route, one that keeps React's ecosystem advantage intact.

## When do you still need manual memoization?

Three cases still call for writing `useMemo`/`useCallback` by hand: edge cases the compiler can't safely optimize because they fall outside the Rules of React; very expensive, non-deterministic computations (caching a value tied to an external API call, for example); and React Native or third-party library integrations the compiler doesn't yet support. Outside those cases, writing manual memoization in new code is now usually just added complexity.

Teams leaning on the compiler for performance may find our [advanced TypeScript patterns](/en/posts/advanced-typescript-patterns) guide useful for writing clearer code the compiler can analyze more confidently. For the build-tooling discussion you'll run into while wiring this into a Next.js project, see our [Biome vs Oxlint](/en/posts/biome-vs-oxlint-eslint-migration) comparison.

## Frequently Asked Questions

### Does React Compiler require React 19?

No. React Compiler is a separate tool from React 19 and works with React 17 and later. You can turn on React Compiler without migrating to React 19 first; the two are independent decisions.

### Does React Compiler make useMemo and useCallback completely unnecessary?

For most everyday use, yes, but not entirely. The compiler automatically memoizes standard components that follow the Rules of React. Very expensive, non-deterministic computations, or edge cases the compiler can't safely analyze, may still need manual memoization.

### Is adding React Compiler to an existing project risky?

The React team's published incremental-adoption guide keeps that risk low. The recommended approach is enabling it on one directory or route first, fixing the lint warnings it surfaces, then widening the scope. Older codebases with Rules of React violations should expect some lint errors on the first pass.

### Does React Compiler reduce bundle size?

Not reliably. Meta's own testing shows bundle size staying largely neutral, even seeing a slight increase from the compiler's added runtime code. The real gain isn't bundle size — it's fewer unnecessary re-renders and the resulting improvement in interaction speed.
