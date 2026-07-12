---
title: "Getting Started with OpenTelemetry"
slug: "getting-started-with-opentelemetry"
translationKey: "opentelemetry-getting-started"
locale: "en"
excerpt: "A step-by-step walkthrough of instrumenting one service and exporting traces, metrics, and logs vendor-neutrally through the OTel Collector."
category: "devops-cloud"
tags: ["observability", "monitoring", "devops", "open-source", "cloud"]
publishedAt: "2026-07-12"
seoTitle: "Getting Started with OpenTelemetry: Traces, Metrics, Logs"
seoDescription: "A step-by-step walkthrough of instrumenting one service and exporting traces, metrics, and logs vendor-neutrally through the OTel Collector."
---

You notice a microservice getting slower, but you can't see where it's stuck — logs live in one system, metrics in another dashboard, and there's no trace at all. [OpenTelemetry (OTel)](https://opentelemetry.io/docs/what-is-opentelemetry/) exists to close exactly that gap: it collects traces, metrics, and logs under one vendor-neutral standard, so your instrumentation code stays the same even if you swap the backend tomorrow.

This guide walks through instrumenting a single service end to end: the difference between SDK and auto-instrumentation, why the Collector functions as a routing hub, exporting to a self-hosted backend to dodge vendor lock-in, and sampling plus cardinality control.

## SDK instrumentation vs. auto-instrumentation

OTel gives you two main paths. **Auto-instrumentation** wraps common libraries (HTTP clients, ORMs, message queues) without touching your application code, producing traces out of the box — in Python, Java, and .NET it's set up in minutes with an agent or a launcher script. **Manual SDK instrumentation** lets you add spans and attributes specific to your business logic; auto-instrumentation rarely answers "why did this payment take 3 seconds." The practical approach combines both: get baseline visibility fast with auto-instrumentation, then hand-instrument the critical paths.

```python
from opentelemetry import trace

tracer = trace.get_tracer("checkout-service")

with tracer.start_as_current_span("calculate_shipping") as span:
    span.set_attribute("order.item_count", len(items))
    cost = calculate_shipping(items)
    span.set_attribute("shipping.cost_cents", cost)
```

## The Collector: why not export straight to a backend

Rather than wiring your application directly to an observability vendor, the recommended path is exporting to the [OTel Collector](https://opentelemetry.io/docs/collector/). The Collector separates receiving (ingest), processing (batching, sampling, redacting sensitive data), and exporting (to one or more backends) from your application code. In practice that means moving your backend from Jaeger to Grafana Tempo, or to any other open-source stack, is a single config file change — your application code never has to be touched.

```yaml
# collector-config.yaml — minimal example
receivers:
  otlp:
    protocols:
      grpc:
      http:
exporters:
  otlp:
    endpoint: "tempo:4317"
    tls:
      insecure: true
processors:
  batch:
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
```

## Exporting to a self-hosted backend to avoid lock-in

Because OTel separates instrumentation from the backend, code you instrument once with the SDK works no matter which backend you point it at. Exporting to open-source options like the Grafana LGTM stack (Loki, Grafana, Tempo, Mimir) or Jaeger keeps costs under your control and preserves your freedom to switch vendors. As of 2026, OTel integrates directly with dozens of platforms — Google Cloud, AWS X-Ray, Azure Monitor, Datadog, New Relic, Honeycomb, and Jaeger among them — which is what makes it the de facto industry standard at this point.

Once you can see traces, metrics, and logs in the same context, teams report jumping from a dashboard anomaly to the relevant log, then straight to the trace showing exactly which service caused the bottleneck, in seconds — some 2026 case studies report MTTR dropping from hours to minutes. To be honest rather than throw out an unverifiable precise percentage: that improvement depends mostly on being able to correlate all three signals in one context, not on adopting OTel by itself.

## Sampling and cardinality control

Tracing every single request quickly inflates both storage cost and backend load on a high-traffic service. Head-based sampling — deciding at the start of a request whether to keep it, at a fixed rate — is simple and cheap but can miss rare errors; tail-based sampling collects the full trace and only keeps the ones with errors or high latency, at the cost of more memory and more complex Collector configuration. On the cardinality side, the most common mistake is using a high-cardinality value like a user ID as a metric label — that explodes your metrics backend's time-series count and can blow up your bill; values like that belong on span attributes, not metric labels.

| Sampling strategy | Cost | Catches rare errors | Implementation complexity |
|---|---|---|---|
| Head-based (fixed rate) | Low | No (down to statistical luck) | Low |
| Head-based (adaptive rate) | Medium | Partially | Medium |
| Tail-based | High | Yes | High (requires Collector state) |

## Semantic conventions: why not invent your own attribute names

A less-discussed but critical piece of OTel is semantic conventions — standardized attribute names for common concepts like HTTP status code, database system name, or error message (`http.response.status_code`, `db.system.name`, and so on). The payoff of using this standard instead of inventing your own attribute names is that traces produced by different teams, or services written in different languages, become filterable in the same dashboard with the same query. If you're running LLM-backed services, the `gen_ai.*` attribute family (for model name, token counts, tool calls) has become the field's vendor-neutral baseline — using it instead of your own namespace means you won't need to rewrite your instrumentation later if you switch to a dedicated LLM observability tool.

## Validating your first trace

Once the Collector is up and your application is instrumented, the first check should be simple: send a request, then confirm it shows up in your backend (Jaeger UI, Grafana Tempo, or whatever you picked) with its spans attached. If the span count is lower than expected, the usual culprit is auto-instrumentation not covering some library; if spans appear but the duration looks nonsensical, check clock synchronization (NTP) across your hosts.

If you're running this on Kubernetes, correlating traces with the resource-usage data we cover in our [Kubernetes cost optimization guide](/en/posts/kubernetes-cost-optimization) lets you pinpoint which pod is slowing down a request in seconds. If you want to fill this gap at the kernel level, with zero application code touched, check out our [eBPF for observability guide](/en/posts/ebpf-for-observability-explained) — the two aren't competitors, they're complementary layers. For the fundamentals at a more introductory level, our [Observability 101 guide](/en/posts/observability-logs-metrics-traces) is a good starting point, and if you're considering standing up a platform team, our [what is platform engineering guide](/en/posts/what-is-platform-engineering) is worth a read too.

For more DevOps and observability practices, browse our [DevOps & Cloud category](/en/category/devops-cloud).

## Frequently Asked Questions

### Which backends does OpenTelemetry work with?

Nearly all of them — Google Cloud, AWS X-Ray, Azure Monitor, Datadog, New Relic, Honeycomb, Jaeger, and more support the OTLP protocol. That means you can switch backends without changing your instrumentation code.

### Is auto-instrumentation enough, or do I need manual spans?

Auto-instrumentation gives you a solid baseline for getting started. But to answer "why is this slow" with business-logic-specific detail, you need manual spans and attributes on your critical paths.

### Can I export straight to a backend without a Collector?

Technically yes, but it's not recommended. Without a Collector, switching backends means redeploying every application; with one, it's a single config file change.

### When is tail-based sampling actually necessary?

When you can't afford to miss rare-but-critical errors — say, a timeout that only happens 0.1% of the time. Head-based sampling's fixed rate will likely leave events that rare out of the sample.
