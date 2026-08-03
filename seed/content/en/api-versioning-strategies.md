---
title: "API Versioning Strategies That Scale"
slug: "api-versioning-strategies"
translationKey: "api-versioning-strategies-2026"
locale: "en"
excerpt: "URI vs header vs media-type versioning trade-offs, additive-change discipline, Sunset headers, and when to actually fork a v2: field notes from production APIs."
category: "software-engineering"
tags: ["api-design", "rest", "backend", "best-practices"]
publishedAt: "2026-08-03"
seoTitle: "API Versioning Strategies: A Field Guide (2026)"
seoDescription: "URI vs header vs media-type versioning trade-offs, additive-change discipline, Sunset headers, and when to actually fork a v2: field notes from production APIs."
---

There's no single right way to evolve an API without breaking clients — but there are dozens of wrong ones. The short answer: favor additive, backward-compatible changes wherever possible, treat versioning as a last resort, and when you do need it, lean toward header-based versioning over URI versioning. Here's how we actually make that call, where it bites us, and how we run a deprecation without burning trust.

## URI, Header, and Media-Type Versioning: Each Has a Cost

URI versioning (`/v2/users`) is the most common choice because it's simple, curl-friendly, and trivial to cache. The cost: every new version drags a parallel copy of the same resource along with it, and the fork between `/v1` and `/v2` grows at the routing layer.

Header-based versioning (a custom `Api-Version: 2026-08-03` header, or a media type like `Accept: application/vnd.acme.v2+json`) keeps the resource URI clean and signals how a client wants a resource interpreted rather than which resource it wants — close to [Stripe's date-based versioning model](https://docs.stripe.com/api/versioning). The cost: discoverability drops, and your docs and tooling need extra work to surface headers clearly.

| Approach | Upside | Downside | Where It Works Best |
| --- | --- | --- | --- |
| URI (`/v2/...`) | Simple, cacheable, curl-friendly | Route forking, duplicated resources | Small-to-mid team, public API |
| Header / media-type | Resource URI stays clean, fine-grained control | Low discoverability, tooling overhead | High-traffic, enterprise API |
| Date-based header (Stripe model) | Each customer stays pinned to their integration date | Server must maintain many behavior branches | Payments and finance-critical domains |

## Additive-Change Discipline: Your Last Line of Defense Before Versioning

Before bumping a version number, the real question is: is this change actually breaking? Adding a new field, defining an optional parameter, or opening a new endpoint is almost never breaking — existing clients ignore fields they don't recognize. What's breaking is removing a field, changing its type, making it required, or redefining what an error code means.

Three rules make additive discipline work in practice:

1. New fields always start optional and carry a sensible default.
2. Adding a new enum value depends on a contract where clients safely ignore unknown values — document that contract explicitly.
3. Don't reshape a response; add a new field and deprecate the old one, then remove it later as a separate, separately announced step.

## Deprecation Policy: Sunset Headers and Communication

When you genuinely need to remove a field or endpoint, [RFC 8594](https://www.rfc-editor.org/info/rfc8594/) exists exactly for this: the `Sunset` header tells clients the date a resource will stop responding. In practice it pairs with the `Deprecation` header — `Deprecation` marks when the resource stopped being recommended, `Sunset` marks when it disappears entirely.

```http
HTTP/1.1 200 OK
Deprecation: Tue, 01 Sep 2026 00:00:00 GMT
Sunset: Mon, 01 Mar 2027 00:00:00 GMT
Link: <https://api.example.com/docs/migration-v2>; rel="sunset"
```

The pattern GitHub and Stripe both follow: notify clients through at least three channels before the sunset date — email, a dashboard warning, and the response header itself. Relying on a single changelog line means integrations break silently in production.

## Consumer-Driven Contract Tests: Catching Breakage Before Merge

The sneakiest breaks happen when a change you assumed was "additive" actually violates a client's hidden assumption — field ordering, or whether a value can be null. [Consumer-driven contract tests](https://docs.pact.io/) (with tools like Pact) catch this class of bug before merge: each consuming team defines "this is the contract I depend on" as an expectation file, and the provider runs it in CI. This doesn't replace integration tests; it's a much cheaper early-warning layer that runs a step earlier.

## Forking a v2 vs Evolving v1

Opening a genuine v2 — a new resource model, a new auth scheme, a new error format that requires a real break — is expensive: you run two code paths in parallel, keep two doc sets current, and convince customers to migrate. The practical rule: if your change fits within additive discipline, stay on v1. Open a real v2 only when the resource model's core assumption changes — for example, moving from a single-tenant to a multi-tenant data model.

## GraphQL and gRPC Evolve Differently

Unlike REST, GraphQL manages schema evolution at the field level with the `@deprecated` directive — clients can still query the old field while the server carries the deprecation warning in response metadata, so a separate v2 endpoint is rarely needed. gRPC leans on Protocol Buffers' field-numbering discipline instead: field numbers are never reused, new fields are always optional, and the `reserved` keyword protects removed field numbers from being accidentally reused later.

| Protocol | Evolution Mechanism | Versioning Need |
| --- | --- | --- |
| REST | URI/header versioning + additive changes | Required on breaking changes |
| GraphQL | Field-level `@deprecated`, single schema | Rare, usually unnecessary |
| gRPC | `.proto` field numbering + `reserved` | Optional, via package name (`v1`, `v2`) |

## The Deprecation Runbook, Step by Step

1. Identify the field or endpoint to remove; confirm an additive alternative already exists.
2. Add the `Deprecation` header and ship the dashboard and email announcement the same day.
3. Watch usage metrics — identify clients still calling the deprecated field and reach out to them directly by name.
4. Set the `Sunset` date at least 90 days out (180 days is safer for payments-critical APIs).
5. Send a final reminder one week before the sunset date.
6. On the sunset date, respond with 410 Gone and keep the migration link in the response body.

If you're pairing this discipline with safe retry behavior, our [idempotent API design guide](/en/posts/idempotent-api-design) is a natural companion, and if you're still deciding between protocols, see our [REST vs GraphQL comparison](/en/posts/rest-vs-graphql). For more coverage in this space, follow our [Software Engineering section](/en/category/software-engineering).

## Frequently Asked Questions

### Is URI or header-based versioning better?

Both are valid; the choice depends on team size and how the API is consumed. URI versioning is simple and discoverable, so it works well for small-to-mid public APIs; header/media-type versioning suits high-traffic enterprise APIs that want to keep resource URIs clean.

### Is the Sunset header mandatory?

No, RFC 8594 is a standards-track recommendation, not a requirement. But it's a strong best practice for deprecation communication because it gives clients a concrete, machine-readable end date.

### Do consumer-driven contract tests replace integration tests?

No. Contract tests quickly validate the agreement between a provider and a consumer in CI; they act as a cheap early-warning layer before real-environment integration tests, not a replacement for them.

### Do I have to support v1 forever?

No, but removal should always come with an explicit Sunset date, multi-channel communication, and a reasonable migration window — typically at least 90 days. Removing something silently permanently damages trust.
