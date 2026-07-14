---
title: "GPT-5.6 Goes GA as Codex Moves Into ChatGPT Desktop"
slug: "gpt-5-6-general-availability-codex-desktop"
translationKey: "gpt-5-6-general-availability-codex-desktop"
locale: "en"
excerpt: "GPT-5.6 went GA on July 9 and Codex moved into the ChatGPT desktop app. Should you switch your daily coding agent, or is this just packaging?"
category: "ai"
tags: ["llm", "ai-tools", "ai-coding", "developer-experience", "chatgpt", "openai"]
publishedAt: "2026-07-13"
seoTitle: "GPT-5.6 GA and Codex in ChatGPT Desktop: A Guide"
seoDescription: "GPT-5.6 went GA on July 9 and Codex moved into the ChatGPT desktop app. Should you switch your daily coding agent, or is this just packaging?"
---

GPT-5.6 reached general availability on July 9, 2026, after a short preview window, and OpenAI used the same day to fold Codex into the ChatGPT desktop app. Short answer: the benchmarks barely moved, ChatGPT is now one app that switches between ChatGPT, ChatGPT Work, and Codex, and the real question is whether that's reason enough to change your daily coding agent.

## What actually changed in the ChatGPT desktop app?

OpenAI bundled two separate moves into one announcement. The first is the model layer: GPT-5.6 landed in three tiers — Sol, Terra, and Luna — across the API and ChatGPT. The second is the product layer: Codex is no longer a separate download. It now lives inside the ChatGPT desktop app on macOS and Windows, and users switch between a regular ChatGPT chat, the newly introduced "ChatGPT Work" agent, and Codex from the same window. The old standalone ChatGPT app didn't disappear — it was rebranded "ChatGPT Classic" and still runs, but it now reads like the legacy option. As [9to5Mac reported](https://9to5mac.com/2026/07/09/openai-announcing-the-next-chapter-for-chatgpt-today-watch-here/), this fits OpenAI's broader push to turn ChatGPT from a chat box into a work surface.

For developers, this is the concrete change that lands in July 2026: trying Codex no longer requires a separate install, a separate account flow, or CLI familiarity. If ChatGPT is already open, Codex is one tab away.

## Three models, one price sheet: Sol, Terra, Luna

The GPT-5.6 family splits into three tiers. Sol is the flagship, tuned for specialist work in biology, chemistry, and cybersecurity. Terra is balanced for everyday use. Luna is the lightest option, built for speed and cost. All three share the same 1.05M-token context window and 128K maximum output tokens, so switching tiers doesn't force you to rethink your architecture.

| Model | Input $/Mtok | Output $/Mtok | Context | Max output |
|-------|--------------|----------------|---------|-------------|
| Sol | $5 | $30 | 1.05M | 128K |
| Terra | $2.50 | $15 | 1.05M | 128K |
| Luna | $1 | $6 | 1.05M | 128K |

