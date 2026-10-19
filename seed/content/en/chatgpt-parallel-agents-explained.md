---
title: "What Are ChatGPT's Parallel Agents?"
slug: "chatgpt-parallel-agents-explained"
translationKey: "chatgpt-parallel-agents-2026"
locale: "en"
excerpt: "ChatGPT's parallel agents, rolled out October 16, 2026 for Pro users, split one task into subtasks that run at the same time instead of one after another."
category: "ai"
tags: ["chatgpt", "openai", "ai-agents", "automation"]
publishedAt: "2026-10-19"
seoTitle: "ChatGPT's Parallel Agents, Explained"
seoDescription: "ChatGPT's new parallel agents (Pro, Oct 2026) split a task into subtasks that run at once in the Chat tab. Here's what it does and when it's worth using."
---

Short answer: ChatGPT's parallel agents, rolled out to Pro users in the Chat tab on October 16, 2026, split one complex request into several subtasks that run at the same time instead of one after another, and let you open and review each finished subtask as it completes rather than waiting for a single linear response.

## What do ChatGPT's parallel agents actually do?

Instead of one agent working through a task step by step in a single thread, the feature fans a request out into multiple agents that each take a slice of the work and run concurrently. You can watch each subtask's progress and open a finished piece as soon as it's done, rather than waiting for the entire response to finish before seeing any of it. OpenAI paired the [rollout](https://runtimewire.com/article/openai-gpt-6-pro-chat-multi-agent-upgrade) with claims of faster overall responses and better use of plugins and tools in the same update, though — as of this writing — it hasn't published specific numbers for speed, cost, or exactly how many agents a single request can fan out to.

Coverage of the announcement isn't even fully settled on the model's name: one write-up [refers to it](https://www.mind-verse.de/news/gpt-6-pro-chatgpt-parallele-agenten-0b8839a12fc3) as "GPT-6 Pro," another as "GPT-6 Astra Pro," which suggests the underlying model is a variant of the GPT-6 Astra family rather than a distinct new model — worth confirming in OpenAI's own documentation once it's published rather than treating either name as settled.

## Is this the same thing as the Codex coding-agent harness?

No — it's a separate product surface. The parallel-agents feature lives in ChatGPT's own Chat tab for Pro subscribers and is aimed at everyday multi-part requests, not at Codex's coding-specific agent harness or the separate Agents/API platform developers build on. A related but distinct example: OpenAI published a [case study in September 2026](https://openai.com/index/parallel-cuts-time-and-cost-with-astra/) about Parallel, a research company that uses the GPT-6 Astra API to delegate specific research subtasks to sub-agents programmatically — that's a developer integration built through the API, not the consumer Chat-tab feature this article covers. Don't confuse the two just because both involve the word "parallel" and the same underlying model family.

That naming overlap is a useful reminder that "parallel" describes a pattern — splitting work across multiple model calls that run at the same time — rather than one specific product. Claude Code's fork subagents, OpenAI's Chat-tab parallel agents, and the Parallel company's own API-level sub-agent orchestration are three separate implementations of the same underlying idea, built by different teams for different users, and none of them share code or configuration with each other.

## When does running agents in parallel actually help?

Parallelism pays off when a task breaks cleanly into independent pieces that don't depend on each other's output — research three unrelated competitors, draft three independent sections of a report, check five separate sources for the same fact. It wastes time and tokens when the pieces are sequential by nature: if subtask B needs subtask A's answer before it can start, running them "in parallel" just means B starts with no useful input and probably needs to be redone once A finishes.

| Task shape | Good fit for parallel agents? | Why |
|---|---|---|
| Research 3 competitors on separate criteria | Yes | Each subtask is independent; no shared dependency |
| Draft 4 independent report sections from the same brief | Yes | Sections don't need each other's output to start |
| Multi-step build-and-debug a single codebase | No | Each step depends on the previous step's result |
| Summarize 5 unrelated long documents | Yes | Each summary stands alone |
| A single back-and-forth negotiation or decision | No | Inherently sequential; there's only one thread of reasoning |

## How do you actually structure a request for it?

Write the prompt so each subtask is self-contained — give each one its own scope, its own inputs, and a clear definition of "done," rather than one subtask implicitly assuming the output of another.

```text
Research the pricing pages of Competitor A, Competitor B, and Competitor C
as three independent subtasks. For each one, report: current plan tiers,
price per seat, and any usage-based add-ons. Don't compare them to each
other yet — just report each one's facts separately.
```

A prompt shaped like that gives the fan-out step three genuinely independent subtasks to assign; a prompt that instead says "compare A, B, and C and tell me which is cheapest" forces a final synthesis step that has to wait for all three anyway, which narrows where parallelism actually saves time.

## What are the real limits right now?

The biggest one is that OpenAI hasn't published how many agents a request can fan out to, what it costs relative to a single-agent response, or what controls exist over which tools each sub-agent can use — all reasonable things to want before relying on this for anything cost-sensitive or high-stakes. Treat it, for now, as a feature to test on exploratory, parallelizable research tasks rather than something to build a production workflow around until OpenAI documents the mechanics more fully.

## My take

The useful skill here isn't "turn on parallel agents," it's recognizing which of your own requests are actually parallel in shape — most multi-part asks people type into a chat box are more sequential than they first appear, and forcing a sequential task through a parallel feature just adds coordination overhead without any of the speedup.

Related reading: see [ChatGPT Work: OpenAI's New Agent for Multi-Step Projects](/en/posts/chatgpt-work-openai-agent-explained) for a related but distinct agent product, [AI Agents vs Workflows: When to Use Each](/en/posts/ai-agents-vs-workflows) for the broader decision this task-shape question maps to, [AI That Does the Work: ChatGPT Work vs Cowork vs Gemini](/en/posts/chatgpt-work-vs-cowork-vs-gemini) for how this compares across providers, and [What Is GPT-6 Astra? Pricing, Context, Cyber Risk](/en/posts/what-is-gpt-6-astra) for the underlying model family's API side. More in our [AI](/en/category/ai) section.

## Frequently Asked Questions

### What are ChatGPT's parallel agents?
Parallel agents are a ChatGPT Pro feature, rolled out October 16, 2026 in the Chat tab, that split one complex request into multiple subtasks running at the same time instead of one after another, letting you open each finished piece as it completes.

### Are ChatGPT's parallel agents the same as Codex?
No. Parallel agents are a Chat-tab feature for everyday multi-part requests, separate from Codex's coding-specific agent harness and from the Agents/API platform developers build on programmatically.

### What kind of tasks actually benefit from parallel agents?
Tasks that break into genuinely independent pieces — researching several unrelated sources, drafting independent report sections — benefit most. Sequential tasks, where one step needs a previous step's output, don't get a real speedup from running "in parallel."

### Who can use ChatGPT's parallel agents right now?
As of the October 16, 2026 rollout, the feature is available to ChatGPT Pro subscribers in the Chat tab; OpenAI hasn't published details on broader plan availability, per-request agent limits, or pricing specific to the feature.
