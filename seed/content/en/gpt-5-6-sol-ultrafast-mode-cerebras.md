---
title: "GPT-5.6 Sol Goes Ultrafast: 14x Speed via Cerebras"
slug: "gpt-5-6-sol-ultrafast-mode-cerebras"
translationKey: "gpt-5-6-sol-ultrafast-cerebras"
locale: "en"
excerpt: "OpenAI and Cerebras launched Ultrafast, an API tier running GPT-5.6 Sol at up to 750 tokens/second — about 14x faster than Standard processing."
category: "ai"
tags: ["openai", "chatgpt", "performance", "llm"]
publishedAt: "2026-08-16"
seoTitle: "GPT-5.6 Sol Ultrafast: 750 Tokens/Sec via Cerebras"
seoDescription: "OpenAI and Cerebras launched Ultrafast, an API tier running GPT-5.6 Sol at up to 750 tokens/second — about 14x faster than Standard processing."
---

Ultrafast is a new API service tier, announced by OpenAI and Cerebras on August 13, 2026, that runs GPT-5.6 Sol at up to 750 output tokens per second — roughly 14x faster than OpenAI's existing Standard processing tier. It's in limited preview now, API-only, with no public pricing yet.

For anyone shipping an interactive AI product — a coding agent, a support bot, a live financial-research assistant — output speed isn't a nice-to-have benchmark stat. It's the difference between a tool that feels like it's thinking with you and one that feels like it's stalling. That's the gap this month's announcement is aimed at closing.

## What Ultrafast actually is

Ultrafast isn't a new model. It's the same GPT-5.6 Sol you already know, served through different hardware. Instead of running on OpenAI's usual GPU-based inference stack, Ultrafast requests get routed to Cerebras' Wafer-Scale Engine (WSE) — a chip built on an entire silicon wafer rather than cut into individual dies. Each WSE keeps 44 GB of SRAM directly on-chip, which matters because it sidesteps the single biggest bottleneck in typical GPU inference: shuttling model weights back and forth between the chip and off-chip HBM memory for every forward pass.

