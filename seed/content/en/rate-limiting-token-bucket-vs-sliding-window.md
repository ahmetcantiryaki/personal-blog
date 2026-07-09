---
title: "Rate Limiting: Token Bucket vs Sliding Window"
slug: "rate-limiting-token-bucket-vs-sliding-window"
translationKey: "rate-limiting-algorithms"
locale: "en"
excerpt: "Rate limiting isn't one algorithm choice — it's three decisions: where you enforce it, what key you use, and only then which algorithm to run."
category: "software-engineering"
tags: ["api-design", "performance", "reliability", "system-design"]
publishedAt: "2026-07-09"
seoTitle: "Rate Limiting Algorithms Compared: Token Bucket & More"
seoDescription: "Rate limiting isn't one algorithm choice — it's three decisions: where you enforce it, what key you use, and only then which algorithm to run."
---

Most teams building rate limiting jump straight to "which algorithm," but there are three separate decisions that come first: **where** you enforce it (edge or service), **what key** you enforce it by (user, IP, route), and only then **which algorithm**. Mix these up and you end up with a system that "works" but behaves inconsistently in ways nobody can explain. This piece walks through all three decisions separately, then compares five algorithms on the memory-vs-accuracy tradeoff that actually decides which one you want.

## Three decisions: where, by what key, which algorithm

**Where**: Limiting at the edge (CDN or API gateway layer) stops abusive traffic before it ever reaches your origin servers and is usually cheaper per request. Limiting at the service layer is necessary for business-logic-specific quotas — "free tier gets 1,000 API calls a month" has to live in your application, not the CDN. Most mature systems run both: a coarse abuse/DDoS filter at the edge, a fine-grained quota at the service.

**By what key**: Limiting per-IP misattributes requests from shared IPs behind NAT — office networks, mobile carrier CGNAT — punishing legitimate users who happen to share an address. Limiting per-user or per-API-key is fairer but requires authentication first. Limiting per-route (`/search` gets one budget, `/checkout` gets another) protects expensive endpoints independently. Real systems typically layer all three: unauthenticated requests limited by IP, authenticated ones by API key.

**Which algorithm**: This is a memory/accuracy/complexity tradeoff across five options.

## Five algorithms, with the numbers

- **Fixed window**: Counts requests in a fixed time slice (say, every minute) with a simple counter. Simplest to implement, but it has a boundary burst problem: 100 requests at 0:59 and another 100 at 1:01 both pass, letting 200 requests through in a 2-second span.
- **Sliding window log**: Stores every request's timestamp and counts within a moving window. Fully accurate, but memory grows proportionally to request volume — expensive for a high-traffic key.
- **Sliding window counter**: Keeps a counter per small sub-window (e.g., 10-second buckets for a 1-minute limit) and estimates the current count as a weighted sum of the previous and current sub-windows based on how far into the window you are. Per [Cloudflare's 2015 "Counting Things" post](https://blog.cloudflare.com/counting-things-a-lot-of-different-things/), this approach produced only a 0.003% wrong-decision rate measured across 400 million requests from 270,000 sources.
- **Token bucket**: A "bucket" refills with tokens at a fixed rate; each request consumes one token, and an empty bucket rejects the request. It's the most common choice for public APIs because it allows short bursts while still enforcing a long-run average.
- **Leaky bucket**: The inverse of token bucket — requests are processed ("leaked") at a fixed rate, and a full bucket rejects new arrivals. Preferred when you want to smooth traffic rather than allow bursts, such as feeding a background processing queue.

```python
# Token bucket — simplified
class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate  # tokens/second
        self.last_check = time.monotonic()

    def allow(self):
        now = time.monotonic()
        elapsed = now - self.last_check
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_check = now
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
```

```python
# Sliding window counter — simplified
def allow(current_count, previous_count, elapsed_in_window, window_size, limit):
    weight = (window_size - elapsed_in_window) / window_size
    estimated = previous_count * weight + current_count
    return estimated < limit
```

## Memory and accuracy, side by side

| Algorithm | Memory | Accuracy | Burst tolerance | Typical use |
|---|---|---|---|---|
| Fixed window | O(1) | Low, boundary burst issue | High (unintentional) | Simple, low-risk endpoints |
| Sliding window log | O(n) requests | Fully accurate | None | Low-traffic endpoints needing exact enforcement |
| Sliding window counter | O(1) | ~1% error margin | Low-moderate | Cloudflare's default, most APIs |
| Token bucket | O(1) | High | Allows controlled bursts | General-purpose API rate limiting |
| Leaky bucket | O(1) | High | None, smooths traffic | Queue/background processing |

Per [DigitalApplied's 2026 API rate-limiting reference](https://www.digitalapplied.com/blog/api-rate-limiting-strategies-2026-engineering-reference), the sliding window counter is the most balanced choice at scale precisely because it combines constant memory with near-exact accuracy — which is why it's Cloudflare's production default.

## Where you enforce it changes the behavior more than the algorithm does

Running the same algorithm at the edge versus the service layer changes its behavior in practice. A distributed sliding window counter at the edge requires each edge node to keep a local counter and periodically sync with a central one; that sync lag can create brief windows of over-permissiveness. The same algorithm backed by a single Redis instance at the service layer is far more exact, but carries a single-point-of-failure risk. As we cover in [Retries, Backoff, and Circuit Breakers](/en/posts/retries-backoff-circuit-breakers), the rate limiter itself is a dependency — if it goes down, you need a deliberate failover strategy, either "allow everything" or "reject everything," not an accident.

Honestly, for most teams "which algorithm" gets more debate time than it deserves. Token bucket and sliding window counter, applied with the right key (user + route combination), are both good enough in practice. What actually moves the needle is where the limit is enforced and how clear a signal — a 429 with a `Retry-After` header — you send the client when it's exceeded.

For how idempotency and rate limiting interact, see [Idempotent APIs: Safe Retries by Design](/en/posts/idempotent-api-design); for API contract tradeoffs, see [REST vs GraphQL](/en/posts/rest-vs-graphql); for how this topic shows up in interviews, see our [System Design Interview guide](/en/posts/system-design-interview-guide). For more engineering coverage, browse the [Software Engineering category](/en/category/software-engineering).

## Frequently Asked Questions

### Should I pick token bucket or sliding window counter?

If you want to allow short bursts — a user firing off several requests in quick succession — token bucket behaves more naturally. If you want tight long-run convergence to a rate with less burst tolerance, sliding window counter is the better fit. For most general-purpose APIs, token bucket is a solid default.

### Why does anyone still use fixed window if it has a boundary burst problem?

Simplicity and low memory usage. On low-risk, non-critical endpoints — a public news site's general-purpose API, say — the boundary burst issue rarely matters in practice. On sensitive endpoints like payments or authentication, using fixed window is a real risk.

### What HTTP status code should a rate-limited response return?

`429 Too Many Requests`, ideally with a `Retry-After` header telling the client exactly when it's safe to try again. That lets client-side backoff logic act on a concrete server signal instead of guessing blind.

### Should I back a distributed rate limiter with a single Redis instance?

At small-to-medium scale, yes — accuracy is worth the simplicity. At very high traffic, a single Redis instance can become a bottleneck; at that point teams either move to Redis Cluster or accept approximate, eventually consistent distributed counters, trading some accuracy for scalability.
