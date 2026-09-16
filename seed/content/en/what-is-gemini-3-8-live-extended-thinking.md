---
title: "What Is Gemini 3.8 Live Extended Thinking?"
slug: "what-is-gemini-3-8-live-extended-thinking"
translationKey: "gemini-3-8-live-extended-thinking-launch"
locale: "en"
excerpt: "Gemini 3.8 Live Extended Thinking launched Sept 15, 2026 and tops the Speech to Speech Quality Index at 82.6, beating GPT-Live-1 Astra and Grok Voice."
category: "ai"
tags: ["gemini", "ai-tools", "llm", "ai-agents"]
publishedAt: "2026-09-16"
seoTitle: "Gemini 3.8 Live Extended Thinking Explained"
seoDescription: "Gemini 3.8 Live Extended Thinking launched Sept 15, 2026 and tops the Speech to Speech Quality Index at 82.6, ahead of GPT-Live-1 Astra and Grok Voice."
---

Gemini 3.8 Live Extended Thinking is Google's real-time voice model, launched September 15, 2026, for conversations that need multi-step reasoning instead of instant replies. It ranks #1 on Artificial Analysis' Speech to Speech Quality Index at 82.6, ahead of OpenAI's GPT-Live-1 Astra (Medium) at 81.5 and xAI's Grok Voice Think Fast 2.0 (High) at 81.3, and it runs at $3.50 an hour against $5.83 for GPT-Live-1 Astra.

## What is Gemini 3.8 Live Extended Thinking?

It is the reasoning-focused half of a two-model release: Gemini 3.8 Live and Gemini 3.8 Live Extended Thinking, both shipped by Google DeepMind on September 15, 2026. The base model chases low latency and low cost for everyday voice assistants; Extended Thinking is built for tasks where getting the answer right matters more than answering instantly — multi-step customer support, live coaching, or agents that have to plan before they speak.

On Sierra's tau Voice banking benchmark, Extended Thinking completes 35.1% of tasks and 68.6% on the general tau Voice suite, and it scores 97.7% on Big Bench Audio. Those numbers only matter in relation to a baseline, which is why Google is positioning this specifically against the other frontier voice models, not against its own prior release.

## How is Extended Thinking different from standard Gemini 3.8 Live?

Standard Gemini 3.8 Live optimizes for fluid, low-latency back-and-forth and visual grounding — it processes near-real-time video and switches between 97 supported languages mid-conversation without a restart. Extended Thinking adds a reasoning pass before the model speaks, trading a bit of latency for accuracy on multi-step requests: booking logistics that involve several constraints, technical troubleshooting, or a negotiation that needs the model to track earlier commitments.

That tradeoff shows up directly in the benchmark spread: Extended Thinking's 82.6 quality score comes with higher per-hour cost than nothing, but it is still cheaper than both rivals it beats.

## Should you use Extended Thinking or the standard Live model?

Use standard Gemini 3.8 Live by default and reserve Extended Thinking for conversations where a wrong answer is expensive. A customer asking for store hours doesn't need a reasoning pass; a customer disputing a charge across three prior interactions does. Google built two separate models instead of one adjustable one specifically because the cost and latency profiles diverge enough that picking the wrong one for a simple lookup wastes money, and picking the wrong one for a complex task loses the customer.

A practical rule: if your conversation flow branches based on something the model has to remember or infer from earlier in the same call, default to Extended Thinking. If it's a single-turn lookup or a scripted flow, standard Live is both cheaper and faster, and the accuracy gap between the two won't show up in practice.

## Where can you use it right now?

As of September 2026, both models are rolling out across the Gemini API, Google AI Studio (free to try in all supported regions), Gemini Enterprise, Search Live, the Gemini Live app, and Google Workspace. That is a wider simultaneous rollout than most model launches get — Google is treating voice as a primary interface, not an add-on, which lines up with Google Assistant's shutdown on Android and Wear OS starting September 4, 2026, in favor of Gemini.

For enterprise teams, the Gemini Enterprise rollout matters more than the consumer-facing Gemini Live app: it's the path to using Extended Thinking inside internal tools, support desks, and Workspace add-ons without routing audio through a consumer product. Search Live is the more experimental slot — voice-driven search results read back and refined conversationally — and is the one most likely to change shape as usage data comes in over the next few months.

