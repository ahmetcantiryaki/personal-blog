---
title: "Spec-Driven Development: The End of Vibe Coding?"
slug: "spec-driven-development-end-of-vibe-coding"
translationKey: "spec-driven-development-vibe-coding"
locale: "en"
excerpt: "Spec-driven development explained: what vibe coding broke in production, the SDD loop, and the tools—Spec Kit, Kiro, OpenSpec—as of July 2026 in practice."
category: "ai"
tags: ["ai-coding", "ai-tools", "ai-agents", "best-practices", "workflow"]
publishedAt: "2026-07-13"
seoTitle: "Spec-Driven Development: A Practical Guide"
seoDescription: "What is spec-driven development, how does the SDD loop work, and what do GitHub Spec Kit, AWS Kiro, and OpenSpec offer? Practical field notes from July 2026."
---

Spec-driven development (SDD) treats the specification as the single source of truth and code as a downstream artifact generated to match it. You write what you want and why; the agent writes the how; and you verify each step instead of reviewing one giant code dump at the end. In short: intent first, code second.

That is the exact inverse of the past year's buzzword, "vibe coding." With vibe coding you handed the model a vague request and skimmed whatever came back. After watching what that broke in production, the industry swung hard the other way—and as of July 2026, trade press frames SDD outright as the ["antidote to vibe coding."](https://visualstudiomagazine.com/articles/2026/05/12/github-spec-kit-takes-off-as-antidote-to-piecemeal-vibe-coding.aspx)

## What did vibe coding actually break in production?

A vague prompt forces the model to guess at thousands of unstated requirements. For a demo or a weekend prototype that is fine; nobody cares if it falls over. But run the same flow against production and three things crack at once.

First, review quality collapses. Few teams have the discipline to scrutinize a thousand-line dump line by line, so people say "looks good" and move on. Second, intent is recorded nowhere. Why the code was written this way, which edge cases were deliberately left out—the only record lives in the chat transcript from the moment of generation, and that transcript evaporates. Third, the cost of change explodes: when a requirement comes back around, there is no spec to anchor to, so the agent guesses again from scratch.

The common thread across all three is the same one behind most [mistakes people make with AI coding assistants](/en/posts/ai-coding-assistant-mistakes): we feed the model optimism instead of context. SDD promises to close exactly that gap by making intent written down and executable.

## The SDD loop: from constitution to implement

GitHub's open-source toolkit [Spec Kit](https://github.com/github/spec-kit) boils the loop down to five commands. The names vary by tool, but the logic holds:

- **constitution** — The project's immutable principles: test requirements, architectural boundaries, library preferences. Every later step must obey it.
- **specify** — What gets built and why. User stories and acceptance criteria, not technology. The "how" stays out of this step.
- **plan** — The technical plan: chosen stack, data model, external dependencies. It binds the spec to a concrete architecture.
- **tasks** — Breaking the plan into small, ordered, individually verifiable units of work.
- **implement** — The agent executes the tasks in sequence; you review focused, manageable changes instead of a thousand-line dump.

The critical point is that each step takes the previous one's output as input. Change the spec and the plan is re-derived; change the plan and the tasks are regenerated. This is nothing more than pushing the discipline of [context engineering for AI agents](/en/posts/context-engineering-for-ai-agents) down to the tooling layer—giving the model the right context, in the right order, on every turn.

## The tool landscape: where things stand in July 2026

SDD is not locked into a single product; it has grown into a family of tools that arrive with different philosophies.

| Tool | What it is | Standout | July 2026 status |
|---|---|---|---|
| GitHub Spec Kit | Agent-agnostic CLI + templates | Works with 30+ agents (Copilot, Claude Code, Gemini CLI) | Open source, 120,000 stars on GitHub |
| AWS Kiro | Spec-first IDE | Acceptance criteria in EARS notation | International GA, May 7, 2026 |
| OpenSpec | Lightweight spec-first workflow | Thin layer over your existing agent | Open-source community project |
| Claude Code | General-purpose coding agent | Mimics SDD via subagents and plan mode | Integrates with Spec Kit |

