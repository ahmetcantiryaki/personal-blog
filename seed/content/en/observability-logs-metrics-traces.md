---
title: "Observability 101: Logs, Metrics, and Traces"
slug: "observability-logs-metrics-traces"
translationKey: "observability-101"
locale: "en"
excerpt: "What is observability? A practical guide to the three pillars of logs, metrics, and traces, how it differs from monitoring, and how to build it with OpenTelemetry in 2026."
category: "devops-cloud"
tags: ["observability", "monitoring", "devops", "sre"]
publishedAt: "2026-05-26"
seoTitle: "Observability: Logs, Metrics, and Traces Guide"
seoDescription: "A practical guide to observability logs metrics traces: the three pillars, how it differs from monitoring, and how to build it with OpenTelemetry in 2026."
---

Observability is your ability to understand what's happening inside a system from the outputs it emits: logs, metrics, and traces. The goal is to answer questions you never predefined, in production, without shipping new code or building a new dashboard first. This guide covers observability through its three pillars: logs, metrics, and traces.

Monitoring is "seeing that something you already knew about broke." Observability is "asking why something you never anticipated broke." In modern distributed systems, where one request fans out across fifteen services, you can't operate without the second.

## What is observability?

Observability is the ability to infer a system's internal state from the telemetry it produces. Borrowed from control theory, the concept lands in software as three signal types: **logs** (what happened), **metrics** (how much), and **traces** (where and how long). Together they let you ask new questions in production without shipping new code to answer them.

The distinction that matters: observability is a **property** of your system, not a tool you buy. If you emit rich, contextual telemetry, your system is observable; if you don't, the most expensive Grafana license in the world won't save you.

What binds the three signals is **context**. When the same `trace_id` appears in a log line, a metric label, and a span, you can pivot from one signal to the next and narrow a problem down in minutes instead of hours.

## What's the difference between observability and monitoring?

Monitoring watches metrics and thresholds you defined in advance; it catches "known unknowns." Observability lets you explore raw telemetry to investigate "unknown unknowns." Monitoring tells you something is broken; observability lets you ask why. They aren't rivals — they're layered, with monitoring sitting on top of a solid observability foundation.

| Dimension | Monitoring | Observability |
|-----------|-----------|---------------|
| Core question | Is something broken? | Why is it broken? |
| Covers | Known unknowns | Unknown unknowns |
| Approach | Predefined dashboards/alerts | Ad-hoc exploration, queries |
| Cardinality | Low (a few labels) | High (user_id, request_id) |
| Output | "CPU at 90%" | "These 3 customers stall on this span" |
| When | Failures you expect | Failures you've never seen |

In practice, monitoring is a subset of observability. Build a solid telemetry foundation and your monitoring dashboards become views on top of that data.

## What are the three pillars of observability?

The three pillars of observability are logs, metrics, and traces. Logs are timestamped records of discrete events; metrics are numeric measurements aggregated over time; traces show a request's end-to-end journey across services. Each answers a different question, and the real power appears when you link all three through a shared `trace_id`.

### Logs: what happened?

Logs are discrete records of what occurred. In 2026 the right approach is **structured logging**: JSON, not free text. That way you can run queries over your logs, not grep.

```json
{
  "timestamp": "2026-05-26T09:14:22.418Z",
  "level": "error",
  "service": "checkout-api",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "user_id": "u_88213",
  "msg": "payment provider timeout",
  "provider": "stripe",
  "latency_ms": 3021
}
```

That `trace_id` is gold: it lets you jump from this line straight to the request's trace and the metrics for that moment in one click. Unstructured logs can't build that bridge.

### Metrics: how much?

Metrics are numeric measurements aggregated over time: requests per second, p99 latency, error rate, queue depth. They're cheap, compressible, and cheap to retain long-term, which makes them ideal for alerting and trends.

The framework teams reach for most is **RED** (Rate, Errors, Duration) for services and **USE** (Utilization, Saturation, Errors) for infrastructure. A histogram query in Prometheus looks like this:

```promql
# checkout-api p99 latency (5-minute window)
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket{service="checkout-api"}[5m]))
  by (le)
)
```