With Sol's weights resident on-chip and tokens pipelined across layers spread over multiple wafers, Cerebras and OpenAI describe the architecture in detail in [Cerebras' technical blog post](https://www.cerebras.ai/blog/accelerating-gpt-5-6-sol-ultrafast-with-openai). [OpenAI's own announcement](https://openai.com/index/previewing-ultrafast/) frames it plainly: same model, same weights, dramatically different serving hardware, dramatically different latency profile.

## The numbers, side by side

Here's how the throughput and Cerebras' own comparative claims line up. Treat the cross-model figures as Cerebras' benchmarking, not an independent third-party measurement — OpenAI hasn't published its own comparison against Claude Opus 4.8.

| Tier / model | Output speed | Comparison |
|---|---|---|
| GPT-5.6 Sol, Standard tier | ~54 tok/s (implied by the 14x figure) | baseline |
| GPT-5.6 Sol, Ultrafast preview | up to 750 tok/s | ~14x vs. Standard |
| OpenAI Fable 5 | — | Ultrafast is ~11x faster (Cerebras claim) |
| Claude Opus 4.8, Fast mode | — | Ultrafast is ~5x faster (Cerebras claim) |

The practical effect shows up clearly in Cerebras' Humanity's Last Exam benchmark run — 2,500 questions run end to end:

| Configuration | Full HLE run time (2,500 questions) |
|---|---|
| Ultrafast (GPT-5.6 Sol) | 11 hours 11 minutes |
| Fable 5, Standard tier | 78 hours 27 minutes |

A 7x reduction in wall-clock time for the same eval isn't just a leaderboard flex — it's a preview of what Ultrafast does to any agentic or evaluation pipeline that currently spends most of its time waiting on tokens rather than computing on them.

## Who actually benefits from this

Not every workload needs 750 tokens/second. Batch summarization jobs, overnight data pipelines, and anything running asynchronously won't notice or care. The value concentrates hard in interactive, latency-sensitive paths:

- **Coding agents** — tighter edit-test-fix loops where every second of "thinking" is a second the developer is staring at a spinner.
- **Commerce and checkout flows** — conversational shopping assistants where users abandon if a response takes more than a beat.
- **Financial research tools** — analysts running multi-step reasoning chains against live market questions, where speed compounds across steps.
- **Customer support** — real-time chat where a two-second gap already reads as "the bot is stuck."

OpenAI has said early access is going to a small, select group of API customers testing exactly these four categories, with access expanding "as capacity grows" — no committed general-availability date yet.

## What an Ultrafast call might look like

OpenAI hasn't published full request-level docs yet, but the shape of a service-tier parameter is a familiar pattern from other providers' fast-lane offerings:

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-5.6-sol",
    service_tier="ultrafast",  # illustrative — not yet confirmed API shape
    messages=[
        {"role": "user", "content": "Summarize this incident log in three bullets."}
    ],
)
```

Until OpenAI ships real docs for the parameter name and rollout mechanics, treat any code sample — including this one — as directional, not something to copy into production.

## The part nobody's said out loud: pricing

Here's my honest read on this: the complete silence on Ultrafast pricing is the most interesting detail in the announcement, and it's a little frustrating for anyone trying to plan around it. GPT-5.6 Sol's Standard tier already isn't cheap at $5 input / $30 output per million tokens, and dedicated wafer-scale silicon is not commodity hardware — Cerebras isn't giving away rack space. A meaningful premium over Standard pricing seems close to certain; the only open question is how large. Teams evaluating Ultrafast for production should budget for a real cost increase per token, not assume speed comes free, and should push for concrete numbers before committing any roadmap decisions to it. For teams currently managing spend the other direction, our piece on [cutting LLM token costs](/en/posts/cut-llm-token-costs) is a useful counterweight while you wait for Ultrafast's price sheet to materialize.

## The competitive angle

This is OpenAI's first public move to hand off inference to a dedicated silicon vendor at this speed tier, and it's aimed squarely at the same niche Anthropic and Groq have already been competing in. Claude Opus 4.8's Fast mode exists for the identical reason — some workloads care more about milliseconds than marginal accuracy points — and Cerebras itself already hosts open models like Llama and Qwen at similar throughput for other customers. What's new here isn't the idea of fast inference; it's OpenAI, specifically, deciding its own GPU stack wasn't going to get there alone. If you're choosing between frontier models today, our [Claude Sonnet 5 vs GPT-5.6 vs Gemini 3.5 comparison](/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5) is a reasonable starting point, and it's worth revisiting once Ultrafast's pricing and general-availability timeline are public — a fast tier only matters if you can actually get access to it and afford it.

[TechCrunch's coverage](https://techcrunch.com/2026/08/13/openai-introduces-ultrafast-a-new-mode-that-makes-gpt-5-6-sol-work-at-14x-the-speed/) and [The Decoder's technical write-up](https://the-decoder.com/gpt-5-6-sol-goes-14x-faster-as-openai-launches-ultrafast-mode-powered-by-cerebras/) both frame Ultrafast the same way: a legitimate infrastructure story, not a model-capability story. Sol's reasoning quality hasn't changed — only how fast you can get its output onto your screen. For teams already deep in GPT-5.6's pricing tiers, it's worth reading alongside our earlier coverage of [Sol, Terra, and Luna's price cuts](/en/posts/gpt-5-6-price-cuts-luna-terra) to see how OpenAI has been positioning the whole family this year.

## Frequently Asked Questions

### When will Ultrafast be available to everyone?

There's no committed general-availability date. OpenAI says it's starting with a small, select group of API customers and will expand access "as capacity grows" — language that signals a capacity-constrained rollout rather than a fixed timeline.

### How much does Ultrafast cost?

Pricing hasn't been disclosed. GPT-5.6 Sol's Standard tier costs $5 per million input tokens and $30 per million output tokens; Ultrafast will almost certainly carry a premium over that given the dedicated Cerebras hardware involved, but OpenAI hasn't published a number.

### Can I use Ultrafast in the ChatGPT app?

Not yet. Ultrafast is API-only for now — it hasn't rolled out to the consumer ChatGPT app, which continues to run on OpenAI's standard serving infrastructure.

### Is Ultrafast a new or different model from GPT-5.6 Sol?

No. It's the same GPT-5.6 Sol model and weights, served on Cerebras' Wafer-Scale Engine hardware instead of OpenAI's usual GPU inference stack. Output quality should be equivalent; only serving speed changes.
