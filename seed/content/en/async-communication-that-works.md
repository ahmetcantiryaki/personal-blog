---
title: "Async Communication That Actually Works"
slug: "async-communication-that-works"
translationKey: "async-communication-that-works-2026"
locale: "en"
excerpt: "Short answer: default to writing, log every decision somewhere everyone can find it later, and drop the expectation of an instant reply every time."
category: "career-productivity"
tags: ["communication", "collaboration", "remote-work", "productivity"]
publishedAt: "2026-10-22"
seoTitle: "Async Communication That Actually Works"
seoDescription: "Short answer: default to writing, log every decision somewhere everyone can find it later, and drop the expectation of an instant reply every time."
---

Short answer: async communication works when you default to writing, record every decision somewhere everyone can find later, and remove the expectation of an instant reply. On remote teams, when these three habits are missing, it's that gap — not the time-zone difference — that turns into friction.

## What is async communication, and why does it matter?

Async communication means work moves forward without the other person replying immediately: you send a message, they read and respond on their own schedule. It's the opposite of synchronous communication — a meeting, a live chat exchange, or a call. GitLab, an all-remote company with over 2,000 employees, has documented this model for years; its public handbook has grown past 2,700 pages and reflects a "handbook-first" culture — write it down first, then talk.

Async habits aren't only valuable across time zones. Even people sitting in the same office get interrupted constantly during the day. Víctor González and Gloria Mark's 2004 CHI paper found that information workers spent about three minutes on a task before switching to something else, and that 82% of interrupted work resumed the same day — but only after an average delay of more than 23 minutes. Every "reply now" expectation triggers that same recovery cost.

The full text of González and Mark's study is public at [ics.uci.edu](https://www.ics.uci.edu/~gmark/CHI2004.pdf); the research observed information workers across three roles (analysts, software developers, managers) to measure that three-minute average and the recovery cost of interrupted work. Its central finding is that people spend more than two minutes on average using an electronic tool or paper document before returning to a task — meaning an interruption isn't just "losing focus," it carries a real restart cost.

## How do you strike the right balance between sync and async?

Converting everything to writing is also a mistake: some topics — especially feedback carrying emotional weight, or architecture decisions with multiple options that need live back-and-forth — get resolved faster and with fewer misunderstandings in a live conversation. A practical rule: if you find yourself asking more than three "but what happens if" questions while writing something up, that topic probably needs a synchronous conversation. By contrast, content like "sharing this, no action needed" or "here's the decision we made and why" can almost always move to writing.

Teams that move to async usually follow the same order: first they convert daily status updates to writing, then they move decision records to one central place, and only then do they ask "which meetings are actually necessary" and cut the rest. Reversing that order — cutting meetings first — tends to make a team lose information flow and misread async work as "less communication," when the actual goal is less *synchronous* communication and more *written* communication.

## What does "default to writing" actually mean?

It means a decision or update goes into a channel everyone can see — a public issue, a merge request, a team channel — rather than a DM to one person first. GitLab's handbook glossary draws this line explicitly: DMs trap information in one person's inbox, while public channels let anyone searching later find the same information. In practice, it means breaking the reflex to say "let me DM you this" — unless it's genuinely private, the public channel should be the default.

## Where should decisions get recorded?

Any decision made in a meeting or call needs to become a written summary the moment the call ends — otherwise the decision only lives in the memory of whoever was on the call. GitLab solves this with a "single source of truth" principle: the outcome of a verbal conversation isn't considered real until it's written into the handbook or the relevant issue. A decision log is the simplest version of this: four columns — date, decision, reasoning, and who approved it.

| Practice | What it does |
|---|---|
| Decision log | Archives every decision with date + reasoning in one place |
| Public-channel default | Stops information from getting trapped in one person's DMs |
| Explicit reply SLA | A clear "reply within 24 hours" removes the pressure to be always-online |
| Written status update | Turns the daily standup into something everyone reads on their own time |

```text
## Decision Log — Example Entry
Date: 2026-10-20
Decision: New API versioning will use URL path, not headers
Reason: Most current clients don't support header-based versioning
Approved by: Backend team lead
```

## What replaces the daily standup?

A short written update each person posts at the start of their day: what I did yesterday, what I'm doing today, what's blocking me. As our [guide to turning meetings into action items](/en/posts/meetings-into-action-items-with-ai) covers, this format can be sped up with an AI tool — but the key point is that the update doesn't require everyone on screen at the same time. Meetings don't disappear entirely; complex topics that need multiple viewpoints discussed live still need a call. But most meetings held purely to transfer information can move to writing.

## Where does async work break down?

Three typical failure modes: endless threads (a decision gets buried in a 40-message Slack thread), hidden decisions (a decision made in a call that never gets written down anywhere), and timezone resentment (one side is constantly expected to reply at midnight their time). All three have the same fix: the problem isn't writing things down, it's making what's written *findable*. Saying "we already work in writing" without a decision log or a public-channel default doesn't get you async communication's real benefit — if the information is scattered, async work delivers none of its upside.

My own take: the hard part of async communication isn't picking the right tool — it's giving up the habit of expecting an instant reply. If you're a team lead who expects an immediate response on Slack, you teach your team to expect the same from you. A written culture only becomes real once the most senior person on the team visibly drops that expectation first.

For more, see our [notification detox guide](/en/posts/notification-detox-reclaim-your-focus) and [growing your career as a remote developer](/en/posts/remote-developer-career-growth); GitLab's full handbook is public at [handbook.gitlab.com](https://handbook.gitlab.com/handbook/company/culture/all-remote/remote-work-glossary/).

## Frequently Asked Questions

### Does async communication eliminate meetings entirely?

No. Complex topics that need multiple viewpoints discussed live still need a meeting. What disappears is the meeting held purely to transfer information — the daily standup is the classic example of one that moves cleanly to writing.

### How long should a reply SLA be?

There's no fixed number; teams typically set a window between 4 and 24 hours. What matters isn't the exact number, it's that it's written down explicitly — ambiguity is what pushes people into "should I reply right now?" anxiety.

### Should decisions go in Slack or a wiki?

Either can work, but Slack messages get buried over time; a persistent record — a wiki page, an issue, or a dedicated decision log — is more reliable. GitLab's model is to always move the outcome of a Slack discussion into the handbook or the relevant document.

### Does async communication help teams with no time-zone difference?

Yes. Research shows people in the same office also switch tasks roughly every three minutes during the day; async habits reduce that interruption cost for any team, not just ones spread across time zones.
