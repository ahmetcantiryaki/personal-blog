---
title: "Claude Sonnet 4.5 Retires: Migrating to Sonnet 5.5"
slug: "claude-sonnet-4-5-retirement-migration-guide"
translationKey: "claude-sonnet-4-5-retirement-migration"
locale: "en"
excerpt: "Claude Sonnet 4.5 stops working on November 30, 2026. Here are the five API settings that break on Sonnet 5.5, the price change, and the migration command."
category: "ai"
tags: ["claude", "ai-coding", "api-design", "llm", "best-practices"]
publishedAt: "2026-10-06"
seoTitle: "Claude Sonnet 4.5 Retirement: Sonnet 5.5 Migration Guide"
seoDescription: "Claude Sonnet 4.5 retires on November 30, 2026. Here's what breaks when you migrate to Sonnet 5.5, the pricing change, and how to automate the move."
---

Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) entered deprecated status on September 30, 2026, and every request to that model ID fails outright starting November 30, 2026. Anthropic's recommended replacement is Claude Sonnet 5.5, and the move breaks five API settings while cutting the price by roughly a third and expanding the context window fivefold.

## Is Claude Sonnet 4.5 actually going away?

Yes, but in two stages. On September 30, 2026, the model entered "deprecated" status, where requests still work but Anthropic no longer recommends it. On November 30, 2026, it moves to "retired," and every request to `claude-sonnet-4-5-20250929` returns an error. The two-month window in between is the time Anthropic gives teams to test and validate a migration.

Anthropic's [model deprecations page](https://platform.claude.com/docs/en/about-claude/model-deprecations) defines three states: Active means fully supported, Deprecated means still functional with a retirement date already set, and Retired means requests fail. Sonnet 4.5 sits in that middle stage right now — the stage where migrating still costs nothing but the waiting.

## What actually changes between Sonnet 4.5 and Sonnet 5.5?

Short answer: Sonnet 5.5 is both cheaper and wider-context, but five settings stop working without changes. Per [Anthropic's official model page](https://platform.claude.com/docs/en/models/sonnet-5-5/overview), input pricing drops from $3 to $2 per million tokens and output from $15 to $10 — a 33% cut. The context window grows from 200K tokens to 1M tokens standard, with no beta header required.

| Feature | Claude Sonnet 4.5 | Claude Sonnet 5.5 |
|---|---|---|
| Model ID | claude-sonnet-4-5-20250929 | claude-sonnet-5-5 |
| Input price | $3 / MTok | $2 / MTok |
| Output price | $15 / MTok | $10 / MTok |
| Cache read | $0.30 / MTok | $0.20 / MTok |
| Context window | 200K (standard) | 1M (standard) |
| Max output | 64K tokens | 128K tokens |
| Minimum cacheable prompt | 1,024 tokens | 512 tokens |
| Thinking by default | Off | On (adaptive) |

The numbers only tell half the story. Sonnet 5.5 uses Sonnet 5's tokenizer, which means the same text produces roughly 30% more tokens than it did on Sonnet 4.5. So you need to recount `max_tokens` and re-baseline cost — the per-token price is lower, but you're spending more tokens per request.

## Which API calls fail outright on Sonnet 5.5?

Four settings that worked fine on Sonnet 4.5 now return a 400 error on Sonnet 5.5:

- **Assistant prefill.** Sonnet 5.5 rejects a conversation that ends with a prefilled assistant turn; it must end with a user message. If you used prefill to force an output format, switch to [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) or a tool with an enum field instead.
- **Forced tool choice.** `tool_choice: {"type": "tool"}` or `{"type": "any"}` now returns a 400 error. Send `{"type": "auto"}` and mark the tool `strict: true` instead.
- **Thinking budget tokens.** `thinking: {"type": "enabled", "budget_tokens": N}` is no longer valid. You now pick one of five effort levels (`low`, `medium`, `high`, `xhigh`, `max`) via `output_config.effort`; there's no fixed mapping from a budget to a level, so plan to re-test at two or three of them.
- **Older computer use tool version.** On the Claude API and Google Cloud, `computer_20250124` is no longer accepted; you need `computer_toolset_20260801`.

The default behavior shifts too: a request with no `thinking` field runs without thinking on Sonnet 4.5, but Sonnet 5.5 runs adaptive thinking automatically on the same request. To keep the old behavior, send the lowest thinking setting, `between_tools`, at `high` effort or below.

## Do the safety classifiers change too?

Yes, and it's easy to miss. Sonnet 5.5 declines requests across more categories than Sonnet 4.5 did; a decline sets `stop_reason` to `"refusal"` and tags one of five categories: `cyber` (requests that could enable cyberattacks), `bio` (requests with biological-harm potential), `frontier_llm` (requests that could help build a competing model), `reasoning_extraction` (requests that force the model to reproduce its internal reasoning as text), and `general_harms` (other usage-policy violations). Teams doing legitimate security research can apply to Anthropic's Cyber Verification Program. If you use the advisor tool, note that Sonnet 5.5 no longer accepts Claude Opus 4.8, Opus 4.7, or Sonnet 5 as advisors — you need a supported model instead, such as Opus 5, Opus 5.5, Sonnet 5.5, or Fable 5.1.

## Can you automate the migration?

Yes. From inside Claude Code, one command scans your codebase:

```bash
/claude-api migrate this project to claude-sonnet-5-5
```

The skill swaps the model ID, updates the breaking parameters (prefill, forced tool choice, thinking budgets), calibrates an effort level, and produces a checklist of items to verify by hand. It asks which scope to touch before editing anything, and it detects Amazon Bedrock or Claude Platform on AWS clients and adjusts model ID formats accordingly.

If you're migrating by hand, the order matters: change the model ID first, then read responses by block `type` (since `content[0]` can now be a `thinking` block), then pass thinking blocks back unchanged in tool-use loops. Last, re-test your effort level — Sonnet 5.5's five effort levels don't map one-to-one onto Sonnet 4.5's old `budget_tokens` values.

## What does waiting actually cost you?

The real risk here isn't technical, it's calendar-shaped. Because the deprecated stage still works, teams tend to put the migration off — until 400 errors start showing up in production a week before November 30. In practice, `/claude-api migrate` produces a working draft migration in minutes for most projects; what's left is usually re-calibrating the effort level and rewriting the handful of flows that relied on prefill. Doing that in week one is a lot cheaper than doing it the night before retirement. [Claude Opus 4.1's retirement](/en/posts/claude-opus-4-1-retires-migrate-to-opus-4-8) followed the same pattern: teams that migrated early just swapped a model ID and moved on, while the ones that waited ended up debugging in production.

