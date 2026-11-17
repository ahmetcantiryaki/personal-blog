---
title: "Beat Context-Switching: Deep Work in 2026"
slug: "beat-context-switching-deep-work"
translationKey: "beat-context-switching-deep-work-2026"
locale: "en"
excerpt: "Short answer: context-switching leaves attention stuck on the unfinished task (attention residue); two protected 90-minute blocks a day claw most of that back."
category: "career-productivity"
tags: ["productivity", "time-management", "developer-experience", "burnout"]
publishedAt: "2026-11-17"
seoTitle: "The Real Cost of Context-Switching, and How to Fix It"
seoDescription: "Why does context-switching feel so draining? The attention-residue research, a one-week measurement log, and how to build two deep-work blocks — Nov 2026."
---

Short answer: when you leave a task unfinished, your attention keeps processing its open loops — psychologists call this "attention residue" — and it drags down your performance on whatever comes next. The fix isn't cutting notifications first; it's locking at least two uninterrupted blocks into your calendar every day.

Most developers treat context-switching as mild distraction. Sophie Leroy's 2009 experiments say the problem isn't duration — it's how you leave a task. Walking away from unfinished work keeps your mind tethered to it, delaying a full switch to whatever's next.

## What is attention residue, and why does focus get stuck?

Attention residue is what happens when your mind keeps processing an interrupted task's open threads instead of fully engaging with the new one, so performance on the new task suffers. The term comes from Sophie Leroy's paper "Why Is It So Hard to Do My Work?", published in *Organizational Behavior and Human Decision Processes*.

Leroy's experiments — one with 84 undergraduates, a second with 78, built around a word task followed by a résumé-evaluation task — show that simply "finishing" a task isn't enough on its own. Participants who completed the first task under time pressure performed better on the second task than those who finished without pressure, because time pressure forced a cleaner mental break from task one. A task can look done and still leave residue behind, depending on how it ended.

## How many minutes does context-switching actually cost?

There's no single universal number; the cost depends on the interruption type and the task's complexity. Gloria Mark's observational research at UC Irvine found that office workers took an average of 23 minutes and 15 seconds to return to their original task after a full interruption — but that figure comes from her specific dataset, not a fixed constant that applies everywhere.

| Interruption type | Approximate recovery cost | Note |
|---|---|---|
| Quick Slack/email glance | 5–15 min of degraded performance | Varies by source, not a firm number |
| Full interruption (meeting, call) | ~23 min (Gloria Mark, UC Irvine) | Average from one specific office-worker study |
| Leaving a task unfinished (attention residue) | Measurable performance drop, not minute-denominated | Leroy (2009), lab-based, not a field average |

Cal Newport calls this cost a "productivity poison" on his own site, arguing even brief glances degrade the quality of deep work — but Newport doesn't attach a specific minute figure; his claim is qualitative. Attribute the hard numbers to researchers like Leroy and Mark, and the framing to Newport.

## How do you measure your own switching cost?

A one-week log of every interruption gives you a far more reliable picture than guessing. For each interruption, record four things: the time, the interruption type, which task you switched from and to, and whether you ever returned to the original task.

| Day/Time | Interruption type | Task X → Task Y | Returned? |
|---|---|---|---|
| Mon 10:14 | Slack message | Code review → DM | No, 40 min later |
| Mon 11:02 | AI chat tab | PR → ChatGPT tab | Yes, 6 min later |
| Tue 09:30 | Meeting invite | Architecture doc → meeting | No, not that day |

At the end of the week, count the rows marked "no return." That number tells you how many tasks you left half-finished per day — how much attention residue you're actually carrying — which is far more usable than a vague sense of "I get distracted a lot."

## Why does batching communication actually work?

Batching means checking messages at fixed times a day (say, 11:00 and 16:00) instead of responding the instant a notification fires, so each message lands inside a communication window you already planned instead of triggering its own context switch. It doesn't reduce the number of messages — it puts you in control of *when* they interrupt you.

