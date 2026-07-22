---
title: "Gemini 3.6 Flash, 3.5 Flash-Lite, and Cyber Arrive"
slug: "gemini-3-6-flash-3-5-flash-lite-and-cyber"
translationKey: "gemini-flash-trio-launch"
locale: "en"
excerpt: "Google shipped three new Gemini models on July 21: 3.6 Flash, 3.5 Flash-Lite, and security-focused Cyber. Gemini 3.5 Pro is still missing, again."
category: "ai"
tags: ["gemini", "llm", "ai-tools", "cost-optimization"]
publishedAt: "2026-07-22"
seoTitle: "Gemini 3.6 Flash, 3.5 Flash-Lite, Cyber: What Changed"
seoDescription: "Google shipped three new Gemini models on July 21: 3.6 Flash, 3.5 Flash-Lite, and security-focused Cyber. Gemini 3.5 Pro is still missing, again."
---

Google shipped three new Gemini models yesterday, July 21, 2026: Gemini 3.6 Flash, Gemini 3.5 Flash-Lite, and a security-focused model called Gemini 3.5 Flash Cyber. The long-awaited Gemini 3.5 Pro is still nowhere to be found — it missed its rumored July 17 window, and an August release is now the working guess. The story here is simple: the efficiency tier is moving fast while the flagship reasoning model keeps slipping.

## What Actually Shipped, and What Didn't

