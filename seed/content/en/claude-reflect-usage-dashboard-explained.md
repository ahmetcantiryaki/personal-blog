---
title: "Claude Reflect: Anthropic's New AI Usage Dashboard"
slug: "claude-reflect-usage-dashboard-explained"
translationKey: "claude-reflect-usage-dashboard"
locale: "en"
excerpt: "Anthropic's Reflect, launched July 9, is a dashboard that analyzes how you use Claude. Here's what it tracks, what it excludes, and whether it's useful."
category: "ai"
tags: ["claude", "ai-tools", "productivity", "well-being"]
publishedAt: "2026-07-17"
seoTitle: "Claude Reflect Explained: Anthropic's Usage Dashboard"
seoDescription: "Anthropic's Reflect dashboard analyzes your Claude usage patterns. What it tracks, what data it excludes, and why it launched now — a practical breakdown."
---

Anthropic introduced Reflect on July 9, 2026: a dashboard inside Claude that analyzes your chat history and shows which topics, times of day, and task types you actually use Claude for. It's live in beta on Free, Pro, and Max plans, gated behind one requirement — memory has to be turned on.

## What Reflect Actually Shows

Found under Settings, the dashboard summarizes your activity over the last 1, 3, 6, or 12 months: your top conversation topics, your most active day, your peak usage hour, and recurring patterns in the kinds of tasks you bring to Claude. A total-time-spent view isn't live yet — Anthropic lists it as "coming soon" — but conversation counts and topic breakdowns are already in the beta.

The dashboard isn't just retrospective. It also scores your habits against what Anthropic calls the 4D AI Fluency Framework:

| Dimension | What it measures |
|---|---|
| Delegation | Deciding when and whether to hand a task to AI at all |
| Description | How clear and well-contextualized your prompts are |
| Discernment | Whether you critically evaluate outputs before trusting them |
| Diligence | Taking ownership of and verifying AI-assisted results |

The framework itself isn't new — it's shown up in Anthropic Academy training material before — but Reflect is the first time it's applied to your own usage data and turned into a concrete self-assessment.

## Privacy: What's In, What's Excluded

The most sensitive question with any usage dashboard is what data feeds it. Anthropic's stated boundaries are specific:

- Incognito conversations never enter Reflect's analysis.
- Connected-tool content isn't pulled in raw — only Claude's own generated summaries are. Ask Claude to summarize your inbox, and the summary's topic shows up in Reflect; the underlying emails don't.
- Any conversation tied to a health integration is excluded entirely, full stop.

Those boundaries are reasonable, but they don't make the underlying question disappear: this adds a new analysis layer on top of chat history that was already sitting on Anthropic's servers. The fact that Reflect can be switched off (by turning off memory) at least leaves an exit.

## Well-Being Features: Quiet Hours and Nudges

The dashboard isn't purely retrospective stats — it lets you set "quiet hours" to suppress notifications during specific windows, or schedule a nudge that reminds you to take a break after a set amount of usage. Both are opt-in and dismissible at any time; neither is a hard limit, just a reminder you control.

## Why Now: Growth Metric or Genuine Utility

It would be dishonest to skip the obvious tension here: a company showing you how much you use its product can also be building a feedback loop designed to make you use it more. TechCrunch's coverage went as far as calling it a feature that's "quietly selling you on AI," and I don't think that reading is entirely wrong — but it isn't the whole picture either. The 4D framework genuinely surfaces prompt-writing habits, and for a developer working with Claude or Claude Code daily, that's a useful mirror to look into. The existence of quiet hours and nudges also doesn't fit neatly into a pure "use us more" narrative. My take: data-driven self-awareness here is real value, but don't mistake every number on that dashboard for a neutral mirror — some of it is there to keep you opening the app.

## The Practical Use Case for Developers

If you work with Claude or Claude Code daily, Reflect's most concrete payoff is spotting recurring weak spots in how you prompt. A low Description score usually means your prompts are short and under-contextualized — which is exactly what drives extra back-and-forth correction cycles. The topic breakdown is also a decent signal for what to automate: if the same category of task shows up dozens of times a week, that's a strong case for wiring up a dedicated subagent or slash command instead of typing it out fresh each time.

```json
{
  "period": "last_30_days",
  "topBreakdown": [
    { "topic": "code-review", "share": 0.34 },
    { "topic": "debugging", "share": 0.21 },
    { "topic": "writing", "share": 0.18 }
  ],
  "quietHours": { "start": "22:00", "end": "08:00" }
}
```

A breakdown like the one above — code review as your single biggest category — is a clear signal to automate that flow rather than keep repeating it manually. Our guide to [Claude Code subagents and background agents](/en/posts/claude-code-subagents-background-agents) walks through how to wire that up for exactly this kind of recurring task.

The productivity question Reflect surfaces isn't new — we've covered [whether AI actually makes developers faster](/en/posts/does-ai-make-developers-faster) before, and your dashboard numbers add a personal data point to that debate. If usage-time tracking makes you rethink how you allocate your day, [our guide to time management for busy developers](/en/posts/time-management-for-developers) is a natural next read.

## Where This Fits in Product History

Usage dashboards are new to AI chat tools, but the idea itself isn't. Spotify Wrapped shows you a year of listening habits once annually, phone OS "Screen Time" features report minutes spent per app, and GitHub's contribution graph shows how many days in a row you've committed code. Reflect is the first large-scale example of that pattern applied to AI chat — and the difference is that it tries to answer "how well," not just "how much." Screen Time tells you that you spent 47 minutes on a messaging app but says nothing about the quality of that time; Reflect's 4D framework is explicitly built to close that gap, scoring not just usage volume but usage quality. How well that actually works is debatable, given how subjective the framework is — whether a given prompt counts as "well-described" depends heavily on task context, and there's no way to externally verify how accurately the automated scoring captures that.

As of this writing, neither ChatGPT nor Gemini has a direct equivalent — both ship memory and personalization features, but neither has turned usage habits into this kind of structured self-assessment dashboard yet. That makes Reflect a category-first move that competitors will likely follow.

## A Note for Teams and Enterprise Users

Reflect is currently scoped to the individual user experience. The Admin API also expanded this month, letting organization admins automate member management, but the two features are unrelated — the Admin API doesn't currently expose an aggregated, team-wide Reflect view. If you lead an engineering team, you're still dependent on individual members sharing their own dashboards to get any sense of team-wide Claude usage patterns; a rolled-up enterprise analytics view isn't on the visible roadmap yet.

## Frequently Asked Questions

### Which Claude plans include Reflect?

As of July 2026, it's in beta on Free, Pro, and Max plans, and requires memory to be turned on in your account settings.

### What data does Reflect exclude?

Incognito conversations, the raw content pulled from connected tools, and any conversation tied to a health integration are all excluded from Reflect's analysis.

### Can I turn Reflect off?

Yes. Since it's gated behind memory, turning memory off disables Reflect too; quiet hours and nudge reminders can also be toggled off independently.

### Does Reflect show total time spent using Claude?

Not yet in the beta. Anthropic lists a total-time-spent view as "coming soon" — right now the dashboard covers conversation counts, topic breakdowns, most active day, and peak hour.
