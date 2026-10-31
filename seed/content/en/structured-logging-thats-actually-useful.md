---
title: "Structured Logging That's Actually Useful"
slug: "structured-logging-thats-actually-useful"
translationKey: "structured-logging-that-helps"
locale: "en"
excerpt: "Short answer: write every log line as JSON with fixed fields and a trace_id. Hunting an incident at 3 a.m. becomes one query instead of scrolling text."
category: "software-engineering"
tags: ["observability", "monitoring", "sre", "best-practices"]
publishedAt: "2026-10-31"
seoTitle: "Structured Logging Guide: Fields, Correlation IDs"
seoDescription: "What is structured logging, which fields are required, how do you add a correlation ID, and what should you never log? A guide that works at 3 a.m."
---

Short answer: write every log line as JSON with fixed field names instead of plain text, attach a correlation ID (trace_id) to every request, and use log levels consistently. Without those three things, investigating an incident at 3 a.m. means scrolling through thousands of lines by eye.

## Why do plain-text logs fail under pressure?

A plain-text log line ("User login failed: john@example.com") is readable to a human but not queryable by a machine — searching for "failed" pulls back thousands of unrelated lines too. When a service handles thousands of requests per second, finding the full trail of one specific request in plain text turns into a literal needle-in-a-haystack search.

Structured logging solves this by writing every log line as a data structure — usually JSON — with predefined fields. Instead of searching for the word "failed," you run a precise query like `level:error AND endpoint:/login` and get results in seconds, with no false positives.

## What fields should a structured log line include?

A minimum log line needs these fields: timestamp, level, message, trace_id, and request-specific context (user ID, endpoint, duration). This field set answers "when, how severe, which request, which user" from a single line while you're investigating.

```json
{
  "timestamp": "2026-10-31T14:22:05Z",
  "level": "error",
  "trace_id": "4f2a1c9e-88b3",
  "message": "Payment gateway timeout",
  "endpoint": "/api/checkout",
  "user_id": "usr_8821",
  "duration_ms": 4012,
  "gateway": "stripe"
}
```

Context-specific fields like `duration_ms` and `gateway` in this line show not just that the error happened, but which external service timed out and how long it took — capturing that detail in plain text would require writing a separate regex.

## How does correlation ID and trace context work?

A correlation ID (trace_id) is a unique identifier that links the log lines a single request produces across every service it passes through. OpenTelemetry's [log-trace correlation documentation](https://opentelemetry.io/docs/languages/dotnet/logs/correlation/) states that a log emitted inside an active trace gets its trace_id and span_id fields populated automatically — meaning with the right instrumentation, you never add those fields by hand.

The practical benefit: when a user request starts at the API gateway, passes through an auth service, then hits a payment service, the same trace_id shows up in log lines across all three services. You can reconstruct that request's entire journey with a single query instead of digging through three separate log systems. In distributed systems like [cell-based architecture](/en/posts/cell-based-architecture-blast-radius), this correlation is often the only practical way to find which cell or service is actually responsible for a failure.

## What does using log levels meaningfully look like?

It means setting a clear rule for when each level applies and sticking to it — otherwise everyone logs everything at "info" and the level field loses its meaning. A practical rule set: `debug` for detail only useful during development, `info` for normal workflow events, `warn` for conditions that aren't errors yet but need watching, `error` for failures that affect a user.

| Level | When to use it | Example |
|---|---|---|
| debug | Development/troubleshooting only | "Cache key computed: user:8821:profile" |
| info | Normal workflow events | "Order created: #38291" |
| warn | Not an error, but worth watching | "Retry succeeded on third attempt" |
| error | User-facing failure | "Payment gateway timed out" |

When a team reserves `error` strictly for real, actionable events, the count of errors feeding an alerting system becomes a meaningful signal — if everything is an error, nothing is.

## What should never appear in logs?

Personal data (PII), passwords, API keys, full credit card numbers, and session tokens should never be logged under any circumstance — if these leak into your log aggregation system, anyone with log access gets access to that data too. The twelve-factor app methodology's logs principle states that an app should never concern itself with routing or storage of its output stream; it should write the event stream to stdout and let the execution environment handle routing — a separation that also makes the decision of what gets logged centralized and auditable.

A practical safeguard: add a masking layer to your logging library that automatically replaces field names like `password`, `token`, and `ssn` with `***` — far more reliable than trusting human discipline alone.

## How does sampling noisy logs cut cost?

Sampling means logging a percentage of events instead of every single one to reduce storage cost; the critical rule is that no `error`-level log ever gets sampled out. Sampling noisy `debug`-level logs at 10%, for example, meaningfully cuts storage cost while missing zero error events, because error level always stays at 100%.

This mirrors the cost/performance trade-off covered in [caching strategies and invalidation](/en/posts/caching-strategies-and-invalidation): instead of treating all data as equally important, you make a deliberate call about which data stays complete and which gets sampled.

## How do you connect logs to traces and metrics?

Logs, traces, and metrics form the three pillars of observability, and linking them through the same trace_id lets you jump straight from a spike on a metric graph to the exact log lines behind it. In practice, that means clicking a trace in an APM tool automatically surfaces every log line tied to that request.

My take: most teams push structured logging off as a "fix it later" problem, but setting up the format and correlation ID from day one is far cheaper than retroactively reformatting thousands of existing log lines. During a production incident, that difference is the gap between minutes and hours of investigation time.

## Frequently Asked Questions

### What is structured logging?

Structured logging is the practice of writing every log line as a data structure with fixed field names — usually JSON — instead of plain text. This format makes log lines searchable with precise, field-based queries rather than plain-text keyword search.

### Why do you need a correlation ID?

You need it to link the log lines a single request produces across every service it touches; lines sharing the same trace_id let you reconstruct that request's entire journey. Tools like OpenTelemetry populate this field automatically once instrumentation is set up correctly.

### What information should never appear in logs?

Passwords, API keys, full credit card numbers, session tokens, and personal data (PII) should never be logged under any circumstance. If this information leaks into your logging system, anyone with log access gains access to that sensitive data too.

### How do you use log levels correctly?

Assign each level a clear rule: debug only for development, info for normal workflow events, warn for conditions that aren't errors yet but need watching, and error for real user-facing failures. Without that separation, the error count becomes meaningless and your alerting system loses reliability.
