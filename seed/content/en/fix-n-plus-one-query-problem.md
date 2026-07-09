---
title: "How to Fix the N+1 Query Problem"
slug: "fix-n-plus-one-query-problem"
translationKey: "fix-n-plus-one-queries"
locale: "en"
excerpt: "A list endpoint was firing 400 queries and taking 6 seconds to load. Here's how we detected the N+1 problem and cut it down to 2 queries with eager loading."
category: "software-engineering"
tags: ["databases", "performance", "backend", "sql"]
publishedAt: "2026-07-09"
seoTitle: "N+1 Query Problem: How to Detect and Fix It"
seoDescription: "A list endpoint was firing 400 queries and taking 6 seconds to load. Here's how we detected the N+1 problem and cut it down to 2 queries with eager loading."
---

A customer reported that the order-list page was painfully slow. The page showed 200 orders, each with a customer name and a product name. When we checked the query logs, we found: 1 query for the list, then a separate customer query per order (200 queries), then a separate product query per order (200 more). 401 queries total, 6 seconds to render. This is the textbook N+1 problem, and nearly every team using an ORM runs into it sooner or later.

## What N+1 is, and why ORMs cause it

The N+1 query problem is firing 1 query to fetch a list, then N additional queries — one per item in that list — to fetch each item's related data. It happens because modern ORMs default to **lazy loading**: writing `order.customer.name` doesn't fetch the customer until that line actually executes, and inside a loop, each "lazy" access fires a fresh query. The code looks completely innocent on its own; the problem only shows up at runtime, once you're counting queries.

```js
// Code that generates N+1 — looks innocent
const orders = await Order.findAll({ limit: 200 });
for (const order of orders) {
  const customer = await order.getCustomer(); // +1 query per row
  const product = await order.getProduct();   // +1 more query per row
  console.log(customer.name, product.name);
}
```

## Detecting it: query logs, APM, and test assertions

There are three ways to catch N+1 before it surfaces in production. First, keep SQL query logging on in development — Rails' `bullet` gem and Django's `django-debug-toolbar` flag it automatically. Second, track an endpoint's query count over time in your APM tool (Datadog, New Relic); if query count grows proportionally with data volume (200 orders → 401 queries, 400 orders → 801 queries), that's the signature of N+1. Third — and most reliable — add a **query-budget assertion** to your tests: "this endpoint must fire at most 3 queries regardless of how many orders it returns" catches the regression right at commit time.

## Fix 1: Eager loading (JOIN)

The most direct fix is fetching related data up front in a single query, usually via a JOIN. Most modern ORMs support this declaratively:

```js
// Sequelize — one query with eager loading
const orders = await Order.findAll({
  limit: 200,
  include: [Customer, Product],
});
```

```python
# Django — one query (JOIN) via select_related
orders = Order.objects.select_related('customer', 'product')[:200]
```

That cuts 401 queries down to 1. Prisma's `include`, TypeORM's relations, ActiveRecord's `includes`, and Django's `select_related`/`prefetch_related` pair all express the same idea under different names: declare the relation up front, and let the ORM build the JOIN itself.

## Fix 2: Batch loading with a dataloader

Eager loading isn't always possible — GraphQL resolvers, in particular, resolve each field independently, so you can't always know up front which relations will be needed. This is where the **dataloader** pattern comes in: it collects every "fetch this customer" call within a single request cycle and resolves them in one batched `WHERE id IN (...)` query.

```js
const customerLoader = new DataLoader(async (customerIds) => {
  const customers = await Customer.findAll({ where: { id: customerIds } });
  const byId = new Map(customers.map(c => [c.id, c]));
  return customerIds.map(id => byId.get(id)); // order must be preserved
});

// Called N times inside resolvers, but fires only one batched query
const customer = await customerLoader.load(order.customerId);
```

[GraphQL's official dataloader library](https://github.com/graphql/dataloader) was built for exactly this scenario: a GraphQL query returning 200 orders, each independently resolving its own `customer` field, still collapses to one query per event-loop tick instead of 200.

## When denormalization or caching is actually warranted

Eager loading and dataloaders fix most N+1 cases, but sometimes the problem isn't query *count* but query *cost* — if the related table is huge, the JOIN itself gets slow. At that point you have two options: denormalize a frequently read, rarely changed field (copying the customer name onto the order row, say), or push the result into a cache layer like Redis. As we cover in [Database Indexing Explained with Examples](/en/posts/database-indexing-explained), a large share of JOIN cost usually traces back to a missing foreign-key index — checking your indexes is generally a cheaper first step than reaching for denormalization.

| Fix | When it fits | Query count |
|---|---|---|
| Eager loading (JOIN) | Relations known up front, REST APIs | N+1 → 1 |
| Dataloader (batch) | GraphQL resolvers, field-by-field resolution | N+1 → 2 (list + batch) |
| Projection (only needed columns) | Reducing unnecessary data transfer on wide tables | Unchanged, but data volume shrinks |
| Denormalization | JOIN itself is expensive, reads far outnumber writes | 1, at the cost of data-consistency risk |
| Caching (Redis, etc.) | Same data read repeatedly | 0 on a cache hit |

## Regression testing: baking the query budget into the codebase

The most valuable work after a fix is guaranteeing it doesn't regress. A test that hits the endpoint and counts queries fired against an upper bound does exactly that:

```js
test('order list endpoint fires a bounded number of queries', async () => {
  const queryCountBefore = db.getQueryCount();
  await request(app).get('/orders?limit=200');
  const queryCount = db.getQueryCount() - queryCountBefore;

  expect(queryCount).toBeLessThanOrEqual(3); // list + batch customer + batch product
});
```

This test is a direct application of the "test the contract, not just the behavior" principle we argue for in [How to Write Unit Tests That Actually Help](/en/posts/how-to-write-unit-tests): query count is a performance contract, and that contract is enforced by an assertion, not a code-review comment someone might miss.

Honestly, the biggest lesson from this incident was that N+1 isn't the result of badly written code — it's the result of a "each row is an independent object" mental model. Each line looks correct in isolation; the problem only shows up at scale. As we touch on in [REST vs GraphQL](/en/posts/rest-vs-graphql), GraphQL's flexible field resolution amplifies this risk — a GraphQL API without dataloaders is practically an invitation to generate N+1. And as noted in our [Clean Code Principles checklist](/en/posts/clean-code-principles-checklist), separating data-access logic from business logic makes this whole class of bug easier to catch early.

For more engineering practices, browse the [Software Engineering category](/en/category/software-engineering).

## Frequently Asked Questions

### Does N+1 only happen in projects using an ORM?

No, but ORMs make it much easier to generate because they make lazy loading transparent. A team writing raw SQL can make the same mistake — firing a query inside a loop — but it's usually easier to spot because the query line is directly visible in the code.

### Should I always use eager loading, or a dataloader?

For REST APIs where relations are known up front, eager loading is simpler and sufficient. For field-by-field, flexible query systems like GraphQL, a dataloader is the more correct fix because you can't know at compile time which fields will actually be requested.

### Is eager loading always faster?

Usually, but there's an exception: eagerly loading a very wide relation every time — say, a customer's 10,000 orders — can mean transferring data that's never actually used. In that case, lazy loading combined with pagination, or a projection that fetches only needed fields, may be the better fit.

### How do I catch N+1 before it reaches production?

Running a query-budget test in CI is the most reliable method. Searching for ORM relation access inside a loop during code review (`order.customer`, `order.getCustomer()`) helps too, but human eyes can miss it — an automated assertion won't.
