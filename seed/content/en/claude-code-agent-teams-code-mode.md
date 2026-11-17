---
title: "How Do Agent Teams Use Code Mode in Claude Code?"
slug: "claude-code-agent-teams-code-mode"
translationKey: "claude-code-agent-teams-code-mode-2026"
locale: "en"
excerpt: "Short answer: as of Claude Code v2.1.326 (Nov 16, 2026), agent-team teammates can run in Code Mode too, but only in the default in-process display mode."
category: "ai"
tags: ["claude", "ai-agents", "automation", "best-practices"]
publishedAt: "2026-11-17"
seoTitle: "Claude Code Agent Teams + Code Mode: v2.1.326 Guide"
seoDescription: "Claude Code v2.1.326 lets agent-team teammates run in Code Mode. How to enable it, which display mode supports it, and the current limits — Nov 2026."
---

Short answer: as of Claude Code v2.1.326, released November 16, 2026, teammates inside an agent team can run in Code Mode — writing JavaScript to make several tool calls in one step. This only applies in the default in-process display mode; teammates started in split panes still run without Code Mode.

Both features remain experimental and off by default. Code Mode itself shipped for single sessions earlier this month, in v2.1.323 on November 12. Agent teams had been on the experimental list for months before that. v2.1.326 is the first release to connect the two, and [Claude Code's official Code Mode documentation](https://code.claude.com/docs/en/code-mode) now lists it as an explicit version requirement.

## What are agent teams?

Agent teams is an experimental coordination layer that lets multiple Claude Code instances work on the same task at once. A "team lead" session breaks the work into pieces, assigns tasks, and synthesizes results; each teammate runs independently in its own context window and can message the others directly.

That's a different model from [Claude Code's subagent system](/en/posts/claude-code-subagents-background-agents): subagents return a result to the main session and shut down, while agent-team teammates self-claim work off a shared task list and talk to each other without going through the lead. Per the [official documentation](https://code.claude.com/docs/en/agent-teams), the strongest use cases are parallel research, debugging with competing hypotheses, and cross-layer coordination — but token costs scale up significantly compared to a single session.

## What is Code Mode, and why does it matter?

Code Mode is an experimental setting where Claude writes JavaScript to make several tool calls in one step, instead of calling Bash, Read, or Edit one at a time and reading each result before deciding what's next. In a Code Mode session, Claude writes a piece of code, Claude Code runs it directly, and Claude only reads back the part of the output it actually needs.

For example, to raise a retry limit, Claude might write:

```javascript
const files = await $`rg -l "function retryPolicy" src`.text();
const target = files.trim().split("\n")[0];
await edit(target, "maxAttempts: 3", "maxAttempts: 5");
({ edited: target, tests: $`npm test -- retryPolicy`.nothrow() });
```

That cuts the number of round trips on tasks like a change repeated across many files, a search whose results need filtering before Claude reads them, or several independent commands that can run in parallel. We covered the basics in [What Is Code Mode in Claude Code?](/en/posts/what-is-code-mode-claude-code), published before the agent-teams integration existed.

## What exactly changed in v2.1.326?

Before v2.1.326, Code Mode only worked in a single interactive terminal session; the moment a teammate spawned, that teammate ran without Code Mode, full stop. The v2.1.326 requirements list added this line: "Agent teams: to use Code Mode with agent teams on, you need v2.1.326 or later. Teammates run in Code Mode in the default in-process display mode, and start without it in split panes."

In practice: if a team lead has Code Mode on and spawns three teammates that run in the in-process panel, each teammate can now write JavaScript and batch its own tool calls. If that same team is started in split-pane mode (via tmux or iTerm2), the teammates fall back to the classic one-call-at-a-time flow, with no Code Mode at all.

| Display mode | Code Mode support (v2.1.326+) | Requirement |
|---|---|---|
| In-process (default) | Teammates run in Code Mode | No extra setup |
| Split-pane (tmux / iTerm2) | Teammates start without Code Mode | tmux or iTerm2 + `it2` CLI |

## How do you enable agent teams with Code Mode?

You need two environment variables set in the same session: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` and `CLAUDE_CODE_EXPERIMENTAL_CODE_MODE`. The most durable way is setting both in `~/.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "CLAUDE_CODE_EXPERIMENTAL_CODE_MODE": "1"
  }
}
```

Confirm your version is v2.1.326 or later with `claude --version` first — on an older version, Code Mode never reaches teammates even with agent teams on, and Claude Code reports the reason as "it can't be used together with agent teams yet." Code Mode also still requires running on Claude Opus 5.5, Sonnet 5.5, Haiku 5.5, or Fable 5.2, and that your organization isn't on the HIPAA configuration or zero data retention.

## When should you actually use this?

The combination earns its token cost on tasks that are both parallel and multi-step — say, three teammates each refactoring a different module through a similar multi-file change. Each teammate gets Code Mode's one-step, multi-call advantage inside its own piece of work, which can cut the total number of turns (and in some cases, tokens) compared to calling tools one by one.

Sequential work, same-file edits, or heavily dependent steps don't benefit from either agent teams or Code Mode on their own, and stacking both multiplies coordination overhead and token cost further. [The official documentation](https://code.claude.com/docs/en/agent-teams) recommends starting with 3-5 teammates for most workflows that actually fit this pattern.

## What are the limitations and risks?

Code Mode in split-pane mode isn't a rollout gap that closes later — it's a hard limit the official docs state as of this release. On top of that, every one of Code Mode's existing constraints still applies per teammate: the session can only be resumed in a terminal, auto mode's classifier reviews the code rather than each individual tool call, code waiting in the foreground stops after ten minutes, and code allowed to run in the background stops after two hours.

My own take: this is an experimental feature layered on top of another experimental feature, so wiring it into a production-critical workflow today is premature. But for lower-stakes, parallel-exploration work — research, or a multi-angle code review — it's worth trying, and it's worth comparing against [Claude Code's fork subagents, now the default](/en/posts/claude-code-fork-subagents-now-default) to see which model actually fits your task. For how teammates pass messages to each other, see [Claude Code sessions can now message each other](/en/posts/claude-code-cross-session-messaging). For more Claude Code and AI coverage, browse the [AI category](/en/category/ai).

## Frequently Asked Questions

### How do you turn on agent teams and Code Mode together?

Set both `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` and `CLAUDE_CODE_EXPERIMENTAL_CODE_MODE` to `"1"` in `~/.claude/settings.json`. You also need Claude Code v2.1.326 or later and a supported model: Opus 5.5, Sonnet 5.5, Haiku 5.5, or Fable 5.2.

### Do split-pane teammates run in Code Mode?

No. As of v2.1.326, Code Mode only applies to teammates running in the default in-process display mode. Teammates opened in split panes through tmux or iTerm2 start without Code Mode and use the classic one-call-at-a-time tool flow instead.

### What's the difference between agent teams and subagents?

Subagents return a result to the main session and shut down, with the main agent managing all coordination. Agent-team teammates run independently in their own context windows, self-claim work from a shared task list, and message each other directly — at a meaningfully higher token cost than subagents.

### Which models support Code Mode?

Code Mode works with Claude Opus 5.5, Sonnet 5.5, Haiku 5.5, and Fable 5.2. It requires Claude Code v2.1.323 or later, an interactive terminal session, and an organization that isn't on the HIPAA configuration or zero data retention.

**Sources:** [Claude Code — Code Mode](https://code.claude.com/docs/en/code-mode), [Claude Code — Agent Teams](https://code.claude.com/docs/en/agent-teams).
