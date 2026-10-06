---
title: "How Do You Run a Zero-Downtime Database Migration?"
slug: "zero-downtime-database-migrations"
translationKey: "zero-downtime-db-migrations-2026"
locale: "en"
excerpt: "Short answer: expand the schema first, backfill in the background, cut over with a flag, and drop the old structure last. Stripe moved 100M rows this way."
category: "software-engineering"
tags: ["databases", "deployment", "reliability", "best-practices", "sql"]
publishedAt: "2026-10-06"
seoTitle: "Zero-Downtime Database Migrations: Expand-Contract Guide"
seoDescription: "Zero-downtime database migrations use expand-contract: expand the schema, backfill in the background, cut over behind a flag, drop old structure last."
---

Short answer: don't change the schema in one step. Add the new structure first (expand), move data in small batches in the background, switch reads behind a feature flag with controlled rollout, and drop the old structure only once everything is verified (contract). This is the sequencing Stripe used to move 100 million records with zero downtime.

## Why is a single-step schema change dangerous?

Because changing a column or table that's already live in production breaks whatever is running at the moment old and new application versions overlap — during a deploy, during a rollback. As [PlanetScale documents it](https://planetscale.com/blog/backward-compatible-databases-changes), renaming a column or changing its type is high risk precisely because you can't guarantee which code version is running at that instant.

A recent near-miss makes the point concretely: a team tried to rename the `status` column on a users table with a direct `ALTER COLUMN`. The moment the deploy started, the old code version was still reading `status` while the new column name was already live — every login request returned a 500 for several minutes. The fix was simple but came too late: add the new column first, write to both, backfill the data, then drop the old one.

## How does the expand-contract pattern actually work?

It breaks the change into three separate, reversible stages, each shipped in its own deploy cycle.

| Stage | What happens | Reversible? |
|---|---|---|
| Expand | New column/table is added, old structure untouched | Yes — no read path has changed yet |
| Migrate | Data is backfilled in small batches, dual writes begin | Yes — the old structure still holds correct data |
| Contract | Reads cut over to the new structure, old structure is dropped last | Only before contract |

During expand, always add the new column as nullable; adding it `NOT NULL` can lock every row on a large table. If you're adding an index, use `CREATE INDEX CONCURRENTLY` (Postgres) or the equivalent online tool — otherwise the table sits under a write lock while it builds.

## What should you watch when backfilling data in the background?

The golden rule for backfills: small batches, measurable progress, controlled pace. In practice it looks like this:

```sql
UPDATE users
SET status_v2 = status
WHERE id BETWEEN :batch_start AND :batch_end
  AND status_v2 IS NULL;
```

Run that query in batches of a few thousand rows, with a short pause between batches. Track two metrics: rows processed and rows failed. To avoid missing writes that land in production while the backfill is still running, use change data capture (CDC), or put the application into a temporary dual-write mode that writes to both the old and new column at once. Without one of those, any record written during the backfill window ends up missing from the new column.

A common CDC setup connects a tool like Debezium to the database's replication log (the WAL on Postgres, the binlog on MySQL) and streams every change into a message queue. That way, while the backfill script moves historical data, the CDC stream captures whatever new writes arrive in the meantime and applies them to the new column — one mechanism covers the past, the other covers the present. If setting up CDC feels like overkill, an explicit dual write in application code — a couple of extra lines writing to both columns — is enough for most mid-sized projects.

[Stripe's own account](https://stripe.com/en-sk/blog/how-stripes-document-databases-supported-99.999-uptime-with-zero-downtime-data-migrations) of migrating 100 million subscription records shows why scale matters here: if each record transformation took one second, a sequential migration would take about three years. Stripe used a dual-write pattern instead — write to both the old and new table, move the read path, move the write path, then remove the now-obsolete data.

## How do you control the read cutover with a feature flag?

Once the data has moved, don't flip the read path all at once. Put the code path that reads the new column behind a feature flag, and open it to a small percentage of traffic first — 1%, then 10%, then 50%. At each step, watch error rates, latency, and data consistency (that the old and new column return the same value). If something looks wrong, flipping the flag off reverts to the old behavior in seconds, with no deploy needed — the same staged-rollout logic used in [blue-green and canary deployments](/en/posts/blue-green-vs-canary-deployments).

## How do you roll back at each step?

Rolling back during expand is free: drop the new column, nothing else breaks. Migrate is also safe, because the old structure still holds correct data — you can stop the backfill and keep reading from the old path. The step that needs real caution is contract: once the old column is dropped, there's no way back. That's why contract should ship as its own separate deploy, only after the new structure has run error-free through at least one full production cycle — never in the same deploy as migrate.

## What tooling makes this process safe?

On MySQL, `gh-ost` and Vitess perform online schema changes without locking the table; PlanetScale runs these tools in production for exactly this purpose. On Postgres, `CREATE INDEX CONCURRENTLY` and `pg_repack` play a similar role. On the migration-runner side, Flyway, Liquibase, Prisma Migrate, or your framework's own migration tool let you keep expand and contract as separate migration files — cramming both an add and a drop into one migration file defeats the entire point of the pattern.

In practice, adding a column with `gh-ost` looks like running the tool with an `--alter` flag; it builds a shadow copy of the table in the background, applies the change there, replays the binlog to catch up on anything written in the meantime, and cuts over with an atomic rename at the very end. The original table stays readable and writable the whole time — the only lock happens during that final rename, and it lasts milliseconds.

Here's the part worth saying plainly: most teams are careful about expand and migrate but forget contract entirely. A schema full of unused old columns months later is the sneakiest form of tech debt — nobody wants to drop them because "something might still be reading that." Put the contract step on the plan's calendar from day one (say, "drop in two weeks"), or it never happens. We covered a narrower slice of this — how application code needs to accommodate schema in flight — in [zero-downtime schema migrations](/en/posts/zero-downtime-schema-migrations); [zero-downtime deployments](/en/posts/zero-downtime-deployments) covers the staged rollout on the application side. The same additive-first logic shows up in [API versioning strategies](/en/posts/api-versioning-strategies) too. For more engineering practices, see our [software engineering category](/en/category/software-engineering).

## Frequently Asked Questions

### What exactly is the expand-contract pattern?

A way to make a schema change in three separate, reversible stages instead of one: add the new structure first (expand), backfill data and dual-write (migrate), then drop the old structure last (contract). Each stage ships in its own deploy cycle.

### How do I make a backfill safe?

Move data in small batches (a few thousand rows at a time) with short pauses between batches, and track rows processed and rows failed. Use change data capture, or put the application into a temporary dual-write mode, so writes that land during the backfill window aren't missed.

### When should I run the contract step?

Only after the new structure has run error-free through at least one full production cycle, as its own separate deploy. Never bundle it with the migrate step — contract is the one step that makes rollback impossible.

### What tools should I use for this process?

gh-ost or Vitess on MySQL, and `CREATE INDEX CONCURRENTLY` or `pg_repack` on Postgres, let you change schema without locking the table. Migration runners like Flyway, Liquibase, or Prisma Migrate help keep the expand and contract steps as separate files.
