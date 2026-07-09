---
title: "Retries, Backoff, and Circuit Breakers"
slug: "retries-backoff-circuit-breakers"
translationKey: "retries-backoff-circuit-breakers"
locale: "en"
excerpt: "A downstream dependency slowed down for 90 seconds — our retry logic took it down completely. Here's what jittered backoff actually prevents, and why."
category: "software-engineering"
tags: ["reliability", "backend", "best-practices", "sre"]
publishedAt: "2026-07-09"
seoTitle: "Retries, Backoff, and Circuit Breakers: Avoiding Storms"
seoDescription: "A downstream dependency slowed down for 90 seconds — our retry logic took it down completely. Here's what jittered backoff actually prevents, and why."
---

Last quarter a downstream dependency slowed down for 90 seconds — it didn't crash, it just got slow. Our client code retried on a fixed 2-second delay with no jitter. Thousands of concurrent clients timed out at once, waited the same 2 seconds, and retried at once. A synchronized wave of requests hit an already-struggling service and took it all the way down. These are the field notes from that retry storm.

## When to retry, when to fail fast

Retries and circuit breakers solve different problems. Retries handle **transient** failures: a dropped packet, a momentarily busy server, a one-off timeout. Circuit breakers handle **systemic** failures: the dependency is genuinely down or consistently erroring, and retrying won't fix anything — it'll just waste resources.

Which errors are retry-safe needs to be explicit: network timeouts (408), rate limits (429), and temporary unavailability (503) are usually fine to retry. Client errors (400 Bad Request) and auth failures (401) should never be retried — trying again won't change the outcome. 500 Internal Server Error is the gray area: only retry it if you know the operation is idempotent, otherwise you risk duplicating a side effect, exactly the failure mode we cover in [Idempotent APIs: Safe Retries by Design](/en/posts/idempotent-api-design).

## The math behind exponential backoff and jitter

The base formula is simple: `min(max_delay, base_delay * 2^attempt)`. But that formula alone has a real flaw — fixed delays don't scale under congestion. If 10,000 clients time out at once and all wait the same `2^attempt` duration, they all wake up together and retry together. Which is exactly what happened to us.

The fix is adding randomness — jitter — to the delay: `delay * (0.5 + random(0, 0.5))`. Per AWS's research on distributed systems, [exponential backoff with jitter reduces retry storms by 60–80%](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/). Google Cloud client libraries always enable jitter; .NET's Polly v8+ defaults to `UseJitter = true`. This is industry standard now, not an optional refinement.

```python
import random
import time

def backoff_with_jitter(attempt, base_delay=0.5, max_delay=20):
    delay = min(max_delay, base_delay * (2 ** attempt))
    jittered = delay * (0.5 + random.uniform(0, 0.5))
    time.sleep(jittered)
```

## Retry budgets: how many attempts is enough, and how many is too many

Unbounded retries can themselves become a resource-exhaustion attack. AWS SDKs default to 3 max attempts with a 20-second max backoff. Beyond that, you need a service-level **retry budget**: a token bucket capped at roughly 10–20% of normal traffic that bounds "how many requests are currently in a retry state." A service pushing >100 requests/second at a dependency that's degraded, with no global retry budget, can turn a single slowdown into two or three times the actual traffic — purely from the retries themselves.

## Circuit breakers: closed, open, half-open

A circuit breaker moves through three states:

- **Closed**: Normal operation, requests pass through directly, error rate is monitored.
- **Open**: Once the error rate crosses a threshold, the breaker opens; requests never reach the dependency and fail immediately. This stops piling more load onto an already-struggling service.
- **Half-open**: After a cooldown period, the breaker lets a limited number of "probe" requests through. If those succeed, it returns to closed; if they fail, it goes back to open.

As [Martin Fowler's classic Circuit Breaker article](https://martinfowler.com/bliki/CircuitBreaker.html) frames it, the core principle is that requests must fail immediately while the breaker is open — so if your retry logic is still sleeping through backoff delays while the breaker is open, you're undermining the whole point of having one.

| Component | What it does | What happens without it |
|---|---|---|
| Idempotency | Guarantees a retry doesn't duplicate the side effect | Retries create duplicate operations |
| Backoff + jitter | Spreads out synchronized retry waves | Retry storms, thundering herd |
| Retry budget | Caps how many concurrent retries are allowed | Retries themselves multiply traffic |
| Circuit breaker | Stops sending requests to an already-failed dependency | Wasted resources, cascading failure |
| Timeout | Bounds how long a request can hang | Connection pool exhaustion, system-wide slowdown |

Retries also tend to stack across layers, which is its own trap. If the client app retries 3 times, the API gateway in front of it adds its own 3 attempts, and a service mesh applies its own retry policy on top, a single logical request can turn into anywhere from 9 to 27 physical requests behind the scenes. You can't reason about total retry exposure without visibility into every layer — so either keep retry policy centralized in one layer (a service mesh, typically) or make each layer's budget explicit and logged.

## Sane defaults and a short anti-pattern list

Practical defaults: base delay 200–500ms, max 3–5 attempts, max backoff 15–30 seconds, jitter always on. A typical circuit breaker threshold is a 50% error rate over a 10-second window, with 1–3 probe requests in half-open.

Anti-patterns to avoid: retrying without a timeout (letting a request hang indefinitely), retrying at every layer independently (client retries, API gateway also retries, and now you've sent 3×3=9 requests total), and not monitoring circuit breaker state (a breaker stuck open with nobody noticing is a silent outage).

The biggest lesson from this incident, honestly, was that treating retry logic as "error happened, wait, try again" is what made the system fragile. Retries, backoff, jitter, budgets, and circuit breakers have to be designed together — missing any one piece undermines the rest. As we cover in [Rate Limiting: Token Bucket vs Sliding Window](/en/posts/rate-limiting-token-bucket-vs-sliding-window), a rate limiter is itself part of this chain — if the client being throttled is the one retrying, how well the limit is designed matters a great deal. For how to monitor these failure modes, see [Observability 101](/en/posts/observability-logs-metrics-traces); at the architecture level, this connects to the tradeoffs in [Microservices vs Monolith](/en/posts/microservices-vs-monolith).

For more engineering practices, browse the [Software Engineering category](/en/category/software-engineering).

## Frequently Asked Questions

### Should every HTTP error be retried?

No. Only errors known to be transient — 408, 429, 503, and 500 only when the operation is idempotent — should be retried. Client errors like 400 and 401 should never be retried, since trying again won't change the outcome and only wastes resources.

### How often should a circuit breaker move to half-open?

It depends on the dependency's typical recovery time; a common starting point is 10–30 seconds, tuned against observed recovery patterns. Too short, and the breaker probes too aggressively; too long, and you extend downtime unnecessarily.

### Isn't exponential backoff alone, without jitter, good enough?

It can be for a single client, but not for thousands of concurrent ones. Without jitter, they all time out together, wait the same duration, and retry at the same instant — which is exactly what causes a retry storm.

### How do I calculate a retry budget?

Set a percentage of your normal traffic volume — 10–20% is common — and implement it as a token bucket. Once the budget is exhausted, new retries are rejected, so a slowdown doesn't let the retries themselves multiply your traffic.
