---
title: "What Is GPT-6.1 Terra? OpenAI's Cheaper, Faster Model"
slug: "what-is-gpt-6-1-terra"
translationKey: "gpt-6-1-terra-launch-2026"
locale: "en"
excerpt: "Short answer: GPT-6.1 Terra is OpenAI's October 26, 2026 mid-tier model that runs at roughly half the price of GPT-5.6 Terra and cuts error rates sharply."
category: "ai"
tags: ["openai", "chatgpt", "llm", "pricing"]
publishedAt: "2026-11-01"
seoTitle: "What Is GPT-6.1 Terra? Pricing and Performance"
seoDescription: "When did GPT-6.1 Terra launch, what does it cost per API call, how does it compare to GPT-6.1 Sol, and which plans get it? Full breakdown with pricing table."
---

Short answer: GPT-6.1 Terra is OpenAI's mid-tier model, launched October 26, 2026, for ChatGPT Work and Codex. It costs $1 per million input tokens and $5 per million output tokens through the API — roughly half the price of GPT-5.6 Terra and GPT-6.1 Sol. On OpenAI's own benchmark, its error rate at low reasoning effort dropped from 53.6% to 16.7%.

## What is GPT-6.1 Terra?

GPT-6.1 Terra replaces GPT-5.6 Terra as OpenAI's mid-tier model, built for computer use, visual reasoning, coding, and everyday work tasks. In OpenAI's current lineup, "Terra" sits as the price-performance tier: GPT-6 Astra is the larger, more expensive flagship above it, while GPT-6.1 Sol occupies a similar capability band at roughly double the price.

The model is callable through the API under the id `gpt-6.1-terra`. Rollout is staged by plan, region, and workspace, so two users on the same plan can get access on different dates.

## Where can you actually use GPT-6.1 Terra?

GPT-6.1 Terra is currently available only through ChatGPT Work and Codex, on Plus, Pro, Business, Enterprise, and Edu plans — it is not in the standard ChatGPT chat tier or the free plan. Developers can also call it directly through the API.

Plan usage limits stayed unchanged at launch, so switching to Terra doesn't eat into your existing message or token quota. One notable gap: the model does not support UAE inference residency, which matters for enterprise customers with data-residency requirements in that region.

## What does GPT-6.1 Terra actually cost?

Pricing is the headline change. The table below shows standard API rates (for prompts up to 272K input tokens), based on OpenAI's own comparison figures reported across secondary coverage:

| Model | Input ($/1M tokens) | Cached input ($/1M) | Output ($/1M tokens) |
|---|---|---|---|
| GPT-6.1 Terra | $1.00 | $0.05 | $5.00 |
| GPT-6.1 Sol | $2.00 | $0.10 | $10.00 |
| GPT-5.6 Terra (previous) | ~$2.00 | — | ~$10.00 |

Prompts beyond 272K input tokens cost more — around $2 input and $7.5 output per million. Batch and Flex modes roughly halve the standard rates, while Fast mode doubles them; those three modes come from a single secondary source each, so check OpenAI's live pricing page before building a cost model around them.

This cut continues a pattern that started with the [GPT-5.6 price cuts](/en/posts/gpt-5-6-price-cuts-luna-terra): OpenAI has been aggressively driving down the cost of its mid-tier models release over release.

## How much faster and more accurate is it?

On OpenAI's internal benchmark, the error rate at low reasoning effort fell from 53.6% with GPT-5.6 Terra to 16.7% with GPT-6.1 Terra — more than a 3x accuracy improvement at the same cost tier. Some outlets report the model running roughly 3x faster on agent workloads; that figure traces back to OpenAI's own announcement and hasn't been independently verified yet, so don't treat it as a guaranteed number for your own workload.

The error-rate drop matters most for computer-use tasks specifically: when a model interprets a screenshot and proposes an action — a click, a form fill — one wrong step can corrupt every step after it. Cutting the error rate to roughly a third meaningfully raises the odds that a long agent chain finishes successfully instead of derailing halfway through.

