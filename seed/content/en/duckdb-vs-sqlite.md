---
title: "DuckDB vs SQLite: Which Embedded Database?"
slug: "duckdb-vs-sqlite"
translationKey: "duckdb-vs-sqlite"
locale: "en"
excerpt: "DuckDB benchmarks 10–100x faster than SQLite on aggregations, but they aren't interchangeable. Here's the OLAP-vs-OLTP split and the 2026 local-first stack."
category: "software-engineering"
tags: ["databases", "sql", "performance", "backend"]
publishedAt: "2026-07-20"
seoTitle: "DuckDB vs SQLite: Embedded Database Comparison"
seoDescription: "DuckDB and SQLite both call themselves embedded databases but solve different problems. We cover the aggregation speed gap, Turso sync, and when to use each."
---

Short answer: reach for DuckDB when the job is reporting and aggregation, and for SQLite when the job is holding your application's transactional state. Both are single-file, serverless embedded databases, but one is a columnar OLAP engine and the other a row-store OLTP engine — they don't replace each other, they stack.

"Which one should I use" is the wrong framing. In the local-first architectures that matured through 2026, the two typically sit in different layers of the same pipeline: SQLite collects and persists the data, DuckDB analyzes and reports on it. This piece covers the architectural split, the real performance numbers, and the most common local-first setup teams are shipping this year.

## Why do they get lumped together when they do different jobs?

SQLite uses row-store storage: every column of a given record sits together on disk. That layout makes OLTP operations — fetch one order, update it, save it — fast, which is exactly why it's the default for holding state in a web app, mobile client, or CLI tool.

DuckDB uses columnar storage: each column lives separately on disk. For an OLAP query like "sum revenue by customer segment over the last 90 days," that layout lets the engine read only the columns it needs and run vectorized execution across multiple cores in parallel. Rather than forcing one disk format to do both jobs, DuckDB was built from the ground up for analytical queries.

## Is the aggregation speed gap really 10–100x?

Yes — multiple independent benchmarks confirm that range: DuckDB measures 10–100x faster than SQLite on queries involving aggregation, joins, and large scans. The gap isn't one trick; it's a three-layer architectural advantage. Columnar storage eliminates unnecessary I/O, vectorized execution keeps the CPU cache efficient, and multi-threading parallelizes scans and joins across cores.

| Criterion | SQLite | DuckDB |
|---|---|---|
| Storage model | Row-store | Columnar |
| Ideal workload | OLTP: single-row read/write | OLAP: aggregation, large scans |
| Parallelism | Single-threaded, file locking | Multi-core, vectorized |
| Aggregation speed | Baseline | Typically 10–100x faster |
| Best use | App state, mobile, edge | Reporting, data science, ETL |

## When is SQLite the right call?

SQLite's strength is being a single-file engine that runs everywhere. It's become the default for mobile apps, desktop software, CLI tools, and edge functions, because it needs zero operational overhead, delivers sub-millisecond single-row access, and backs up as easily as copying a file. It's also increasingly popular as the persistent primary store behind write-heavy, multi-user production APIs — the SQLite-side counterpart to the [replace-everything-with-Postgres](/en/posts/just-use-postgres-for-everything) trend.

## When should DuckDB actually enter the picture?

Don't think of DuckDB as an "app database" — think of it as an analysis engine. Typical triggers: a dashboard needs to group and sum millions of rows on every load, a data science notebook needs to run SQL directly over Parquet files, or a nightly ETL job's aggregation step takes minutes and needs to drop to seconds. DuckDB handles every one of these without a server process to provision, since — like SQLite — it's embedded.

## The 2026 local-first stack: collect in SQLite, query in DuckDB

The most common 2026 architecture looks like this: the application writes to SQLite, and a nightly (or event-driven) job queries that SQLite file — or its Parquet dump — with DuckDB. DuckDB's `sqlite_scanner` and `postgres_scanner` extensions let you query SQLite files and a live Postgres connection directly, without moving the data first, eliminating a separate ETL step entirely.

```sql
-- Query a SQLite file directly from DuckDB
INSTALL sqlite;
LOAD sqlite;
ATTACH 'app.db' AS app (TYPE sqlite);

SELECT customer_segment, SUM(amount) AS total_revenue
FROM app.orders
WHERE created_at >= now() - INTERVAL 90 DAY
GROUP BY customer_segment
ORDER BY total_revenue DESC;
```

That single query preserves SQLite's transactional correctness while borrowing DuckDB's analytical speed — positioning the two engines as complements, not competitors.

## How are Turso and embedded replicas changing the picture?

The biggest 2026 development on the SQLite side is Turso's embedded replica model. Built on libSQL, an open-source fork of SQLite, Turso syncs a remote primary database with a local SQLite file running inside your application — reads happen at local-disk speed, well under a millisecond, while writes go to the remote primary and sync back with read-your-own-writes consistency. Turso's newer CDC-based sync mechanism claims a substantially faster sync with far less network traffic than the earlier embedded-replica approach. That makes the pattern of giving every user or tenant their own local SQLite replica practical at the edge and in multi-tenant apps — a pattern we cover in more depth in our piece on [edge functions and rendering](/en/posts/edge-functions-rendering-guide).

My honest take: the "which one is better" framing is the wrong debate. Trying to replace SQLite with DuckDB is about as pointless as trying to use DuckDB for application state — using both, in the right layer, is one of the more pragmatic data architecture decisions available in 2026. For related database decisions, see our piece on [database indexing](/en/posts/database-indexing-explained).

## What are DuckDB's limits?

The simplicity that makes DuckDB tempting as an application's primary database is also what defines its limits. Only one process can hold write access at a time; it has a multiple-readers, single-writer concurrency model similar to SQLite's WAL mode, but it doesn't offer Postgres-level multi-writer concurrency. That makes DuckDB the wrong choice behind a highly concurrent, write-heavy API — its right home is a scenario where a single job or a single analysis process needs to crunch a lot of data quickly. Memory usage also needs attention: for large aggregations, DuckDB tries to hold a meaningful share of the working set in memory, which can push it into a disk-spilling execution mode on very large datasets. In practice, that means asking "how many concurrent writers do I have" and "how much data will a single query scan" before you commit to DuckDB.

## Frequently Asked Questions

### Can DuckDB replace SQLite?

No, not for most scenarios. SQLite is built for transactional workloads — single-row reads and writes, concurrent small updates — while DuckDB is built for aggregation and large scans. Replacing a web app's primary database with DuckDB isn't recommended, because the write-concurrency and locking models are fundamentally different.

### Can DuckDB query a SQLite file directly?

Yes. DuckDB's `sqlite_scanner` extension lets you `ATTACH` a SQLite file and query it with SQL directly, no data copy required. The `postgres_scanner` extension similarly connects to a live Postgres database.

### How is Turso's embedded replica different from traditional SQLite replication?

Traditional SQLite is single-file and single-machine; multi-machine sync isn't built in. Turso's libSQL-based embedded replica model syncs a remote primary database with a local copy running inside your app — reads happen locally in well under a millisecond, while writes go to the remote primary and propagate back through CDC-based sync.

### Do I need to set up both for a small project?

No. If your data volume stays under a few hundred thousand rows and your aggregation queries return in seconds, SQLite alone is enough. The threshold for bringing in DuckDB is the moment a reporting query starts making a user notice the wait.
