---
title: "Claude Code Sessions Can Now Message Each Other"
slug: "claude-code-cross-session-messaging"
translationKey: "claude-code-cross-session-messaging"
locale: "en"
excerpt: "Claude Code 2.1.224 ships SendMessage and ListAgents: sessions on the same machine — even different machines — can now discover and message each other."
category: "ai"
tags: ["claude", "ai-agents", "automation", "workflow"]
publishedAt: "2026-08-07"
seoTitle: "Claude Code Cross-Session Messaging: SendMessage Guide"
seoDescription: "Claude Code 2.1.224 adds SendMessage and ListAgents for cross-session messaging. How it differs from Agent Teams, how to use it, and its security model."
---

Claude Code quietly opened up a new coordination layer on August 7 with version 2.1.224: two separate Claude Code sessions — running on the same machine, or even on different machines — can now find each other and send messages directly. A new `ListAgents` tool lists the sessions you can reach, and `SendMessage` delivers to whichever one you pick. For now it's macOS and Linux only.

## What Shipped: SendMessage and ListAgents

The changelog entry is specific: "Added cross-session `SendMessage`: Claude Code sessions can now message each other, on any of your machines, with `ListAgents` to discover them (macOS and Linux)." The same release fixes a reliability bug where `SendMessage` reported "Message sent" even when the write to a teammate's inbox had silently failed; failed deliveries are now surfaced as errors instead.

This is a genuinely different capability from Agent Teams, the experimental feature Claude Code added in July. Agent Teams already had `SendMessage`, but it only worked **within one session's own spawned teammates**. The 2.1.224 change removes that boundary — two terminal windows opened independently of each other, with no shared parent session, can now talk.

## How It Differs From Agent Teams

Lining up the three coordination models side by side makes the distinction clear:

| Model | Who starts it | Communication | Scope |
|---|---|---|---|
| Subagent | Main session, via the `Agent` tool | Reports results back to the main session only | Within one session |
| Agent Teams | A lead, by spawning teammates | Teammates message each other and the lead | One session's own team |
| Cross-session `SendMessage` | You, by opening independent sessions | Any session can message any other | Machine-wide (account-wide across machines) |

In practice: if you have one terminal editing your backend and a second editing your frontend, you no longer need to wire them together manually through the `Agent` tool — `ListAgents` lets them see each other and talk directly. Think of it as one layer above the model we covered in [our guide to Claude Code subagents and background agents](/en/posts/claude-code-subagents-background-agents).

## The Mechanism: Mailboxes and Discovery

Under the hood, the mechanism reuses the same mailbox design Agent Teams already relies on: each agent's inbox is a JSON file under `~/.claude/teams/{team-name}/inboxes/{agent-name}.json`. `ListAgents` scans for reachable sessions, and `SendMessage` writes into the target session's mailbox. Delivery is automatic — the receiving session doesn't have to poll for new messages.

The feature is currently limited to macOS and Linux; there's no native Windows support yet (outside WSL2). It's also scoped to sessions tied to the same Anthropic account — you can't message a random Claude Code user over the internet.

## The Security Angle: Not Unattended

The biggest risk in any multi-agent system is a compromised session quietly steering the others. Anthropic addresses this with what amounts to a prompt-injection firewall: a message from one agent is explicitly labeled to the recipient as coming from another Claude session, not from you. A teammate can't approve a permission prompt on your behalf, and a session that had an action denied can't relay it through another session to bypass the check. In auto mode, the permission classifier treats a claimed approval relayed from another agent as untrusted input, not as your consent.

That detail matters because the attack surface grows as multi-agent orchestration scales up — a theme we dug into more broadly in [our piece on multi-agent orchestration patterns](/en/posts/multi-agent-orchestration-patterns).

## Why Now: A Long-Requested Capability

This feature didn't appear out of nowhere. Claude Code's GitHub repository had multiple open requests sitting for months: one asking for inter-session communication between independent instances, a separate one asking for cross-session messaging to coordinate multi-project work, and a third asking for "trusted peer sessions" that wouldn't need per-message approval. In the meantime, the community filled the gap with its own tooling — a handful of independent projects built local WebSocket or SQLite-based message bridges, some scoped specifically to macOS and Linux (including WSL2). The official fix in 2.1.224 addresses exactly the problem those community tools were solving: connecting independent Claude Code sessions on the same machine without needing a third-party bridge.

The group that stands to benefit most in practice is developers running multiple independent terminal windows and getting tired of coordinating them by hand. If you have three sessions working on three different packages in a monorepo at the same time, you no longer have to be the one relaying what each session needs to know about the others. If you've been handling that kind of coordination manually by opening git worktrees and tracking each one yourself, cross-session messaging is a natural extension of that workflow — worktrees isolated the sessions, and `SendMessage` now fills the communication gap between them.

## The Other Big Change in the Same Release: Self-Hosted Runners

A second, easy-to-miss addition in 2.1.224 matters a lot for Enterprise and Team plans: the `claude self-hosted-runner` command. It turns your own machine or container into a place where Claude Code web, mobile, and desktop sessions can actually run — conceptually close to GitHub Actions' self-hosted runners. Setup starts with one line:

```bash
claude self-hosted-runner --help
```

Running it surfaces the registration, authentication, and runner lifecycle options. The practical benefit for regulated teams is obvious: you can keep cloud workspaces for sensitive codebases inside your own VPC instead of Anthropic's infrastructure.

## When This Is Actually Worth Using

Honestly, for most developers the first payoff won't be a "wow" moment — it'll be less day-to-day friction. If you routinely run multiple terminals working different layers of the same project, you can now have them message each other things like "backend endpoint is done, go test the integration" instead of coordinating by hand. But it's still labeled experimental: edge cases around session teardown and mailbox cleanup are still being reported, so I wouldn't lean on it for anything production-critical just yet.

## Frequently Asked Questions

### How do I enable SendMessage and ListAgents?

No separate flag is needed — once you're on 2.1.224, `ListAgents` and `SendMessage` are available directly. Spawning teammates through Agent Teams itself is still separately gated behind `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings.json, since that feature remains experimental.

### Does it work on Windows?

Not yet. The changelog entry specifically names macOS and Linux; people running Linux through WSL2 will likely benefit, but there's no support in a native Windows terminal.

### Can sessions on different computers message each other?

The changelog says "on any of your machines," so cross-machine messaging within the same Anthropic account is the intended scope. In practice, though, the most mature use case today is still multiple terminals on one machine.

### Does this replace Agent Teams?

No, the two coexist. Agent Teams remains a task-specific model where a lead spawns and coordinates its own teammates; cross-session `SendMessage` is a more general communication layer between independently opened sessions.
