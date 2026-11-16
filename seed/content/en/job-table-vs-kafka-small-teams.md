---
title: "Do You Need Kafka, or a Job Table?"
slug: "job-table-vs-kafka-small-teams"
translationKey: "job-queue-vs-kafka-small-teams-2026"
locale: "en"
excerpt: "Short answer: most teams don't need Kafka. A Postgres job table using FOR UPDATE SKIP LOCKED handles concurrent processing until you need fan-out or replay."
category: "software-engineering"
tags: ["postgresql", "system-design", "backend", "databases"]
publishedAt: "2026-11-16"
seoTitle: "Kafka or a Job Table? A Decision Guide"
seoDescription: "A Postgres job table with FOR UPDATE SKIP LOCKED is enough for most teams before Kafka. Here's when you actually need a broker, and when you don't."
---

Short answer: no, most teams don't need Kafka. A simple "jobs" table in Postgres using `FOR UPDATE SKIP LOCKED` gives you safe concurrent dequeue, retries, and ordering guarantees using the database you already run. You genuinely need Kafka only once you require fan-out to multiple independent consumers, replay of historical events, or sustained throughput beyond what a single Postgres instance can handle.

## What does a job table actually give you?

A "jobs" table stores pending work as rows, each with a status (`pending`, `processing`, `done`, `failed`), an attempt counter, and a lock timestamp. Workers pull rows with `SELECT ... FOR UPDATE SKIP LOCKED`: once a worker locks a row, other workers skip it and move to the next free row instead of blocking behind it. That's real concurrent, safe dequeuing without standing up a separate message broker.

```sql
CREATE TABLE jobs (
  id BIGSERIAL PRIMARY KEY,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INT NOT NULL DEFAULT 0,
  run_after TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_jobs_claimable ON jobs (run_after)
  WHERE status = 'pending';

-- Dequeue query each worker loop runs
WITH claimed AS (
  SELECT id FROM jobs
  WHERE status = 'pending' AND run_after <= now()
  ORDER BY run_after
  LIMIT 1
  FOR UPDATE SKIP LOCKED
)
UPDATE jobs SET status = 'processing', attempts = attempts + 1
WHERE id IN (SELECT id FROM claimed)
RETURNING id, payload;
```

The partial index (`WHERE status = 'pending'`) matters: without it, the dequeue query scans the whole table as it grows into millions of completed rows. The most common pitfall in this pattern is forgetting that index and watching dequeue latency climb months later.

## How do you build safe retries and a dead-letter path?

When a job fails, bump the `attempts` column and push `run_after` forward with exponential backoff — 10 seconds for the first retry, 40 seconds for the second, a few minutes for the third. Once `attempts` crosses a threshold (say, 5), move the row to `failed` and copy it into a separate `dead_letter_jobs` table so a broken job can't clog the main queue and you have a dedicated place to debug it. These three columns — status, attempt count, next-run time — pair naturally with the same principle covered in [idempotent API design](/en/posts/idempotent-api-design): give each job a unique key so re-running it never corrupts data.

## How many jobs per second can a job table actually handle?

Practitioner benchmarks published as of November 2026 disagree sharply: one test on PostgreSQL 16 with 8 workers measured roughly 12,000 jobs/sec with SKIP LOCKED versus about 25,000 for RabbitMQ and 100,000+ for Kafka, while another measured only about 850 jobs/min on Postgres against 920 for Redis-backed BullMQ. The gap comes down to hardware, batch size, and workload shape, so there's no single authoritative number. For small-to-medium teams, a realistic expectation is comfortably handling thousands of jobs per second — taking on Kafka's complexity before you're anywhere near that ceiling is usually premature optimization.

## When do you actually need Kafka?

Kafka earns its complexity in three situations: multiple independent services need to consume the same event for different purposes (fan-out), you need to replay historical events — for example, to backfill a brand-new analytics service — or you're sustaining tens of thousands of messages per second, a level a single Postgres instance can't absorb. All three are real requirements. The problem is most teams adopt Kafka for "future scale" long before hitting any of them.

