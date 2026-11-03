---
title: "What Are Claude's New Message Threads?"
slug: "claude-message-threads-explained"
translationKey: "claude-message-threads-beta-2026"
locale: "en"
excerpt: "Short answer: a beta Messages API feature that stores your conversation on Anthropic's servers for up to an hour, so each turn sends only new messages."
category: "ai"
tags: ["claude", "llm", "ai-agents", "api-design"]
publishedAt: "2026-11-03"
seoTitle: "Claude Message Threads Explained (November 2026)"
seoDescription: "Anthropic's new Message Threads beta lets the Claude API store a conversation server-side, so each turn sends only new messages instead of the full history."
---

Short answer: Message Threads, a beta Anthropic shipped for the Claude Messages API on [November 2, 2026](https://platform.claude.com/docs/en/release-notes/overview), let the server hold your conversation for a short time so each follow-up request sends only the new messages instead of the entire history. That cuts request size and keeps time-to-first-token low and steady as a conversation or agent loop grows longer.

## What problem do message threads solve?

Without a thread, every single turn of a conversation re-uploads the whole history, and the API re-validates and re-tokenizes all of it before the model can answer. In a short chat that cost is trivial, but in a long-running coding agent or a multi-hour support session, the payload keeps growing turn after turn, and so does the latency before the first token arrives. Message Threads move that accumulated history onto Anthropic's servers, so a turn 40 request looks almost as small as a turn 2 request — your client sends just the newest message and a pointer to where the last response left off.

## How do you create and continue a thread?

You add one new field, `thread`, to an ordinary [Messages API](https://platform.claude.com/docs/en/build-with-claude/message-threads) request, plus the `message-threads-2026-08-12` beta header on every call. The first request sends everything — full conversation, `system`, `tools` — with `"thread": {"type": "create"}`, and Anthropic stores that exchange under the response's `id`. Every later request sends only the new messages and references that `id`:

```python
# Turn 1: full conversation, creates the thread
first = client.beta.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,
    system="You are a support agent for Acme.",
    messages=[{"role": "user", "content": "Hi, question about an order."}],
    thread={"type": "create"},
    betas=["message-threads-2026-08-12"],
)

# Turn 2: only the new message, no system/tools
second = client.beta.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "How long does shipping take?"}],
    thread={"type": "continue", "previous_message_id": first.id},
    betas=["message-threads-2026-08-12"],
)
```

Sending `system` or `tools` on a continue request returns a 400 error — the thread already has them from the create call. The official SDKs for Python, TypeScript, Go, Java, C#, PHP, and Ruby ship a `thread` helper object that handles this bookkeeping automatically, including replay after a failure, so most teams won't write raw continue requests like the one above by hand.

## How long does a thread actually live?

Not long, by design. A thread expires 5 minutes after its last request, and Anthropic deletes it no more than 1 hour after it was last used — every stored response resets that 5-minute clock, but the 1-hour ceiling never moves. That makes threads useful for an active session, not a place to park a conversation a user might resume tomorrow; your application still has to own the durable copy.

## What happens when a continue request fails?

A continue request returns a 404 with `thread_not_found` when the thread has expired, when the prior turn wasn't stored (for example a tool call cut off by `max_tokens`), or when the request comes from a different API key, workspace, or organization than the one that created it. The fix is always the same: resend the full conversation from your own stored copy in a fresh create request, then continue from that new response's `id`. A second failure class, `thread_fingerprint_mismatch`, fires if you change a "fixed" field — `model`, `tool_choice`, `thinking`, `mcp_servers`, `context_management`, `output_config`, the top-level `cache_control`, or the set of beta headers — partway through a thread; those have to stay identical on every request until you deliberately start a new one.

## Does a thread replace prompt caching or my own database?

No, and this is the detail most teams will get wrong on a first read. A message thread is not a cache and not storage you can query later — Anthropic explicitly excludes it from zero-data-retention eligibility, holds it only in memory under a server-managed key, and gives you no API to list, read, or delete a thread once it exists. [Prompt caching](/en/posts/prompt-caching-cuts-llm-bill) still runs on its own terms underneath a thread: you place your own `cache_control` breakpoints exactly as you would without one, up to a maximum of four per request. Your product's conversation history, the one a user can reopen next week, still has to live in your own database — the thread only shortens what you send back to Claude turn to turn.

## What can't you use message threads with yet?

Being a beta, threads carve out real gaps rather than quietly degrading, which is the right failure mode but still worth planning around before you commit a whole code path to them.

| Not supported with threads | What happens instead |
|---|---|
| Message Batches | A batch item with `thread` set fails with an error in that item's result |
| Token Counting API | Count tokens on the full conversation, without `thread` |
| Compaction / compaction-on-demand | Start a new thread from your own summary instead |
| Context editing (except `clear_thinking` with `keep: "all"`) | Use the supported subset, or skip threading for that call |
| Organizations with HIPAA readiness or Inference hooks enabled | Threads are rejected outright for those orgs |

Pricing and rate limits are unaffected either way — a threaded request costs the same as the equivalent full-history request would have, you're just not the one paying the bandwidth and client-side tokenization cost to assemble it.

## Is this worth adopting now?

My take: turn it on for anything that already looks like an agent loop — multi-step coding assistants, long customer-support sessions, research agents that chain dozens of tool calls — and leave it off everything else until it leaves beta. The latency and payload-size win is real and compounds with every extra turn, which is exactly the shape of workload Anthropic is clearly optimizing for as agentic use of the [Claude API](/en/posts/designing-apis-and-tools-for-ai-agents) keeps growing, but the 1-hour hard ceiling and the missing batch/token-counting support mean it's not yet a drop-in replacement for how you manage conversation state everywhere. Teams building their own [agent memory layer](/en/posts/ai-agent-memory-systems) should treat this as a transport optimization sitting underneath that layer, not a substitute for it — and anyone shipping a new model version behind a flag should keep [logging which model and prompt version served each request](/en/posts/roll-out-a-new-ai-model-safely-with-flags), thread or no thread, since `model` is one of the fields a thread locks for its entire lifetime anyway.

## Frequently Asked Questions

### What beta header does Claude's message-threads feature require?

Every request that uses a thread — create or continue — must include the `message-threads-2026-08-12` header. Omitting it on any single request in the sequence causes that request to be treated as an ordinary, unthreaded Messages API call.

### Do message threads replace prompt caching?

No. A thread stores the conversation server-side so you can send less data each turn, but it does not cache anything by itself. You still set your own `cache_control` breakpoints, up to four per threaded request, exactly as you would without a thread.

### How long does a Claude message thread last before it expires?

A thread expires 5 minutes after its most recent request, and Anthropic deletes it no later than 1 hour after its last use. Each new stored response resets the 5-minute window, but the 1-hour ceiling is fixed from the thread's creation.

### What happens if a continue request to a Claude thread fails?

It returns a 404 error with the code `thread_not_found`. The fix is to resend your own stored copy of the full conversation in a new create request, then continue the thread from that fresh response's `id` going forward.
