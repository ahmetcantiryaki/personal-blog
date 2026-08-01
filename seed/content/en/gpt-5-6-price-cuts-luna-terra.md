---
title: "GPT-5.6 Price Cuts: Luna Drops 80%, Terra 20%"
slug: "gpt-5-6-price-cuts-luna-terra"
translationKey: "gpt-5-6-luna-terra-price-cuts"
locale: "en"
excerpt: "OpenAI cut GPT-5.6 Luna's API price 80% and Terra's 20% on July 30, 2026, while Sol held flat. Here's the new pricing table and what it means."
category: "ai"
tags: ["openai", "llm", "cost-optimization", "ai-tools"]
publishedAt: "2026-08-01"
seoTitle: "GPT-5.6 Price Cuts: Luna Down 80%, Terra Down 20%"
seoDescription: "OpenAI cut GPT-5.6 Luna's API price 80% and Terra's 20% on July 30, 2026, while Sol held flat. Here's the new pricing table and what it means."
---

OpenAI cut API pricing on two of its three GPT-5.6 models on July 30, 2026: Luna dropped 80%, Terra dropped 20%, and flagship Sol stayed flat at $5.00/$30.00 per million tokens. The cuts landed the same day DeepSeek shipped its V4 model, sharpening an already tight price war among frontier LLM providers.

## The New GPT-5.6 Pricing Table

Here's what changed, per million tokens (Mtok), input and output. Terra and Luna got the same percentage cut on both sides of the ledger; Sol's pricing is untouched.

| Model | Old Price (Input / Output) | New Price (Input / Output) | Change |
| --- | --- | --- | --- |
| GPT-5.6 Sol | $5.00 / $30.00 | $5.00 / $30.00 | Unchanged |
| GPT-5.6 Terra | $2.50 / $15.00 | $2.00 / $12.00 | 20% cut |
| GPT-5.6 Luna | $1.00 / $6.00 | $0.20 / $1.20 | 80% cut |