All three releases point the same direction: Google is doubling down on the cheap-and-fast tier. [According to officechai](https://officechai.com/ai/google-releases-gemini-flash-3-6-and-gemini-flash-3-5-lite/), both general-purpose models keep the same 1-million-token context window, a 64K max output, native multimodal input, and built-in tools including Computer Use. What changed is not raw "intelligence" — it's efficiency and task-completion speed.

[TechCrunch's own headline framing](https://techcrunch.com/2026/07/21/google-releases-three-new-gemini-models-but-no-3-5-pro/) puts it plainly: the real news is the model that didn't ship. We covered Gemini 3.5 Pro's third missed deadline in detail in [our earlier piece on the delay](/en/posts/gemini-3-5-pro-delayed-again-what-to-build-on), and yesterday's launch is a direct continuation of that story — Google is filling the gap with incremental Flash releases while the flagship stays in limbo.

## Gemini 3.6 Flash: Same Ballpark, Cheaper and Faster

Gemini 3.6 Flash is priced at $1.50 input / $7.50 output per million tokens — a real drop from Gemini 3.5 Flash's $1.50 / $9.00, mostly on the output side. It uses roughly 17% fewer output tokens than 3.5 Flash on the Artificial Analysis Index, a third-party model-benchmarking index. Google's own numbers show improvements on coding, computer-use, knowledge-work, and ML-research tasks versus 3.5 Flash, but this isn't a big jump in raw intelligence score — the gains are mostly efficiency and speed, with task-completion time roughly halved versus its predecessor.

In practice, that makes 3.6 Flash a low-risk upgrade for any team already running 3.5 Flash in production: same behavior profile, cheaper output, less token waste per task.

## Gemini 3.5 Flash-Lite: Where the Real Jump Is

The more interesting move is in the small model. Gemini 3.5 Flash-Lite is priced at $0.30 input / $2.50 output per million tokens, runs at roughly 350 output tokens per second, and posts a genuinely large jump of about +11 points on the Artificial Analysis Intelligence Index versus the prior 3.1 Flash-Lite.

Google's published benchmarks back that up with concrete numbers:

| Benchmark | 3.1 Flash-Lite | 3.5 Flash-Lite |
|---|---|---|
| Terminal-Bench 2.1 (agentic terminal tasks) | 31% | 54% |
| GDM-MRCR v2 (long context) | 60.1% | 72.2% |
| GDPval-AA v2 | 642 | 1140 |

The near-doubling on Terminal-Bench is the standout number here — it means a small, cheap model can now handle serious agentic work like running terminal commands and completing multi-step tasks. For high-volume, latency-sensitive use cases (recommendation systems, classification, preprocessing), Flash-Lite is now a legitimate default, not just a fallback for when budget runs out.

## Gemini 3.5 Flash Cyber: A Limited-Access Security Model

The third model is a different category entirely. Gemini 3.5 Flash Cyber is built on top of 3.5 Flash and fine-tuned specifically to discover, validate, and patch software vulnerabilities cheaply and at scale. Large flagship models are typically too slow and expensive to run repeatedly across millions of lines of code, so Flash Cyber was deliberately kept lightweight enough to run continuously in the background.

[According to TheHackerNews](https://thehackernews.com/2026/07/google-launches-gemini-35-flash-cyber.html), in testing against the V8 JavaScript engine codebase, Flash Cyber found 55 unique confirmed issues, compared to 47 found by mainline Gemini 3.5 Flash and 36 found by Claude Opus 4.6. That's a rare head-to-head comparison of three different models against the same codebase, and the result suggests task-specific fine-tuning can outperform a general-purpose flagship on a narrow, well-defined job.

One catch worth flagging clearly: Flash Cyber has no public API pricing. It's being rolled out exclusively to governments and trusted partners through CodeMender, Google DeepMind's AI-powered vulnerability discovery and patching agent first unveiled in October 2025, as a limited-access pilot. So it isn't something you can bolt onto your own project this week — but it signals where Google wants to go: decoupling continuous security scanning from flagship-model cost.

## Three Models at a Glance

| Model | Pricing (input/output, per million tokens) | Context window | Access | Best use case |
|---|---|---|---|---|
| Gemini 3.6 Flash | $1.50 / $7.50 | 1M tokens | General API | General-purpose production workloads, cost reduction |
| Gemini 3.5 Flash-Lite | $0.30 / $2.50 | 1M tokens | General API | High-volume, latency-sensitive agentic tasks |
| Gemini 3.5 Flash Cyber | Not published | — | Limited pilot via CodeMender | Continuous vulnerability scanning (government/partner) |

## Picking a Model via the API

Both public models are reachable through the same SDK — swapping the model ID is the only change required. The example below is illustrative:

```json
{
  "model": "gemini-3.6-flash",
  "contents": [{ "role": "user", "parts": [{ "text": "Review this pull request" }] }],
  "generationConfig": { "maxOutputTokens": 65536 }
}
```

For a more cost-sensitive, high-volume workload, swapping the model ID to `gemini-3.5-flash-lite` is usually the only change needed — the API contract and parameter schema stay identical.

## What This Actually Means for Developers

The decision in front of you today is straightforward: if you're building something latency- or cost-sensitive, 3.6 Flash and 3.5 Flash-Lite are safe, cheaper upgrades. Flash-Lite's jump on Terminal-Bench and long-context scores in particular means small models can no longer be dismissed as "fine for simple tasks only." But if you were specifically waiting for a Gemini 3.5 Pro-class reasoning jump, that wait continues — and after three consecutive missed windows, it's worth staying skeptical of whatever date comes next. We covered this two-speed dynamic in more depth in our [Claude Sonnet 5 vs GPT-5.6 vs Gemini 3.5 comparison](/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5).

My take: the iteration speed at the Flash tier matters more than the missing Pro model for most real-world use cases. Most production workloads never needed the strongest available model in the first place — they needed one that's fast, cheap, and good enough, and Flash-Lite's near-doubled Terminal-Bench score shows that bar just moved meaningfully. The Pro delay gets the headlines, but this quiet, continuous improvement at the Flash tier is what's actually shaping day-to-day engineering decisions.

For a broader tool and model comparison, see our [Gemini vs ChatGPT](/en/posts/gemini-vs-chatgpt-2026) breakdown, and for business-specific Gemini usage, check today's companion piece on [Gemini Gems for business](/en/posts/gemini-gems-custom-ai-assistants-business). If you want to put the Gemini ecosystem to work on research, our [NotebookLM research and study guide](/en/posts/notebooklm-research-study-guide) is a useful next read, or browse our [AI category](/en/category/ai) for the wider landscape.

## Frequently Asked Questions

### When will Gemini 3.5 Pro launch?

Google hasn't given an official date. The July 17, 2026 target was missed, and an August window is now the working rumor, but after three consecutive missed deadlines, that estimate deserves skepticism too.

### What's the real difference between Gemini 3.6 Flash and 3.5 Flash-Lite?

3.6 Flash targets mid-sized general-purpose workloads and improves the price-to-performance ratio over 3.5 Flash. 3.5 Flash-Lite is much cheaper and faster, optimized for high-volume or latency-sensitive tasks, and shows a meaningfully larger quality jump over its predecessor on agentic benchmarks.

### Can I use Gemini 3.5 Flash Cyber in my own project?

Not currently. The model has no public API pricing and is available only to governments and trusted partners through Google DeepMind's CodeMender program as a limited pilot.

### Which Gemini model should I use right now?

For general production workloads, 3.6 Flash is a low-risk upgrade. For high-volume, cost-sensitive, or agentic tasks, evaluate 3.5 Flash-Lite. If you're waiting for a frontier-level reasoning jump, don't hold your roadmap for 3.5 Pro — use the best available alternative today, whether that's Gemini 3.5 Flash, GPT-5.6, or Claude Opus 4.6.
