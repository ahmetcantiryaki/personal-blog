---
title: "Claude Code Fast Mode Now Works on Vertex AI"
slug: "claude-code-fast-mode-vertex-ai"
translationKey: "claude-code-fast-mode-vertex-ai-2026"
locale: "en"
excerpt: "As of Claude Code v2.1.322 (November 10, 2026), fast mode works on Google Cloud's Vertex AI for Claude Fable 5.2, limited to the global, US, and EU regions."
category: "ai"
tags: ["claude", "ai-tools", "cloud", "developer-experience"]
publishedAt: "2026-11-12"
seoTitle: "Claude Code Fast Mode on Vertex AI: What Changed"
seoDescription: "Claude Code v2.1.322 brings fast mode to Google Cloud's Vertex AI for Claude Fable 5.2. Here's the region requirement, setup steps, and fallback behavior."
---

Short answer: yes. As of Claude Code v2.1.322, released November 10, 2026, fast mode works on Google Cloud's Vertex AI (Agent Platform) for Claude Fable 5.2, but only when your Vertex region is set to `global`, `us`, or `eu`. Before this release, fast mode was limited to the Anthropic API and Claude subscription plans — Vertex AI, Amazon Bedrock, and Microsoft Foundry were excluded entirely.

This closes a real gap for teams that run Claude Code through Google Cloud for compliance or billing reasons. Until now, those teams were stuck at standard speed no matter which model they picked. Here's exactly what changed, how to turn it on, and where it still falls short.

## What is fast mode, and why does it matter on Vertex AI?

Fast mode is a high-speed configuration for supported Claude models that trades higher per-token cost for lower latency — Anthropic says it makes a model up to 2.5x faster at the same quality, since it's the same model with a different serving configuration, not a smaller or distilled one. On Vertex AI specifically, that speed gain now reaches teams who were previously locked out simply because of which cloud they used to access Claude.

## Which Claude Code version and models does this require?

Fast mode on Vertex AI requires Claude Code v2.1.322 or later and currently supports only Claude Fable 5.2 — not Opus 5.5, Opus 5, or Opus 4.8. That's a narrower rollout than the Anthropic API, where fast mode already covers all four of those models. If your organization runs an older Claude Code version or pins a different model on Vertex, this release does nothing for you yet.

## Which Vertex AI regions support fast mode?

Only three region settings work: `global`, `us`, and `eu`. Any other Vertex region configured for Fable 5.2 causes Claude Code to report "Fast mode needs Vertex region global, us or eu" and silently run `claude -p` at standard speed instead of failing the request. You set the region with an environment variable before starting a session:

```bash
export VERTEX_REGION_CLAUDE_FABLE_5_2=global
```

## How do you turn on fast mode on Vertex AI?

In an interactive session, run `/fast` after setting the region — it switches you to Fable 5.2 if you were on a different model, since fast mode on Vertex AI isn't saved as a persistent default the way it is on the Anthropic API. In non-interactive mode, pass both the model and the setting explicitly:

```bash
claude -p "Summarize this project" --model claude-fable-5-2 --settings '{"fastMode": true}'
```

## What happens if Vertex AI refuses the fast-mode request?

Claude Code falls back to standard speed automatically rather than erroring out. If Agent Platform returns a 403 or 404 to the fast-mode check, you'll see "Fast mode was refused for this project · trying again in 30m" and your request still completes — just without the speed boost. Run `/fast on` again if you want to retry sooner than the 30-minute backoff.

## How does Vertex AI fast mode compare to the Anthropic API rollout?

The feature set on Vertex AI is a subset of what's already shipped on the Anthropic API, where fast mode has covered Opus 5.5 since its launch and Opus 5 and Opus 4.8 as a research-preview feature for months. Vertex AI gets exactly one model at launch.

| Model | Fast mode input (per MTok) | Fast mode output (per MTok) | Available on Vertex AI |
|---|---|---|---|
| Claude Fable 5.2 | $16 | $80 | Yes, v2.1.322+, global/us/eu only |
| Claude Opus 5.5 | $8 | $40 | No — Anthropic API and Claude plans only |
| Claude Opus 5 | $10 | $50 | No — research preview, Anthropic API only |
| Claude Opus 4.8 | $10 | $50 | No — deprecated, removed November 30, 2026 |

Fast mode pricing is flat across the full context window on every one of these models, and it's billed separately from standard-speed usage everywhere it's offered.

## Is this related to the Opus 5.5 fast-mode GA announcement?

Not directly — they're separate rollouts. [Opus 5.5 reaching fast-mode general availability](/en/posts/claude-fast-mode-opus-5-5-ga) happened on the Anthropic API months before this Vertex AI expansion, and Opus 5.5 still isn't available with fast mode on Vertex AI at all. If your team is also tracking the [Opus 4.8 fast-mode deprecation deadline](/en/posts/opus-4-8-fast-mode-removal-deadline), note that deadline applies to the Anthropic API path, not Vertex AI, since Opus 4.8 was never offered there with fast mode.

My take: shipping Fable 5.2 first, rather than Opus 5.5, is the more interesting signal here. It suggests Anthropic is testing Vertex AI's fast-mode plumbing on a narrower, newer model before committing Opus-tier traffic to it — a reasonable way to de-risk a cross-cloud feature, even if it means enterprise Opus users on Google Cloud wait longer.

## Why does the region restriction exist at all?

Anthropic hasn't published a technical explanation, but the pattern matches how Vertex AI serves Claude generally: regional endpoints route to different underlying infrastructure, and `global`, `us`, and `eu` are the three endpoint types Google Cloud documents for Claude models. Fast mode most likely needs the serving path only those three endpoints currently provide.

## What should teams already using Claude Code on Vertex AI do now?

Update to Claude Code v2.1.322 or later, set `VERTEX_REGION_CLAUDE_FABLE_5_2` to `global`, `us`, or `eu`, and test `/fast` in a throwaway session before rolling it out broadly — the 30-minute backoff on a refused request means a misconfigured region will silently cost you speed for half an hour at a time while you debug it.

## Frequently Asked Questions

### Does Claude Code fast mode work on Vertex AI yet?

Yes, as of Claude Code v2.1.322 (November 10, 2026), but only for Claude Fable 5.2 and only when the Vertex region is set to `global`, `us`, or `eu`. Opus 5.5, Opus 5, and Opus 4.8 still don't support fast mode on Vertex AI.

### Does fast mode work on Amazon Bedrock or Microsoft Foundry?

No. Fast mode remains unavailable on Amazon Bedrock, Microsoft Foundry, and Claude Platform on AWS — attempting to use `/fast` on those providers returns "Fast mode is not available on this provider." Vertex AI is currently the only third-party cloud platform with any fast-mode support.

### What Claude Code version do I need for fast mode on Vertex AI?

You need v2.1.322 or later specifically for the Vertex AI rollout. An older version that already supports fast mode on the Anthropic API won't extend that support to Vertex AI — the two code paths were shipped separately.

### Does fast mode cost extra on Vertex AI?

Yes. Fable 5.2's fast-mode rate is $16 per million input tokens and $80 per million output tokens, roughly double its implied standard-speed cost, and it's billed flat across the full context window regardless of how much of it you actually use.
