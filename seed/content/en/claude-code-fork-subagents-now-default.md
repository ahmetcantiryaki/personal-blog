---
title: "Claude Code's Fork Subagents Are Now the Default Everywhere"
slug: "claude-code-fork-subagents-now-default"
translationKey: "claude-code-fork-subagents-default-everywhere-2026"
locale: "en"
excerpt: "As of Claude Code 2.1.302 (Oct 16, 2026), fork subagents — which inherit the parent context — are now default in claude -p, the Agent SDK, desktop, and VS Code."
category: "ai"
tags: ["claude", "ai-agents", "ai-coding", "developer-experience"]
publishedAt: "2026-10-20"
seoTitle: "Claude Code Fork Subagents Now Default: What Changed"
seoDescription: "Claude Code 2.1.302 made fork subagents the default in claude -p, the Agent SDK, desktop, and VS Code. Here is what changed and how to turn it off."
---

Short answer: as of Claude Code 2.1.302, released October 16, 2026, forked subagents — child agents that inherit the parent conversation's full context instead of starting fresh — are now on by default across every surface: `claude -p`, the Agent SDK, the desktop app, and the VS Code extension. If you want the old behavior back, set `CLAUDE_CODE_FORK_SUBAGENT=0`.

## What Is a Fork Subagent, Exactly?

A fork subagent is a child agent that starts with a full copy of the parent's conversation history instead of a blank context window. A fresh subagent — the kind you get by setting `subagent_type` to anything other than `"fork"` — knows nothing about what you've already discussed; you have to brief it from scratch. A fork already knows everything the parent knows, so you can hand it a one-line directive ("summarize the auth bug we just found") and it understands the reference immediately.

The mechanism isn't new. Third-party trackers describe it going from an opt-in flag to the default for interactive sessions back in Claude Code v2.1.232 (August 13, 2026). What's new in 2.1.302 is that the default now extends to the remaining non-interactive surfaces — `claude -p` scripted runs, the Agent SDK, the desktop app, and VS Code — closing the gap between how forking behaved in a terminal session versus everywhere else. If you haven't used subagents at all yet, our [Claude Code subagents and background agents guide](/en/posts/claude-code-subagents-background-agents) covers the basics first.

## What Changed in Claude Code 2.1.302?

The official changelog entry for 2.1.302 (October 16, 2026) is direct: "Fork subagents are now on by default in `claude -p`, the Agent SDK, desktop, and VS Code." Before this release, scripted and SDK-driven workflows defaulted to fresh subagents, so automation pipelines that called the Agent tool without explicitly requesting a fork got isolated, context-free children. After 2.1.302, those same calls inherit the parent's context automatically unless the caller opts out.

That matters for anyone running Claude Code non-interactively — in CI, in a custom SDK integration, or as a background daemon. A script that spawns an agent to "fix the failing test" now hands that agent the whole conversation that led up to the request, not just the bare instruction string.

## When Forking Helps vs. When It Bloats Context

Forking earns its keep when the child needs the parent's situational awareness but you don't want its own tool noise — file reads, search results, intermediate command output — cluttering the main thread. A fork that drafts a commit message, answers a scoped research question, or does a side investigation can report back a short summary while its own transcript stays out of your way.

It costs you when the child doesn't need that history at all. A fork still pays to load the inherited context into its own window, and recursion is deliberately capped: a forked child cannot itself spawn further forks past a shallow depth, so workflows that assumed unlimited nesting will hit a wall — the same depth-limiting instinct behind the nested-subagent restrictions covered in [Claude Code Nested Subagents: Banned to Depth-3 in Four Days](/en/posts/claude-code-nested-subagents-depth-3). A task that's genuinely independent of the conversation so far is cheaper and safer as a fresh agent.

## A Real Example: Hitting the Depth Limit

Here's a concrete case from a session running Claude Code on October 20, 2026. After launching one fork subagent successfully, the same turn tried to launch four more agents in parallel — three additional forks plus one fresh research agent. All four calls failed immediately with the same error: `Subagent nesting limit reached (depth 1 of 1)`. The first fork was still running in the background and had already claimed the one available subagent slot; the limit wasn't really about conversation depth in the family-tree sense, it was a concurrency ceiling on how many subagent spawns can be in flight from one session at once.

The practical lesson: don't assume you can fan out five parallel forks the way you might fan out five independent API calls. Launch one, let it finish or confirm the environment's concurrency limit, and only then queue the next — or do the work directly instead of delegating it, if the task doesn't actually benefit from an isolated subagent.

## How Do You Turn It Off?

If a workflow depends on subagents starting with a clean slate — for instance, a test harness that deliberately wants to measure how an agent behaves with zero prior context — disable forking with one environment variable:

```bash
export CLAUDE_CODE_FORK_SUBAGENT=0
```

Setting it to `0` restores the pre-2.1.232 behavior: every subagent call starts fresh unless the caller explicitly passes `subagent_type: "fork"`. This is also the variable to reach for if you're debugging unexpected context bleed — a subagent referencing something from an earlier unrelated conversation is a sign forking picked up more history than you wanted.

The token overhead of inherited context is the same kind of cost tradeoff we cover in [How Prompt Caching Cuts Your LLM Bill](/en/posts/prompt-caching-cuts-llm-bill) — a long parent conversation that gets forked repeatedly benefits from the same cache-friendly, stable-prefix thinking as any other high-volume LLM workload. For more on the category generally, see our [AI section](/en/category/ai).

## Fork vs. Fresh Subagent

| | Fork subagent | Fresh subagent |
|---|---|---|
| Starting context | Full parent conversation history | Empty — briefed only by the prompt you write |
| Default since | v2.1.232 (interactive), v2.1.302 (`-p`, SDK, desktop, VS Code) | — (opt-in via explicit `subagent_type`) |
| Best for | Side tasks needing situational awareness; keeping noisy tool output out of the main thread | Independent, well-scoped tasks; parallel research that doesn't need shared history |
| Recursion | Capped at a shallow depth — can't spawn further forks indefinitely | Can itself spawn forks, subject to the same depth cap |
| Disable with | `CLAUDE_CODE_FORK_SUBAGENT=0` | N/A |

## Frequently Asked Questions

### Does forking a subagent cost more tokens?

Yes, generally. A fork loads the parent's entire conversation history into its own context window before doing anything else, so it starts with more tokens consumed than a fresh subagent that only receives your prompt. For short side-tasks the overhead is usually worth the saved briefing time; for long conversations, check whether a fresh agent with a tighter, hand-written brief would be cheaper.

### Can I still choose a fresh subagent after the 2.1.302 update?

Yes. Forking by default only applies when you omit `subagent_type` or otherwise don't request a specific fresh agent type. Explicitly naming a non-fork `subagent_type` still starts that agent with no inherited context, exactly as before.

### Why did my parallel subagent launches fail with a nesting-limit error?

The error "Subagent nesting limit reached" most often means a concurrency cap, not a family-tree depth problem: only a limited number of subagent spawns (sometimes just one) can be active from a session at a given moment. If you see it after launching several agents in the same turn, wait for the running one to finish, or raise the limit via `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` if your environment allows it.

### Is this the same as Claude Code's `/fork` command?

It's related but not identical. `/fork` is the interactive command for branching a session's history; the fork subagent default discussed here governs what context an agent spawned through the Agent tool receives, whether that spawn happens inside a terminal session, a script run with `claude -p`, an Agent SDK call, the desktop app, or VS Code.
