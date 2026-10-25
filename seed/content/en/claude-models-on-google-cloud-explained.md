---
title: "Claude on Google Cloud: Anthropic-Managed vs. Vertex AI"
slug: "claude-models-on-google-cloud-explained"
translationKey: "claude-models-google-cloud-anthropic-managed-2026"
locale: "en"
excerpt: "Anthropic launched Claude Models on Google Cloud on October 22, 2026: a first-party API billed via Google Cloud Marketplace and controlled by GCP IAM."
category: "ai"
tags: ["claude", "cloud", "ai-infrastructure", "pricing"]
publishedAt: "2026-10-25"
seoTitle: "Claude on Google Cloud: Anthropic-Managed vs. Vertex AI"
seoDescription: "Anthropic's Claude Models on Google Cloud launched Oct 22, 2026. Here's how the Anthropic-managed option differs from Vertex AI, and who should pick which."
---

Short answer: as of October 22, 2026, you can reach the Claude API two ways from a Google Cloud project — Vertex AI, where Google hosts and bills the models, or the new "Claude Models on Google Cloud (Anthropic managed)," where Anthropic runs the API while Google Cloud IAM and Marketplace handle access and billing. It's a second procurement path, not a Vertex AI replacement.

## What is Claude Models on Google Cloud, Anthropic-managed?

Short answer: it's the Claude API, run by Anthropic's own infrastructure, that you reach and pay for through your existing Google Cloud project instead of a separate Anthropic Console account. Google Cloud IAM roles decide who on your team can call it, and the charges land on your Google Cloud Marketplace bill next to your other GCP spend.

This matters for procurement, not for model behavior. The models themselves — Claude Opus 5.5, Sonnet 5.5, Haiku 5.5 — respond the same way regardless of which door you walked through. What changes is who operates the serving infrastructure and who you pay. On launch day, Anthropic also enabled Fast Mode for Claude Opus 5.5 on this new offering, matching the Fast Mode availability it already has on the direct Anthropic API and on Microsoft Foundry.

## How is this different from Claude on Vertex AI?

Short answer: Vertex AI is Google's own managed version of Claude — Google hosts the model weights, sets the SLA, and owns the integration with Vertex's MLOps tooling. The new Anthropic-managed option keeps Anthropic as the operator; Google Cloud only supplies identity management and the invoice.

| | Vertex AI (Google-managed) | Claude on Google Cloud (Anthropic-managed) | Claude Platform on AWS |
| --- | --- | --- | --- |
| Who operates the model endpoint | Google Cloud | Anthropic | Anthropic |
| Access control | Vertex AI IAM | Google Cloud IAM | AWS IAM |
| Billing | Google Cloud (Vertex SKU) | Google Cloud Marketplace | AWS Marketplace |
| Fast Mode for Opus 5.5 (Oct 2026) | Not confirmed at launch | Available at launch | Available |
| Native fit with existing tooling | Vertex pipelines, Model Garden | Claude Platform features (Managed Agents, etc.) | Claude Platform features |

The practical split: Vertex AI suits teams already standardized on Vertex's model-serving and evaluation tooling. The Anthropic-managed option suits teams that want Claude Platform's own feature set — things like Managed Agents, scheduled deployments, and session budgets — while still consolidating spend and access control inside their Google Cloud project instead of opening a second vendor relationship with Anthropic directly.

## Who should actually use the Anthropic-managed option?

Short answer: teams that already run most of their infrastructure on Google Cloud, need Claude Platform's own agent tooling rather than Vertex AI's MLOps layer, and want one marketplace invoice instead of a separate Anthropic contract. If your team only needs basic chat completions and already lives inside Vertex AI's evaluation and deployment pipelines, Vertex AI remains the simpler default.

A concrete signal: if you're already using Anthropic's Managed Agents — the hosted agent runtime with features like scheduled deployments and session-level budgets — and you want that feature set without leaving your Google Cloud billing account, the Anthropic-managed path is built for exactly that case. Vertex AI does not currently expose the same Managed Agents surface.

