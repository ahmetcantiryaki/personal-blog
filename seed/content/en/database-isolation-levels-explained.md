---
title: "Database Isolation Levels, Explained"
slug: "database-isolation-levels-explained"
translationKey: "transaction-isolation-levels"
locale: "en"
excerpt: "Which isolation level do you actually need? We break down the four read anomalies, the four SQL levels, and why Postgres's default surprises most developers."
category: "software-engineering"
tags: ["databases", "postgresql", "sql", "reliability"]
publishedAt: "2026-07-17"
seoTitle: "Database Isolation Levels: Which One Do You Need?"
seoDescription: "Dirty reads, non-repeatable reads, phantom reads, and lost updates, mapped to the four SQL isolation levels — plus how Postgres's MVCC model changes the rules."
---

Which isolation level do you actually need? Most teams never ask, and just run whatever the database defaults to — which in Postgres's case is Read Committed, a level weaker than most developers assume. The right answer depends entirely on which concurrency anomalies your application can tolerate. This is a map of the four anomalies, the four standard levels, and how MVCC actually enforces them.

## The Four Read Anomalies

Isolation levels define how much of another concurrent transaction's data your transaction can see. The SQL standard names four anomalies:

**Dirty read**: A transaction reads data written by another transaction that hasn't committed yet — data that could still be rolled back and never actually happened. The most dangerous anomaly on the list.

**Non-repeatable read**: Reading the same row twice within one transaction returns different values because another transaction committed an update in between.

**Phantom read**: Running the same filtered query twice within one transaction returns a different set of rows because another transaction committed an insert or delete in between — the row-count version of a non-repeatable read.

**Lost update**: Two transactions read and update the same row concurrently, and the second write silently overwrites the first one's result. No error is thrown; the data is simply gone.

## The Four SQL Isolation Levels

The SQL standard defines four levels against these anomalies, from loosest to strictest:

| Level | Dirty read | Non-repeatable read | Phantom read | Lost update |
|---|---|---|---|---|
| Read Uncommitted | Possible | Possible | Possible | Possible |
| Read Committed | Prevented | Possible | Possible | Possible |
| Repeatable Read | Prevented | Prevented | Permitted by the standard | Permitted by the standard |
| Serializable | Prevented | Prevented | Prevented | Prevented |

This table is the standard's *minimum* guarantee — every engine has to meet it, but is free to be stricter. And this is exactly where Postgres diverges.

## Postgres's Surprise: Repeatable Read Is Actually Snapshot Isolation

Postgres doesn't implement Read Uncommitted as a distinct behavior — requesting it silently falls back to Read Committed, so there are effectively three levels in practice. The real surprise is Repeatable Read: even though the standard permits both phantom reads and lost updates at this level, Postgres's implementation uses a technique the academic literature calls Snapshot Isolation, and it blocks both. When two Repeatable Read transactions try to concurrently update the same row, the first to commit wins and the second is rolled back with `could not serialize access due to concurrent update` instead of silently overwriting — so the stronger guarantee comes with a requirement to catch that error and retry.

MySQL (InnoDB) also defaults to Repeatable Read and blocks most phantom scenarios in a similar way — but the two engines implement it differently under the hood, so sharing a name doesn't mean identical behavior. The load-bearing fact here: **Postgres's actual default is Read Committed**, meaning every individual query takes its own fresh snapshot, and different queries within the same transaction can see different committed states. Most teams write code assuming stronger isolation than they're actually running.

## MVCC: The Cost of Lock-Free Reads

Postgres's Multiversion Concurrency Control (MVCC) model means reads never block writes — every transaction sees a consistent snapshot of the data as of when it started, unaffected by other transactions' uncommitted changes. That's a major win for read-heavy workloads, but it has a cost: at Serializable, once the database detects that two transactions have conflicted, it **aborts** one of them with a `serialization_failure` error and expects the application to retry.

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE;

SELECT balance FROM accounts WHERE id = 42;
-- application logic: check balance, then deduct
UPDATE accounts SET balance = balance - 100 WHERE id = 42;

