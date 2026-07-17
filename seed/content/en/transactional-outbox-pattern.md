---
title: "The Transactional Outbox Pattern"
slug: "transactional-outbox-pattern"
translationKey: "transactional-outbox-pattern"
locale: "en"
excerpt: "A payment got recorded but its event never published — the classic dual-write failure. Here's how the outbox pattern prevents it, with a Debezium CDC relay."
category: "software-engineering"
tags: ["microservices", "system-design", "reliability", "best-practices"]
publishedAt: "2026-07-17"
seoTitle: "Transactional Outbox Pattern: Publish Events Atomically"
seoDescription: "The dual-write problem explained, why an outbox table fixes it, how to wire a log-based CDC relay with Debezium, and why idempotent consumers are required."
---

A payment service wrote the row to `payments`, the commit succeeded — but the second call, the one publishing "payment completed" to Kafka, never landed because of a network blip. The database held the correct data; the billing service never learned the payment happened. Nobody saw an error, because the first write succeeded. The gap surfaced days later, quietly, as "why hasn't this customer been invoiced."

## The Dual-Write Problem: You Can't Atomically Update Two Systems

Whenever you need to write to a database and publish to a message broker (Kafka, RabbitMQ, SQS) at the same time, there's no built-in mechanism that makes those two operations one atomic unit. Four outcomes are possible: both succeed (the happy path), the database write succeeds but the publish fails (a lost event — the scenario above), the publish succeeds but the database write fails (an event for a record that doesn't exist), or both fail. Distributed two-phase commit (2PC) solves this in theory, but most message brokers don't support 2PC, and even where it's available, the performance cost and operational complexity make it a non-starter for most teams.

## The Fix: Write the Event to a Table, in the Same Transaction

The outbox pattern's solution rests on one simple observation: writing to a single database within a single transaction is already atomic. So instead of publishing directly to the message broker, write the event to an `outbox` table in your own database, **in the same transaction** as the business data change.

```sql
CREATE TABLE outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);
```

```sql
BEGIN;

INSERT INTO payments (id, order_id, amount, status)
VALUES ('pay_8f2a', 'ord_4471', 4999, 'completed');

INSERT INTO outbox (aggregate_type, aggregate_id, event_type, payload)
VALUES ('payment', 'pay_8f2a', 'PaymentCompleted',
        '{"orderId":"ord_4471","amount":4999}'::jsonb);

COMMIT;
```

Because both `INSERT`s live in the same transaction, they either both succeed or both roll back — the dual-write scenario becomes structurally impossible. What's left is a single, narrower problem: getting the rows out of the outbox table and onto the actual message broker.

## The Relay: Polling vs Log-Based CDC

**Polling relay** is the simplest approach: a separate process queries the `outbox` table on an interval, picks up unpublished rows, sends them to the broker, and marks `published_at`. It's easy to set up, but it carries two costs: latency bounded by your polling interval, and continuous extra load on the database from repeated queries.

**Log-based CDC (Change Data Capture)** instead reads the database's own write-ahead log (WAL) to capture each `INSERT` into the outbox table almost instantly, without adding extra query load. Debezium is the de facto standard here: it ships production CDC connectors for Postgres, MySQL, SQL Server, and MongoDB, plus a purpose-built "outbox event router" transformation that routes outbox rows directly onto a Kafka topic.

| Criterion | Polling relay | Log-based CDC (Debezium) |
|---|---|---|
| Latency | Bounded by poll interval (seconds) | Near-instant (reads from the WAL) |
| Database load | Adds continuous query traffic | Reads the WAL, no extra query load |
| Setup complexity | Low — a simple cron/worker | Moderate — Kafka Connect + a Debezium connector |
| Scale | Fine for low/moderate volume | Preferred for high-volume event streams |

For a small system, a polling relay is often more than enough. As event volume grows, or latency becomes business-critical, moving to log-based CDC is the natural next step.

## Idempotent Consumers: The Cost of At-Least-Once Delivery

