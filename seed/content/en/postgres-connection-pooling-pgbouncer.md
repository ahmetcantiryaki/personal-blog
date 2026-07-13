---
title: "Postgres Connection Pooling with PgBouncer"
slug: "postgres-connection-pooling-pgbouncer"
translationKey: "pgbouncer-connection-pooling"
locale: "en"
excerpt: "PgBouncer pooling boosts performance but can silently break RLS tenant isolation in transaction mode; here's the SET LOCAL fix and CVE-2026-6664 patch."
category: "devops-cloud"
tags: ["databases", "sql", "performance", "devops"]
publishedAt: "2026-07-13"
seoTitle: "Postgres Connection Pooling with PgBouncer (2026)"
seoDescription: "PgBouncer pooling boosts performance but can silently break RLS tenant isolation in transaction mode; here's the SET LOCAL fix and CVE-2026-6664 patch."
---

Connection pooling fixes your Postgres scaling problem and quietly breaks tenant isolation at the same time. Behind PgBouncer running in transaction mode, every application connection typically authenticates as the same shared database role, so any row-level-security policy that checks `current_user` stops isolating anyone the moment pooling goes live.

## Why Postgres connections are so expensive

Every Postgres connection is backed by a full operating-system process, not a lightweight thread. That costs real memory per connection and adds context-switch overhead as the count climbs. If your application opens a fresh connection per request, or an orchestrator lets a few hundred pods dial the database directly, a few hundred to a few thousand naive connections can bring a modest Postgres instance to its knees. The bottleneck isn't query speed — it's how many concurrent OS processes the server can carry without falling over.

## How PgBouncer multiplexing works

