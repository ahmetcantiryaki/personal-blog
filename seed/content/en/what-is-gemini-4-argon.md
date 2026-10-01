---
title: "What Is Gemini 4 Argon? Google's New Frontier Model"
slug: "what-is-gemini-4-argon"
translationKey: "gemini-4-argon-launch-2026"
locale: "en"
excerpt: "Gemini 4 Argon is Google DeepMind's frontier model announced September 30, 2026. It tops GPT-6 Astra in 12 of 18 benchmarks and costs $2-$10 per million tokens."
category: "ai"
tags: [gemini, llm, ai-tools, machine-learning]
publishedAt: "2026-10-01"
seoTitle: "What Is Gemini 4 Argon? Pricing and Benchmarks Explained"
seoDescription: "Gemini 4 Argon is Google's frontier model: a 1M output token limit, $2/M input tokens, $10 output, and 12 benchmark wins over GPT-6 Astra as of Sept 2026."
---

Short answer: Gemini 4 Argon is Google DeepMind's new frontier model, announced September 30, 2026. In Google's own published results, it beats GPT-6 Astra and Claude Opus 5.5 on 12 of 18 benchmarks, while independent evaluator Artificial Analysis rates it roughly level with Astra and about 5 points behind Opus 5.5. It costs $2 per million input tokens and $10 per million output tokens, in a limited initial rollout.

## What is Gemini 4 Argon?

Gemini 4 Argon is Google DeepMind's next-generation model, built around sustained, professional-grade workflows: software engineering, enterprise knowledge work like legal and financial analysis, and defensive cybersecurity. Google announced it on September 30, 2026, and initially showed it to a small group of cybersecurity partners before a wider rollout.

Google describes Argon as its "next era of frontier intelligence" and highlights one technical spec above the rest: a 1 million output token limit, a roughly 15x jump from the prior generation's 64,000-token output cap. That means a model can complete one long task — a large code migration, a lengthy legal brief — in a single pass, without being cut off mid-task.

## How much does Gemini 4 Argon cost?

Google is rolling out Argon in stages, and the introductory pricing is $2 per million input tokens and $10 per million output tokens, with cached input discounted 95%. That pricing is not permanent — Google has said standard rates will later rise to $4 and $20.

| Model | Input ($/M tokens) | Output ($/M tokens) | Cached input |
|---|---|---|---|
| Gemini 4 Argon (intro) | $2 | $10 | 95% off |
| Gemini 4 Argon (standard, later) | $4 | $20 | — |
| GPT-6 Astra (standard) | $10 | $50 | — |
| Claude Sonnet 5.5 | $2 | $10 | $0.20 |

At introductory pricing, Argon sits at the same input/output rate as Claude Sonnet 5.5 and roughly a fifth of GPT-6 Astra's standard price. That comparison is misleading on its own, though — Astra and Argon land in the same capability tier in Google's own tests, while Sonnet 5.5 targets a lighter class of everyday tasks.

## Does Gemini 4 Argon actually beat GPT-6 Astra and Claude Opus 5.5?

Largely yes, according to Google's own benchmark table: Argon wins outright on 12 of 18 published tests and ties on one more. GPT-6 Astra wins 3 and ties once; Claude Opus 5.5 wins 2.

| Benchmark | Gemini 4 Argon | GPT-6 Astra | Claude Opus 5.5 |
|---|---|---|---|
| DeepSWE v1.1 (coding) | 77.9% | 74.1% | 74.2% |
| Harvey Legal Agent (legal) | 19.6% | 5.4% | 3.8% |
| LABBench 2 (science) | 88.8% | 85.4% | 73.1% |
| GraphWalks 256K-1M (long context) | 84.2% | 71.8% | 66.8% |
| LVBench (long video) | 91.7% | 87.5% | 83.7% |
| Terminal-Bench 4.0 | 57.4% | 58.2% | 66.4% |

The Terminal-Bench 4.0 row matters: Argon does not win everywhere. On terminal-based agent tasks, Claude Opus 5.5 is still clearly ahead at 66.4% versus Argon's 57.4%. On AutomationBench, Zapier's benchmark for end-to-end business workflows, Argon ranks first at 51.3%.

## How big is Gemini 4 Argon's context window?

Input context holds at 1 million tokens, but the real shift is on the output side: Argon can generate up to 1 million tokens in a single response, roughly 15x the prior generation's 64,000-token output cap. Google has not published a separate commercial input limit in the launch materials, and Argon's strong GraphWalks 256K-1M score suggests it holds up well across that full long-context range.

