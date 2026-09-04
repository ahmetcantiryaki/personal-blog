---
title: "What Is GPT-6 Astra? OpenAI's First 'Critical'-Rated Model"
slug: "gpt-6-astra-explained"
translationKey: "gpt-6-astra-launch-critical-cyber"
locale: "en"
excerpt: "OpenAI launched GPT-6 Astra on September 3, 2026, its first model rated 'Critical' for cybersecurity. Here are the scores, pricing, and access limits."
category: "ai"
tags: ["openai", "chatgpt", "ai-agents", "web-security", "ai-reliability"]
publishedAt: "2026-09-04"
seoTitle: "GPT-6 Astra Explained: OpenAI's First 'Critical' Model"
seoDescription: "OpenAI's GPT-6 Astra, launched September 3, 2026, is its first model rated 'Critical' for cybersecurity. Scores, pricing, and access limits, explained."
---

Short answer: GPT-6 Astra is OpenAI's new flagship model, launched September 3, 2026, scoring 98% on FrontierMath Tier 4, 99.9% on ARC-AGI-3, and 100% on ExploitBench — results that made it the first model to hit the "Critical" (highest) cybersecurity tier in OpenAI's own Preparedness Framework.

That classification is why advanced cybersecurity capabilities are initially limited to a small group of alpha testers rather than shipping open to everyone. OpenAI president Greg Brockman called the model a "generational leap" and closed the press briefing with "welcome to the AGI era," saying he personally believes this might be the arrival of artificial general intelligence. Astra was built on OpenAI's largest training run to date, using more than 100,000 GPUs at its Stargate site in Texas.

## What Is GPT-6 Astra?

GPT-6 Astra is the model OpenAI claims is state-of-the-art on computer use, browsing, software engineering, cybersecurity, science, and professional work. OpenAI describes it as "the world's most intelligent and aligned model," and it can generate documents, spreadsheets, and presentations from templates and changing instructions rather than fixed one-shot prompts.

The launch is a direct continuation of the [cybersecurity-driven delay](/en/posts/why-openai-paused-astra-training) OpenAI announced in August 2026, which paused Astra's training for two weeks. Back then, OpenAI said it "could not rule out" Astra reaching the Critical threshold. The September 3 launch turned that uncertainty into an official classification.

## What Benchmark Records Did GPT-6 Astra Set?

Astra scored 98% on FrontierMath Tier 4, 99.9% on ARC-AGI-3, and 100% on ExploitBench — the highest results OpenAI has published for any model line to date. On an internal benchmark built from 20 high-severity V8 vulnerabilities disclosed between June and August 2026, Astra achieved a substantially higher arbitrary-code-execution rate than GPT-5.6 Sol, and discovered and used two previously unknown zero-day vulnerabilities on its own during the evaluation.

## Why Is GPT-6 Astra OpenAI's First "Critical"-Rated Model?

OpenAI's Preparedness Framework is a tiered risk system defining the safeguards a model must meet before release, and "Critical" is its highest cybersecurity tier. A model crosses it if, without human help, it can autonomously discover zero-day vulnerabilities, move laterally across a network, escalate privileges and reach production systems, or design and execute a full novel cyberattack chain from a single high-level goal.

OpenAI says it delayed parts of development and strengthened safeguards as a direct result of this classification. Access to advanced cybersecurity workflows is initially restricted to a small alpha-testing group, with broader access for defensive use expanding later through "Daybreak Blue." Astra-based model checkpoints now run under encryption and enhanced access controls, and universal misalignment monitoring applies to all tool-using inference.

| Metric | GPT-6 Astra | Prior state (GPT-5.6 Sol) |
|---|---|---|
| FrontierMath Tier 4 | 98% | Lower (OpenAI didn't publish an exact figure) |
| ARC-AGI-3 | 99.9% | Lower |
| ExploitBench | 100% | Lower |
| Preparedness cyber tier | Critical (first time) | High |
| V8 zero-day discovery | 2 new zero-days found during eval | Substantially lower success rate |

## How Much Does GPT-6 Astra Cost?

GPT-6 Astra is priced at $10 per million input tokens and $50 per million output tokens at the standard tier, with cached input at $1 per million. That's 2.5x the price of GPT-5.6 Sol and matches Anthropic's Claude Fable 5.1 pricing exactly. Batch and Flex modes run at half those rates, Fast mode doubles them, prompts over 272K input tokens get billed at 2x input/1.5x output for the whole request, and regional processing endpoints carry a 10% uplift.

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
    input="Review the diff in pull request #482 and flag anything security-relevant."
)

