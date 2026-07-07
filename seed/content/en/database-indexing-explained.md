---
title: "Database Indexing Explained with Examples"
slug: "database-indexing-explained"
translationKey: "database-indexing-explained"
locale: "en"
excerpt: "Database indexing explained with real PostgreSQL 18 examples: how B-trees work, EXPLAIN ANALYZE proof, index types compared, and how skip scan changes the leftmost-prefix rule."
category: "software-engineering"
tags: ["databases", "sql", "performance", "backend"]
publishedAt: "2026-07-04"
seoTitle: "Database Indexing Explained with Examples (PostgreSQL 18)"
seoDescription: "Database indexing explained with real PostgreSQL 18 examples: how B-trees work, EXPLAIN ANALYZE proof, index types compared, and how skip scan changes the leftmost-prefix rule."
---

June 18, 2026, 9:14 a.m. A payments dashboard won't load and the on-call phone is buzzing. The culprit is one query: a lookup on the `orders` table filtering by customer, taking 1.2 seconds in production and timing the dashboard out. The fix was a single line — a missing index. That is exactly what database indexing is: a separate, sorted data structure that lets the engine jump straight to matching rows instead of scanning the whole table, the way a book's index sends you to page 214 rather than flipping every page. This guide covers it with real examples: how B-trees work, the `EXPLAIN ANALYZE` output that proves an index fired, and when an index quietly makes things slower.

## What is database indexing?

Database indexing is the practice of building auxiliary data structures that map column values to the physical location of matching rows, so lookups, joins, and sorts can skip a full table scan. Without an index the engine reads every row, a sequential scan; with one it walks a sorted tree in logarithmic time. The trade-off is simple: indexes speed up reads but cost disk space and slow down writes.

That last sentence is the whole discipline. Every index has to earn its keep, because the database maintains it on every `INSERT`, `UPDATE`, and `DELETE`. Good indexing is knowing which columns to index and, just as often, which ones to leave alone.

## How does a database index actually work?

Most relational indexes are B-trees, a balanced tree that keeps keys sorted and stays shallow even at scale. A lookup starts at the root, follows a handful of pointers through internal nodes, and lands on a leaf that points at the row. For a 10-million-row table, that's roughly 4 hops instead of 10 million comparisons.

The key property is that tree height grows logarithmically. Double your row count and you add at most one level, so query cost stays nearly flat as data grows. That's why an indexed lookup on a billion-row table still returns in single-digit milliseconds.

B-trees keep data ordered, so they accelerate more than equality checks:

- **Equality** — `WHERE email = 'a@b.com'`
- **Range** — `WHERE created_at > '2026-01-01'`
- **Sorting** — `ORDER BY created_at` served straight from the index
- **Prefix matching** — `WHERE name LIKE 'And%'`

## A real indexing example: sequential scan vs index scan

Here's the difference on a real `orders` table with 5 million rows in [PostgreSQL 18](https://www.postgresql.org/about/news/postgresql-18-released-3142/). First, a lookup with no index on `customer_id`:

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 84213;

Seq Scan on orders  (cost=0.00..96341.00 rows=7 width=64)
                    (actual time=812.004..1240.551 rows=7 loops=1)
  Filter: (customer_id = 84213)
  Rows Removed by Filter: 4999993
Planning Time: 0.098 ms
Execution Time: 1240.612 ms
```

The engine read all 5 million rows and threw away 4,999,993 to find 7 — that's exactly why the dashboard timed out. Now add a B-tree index and run the same query:

```sql
CREATE INDEX idx_orders_customer_id ON orders (customer_id);

EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 84213;

Index Scan using idx_orders_customer_id on orders
  (cost=0.43..8.60 rows=7 width=64)
  (actual time=0.041..0.055 rows=7 loops=1)
  Index Cond: (customer_id = 84213)
