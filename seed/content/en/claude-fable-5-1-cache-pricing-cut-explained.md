---
title: "Claude Fable 5.1: Why Did Cache Pricing Drop 75%?"
slug: "claude-fable-5-1-cache-pricing-cut-explained"
translationKey: "claude-fable-5-1-cache-pricing-cut"
locale: "en"
excerpt: "Anthropic cut Claude Fable 5.1's prompt-cache read price from $1.00 to $0.25 per million tokens, a 75% drop that can lower agentic workload bills by up to 45%."
category: "ai"
tags: ["claude", "cost-optimization", "ai-agents", "ai-infrastructure", "prompt-engineering"]
publishedAt: "2026-09-03"
seoTitle: "Claude Fable 5.1: Why Cache Pricing Dropped 75%"
seoDescription: "Claude Fable 5.1 cuts prompt-cache reads from $1.00 to $0.25/MTok, a 75% price drop. Here's the math, the breaking API change, and what it means for cost."
---

Short answer: Anthropic cut Claude Fable 5.1's prompt-cache read price by 75%, from $1.00 to $0.25 per million tokens, while base input and output pricing stayed at $10 and $50 per million tokens. Because agentic workloads reread the same cached context (system prompts, tool specs, repo files) on nearly every turn, the cut can shrink typical bills by about 25% and heavy agentic bills by up to roughly 45%.

Anthropic released Claude Fable 5.1 and the restricted Claude Mythos 5.1 on September 1, 2026, alongside Claude Code 2.1.257, which made Fable 5.1 its new default model. The headline change isn't a smarter model — it's a pricing lever nobody had pulled this far before.

## What Is Claude Fable 5.1?

Claude Fable 5.1 is Anthropic's September 2026 update to the Fable model line, shipped with a companion restricted variant called Mythos 5.1. It carries a 1,000,000-token context window by default, up to 128,000 tokens of max output, and always-on adaptive thinking — reasoning can't be fully turned off the way it could on earlier Claude tiers.

Fable 5.1 is available through the Claude API, Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry as of September 2026. Claude Code 2.1.257 shipped the same day and switched its default model to Fable 5.1, which is the fastest path most developers will actually feel the pricing change — through their coding agent, not a direct API call. Anyone running Claude Code's [Auto Mode](/en/posts/claude-code-auto-mode-explained) to route work across models inherits the new cache pricing automatically whenever Fable 5.1 gets picked.

## Why Did Cache Pricing Drop 75%?

Cache reads on Fable 5.1 cost $0.25 per million tokens, down from $1.00 on Fable 5 — a 0.025x multiplier of the $10 base input price, versus the standard 0.1x multiplier every prior Claude model used. Anthropic hasn't published a public rationale beyond the number itself, but the shift targets exactly the workloads that make prompt caching worth using in the first place.

Prompt caching lets a model skip re-processing input it has already seen, at a fraction of the base input cost, as long as the exact prefix is reused within the cache's lifetime. Base input and output pricing on Fable 5.1 are unchanged from Fable 5: $10 per million input tokens, $50 per million output tokens. Cache write costs are also unchanged — $12.50 per million tokens for a 5-minute cache, $20 per million for a 1-hour cache. Only the read side moved, and it moved further than any previous Claude cache-pricing change.

Here's the comparison in full:

| Pricing dimension | Claude Fable 5 | Claude Fable 5.1 | Change |
|---|---|---|---|
| Base input | $10 / MTok | $10 / MTok | No change |
| Base output | $50 / MTok | $50 / MTok | No change |
| Cache write (5-minute) | $12.50 / MTok | $12.50 / MTok | No change |
| Cache write (1-hour) | $20 / MTok | $20 / MTok | No change |
| Cache read | $1.00 / MTok | $0.25 / MTok | −75% |

## How Much Does This Actually Save?

Anthropic's own guidance and independent reporting put the savings at roughly 25% for a typical workload and up to roughly 45% for highly agentic workloads — the ones where cache reads make up most of total token spend. The gap between those two numbers is the whole story: the less your workload depends on cached reads, the less this specific cut helps you.

A "highly agentic workload" here means one that resends large, mostly unchanged context on every turn — system prompts, tool definitions, a big chunk of a code repository, or a running conversation transcript. Those are precisely the patterns Claude Code, MCP-based agents, and long coding sessions produce, which is why Anthropic paired this pricing change with a same-day Claude Code release that made Fable 5.1 the default model.

