---
title: "ChatGPT Goes Unlimited: Free Chats, New Thinking Slider"
slug: "chatgpt-free-unlimited-chats-thinking-slider"
translationKey: "chatgpt-free-unlimited-thinking-slider"
locale: "en"
excerpt: "OpenAI gave free ChatGPT users unlimited text chats on GPT-5.6 Luna, and gave Plus/Pro users a slider that sets how much GPT-5.6 Sol thinks before answering."
category: "ai"
tags: ["chatgpt", "openai", "llm", "ai-tools"]
publishedAt: "2026-08-09"
seoTitle: "ChatGPT Goes Unlimited: Free Chats, Thinking Slider"
seoDescription: "OpenAI's August 6 update gives Free and Go users unlimited text chats on GPT-5.6 Luna, and gives Plus/Pro users a reasoning-effort slider on GPT-5.6 Sol."
---

On August 6, 2026, OpenAI announced that ChatGPT's free tier is getting unlimited text chats: Free and Go users now default to GPT-5.6 Luna and the message cap on text conversations is going away entirely. The same update gives Plus and Pro users a new slider that lets them dial in how much GPT-5.6 Sol "thinks" before it answers. The timing matters — according to [OpenAI's official announcement](https://openai.com/index/improving-gpt-5-6-sol-in-chatgpt/), ChatGPT's weekly active users were closing in on 1 billion when this shipped.

The change made waves across [tech press, TechCrunch included](https://techcrunch.com/2026/08/06/openai-brings-unlimited-chatgpt-text-chats-to-free-users/), because making the free tier this generous breaks from OpenAI's usual playbook. The company's earlier approach kept free users deliberately constrained to push conversions to Plus; this announcement is a deliberate shift away from that balance.

## What Changed on the Free Tier

GPT-5.6 Luna becomes the default model for Free and Go users, and the message limit on text-based chats disappears completely. The rollout happens in two phases: Luna becoming the default lands the week of the announcement, while unlimited chats and a new "Think" button for harder questions arrive the following week, starting August 10. The Think button gives the model more time to work through a difficult question — it's essentially a simplified, one-tap version of the slider that Plus and Pro users get.

The practical effect: free users who used to hit a daily message ceiling can now, in theory, chat without limit on text. That said, "unlimited" doesn't cover everything — image generation, file uploads, and other tools still have separate caps, and abuse guardrails still apply.

## The Thinking Slider for Plus and Pro

The bigger structural change sits on the paid side. GPT-5.6 Sol now powers both instant replies and deep reasoning in a single model, and users pick how much reasoning effort to spend via a speedometer icon in the toolbar.

| Slider level | Best for |
|---|---|
| Instant | Everyday questions, quick lookups, light edits |
| Medium | Moderately complex writing and summarizing |
| High | Code review, multi-step planning |
| Extra High | Deep research, complex analysis |
| Pro | Maximum effort: high-stakes decisions, long reasoning chains |

This is effectively the `reasoning_effort` parameter OpenAI already exposes to developers via the API, surfaced directly in the chat UI. The difference is that Plus/Pro users no longer need to pick a separate "o-series" reasoning model — they drag one slider on a single model instead. According to [Digital Watch Observatory's breakdown of the update](https://dig.watch/updates/gpt-5-6-sol-update-chatgpt-free-users), this merge is part of OpenAI's broader push to abstract model selection away from the user entirely — the question shifts from "which model" to "how much effort."

The slider's most practical benefit shows up in a scenario that used to require restarting a conversation to switch to a dedicated reasoning model. Now, within the same thread, you can bump the slider up for a single hard question and let the model spend more time on just that one reply — without losing conversation history in the process.

## Why the Rollout Is Staged in Two Phases

There's a technical reason OpenAI chose to spread this change across two separate weeks instead of shipping it all at once: making Luna the default first, then observing server-side load distribution, and only then flipping on unlimited chat and the Think button a week later lets the company catch a capacity problem early. This is a familiar staged-rollout tactic for large consumer products — a sensible, cautious approach for a feature like "unlimited" that could spike demand overnight. The upshot for users is that not every free account got unlimited chat the instant the announcement went out; even if Luna already shows up as your default model, the message cap may still apply for another week.

## The Accuracy Numbers

In OpenAI's high-stakes factuality evaluation covering finance, medicine, and law, GPT-5.6 Sol showed a meaningful jump over GPT-5.5 Instant:

| Model | Compared to | Factual-error reduction |
|---|---|---|
| GPT-5.6 Sol | GPT-5.5 Instant | 68% |
| GPT-5.6 Luna | GPT-5.5 | 62% |

OpenAI attributes the improvement to three behavior changes: response length that adjusts to the question, less unnecessary formatting, and the model offering corrections instead of just agreeing when agreement would be unhelpful. These numbers come from OpenAI's own internal eval, not an independent benchmark — worth keeping in mind — but the direction tracks with what users have complained about most in GPT-5.5: an overly agreeable, sycophantic tone.

## Unlimited, With an Asterisk

"Unlimited" is a strong marketing word, but the fine print still matters. As of August 2026, these limits remain on the free tier:

- Image generation: 2–3 images per rolling 24-hour window (DALL·E 3 or GPT-Image-1.5)
- File uploads: 3 files per day
- Abuse detection can trigger automatic rate limiting regardless of tier

So "unlimited chat" is real, but "unlimited ChatGPT" is not. Anyone doing heavy image or file work will still need to upgrade to Plus.

## What It Means for Developers

The change itself isn't an API update — it's purely a consumer-product shift. But it has two indirect consequences worth noting. First, a bigger free user base makes ChatGPT an even more dominant reference point when people benchmark competing products against it. Second, the slider UI gives end users a concrete, visual sense of what the `reasoning_effort` API parameter actually does; if you're designing a similar "effort picker" in your own product, this five-tier structure is a reasonable reference:

```json
{
  "model": "gpt-5.6-sol",
  "reasoning_effort": "high",
  "input": "Analyze the race-condition risk in this PR"
}
```

As we covered in [our piece on the new ChatGPT Plugin Directory](/en/posts/chatgpt-plugins-2026-directory-guide), OpenAI was also busy on the ecosystem side the same week — reading both changes together shows a company expanding consumer reach and developer integrations in parallel.

## Where It Leaves the Competition

As we discussed in [our Gemini vs ChatGPT comparison](/en/posts/gemini-vs-chatgpt-2026), the rivalry between the big three providers is no longer just about model quality — it's also about how generous each one is with its free tier. Unlimited text chat reads as a direct answer to the free usage allowances Google offers around Gemini. Put next to [GPT-5.6's general availability](/en/posts/gpt-5-6-general-availability-codex-desktop) and the [Luna/Terra price cuts](/en/posts/gpt-5-6-price-cuts-luna-terra) that followed it, it's clear OpenAI spent August pushing an aggressive growth strategy built on price and access rather than pure capability.

Shipping three moves in a row within a single month — general availability, a price cut, and unlimited free chat — isn't a coincidence; all three serve the same goal: keeping users inside the product and making it harder to switch to a competitor. The Luna/Sol/Terra lineup reflects a strategy of answering different budget and speed needs from within a single model family — what's new here is just how aggressively OpenAI is willing to expand the free tier to do it.

## Frequently Asked Questions

### What's the difference between GPT-5.6 Luna and GPT-5.6 Sol?

Luna is the default, faster, cheaper model for Free and Go users. Sol is the higher-tier model for Plus and Pro users, capable of both instant replies and deep reasoning. A third tier, Terra, sits between the two as a balanced everyday option.

### How do I use the thinking slider?

On a Plus or Pro account, open ChatGPT on web, mobile, or desktop, tap the speedometer icon in the toolbar, and pick one of five levels between Instant and Pro. Moving the slider up increases response time but improves accuracy on complex tasks.

### Will free users really hit no limits at all?

Not on text chat — that part is genuinely unlimited. But image generation and file uploads still carry daily caps, and OpenAI can apply rate limiting if it detects abuse.

### Does this change affect API users?

Not directly — this is a ChatGPT product update. But the `reasoning_effort` logic the slider is built on already existed in the API; seeing it exposed in the product is a useful design reference if you're building a similar effort picker into your own app.
