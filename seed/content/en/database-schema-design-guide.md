---
title: "Database Schema Design: A Practical Guide"
slug: "database-schema-design-guide"
translationKey: "database-schema-design-guide"
locale: "en"
excerpt: "How to design a database schema that stays sane as the product grows: entity modeling, normalization, constraint design, UUID vs bigint, and JSONB pitfalls."
category: "software-engineering"
tags: ["databases", "postgresql", "sql", "software-architecture"]
publishedAt: "2026-08-09"
seoTitle: "Database Schema Design: A Practical Guide"
seoDescription: "Entity modeling, normalization, constraint design, the UUID vs bigint decision, and JSONB pitfalls — a practical guide to schemas that survive growth."
---

A good database schema is one that doesn't make you say "why did we do it this way" six months from now. Schema design comes down to three decisions: which entities your data splits into, how you constrain the relationships between them, and when — deliberately — you denormalize a field. Getting these three right early prevents most of the migration pain you'll otherwise pay for later.

## Modeling Entities and Relationships

Before you write a single `CREATE TABLE`, decide which real-world concepts in your product (user, order, product) become their own tables versus columns on an existing one. The rule is simple: if a concept can exist independently and participates in a one-to-many or many-to-many relationship with something else, it earns its own table. "Order line item" is the textbook case — it isn't a column on orders, it's an entity with its own identity and lifecycle.

The most commonly skipped step when drawing relationships is not pinning down cardinality (one-to-one, one-to-many, many-to-many) up front. Many-to-many relationships need a dedicated junction table; skipping that and shoving an array or JSON column on one side is fast in the short term and unqueryable in the long term.

## Normalization and Deliberate Denormalization

Normalizing to 3NF (third normal form) is a reasonable default for most OLTP schemas: every table represents one entity, every column is a direct attribute of that entity, and no data repeats. That structurally rules out update anomalies — storing the same fact in two places and forgetting to update one of them.

Early denormalization tends to cost more than it saves. Adding a "customer name" column to an orders table looks like it eliminates a join, right up until the customer changes their name and you either have to backfill thousands of old rows or accept inconsistency. Denormalization should only happen where measurement shows it's needed — a proven performance bottleneck, a measured join cost — and it usually belongs as a caching or materialized-view layer, not the default design principle of the schema itself.

## Constraints: Correctness Guaranteed by the Schema, Not the Code

`NOT NULL`, `UNIQUE`, `CHECK`, and foreign key constraints enforce rules at the database level that application code can forget. Validating "email can't be empty" only in application code breaks the moment a second service or a bulk-import script touches the table directly; a `NOT NULL` constraint makes that entire bug class impossible from the start.

```sql
CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Foreign keys are a particularly underrated safety net. Without an FK constraint on `customer_id`, "ghost" orders pointing at deleted customers start accumulating — and you usually don't notice until a customer complaint surfaces it.

## Choosing Types: UUID vs Bigint, Enum vs Lookup Table

The choice between UUID and bigint for primary keys has more downstream consequences than it looks like it should. Bigint is sequential, index-friendly, and smaller on disk; UUID can be generated without coordination across distributed systems and avoids leaking a predictable primary key into URLs.

| Criterion | Bigint | UUID (v4/v7) |
|---|---|---|
| Index size | Small | Large (v4) / medium (v7) |
| Sequential insert performance | Good | Poor (v4) / good (v7) |
| Distributed generation (no collisions) | No | Yes |
| Safe to expose in a URL | No (predictable) | Yes |

In practice, as of 2026, UUID v7 (time-ordered UUID) is a reasonable middle ground for most new projects: it combines the safety of coordination-free generation with insert performance close to that of sequential IDs.

The enum-versus-lookup-table decision depends on how often the set of values changes. For a small, rarely changing set like order status, a `CHECK`-constrained text column or a native enum works fine. But for something like "product category," which an admin panel needs to add and remove values from, a lookup table (a separate `categories` table plus a foreign key) is the right call — adding a new enum value usually requires a migration, while inserting a row into a lookup table doesn't.

## Soft Deletes, Audit Columns, and the JSONB Trap

Soft deletes (a `deleted_at` column) keep data from being physically removed, but forget to add `WHERE deleted_at IS NULL` to a single query and "deleted" data starts leaking back in. Enforcing that filter at the view or ORM default-scope level, instead of trusting every query author to remember it, minimizes human error.

JSONB is one of PostgreSQL's most powerful and most abused features. It's genuinely the right tool for variable, sparsely populated data — user preferences, third-party webhook payloads. But burying frequently queried, stable-shape fields inside JSONB causes two problems: PostgreSQL doesn't collect column statistics for JSONB fields, so the query planner can't make smart decisions, and indexing options on JSONB fields are more limited than on regular columns. As [EDB's PostgreSQL anti-pattern guide](https://www.enterprisedb.com/blog/postgresql-anti-patterns-unnecessary-jsonhstore-dynamic-columns) puts it, storing data as JSON blobs denies the query planner the ability to make sensible decisions based on table and column statistics, loses most indexing and scan features, and restricts you to fairly primitive operations. The rule is simple: data you query often belongs in a real column; JSONB should stay reserved for metadata or fields you rarely touch.

A concrete version of this shows up in an e-commerce schema's "product attributes" field. Attributes like color and size, used for filtering on nearly every product, belong in a real column (or a separate `product_variants` table); product-specific technical details that are rarely filtered on — warranty length, manufacturer code — can comfortably live in JSONB. Skipping that distinction up front tends to end with a team six months later searching inside JSONB for the answer to "why is this filter so slow."

## Evolving a Schema Safely

Schema design isn't a one-time decision — it's an ongoing process. Adding a new column is usually safe, but adding a `NOT NULL` column or changing a type can lock existing rows. We covered this in more depth in [our zero-downtime schema migrations piece](/en/posts/zero-downtime-schema-migrations); the short version is to break large changes into small, reversible steps and add columns as nullable first, then backfill.

## A Schema Review Checklist

Before merging a new table or migration, this list is worth running through:

- Does every table have one clear, single responsibility?
- Is every required relationship backed by a foreign key constraint?
- Are columns that can never be empty marked `NOT NULL`?
- Are frequently queried fields real columns, or accidentally buried in JSONB?
- Does the primary key type (bigint/UUID) match the actual access pattern?
- Is the migration backward-compatible, or does it require downtime?

Reading this checklist alongside [our database indexing guide](/en/posts/database-indexing-explained) and [our piece on transaction isolation levels](/en/posts/database-isolation-levels-explained) helps keep a schema not just correct, but performant and consistent too. [PostgreSQL's official documentation](https://www.postgresql.org/docs/current/ddl-constraints.html) remains the most reliable reference for constraint details.

## Frequently Asked Questions

### Should I always normalize to 3NF?

As a general rule, yes, especially for transactional (OLTP) systems. Deliberate denormalization for reporting or analytics tables (a data warehouse, for instance) makes sense, but it belongs as a separate layer, not the default of the main schema.

### Should I use UUID or bigint?

For a single-server, conventional application, bigint remains the best-performing choice. If you need coordination-free generation, sharing keys across microservices, or want to avoid leaking the primary key externally, reach for UUID v7.

### Is using JSONB always a bad idea?

No. For variable-shape, rarely queried data — user settings, webhook payloads — JSONB is the right tool. The problem starts when you begin burying frequently queried, stable-shape fields inside it too.

### When should I use a hard delete instead of a soft delete?

When regulations like GDPR require data to actually be erased, or when a table has bloated with soft-deleted rows to the point it's hurting performance, a hard delete — usually via a periodic cleanup job — is the better call.