COMMIT;
-- on conflict: ERROR: could not serialize access due to concurrent update
```

Catching this error and retrying isn't optional — it's a required part of using Serializable. Choosing this level without retry logic means transactions that randomly fail in production for no obvious reason.

```javascript
async function withSerializableRetry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await db.transaction('SERIALIZABLE', fn);
    } catch (err) {
      if (err.code === '40001' && attempt < maxAttempts) {
        await sleep(50 * attempt); // short, increasing backoff
        continue;
      }
      throw err;
    }
  }
}
```

## Which Level to Pick, and When

The practical rule is simple: Read Committed handles the majority of single-row read/write operations fine, and leaving it as the default is usually correct. Move to Repeatable Read when multiple queries within the same transaction need a consistent snapshot — a report that shouldn't see its own subtotals shift mid-calculation, for instance. Serializable and retry logic become mandatory when a read-then-write flow — "check balance, then deduct" — must be fully protected against race conditions, which is exactly the shape of financial and inventory operations. Every step up is a consistency/performance tradeoff: applying Serializable everywhere means unnecessary retry traffic and added latency for operations that never needed the guarantee.

Even with the right isolation level, slow queries are usually an indexing problem — our [database indexing guide](/en/posts/database-indexing-explained) covers that separately. If you're rolling out schema changes in production, [zero-downtime schema migrations](/en/posts/zero-downtime-schema-migrations) covers how isolation behavior interacts with in-flight migrations. And if you're pooling connections, [Postgres connection pooling with PgBouncer](/en/posts/postgres-connection-pooling-pgbouncer) explains how transaction-mode pooling changes your isolation assumptions.

## Explicit Locking Instead of a Stronger Isolation Level

Serializable's retry requirement is more complexity than some teams want to take on — the alternative is staying on Read Committed and explicitly locking the specific rows that matter. `SELECT ... FOR UPDATE` locks the row you read until your transaction ends; if another transaction tries to update that same row, it blocks until yours commits or rolls back.

```sql
BEGIN;

SELECT balance FROM accounts WHERE id = 42 FOR UPDATE;
-- a concurrent transaction updating this row now blocks here
UPDATE accounts SET balance = balance - 100 WHERE id = 42;

COMMIT;
```

The difference from Serializable: instead of throwing an error and forcing a retry, this forces conflicting transactions to queue and wait — no retry logic required, though under high concurrency, queued transactions can pile up and introduce deadlock risk. When you already know exactly which rows need protecting (a single account balance, say), this is often a more predictable choice than reaching for Serializable.

## A Concrete Scenario: Why This Distinction Matters

Picture an inventory system where two requests concurrently read and decrement the same product's stock count: both read "stock: 5," both write "stock: 4" — but if both orders were actually fulfilled, stock should have dropped to 3. Under Read Committed, this happens silently with no error at all, because each query takes its own snapshot and is unaware of the other transaction's uncommitted change. Run the same scenario under Postgres's Repeatable Read or Serializable, and the second transaction gets rolled back with a serialization error, forcing the application to retry and read the updated stock value (4) before decrementing correctly. That gap is the root cause behind production bugs like "why does our inventory sometimes go negative" that can take weeks to track down without knowing to look at isolation level first.

## Frequently Asked Questions

### What is Postgres's default isolation level?

Read Committed. Every query sees committed data as of when that specific query started, so sequential queries within the same transaction can return different results if another transaction commits in between.

### Does Repeatable Read prevent phantom reads?

Not per the SQL standard, but yes in Postgres — because its Repeatable Read implementation uses Snapshot Isolation, it blocks phantom reads even though the standard only requires that at Serializable.

### Why does Serializable abort transactions?

When the database detects that two concurrent transactions could produce a result that differs from running them one after another, it aborts one of them to preserve consistency. The application is expected to catch that error and retry.

### Which isolation level prevents lost updates?

Per the bare SQL standard, only Serializable. But in Postgres, both Repeatable Read and Serializable prevent lost updates — the second of two concurrent updates to the same row is rolled back with a serialization error instead of silently overwriting the first. Read Committed offers no such protection; use explicit locking like `SELECT ... FOR UPDATE` for critical updates at that level.
