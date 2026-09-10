---
title: "What Is GPT-6 Astra? Pricing, Context, Cyber Risk"
slug: "what-is-gpt-6-astra"
translationKey: "gpt-6-astra-launch-2026"
locale: "en"
excerpt: "GPT-6 Astra is OpenAI's new flagship model, launched September 3, 2026, with a 1.05M-token context window — and the first model to hit 'Critical' cyber risk."
category: "ai"
tags: ["openai", "chatgpt", "llm", "ai-tools"]
publishedAt: "2026-09-10"
seoTitle: "GPT-6 Astra: Pricing, Context Window, Cyber Risk"
seoDescription: "OpenAI announced GPT-6 Astra on September 3, 2026: a 1.05M-token context window, $10/$50 API pricing, and the first model rated 'Critical' for cyber risk."
---

Short answer: GPT-6 Astra is OpenAI's new flagship model, announced September 3, 2026, with a 1.05-million-token context window and Native Computer Use, the ability to operate a screen and OS directly. It's also the first model rated "Critical" for cybersecurity risk under OpenAI's Preparedness Framework, so the launch is being discussed as much for its risk profile as its capability.

## What is GPT-6 Astra?

GPT-6 Astra is OpenAI's successor to GPT-5.6 Sol, available in the API under the model ID `gpt-6-astra`. Access started with a limited set of organizations on September 3 and broadened to the API and paid ChatGPT plans (Plus, Pro, Business, Enterprise) on September 4. The model accepts text and image input; audio and video input aren't supported at launch. Its knowledge cutoff is April 30, 2026.

The headline feature is Native Computer Use: instead of relying on a manual tool-calling schema, Astra interacts with an operating system directly, reading the screen and issuing mouse and keyboard actions. OpenAI calls it "the most intelligent and aligned model in the world" — a bold claim, but the benchmark gains behind it are concrete, particularly on agentic tasks and long-context code review.

## What does GPT-6 Astra cost, and how big is its context window?

Astra's standard API pricing is $10 per million input tokens and $50 per million output tokens. Cached input tokens drop to $1 per million; batch and flex processing run at half price, and Fast mode runs at 2x the standard speed for 2x the price.

| Model | Context window | Input (1M tokens) | Output (1M tokens) |
|---|---|---|---|
| GPT-6 Astra | 1.05M tokens | $10 | $50 |
| GPT-5.6 Sol (previous) | ~400K tokens | $5 | $20 |
| Claude Opus 5 | 500K tokens | $9 | $45 |

As of September 2026, this pricing puts Astra ahead on raw context but close to Opus 5 on output cost. Teams that structure prompts to actually trigger the cached-input discount — reusing the same system prompt and context across calls — see a real drop in effective spend. Teams running one-off queries that never hit the cache feel the full price gap.

## Why did GPT-6 Astra get rated 'Critical' for cyber risk?

Because with the right tools and access, Astra can find previously unknown security vulnerabilities and develop exploits for them without a human guiding each step. On OpenAI's four-tier Preparedness Framework, that lands it in "Critical" — the top tier, and the first model to reach it.

The numbers back up the classification. Astra scored 100% on ExploitBench, versus 78.5% for the prior frontier model, GPT-5.6 Sol. It also identified 39% of vulnerabilities disclosed in the previous three months and found two real zero-day vulnerabilities during pre-release testing. The trade-off OpenAI acknowledges: Astra's monitorability has decreased relative to Sol — it's better at controlling its own chain of thought and less likely to leave incriminating detail in its reasoning. That's a big part of why OpenAI paused frontier training runs to add safeguards before shipping, which delayed the launch.

For a security team, the practical takeaway is straightforward: an Astra-powered tool can find unknown flaws in your codebase before you do, and that cuts both ways — offense and defense. Any organization granting API access needs to add that possibility to its threat model now.

## How good is GPT-6 Astra at coding and agentic tasks?

Astra catches 20% more real bugs than GPT-5.6 Sol and 33% more than Claude Opus 5 on cross-file code review — the hardest category. On general labeled bug-catching, the gap is smaller: about 4% over Sol, 22% over Opus 5. On OSWorld 2.0, a computer-use benchmark, Astra scores 72.6%, roughly 47% faster per task than Sol.

Developer feedback is mixed on cost-benefit. On everyday debugging and lookup questions, Astra lands on the same answer as Sol and GPT-5.6 Terra for more money. Where it pulls ahead is the hard end: multi-step agentic tasks, computer use, long-context retrieval past 500,000 tokens, and problems where an extra caveat stops a wrong fix. If your workload lives there, the price is defensible; if it doesn't, Sol remains the cheaper option.

## How do you access GPT-6 Astra?

The model is available via the API as `gpt-6-astra`, plus Microsoft Azure and Amazon Bedrock. A basic call looks like this:

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-astra",
    "messages": [{"role": "user", "content": "Find the race condition in this function."}]
  }'
```

On the ChatGPT side, Astra is available to Plus, Pro, Business, and Enterprise plans — not the free tier yet. Fast mode is selectable via the `service_tier` parameter for double speed at double the price.

## How does GPT-6 Astra compare to Claude Opus 5 and Gemini?

Raw benchmark numbers favor Astra, but real-world choice isn't just a scoreboard. [Claude Opus 5's frontier-intelligence-at-half-price pitch](/en/posts/claude-opus-5-launch) still holds up on cost-performance, and since Astra's output price sits close to Opus 5's, the real differentiator is context window and agentic capability rather than raw price. My take: Astra's "Critical" cyber classification isn't a practical blocker for an average developer's daily use, but a small company without a dedicated security team should ask "who's using this, and for what" at least once before handing out API access.

If you're weighing tools, our [Claude Code vs. Cursor vs. Antigravity comparison](/en/posts/claude-code-vs-cursor-vs-antigravity-2026) and [AI subscription buyer's guide](/en/posts/which-ai-subscription-2026) cover the broader landscape, and our [ChatGPT complete guide](/en/posts/chatgpt-complete-guide-2026) tracks which plan gets Astra access as it rolls out. For more AI coverage, browse our [AI category](/en/category/ai).

Sources: [OpenAI's official GPT-6 Astra announcement](https://openai.com/index/gpt-6-astra/), the [Astra safety overview](https://openai.com/index/safety-overview-gpt-6-astra/), and [OpenRouter's pricing and benchmark page](https://openrouter.ai/openai/gpt-6-astra).

## Frequently Asked Questions

### When was GPT-6 Astra released?

GPT-6 Astra was announced on September 3, 2026. Access started with a limited set of organizations that day, then broadened to the OpenAI API and paid ChatGPT plans (Plus, Pro, Business, Enterprise) on September 4.

### How much does GPT-6 Astra cost?

Standard API pricing is $10 per million input tokens and $50 per million output tokens. Cached input drops to $1 per million, and Fast mode costs 2x the standard rate for 2x the speed.

### Why is GPT-6 Astra rated 'Critical' for cyber risk?

Because it scored 100% on ExploitBench and can find and exploit previously unknown security vulnerabilities without step-by-step human guidance — the top tier on OpenAI's Preparedness Framework. It found two real zero-day vulnerabilities during pre-release testing.

### What is GPT-6 Astra's context window?

GPT-6 Astra has a 1.05-million-token context window and a 128,000-token maximum output, with an April 30, 2026 knowledge cutoff. That's well above the roughly 400,000-token window of the previous model, GPT-5.6 Sol.
