---
title: "Managing Context Windows for AI Coding Agents"
slug: "context-windows-ai-coding-agents"
translationKey: "context-management-ai-coding-agents-2026"
locale: "en"
excerpt: "Short answer: scope subagents tightly, let them auto-compact independently, and keep a persistent file (not chat history) as the source of truth."
category: "software-engineering"
tags: ["claude", "ai-coding", "ai-agents", "best-practices"]
publishedAt: "2026-10-12"
seoTitle: "Managing Context Windows for AI Coding Agents"
seoDescription: "Long AI coding agent sessions degrade as context fills. Here's how subagent scoping, auto-compaction, and file-based memory keep a session sharp in 2026."
---

Short answer: a long agent session degrades because tool output, file reads, and conversation history accumulate in one shared context window until the model is reasoning over mostly noise. Fix it by scoping subagents to narrow tasks with their own context, letting each one auto-compact independently, and keeping durable state in a file the agent re-reads instead of in chat history it has to remember.

## Why does a long agent session actually get worse over time?

Because everything an agent does — reading a file, running a command, calling a tool, even its own prior replies — stays in the same context window unless something actively removes it, and a model answering your tenth question of the session is doing it with the first nine questions' worth of file contents and command output still competing for attention. The practical symptom is familiar to anyone who's run a coding agent for an hour: it starts re-reading files it already read, forgetting a decision from earlier in the session, or losing track of which approach it already tried and discarded.

## What actually fills a context window during a coding session?

Four things, roughly in order of how much they contribute: large file reads (especially re-reading the same file after an edit), verbose tool and command output (a build log or test run dumping hundreds of lines for one relevant error), full conversation history (every prior turn, including ones that are no longer relevant to the current task), and accumulated exploration (a search that touched twenty files to find the one that mattered, with all twenty still sitting in context). None of these are mistakes exactly — they're the agent doing its job — but none of them get smaller on their own.

## How does compaction actually help, and when does it fall short?

Compaction summarizes older context into a shorter form so the window has room for new work, and Claude Code added `autoCompactWindow` as a per-subagent setting on October 9, 2026 (version 2.1.296), letting each subagent manage its own compaction threshold instead of inheriting the parent session's. That matters because a subagent doing a narrow, bounded task — say, running a test suite and reporting results — doesn't need the same context budget as a parent session orchestrating a multi-file refactor, and giving it one anyway just means more to compact later.

Compaction's limit is that it's lossy by design: a summary of "we tried approach A, it failed because of X, then tried B" is useful, but a summary of a 400-line diff is not a substitute for the diff when you need to reference a specific line again. Compaction buys you room; it doesn't buy back precision.

## How should you scope subagents to avoid the problem in the first place?

Give each subagent one task with a clear definition of done, not a slice of the overall goal plus "use your judgment" — a subagent told to "fix the failing tests in `auth/`" can work in its own context, report back a result, and have that context discarded, while a subagent told to "help with the auth refactor" ends up re-deriving context the parent session already had. The October 6, 2026 changelog's `CLAUDE_CODE_WORKFLOW_SUBAGENT_MODEL` addition points at the same principle from a different angle: narrow, well-defined subtasks are cheap enough to route to a smaller or different model, which only works if the task itself is genuinely scoped.

| Pattern | Context cost | When it works |
|---|---|---|
| One subagent per narrow, bounded task | Low — isolated context, discarded on completion | Test runs, single-file fixes, lookups |
| One long-lived session doing everything | High — accumulates for the full session | Short tasks, exploratory work |
| Subagent given a vague, broad goal | High — re-derives context it should have inherited | Rarely — avoid this pattern |
| Parent session delegating + reading back only the result | Low on the parent, isolated on the subagent | Multi-step work with clear subtask boundaries |

## What's the "context-mode" pattern, and is it worth adopting?

It's a practical convention rather than a built-in feature: instead of relying on an agent to remember decisions across a long session, you persist the decisions it needs to a plain file — a running log of what's been tried, what the current approach is, and what's explicitly out of scope — and have the agent re-read that file at the start of each meaningful step instead of relying on chat history. The win is that a file is cheap to re-read in full and doesn't carry the token cost of the conversation that produced it; the agent gets the conclusion, not the back-and-forth that reached it.

```text
A minimal context-mode file for a multi-session refactor:
  ## Current approach
  Migrating auth middleware to the new session store (see PR #412).

  ## Tried and rejected
  - In-memory cache for session lookups: broke under concurrent writes.

  ## Explicitly out of scope
  - Do not touch the rate-limiter; separate ticket.

  ## Next step
  Finish migrating /api/admin routes, then run the full auth test suite.
```

## What should your file layout and AGENTS.md actually contain?

Keep AGENTS.md focused on what a fresh agent session genuinely can't infer from the code — build commands, test commands, which directories are generated and shouldn't be edited by hand, and any project convention that isn't obvious from reading a few files. It isn't the place for a full architecture explainer; an agent that needs that can read the code, and a stale architecture section in AGENTS.md is worse than no section, because the agent will trust it over what it reads. [Building your first MCP connector](/en/posts/build-your-first-mcp-connector) runs into the same tension at the tool level — a tool description that's too long wastes context on every call, which is why Claude Code raised the tool-search description limit to 16,384 characters on October 8, 2026 (version 2.1.295) specifically for descriptions loaded through search rather than kept in the main context at all times.

## How does this change when agents are wired into CI/CD or longer pipelines?

The scoping discipline matters more, not less, because a pipeline agent typically runs unattended — [wiring AI agents into your CI/CD safely](/en/posts/ai-agents-in-cicd-safely) covers the access-control side of this, but the context side is the same principle: a CI agent that's handed the entire repo's history and every prior run's logs will burn budget on irrelevant context before it ever gets to the actual failing test. Scope it to the current failure, the relevant file, and nothing else, and let it ask for more only if it genuinely needs to.

My take: most "my agent got dumb halfway through the session" complaints are a scoping problem wearing a context-window costume. Auto-compaction and bigger windows help, but they're treating the symptom — the actual fix is giving agents narrower jobs more often, which is a workflow change, not a settings change.

## Frequently Asked Questions

### Why does an AI coding agent get worse the longer a session runs?

Because file reads, command output, and conversation history accumulate in a single context window with nothing removing them automatically. The model ends up reasoning over a growing pile of mostly-irrelevant prior context, which is why it starts re-reading files or forgetting earlier decisions in long sessions.

### What does Claude Code's autoCompactWindow setting actually do?

Added October 9, 2026 (version 2.1.296), it lets each subagent set its own auto-compaction threshold instead of inheriting the parent session's setting. This matters because a narrowly scoped subagent needs a much smaller context budget than the session orchestrating it.

### Does giving an agent a bigger context window solve the degradation problem?

Not by itself. A bigger window delays when compaction kicks in, but it doesn't fix an agent being handed a vague, broad task that forces it to re-derive context it should never have needed. Scoping subagents to narrow, well-defined tasks solves more of the actual problem than window size does.

### What should go in a project's AGENTS.md file to help agent context management?

Build and test commands, which directories are generated and shouldn't be hand-edited, and project conventions that aren't obvious from the code — not a full architecture explainer. A stale architecture section is worse than none, because an agent will trust what AGENTS.md says over what it reads in the actual files.
