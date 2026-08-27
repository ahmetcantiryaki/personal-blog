---
title: "Claude Now Shares Memory Across Chat and Cowork"
slug: "claude-memory-chat-and-cowork-explained"
translationKey: "claude-unified-memory-chat-cowork"
locale: "en"
excerpt: "Short answer: yes. On August 25, 2026, Anthropic merged Claude's memory across Chat and Cowork — info flows both ways, and sensitive topics stay out by default."
category: "ai"
tags: ["claude", "ai-agents", "privacy", "productivity"]
publishedAt: "2026-08-27"
seoTitle: "Claude Now Shares Memory Across Chat and Cowork"
seoDescription: "Short answer: yes, as of August 25, 2026 Claude's memory is shared between Chat and Cowork. Here's exactly what changed and what stays private by default."
---

Short answer: yes. On Tuesday, August 25, 2026, Anthropic merged Claude's memory system so Chat and Claude Cowork now read and write the same memory — something you tell Claude in a chat window is available to Cowork's cloud-run tasks, and anything Cowork learns comes back the other way. The change is on by default across Free, Pro, and Max plans, on web, desktop, and mobile; Claude Code is not part of this merge.

That ends the old model where two products quietly built two separate pictures of you. Here's what actually changed, what the privacy controls look like, and what it means in practice if you use Claude for real work.

The move also fits a broader 2026 pattern of AI companies consolidating around a single "agent layer" instead of separate products; users had been complaining for months about context built up in Chat not carrying over to Cowork, which meant re-typing the same instructions for multi-step, cloud-run tasks. [The Register's coverage](https://www.theregister.com/ai-and-ml/2026/08/25/claude-and-cowork-now-share-what-they-know-about-you/5292412) frames it as Anthropic's first major step toward treating both products as one system that knows the same things about you.

## What exactly changed with Claude's unified memory?

Claude Chat and Claude Cowork now read from and write to the same memory pool instead of two separate ones. Previously, handing a task to Cowork meant that session had no idea about preferences or project context you'd shared in Chat weeks earlier; now Cowork can pull on that Chat history while running a task in the cloud, so you stop repeating the same context twice.

The update is also live during a conversation rather than only at its end: Claude can add a new item to memory while you're still typing, not just after you close the chat. According to [Anthropic's announcement](https://claude.com/blog/claudes-memory-works-everywhere-and-you-decide-whats-in-it), that means a preference you mention mid-conversation can already inform a multi-step Cowork task running in parallel.

## What information goes into memory, and what stays out by default?

Sensitive categories — health, ethnicity, religion, political views, and gender identity — are excluded from memory by default, and Claude does not take notes on these unless you explicitly turn that on. Everything else — your project preferences, coding style, and recurring workflows — shows up individually under a "Topics" list in Settings > Memory.

That list isn't a read-only log: you can edit or delete any single topic, or pause memory entirely. In practice, that means you can clean up project-specific topics once a client engagement ends, the same way you'd clear browser history.

| Control | Where | What it does |
|---|---|---|
| View topics | Settings > Memory > Topics | Lists everything Claude remembers, item by item |
| Delete one topic | Topics list | Permanently removes a single remembered item |
| Pause memory | Settings > Memory | Stops new topics from being added; keeps history intact |
| Enable sensitive categories | Settings > Memory | Opts in to notes on health/politics/identity topics |
| Full reset | Settings > Memory | Clears the entire memory history at once |

## How is this different from Cowork's earlier web and mobile expansion?

[Claude Cowork's expansion to web and mobile](/en/posts/claude-cowork-web-mobile-expansion) was about which devices could reach Cowork; this update is about what Cowork *knows* — it's a memory-architecture change, not an access-channel change. The two changes compound: you can now reach Cowork from your phone, and wherever you reach it from, you see the same memory.

That distinction matters for developers because [AI agent memory design](/en/posts/ai-agent-memory-systems) usually comes down to where you draw the line between short-term session state and long-term persistent preference; Anthropic just moved that line from a single product to two products, and from a single session to the account level.

## How does this differ from ChatGPT's and Gemini's approach to memory?

OpenAI's ChatGPT and Google's Gemini also hold persistent memory across conversations, but both operate within a single product surface — ChatGPT's memory carries over between separate ChatGPT sessions, and Gemini's personalization features stay confined to other Google products tied to your Google account. Anthropic's difference here is sharing memory between two separate *products* — a chat interface and a cloud-run agent platform — which is an architectural step competitors haven't taken at the same scale yet.

The difference sounds small but the practical effect is large: a preference you share in ChatGPT only applies to future ChatGPT conversations, it doesn't automatically carry into a separate agent system. In Claude, that same preference can directly inform a task Cowork runs independently in the cloud — which makes Anthropic the first major provider to merge "chat memory" and "agent memory" into one system.

## What does this mean in practice for developers and teams?

Say an engineer tells Claude in Chat, "always run tests in this repo with `pnpm test`" — that preference is now available when the same task goes to Cowork as a cloud-run background agent, without re-typing it. That's a direct time saving for teams already running [subagent and background-agent workflows](/en/posts/claude-code-subagents-background-agents), since fewer prompts get spent re-establishing context.

On the other hand, if multiple people share one account, memory now being visible across both surfaces means teams need more clarity about who added which preference — tracking that takes more attention than a single-user setup does. Anthropic hasn't announced a separate multi-user memory partition for this case; control still runs through the same Topics list.

Anthropic's announcement also didn't define a separate memory-isolation layer for shared seats on Team and Enterprise plans — so if a company account has five engineers sharing one Claude seat, everything they add currently accumulates in the same Topics list. Teams running that kind of setup should plan on reviewing the Topics list regularly and doing project-based cleanup, at least in the first few weeks, since there's no automatic separation mechanism yet.

## Frequently Asked Questions

### Does Claude's shared memory work in Claude Code too?

No. Per Anthropic's August 25, 2026 announcement, this unified memory update covers only Claude Chat and Claude Cowork; Claude Code remains separate and is not affected by this change.

### Which Claude plans have unified memory turned on by default?

Free, Pro, and Max plans all have it on by default, across web, desktop, and mobile apps. Users who want it off can pause memory or delete specific topics from Settings > Memory.

### Does Claude save my health or political views to memory?

No, not by default. Categories like health, ethnicity, religion, political views, and gender identity are excluded from memory entirely unless a user explicitly turns that on in Settings > Memory.

### How do I see and delete what's in Claude's memory?

Go to Settings > Memory > Topics, where every item Claude has saved about you appears as its own entry. From there you can delete individual topics, pause memory altogether, or reset the entire history.