Thinking being on by default is the detail most teams miss first. If you're running multi-step agentic workflows, that's probably a quality win. If you're running a latency-sensitive chat interface, you're now paying for extra thinking tokens on every request unless you explicitly turn it down. Treat this migration as a chance to re-tune the effort level to the workload, not just a find-and-replace on the model ID. [Anthropic's Python SDK v1.0 migration](/en/posts/anthropic-python-sdk-v1-migration-guide) had the same shape — a major version bump rarely changes one setting; it usually changes several assumptions at once.

As AI-generated code becomes a bigger share of daily output, knowing which parts of a diff actually deserve a close read is its own skill, something we cover in [our guide to reviewing AI-written code](/en/posts/reviewing-ai-written-code). For other model launches and Claude updates, see our [AI category](/en/category/ai).

## Frequently Asked Questions

### When does Claude Sonnet 4.5 stop working completely?

November 30, 2026. The model has been "deprecated" since September 30, 2026, and still works during that window, but after November 30, every request to `claude-sonnet-4-5-20250929` returns an error instead of a response.

### Which four settings break when moving to Sonnet 5.5?

Assistant prefill (conversations must now end with a user message), forced tool choice (`tool_choice` of type `tool` or `any`), thinking budget tokens (replaced by `output_config.effort`), and the older `computer_20250124` tool (replaced by `computer_toolset_20260801`). All four return a 400 error.

### Is Sonnet 5.5 more expensive than Sonnet 4.5?

No, it's cheaper per token: input drops from $3 to $2 per million tokens, output from $15 to $10. But the same text produces roughly 30% more tokens because of Sonnet 5.5's tokenizer, so re-measure total cost before assuming the bill goes down.

### Is there a tool that automates the migration?

Yes. Inside Claude Code, running `/claude-api migrate this project to claude-sonnet-5-5` updates the model ID, the breaking parameters, and the effort calibration automatically, then outputs a checklist of items left to verify by hand.