[PgBouncer](https://www.pgbouncer.org/config.html) sits between your application and Postgres as a lightweight proxy that decouples how many connections the app thinks it has from how many Postgres actually opens. It multiplexes hundreds of application connections — say, 500 — onto a much smaller pool of real backend connections, say 20. The app side stays cheap because those are PgBouncer's own sockets; the expensive resource, real Postgres backend processes, stays fixed and small. That's the whole pitch, and it's why most teams reach for PgBouncer purely as a scaling knob. What gets missed is that how it multiplexes connections can quietly invalidate security assumptions built on top of it.

## The three pool modes, and what each one disables

PgBouncer ships three pooling modes, and each trades multiplexing efficiency for feature support differently.

**Session mode** keeps a one-to-one mapping for as long as a client stays connected — the same backend connection serves that client until it disconnects. Every session-level feature works: session-scoped `SET`, temp tables, `LISTEN/NOTIFY`. The cost is that it gives the least multiplexing benefit; an idle client still parks a backend connection.

**Transaction mode** recycles the backend connection at every `COMMIT`. It's the most common and most efficient mode, since a backend connection can serve a different client the instant one client isn't mid-transaction. The trade-off is that session-scoped features are disabled: you cannot rely on a session-level `SET` because the next statement might land on an entirely different backend, and prepared statements need careful handling.

**Statement mode** is the most aggressive setting — it doesn't even allow a transaction to span multiple statements, since the connection is released after each one. It's rarely used in practice because almost no real application can live within that constraint.

| Pool mode | Multiplexing benefit | Session-level features | Typical use case |
|---|---|---|---|
| Session | Low | Fully supported | Legacy apps, services needing session state |
| Transaction | High | Disabled (SET and prepared statements need care) | Web APIs, high-concurrency workloads (most common) |
| Statement | Highest | Disabled, no multi-statement transactions | Rare; autocommit-only workloads |

## The RLS footgun: current_user stops meaning anything

Here's the part teams miss. Behind a pooler running in transaction mode, application connections typically authenticate as the same shared database role, because PgBouncer reuses a fixed set of backend connections under one configured login rather than opening a new authenticated connection per client. The practical consequence: `current_user` is identical for every tenant and every request. If your row-level-security policies naively check `current_user` as the basis for tenant isolation, that check is now completely useless — every request looks like it came from the same principal, and isolation has silently stopped existing.

This is one of the [well-documented RLS footguns](https://www.bytebase.com/blog/postgres-row-level-security-footguns/), and what makes it dangerous is that it fails quietly. The application keeps running, queries keep returning rows, nothing throws an error. The leak only surfaces when one tenant's data shows up in another tenant's response, usually months later via a support ticket or an audit. Most teams treat connection pooling as a pure performance and scaling knob and never go back to re-audit their RLS policies afterward — which is exactly how a multi-tenant data leak sits quietly in production for months before anyone notices `current_user` stopped meaning anything.

## The fix: SET LOCAL and current_setting for tenant isolation

The correct pattern binds tenant identity to the transaction, not the connection. Store the tenant identifier in a transaction-scoped GUC with `SET LOCAL app.current_tenant = '...'` (or `set_config(..., true)`), and write RLS policies that read it back through `current_setting('app.current_tenant')`.

```sql
-- At the start of every request, inside the transaction:
BEGIN;
SET LOCAL app.current_tenant = 'tenant_8f2a';

-- The RLS policy reads this, never current_user:
CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

SELECT * FROM invoices; -- only tenant_8f2a's rows are visible
COMMIT;
```

This works safely with PgBouncer's transaction pooling specifically because the backend connection is handed back to the pool exactly at `COMMIT` — a `SET LOCAL` value is transaction-scoped and resets automatically when the transaction ends, so it never leaks into the next tenant's transaction on that same backend. The critical rule: never use plain `SET` or `SET SESSION` for this. Session-scoped settings persist on the backend connection and do leak across pooled connections, handing whichever tenant reuses that backend next the previous tenant's setting. That leak is precisely the security bug this pattern exists to prevent, so the difference between `SET` and `SET LOCAL` here is not cosmetic — it's the entire security boundary.

## Sizing the pool, and patching to 1.25.2 without delay

Two settings drive sizing. `default_pool_size` controls how many real backend connections are kept per database-and-user pair; size it against how many concurrent OS processes your Postgres server can safely carry, not against how many connections your application would like to open. `max_client_conn` caps the total number of application-side connections PgBouncer will accept, and it's normally set far higher than `default_pool_size` because the actual bottleneck is already solved on the backend side. After changing either value, watch pool utilization and the count of waiting clients; a pool that stays saturated is your signal to raise the size, not to add more application connections.

Alongside sizing, there's a time-sensitive operational note worth flagging as of July 2026: CVE-2026-6664 is an integer overflow in PgBouncer's SCRAM authentication packet parsing that bypasses a boundary check. It's reachable before authentication, so any unauthenticated remote attacker who can open a TCP connection to PgBouncer can crash it with a malformed SCRAM packet (CVSS 7.5, high). The same 1.25.2 release, published May 8, 2026, also fixed CVE-2026-6665 (a SCRAM-related stack overflow triggerable by a malicious backend), CVE-2026-6666 (a null-pointer dereference when a server sends an error response missing the SQLSTATE field), and CVE-2026-6667 (a missing authorization check on the `KILL_CLIENT` admin command). Anyone running an older PgBouncer in front of Postgres should [patch to 1.25.2 immediately](https://thebuild.com/blog/patch-pgbouncer-today/); details are in [NVD's CVE-2026-6664 entry](https://nvd.nist.gov/vuln/detail/CVE-2026-6664).

Connection pooling belongs in the same toolbox as [database indexing](/en/posts/database-indexing-explained) and fixing the [N+1 query problem](/en/posts/fix-n-plus-one-query-problem), but it isn't a standalone performance dial. Every time you touch the schema — say, during a [zero-downtime schema migration](/en/posts/zero-downtime-schema-migrations) — revisit your RLS policies too, because the pooling layer is sitting there quietly the whole time. For more infrastructure coverage, browse the [DevOps and cloud category](/en/category/devops-cloud).

## Frequently Asked Questions

### Which PgBouncer pool mode should I use by default?

Transaction mode is the right starting point for most web applications; it delivers the highest multiplexing benefit, and modern ORMs now handle prepared statements in ways that cooperate with it. Reserve session mode for the specific services that genuinely need `LISTEN/NOTIFY`, temp tables, or session-level `SET`.

### Can I use prepared statements in transaction mode?

Yes, carefully. Recent PgBouncer versions support named prepared statements under certain conditions, but don't assume it works without confirming how your client library and PgBouncer version handle it — otherwise you'll hit "prepared statement does not exist" errors under load.

### How do I test that my RLS policies are safe behind a pooler?

Open back-to-back transactions with two different tenant IDs, setting `SET LOCAL app.current_tenant` differently in each, and confirm the second transaction never sees the first tenant's rows. Also grep your codebase for `SET SESSION` or any session-scoped configuration of the tenant variable to make sure nothing bypasses the transaction-scoped pattern.

### Should I use PgCat or Supavisor instead of PgBouncer?

The core principles here — choosing the right pool mode, binding tenant identity to the transaction rather than the connection, and patching promptly — apply regardless of which pooler you pick. PgBouncer remains the default choice thanks to its maturity and documentation, but any alternative deserves the same scrutiny of its mode and GUC behavior before you trust it with RLS.
