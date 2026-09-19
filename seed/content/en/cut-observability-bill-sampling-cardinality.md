---
title: "Cut Your Observability Bill: Sampling and Cardinality"
slug: "cut-observability-bill-sampling-cardinality"
translationKey: "cut-observability-bill-sampling-2026"
locale: "en"
excerpt: "Short answer: stop collecting everything. Tail-based sampling, cardinality limits, and tiered retention cut the bill without losing incident debugging power."
category: "devops-cloud"
tags: ["observability", "cost-optimization", "finops", "monitoring"]
publishedAt: "2026-09-19"
seoTitle: "Cut Your Observability Bill: Sampling & Cardinality"
seoDescription: "How to reduce observability costs in 2026 without losing debugging power, using tail-based sampling, cardinality control, and log-level discipline."
---

Short answer: apply sampling and cardinality discipline at the collection layer, not a cheaper vendor migration. Most teams over-collect, logging at DEBUG in production, keeping every trace unsampled, and letting metric labels grow unbounded, then pay to store data nobody ever queries. Tail-based sampling alone typically delivers 70–80% of the total savings.

When the observability bill climbs, the first instinct is "let's switch off Datadog for something cheaper." That misses the real lever entirely, the same one covered in [observability logs, metrics, and traces](/en/posts/observability-logs-metrics-traces): the problem is volume, not the vendor. As of 2026, the [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)'s `tail_sampling` processor, plus two upstream improvements from Elastic, make it practical to stop collecting 100% verbose logs and unsampled traces at scale.

## Why do observability bills explode?

Bills explode because three things grow without a ceiling: log line count, trace span count, and metric label cardinality (the number of unique label value combinations a metric can produce). None of it is malicious, it accumulates from a "just in case we need it" habit, and the storage and indexing cost of data nobody queries becomes a line item on its own.

Three sources cause most of the damage:

- **DEBUG/TRACE logging left on in production.** Most of those lines are never read before they're indexed and paid for.
- **Unsampled traces.** Every request, even a fast, healthy one, gets stored as a complete trace.
- **Cardinality explosions.** Turning `user_id`, raw URLs, or `request_id` into metric labels means every unique combination opens a new stored time series, multiplying cost.

Together these three can inflate a bill by 20–40% a month with no change in actual traffic. The fix is not more storage budget, it's reducing volume at the source.

## What is tail-based sampling?

Tail-based sampling is a technique that waits for a trace to finish, then decides whether to keep it. Unlike head-based sampling, which makes a random keep/drop decision the moment a request starts, tail-based sampling looks at how the trace actually ended, error or success, slow or fast, and applies a policy accordingly.

