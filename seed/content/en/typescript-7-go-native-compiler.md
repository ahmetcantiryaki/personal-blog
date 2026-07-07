---
title: "TypeScript 7: The Go-Native Compiler, Explained"
slug: "typescript-7-go-native-compiler"
translationKey: "typescript-7-go-native-compiler"
locale: "en"
excerpt: "TypeScript 7 rewrites the whole compiler in Go for a ~10x speedup with the same type system. Project Corsa, RC status, and a safe way to adopt it today."
category: "software-engineering"
tags: ["typescript", "performance", "developer-experience", "best-practices"]
publishedAt: "2026-07-07"
seoTitle: "TypeScript 7: The Go-Native Compiler, Explained"
seoDescription: "TypeScript 7 rewrites the compiler in Go for a ~10x faster type check with identical semantics. Project Corsa, RC status, and a safe way to adopt it today."
---

TypeScript 7 is a version whose entire compiler has been rewritten in Go, and it makes type checking and compilation roughly 10x faster. Same type system, same behavior — just far quicker. Microsoft's port, codenamed "Corsa," reached Release Candidate on June 18, 2026, with a stable release expected during July 2026. This piece walks through the measured gains, what ships now versus what is still pending, and how to try it today without putting a large codebase at risk.

## The compiler moved to Go: why, and how fast

For over a decade TypeScript shipped a compiler written in its own language — TypeScript and JavaScript. That self-hosting design was elegant, but it hit the ceiling of a single-threaded JavaScript runtime. The team led by Anders Hejlsberg ported the compiler to Go file by file; they said they evaluated several languages and Go was the easiest target for preserving the existing structure. The goal was never to change the language, only to run the same semantics much faster.

The numbers are bold but consistently measured. The most-cited benchmark is VS Code's own codebase of roughly 1.5 million lines: a check that took ~77.8 seconds on the old compiler drops to ~7.5 seconds on the Go-based one.

| Metric | TypeScript 6 (JS) | TypeScript 7 (Go) | Change |
|--------|-------------------|-------------------|--------|
| VS Code build (~1.5M lines) | ~77.8 s | ~7.5 s | ~10x |
| Editor / project load time | baseline | notably lower | ~8x |
| Memory usage | baseline | roughly half | ~2x less |
| Type checking (general) | baseline | much faster | ~10x |