## How does it compare to GPT-Live-1 Astra and Grok Voice?

| Model | Speech-to-Speech Quality Index | Price per hour |
|---|---|---|
| Gemini 3.8 Live Extended Thinking | 82.6 | $3.50 |
| GPT-Live-1 Astra (Medium) | 81.5 | $5.83 |
| Grok Voice Think Fast 2.0 (High) | 81.3 | $4.80 |

The quality gap between the three is narrow — a 1.1 to 1.3-point spread on the index — but the price gap is not: Gemini 3.8 Live Extended Thinking costs 40% less than GPT-Live-1 Astra for a marginally higher score. For teams building at scale, that price difference compounds fast across millions of conversation-minutes.

## What does this mean if you're building voice agents?

Billing for the audio-to-audio Live models runs on token consumption — roughly 25 tokens per second of audio, which works out to about $0.0368 per minute for the standard Live tier. A minimal session against the Gemini Live API looks like this in outline:

```python
from google import genai

client = genai.Client(api_key="YOUR_API_KEY")

async with client.aio.live.connect(
    model="gemini-3.8-live-extended-thinking",
    config={"response_modalities": ["AUDIO"]},
) as session:
    await session.send_realtime_input(audio=microphone_chunk)
    async for response in session.receive():
        play_audio(response.data)
```

The session pattern is deliberately close to what you'd expect from any streaming API: open a connection, stream audio chunks in, stream audio chunks back out, and let the model decide when to interrupt or wait based on turn-taking cues in the input. What changes with Extended Thinking specifically is the gap between your last input chunk and the first response chunk — that's where the reasoning pass happens, and it's the number to watch in your own latency testing rather than trusting the published averages, since real network conditions and audio chunk size both move it.

If you're already building on OpenAI's realtime stack, our [guide to building voice agents with GPT-Realtime](/en/posts/gpt-realtime-2-1-voice-agents-guide) covers the equivalent session pattern, and the [Claude vs ChatGPT vs Gemini voice assistant comparison](/en/posts/ai-voice-assistants-compared-gpt-live-gemini-claude) has a broader feature breakdown beyond raw benchmark scores. For text-first Gemini work, [our guide to building with Gemini 3.6 Flash](/en/posts/building-with-gemini-3-6-flash) is still the cheaper default when you don't need audio.

One opinionated note: a 1-point benchmark lead is not a reason to switch production infrastructure. The 40% price advantage is the actual argument here — benchmark leaderboards change every few weeks, unit economics don't.

Sources: [Google's Gemini 3.8 Live and Extended Thinking announcement](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-gemini-3-8-live-extended-thinking/) and [Artificial Analysis' Speech to Speech Quality Index coverage via MarkTechPost](https://www.marktechpost.com/2026/09/15/google-releases-gemini-3-8-live-and-3-8-live-extended-thinking-for-production-grade-voice-agents/). Read more in our [AI category](/en/category/ai).

## Frequently Asked Questions

### Is Gemini 3.8 Live Extended Thinking free to try?
Yes, through Google AI Studio, which is free of charge in all supported regions; production use through the Gemini API or Gemini Enterprise is billed per audio token, at roughly $3.50 per hour for Extended Thinking as of September 2026.

### How much does Gemini 3.8 Live cost per minute?
Standard Gemini 3.8 Live bills at about 25 audio tokens per second, which works out to roughly $0.0368 per minute; Extended Thinking's hourly rate of $3.50 works out to about $0.058 per minute given its added reasoning pass.

### What replaced Google Assistant with these models?
Google began shutting down Google Assistant on Android and Wear OS on September 4, 2026, with Gemini — including the Live and Live Extended Thinking models — taking over as the voice interface on phones, tablets, watches, and Android Auto.

### Does Gemini 3.8 Live Extended Thinking handle video, or only audio?
Yes. Standard Gemini 3.8 Live processes visual input in near real time alongside audio, and Extended Thinking inherits that visual grounding while adding the multi-step reasoning pass for complex requests.
