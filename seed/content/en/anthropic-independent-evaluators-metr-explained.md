---
title: "What Is Anthropic's Independent AI Evaluator Program?"
slug: "anthropic-independent-evaluators-metr-explained"
translationKey: "anthropic-independent-evaluators-metr-2026"
locale: "en"
excerpt: "Anthropic now gives METR 'employee-like' access to audit its AI models and publish findings it cannot veto, part of a three-tier external evaluation plan."
category: "ai"
tags: ["claude", "evals", "ai-regulation", "compliance"]
publishedAt: "2026-10-16"
seoTitle: "Anthropic's Independent AI Evaluator Program, Explained"
seoDescription: "Anthropic now gives METR 'employee-like' access to audit its AI models and publish findings it cannot veto, part of a three-tier external evaluation plan."
---

Short answer: on October 15, 2026, Anthropic started giving a team from METR, an AI safety nonprofit, "employee-like" access to evaluate its models — company hardware, office space, and internal tools — with the right to publish findings Anthropic cannot veto, only request narrow redactions on. It is one of three access tiers Anthropic plans to roll out to multiple evaluators.

## What did Anthropic actually announce?

Anthropic announced that six METR employees now have ongoing, embedded access to the company roughly comparable to its own internal risk-assessment teams, rather than the one-off, scheduled audits that are standard in the industry today. METR can publish what it finds about risk levels, incidents, or practices without Anthropic's sign-off, though Anthropic can still require redaction of narrow categories: customer data, privileged legal information, and model architecture details.

This follows an earlier year of scheduled METR reviews of Anthropic's own Risk Reports, and it builds on commitments Anthropic made when it signed the White House Accord on Super Intelligence, which included pledges to work with independent external auditors.

## How does the three-tier access system work?

Anthropic is structuring external evaluation into three tiers, each trading off scope of access against publication freedom. Tier 1 covers narrowly scoped investigations where Anthropic must approve publication before it goes out. Tier 2 grants broader access and lets evaluators publish without approval, though Anthropic can still demand redactions. Tier 3 — the METR arrangement — gives employee-like access and the same publication rights as Tier 2, but on an ongoing basis instead of a single engagement.

| Tier | Access scope | Publication rights | Example partner |
|---|---|---|---|
| 1 | Narrow, scoped investigation | Requires Anthropic approval | Early-stage partners |
| 2 | Broader access to information | Can publish without approval; redactions possible | SecureBio (biosecurity review) |
| 3 | Employee-like, ongoing access | Same as Tier 2, continuous engagement | METR |

## Who else is involved besides METR?

SecureBio is reviewing the chemical and biological weapons chapter of Anthropic's August 2026 Risk Report, following an earlier pilot review of the prior report. Accenture and Faculty are negotiating a broader partnership covering red-teaming, alignment assessments, and safeguard testing — and Anthropic says it is funding Accenture's work directly, while framing pooled or government funding as the long-term goal for the ecosystem. Anthropic is also in early talks with other organizations, including Hugging Face.

## Why is METR's independence being questioned?

Critics, including entrepreneur and commentator David Sacks, have pointed to financial and personal ties between METR and Anthropic's investor network as a reason to doubt METR's independence. METR has acknowledged working closely with the labs it evaluates — including receiving API access and tokens needed to run evaluations — but argues that operational access is distinct from accepting payment from the company it is reviewing. Anthropic's own announcement is candid about the tension: the industry has no agreed standard yet for what information embedded evaluators should see or how they should report it.

That ambiguity is the real takeaway here: "independent evaluator" currently means whatever arrangement each lab and nonprofit negotiate, not a credential with fixed rules behind it.

## What does Anthropic say an evaluator needs to be credible?

Anthropic's post lists four requirements: domain expertise, independence (no equity stake or financial and operational dependence on the company being evaluated), sufficient access to do the work, and freedom to publish. Anthropic describes its own participation as voluntary and says it believes every frontier AI lab should embed evaluators the same way — a position that functions as both a safety commitment and a pre-emptive argument against stricter mandatory audit regulation.

```text
Anthropic's evaluator access tiers (Oct 2026):
Tier 1 -> scoped investigation, publish needs Anthropic approval
Tier 2 -> broader access, publish without approval, redactions allowed
Tier 3 -> employee-like access, ongoing (METR, 6 staff as of Oct 15, 2026)
```

## Should developers and researchers care about this?

If you build on Claude or evaluate AI systems for a living, this is worth tracking because it sets a template other labs will be measured against: expect OpenAI and Google DeepMind to face pressure to match or explain why they haven't. If you don't work directly in AI safety, the more practical signal is reputational — Anthropic is betting that visible, ongoing third-party scrutiny is a selling point for enterprise and government customers who need to show their AI vendor is independently checked, not just self-certified.

## What's worth being skeptical about here?

Anthropic chose and is paying some of its own evaluators, including Accenture, and METR's funding and staffing relationships with Anthropic's broader investor network remain disputed by outside critics. There's also no public standard yet — from Anthropic or any industry body — for exactly what an embedded evaluator can see or must disclose, which means the strength of this program depends entirely on how it's run in practice over the next year, not on the announcement itself.

## Frequently Asked Questions

### What access did Anthropic give METR in October 2026?

Starting October 15, 2026, Anthropic gave six METR employees "employee-like" access — company hardware, office space, and internal tools comparable to Anthropic's own risk teams — plus the right to publish findings on risk levels, incidents, or practices without needing Anthropic's approval first.

### Can Anthropic block what METR publishes?

No, not through a general veto. Anthropic can only require redaction of three narrow categories: customer data, privileged legal information, and model architecture details. Everything else METR finds, it can publish on its own schedule.

### Is METR really independent from Anthropic?

That's disputed. METR has financial and access relationships with Anthropic, including tokens and API access needed to run evaluations, and critics such as David Sacks have cited ties to Anthropic's investor network as a conflict-of-interest concern. METR maintains that operational access differs from being paid by the company it evaluates.

### Which other organizations are evaluating Anthropic's models?

SecureBio reviews the chemical and biological weapons chapter of Anthropic's Risk Reports. Accenture and Faculty are negotiating a broader red-teaming and alignment-assessment partnership, and Anthropic is in early discussions with additional organizations, including Hugging Face.

### Will other AI labs adopt the same employee-like evaluator model?

Anthropic has publicly said it believes every frontier AI lab should embed evaluators this way, but no other major lab — OpenAI, Google DeepMind, or Meta — has announced an equivalent arrangement as of October 2026. Whether the model spreads likely depends on how publicly METR's findings land over the next year, and whether regulators treat voluntary embedded evaluation as a credible substitute for mandatory audits.

For related coverage, see [why Anthropic is changing its data retention policy](/en/posts/why-anthropic-is-changing-data-retention-policy), [Anthropic's Enterprise Frontier Safeguards](/en/posts/what-is-anthropic-enterprise-frontier-safeguards), and [why AI alignment evals keep getting bypassed](/en/posts/why-ai-alignment-evals-get-bypassed). Browse more in our [AI category](/en/category/ai).

Sources: [Anthropic's "An update on independent evaluators"](https://www.anthropic.com/news/an-update-on-independent-evaluators), [The Standard on Anthropic and Accenture](https://www.thestandard.com.hk/world/article/343245/Anthropic-picks-Accenture-for-in-house-AI-safety-evaluation), and [officechai.com on METR's independence being questioned](https://officechai.com/ai/metrs-independence-questioned-after-x-user-highlights-financial-links-between-company-and-anthropic/).
