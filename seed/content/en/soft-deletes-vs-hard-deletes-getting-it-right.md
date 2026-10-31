---
title: "Soft Deletes vs Hard Deletes: Getting It Right"
slug: "soft-deletes-vs-hard-deletes-getting-it-right"
translationKey: "soft-vs-hard-deletes-done-right"
locale: "en"
excerpt: "Short answer: don't default to soft delete. Use it only where you need undo, with a partial unique index; GDPR erasure requests need a real hard delete."
category: "software-engineering"
tags: ["databases", "postgresql", "sql", "compliance", "best-practices"]
publishedAt: "2026-10-31"
seoTitle: "Soft Delete vs Hard Delete: Doing It Right"
seoDescription: "When should you soft-delete, what are the hidden costs, how do you set up a partial unique index, and why does GDPR Article 17 need a real hard delete?"
---

Short answer: don't add a `deleted_at` column to every table by default. Use soft delete only on tables where you need to offer users an undo, paired with a partial unique index and strict query hygiene — GDPR erasure requests need an actual hard delete, because soft delete alone doesn't satisfy them.

## Why does soft delete look so appealing?

Soft delete means marking a row as "deleted" by filling in a column like `deleted_at` instead of physically removing it from the database; this gives you real benefits — undo for accidental deletions and an audit trail. When a user accidentally deletes a record, the row still sits in the database, so an "undo" button is as simple as a single UPDATE query.

That convenience is why most teams add soft delete to every table without thinking about it. That's exactly where the problem starts: soft delete's hidden costs aren't visible at first, and they usually show up in production as a bug.

## What's the hidden cost of soft delete?

There are three hidden costs: broken unique constraints, noise leaking into every query, and "deleted" data that stays visible. If an `email` column has a normal unique constraint, deleting a user account leaves that email address marked "taken" in the database — when the same person tries to sign up again, they get a "this email is already registered" error, even though the account is already deleted.

The second cost is that every query needs a `WHERE deleted_at IS NULL` filter; forget it in one place, and deleted data leaks into reports, API responses, or exported files. The third cost is leakage through joins: if an orders table references a deleted customer, an order-list query can show the deleted customer's name instead of an empty field.

| Dimension | Soft delete | Hard delete |
|---|---|---|
| Undo capability | Easy, single UPDATE | Impossible, requires restoring from backup |
| Query complexity | Needs a filter on every query | No extra filter needed |
| Compliance risk (GDPR) | Insufficient alone | Satisfies the actual right to erasure |
| Storage cost | Grows over time | Stays flat |
| Unique constraint risk | Breaks without a partial index | No risk |

## How does a partial unique index fix the problem?

In PostgreSQL, a partial unique index applies the constraint only to rows meeting a specific condition, which excludes soft-deleted rows from the uniqueness check. The index below enforces email uniqueness only among active rows (`deleted_at IS NULL`) — deleted users can share an email, but active users can't.

```sql
CREATE UNIQUE INDEX users_email_unique
ON users (email)
WHERE deleted_at IS NULL;
```

This is much cleaner than MySQL's workaround for the same problem, which relies on a generated column that becomes NULL for deleted rows. One caveat: this index only kicks in for queries that include the `deleted_at IS NULL` filter; a query without that filter doesn't benefit from it, so query discipline stays necessary even after the index is in place.

## Does soft delete satisfy GDPR's right to erasure?

No — GDPR Article 17's "right to erasure" requires that data actually be removed, irreversibly; filling in a `deleted_at` column while keeping the data in the database doesn't meet that requirement. When a user submits an erasure request, their personal data needs to be actually removed from backups and archive tables too — hiding it from the main table isn't enough.

This matters for teams running [zero-downtime schema migrations](/en/posts/zero-downtime-schema-migrations) too: when migrating a table from soft-delete to hard-delete, personal data lingering in old backups needs to be folded into the retention policy as well.

## How does an archive table plus a scheduled delete job work?

The practical approach treats soft delete as a temporary intermediate state: after a set window (say, 30 days), move the row to a separate archive table and actually delete it from the main table. This gives users a short undo window without letting the data sit indefinitely in the main table and every query path that touches it.

```sql
-- Move soft-deleted rows older than 30 days to the archive, then delete them
INSERT INTO users_archive
SELECT * FROM users WHERE deleted_at < now() - interval '30 days';

DELETE FROM users WHERE deleted_at < now() - interval '30 days';
```

Like the ongoing maintenance work covered in [API versioning strategies](/en/posts/api-versioning-strategies), this scheduled job isn't a one-time decision but a continuously running process — automating it with a cron job or scheduled task removes the risk of someone forgetting to run it manually.

## How do you keep an audit trail without keeping personal data?

An audit trail needs to capture "what happened," not usually "who it happened to." The practical method: instead of storing fields like username and email in the archive table, store only a hashed reference ID and the event type — this preserves the audit record's integrity while eliminating the personal-data risk.

This follows similar logic to the "treat everything as equally important" trap covered in [backpressure and load shedding](/en/posts/backpressure-and-load-shedding): instead of applying the same retention policy to all data, you make a deliberate call about which data gets kept, for how long, and in what form.

## When is soft delete still the right choice?

For tables where you offer users a direct "undo" feature, and the data is short-lived and low-volume (a single note in a notes app, for example), soft delete is still the simplest solution. But for high-volume tables holding personal data or carrying compliance requirements — user accounts, payment records — defaulting to hard delete is the safest way to avoid future unique-constraint bugs and compliance risk.

My take: most teams pick soft delete because it feels "cautious," but that caution usually turns into a broken unique constraint six months later, or a regret that surfaces during a compliance audit. The default should be hard delete; soft delete should only get added as a deliberate exception where undo is genuinely needed.

## Frequently Asked Questions

### When should you use soft delete?

Use it on tables where you need to offer users a direct undo feature, and where the data is low-volume and carries no personal-data risk. For high-volume tables or ones with compliance requirements, hard delete should be the default.

### Does soft delete satisfy GDPR's right to erasure?

No. GDPR Article 17 requires that personal data actually be removed, irreversibly; filling in a `deleted_at` column keeps the data in the database, so it doesn't meet that requirement.

### How does a partial unique index solve the soft delete problem?

A partial unique index set up with a `WHERE deleted_at IS NULL` condition in PostgreSQL applies the uniqueness constraint only to active rows, so a deleted user's email can be reused by a new user without a conflict.

### Can you use soft delete and hard delete together?

Yes, and it's the most practical approach: use soft delete for a short undo window (say, 30 days), then move the row to an archive table and actually delete it from the main table once that window closes. This satisfies both the user experience and compliance requirements.