The practical rule: treat Slack, email and DMs as a queue checked at 2–3 fixed windows a day, not as push notifications. Test for a week whether anything marked "urgent" actually was — in most cases, a message that waited 90 minutes changed nothing.

## How do you design two daily deep-work blocks?

Two blocks of at least 90 minutes each, with notifications fully off, are usually enough to finish a day's highest-value task — one block should sit in the morning while attention is fresh, the other early afternoon, before the post-lunch dip. Pick one task per block; opening "just one more tab to check something" mid-block technically ends the block even if you don't close the calendar event.

Mark these blocks on your calendar as real meetings — with a title, a color, and "busy" status. If your team culture doesn't respect blocked time yet, show your manager a concrete example of work that didn't ship last week because of fragmentation, rather than arguing for "productivity" in the abstract.

## How do you handle the AI-assistant tab-hopping trap?

The sneakiest 2026-era source of context-switching is the AI chat tab left open while you code — every "let me just ask" reflex pulls your mind off the main task and refreshes attention residue, even if the round trip takes seconds. The fix isn't dropping the AI assistant; it's confining it to the block. Inside a deep-work block, keep AI use to inline, in-editor suggestions (IDE autocomplete, inline completions) and don't open a separate chat tab until the block ends.

Collect your questions in a scratch note during the block, then ask them all to the assistant in one batch once the block is over. That cuts both the number of questions and the number of task switches, applying the same batching logic above to AI assistants specifically. We cover the same shutdown discipline for desktop alerts in [A Notification Detox to Reclaim Your Focus](/en/posts/notification-detox-reclaim-your-focus).

This discipline matters even more on async teams; without the "no instant reply expected" culture covered in [Async Communication That Actually Works](/en/posts/async-communication-that-works), batching rules stay theoretical. My own take: no "deep work" routine built without two blocks, batched communication, and AI-tab discipline survives more than a month — the discipline isn't the two hours on the calendar, it's the decision not to open a tab during them. Pair this routine with the tool choices in [Boost Developer Productivity with AI Tools](/en/posts/developer-productivity-ai-tools) and most of the lost minutes come back. Don't ignore the burnout link either — chronic context-switching is one of the early warning signs covered in [How to Avoid Burnout as a Developer](/en/posts/avoid-developer-burnout). For more, browse the [Career & Productivity category](/en/category/career-productivity).

## Frequently Asked Questions

### What exactly is attention residue?

Attention residue is what happens when your mind keeps processing an interrupted task's unfinished parts instead of fully engaging with a new one, so performance on the new task drops. Sophie Leroy coined the term in 2009 through experiments with undergraduates, finding less residue when the prior task was completed under time pressure.

### How many minutes does context-switching cost you?

There's no single universal figure. Gloria Mark's UC Irvine research found full interruptions cost an average of 23 minutes and 15 seconds to recover from; a quick Slack glance is usually estimated lower, around 5–15 minutes depending on the source. Every number is an average from a specific sample — your own cost may differ.

### How do you run a one-week measurement log?

For every interruption, note the time, the interruption type, which task you switched from and to, and whether you returned to the original task. At the end of the week, count the rows marked "no return" — that's your real attention-residue load, in tasks left unfinished per day.

### Does an AI chat tab really count as context-switching?

Yes — unlike inline, in-editor AI suggestions, switching to a separate chat tab, asking a question, and switching back is a full task switch that refreshes attention residue. Batching your questions into a scratch note during a block and asking them all at once, after the block ends, cuts that switch count down.

**Sources:** [Sophie Leroy — "Why Is It So Hard to Do My Work?" (Organizational Behavior and Human Decision Processes, 2009)](https://econpapers.repec.org/RePEc:eee:jobhdp:v:109:y:2009:i:2:p:168-181), [Cal Newport — Deep Habits: The Danger of Pseudo-Depth](https://calnewport.com/deep-habits-the-danger-of-pseudo-depth/).