The outbox pattern guarantees at-least-once delivery, not exactly-once — if the relay crashes after publishing an event but before marking `published_at`, that same event gets republished. That forces a design requirement on the consumer side: every consumer has to be written idempotently, so processing the same event twice produces the same result as processing it once.

```javascript
async function handlePaymentCompleted(event) {
  const alreadyProcessed = await db.query(
    'SELECT 1 FROM processed_events WHERE event_id = $1',
    [event.id]
  );
  if (alreadyProcessed.rowCount > 0) return; // already handled, exit quietly

  await db.transaction(async (tx) => {
    await tx.query('UPDATE invoices SET status = $1 WHERE order_id = $2',
      ['paid', event.payload.orderId]);
    await tx.query('INSERT INTO processed_events (event_id) VALUES ($1)',
      [event.id]);
  });
}
```

Tracking the event's own `id` in a "processed" table and checking it before handling is the most common idempotency pattern — as long as the check and the update happen in the same transaction, the double-processing risk disappears.

## Relay Checklist

The details teams most often miss when standing up an outbox: an archival job that regularly cleans out published rows so the outbox table doesn't grow unbounded; an offset/checkpoint mechanism so the relay knows where to resume after a crash; and team-wide agreement that consumer idempotency is a required part of the pattern, not a nice-to-have. Skip any of the three, and the outbox table grows without bound, a restarted relay republishes events from the beginning, and non-idempotent consumers corrupt data.

The outbox pattern is usually paired with retry and circuit-breaker logic on the relay side — our [retries, backoff, and circuit breakers guide](/en/posts/retries-backoff-circuit-breakers) covers exactly that layer. We detailed how to design idempotency end-to-end in your APIs in [idempotent API design](/en/posts/idempotent-api-design). And if you're weighing whether you need this level of event-driven infrastructure at all, [microservices vs monolith](/en/posts/microservices-vs-monolith) gives useful context on when the pattern actually earns its complexity.

## How It Relates to the Saga Pattern

The outbox pattern is often confused with the saga pattern, but they solve different problems. Sagas coordinate a distributed workflow across multiple services — order → payment → inventory → shipping — using compensating transactions to undo earlier steps when a later one fails. The outbox pattern only solves the atomicity gap between one service's own database write and its event publish. In practice they're used together: each step of a saga relies on the outbox pattern to reliably publish the event that triggers the next step. Building a saga without an outbox pushes the risk of a silently unpublished event into the saga's compensation logic — which makes debugging "why is this order stuck" failures much harder at the saga level.

## When Not to Reach for an Outbox

Not every event publish needs this pattern. If you're notifying an in-process event emitter within a single monolithic application, you're already inside the same transaction and memory space — the dual-write problem the outbox solves doesn't exist there. The pattern earns its keep specifically when the event needs to reach a **separate process or service**, and losing that event is unacceptable from a business standpoint: payment confirmations, order status changes, inventory updates. For low-stakes notifications where a lost event doesn't matter much — an analytics event, say — carrying the outbox's operational overhead (an extra table, a relay, a cleanup job) is usually not worth it.

## Frequently Asked Questions

### Does the outbox pattern guarantee exactly-once delivery?

No, it guarantees at-least-once delivery. The same event can rarely be published twice, which is why idempotent processing on the consumer side is mandatory, not optional.

### When is a polling relay enough, and when should I move to CDC?

Polling is fine when event volume is low and latency in the range of seconds is acceptable. Once volume grows or latency becomes business-critical (payments, inventory), log-based CDC is the right move.

### Which databases does Debezium support?

Production-ready CDC connectors for Postgres, MySQL, SQL Server, and MongoDB, plus a dedicated event router transformation that routes outbox-table rows directly onto a Kafka topic.

### Why does the outbox table need regular cleanup?

If published rows stay in the table indefinitely, it grows without bound, index performance degrades, and CDC's WAL-reading cost increases. A separate cleanup job that archives or deletes confirmed-published rows is required.