The OpenTelemetry Collector's `tail_sampling` processor implements this with policies: keep 100% of traces that contain an error, keep only 5–10% of healthy, successful traces. According to [Datadog's engineering writeup on tail-based sampling](https://www.datadoghq.com/blog/control-trace-volume-with-opentelemetry-tail-based-sampling/), real deployments report cutting span volume by up to 89% while preserving full fidelity on every failure case. The trace you actually need to debug an incident is never the one that gets sampled away; only clean, uneventful traffic is.

A minimal Collector config looks like this:

```yaml
processors:
  tail_sampling:
    decision_wait: 10s
    num_traces: 100000
    policies:
      - name: keep-all-errors
        type: status_code
        status_code:
          status_codes: [ERROR]
      - name: sample-healthy-traffic
        type: probabilistic
        probabilistic:
          sampling_percentage: 7
```

This config keeps every error trace and samples only 7% of healthy traffic. `decision_wait` is how long the processor holds a trace in memory before deciding, and that wait is exactly what drives the memory cost covered next.

## What changed with Elastic's 2026 contributions?

In 2026, Elastic upstreamed two improvements to the OTel Collector's tail sampling processor: a `span-ingest` sampling strategy that lets decisions happen at ingest time, and a Pebble LSM-based disk storage extension (`pebbletailstorageextension`). Together they target the two operational pain points that have historically kept teams from running tail sampling at scale: latency and memory.

The `span-ingest` strategy lets traces release before the full `decision_wait` window elapses, shortening the time traces take to reach the backend in low-latency pipelines. As detailed on [Elastic's observability labs blog](https://www.elastic.co/observability-labs/blog/tail-sampling-memory-opentelemetry), the `pebbletailstorageextension` moves in-flight trace data from memory to a Pebble LSM-based disk store, cutting the processor's memory usage by up to 65%.

The practical effect: teams that previously disabled tail sampling on high-traffic services because it consumed too much memory can now run it in production. As covered in [eBPF for observability, explained](/en/posts/ebpf-for-observability-explained), the biggest efficiency wins at the collection layer come without touching application code at all.

## How do you control metric cardinality?

Cardinality is the total number of unique label value combinations a metric can produce; every new combination opens a separate stored time series and multiplies cost directly. Controlling it means dropping or hashing high-cardinality fields, user IDs, raw URLs, request IDs, at the Collector before they ever become metric labels.

Three rules do most of the work:

1. Never turn identity fields (user_id, session_id) into metric labels; keep them as correlation IDs in logs and traces instead.
2. Use route patterns instead of raw URLs (`/users/{id}`, not `/users/8421`).
3. Add an `attributes` or `transform` processor in the Collector to hash or drop high-cardinality fields before they reach the backend.

This is the second line of defense on top of tail-based sampling, and on its own it typically adds another 5–15% in savings.

## How should you set log levels and retention?

Log-level discipline means dropping DEBUG/TRACE in production, sampling INFO, and keeping 100% of WARN and ERROR. Tiered retention means keeping hot storage for 7–14 days and pushing anything older to cold storage or aggregates. Together they stack incremental, predictable savings on top of sampling.

The table below summarizes recommended rates and retention by data type:

| Data type | Recommended sampling rate | Retention | Why |
|---|---|---|---|
| Error traces/logs | 100% | 30–90 days | Full fidelity required for incident debugging |
| Healthy traces | 5–10% | 7–14 days hot | Enough for trend and latency distribution |
| DEBUG/TRACE logs | 0% (off in production) | — | Rarely if ever queried |
| INFO logs | 10–30% sampled | 7–14 days hot | Enough context, low volume |
| WARN/ERROR logs | 100% | 30–90 days | Critical for early warning and postmortems |
| High-cardinality metric labels | Hash or drop | — | Each combination opens a new time series |

## What should you never cut?

Never sample away error-path traces and logs, and never drop the trace IDs and correlation IDs needed to reconstruct an incident afterward. Sampling healthy traffic is safe; sampling failure traffic is not, because that's precisely the data you need at the moment you need it most.

Here's the contrarian but simple part: aggressive sampling doesn't weaken incident response, it strengthens it, because it cuts noise while keeping the actual signal, errors and slow requests, at full fidelity. A team trying to cut the bill should ask "what data do we never query" before asking "what data can we never afford to lose"; the gap between those two answers is the 70–80% you can safely cut.

This discipline matters even more in fast-growing areas like [LLM observability and tracing](/en/posts/llm-observability-tracing), where trace payloads are large and unsampled collection makes the bill spiral within weeks. If you're tackling cloud costs more broadly, [FinOps: reduce cloud costs](/en/posts/finops-reduce-cloud-costs) follows the same measure-first, cut-second logic.

The rollout order matters. Turn on tail-based sampling first, since it's the biggest single win at 70–80% of total savings. Add cardinality controls next. Tighten log levels and retention last. Measure both the bill and incident resolution time after each step; if resolution time gets worse, don't move to the next step until you've fixed that first.

## Frequently Asked Questions

### What's the difference between tail-based and head-based sampling?

Head-based sampling makes a random keep-or-drop decision at the start of a request, before it knows how the trace will end. Tail-based sampling waits until the trace completes and decides based on whether it errored or ran slow, which makes it far less likely to drop the traces you actually need for debugging.

### What's the biggest downside of tail-based sampling?

The biggest downside is memory and latency: the processor has to hold every span of a trace in memory until it completes. In 2026, Elastic's contribution of a Pebble LSM-based disk storage extension cut that memory usage by up to 65%, largely removing this as a blocker for production use.

### Does cardinality control replace sampling?

No, they solve different problems and complement each other. Sampling reduces trace and log volume, while cardinality control limits the number of stored metric time series; applying both together produces higher total savings than either one alone.

### Will aggressive sampling make me miss incidents?

Not if you keep 100% of error traces and only reduce the sampling rate on healthy traffic to 5–10%, since the data you need for incident debugging is already preserved at full fidelity on the error path. The real risk is starting to sample error traces too, which should never happen.
