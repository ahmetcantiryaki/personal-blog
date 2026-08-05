---
title: "Claude Opus 4.1 Retires: Your Migration Guide to Opus 4.8"
slug: "claude-opus-4-1-retires-migrate-to-opus-4-8"
translationKey: "claude-opus-4-1-retirement-migration"
locale: "en"
excerpt: "Claude Opus 4.1 was permanently retired from the API on August 5, 2026. If you still pin the model ID, your requests are failing — here's the migration path."
category: "ai"
tags: ["claude", "llm", "ai-infrastructure", "best-practices"]
publishedAt: "2026-08-05"
seoTitle: "Claude Opus 4.1 Retires: Migration Guide to Opus 4.8"
seoDescription: "Claude Opus 4.1 was permanently retired from the API on August 5, 2026. If you still pin the model ID, your requests are failing — here's the migration path."
---

Claude Opus 4.1 (`claude-opus-4-1-20250805`) was permanently retired from Anthropic's Claude API today, August 5, 2026. If you still have that model ID pinned in a backend service, an agent, or a Bedrock/Vertex config, those requests are now failing outright. Per [Anthropic's official model deprecations page](https://platform.claude.com/docs/en/about-claude/model-deprecations), the recommended replacement is `claude-opus-4-8`.

## The Retirement Timeline: A 60-Day Notice Rule

Anthropic commits to at least 60 days' notice before retiring a publicly released model. For Opus 4.1, that notice went out on June 5, 2026; exactly 60 days later, today, the model went permanently offline. This isn't a one-off event — it's a cycle Anthropic runs on a regular cadence:

| Model | Deprecation Notice | Retirement Date | Recommended Replacement |
| --- | --- | --- | --- |
| `claude-opus-4-1-20250805` | June 5, 2026 | **August 5, 2026** | `claude-opus-4-8` |
| `claude-opus-4-20250514` | April 14, 2026 | June 15, 2026 | `claude-opus-4-8` |
| `claude-sonnet-4-20250514` | April 14, 2026 | June 15, 2026 | `claude-sonnet-4-6` |
| `claude-3-7-sonnet-20250219` | October 28, 2025 | February 19, 2026 | `claude-sonnet-4-6` |
| `claude-3-5-haiku-20241022` | December 19, 2025 | February 19, 2026 | `claude-haiku-4-5-20251001` |

The practical takeaway: hardcoding a model ID anywhere in production creates a piece of technical debt that requires checking this table roughly every couple of months. Any team running pinned model IDs in production should have this table on a recurring calendar reminder.

## What Actually Breaks in Your Code: Sampling Parameters

Moving from Opus 4.1 to Opus 4.7 or later isn't just a model name swap. Per Anthropic's documentation, the `temperature`, `top_p`, and `top_k` parameters now **return an HTTP 400 error when set to a non-default value** on Claude Opus 4.7 and later. This isn't silently ignored behavior — the request fails outright.

```python
# Before (Opus 4.1) — now fails
response = client.messages.create(
    model="claude-opus-4-1-20250805",
    temperature=0.7,
    top_p=0.9,
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}],
)

# After (Opus 4.8) — drop the sampling parameters
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}],
)
```

The recommendation is to steer model behavior through [prompt engineering patterns](/en/posts/prompt-engineering-patterns) instead of sampling knobs — a direct instruction like "answer concisely" tends to be more predictable than tuning `temperature=0.2` ever was.

## Opus 4.8 or Opus 5?

Opus 4.8 isn't your only option here. Anthropic shipped [Claude Opus 5](/en/posts/claude-opus-5-launch) on July 24, 2026: a 1-million-token context window, 128k output tokens, and thinking mode on by default — at the same pricing as Opus 4.8 ($5/$25 per MTok). The practical rule: if you're writing a new integration, start directly on Opus 5. If you have an existing Opus 4.1 integration and need to keep production running with minimal change, migrating to Opus 4.8 first carries less risk — you can evaluate Opus 5 as a separate follow-up.

## How to Audit Your Usage

If you're not sure which services are still hitting a retired model ID, pull a CSV export from the Usage page in Claude Console — it breaks usage down by API key and model. Flag and prioritize every row still pointing at a retired model ID, especially unattended agent workflows running in the background with no human in the loop.

A sensible prioritization order: customer-facing, real-time services first (an error there is visible to a real user immediately), then scheduled batch jobs, then low-volume internal tooling last. That ordering clears out the most visible, most costly failure first. For teams running multiple API keys, keeping a simple mapping table of which key belongs to which service turns this audit into a matter of minutes instead of hours.

## A Step-by-Step Migration Process

In practice, this migration boils down to four steps:

1. **Take inventory.** Find every line referencing `claude-opus-4-1` across your repo, agent definitions, and infrastructure-as-code files — a simple `grep -r "claude-opus-4-1"` usually gets you there.
2. **Strip the sampling parameters.** Flag every request body that includes `temperature`, `top_p`, or `top_k`; these need to be removed once you're on Opus 4.7 or later, or the request comes back with a 400 error.
3. **Test in staging.** After swapping the model name, compare response quality against at least a day's worth of real traffic (or a sampled subset of logged requests) before going to production — the behavior difference tends to be more noticeable in long, multi-step agent tasks.
4. **Roll out gradually.** Where possible, route a small percentage of traffic to the new model first and watch error rates before completing the cutover. This substantially reduces risk, especially for unattended background agents with no human in the loop.

The total cost of these four steps is usually a few hours — far cheaper than silently eating errors in production for days because traffic kept hitting a retired model ID.

## What to Change This August 2026

While you're at it this month, don't miss this: Claude Sonnet 5's promotional pricing of $2/$10 per MTok also ends August 31, 2026, moving to standard $3/$15 pricing on September 1 — so this is a reasonable month to review both your pinned model IDs and your cost projections at once. If you're building agent architectures around pinned model IDs, our [Claude Code subagents guide](/en/posts/claude-code-subagents-background-agents) is worth a look for automating model selection.

My honest take: Anthropic's 60-day fixed notice window is generous, but most teams lose these notices in email noise. Adding the deprecation table as a static check in your CI pipeline — a simple script that diffs model IDs found in your codebase against the table — eliminates this class of surprise entirely, and it takes less than an afternoon to set up.

For broader model comparisons, see our [Claude Sonnet 5 vs GPT-5.6 vs Gemini 3.5](/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5) piece; for what changed on the protocol side, check our [Model Context Protocol guide](/en/posts/model-context-protocol-explained). For more coverage in this space, follow our [AI section](/en/category/ai).

## Frequently Asked Questions

### What happens if I keep sending requests to Claude Opus 4.1?

Every request to the `claude-opus-4-1-20250805` model ID now fails. This date is firm on the Claude API, the Claude Platform on AWS, and Microsoft Foundry; partner platforms like Amazon Bedrock and Google Cloud set their own retirement schedules, so check those separately if you're running on one of them.

### What else could break when I move to Opus 4.8?

The most common breakage is the `temperature`, `top_p`, and `top_k` parameters — they now return an HTTP 400 error on Opus 4.7 and later when set to a non-default value. You need to drop these from your requests and steer behavior through prompting instead.

### Should I skip Opus 4.8 and go straight to Opus 5?

Pricing is identical ($5/$25 per MTok), so cost isn't a factor. Opus 5 adds capabilities like a 1-million-token context window and thinking mode on by default; but if you need to keep an existing integration running urgently, migrating to Opus 4.8 first introduces fewer behavior changes.

### Where can I track which models are retiring and when?

Anthropic's [model deprecations page](https://platform.claude.com/docs/en/about-claude/model-deprecations) lists current status (active, deprecated, retired) and all upcoming dates. If you run pinned model IDs in production, checking this page regularly or setting a recurring reminder is worth the five minutes.
