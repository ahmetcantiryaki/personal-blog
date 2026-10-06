---
title: "How Do You Make AI Token Spend Visible by Team?"
slug: "ai-finops-token-spend-visibility"
translationKey: "ai-finops-token-spend-2026"
locale: "en"
excerpt: "Short answer: route every LLM call through a gateway and tag it by team. 98% of FinOps teams now track AI spend, yet 73% of AI projects blow their budget."
category: "devops-cloud"
tags: ["finops", "cost-optimization", "llm", "observability", "devops"]
publishedAt: "2026-10-06"
seoTitle: "AI FinOps: Making Token Spend Visible by Team"
seoDescription: "Making AI token spend visible by team and feature means routing LLM calls through a gateway and tagging them. Here's how to set up the metering."
---

Short answer: route every LLM call through a central gateway and tag it with the team, feature, and user that triggered it. As of 2026, 98% of FinOps teams track AI spend — up sharply from 31% in 2024 — yet despite that visibility, 73% of AI projects still blow their budget.

## Why does AI spend escape classic FinOps?

Because a cloud bill arrives itemized, but an LLM bill usually arrives as one lump sum. When you call a managed API (OpenAI, Anthropic, Google), there's no line item showing which team, which feature, or which user segment triggered that call — just a monthly total. Classic cloud FinOps runs on resource tagging: you tag the virtual machine, the database, the storage bucket, and allocate cost back from there. For token consumption, that tagging layer usually doesn't exist at all.

The numbers show what that blind spot costs. Goldman Sachs projects global token usage will grow 24x between 2026 and 2030, reaching 120 quadrillion tokens a month, driven mainly by agentic AI adoption. Ramp's data shows average monthly enterprise AI token spend has grown 13x since January 2025. With volume growing that fast, not knowing which team is spending what stops being a nice-to-have and becomes a direct budget risk.

| Metric | Value | Source |
|---|---|---|
| FinOps teams tracking AI spend | 98% (up from 31% in 2024) | FinOps Foundation |
| AI projects that blow budget | 73% | Industry reports, 2026 |
| Global token usage growth (2026–2030) | 24x, to 120 quadrillion/month | Goldman Sachs |
| Enterprise monthly AI token spend growth (since Jan 2025) | 13x | Ramp |

## How do you tag calls by team and feature?

The practical fix is routing every LLM call through a gateway (LiteLLM, Portkey, or a proxy you write yourself) instead of hitting the provider directly. The gateway attaches three things to each request: the team that triggered it, the feature or endpoint it came from, and the end-user ID when there is one. Combined with the token count the provider returns, those three tags give you a dataset you can actually allocate cost against.

```python
response = gateway.chat.completions.create(
    model="claude-sonnet-5-5",
    messages=messages,
    metadata={
        "team": "search-ranking",
        "feature": "query-rewrite",
        "user_id": user.id,
    },
)
```

That metadata lives in the gateway's logs and turns into a per-team, per-feature cost table through a daily aggregation job (a simple cron works fine). The caching and prompt-shortening techniques we covered in [cutting LLM token costs](/en/posts/cut-llm-token-costs) matter a lot more once this visibility exists, because now you actually know which team needs the optimization most.

## How do you measure unit economics?

Total spend on its own is meaningless; you need to divide it by a unit of work. Two metrics cover most teams: cost per request and cost per active user. The first tells you how expensive a feature is; the second tells you how cost will scale as the product grows.

| Metric | How to calculate it | When it signals a problem |
|---|---|---|
| Cost per request | Total token cost / number of requests | Spikes suddenly after a prompt version change |
| Cost per active user | Total token cost / monthly active users | Rises above cost per unit of revenue |
| Per-feature margin impact | (Feature revenue - feature AI cost) / feature revenue | Falls below the product's target margin |

Track these on a weekly dashboard and catch sudden jumps early — a prompt change that doubles token count is the most common silent budget killer. The infrastructure-side cost control we covered in [cutting GPU costs for AI workloads](/en/posts/cut-gpu-costs-ai-workloads) complements this application-side token metering: one shows what the inference infrastructure costs, the other shows how much of it each feature actually consumes.

## How do you connect spend to productivity?

The real difficulty is matching cost to outcome rather than to output. "Support spends $40,000 a month on tokens" means nothing on its own; "support spends $40,000 a month and cut average resolution time from 12 minutes to 7" means something. To measure that, put AI spend on the same dashboard as whatever business metric that feature already tracks — resolution time, conversion rate, churn. Two numbers living on separate dashboards never get compared.

Budgets and guardrails come in at this point. Set a monthly token budget per team at the gateway level: an alert at 80% of budget, and at 100% — for non-critical features — either rejecting requests or falling back to a cheaper model is a reasonable guardrail. We go deeper into this budgeting logic for small teams in [keeping startup AI costs under control](/en/posts/keep-startup-ai-costs-under-control).

There's a choice to make here: showback or chargeback? Showback shows each team its own spend without actually billing that team for it — the goal is building awareness. Chargeback actually deducts the spend from the team's own budget, which pushes much harder toward optimization but also complicates your finance workflows. Most teams start with showback, then move the highest-spending teams to chargeback once the underlying data is trustworthy.

Honestly, the biggest mistake in AI FinOps is treating it as a cost-cutting project. The goal isn't driving spend to zero — it's making visible which spend is earning its keep; sometimes the right answer is spending more, as long as you know which feature deserves it. If you want this visibility captured at every step of an LLM call, our guide to [tracing LLM calls with OpenTelemetry](/en/posts/tracing-llm-calls-opentelemetry) covers how to capture token counts at the trace level. For more cost-optimization pieces, see our [DevOps & Cloud category](/en/category/devops-cloud).

## Frequently Asked Questions

### What share of companies track AI token spend?

According to the FinOps Foundation, 98% of FinOps teams manage AI spend as of 2026, up from 31% in 2024. Despite that, 73% of AI projects still blow their budget, because tracking spend and making it visible by team and feature are two different things.

### How do I tag LLM calls by team?

Route calls through an LLM gateway (LiteLLM, Portkey, or your own proxy) instead of hitting the provider directly, and attach team, feature, and user ID as metadata on each request. The gateway's logs turn into a per-team cost table through a daily aggregation job.

### Which two metrics are enough for unit economics?

Cost per request and cost per monthly active user. The first shows how expensive a feature is; the second shows how cost scales as the product grows.

### What should happen when a token budget is exceeded?

Set a monthly per-team budget at the gateway level: an alert at 80%, and at 100% either reject requests for non-critical features or fall back to a cheaper model — a reasonable guardrail that doesn't require a human in the loop.
