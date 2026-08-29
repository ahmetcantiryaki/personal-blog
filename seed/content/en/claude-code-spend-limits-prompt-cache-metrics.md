---
title: "Claude Code's New Spend Limits and Cache Metrics"
slug: "claude-code-spend-limits-prompt-cache-metrics"
translationKey: "claude-code-spend-limits-cache-metrics"
locale: "en"
excerpt: "Claude Code v2.1.251 (August 28, 2026) adds a spend limit bar to /usage and a hit-rate prompt cache line to /cost, plus new hooks that can block a model switch."
category: "ai"
tags: ["claude", "cost-optimization", "observability", "automation"]
publishedAt: "2026-08-29"
seoTitle: "Claude Code Spend Limits and Prompt Cache Metrics (v2.1.251)"
seoDescription: "Claude Code v2.1.251 adds a spend limit bar to /usage and a hit-rate prompt cache line to /cost, plus new hooks for controlling model switches."
---

Short answer: Claude Code v2.1.251, released August 28, 2026, added a real-time spend limit bar to `/usage` and a prompt cache line to `/cost` that shows hit ratio and re-cached token counts. The same release shipped `PreModelSwitch` and `PostModelSwitch` hook events that can block, confirm, or annotate a model switch. The point is to turn "where did my tokens go" from a guess into something you can read on screen.

What makes this release worth a look isn't any single feature — it's that spend visibility, cache efficiency, and model-switch control all landed together. All three answer the same underlying question: where are the tokens actually going?

## What Changed in Claude Code v2.1.251?