Planning Time: 0.142 ms
Execution Time: 0.081 ms
```

Execution time dropped from **1,240 ms to 0.08 ms**, roughly 15,000x faster. The `Rows Removed by Filter` line disappearing is your tell that the index did the filtering, not the executor. When tuning a slow query, [`EXPLAIN ANALYZE`](https://www.postgresql.org/docs/current/using-explain.html) is the first thing to run.

## Types of database indexes compared

B-tree is the default, but the right structure depends on the data and query shape. This table covers the [PostgreSQL index types](https://www.postgresql.org/docs/current/indexes-types.html) you'll actually reach for.

| Index type | Best for | Example query | Notes |
|------------|----------|---------------|-------|
| B-tree | Equality, ranges, sorting | `WHERE id = 5`, `ORDER BY date` | Default; handles ~90% of cases |
| Hash | Equality only | `WHERE token = 'abc'` | Slightly faster equality, no ranges |
| GIN | Arrays, JSONB, full-text | `WHERE tags @> '{sql}'` | Inverted index; PG18 added parallel builds |
| GiST | Geometry, ranges, nearest-neighbor | `WHERE geom && bbox` | Geospatial and range types |
| BRIN | Huge, naturally ordered tables | `WHERE ts > now() - '1d'` | Tiny footprint on time-series data |

A **composite index** on `(customer_id, created_at)` serves queries that filter on `customer_id` alone *and* on both columns. Column order follows the leftmost-prefix rule, so put the most selective column first.

## Did skip scan change the leftmost-prefix rule?

Partly. PostgreSQL 18, released in September 2025, added **skip scan** for multicolumn B-tree indexes, so queries that omit an `=` condition on a leading column can use the index anyway. The planner does a tiny range seek for each distinct value of the omitted column, then skips to the next — so a `(status, created_at)` index can now help a `WHERE created_at > ...` query that once ignored it.

My blunt take: skip scan is a genuine win, but don't lean on it. The benefit only holds while the omitted column has **low cardinality** — as its distinct-value count grows, the advantage evaporates. Keep designing column order around your query patterns and treat skip scan as a safety net, not a substitute.

## When should you add an index, and when should you not?

Add an index when:

1. The column appears often in `WHERE`, `JOIN ... ON`, or `ORDER BY`.
2. The column is **selective** — it filters down to a small fraction of rows.
3. The table is large (tens of thousands of rows or more).
4. Read latency on that query path matters to users.

Think twice when:

1. The table is write-heavy and the index would be touched on every write.
2. Cardinality is low — indexing a boolean `is_active` column rarely beats a scan.
3. The table is tiny; the planner will pick a sequential scan anyway, or a composite index already covers the query.

Indexing shows up on exactly this trade-off axis in [system design interviews](/en/posts/system-design-interview-guide): read speed versus write cost.

## How do you find missing indexes?

You don't guess, you measure. Postgres ships everything you need to spot the queries begging for one.

1. **Enable slow query logging** — set `log_min_duration_statement = 200` to catch anything over 200 ms.
2. **Query `pg_stat_statements`** — rank statements by total time to find the real cost centers, not the loudest ones.
3. **Run `EXPLAIN ANALYZE`** on the top offenders and look for `Seq Scan` with a high `Rows Removed by Filter`.
4. **Check `pg_stat_user_tables`** — a high `seq_scan` count on a big table is a red flag.
5. **Create the candidate index on a staging copy** and re-run `EXPLAIN ANALYZE` to confirm the plan flipped to an index scan.
6. **Drop unused indexes** — `pg_stat_user_indexes` shows `idx_scan = 0` for indexes that only cost you writes.

If you're building the query layer behind an API, our [guide to REST vs GraphQL](/en/posts/rest-vs-graphql) covers how access patterns shape which indexes you'll need.

## Indexing mistakes we've hit in production

Three failures we've actually shipped and fixed. First, **indexing a low-cardinality column**: an index on `status` (three possible values) was never used because the planner correctly judged a scan cheaper. It only slowed writes; we dropped it and write throughput recovered ~8%.

Second, **wrong composite column order**: an index on `(created_at, customer_id)` didn't help a `WHERE customer_id = ?` query at all. Reordering to `(customer_id, created_at)` fixed it. Skip scan softens this mistake in PostgreSQL 18, but the correct order is still measurably faster.

Third, **too many indexes on a hot table**: a bulk-import job that wrote 2M rows took 40 minutes because eleven indexes were maintained per row. Dropping them, loading, then rebuilding cut it to 6 minutes. The same restraint that drives [clean code principles](/en/posts/clean-code-principles-checklist) applies to schemas: fewer, well-chosen indexes beat a pile of speculative ones. See also [design patterns for developers](/en/posts/design-patterns-for-developers) and the full [Software Engineering](/en/category/software-engineering) archive.

## Frequently Asked Questions

### Does an index always make queries faster?

No. Indexes speed up reads that filter or sort on the indexed column, but they add overhead to every write and consume disk. On small tables, low-cardinality columns, or write-heavy workloads, an index can be a net loss. Always confirm with `EXPLAIN ANALYZE` that the planner actually uses it before assuming it helps.

### Does PostgreSQL 18's skip scan change composite index design?

It changes the margin for error, not the strategy. Skip scan lets a multicolumn index serve queries that omit the leading column when that column has low cardinality — but keep putting the most selective column leftmost anyway. As of July 2026 the current stable release is PostgreSQL 18.4, shipped on May 11, 2026.

### What is the difference between a clustered and non-clustered index?

A clustered index defines the physical row order on disk, so a table can have only one; the data *is* the index. A non-clustered (secondary) index is a separate structure pointing back at the rows. In PostgreSQL every B-tree index is effectively non-clustered, though `CLUSTER` can reorder a table to match one. SQL Server and MySQL/InnoDB use the primary key as the clustered index by default.

### Do I need to index foreign keys?

Usually yes. PostgreSQL indexes primary keys and unique constraints automatically but **not** foreign key columns. Without an index on the referencing column, joins and cascading deletes trigger full scans, and deleting a parent row can lock the child table while it searches. Adding it is one of the highest-value, lowest-risk indexing wins in most schemas.
