---
title: "SLOs and Error Budgets: A Practical Setup"
slug: "slos-and-error-budgets-a-practical-setup"
translationKey: "slos-error-budgets-practical-setup"
locale: "en"
excerpt: "Short answer: pick an SLI users feel, set the SLO from real traffic data, compute the error budget as (1 − SLO) × window, protect it with burn-rate alerts."
category: "devops-cloud"
tags: ["sre", "monitoring", "reliability", "observability"]
publishedAt: "2026-10-28"
seoTitle: "How to Set Up SLOs and Error Budgets: A Guide"
seoDescription: "We walk through picking the right SLIs, setting a realistic SLO target, the error-budget math, and multi-window burn-rate alerts step by step, with examples."
---

Short answer: pick a metric users actually feel (an SLI), set a target (the SLO) from real traffic data, compute the error budget as `(1 − SLO target) × window`, and protect that budget with multi-window burn-rate alerts. A single-window alert ends up either noisy or slow; the multi-window rule fixes both at once.

## What's the actual difference between an SLI, an SLO, and an SLA?

An SLI (Service Level Indicator) is what you measure — "percentage of requests returning 200," or "p99 latency." An SLO (Service Level Objective) is the target you set for that SLI — "99.9% availability over a 30-day window." An SLA (Service Level Agreement) is the commercial contract that defines what happens if you miss that target, usually with a customer, usually with a consequence like a refund. Setting the SLO stricter than the SLA is standard practice: it gives you room to notice a problem before you actually breach the SLA.

## Which SLIs actually reflect what users feel?

Four SLI types map closest to real user experience: availability (the share of successful requests), latency (p95/p99 percentiles, not p50 — an average hides a single slow queue), freshness (how current the data is), and correctness (whether the returned result is actually right). Using average latency as your SLI is a common mistake: an average easily hides a queue where one user waited 8 seconds; p99 surfaces that queue directly.

## How do you set an SLO target that's actually realistic?

Setting a 99.99% target on everything is a classic mistake — that target can be stricter than your infrastructure actually delivers, and it holds the team accountable to an impossible bar. A realistic SLO comes from 30-90 days of real traffic history: look at how reliably the service has actually performed, then set the target slightly below that number (for example, a 99.9% target against an actual 99.95% performance). That gap leaves a real error budget instead of a target you nearly breach every month.

## How does the error-budget math actually work?

Error budget = `(1 − SLO target) × window total`. For a 99.9% target over a 30-day window, the budget is 0.1% of total requests as allowed errors (or downtime) — roughly 43 minutes over 30 days. Burn rate is the observed error rate divided by the allowed error rate: `observed error rate / (1 − SLO target)`. A burn rate of 1 exhausts the budget exactly at the end of the window; a burn rate of 14.4 exhausts the same 30-day budget in roughly one hour.

| Burn Rate | Time to Exhaust Budget (30-day window) | Typical Action |
|---|---|---|
| 1 | Exactly at window end | Watch, no action needed |
| 3 | ~10 days | Open a ticket, review the release |
| 6 | ~5 days | Lower-priority page (ticket) |
| 14.4 | ~1 hour | Urgent page |

The widely-cited Google SRE Workbook multi-window burn-rate framework recommends a burn rate of 14.4 over a 1-hour long window (confirmed against a 5-minute short window) as the urgent-page threshold for a 99.9% SLO, and a burn rate of 6 over a 6-hour window (with a 30-minute short window) as the lower-priority page threshold. The short-window rule of thumb: the short window should be roughly 1/12 of the long window — a ratio that shows up consistently across [burn-rate alerting writeups](https://last9.io/blog/error-budget/).

Ticket-level thresholds vary a bit more across sources — some recommend a burn rate of 1 over a 3-day window, others a burn rate of 3 over a 2-hour window. That variance exists because the ticket threshold depends more on team preference than the urgent-page threshold does: the goal there isn't "wake someone up now," it's "look at this sometime this week." When you set this threshold for your own SLO, watching how fast your own past incidents actually burned through the budget is more reliable than copying a fixed formula.

## Why is a multi-window alert better than a single-window one?

Because a single-window alert ends up either too noisy or too slow: a short window fires false alarms on a temporary traffic spike, while a long window takes hours to notice a real outage. The fix is checking two windows together — the alert fires only when both the long-window and short-window thresholds are breached at the same time. This is the structure [teams implementing burn-rate alerts](https://oneuptime.com/blog/post/2026-01-30-sre-burn-rate-alerts/markdown) standardize on.

```promql
(
  sum(rate(http_requests_total{status=~"5.."}[1h]))
  /
  sum(rate(http_requests_total[1h]))
) > (14.4 * 0.001)
and
(
  sum(rate(http_requests_total{status=~"5.."}[5m]))
  /
  sum(rate(http_requests_total[5m]))
) > (14.4 * 0.001)
```

## How do you write the policy and get leadership to actually honor it?

A written error-budget policy needs to settle three things up front: what happens when the budget is exhausted (new feature releases freeze, only reliability fixes ship), who reopens the budget (usually automatic once the next window starts), and who can bend the policy (rarely, and only with senior sign-off). The hardest part isn't writing this policy — it's getting leadership to actually honor the release freeze. An SLO that isn't enforced is just a dashboard decoration.

## What mistakes show up most often?

Three mistakes repeat: setting a 99.99% target on everything (which devalues the SLO once it's unrealistic), using average latency as the SLI (which hides the p99 tail), and alerting on symptoms you can't act on (alerting on CPU usage when high CPU doesn't actually degrade user experience is just noise). My take: the first 90 days of a new SLO should be spent validating that the target measures the right thing, not chasing whether you're hitting it.

A fourth, less-discussed mistake: setting an SLO once and never revisiting it. When traffic patterns shift (a new customer segment, a new region, seasonal load), a target that was realistic six months ago may no longer be. Reviewing the SLO on a quarterly rhythm keeps the target from drifting into an aspirational number.

A well-built error budget also feeds a [blameless postmortem process](/en/posts/how-to-run-a-blameless-postmortem) — a burn-rate incident raises "why did the budget burn" as an objective question before "whose fault was it." Paired with [chaos engineering for small teams](/en/posts/chaos-engineering-small-teams), an error budget lets you test which dependency burns it fastest before a real outage does. [Backpressure and load-shedding](/en/posts/backpressure-and-load-shedding) strategies are also a direct way to protect the budget — shedding a low-priority request before the system overloads is cheaper than an outage that burns through it.

## Frequently Asked Questions

### What's the difference between an SLI, an SLO, and an SLA?

An SLI is the metric you measure (like the percentage of successful requests), an SLO is the target you set for that metric (like 99.9%), and an SLA is the commercial contract defining what happens if you miss the target. Setting the SLO stricter than the SLA gives you room to notice a breach before it happens.

### How do you calculate an error budget?

The error budget is `(1 − SLO target) × window total`. For a 99.9% target over a 30-day window, that works out to 0.1% of the total time — roughly 43 minutes of allowed downtime.

### Why do you need a multi-window burn-rate alert?

A single-window alert either fires false alarms on a short window or takes too long to catch a real outage on a long window. The multi-window rule fires only when both the long-window and short-window thresholds are breached at once, cutting false alarms while still catching real outages fast.

### Why is setting a 99.99% target on every service a mistake?

Because that target is usually stricter than your infrastructure actually delivers, holding the team accountable to an impossible bar. A realistic SLO should come from 30-90 days of actual traffic history, not an aspirational number.
