---
title: "Claude Sonnet 5.5 vs GPT-6.1 Sol: Which Should You Use?"
slug: "claude-sonnet-5-5-vs-gpt-6-1-sol"
translationKey: "claude-sonnet-5-5-vs-gpt-6-1-sol"
locale: "en"
excerpt: "Claude Sonnet 5.5 and GPT-6.1 Sol launched a day apart at the identical $2/$10 per-million-token price, so the real split is coding scores versus platform."
category: "ai"
tags: ["claude", "openai", "llm", "pricing"]
publishedAt: "2026-10-05"
seoTitle: "Claude Sonnet 5.5 vs GPT-6.1 Sol: Which to Pick?"
seoDescription: "Claude Sonnet 5.5 and GPT-6.1 Sol compared on price, benchmarks, and access. Both land at $2/$10 per million tokens, so coding scores and platform fit decide."
---

Short answer: price isn't the deciding factor here. Claude Sonnet 5.5 (announced September 28, 2026) and GPT-6.1 Sol (announced September 29, 2026, at OpenAI's DevDay) both list at $2 per million input tokens and $10 per million output tokens. Sonnet 5.5 edges ahead on coding benchmarks; GPT-6.1 Sol wins on cost-per-completed-task. Pick based on which platform your team already runs on.

## What is Claude Sonnet 5.5?

Claude Sonnet 5.5 is Anthropic's mid-to-upper-tier model, announced September 28, 2026, with Anthropic's own framing being "30% faster and costs up to 30% less for most work." That's an effective cost claim driven by fewer tokens and faster completions, not a list-price cut.

The list price is unchanged from Sonnet 5: $2 per million input tokens, $10 per million output tokens. The benchmark jump is the real story: SWE-bench Pro went from 63.2% on Sonnet 5 to 81.3% on Sonnet 5.5, SWE-bench Multilingual hit 90.3%, and Terminal-Bench 4.0 reached 70.6%.

The same week, on September 22, 2026, Anthropic also announced Claude Opus 5.5, positioned at "Fable 5.1"-level performance while costing 40% less to run than Opus 5, scoring 89.9% on SWE-bench Pro. This article focuses on the mid-tier matchup that actually competes head-to-head: Sonnet 5.5 against GPT-6.1 Sol. For the full rundown on Sonnet 5.5 alone, see [What Is Claude Sonnet 5.5?](/en/posts/claude-sonnet-5-5-explained)

## What is GPT-6.1 Sol?

GPT-6.1 Sol is the model OpenAI announced on September 29, 2026, at DevDay — one day after Sonnet 5.5. OpenAI's pitch: near GPT-6 Astra-level performance for coding and professional tasks at one-fifth of the standard token price.

The API price is $2 per million input tokens and $10 per million output tokens, with cached input at just $0.10 per million tokens, a 95% discount off standard input pricing. That standard rate is identical to Claude Sonnet 5.5's list price, down to the dollar.

On benchmarks, GPT-6.1 Sol scored 75.2% on DeepSWE v1.1 at high effort, versus GPT-6 Astra's 74.1%, while costing roughly $0.65 per task against Astra's $4.43 per task — about 85% cheaper per completed task. On OSWorld 2.0 it came within 2.1 points of Astra at roughly one-seventh the cost per completed task.

GPT-6.1 Sol isn't available in plain ChatGPT chat yet. Plus, Pro, Business, Enterprise, and Edu users can reach it inside ChatGPT Work and Codex, and developers can call it through the API as `gpt-6.1-sol`. For the full rundown on GPT-6.1 Sol alone, see [What Is GPT-6.1 Sol?](/en/posts/what-is-gpt-6-1-sol)

## Is Claude Sonnet 5.5 cheaper than GPT-6.1 Sol?

No, list prices are identical. As of September 2026, both models charge $2 per million input tokens and $10 per million output tokens. Two companies shipping their mid-tier flagship a day apart at the exact same price point isn't a coincidence — it's a sign of where the market is pushing token pricing.

The real difference shows up in cost per completed task. GPT-6.1 Sol's $0.65-per-task figure on DeepSWE v1.1, against Astra's $4.43, means it finishes the same work using far fewer tokens. Anthropic tells a similar "fewer tokens, faster completion" story for Sonnet 5.5 but hasn't published its own per-task cost number.

My take: this price tie is the clearest sign yet that the competition has moved past list price and onto a blunter question — how many tokens does it actually take to finish the job.

## How do the benchmarks compare?

Anthropic and OpenAI ran different benchmark suites, so a direct point-for-point comparison isn't quite fair. Here's what's published:

