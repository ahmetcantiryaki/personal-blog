---
title: "How to Cut LLM Token Costs by 70%"
slug: "cut-llm-token-costs"
translationKey: "cut-llm-token-costs"
locale: "en"
excerpt: "Four levers — prompt caching, model routing, batch APIs, and context hygiene — stack to cut real LLM bills 50–70%, with a one-page cost-audit template."
category: "ai"
tags: ["ai-tools", "cost-optimization", "best-practices", "llm"]
publishedAt: "2026-07-07"
seoTitle: "How to Cut LLM Token Costs by 70%"
seoDescription: "Four stacking levers — prompt caching, model routing, batch APIs, context hygiene — cut real production LLM bills 50–70% with a one-page audit template."
---

If your LLM bill tripled without a matching jump in usage, the fix is rarely "switch to a cheaper model." It's usually four smaller, stackable levers: prompt caching, model routing, batch processing, and context hygiene. Applied together on real production workloads, teams have documented 50–90% reductions without touching output quality. Here's where the money actually goes and how to claw it back.

## Where your tokens actually go

The first surprise for most teams is that agents, not chatbots, drive the runaway bills. A chatbot sends one message and gets one response. An agent runs a loop — tool call, file read, edit, validation, re-check — and resends its *entire accumulated context* on every step. A ten-turn agent loop can send roughly 50x the tokens of a single linear chat call, simply because it re-reads its own history each turn.

| Workload | Typical token pattern |
|---|---|
| Single chat turn | One prompt, one response |
| Ten-turn agent loop | ~50x a single chat call (full context resent each step) |
| Unmonitored autonomous agent run | Can hit four-figure bills in a single multi-day run |
| Agent bill as share of eng spend | Frequently the #2 line item after salaries within 90 days of rollout |

This is exactly why one team's bug-triage agent went from an $87,000 April to a $24,000 May after two changes: routing tasks to cheaper models where possible, and pruning context — no quality regression, roughly $756,000 saved annualized.

## Lever 1: prompt caching — and the pitfall that silently kills it

Prompt caching lets a provider reuse the computed state of a repeated prefix instead of reprocessing it, and the discount is large: cached input tokens typically cost around 90% less than fresh ones. The catch is that caches match on an *exact* prefix. A single unstable token anywhere in the cached portion — most commonly a live date stamp in the system prompt — breaks the match on every call, and you silently pay full price while believing you're cached.

The fix is structural, not clever: put anything that changes per-call (current date, session ID, user-specific state) *after* the cached block, never inside it. Keep the system prompt and static tool definitions as the cached prefix, full stop.

## Lever 2: model routing — frontier only when the task needs it

Not every step in an agent loop needs your most capable model. Classification, extraction, formatting, and simple tool selection routinely run fine on a cheaper, faster model, reserving the frontier model for the steps that actually require deep reasoning. This is the single highest-leverage change for agent workloads specifically, because routing compounds with every extra loop iteration — a 50-step agent run pays the routing decision 50 times over.

| Task type | Route to |
|---|---|
| Classification, extraction, formatting | Cheapest capable model |
| Tool/function selection among a small set | Cheapest capable model |
| Multi-step planning, novel reasoning | Frontier model |
| Final synthesis / user-facing output | Frontier model (usually) |

## Lever 3: batch APIs — and how they stack with caching

Batch processing trades a completion-time guarantee (typically a 24-hour window) for a flat discount — commonly 50% off both input and output tokens, across major providers. The part teams miss: batch and prompt caching are not mutually exclusive. Stacked together on the cached, repeated portion of a workload, combined savings can push the effective cost of that portion down to roughly a quarter of the standard rate or less. If a workload doesn't need a synchronous response — bulk classification, offline evaluation, nightly report generation — batching it is close to free money.

## Lever 4: context hygiene — stop paying to resend the past

This is where the 50x agent multiplier actually gets cut down. Every token you carry forward in an agent's context gets resent, and repriced, on every subsequent call. Trimming completed sub-task history to a one-line summary, deduplicating repeated tool output, and evicting stale state are the direct fix — we cover the mechanics in detail in our [context engineering field guide](/en/posts/context-engineering-for-ai-agents). Schema-constrained outputs help here too: stripping verbose natural-language preamble from responses commonly cuts response tokens 30–50% on coding and extraction tasks, a technique we cover in our [guide to structured LLM outputs](/en/posts/llm-structured-outputs-json).

## Stacking the levers: a worked example

| Stage | Monthly cost (illustrative) | Change applied |
|---|---|---|
| Baseline agent workload | $10,000 | — |
| + model routing (cheap tasks off frontier model) | ~$6,500 | −35% |
| + context hygiene (evict/compress agent history) | ~$4,500 | −20pp cumulative |
| + prompt caching (stable system prompt/tools) | ~$3,200 | additional −13pp |
| + batch API on non-realtime portion | ~$2,800–3,000 | additional stacking on batchable slice |

The exact numbers vary by workload shape, but the ordering matters: fix context hygiene and routing first, because caching and batching only compound savings on top of a workload that isn't already wasting tokens on stale history.

## A one-page cost-audit template

Run this against one production workload this week:

1. **Tag spend by workload type.** Split chat vs. agent traffic — agents need the multiplier-aware analysis above; chat usually doesn't.
2. **Check your cache hit rate.** If it's low, look for a dynamic token (date, session ID) sitting inside the cached prefix.
3. **Audit model assignment per step.** List every distinct step in your agent loop and confirm each is on the cheapest model that meets its accuracy bar.
4. **Identify batchable traffic.** Anything without a real-time UX requirement is a batch-API candidate.
5. **Measure context growth per turn.** If context size per agent turn grows roughly linearly with turn count, you're resending stale history — add eviction.
6. **Re-run the same workload after each change** and track cost-per-successful-task, not just cost-per-call — a cheaper-but-wrong response you have to retry isn't actually cheaper.

## Frequently Asked Questions

### Which lever gives the biggest win for the least effort?

Fixing the prompt-caching pitfall usually wins on effort-to-payoff: it's a single structural change (move dynamic tokens out of the cached prefix) that can unlock a ~90% discount you were already entitled to but silently missing.

### Does model routing hurt output quality?

Not when scoped correctly. Routing only moves well-bounded, low-ambiguity steps (classification, extraction, tool selection) to cheaper models while keeping planning and synthesis on the frontier model — the failure mode to avoid is routing steps that actually need deep reasoning.

### Can I use batch APIs for agent workloads, not just bulk jobs?

Only for the parts of an agent run that don't need a synchronous response — background evaluation, nightly re-indexing, offline scoring. The interactive reasoning loop itself generally can't tolerate a 24-hour completion window.

### How often should I re-run a cost audit?

Monthly at minimum, and immediately after any agent redesign — a new tool, a longer planning loop, or a bigger retrieved-document size can silently reintroduce the context-bloat pattern the audit is meant to catch.
