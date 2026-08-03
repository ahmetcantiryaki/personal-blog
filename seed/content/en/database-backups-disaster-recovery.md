---
title: "Database Backups and Disaster Recovery"
slug: "database-backups-disaster-recovery"
translationKey: "database-backup-disaster-recovery"
locale: "en"
excerpt: "RPO/RTO targets, point-in-time recovery via WAL, the 3-2-1 rule, and the restore drills almost nobody runs: an untested backup isn't a backup."
category: "devops-cloud"
tags: ["databases", "postgresql", "cloud", "reliability"]
publishedAt: "2026-08-03"
seoTitle: "Database Backups and Disaster Recovery Checklist"
seoDescription: "RPO/RTO targets, point-in-time recovery via WAL, the 3-2-1 rule, and the restore drills almost nobody runs: an untested backup isn't a backup."
---

An untested backup isn't a backup — it's optimism sitting on a disk. This piece covers the four pieces you actually need for a backup and disaster recovery strategy that survives a real incident: RPO/RTO targets, the right backup type, the 3-2-1 rule, and — the part most teams skip — restore drills.

## RPO and RTO: Define the Target as a Number First

Before designing any backup architecture, you need two numbers. Recovery Point Objective (RPO) defines the maximum amount of data you're willing to lose in an incident, expressed as time — "we can afford to lose the last 5 minutes." Recovery Time Objective (RTO) is the maximum acceptable downtime to get the system back up — "we need to be back online within 2 hours."

| Target | Question | Typical Value (SaaS) | Architectural Implication |
| --- | --- | --- | --- |
| RPO | How much data loss can we tolerate? | 5–15 minutes | Requires continuous WAL archiving |
| RTO | How long can recovery take? | 1–4 hours | Requires automated restore and a warm standby |

Without these two numbers pinned down, "we take daily backups" is a meaningless sentence — a daily backup implies a 24-hour RPO, which is unacceptable for most production workloads.

## Logical vs Physical Backups: How PITR Actually Works

Logical backups (like `pg_dump`) export data as SQL statements or a portable format; they're easy to inspect but slow on large databases and, on their own, only restore to the moment they were taken. Physical backups are raw copies of the on-disk files instead — faster to take and restore, but tied to the database engine.

The real power comes from combining a physical base backup with continuous WAL (Write-Ahead Log) archiving in point-in-time recovery (PITR). According to [PostgreSQL's official documentation](https://www.postgresql.org/docs/current/continuous-archiving.html), this combination lets you restore a database to any moment down to the second, by replaying WAL segments on top of the base backup. The critical detail: don't take your first base backup before you've tested the WAL archiving procedure — if archiving isn't monitored, the backup ends up incomplete, and you find out at restore time, which is the worst possible moment to learn it.

```bash
# Continuous archiving in postgresql.conf
archive_mode = on
archive_command = 'pgbackrest --stanza=main archive-push %p'
wal_level = replica
```

## The 3-2-1 Rule: Offsite and Immutable Copies

The 3-2-1 rule is simple and still holds up: keep **3** copies of your data, on **2** different media, with **1** stored offsite. In 2026, add a fourth layer to that picture: according to [CISA's ransomware guidance](https://www.cisa.gov/stopransomware), in a world where ransomware attacks specifically target backups, at least one copy needs to be **immutable** — undeletable and unmodifiable — through [object lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) or WORM (write-once-read-many) storage.

| Layer | Example | Purpose |
| --- | --- | --- |
| Copy 1 | Production database | Live system |
| Copy 2 | Different disk/volume, same region | Fast restore |
| Copy 3 (offsite) | Different region/cloud provider | Regional disaster protection |
| Immutable extra layer | Object-locked bucket (e.g., S3 Object Lock) | Last line of defense against ransomware |

Encryption is mandatory across every layer — in transit (TLS) and at rest. Access control matters just as much: if a credential with access to your backup system leaks, an attacker can seize both your production data and your recovery path at once, so backup credentials should be managed separately from production database credentials, following least-privilege.

## Managed Cloud Tools vs. Rolling Your Own

For most teams, the real question isn't "how do I implement the 3-2-1 rule," it's "do I set this up with a managed service or my own scripts." Managed services like AWS Backup, Google Cloud's automated backup policies, or Azure Backup handle WAL archiving and retention policy on your behalf — at the cost of some fine-grained control. Running your own pgBackRest or WAL-G setup gives you full control but puts monitoring and alerting responsibility on you. The practical rule: start with a managed service if your team doesn't have dedicated platform/DevOps capacity; consider moving to your own setup once scale and cost optimization become priorities.

## The Part Everyone Skips: Restore Drills

The real test of a backup strategy isn't taking the backup — it's restoring it. The most common failure we see in the field: a team that's watched "backup succeeded" notifications for months, only to discover during a real incident that there's a gap in the WAL archive, or that the restore script broke six months ago. Without a regular restore drill (a game day), a backup strategy is an untested assumption.

A practical drill routine looks like this: once a month, restore the production backup into an isolated environment, bring the application up against it, and run a basic smoke test. This validates both whether your restore time matches your actual RTO and whether the backup is genuinely complete. The results of these drills feed directly into the kind of first-15-minutes response process we cover in our [observability 101 guide](/en/posts/observability-logs-metrics-traces), which walks through logs, metrics, and traces.

## What to Change This August 2026

One thing worth putting on the agenda this month: most cloud providers now offer object-locked immutable storage as a standard tier, and the added cost is usually a few dollars a month. If you don't have an immutable layer yet, it's arguably the cheapest, highest-impact security investment you can make this month.

If you want to pair this with schema evolution discipline, see our [zero-downtime schema migrations guide](/en/posts/zero-downtime-schema-migrations); for the connection-pooling side, check our [PgBouncer connection pooling piece](/en/posts/postgres-connection-pooling-pgbouncer). For more coverage in this space, follow our [DevOps & Cloud section](/en/category/devops-cloud).

## Quarterly Restore-Drill Checklist

1. Automate restoring the production backup (base backup + WAL archive) into an isolated environment.
2. Measure restore time and compare it against your defined RTO.
3. Verify integrity in the restored database with a row count or checksum check.
4. Point the application at the restored database and run a basic smoke test.
5. Document the results; fix any step that falls short of RPO/RTO targets before the next drill.
6. Manually verify once a quarter that the immutable copy's object-lock policy is genuinely unmodifiable.

## Frequently Asked Questions

### What's the difference between RPO and RTO?

RPO defines the maximum acceptable data loss in an incident, measured in time (e.g., the last 5 minutes); RTO is the maximum acceptable time to get the system running again (e.g., 2 hours). Together they determine your backup frequency and architecture.

### Why is WAL archiving essential for point-in-time recovery?

Relying only on periodic base backups puts every change between two backups at risk. Continuous WAL archiving lets you replay changes on top of the base backup to restore the database to any moment down to the second.

### Why add an immutable copy to the 3-2-1 rule?

Modern ransomware attacks specifically encrypt or delete any backups the attacker can reach. At least one copy made immutable through object lock or WORM storage leaves a final recovery path even if an attacker gains access to your backup system.

### How often should restore drills run?

Monthly is reasonable for critical production systems, quarterly for less critical ones. What matters is that the drill measures your actual RTO and that results are documented and fixed before the next drill.
