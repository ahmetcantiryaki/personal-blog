---
title: "GPT-6 Sol vs Luna: Pricing and Benchmarks Compared"
slug: "gpt-6-sol-vs-luna-pricing-benchmarks"
translationKey: "gpt-6-sol-luna-launch-2026"
locale: "en"
excerpt: "Short answer: use Sol for coding and agentic work, Luna for high-volume simple tasks. Both launched September 22, 2026, with a 20x price gap between them."
category: "ai"
tags: ["openai", "chatgpt", "ai-coding", "llm"]
publishedAt: "2026-09-26"
seoTitle: "GPT-6 Sol vs Luna: Pricing and Benchmarks Compared"
seoDescription: "OpenAI launched GPT-6 Sol and Luna on September 22, 2026. Here is how their pricing, context window, and AutomationBench/DeepSWE scores compare."
---

Short answer: use GPT-6 Sol for complex coding and multi-step agentic work, and GPT-6 Luna for high-volume, lower-complexity tasks like summarization and extraction. Sol costs $2–$10 per million tokens, Luna costs $0.10–$0.50 per million tokens — a 20x gap.

## What are GPT-6 Sol and GPT-6 Luna?

OpenAI announced two new models on September 22, 2026, about a week after the [GPT-6 Astra](/en/posts/what-is-gpt-6-astra) launch: GPT-6 Sol and GPT-6 Luna. Sol is built for complex, multi-step work — coding and agentic reasoning. Luna is built for high-volume, lower-complexity tasks — summarization, extraction, Q&A, and clerical work.

Both models rolled out across ChatGPT Work, Codex, and the API. Plus, Pro, Business, Enterprise, and Edu users get access to both; Free and Go users get GPT-6 Luna only, in the ChatGPT desktop app. According to OpenAI's own launch post ([openai.com](https://openai.com/index/introducing-gpt-6-sol-and-luna/)), both models make roughly half as many mistakes as their GPT-5.6 predecessors, and pricing is roughly 50% lower than the equivalent GPT-5.6 tier.

Astra remains OpenAI's flagship model. Sol and Luna are positioned as a way to bring similar strengths into faster, cheaper tiers for everyday and at-scale use.

## How much does GPT-6 Sol cost?

Sol costs $2 per million input tokens and $10 per million output tokens. Cached input tokens cost just $0.20 per million — a 90% discount over standard input pricing. For agentic workflows that reuse the same system prompt and context across many steps, that cache discount meaningfully lowers the effective cost per run.

