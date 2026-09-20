---
title: "Claude Code Drops Auto Mode Classifier Fees"
slug: "claude-code-auto-mode-classifier-fees-removed"
translationKey: "claude-code-auto-mode-classifier-pricing-2026"
locale: "en"
excerpt: "Short answer: Claude Code 2.1.278 runs auto mode's model-picking classifier server-side by default for API and Enterprise users, and no longer bills for it."
category: "ai"
tags: ["claude", "ai-coding", "cost-optimization", "developer-experience"]
publishedAt: "2026-09-20"
seoTitle: "Claude Code Drops Auto Mode Classifier Fees"
seoDescription: "Short answer: Claude Code 2.1.278 runs auto mode's classifier server-side by default, and API/Enterprise users no longer pay for that classification step."
---

Short answer: on September 19, 2026, Anthropic shipped Claude Code 2.1.278, which defaults auto mode's request classifier to run server-side for Claude API and Enterprise users, and stops billing for the classification step itself. Users on Bedrock, Vertex, Foundry, and LLM gateways get the same default.

## What does the auto mode classifier actually do?

With auto mode on, Claude Code runs every request you send through a small classification step that judges how complex the task is and decides which model should handle it — a cheaper Haiku-class model for a quick edit, or Sonnet or Opus for a multi-step refactor. This decision happens in the background before your actual request, and it consumes a small amount of tokens on its own.

Before September 19, 2026, that classification call was billed as a separate API request from the one you actually asked for. On a single message this "classifier overhead" is too small to notice, but for a developer or team sending hundreds of requests a day, it added up to a measurable line item over time.

## What exactly changed on September 19, 2026?

Starting with Claude Code 2.1.278, the classifier runs server-side by default for Claude API and Enterprise accounts, and that server-side run is no longer billed separately. The same default now applies to Bedrock, Vertex, Foundry, and gateway connections.

Teams running Claude Code behind a gateway can opt back into the old behavior by setting `CLAUDE_CODE_AUTO_MODE_SERVER=0`, which restores the client-side classifier path that gets billed separately. Claude Code now shows an explicit warning whenever it falls back to that billed path, so you don't end up paying for it without knowing why.

```bash
# Opt a gateway connection back into the old, billed client-side classifier
export CLAUDE_CODE_AUTO_MODE_SERVER=0
```

## How much does this actually save?

The size of the impact scales with usage: a saving too small to notice in one session can become a measurable difference on a high-volume team's monthly bill. The table below summarizes the before-and-after.

| Connection path | Before September 18, 2026 | After September 19, 2026 (default) |
|---|---|---|
| Claude API / Enterprise (direct) | Classifier billed separately | Server-side, free |
| Bedrock / Vertex / Foundry | Classifier billed separately | Server-side, free |
| Gateway (default) | Classifier billed separately | Server-side, free |
| Gateway (`CLAUDE_CODE_AUTO_MODE_SERVER=0`) | Classifier billed separately | Client-side, billed (with a warning) |

Anthropic hasn't published a single percentage figure for the savings, but the mechanism is clear: since classification is no longer a separate billable call, accounts that use auto mode heavily should see their total token bill drop by some margin.

## How do you check whether your classifier runs server-side?

Claude Code's `/status` command now shows a new "Auto mode server" row that tells you directly whether that session's auto mode classifier is running server-side or client-side. If you're behind a gateway and that row shows client-side, the first thing to check is whether `CLAUDE_CODE_AUTO_MODE_SERVER` is set.

```bash
# Check where the auto mode classifier is running for this session
claude
/status
```

If it's not running server-side and you didn't set that variable on purpose, your gateway or proxy configuration is likely forcing the old behavior — worth checking whether your gateway provider has updated for compatibility with 2.1.278.

## Who does this change actually affect?

This mainly matters for individual developers billed through the Claude API, teams on an Enterprise contract, and organizations running Claude Code through Bedrock, Vertex, Foundry, or a corporate gateway. Consumers using Claude Code through a Pro or Max subscription on Claude.ai never saw a separate token-based classifier charge, so there's no visible difference for them.

For engineering teams, the real payoff shows up alongside cost-observability tooling like [Claude Code's spend limits and cache metrics](/en/posts/claude-code-spend-limits-prompt-cache-metrics): with the classifier no longer a separate line item, the remaining token usage maps more directly to actual work — writing code, reading files, and calling tools.

## What trend does this change fit into?

Through the second half of 2026, Anthropic has shipped a string of changes that make Claude Code's costs more observable: spend limits, prompt cache metrics, and now the removal of the classifier fee. That reflects how, as agentic coding tools become standard in engineering orgs, "how many tokens are being spent in the background" has turned from a nice-to-have into a genuine purchasing criterion.

Looking at competitors, OpenAI's `reasoning_effort` API parameter and Google's `thinking_config` mechanism for Gemini both involve a similar internal decision step, but neither has publicly clarified whether that step itself is billed as a separate line item. That ambiguity makes Anthropic's explicit "this step is now free" statement unusual, and therefore notable — especially for large teams where thousands of requests get auto-classified every day.

The practical takeaway: a team already using auto mode doesn't need to do anything, the benefit lands on the bill automatically. For teams that haven't turned auto mode on yet, the classifier now costing nothing removes one of the cost objections that used to hold teams back from switching.

There's also a readability benefit to the monthly bill itself: with the classifier no longer a separate line, the token usage that shows up in a monthly usage report now maps more directly to actual work — generating code, reading files, calling tools. For teams with FinOps responsibilities, that makes it easier to answer "why did we spend more this month" with a clear answer.

## Frequently Asked Questions

### What is Claude Code auto mode?

Auto mode is the Claude Code setting where every request is automatically evaluated and routed to whichever model best fits the task's complexity — a cheaper model for a simple edit, a more capable one for a multi-step refactor — so you don't have to pick the model yourself.

### What does the CLAUDE_CODE_AUTO_MODE_SERVER variable do?

This environment variable only matters for Bedrock, Vertex, Foundry, or gateway connections; setting it to `0` opts out of the free server-side classifier and reverts to the old client-side classification path, which gets billed separately. It has no effect for accounts connecting directly to the Claude API.

### Is the classifier fee gone entirely?

Only on the default server-side path: Claude API, Enterprise, Bedrock, Vertex, and Foundry users no longer pay for classification. Gateway users who set `CLAUDE_CODE_AUTO_MODE_SERVER=0` to restore the old behavior are still billed for it, but Claude Code now warns explicitly when that's happening.

### Does this change affect Claude Code's subscription-based plans?

No. The change only applies to token-billed connections — Claude API, Enterprise, Bedrock, Vertex, and Foundry. Users running Claude Code through a Pro or Max subscription on Claude.ai never saw a separate classifier charge in the first place.

For how auto mode works day to day, see [Claude Code Auto Mode: How It Works, When to Disable It](/en/posts/claude-code-auto-mode-explained); for how it became the default, see [Claude Code Auto Mode Becomes the Default](/en/posts/claude-code-auto-mode-becomes-default). To track your team's token usage end to end, check our [Claude Code spend limits and cache metrics guide](/en/posts/claude-code-spend-limits-prompt-cache-metrics). Browse more developer-tool coverage in our [AI category](/en/category/ai).

Sources: [Claude Code changelog](https://code.claude.com/docs/en/changelog) and [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview).
