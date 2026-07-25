---
title: "Claude Opus 5 Arrives: Frontier AI at Half Price"
slug: "claude-opus-5-launch"
translationKey: "claude-opus-5-launch"
locale: "en"
excerpt: "Anthropic launched Claude Opus 5 yesterday with default-on thinking, a new breaking change around disabling it, and unchanged pricing. What changes for devs."
category: "ai"
tags: ["claude", "llm", "ai-coding", "ai-agents", "ai-tools"]
publishedAt: "2026-07-25"
seoTitle: "Claude Opus 5 Arrives: Frontier AI at Half Price"
seoDescription: "Anthropic launched Claude Opus 5 yesterday with default-on thinking, a new breaking change around disabling it, and unchanged pricing. What changes for devs."
---

Anthropic [launched Claude Opus 5](https://www.anthropic.com/news/claude-opus-5) yesterday, July 24, 2026. The company is positioning it as a "step-change improvement" over Claude Opus 4.8, with the largest gains showing up in deep reasoning, agentic and long-horizon tasks, and test-time compute scaling. Pricing stays put at $5 per million input tokens and $25 per million output tokens.

## Model identity and core specs

The model ID is `claude-opus-5`. It ships with a 1M-token context window that is both the default and the maximum — there is no smaller context variant to fall back to. Max output tokens sit at 128K, unchanged from the previous generation.

The most consequential behavioral change is that thinking is now on by default. On Opus 4.8, an unset `thinking` parameter meant the model answered without reasoning first. On Claude Opus 5, that same omission now runs adaptive thinking automatically. It is a silent shift, not an error, so anyone with `max_tokens` tuned tightly around a non-thinking response should revisit it before the request truncates mid-answer.

The effort parameter is now the primary lever for reasoning depth, with five levels available — `low`, `medium`, `high`, `xhigh`, and `max` — and a default of `high`. Anthropic recommends `xhigh` for coding and agentic workloads specifically; the full breakdown is in the [official Opus 5 documentation](https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5).

## Breaking change: disabling thinking is now effort-gated

On Opus 4.8, `thinking: {"type": "disabled"}` was accepted at any effort level. That changed on Claude Opus 5: disabling thinking now only works at effort `high` or below. Pair it with `xhigh` or `max` and the API returns a 400 error.

```json
{
  "model": "claude-opus-5",
  "max_tokens": 4096,
  "thinking": { "type": "disabled" },
  "output_config": { "effort": "xhigh" }
}
```

That request fails outright on Claude Opus 5. Teams migrating from Opus 4.8 need to grep their codebase for this exact combination and either drop effort to `high` or lower, or leave thinking enabled. It is worth revisiting alongside the effort-versus-latency tradeoffs we covered in our [prompt engineering patterns piece](/en/posts/prompt-engineering-patterns).

## Pricing: same numbers, more capability

Anthropic is framing Opus 5 as "frontier intelligence at half the price of Claude Fable 5." Here's how the numbers stack up:

| Model | Input ($/M tokens) | Output ($/M tokens) | Context | Max output |
|---|---|---|---|---|
| Claude Opus 5 | 5 | 25 | 1M | 128K |
| Claude Opus 4.8 | 5 | 25 | 1M | 128K |
| Claude Fable 5 | 10 | 50 | 1M | 128K |

For anyone already spending on Opus 4.8, a model-ID swap alone unlocks meaningfully more capability at an unchanged bill. Fast mode is priced separately: still a research preview, at $10 input and $50 output per million tokens, and available on the Claude API only — not yet on Bedrock, Vertex, or Foundry. In exchange it delivers roughly 2.5x the default output speed.

## Benchmark results

Anthropic's own Frontier-Bench v0.1 numbers show a wide gap: Claude Opus 5 scores 43.3% versus Opus 4.8's 21.1%, Claude Fable 5's 33.7%, and GPT-5.6 Sol's 34.4%. Opus 5 leads specifically on harder, more novel reasoning benchmarks — ARC-AGI-3, Frontier-Bench, and AutomationBench.

On the knowledge-work side, GDPval-AA v2 puts Opus 5 at 1861, ahead of Fable 5's 1747 and setting a new high mark for the metric.

| Benchmark | Claude Opus 5 | Claude Opus 4.8 | Claude Fable 5 | GPT-5.6 Sol |
|---|---|---|---|---|
| Frontier-Bench v0.1 | 43.3% | 21.1% | 33.7% | 34.4% |
| GDPval-AA v2 | 1861 | — | 1747 | — |

It isn't a clean sweep, though. GPT-5.6 Sol reportedly still edges ahead on some established coding benchmarks, including SWE-Bench Pro and DeepSWE — we dug into this tradeoff in our [Claude Sonnet 5 vs. GPT-5.6 vs. Gemini 3.5 comparison](/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5). As for Gemini, there's no clean apples-to-apples frontier comparison right now: Google's most recent releases, 3.6 Flash and 3.5 Flash-Lite, are efficiency-tier models rather than a competing flagship — Gemini 3.5 Pro was expected mid-to-late July but is now rumored for August. We covered those Flash-tier models in our [Gemini 3.6 Flash and 3.5 Flash-Lite roundup](/en/posts/gemini-3-6-flash-3-5-flash-lite-and-cyber).

## New API features

A handful of developer-facing additions shipped alongside the model:

- **Mid-conversation tool changes (beta).** You can now add or remove tools between turns without losing your prompt cache.
- **A "default" fallbacks mode.** Automatic model fallback routed by refusal category, rather than something you configure manually per model.
- **A lower prompt-cache minimum.** The cacheable prefix floor dropped to 512 tokens, down from 1,024 on Opus 4.8.
- **Fast mode (research preview).** As noted above, roughly 2.5x default speed, Claude API only for now.

If you're actively managing spend, it's worth weighing these changes against the tactics in our [guide to cutting LLM token costs](/en/posts/cut-llm-token-costs).

## Availability

Claude Opus 5 is available at launch on the Claude API for all customers, on Amazon Bedrock, on Google Cloud (Vertex), and on Microsoft Foundry. Opus 4.8 remains available everywhere too, so nothing forces an immediate migration.

On the consumer side, Opus 5 is now the default model on Claude Max and the strongest model available on Claude Pro. It also rolled out the same day in [GitHub Copilot](https://github.blog/changelog/2026-07-24-claude-opus-5-is-now-available-in-github-copilot/), giving it one of the broadest same-day distributions of any recent Claude release.

## Behavioral changes developers will notice

Anthropic's own documentation calls out a few shifts worth planning around:

- **Longer default responses and deliverables.** Opus 5 tends to produce more thorough output than its predecessor by default.
- **More narration of agentic progress.** It reports on what it's doing more frequently during long-running tasks.
- **Readier delegation to subagents.** In multi-agent frameworks it hands off work more willingly — a pattern we covered in [Claude Code's background subagents](/en/posts/claude-code-subagents-background-agents).
- **Built-in self-verification.** The model now checks its own work without being asked. Anthropic's explicit advice here is to remove old "add a final verification step" prompting patterns carried over from earlier models, since on Opus 5 they now cause over-verification and unnecessary latency.

## Migrating from Opus 4.8

For most teams, the code change really is just the model ID:

```bash
# Before
curl https://api.anthropic.com/v1/messages \
  -d '{"model": "claude-opus-4-8", "max_tokens": 4096, ...}'

# After
curl https://api.anthropic.com/v1/messages \
  -d '{"model": "claude-opus-5", "max_tokens": 4096, ...}'
```

But it's worth reviewing the two behavioral changes before shipping: thinking being on by default, and the disable-thinking/effort restriction. Teams leaning on long-running agentic workflows should test both explicitly rather than assume old behavior carries over — [VentureBeat's launch coverage](https://venturebeat.com/orchestration/anthropic-launches-claude-opus-5-a-cheaper-ai-model-for-coding-agents-and-enterprise-workflows) frames the same shift from an enterprise-workflow angle.

My take: the more interesting story here isn't the raw benchmark jump, it's that Anthropic held pricing flat while pushing capability up this much. In a market where model launches usually come with a price hike somewhere, handing Opus 4.8 users what amounts to a free upgrade is a pointed move — especially with GPT-5.6 Sol breathing down its neck on coding benchmarks.

## Frequently Asked Questions

### Is Claude Opus 5 really that much better than Opus 4.8?
On hard reasoning tests like Frontier-Bench v0.1 the gap is large — 43.3% versus 21.1% — but on established coding benchmarks like SWE-Bench Pro, GPT-5.6 Sol still holds a slight edge. The real-world benefit scales with how long-horizon and agentic your workload actually is.

### Is the pricing really identical to Opus 4.8?
Yes — $5 per million input tokens and $25 per million output tokens, unchanged. The only exception is the research-preview fast mode, which is priced separately and higher, at $10/$50 per million tokens.

### How do I migrate my existing code to Claude Opus 5?
Swapping the model ID from `claude-opus-4-8` to `claude-opus-5` covers most cases. After that, audit any request that omits `thinking` entirely, and any call that disables thinking while running at `xhigh` or `max` effort.

### Should I use Opus 5 or Claude Fable 5?
Fable 5 remains Anthropic's most capable model, but it isn't priced to match. Opus 5 is the more sensible default for most production workloads on a price-performance basis; reserve Fable 5 for the hardest, most latency-tolerant tasks.

For more model comparisons and ongoing AI coverage, browse our [AI category](/en/category/ai).