| Feature | Claude Sonnet 5.5 | GPT-6.1 Sol |
|---|---|---|
| Announced | September 28, 2026 | September 29, 2026 (DevDay) |
| Input price | $2 / million tokens | $2 / million tokens |
| Output price | $10 / million tokens | $10 / million tokens |
| Cached input price | Not disclosed | $0.10 / million tokens (95% off) |
| Primary coding benchmark | SWE-bench Pro: 81.3% | DeepSWE v1.1 (high effort): 75.2% |
| Secondary benchmark | Terminal-Bench 4.0: 70.6% | OSWorld 2.0: within 2.1 points of Astra |
| Cost per task | Not disclosed | ~$0.65/task (Astra: $4.43/task) |
| Access | Claude API, same price as Sonnet 5 | ChatGPT Work, Codex, API (`gpt-6.1-sol`) |

SWE-bench Pro and DeepSWE v1.1 test different things, so "81.3% beats 75.2%" isn't a clean win. What's comparable is the generational leap each company posted: Sonnet 5.5 jumped from Sonnet 5's 63.2% to 81.3% on SWE-bench Pro, while GPT-6.1 Sol beat GPT-6 Astra by three points on DeepSWE v1.1 at a fraction of the cost.

## How do you call each model's API?

Calling Claude Sonnet 5.5 through Anthropic's Messages API only requires swapping the model name from Sonnet 5:

```typescript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY!,
    "anthropic-version": "2026-09-28",
  },
  body: JSON.stringify({
    model: "claude-sonnet-5-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Refactor this function for readability." }],
  }),
});

const data = await response.json();
console.log(data.content[0].text);
```

Teams migrating their Python integration should check the [Anthropic Python SDK v1 migration guide](/en/posts/anthropic-python-sdk-v1-migration-guide) for the breaking changes between SDK versions.

## Which one should you actually use?

If you've already built on the Claude API, moving to Sonnet 5.5 is a one-line model-name change with no price risk since the rate didn't move. If your team lives in Codex or ChatGPT Work, GPT-6.1 Sol is a free upgrade bundled into the same subscription.

Teams building or evaluating coding agents should read the [Claude Code vs Cursor vs Antigravity comparison](/en/posts/claude-code-vs-cursor-vs-antigravity-2026) and the [spec-driven coding guide for Claude Code and Codex](/en/posts/spec-driven-coding-claude-code-codex) — both new models slot directly into those workflows. If you're still deciding on a subscription tier, the [AI subscription comparison for 2026](/en/posts/which-ai-subscription-2026) tracks current pricing across providers.

Google's Gemini 3.6 Flash is also in the ring as a third low-cost contender from the same stretch of 2026, but the sharpest comparison right now is the one between Claude and OpenAI landing at the same price point a day apart.

Sources: [Anthropic's announcements](https://www.anthropic.com/news), [coverage of GPT-6.1 Sol's DevDay launch](https://dataconomy.com/2026/09/30/openai-launches-gpt-6-1-sol-at-devday/), [a breakdown of GPT-6.1 Sol's benchmarks](https://www.vellum.ai/blog/gpt-6-1-sol-benchmarks-explained), and [a review of Claude Sonnet 5.5's pricing and benchmarks](https://www.digitalapplied.com/blog/claude-sonnet-5-5-launch-pricing-benchmarks-2026).

## Frequently Asked Questions

### Is there a price difference between Claude Sonnet 5.5 and GPT-6.1 Sol?

No, list pricing is identical. As of September 2026, both charge $2 per million input tokens and $10 per million output tokens. The one disclosed difference is that GPT-6.1 Sol has a separate cached-input rate of $0.10 per million tokens (a 95% discount), a figure Anthropic hasn't published for Sonnet 5.5.

### How do you access GPT-6.1 Sol in ChatGPT?

GPT-6.1 Sol isn't in plain ChatGPT chat yet. Plus, Pro, Business, Enterprise, and Edu users can reach it inside ChatGPT Work and Codex, and developers can call it directly through the OpenAI API using the model name `gpt-6.1-sol`.

### Where does Claude Opus 5.5 fit into this comparison?

Claude Opus 5.5 was announced a week before Sonnet 5.5, on September 22, 2026, and Anthropic says it performs at "Fable 5.1" level while costing 40% less to run than Opus 5. It scores 89.9% on SWE-bench Pro, ahead of Sonnet 5.5, but this article is about the mid-tier matchup — Sonnet 5.5 against GPT-6.1 Sol — not the top-tier models.

### Is Gemini 3.6 Flash part of this pricing race?

Yes, Google's low-cost Gemini 3.6 Flash is also active in this same window as a third cheap, fast contender. The reason this article centers on Claude and OpenAI specifically is that Sonnet 5.5 and GPT-6.1 Sol launched a day apart at the exact same per-million-token price.
