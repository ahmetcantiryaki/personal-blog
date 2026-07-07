---
title: "REST vs GraphQL: Choosing the Right API"
slug: "rest-vs-graphql"
translationKey: "rest-vs-graphql"
locale: "en"
category: "software-engineering"
tags: ["api-design", "rest", "graphql", "backend"]
publishedAt: "2026-07-03"
seoTitle: "REST vs GraphQL in 2026: Choosing the Right API"
seoDescription: "REST vs GraphQL is the wrong fight in 2026. A current comparison table with tRPC and gRPC, real latency numbers, and a decision guide for your next service."
excerpt: "Most developers still treat REST vs GraphQL as a two-horse race. As of July 2026 that framing is stale. Here is the honest comparison, with tRPC and gRPC in the picture."
---

Most developers still argue **REST vs GraphQL** like it's a title fight with one belt. Pick a side, ship it, defend it in code review. As of July 2026, that framing is the least useful way to think about API design. The honest answer is that neither wins outright; the dominant production pattern is a hybrid of both, and two newer contenders quietly reshaped the question while everyone was busy taking sides.

Here is the nuance nobody puts on a conference slide: REST and GraphQL solve *different* problems, and the interesting decision in 2026 is rarely "which one" but "which combination, and where." This piece compares them with production examples and fresh numbers, then puts tRPC and gRPC on the same table so you can actually choose.

## What REST vs GraphQL actually means

REST is built on many endpoints (`/users`, `/users/1/orders`), each returning a fixed data shape the server decides. GraphQL is built on a single endpoint (`/graphql`) where the client defines the exact fields it wants through a query language. The load-bearing difference: in REST the server shapes the response; in GraphQL the client does.

REST is an architectural style from Roy Fielding's 2000 dissertation, driven by HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`). GraphQL is a query language Facebook open-sourced in 2015, governed by the [GraphQL Foundation](https://graphql.org/) since 2019. It is very much alive: the [September 2025 specification](https://spec.graphql.org/September2025/) is the current stable edition, superseding the 2021 one, and a companion GraphQL-over-HTTP spec finally standardized transport semantics that used to be a per-server free-for-all.

A simple heuristic still holds. If your mobile app fires three REST calls for one screen and discards half the payload, that is the exact problem GraphQL was built to kill. If one endpoint's fixed response serves every client fine, giving up REST's simplicity buys you nothing.

## Comparison table: REST vs GraphQL vs tRPC vs gRPC

The two-column version of this table is a 2021 artifact. Here is the one that matches how teams actually pick an API layer as of July 2026.

| Dimension | REST | GraphQL | tRPC | gRPC |
|-----------|------|---------|------|------|
| Endpoints | Many, one per resource | Single (`/graphql`) | RPC procedures | RPC methods over HTTP/2 |
| Who shapes the data | Server | Client (query) | Shared TS types | Protobuf schema |
| Over/under-fetching | Common | Prevented by query | Minimal | Minimal |
| HTTP caching | Native, URL-based | Hard, needs a layer | Limited | Limited |
| Cross-language | Universal | Universal | TypeScript only | Excellent |
| Learning curve | Low | Medium-high | Very low (TS teams) | Medium |
| Best for | Public & CRUD APIs | Multi-client, nested data | TS monorepos | Low-latency internal services |

Practical rule: flat, cacheable resources for a public audience lean REST. Diverse clients pulling different slices of nested data lean GraphQL. A TypeScript full-stack monorepo probably wants neither, tRPC. Two internal microservices chattering under latency budgets want gRPC. This is exactly the kind of trade-off matrix that shows up in a [system design interview](/en/posts/system-design-interview-guide), and getting it right matters more than memorizing any single protocol.

## When REST still wins

Use REST when resources are clearly defined, HTTP caching and CDNs matter, and your API is public or consumed by third parties. As of July 2026, REST still fronts roughly 83% of public web APIs, and around 93% of teams ship it somewhere. That is not inertia; it is fit.

Where REST shines:

- **Public APIs:** Stripe, GitHub, and Twilio still ship REST, now almost universally documented with OpenAPI 3.1. It is discoverable, cacheable, and testable with `curl`.
- **CDN and browser caching:** A `GET /products/42` caches for free with `Cache-Control` and `ETag`. Replicating that in GraphQL is real work.
- **Simple CRUD services:** Few resources and shallow relationships make a GraphQL schema and resolver layer dead weight.

A real example: for a SaaS customer we first built the product-catalog API in GraphQL. But 90% of responses asked for the same three fields, and losing the CDN cache multiplied origin traffic by 6x. Moving back to REST pushed CDN hit rate to 94% and dropped p95 latency from 210 ms to 45 ms.