The weak point of metrics is cardinality. Tag every metric with something high-cardinality like `user_id` and your time-series database blows up; leave those questions to traces and logs.

### Traces: where and how long?

Traces show a request's journey through a distributed system as a tree of spans. Each span represents an operation (a DB query, an HTTP call), with a duration, a parent span, and tags. In microservices, the only real answer to "where's the latency?" lives in traces.

A trace turns "the request took 3 seconds" into "because the query in the `checkout → inventory → postgres` chain waited 2.7 seconds." Without that visibility, debugging distributed latency becomes a guessing game.

## How do you build observability with OpenTelemetry?

The standard way to build an observability stack in 2026 is to instrument with OpenTelemetry (OTel), then ship the data through a Collector to your backends. OTel gives you one vendor-neutral API for logs, metrics, and traces, so you instrument your code once and swap backends whenever you like. Here's a practical setup order:

1. **Pick your signals.** Start with RED metrics, structured logs, and traces on critical paths — not everything at once.
2. **Add the OpenTelemetry SDK.** Install the OTel library for your language; web frameworks and HTTP/DB clients are mostly auto-instrumented.
3. **Turn on context propagation.** Make sure `trace_id` travels across services via the W3C `traceparent` header.
4. **Deploy an OTel Collector.** Your apps send telemetry to the Collector, which centralizes sampling, filtering, and routing.
5. **Route to backends.** Metrics to Prometheus, traces to Tempo/Jaeger, logs to Loki/Elasticsearch — or one platform like Grafana, Datadog, or Honeycomb.
6. **Inject trace into logs.** Add the active `trace_id` to every log line; this is the glue that links all three signals.
7. **Choose a sampling strategy.** At high volume, use tail-based sampling to always keep errored and slow traces plus a fraction of the successful ones.
8. **Wire SLOs and alerts.** Build error-budget SLOs on top of the raw signals; prefer symptom-based alerts over noisy threshold alarms.

The critical step is number 6. If you can pivot from a log to its trace to the metrics for that time window in one click during an incident, your mean time to resolution drops. Skip those bridges and you're fighting blind across three separate tabs.

## Which signal should you use when?

Simple rule: **metrics to alert, traces to locate, logs for root cause.** A metric catches an SLO breach, the slow traces from that window show which span the latency lives in, and the structured logs tied to that span tell you exactly what blew up. Using all three in sequence is far faster than any one alone.

A real incident: checkout p99 jumped from 400 ms to 3 s (metric). We opened the slow traces for that window; the latency was a single Postgres span in the `inventory` service (trace). We filtered logs by that span's `trace_id` and found a query doing a seq scan because of a missing index (log). Total debugging time: about ten minutes. Without linked signals it would have taken half a day.

Explore our related pieces too: our guide to Docker best practices for production, our writeup on Kubernetes cost optimization, and our deep dive on what platform engineering is. The DevOps and cloud category page links the full cluster.

## Frequently Asked Questions

### Are observability and monitoring the same thing?

No. Monitoring watches metrics and thresholds you defined in advance and catches known failures. Observability lets you explore raw logs, metrics, and traces to investigate failures you never anticipated. Monitoring tells you something broke; observability lets you ask why. Monitoring is a layer that sits on top of a solid observability foundation.

### What are the three pillars of observability?

The three pillars are logs, metrics, and traces. Logs are timestamped records of discrete events (what happened), metrics are numeric measurements aggregated over time (how much), and traces show a request's journey across services (where and how long). They're strongest together, linked by a shared `trace_id`.

### What is OpenTelemetry and why does it matter?

OpenTelemetry (OTel) is an open, vendor-neutral standard for collecting logs, metrics, and traces, and it's the de facto industry norm in 2026. You instrument your code once and send the data to any backend you want — Prometheus, Jaeger, Grafana, Datadog. That removes vendor lock-in and lets you switch backends without re-instrumenting.

### Do small teams need a full observability stack?

No — you need the right foundations more than a huge stack. Start with structured (JSON) logging, a few RED metrics, and traces on critical paths, all flowing through OpenTelemetry. A managed platform (Grafana Cloud, Honeycomb, Datadog) lets small teams start without running their own Prometheus and Elasticsearch clusters.
