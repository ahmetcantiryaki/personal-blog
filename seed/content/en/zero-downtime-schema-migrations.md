---
title: "Zero-Downtime Database Schema Migrations"
slug: "zero-downtime-schema-migrations"
translationKey: "zero-downtime-schema-migrations"
locale: "en"
excerpt: "A single ALTER TABLE locked a production table for 40 seconds. Here's how the expand-contract pattern, batched backfills, and concurrent indexes prevent it."
category: "software-engineering"
tags: ["databases", "sql", "deployment", "best-practices"]
publishedAt: "2026-07-11"
seoTitle: "Zero-Downtime Schema Migrations: Expand-Contract Guide"
seoDescription: "A single ALTER TABLE locked a production table for 40 seconds. Here's how the expand-contract pattern, batched backfills, and concurrent indexes prevent it."
---

At 2:32 PM, an engineer ran `ALTER TABLE orders ADD COLUMN status_v2 VARCHAR(20) NOT NULL DEFAULT 'pending'`. The migration had passed cleanly in staging — the table was small; the command ran in milliseconds. In production, `orders` had 40 million rows. Postgres took a SHARE lock on the table to write the default value into every row; for 40 seconds no order could be written, the payment service started timing out, and the on-call phone rang.

If that scenario sounds familiar, you're not alone — most "simple" schema changes hit production exactly this way. The fix isn't complicated, but it does demand discipline: the [expand-contract](https://dev.to/software_mvp-factory/zero-downtime-database-migrations-a-practical-guide-for-postgresql-11af) pattern.

## What expand-contract actually is

The idea is simple: instead of changing the schema in one step, you create a transition window where the old and new structure coexist.

1. **Expand**: add the new column as nullable (no default, no NOT NULL constraint).
2. **Backfill**: populate existing rows into the new column in small batches.
3. **Dual-write**: deploy application code that writes to both the old and new column.
4. **Switch**: move the read path to the new column, verify.
5. **Contract**: drop the old column once no code references it anymore.

Five steps spread across several deploys instead of one — but each step is individually safe and reversible. In the incident above, the real mistake was the `NOT NULL DEFAULT` combination, which forces Postgres to synchronously rewrite every existing row. Expand-contract never does that in a single command.

| Step | What it does | Lock risk | Reversible |
|---|---|---|---|
| Expand | Adds a nullable column | None (metadata-only) | Yes — drop the column |
| Backfill | Populates data in batches | Low (short row locks) | Yes — stop the backfill |
| Dual-write | Code writes to both columns | None | Yes — revert the deploy |
| Switch | Reads move to the new column | None | Yes — flip back via flag |
| Contract | Old column is dropped | Metadata-only | No — be deliberate |

## Backfilling in batches

Updating 40 million rows in a single transaction means long-held locks and a bloated write-ahead log (WAL). The right approach is to walk through the table in primary-key-ordered batches — say, 5,000 rows at a time, with a short pause between batches:

```sql
UPDATE orders
SET status_v2 = status
WHERE id BETWEEN :batch_start AND :batch_end
  AND status_v2 IS NULL;
```

This loop typically runs as a cron job or a dedicated migration script, with progress tracked and an automatic stop if replication lag crosses a threshold. As we covered in [Database Indexing Explained with Examples](/en/posts/database-indexing-explained), if the relevant column is missing an index during backfill, that WHERE clause scans the entire table — erasing the whole point of batching.

## CREATE INDEX CONCURRENTLY: avoiding the write lock

If the new column needs an index, a plain `CREATE INDEX` takes a SHARE lock on the table and blocks INSERT/UPDATE/DELETE until the index finishes building. Per [PostgreSQL's documentation](https://www.postgresql.org/docs/current/sql-createindex.html), `CREATE INDEX CONCURRENTLY` instead uses a SHARE UPDATE EXCLUSIVE lock — it allows writes to continue while still blocking conflicting DDL.

There's a cost: `CONCURRENTLY` can't run inside a transaction block, and it occasionally fails and needs manual cleanup. Make sure your migration tool doesn't silently wrap it in a transaction — a lot of ORM migration runners do this by default, which causes the command to fail quietly.

## Watching replication lag

Before moving to the next batch, the backfill script should check replication lag. The reason is simple: every UPDATE written to the primary flows to replicas over the WAL; if the backfill runs too aggressively, replicas fall behind, and any service reading from a replica starts returning stale data. A practical threshold is to pause the script automatically once lag crosses a couple of seconds, and resume once it recovers.

It's more sustainable to feed that check from a separate observability layer than to bury the logic inside the backfill script itself — the script just polls a metrics endpoint, and the decision logic stays simple. That way you don't need to kill the script to pause a backfill; it throttles itself and speeds back up automatically once traffic normalizes.

## Coordinating app and schema rollout

The most fragile part of expand-contract is the ordering between application deploys and schema migrations. The rule: the schema always expands before the app, and contracts after it. Code that reads the new column can't deploy before the column exists; the migration that drops the old column can't run before the last piece of code referencing it is gone.

Rather than tracking that ordering by hand, adding a "migration status" check to the pipeline stages from [How to Build a CI/CD Pipeline from Scratch](/en/posts/how-to-build-cicd-pipeline) works well — the pipeline refuses to ship new code to production until it confirms the target column exists. Keeping the dual-write phase behind a [feature flag](/en/posts/feature-flags-without-tech-debt) also means you can revert to the old behavior instantly if something breaks, without waiting on a redeploy.

## Rollback at every stage

The real reason to choose expand-contract is that it matches the "every step is independently safe" principle we argued for in [How to Achieve Zero-Downtime Deployments](/en/posts/zero-downtime-deployments). If the backfill stalls halfway, you can stop it — the table stays consistent. If dual-write causes problems, flip the flag and fall back to the old code path. The one step with no rollback — contract, dropping the old column — should therefore be the last, most deliberate move, usually taken days later once you're confident nothing still depends on it.

## Frequently Asked Questions

### How long should a backfill take?

It depends on table size and traffic, but the rule of thumb is that each batch's lock time should stay in the low milliseconds. For a 40-million-row table, a 100–200ms pause between batches can stretch total runtime to hours — that's expected, so don't rush it.

### Can I ever add a NOT NULL constraint safely?

Yes, in two steps: add the constraint with `NOT VALID` first (it skips scanning existing rows), then validate it separately with `VALIDATE CONSTRAINT`. This splits apart the full-table scan that a single-step `NOT NULL` addition would otherwise trigger.

### When is it safe to run the contract step?

Once you've confirmed no code, no reports, and no third-party integration still references the old column — usually one to two weeks after the switch step, once you've watched for issues and seen none.

### Is all this discipline necessary for small tables?

On a table with a few thousand rows, a plain `ALTER TABLE` probably runs in milliseconds, and expand-contract adds unnecessary complexity. As a threshold: if the table sees heavy traffic or has grown past a few hundred thousand rows, expand-contract's overhead costs less than the risk of skipping it.
