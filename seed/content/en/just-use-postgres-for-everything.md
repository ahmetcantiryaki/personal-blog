---
title: "Just Use Postgres: Replace Redis, Kafka and More"
slug: "just-use-postgres-for-everything"
translationKey: "postgres-for-everything"
locale: "en"
excerpt: "Just use Postgres for everything: in July 2026 one instance absorbs caching, queues, full-text search and vectors, erasing the tax of seven systems."
category: "software-engineering"
tags: ["databases", "sql", "backend", "software-architecture", "cost-optimization"]
publishedAt: "2026-07-13"
seoTitle: "Just Use Postgres for Everything: One DB, Not Seven"
seoDescription: "Replace Redis, Kafka and Elasticsearch with one Postgres. UNLOGGED cache, SKIP LOCKED queues, pgvector and TimescaleDB cut the tax of seven systems."
---

Should you just use Postgres for everything? For most teams, yes. In July 2026 a mid-sized application does not need Redis, Kafka, Elasticsearch, and a separate vector database. A single Postgres instance can serve caching, queues, full-text search, and vector search under one roof — and the payoff is not license cost, it is the operational tax you stop paying.

## The hidden operational tax of seven databases

A typical "modern" architecture looks like this: Postgres for durable data, Redis for cache, Kafka for event streams, Elasticsearch for search, a vector database for similarity, InfluxDB for metrics, and a separate GIS layer for geospatial. Each choice is defensible on its own. The sum is a hidden tax.

The line items are concrete: seven backup-and-restore procedures, seven patch cadences, seven monitoring dashboards, and the dual-write code that keeps them consistent. The cruelest one is compound availability — chain three systems that each promise a 99.9% SLA and your combined availability drops to 99.7%. The more systems you stack, the harder that multiplication works against you.