```http
# REST: each resource at its own URL, cacheable over HTTP
GET /api/products/42 HTTP/1.1
Accept: application/json
Cache-Control: max-age=300

# Response: a fixed shape defined by the server
{ "id": 42, "name": "Wireless Headphones", "price": 1299, "stock": 17 }
```

You know how many fields come back and how it caches before you send it. Predictability and caching are the whole value of REST.

## When GraphQL earns its complexity

Use GraphQL when different clients (web, iOS, Android) want different slices of the same data, relationships are deeply nested, and over-fetching is measurable. Independent 2026 benchmarks put GraphQL around 28% faster (roughly 180 ms vs 250 ms) on complex queries that would otherwise need several REST round trips, while REST handles about 33% more simple requests per second. Read that carefully: the win is about round trips, not raw protocol speed.

```graphql
# GraphQL: the client defines exactly the fields it wants, one request
query {
  user(id: 42) {
    name
    orders(last: 3) {
      total
      items { productName price }
    }
  }
}
```

That single query returns what would take 3–4 REST calls. But GraphQL is not free. Three things are mandatory. First, **N+1 protection**: without a batching loader like DataLoader, nested resolvers hammer the database. On one production service, a single request generated 340 SQL queries before we added batching, the kind of pathology that also makes [database indexing](/en/posts/database-indexing-explained) suddenly urgent. Second, **query depth and complexity limits**, or a malicious client takes you down with one deeply nested query. Third, **persisted queries** for caching and security.

## The 2026 twist: tRPC and gRPC changed the question

Here is the opinionated take: for a large share of teams, the real 2026 answer to "REST vs GraphQL" is *neither*.

If you own both ends of a TypeScript stack, [**tRPC v11**](https://trpc.io/blog/announcing-trpc-v11) (shipped with SSE subscriptions and first-class TanStack Start integration) gives you end-to-end type safety with no schema, no codegen, and effectively zero client boilerplate. Your API is just typed function calls. For a monorepo, that is a strictly better developer experience than hand-writing REST handlers and client fetchers, and it leans hard on [advanced TypeScript patterns](/en/posts/advanced-typescript-patterns) to make the types flow. The catch: it is TypeScript-only, so no public or polyglot consumers.

For internal service-to-service traffic under latency budgets, **gRPC** with Protobuf remains the pragmatic default, and the Connect protocol plus Buf tooling made its developer experience dramatically less painful than it was three years ago. This is where a [microservices vs monolith](/en/posts/microservices-vs-monolith) decision quietly forces your API-layer choice: fan-out RPC between services rewards gRPC in a way public REST never will.

The pattern that actually won is the Backend-for-Frontend: a GraphQL or tRPC layer aggregating over REST and gRPC microservices underneath. Netflix, GitHub, Shopify, and The New York Times all run some version of it. Mature 2026 architectures are pragmatic, not ideological.

## REST vs GraphQL: how to decide

Ask these in order and stop at the first strong yes:

1. **Own both ends in TypeScript?** Reach for tRPC before anything else.
2. **Internal, latency-sensitive service calls?** gRPC.
3. **Public or third-party consumers, or caching is critical?** REST.
4. **Multiple clients pulling different slices of nested data?** GraphQL, with N+1 and depth limits from day one.
5. **Big and mixed?** A BFF layer over REST/gRPC services, the boring answer that scales.

Factor in team maturity honestly: GraphQL demands expertise around N+1, depth attacks, and cache management that a small team may not have. For more of these trade-offs, browse the rest of our [software engineering](/en/category/software-engineering) writing.

## Frequently Asked Questions

### REST vs GraphQL: which one is faster?

It depends on round trips. For a single simple resource, REST is almost always faster thanks to HTTP caching. For a screen needing 4 separate calls, GraphQL wins on total latency, roughly 28% in 2026 benchmarks, by collapsing them into one request. The speed difference comes from how many round trips you make, not the protocol.

### Will GraphQL replace REST?

No. As of July 2026 they coexist, and REST still fronts about 83% of public APIs. GraphQL is strong for multi-client, nested-data scenarios; REST remains the default for public APIs, simple CRUD, and anything needing caching. Most mature teams run both.

### Where do tRPC and gRPC fit in?

tRPC is the best choice for a TypeScript monorepo where you control client and server, thanks to zero-codegen end-to-end type safety. gRPC is the default for low-latency internal service-to-service calls. Neither replaces REST for public APIs, but both often beat GraphQL for their specific niche.

### What is the most common mistake in GraphQL?

The N+1 query problem. Nested resolvers trigger a separate database query per child object, tanking performance. The fix is a batching layer like DataLoader plus hard limits on query depth and complexity.
