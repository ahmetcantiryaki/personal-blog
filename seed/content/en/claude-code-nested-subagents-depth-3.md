---
title: "Claude Code Nested Subagents: Banned to Depth-3 in Four Days"
slug: "claude-code-nested-subagents-depth-3"
translationKey: "claude-code-nested-subagents-depth-3"
locale: "en"
excerpt: "Claude Code disabled nested subagent spawning by default on July 21, then re-enabled it at depth 3 on July 24. What the four-day reversal means for teams."
category: "ai"
tags: ["claude", "ai-agents", "developer-experience", "automation"]
publishedAt: "2026-07-27"
seoTitle: "Claude Code Nested Subagents: The Depth-3 Reversal"
seoDescription: "Claude Code disabled nested subagent spawning by default on July 21, then re-enabled it at depth 3 on July 24. Here's what the four-day reversal means."
---

Claude Code disabled nested subagent spawning by default on July 21, 2026 in v2.1.217, then reversed course three days later in v2.1.219, re-enabling it at a default spawn depth of 3. Anyone building multi-agent orchestration on Claude Code hit this window directly, whether they noticed it or not.

## The Four-Day Timeline

The change didn't land in one release — it unfolded across several back-to-back versions. Here's what shipped between July 17 and July 25:

| Version | Date | Change |
| --- | --- | --- |
| v2.1.212 | Jul 17 | Per-session cap of 200 subagent spawns (`CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION`), resets on `/clear` |
| v2.1.217 | Jul 21 | Subagents no longer spawn nested subagents by default; concurrent subagent cap set to 20 (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`) |
| v2.1.218 | Jul 22 | `--max-budget-usd` now actually halts background subagents: once the cap hits, new spawns are denied and running agents are stopped |
| v2.1.219 | Jul 24 | Nested spawn depth default raised to 3 (disable with `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`); stream-json gains depth-2+ subagent text forwarding |
| v2.1.220 | Jul 25 | Bug fixes and reliability improvements |

This is a direct continuation of [the runaway-agent guardrails Claude Code shipped in mid-July](/en/posts/claude-code-runaway-agent-guardrails). The 200-per-session cap and the 200-call WebSearch limit we covered there are both still active; what's new here is a separate lever that controls vertical depth rather than horizontal fan-out.

## Why It Was Banned, Then Only Partly Restored

The v2.1.217 release note is blunt: subagents "no longer spawn nested subagents by default." That's a hard cutoff that fully prevents a single message from ballooning into an uncontrolled agent tree — but it also broke the legitimate delegation patterns we described in [our subagents and background agents guide](/en/posts/claude-code-subagents-background-agents), like a research subagent spinning up its own sub-researchers.

Three days later, Anthropic loosened it back — not to unlimited, but to 3. That reads as a deliberate middle ground between "no nesting at all" and "nest as deep as you want." Depth 3 covers most real orchestration patterns — a top-level agent, a coordinator it spawns, and the specialist agents that coordinator spawns — without opening the door to a fourth-level chain that replicates itself.

### Why This Design Choice Makes Sense

What strikes me most is that three independent limits now run simultaneously: concurrency (default 20), per-session total (default 200), and depth (default 3). They complement each other because each one blocks a different failure mode — concurrency caps how many agents run in parallel at once, the session total caps the overall token bill, and depth caps how long a delegation chain can grow. Three narrow limits working together close off the "one agent misreads an instruction and spawns three more sub-tasks" scenario we described in [multi-agent orchestration patterns](/en/posts/multi-agent-orchestration-patterns) from more angles than any single loose cap could.

## What This Means in Practice

For teams running parallel research agents with `isolation: 'worktree'`, or unsupervised tasks under [auto mode](/en/posts/claude-code-auto-mode-explained), three things changed.

First, depth-3 delegation chains now work out of the box; orchestration scripts that previously needed `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` set manually can drop that step. Second, `--max-budget-usd` finally does what it always should have: hitting the cap now stops running background agents, not just new spawns. Third, observability tooling watching `stream-json` output can now see text from depth-2-and-deeper subagents via the `--forward-subagent-text` flag — previously that visibility stopped at the first level.

If your workflow genuinely needs more than four levels of depth (rare, but it happens), you now have to raise `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` explicitly; the default of 3 will otherwise stop you.

```bash
# Raise the depth limit to 5, drop concurrency to 10
export CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=5
export CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS=10

# Run with a hard budget cap — hitting it denies new spawns
# and halts running background agents
claude --max-budget-usd 5.00 "Scan the repo and report vulnerabilities"
```

## The Same Week's Other Change: Opus 5

The same July 24 release (v2.1.219) also made [Claude Opus 5](/en/posts/claude-opus-5-launch) the default Opus model and narrowed `/fast` mode to Opus 5 and Opus 4.8 only, dropping Opus 4.7. I don't think the timing is a coincidence: a model with a larger context window and cheaper token pricing makes deeper agent chains more economically defensible. It's a reasonable bet that Anthropic shipped both changes in the same week on purpose.

## Three Concrete Scenarios

To keep this from staying abstract, it helps to walk through three common usage patterns.

**Code review fan-out:** A top-level agent spawns one reviewer subagent per changed file, and each reviewer opens a test-runner subagent to verify its own findings. That's a two-level chain — depth 2 — which worked fine under both the old default (1) and the new one (3), but would have broken entirely during the short window between July 21 and July 24.

**Research synthesis with coordination:** A coordinator agent splits a topic into three sub-questions and spawns one researcher subagent per sub-question; one of those researchers narrows further and opens its own sub-researcher. That's a pattern reaching depth 3 — exactly the ceiling the new default allows. A team running this kind of workflow may have had it silently break, then silently start working again, between July 21 and July 24, without ever seeing an error message explaining why.

**Overnight unsupervised automation:** An unattended Claude Code session running in CI or on a schedule that tries to build a four- or five-level delegation chain still exceeds the new default (3) and needs `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` raised manually — otherwise the chain gets silently cut off; the deepest level's delegation just doesn't happen, without throwing an error.

The practical lesson here: if your orchestration script depends on spawn-depth defaults, tracking release notes stops being an optional habit and becomes part of keeping production stable.

## Frequently Asked Questions

### Does this change affect my existing Claude Code setup?

Only if you rely on nested subagent delegation patterns. If you never set `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` manually, nested spawning up to depth 3 now works by default; set that variable to 1 to restore the old no-nesting behavior.

### Is the depth-3 limit the same thing as the 200-subagent session cap?

No, they cap different dimensions. The session cap (200) limits the total number of subagents a session can spawn overall; the depth limit (3) controls how many levels deep a delegation chain can go. An agent can spawn 50 sibling subagents at the same level and that's still depth 1 — the session cap is what stops that scenario, not the depth limit.

### Why did `--max-budget-usd` change in v2.1.218?

Previously, hitting the budget cap only blocked new subagent spawns — agents already running in the background kept going, letting the cap get exceeded anyway. v2.1.218 closed that gap by actually halting running background agents once the cap is reached.

### Where are these changes officially documented?

Release notes are published at `code.claude.com/docs/en/changelog` and in `CHANGELOG.md` in the `anthropics/claude-code` repository; every version number and date in this article traces back to those sources.