Postgres changes this picture because it is now an extensible data platform, not just a relational store. Per the [Stack Overflow 2025 developer survey](https://survey.stackoverflow.co/2025/technology), Postgres is the most-used database, reached for by 55.6% of all developers and 58.2% of professional developers. That reach is not an accident: the extension architecture lets one engine absorb many specialized systems.

## UNLOGGED tables as a cache

What replaces Redis in most scenarios is the `UNLOGGED` table. A normal Postgres table writes every change to the write-ahead log (WAL), which buys crash durability but adds a per-write cost. `UNLOGGED` tables skip the WAL, so writes run at near-memory speed. The trade-off is explicit: if the server crashes, the table is truncated. For a cache, that is already acceptable behavior.

```sql
CREATE UNLOGGED TABLE cache_kv (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  expires_at timestamptz NOT NULL
);

CREATE INDEX ON cache_kv (expires_at);
```

A TTL sweep job clears expired keys. Picking the right index matters here — we walked through why in our [database indexing explainer](/en/posts/database-indexing-explained). Unless you genuinely need Redis's sub-millisecond latency, an `UNLOGGED` table means one fewer network hop and one fewer system to operate.

## Pub/sub with LISTEN/NOTIFY

For simple publish-subscribe flows, Postgres's built-in `LISTEN/NOTIFY` covers the need for a small message bus. One connection calls `NOTIFY channel, 'message'` and every listening connection receives it instantly. For webhook triggers, cache invalidation, or live dashboard updates, it works without standing up Kafka.

Know the limits up front: the `NOTIFY` payload must be under 8000 bytes, and messages are not persisted — a listener that is not connected at the moment simply misses them. If you need durable delivery, the next section has the answer.

## Job queues with SKIP LOCKED

Available since Postgres 9.5, `FOR UPDATE SKIP LOCKED` turns the database into a solid job queue. Multiple workers poll the same table; each worker skips rows that are already locked and grabs only an idle one. No contention, no double processing:

```sql
WITH job AS (
  SELECT id
  FROM   jobs
  WHERE  status = 'pending'
  ORDER  BY created_at
  FOR UPDATE SKIP LOCKED
  LIMIT  1
)
UPDATE jobs
SET    status = 'processing', started_at = now()
FROM   job
WHERE  jobs.id = job.id
RETURNING jobs.id, jobs.payload;
```

This pattern comfortably carries thousands of jobs per second, and unlike `LISTEN/NOTIFY` it is durable — if a worker dies, the job stays in the table. [Tiger Data's 2026 analysis](https://www.tigerdata.com/blog/its-2026-just-use-postgres), which is honest about where the model breaks, recommends the same approach for queues. At our own scale we have run this pattern over queues of tens of millions of rows without trouble; the bottleneck is usually worker logic, not Postgres.

## Full-text search and pgvector

Two capabilities make Elasticsearch unnecessary for most products. The first is Postgres's built-in full-text search: a `tsvector` column, a GIN index, and `to_tsquery` give you language-aware, ranked search inside the engine. Newer BM25-based extensions push this even closer to Elasticsearch.

The second is `pgvector`: it stores embeddings and runs approximate nearest-neighbor search with an HNSW index. You do not have to stand up a separate Pinecone for RAG or semantic search. In Tiger Data's `pgvectorscale` benchmark, Postgres reports up to 28x lower p95 latency than Pinecone at 50 million vectors. We compared the Postgres vector story against dedicated systems in our [vector database comparison](/en/posts/vector-database-comparison).

## Which system does it absorb, and up to what scale?

Postgres cannot imitate every specialized system forever. Here are the realistic thresholds:

| Specialized system | Postgres equivalent | Comfortable scale | Where it breaks |
|---|---|---|---|
| Redis (cache) | UNLOGGED table | ~50K req/s | Sub-ms latency, huge fan-out |
| Kafka (queue) | SKIP LOCKED | Thousands of jobs/s | Million+ events/s streaming |
| RabbitMQ (pub/sub) | LISTEN/NOTIFY | Moderate volume | Durable, multi-consumer delivery |
| Elasticsearch (search) | tsvector + GIN / BM25 | Millions of docs | Billion-scale log analytics |
| Pinecone (vectors) | pgvector + HNSW | ~50M vectors | Billion+ vectors, huge fan-out |
| InfluxDB (time-series) | TimescaleDB | Billions of rows | Petabyte-scale metrics |

TimescaleDB closes the time-series gap by adding time-partitioned hypertables on top of Postgres, scaling comfortably into billions of rows. The dividing line is always the same: unless you face extreme fan-out, petabyte volume, or a single-digit-millisecond latency mandate, Postgres is enough.

## One database in the age of AI agents

This debate took on a new dimension in 2026. Handing an AI agent seven separate data systems means teaching it seven schemas, seven query languages, and seven failure modes. The odds that the agent reaches for the wrong system on any given tool call go up. A single Postgres gives the agent one mental model: everything is SQL, everything shares a transaction boundary.

Here is my opinionated take: for most teams, the "reach for Redis, reach for Kafka" reflex is premature optimization in 2026. Starting with Postgres and adding a specialized system only when measurement forces you to is almost always cheaper and less brittle than the reverse. When you do need to evolve the schema without downtime, we covered the playbook in our [zero-downtime schema migrations guide](/en/posts/zero-downtime-schema-migrations).

## The honest limits

Postgres is not everything. For petabyte-scale log analytics, columnar engines like ClickHouse are still far ahead. In genuine event-streaming scenarios — millions of events per second fanned out to hundreds of consumers — it cannot replace Kafka. On hot paths that mandate sub-millisecond p99 latency, Redis's in-memory model is faster.

There is also the connection-scaling problem: bind thousands of concurrent clients to one Postgres and a connection pooler becomes mandatory — we explained why and how in our [PgBouncer connection pooling guide](/en/posts/postgres-connection-pooling-pgbouncer). But these are the exceptions, not the rule. For most teams, the operational simplicity of collapsing read and write paths into one engine is worth far more than those edge cases. You will find the sharpest defense of this stance in [amazingcto's "Postgres for everything"](https://www.amazingcto.com/postgres-for-everything/).

## Frequently Asked Questions

### Does Postgres really replace Redis?

For most caching scenarios, yes. `UNLOGGED` tables skip the WAL, so they approach memory speed, and a TTL job clears expired keys. Only on hot paths that demand sub-millisecond latency or very high fan-out does Redis's in-memory model still pull ahead.

### Is SKIP LOCKED safe as a production-scale job queue?

Yes. `FOR UPDATE SKIP LOCKED` has been in Postgres since 9.5 and lets workers skip locked rows to grab only an idle one, so there is no contention or double processing. It carries thousands of jobs per second and is durable. Only at million-plus events per second should you move to Kafka.

### When should I still add a specialized system?

When measurement forces you to. Petabyte log analytics, millions of events per second fanned out widely, or a mandated single-digit-millisecond p99 latency all sit outside Postgres's comfort zone. Adding a specialized system before you hit those thresholds is usually premature optimization.

### Does pgvector replace a dedicated vector database?

At moderate scale, it does. `pgvector` with an HNSW index gives production-ready performance up to roughly 50 million vectors for RAG and semantic search, and your embeddings stay in the same transaction boundary as your relational data. For more, see our [software engineering category](/en/category/software-engineering).