If your workload sends short, mostly unique prompts with little cache reuse, expect the smaller end of that range, or close to no change at all — the base rates you actually pay on are untouched. That's also why cache-heavy pricing cuts don't move the needle much for teams evaluating cheap, low-context models like [Gemini 3.6 Flash](/en/posts/building-with-gemini-3-6-flash) for simple tasks — the comparison only gets interesting once your own context reuse is high.

## What's the Breaking API Change in Fable 5.1?

On Claude Fable 5.1 and Mythos 5.1, the `tool_choice` values `any` and `tool` are no longer supported and now return an HTTP 400 error; use `auto` or `none` instead. Any existing integration that forces a specific tool call, or forces *some* tool call, with those two values will break outright on upgrade rather than degrade quietly.

This is worth flagging separately from the pricing news because it's the kind of change that doesn't show up in a cost dashboard — it shows up as a failed request in production. Teams with tool-forcing logic should grep their codebase for `tool_choice` before rolling Fable 5.1 into anything customer-facing.

## How Do You Use Prompt Caching with Fable 5.1?

You mark a reusable block of input with a `cache_control` field in the API request, and Claude stores it so a later request with the identical prefix pays the cache-read rate instead of the full input rate. Below is a minimal example marking a large system prompt as cacheable:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-fable-5-1",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are a code review assistant. <large repo context, tool specs, and instructions here>",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {"role": "user", "content": "Review the diff in pull request #482."}
    ]
)
```

The first call pays the cache-write rate ($12.50/MTok for the default 5-minute cache). Every subsequent call within the cache window that reuses the identical `system` prefix pays the new $0.25/MTok read rate instead of the $10/MTok base input rate — a 97.5% discount on that portion of the request, not just the 75% cut relative to Fable 5's cache-read price.

## Is This the More Important Trend: Cache Cuts or Base-Rate Cuts?

My take: cache-price cuts are the more consequential lever for real agentic spend, and base-rate cuts are the more consequential lever for everything else — most teams underestimate how lopsided their own workload already is toward one side. A base-rate cut helps every token equally; a cache-rate cut helps only the tokens you're already reusing, but for agents that reuse constantly, that's most of the bill.

This is Anthropic's second major cache-pricing move of 2026. In August 2026, [Claude Sonnet 5's introductory pricing became permanent](/en/posts/claude-sonnet-5-permanent-pricing) rather than reverting to a higher standard rate — a base-rate decision. The Fable 5.1 cut is a cache-rate decision instead, which suggests Anthropic is treating cache pricing as its own separate lever going forward, not just a fixed discount tied to the base price.

If you're already tracking cache hit rates in [Claude Code's usage and cost views](/en/posts/claude-code-spend-limits-prompt-cache-metrics), this is the moment to pull that number up and multiply it against your bill — a workload with a 70% cache-read share sees a very different outcome than one with a 10% share, even on the identical model.

## Frequently Asked Questions

### How much cheaper is Claude Fable 5.1 than Fable 5?

Base input and output pricing is identical — $10 and $50 per million tokens. The only price that changed is the prompt-cache read rate, cut 75% from $1.00 to $0.25 per million tokens. Total bill impact depends on how much of your workload hits the cache: Anthropic and independent estimates put typical savings around 25% and heavy agentic workloads around 45%.

### Does Claude Fable 5.1 support disabling extended thinking?

No. Fable 5.1 uses always-on adaptive thinking, and reasoning cannot be fully disabled the way it could on some earlier Claude models. If your integration assumed a thinking-off mode, that assumption no longer holds as of September 2026.

### Why does tool_choice: "any" return a 400 error on Fable 5.1?

Anthropic removed support for the `tool_choice` values `any` and `tool` on Fable 5.1 and Mythos 5.1; both now return an HTTP 400 error. Use `auto` (let the model decide) or `none` (disable tool use for that call) instead. Any code that force-calls a specific tool with the old values needs to change before upgrading.

### Where can I run Claude Fable 5.1?

As of September 2026, Fable 5.1 is available through the Claude API, Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry. Claude Code 2.1.257, released the same day, made Fable 5.1 its default model, so anyone running Claude Code without pinning a model is on it automatically.

For more on Anthropic's model lineup and pricing moves, see Woyable's [AI category](/en/category/ai).

Sources: [Anthropic platform release notes](https://platform.claude.com/docs/en/release-notes/overview), [Anthropic prompt-caching documentation](https://platform.claude.com/docs/en/build-with-claude/prompt-caching), [VentureBeat coverage of the Fable 5.1 launch](https://venturebeat.com/technology/anthropics-claude-fable-5-1-and-mythos-5-1-arrive-with-a-75-cost-reduction-for-fable-cache-reads).
