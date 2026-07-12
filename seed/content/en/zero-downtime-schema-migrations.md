---
title: "Zero-Downtime Database Schema Migrations"
slug: "zero-downtime-schema-migrations"
translationKey: "zero-downtime-schema-migrations"
locale: "en"
excerpt: "One ALTER TABLE locked a production table for minutes. Here's the expand-contract pattern, batched backfills, and CREATE INDEX CONCURRENTLY done right."
category: "software-engineering"
tags: ["databases", "sql", "reliability", "deployment", "best-practices"]
publishedAt: "2026-07-12"
seoTitle: "Zero-Downtime Schema Migrations: The Expand-Contract Pattern"
seoDescription: "One ALTER TABLE locked a production table for minutes. Here's the expand-contract pattern, batched backfills, and CREATE INDEX CONCURRENTLY done right."
---

At 2 a.m., a single `ALTER TABLE` adding a `NOT NULL` column to a 40-million-row `orders` table locked the whole table for minutes. The migration itself was fast, but Postgres held an `ACCESS EXCLUSIVE` lock while it rewrote every existing row to validate the constraint — no reads, no writes, checkout dead in the water. This piece starts from that lesson: schema changes aren't safe as one step. They need to be split into several small, individually reversible ones.

The expand-contract pattern is exactly that split. Here we cover the pattern itself, safe backfill strategies, avoiding locks with `CREATE INDEX CONCURRENTLY`, and how to coordinate the application rollout with the schema rollout.

## Expand-contract: why you have to split it up

The idea, which Martin Fowler calls ["Parallel Change"](https://martinfowler.com/bliki/ParallelChange.html), is simple: instead of one deploy carrying a backwards-incompatible schema change, you split it into four separate steps, each safe on its own. **Expand**: add the new column (or table) as nullable — old code is unaffected. **Backfill**: copy existing rows into the new column, in small batches. **Switch**: deploy application code that reads and writes the new column, optionally dual-writing to both for a window. **Contract**: drop the old column once nothing references it. This spreads a single-step migration across multiple deploys, but every step is independently reversible — the opposite guarantee of the incident that opened this piece.

## Why backfills need to be batched

Backfilling every row in one `UPDATE` is just as dangerous as one giant `ALTER TABLE`: it holds row locks for a long stretch and can bloat your transaction log. The practical approach is running `UPDATE ... WHERE id BETWEEN ... AND ...` in batches of 1,000–10,000 rows keyed on the primary key, with a short pause between batches — enough to avoid visibly widening replication lag or lock contention under live traffic. On large tables this can take hours; that patience is far cheaper than a middle-of-the-night incident.

## CREATE INDEX CONCURRENTLY: no write lock required

A standard `CREATE INDEX` holds a lock that blocks writes to the table until it finishes. Per the [official PostgreSQL documentation](https://www.postgresql.org/docs/current/sql-createindex.html), `CREATE INDEX CONCURRENTLY` instead takes a `SHARE UPDATE EXCLUSIVE` lock, which doesn't block concurrent inserts, updates, or deletes. There's a cost: it scans the table twice and has to wait for every existing transaction that could use the index to finish, so it takes noticeably longer than the standard build. It also can't run inside a transaction block, and if it's interrupted partway through, it can leave behind an `INVALID` index that needs to be dropped and retried.

```sql
-- Build an index with no write lock
CREATE INDEX CONCURRENTLY idx_orders_customer_id
  ON orders (customer_id);

-- If it was interrupted, check and clean up
SELECT indexrelid::regclass, indisvalid
FROM pg_index
WHERE indexrelid = 'idx_orders_customer_id'::regclass;
-- if indisvalid = false: DROP INDEX idx_orders_customer_id; and retry
```

## Coordinating application and schema rollout

The part of expand-contract that breaks most easily is app deploy and schema migration drifting out of sync. The safe order: expand the schema first (new column, nullable), deploy the app to dual-write to both the old and new column while still reading only from the old one, run the backfill, deploy the app to read from the new column, then finally drop the old one. Being able to roll back to the previous step at every stage is the whole point — it's the schema-side equivalent of the "every deploy step must be independently rollback-able" principle from our [zero-downtime deployments guide](/en/posts/zero-downtime-deployments).

| Step | Schema state | App behavior | Safe to roll back? |
|---|---|---|---|
| 1. Expand | New column added (nullable) | Unchanged | Yes — column isn't used yet |
| 2. Dual-write | Same | Writes to both columns | Yes — old column still read |
| 3. Backfill | Same | Same | Yes — only copying data |
| 4. Switch (read) | Same | Reads from new column | Yes — can revert to old column |
| 5. Contract | Old column dropped | Uses new column | No — no rollback past this step |

## When expand-contract is overkill

On a small table (a few thousand rows) or a low-traffic internal tool, the few seconds a standard `ALTER TABLE` locks might go unnoticed — the four-step process is unnecessary overhead there. The deciding factor isn't table size, it's whether the lock duration is user-visible: as we note in our [database indexing guide](/en/posts/database-indexing-explained), optimizing without measuring first is wasted effort. Before you run a migration, estimate the lock duration from `EXPLAIN` output and table size; if you're talking seconds, the simple path is fine.

If you're rolling a migration out behind a feature flag, the release/switch split from our [feature flags guide](/en/posts/feature-flags-without-tech-debt) applies here too: putting the schema switch behind a flag makes the "switch" step instantly reversible. If you're also fighting N+1 query problems, the indexes you add during a backfill often speed up the exact queries covered in our [fix the N+1 query problem guide](/en/posts/fix-n-plus-one-query-problem) — two birds, one stone.

## Monitoring the migration: what to watch

Don't fly blind while a backfill runs. Watch at least three metrics live: replication lag (especially if you run read replicas), active lock count (via `pg_locks`), and the completion rate of your backfill batches. If replication lag climbs noticeably above baseline, shrink your batch size or lengthen the pause between batches — that's the cheapest way to trade speed for safety. Treating a migration as something you observe in real time during the deploy, rather than a fire-and-forget midnight job, is the migration-specific version of the "make every production change observable" principle we lay out in our [getting started with OpenTelemetry guide](/en/posts/getting-started-with-opentelemetry).

For more database and reliability practices, browse our [Software Engineering category](/en/category/software-engineering).

## Frequently Asked Questions

### Is expand-contract required for every migration?

No. Adding a new nullable column is already lock-free and fast — it's safe as a single step. Expand-contract matters for backwards-incompatible changes: renaming a column, changing its type, or adding a `NOT NULL` constraint.

### Should CREATE INDEX CONCURRENTLY always be preferred over the standard build?

Yes, if there's concurrent production traffic. But during a maintenance window, with the table already isolated, a standard `CREATE INDEX` finishes faster since it only needs one scan — pay `CONCURRENTLY`'s cost only when you actually need lock-free operation.

### How long should the dual-write phase last?

As long as it takes to complete and verify the backfill — usually a few hours to a few days. Cutting this window too short risks flipping the read path before the backfill finishes, which means reading incomplete data.

### What happens if CREATE INDEX CONCURRENTLY is interrupted?

An `INVALID` index is left in the table; the query planner won't use it, but it still occupies disk space. Check the `indisvalid` flag in `pg_index`, and if it's invalid, drop the index with `DROP INDEX` and retry.
