---
title: "Why Are AI Margins Shrinking in Vertical SaaS?"
slug: "why-ai-margins-shrink-vertical-saas"
translationKey: "vertical-saas-ai-margins-2026"
locale: "en"
excerpt: "Because LLM inference is a variable cost that scales with usage and success, unlike classic SaaS infra — pulling gross margin from 70-85% toward 45-53%."
category: "business"
tags: ["saas", "pricing", "cost-optimization", "finops"]
publishedAt: "2026-10-19"
seoTitle: "Why Vertical SaaS AI Margins Are Shrinking"
seoDescription: "AI-native SaaS margins sit near 45-53%, versus 70-85% for classic SaaS, because inference cost scales with usage. Here's why, and how companies respond."
---

Short answer: because large-language-model inference is a per-call variable cost that rises with every successful user action, while classic SaaS infrastructure cost grows much more slowly than revenue — so the more a vertical AI feature gets used, the more it eats into the margin it's supposed to be earning.

## Why does adding AI features compress SaaS gross margins?

Traditional SaaS margins hold at 70-85% because the marginal cost of serving one more user — another row in a database, another API request to a service you already run — is close to zero once the product is built. An AI feature breaks that assumption: every chat message, every generated report, every autonomous agent step calls a model API and gets billed per token, so cost scales roughly in step with usage instead of staying flat. A company that prices an AI feature into a flat per-seat subscription is effectively absorbing a cost line that grows with how much customers love the feature — the better the product does its job, the worse the unit economics get unless pricing accounts for it.

## How much lower are AI-native margins than classic SaaS?

| Segment | Typical gross margin | Source |
|---|---|---|
| Classic SaaS (no LLM inference) | 70-85% | Long-standing SaaS benchmark range |
| AI-native products, 2025 average | ~45% | [CloudZero](https://www.cloudzero.com/blog/ai-gross-margin) |
| AI-native products, 2026 projection | ~53% | [CloudZero](https://www.cloudzero.com/blog/ai-gross-margin) |
| AI-native gross margin (broader sample) | ~52% | ICONIQ, January 2026 report |
| Fastest-scaling AI startups | ~25% | Bessemer, 2025 report |

The spread between these figures matters as much as any single number: Bessemer's 25% figure specifically covers the fastest-growing AI companies, where usage — and therefore inference cost — is scaling fastest relative to revenue, which is exactly the dynamic a vertical SaaS company adding an AI copilot should expect to hit first.

## Why doesn't falling per-token pricing fix this on its own?

Per-token prices have genuinely fallen — one [widely cited comparison](https://davefriedman.substack.com/p/the-more-ai-costs-fall-the-more-youll) puts GPT-4o's cost at roughly $5 per million tokens, an 83% reduction over about 18 months relative to GPT-4 at launch — but falling unit cost and falling total cost are not the same thing when usage is growing faster than price is dropping. If a feature's usage triples while its per-token price halves, total inference spend still rises by 50%. Analysts who track this closely argue the usage-growth curve for AI features currently outpaces the price-decline curve for the underlying models, which is the opposite of what happened with compute and storage in the 2010s SaaS boom, when infrastructure cost fell steadily while usage grew in a way that mostly didn't increase the provider's own bill per customer.

One analysis frames this as an "inference tax": every AI feature a company ships adds a cost line that grows in lockstep with the feature's own success, in a way a traditional SaaS feature — a new dashboard view, an extra report template — never did, because those features cost the same to serve one customer or ten thousand once they're built.

## What else is pushing costs the other way?

Underlying infrastructure isn't getting uniformly cheaper either: one [report on AI feature debt and portfolio margins](https://openmetal.io/resources/runway-intelligence/inference-tax-ai-feature-debt-portfolio-gross-margins/) notes AWS raised prices on reserved GPU capacity by roughly 15% in early 2026, a reminder that the hardware layer beneath inference pricing has its own supply constraints and isn't guaranteed to keep falling just because model providers cut their API prices. A vertical SaaS company modeling its 2027 margins off today's token prices alone is extrapolating from only one side of that cost stack.

## How are vertical SaaS companies responding?

Three patterns show up repeatedly in how vertical SaaS companies are re-pricing AI features once the margin problem becomes visible on a P&L:

1. **Usage-based or credit pricing for the AI layer specifically** — keeping the core subscription flat-rate but metering the AI feature separately, the way Notion charges separate credits for custom AI agents rather than folding unlimited agent usage into a flat seat price.
2. **Model routing** — sending simple, high-volume requests to a cheaper, smaller model and reserving an expensive frontier model for requests that actually need it, instead of running every request through the same model regardless of complexity.
3. **Caching repeated context** — reusing a cached system prompt, document, or retrieved context across requests instead of re-sending and re-paying for the same tokens on every call, which compounds savings fastest for AI features with a large, mostly-static context (a codebase, a knowledge base, a support macro library).

Vertical SaaS companies also lean on an argument that doesn't show up directly in a margin number: proprietary customer data and workflow lock-in. The claim is that a vertical AI product embedded in a specific industry's data and process is harder to displace than a generic wrapper around a foundation model — a real defensibility argument, but one that doesn't by itself lower the per-token bill.

## My take

The margin story here isn't "AI is unprofitable," it's "flat per-seat pricing was built for a cost structure that AI features don't have." A company that bundles unmetered LLM calls into a $49/seat/month plan is making a bet that average usage stays low forever; the companies getting this right are the ones treating AI inference as a distinct, metered cost line from day one rather than retrofitting usage caps after a margin crisis shows up in a board deck.

Related reading: see [How Do You Make AI Token Spend Visible by Team?](/en/posts/ai-finops-token-spend-visibility) for the tracking side of this problem, [AI Vendor Lock-In: Betting Your Startup on One Model](/en/posts/ai-vendor-lock-in-startups) for a related cost-and-dependency risk, [Do AI Wrapper Startups Have Any Moat?](/en/posts/do-ai-wrapper-startups-have-a-moat) for the defensibility question this raises, and [Bootstrap or VC? Making the Call in 2026](/en/posts/bootstrap-or-vc-2026) for how thinner margins change fundraising math. More in our [Business & Startups](/en/category/business) section.

## Frequently Asked Questions

### Why are AI-native SaaS margins lower than classic SaaS?
Because LLM inference is billed per token and scales with usage, unlike classic SaaS infrastructure cost, which grows much more slowly than revenue — so AI-native products average roughly 45-53% gross margin against 70-85% for traditional SaaS.

### Does falling AI model pricing fix the margin problem?
Not on its own. Per-token prices have fallen substantially, but when usage grows faster than price drops — which multiple analysts say is happening with AI features — total inference spend still rises even as the unit price falls.

### How are vertical SaaS companies protecting their margins on AI features?
Three common tactics: metering the AI feature separately with usage-based or credit pricing instead of folding it into a flat seat price, routing simple requests to cheaper models, and caching repeated context to avoid re-paying for the same tokens on every request.

### What gross margin should an AI-native SaaS company expect?
Recent reports put AI-native gross margins around 45-53% on average (CloudZero, ICONIQ), with the fastest-scaling AI startups averaging closer to 25% (Bessemer) — well below the 70-85% range typical of classic, inference-free SaaS.
