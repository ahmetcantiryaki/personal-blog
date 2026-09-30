---
title: "What Is GPT-6.1 Sol? Near-Astra Power, Fifth the Price"
slug: "what-is-gpt-6-1-sol"
translationKey: "gpt-6-1-sol-launch-2026"
locale: "en"
excerpt: "GPT-6.1 Sol nearly matches GPT-6 Astra's performance while charging $2 per million input tokens, $10 per million output, and $0.10 for cached input."
category: "ai"
tags: [openai, ai-tools, ai-coding]
publishedAt: "2026-09-30"
seoTitle: "What Is GPT-6.1 Sol? Pricing and Benchmarks Explained"
seoDescription: "GPT-6.1 Sol is OpenAI's DevDay 2026 model update: near-Astra performance at $2 per million input tokens and $10 per million output tokens, as of September 2026."
---

Short answer: GPT-6.1 Sol is OpenAI's major upgrade to GPT-6 Sol, announced at DevDay on September 29, 2026. It nearly matches GPT-6 Astra's intelligence on agentic coding, computer use, and professional work, but costs roughly one-fifth of Astra's standard token prices: $2 per million input tokens and $10 per million output tokens.

## What is GPT-6.1 Sol?

GPT-6.1 Sol is one of more than 20 announcements OpenAI made at [DevDay 2026](https://openai.com/index/devday-2026-recap/). The event also covered new Codex tools, API updates, collaboration features inside ChatGPT, plugins, and subscription plan changes — but GPT-6.1 Sol became the headline because it delivers a concrete jump in price-to-performance.

The model replaces GPT-6 Sol and steps into the same tier as GPT-6 Astra, OpenAI's flagship model, at a fraction of the cost. According to OpenAI, GPT-6.1 Sol comes close to Astra's performance on agentic coding tasks, work that requires operating computer interfaces, and multistep professional workflows. As of September 2026, it is available in the API under the model string `gpt-6.1-sol`.

This follows a pattern OpenAI has used before: ship the expensive, top-tier model first (Astra), then follow a few months later with a "Sol" update that closes most of the capability gap at a much lower price. GPT-6.1 Sol is the sharpest version of that pattern yet — the price gap is a full fifth, and the benchmark numbers actually back up the claim.

## How much does GPT-6.1 Sol cost?

GPT-6.1 Sol's API pricing is substantially lower than Astra's across every tier. The cached-input price stands out in particular: it sits 95% below standard input pricing, and 50% below GPT-6 Sol's own cached-input price — which means the $0.20 per million tokens that GPT-6 Sol charged for cached input dropped to $0.10 in GPT-6.1 Sol.

| Model | Input ($/M tokens) | Output ($/M tokens) | Cached input ($/M tokens) |
|---|---|---|---|
| GPT-6.1 Sol (standard) | $2 | $10 | $0.10 |
| GPT-6 Astra (standard) | $10 | $50 | — |
| GPT-6 Astra (fast) | $20 | $100 | — |
| GPT-6 Astra (ultrafast) | $60 | $300 | — |

That table makes the headline claim concrete: GPT-6.1 Sol's standard input price is exactly one-fifth of Astra's standard input price, and the output price holds the same ratio.

## Does GPT-6.1 Sol actually match GPT-6 Astra on benchmarks?

Largely yes, and on some tests at a small fraction of Astra's cost. [TechCrunch reported](https://techcrunch.com/2026/09/29/openai-launches-gpt-6-1-sol-says-it-nearly-matches-gpt-6-astra-and-costs-less/) three benchmark results that back up OpenAI's price-performance claim with real numbers.

| Benchmark | Result vs. Astra | Cost comparison |
|---|---|---|
| DeepSWE v1.1 | Matches Astra's top-end accuracy | About 80% lower cost per task |
| OSWorld 2.0 (offline) | Within 2.1 percentage points of Astra | About 7x cheaper per completed task |
| AutomationBench | Falls short of Astra, but beats Claude Opus 5.5 | About one-third of Opus 5.5's token consumption |

DeepSWE v1.1 measures how well coding agents modify real codebases end to end. OSWorld 2.0 tests a model's ability to complete tasks in desktop and web interfaces at the mouse-and-keyboard level. AutomationBench simulates multistep business workflows — form filling, data collection, cross-application operations.

The cost-per-task figures make the gap even clearer. GPT-6.1 Sol costs roughly $0.38 per task, Claude Opus 5.5 costs $0.80–$1.55 per task on the same workloads, and GPT-6 Astra costs about $1.95 per task. For more on Claude Opus 5.5's own pricing and benchmarks, see our [Claude Opus 5.5 pricing and benchmarks](/en/posts/claude-opus-5-5-pricing-benchmarks) breakdown; for GPT-6 Astra's architecture and safety profile, see [What Is GPT-6 Astra?](/en/posts/what-is-gpt-6-astra); and for how GPT-6 Sol compared to Luna before this update, see [GPT-6 Sol vs Luna](/en/posts/gpt-6-sol-vs-luna-pricing-benchmarks).

## What is the Ultrafast tier, and how fast is it?

Ultrafast is a new speed tier that ships alongside GPT-6.1 Sol, and it substantially increases token generation speed. It runs up to 8x faster than standard mode inside Codex and up to 6x faster via the API — in Codex, that works out to roughly 300 tokens per second.

For comparison, [VentureBeat notes](https://venturebeat.com/technology/openais-gpt-6-1-sol-offers-astra-like-performance-at-1-5th-price-a-new-ultrafast-tier-clocks-at-300-tokens-per-second) that GPT-6 Astra's own ultrafast tier costs $60 per million input tokens and $300 per million output tokens — six times its standard tier ($10/$50) and three times its fast tier ($20/$100). OpenAI has not published separate ultrafast pricing for GPT-6.1 Sol, but given how much lower its base price already is, that tier will likely undercut Astra's equivalent option as well.

## How do you access GPT-6.1 Sol, and where is it available?

As of September 29, 2026, GPT-6.1 Sol is available inside ChatGPT Work and Codex for ChatGPT Plus, Pro, Business, Enterprise, and Edu users. Developers can call it directly through the API using the model string `gpt-6.1-sol`.

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-6.1-sol",
    messages=[
        {"role": "user", "content": "Fix the N+1 query problem in this function."}
    ],
)

print(response.choices[0].message.content)
```

One detail matters for anyone planning around this launch: GPT-6.1 Sol has not shipped inside regular consumer ChatGPT chat. It currently lives only in ChatGPT Work and Codex — a casual ChatGPT user browsing the standard chat interface will not see this model as an option yet. [Unite.AI's DevDay 2026 recap](https://www.unite.ai/openai-unveils-gpt-6-1-sol-at-devday-with-new-codex-and-chatgpt-tools/) notes that OpenAI paired this launch with new Codex tooling and team collaboration features inside ChatGPT, reinforcing that the initial rollout targets developers and teams building agentic workflows rather than everyday chat users. Teams building multistep coding agents on top of this model may also find our guide to [spec-driven development for AI agents](/en/posts/spec-driven-development-ai-agents) useful for structuring that work.

## Why is the developer reaction to GPT-6.1 Sol mixed?

Alongside the GPT-6.1 Sol price-performance announcement, OpenAI also confirmed usage-limit reductions on other products at the same event — Codex's [5-hour usage limit has come back](/en/posts/openai-codex-5-hour-limit-returns), for instance. That combination produced a genuinely split reaction from developers: excitement about the price and performance jump, frustration about tightened limits announced in the same breath.

Our read is that OpenAI is optimizing cost-per-performance through pricing tiers while simultaneously tightening how much of that performance developers can actually consume — the "it got cheaper" message and the "you can use less of it" message landed on the same day. That does not undercut GPT-6.1 Sol's technical achievement, but it does suggest OpenAI's capacity planning is still running behind demand.

## Frequently Asked Questions

### What is the difference between GPT-6.1 Sol and GPT-6 Sol?

GPT-6.1 Sol is the direct successor to GPT-6 Sol and performs noticeably better on agentic coding, computer use, and professional tasks. The clearest concrete change is cached-input pricing: it dropped from $0.20 per million tokens under GPT-6 Sol to $0.10 per million tokens under GPT-6.1 Sol, a 50% cut.

### Is GPT-6.1 Sol available in regular ChatGPT?

As of September 2026, no — at least not in the standard consumer chat interface. The model currently runs only inside ChatGPT Work and Codex for Plus, Pro, Business, Enterprise, and Edu plan holders; it has not been added to everyday ChatGPT chat yet.

### How fast is GPT-6.1 Sol's Ultrafast tier?

The Ultrafast tier generates tokens up to 8x faster than standard speed inside Codex and up to 6x faster through the API. In Codex, that translates to roughly 300 tokens per second — fast enough to be noticeable in most real-world coding and automation workloads.

### Is GPT-6.1 Sol better than Claude Opus 5.5?

It depends on the task. On AutomationBench, GPT-6.1 Sol outperforms Claude Opus 5.5 while consuming roughly one-third of Opus 5.5's tokens for the same work. But it does not fully close the gap with GPT-6 Astra, so "beats Opus 5.5 on some workflows at a much lower cost" is a more accurate summary than "better across the board."