## Why does Gemini 4 Argon lead with a cybersecurity focus?

Google didn't show Argon to the general public first — it went to select cybersecurity partners, and that order isn't an accident. The model is positioned around defensive cybersecurity workloads specifically: vulnerability scanning, log analysis during incident response, and finding weaknesses in large codebases. Its strong GraphWalks 256K-1M score (84.2%) supports exactly the kind of long-context consistency that work needs — a security team investigating an incident has to hold thousands of log lines, a commit history, and configuration files in context at once.

That mirrors a pattern OpenAI used when it classified GPT-6 Astra at a "critical" risk tier and shipped it cautiously. Google appears to be running a similar play with Argon, testing the misuse risk of its advanced cybersecurity capabilities with select partners before opening it to a broader audience — though Google hasn't yet published a detailed safety report explaining the restriction.

The practical takeaway for enterprise teams: if you're planning to evaluate Argon, track when API access opens more broadly, then pilot it on the long-context, multistep analysis tasks it's actually built for — not everyday chat tasks. The 19.6% score on the Harvey Legal Agent benchmark backs up the same pattern — Argon's real edge doesn't show up in short answers, it shows up in long, complex professional workflows.

## How do you access Gemini 4 Argon?

As of September 2026, access is limited. Google first showed the model to select cybersecurity partners; a wider rollout is coming "soon," starting with Google AI Ultra subscribers and paid API customers. A public, stable model ID has not been published yet.

```python
from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemini-4-argon",
    contents="Find and fix the security vulnerability in this Terraform module.",
)

print(response.text)
```

This snippet shows the expected API shape once general access opens; the exact model ID may change once Google publishes it officially. Teams building agentic workflows around a model like this may find our guide to [wiring AI agents into your CI/CD safely](/en/posts/ai-agents-in-cicd-safely) useful for the security side of that rollout.

## Why be skeptical of Google's own benchmark table?

Our read is that the real story sits behind that 12/18 headline. Independent evaluator Artificial Analysis scored Argon at 52.6 points on its Intelligence Index at the "High" setting — essentially level with GPT-6 Astra's 52.7, and roughly 5 points behind Claude Opus 5.5's 57.6. The vendor-selected 18-test table and the independent general-intelligence index are not telling quite the same story.

That doesn't make Argon a weak model — its DeepSWE and long-context numbers reflect a real, measurable edge. But reading "wins 12 of 18" and assuming Argon is simply the strongest model across the board would be a mistake; which model wins for you depends on which benchmark actually resembles your workload. For more on comparing subscriptions and pricing across the big three, see our [Which AI Subscription in 2026](/en/posts/which-ai-subscription-2026) breakdown; for the cheaper end of the Gemini family, see [Building With Gemini 3.6 Flash](/en/posts/building-with-gemini-3-6-flash). For GPT-6 Astra's architecture and cyber-risk profile, see [What Is GPT-6 Astra?](/en/posts/what-is-gpt-6-astra), and for Claude Opus 5.5's full pricing and benchmark table, see [What Is Claude Opus 5.5?](/en/posts/claude-opus-5-5-pricing-benchmarks).

## Frequently Asked Questions

### When will Gemini 4 Argon be generally available?

Google did not give a firm general-availability date in its September 30, 2026 announcement. The model first went to select cybersecurity partners, with a "soon" rollout promised to Google AI Ultra subscribers and paid API customers, but no concrete timeline has been published.

### Is Gemini 4 Argon better than GPT-6 Astra?

It depends on the task. In Google's own 18-test table, Argon leads on 12 of them, but GPT-6 Astra still wins some agentic benchmarks like Terminal-Bench 4.0. Independent evaluator Artificial Analysis puts the two models at essentially the same overall intelligence score (52.6 vs. 52.7).

### How much does Gemini 4 Argon cost?

Introductory pricing is $2 per million input tokens and $10 per million output tokens, with cached input discounted 95%. Google has said this pricing is temporary and standard rates will later rise to $4 and $20 per million tokens.

### Why does Gemini 4 Argon's output token limit matter?

Argon can generate up to 1 million tokens in a single response, about 15x the 64,000-token output cap of the prior Gemini generation. That lets a long report, a large codebase change, or a multistep analysis finish in one API call instead of being split across multiple requests.
