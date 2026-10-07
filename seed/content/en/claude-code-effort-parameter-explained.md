---
title: "What Does Claude Code's effort Parameter Do?"
slug: "claude-code-effort-parameter-explained"
translationKey: "claude-code-agent-effort-parameter"
locale: "en"
excerpt: "Short answer: effort lets you set how hard a sub-agent reasons, from low to max, so you spend tokens on the tasks that actually need deep thinking."
category: "ai"
tags: ["claude", "ai-agents", "ai-coding", "automation"]
publishedAt: "2026-10-07"
seoTitle: "Claude Code effort Parameter: What It Does and How to Use It"
seoDescription: "Claude Code's effort parameter lets you pick how deeply a sub-agent reasons, from low to max, controlling both token cost and output quality per task."
---

Short answer: `effort` is a new parameter that lets you set how deeply a sub-agent reasons on each task you hand to Claude Code's Agent tool. It shipped in Claude Code 2.1.292 on October 6, 2026, and accepts five values: `low`, `medium`, `high`, `xhigh`, `max`. A quick file lookup runs cheap and fast at `low`; a hard architecture decision gets the deeper reasoning of `high` or `max`.

## What Does the effort Parameter Actually Do?

The `effort` parameter sets how much "thinking budget" a sub-agent gets before it answers. Before this, every sub-agent reasoned at roughly the same depth regardless of how hard its task was — wasting tokens on trivial lookups and sometimes under-thinking genuinely hard ones. The new parameter hands that decision to whoever is spawning the sub-agent.

The official changelog entry describes it plainly: an `effort` parameter was "added to the Agent tool, so Claude runs a sub-agent at the effort level you ask for." In practice, that means an orchestrating session can fire off "check the latest version of this npm package" at `effort: low` and "redesign this module while preserving backward compatibility" at `effort: max` — in the same workflow.

## Where and How Do You Set the effort Parameter?

You set `effort` as an optional field wherever you call the Agent tool — inside a live Claude Code session, or from a plugin through the `agent.spawn` mod hook. Leave it out and the sub-agent runs at the default level; you only set it explicitly on tasks where the difficulty actually justifies a different depth.

Here's a low-effort call for a trivial lookup:

```json
{
  "tool": "Agent",
  "input": {
    "description": "Check latest npm package version",
    "prompt": "Find the latest version of lodash on npm and return just the version string.",
    "effort": "low"
  }
}
```

And a max-effort call for a genuinely hard task:

```json
{
  "tool": "Agent",
  "input": {
    "description": "Redesign the payment module",
    "prompt": "Move the payment module to an event-driven architecture without breaking the existing API contract.",
    "effort": "max"
  }
}
```

## What's the Difference Between low, medium, high, xhigh, and max?

The five levels represent increasing reasoning depth and token budget, in that order. `low` suits single-step lookups with a clear answer; `medium` is a reasonable middle ground for tasks that weigh a handful of files together. `high` and above kick in for multi-step planning, cross-file changes, or genuinely ambiguous requirements; `max` is reserved for the hardest, most multi-step work.

| Level | When to use it | Typical task |
| --- | --- | --- |
| low | Single-step, clear-answer work | Version lookup, simple file read |
| medium | Weighing a few files together | Tracing a small bug's root cause |
| high | Multi-step planning | Designing a new feature end to end |
| xhigh | High-ambiguity, wide-blast-radius changes | A multi-module refactor |
| max | The hardest, most multi-step work | Running an architecture migration end to end |

## How Does effort Change Your Token Bill?

A higher effort level runs more reasoning steps, which burns more tokens — and that means higher cost and longer latency. The practical consequence: running dozens of sub-tasks at `max` effort in a large orchestration pipeline will drain your budget for no good reason. As we covered in [our guide to making AI token spend visible by team](/en/posts/ai-finops-token-spend-visibility), cost control in agentic workflows is no longer just about which model you pick — it's also about how much reasoning depth you assign per task, and `effort` moves that control down to the individual sub-agent.

The real skill here is estimating which tasks actually need which level. Running everything at `low` is cheap but risky; running everything at `max` is safe but expensive. Getting that balance right is the same kind of engineering call we discussed in [AI agents vs workflows](/en/posts/ai-agents-vs-workflows): classifying the task up front and assigning effort accordingly beats guessing your way through trial and error.

## What Else Shipped Alongside the --marketplace Flag?

The same 2.1.292 release added a `--marketplace <source>` flag to `claude plugin install`. The flag adds the named marketplace first if it isn't already registered — under the same policy checks as `claude plugin marketplace add` — then installs the plugin from it, collapsing two commands into one. As we described in [our guide to building and sharing Claude Code plugins](/en/posts/build-and-share-claude-code-plugins), this cuts setup friction for teams juggling more than one marketplace.

The release also added a handful of hooks for mod developers: a `prompt.autocomplete` event, prompt-caching support in `$.model.complete`, and workflow-agent support in the `agent.spawn` hook. All of it points the same direction: making Claude Code more programmable, for individual users and for teams building automation on top of it alike.

My honest take: this small-looking parameter is actually a sign that multi-agent orchestration is maturing. A year ago, "wire the agents together" was the whole story; now "how much thinking budget do I give each agent" is itself the engineering decision.

## What Are the Common Mistakes When Using the effort Parameter?

The most common mistake is pinning one effort level across an entire orchestration pipeline. When a team decides to "play it safe" and runs every sub-task at `high` or `max`, even a trivial file read ends up running through unnecessary reasoning steps, and the token bill balloons fast. The opposite mistake is just as common: running everything at `low` to save money produces shallow results on tasks that actually need multi-step planning — the sub-agent returns a fast answer without ever seeing the task's real complexity.

A second common mistake is picking the effort level before defining the task instead of after. When an orchestrator tries to guess "how hard could this be" before the sub-agent has even looked at anything, the guess usually comes in low — because a task's real complexity often doesn't show up until a sub-agent is already inside the files. A more reliable approach is breaking the task into smaller pieces and assigning effort separately: "find this file" gets `low`, "redesign the architecture based on what you found" gets `high` or `max`.

A third point: treating effort as a quality guarantee on its own. Higher effort buys more reasoning steps, but if the prompt handed to the sub-agent is itself ambiguous, higher effort doesn't resolve that ambiguity — it just produces a more expensive ambiguous result. As we covered in [our guide to context engineering for AI agents](/en/posts/context-engineering-for-ai-agents), prompt clarity and effort level are two separate decisions that complement each other; neither substitutes for the other.

## Frequently Asked Questions

### How do you use the effort parameter in Claude Code?

You add an `effort` key to the Agent tool's input and set it to `low`, `medium`, `high`, `xhigh`, or `max`. Leave it unset and the sub-agent runs at the default level; the parameter lets you manually match reasoning depth to how hard the task actually is.

### How much more does a higher effort level cost?

The exact ratio depends on the task, but the rule holds: higher effort runs more reasoning steps and burns more tokens. Keeping simple tasks at `low` and reserving `high` or above for genuinely hard ones keeps your total spend down.

### What does the --marketplace flag do?

Added to `claude plugin install`, the `--marketplace <source>` flag registers the named marketplace first (if needed) under the same checks as `claude plugin marketplace add`, then installs the plugin from it — one command instead of two.

### Which Claude Code version introduced the effort parameter?

It shipped in Claude Code 2.1.292 on October 6, 2026. Earlier versions don't accept the parameter on the Agent tool, so you need to be on 2.1.292 or later to use it.
