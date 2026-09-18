---
title: "What Is Claude's New On-Demand Compaction?"
slug: "claude-on-demand-compaction-explained"
translationKey: "claude-on-demand-compaction-2026"
locale: "en"
excerpt: "Short answer: a new compaction parameter on the Messages API lets you summarize a conversation on your own schedule and swap in a signed block; beta, API only."
category: "ai"
tags: ["claude", "llm", "api-design", "ai-infrastructure"]
publishedAt: "2026-09-18"
seoTitle: "Claude On-Demand Compaction Explained: Dev Guide"
seoDescription: "Short answer: a new compaction parameter on the Messages API lets you summarize a conversation on your own schedule and swap in a signed block; beta, API only."
---

Short answer: on September 14, 2026, Anthropic added a new Messages API capability behind the `compact-2026-09-04` beta header — send a `compaction` parameter on a request, and the API returns a single signed block summarizing everything up to that point, which you then swap in for the old messages on later calls. The difference from the existing threshold-based mechanism is control: you now decide the moment compaction happens, instead of the API deciding for you.

## What is on-demand compaction, and how does it differ from automatic compaction?

On-demand compaction is a manual summarization request that fires the instant you send the `compaction` parameter; the response contains nothing but that one signed summary block, with no accompanying reply. Anthropic's earlier `context_management`-based feature, `compact_20260112` (live since January 2026), works the opposite way — it triggers automatically once input tokens cross a threshold you set via `trigger.value` (default 150,000, minimum 50,000).

Both solve the same problem — long agent loops and multi-turn chats blowing past the context window — but the control point is different. Automatic triggering suits "set it and forget it" background agents. On-demand compaction is built for applications that want to compress history at a deliberate point in their own business logic, such as right after a task finishes.

## How does the signed compaction block actually work?

The API attaches a server-side signature to every `compaction` block it returns, and that signature has to come back verbatim on later requests — tamper with it, or drop it, and the request is rejected. That is a tamper-evident design: it stops a developer from hand-editing the summary text and passing it off to the API as if it were the real, verified conversation history.

In practice the flow looks like this: you send a request carrying the `compaction` parameter, the response holds exactly one signed summary block and no ordinary assistant reply, you append that block to your message list, and on the next real request the API automatically discards everything that came before the block and continues the conversation from the summary onward. The same guarantee is useful in distributed agent setups where multiple services share one conversation history — a receiving service can verify the signature to confirm a summary genuinely came from Claude rather than from an upstream bug.

## When should you use on-demand vs. automatic triggering?

Short answer: use automatic threshold triggering for autonomous agents running unattended for hours, and reach for on-demand when your product has a natural point at which it wants to summarize. Automatic mode keeps a long-running coding agent's context window from overflowing without any developer intervention at all.

On-demand mode leaves the timing up to your application, so a support bot can compact history the moment a ticket closes and start the next conversation with a lighter context. You can also run the summarization request in the background while continuing to answer the user, then swap the block in once it's ready.

It helps to think of the two as complementary layers rather than either/or: teams that leave automatic thresholds on as a safety net while normally driving compaction on-demand get protection against unexpectedly long sessions plus predictable timing everywhere else. Anthropic's documentation doesn't spell out combining both mechanisms on the same request, so if you try it, watch token usage in staging first.

## A concrete scenario: a long-running coding agent

Picture a coding agent running a multi-step refactor across a large repository — read files, run tests, patch, re-test, repeat for 40-50 turns, with every turn appending more tool output to the conversation. Automatic threshold triggering works here, but it waits until the threshold is crossed; a developer who wants to compact history right after each task completes (say, once a test suite goes green) gets a more predictable cost and latency profile from on-demand compaction instead.

The same logic applies to support agents: since a conversation naturally ends when a ticket closes, using that moment as the compaction trigger gives the next user a clean start without dragging along context they don't need. In our view that's the feature's most concrete win — using the natural closing points in your business logic instead of waiting on a token counter.

## How do you wire it up in code?

The example below shows the minimal flow for compacting a conversation on demand and using the summary on the next request:

```python
import anthropic

client = anthropic.Anthropic()

# 1) Compact the conversation whenever you decide to
compact_response = client.beta.messages.create(
    model="claude-sonnet-5",
    max_tokens=1024,
    messages=long_running_messages,
    compaction={},
    betas=["compact-2026-09-04"],
)

compaction_block = compact_response.content[0]  # the signed summary

# 2) Send the summary in place of old history on later requests
next_response = client.beta.messages.create(
    model="claude-sonnet-5",
    max_tokens=1024,
    messages=[compaction_block, {"role": "user", "content": "Let's continue"}],
    betas=["compact-2026-09-04"],
)
```

Per Anthropic's docs, signature verification happens server-side, so your code needs to pass the block through untouched rather than parsing or editing it. If you're jumping a major SDK version, our [Anthropic Python SDK v1.0 migration guide](/en/posts/anthropic-python-sdk-v1-migration-guide) covers what else changes in the same release cycle.

## What are the limitations right now?

As of September 2026, on-demand compaction is beta and available only through the direct Claude API — it isn't yet on Amazon Bedrock or Google Cloud. Teams running a multi-cloud Claude deployment can't roll it out everywhere at once.

Being beta also means the contract can change; pin the exact beta header version (`compact-2026-09-04`) in production code and watch Anthropic's release notes for updates. Summary quality also depends on Anthropic's default summarization template unless you override it with the `instructions` parameter — if preserving specific details like code snippets or variable names matters, writing a custom instruction is more reliable than trusting the default.

| Feature | On-demand compaction (new) | Automatic compaction (`compact_20260112`) |
|---|---|---|
| Trigger | Developer calls it manually via the `compaction` parameter | API fires automatically at a token threshold |
| Beta header | `compact-2026-09-04` | `compact-2026-01-12` |
| Platform support | Claude API only | Claude API, Bedrock, Google Cloud, Microsoft Foundry |
| Control point | Application logic decides (e.g., task completion) | Threshold value decides (minimum 50,000 tokens) |
| Block format | Signed, single summary block returned | `compaction` block embedded in the response stream |

## Frequently Asked Questions

### Why did Claude add on-demand compaction?

It gives developers control over exactly when a long agent session or multi-turn chat gets summarized, instead of relying only on the automatic threshold-based mechanism that existed before September 2026 and left timing entirely up to the API.

### Which Claude models support on-demand compaction?

The beta feature works on current Claude API models including Claude Sonnet 5 and Claude Opus 5; on models with thinking blocks, such as the Fable and Mythos series, the thinking content in preserved turns stays valid after compaction.

### Does on-demand compaction cost extra?

Yes — the summarization call counts as a separate sampling iteration and is billed on top of your normal request and response tokens, though resending an already-generated summary block later doesn't add further cost.

### Is on-demand compaction available on Amazon Bedrock?

No. As of September 2026, on-demand compaction is only reachable through the direct Claude API; Bedrock and Google Cloud deployments still support only the older automatic threshold-based compaction.

For more on managing token spend around long-running Claude workloads, see our guide to [Claude Code's spend limits and prompt cache metrics](/en/posts/claude-code-spend-limits-prompt-cache-metrics); if you're separating large files out of conversation history, our [Claude Files API GA guide](/en/posts/claude-files-api-ga-explained) is a useful companion, and if you're wiring your own tool into the API, see [building your first MCP connector](/en/posts/build-your-first-mcp-connector). Browse more Claude and API coverage in our [AI category](/en/category/ai).

Sources: [Anthropic's official compaction documentation](https://platform.claude.com/docs/en/build-with-claude/compaction) and the [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview).
