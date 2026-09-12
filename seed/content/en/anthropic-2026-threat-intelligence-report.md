---
title: "What's in Anthropic's 2026 Threat Report?"
slug: "anthropic-2026-threat-intelligence-report"
translationKey: "anthropic-threat-intelligence-report-2026"
locale: "en"
excerpt: "Anthropic's September 2026 threat report details espionage, blocked bioweapons research, and Chinese labs running distillation attacks on Claude."
category: "ai"
tags: ["claude", "web-security", "ai-reliability", "compliance"]
publishedAt: "2026-09-12"
seoTitle: "What's in Anthropic's 2026 Threat Report?"
seoDescription: "Anthropic's September 2026 threat report: Russian espionage, blocked bioweapons research, and seven Chinese labs distilling Claude at scale."
---

Short answer: Anthropic published a report on September 10, 2026 documenting attempted misuse of Claude across seven harm categories between December 2025 and August 2026, all of which it says it disrupted. The largest single case involved accounts tied to Alibaba generating more than 151 million Claude interactions over three months to distill the model's outputs into their own training pipeline.

## What does Anthropic's September 2026 threat report actually cover?

Short answer: the report documents disrupted misuse across seven categories — cyber operations, influence operations, surveillance, scams and fraud, biological misuse, conventional weapons development, and distillation — spanning December 2025 through August 2026. Anthropic calls it its most detailed, case-based threat intelligence report to date.

What sets it apart from prior disclosures is specificity: named account counts, interaction volumes, and threat-actor code names (like GTG-16005) instead of vague summaries. That level of detail signals Anthropic's internal threat-hunting process can now trace industrial-scale campaigns, not just isolated incidents.

## How did seven Chinese labs distill Claude?

Short answer: Alibaba, Moonshot AI, DeepSeek, and Zhipu (Z.ai), among seven labs named or flagged, fed Claude's outputs into their own training pipelines without authorization — what Anthropic calls "illicit distillation." The Alibaba-linked campaign (GTG-16005) generated more than 151 million Claude interactions from May through July 2026 across more than 3,500 accounts, with daily volume cresting near 3 million requests. Anthropic calls it the largest distillation campaign it has ever documented.

Moonshot AI (GTG-16002) silently routed a portion of its Kimi chatbot's user requests to Claude without telling customers, then displayed Claude's answers as if they were Kimi's own — relaying roughly 300,000 requests through 5,380 fraudulent accounts over a 10-day window. DeepSeek (GTG-16001) used a similar relay technique, with more than 12.1 million exchanges observed over 14 days in July 2026. Zhipu (GTG-16006) ran a chain-of-thought extraction pipeline, replaying more than 3.4 million exchanges over 17 days in June and July to capture Claude's reasoning traces.

| Lab | Code name | Method | Scale |
|---|---|---|---|
| Alibaba | GTG-16005 | Direct API distillation | 151M+ interactions over 3 months, 3,500+ accounts |
| Moonshot AI | GTG-16002 | Silent request relay | ~300K requests over 10 days, 5,380 fake accounts |
| DeepSeek | GTG-16001 | Relay + chain-of-thought extraction | 12.1M+ exchanges over 14 days |
| Zhipu (Z.ai) | GTG-16006 | Reasoning-trace extraction | 3.4M+ exchanges over 17 days |

All four campaigns targeted the same thing: Claude's most valuable capabilities — agentic reasoning, software engineering, and logical inference — not raw text generation.

## What did the report find on espionage and bioweapons cases?

Short answer: a Russian state-linked espionage group breached 24 of 27 targeted institutions (Ukrainian ministries, defense bodies, and drone supply-chain manufacturers) over 130 days, while a separate operation targeted 30 AI companies in four days to steal pre-release models and production API keys. The report also disclosed that Anthropic blocked five separate attempts by scientists to use Claude for research that could support bioweapons development, including one gain-of-function study intended for a military research institute.

Anthropic also flagged a threshold shift here: the company says it can no longer assume its newest Claude models fall below the level of meaningful bioweapons uplift — the first time a major AI company has said this publicly.

My honest take: the real story isn't any single case, it's the speed. A Russian espionage group automating malware rewrites against detection signatures in a loop, or a lab pulling 151 million requests in three months, are patterns that move too fast for human review to catch alone — which means the defensive side needs comparable automation, not just better policy.

## How is this different from the earlier Claude security incidents?

Short answer: the earlier stories (July's three incidents and the fourth one disclosed in September) were about Claude accidentally reaching real systems during Anthropic's own safety evaluations because of test-isolation bugs; this report is about external bad actors deliberately abusing Claude through the API. If you read our piece on [Claude's fourth unauthorized access incident](/en/posts/claude-fourth-unauthorized-access-incident), that story was a harness-isolation failure; this one is about real-world misuse detection.

As of September 2026, Anthropic is working both fronts at once: having METR audit its internal evaluation process while separately scaling up the threat-intelligence team that catches external abuse.

## What should teams building on the Claude API take from this?

Short answer: monitor your own API key usage and request patterns, because every distillation campaign here started as traffic that looked legitimate until someone added up the volume — none of them were a single obvious leak. The Moonshot and DeepSeek cases each used thousands of fake accounts, a distributed pattern that's hard to spot from any single organization's usage dashboard.

Practical takeaways as of September 2026:

- **Enforce API key rotation and anomalous-volume alerting.** Alibaba's campaign approached 3 million requests a day and still went unnoticed for months.
- **Question the provenance of third-party model output before shipping it downstream.** Moonshot's customers didn't realize the answers labeled as coming from Kimi were actually Claude's.

For more on how AI security incidents play out in practice, see our [AI category page](/en/category/ai); if you're evaluating the broader attack surface around autonomous coding and security agents, [agentjacking](/en/posts/agentjacking-ai-agent-attack) is a related read worth pairing with this case.

## Frequently Asked Questions

### What time period does Anthropic's September 2026 threat report cover?

The report covers misuse disrupted between December 2025 and August 2026 and was published on September 10, 2026. It documents cases across seven harm categories — cyber operations, influence operations, surveillance, scams and fraud, biological misuse, weapons development, and distillation — and states that all disclosed cases were disrupted.

### Which Chinese AI labs were accused of distilling Claude?

Anthropic directly named Alibaba, Moonshot AI, DeepSeek, Xiaomi, and Zhipu (Z.ai); intelligence advisories additionally flagged MiniMax and StepFun. The Alibaba-linked campaign was the largest documented, generating more than 151 million interactions over three months.

### Can Claude now help develop bioweapons?

Anthropic disclosed it can no longer assume its newest Claude models fall below the threshold for meaningful bioweapons assistance — the first time a major AI company has said this publicly. The report states five separate attempts by scientists to use Claude for bioweapons-related research were identified and blocked.

### Is this the same as Claude's July 2026 unauthorized access incidents?

No. The July incidents and the fourth case disclosed in September involved Claude accidentally reaching real systems during Anthropic's own safety evaluations due to test-isolation configuration errors. The September threat intelligence report covers external bad actors deliberately misusing Claude through the API for espionage, distillation, and other harms.
