---
title: "Write Your Self-Review and Brag Doc With AI"
slug: "write-self-review-brag-doc-with-ai"
translationKey: "ai-self-review-brag-doc-2026"
locale: "en"
excerpt: "Short answer: keep a running brag doc, write entries as outcome plus number, then have AI map it to your competency ladder and draft from there."
category: "career-productivity"
tags: ["career", "productivity", "ai-tools", "best-practices"]
publishedAt: "2026-09-14"
seoTitle: "Write a Self-Review With AI: The Brag Doc Method (2026)"
seoDescription: "How to keep a brag doc, prompt AI to extract impact and map it to your ladder, and write a self-review that owns its gaps instead of hiding them."
---

Short answer: keep a running brag doc with a few lines a week, write each entry as "what I did + how I did it + the measurable result," then hand that raw list to AI to map against your company's competency ladder before you edit the draft yourself. AI is good at turning scattered notes into a structured self-review; owning the gaps and getting the tone right is still on you.

Julia Evans popularized the "brag document" idea for a simple reason: instead of trusting your memory at review time, you log work as it happens. In 2026 that habit pays off more than ever, because you can now feed those notes to an AI tool and cut hours of drafting down to minutes.

## What is a brag doc, and why keep one?

A brag doc is a running list of what you did, logged close to when it happened, rather than reconstructed from memory at review time. Notion, Google Docs, or a plain markdown file all work — the format matters less than the habit of updating it.

The entries that pay off most have three parts: what you did, how you did it, and the measurable result. "Worked on the checkout flow" gives an AI tool almost nothing to work with; "Redesigned the checkout flow, cutting cart abandonment by 28%" gives both the AI and your future self real material.

## What prompts actually extract impact?

Self-review prompts work best when they include your role, a summary of the period, and specific accomplishments with metrics attached. Paste your raw brag doc in and ask for three things explicitly: group related items by theme, write in first person, and drop passive voice and corporate jargon.

| Prompt step | What you're asking for | Why it works |
|---|---|---|
| Grouping | Cluster entries by theme or competency | Turns a random list into a narrative |
| Extracting numbers | Flag entries missing a metric and ask for one | "Sped it up" becomes "cut it by 40%" |
| Tone pass | Set a target word count and formal/casual tone | A draft that fits your company's culture |
| Gap scan | Ask which competencies have thin coverage | Surfaces blind spots before review day |

Always edit the AI's output against your own judgment — a model can phrase things more confidently than your evidence supports, so cross-check every number against the brag doc entry it came from.

## How do you map it to your competency ladder?

Give the AI your company's ladder criteria and ask which brag doc entries support each one; this makes your self-review speak the evaluator's own language. If "technical leadership" is a criterion, the AI will suggest which entries fit under it, and the categories with thin coverage tell you where to dig for one more example before you finalize the draft.

This mapping also strengthens [managing up](/en/posts/managing-up-software-engineer): a self-review phrased in the criteria your manager already uses removes most of the "why did you write it this way" friction at review time.

## Why does owning your gaps matter?

A weak self-review tries to frame everything as a win; a strong one names where you fell short and states the next step. Asking AI "I missed this goal this period — help me state it honestly without sounding defensive" typically produces something like "delivered three weeks late, here's what I changed after" — which reads far more credibly than a review claiming everything went perfectly.

```text
Prompt: Take this brag doc entry: "API migration slipped by
3 weeks." Write it for my self-review in 2 sentences, stating
the cause and what I changed afterward, without sounding
defensive.
```

My honest take: the biggest value of AI here isn't drafting speed — it's that a model asking "what was the actual outcome of this?" is a more disciplined habit than asking yourself the same question and letting it slide.

## Is it safe to paste work context into AI tools?

On business or API tiers (Claude for Work, ChatGPT Business, Gemini for Workspace), your inputs aren't used for model training by default; free or individual consumer tiers may require an explicit opt-out. Check which tool your IT or security team has actually approved before pasting internal project names, client names, or financial figures — keeping your brag doc in generalized terms ("a large enterprise client" instead of the client's name) reduces that risk from the start.

## What should a peer-feedback request actually ask?

A good peer-feedback request targets a specific project or competency instead of the generic "what do you think of me." Give AI your two or three strongest brag doc entries and ask it to draft a request like "I'll send this to people who saw this work — write a specific feedback ask" so your peer has something concrete to answer instead of a blank prompt.

| Weak request | Strong request |
|---|---|
| "Any feedback on me?" | "How was the clarity of my code reviews on the Q3 payments migration?" |
| No deadline | "2-3 sentences by this Friday is plenty" |
| No context | Linked to the relevant brag doc entry |

## Why should you double-check any number AI suggests?

A model can propose a plausible-sounding but fabricated figure when your brag doc doesn't have a clean number for an entry — "roughly a 30% improvement" can slip into a draft before you've confirmed it. Before you send any number out, ask which raw entry in your brag doc it actually came from; drop a number you can't source, or replace "roughly" with the real measurement. An unverifiable statistic in a review conversation damages the credibility of the whole document, not just that one line.

## Frequently Asked Questions

### Is a brag doc the same thing as a self-review?

No. A brag doc is the raw, chronological record you keep all year; a self-review is that record edited for the review period, mapped to competency criteria, and trimmed to a specific length. You can write a self-review without a brag doc, but then you're relying on memory instead of a log.

### Can I submit the AI-drafted self-review as is?

No, that isn't recommended. AI speeds up drafting, but sending it without cross-checking numbers against your actual brag doc entries, fixing sentences that don't sound like you, and checking company-specific jargon is risky — a reviewer notices an inflated or generic-sounding draft immediately.

### How often should I update my brag doc?

Weekly, or every two weeks at the very least. People who update monthly tend to forget small-but-cumulative contributions; a short weekly rhythm lets you answer "what did I do and what was the result" while it's still fresh.

### What if my company has no formal competency ladder?

Ask AI to suggest general categories typical for your role — technical contribution, collaboration, ownership, mentorship — and map your brag doc to those yourself. Even without an official ladder, discussing your work through these categories with your manager gives your self-review real structure.
