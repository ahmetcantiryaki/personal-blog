---
title: "How Prompt Caching Cuts Your LLM Bill"
slug: "prompt-caching-cuts-llm-bill"
translationKey: "prompt-caching-llm-cost-2026"
locale: "en"
excerpt: "Short answer: prompt caching stores the unchanging start of your request. Claude's cache reads cost 10% of standard input, dropping to 5% on some models."
category: "software-engineering"
tags: ["claude", "openai", "gemini", "llm", "cost-optimization"]
publishedAt: "2026-10-20"
seoTitle: "Prompt Caching: Claude vs OpenAI vs Gemini in 2026"
seoDescription: "How prompt caching actually works, the price and TTL differences across Claude, OpenAI, and Gemini, measuring hit rate, and the pitfalls to avoid."
---

Short answer: prompt caching stores the unchanging prefix of a request — a system prompt, tool definitions, a long context block — on the provider's side; the next time you send that same prefix, it's read from cache instead of reprocessed. On Claude, that read costs 10% of standard input pricing, dropping as low as 5% on Opus 5.5 and Sonnet 5.5.

## How Does Prompt Caching Actually Work?

The mechanism rests on the same idea across all three providers: you process the fixed part of a request — a system prompt, a long document, tool schemas — once, store it on the provider's side, and subsequent requests read it from cache instead of recomputing it. The difference shows up in how that cache gets triggered and how long it lasts.

Anthropic triggers caching with an explicit marker (`cache_control`) — you specify which block to cache in your request. OpenAI's mechanism is fully automatic: any request over 1,024 tokens automatically reads the longest matching prefix from cache, with no configuration required. Gemini sits between the two: 2.5 and newer models ship with **implicit** caching on by default, plus an optional **explicit** caching mode that gives you manual control.

## What's the Price and TTL by Provider?

The table below summarizes the mechanics documented by each provider; exact figures vary by model and region, so check each provider's current pricing page before making a production decision.

| Provider | Write Cost | Read Cost | TTL |
|---|---|---|---|
| Claude (Anthropic) | 5min: 1.25x standard input; 1hr: 2x | 10% of standard (5% on Opus 5.5 / Sonnet 5.5) | 5 minutes (default) or 1 hour |
| OpenAI | No extra charge, automatic | Substantially discounted vs. standard input (check current docs for the exact rate) | Not officially guaranteed, short-lived |
| Gemini (explicit) | Billed at standard input rate, + hourly storage fee | Substantially discounted vs. standard | Usually defaults to 1 hour, configurable |
| Gemini (implicit) | No extra charge, automatic | Discounted on a hit, not guaranteed | Not fixed, varies with memory pressure |

The write/read split on Claude matters most here: every time you **write** to the cache you pay more than standard input (1.25x or 2x), but every time you **read** from it you pay far less (0.1x, down to 0.05x on some models). The payoff depends entirely on how many times you reuse that same prefix — write once and read once and there's no gain; write once and read twenty times and the bill drops sharply.

## What Was Claude's 2026 Cache-Read Price Cut?

Per Anthropic's current pricing, cache reads cost 10% of standard input on most models — but Opus 5.5 and Sonnet 5.5 bring that down to 5%, and Fable 5.1 and Mythos 5.1 go as low as 2.5%. That's a model-level discount on the same cache-read volume: moving a heavy prompt-caching workload onto these models can cut the read-side bill in half or more without touching anything on the write side.

## How Do You Structure a Cache-Friendly Prompt?

The rule fits in one sentence: **put the unchanging part first, the changing part last.** All three providers match on a prefix, so if even a single character near the start of your request changes, everything after that point falls out of the cache.

```text
[FIXED] System prompt + tool definitions + long document context
[FIXED] Prior conversation history (if unchanged)
[VARIABLE] The user's latest message this turn
```

A common mistake is burying a small variable — a timestamp, a session ID — inside the system prompt near the top. That invalidates the entire prefix on every single request and the cache never fires. Always push variable data to the very end of the request instead.

