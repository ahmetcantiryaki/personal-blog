---
title: "Why Did Claude Sonnet 5.5 Cache Reads Get 50% Cheaper?"
slug: "claude-sonnet-5-5-cache-price-cut"
translationKey: "claude-sonnet-5-5-cache-price-cut-2026"
locale: "en"
excerpt: "Short answer: Anthropic cut Claude Sonnet 5.5's cache read price from $0.20 to $0.10 per million tokens on October 7, 2026 — 5% of base input instead of 10%."
category: "ai"
tags: ["claude", "pricing", "cost-optimization", "ai-tools"]
publishedAt: "2026-10-13"
seoTitle: "Claude Sonnet 5.5 Cache Price Cut Explained"
seoDescription: "Anthropic cut Claude Sonnet 5.5's cache read price in half on October 7, 2026. Here are the new numbers, who benefits most, and a real savings calculation."
---

Short answer: yes, it did. Anthropic cut Claude Sonnet 5.5's prompt cache read price from $0.20 to $0.10 per million tokens on October 7, 2026 — 5% of the base input price instead of the standard 10%. Cache writes and every other price stayed the same; the cut only applies to reading content that was already cached.

## What exactly did Anthropic change?

One number moved: the cache read (hit) price on Sonnet 5.5 dropped from $0.20 to $0.10 per million tokens. Anthropic's official pricing page describes the cut as "0.05x the base input price instead of 0.1x" — which puts Sonnet 5.5, alongside Opus 5.5, as the only models that break from the standard 10% cache-read rate.

| Item | Sonnet 5.5 (before Oct 7) | Sonnet 5.5 (after Oct 7) | Sonnet 5 (unchanged) |
|---|---|---|---|
| Base input | $2.00 / MTok | $2.00 / MTok | $2.00 / MTok |
| Output | $10.00 / MTok | $10.00 / MTok | $10.00 / MTok |
| 5-min cache write | $2.50 / MTok | $2.50 / MTok | $2.50 / MTok |
| 1-hour cache write | $4.00 / MTok | $4.00 / MTok | $4.00 / MTok |
| **Cache read** | **$0.20 / MTok** | **$0.10 / MTok** | $0.20 / MTok |

Sonnet 5 retires on November 30, 2026, so this comparison is short-lived, but it shows two models that currently share the same base price diverging only on the cache-read rate.

## Why target cache reads instead of the base price?

Because that's where the real cost sits in repeated-context workloads. A coding agent or a long-running chat interface resends its system prompt, tool definitions, and prior message history on every turn; if that content is cached, the model reads it instead of reprocessing it from scratch. Cutting the base input price would have helped every user equally, but cutting the cache-read price specifically targets workloads with a high cache-hit rate — which is to say, agents and long-context applications.

This is also a pricing-strategy choice: cutting the base price lowers every request's cost by the same ratio, while cutting the cache-read price only moves the needle on requests that are already repeating previously written content. In practice, that means Anthropic is competing on high-volume, sticky usage, not on one-shot, low-volume usage.

## Who actually benefits from this?

Three workload types with high cache-hit rates capture most of the benefit: multi-turn coding agents (Claude Code included), support bots that reuse the same system prompt thousands of times, and RAG systems that query the same document set repeatedly. Low-turn applications that start and finish a conversation in one shot see less impact, since there aren't enough read turns to amortize the cache-write cost.

## What does the real savings look like?

For a mid-size agent processing 10 million cache-read tokens per day, the math runs like this:

```text
Before ($0.20/MTok): 10 MTok x $0.20 = $2.00/day  -> ~$60/month (30 days)
After ($0.10/MTok):  10 MTok x $0.10 = $1.00/day  -> ~$30/month (30 days)
Monthly savings: ~$30

For a larger team reading 500 million tokens/day:
Before: 500 MTok x $0.20 = $100/day -> $3,000/month
After:  500 MTok x $0.10 = $50/day  -> $1,500/month
Monthly savings: $1,500
```

Savings scale linearly with cache-read volume — since the per-token price is cut in half, the total bill drops by the same ratio, with no configuration change or paid upgrade required because the cut is applied automatically.

## How do you measure your own cache-hit rate?

Every request to the Claude API returns `cache_read_input_tokens` and `cache_creation_input_tokens` in the response's `usage` object — comparing those two numbers against total `input_tokens` shows how much of your traffic is actually reading from cache. If your cache-hit rate is low (say, your system prompt changes on every request), this price cut barely touches your bill; if it's high (an agent running a fixed system prompt and a stable tool-definition set), the cut flows straight into your margin.

```json
{
  "usage": {
    "input_tokens": 120,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 8400,
    "output_tokens": 340
  }
}
```

In the example above, most of the request (8,400 tokens) was read from cache, with only 120 tokens processed as new input — that's what a typical high-cache-hit agent request looks like. Summing those two fields and dividing by total input tokens across a month's billing gives you a rough cache-hit rate; above roughly 70%, this cut makes a meaningful difference to your bill.

## How does this connect to the rest of that week's changes?

This price change didn't happen in isolation. On the same October 7, Anthropic shipped [Claude Haiku 5.5](/en/posts/claude-haiku-5-5-price-speed-compared) with a 1-million-token context window; a day earlier, on October 6, the Agent tool gained an [effort parameter](/en/posts/claude-code-effort-parameter-explained); and Claude Code 2.1.296 (October 9) reflected this pricing directly. That same 2.1.296 release also added an `allow_large` option to the Read tool for reading big text files in one call, and raised the default character limit for upfront MCP tool descriptions from 2,048 to 4,096 — each change looks small on its own, but all of them point the same direction: Claude Code carrying more context through agentic workflows more cheaply. Read together, the pattern is clear: Anthropic packaged a cheap model (Haiku), finer-grained control (effort), and cheaper reuse (cache reads) into the same week to push down the per-unit cost of agentic workloads.

My take: this cut comes from competition, not generosity. Cache-read price is the easiest lever a provider can pull to retain agentic workloads — cutting the base price erodes margin on every request, while cutting cache-read pricing only lowers cost on already-high-volume, sticky usage. If you're a team already [tracking AI subscription sprawl](/en/posts/ai-subscription-sprawl-cost-control), architecture-specific cuts like this one can move the needle more than a change in a general plan price.

## Frequently Asked Questions

### When did Claude Sonnet 5.5's cache price drop?

Anthropic cut Sonnet 5.5's prompt cache read price from $0.20 to $0.10 per million tokens on October 7, 2026. The change applied automatically; existing API keys and integrations needed no update.

### Did the cache write price also drop?

No. The 5-minute cache write (1.25x base price, $2.50/MTok) and the 1-hour cache write (2x base price, $4.00/MTok) stayed the same. The cut applies only to reading previously written content.

### Does this cut apply to other Claude models too?

No, only Claude Opus 5.5 and Claude Sonnet 5.5 price cache reads at 5% of base input. Every other model, including Sonnet 5, Sonnet 4.6, and the Fable line, remains at the standard 10% rate.

### Which applications benefit most from this cut?

Multi-turn workloads with a high cache-hit rate see the biggest benefit: coding agents, support bots that reuse the same system prompt repeatedly, and RAG systems querying a fixed document set. One-shot, low-turn conversations see a limited effect.
