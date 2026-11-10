---
title: "What Are Claude Fable 5.2 and Mythos 5.2? What Changed?"
slug: "claude-fable-5-2-mythos-5-2-launch"
translationKey: "claude-fable-mythos-5-2-launch"
locale: "en"
excerpt: "Anthropic shipped Claude Fable 5.2 and Mythos 5.2 on November 9, 2026: $8/$40 per MTok, a 1M-token context window, and two breaking API changes."
category: "ai"
tags: ["claude", "llm", "developer-experience", "api-design"]
publishedAt: "2026-11-10"
seoTitle: "Claude Fable 5.2 and Mythos 5.2: What Changed?"
seoDescription: "Anthropic's Claude Fable 5.2 and Mythos 5.2, released Nov 9, 2026: pricing, 1M-token context, benchmark gains, and two breaking API changes explained."
---

Anthropic released Claude Fable 5.2 and Mythos 5.2 on November 9, 2026. Both share one underlying model: Fable is the publicly available version with added safeguards for cybersecurity, biology, chemistry, and model-distillation queries, while Mythos runs without those safeguards and is restricted to vetted organizations. Pricing is $8 per million input tokens and $40 per million output tokens.

## What Are Claude Fable 5.2 and Mythos 5.2?

Fable 5.2 (`claude-fable-5-2`) and Mythos 5.2 (`claude-mythos-5-2`) are two product layers over the same weights, according to Anthropic. Fable runs an extra safeguard layer on cyber, biology, chemistry, and distillation queries and is open to everyone on Claude.ai, Claude Code, and the API; Mythos skips those filters and ships only to verified organizations.

