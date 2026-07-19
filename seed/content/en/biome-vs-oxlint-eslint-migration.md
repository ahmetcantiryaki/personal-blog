---
title: "Biome vs Oxlint: Rust Tooling Replaces ESLint"
slug: "biome-vs-oxlint-eslint-migration"
translationKey: "biome-oxc-rust-tooling"
locale: "en"
excerpt: "Biome or Oxlint? Both Rust-based tools are replacing ESLint and Prettier fast — we compare speed, rule coverage, and migration paths for real teams."
category: "web-development"
tags: ["rust", "code-quality", "developer-experience", "frontend"]
publishedAt: "2026-07-19"
seoTitle: "Biome vs Oxlint: The Rust Alternative to ESLint"
seoDescription: "Biome or Oxlint? Both Rust-based tools are replacing ESLint and Prettier fast — we compare speed, rule coverage, and migration paths for real teams."
---

Short answer: on a greenfield project, swap ESLint and Prettier for Biome outright — one binary, one config file. On a large codebase with deep custom-plugin dependencies, add Oxlint alongside your existing ESLint setup first, then shrink ESLint's footprint over time. As of July 2026, both tools are production-ready, but neither has fully matched ESLint's plugin depth yet.

## Why the JS toolchain keeps getting rewritten in Rust

