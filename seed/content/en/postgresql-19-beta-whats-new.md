---
title: "PostgreSQL 19: What's New?"
slug: "postgresql-19-beta-whats-new"
translationKey: "postgresql-19-release-candidate-2026"
locale: "en"
excerpt: "PostgreSQL 19 is in Release Candidate 1 as of October 2026, with GA pushed to November 19. It adds REPACK, parallel autovacuum, and 2x faster FK inserts."
category: "software-engineering"
tags: ["postgresql", "databases", "performance"]
publishedAt: "2026-10-24"
seoTitle: "PostgreSQL 19: What's New and When Does It Ship?"
seoDescription: "PostgreSQL 19 hit Release Candidate 1 on October 15, 2026, with GA now set for November 19. Here's what shipped, what got cut, and whether to test it now."
---

Short answer: PostgreSQL 19 is not generally available yet — it reached Release Candidate 1 on October 15, 2026, and the release team pushed general availability from an earlier October 29 target to November 19, 2026, after deciding to ship a second release candidate on November 12. The confirmed headline features are a built-in `REPACK` command, parallel autovacuum with a new prioritization system, and up to 2x faster inserts on tables with foreign key checks.

## When does PostgreSQL 19 actually ship?

Short answer: RC1 shipped October 15, 2026; RC2 is scheduled for November 12, 2026; and general availability (19.0) is now planned for November 19, 2026. An earlier plan had targeted October 29 for GA, but the release team decided a second release candidate was needed first, which pushed the final date back three weeks.

| Milestone | Date |
| --- | --- |
| Beta 1 | Mid-2026 (per postgresql.org) |
| Beta 3 | `GROUP BY ALL` reverted |
| Beta 4 | September 24, 2026 — six features pulled, including SQL/PGQ |
| RC1 | October 15, 2026 |
| RC2 (planned) | November 12, 2026 |
| GA (19.0, planned) | November 19, 2026 |

This matters if you're planning an upgrade window: as of today, October 24, 2026, PostgreSQL 19 is pre-release software. Anything you test against RC1 should still work the same way at GA, since release candidates are meant to be feature-frozen, but don't run it in production yet.

## What's actually new in PostgreSQL 19?

Short answer: the confirmed features that survived to RC1 are a native `REPACK` command, parallel autovacuum with workload prioritization, up to 2x faster foreign-key-checked inserts, sequence replication in logical replication, and auto-scaling I/O workers. These are incremental but concrete operational wins rather than a single flashy headline feature.

`REPACK` replaces the old pattern of running `VACUUM FULL` or `CLUSTER` to reclaim bloated table space. Its `CONCURRENTLY` option keeps the table readable and writable for most of the operation, which removes the long-standing tradeoff where reclaiming space meant locking the table. Autovacuum gained parallel index processing, configurable with the new `autovacuum_max_parallel_workers` setting, plus a scoring system that decides which tables need vacuuming most urgently instead of processing them in arrival order.

```sql
-- PostgreSQL 19: reclaim space without a full table lock
REPACK (CONCURRENTLY) orders;

-- Tune parallel autovacuum workers
ALTER SYSTEM SET autovacuum_max_parallel_workers = 4;
```

On the replication side, logical replication can now propagate sequence values, so a subscriber's sequences stay in sync with the publisher's — a gap that previously forced manual sequence resets after failover. The `io_method=worker` setting also got smarter: it auto-scales its worker count using new `io_min_workers` and `io_max_workers` settings instead of requiring a fixed, manually tuned number.

## What got cut from PostgreSQL 19 before release?

Short answer: the project pulled six planned features in Beta 4 on September 24, 2026, including the long-anticipated SQL/PGQ property graph query support, partition `MERGE`/`SPLIT` commands, and online checksum toggling; `GROUP BY ALL` was separately reverted back in Beta 3. None of these will ship in PostgreSQL 19.0.

This is worth knowing specifically because SQL/PGQ — a standard way to query relational tables as property graphs — had been one of the most anticipated PostgreSQL 19 features in earlier previews. If you were planning a graph-query migration around its arrival, that plan now needs to wait for PostgreSQL 20 or a later release; there's no confirmed date for when (or whether) a reworked version returns.

## What could silently break when you upgrade?

