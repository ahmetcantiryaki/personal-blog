---
title: "How Do You Roll Out a New AI Model Safely?"
slug: "roll-out-a-new-ai-model-safely-with-flags"
translationKey: "feature-flags-ai-models-2026"
locale: "en"
excerpt: "Short answer: run it in flag-gated shadow mode first, then a monitored percentage canary with automatic rollback — never a direct full-traffic switch."
category: "software-engineering"
tags: ["feature-flags", "llm", "ai-reliability", "deployment"]
publishedAt: "2026-11-03"
seoTitle: "Roll Out a New AI Model Safely With Feature Flags"
seoDescription: "How to ship a new model or prompt version behind flags: shadow mode, percentage canaries, what to log per request, and automatic rollback triggers."
---

Short answer: treat the new model or prompt version as a deployable artifact, not a code change. Run it in shadow mode against real traffic with no user-visible or side-effecting output first, then open it to a small, logged, flagged percentage of real users, and wire an automatic rollback to quality, latency, and cost thresholds before you ever flip it to 100%.

## What's Different About Shipping a New AI Model vs. a Normal Feature?

A normal [feature flag](https://martinfowler.com/articles/feature-toggles.html) gates a deterministic code branch: given the same input, it does the same thing every time, so a small test suite and a brief canary tell you almost everything. A new model or prompt version is probabilistic across a huge input space — it can work perfectly on your eval set and still degrade on a class of inputs you never tested, because that class simply wasn't in the set. That's why model rollouts need their own pipeline stage before a canary ever sees a real user: shadow mode.

## What Is Shadow Mode, and What Does It Catch (and Miss)?

Shadow mode means the new model or prompt runs on real production traffic in parallel with the current version, but its output is only logged and scored — never shown to a user, and never allowed to trigger a side effect like sending an email or writing to a database. It answers one question: does this version behave safely on real traffic without touching anyone? It does not answer whether users actually prefer it, because there's no user in the loop at all. A version can pass shadow mode cleanly and still fail a canary, because some failures only surface when a real person reacts to the output — a confusing answer, a tone mismatch, a multi-turn conversation the shadow run never had to continue.

## When Should You Move from Shadow Mode to a Canary?

Move to a canary once the shadow run clears your offline eval thresholds on quality, refusal rate, and cost per request over a sample large enough to include your known tail cases — long conversations, edge-case languages, adversarial inputs — not just average-case traffic. A 1% canary that only ever sees short, simple requests will tell you the new version is fine right up until it meets the 5% of real traffic that is multi-turn or long-context, which is exactly where models most often regress. Size the canary, and the time you leave it running, around covering that tail, not around a round traffic percentage that looks cautious on a dashboard.

## What Should You Log on Every Request?

Log the flag key and the exact variant — model ID and prompt version — that served each request, alongside the quality score, latency, token cost, and any user feedback signal you have, so every outcome can be joined back to the version that produced it. Without that join, a rollback decision is a guess instead of a measurement.

```json
{
  "request_id": "req_8f2a1c",
  "flag_key": "support-agent-model",
  "variant": "claude-opus-5-5@prompt-v14",
  "baseline_variant": "claude-sonnet-5@prompt-v13",
  "quality_score": 0.91,
  "latency_ms": 840,
  "cost_usd": 0.014,
  "refused": false,
  "side_effects_executed": false
}
```

That `side_effects_executed` field matters as much as the scores: it's the record that proves a shadow-mode run never actually sent the email or wrote the row, which is what makes shadow mode safe to run on live traffic at all.

## What Signals Should Trigger an Automatic Rollback?

Gate the rollback on four signals, checked continuously against the previous version's baseline: a drop in eval or quality score, a rise in p50/p99 latency, a jump in cost per request (a new model can use noticeably more tokens for the same task), and any increase in error or refusal rate. An automatic rollback is a monitor that flips the flag back to the last-known-good variant the moment any threshold is crossed, without waiting for someone to notice a support ticket. [Wiring AI agents into your CI/CD pipeline safely](/en/posts/ai-agents-in-cicd-safely) covers the same kill-switch pattern for agent actions, not just model versions, and the mechanics transfer directly.

| Stage | Real users? | Side effects allowed? | What it catches | What it misses |
|---|---|---|---|---|
| Offline eval | No | No | Known regressions on your test set | Anything outside the test set |
| Shadow mode | Yes (silently) | No | Safety and stability on real traffic | User-facing quality and preference |
| Canary | Yes (a slice) | Yes, logged | Real quality, latency, cost at scale | Rare tail cases if the slice is too small or short |
| Full rollout | Everyone | Yes | Nothing new — this is the bet | Everything the canary didn't cover |

This is close enough to a [classic canary release](https://martinfowler.com/bliki/CanaryRelease.html) and [blue-green and canary deployments](/en/posts/blue-green-vs-canary-deployments) that most of the same infrastructure applies — the difference is what you're measuring. A code deploy's canary mostly watches error rates and latency; a model canary has to watch output quality too, and quality is harder to measure automatically, which is exactly where [AI evals that keep getting bypassed](/en/posts/why-ai-alignment-evals-get-bypassed) become relevant: a rollback gate is only as good as the eval behind it.

My take: most teams skip shadow mode and go straight to a small canary, because shadow mode feels like extra infrastructure for no visible benefit. It's the wrong trade. A canary with real users is also a canary with real consequences, and the fifteen minutes a shadow run would have cost you is cheaper than the support tickets from the 1% who got the bad output.

Treat the model's output the same skepticism you'd apply to [AI-generated code before merging it](/en/posts/ai-code-review-trust-but-verify) — a quality score crossing a threshold in a dashboard is a signal to investigate, not a guarantee the model is behaving, and the rollback path should exist regardless of how confident the offline eval looked in October.

## Frequently Asked Questions

### How do you safely test a new AI model in production?

Run it in shadow mode first: send real production traffic to it in parallel with the current version, log and score its output, but never show that output to users or let it trigger side effects. Only move to a canary with real users once it clears your offline eval thresholds on quality, cost, and refusal rate.

### What's the difference between a canary and shadow mode for AI models?

Shadow mode runs on real traffic with no user seeing the output, so it only tests whether the new version is safe and stable. A canary exposes the new version to a small, flagged percentage of real users, so it tests whether the output is actually better — a question shadow mode can't answer because it has no user in the loop.

### What should trigger an automatic rollback of a new model version?

A monitored drop in quality or eval score, a rise in p50/p99 latency, a jump in cost per request, or an increase in error or refusal rate compared to the previous version's baseline. The rollback should flip the flag back to the last-known-good variant automatically, without waiting for a human to notice.

### Why do small canaries sometimes miss AI model regressions?

A small canary (e.g., 1% of traffic) can miss regressions that are concentrated in tail cases — long conversations, edge-case languages, or adversarial inputs — because at that size, the canary may simply not see enough of those cases before you call it a success and roll out further.
