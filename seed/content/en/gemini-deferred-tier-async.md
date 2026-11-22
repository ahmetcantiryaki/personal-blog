---
title: "Gemini's Deferred Tier: Cheaper Async AI Jobs"
slug: "gemini-deferred-tier-async"
translationKey: "gemini-deferred-tier-async-2026"
locale: "en"
excerpt: "Short answer: Gemini's Deferred tier queues non-urgent agent workloads for off-peak hours and can cut inference cost by up to 50%, for a slower response."
category: "ai"
tags: ["gemini", "cost-optimization", "ai-agents", "cloud"]
publishedAt: "2026-11-22"
seoTitle: "Gemini Deferred Tier: When Async Pricing Pays Off"
seoDescription: "Gemini Enterprise Agent Platform's Deferred tier shifts non-urgent jobs to off-peak hours to cut cost by up to 50%. Here is which workloads actually benefit."
---

Short answer: Gemini Enterprise Agent Platform's Deferred tier automatically shifts your non-latency-sensitive agent workloads to off-peak hours, and in exchange it can cut your inference cost by up to 50%. The trade-off is simple: your request gets answered when capacity is available, sometimes hours later, not immediately.

[Google Cloud announced this tier](https://cloud.google.com/blog/products/ai-machine-learning/flexible-billing-and-cost-controls-for-agents-on-google-cloud) as part of a flexible billing update to Gemini Enterprise Agent Platform; it's currently in Preview. The idea: businesses can mark non-urgent agent jobs for off-peak processing, which carries the potential to cut inference costs by up to 50%. The key detail is that this number is a ceiling, not a guaranteed fixed discount.

## What does "deferred/async" actually mean?

On the Deferred tier, your request isn't processed right away. The system holds it until capacity is available, typically during off-peak hours. While it waits, the request stays in an "in progress" state that you check periodically to see whether it's done — the opposite of Standard PayGo's "send the request, get the answer right away" model.

Technically, using the Deferred tier means setting `service_tier="deferred"` in the Python SDK, or the equivalent field in a REST API request; it's currently supported for the Deep Research Agent. [Google's ADK documentation](https://adk.dev/agents/models/google-gemini/deferred-schedule/) notes that the feature only works with a Gemini model that has `use_interactions_api=True` set, and that combining it with streaming returns an HTTP 422 error — Deferred and live streaming can't coexist in the same request.

## Which workloads can tolerate this delay?

The Deferred tier makes sense for work where "now vs. tomorrow doesn't matter, the result does":

- **Batch summarization**: summarizing thousands of documents overnight so a report is ready by morning.
- **Overnight enrichment**: filling database records with extra metadata, like auto-tagging product descriptions.
- **Evals**: running a new model version against thousands of test cases, where getting results by morning is fine instead of within a minute.

What these share: no human is sitting there waiting for the answer. A chatbot with a live user on the other end, or a customer-support flow, is the wrong candidate for Deferred — latency there directly breaks the user experience.

## How much does Deferred actually save versus Standard?

| Tier | Response model | Cost | Best-fit workload |
|---|---|---|---|
| Standard PayGo | Immediate | Full price | Live chat, customer support |
| Deferred (Preview) | Delayed, capacity-dependent | Up to 50% off (a ceiling, not guaranteed) | Batch summarization, overnight enrichment, evals |
| 1-year commitment | Immediate | 10% off | Predictable, steady load |
| 3-year commitment | Immediate | 20% off | Long-term, fixed capacity |

The important thing this table shows: Deferred's up-to-50% discount is conceptually different from the commitment discounts (10%/20%). A commitment discount works on "promise ahead of time, get a discount"; Deferred works on "give up control over when it runs, get a discount." One analyst put it bluntly: it's mostly a shift, not a discount — flexible pricing doesn't automatically cut your costs, it requires you to give up scheduling control in return.

## How do I submit a Deferred job and get the result back?

The skeleton below shows the general flow of sending a job to the Deferred tier and polling for its status:

```python
from google import genai

client = genai.Client()

# Submit the job to the deferred tier
job = client.models.generate_content(
    model="gemini-3-pro",
    contents="Summarize these 500 documents...",
    config={"service_tier": "deferred"},
)

# Poll periodically for status (not streaming)
import time
while job.status not in ("completed", "failed"):
    time.sleep(60)
    job = client.operations.get(job.name)

print(job.result)
```

The key line is `config={"service_tier": "deferred"}`, followed by the polling loop: on the Deferred tier, you should not expect the result immediately — you poll for it instead.

## What should I watch for when adopting this tier?

Three practical cautions. First, the feature is still in Preview and not generally available; some Google sources say the rollout will start limited to select workloads. Second, the 50% figure is a ceiling — your actual discount will vary by workload and timing, so don't treat it as a fixed number when budgeting. Third, whether Deferred pricing can be combined cumulatively with a Flexible Savings Plan hasn't been clarified yet in [Gemini Enterprise Agent Platform's current release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes).

For batch jobs that need a large context window, it's also worth knowing that Gemini's enterprise models already support a context window of up to 1,048,576 tokens — meaning a single job you send to the Deferred tier can process thousands of pages of documents at once. That's not a new Deferred feature; it's an existing model capability, but combined with Deferred's async nature it makes it practical to submit genuinely large batch jobs in one shot. Scanning and summarizing a thousand-page contract archive in a single Deferred request, for instance, is both cheaper and simpler than doing the same job piecemeal on Standard PayGo.

## Which agent architecture should I wire Deferred into?

Deferred fits best into agent architectures that already run on a queue. Say you have a customer-feedback pipeline: live support messages get answered instantly over Standard PayGo, while the part of the same system that batch-analyzes feedback accumulated overnight can route through Deferred instead. That means a single agent uses two tiers at once — the critical path stays on Standard, the background work stays on Deferred. The "agent workflow" concept we covered in [comparing AI tools that do work for you](/en/posts/chatgpt-work-vs-cowork-vs-gemini) applies directly here: splitting latency-sensitive and latency-tolerant steps within the same workflow is the most practical way to cut cost.

In practice, the thing to get right is correctly identifying which step is actually latency-sensitive. Routing the wrong step to Deferred can leave a user waiting hours for an answer, so when designing the architecture, ask "when does this step's result actually need to exist" separately for every step.

## When should I not give up on Standard PayGo?

Honestly, the thing to watch for here is not rushing to move every job to Deferred just because a discount exists. As with [building on Gemini 3.6 Flash](/en/posts/building-with-gemini-3-6-flash), a user-facing application layer can't tolerate added latency; Deferred's discount only makes sense for background work that can genuinely tolerate the delay. As we also saw looking at [Gemini 3.8 Flash's pricing](/en/posts/gemini-3-8-flash-explained-why-price-rises-2027), Google's pricing strategy is no longer a single fixed rate — it's a spectrum that shifts with your usage pattern, and Deferred is the cheapest, most patient end of that spectrum.

## Frequently Asked Questions

### Is Gemini's Deferred tier available right now?

The feature is in Preview and supported for the Deep Research Agent. Google says the rollout will start limited to select workloads, so check your own account for general availability.

### Does the Deferred tier really guarantee 50% savings?

No. The 50% figure is a ceiling Google has stated, not a guaranteed fixed discount. Your actual savings depend on your workload and available capacity, so treat it as a best-case number when budgeting.

### Can I use the Deferred tier with streaming?

No. Per Google's ADK documentation, combining the Deferred tier with streaming returns an HTTP 422 error — the two can't be used together in the same request.

### Which workloads are a poor fit for the Deferred tier?

Anything with a real-time user on the other end — live chat, customer-support flows, interactive tools — is a poor fit. Deferred is built for work with no human waiting on screen, like batch summarization, overnight enrichment and evals, where delays measured in hours rather than seconds are acceptable.