print(response.output_text)
```

This example assumes standard pricing. If you don't have access to the advanced cybersecurity tooling, the API call still works normally — a portion of Astra's full capability set simply stays gated outside the alpha program.

## What Do Astra's Computer-Use and Agentic Capabilities Actually Change?

Astra can view a screen and generate mouse and keyboard actions to complete tasks inside real applications, which OpenAI calls state-of-the-art for computer use, browsing, and software engineering. In practice, that means the model can fill out a form, complete a spreadsheet, or finish a multi-step research task by operating an interface directly, rather than only responding to text sent to an API.

That's not just a smarter model bolted onto existing agent stacks — it's a wider action surface. If you already run an agent architecture with code execution or browser access, the capability ceiling Astra raises is a good reason to re-check your permission scopes and approval steps rather than assume last quarter's guardrails still cover it.

## Who Can Access GPT-6 Astra, and When?

Astra first rolled out to a limited set of organizations in OpenAI's application-based cybersecurity program; broader access for ChatGPT Plus, Pro, Business, and Enterprise users, plus the OpenAI API and AWS, is expected over the following days. That's a meaningfully more gated rollout than the day-one-for-everyone pattern OpenAI used for [GPT-5.6's GA launch with Codex](/en/posts/gpt-5-6-general-availability-codex-desktop) in August 2026 — here, OpenAI is deliberately tiering access to capability by safety classification.

## Is This Actually AGI?

My take: officially crossing the "Critical" cyber threshold is real, measurable evidence of a capability jump — but it's a far narrower claim than Brockman's "AGI era" framing suggests. A model can outperform humans in one narrow domain (offensive cybersecurity) without possessing the broad, domain-independent reasoning that a general-intelligence definition actually requires; one doesn't prove the other.

The practical takeaway for developers is this: if you run any agent system with code execution or network access, read Astra's own V8 zero-day discovery performance not as an abstract achievement but as a reason to revisit your production [guardrails checklist](/en/posts/agentjacking-ai-agent-attack) — as model capability rises, sandbox isolation and credential scoping stop being optional.

For how competing labs are responding this week, including Anthropic's Claude Fable 5.1, see Woyable's [AI category](/en/category/ai).

## Frequently Asked Questions

### When did GPT-6 Astra launch?

OpenAI announced GPT-6 Astra on September 3, 2026, and made it available the same day to a limited set of organizations in its application-based cybersecurity program. Broader access for ChatGPT Plus, Pro, Business, and Enterprise users, plus the API, is rolling out over the following days.

### What does GPT-6 Astra's "Critical" cybersecurity rating mean?

In OpenAI's Preparedness Framework, "Critical" is the highest cyber-risk tier, reached when a model can autonomously find and exploit zero-day vulnerabilities, move laterally across a network and escalate privileges, or design a full attack chain from one high-level goal, without human guidance. Astra is the first OpenAI model to officially reach it.

### How much does GPT-6 Astra cost?

Standard pricing is $10 per million input tokens and $50 per million output tokens, with cached input at $1 per million — 2.5x GPT-5.6 Sol's price and equal to Anthropic's Claude Fable 5.1. Batch and Flex modes cost half as much, and Fast mode costs double.

### Is GPT-6 Astra the same model OpenAI paused training on in August?

Yes. OpenAI disclosed on August 7, 2026, that Astra might reach the Critical threshold, then paused some frontier RL training on August 18. The September 3 launch turns that earlier uncertainty into an official classification and general rollout.

Sources: [OpenAI's GPT-6 Astra announcement](https://openai.com/index/gpt-6-astra/), [GPT-6 Astra safety overview](https://openai.com/index/safety-overview-gpt-6-astra/), [Axios on Brockman and AGI](https://www.axios.com/2026/09/03/openai-astra-gpt-6-agi-brockman), [The Hill on the Critical threshold](https://thehill.com/policy/technology/6070203-openai-rolls-out-gpt-6-astra/).