## How do you set it up?

Short answer: enable the product from Google Cloud Marketplace inside your GCP project, grant the relevant IAM role to the service accounts or users who need API access, and point your existing Claude SDK calls at the Google Cloud-routed endpoint instead of api.anthropic.com. No changes to your prompts, tool definitions, or model names are required.

```bash
# Enable the Anthropic-managed Claude product via Google Cloud Marketplace
gcloud services enable anthropic-claude.googleapis.com \
  --project=YOUR_PROJECT_ID

# Grant a service account access via Google Cloud IAM
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:claude-caller@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/anthropicclaude.user"
```

Once the IAM binding exists, the calling code is the same Claude API shape you already use — only the base URL and the auth token source change, since Google Cloud now issues the credential instead of an Anthropic API key.

## What does this mean for multi-cloud AI strategy?

Short answer: it gives teams a third way to buy Claude — direct from Anthropic, through Google as a Vertex AI partner model, or through Google purely as a billing and IAM layer — without forcing a choice between "Google-native" and "Anthropic-native" tooling. That flexibility matters most for regulated enterprises whose procurement rules require all vendor spend to flow through one cloud marketplace contract.

My take: this is a quieter release than a new model launch, but it is the kind of distribution move that compounds — every enterprise that can now buy Claude on paper it already has approved is friction Anthropic just removed from its own sales motion, and it mirrors the same play Anthropic already ran on AWS. If your organization has been blocked from adopting Claude purely because of a "no new vendor" procurement rule, this removes that specific blocker.

For more on where Claude's agent runtime is headed, see our piece on [Claude's Managed Agents, budgets, and data residency controls](/en/posts/claude-managed-agents-budgets-advisors-data-residency), and for the current model lineup, our [Claude Haiku 5.5 pricing and speed comparison](/en/posts/claude-haiku-5-5-price-speed-compared). We also cover [Fast Mode's move to general availability for Opus 5.5](/en/posts/claude-fast-mode-opus-5-5-ga), the same feature that shipped day-one on this new Google Cloud option. For the full picture of Anthropic's recent releases, browse our [AI category](/en/category/ai).

## Frequently Asked Questions

### Is Claude on Google Cloud the same as Vertex AI?

No. Vertex AI is Google's own managed deployment of Claude, hosted and billed by Google. "Claude Models on Google Cloud (Anthropic managed)," launched October 22, 2026, keeps Anthropic as the model operator and uses Google Cloud only for identity management and Marketplace billing.

### Do I need a separate Anthropic account to use Claude on Google Cloud?

No. The Anthropic-managed option is designed to run entirely inside your existing Google Cloud project. Access is granted through Google Cloud IAM roles, and usage is billed through Google Cloud Marketplace alongside your other GCP charges.

### Does Fast Mode work with Claude on Google Cloud?

Yes. Anthropic enabled Fast Mode for Claude Opus 5.5 on this offering at launch, on October 22, 2026, matching the availability Fast Mode already had on the direct Anthropic API and on Microsoft Foundry.

### Which should I use: Vertex AI or the Anthropic-managed option?

Use Vertex AI if your team is already standardized on Vertex's MLOps and evaluation tooling. Use the Anthropic-managed option if you want Claude Platform features like Managed Agents and session budgets while keeping billing and access control inside your Google Cloud project.

Sources:
- [Claude Models on Google Cloud, Anthropic-managed (platform.claude.com)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed)
- [Claude Platform release notes (platform.claude.com)](https://platform.claude.com/docs/en/release-notes/overview)
- [Anthropic's Claude models go GA on Vertex AI (cloud.google.com)](https://cloud.google.com/blog/products/ai-machine-learning/anthropics-claude-3-models-go-ga-on-vertex-ai)
