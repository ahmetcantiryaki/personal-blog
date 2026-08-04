---
title: "EU AI Act Enforcement Is Live: What Changes"
slug: "eu-ai-act-enforcement-live-2026"
translationKey: "eu-ai-act-enforcement-live-2026"
locale: "en"
excerpt: "The EU AI Office gained real power to enforce GPAI rules on August 2, 2026. Here's what changes for developers building on Claude, GPT, or Gemini."
category: "ai"
tags: ["claude", "openai", "gemini", "ai-regulation"]
publishedAt: "2026-08-04"
seoTitle: "EU AI Act Enforcement Is Live: What Changes in 2026"
seoDescription: "The EU AI Office gained real power to enforce GPAI rules on August 2, 2026. Here's what changes for developers building on Claude, GPT, or Gemini."
---

What changed on August 2, 2026 was not the rules but the teeth: the European Commission's AI Office became formally entitled, under [Article 101 of the EU AI Act](https://artificialintelligenceact.eu/article/101/), to investigate and fine providers of general-purpose AI (GPAI) models. If you build on Claude, GPT, or Gemini and have users in the EU, here's what that actually means for you.

## What Actually Changed: Obligations vs Enforcement Power

Two dates get conflated here. The core GPAI provider obligations — technical documentation, training-content summaries, copyright compliance — have applied since August 2, 2025. What changed on August 2, 2026 is that the Commission can now actively enforce them. The AI Office can:

- Request a model's technical documentation
- Request access to a model for evaluation
- Require risk-mitigation measures
- In extreme cases, restrict a model's access to the EU market, or force a provider to withdraw it entirely

The fines are real: up to 3% of total worldwide annual turnover or €15 million, whichever is higher. For SMEs and startups, that formula flips — whichever is lower applies instead. That's a deliberate carve-out: heavy deterrence for large providers, proportional exposure for smaller players.

