---
title: "What Is Claude Sonnet 5.5? Same Price, 30% Faster"
slug: "claude-sonnet-5-5-explained"
translationKey: "claude-sonnet-5-5-launch"
locale: "en"
excerpt: "Claude Sonnet 5.5 launched September 28, 2026 at Sonnet 5's $2/$10 pricing, but Anthropic says it's 30% faster and up to 30% cheaper per task."
category: "ai"
tags: [claude, llm, ai-tools]
publishedAt: "2026-09-29"
seoTitle: "Claude Sonnet 5.5: What Changed at the Same Price"
seoDescription: "Claude Sonnet 5.5 launched September 28, 2026 at Sonnet 5's $2/$10 pricing, but runs 30%+ faster and up to 30% cheaper per task. Here's what changed."
---

Short answer: Claude Sonnet 5.5 is Anthropic's mid-tier model, released September 28, 2026, priced identically to Sonnet 5 at $2 per million input tokens and $10 per million output tokens. Anthropic says it generates output more than 30% faster and completes the same tasks using fewer tokens and tool calls, cutting the effective cost per finished task by up to 30%.

## What is Claude Sonnet 5.5?

Sonnet 5.5 is the second model in Anthropic's "Claude 5.5" generation, called via the API model ID `claude-sonnet-5-5`. It followed [Claude Opus 5.5](/en/posts/claude-opus-5-5-pricing-benchmarks), which shipped six days earlier on September 22, 2026, and it arrived as the sticker price of [Sonnet 5 had only recently become permanent](/en/posts/claude-sonnet-5-permanent-pricing) after its own launch pricing period.

Anthropic frames Sonnet 5.5 as the "everyday work partner" tier: cheaper than Opus for high-volume agent and coding workloads, but no longer treated as a stripped-down model. It's the first Sonnet-tier release to ship with the cyber safeguards and automated fallback behavior that Anthropic had previously reserved for its flagship Opus models — the guardrails that detect and contain risky autonomous actions, such as unsupervised code execution or security-testing tasks that touch systems outside an approved scope.

## How much does Claude Sonnet 5.5 cost?

The list price did not move. Input and output tokens cost exactly what they did under Sonnet 5, which is unusual for a version bump — Anthropic has cut sticker prices on most recent model launches, including Opus 5.5's 20% drop from Opus 5.

| Model | Input ($/MTok) | Output ($/MTok) | What changed |
|---|---|---|---|
| Claude Sonnet 5 | $2 | $10 | Prior generation, pricing made permanent Sept 2026 |
| Claude Sonnet 5.5 | $2 | $10 | Same sticker price; 30%+ faster, up to 30% cheaper per task |
| Claude Opus 5.5 | $4 | $20 | Flagship tier, 20% list-price cut from Opus 5 |

"Up to 30% cheaper per task" is not a rate change — it's a claim about efficiency. Anthropic says Sonnet 5.5 needs fewer output tokens and fewer tool-call round trips to reach the same result as Sonnet 5, so the same job costs less even though the per-token rate is unchanged. That number comes from Anthropic's own testing; as of this writing, no independent benchmark firm has published a third-party measurement of the claim.

## Is Claude Sonnet 5.5 actually faster?

Anthropic's own figure is output generation more than 30% faster than Sonnet 5. Unlike the Opus 5.5 launch, which shipped with published Terminal-Bench and GDPval-AA scores against named competitors, Anthropic has not yet released equivalent head-to-head benchmark numbers for Sonnet 5.5 as of September 29, 2026. Treat the speed and cost-efficiency figures as vendor-reported until third-party evals confirm them — normal practice for a model that is one day old at publication time.

## What's different about Sonnet 5.5's cyber safeguards?

