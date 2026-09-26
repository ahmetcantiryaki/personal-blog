---
title: "End-to-End Type-Safe APIs: tRPC and Beyond"
slug: "end-to-end-type-safe-apis-trpc"
translationKey: "end-to-end-typesafe-apis-2026"
locale: "en"
excerpt: "Use tRPC when every consumer is TypeScript you own; use typed OpenAPI or oRPC for external or polyglot clients that need generated, versioned contracts."
category: "web-development"
tags: ["typescript", "api-design", "backend", "graphql"]
publishedAt: "2026-09-26"
seoTitle: "End-to-End Type-Safe APIs: tRPC and Beyond (2026)"
seoDescription: "Compare tRPC, typed OpenAPI, GraphQL codegen, Server Actions, and oRPC for end-to-end type safety, with a starter recipe and honest tradeoffs for 2026."
---

Short answer: reach for [tRPC](https://trpc.io/docs/openapi) when your frontend and backend live in one TypeScript monorepo you control, reach for typed OpenAPI or [oRPC](https://infoq.com/news/2025/12/orpc-v1-typesafe/) when you have external or polyglot consumers, and reach for GraphQL codegen when you need a flexible query shape across many clients. All four give you compile-time errors instead of runtime surprises when an API changes.

## What does end-to-end type safety actually buy you?

End-to-end type safety means a change to a server function's input or output shape produces a compile error in the client that calls it, before you ever run the code. Without it, a renamed field or a dropped property is a silent runtime bug that only shows up in production or, if you are lucky, in a manual QA pass. With it, your editor turns red the moment someone renames `userId` to `id` on the server, and the build fails until every caller is fixed.

The practical payoff is refactors that do not silently break the client: rename a field on the server, save the file, and your IDE lights up every call site that needs updating — no drift between what the server sends and what the UI expects. This matters most in fast-moving teams where the same engineers touch both the API and the screen consuming it, often in the same pull request.

## What is tRPC, and how does it get type safety without codegen?

tRPC infers types directly from your server code using TypeScript's own language features — type inference, not code generation. You define a procedure once on the server, export its type, and the client imports that type at compile time with zero codegen step, then talks to the server over ordinary (batched) HTTP at runtime. You never run a generator when the API changes; the types are just... there, because they are the same TypeScript types the server already has.

That is a genuinely different mechanism from OpenAPI-based approaches, which produce a schema document and then generate a separate set of client types from it. tRPC skips the intermediate document entirely. Here is a minimal router and a type-safe client call:

```typescript
// server/router.ts
import { z } from "zod";
import { router, publicProcedure } from "./trpc";

export const appRouter = router({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db.user.findUnique({ where: { id: input.id } });
    }),
});

export type AppRouter = typeof appRouter;
```

```typescript
// client.ts
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server/router";

const client = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3000/api/trpc" })],
});

// input and return type are both inferred, no .d.ts to generate
const user = await client.getUser.query({ id: "u_123" });
```

If you change `input` to require an `orgId` too, `client.getUser.query({ id: "u_123" })` fails to compile immediately. That is the entire value proposition in one example.

## tRPC vs OpenAPI: how do the approaches actually compare?

Pick tRPC when every consumer is TypeScript code you own, typically inside a monorepo; pick typed OpenAPI (or oRPC) for external teams, mobile apps in Swift or Kotlin, or partners consuming your API in another language. The dividing line is ownership of the client, not project size.

The typed OpenAPI + codegen path works like this: your server (via decorators, a framework like NestJS, or a hand-written spec) produces an OpenAPI document, and a tool like `openapi-typescript` reads it and generates a `.d.ts` file of client types. It is polyglot by design — any language with an OpenAPI generator can consume the same contract — but it introduces a real synchronization problem. Teams report genuine friction from what amounts to a "did you run codegen?" bug: a schema change is not reflected in the generated types until someone remembers to regenerate them, and a stale generated file compiles fine while lying about the real shape of the API.

GraphQL plus codegen (tools like GraphQL Code Generator) solves a different problem: flexible, client-driven query shapes across many consumers, with type safety applied after the fact via generated hooks and types. It is a heavier operational lift — a schema registry, resolver layer, and often a gateway — that pays off when multiple frontends need different slices of the same data graph, not when you have one API and one client.

Framework-native server actions, such as Next.js Server Actions, sidestep the client/server split almost entirely: a function marked `"use server"` is called directly from a React component, and TypeScript infers the types across that boundary like any local function call. That gives you tRPC-like inference with even less ceremony, at the cost of being locked to a framework that supports the pattern and to first-party rendering, not a general HTTP API.

oRPC (reaching v1.0 in the 2025–2026 cycle) is worth knowing about because it tries to close the gap between the two camps: it ships first-class OpenAPI support alongside end-to-end type safety for inputs, outputs, and even typed errors, according to [InfoQ's coverage of the v1 announcement](https://infoq.com/news/2025/12/orpc-v1-typesafe/). In effect it wants tRPC's zero-codegen experience and OpenAPI's polyglot support in one library. As of September 2026 it is younger and has a smaller ecosystem than tRPC or established OpenAPI tooling, so weigh maturity against convenience.

## What are the real tradeoffs between these approaches?

The core tradeoff is monorepo coupling versus public API stability. tRPC's compile-time inference only works because the client imports a TypeScript type directly from the server package, so both must ship from the same build graph and both must be TypeScript. Break that coupling and the mechanism stops applying — you would be exposing internal server types to a public surface with no version boundary.

Service boundaries and versioning form the second axis. An OpenAPI document or a GraphQL schema is a contract artifact you can diff, review, and version explicitly, and run a breaking-change checker against in CI. tRPC's router type has no equivalent standalone artifact; the "contract" is whatever the server's live TypeScript types happen to be at any commit — exactly right for a fast-moving internal API, exactly wrong for one third parties depend on with SLAs.

| Approach | Type safety | Codegen step | External/polyglot consumers | Governance & versioning |
|---|---|---|---|---|
| tRPC | Full (inference) | None | Poor — TypeScript-only, same repo | Weak — no standalone contract artifact |
| Typed OpenAPI + codegen | Full, after regen | Required (`openapi-typescript`, etc.) | Strong — any language | Strong — diffable spec, breaking-change linters |
| GraphQL + codegen | Full, after regen | Required (GraphQL Code Generator) | Strong — any language | Moderate — schema is versioned, resolvers add ops cost |
| Next.js Server Actions | Full (inference) | None | None — first-party rendering only | Weak — tied to the app, not a general API |
| oRPC v1.0 | Full, inputs/outputs/errors | Optional | Strong — first-class OpenAPI | Moderate-strong, ecosystem still maturing (Sept 2026) |

If you already write [advanced TypeScript patterns](/en/posts/advanced-typescript-patterns) like branded types to keep your domain model honest, tRPC extends that discipline across the network boundary for free. If you need governance instead, pair typed OpenAPI with the discipline in [API versioning strategies](/en/posts/api-versioning-strategies) from day one.

## A small starter recipe

For a new internal tool inside a TypeScript monorepo, this is the fastest path to end-to-end safety as of September 2026:

1. Define inputs and outputs with [Zod](https://zod.dev) schemas on the server — one declaration gives you runtime validation and a static type via `z.infer`.
2. Wrap each schema in a tRPC `procedure` (see the router example above) and export only the router's type, never its implementation, from a shared package.
3. Import that type in the client with `import type { AppRouter } from "@repo/server"` — `type` keeps the server's runtime code out of your client bundle.
4. Add `httpBatchLink` so multiple calls in the same tick collapse into one HTTP request, so the "just call a function" ergonomics do not cost you a request per call in production.
5. If you later need a public API for the same data, do not repurpose the tRPC router. Stand up a typed OpenAPI layer (or evaluate oRPC) for that external surface, and version it independently.

That last step matters more than it looks: the moment a tRPC endpoint gets an external consumer, you have quietly created an unversioned public contract, and every internal refactor becomes a breaking change for an outsider. When in doubt, default to tRPC anyway and add an OpenAPI facade later — retrofitting a facade is cheaper than migrating an entire client fleet off tRPC once it has spread.

For background on when a flexible query graph beats a fixed set of endpoints at all, see [REST vs GraphQL](/en/posts/rest-vs-graphql).

## Frequently Asked Questions

### Is tRPC only usable in a monorepo?

Not strictly, but that is the practical requirement. tRPC needs the client to import a TypeScript type from the server's source at compile time, which normally means both live in one repository or shared package registry; splitting them across unrelated repos and languages defeats the mechanism entirely.

### Does tRPC work with a mobile app or a non-TypeScript client?

No, and that is its main limitation. tRPC's type inference is a TypeScript-to-TypeScript feature, so a Swift, Kotlin, or Python client gets none of the compile-time guarantees and must call the underlying HTTP endpoints manually; typed OpenAPI or oRPC's OpenAPI mode is the better fit there.

### Is oRPC a replacement for tRPC in 2026?

Not yet for most teams. oRPC v1.0 offers a compelling combination of type-safe inference and first-class OpenAPI support, per the December 2025 v1 coverage, but as of September 2026 it has a smaller ecosystem and less tooling maturity, so evaluate it for new projects rather than migrating stable tRPC codebases.

### Do I need GraphQL if I already have type-safe REST endpoints?

Usually not. GraphQL earns its operational cost — a schema registry, resolvers, and often a gateway — when several different frontends need different slices of the same data graph in one request; a single web app calling its own backend rarely needs that flexibility.