## What does running Kafka actually cost you operationally?

Running Kafka in production means planning partition counts correctly, managing the pauses that consumer group rebalancing causes, and monitoring the brokers themselves — even on KRaft mode, which removed the separate ZooKeeper dependency. That's a meaningfully bigger operational load than a database quietly running in the background; keeping it healthy usually needs at least a part-time platform engineer. Looking at the pitfalls covered in [event-driven architecture patterns](/en/posts/event-driven-architecture-patterns), a lot of that complexity gets taken on for the appearance of scalability, not an actual fan-out requirement.

| Criterion | Job table (Postgres) | RabbitMQ | Kafka |
|---|---|---|---|
| Setup cost | Existing database, no new service | Separate broker | Broker + partition + rebalancing management |
| Ordering guarantee | Per-row, simple | Per-queue | Per-partition |
| Fan-out (multiple consumers) | Weak, built by hand | Moderate | Built-in, strong |
| Event replay | None (gone once the row is deleted) | Limited | Full replay up to retention window |
| Realistic single-node throughput | Thousands of jobs/sec | Tens of thousands of messages/sec | Hundreds of thousands of messages/sec |
| Operational expertise required | Existing SQL knowledge is enough | Moderate | Partition and rebalancing expertise |

## Which tool fits which requirement?

This checklist maps a concrete requirement directly to the simplest tool that satisfies it:

- **Single service, single consumer, moderate volume** → A job table is enough; don't add a dependency.
- **Multiple independent services need the same event** → Kafka's or RabbitMQ's topic/exchange model is genuinely needed.
- **You need to replay historical events** → Kafka's retention solves this; simulating it by hand in Postgres gets messy fast.
- **You're sustaining tens of thousands of messages per second** → A single Postgres instance strains here; moving to a broker is a real need.
- **None of the above, but you're building for "future growth"** → That's a decision that looks good on a resume and costs you in maintenance; start with a job table and let real usage data change your mind.

My honest take: most "we scaled on Kafka" blog posts are written by companies with the engineering headcount to run it — you're probably not that company, and [just using Postgres for everything](/en/posts/just-use-postgres-for-everything) shows exactly where that line sits.

## Frequently Asked Questions

### Is it safe to use Postgres as a job queue?

Short answer: yes. A job table built with `FOR UPDATE SKIP LOCKED` prevents concurrent workers from processing the same row twice, and with a partial index in place it holds up safely at thousands of jobs per second. The real risk is letting completed rows pile up, which grows the table and increases autovacuum pressure — archiving old rows on a schedule fixes that.

### What happens if you use FOR UPDATE without SKIP LOCKED?

Without `SKIP LOCKED`, a worker that hits a row another worker already locked waits for that lock to release, which serializes workers behind each other. Adding `SKIP LOCKED` makes the worker skip the locked row and grab the next free one instead, giving you real concurrency.

### When should I migrate from Postgres to Kafka?

Short answer: migrate when you hit a concrete signal — multiple independent services need to consume the same data, you need to replay historical events, or your metrics show the dequeue query is the actual bottleneck on a single Postgres instance. Without one of those signals, the migration is premature complexity, not a real fix.

### Is RabbitMQ a good middle ground between Postgres and Kafka?

Short answer: yes, for teams that need fan-out but not replay. RabbitMQ's exchange/queue model delivers fan-out with less operational overhead than Kafka, but its event retention isn't built for replay the way Kafka's is — if you only need the former, RabbitMQ is usually the lighter choice.

**Sources:** [PostgreSQL SKIP LOCKED job queue pattern](https://kindatechnical.com/postgresql/postgresql-as-a-job-queue-skip-locked-pattern.html), [Replacing your message queue with PostgreSQL LISTEN/NOTIFY and SKIP LOCKED](https://dev.to/software_mvp-factory/replacing-your-message-queue-with-postgresql-listennotify-skip-locked-queues-and-when-kafka-is-khb).
