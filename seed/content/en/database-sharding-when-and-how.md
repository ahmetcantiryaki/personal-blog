---
title: "When Do You Actually Need Database Sharding?"
slug: "database-sharding-when-and-how"
translationKey: "database-sharding-when-and-how"
locale: "en"
excerpt: "Short answer: shard when write throughput or table size outgrows vertical scaling and read replicas; cheaper fixes should always be exhausted first."
category: "software-engineering"
tags: ["databases", "postgresql", "system-design", "backend"]
publishedAt: "2026-11-09"
seoTitle: "When Do You Actually Need Database Sharding?"
seoDescription: "Short answer: shard when write throughput or table size outgrows vertical scaling and read replicas; cheaper fixes should always be exhausted first."
---

Short answer: start considering sharding once a single primary can't keep up with write throughput, table size pushes maintenance jobs into impractical timeframes, or the next step of vertical scaling costs more than the revenue it enables. Sharding should be a last resort — cheaper fixes like read replicas, partitioning, and connection pooling should be exhausted first, since sharding seriously complicates cross-shard queries and transactions.

## What signals mean you actually need to shard?

Three concrete signals: write throughput consistently hitting the disk I/O or CPU ceiling of a single primary, table size pushing maintenance tasks like index rebuilds or VACUUM into multi-hour jobs, and the next tier of vertical scaling (more RAM/CPU) costing more than the revenue growth it would support. If only one of these shows up, a cheaper fix usually solves it before sharding becomes necessary.

## What cheaper alternatives should you try before sharding?

For a read-heavy workload, read replicas take read traffic off the primary and free up write capacity. For connection limits, a pooler like PgBouncer handles thousands of concurrent requests without hitting the database's connection ceiling — our piece on [connection pooling with PgBouncer](/en/posts/postgres-connection-pooling-pgbouncer) covers this in depth. If you want to stay on one server and just split large tables, PostgreSQL's native declarative partitioning (RANGE, LIST, HASH) has existed since PG10, and there's no hard partition-count ceiling — the practical limit comes from planner and catalog overhead, not a fixed number. Our [database indexing guide](/en/posts/database-indexing-explained) also shows how much headroom index optimization can buy before you need any of this.

## How do you pick a shard key?

The shard key is the column you split your data on, and it's the single most consequential decision — get it wrong and you create a hotspot, where traffic piles onto one shard. In a multi-tenant SaaS, `tenant_id` is usually a good shard key because most queries target a single customer's data and avoid cross-shard joins. For time-series data, range sharding on `created_at` makes sense, but it carries a real risk: new data always lands on the newest shard, making that one shard "hot."

## What's the difference between range, hash, and directory sharding?

The table below compares the three core strategies:

| Strategy | How it works | Risk |
|---|---|---|
| Range sharding | Keys split into ranges (e.g., a date range) | The newest range can stay permanently "hot" |
| Hash sharding | Keys are hashed and modulo'd across shard count | Distribution is even, but range queries get harder |
| Directory sharding | A separate lookup table tracks which key lives on which shard | Flexible, but the lookup table can itself become a bottleneck |

## How do you handle cross-shard queries and transactions?

A query that joins data on one shard with data on another requires running multiple queries at the application layer and merging the results — the database won't do this for you. Getting ACID guarantees for a transaction that writes across multiple shards is genuinely hard; in practice, most systems stay within single-shard transactions wherever possible and handle cross-shard consistency with event-driven synchronization, such as an outbox pattern.

## What tools actually make sharding manageable?

Citus is a distributed-database extension built on top of PostgreSQL. Citus 14.0, released in 2026, added PostgreSQL 18 support and layers on top of — not instead of — native partitioning, so you don't have to abandon partitioning to adopt it. Vitess, used at YouTube's scale, shards MySQL/Postgres-compatible workloads through proxy-based routing, adding sharding without major changes to application code. Writing your own application-level sharding logic is also an option, but the ongoing maintenance burden is routinely underestimated.

```sql
-- Creating a distributed table with Citus
SELECT create_distributed_table('orders', 'tenant_id');
```

## How much does sharding actually change in your application code?

Sharding changes the application layer more than the database layer itself. You need a routing layer that decides which shard every query goes to — it takes the shard key (say, `tenant_id`), resolves which shard holds it through a hash function or a lookup table, and routes the query there. Most ORMs don't do this automatically; tools like Citus solve it at PostgreSQL's own query-planner level, while hand-rolled application-level sharding means every repository or DAO layer has to become shard-aware. Running a single shard in your test environment and only facing multiple shards in production is an easy way to miss this — that's why testing cross-shard queries against at least two shards in development matters.

## What's a concrete pitfall when moving to hash sharding?

When hash-sharding on `tenant_id`, changing the shard count (say, going from 4 shards to 8) changes the hash function's output and forces most of your existing data to be redistributed. The fix is a technique called consistent hashing: when the shard count changes, only a small fraction of the data moves instead of nearly all of it. Teams that don't plan for this upfront run into a rebalancing operation that slows production traffic for hours the first time they add a shard.

```text
Example: moving from 4 to 8 shards without consistent hashing
- Each key's shard = hash(key) % shard_count
- Changing the shard count changes the target shard for NEARLY EVERY key
- With consistent hashing, only about 1/8 of keys move to a new shard
```

## When and why do you need to rebalance?

Once one shard starts carrying far more data or traffic than the others — a hotspot — data needs to be redistributed across shards. This has to happen while live traffic keeps flowing, and it usually requires a dual-write or staged-migration strategy. Moving to hash sharding without planning for rebalancing means ignoring a cost you'll eventually have to pay anyway.

My honest take: most teams reach for sharding before trying the cheaper scaling steps covered in our [multi-region Postgres trade-offs piece](/en/posts/multi-region-postgres-options-and-trade-offs). Sharding is a hard-to-reverse architectural decision — once cross-shard query logic has spread through your application code, undoing it can cost more than moving forward ever would have.

## Frequently Asked Questions

### How many partitions can native PostgreSQL partitioning handle?

PostgreSQL's declarative partitioning doesn't impose a hard partition-count limit; the practical ceiling comes from planner and system-catalog overhead once partition counts get very high, not a documented fixed number. Thousands of partitions are theoretically possible, but should be validated with real performance testing.

### Is sharding the same thing as partitioning?

No. Partitioning splits a table into logical pieces within a single database server. Sharding distributes data across entirely separate database servers or nodes. Tools like Citus combine both, using partitioning within a distributed architecture.

### What happens if I pick the wrong shard key?

A bad shard key causes an uneven distribution of traffic or data — a hotspot — where one shard is overloaded while others sit idle. Fixing it requires redistributing all your data under a new shard key, which is why the shard-key decision deserves the most careful attention before you shard at all.

### Can I undo sharding and go back to a single server?

Technically yes, but it's expensive: you have to consolidate data from every shard back onto one server and unwind the cross-shard logic baked into your application code. That's exactly why testing range, hash, and directory options — and a rebalancing strategy — thoroughly before you shard matters: it's a decision you want to get right the first time.