This is not a new pattern. esbuild and SWC already proved that rewriting bundling and transpilation in a systems language delivers order-of-magnitude speedups over pure-JavaScript equivalents — and that precedent is exactly what Biome and OXC/Oxlint are betting on for linting and formatting. The same forces are driving [TypeScript 7's move to a Go-native compiler](/en/posts/typescript-7-go-native-compiler): JavaScript tools written in JavaScript carry real overhead — AST construction, single-threaded execution, garbage collection pauses — and that overhead compounds badly at the scale of a modern CI pipeline.

ESLint and Prettier were both built as interpreted Node.js programs. Rewriting the same logic in Rust removes GC pauses, unlocks true multi-threading, and cuts the per-file overhead that shows up as minutes of wasted CI time on large monorepos.

## Biome: one binary, near-zero config

[Biome](https://biomejs.dev/) is a single Rust binary that handles both linting and formatting — no separate Prettier install required. The formatter side has been considered production-ready since 2023 and is reported as roughly 97% compatible with Prettier's output for JavaScript and TypeScript; the remaining gap comes from a handful of documented, intentional deviations rather than bugs.

Rule counts are where sources disagree. Some put Biome's lint rule set around 200 curated rules; others, counting differently, cite figures above 400. The honest framing: Biome ships a curated, opinionated rule set in the low-to-mid hundreds, and the team deliberately reviews each rule for its developer-experience impact before shipping it — the goal is a quiet, sane default, not the largest possible rule count.

A minimal Biome config looks like this:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "formatter": { "enabled": true, "indentStyle": "space" },
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "javascript": { "formatter": { "quoteStyle": "single" } }
}
```

That single file replaces what used to be a separate `.eslintrc` and `.prettierrc`.

## Oxlint and OXC: the speed champion

[Oxlint](https://oxc.rs/), part of the OXC (Oxidation Compiler) project, is built for raw speed: it's reported as roughly 2x faster than Biome for linting and 50–100x faster than ESLint. A concrete data point: on a Supabase control-plane codebase, Oxlint finished linting in 8.6 seconds against ESLint's 54 seconds when type-aware rules were enabled — a real-world workload, not a synthetic microbenchmark.

Oxlint ships 787 rules, including ports of popular ESLint plugin rules — common react and typescript-eslint checks among them — which gives it broader out-of-the-box coverage than Biome's more curated approach. Crucially, Oxlint is designed to be adopted incrementally alongside an existing ESLint setup, catching the fast, easy wins first, rather than forcing a full rip-and-replace on day one.

```bash
# Keep ESLint running, add Oxlint next to it
npx oxlint@latest --fix
# Compare against the legacy run in the same directory
npx eslint . --fix
```

These figures line up with what [PkgPulse's 2026 Biome vs OXC comparison](https://www.pkgpulse.com/guides/biome-vs-oxc-2026) and [jsmanifest's Biome-Oxlint benchmark](https://jsmanifest.com/biome-oxlint-comparison-2026) both report: Oxlint wins on raw throughput, Biome wins on single-tool simplicity.

## Table: Biome vs Oxlint vs ESLint

| Feature | ESLint (+ Prettier) | Biome | Oxlint |
|---|---|---|---|
| Language | JavaScript | Rust | Rust (OXC) |
| Scope | Linting only (Prettier needed for formatting) | Linting + formatting, one binary | Linting only (Oxfmt handles formatting) |
| Rule count | Plugin-dependent, effectively unbounded | ~200–400+ curated rules (varies by source) | 787 rules |
| Speed vs. ESLint | Baseline | Significantly faster | 50–100x faster |
| Supabase benchmark (type-aware) | 54 seconds | Not measured | 8.6 seconds |
| Custom plugin ecosystem | Mature, extensive | Limited | Limited |
| Recommended migration path | — | Greenfield, single step | Legacy, incremental alongside ESLint |

## Migration paths: greenfield vs. legacy

For greenfield projects, the decision is comparatively simple: one config file, one binary, no separate Prettier install to maintain — install Biome standalone and move on. This is the same "fewer tools, less config" instinct teams already apply when [choosing between Bun and Node.js](/en/posts/bun-vs-nodejs-2026-runtime) for a new project.

Legacy and large codebases are a different story. Teams with custom import-resolver plugins, framework-specific rule sets, or rules that haven't been ported to the Rust tooling yet tend to get the best results by adding Oxlint alongside their existing ESLint config. Oxlint absorbs the bulk of the fast, easy-win rules immediately, while ESLint gets gradually trimmed down to cover only what Oxlint and Biome don't handle yet. It's the same discipline behind [safely refactoring legacy code](/en/posts/how-to-refactor-legacy-code): incremental, measurable steps beat a single risky cutover.

## The plugin-depth caveat

To be honest about it: neither Biome nor Oxlint yet fully replicates ESLint's mature custom-plugin ecosystem — arbitrary, AST-based custom rules written as JavaScript plugins. If your team has accumulated years of monorepo-specific rules, design-system enforcement, or company-specific lint logic, audit that plugin list before committing to a full migration. It's the same audit discipline you'd apply when tightening up against a [clean code checklist](/en/posts/clean-code-principles-checklist): verify assumptions before making a large, hard-to-reverse call.

My honest take: with a speed gap this large — 50 to 100x on real workloads — treating "no full parity yet" as a reason to avoid Rust-based tooling altogether is throwing out the baby with the bathwater. The right question in July 2026 isn't "should I replace everything," it's "what percentage can I safely replace today."

## Migration decision guide

- **New project, small-to-mid team:** install Biome standalone; never add ESLint or Prettier in the first place.
- **Mid-sized codebase, few custom rules:** migrate to Biome, keep a minimal ESLint config running in the background only for what Biome doesn't cover.
- **Large, plugin-heavy legacy codebase:** add Oxlint next to ESLint, cut CI lint time immediately, then shrink the ESLint rule set on a three-to-six-month plan.
- **Codebase with complex design-system or framework-specific rules:** keep ESLint as the source of truth for now, run Oxlint only as a fast pre-check layer, and revisit a full migration as OXC's plugin support matures.

Worth reviewing your CI pipeline alongside this decision — our [Tailwind CSS v4 migration guide](/en/posts/migrating-to-tailwind-css-v4) walks through a similar "incremental vs. one-shot" cutover choice. For more tooling comparisons, browse our [web development category](/en/category/web-development).

## Frequently Asked Questions

### Does Biome apply every Prettier formatting rule exactly?

Not exactly, but very close — reported compatibility for JavaScript and TypeScript sits around 97%. The remaining gap comes from a handful of documented cases where the Biome team chose to diverge intentionally, not from an incomplete clone.

### Can Oxlint fully replace ESLint on its own?

Usually not yet, especially for heavily customized ESLint setups. Oxlint is deliberately built for incremental adoption alongside ESLint; its 787 rules give broad out-of-the-box coverage, but support for arbitrary custom plugins isn't as mature as ESLint's.

### Which is faster, Biome or Oxlint?

Oxlint is reported as roughly 2x faster than Biome for linting. That said, Biome's single-binary approach also handles formatting, so you skip installing a separate formatter entirely — the comparison isn't just about raw lint speed.

### Are these tools actually production-ready as of July 2026?

Yes. Biome's formatter has been production-ready since 2023 and its linter has seen extended production use since; Oxlint is running in production too, with measured results on real codebases like Supabase's control plane. The open question isn't speed or stability — it's plugin ecosystem depth.
