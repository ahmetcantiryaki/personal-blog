---
title: "Multi-Region Postgres: Options and Trade-offs"
slug: "multi-region-postgres-options-and-trade-offs"
translationKey: "multi-region-postgres-tradeoffs-2026"
locale: "en"
excerpt: "Short answer: multi-region Postgres has three justifications — latency for distant users, disaster recovery, and data-residency law; 'scale' isn't one."
category: "devops-cloud"
tags: ["postgresql", "databases", "system-design", "reliability"]
publishedAt: "2026-10-28"
seoTitle: "When Do You Actually Need Multi-Region Postgres?"
seoDescription: "We compare read replicas, logical replication, and distributed Postgres on consistency and complexity, and make the honest case for staying single-region."
---

Short answer: there are three real reasons to go multi-region with Postgres — low latency for distant users, regional disaster recovery, and data-residency law that forces rows to live in a specific geography. "Scale" isn't on that list; a single, well-tuned Postgres instance can carry far more traffic than most teams ever reach.

## What are the three reasons that actually justify going multi-region?

First, latency for users on the other side of the world: a single-region database can add 150-250 ms of round-trip latency, making every query feel slow. Second, regional disaster recovery: when an entire region goes down (a cloud provider outage, a natural disaster), you need to shift traffic to another region. Third, data-residency law: regulations like GDPR, or sector-specific rules, can force specific user data to stay within a specific geography. "Scale" doesn't belong on this list, because a vertically scaled (bigger machine) and properly indexed Postgres instance can carry the real traffic of most applications in a single region.

## How do read replicas plus request routing work, and where's the trap?

Read replicas use physical (streaming) replication to ship the write-ahead log (WAL) from a primary node to one or more read-only standbys. Standbys are available for queries but don't accept writes; replication lag is visible through the `pg_stat_replication` view and can spike the moment a network interruption hits.

The biggest trap is the read-your-writes problem: if a user writes data and immediately tries to read that same data, and the read request lands on a replica that hasn't caught up yet, the user doesn't see the change they just made. This is the classic source of "I hit save but my change looks like it disappeared" complaints. The usual fix is routing to the primary for a short window after a write, or actively monitoring replication lag and refusing to send traffic to a replica that's fallen behind.

What that monitoring looks like in practice: sampling the `pg_stat_replication` view regularly and surfacing how far behind a replica is (in bytes or seconds) on a dashboard. Once lag crosses a threshold (say, 500 ms), temporarily pulling that replica out of the load balancer is a safer default than serving an inconsistent view to the user.

## When does logical replication beat physical replication?

Logical replication operates at the row or table level, and unlike physical replication, it lets the subscriber side accept local writes. That's the standard use case described in [PostgreSQL's own documentation](https://www.postgresql.org/docs/current/logical-replication.html) for selective sync (copying only specific tables to another region) or zero-downtime major-version migrations. The cost is the overhead logical decoding introduces — overhead that tends to run higher than physical replication, especially under heavy write volume.

```sql
-- On the primary node: define which tables to publish
CREATE PUBLICATION orders_pub FOR TABLE orders, order_items;

-- On the node in the target region: subscribe to that publication
CREATE SUBSCRIPTION orders_sub
  CONNECTION 'host=primary-eu dbname=app'
  PUBLICATION orders_pub;
```

## What does distributed Postgres (like Citus) buy you, and what does it cost?

Citus is a Postgres extension that shards data and distributes it across nodes, adding columnar storage on top; its 14.0/14.1 release, shipped in February 2026, brought PostgreSQL 18 support and is offered as a managed option through [Azure Database for PostgreSQL Flexible Server's Elastic Clusters feature](https://www.citusdata.com/blog/2026/). Scaling looks as simple as adding a node and rebalancing shards, but the cost is real: cross-shard joins and transactions aren't as simple as they are on single-node Postgres, and the operational complexity (rebalancing, monitoring shard distribution) runs well above a single-instance setup.

| | Read Replica | Logical Replication | Distributed Postgres (Citus) |
|---|---|---|---|
| Consistency | Eventual, tied to replication lag | Eventual, selective per table | Strong within a shard, complex across shards |
| Node accepting writes | Primary only | Subscriber can also accept local writes | Each shard accepts its own writes |
| Operational complexity | Low-to-medium | Medium | High |
| Typical use | Geographic read distribution | Selective sync, version migration | Horizontally scaling a very large dataset |

## How do you actually manage the strong-consistency-vs-latency trade-off?

There's a law of physics you can't dodge here: if you want strong consistency across multiple regions, the write has to reach every region and get acknowledged before it commits, which raises latency. If you want low latency, you have to give up cross-region consistency — this is the day-to-day version of "the CAP theorem." The practical move for most teams is separating which data genuinely needs strong consistency (payments, balances) from which data can tolerate eventual consistency (profile info, view counters).

## How do you actually test for failover and split-brain risk?

Promoting a replica to primary when a region goes down looks like a simple command, but the real risk is split-brain: if the old primary comes back and starts accepting writes again, you now have two primaries at once and the data forks. Preventing that takes regular promotion drills (planned failover exercises) and a fencing mechanism that automatically forces the old primary into read-only mode — leaving that only in documentation doesn't help during a real incident.

For a promotion drill to be realistic, it needs to run quarterly in a prod-like environment under real traffic load — a drill run once a year lets the tooling and the runbook go stale within months. The most important number to measure during the drill is time-to-promote, from detection to full cutover; if that number is in minutes, the failover plan will hold up during a real incident, and if it's in hours, you're not ready yet.

## What's the honest case for staying single-region?

My take: most teams move to a multi-region architecture out of a "scale" worry, when what they actually need is better indexing and vertical scaling. If data-residency law isn't forcing your hand, your user base is geographically concentrated, and a regional outage hasn't actually hit you yet, staying single-region — and running that region well — is cheaper than taking on multi-region complexity early. This reasoning overlaps with the [cell-based architecture approach](/en/posts/cell-based-architecture-blast-radius) to shrinking blast radius: shrink the blast radius first, then move to geographic distribution.

Before scaling out the data layer, cheaper practices like [branching preview databases for every PR](/en/posts/branching-preview-databases-every-pr) let you test schema changes before they hit production. [Caching strategies](/en/posts/caching-strategies-and-invalidation) are usually a cheaper step worth trying before a multi-region Postgres setup, specifically to cut query load. For teams wanting to split off analytical load, [Apache Iceberg's lakehouse approach](/en/posts/what-is-apache-iceberg-lakehouse) is another way to keep OLTP traffic on Postgres while moving analytical queries to a separate layer.

## Frequently Asked Questions

### What are the real reasons to go multi-region with Postgres?

There are three real reasons: low latency for distant users, regional disaster recovery, and data-residency law. "Scale" isn't one of them — a properly indexed, vertically scaled Postgres instance can carry most applications' traffic in a single region.

### What's the read-your-writes problem with read replicas?

When a user writes data and immediately tries to read it, and the read lands on a replica that hasn't caught up yet, the user doesn't see their own change. The fix is routing to the primary for a short window after a write, or actively monitoring replication lag.

### When is logical replication better than physical replication?

Logical replication is better when you need selective table sync or a zero-downtime major-version migration, since it operates at the row/table level and lets the subscriber accept local writes. The cost is the processing overhead logical decoding introduces.

### When do you actually need distributed Postgres like Citus?

When you need to scale a dataset horizontally beyond what vertical scaling on a single Postgres instance can carry. In exchange, you take on cross-shard join and transaction complexity and higher operational overhead, so confirm vertical scaling is genuinely insufficient before paying that cost.
