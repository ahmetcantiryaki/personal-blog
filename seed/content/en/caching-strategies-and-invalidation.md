---
title: "Caching Strategies and Invalidation"
slug: "caching-strategies-and-invalidation"
translationKey: "caching-strategies-invalidation"
locale: "en"
excerpt: "Field notes on caches that lied: the four caching patterns, TTL guidance by data type, and why one hot key going stale can bring your database down with it."
category: "software-engineering"
tags: ["performance", "databases", "system-design", "best-practices"]
publishedAt: "2026-07-16"
seoTitle: "Caching Strategies and Invalidation: A Practical Guide"
seoDescription: "Cache-aside, read-through, write-through, and write-behind compared, plus TTL guidance by data type and how to stop a cache stampede before it hits your DB."
---

The cache that lied to us was a product-pricing cache with a 60-second TTL and no jitter. Every deploy that touched the pricing service triggered a synchronized expiration across every replica at the same second, and for about 400ms every hour, the database that had been fine under normal load took the full unbuffered traffic and fell over. The fix wasn't a bigger cache — it was understanding which of the four caching patterns we were actually running, and adding one line of jitter. Here's the field-notes version of what we learned.

## The four patterns, and what each one actually promises

**Cache-aside (lazy loading)** is the pattern most teams default to without naming it: the application checks the cache first, and on a miss, reads from the database and writes the result back to the cache itself. It's the most common default because it's the simplest to reason about — the cache only ever holds what's actually been requested, and a cache outage degrades to "slower," not "broken," since every read still has a path to the database.

**Read-through** looks similar from the application's point of view, but the cache layer itself owns the miss-handling logic, not application code — the app just asks the cache, and the cache asks the database if it needs to. It centralizes the read logic but couples you more tightly to whatever caching library or proxy implements it.

**Write-through** writes to the cache and the database synchronously, in the same operation, so the cache is never stale immediately after a write — at the cost of every write now waiting on both systems.

**Write-behind (write-back)** writes to the cache immediately and queues the database write to happen asynchronously afterward, trading a small window of durability risk (a crash between the two writes loses data) for lower write latency.

| Pattern | Read path | Write path | Consistency risk |
|---|---|---|---|
| Cache-aside | App checks cache, falls back to DB on miss | App writes DB, then invalidates/updates cache | Stale read window until invalidation |
| Read-through | Cache owns the miss-handling logic | Same as cache-aside, or paired with write-through | Same class of risk as cache-aside |
| Write-through | Cache always warm | Synchronous write to both cache and DB | Lowest staleness risk, highest write latency |
| Write-behind | Cache always warm | Async write to DB after cache write | Data-loss risk on crash before DB write completes |

## Invalidation: delete-on-write plus TTL, not either alone

The oldest joke in computer science — cache invalidation is one of the two hard problems — earns its reputation because neither half of the standard approach works alone. Delete-on-write (or update-on-write) keeps the cache correct the instant your own service changes data, but it does nothing for data that changed somewhere you don't control — a webhook you missed, a direct database edit, or a downstream service's own cache serving you stale data. TTL catches everything delete-on-write misses, at the cost of a bounded staleness window equal to the TTL itself.

Combining them is the standard, not a compromise: delete-on-write for the fast path, TTL as the backstop that guarantees staleness never exceeds a known bound even when invalidation logic has a bug or a code path you forgot to wire up.

## TTL guidance, by data type

There's no universal TTL — the right value depends entirely on how expensive staleness is versus how expensive a cache miss is for that specific data:

| Data type | Typical TTL | Reasoning |
|---|---|---|
| User session data | 15–30 min | Staleness is cheap; misses hit auth flows users notice |
| Product catalog / pricing | 1–5 min | Balance between freshness and read load |
| Search/aggregation results | 5–15 min | Recompute is expensive; slight staleness is acceptable |
| Reference/config data | 1–24 hours | Changes rarely; safe to cache aggressively |
| Real-time inventory counts | Seconds, or event-driven invalidation only | Staleness directly causes overselling |

## The stampede: what killed our database that one time a week

A cache stampede (thundering herd) happens when a popular key expires and every concurrent request for it misses at once, each independently recomputing the same value and sending redundant load to the backend simultaneously. It's the failure mode that hits exactly the hot keys you most depend on the cache to protect — a quiet cache miss on a rarely-requested key is invisible; a synchronized miss on your most-requested key is an outage.

Two fixes, usually combined:

**Single-flight (request coalescing).** The first request that misses sets a lock; every other concurrent request for the same key waits for that one in-flight recomputation instead of triggering its own; then all of them share the result.

```javascript
const inflight = new Map();

async function getCached(key, loader, ttlSeconds) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  if (inflight.has(key)) return inflight.get(key); // wait, don't duplicate

  const promise = (async () => {
    const value = await loader();
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    inflight.delete(key);
    return value;
  })();

  inflight.set(key, promise);
  return promise;
}
```

**Probabilistic early expiration.** Instead of waiting for a hard TTL boundary, refresh a key early with a probability that increases as expiration approaches — this desynchronizes refreshes across a cluster so they don't all miss at the exact same second, which is what killed our pricing cache in the first place. Adding jitter to the TTL itself (`ttl + random(0, ttl * 0.1)`) is the cheapest version of the same idea.

## The rule that would have saved us a bad Tuesday

My blunt takeaway from that incident: a fixed TTL with no jitter is a synchronized-failure generator waiting for enough traffic to matter, and the fix costs one line of code — treat "jitter your TTLs" as a default, not an optimization you get to later. Beyond that, match the pattern to the consistency guarantee you actually need rather than defaulting to cache-aside out of habit: if a stale read genuinely can't happen (inventory, payment state), skip caching that value entirely or invalidate on every write path with a synchronous check, because no TTL is actually safe for data where staleness has a dollar cost attached.

If your caching sits in front of Postgres specifically, it's worth reading alongside our notes on [database indexing](/en/posts/database-indexing-explained) and [fixing the N+1 query problem](/en/posts/fix-n-plus-one-query-problem) — a well-indexed query you're caching anyway is a smaller stampede when the cache does eventually miss. And if you're leaning on [Postgres for more of your stack than just the primary datastore](/en/posts/just-use-postgres-for-everything), `UNLOGGED` tables or `pg_cache` patterns can substitute for a separate cache layer entirely on smaller workloads.

## Frequently Asked Questions

### What's the difference between cache-aside and write-through caching?

Cache-aside only populates the cache on a read miss, so the cache reflects only what's actually been requested. Write-through populates the cache synchronously on every write, so it's never cold for data you've already written — at the cost of every write waiting on both the cache and the database.

### How do I pick a TTL for a specific piece of data?

Weigh the cost of serving stale data against the cost of a cache miss for that data. High-change, high-cost-of-staleness data (inventory, prices) needs a short TTL or event-driven invalidation; low-change, expensive-to-recompute data (aggregations, reference tables) can tolerate hours.

### What causes a cache stampede?

A popular cache key expiring while many concurrent requests are in flight for it — all of them miss at the same instant and independently recompute the same value, sending a burst of redundant load to the backend all at once.

### Does TTL alone solve cache invalidation?

No. TTL bounds staleness but doesn't make the cache correct the instant data changes — a write can happen seconds after a cache write and the stale value stays visible until the TTL expires. Pair TTL with delete-on-write (or update-on-write) invalidation for the data paths you control directly.
