---
title: "What Is Claude Opus 5.5? Pricing and Benchmarks"
slug: "claude-opus-5-5-pricing-benchmarks"
translationKey: "claude-opus-5-5-launch"
locale: "en"
excerpt: "Claude Opus 5.5 launched on September 22, 2026 at $4/$20 per million tokens, matching Fable 5.1 on most work at 40% lower cost and 30% faster output."
category: "ai"
tags: [claude, llm, ai-tools, ai-coding]
publishedAt: "2026-09-23"
seoTitle: "Claude Opus 5.5: Pricing and Benchmarks Explained"
seoDescription: "Claude Opus 5.5 pricing, benchmark scores, and breaking API changes explained: how it stacks up against Opus 5 and Fable 5.1, plus migration notes."
---

Short answer: Claude Opus 5.5 is Anthropic's new flagship model, released September 22, 2026, priced at $4 per million input tokens and $20 per million output tokens, with a 1-million-token context window. Anthropic says it matches the pricier Fable 5.1 model on most work while costing 40% less to run.

## What is Claude Opus 5.5?

Opus 5.5 is the first model in Anthropic's "Claude 5.5" family, called via the API model ID `claude-opus-5-5`. Anthropic positions it specifically for long-running agentic coding and knowledge work — multi-step agent tasks that run for hours, not single-shot completions.

The biggest behavioral change from the prior generation is that thinking is now always on. Opus 5.5 decides its own reasoning depth adaptively, and there is no way to switch that off — a change that breaks a specific line of existing API calls, covered below.

## How much cheaper is Opus 5.5 than Opus 5?

At list price, Opus 5.5 costs 20% less than Opus 5: input dropped from $5 to $4 per million tokens, output from $25 to $20. Cache reads fell even further, from $0.50 to $0.20 per million tokens, a 60% cut that matters most for cache-heavy coding and agent workloads.

Anthropic's real claim goes beyond list price: on typical workloads, Opus 5.5 costs 40% less overall than Opus 5. That is not just the per-token rate — the model finishes the same tasks using fewer tokens, and it generates output more than 30% faster than Opus 5. [Opus 5's own May 2026 launch](/en/posts/claude-opus-5-launch) made a similar "frontier intelligence at half price" pitch; Opus 5.5 continues that curve rather than resetting it.

Our take: this is Anthropic's second consecutive price cut on its top-tier model, and it reads as more than a marketing line. The 60% drop in cache-read pricing in particular will show up directly in the monthly bill of anyone running production agent systems, which is exactly the workload Anthropic is chasing against OpenAI and Google.

## How does Opus 5.5 perform against Opus 5 and Fable 5.1?

Per Anthropic's published numbers, Opus 5.5 scores 66.4% on Terminal-Bench 4.0 at its highest effort setting, ahead of the 57.9% OpenAI reported for GPT-6 Astra. Independent outlet VentureBeat reported Opus 5 scored 52.3% on the same benchmark, confirming Opus 5.5's jump over its own predecessor, not just over a competitor.

Other benchmarks tell the same story: 54.4% on FrontierCode v1.1, 57.8% on CursorBench 4.0 (versus 41.7% for GPT-5.6 Sol), and 1846 Elo on GDPval-AA v2.1, an evaluation of real-world professional work spanning 44 occupations. Anthropic's central claim is comparative rather than absolute: Opus 5.5 matches the much pricier [Fable 5.1](/en/posts/claude-fable-5-1-cache-pricing-cut-explained) on most work, at a fraction of the cost.

The GDPval-AA v2.1 score matters because that benchmark is not synthetic code puzzles — it grades real work output across 44 occupations, including accounting, law, and engineering. Anthropic's "knowledge work" framing is not limited to developer tools: it positions Opus 5.5 as a candidate for contract review, financial modeling, and other back-office automation, not just coding agents.

| Model | Input ($/MTok) | Output ($/MTok) | Terminal-Bench 4.0 | Notes |
|---|---|---|---|---|
| Claude Opus 5.5 | $4 | $20 | 66.4% | Launched September 22, 2026, new flagship |
| Claude Opus 5 | $5 | $25 | 52.3% | Launched May 2026, now a tier behind |
| Claude Fable 5.1 | $10 | $50 | Not published in this test | Anthropic's larger, pricier top-end model |

