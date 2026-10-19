---
title: "What Is Claude's Fast Mode? Now GA for Opus 5.5"
slug: "claude-fast-mode-opus-5-5-ga"
translationKey: "claude-fast-mode-ga-opus-5-5-2026"
locale: "en"
excerpt: "Claude's Fast Mode left research preview for Opus 5.5 on October 15, 2026: no waitlist needed, up to 2.5x higher output speed, at $8/$40 per million tokens."
category: "ai"
tags: ["claude", "llm", "pricing", "ai-tools"]
publishedAt: "2026-10-19"
seoTitle: "Claude Fast Mode GA: Pricing and Limits Explained"
seoDescription: "Fast Mode is now generally available for Claude Opus 5.5: no beta header or waitlist, up to 2.5x output speed, at $8 input / $40 output per million tokens."
---

Short answer: since October 15, 2026, Fast Mode works on Claude Opus 5.5 without a waitlist or the `fast-mode-2026-02-01` beta header — just set `speed: "fast"` on a Messages API call. It still costs more, at $8 input and $40 output per million tokens, and it still only speeds up output tokens per second, not time to first token.

## What changed on October 15, 2026?

Anthropic's [release notes](https://platform.claude.com/docs/en/release-notes/overview) for that date say Fast Mode is "out of research preview" for Claude Opus 5.5 and "no longer needs the `fast-mode-2026-02-01` beta header." Before that date, every model with Fast Mode access required an account-manager request or a spot on a waitlist. Now Claude Opus 5.5 ships with a default Fast Mode rate limit on the Start, Build, and Scale usage tiers, so any organization on one of those tiers can send `speed: "fast"` today and get a response, with no approval step in between. Organizations still in the Evaluation tier have to move up a tier first before they can use it at all; Fast Mode for Claude Opus 5 and Claude Opus 4.8 is still gated behind the waitlist and the beta header, so the GA treatment is specific to the 5.5 model for now, not the whole Opus line.

## What does Fast Mode actually do?

Fast Mode runs the exact same model weights at a faster inference configuration — it is not a smaller or distilled model, and Anthropic's documentation is explicit that there's "no change to intelligence or capabilities." The documented gain is up to 2.5x higher output tokens per second (OTPS) compared with standard speed. That gain is concentrated in generation, not in the first response: Fast Mode improves OTPS, not time to first token (TTFT), so a one-line answer won't feel much different, while a long streamed response — a refactor, a report, a multi-file diff — finishes noticeably sooner.

## How much more does Fast Mode cost?

Fast Mode is a flat 2x multiplier on standard pricing for every supported model, applied across the full context window, including requests over 200K input tokens.

| Model | Standard input / output (per MTok) | Fast Mode input / output (per MTok) |
|---|---|---|
| Claude Opus 5.5 | $4 / $20 | $8 / $40 |
| Claude Opus 5 | $5 / $25 | $10 / $50 |
| Claude Opus 4.8 | $5 / $25 | $10 / $50 |

Prompt caching and data-residency multipliers stack on top of whichever speed you choose — and switching speed mid-conversation invalidates the prompt cache, since requests at different speeds don't share cached prefixes. That's a real cost trap: toggling Fast Mode on for one request and off for the next doubles your cache-write bill instead of saving money.

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-opus-5-5",
    "max_tokens": 4096,
    "speed": "fast",
    "messages": [{"role": "user", "content": "Refactor this module to use dependency injection"}]
  }'