Anthropic previously limited its most aggressive cyber-safety fallbacks — automatic detection and interruption of an agent's risky autonomous actions — to the flagship Opus tier. Sonnet 5.5 is the first mid-tier model to inherit that same fallback logic. In practice, that matters most for teams running Sonnet-class models unattended in CI/CD pipelines or long agentic sessions, where an autonomous action can run for hours without a human checking in.

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=2048,
    messages=[
        {"role": "user", "content": "Refactor this module and run the test suite."}
    ],
)
```

Swapping the `model` string is the only change most integrations need to test Sonnet 5.5 — Anthropic has not announced the kind of breaking API changes that shipped with Opus 5.5 (such as thinking no longer being switchable off). Still, confirm against the current release notes before flipping production traffic, since breaking-change policies can differ between tiers.

## Should you switch from Sonnet 5 to Sonnet 5.5?

At an unchanged list price, there's no cost downside to testing Sonnet 5.5 in staging first. The practical risk isn't price — it's behavioral drift: a model that finishes tasks in fewer tool calls can also make different intermediate decisions along the way, which matters if your pipeline depends on Sonnet 5's specific tool-use patterns or output formatting. Our [comparison of Sonnet 5 against GPT-5.6 and Gemini 3.5](/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5) still reflects the prior generation's numbers; read it as directional until an updated Sonnet 5.5 comparison lands.

Our take: shipping two flagship-adjacent models six days apart, at flat or lower prices, is a clearer signal about Anthropic's competitive position than either launch's benchmark slide. It reads like a company racing to close the price-to-capability gap with OpenAI and Google before either can respond, rather than one optimizing a single product line on its own schedule.

## Does Claude Code default to Sonnet 5.5?

Not automatically. Claude Code's [Auto Mode](/en/posts/claude-code-auto-mode-explained) picks a model per task based on complexity rather than always defaulting to the newest release, so a Sonnet 5.5 rollout typically shows up as an additional option in that routing logic rather than an instant swap for every session. Teams running Claude Code with an explicit model pin in their config — rather than Auto Mode — need to update that pin manually to start using Sonnet 5.5, the same way they would for any other model-ID change.

For CI/CD pipelines specifically, the practical move is to pin the exact model string (`claude-sonnet-5-5`) in a staging pipeline first, run your existing test suite against it for a few days, and only then update the production pin. That sequencing matters more here than with a typical dependency bump, because a model change can alter agent behavior in ways a standard diff review won't catch — the code your agent writes might be equally correct but structured differently, which can trip brittle tests that assert on exact output shape rather than behavior.

## What is Claude Haiku 5.5?

Anthropic said, in the material accompanying the Sonnet 5.5 launch, that Haiku 5.5 is "coming in the coming weeks" — no fixed date as of September 29, 2026. Once released, it would complete the 5.5 lineup across all three tiers: Opus, Sonnet, and Haiku.

## Frequently Asked Questions

### What is Claude Sonnet 5.5's API model ID?

Short answer: `claude-sonnet-5-5`. Swap it in for `claude-sonnet-5` in existing API calls, Bedrock, or Vertex AI integrations to start testing the new model.

### Is Claude Sonnet 5.5 cheaper than Sonnet 5?

Short answer: not at list price — both cost $2 per million input tokens and $10 per million output tokens. Anthropic's "up to 30% cheaper" claim refers to using fewer tokens and tool calls per completed task, not a lower per-token rate.

### Do I need to change my code to use Claude Sonnet 5.5?

Short answer: usually just the model string. Anthropic has not announced Sonnet-5.5-specific breaking changes like the forced-thinking change that shipped with Opus 5.5, but check the current release notes before a production rollout since policies can vary by model tier.

### When does Claude Haiku 5.5 come out?

Short answer: Anthropic has not set a date. As of the Sonnet 5.5 launch on September 28, 2026, the company said only that Haiku 5.5 is coming "in the coming weeks."

**Sources:** [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview), [Anthropic News](https://www.anthropic.com/news), [TechCrunch coverage of the Sonnet 5.5 launch](https://techcrunch.com/2026/09/28/anthropic-releases-sonnet-5-5-which-it-calls-a-significantly-cheaper-faster-work-partner/).
