---
title: "Stop Losing Context in Long AI Coding Sessions"
slug: "stop-losing-context-ai-coding-sessions"
translationKey: "manage-ai-coding-session-context"
locale: "en"
excerpt: "Short answer: put durable instructions in project-root CLAUDE.md, not nested rule files; run /compact with a focused instruction, and split work into subagents."
category: "software-engineering"
tags: ["ai-coding", "claude", "developer-experience", "workflow"]
publishedAt: "2026-09-07"
seoTitle: "How to Keep Context in Long AI Coding Sessions"
seoDescription: "Why does an AI coding agent forget instructions in long sessions? We cover CLAUDE.md placement, /compact, /clear, and splitting work into subagents."
---

Short answer: put every instruction that needs to survive the whole session in your project-root `CLAUDE.md`, not in nested rule files. Run `/compact` with a focused instruction as you approach the auto-compaction threshold, split work into separate subagents wherever you can, and lock in progress with regular commits.

## Why do long AI coding sessions lose context?

The model isn't "forgetting" — the conversation history simply has to fit inside a fixed window. In Claude Code, the default window is 200,000 tokens; on Opus 4.6 and later, plus Sonnet 4.6, you can switch to a 1-million-token window instead. Auto-compaction (`/compact`) triggers once usage hits roughly **83.5%** of the total window, and as of early 2026 the reserved buffer has shrunk to about **33,000 tokens** (16.5%) — which means compaction fires earlier and more often than it used to.

Compaction summarizes the conversation history but leaves anything loaded from disk untouched: the system prompt, your project-root CLAUDE.md, unscoped rules, and auto-memory are all re-injected after the summary. What actually vanishes is three things: path-scoped rules, nested CLAUDE.md files, and the contents of files Claude read mid-session — none of those come back until they're re-read.

## Where should instructions live to survive compaction?

Put anything that must persist in one project-root CLAUDE.md file; instructions scattered across subfolder rule files or module-specific instruction files fall into the category that compaction drops. A single-file approach can feel restrictive, but in practice it's the only guarantee you can verify: the project root gets re-injected every time, and everything else is subject to the question "is this still in context?"

Adding a "Compact Instructions" section inside CLAUDE.md is the second lever — it lets you tell the model in advance which files, decisions, and open TODOs must survive the summary, instead of leaving that judgment call entirely to the compaction step.

| What happens after compaction | Survives? |
|---|---|
| System prompt | Yes |
| Project-root CLAUDE.md | Yes |
| Unscoped rules and auto-memory | Yes |
| Path-scoped rules | No — must be re-read |
| Nested CLAUDE.md files | No — must be re-read |
| Contents of files read mid-session | No — must be re-read |

## When and how should you use /compact?

Instead of waiting for the automatic trigger, calling `/compact` by hand with a focused instruction at a natural stopping point — after finishing a subtask — gives more predictable results. An instruction like "summarize the changes and open TODOs in the last three files, drop the rest of the discussion" is far more reliable than letting the model decide on its own what matters. An unfocused `/compact` can drop the exact edge case you're mid-way through handling — which is the most common source of the "Claude suddenly forgot the instruction" feeling.

`/clear` is a different tool: it doesn't summarize, it resets from scratch. Once a task is fully done and you're moving to something unrelated, `/clear` keeps the leftover context of the old task from bleeding into the new one — and from quietly eating your token budget.

## Why does splitting work into subagents protect context?

A subagent runs with its own separate context window and reports only its result back to the main session, which removes a bulky, one-off task — a large exploratory search, a long log analysis — entirely from the main conversation's token budget. As covered in [Claude Code Subagents and Background Agents](/en/posts/claude-code-subagents-background-agents), keeping the main session as an "orchestrator" and delegating detailed work to subagents means partitioning context by task instead of letting one giant window keep growing.

That matters even more now that [Claude Code's auto mode](/en/posts/claude-code-auto-mode-explained) has become the default: as the agent runs on its own for longer stretches, managing context through architecture — subagents, focused compaction — beats trying to manage it by hand.

## Why is committing checkpoints a context strategy?

Losing context halfway through a feature means re-explaining that work from scratch. Turning every working intermediate step into its own commit gives you both a rollback point and a way to start a fresh session with a one-sentence summary — "we're continuing from this commit, the plan was X" — which is far cheaper than re-narrating the entire prior discussion.

A practical checklist: commit at the end of every finished subtask, write the "why" in the commit message (that's the information the next session actually needs to read), and lock in the current state in its own commit before starting a large refactor, so a rollback is a single command away.

## What does a Compact Instructions section look like?

Adding this section to CLAUDE.md is the concrete way to tell the model "keep these things in the summary no matter what" at compaction time. In a backend project, it might look like this:

```markdown
## Compact Instructions

When summarizing, always keep:
- The list of files currently in progress and each one's status (done/in progress)
- Open TODOs and why they're on hold
- Suggestions the user rejected or reverted (don't re-suggest them)
- The last test command run and its result
```

Those four bullets answer "where were we" in a single read after a compaction. Without this section, the model decides on its own which details matter during summarization — and it tends to prioritize whatever came up most often in the conversation rather than what was discussed most recently, which can be exactly the edge case you'd just started working on.

## How do you track your context budget?

The `/cost` command shows how many tokens a session has used and its prompt-cache hit rate; checking that number regularly lets you anticipate when compaction is coming. A practical threshold: once usage crosses 70%, consider running `/compact` by hand at the next natural stopping point — instead of waiting for the automatic trigger at 83.5%, you stop at a point where you can still decide for yourself what matters.

## When should you start over from scratch?

If a session has been compacted several times and the model starts violating a constraint you set early on — "don't touch this file," say — starting over with `/clear` is usually faster than waiting for the next compaction. Trying to re-remind the model of lost context one piece at a time makes the problem worse as you keep piling more on top; a clean session with a clear task definition finishes the same work in fewer turns.

## Frequently Asked Questions

### Why does Claude Code seem to forget instructions in long sessions?

It's not forgetting — the conversation history has to fit inside a fixed token window. Once usage hits a set threshold (roughly 83.5%), auto-compaction kicks in, and nested rule files plus files read mid-session drop out of the summary; the project-root CLAUDE.md is always preserved.

### Where should I put my CLAUDE.md file?

Put every instruction meant to persist across the whole session in one project-root CLAUDE.md. Nested CLAUDE.md files in subfolders are also supported, but they fall into the category compaction drops — so don't rely on them for critical constraints.

### What's the difference between /compact and /clear?

`/compact` summarizes the conversation history and continues, keeping the project root and system prompt intact; `/clear` resets everything with no summary. Use `/compact` to continue the same task, and `/clear` when you're moving to something unrelated.

### Do subagents actually solve the context problem?

Not entirely, but they partition it: each subagent runs in its own separate context window and returns only a summarized result to the main session, so bulky exploratory work doesn't eat into the main conversation's token budget. Keeping the main session as an orchestrator and delegating detailed work to subagents is more sustainable than letting one giant window keep growing.
