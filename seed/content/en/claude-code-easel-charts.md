---
title: "What Is Claude Code's Easel? Charts in the Terminal"
slug: "claude-code-easel-charts"
translationKey: "claude-code-easel-charts-2026"
locale: "en"
excerpt: "Easel is Claude Code's built-in mod since release 2.1.330: it draws a chart on request, or automatically under MCP metrics results, on Pro, Max and Enterprise."
category: "software-engineering"
tags: ["claude", "ai-tools", "developer-experience", "automation"]
publishedAt: "2026-11-22"
seoTitle: "Claude Code Easel: Charts Right in Your Terminal"
seoDescription: "Claude Code 2.1.330 ships Easel, a built-in mod that draws charts on request or under MCP metrics results. Here is which plans get it, and how to turn it off."
---

Easel is a built-in Claude Code mod, shipped in release 2.1.330 on November 20, 2026, that draws a chart in your terminal when you ask for one, or automatically whenever an MCP server returns a metrics result. It runs on Pro, Max and, where available, Team and Enterprise plans, on macOS and Linux; you can turn the automatic behavior off in `/config`.

The [official changelog entry](https://code.claude.com/docs/en/changelog) reads: "Added easel, a built-in mod that draws charts when asked and under MCP metrics results, on Pro, Max and, where available, Team and Enterprise on macOS and Linux; turn automatic charts off in `/config`." The same release shipped two related fixes: a spurious "MCP server blocked by enterprise policy: easel" warning that used to appear on every startup when an MCP allowlist or denylist excludes the tool is gone, and a bug that made the built-in chart tool fail when called from Code Mode is fixed.

## What exactly does Easel do?

Easel is a charting tool that runs inside your terminal session: when you tell Claude Code in plain language to chart something, or when an MCP server hands back metrics data, Claude Code turns that data into a chart on the spot. There's no separate visualization library to install, no exporting data to a file and opening another tool — the chart shows up directly in the session you're already in.

## When does Easel trigger automatically?

There are two triggers: an explicit request from you ("chart this result"), or an MCP server returning a metrics result shaped for visualization. In the second case, Claude Code draws the chart without asking first — if you don't want that behavior, you need to turn it off yourself.

## Which plans and operating systems support Easel?

Easel runs directly on Pro and Max. On Team and Enterprise it ships "where available," meaning enterprise policy can block it. On the platform side, only macOS and Linux are supported as of this release; the changelog does not mention Windows. If an enterprise MCP allow/deny list excludes Easel, versions before 2.1.330 showed a redundant "enterprise policy" warning at every session start; that's fixed now, and the tool simply stays blocked without the noise.

## How do I turn off automatic charts?

You turn off the automatic behavior from `/config`. The changelog doesn't name the exact flag, but the behavior is clear: the `/config` screen has a toggle that controls whether Easel fires automatically, and switching it off means Easel only draws a chart when you explicitly ask — it no longer triggers on its own from MCP results.

```text
# Find the Easel-related toggle in /config and turn it off;
# after that, a chart is drawn only when you ask explicitly:
> chart this test duration data
```

## What's Easel actually useful for with MCP metrics?

The most practical use case is making sense of numeric data that's already flowing through MCP. Three examples:

- **Token spend**: when a billing or usage MCP server returns daily or weekly token consumption, Easel turns it into a line chart automatically, so you can see the trend without opening a separate dashboard.
- **Test timings**: when a CI/testing MCP integration returns test durations, a bar chart makes it immediately obvious which suite slowed down.
- **Log counts**: error or log counts from an observability MCP server become a visible trend over time instead of a wall of numbers.

| Scenario | Before Easel | With Easel |
|---|---|---|
| Tracking token spend | Switch to a separate dashboard or export a CSV | Automatic line chart in the terminal |
| Analyzing test timings | Scan the log by eye | Automatic bar chart from the MCP result |
| Counting logs/errors | External monitoring tool | Instant visual in the terminal |
| Turning it off | Not available | One toggle in `/config` |

What that table shows is simple: Easel doesn't add a new data source, it removes the extra step between data you already have and actually seeing it. That lines up with Anthropic's broader push toward [adding interactive chart generation to the Claude.ai chat interface](https://claude.com/blog/claude-builds-visuals) — a different product, a different surface, but the same strategy: turn visualizing data into an on-demand feature instead of a separate tool.

Honestly, this fits the same pattern as recent additions like [running MCP tasks in the background](/en/posts/claude-code-mcp-tasks-background) and [scheduled tasks](/en/posts/claude-scheduled-tasks-automate-recurring-work): Claude Code is moving from a tool that just runs commands toward one that sits at the center of a workflow. Easel by itself isn't revolutionary, but removing the friction of "open another tab to see this number" is the kind of change that's felt every day rather than noticed once.

## How is Easel restricted in enterprise environments?

On Team and Enterprise, Easel ships "where available" — meaning an org admin can block it entirely through the MCP server allow/deny list. The same allowlist logic we cover in [managing MCP servers in Claude Code](/en/posts/how-do-you-manage-mcp-servers-in-claude-code) applies here: because Easel is a built-in tool rather than a separately added server, it isn't configured like one, but it goes through the same allow/deny mechanism. Before 2.1.330, that block showed up as a redundant warning on every session start; now it just stays blocked, quietly.

## Why do the other changes in this release matter?

2.1.330 isn't just Easel — the same release lifts a meaningful limit on scheduled tasks and `/loop`. The changelog states it plainly: "Changed recurring scheduled tasks and `/loop` to run up to 30 days instead of 7 while their session keeps running, and say when they end; tasks made before this release still end at 7 days." For teams running [scheduled tasks with Claude](/en/posts/claude-scheduled-tasks-automate-recurring-work), that's a direct capacity increase: a weekly reporting task can now run uninterrupted for a month.

The release's third major addition is sign-in support for organizations managed in Anthropic's Enterprise Admin Console: after `claude auth login`, Claude Code now applies the organization's settings and uses its cloud provider or gateway. Read together, these three changes point in one direction: Anthropic is pushing Claude Code from an individual "chat plus code" tool toward a platform where enterprise automation runs continuously in the background. Easel is the part an everyday user notices immediately; the longer scheduled-task window and Enterprise Admin Console support are the quieter changes that matter more over time.

The practical takeaway: for a developer trying Easel today, the biggest win is reading MCP data you're already collecting without switching tools. But knowing all three changes shipped together is the more useful signal if you're trying to read where Claude Code is headed — from an individual productivity tool to an always-on automation layer.

## Frequently Asked Questions

### Which version introduced Claude Code's Easel?

Easel shipped in Claude Code 2.1.330, released on November 20, 2026. The same release added sign-in support for Anthropic's Enterprise Admin Console and extended scheduled tasks and `/loop` from a 7-day to a 30-day run limit.

### Which plans can use Easel?

Easel is available directly on Pro and Max. On Team and Enterprise it ships "where available," depending on enterprise MCP allow/deny list policy. On the platform side, macOS and Linux are currently supported.

### How do I stop Easel from drawing charts automatically?

Open `/config` and turn off the toggle that controls Easel's automatic triggering. Once that's off, Easel only runs when you explicitly ask it to chart something — it no longer fires on its own from MCP metrics results.

### Does Easel work inside Code Mode?

Yes. Before 2.1.330, calling Easel from inside Code Mode caused it to fail; that bug is fixed in this release. A command sequence running in Code Mode can now trigger Easel and get a normal chart back.