## How Do You Measure Hit Rate and Savings?

All three providers report cache hits in the response's usage data: OpenAI returns a `cached_tokens` field, and Claude and Gemini each report a comparable split in their own usage objects. The practical measurement step: sum how many input tokens got read from cache across a day of production traffic, multiply that by the gap between standard and cache-read pricing, and the result is what you avoided paying that day because of caching. The same discipline we recommend in [making AI token spend visible by team](/en/posts/ai-finops-token-spend-visibility) applies directly here — cache savings should show up as their own line item, broken out by team or endpoint, not buried inside a single total.

## What Pitfalls Should You Watch For?

Two mistakes come up most often. The first is an **ordering mistake**: placing the block you want cached in the middle or end of a request breaks prefix matching entirely — the cache only recognizes an unbroken match starting from the beginning. The second is **invalidation blindness**: if you update a document, the old cache entry can keep serving until its TTL expires; changing your system prompt or tool definitions needs to be understood as creating a fresh cache entry (and briefly eating the write cost again), not a free edit.

Ordering matters inside a single Claude request too if you mix TTLs: 1-hour cache blocks need to come before 5-minute blocks, or the provider can't split the request correctly.

A third pitfall is assuming the wrong cache scope. On OpenAI, caching is shared at the organization level — different applications in the same org using the same prefix can benefit from each other's cache, which can produce an unexpected saving (or an unexpected bill split) in a multi-team company. Gemini's explicit cache, by contrast, is scoped to the cache object you created; another request sending identical content won't trigger it unless it explicitly references that cache object's handle.

## When Is It Worth Setting Up?

Caching doesn't pay off for every workload. For one-off, unique requests — where every call's prefix differs — there isn't enough read volume to offset the write cost, and total spend can actually go up. It pays off for agent loops that reuse the same long system prompt or document context dozens of times within minutes, multi-turn chat interfaces, and function-calling systems that send the same tool schema on every request.

## How Does This Relate to Claude's Inline Tools?

As we covered in our piece on [Claude's inline tools](/en/posts/claude-inline-tools-explained), adding a new tool to a conversation used to mean editing the start of the system prompt and invalidating the entire cache. Inline tools fix this by moving tool definitions outside the cached prefix — once you're designing a prompt-caching strategy, where your tool definitions sit becomes a factor that, on its own, decides your cache hit rate.

## Don't Confuse This With Semantic Caching

Prompt caching gets mixed up often with the embedding-based caching we cover in our piece on [semantic caching](/en/posts/semantic-caching-ai-apps), but the two solve different problems: prompt caching makes **the repeated prefix of the same request** cheaper while the model still runs; semantic caching matches **different users' similarly-worded questions** and skips the model call entirely. Running both together in a production system is common — one cuts input cost, the other eliminates the call itself. More cost and infrastructure coverage like this lives in our [software engineering section](/en/category/software-engineering).

## Frequently Asked Questions

### Does prompt caching work automatically, or does it need code changes?

On OpenAI it's fully automatic — no configuration needed. On Claude you need to explicitly mark which block to cache using the `cache_control` parameter. On Gemini, implicit caching runs automatically while explicit caching requires manual setup.

### Should I use a 5-minute or 1-hour TTL on Claude?

If you reuse your prefix more often than every 5 minutes, the default 5-minute TTL is enough and cheaper. If you reuse it less often than every 5 minutes but more than once an hour, the 1-hour TTL comes out cheaper overall despite the higher write cost.

### Where do I see my cache hit rate?

All three providers report the number of tokens read from cache in the usage section of the API response — OpenAI's `cached_tokens` field, and the corresponding usage fields on Claude and Gemini. Summing that daily and multiplying by the price gap between standard and cached tokens gives you the real savings.

### Does a small change to my system prompt break the cache?

Yes. The cache depends on an unbroken prefix match from the start of the request; a change anywhere in the system prompt, even a single character, invalidates everything after that point, and the next request gets processed again at the standard write cost.
