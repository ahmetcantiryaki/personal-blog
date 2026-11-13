---
title: "What Is Code Mode in Claude Code?"
slug: "what-is-code-mode-claude-code"
translationKey: "claude-code-code-mode-launch"
locale: "en"
excerpt: "Code Mode is an experimental Claude Code setting: Claude writes JavaScript to call tools instead of one by one. It shipped opt-in in v2.1.323 on Nov 12, 2026."
category: "ai"
tags: ["claude", "mcp", "ai-agents", "automation"]
publishedAt: "2026-11-13"
seoTitle: "What Is Code Mode in Claude Code? How It Works"
seoDescription: "Code Mode is the experimental feature Claude Code added on November 12, 2026: Claude writes JavaScript to call tools instead of calling them one by one."
---

Short answer: Code Mode is an experimental setting that shipped in Claude Code v2.1.323 on November 12, 2026. When enabled, Claude writes a JavaScript script that calls multiple tools in sequence and filters the results, instead of calling each tool one at a time and loading every result into its context.

Claude Code's [official changelog](https://code.claude.com/docs/en/changelog) describes it plainly: "Code Mode, an experimental opt-in where Claude writes JavaScript to call its tools." It is not generally available (GA) yet — it ships as an opt-in, experimental setting.

## Why did Anthropic add Code Mode?

Code Mode exists to fix a specific bottleneck in normal tool calling: every intermediate result has to pass through the model's context window. Anthropic laid out the reasoning in its own engineering post a year earlier.

Published November 4, 2025, ["Code execution with MCP: Building more efficient agents"](https://www.anthropic.com/engineering/code-execution-with-mcp) argued that instead of calling MCP tools directly, an agent should be given those tools as code APIs and write code against them. One example in that post cut token usage from roughly 150,000 to about 2,000 for a multi-step task — a 98.7% reduction. The reason is simple: intermediate data stays in the execution environment instead of round-tripping through the model.

Cloudflare independently named a similar idea. Kenton Varda and Sunil Pai's September 26, 2025 post, ["Code Mode: the better way to use MCP"](https://blog.cloudflare.com/code-mode/), proposed converting MCP tools into a TypeScript API and having the model write code against that API. Claude Code's feature carries the same name and follows the same core logic a year later.

## How is Code Mode different from normal tool calling?

In normal mode, Claude calls one tool per turn, pulls the full result into its context, then decides the next step. Calling five tools in sequence means five separate turns and five full result sets in context. In Code Mode, Claude instead writes a single JavaScript script that calls all five tools, filters the results, and returns only the distilled output.

| Trait | Normal tool calling | Code Mode |
|---|---|---|
| Tool calls per step | One | Several inside one script |
| Where intermediate results live | Pass through model context | Stay in the execution environment |
| Token use (example task) | ~150,000 | ~2,000 |
| Maturity (as of November 2026) | Default, stable | Experimental, opt-in |

The gap matters most on multi-step, data-heavy tasks: pulling hundreds of records from an API and filtering them, chaining several MCP servers, or processing a large JSON payload. On a simple task — read one file, make one small edit — the difference is negligible.

```javascript
// Simplified illustration of the Code Mode pattern
const results = await Promise.all(
  tools.map((tool) => tool.run(input))
);
const summary = results
  .filter((r) => r.ok)
  .map((r) => r.data.slice(0, 5)); // return only what's needed
return summary;
```

## How do you turn on Code Mode?

Claude Code's changelog describes Code Mode as "experimental opt-in," meaning it ships off by default and you have to turn it on deliberately. The changelog doesn't spell out the exact setting name or CLI flag, so check [Claude Code's changelog](https://code.claude.com/docs/en/changelog) and the [official release notes](https://docs.claude.com/en/release-notes/overview) directly rather than guessing at syntax. Because it's experimental, testing it on a secondary project before moving production workflows onto it is the safer order of operations.

If you already manage Claude Code's tool ecosystem, think of Code Mode as an extension of what you know about [managing MCP servers in Claude Code](/en/posts/how-do-you-manage-mcp-servers-in-claude-code) — the difference is that the agent now reaches those servers through code it writes, not one tool call at a time.

## Which tasks actually benefit from Code Mode?

How much Code Mode helps depends on how many tool calls a task makes and how large the intermediate data is. A few concrete examples:

- **Multi-source research:** A task that pulls data from five different APIs and merges it sends five full result sets into context in normal mode; in Code Mode, only the merged summary enters context.
- **Bulk file processing:** A task that scans hundreds of files for a pattern returns matching lines instead of each file's full content.
- **Chained MCP calls:** In a flow where one MCP server's output feeds another server as input, the intermediate transformation steps stay inside the script instead of bouncing through the model.

On low-step tasks — read one file, make one edit — the difference is close to zero. Forcing Code Mode onto every task adds complexity without a payoff.

## What are the known risks of Code Mode?

Turning tools into code APIs and letting the model write and run code against them carries its own risk profile. Public documentation of similar patterns from other vendors flags one recurring concern: permission checks apply to the single code-execution call rather than to each nested tool call individually, which is a different security surface than calling tools one at a time — so sandboxing and monitoring need more attention than they do with traditional tool calling. That isn't a flaw unique to Claude Code's implementation; it's an inherent property of the "let the agent write and run code" pattern, and it's likely the main reason this ships experimental rather than stable.

The practical takeaway: once you enable Code Mode, you need to watch more closely which tools a script can reach and what data it touches, compared to normal tool calling. If your agent has access to the filesystem or the network, that's exactly what taking the "experimental" label seriously means in practice.

## Should you turn on Code Mode today?

Flipping on an experimental feature for production agents is riskier when you don't yet fully know its permission behavior. Our take: Code Mode is worth testing if you run token-heavy, multi-step tasks, but it's too early to default to it in a critical CI pipeline or a customer-facing agent — Anthropic's own changelog calls it experimental, not stable.

The idea behind Code Mode isn't new; how much it helps your specific workload depends on where you land on the [AI agents vs. workflows](/en/posts/ai-agents-vs-workflows) question. If you want to watch how your agent actually calls tools, [Claude Code mods](/en/posts/what-are-claude-code-mods) are one way to observe that behavior directly.

## Frequently Asked Questions

### When did Code Mode launch in Claude Code?

Code Mode shipped in Claude Code's v2.1.323 release on November 12, 2026. The changelog describes it as "experimental opt-in," meaning it's off by default and not yet a stable, generally available feature.

### What's the main difference between Code Mode and normal tool calling?

In normal tool calling, Claude calls each tool one at a time and pulls every result into its own context. In Code Mode, Claude writes a JavaScript script that calls multiple tools itself; intermediate results stay in the execution environment, and only the distilled summary returns to the model.

### How much does Code Mode reduce token usage?

In a November 2025 engineering post, Anthropic described one multi-step task where writing code instead of calling tools directly cut token usage from roughly 150,000 to about 2,000 — a 98.7% reduction. The real-world savings depend on the task's data volume and step count.

### Do other AI tools besides Claude Code have a Code Mode?

Yes. Cloudflare introduced a similarly named approach in 2025, and tools like Docker Agent, the Vercel AI SDK, and several open-source agent frameworks have added their own experimental "code mode" features that expose tools as code APIs. Claude Code's implementation follows the same underlying pattern.