```

The response's `usage.speed` field confirms whether a request actually ran at `"fast"` or fell back to `"standard"` — useful for auditing whether you're paying the premium and getting the speed you paid for.

## Where can you actually use it?

Fast Mode for Claude Opus 5.5 runs on the first-party Claude API (including Claude Managed Agents sessions) and on Claude in Microsoft Foundry for deployments hosted on Azure. According to [Anthropic's Fast Mode documentation](https://platform.claude.com/docs/en/build-with-claude/fast-mode), it is explicitly not available on Claude Platform on AWS, on Microsoft Foundry deployments hosted on Anthropic's own infrastructure, with the Batch API, or alongside a Priority Tier commitment. If your workload runs through any of those paths today, `speed: "fast"` will return an error rather than silently falling back to standard speed, so it's worth checking your deployment path before wiring it into production code.

## What does the cost difference look like on a real request?

Take a coding-assistant call that produces a 3,000-token response on Claude Opus 5.5. At standard speed, that output costs $0.06 (3,000 tokens × $20 per million). At Fast Mode's rate, the same output costs $0.12 (3,000 tokens × $40 per million) — twice the price for the same answer, finishing in as little as 40% of the time if you hit the full 2.5x OTPS gain. Scaled to a team running thousands of such calls a day, that gap turns into a real line item fast, which is exactly why Anthropic ships separate rate-limit headers (`anthropic-fast-output-tokens-remaining` and friends) so you can watch Fast Mode spend separately from standard-speed spend rather than finding out about it at the end of the month.

## Is Fast Mode worth the extra cost?

It depends on which half of your latency budget is the bottleneck. If your bottleneck is time to first token — a chat UI waiting for the first word to appear — Fast Mode won't help, since Anthropic's own documentation limits the gain to output tokens per second. If your bottleneck is total generation time on long outputs — an agent writing a 3,000-token plan, a batch job summarizing transcripts, a coding assistant producing a full file — doubling your per-token cost for up to 2.5x faster output is a straightforward trade to model against your own numbers: estimate your current average output length and time, then check whether a 2.5x speedup changes a user-facing wait time enough to justify 2x the spend. A reasonable default is to reserve Fast Mode for the specific endpoints where users are actively waiting on a long response, and leave batch or background jobs on standard speed, since nobody is watching a progress bar for those.

## My take

Dropping the waitlist for Opus 5.5 is the part that matters more than the speed number — a gated beta you need an account manager to unlock gets used by nobody outside design partners, while a default-on rate limit gets load-tested by every team hitting latency complaints in production. Expect Fast Mode to show up in far more cost-per-token discussions over the next few months precisely because the barrier to trying it just disappeared.

Related reading: see our breakdown of [Claude Sonnet 5.5 vs GPT-6.1 Sol](/en/posts/claude-sonnet-5-5-vs-gpt-6-1-sol) for how the non-Opus tier compares on price and speed, [What Is Claude Haiku 5.5?](/en/posts/claude-haiku-5-5-price-speed-compared) for the cheaper end of the lineup, [How Do You Make AI Token Spend Visible by Team?](/en/posts/ai-finops-token-spend-visibility) for tracking exactly this kind of premium spend, and [Anthropic Python SDK v1.0: What Actually Breaks?](/en/posts/anthropic-python-sdk-v1-migration-guide) if you're wiring `speed: "fast"` into an existing integration. More in our [AI](/en/category/ai) section.

## Frequently Asked Questions

### Does Claude Opus 5.5 Fast Mode need a beta header?
No. As of October 15, 2026, Claude Opus 5.5 no longer needs the `fast-mode-2026-02-01` beta header or a waitlist request — set `speed: "fast"` directly in a Messages API call. Requests that still send the old header keep working without changes.

### How much does Claude's Fast Mode cost?
Fast Mode is a flat 2x multiplier on standard pricing: Claude Opus 5.5 goes from $4/$20 per million input/output tokens to $8/$40, and Claude Opus 5 and Opus 4.8 go from $5/$25 to $10/$50, applied across the full context window.

### Does Fast Mode make Claude respond faster to short questions?
Not meaningfully. Fast Mode's documented benefit is up to 2.5x higher output tokens per second, not a faster time to first token, so the speedup is most visible on long, streamed responses rather than short answers.

### Can I use Fast Mode on AWS or with the Batch API?
No. Fast Mode is not available on Claude Platform on AWS, on Batch API requests, or alongside a Priority Tier commitment. It currently runs only on the first-party Claude API and, for Opus 5.5, on Claude in Microsoft Foundry for Azure-hosted deployments.
