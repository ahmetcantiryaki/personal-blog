---
title: "What Is Anthropic's Enterprise Frontier Safeguards (EFS)?"
slug: "what-is-anthropic-enterprise-frontier-safeguards"
translationKey: "anthropic-enterprise-frontier-safeguards-efs"
locale: "en"
excerpt: "Short answer: EFS keeps Claude traffic in your own cloud account and detects misuse fully automatically, with no Anthropic human ever reviewing your data."
category: "ai"
tags: ["claude", "compliance", "privacy", "cloud"]
publishedAt: "2026-09-05"
seoTitle: "What Is Anthropic's Enterprise Frontier Safeguards (EFS)?"
seoDescription: "Short answer: EFS keeps Claude traffic in your own cloud account and detects misuse fully automatically, with no Anthropic human ever reviewing your data."
---

Short answer: Enterprise Frontier Safeguards (EFS), announced by Anthropic on September 1, 2026, keeps Claude interaction data in the customer's own AWS, Azure, or Google Cloud account instead of Anthropic's servers. Misuse detection runs entirely by automated analysis — no Anthropic employee ever reviews it. The system rolls out in phases starting fall 2026, and it's free.

## What problem does EFS actually fix?

Short answer: A mandatory 30-day retention rule that took effect in June 2026 removed the "don't store my data at all" option for customers on the Claude Fable and Mythos model families. For banks, hospitals, and government contractors, that meant three weeks of their traffic sitting on a third party's servers — a compliance non-starter that generated real customer pushback.

Anthropic had only signaled a fix at rumor level before this: an August 2026 Bloomberg report described an unannounced, still-unofficial plan. EFS is that plan made concrete, named, and technically specified. The difference matters: data no longer touches Anthropic's servers at all — it's written straight into the customer's own cloud storage.

## How does EFS actually work under the hood?

Short answer: Claude traffic is written into a bucket in the customer's own Amazon S3, Azure Blob Storage, or Google Cloud Storage account, under encryption keys the customer controls; Anthropic's automated system reads that data to look for cross-session and cross-account patterns, but never retains a copy on its own side.

Anthropic's reasoning: instantly analyzing and discarding each request in isolation can't catch sophisticated misuse — building offensive cyber capability, or a stolen API key being used quietly. A stolen key produces requests that look ordinary one at a time; the tell only shows up as a behavioral pattern across time. That's why detection needs a rolling window of data — but the window now lives inside the customer's cloud account, not Anthropic's.

When the system finds a serious signal, the alert goes straight to the customer's own security team — it never lands in an Anthropic review queue. Anthropic describes the process as fully automated, with zero human review on its end.

## Which products does EFS cover?

Short answer: Claude Code, Claude Enterprise, the Claude Platform, Claude on Amazon Bedrock, Google's Agent Platform, and Microsoft Foundry — the same model applies no matter which surface you use to reach Claude. That means developers get identical data controls whether they connect through the direct API or through a cloud provider's managed offering.

Anthropic says it built EFS together with more than 100 customers spanning financial services, healthcare, manufacturing, telecom, law, retail, and the public sector. Security leaders from the Analysis and Resilience Center for Systemic Risk (ARC) — whose members include the CISOs of Goldman Sachs, Morgan Stanley, Citi, Bank of America, and Wells Fargo — were part of that process.

| Feature | Old model (June 2026) | EFS (September 2026) |
|---|---|---|
| Where data lives | Anthropic's servers | Customer's own cloud account |
| Retention period | Mandatory 30 days | Customer-controlled |
| Review | Anthropic human review possible | Fully automated, zero human review |
| Coverage | Fable/Mythos models only | Claude Code, Enterprise, Platform, Bedrock, Foundry |
| Cost | — | Free (cloud storage cost falls on the customer) |

## What does this mean in practice for developers and companies?

Short answer: For a team running Claude Code or the Claude API, EFS removes the data-residency headache because logs never leave the company's own cloud boundary — but the team now owns the storage bill for keeping that data around. Anthropic doesn't charge for EFS itself, but the S3 or Blob Storage invoice lands on the customer.

The move lines up with [Claude's new shared memory model across Chat and Cowork](/en/posts/claude-memory-chat-and-cowork-explained): Anthropic is steadily handing enterprise customers more direct control over their own data. The expansion of the [Claude Compliance API to cover Cowork and Claude Code](/en/posts/claude-compliance-api-cowork-claude-code) fits the same enterprise-trust-building push.

My read: EFS is Anthropic's attempt to repair the trust it burned with June 2026's mandatory retention mandate. The technical design is genuinely elegant, but "phased rollout starting fall 2026" is vague enough that regulated teams still can't put a hard date on their compliance planning.

## What are EFS's limitations and criticisms?

Short answer: EFS moves data out of Anthropic's servers, but it doesn't eliminate retention entirely — the rolling-window analysis still needs data to sit somewhere for a period Anthropic hasn't specified in exact days; the difference is that "somewhere" is now the customer's own account. For a customer who wants true zero-data-retention, EFS is a real improvement, but it still isn't a full ZDR solution.

The second criticism is about transparency in the detection itself: Anthropic doesn't open-source the analysis logic, so the decision about what counts as a "serious misuse signal" still sits entirely with Anthropic. A security team ends up auditing a system that runs on their own data but whose internal logic they can't inspect. That creates real tension between the trust EFS builds by removing human review, and the unease that comes from a lack of algorithmic transparency.

## How should a team prepare for EFS?

Short answer: Decide now which cloud provider (AWS, Azure, or GCP) will host the bucket and who on your team owns bucket access and key management, so the decision isn't blocking you once EFS actually opens up. Getting your compliance team to map out how your existing 30-day retention process changes under EFS now saves real time once the phased rollout starts.

If you already have a Claude Enterprise or Bedrock contract, ask your account manager when EFS reaches your region — Anthropic hasn't published a firm sequencing by industry or geography yet.

## Frequently Asked Questions

### When does Enterprise Frontier Safeguards become available?

Anthropic announced EFS on September 1, 2026, and said the system rolls out to customers in phases starting fall 2026. No firm date or industry sequencing has been published yet.

### Does EFS cost extra?

No, Anthropic doesn't charge separately for Enterprise Frontier Safeguards. You do pay your own cloud provider for storing the data (S3, Blob Storage, or Cloud Storage), since it now lives in your account instead of Anthropic's.

### Which Claude products does EFS cover?

Claude Code, Claude Enterprise, the Claude Platform, Claude on Amazon Bedrock, Google's Agent Platform, and Microsoft Foundry — the same data model applies regardless of which surface you use to reach Claude.

### How is EFS different from the old 30-day mandatory retention rule?

Under the old rule, data sat on Anthropic's own servers for a mandatory 30 days with no opt-out for Fable and Mythos models. Under EFS, data never touches Anthropic's servers at all — it stays in the customer's own cloud account, and misuse review is fully automated.