## What are Opus 5.5's technical specs?

The default context window is 1 million tokens, and maximum output is 128,000 tokens. The model always uses adaptive thinking, and you can no longer disable it: sending `thinking: {"type": "disabled"}` now returns a 400 error. Instead, control reasoning depth with the `effort` parameter, which accepts low, medium, high, xhigh, or max.

```json
{
  "model": "claude-opus-5-5",
  "max_tokens": 8000,
  "effort": "high",
  "messages": [
    {
      "role": "user",
      "content": "Refactor this repo's auth module and add tests."
    }
  ]
}
```

In practice, this means stripping the old `thinking` block out of your request payloads and replacing it with a single `effort` field. Our [guide to choosing a Claude model](/en/posts/which-claude-model-2026) covers how to pick an effort level by task type.

## What API changes could break existing integrations?

Three changes break existing code directly. First, the `thinking: disabled` removal described above. Second, `tool_choice` values `any` and `tool` now return 400 errors — use `auto` if you need strict tool use. Third, computer use now requires the new `computer_toolset_20260801` toolset on the Claude API and Google Cloud; the old `computer_20251124` tool returns a 400 on those two platforms. Amazon Bedrock still supports the old tool, so teams shipping portable code across providers now have to branch on platform.

Alongside the breaking changes, three beta features shipped: Fast mode, currently in research preview; mid-conversation tool definitions, which let you add or modify tools without invalidating the prompt cache via the `inline-tools-2026-09-15` beta header; and MCP tool-definition support via the `mcp-client-2026-09-15` beta header.

A practical migration checklist looks like this: scan your codebase for requests sending `tool_choice: "any"` or `"tool"` and switch them to `auto`; find every call that still sets a `thinking` block and move it to the `effort` parameter; then make your computer-use tooling platform-aware, since Bedrock still accepts the old toolset while the Claude API and Google Cloud do not. Shipping those three changes straight to production without a staging pass is a good way to wake up to an agent fleet quietly failing on 400 errors.

## Where is Claude Opus 5.5 available?

The model is live on the Claude API, on Claude Platform via AWS, Google Cloud, and Microsoft Foundry/Azure, and on Amazon Bedrock. For teams still running Opus 4.8 or older, this extends the migration wave that started with [Opus 4.1's retirement](/en/posts/claude-opus-4-1-retires-migrate-to-opus-4-8) — it's worth testing model IDs and the new `effort`/`thinking` parameters in staging before flipping production traffic. For broader model-choice context, see our [AI category page](/en/category/ai).

## Frequently Asked Questions

### What's the difference between Claude Opus 5.5 and Opus 5?

Short answer: Opus 5.5 is 20% cheaper at list price than Opus 5 ($4/$20 versus $5/$25 per million tokens), 60% cheaper on cache reads, scores 66.4% versus 52.3% on Terminal-Bench 4.0, and generates output more than 30% faster. Adaptive thinking can also no longer be turned off.

### How much does Claude Opus 5.5 cost?

Short answer: as of September 2026, Opus 5.5 costs $4 per million input tokens and $20 per million output tokens, with cache reads at $0.20 per million tokens. Check Anthropic's official pricing page for the current rate before budgeting a production workload.

### Why doesn't the thinking parameter work in Opus 5.5?

Short answer: because Opus 5.5 always runs adaptive thinking and it cannot be disabled; sending `thinking: {"type": "disabled"}` now returns a 400 error. Use the `effort` parameter instead, set to low, medium, high, xhigh, or max, to control how much reasoning the model does.

### Where can I access Claude Opus 5.5?

Short answer: as of September 2026, Opus 5.5 is available through the Claude API, Claude Platform (AWS, Google Cloud, Microsoft Foundry/Azure), and Amazon Bedrock. Which computer-use toolset you need depends on the platform, so check the release notes before migrating a production integration.

**Sources:** [Anthropic News](https://www.anthropic.com/news), [Claude API release notes](https://platform.claude.com/docs/en/release-notes/overview), [Anthropic pricing documentation](https://platform.claude.com/docs/en/about-claude/pricing), and [VentureBeat's coverage of the Opus 5.5 launch](https://venturebeat.com/technology/anthropic-releases-claude-opus-5-5-beating-fable-5-1-on-key-agentic-benchmarks-at-60-cheaper-api-price).
