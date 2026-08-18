---
title: "Event-Driven Architecture: Patterns and Pitfalls"
slug: "event-driven-architecture-patterns"
translationKey: "event-driven-architecture-patterns"
locale: "en"
excerpt: "Pub/sub, streaming, and queues solve different problems, exactly-once delivery is a myth, and event sourcing is overkill for most CRUD services."
category: "software-engineering"
tags: ["software-architecture", "system-design", "microservices", "backend"]
publishedAt: "2026-08-18"
seoTitle: "Event-Driven Architecture: Patterns and Pitfalls"
seoDescription: "A data-led guide to pub/sub vs streaming vs queues, exactly-once delivery, schema versioning, and CQRS, plus a decision table for picking the right pattern."
---

Short answer: pick a queue for point-to-point work distribution, pub/sub for fan-out notifications, a log-based streaming platform (Kafka, Kinesis) when you need replay across multiple consumer groups, and event sourcing only when the audit trail itself is the product. Most teams reach for Kafka when a queue would have been simpler and cheaper.

## Pub/Sub, Event Streaming, or a Queue — What's the Real Difference?

The real difference is what happens to a message after it's read. A queue (SQS, RabbitMQ) deletes or hides a message once a consumer acknowledges it, so only one consumer gets each message. A pub/sub system (SNS, Redis Pub/Sub) fans a message out to every current subscriber but keeps no history. A streaming platform (Kafka, Kinesis) appends messages to a durable, ordered log that multiple consumer groups read independently and can replay from an earlier offset.

That log is the feature that changes your architecture options. Apache Kafka retains messages for a configurable window — seven days by default, often set to 30 days or longer, or indefinitely with log compaction. Amazon Kinesis defaults to 24 hours of retention, extendable up to 365 days at extra cost. A classic queue or pub/sub system is not a source of truth: once it's delivered, it's gone.

| Property | Queue (SQS, RabbitMQ) | Pub/Sub (SNS, Redis) | Streaming (Kafka, Kinesis) |
|---|---|---|---|
| Delivery target | One consumer per message | Every current subscriber | Every consumer group, independently |
| Replay past events | No | No | Yes, within retention window |
| Ordering guarantee | Best-effort, or FIFO queues only | None guaranteed | Per-partition/shard ordering |
| Typical retention | Minutes to 14 days (SQS max) | None (fire-and-forget) | Days to indefinite (compacted) |
| Good fit | Task distribution, load leveling | Live notifications, cache invalidation | Audit trails, analytics, multi-team consumption |

A pub/sub message nobody was listening for is simply lost; a stream lets a second team start from history months later.

## Event Notification, State Transfer, or Event Sourcing — Which One Do I Need?