Sol's stated goal is to approach GPT-6 Astra-level reliability at a much lower cost. OpenAI's community announcement ([community.openai.com](https://community.openai.com/t/announcing-gpt-6-sol-and-gpt-6-luna-in-the-api-codex-and-chatgpt/1399925)) frames this directly: Sol targets similar task classes to Astra, priced well below it.

## How much does GPT-6 Luna cost?

Luna costs $0.10 per million input tokens and $0.50 per million output tokens, with cached input at just $0.01 per million. That works out to roughly 20 times cheaper than Sol for the same volume of tokens — as long as the task stays within Luna's complexity range.

OpenAI's headline claim is notable: at higher effort levels, Luna matches GPT-5.6 Sol's performance at about 1/100th the cost. For teams processing millions of rows through summarization, classification, or extraction pipelines, that ratio changes the budget conversation entirely.

## Should I use Sol or Luna for my task?

The rule of thumb is straightforward: if the task is multi-step, involves writing and running code, calling tools, or sticking to a long plan, use Sol. If the task is single-shot, fast, and repeated at high volume — summarizing 10,000 support tickets, say — Luna is the better fit.

In practice this maps to a clean split: having a Codex agent implement a feature end to end is Sol's job; tagging inbox messages or pulling a table out of a PDF is Luna's job. A growing pattern is to use both together in one pipeline — Luna handles triage and preprocessing, Sol handles the decisions that actually require judgment.

| Model | Input (1M tokens) | Output (1M tokens) | Cached input | Context |
|---|---|---|---|---|
| GPT-6 Luna | $0.10 | $0.50 | $0.01 | 1.05M |
| GPT-6 Sol | $2 | $10 | $0.20 | 1.05M |
| GPT-6 Astra | $10 | $50 | $1 | 1.05M |
| Claude Opus 5 | $9 | $45 | — | 500K |

Both models share the same context window: 1,050,000 tokens total, with a 922,000-token input cap and up to 128,000 output tokens. Context capacity is identical between Sol and Luna — the difference is entirely in reasoning depth and price.

## Does Sol actually beat Claude Opus 5 on benchmarks?

Yes, under one specific condition. On AutomationBench, Sol at "xhigh" effort scores 33.2% at $0.27 per task. That beats Claude Opus 5 at "max" effort, which scores 26.9% at 11.1x the cost. Sol also beats GPT-6 Astra at "low" effort, which scores 30.3% at 3.9x the cost ([TechCrunch](https://techcrunch.com/2026/09/22/openai-launches-gpt-6-sol-and-luna/)).

That table doesn't tell the whole story, though. On DeepSWE, Sol's best score is 68.8%, below GPT-5.6 Sol's 72.7% and Claude Opus 5's 73.7%. On OSWorld 2.0, the pattern repeats: Sol's best score is 64.4%, versus 66.2% for GPT-5.6 Sol and 70.2% for Opus 5. Sol wins on cost-per-task efficiency but still trails top-tier models on raw capability.

Editor's take: OpenAI's cost-efficiency framing is accurate but one-sided. The AutomationBench win is real, and so is the DeepSWE and OSWorld 2.0 shortfall — a team that needs the highest possible success rate on a genuinely hard software-engineering task still has good reason to reach for GPT-5.6 Sol or Opus 5 instead. Sol's real advantage shows up when "good enough" needs to run at scale, cheaply, over and over.

## How do you call Sol and Luna through the API?

Both models use the standard Chat Completions or Responses API shape; the only difference is the model ID and, optionally, an `effort` parameter.

```json
{
  "model": "gpt-6-sol",
  "input": "Find and fix the failing tests in this repo",
  "effort": "xhigh"
}
```

Swapping in Luna for a batch summarization job is a one-line change:

```json
{
  "model": "gpt-6-luna",
  "input": "Categorize these 500 support tickets",
  "effort": "high"
}
```

For teams running Codex, this decision is worth pairing with [Codex's 5-hour usage limits](/en/posts/openai-codex-5-hour-limit-returns): Sol burns through those limits faster because it costs more per call, so offloading preprocessing to Luna can stretch a Sol budget further.

## Which model makes sense for agentic workflows?

For multi-step, tool-calling agent chains, Sol is the safer default because it sticks to long plans and drops the error rate more reliably than Luna. OpenAI reports that Sol makes roughly half as many mistakes as the GPT-5.6 generation on multi-step workflows built with the [Agents API](/en/posts/openai-agents-api-explained).

Rather than routing an entire agent chain through Luna, the more reliable optimization is to use Luna only on the chain's cheap, repetitive steps — scraping and normalizing data from a webpage, for instance. According to 9to5Mac's coverage ([9to5mac.com](https://9to5mac.com/2026/09/22/openai-upgrading-chatgpt-and-codex-with-two-more-gpt-6-models/)), OpenAI specifically targeted these two models at everyday usage inside Codex and ChatGPT Work — a signal that "run everything on the most expensive model" is no longer the default assumption.

## Frequently Asked Questions

### What is the main difference between GPT-6 Sol and GPT-6 Luna?

Sol is built for complex coding and multi-step agentic tasks and costs $2–$10 per million tokens; Luna is built for high-volume, lower-complexity tasks like summarization and extraction and costs $0.10–$0.50 per million tokens. The price gap between them is roughly 20x, and both share the same 1.05 million-token context window.

### Does GPT-6 Sol replace GPT-6 Astra?

No. Astra remains OpenAI's flagship model and the only one rated "Critical" for cyber capability. Sol targets a similar cost-efficiency niche and beats Astra's "low" effort AutomationBench score, but it still trails Astra on harder benchmarks like DeepSWE and OSWorld 2.0.

### Is GPT-6 Luna available to free ChatGPT users?

Yes. Free and Go plan users get GPT-6 Luna in the ChatGPT desktop app. GPT-6 Sol is limited to Plus, Pro, Business, Enterprise, and Edu plans, plus the API and Codex.

### How does Sol's cost efficiency square with its lower DeepSWE and OSWorld 2.0 scores?

The two numbers measure different things. Sol delivers the best cost-per-task result on AutomationBench, but on harder engineering benchmarks it scores 68.8% on DeepSWE and 64.4% on OSWorld 2.0 — both below GPT-5.6 Sol and Claude Opus 5. For tasks that demand the highest possible raw success rate, a top-tier model is still the better pick.
