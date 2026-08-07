---
title: "ChatGPT Pulse Is Gone: Your Scheduled Tasks Guide"
slug: "chatgpt-pulse-daily-briefing"
translationKey: "chatgpt-pulse-proactive-briefing"
locale: "en"
excerpt: "ChatGPT Pulse was retired in July 2026. Here's what replaced it — Scheduled Tasks — and a step-by-step guide to rebuilding your own daily briefing."
category: "career-productivity"
tags: ["chatgpt", "productivity", "automation", "ai-tools"]
publishedAt: "2026-08-07"
seoTitle: "ChatGPT Pulse Retired: The Scheduled Tasks Guide"
seoDescription: "ChatGPT Pulse is retired. Here's how to rebuild a useful daily briefing with Scheduled Tasks, what changed, and the web monitoring feature that replaced it."
---

If you're searching for "how to use ChatGPT Pulse," here's the short answer: you can't anymore — OpenAI retired it in July 2026. The good news is its replacement, **Scheduled Tasks**, does the same job with more control. Here's what happened and how to rebuild your own daily briefing.

## What Happened: Why Pulse Got Killed

ChatGPT Pulse launched in September 2025 as a $200/month Pro-only, mobile-first feature: overnight it scanned your chat history, memory, and any connected accounts you'd opted into (Gmail, Calendar) and delivered 5–10 morning cards summarizing what mattered. It reached the web in October 2025 but never rolled out to Plus or free tiers. OpenAI announced Pulse's retirement on June 17, 2026 — by then interest had already collapsed, with monthly search volume for "chatgpt pulse" dropping from roughly 33,100 in September 2025 to about 1,300 by May 2026, a 96% decline. The feature was fully switched off 14 days after that announcement.

If you're curious how Anthropic's own take on proactive AI briefings is shaping up, we looked at a different angle in [our piece on connecting Claude to the Anthropic Economic Index](/en/posts/claude-economic-index-connector).

## What Replaced It: Scheduled Tasks

**Scheduled Tasks**, announced the same day Pulse's retirement was confirmed, is available to Plus, Pro, Business, and Enterprise users starting June 17, 2026. The mechanic is straightforward: you write a prompt, pick a cadence (a specific time, or a broad window like morning, afternoon, or evening), and ChatGPT runs that task on schedule, delivering results by push notification or email. You can keep up to 10 tasks active at once, managed from the new Scheduled page.

The core difference is this: Pulse **inferred** what mattered from your chat history; Scheduled Tasks makes you **explicitly define** what gets checked. Less magic, but far more predictable.

## Setting Up Your Own Daily Briefing

Rebuilding the value Pulse used to provide takes a few minutes with Scheduled Tasks:

1. Open the **Scheduled Tasks** page from the left sidebar in ChatGPT.
2. Click "New task" and write a prompt — the more specific it is, the more useful the output.
3. Pick a cadence: a fixed time like 7:00 AM, or a broader window like "every morning."
4. Choose your delivery channel: push notification, email, or both.
5. Review the first few days of output and tighten the prompt — too broad a prompt produces noise, too narrow a prompt produces an incomplete brief.

A sample daily-briefing prompt might look like this:

```text
Every morning at 7:30, summarize:
1. Today's calendar meetings and anything that needs prep
2. Up to three unanswered important emails in my inbox
3. Yesterday's notable developments on [topic X, Y, Z]
Keep it short, bulleted, and skip filler pleasantries.
```

If you want to use connected accounts like Gmail and Calendar, you need to explicitly enable those connectors in ChatGPT settings — they're off by default, so you decide what data gets read.

## Web Monitoring: Price and News Tracking

Scheduled Tasks has a sibling feature Pulse never had: **web monitoring**. It periodically checks a product's price, a news topic, or a competitor's announcements, and alerts you when something changes. That's work you previously needed a third-party tool (or manual checking) for, now built directly into ChatGPT.

## Common Setup Mistakes

People migrating to Scheduled Tasks tend to fall into three traps. The first is writing one giant, catch-all task: a vague prompt like "summarize everything important every morning" just pushes the model back toward guessing what matters — exactly the failure mode that made Pulse unreliable in the first place. Defining three or four narrowly scoped tasks (calendar, inbox, a specific topic) separately produces far more predictable output.

The second mistake is not thinking about the delivery channel at all. A task delivered as a push notification can interrupt you every time you unlock your phone, while email can sit unread for days depending on your habits. Choose the channel deliberately based on urgency — email for a non-urgent news scan, push for anything that needs same-day action.

The third mistake is setting a task up and never reviewing the first output — treating it as "set and forget." Reading the first three or four days of results and tightening the prompt accordingly saves a lot of time down the line; skip that step and you'll keep getting a summary that's either noisy or incomplete.

## The Difference From Pulse: You're in Control

| Feature | ChatGPT Pulse (retired) | Scheduled Tasks |
|---|---|---|
| Content source | Chat history, memory, feedback (automatic inference) | An explicit prompt you write |
| Plans | Pro only (mobile, then web) | Plus, Pro, Business, Enterprise |
| Delivery | Morning cards | Push notification, email, chosen time |
| Active tasks | A fixed set of cards | Up to 10 tasks |
| Predictability | The model decides what matters | You define what gets checked |

Honestly, Pulse's "it just gets it" magic was appealing, but in practice it wasn't reliable — that kind of collapse in user interest doesn't happen by accident. Scheduled Tasks is less flashy, but because you know exactly what you're monitoring, the results are less surprising; it's the same "explicit rule, predictable outcome" logic we argued for in [our guide to inbox zero with AI](/en/posts/inbox-zero-with-ai-email-triage).

## Is Anyone Else Doing This Better?

ChatGPT isn't alone here — the proactive-briefing idea is being tried across the industry in different forms. Google positions a similar daily-digest concept differently inside Gemini for Workspace, something we covered in [our piece on Gemini in Google Workspace for small business](/en/posts/gemini-google-workspace-small-business). The takeaway is that the "proactive AI" category is still maturing, and what a vendor ships today can look completely different six months from now — as Pulse itself just proved. That's a good reason to anchor your workflow to the underlying principle (an explicit rule plus a reliable trigger) rather than to any one vendor's "magic" feature.

## Frequently Asked Questions

### Can I still access ChatGPT Pulse?

No. OpenAI fully shut it down 14 days after the June 17, 2026 retirement announcement. It no longer appears in the mobile app or on the web.

### Is Scheduled Tasks available on the free plan?

No. It's currently limited to Plus, Pro, Business, and Enterprise users; no official timeline has been shared for a free-tier rollout.

### Do I have to connect Gmail and Calendar?

No. Connectors are optional and off by default — you can use Scheduled Tasks for a plain text daily summary without connecting any accounts.

### How many tasks can I run at once?

Up to 10 active tasks. Once you hit that limit, you'll need to delete or pause an existing one before adding a new task.
