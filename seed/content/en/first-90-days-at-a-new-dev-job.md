---
title: "Your First 90 Days at a New Dev Job"
slug: "first-90-days-at-a-new-dev-job"
translationKey: "first-90-days-new-dev-job"
locale: "en"
excerpt: "Ship a merged pull request by day five, hit roughly 70–80% ramped by day 30, and use 30/60/90 goals to turn a vague first quarter into a measurable one."
category: "career-productivity"
tags: ["career", "developer-growth", "best-practices", "job-search"]
publishedAt: "2026-09-09"
seoTitle: "Your First 90 Days at a New Developer Job: A Plan"
seoDescription: "Ship a merged pull request by day five, hit roughly 70–80% ramped by day 30, and use 30/60/90 goals to turn a vague first quarter into a measurable one."
---

Short answer: aim for a merged pull request by day five, functional independence on routine tasks by day 30, and full productivity by day 90 — each backed by data showing structured onboarding gets developers there roughly twice as fast as an unstructured ramp. Nearly 28% of new hires quit within the first 90 days, and the top reasons are role clarity, missing relationships, and tool friction — all three are fixable with a plan, not luck.

## What should you set up in week one, and how do you read the codebase?

Get your environment fully working before you try to understand the architecture — you can't debug what you can't run. Clone the repo, get the local build passing, run the test suite once successfully, and get access to staging or a sandbox environment before end of week one.

```bash
# A reasonable day-one checklist for a new codebase
git clone <repo>
cat README.md CONTRIBUTING.md   # setup steps usually live here first
npm install && npm test          # or the repo's equivalent — confirm green before reading code
git log --oneline -20            # recent commits show what's actively changing
```

Once your environment works, read the codebase by following a real user request through the system rather than reading files top to bottom — pick one API endpoint or one UI action and trace it from entry point to database and back. That gives you a working mental model of one vertical slice, which is more useful in week one than a shallow pass over the entire repo.

## When should you ship your first pull request?

Day five is the benchmark worth aiming for, and it doesn't need to be architecturally significant — a documentation fix, a small test, or a one-line bug fix all count. The point isn't the size of the change, it's proving you can go from "has an idea" to "shipped and merged" inside the team's actual review and deploy process before week one ends.

The gap between the unstructured norm and a structured one here is large: the industry average time to a first meaningful commit runs 2–3 weeks, but teams with a deliberate onboarding process get new hires to a first commit in as little as four hours on day one. If your team hasn't handed you a starter task by day two, ask your manager directly for one small, well-scoped ticket — don't wait for it to surface on its own.

## How do you map the org and its stakeholders?

Identify the five people whose work directly touches yours — your reviewer, the person who owns the system you're modifying, whoever handles deploys, your manager, and one peer at your level — and have a short 1:1 with each in week one or two. The goal isn't networking for its own sake; it's knowing who to ask before you're stuck, since not knowing who owns a system is a common cause of the "tool friction" that drives early attrition.

Keep a running list of acronyms, internal tool names, and team names you don't recognize as you go — most onboarding friction is vocabulary, not skill, and a two-week glossary you build yourself closes that gap faster than waiting for it to become obvious.

## How do you set 30/60/90 day goals?

| Milestone | Target | What "on track" looks like |
|---|---|---|
| Day 30 | ~70–80% ramped | Handling routine tickets with light review; codebase navigation feels normal |
| Day 60 | 90%+ ramped | Taking on medium-complexity work with minimal hand-holding |
| Day 90 | Fully productive | Owning a feature or system area independently; onboarding others has started |

Write these down with your manager in week one rather than inferring them — a documented 30/60/90 plan gives you both a shared definition of "on track," which matters because vague expectations are one of the three biggest drivers of early quits. Structured onboarding overall correlates with about 50% higher new-hire productivity and 69% higher three-year retention compared to an unstructured ramp, which is the concrete payoff for doing this deliberately instead of hoping it works out.

## How do you ask questions without over-relying on your teammates?

Default to a 20-minute rule: spend up to 20 minutes trying to answer your own question — checking docs, searching the codebase, reading recent PRs — before asking a teammate, then ask anyway once you hit that limit. Asking too late wastes more time than asking too early; the rule exists to stop you from burning half a day silently stuck, not to gatekeep questions.

When you do ask, bring what you've already tried. "I checked the README and searched for this error, here's what I found — does this ring a bell?" gets a faster, better answer than an open-ended question, and it signals you're building independence rather than defaulting to relying on the same one or two people for everything.

## How do you safely use AI to onboard on an unfamiliar codebase?

Point an AI coding assistant at the specific files touching your task and ask it to explain the flow, not to write the change for you yet — in week one, understanding the existing pattern matters more than shipping fast. Treat its explanation as a hypothesis to verify against the actual code and a teammate, not as ground truth, especially for anything involving business logic an AI can't observe just by reading the repository.

The failure mode worth avoiding is using AI to generate a plausible-looking pull request for a system you don't understand yet — it can pass review by luck and still be the wrong fix, which costs you credibility faster than shipping nothing would have. For more on where AI coding assistants go wrong, see [our guide to common AI coding assistant mistakes](/en/posts/ai-coding-assistant-mistakes).

For the technical side of ramping up fast, [our advice on avoiding burnout](/en/posts/avoid-developer-burnout) covers the pacing question once the first-90-days sprint is over, and if you're navigating your manager relationship specifically, [our guide to managing up as a software engineer](/en/posts/managing-up-software-engineer) goes deeper. More career advice lives in [our Career & Productivity category](/en/category/career-productivity).

Sources: onboarding benchmark data aggregated from [Sourcegraph's 2026 developer onboarding guide](https://sourcegraph.com/blog/developer-onboarding) and the [28%-in-90-days attrition finding reported by HR Dive](https://www.hrdive.com/news/why-do-28-of-employees-quit-in-their-first-90-days-poor-onboarding-practi/441139/).

## Frequently Asked Questions

### How fast should a new developer ship their first pull request?

Day five is a reasonable target for any merged change, however small — a typo fix, a small test, or a one-line bug fix all count. The goal is proving you can complete the team's actual review and deploy process, not shipping something architecturally significant in week one.

### What percentage of new developers quit in their first 90 days?

Roughly 28% of new hires across roles quit within the first 90 days, and the top three reasons are unclear role expectations, a lack of built relationships with the team, and friction with tools or setup — all three are addressable with a documented onboarding plan.

### How long does it take a new developer to reach full productivity?

The industry average is 3–6 months, but companies with a structured onboarding process bring that down to 3–4 weeks for reaching a comparable productivity level. A documented 30/60/90 day plan is the single biggest lever for closing that gap.

### Is it safe to use AI coding assistants during onboarding?

Yes, for explaining existing code and speeding up your understanding of unfamiliar systems — but verify its explanations against the actual code and a teammate before trusting them, and avoid using it to generate pull requests for logic you don't yet understand yourself.