Per [OpenAI's own announcement](https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/), the cuts are framed as pushing the "price-performance frontier" forward — lowering cost without touching model quality.

## What Changed on Each Tier

### Sol: Price Unchanged, But Fast Mode Arrives

Sol's token pricing didn't move, but OpenAI added a new "Fast mode" for the Sol API around the same time. It targets lower latency at the same model quality — useful for live assistant or agentic workflows where response time matters more than raw throughput. Treat Fast mode's cost profile as a separate line item from standard Sol calls; latency-optimized requests can carry different tradeoffs depending on your workload.

### Terra: A 20% Cut in the Balanced Middle

Terra moved from $2.50 to $2.00 on input and from $15.00 to $12.00 on output. Terra was already positioned as the "balanced" tier, and this cut widens its cost advantage over Sol for medium-complexity production work — summarization, classification, and multi-step agent tasks that don't need Sol-level reasoning.

### Luna: The Steep One, Down to $0.20 Input

The headline number is Luna. Input dropped from $1.00 to $0.20 and output from $6.00 to $1.20 — an 80% cut on both. That makes Luna the first time a frontier-series OpenAI model has entered the ultra-low-cost tier. For high-volume, low-complexity work — simple classification, data cleanup, short summaries, auto-tagging — Luna now carries a genuinely meaningful cost advantage.

## How Luna Stacks Up Against DeepSeek and Gemini

Luna's new price didn't land in a vacuum. DeepSeek announced its V4 model the same day, and side-by-side pricing comparisons started circulating almost immediately. According to [VentureBeat's reporting](https://venturebeat.com/technology/ai-price-wars-openai-cuts-gpt-5-6-luna-prices-by-80-as-model-competition-shifts-toward-cost), the timing underscores how much of the current LLM competition is now playing out on cost rather than capability alone.

| Model | Input ($/Mtok) | Output ($/Mtok) | Note |
| --- | --- | --- | --- |
| GPT-5.6 Luna (new) | $0.20 | $1.20 | OpenAI's cheapest frontier model to date |
| DeepSeek V4 Pro | $0.435 | $0.87 | Price includes a standing 75% promotional discount |
| Gemini 3.5 Flash-Lite | ~$2.80 | — | Google's low-cost tier |
| Gemini 3.6 Flash | ~$9 | — | Comparable mid tier |

As [mlq.ai's roundup](https://mlq.ai/news/openai-slashes-gpt-56-luna-prices-80-undercutting-deepseek-as-ai-price-war-intensifies/) of the launch notes, these numbers aren't a perfectly clean apples-to-apples comparison — every vendor bakes in different pricing dimensions, from promotional discounts to context caching to batch-API rates. Still, on the raw numbers, Luna's input price now undercuts DeepSeek V4 Pro, though DeepSeek stays cheaper on output tokens ($0.87 versus $1.20). Against Google's Gemini 3.5 Flash-Lite and Gemini 3.6 Flash, Luna looks meaningfully cheaper on comparable low-cost tiers. It's worth not overreading this: OpenAI isn't claiming the single lowest price in the market — Chinese vendors like DeepSeek, Xiaomi, and MiniMax still undercut on raw cost in places. My honest read is that the real story here isn't one number beating another — it's that OpenAI just put a frontier model into the ultra-cheap band for the first time, which is the kind of move that tends to drag every other vendor's pricing down over the following quarters.

## Which GPT-5.6 Model Should You Actually Use

Model selection should mostly follow workload shape. As a rough rule: high-volume, low-complexity tasks fit Luna; medium-complexity work that needs consistency fits Terra; complex reasoning and multi-step planning still justify Sol. A simple cost-estimation function like the one below, run against your own monthly token volume, makes the tradeoff concrete instead of theoretical:

```python
MODELS = {
    "sol":   {"input": 5.00, "output": 30.00},
    "terra": {"input": 2.00, "output": 12.00},
    "luna":  {"input": 0.20, "output": 1.20},
}

def monthly_cost(model, input_mtok, output_mtok):
    price = MODELS[model]
    return input_mtok * price["input"] + output_mtok * price["output"]

# Example: 800M input tokens, 150M output tokens per month on a classification job
for model in MODELS:
    cost = monthly_cost(model, input_mtok=800, output_mtok=150)
    print(f"{model}: ${cost:,.2f}/month")
```

Running numbers like this before shipping makes it obvious which tier actually moves your bill. For broader tactics beyond picking the right model — caching, prompt trimming, routing — see our guide on [cutting LLM token costs](/en/posts/cut-llm-token-costs); those techniques stack independently of whatever OpenAI does with list prices.

## What This Means Going Into August

GPT-5.6 reached general availability back in July 2026 — for the original launch pricing and positioning context, see our [GPT-5.6 GA coverage](/en/posts/gpt-5-6-general-availability-codex-desktop). As of August 2026, the picture is this: pricing among OpenAI, Google, and DeepSeek has stopped being a brand-preference question and become a straightforward engineering decision. Which of Sol, Terra, or Luna you route a given call to now has a direct, measurable effect on your monthly bill, which means model selection deserves the same periodic review as any other cost-optimization line item, not a one-time choice made at launch. If you're weighing frontier models more broadly, our [Claude Sonnet 5 vs GPT-5.6 vs Gemini 3.5 comparison](/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5) is a useful next read, and if you're deciding between Google and OpenAI specifically, see [Gemini vs ChatGPT](/en/posts/gemini-vs-chatgpt-2026). For more AI coverage, browse our [AI category](/en/category/ai).

## Frequently Asked Questions

### Why didn't GPT-5.6 Sol's price change?

OpenAI positions Sol as its highest-capability model and is competing on quality there rather than price. Instead of a price cut, Sol got a performance-oriented addition — Fast mode — around the same announcement.

### Is Luna's new price actually cheaper than DeepSeek V4?

On input tokens, yes: $0.20 versus DeepSeek V4 Pro's $0.435 (a figure that already includes DeepSeek's standing 75% promotional discount). On output tokens, DeepSeek is still cheaper at $0.87 versus Luna's $1.20, so which one wins overall depends on your workload's input-to-output token ratio.

### When did this price cut take effect?

OpenAI announced the cuts on July 30, 2026, and they applied immediately in the API. Existing integrations picked up the new pricing automatically with no code changes required.

### Should I use Terra or Luna for my workload?

If the task is simple and high-volume — tagging, short summaries, basic classification — Luna's cost advantage is hard to beat. If it needs more context tracking, consistency, or multi-step reasoning, Terra's extra cost usually pays for itself in a lower error rate.