Pick based on how much data the consumer needs and how much coupling you'll accept. [Martin Fowler's write-up on event-driven patterns](https://martinfowler.com/articles/201701-event-driven.html) lays out three flavors, and the boundary between them is about payload size and coupling, not technology choice.

- **Event notification** — a thin event ("OrderShipped", order ID only) that forces consumers to call back for details. Low coupling, but chatty under load.
- **Event-carried state transfer** — the event carries the full payload, so consumers keep a local, eventually consistent copy and never call back. More duplication, far fewer synchronous calls.
- **Event sourcing** — the event log *is* the system of record; current state is derived by replaying every event for an entity, not stored as a mutable row.

Event-carried state transfer is the workhorse for most microservice integrations, since it removes the runtime dependency that event notification still has. Event sourcing is a bigger commitment: you're rebuilding persistence around an append-only log, and that's hard to walk back once ten services depend on the schema.

## Is "Exactly-Once" Delivery Actually Real?

No — not across a network boundary. What vendors call "exactly-once semantics" is at-least-once delivery plus deduplication that makes the *effect* look like exactly once. [Confluent's documentation](https://docs.confluent.io/kafka/design/delivery-semantics.html) is explicit about this: Kafka's exactly-once guarantee covers the write path — idempotent producers plus transactions across partitions — not arbitrary side effects a consumer performs after reading a message.

Kafka's idempotent producer, available since version 0.11, assigns each producer a sequence number per partition; the broker rejects a write unless the number is exactly one greater than the last committed one. That kills duplicate writes from producer retries. It does not stop a consumer that crashes after processing a message but before committing its offset — that consumer reprocesses the message on restart, full stop.

The practical fix is idempotent handling: make processing the same event twice produce the same end state, typically with a dedup table keyed by event ID, checked in the same transaction as the business write:

```sql
CREATE TABLE processed_events (
  event_id UUID PRIMARY KEY,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- inside the consumer's transaction:
INSERT INTO processed_events (event_id) VALUES ($1)
ON CONFLICT (event_id) DO NOTHING;
-- if 0 rows affected, skip the business logic; the event was already applied
```

This is the same discipline as [idempotent API design](/en/posts/idempotent-api-design) — the retry-safety problem is identical whether the trigger is an HTTP client or a consumer rebalance. Pair it with the [retry, backoff, and circuit breaker patterns](/en/posts/retries-backoff-circuit-breakers) you'd already use for any unreliable call.

On the publishing side, the equivalent problem is the dual-write: updating your database and publishing an event are separate operations, and a crash between them loses the event or sends one for a write that never committed. The transactional outbox pattern fixes this by writing the event to an outbox table inside the same transaction as the business change, then letting a relay process publish from it — one tool worth knowing, not the subject here.

## How Do I Version Event Schemas Without Breaking Consumers?

Treat every event schema as a public API, because that's what it is the moment a second team subscribes. The rule that avoids most breakage: only add optional fields, never remove or repurpose an existing one, and never change a field's type in place.

```json
{
  "eventType": "order.shipped",
  "eventVersion": 2,
  "orderId": "ord_8f21a9",
  "carrier": "ups",
  "trackingUrl": "https://example.com/track/8f21a9"
}
```

Version 2 added `trackingUrl` as a new optional field — old consumers that don't know about it simply ignore it. A schema registry (Confluent Schema Registry, AWS Glue Schema Registry) enforces this at write time, rejecting non-backward-compatible producer changes under Avro or Protobuf rules before they reach a consumer.

## When Do CQRS Boundaries Actually Matter?

CQRS (Command Query Responsibility Segregation) means separate models, sometimes separate databases, for writes and reads. It matters when reads look nothing like writes — a normalized order table for writing, but a read side needing a denormalized "order history with shipping status" view built from three services. Event-carried state transfer keeps that read model in sync without cross-service queries at request time.

It does not matter for a typical CRUD resource where one table serves both fine. A separate read store, a projection pipeline, and eventual-consistency handling for a settings page is complexity tax with no payoff.

## When Should I Not Go Event-Driven?

Skip it when your workflow needs a synchronous answer, your team has fewer than roughly ten engineers on a handful of services, or a single database transaction already gives you the consistency you need. Event-driven systems trade immediate consistency and simple stack traces for loose coupling and scale — a trade that only pays off once that coupling is actually costing you something.

My honest take: event sourcing gets reached for as the "modern" default on services that are, underneath, a CRUD app with a timeline feature bolted on. If the real requirement is "show a history of changes," an audit-log table with triggers gets 90% of the value without the replay tooling, snapshotting, and schema-migration machinery a real event-sourced aggregate demands. Save event sourcing for domains where the history *is* the business value — ledgers, order lifecycles, compliance trails — not admin panels.

## Decision Guide: Which Pattern Should I Use?

| If you need... | Use |
|---|---|
| One worker picks up each job, at-least-once, simple retry | Queue (SQS, RabbitMQ) |
| Fan out a live event to whoever's currently listening, no history needed | Pub/sub (SNS, Redis Pub/Sub) |
| Multiple teams consuming the same events independently, with replay | Streaming platform (Kafka, Kinesis) |
| Services to stay in sync without synchronous calls | Event-carried state transfer over streaming |
| The change history itself is the core business asset | Event sourcing |
| Read and write models are shaped completely differently | CQRS, usually paired with event-carried state transfer |
| A team under ~10 engineers, one database, synchronous needs | Skip event-driven — a direct call or DB transaction is simpler |

Choosing between Kafka and a simpler queue for a [microservices vs. monolith](/en/posts/microservices-vs-monolith) decision? Default to the queue, and add streaming once a second consumer group actually needs the same events — removing Kafka after five services depend on its retention window is much harder.

## Frequently Asked Questions

### Is Kafka a message queue?

Not really — Kafka is a distributed commit log, not a queue. Messages aren't removed after a consumer reads them; they stay until the retention window expires (commonly 7–30 days) or compaction replaces them, letting independent consumer groups replay the same topic from different points.

### What does idempotent event handling mean in practice?

It means processing the same event twice gives the same result as processing it once, usually enforced with a dedup table or idempotency key in the same transaction as the write. It matters because at-least-once delivery guarantees every consumer eventually sees duplicates, from retries, restarts, or rebalances.

### Do I need a schema registry for event-driven architecture?

You need one once more than one team publishes or consumes the same event type, since it rejects backward-incompatible changes at write time instead of breaking a consumer weeks later. For a single-team setup, a versioned schema checked in code review is usually enough.

### Is event sourcing the same as CQRS?

No — independent decisions often combined. Event sourcing is about how you store state, as a replayable log rather than mutable rows. CQRS is about splitting read and write models. You can do CQRS on one database, or event-source a system with one combined model, though the two do pair naturally.
