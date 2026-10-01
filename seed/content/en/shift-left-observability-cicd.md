---
title: "Shift-Left Observability in Your CI/CD Pipeline"
slug: "shift-left-observability-cicd"
translationKey: "shift-left-observability-cicd-2026"
locale: "en"
excerpt: "Shift-left observability moves traces and metrics into testing and CI/CD, so a regression shows up in a pull request instead of a pager alert."
category: "devops-cloud"
tags: [observability, ci-cd, devops, monitoring]
publishedAt: "2026-10-01"
seoTitle: "What Is Shift-Left Observability? A CI/CD Setup Guide"
seoDescription: "Shift-left observability moves telemetry into testing and CI/CD: an OpenTelemetry setup, SLOs as code, synthetic checks, and cardinality pitfalls."
---

Short answer: shift-left observability means moving log, metric, and trace collection out of production and back into testing and your CI/CD pipeline. The goal is to catch a problem at the pull-request stage, before a user ever notices it — instead of firefighting it in production.

## What is shift-left observability?

Traditional observability focuses on watching how a system behaves in production: logs, metrics, and traces get collected from live traffic. The shift-left approach moves that same telemetry — standard libraries, instrumentation, monitoring hooks — earlier in the development cycle, into the build and test stages.

In practice, this means a developer running their test suite sees not just a pass/fail result, but the trace for that test run too. A regression gets caught as a trace anomaly in CI, before it ever reaches production.

## What does instrumenting telemetry earlier actually mean?

There are four concrete practices, and together they let a team predict a change's production behavior before it ever gets merged.

- **Traces in tests:** Integration tests produce a service's call chain in the same format production traces use, so CI can diff that trace against an expected baseline.
- **SLOs as code:** Service-level objectives (like "p99 latency under 200ms") live in a YAML file, and CI checks whether a PR violates that target during the build.
- **Synthetic checks in pipelines:** Synthetic requests that simulate real user traffic run against staging right after deploy, before the change ever reaches production.
- **Telemetry in preview environments:** If every PR gets its own [branching preview database](/en/posts/branching-preview-databases-every-pr) and environment, the same instrumentation used in production gets wired into that environment too — so a performance regression shows up before merge.

Mapping those four practices to pipeline stages:

| Pipeline Stage | Telemetry Collected | Purpose |
|---|---|---|
| Unit/integration test | Trace (test environment) | Catch a regression before merge |
| CI build | SLO-as-code check | See whether a PR violates the target |
| Staging deploy | Synthetic check | Confirm behavior before it reaches prod |
| Preview environment | Full telemetry (prod-like) | Catch a per-PR performance regression |
| Production | Logs + metrics + traces | Real user behavior, long-term SLO tracking |

## Does shift-left replace production monitoring (shift-right)?

No — the two feed each other. Shift-left observability doesn't replace watching real production traffic (shift-right); it adds an early-warning layer on top of it. In practice, the loop works like this: real traces and SLO violations collected in production get used to update the "baseline" traces in CI. Production data decides what the next PR gets compared against in CI — the loop closes.

Without that closed loop, shift-left's reference point becomes a static trace file that goes stale fast. If an e-commerce team feeds the checkout flow's weekly production p99 latency back into the CI SLO rule, that rule doesn't drift away from real user behavior over time. Skip automating that feedback, and an SLO rule tends to drift either too loose or too strict within a few months, and developers stop trusting it.

When a platform team builds that loop, it turns the log/metric/trace trio covered in our [Observability 101](/en/posts/observability-logs-metrics-traces) guide from a one-way monitoring tool into a feedback system that feeds both ends of the development cycle.

## Should developers or the platform team own the signals?

Both, at different layers. The platform team provides the instrumentation standard, the collection infrastructure, and default dashboards; the developer owns which signals their service emits and what those signals mean. If a developer can't read their own service's trace, shift-left loses its real benefit — the signal exists, but nobody's looking at it.

This ownership split mirrors the self-service principle from [platform engineering](/en/posts/platform-engineering-vs-devops): the platform team builds the infrastructure, and the development team uses it inside their own workflow.

## How do you correlate cost with performance data?

There's a side benefit to collecting telemetry earlier: cost data becomes visible earlier too. Comparing the trace volume a PR produces in CI against its expected production cardinality is the cheapest way to [cut your observability bill before it grows](/en/posts/cut-observability-bill-sampling-cardinality). If a change already adds a high-cardinality tag in CI — a metric label keyed on user ID, say — that gets caught before merge, not after the bill spikes in production.

## How do you set up a starter OpenTelemetry pipeline?

The fastest start: pick a language with mature auto-instrumentation support (Java, Go, Python, Node.js, .NET) and add one step to your CI pipeline — export test traces to an OpenTelemetry Collector and diff the result against a baseline trace.

```yaml
# .github/workflows/test-with-tracing.yml
steps:
  - name: Run integration tests with tracing
    run: npm test
    env:
      OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318
      OTEL_SERVICE_NAME: checkout-service-ci
  - name: Compare trace against baseline
    run: otel-diff --baseline ./baseline-trace.json --current ./ci-trace.json
```

This setup builds directly on the basic instrumentation covered in our [getting started with OpenTelemetry](/en/posts/getting-started-with-opentelemetry) guide; the only difference in CI is that the trace points at a test environment instead of production.

## What are the pitfalls of shift-left observability?

The two most common traps: alert fatigue and cardinality blowups. Adding a new synthetic check or SLO rule to every PR quickly fills CI with meaningless red flags, and developers start ignoring them. Similarly, using high-cardinality tags in tests — a unique ID per test run, for example — inflates CI's own observability footprint, reproducing the exact problem you were trying to prevent, just inside CI instead of production.

Our take is that the practical fix is to resist spreading shift-left everywhere at once: apply it to one critical service and one SLO rule first, and confirm that rule actually runs quiet. Expand only after it's earned trust.

## Frequently Asked Questions

### Is shift-left observability different from shift-left testing?

Yes. Shift-left testing focuses on catching bugs earlier (unit tests, integration tests). Shift-left observability goes a step further and runs the same trace/metric instrumentation you'll use in production during the test stage too, so you can predict a change's production behavior before merging it.

### What tools do you need for shift-left observability?

The baseline requirement is an OpenTelemetry Collector and an export step you can add to your CI pipeline. An additional tool for SLOs as code (a YAML-based SLO definition framework, for instance) helps, but isn't required — a simple threshold check is enough to start.

### Where should a small team start with shift-left observability?

Start with one critical service: add trace instrumentation to its tests and define a single SLO rule in CI — a latency threshold, for instance. Once that rule runs quiet for a few weeks, expand it to other services.

### Does shift-left observability increase or reduce observability costs?

Done right, it reduces them. High-cardinality tags and unnecessary metrics get caught in CI before they ever reach production, which prevents the production observability bill from growing in the first place. Done wrong — adding unchecked checks to every PR — it can inflate both CI cost and alert fatigue.