## How do you migrate to GPT-6.1 Terra?

Through the API, migration is a one-line change: update the `model` field in your request body to `gpt-6.1-terra`, since the input/output schema stays identical to GPT-5.6 Terra. The real work is tracking cost and error rate after the switch:

```json
{
  "model": "gpt-6.1-terra",
  "messages": [{ "role": "user", "content": "..." }],
  "reasoning_effort": "low"
}
```

A three-step rollout works well: route a small slice of traffic (say 10%) to Terra first and compare error rate and latency against your current model; update your cost dashboard to reflect the new per-token price; then shift the rest of traffic once results land in the expected range. Skipping straight to 100% means putting the model into production without ever testing its behavior on your own data — OpenAI's benchmark doesn't guarantee how it performs on your specific use case.

Teams using ChatGPT Work or Codex get the rollout automatically and don't need to flip a setting manually, but it's still worth checking your workspace settings to confirm which variant is active — some Plus and Pro users see GPT-6.1 Terra at Medium instead of GPT-6.1 Sol at Light in the default Power preset.

## GPT-6.1 Terra or GPT-6.1 Sol?

Terra runs at roughly half the price of Sol but offers less reasoning headroom; the practical rule is to use Terra for high-volume, repetitive work (code completion, bulk data processing, routine agent steps) and reach for Sol when a task needs complex, one-off reasoning or multi-step planning. [The full GPT-6.1 Sol breakdown](/en/posts/what-is-gpt-6-1-sol) covers that model's strengths and pricing in detail.

If you want a cross-vendor comparison, [Claude Sonnet 5.5 vs GPT-6.1 Sol](/en/posts/claude-sonnet-5-5-vs-gpt-6-1-sol) looks at the price-performance trade-off from a different angle; Terra enters that conversation as a cheaper third option rather than a direct Sol replacement.

## Who should care about this release?

The clearest winners are teams running high-volume agent workflows through Codex or ChatGPT Work — halving token cost means roughly twice the agent calls for the same budget. If you're wiring your own tools or agents into this model, how you expose those tools matters just as much as which model you pick; [this guide to Skills, MCP, and connectors](/en/posts/skills-mcp-or-connector-builders-guide-2026) walks through that decision.

My take: OpenAI shipping Terra, Sol, and Astra updates on an increasingly tight cadence suggests pricing is now effectively monthly, not annual. Hardcoding a model's API price into your codebase is a bad bet — a thin configuration layer that reads current pricing will save you a rewrite the next time this happens.

This also creates an opening for smaller teams: a team that shelved agent-based features earlier over cost can now make roughly twice the number of calls on the same budget. Still, a lower price alone isn't a reason to switch — the real question remains whether this specific model clears the error-rate and latency bar your task needs. Price is just one variable in that equation.

## Frequently Asked Questions

### When did GPT-6.1 Terra launch?

OpenAI announced GPT-6.1 Terra on October 26, 2026, rolling it out gradually through ChatGPT Work, Codex, and the API. Availability depends on your plan, region, and workspace.

### What does GPT-6.1 Terra cost through the API?

Standard pricing is $1 per million input tokens, $0.05 per million cached input tokens, and $5 per million output tokens — about half the cost of GPT-5.6 Terra and GPT-6.1 Sol. Prompts over 272K input tokens are priced higher.

### Which plans get GPT-6.1 Terra?

It's currently limited to ChatGPT Work and Codex on Plus, Pro, Business, Enterprise, and Edu plans. It is not yet available in the standard ChatGPT chat tier or on the free plan.

### Should I use GPT-6.1 Terra or GPT-6.1 Sol?

Pick Terra for high-volume, repetitive tasks where its lower price pays off at scale, and pick Sol when a task needs deeper, one-off reasoning. The price gap between the two is roughly 2x.
