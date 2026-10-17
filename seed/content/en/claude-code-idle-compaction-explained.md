---
title: "What Is Claude Code's Idle Compaction?"
slug: "claude-code-idle-compaction-explained"
translationKey: "claude-code-idle-compaction-2026"
locale: "en"
excerpt: "Short answer: idle compaction shrinks a 200K+ token Claude Code conversation after about 54 idle minutes, right before its prompt cache expires."
category: "ai"
tags: ["claude", "ai-coding", "developer-experience", "automation"]
publishedAt: "2026-10-17"
seoTitle: "Claude Code Idle Compaction: How It Works"
seoDescription: "Idle compaction automatically shrinks a 200K+ token Claude Code conversation after about 54 idle minutes, right before its prompt cache expires."
---

Short answer: idle compaction automatically compacts a Claude Code conversation once it passes 200,000 tokens and sits idle for about 54 minutes, finishing the job before the conversation's 1-hour prompt cache window expires. Anthropic shipped it to the terminal on October 14, 2026 in v2.1.299, then surfaced an on/off row for it in `/config` on October 16, 2026 in v2.1.302, per the [official changelog](https://code.claude.com/docs/en/changelog). The point is narrow: stop your next message from forcing a full, expensive reprocess of the whole history once the cache goes cold.

It wasn't the only quiet behavior change that week. The same v2.1.302 release also made fork subagents the default way of running subagents in `claude -p`, the Agent SDK, the desktop app and VS Code. Both changes point the same direction: Claude Code is shifting toward sensible defaults for session and agent management instead of requiring manual tuning.

## How Does Idle Compaction Actually Work?

Idle compaction triggers once a conversation crosses 200,000 tokens and then goes untouched for roughly 54 minutes; Claude Code uses that idle window to summarize the conversation in the background and produce a compacted version before the 1-hour prompt cache lifetime runs out. That means coming back from a meeting or a lunch break doesn't cost you a full cache miss — the compacted summary is already sitting there waiting.

The 200,000-token threshold is the default starting point, not a fixed wall that applies identically to every session regardless of how you work. The `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` environment variable lets you raise or lower it, and the feature requires v2.1.290 or later. As of the October 16 update, Claude Code also shows a notice after an idle compaction runs, explaining how to turn the behavior off — something earlier versions only surfaced buried in `/config`.

## Idle Compaction vs On-Demand Compaction: What's the Difference?

These are two different features, not two names for the same thing: idle compaction is automatic and time-based, while [on-demand compaction](/en/posts/claude-on-demand-compaction-explained) is a Claude API feature a developer triggers manually by sending a `compaction` parameter on a Messages API request. One is a background CLI behavior; the other is a deliberate API call.

| Feature | Idle Compaction | On-Demand Compaction |
|---|---|---|
| Where it runs | Claude Code CLI / SDK / IDE plugins | Claude Messages API |
| Trigger | ~54 idle minutes + 200K+ tokens | Developer sends the `compaction` parameter |
| Control | Automatic, in the background | Manual, one-time request |
| Turning it off | `"idleCompaction": false` or `/config` | Simply don't send the parameter |
| Minimum version | v2.1.290+ | Requires the Messages API beta header |
| Purpose | Protect the prompt cache during idle time | Deliberately compact history at a workflow checkpoint |

Both solve the same underlying problem — long sessions bloating the context window and the cache — but the trigger point is different. You don't fire idle compaction yourself; it's waiting for you to go quiet. In practice you can run both together: trigger on-demand compaction at a deliberate checkpoint in an agent workflow, then let idle compaction cover whatever unplanned gaps happen in between. That combination gives one session a safety net for both planned and unplanned idle time.

## How Do You Turn Idle Compaction Off or Change Its Threshold?

To disable the feature entirely, add one line to your `settings.json`:

```json
{
  "idleCompaction": false
}
```

To keep it on but change the 200,000-token default, set the environment variable instead:

```bash
export CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS=150000
```

Since the October 16 release, the fastest way to check the current state is running `/config` and finding the "Idle compaction" row — it shows both the toggle and when the last compaction happened. The exact version history and full changelog text live at [code.claude.com/docs/en/changelog](https://code.claude.com/docs/en/changelog).

## What Else Changed in Claude Code This Week?

In that same v2.1.302 release, Claude Code made running [subagents as forks](/en/posts/claude-code-subagents-background-agents) the default in `claude -p`, the Agent SDK, the desktop app and VS Code — the terminal already defaulted to this. `CLAUDE_CODE_FORK_SUBAGENT=0` restores the old behavior, though sessions started through `claude mcp serve` never get the option at all. The desktop app and VS Code also now always run the main conversation's subagents in the background, matching what the terminal already did, while a subagent's own nested Agent calls default to running in the foreground across `claude -p`, the SDK, the desktop app and VS Code.

Seeing both changes land together is a tell: Anthropic is moving Claude Code from "you configure every knob" toward "ship a sane default, let people who need something else opt out." The same pattern showed up when [auto mode became the default](/en/posts/claude-code-auto-mode-explained); idle compaction is the latest version of it on the session-management side.

## Why Does Idle Compaction Actually Matter?

In a long agent session — especially for teams already tracking [spend limits and cache metrics](/en/posts/claude-code-spend-limits-prompt-cache-metrics) — a prompt cache expiring is a real cost, not an abstraction: miss the 1-hour cache window and a 200,000+ token conversation gets reprocessed from scratch, which shows up as both added latency and added token spend. Per [Anthropic's official news page](https://www.anthropic.com/news), cache-read pricing for Sonnet 5.5 runs as low as $0.10 per million tokens, far below the cost of processing the same tokens fresh, so a cache miss on a long session is a measurable line item, not a rounding error. Idle compaction doesn't eliminate that cost, but it turns idle time into an opportunity instead of a risk — by the time you're back, the system is already ready.

## Frequently Asked Questions

### Is idle compaction on by default?

Yes. Idle compaction ships on by default starting in v2.1.290. To disable it, add `"idleCompaction": false` to your `settings.json`, or turn off the corresponding row in `/config`.

### What token threshold triggers idle compaction?

The default threshold is 200,000 tokens, and a conversation that crosses it triggers compaction after roughly 54 idle minutes. You can change the threshold with the `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` environment variable — for example, setting it to 150000 lowers the bar to 150,000 tokens.

### Does idle compaction replace on-demand compaction?

No. They're separate features at different layers. Idle compaction is an automatic, time-based behavior in the Claude Code CLI; on-demand compaction is a distinct Claude Messages API mechanism a developer triggers manually with the `compaction` parameter.

### Does turning idle compaction off hurt performance?

No, but it does remove the safety net. With `"idleCompaction": false` set, Claude Code never auto-summarizes, so a long idle gap can let the prompt cache expire and force a full reprocess on your next message. You lose the cost protection idle compaction provides, not raw performance — the setting only disables this one automatic behavior, not manual compaction options or the conversation itself.
