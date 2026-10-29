---
title: "Type-Safe Env Vars and Config in TypeScript"
slug: "type-safe-env-vars-and-config-in-typescript"
translationKey: "type-safe-env-config-typescript"
locale: "en"
excerpt: "Short answer: parse process.env once against a Zod schema at boot and validate it there, so a missing variable fails loudly at startup, not mid-request."
category: "web-development"
tags: ["typescript", "nextjs", "best-practices", "web-security"]
publishedAt: "2026-10-29"
seoTitle: "How Do You Make Env Vars Type-Safe in TypeScript?"
seoDescription: "Validate process.env once with Zod or t3-env and fail at boot, not mid-request, so a missing environment variable never pages you at 3am again."
---

Short answer: parse `process.env` once at boot against a schema defined with Zod (or a wrapper like t3-env); if a variable is missing or malformed, the app should crash immediately with a readable error, not leak `undefined` into a request. To keep server secrets from reaching the browser, split that schema into separate server and client blocks.

## Why do stringly-typed env vars page you at 3am?

To TypeScript, `process.env.DATABASE_URL` is always `string | undefined` — the type system never guarantees this variable actually exists or is in the right format. That uncertainty means a misspelled environment variable, or one simply forgotten during deploy, stays silently `undefined`, and the error surfaces not where the variable is used, but much deeper — usually where that value gets passed into a database connection string.

So the classic scenario plays out like this: the deploy looks successful, the app boots fine, but it crashes with "connection string is undefined" the moment the first database request arrives — usually overnight, during low traffic, exactly when the first request happens to land. Validating at boot moves that failure to deploy time instead of the middle of a request.

## Why is defining a schema with Zod better than scattered undefined checks?

Writing `if (!process.env.DATABASE_URL) throw new Error(...)` at every usage site is both repetitive and easy to forget; a Zod schema defines every variable in one place and gives you type and validation at the same time. A check like `z.string().url()` doesn't just confirm the variable exists — it guarantees it's a valid URL, which catches "present but wrong format" errors at boot too.

```typescript
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  API_SECRET_KEY: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors)
  throw new Error("Environment validation failed — refusing to start.")
}

export const env = parsed.data
```

Using `safeParse` lets you log the error in your own format before deliberately throwing — producing a far more readable error than the ambiguous stack traces Next.js shows during a build failure.

## What does t3-env add on top of Zod?

`@t3-oss/env-nextjs` (and its Nuxt equivalent) adds two layers on top of the same Zod validation: it forces you to separate server and client variables under `server` and `client` blocks, and it uses a `runtimeEnv` object to explicitly state which variables actually get embedded in Next.js's Edge and client bundles. The `createEnv` function merges those two blocks into a single type-safe `env` object; the newest versions accept any Standard Schema-compliant validator besides Zod, such as Valibot or ArkType.

```typescript
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    API_SECRET_KEY: z.string().min(32),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    API_SECRET_KEY: process.env.API_SECRET_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})
```

## How do you keep server secrets from leaking to the client?

In Next.js, only variables prefixed with `NEXT_PUBLIC_` get embedded in the JavaScript bundle sent to the browser; anything left without that prefix stays server-only. t3-env enforces this rule at compile time: trying to add a variable to the `client` block without the `NEXT_PUBLIC_` prefix throws a TypeScript error, and trying to access a `server` variable from a client component throws a descriptive runtime error.

| Variable type | Prefix | Where it lives | Risk |
|---|---|---|---|
| Server secret (API key) | No prefix | Server only | A leak exposes the key |
| Client config (public URL) | `NEXT_PUBLIC_` | Server + browser bundle | Already public, low risk |
| Build-time constant | Depends on framework | Baked into build output | Can't change after build |

Skipping this split and accidentally marking an API key `NEXT_PUBLIC_` is exactly one of the leak scenarios covered in [our cloud secrets management piece](/en/posts/cloud-secrets-management-done-right) — and this compile-time type check is the only safety net that catches that mistake.

## How do you handle coercion and defaults for values?

Environment variables always arrive as strings, so you need to coerce a port number or boolean flag before using it; Zod's `.transform()` moves that logic into the schema itself, so the coercion isn't repeated at every usage site. `z.string().transform(Number)` turns a string into a number, while `.default("3000")` assigns a fallback when the variable isn't set — combining both makes an optional numeric variable like `PORT` safe in a single line.

For environment-specific configuration (looser validation in development, stricter in production), picking a conditional schema based on `NODE_ENV` lets the same codebase run under different constraints per environment — but keeping that conditional logic in one file prevents scattered `if (process.env.NODE_ENV === ...)` checks from spreading across the codebase.

## What does a committed .env.example actually buy you?

Committing a `.env.example` file to the repo — one with no real values, but showing every variable's name and expected format — lets a new team member or a CI environment see what's needed without reading the schema. A simple rule keeps it in sync: whenever you add a new required variable to the schema, add a line to `.env.example` in the same PR — without that discipline, the file goes stale fast.

## How do you actually test config loading?

The cheapest way to verify your schema works correctly is writing unit tests that confirm `safeParse` succeeds with a valid environment object, fails with a missing required variable, and also fails with an incorrectly formatted value (a `DATABASE_URL` that isn't a URL, for instance). These tests catch the next person who edits the schema accidentally loosening a validation.

Pairing this config layer with [advanced TypeScript patterns](/en/posts/advanced-typescript-patterns) to derive the `env` object's type from a single source everywhere in the app prevents different files from drifting into different types.

## How do multiple apps in a monorepo share the same schema?

In a monorepo where multiple apps (web, API, worker) share a common set of environment variables, defining the schema once in a shared package (`packages/env`) and letting each app extend it with its own additional variables saves you from writing the same `DATABASE_URL` validation three separate times. t3-env's `extends` option does exactly this: you import a base schema and layer app-specific fields on top of it.

Pairing this shared schema with [advanced TypeScript patterns](/en/posts/advanced-typescript-patterns) to derive every app's `env` object from the same source removes the risk of updating the schema in one app and forgetting the others — TypeScript throws a compile error the moment the shared package changes and an app hasn't been updated to match.

## Should you write a Zod env schema the same way you write a form schema?

Yes — environment variable validation and form validation are actually the same problem: turning untrusted, external string data into a typed, safe structure. The schema-writing habits we cover in [accessible React forms with RHF and Zod](/en/posts/react-hook-form-zod-accessible-forms) — clear error messages, custom rules with `.refine()` — apply directly to environment schemas too; the only difference is that a form gets its data from a user, while an env schema gets its data from the deploy process.

## Frequently Asked Questions

### What do you use to make environment variables type-safe in TypeScript?

A schema validator like Zod or t3-env. Parsing `process.env` at application boot against a schema, then exporting the result as a single `env` object, gives you both type safety and a fail-fast error at startup.

### When should a missing environment variable throw an error?

At application boot, not in the middle of a request. Validating with `safeParse` at startup and throwing on failure moves the error to deploy time and prevents "connection string is undefined" errors from paging you overnight.

### How do you keep server secrets from leaking to the client?

In frameworks like Next.js, only variables prefixed with `NEXT_PUBLIC_` are sent to the browser. t3-env enforces this at compile time, blocking you from adding an unprefixed secret to the client block.

### What does t3-env give you beyond plain Zod?

It forces server and client variables into separate blocks and uses `runtimeEnv` to explicitly state which variables actually get embedded in Next.js's Edge and client bundles — with plain Zod, you have to write that separation yourself.