v2.1.251 shipped four kinds of changes, according to the [official changelog](https://code.claude.com/docs/en/changelog): spend and usage visibility, new hook events, background-agent streaming, and security fixes in the file tools. The release landed one day after v2.1.248 (the version that added `--restricted` mode on August 27) — a one-day gap that reflects how fast Anthropic has been shipping Claude Code releases through August.

The three changes worth understanding in detail: the spend limit bar in `/usage`, the prompt cache line in `/cost`, and the new model-switch hook pair. Each gets its own section below.

## What Does the Spend Limit Bar in /usage Show?

The spend limit bar appears when you run `/usage` on an account with a monthly or weekly limit configured through an organization's gateway, and it renders your remaining budget as a real-time bar. Before this release, checking that number meant leaving the terminal for the org console; now it's visible without breaking flow.

Teams that write their own statusline scripts get a matching change: a `rate_limits.spend_limit` field is now passed to the status line, so a custom script can print remaining budget directly in the terminal title or a side panel. That matters most in flows that skip human approval, like [Claude Code's auto mode](/en/posts/claude-code-auto-mode-explained) — when nobody is confirming each tool call, you want to see how much budget an agent is burning without asking.

## What Do the New Prompt Cache Metrics in /cost Show?

The new prompt cache line reports, per session, the hit ratio, the miss count, the number of tokens re-cached, and whether the cache is warm or cold — all inside `/cost`'s existing output. Those four numbers used to be something you could only infer by staring at an API bill after the fact; now they're on screen while the session is still running.

The numbers matter because prompt caching can meaningfully cut input-token cost on the Claude API, but a cache that's gone cold — typically after about five minutes of inactivity — means the next request gets re-cached at full price. The warm/cold flag in `/cost` tells you when a session is approaching that expensive re-cache moment. The same release added a matching `prompt_cache` object for statusline scripts, so this data can flow into a custom UI too.

This is a direct continuation of `promptCacheTtl` and `subagentPromptCacheTtl`, the settings v2.1.243 added three days earlier that let API users control cache time-to-live. That release gave you the lever; this one gives you the readout that tells you whether pulling it worked.

| Version | Date | Key addition |
| --- | --- | --- |
| v2.1.243 | Aug 25, 2026 | `promptCacheTtl`, `subagentPromptCacheTtl`, Loops breakdown in `/usage` |
| v2.1.248 | Aug 27, 2026 | `--restricted` flag, `experimental.cacheTtl` |
| v2.1.251 | Aug 28, 2026 | Spend limit bar, prompt cache line, `PreModelSwitch`/`PostModelSwitch` |

## What Do PreModelSwitch and PostModelSwitch Hooks Do?

`PreModelSwitch` and `PostModelSwitch` are new hook events that fire immediately before and after a session switches models, and they can block the switch, require confirmation, or just log it. That means an automatic model downgrade — say, falling back to a cheaper model after hitting a rate limit or budget cap — now happens as a traceable event instead of silently.

The same release also updated `SessionStart` resume hooks: they now receive the session's staleness and an estimated re-cache cost. Read together, both changes point at the same theme — Anthropic is exposing model- and cache-state decisions to developers who write their own hooks, rather than keeping them internal to the CLI.

```json
{
  "hooks": {
    "PreModelSwitch": [
      {
        "matcher": "*",
        "hooks": [{ "type": "command", "command": "./scripts/log-model-switch.sh" }]
      }
    ]
  }
}
```

## Why Does This Release Matter?

My take: this is one of the more coherent steps Claude Code has taken toward "agents should run autonomously, but cost should stay visible." Not knowing how many tokens an overnight background agent burned until the morning bill arrives is a bad default; the spend limit bar and the prompt cache line close that gap, and they're especially useful when you're running [subagent and background-agent workflows](/en/posts/claude-code-subagents-background-agents).

It's the same logic [Claude Reflect's usage dashboard](/en/posts/claude-reflect-usage-dashboard-explained) applies at the organization level, now applied at the terminal level: turning spend from an end-of-month surprise into a signal you see while the session is still running.

## How Do You Fold This Data Into a Daily Workflow?

The most practical way to fold this data into a daily workflow is to make checking `/usage` at the start of a session and `/cost` at the end of a long task into a habit — both are single commands, and neither requires leaving the terminal. If your team has a budget constraint configured, glancing at the spend limit bar first thing in the morning is cheaper than running into a "limit reached" message mid-afternoon.

For teams writing their own statusline scripts, the real payoff is combining both new data points — `rate_limits.spend_limit` and `prompt_cache` — into a single view. A statusline script as simple as this can show remaining budget and cache freshness on the same line:

```bash
#!/usr/bin/env bash
spend=$(echo "$CLAUDE_STATUSLINE_JSON" | jq -r '.rate_limits.spend_limit.remaining_pct')
cache=$(echo "$CLAUDE_STATUSLINE_JSON" | jq -r '.prompt_cache.status')
echo "Budget: ${spend}% left | Cache: ${cache}"
```

That script surfaces two numbers that stay visible in the terminal title the whole session: remaining budget percentage and cache freshness. Keeping both on the statusline while an agent runs a long task in the background means you can intervene while the session is still running — say, pausing a task once budget drops below 10% — instead of finding out only after the bill arrives.

## Frequently Asked Questions

### Who can see the spend limit bar in Claude Code?

The spend limit bar only appears on accounts with a monthly or weekly spend limit configured through an organization's gateway — it's built for team and organization budget setups, not individual Pro or Max subscriptions. If you don't see the bar, your organization likely hasn't configured a spend limit.

### What does prompt cache hit ratio mean, and why does it matter?

Prompt cache hit ratio measures how often a request matches previously cached input; a match means Anthropic charges the cheaper cache rate instead of the full input-token price. The new `/cost` line surfaces that ratio along with miss count and re-cached tokens, so you can spot when a cache has gone cold — typically after about five minutes of inactivity — and time your requests to avoid a costly re-cache.

### Can a PreModelSwitch hook actually stop a model switch from happening?

Yes. The `PreModelSwitch` hook runs immediately before a session switches models, and depending on the hook script's exit code it can block the switch, require confirmation, or simply log it — the behavior is controlled by what the hook script returns.

### Which Claude Code version do I need for these features?

You need at least v2.1.251, released August 28, 2026, for the spend limit bar, the prompt cache line, and the `PreModelSwitch`/`PostModelSwitch` hooks. Related settings like `promptCacheTtl` work as far back as v2.1.243, but the new visibility features require v2.1.251 or later.