Spec Kit's 120,000 stars are visible on [the repository itself](https://github.com/github/spec-kit) today; the tool was open-sourced in September 2025, and by reported growth its star count roughly doubled over about six months. AWS Kiro, meanwhile, is not an update to Amazon Q Developer but a ground-up replacement for it: it turns user stories into acceptance criteria stripped of ambiguity using EARS (Easy Approach to Requirements Syntax) notation.

I put Claude Code on this table for a reason: though it is not a dedicated SDD product, it effectively builds the plan-split-implement loop through [subagents and background agents](/en/posts/claude-code-subagents-background-agents). You can run Spec Kit directly on top of Claude Code.

## What does a small spec actually look like?

To keep SDD from staying abstract, here is a tiny example—a simplified spec draft for an "email login" feature. It is illustrative rather than an official template:

```text
# Feature: Passwordless email login

## Goal (why)
Let users sign in without remembering a password, and shrink
"password reset"—the single largest source of support tickets.

## User story
As a registered user, I want to enter my email and click the
one-time link I receive so that I can sign in.

## Acceptance criteria (EARS)
- WHEN a valid email is submitted, the system SHALL send a
  one-time link within 60 seconds.
- WHEN the link is used within 15 minutes, the system SHALL
  open a session; otherwise the link SHALL be invalid.
- WHEN more than 3 requests arrive for the same email within
  5 minutes, the system SHALL refuse to issue a new link.

## Out of scope
- Social login (separate spec)
- Multi-factor authentication (next iteration)
```

Notice there is not a single line of code here. The `plan` step will bind this spec to a data model and a token service; the `tasks` step will split it into ten or fifteen small units. The agent touches code only after those two steps—and each task stays small enough to review on its own.

## When should you NOT use SDD?

Let me be honest: SDD does not fit every job, and turning every prompt into a spec eventually becomes a ritual that slows you down. My take is plain—on an exploratory prototype, a one-off script, or a "what does this API even return" experiment, SDD's overhead outweighs its payoff.

I draw the line like this: for disposable, single-person, short-lived work, vibe coding is still the fastest path. But in a shared repo, a production-facing flow, or a product where the requirement will resurface months later, leaving intent unwritten gets expensive fast. Whether SDD actually makes you faster is a subset of the broader question of [whether AI really makes developers faster](/en/posts/does-ai-make-developers-faster): don't assume it without measuring.

And do not forget the permission layer. In the SDD loop the agent writes real files and runs commands during `implement`, so deliberately tuning how [auto-approval layers like Claude Code Auto Mode](/en/posts/claude-code-auto-mode-explained) behave matters as much as writing the spec. A good spec does not make up for a bad guardrail policy.

## Frequently Asked Questions

### Is spec-driven development the exact opposite of vibe coding?

In practice, yes. With vibe coding you hand over a vague request and review whatever code comes back; with SDD you write the spec first and derive code from it. They are not rivals but tools for different risk levels: vibe coding for disposable experiments, SDD for work that ships to production.

### Which agent do I need to use Spec Kit?

Spec Kit is an agent-agnostic CLI. It works with 30-plus coding agents, including GitHub Copilot, Claude Code, and Gemini CLI, so you can pick your preferred one. AWS Kiro, by contrast, is a separate product that embeds SDD directly into the IDE.

### What is EARS notation?

EARS (Easy Approach to Requirements Syntax) is a standard way of writing requirements that strips out ambiguity. Using a "WHEN … the system SHALL …" pattern, it turns acceptance criteria into testable statements. AWS Kiro generates user stories by converting them into this notation.

### Is SDD too heavy for small teams?

It depends. For exploratory and one-off work, the overhead can outweigh the payoff. But even a two-person team on a shared repo sees the return on writing intent down at the first requirement change. For more on AI tooling, see our [AI category page](/en/category/ai).
