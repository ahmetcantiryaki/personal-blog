---
title: "Backpressure and Load Shedding: Survive Overload"
slug: "backpressure-and-load-shedding"
translationKey: "backpressure-load-shedding-2026"
locale: "en"
excerpt: "When demand exceeds capacity, two tools keep a service alive: backpressure signals upstream to slow down, and load shedding rejects low-priority work outright."
category: "software-engineering"
tags: ["reliability", "system-design", "sre", "performance"]
publishedAt: "2026-09-25"
seoTitle: "Backpressure vs Load Shedding: Surviving Overload"
seoDescription: "Backpressure and load shedding are two different mechanisms for keeping a service alive under overload. Bounded queues, admission control, and signals."
---

Short answer: when demand exceeds what a service can process, two tools kick in — backpressure signals the upstream sender to slow down, and load shedding rejects low-priority requests outright before they ever reach a queue. Used together, a service degrades predictably under overload instead of slowing to a crawl and then collapsing.

## What actually happens when demand exceeds capacity?

Queues grow, latency compounds, and the system eventually spirals into cascading failure. An unbounded queue looks fine at first because it accepts every incoming request — but as wait time in the queue grows, clients start timing out, retry, and those new requests pile onto a queue that's already full. This feedback loop is known as bufferbloat: the queue never drains, because every slot that opens up gets immediately refilled by a retry.

Cascading failure happens when one overloaded service starts dragging down the dependent services behind it. When a service times out, the caller retries, adding extra load upstream — past a certain point, the system turns into a self-feeding demand spike.

## How does backpressure actually work?

Backpressure works by having the receiver explicitly communicate its capacity state to the sender, so the sender slows down before the receiver gets overwhelmed. Three concrete mechanisms implement this: bounded queues, flow-control signals, and demand-based pull in reactive streams.

In a bounded queue, once capacity is full, new requests aren't queued at all — the sender gets an immediate error or "busy" signal instead. Unlike an unbounded queue, this surfaces the full state early and explicitly instead of hiding it. Distributed backpressure propagation through a service mesh or RPC layer can carry capacity information several hops away — so a third service can learn the second service is full before the request ever reaches it.

## How is load shedding different from backpressure?

Load shedding protects capacity by rejecting or dropping a request at admission time, before it's ever queued. Where backpressure says "slow down," load shedding says "not now, not at all" — the distinguishing factor is deciding instantly rather than queuing and waiting.

Common load-shedding strategies used in practice include Random Early Detection (RED), Controlled Delay (CoDel), priority-based shedding, and admission control at the entry point. A priority-aware LoadShedder performs capacity-based admission control right at the service boundary; it sheds low-priority work first to protect latency for critical flows, and it keeps a reserved capacity buffer for the requests that matter most.

| Mechanism | What it does | When it kicks in |
|---|---|---|
| Bounded queue | Rejects new work once capacity is full | When the queue reaches its capacity |
| Flow-control signal | Tells the sender to slow down | While the receiver's processing rate drops |
| Admission control | Rejects a request at entry, before queuing | On every request, at the capacity check |
| Priority-based shedding | Drops low-priority work first | Once capacity falls below a critical threshold |
| Deadline cutoff | Abandons a request whose time budget is spent | When a request exceeds its remaining time budget |

## Why does deadline propagation matter?

Because if you don't pass a request's total time budget down through every service in the call chain, you keep processing a request that's already become pointless. If the client gave up after 2 seconds but the third service in the chain is still working on it, the CPU and memory spent on it are wasted — propagating the deadline end to end prevents exactly that waste.

The simplified TypeScript example below shows how an incoming request's remaining time budget can be passed to the next service in the chain:

```typescript
interface RequestContext {
  deadlineMs: number // epoch timestamp
}

function shouldProcess(ctx: RequestContext): boolean {
  const remaining = ctx.deadlineMs - Date.now()
  return remaining > MIN_PROCESSING_BUDGET_MS
}

async function callDownstream(ctx: RequestContext, payload: unknown) {
  if (!shouldProcess(ctx)) {
    throw new DeadlineExceededError()
  }
  return fetch(DOWNSTREAM_URL, {
    method: "POST",
    headers: { "x-deadline-ms": String(ctx.deadlineMs) },
    body: JSON.stringify(payload),
  })
}
```

