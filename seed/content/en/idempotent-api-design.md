---
title: "Idempotent APIs: Safe Retries by Design"
slug: "idempotent-api-design"
translationKey: "idempotency-api-design"
locale: "en"
excerpt: "A payment request timed out, the mobile app retried automatically, and the customer got charged twice. Here's how idempotency keys and UPSERT prevent that."
category: "software-engineering"
tags: ["api-design", "backend", "databases", "reliability", "best-practices"]
publishedAt: "2026-07-09"
seoTitle: "Idempotent API Design: Preventing Double Charges"
seoDescription: "A payment request timed out, the mobile app retried automatically, and the customer got charged twice. Here's how idempotency keys and UPSERT prevent that."
---

Last month we watched this happen in a payment flow: a client sent `POST /charges`, the server processed the charge successfully, but the response never made it back before the 3-second timeout fired. The mobile app read that as a failure and automatically retried the exact same request. The result: one customer, charged twice. These are the field notes from that incident — the concrete patterns that make POST requests safe to retry.

## What idempotency means, and why POST breaks it

An operation is idempotent if running it multiple times produces the same effect as running it once. `GET` and `PUT` are idempotent by nature — sending the same `PUT /users/5` ten times changes nothing after the first call. `POST /charges` is not idempotent by default: every call is a new record, a new charge, a new side effect. Network timeouts, mobile clients' built-in retry logic, and load balancers that occasionally forward a request twice all turn that into a silent double-write risk.

## The idempotency key pattern: client generates, server remembers

The standard fix is for the client to generate a unique **idempotency key** per logical operation and send it in a header (`Idempotency-Key: 8f14e45f-...`). The server executes the operation normally the first time it sees that key and stores the response — status code and body — alongside it. Any subsequent request carrying the same key skips re-execution and gets the stored response back directly.

```
POST /charges
Idempotency-Key: 8f14e45f-9c1a-4b2e-9f3d-2a7c8e1b6d90

{ "amount": 4999, "currency": "usd", "customer": "cus_123" }
```

The critical detail: only cache successful results, or errors that won't change on retry. Cache a transient 503 and the client stays locked into that stale error every time it genuinely needs to retry.

One more detail worth checking: the request body itself. If the same idempotency key arrives with a different body — say, a different amount — the server shouldn't silently return the old response; it should reject the mismatch with a `422 Unprocessable Entity` or similar conflict error. Storing a hash of the body alongside the key makes that check cheap to add.

## UPSERT vs. a failing insert

There are two database-level ways to guarantee this. First, put a unique constraint on `payment_intent_id` and let the insert fail on retry — the application layer catches the `UNIQUE VIOLATION` and returns the existing row instead. Second, use an `UPSERT` directly:

```sql
INSERT INTO charges (idempotency_key, customer_id, amount_cents, status)
VALUES ($1, $2, $3, 'succeeded')
ON CONFLICT (idempotency_key)
DO UPDATE SET status = EXCLUDED.status
RETURNING id, status;
```

The `ON CONFLICT DO UPDATE` pattern converges the operation to a single atomic row and stays safe under concurrency because the guarantee comes from the database's unique index, not application-level reasoning. Per [PostgreSQL's official documentation](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT), this is exactly the scenario `INSERT ... ON CONFLICT` was built for. `ON CONFLICT DO NOTHING` is also an option, but it only works if "do nothing on the second request" is genuinely sufficient — if you need the charge status to update, `DO UPDATE` is the correct behavior.

## Conditional updates and TTL

Idempotency key records shouldn't live forever. A common practice is a 24-hour TTL on keys, cleaned up after expiry — that keeps the table small while giving a reasonable window for assuming the client actually meant the same operation. Scoping keys by customer or account ID also matters: it prevents cross-contamination if two different customers happen to generate the same UUID, however unlikely.

Another pattern for conditional updates is attaching an `expected_version` or `expected_status` precondition to the request: the server rejects the update if current state doesn't match what's expected. This connects directly to the "when is a retry actually safe" question we cover in [Retries, Backoff, and Circuit Breakers](/en/posts/retries-backoff-circuit-breakers) — without idempotency, no amount of well-tuned backoff prevents a retry from duplicating side effects.

| Approach | Concurrency safety | When to use |
|---|---|---|
| Unique constraint + failing insert | High, DB-guaranteed | "Return the existing row" on retry is enough |
| `INSERT ... ON CONFLICT DO UPDATE` | High, atomic | State needs to update on retry |
| App-layer check only (SELECT then INSERT) | Low, race-condition risk | Not recommended |
| Conditional update (expected_version) | High | Multi-step state machines |

## Testing it: fire the same request twice

The most reliable way to verify idempotency is an integration test that sends the same request with the same key twice and asserts both the response and the row count stay identical:

```js
test('second request with the same idempotency key does not create a new charge', async () => {
  const key = crypto.randomUUID();
  const first = await postCharge({ amount: 4999 }, key);
  const second = await postCharge({ amount: 4999 }, key);

  expect(second.body.id).toBe(first.body.id);
  const rows = await db.query('SELECT count(*) FROM charges WHERE idempotency_key = $1', [key]);
  expect(rows[0].count).toBe('1');
});
```

Per [AWS's durable execution guide](https://docs.aws.amazon.com/durable-execution/patterns/best-practices/idempotency/), letting the database handle dedup is faster and more reliable than guessing at the application layer — the unique index is already a concurrency-safe source of truth.

The real lesson here, I think, is that adding an idempotency key header is the easy part. The hard part is answering "what fields are actually in scope for this key" up front — if the amount changes, is the same key still valid, or not? Teams that don't write that decision down explicitly hit a weird edge case in production six months later.

For the rest of your retry logic, see [Retries, Backoff, and Circuit Breakers](/en/posts/retries-backoff-circuit-breakers); for the rate-limiting side, see [Rate Limiting: Token Bucket vs Sliding Window](/en/posts/rate-limiting-token-bucket-vs-sliding-window). For API design tradeoffs more broadly, [REST vs GraphQL](/en/posts/rest-vs-graphql) is a related starting point. For more engineering practices, browse the [Software Engineering category](/en/category/software-engineering).

## Frequently Asked Questions

### Should I add an idempotency key to every endpoint?

No — only state-changing `POST` endpoints (payments, order creation, sending email) need one. `GET` is already idempotent, and `PUT`/`DELETE` are usually naturally idempotent; bolting an extra key system onto those adds complexity for no benefit.

### Is an idempotency key the same thing as rate limiting?

No. An idempotency key prevents the same request from being processed twice by accident; rate limiting caps how many requests a client can make in a given window. They usually work together but solve different problems.

### How long should I keep an idempotency key around?

Most payment systems use a 24-hour window, which covers a reasonable upper bound on client-side retry logic. Keeping it longer bloats the table; keeping it shorter raises the risk that a late retry creates a genuine duplicate.

### Is UPSERT always better than a failing insert?

No. `UPSERT` is the right call only if you need to update state after the first request — for example, a charge moving from "pending" to "succeeded." If nothing should change on the second request, `ON CONFLICT DO NOTHING`, or a failing insert that returns the existing row, is simpler and sufficient.