Still, this isn't an instant fine wave. Per the [Commission's own announcement](https://digital-strategy.ec.europa.eu/en/news/commission-starts-enforcing-ai-act-rules-and-new-transparency-requirements-2-august), the preferred first step is "technical compliance dialogues" — informal clarification with the provider before any formal action. The legal teeth are real now, but they're not aimed at an immediate crackdown.

## The Systemic-Risk Tier: Who's In It

The Act carves out a separate category for GPAI models trained with more than 10^25 FLOPs of cumulative compute, labeling them "systemic risk" models. That threshold brings extra obligations: model evaluations, adversarial testing, serious-incident reporting, and cybersecurity protections.

Today, that tier covers roughly 5–15 companies worldwide — essentially the frontier-lab bracket. Anthropic, OpenAI, and Google DeepMind all qualify, meaning the frontier versions of Claude, GPT, and Gemini all carry systemic-risk obligations. We compared where these three models stand today in [Claude Sonnet 5 vs GPT-5.6 vs Gemini 3.5](/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5); now that same trio sits at the EU's heaviest oversight layer.

Providers can demonstrate compliance through the voluntary [GPAI Code of Practice](https://artificialintelligenceact.eu/code-of-practice-overview/), finalized on July 10, 2025. Anthropic, OpenAI, and Google have all engaged with it in some form. The Commission maintains a [full breakdown of GPAI obligations](https://digital-strategy.ec.europa.eu/en/factpages/general-purpose-ai-obligations-under-ai-act) if you want the underlying detail.

## The Distinction That Actually Matters: Provider vs Deployer

This is the practical spine of the whole story. The heavy GPAI "provider" obligations described above — technical documentation, training-content summaries, systemic-risk testing — fall on Anthropic, OpenAI, and Google themselves. A startup that merely calls the Claude API is not the target of those obligations.

But if you deploy an AI-powered product to EU users, you carry your own lighter — and real — "deployer" duty. Article 50 of the Act requires you to clearly disclose when a user is interacting with a chatbot, and to label AI-generated content (text, image, or audio) accordingly.

| Obligation | Provider (Anthropic, OpenAI, Google) | Deployer (your product) |
| --- | --- | --- |
| Technical documentation (Model Documentation Form) | Required | Not applicable |
| Training-content summary, copyright compliance | Required | Not applicable |
| Systemic-risk testing (>10^25 FLOP models) | Required (frontier models only) | Not applicable |
| Disclosing "this is AI" to users (Article 50) | Indirect (provides usage instructions) | Required |
| Labeling AI-generated content | Indirect | Required |
| Fine cap | 3% of turnover or €15M, whichever is higher | 3% of turnover or €15M, whichever is lower (for SMEs) |

So the headline isn't "startups using Claude get fined under EU law." The real story is that the model provider carries new compliance weight, and you carry a smaller — but real — disclosure duty.

## A Checklist for Developers Building on Claude, GPT, or Gemini

If you run a product with EU users, here's what to actually check:

1. Does your interface clearly disclose that users are talking to a chatbot or AI assistant?
2. Do you label AI-generated text, images, or audio (including deepfakes) in a machine-readable way?
3. Have you reviewed your model provider's usage instructions and model card — the fastest way to understand your own deployer obligations?
4. Do you have a guardrail layer auditing model outputs in production? Our [LLM guardrails checklist for production](/en/posts/llm-guardrails-production-checklist) is a practical starting point.
5. Is your privacy policy current on user data and model selection?

A minimal disclosure notice might look like this:

```text
This conversation is handled by an AI assistant.
Responses are generated by Claude (Anthropic) and may contain errors.
Type "agent" to reach a human representative.
```

That's a baseline step in the spirit of Article 50, not legal advice — but it's a concrete place to start.

## The US vs EU Contrast

The timing here is telling. The same week the EU's binding enforcement power went live, the White House held an August 3, 2026 meeting where OpenAI, Anthropic, and Google were invited to discuss a voluntary US AI-safety testing framework. The contrast is stark: the EU has binding law with real fines, while the US is still proposing a voluntary framework.

That means the same three companies are now navigating two very different compliance regimes on two continents — one mandatory and penalty-backed, the other voluntary and reputation-based. For more on the broader push toward industry AI-safety coordination, see our piece on the [Open Secure AI Alliance](/en/posts/open-secure-ai-alliance-explained).

## Our Take

The EU's provider-deployer split is, honestly, sound regulatory design: it puts the heaviest compliance burden on the company that trained and hosts the model, rather than crushing every small app that calls that model's API with disproportionate overhead. That said, it's a dangerous oversimplification for developers to assume "the EU AI Act doesn't apply to me, I just call an API." Article 50's disclosure duty may look small, but enforcement is now real, and if EU growth is part of your roadmap, this belongs on it today, not later.

You can keep choosing a model based on performance and cost rather than EU compliance — the heavy lifting on the provider side already sits with Anthropic, OpenAI, and Google. But skipping the transparency layer in your own product is the easiest way to turn a small engineering task into a future compliance headache.

For more coverage in this space, follow our [AI category](/en/category/ai). If you're a small business layering Gemini into your daily workflow, our piece on [Gemini and Google Workspace for small business](/en/posts/gemini-google-workspace-small-business) is a useful practical companion.

## Frequently Asked Questions

### Can a startup using the Claude, GPT, or Gemini API get fined directly?

The heavy GPAI provider obligations — technical documentation, training-content summaries, systemic-risk testing — belong to Anthropic, OpenAI, and Google. But any company deploying AI to EU users has its own deployer obligations under Article 50, and violating those can also trigger enforcement.

### What changes for models placed on the market before August 2, 2026?

GPAI models placed on the EU market before August 2, 2025 have until August 2, 2027 to reach full compliance. Models placed on the market on or after August 2, 2025 must comply now, with no grace period.

### What does the "systemic risk" threshold actually mean?

Models trained with more than 10^25 FLOPs of cumulative compute fall into this tier and face extra obligations: model evaluations, adversarial testing, and serious-incident reporting. Today, that group is limited to roughly 5–15 companies worldwide, and it includes the frontier versions of Claude, GPT, and Gemini.

### Does the EU AI Office jump straight to fines?

No. Per the Commission's own guidance, the preferred first step is a "technical compliance dialogue" — informal clarification with the provider before formal enforcement. Formal investigations and fines follow only if that dialogue doesn't resolve the issue.