Short answer: three behavior changes need checking before you upgrade — Just-In-Time (JIT) compilation is now off by default, RADIUS authentication was removed entirely, and `standard_conforming_strings` is now mandatory. None of these are reverted features; all three are confirmed, intentional changes that ship in 19.0.

JIT defaults to off because the planner's JIT costing model turned out to be unreliable — if your workload runs large analytical queries that depended on JIT kicking in automatically, you now need to set `jit = on` by hand in `postgresql.conf`, or those queries get measurably slower with no warning. RADIUS authentication is gone because the project considers RADIUS-over-UDP (the only variant PostgreSQL supported) unfixably insecure; anyone still using it needs to migrate to LDAP or SCRAM before upgrading. `standard_conforming_strings` being forced on also has a dump-compatibility consequence: a dump created with a pre-19 `pg_dump` or `pg_dumpall` while that setting was off will not load cleanly into PostgreSQL 19 — re-dump with a current version of the tool first.

PostgreSQL 19 also ships two new planner-control extensions: `pg_plan_advice`, which lets you pin and stabilize which execution plan the planner picks for a given query, and `pg_stash_advice`, which applies that advice automatically using query identifiers. Teams who've been burned by an unexpected plan regression in production now have a built-in way to lock in a known-good plan instead of relying on a third-party extension like `pg_hint_plan`.

## Should you test PostgreSQL 19 now, or wait for GA?

Short answer: test RC1 now in a non-production environment if your workload would benefit from `REPACK`, parallel autovacuum, or faster FK-checked inserts, but don't deploy it to production until 19.0 ships on November 19. Release candidates are feature-frozen, so the operational behavior you see in RC1 should match GA, but RC status still means "not supported for production" by project convention.

If your team is debating whether to stay on an older major version instead, read our [case for just using Postgres for more of your stack](/en/posts/just-use-postgres-for-everything) — the REPACK and autovacuum improvements in 19 make that argument somewhat stronger for teams that had been routing around vacuum-related downtime by adding a cache or queue layer. Teams curious about how far Postgres internals work is moving also have our piece on [pgrust, an effort to rewrite Postgres components in Rust](/en/posts/pgrust-postgres-rewritten-in-rust) as useful context — it's a different project, but it signals the same general direction of investment in the engine's core performance and safety.

My own take: shipping `REPACK CONCURRENTLY` and smarter autovacuum prioritization is the kind of release that won't make headlines but will measurably reduce 3 a.m. pages for teams running large, high-churn tables — that's a better trade than landing SQL/PGQ half-baked and cutting it later. If your team has been waiting specifically for graph queries, don't block your PostgreSQL 19 upgrade on it; adopt the vacuum and insert-performance wins now and track SQL/PGQ separately.

For more database and performance coverage, see our [Software Engineering category](/en/category/software-engineering).

## Frequently Asked Questions

### Is PostgreSQL 19 generally available yet?

No. As of October 24, 2026, PostgreSQL 19 is at Release Candidate 1, shipped October 15. A second release candidate is planned for November 12, with general availability (19.0) now targeted for November 19, 2026.

### Does PostgreSQL 19 include SQL/PGQ graph query support?

No. SQL/PGQ, along with partition `MERGE`/`SPLIT` and online checksum toggling, was pulled from the release in Beta 4 on September 24, 2026. These features will not ship in PostgreSQL 19.0.

### What should I check before upgrading to PostgreSQL 19?

Check whether your workload depends on JIT compilation being on by default, whether you authenticate with RADIUS, and whether any client dumps data with `standard_conforming_strings` off. JIT is now off by default, RADIUS authentication was removed entirely, and `standard_conforming_strings` became mandatory — all three can silently change behavior or break a restore if you don't check them first.

### How much faster are inserts in PostgreSQL 19?

Up to 2x faster specifically for inserts on tables with foreign key checks, according to the official Beta 1 announcement. This applies to the foreign-key-validation path during inserts, not to all write workloads uniformly.

Sources:
- [PostgreSQL 19 Beta 1 Released (postgresql.org)](https://www.postgresql.org/about/news/postgresql-19-beta-1-released-3313/)
- [PostgreSQL 19 Release Candidate 1 (postgresql.org)](https://www.postgresql.org/about/news/postgresql-19-rc-1-released-3409/)
- [Updated PostgreSQL RC / GA dates (postgresql.org mailing list)](https://www.postgresql.org/message-id/f161fbb7-e193-42eb-bec7-4cfc1af74a50@postgresql.org)