This is not a one-off trick; it is part of a larger wave across the ecosystem. [Microsoft's official announcement](https://devblogs.microsoft.com/typescript/typescript-native-port/) frames the win as "a 10x faster TypeScript," and it puts TypeScript alongside esbuild, SWC, Bun, and Oxc in the native-rewrite trend those tools started. The shared lesson: moving a JavaScript toolchain to a native language routinely unlocks gains in the 10–100x range.

## What ships now, and what is still pending

Tempting as the RC label is, it does not mean "everything is done." The native compiler is still completing a handful of capabilities that the stable release has today. The honest picture:

| Capability | Status (July 2026, RC) |
|------------|------------------------|
| Type checking (`tsc --noEmit`) | Ready |
| JS/JSX output (emit) | Largely ready |
| `--declaration` (`.d.ts`) emit | Partial / in progress |
| `--build` (project references) | Pending |
| Editor: auto-import, rename, find-all-references | Pending |
| Programmatic API (typescript-eslint, ts-morph) | Deferred to 7.1 |

The last row is the one that matters most. The [native preview announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-native-previews/) states plainly that typescript-eslint, ts-morph, and anyone writing custom transformers should wait for 7.1 before adopting the programmatic API. So if a project's lint rules or code transforms lean on the compiler's internal API, you cannot fully migrate today — but nothing stops you from speeding up type checking right now.

## `tsc` or `tsgo`: separate checking from compiling

By 2026, most mature teams already use `tsc` to *check* rather than to *build*. The modern setup splits the job: esbuild, SWC, or Vite handle transpilation (they are fast precisely because they strip types *without* checking them), while type safety comes from `tsc --noEmit` running separately in CI. This is exactly where TypeScript 7 lands its biggest practical punch — it makes the slowest, most-awaited step in your pipeline, the type check, roughly 10x faster overnight.

The naming can confuse, so let us be precise:

- **`tsc`** — the `tsc` binary from the `typescript@rc` package is now the Go-native compiler directly; you do not have to learn a new command.
- **`tsgo`** — this name lives on only in the `@typescript/native-preview` nightly package, for those who want to try the newest changes.

Keeping checking and emit as distinct jobs is our [clean code principles](/en/posts/clean-code-principles-checklist) applied to the tooling layer: each tool should do one thing well. For projects that lean hard on the type system, our [advanced TypeScript patterns guide](/en/posts/advanced-typescript-patterns) is where the new speed helps most — conditional types and large unions were the most expensive work for the old compiler.

## How to try it today

The safest path is small and reversible: install the compiler for type checking only, and leave emit exactly as it is.

```bash
# 1) Install the stable RC as a dev dependency
npm install -D typescript@rc

# 2) The Go-native compiler is now tsc directly; check without emitting
npx tsc --noEmit

# 3) To trial the newest changes, the nightly channel is a separate package + tsgo
npm install -D @typescript/native-preview
npx tsgo --noEmit
```

The difference in CI is felt on the very first run. Leave emit to your existing build tool and hand the check to the native compiler:

```yaml
# Example CI step: a fast type gate
- name: Type check
  run: npx tsc --noEmit   # typically ~10x faster with TS7
```

For teams that use the type check as a deploy gate, this means a directly shorter feedback loop. Our [CI/CD pipeline setup guide](/en/posts/how-to-build-cicd-pipeline) covers where this step sits and why it is the most common bottleneck. When a type check drops from 78 seconds to 8, the "running the check on every PR is too slow" excuse simply disappears.

## Being realistic about migration

Let me be direct: do not rush to replace `tsc` as your sole source of production JavaScript output until the stable GA lands and the programmatic API settles in 7.1. The sensible bridge strategy is to use the native compiler *today* for CI type checking (~10x faster, ~2x less memory) while keeping your current setup for real JS output and `.d.ts` generation until the emit pipeline matures. If you ship a library, watch the `--declaration` and `--build` status closely; if you ship an application, you are likely a net winner even now.

There is an interesting knock-on effect in the tooling ecosystem, too. The Oxc team forked `tsgolint` with typescript-eslint's permission and, covering 59 of the 61 targeted rules, is shipping with early adopters reporting 20–40x faster type-aware linting. The native-compiler wave speeds up not just `tsc` but the whole chain around it. We covered the rise of these "model-first" tools that serve both machines and humans in our piece on [agent-first developer tools](/en/posts/agent-first-dev-tools).

For a home base on broader engineering topics, browse the [Software Engineering](/en/category/software-engineering) section. TypeScript 7 is one of the biggest tooling upgrades of the decade — and the best part is that it requires you to relearn nothing about the language itself.

## Frequently Asked Questions

### Will TypeScript 7 break my code?

Usually not. Corsa's explicit goal was to preserve type-checking behavior and semantics while porting the existing codebase file by file, so the same code produces the same errors. The one caveat is that `--declaration` emit may intentionally produce slightly different, closer-to-TS output. The risk is low for application code; if you publish a library, review your `.d.ts` output once.

### What is the difference between `tsc` and `tsgo`?

In the RC, the `tsc` binary from `typescript@rc` is already the Go-native compiler, so no separate command is needed. The `tsgo` name lives on only in the `@typescript/native-preview` nightly package, for people who want to trial the latest changes. For stable work, `typescript@rc` and `tsc` are all you need.

### I use esbuild or SWC — do I still need TypeScript 7?

Yes. esbuild and SWC strip types without checking them; that is the secret to their speed. Only `tsc --noEmit` provides type safety, and no other tool replaces it. The value of TypeScript 7 is precisely that it makes this checking step roughly 10x faster, so you can still leave transpilation to your fast tool.

### When should I move it to production?

For type checking and CI, you can try it immediately as of July 2026 — the gain is instant and the risk is low. If you rely on the programmatic API for lint rules, ts-morph, or custom transformers, wait for 7.1. For library emit (`--declaration`, `--build`), it is safest to wait for the stable GA and a mature emit pipeline.
