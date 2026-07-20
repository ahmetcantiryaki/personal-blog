---
title: "What Is Apache Iceberg? The Lakehouse Standard"
slug: "what-is-apache-iceberg-lakehouse"
translationKey: "apache-iceberg-lakehouse"
locale: "en"
excerpt: "Snowflake, Databricks, AWS, Google, and Apple all read the same open table format: Apache Iceberg. Here's how the lakehouse ends warehouse-lake duplication."
category: "devops-cloud"
tags: ["databases", "cloud", "open-source", "sql"]
publishedAt: "2026-07-20"
seoTitle: "What Is Apache Iceberg? The Lakehouse Standard, Explained"
seoDescription: "Apache Iceberg's open table format merges the data warehouse and data lake into one layer. We cover the V4 spec, adoption, and when you actually need it."
---

Apache Iceberg is an open-source table format that lets you store your data once, in cheap object storage like S3, GCS, or ADLS, and query it from Spark, Snowflake, DuckDB, or Python at the same time. As of 2026, it has become the de facto standard that ends the years-long problem of duplicating data between a warehouse and a lake.

In the traditional setup, you'd hold your data twice: once in a data warehouse for reporting, once in a data lake for machine learning and raw processing. That created sync lag, doubled storage costs, and constant uncertainty about which copy was authoritative. The lakehouse architecture erases that split, and Apache Iceberg is the technical backbone that makes it work.

## What does an open table format actually mean?

An open table format adds a metadata layer on top of raw Parquet or ORC files: it tracks which files belong to which table, the schema history, partition information, and snapshots of changes over time. That metadata layer lets an engine — Spark, Trino, Snowflake, DuckDB — answer "which files make up this table" directly instead of scanning everything, and it bolts database-style features like ACID transactions, time travel, and schema evolution onto plain files.

## How does Iceberg differ from Delta Lake and Hudi?

All three open table formats solve a similar problem, but Iceberg takes the most aggressive stance on engine-independence. Delta Lake historically grew closer to the Databricks ecosystem, while Hudi is strong in streaming-focused use cases. Iceberg, by 2026, is what Snowflake, Databricks, AWS, Google, and Microsoft all read and write, and what open-source engines treat as the default. If you're designing a new lakehouse and you're not using Iceberg, you should have a good reason — the format is the norm now, not the exception.

| Company / contribution | Role |
|---|---|
| Netflix, Apple | Original development, large-scale production use |
| Snowflake, Databricks | Full read/write support, V3 generally available |
| AWS (S3 Tables) | Managed Iceberg table service |
| Google, Microsoft | Active contributors to the V4 spec design |
| Dremio, Tabular | Catalog and query engine ecosystem |

## What does "store once, query many" look like in practice?

Iceberg's promise is simple: store data once, in cheap object storage, then run Spark for heavy batch jobs, a SQL engine (Snowflake, Trino) for reporting, Python/pandas for data science, and an ML pipeline for feature engineering — all against the same table, without moving data between them. That's the same underlying philosophy behind [DuckDB querying Parquet and SQLite files directly](/en/posts/duckdb-vs-sqlite): route the right engine to the right job without copying data first.

```sql
-- Connecting a query engine to an Iceberg table (Spark SQL example)
CREATE TABLE local.sales.orders (
  order_id BIGINT,
  customer_id BIGINT,
  amount DECIMAL(10,2),
  created_at TIMESTAMP
)
USING iceberg
PARTITIONED BY (days(created_at));

-- Time travel: query yesterday's snapshot
SELECT * FROM local.sales.orders
FOR TIMESTAMP AS OF '2026-07-19T00:00:00';
```

A catalog layer — a REST catalog, AWS Glue, or Nessie — centrally tracks which tables point to which metadata file, functioning as the governance layer that keeps different engines seeing the same table consistently.

## What did Iceberg Summit 2026 show?

Iceberg Summit, held in San Francisco in July 2026, drew more than 600 attendees across two days and over 70 sessions. The notable part: not a single session tried to convince anyone to adopt Iceberg — every talk assumed attendees were already running it, and the discussion focused on "what's next." Engineers from Google, Apple, Snowflake, Databricks, Microsoft, Netflix, and LinkedIn are in the same design discussions, reviewing the same PRs — concrete proof the format is no longer controlled by a single company.

## What does the V4 spec actually fix?

Iceberg was originally built for large, slow-moving analytical tables — but the workloads running on it today are anything but: streaming pipelines committing every few seconds, ML feature tables with thousands of columns, and disaster-recovery scenarios demanding table portability. V4's headline proposal is single-file commits via an "adaptive metadata tree," which enables low-latency writes without sacrificing read performance on large tables. Expanded REST catalog capabilities and improved compaction are also on the roadmap.

## Do you actually need it?

My balanced take here: the governance and engine-independence Iceberg delivers are real, but for a small team, a single data warehouse — or even the [just-use-Postgres-for-everything](/en/posts/just-use-postgres-for-everything) approach — still means less operational overhead. Iceberg pays off once multiple teams need to access the same data through multiple engines from different angles; adopting it before crossing that threshold just adds an abstraction layer you don't need yet. For a broader look at keeping cloud costs in check, see our piece on [FinOps and cutting your cloud bill](/en/posts/finops-reduce-cloud-costs).

## How does migrating from an existing warehouse actually work?

Moving to Iceberg is usually a gradual process, not a big-bang migration. Most teams start with their largest, most expensive-to-query tables first, since that's where the payoff is biggest. Engines like Snowflake and Databricks offer tooling that converts existing tables to Iceberg format in place, meaning only the metadata layer gets added rather than rewriting all the underlying data. Catalog choice is a critical decision at this point: a REST catalog — Iceberg's own standard protocol — maximizes engine-independence, AWS Glue Data Catalog gives deeper integration with the AWS ecosystem, and Nessie is worth considering for teams that want Git-like branch and commit semantics. Making the catalog choice early and deliberately matters, because switching catalogs later means reconfiguring every engine that touches the data.

## Frequently Asked Questions

### Is Apache Iceberg replacing Delta Lake?

Not directly, but it's ahead in engine-agnostic adoption as of 2026. Snowflake, Databricks, AWS, Google, and Microsoft all read and write Iceberg; Delta Lake is still a strong format but historically grew closer to the Databricks ecosystem. If you're building a new lakehouse, Iceberg is the current default choice.

### What problem does the lakehouse architecture actually solve?

In the traditional setup, data is stored twice — once in a warehouse for reporting, once in a lake for raw processing and ML. A lakehouse keeps a single copy of the data on an open table format like Iceberg and serves both the warehouse and lake use cases from that one layer, eliminating sync lag and duplicated storage costs.

### When is Iceberg V4 arriving, and what does it add?

V4 is still in community discussion; the headline proposals include single-file commits via an "adaptive metadata tree," expanded REST catalog capabilities, and improved compaction. The goal is extending the format from large, slow tables to streaming and high-column-count ML workloads.

### Should a small team adopt Iceberg?

Usually not, at least not yet. Iceberg's real payoff shows up once multiple teams access the same data through multiple engines. A small team running one application and one reporting tool is still better served, operationally, by a conventional database.
