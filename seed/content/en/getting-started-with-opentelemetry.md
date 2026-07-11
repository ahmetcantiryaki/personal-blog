---
title: "Getting Started with OpenTelemetry"
slug: "getting-started-with-opentelemetry"
translationKey: "opentelemetry-getting-started"
locale: "en"
excerpt: "What does instrumenting a service end-to-end with OpenTelemetry actually look like? SDK to Collector, sampling to vendor-neutral export, step by step."
category: "devops-cloud"
tags: ["observability", "monitoring", "devops", "cloud"]
publishedAt: "2026-07-11"
seoTitle: "Getting Started with OpenTelemetry: Step-by-Step"
seoDescription: "What does instrumenting a service end-to-end with OpenTelemetry actually look like? SDK to Collector, sampling to vendor-neutral export, step by step."
---

A payment service's p99 latency suddenly tripled, and none of the dashboards explained why. Logs lived in one tool, metrics in another, and there was no distributed tracing at all. Finding the root cause took four hours — most of it spent manually correlating which service handled which request and when. It's the story every team without a unified telemetry layer eventually lives through.

[OpenTelemetry](https://opentelemetry.io/docs/) (OTel) solves this by collecting logs, metrics, and traces under a single vendor-neutral standard. This piece walks through instrumenting one service end to end.

## SDK vs. auto-instrumentation

OTel offers two instrumentation paths. **Auto-instrumentation** produces traces and metrics for popular frameworks and libraries (Express, FastAPI, Spring) with no code changes — you attach an agent or a startup script and it just runs. **Manual instrumentation with the SDK** lets you add spans and metrics specific to your own business logic — useful when you want to see exactly how long a function took or how often a business rule fired.

The practical approach: start with auto-instrumentation (HTTP calls, database queries, and outbound calls become visible immediately at the framework level), then add manual spans for critical workflows. Mixing the two is fine — auto-instrumentation's context propagates automatically into your manual spans.

```js
const tracer = trace.getTracer('payment-service')

async function processPayment(order) {
  return tracer.startActiveSpan('processPayment', async (span) => {
    span.setAttribute('order.id', order.id)
    try {
      const result = await chargeCard(order)
      return result
    } finally {
      span.end()
    }
  })
}
```

## The Collector: your routing hub

The OTel Collector is the single point your applications send telemetry to. Its job fits in three words: receive, process, export. Services send data to the Collector, not directly to an observability backend; the Collector runs that data through sampling, filtering, and PII scrubbing, then fans it out to however many backends you want.

That indirection buys real flexibility: when you want to switch backends (say, moving from Datadog to a self-hosted Grafana LGTM stack), the only thing that changes is the Collector configuration — your application code stays untouched.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:
exporters:
  otlphttp:
    endpoint: "https://your-backend:4318"
processors:
  batch:
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp]
```

## Why vendor-neutral export matters

OpenTelemetry plus a self-hosted backend has become the standard way to break vendor lock-in in 2026. There's a concrete payoff to it: per [HAMS Tech's analysis](https://www.hams.tech/blog/opentelemetry-migration-2026-grafana-lgtm-cost-optimization.html), teams migrating to an OTel-plus-Grafana-LGTM architecture cut MTTR from hours to minutes — because metrics, logs, and traces correlate inside one tool, eliminating the need to switch between systems mid-incident.

It also buys negotiating leverage: if your instrumentation is tied to the OTel standard, switching backends doesn't mean rewriting application code — it means changing where the Collector exports to.

| Approach | Vendor lock-in | Switching cost | MTTR impact |
|---|---|---|---|
| Vendor SDK (direct) | High | Requires code rewrite | Depends on tool |
| OTel + single backend | Low | Collector config only | Moderate |
| OTel + Collector + multi-export | None | Zero code changes | Low (correlated data) |

## Sampling and cardinality control

Tracing 100% of requests inflates storage costs fast on high-traffic services. Collector processors are where you handle this: tail-based sampling always keeps traces that error out or run slow, while sampling normal traffic at a lower rate. That's far more valuable than a blunt "sample everything at 5%" rule — you never miss the anomalies that actually matter.

Cardinality control is a separate discipline: tagging every metric with a user ID or request ID explodes your backend's time-series count. The general rule is to keep high-cardinality values — IDs, timestamps — as trace attributes, not metric labels.

## Correlating logs with traces

One of OTel's most overlooked benefits is that logs and traces share the same context. Set up correctly, every log line your application emits automatically carries the current trace ID and span ID. That removes the "find the trace, then manually search for that request's logs" step when investigating an incident — click into a trace in your backend and the matching logs are already right there.

Getting this requires configuring your logging library to read from OTel's context; most modern logging libraries (pino, winston, structlog) have an official or community plugin for it. Once it's set up, the time your team spends answering "which log line belongs to which request" largely disappears — in a distributed system, that saves real minutes mid-incident.

```js
logger.info('payment charged', {
  trace_id: trace.getActiveSpan()?.spanContext().traceId,
  span_id: trace.getActiveSpan()?.spanContext().spanId,
})
```

## Validating your first trace

The minimum step to confirm your setup works: bring up the Collector, start a service with auto-instrumentation, send it a request, and look up that request's trace ID in your backend. If the trace shows up with spans matching the service boundaries you'd expect (an HTTP call, a database query), the setup is working.

Pairing this validation step with the resource-monitoring practices from [Kubernetes Cost Optimization: 10 Tactics](/en/posts/kubernetes-cost-optimization) means you get both performance and cost visibility from the same telemetry layer. If you're curious about a zero-instrumentation approach, [eBPF for Observability, Explained](/en/posts/ebpf-for-observability-explained) covers an alternative that complements OTel rather than replacing it.

## Frequently Asked Questions

### How does OpenTelemetry relate to the logs/metrics/traces trio from your [Observability 101](/en/posts/observability-logs-metrics-traces) piece?

OTel is the standard protocol and SDK set used to collect and transport that trio. If you already understand the conceptual framework, OTel is the answer to how you actually implement it in production.

### How should I deploy the Collector on Kubernetes?

The most common pattern combines a per-node DaemonSet Collector (local collection) with a centralized Deployment Collector (processing and export). This maps naturally onto the declarative configuration principles in [GitOps Explained](/en/posts/gitops-explained) — Collector config can live in version control just like everything else.

### How does auto-instrumentation affect performance?

It typically adds single-digit-percentage overhead; tail-based sampling and batch processors reduce that further. For services on a critical path, it's a good habit to validate with a load test in staging first.

### Is OTel necessary for a small team, or is it over-engineering?

If you have one service and one logging tool, it's probably early. The moment you have multiple services, multiple languages, or a "which backend should we use" debate starts, OTel's standardization value more than covers its setup cost.

### How long does migrating from an existing vendor SDK (say, the Datadog agent) to OTel take?

For a single service, usually a day or two — most vendor SDKs already support OTLP export or have a close equivalent. The part that actually takes time is migrating existing dashboards and alert rules to the new backend, which is why migrating service by service is far safer than doing it all at once.