Cached input gets a 90% discount, while cache writes cost 1.25x uncached input. In practice, an agentic workflow that keeps resending the same system prompt and repo context can see its bill drop fast, even on Sol. [OpenRouter's model page](https://openrouter.ai/openai/gpt-5.6-sol) tracks this pricing and the token limits live.

## Terminal-Bench 2.1: does Sol actually code better?

This is where the real question starts. OpenAI published strong numbers for Sol elsewhere — 94.1% on GPQA Diamond, 85.1% on τ²-Bench, 77.4% on Coding Index. But on Terminal-Bench 2.1, the benchmark developers actually care about for agentic coding, the picture looks like this:

| Model | Terminal-Bench 2.1 |
|-------|---------------------|
| Sol Ultra | 91.9% |
| Sol (base) | 88.8% |
| Claude Mythos 5 | 88.0% |
| GPT-5.5 | 88.0% |

Read that table plainly and the story is clear: base Sol lands almost exactly where its own predecessor, GPT-5.5, already stood, and it's separated from Claude Mythos 5 by a margin so small it's essentially a tie. Sol Ultra clears a three-point edge, but that's not the "coding revolution" some coverage implies — it's an improvement close to measurement noise. As [Engadget's writeup](https://www.engadget.com/2210308/openai-rolls-out-gpt5-6-july-9/) also frames it, GPT-5.6's real story isn't raw capability.

## Codex is now inside ChatGPT: is this a packaging move?

Yes, and that's the point. The tiny Terminal-Bench gap explains why OpenAI shipped this as a distribution launch rather than a model launch. Bundling Codex into the ChatGPT desktop app that millions of people already keep open isn't a step-change in coding ability — it's a move engineered to put Codex in front of a much larger audience with zero extra friction. [MacObserver's coverage](https://www.macobserver.com/news/openai-launches-gpt-5-6-chatgpt-work-and-new-desktop-app-with-built-in-codex/) makes the same point: the merge removes the friction of convincing someone to download a separate tool.

Little changed on the API surface itself beyond the model name and price line:

```python
# Illustrative only, not tested live.
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-5.6-sol",
    messages=[
        {"role": "system", "content": "You are a senior backend engineer."},
        {"role": "user", "content": "Find the state-lock bug in this Terraform module."},
    ],
    max_tokens=4096,
)

print(response.choices[0].message.content)
```

Codex has no standalone monthly price of its own — access rides on whatever ChatGPT plan you already have. Plus, at $20 per month, includes roughly 10–60 cloud tasks and 20–50 code reviews per rolling 5-hour window. That's a meaningfully different model from the usage-based billing you get with Claude Code or the standalone Codex CLI, since your limits are baked into your subscription tier rather than metered separately.

## Should you switch your daily coding agent to Codex?

The decision here hinges on the shape of your workflow, not the benchmark table. If you already have a CI/CD setup and subagent architecture built around Claude Code, Cursor, or another dedicated coding agent, folding it all up because ChatGPT grew one more tab is a weak justification on its own. As we covered in our piece on [background subagents](/en/posts/claude-code-subagents-background-agents), the real productivity gains usually come from the orchestration layer around an agent rather than the model underneath it, and that layer doesn't get rebuilt overnight.

On the other hand, if you've never tried Codex and your team already keeps ChatGPT open all day, the friction to try it is close to zero now. Running a quick pilot is cheap, but base the decision on real failure rates rather than the "Codex is in ChatGPT now" headline — the kind of failure modes we warned about in [common AI coding assistant mistakes](/en/posts/ai-coding-assistant-mistakes). What makes an agent your daily driver isn't its benchmark score; it's where it stalls in long agentic loops, which tool calls it hallucinates, and how much review overhead it adds back.

For a broader model-to-model comparison, our [Claude Sonnet 5 vs GPT-5.6 vs Gemini 3.5 breakdown](/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5) covers price, context, and agentic reliability side by side. For the wider AI news cycle, our [AI category](/en/category/ai) tracks the rest of this week's announcements.

## ChatGPT Work and GPT-Live-1: the side announcements

Two more announcements landed in the same wave. "ChatGPT Work" is a new agent that pulls context from a team's scattered notes, drafts, and connected tools and turns them into finished output — a knowledge-work product more than a coding one. OpenAI also introduced GPT-Live-1 and a smaller GPT-Live-1 mini: full-duplex voice models that listen and respond continuously instead of waiting for a turn to end. Neither is this week's headline, but both point at where the ecosystem is expanding next — voice and work-focused agents, not just coding.

## Frequently Asked Questions

### When did GPT-5.6 reach general availability?

GPT-5.6 reached general availability on July 9, 2026, following a limited preview that started around June 26, 2026. Codex was merged into the ChatGPT desktop app the same day.

### Do I need a separate subscription to use Codex?

No. Codex has no standalone monthly price; access depends on your existing ChatGPT plan. The Plus plan, for example, includes a limited number of cloud tasks and code reviews per rolling 5-hour window.

### What's the difference between Sol, Terra, and Luna?

Sol is the flagship, tuned for specialist work like biology, chemistry, and cybersecurity. Terra is balanced for everyday tasks. Luna is the lightest tier, built for speed and low cost. All three share the same context window and output limit.

### Does moving Codex into ChatGPT affect Claude Code or Cursor users?

Not directly. Terminal-Bench 2.1 scores show Sol landing almost even with Claude Mythos 5 and GPT-5.5, so this is a distribution move rather than a capability leap. Teams with an established agentic workflow have little reason to switch; teams that haven't tried Codex yet get a low-cost way to pilot it.
