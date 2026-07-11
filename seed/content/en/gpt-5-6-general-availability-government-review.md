---
title: "GPT-5.6 Is Live: Inside OpenAI's Government AI Review"
slug: "gpt-5-6-general-availability-government-review"
translationKey: "gpt-5-6-general-availability"
locale: "en"
excerpt: "GPT-5.6's Sol, Terra, and Luna models are now generally available — but only after 12 days behind a US government review, a first for a frontier launch."
category: "ai"
tags: ["llm", "ai-tools", "cost-optimization", "ai-infrastructure"]
publishedAt: "2026-07-11"
seoTitle: "GPT-5.6 General Availability: Sol, Terra, Luna Explained"
seoDescription: "GPT-5.6's Sol, Terra, and Luna models are now generally available — but only after 12 days behind a US government review, a first for a frontier launch."
---

OpenAI [shipped GPT-5.6 to general availability](https://openai.com/index/gpt-5-6/) on July 9, 2026: a three-tier model family — Sol, Terra, and Luna — now live across ChatGPT, Codex, and the API. What makes this launch newsworthy isn't the release itself, though. It's what stood in front of it: 12 days behind a formal US government review, making GPT-5.6 the first frontier model to reach the public through that gate.

For developers, that's two stories in one: a new set of model tiers to route traffic across, and a new precedent for how frontier launches will work going forward.

## Sol, Terra, Luna: which tier for what

OpenAI positioned the three models around distinct workloads. Sol is the top tier, built for long-horizon agentic work and problems where a wrong answer is expensive. Terra is the balanced middle option, matching GPT-5.5-class performance at roughly half the cost. Luna is the fastest and cheapest of the three, aimed at high-volume, cost-sensitive traffic.

All three share the same technical foundation: a 1.05M-token context window, 128K max output tokens, a February 16, 2026 knowledge cutoff, and support for function calling, web search, file search, and computer use.

| Model | Input ($/1M tok) | Output ($/1M tok) | Best fit |
|---|---|---|---|
| Sol | $5 | $30 | Complex agentic work, low tolerance for costly mistakes |
| Terra | $2.50 | $15 | Everyday production traffic |
| Luna | $1 | $6 | High-volume, cost-sensitive jobs |

Cached input gets a 90% discount, while cache writes cost 1.25x uncached input — a meaningful lever for agent architectures that repeat large system prompts across calls, echoing the caching tactics we covered in [How to Cut LLM Token Costs by 70%](/en/posts/cut-llm-token-costs).

## What the benchmarks actually show

By OpenAI's own numbers, Sol Ultra scores 91.9%, standard Sol 88.8%, Terra 84.3%, and Luna 82.5% — against GPT-5.5 at 83.4%, Claude Mythos 5 at 88.0%, and Claude Opus 4.8 at 78.9%. On Agents' Last Exam, which evaluates long-running professional workflows across 55 fields, Sol set a new high of 53.6, beating Claude Fable 5's adaptive-reasoning mode by 13.1 points.

Those figures largely reinforce the decision framework we laid out in [Claude Sonnet 5 vs GPT-5.6 vs Gemini 3.5](/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5): no single model wins every task, and the right pick depends on your workload. Before routing production traffic to a new tier, re-run it through the eval set from [How to Evaluate LLM Outputs](/en/posts/how-to-evaluate-llm-outputs) — swapping models silently changes output distribution even when benchmarks look flat.

## Why it took 12 days

Here's the part with the real news hook. An executive order signed June 2, 2026, directed federal agencies to build a review process for powerful new AI models, asking companies to submit frontier models for evaluation up to 30 days before public release. GPT-5.6 was the first major model to walk through that door.

For 12 days, between June 26 and July 9, GPT-5.6 was available only through OpenAI's API and Codex, to roughly 20 vetted organizations whose identities OpenAI shared directly with the government. It's the first time an American lab gated a frontier model behind a state-approved customer list, as [MLQ News reported](https://mlq.ai/news/commerce-department-clears-openais-gpt-56-for-broad-public-launch-on-july-9/).

The review itself was led by the Commerce Department's Center for AI Standards and Innovation (CAISI), focused on cybersecurity risk, biological and chemical domains, and the model's potential for self-improvement. OpenAI engineers had direct technical meetings with government officials in Washington throughout the process.

## What the price gap means in practice

Numbers stay abstract until you run them against a real workload. Take an agent pipeline processing 50 million tokens a day, with 70% of input served from cache. On Terra, that pipeline costs roughly $625/day without the caching discount, dropping to around $250/day once the 90% cached-input rate kicks in — getting your caching strategy right alone can shave thousands of dollars a month off the bill. Moving that same workload to Sol roughly doubles the cost; it only makes sense on the steps where a wrong answer is genuinely expensive — payments, security decisions, irreversible actions.

This is where it pays to build your agent architecture around a routing layer rather than a single model: simple classification and summarization can run on Luna, multi-step planning on Sol. Rather than hand-writing that routing logic, adding a router that picks a model based on task complexity optimizes both cost and latency automatically.

## What this means for OpenAI's next launches

The fact that CAISI's review took 12 days for GPT-5.6 signals the next major model will likely face a similar wait. How OpenAI managed the process — which organizations landed on the early-access list, which risk categories got the most scrutiny — sets the template for future reviews. Since the executive order covers other labs too, it wouldn't be surprising to see a similar "restricted access window" on Anthropic's or Google's next frontier launch.

The practical takeaway for engineering teams: estimating when the next-generation model actually lands now means padding not just for the lab's own development timeline, but for the regulatory review window too. Teams doing roadmap planning should shift from "we'll switch once the new model ships" to "we'll switch once the new model ships plus however long the review takes."

## What actually changes for developers

Short term, the practical impact is limited — the models are public now; pricing and API access are standard. But the precedent matters. As of mid-2026, releasing a frontier model in the US effectively runs through Washington first, whether or not the law strictly requires it. That has direct implications for future launch timelines — and for when the next model you're waiting on actually lands in your hands.

Our take: this review is likely to become routine and stretch future launch calendars by a predictable few weeks; the more interesting question is how it reshapes the competitive gap between the three frontier labs and everyone else trying to catch up.

## Frequently Asked Questions

### How do I access GPT-5.6?

It's public as of July 9, 2026, across ChatGPT, Codex, and the OpenAI API. Sol, Terra, and Luna are listed as separate model IDs — which one you pick depends on your workload's complexity and cost sensitivity.

### How should I choose between Sol, Terra, and Luna?

Start with Sol if you can't tolerate costly failures, Terra for everyday production traffic, and Luna for high-volume, cost-sensitive jobs. In practice, testing the same task on a cheaper tier first and escalating only if quality drops works well.

### Will this government review affect other labs too?

The executive order covers all frontier model developers, not just OpenAI. Since GPT-5.6 is the first case, the process hasn't fully matured — it wouldn't be surprising to see a similar review window apply to Anthropic's and Google's next major launches.

### How does pricing compare to the previous generation?

Terra's input/output pricing is roughly in line with GPT-5.5 but delivers stronger performance — in practice, better output for the same budget. The 90% cached-input discount meaningfully lowers total cost for agent workflows that repeat system prompts across calls.
