---
title: "How Should You Price Your SaaS Product?"
slug: "how-to-price-your-saas-framework"
translationKey: "saas-pricing-founder-framework-2026"
locale: "en"
excerpt: "Short answer: tie your price to a value metric, not your cost; package it into two or three tiers, and layer AI cost on as a separate usage meter."
category: "business"
tags: ["saas", "pricing", "monetization", "ai-tools"]
publishedAt: "2026-10-13"
seoTitle: "How to Price Your SaaS: A Founder's Framework"
seoDescription: "How should you price your SaaS product? Value-based pricing, tiering, why per-seat pricing is wobbling, and how to pass through AI cost in 2026."
---

Short answer: tie your price to a metric that represents the value the customer gets from your product, not your own cost; package that into two or three clear tiers, and add your AI inference cost as a separate usage meter instead of hiding it inside the seat price. Cost-plus pricing looks simple but punishes you as you scale; competitor-based pricing just inherits whatever mistake your competitor made.

## Value-based, cost-plus, or competitor-based?

All three models have their own failure point. Cost-plus (adding a fixed margin to your cost) is simple, but as your infrastructure cost falls — and AI inference costs are falling fast — you'd need to drop your price too, which erodes revenue along with cost. Competitor-based pricing gives you a fast starting point but assumes the rest of the market priced correctly. Value-based pricing — tying price to a concrete outcome the customer gets (hours saved, loss avoided, revenue generated) — takes the most effort but is the most durable, because your price doesn't need to move when your cost does.

## How do you set up packaging and tiers?

Two or three tiers are enough for most early-stage SaaS: an entry tier (single user or small team, core features), a middle tier (where most customers land, with the most features), and a top tier (customization and priority support for large accounts). Pushing tier count to four rarely increases sales — more often it creates decision fatigue by forcing the customer to work out which tier fits them.

| Pricing model | Strength | Weakness |
|---|---|---|
| Cost-plus | Simple to calculate | Erodes margin as infrastructure cost falls |
| Competitor-based | Fast reference point | Inherits the market's mispricing |
| Value-based | Durable even as cost changes | Takes time to find the right value metric |
| Usage-based (hybrid) | Bills for work AI agents actually do | Customers want predictability; pure metering scares them |

## Why is per-seat pricing wobbling?

Because "user" is now a weak billing unit. Bain & Company's review of more than 30 vendors adding generative AI found that 65% moved to a hybrid model — layering AI usage meters on top of their existing seat structure — and none fully transitioned to pure outcome- or usage-based pricing. The reason is simple: if an AI agent does the work without a human user, there's no human left for "per seat" to bill. Even [ChatGPT Business's $125 premium seat](/en/posts/chatgpt-business-premium-seats-explained) is a sign of this shift — the seat price is layered against how intense the underlying agentic workload is.

## How do you run willingness-to-pay research?

The most practical method isn't a Van Westendorp price sensitivity survey, it's a real price test: show existing customers or your waitlist two different price points and measure which tier they actually pick, instead of asking and taking the answer at face value. The gap between stated price preference and actual paid price is usually large — people say a lower number in a survey, then behave differently when they pull out a real card. Measuring trial-to-paid conversion against price point with an A/B test gives a more reliable signal than a survey does.

```text
Simple price test scaffold:
1) Pick two price points (e.g. $49/month vs $79/month)
2) Randomly split traffic into two groups, show each group one price
3) Measure trial-to-paid conversion separately for each group
4) Pick the winner: not the highest conversion, the highest (conversion x price)
```

## How do you pass through AI cost without scaring buyers?

Instead of burying inference cost inside a flat seat price, add an AI-specific usage layer and label it clearly — customers want to see what's being measured and why it changes, not an invisible price increase. A Gartner projection cited in Deloitte's 2026 TMT predictions forecasts that at least 40% of enterprise SaaS spend will shift to usage-, agent-, or outcome-based pricing by 2030 — products that set this structure up now experience the transition as a planned evolution rather than a forced repricing later.

## When should you re-run your price test?

Review your price on a trigger, not an annual calendar: when your underlying infrastructure cost (AI inference cost especially) changes significantly, when you ship a major feature that may have shifted your value metric, or when churn at one tier comes in noticeably higher than the others. That third trigger is easy to miss — high churn at one tier is usually a pricing signal, not a product problem.

## What are the most common pricing mistakes?

Three mistakes repeat: setting price by looking at a competitor and never testing it, offering the same tier structure to every customer segment and conflating a large account's needs with a small one's, and setting a price once and never revisiting it — even though your price should move when your value metric or cost structure does. There's a fourth, sneakier mistake too: turning discounting into a pricing strategy instead of a marketing tactic — selling at a constant discount blurs what your real list price is, for both the customer and your own team. None of these four mistakes get noticed all at once — each one builds up quietly, month by month.

My take: the biggest risk isn't picking the wrong model, it's deciding without testing any model at all. Setting a price point once and leaving it untouched for years is especially dangerous for a bootstrapped company that [chose not to raise VC](/en/posts/case-against-raising-vc-2026), because there's no growth-capital cushion — a mispriced product doesn't grow without extra money to cover the mistake. The same discipline you'd use [auditing your team's AI subscription cost](/en/posts/ai-subscription-sprawl-cost-control) applies just as well to auditing your own product's price.

## Frequently Asked Questions

### How many price tiers should an early-stage SaaS product have?

Two or three tiers are enough for most early-stage SaaS: an entry tier, a middle tier most customers choose, and a top tier for large accounts. More than four tiers usually creates decision fatigue instead of increasing sales.

### Why isn't per-seat pricing enough anymore?

Because AI agents can now do work without a human user, which means the "per seat" model doesn't always have a human left to bill. Bain & Company's review found 65% of vendors added usage-based AI meters on top of their seat structure for exactly this reason.

### Is willingness-to-pay research more reliable than a survey?

Yes, a real price test (A/B testing two price points against actual conversion) is more reliable than stated price preference in a survey. People often state a lower price in a survey than they actually behave at when paying with a real card.

### How should I factor AI cost into SaaS pricing?

Add AI inference cost as a separate, clearly labeled usage layer instead of hiding it inside a flat seat price. Gartner projects at least 40% of enterprise SaaS spend will shift to usage- or outcome-based pricing by 2030, so setting this structure up now avoids a forced repricing later.