Here, the `x-deadline-ms` header carries "how much time is left for this request" to the next hop; each service decides based on its own processing time subtracted from that budget. Retries and circuit breakers run on a similar budget logic — we cover both in detail in [our guide to retries, backoff, and circuit breakers](/en/posts/retries-backoff-circuit-breakers).

## What is "brownout mode," and how is it different from normal operation?

Brownout mode is a controlled degradation state where a service deliberately does less work instead of collapsing entirely. An e-commerce site under heavy load, for example, might temporarily disable product recommendations, personalized banners, or secondary API calls while keeping only "add to cart" and checkout alive.

The difference from rate limiting is that brownout reduces the cost of a request rather than rejecting it outright — the user still gets a response, just a cheaper one. We compare token-bucket and sliding-window rate-limiting algorithms in [our dedicated piece on the topic](/en/posts/rate-limiting-token-bucket-vs-sliding-window); rate limiting typically caps fair usage per client, while load shedding focuses on protecting the whole system's capacity.

## Which observability signals should you actually watch?

Four signals are the early tell of overload: queue depth, p99 latency, retry rate, and rejection rate. If queue depth spikes at the same time retry rate rises, that's usually the sign a feedback loop has already started — the point to intervene is right there, not after load shedding has already kicked in.

Our take: the most common mistake teams make is only starting to watch these signals after a production outage has already happened. Chaos engineering is the cheapest way to test these signals before a real outage forces the issue; we cover how small teams can start in [our chaos engineering guide](/en/posts/chaos-engineering-small-teams).

## A real outage: what would shedding have prevented?

Picture a typical scenario from a mid-sized SaaS team in late 2025: a marketing campaign went unexpectedly viral, and traffic quadrupled in ten minutes. The system had an unbounded queue, so it accepted every incoming request — but since processing throughput stayed flat, queue depth climbed into the thousands within minutes. Clients started timing out after 30 seconds and retrying, adding a second wave onto an already-full queue. Within 40 minutes, the entire service stopped responding even to traffic well below its actual capacity.

Had the system had an admission-control-based shedding layer in place, low-priority requests (analytics calls, recommendation-engine lookups) would have been rejected instantly once the queue hit a set depth, preserving capacity for critical flows like "add to cart" and checkout. Some users would have seen an error message, but the whole service wouldn't have gone down — that's the difference between "slow for everyone" and "fast for most, a clear error for some."

## Where do you start in a simple system with no service mesh?

Short answer: bounded queue first, then admission control. Even before setting up a service mesh or a complex distributed system, adding a simple capacity-based admission-control layer in front of a single service — returning a 503 once incoming request volume exceeds a set multiple of processing throughput — is a sufficient first step for most small teams. We also cover how this kind of capacity testing fits into a deploy strategy in [our blue-green vs canary deployments guide](/en/posts/blue-green-vs-canary-deployments) — a gradual traffic ramp is a safe way to test shedding thresholds before they go live.

## Frequently Asked Questions

### Should you implement backpressure or load shedding first?

Short answer: usually both, but backpressure comes first in the chain. Backpressure slows the upstream sender to prevent the queue from growing in the first place; if the queue still exceeds capacity, load shedding kicks in to reject low-priority requests outright.

### How do you size a bounded queue?

Short answer: work backward from your acceptable maximum latency budget — every request sitting in the queue is spending its own time budget while it waits, so an oversized queue only produces "late but successful" responses.

### Doesn't load shedding make the user experience worse?

Short answer: no, not when it's done right — the goal is to reject non-critical requests early with a clear error, rather than slowing every user down equally; that beats a UI that silently hangs.

### Are backpressure and rate limiting the same thing?

Short answer: no. Rate limiting caps fair usage per client against a pre-set threshold, while backpressure dynamically signals slowdown based on the service's real-time capacity state.

**Sources:** [SRE School — What is Backpressure?](https://sreschool.com/blog/backpressure/), [SRE School — What is Load Shedding?](https://sreschool.com/blog/load-shedding/), [Codelit.io — Backpressure Patterns](https://codelit.io/blog/backpressure-flow-control).