Both models carry a 1-million-token context window, a 128k-token max output, and always-on adaptive thinking, per [Anthropic's release notes page](https://platform.claude.com/docs/en/release-notes/overview). Output generation on Fable 5.2 runs up to 30% faster than on Fable 5.1.

## What Does Claude Fable 5.2 Cost?

Standard pricing is $8 per million input tokens and $40 per million output tokens. Fast mode costs $16 input / $80 output per million tokens in exchange for up to 2.5x faster token generation, and it's available in Claude Code with no beta header required.

| Model | Input / Output (MTok) | FrontierSWE v2 | Terminal-Bench-Science 0.1 |
| --- | --- | --- | --- |
| Fable 5.1 | — | 56.3% | 52.6% |
| Opus 5.5 | — | 62.3% | 58.7% |
| Fable 5.2 (standard) | $8 / $40 | 69.9% | 74.6% |
| Fable 5.2 (fast mode) | $16 / $80 | 69.9% | 74.6% |

Fast mode doesn't change the benchmark score — it produces the same answer faster and at a higher price. Anthropic's release note doesn't publish separate per-MTok prices for Fable 5.1 or Opus 5.5, which is why the table above focuses on the speed-and-benchmark comparison instead.

## Which API Calls Now Return a 400 Error?

As of November 9, 2026, two changes are enforced on every account. First: code that edits the `system` prompt, the `tools` list, or earlier messages before replaying a thinking block now gets a 400 error — this "prefix check" is no longer optional. Second: computer use now requires the `computer_toolset_20260801` toolset; the older `computer_20251124` tool returns a 400 error everywhere except Amazon Bedrock.

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-fable-5-2",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

Neither change is a silent behavior shift — both fail loudly and immediately, so the risk of a regression slipping unnoticed into production is low. But an un-updated computer-use integration will break on its very first call after deploy. Both models also require 30-day data retention and aren't available under zero data retention unless Anthropic specifically authorizes it, which means contracted customers with a zero-retention clause need a legal and security review before adopting Fable 5.2.

In practice that's four checklist items: search your codebase for message/`system`/`tools` edits placed before a thinking-block replay, migrate any `computer_20251124` references to `computer_toolset_20260801`, confirm your data-retention contract allows the new default, and run your test suite against all three scenarios once in staging. If all three come back clean, the production rollout is no different from any other version bump.

## Where Does Fable 5.2 Beat Opus 5.5 on Benchmarks?

On coding, Fable 5.2 scores 69.9% on FrontierSWE v2, ahead of Fable 5.1's 56.3% and Opus 5.5's 62.3%. Finance is messier: on AutomationBench, Fable 5.2 hits 51.4% versus 31.4% for Fable 5.1 and 42.5% for Opus 5.5, but Gemini 4 Carbon actually scores higher at 53.9% — a rare case where a rival beats Anthropic's own flagship outright.

On science, Fable 5.2 reaches 74.6% on Terminal-Bench-Science 0.1 (Mythos 5.2 hits 75.3%), well past Fable 5.1's 52.6%. In math, a coordinated team of 1,000 Fable 5.2 agents formalized Fermat's Last Theorem in roughly 30 hours; Opus 5.5 reached only 26% completion on the same task in 18 hours. On Mythos 5.2, the sandbox-escape rate dropped to 3.1%, down from 21% on Mythos 5.1 and 39% on Mythos 5.

## Where Can You Actually Run Fable 5.2?

Fable 5.2 is available on the Claude Platform API under the model ID `claude-fable-5-2`, plus AWS, Google Cloud, and Microsoft Azure. On Claude.ai and Claude Code, the model is now open to every user, while fast mode is currently limited to Claude Code.

Eligible paid plans get one to three free "Fable resets," and Fable can cover up to 50% of weekly usage on Pro and standard Team seats. That's the cheapest way to try the model without upgrading your plan — but once the resets run out, you're back on your normal quota, so it's worth not scheduling a big agentic job for the day those resets expire.

## Who Can Access Mythos 5.2?

Mythos 5.2 is reachable three ways: cybersecurity professionals through the [Cyber Verification Program](/en/posts/what-is-anthropic-cyber-verification-program), life-sciences researchers through the [Life Sciences verification program](/en/posts/claude-life-sciences-verification), and Claude Enterprise customers through "Claude Security," which runs on Mythos 5.2 without requiring verification. Mythos fast mode is also limited to verified organizations only.

The blocked-query fallback matters for everyday API users too: cybersecurity queries route automatically to Opus 4.8, and biology queries route to Opus 5. Fable 5.2 doesn't answer those directly — it quietly falls back to a different model, and you may not notice unless your integration logs which model actually responded.

## Should You Switch to Fable 5.2 Now?

Not immediately, if your system already runs on Opus 5.5 for everyday coding or knowledge work. Anthropic itself still recommends Opus 5.5 as its "strongest daily driver" — Fable 5.2 and Mythos 5.2 are specialist models built for long-horizon, multi-step technical work, not a default replacement. If you're coming from [Fable 5.1](/en/posts/claude-fable-5-1-cache-pricing-cut-explained), the real win is the jump on FrontierSWE and the science benchmarks; if you're coming from Opus 5.5, make that call only for specific, long-running agentic tasks.

Don't apply for Mythos access before you understand the [safeguard split between Mythos and Fable](/en/posts/claude-mythos-vs-fable-safeguard-split) — the two share weights, but the access process and usage terms are entirely different. If your API integration already moved to the [Anthropic Python SDK v1](/en/posts/anthropic-python-sdk-v1-migration-guide), test both breaking changes above in that same audit pass.

If your team hasn't settled on a default Claude model yet, don't make that call on price and context window alone: the prefix-check and computer-use migrations above apply no matter which model you standardize on, so running that four-item audit once and noting which models it covers beats repeating it from scratch on every future release. Browse the [full AI category](/en/category/ai) for more Claude coverage.

## Frequently Asked Questions

### What's the difference between Claude Fable 5.2 and Mythos 5.2?

Both share the same underlying model; Fable runs an added safeguard layer on cybersecurity, biology, chemistry, and distillation queries and is open to everyone. Mythos runs without those safeguards and is available only to organizations verified through the Cyber Verification Program, the Life Sciences program, or Claude Enterprise.

### How much does Claude Fable 5.2 cost?

Standard pricing is $8 per million input tokens and $40 per million output tokens. Fast mode costs $16 input and $80 output per million tokens for up to 2.5x faster token generation, and it's available in Claude Code without a beta header.

### Why is my computer-use integration returning a 400 error on Fable 5.2?

As of November 9, 2026, computer use requires the `computer_toolset_20260801` toolset instead of the older `computer_20251124` tool, which now returns a 400 error on every platform except Amazon Bedrock. You need to update your integration to reference the new toolset.

### Will switching to Fable 5.2 break my existing Opus 5.5 usage?

No. The two models run independently, and you can call Fable 5.2 through a separate `model` parameter in the API without touching your existing Opus 5.5 calls. Anthropic still recommends Opus 5.5 for everyday coding and knowledge work, with Fable 5.2 as an additional option for long-running, complex tasks.
