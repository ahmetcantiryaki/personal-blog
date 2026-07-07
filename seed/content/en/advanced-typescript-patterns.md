---
title: "Advanced TypeScript Patterns for Cleaner Code"
slug: "advanced-typescript-patterns"
translationKey: "advanced-typescript-patterns"
locale: "en"
category: "software-engineering"
tags: ["typescript", "clean-code", "design-patterns"]
publishedAt: "2026-07-01"
excerpt: "Advanced TypeScript patterns for cleaner code on TypeScript 6.0 and the 7.0 Go compiler: discriminated unions, branded types, and type-safe builders."
seoTitle: "Advanced TypeScript Patterns for Cleaner Code (2026)"
seoDescription: "Master advanced TypeScript patterns for cleaner code on TypeScript 6.0 and the new 7.0 native compiler: discriminated unions, branded types, and builders."
---

Last month a teammate paged the on-call channel at 2 a.m.: a checkout endpoint was refunding the wrong orders. The root cause fit on one line. Someone had passed a `userId` where the function expected an `orderId`. Both were `string`, so the type checker was happy, the tests were green, and the bug sailed into production. A branded type would have rejected that call at compile time, before the pull request was even opened.

That is the whole pitch for advanced TypeScript patterns: they turn the type system from documentation into a validation engine. Discriminated unions, branded types, template literal types, and type-safe builders catch bugs at compile time that would otherwise explode at runtime. This guide shows the patterns I actually ship in production to cut down `if` pyramids, with examples that compile under [TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) (stable since March 2026) and the new [Go-native compiler](https://github.com/microsoft/typescript-go) in the 7.0 release candidate.

Every snippet below was compiled under `strict`, which TypeScript 6.0 now turns on by default. The goal is not to look clever; it is to produce code that is easy to read and safe to change.

## Why advanced TypeScript patterns produce cleaner code

Advanced TypeScript patterns produce cleaner code by making invalid states unrepresentable. When you make a bug impossible in the type system, you no longer need the defensive `if` blocks, unit tests, and comments that guard against it. Code gets shorter, intent gets clearer, and the compiler protects you during refactors.

In practice you gain three things:

- **Less defensive code:** You hand null checks and type guards to the compiler.
- **Self-documenting signatures:** Function types explain what they accept and return without a single comment.
- **Safe refactors:** Change one field and the compiler lists every call site that breaks.

This matters more than it used to. As of July 2026, roughly 78% of professional developers report using TypeScript, up from 69% in 2024. The language is the default, so leaning on it fully is no longer exotic.

## How discriminated unions prevent invalid states

A discriminated union is a union of types that share a common literal field (the discriminant), which enables narrowing inside a `switch`. Its biggest benefit is merging mutually exclusive states into one type and eliminating impossible combinations like "loading and errored at once" at compile time.

The classic mistake is collapsing every state into one object with optional fields:

```typescript
// Bad: invalid combinations are possible
interface State {
  loading: boolean;
  data?: User;
  error?: Error;
}
// When loading is true, both data and error can still be set
```

A discriminated union makes that impossible:

```typescript
type Result<T> =
  | { kind: "pending" }
  | { kind: "success"; data: T }
  | { kind: "error"; message: string };

function render(result: Result<User>): string {
  switch (result.kind) {
    case "pending":
      return "Loading...";
    case "success":
      return result.data.name; // data is guaranteed here
    case "error":
      return result.message;
  }
}
```

TypeScript narrows the type automatically inside each `case`; reach for `result.data` in the wrong branch and compilation fails.

### Add an exhaustiveness check

To find every `switch` when you add a variant, use the `never` trick. This one line has saved me more production incidents than any other:

```typescript
function handle(result: Result<User>): string {
  switch (result.kind) {
    case "pending": return "...";
    case "success": return result.data.name;
    case "error": return result.message;
    default:
      const _exhaustive: never = result; // errors when a new variant appears
      return _exhaustive;
  }
}
```

## How branded types prevent primitive confusion

Branded types (a simulation of nominal typing) let the compiler distinguish values that share the same underlying type. They stop the exact 2 a.m. incident I opened with: swapping a `UserId` (a `string`) for an `OrderId` (also a `string`). At runtime it is still a plain `string`, so the overhead is zero.

```typescript
type Brand<T, B> = T & { readonly __brand: B };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function userId(raw: string): UserId {
  return raw as UserId; // single validation point
}

function getOrder(id: OrderId) { /* ... */ }

const u = userId("u_123");
getOrder(u); // Compile error: UserId is not assignable to OrderId
```

Validate the brand in a single factory function so the `as` cast never spreads across your codebase. If you already run a schema validator, Zod 4 and Effect ship ready-made brand helpers that fold the check into parsing.

## What template literal types are good for

Template literal types build constrained string types by combining string literals at the type level. They enforce, at compile time, strings that must follow a specific pattern such as API routes, event names, or CSS units. A misspelled event name can no longer escape into production.

```typescript
type Method = "GET" | "POST";
type Resource = "user" | "order";
type Route = `/${Resource}` | `/${Resource}/${string}`;
type Endpoint = `${Method} ${Route}`;

const call = (e: Endpoint) => { /* ... */ };

call("GET /user");        // OK
call("GET /user/42");     // OK
call("PATCH /user");      // Error: PATCH is not in Method
```

I use the same idea on event buses: types like `on(\`user:${string}\`)` keep listener names consistent across the app.

## When should you use each pattern?

The table below maps each problem to the pattern you should reach for, plus the minimum TypeScript version that supports it cleanly:

| Pattern | Problem it solves | Use for | Avoid for | Since |
|---------|-------------------|---------|-----------|-------|
| Discriminated union | Mutually exclusive states | State machines, API results | Independent optional fields | Always |
| Branded type | Confusing the same primitive | IDs, currency, units | One-off values | Always |
| Template literal | Patterned strings | Routes, events, tokens | Free-form text | 4.1 |
| Type-safe builder | Step-by-step setup | Query/config builders | Simple object literals | 5.0 (`const` params) |
| `satisfies` | Type check + literal preservation | Config constants | General variables | 4.9 |

## How to write a type-safe builder

A type-safe builder changes its return type at each step so `build()` cannot be called until required fields are set—catching missing configuration at compile time instead of runtime. The steps are:

1. Define the type of the object being constructed.
2. Decide which fields are required and which are optional.
3. Make the builder generic so it accumulates filled fields in a type parameter.
4. Add the new field to the return type of every `with*` method.
5. Make `build()` reachable only when the required fields are present.
6. Reject a `build()` call with a compile error while a required field is missing.

```typescript
class QueryBuilder<Set extends string = never> {
  private p: Record<string, unknown> = {};

  from(t: string): QueryBuilder<Set | "from"> {
    this.p.from = t;
    return this as QueryBuilder<Set | "from">;
  }
  select(c: string[]): QueryBuilder<Set | "select"> {
    this.p.select = c;
    return this as QueryBuilder<Set | "select">;
  }
  // build is callable only when from and select are set
  build(this: QueryBuilder<"from" | "select">): string {
    return `SELECT ... FROM ...`;
  }
}

new QueryBuilder().from("users").select(["id"]).build(); // OK
new QueryBuilder().select(["id"]).build(); // Error: from is missing
```

The `this` parameter is the linchpin; it makes `build` resolve only in the correct type state. It is the same discipline you apply when you [refactor legacy code safely](/en/posts/how-to-refactor-legacy-code): make the compiler, not a code reviewer, enforce the invariant.

## Why `satisfies` beats a type annotation

The `satisfies` operator (TypeScript 4.9+) validates a value against a type without widening its literal type. A `const x: Type = ...` annotation forces the value to the broad type, while `satisfies` both checks it and preserves the narrow literal information. For config objects, that gives you autocomplete and type safety at the same time.

```typescript
type Theme = Record<string, `#${string}`>;

const colors = {
  primary: "#0055ff",
  error: "#ff0033",
} satisfies Theme;

colors.primary.toUpperCase(); // string methods are available
// With an annotation we would lose the key literals
```

My opinionated take: in modern projects, `satisfies` should be your default for config constants and `const x: Type` the exception. It enforces the schema, keeps the narrow type, and pairs naturally with our [clean code principles checklist](/en/posts/clean-code-principles-checklist).

These patterns are the type-level cousins of the classic [design patterns every developer should know](/en/posts/design-patterns-for-developers), and they are easier to verify—[well-written unit tests](/en/posts/how-to-write-unit-tests) confirm behavior while the compiler confirms shape. For more, browse the [software engineering](/en/category/software-engineering) category.

## Frequently Asked Questions

### Do advanced TypeScript patterns hurt performance?

No, not at runtime. Every pattern covered here operates purely at the type level and adds zero code to the compiled JavaScript; branded types and `satisfies` disappear entirely. The only cost is compile-time checking on very complex types—and that just got cheaper. The Go-native compiler [announced with the TypeScript 7.0 beta](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/) is roughly 10x faster at type-checking than 6.0, taking the VS Code codebase from about 78 seconds down to about 7.5.

### What is the difference between a discriminated union and an enum?

An enum only defines a fixed set of values; a discriminated union attaches a different data shape to each variant. If a state needs to carry extra fields (for example, an "error" state with a message), a discriminated union is the right tool. An enum is enough when you only need a label—and note that TypeScript 6.0 nudges you toward union-of-literals over enums for most cases anyway.

### Do branded types require a third-party library?

No. A branded type is a few lines built from an intersection type and needs no external dependency. Zod 4 and Effect ship ready-made brand helpers that combine the brand with runtime validation, but for small projects your own `Brand<T, B>` helper is more than enough.

### Should I wait for TypeScript 7.0 before adopting these patterns?

No. Every pattern here works today on TypeScript 6.0 and has for several releases. TypeScript 7.0—the Go port shipped as a release candidate on June 18, 2026, with GA expected shortly after—preserves identical type-checking semantics, so your unions and branded types behave exactly the same, just faster. Adopt the patterns now; upgrade the compiler when you are ready.
