---
title: "How Do You Pay Down Tech Debt Without Freezing Features?"
slug: "pay-down-tech-debt-without-freezing"
translationKey: "pay-down-tech-debt-without-freezing"
locale: "en"
excerpt: "Short answer: pay down tech debt with a fixed slice of capacity woven into feature work every sprint; big 'debt sprints' and full rewrites usually fail."
category: "software-engineering"
tags: ["legacy-code", "refactoring", "best-practices", "developer-experience"]
publishedAt: "2026-11-09"
seoTitle: "How Do You Pay Down Tech Debt Without Freezing Features?"
seoDescription: "Short answer: pay down tech debt with a fixed slice of capacity woven into feature work every sprint; big 'debt sprints' and full rewrites usually fail."
---

Short answer: pay down tech debt by budgeting a fixed slice of capacity (roughly 15–20%) in every sprint and weaving it into feature work, not by running a separate "debt sprint" or a big rewrite project. Ward Cunningham's original 1992 metaphor wasn't about debt being bad — it was about early delivery carrying a cost that has to be repaid regularly, and that framing still holds up in 2026.

## Why do big rewrites usually fail?

Rewriting a system from scratch means rediscovering the implicit business rules that accumulated over years — rules that are rarely written down anywhere, only hidden in the old code's behavior. Feature development either stops during the rewrite, or you end up maintaining two codebases in parallel — both options frustrate the business side, and the longer the project runs, the higher the risk it gets abandoned partway through.

## Why don't "debt sprints" work?

Setting aside a dedicated multi-week "debt-paydown sprint" sounds appealing, but it has two problems: the business side sees that stretch as "no visible features," making it harder to approve the next time, and debt doesn't accumulate in one lump — it builds up continuously, so code cleaned up in one sprint gets dirty again six months later because the process that created it never changed. Continuous, small, feature-embedded repayment avoids both problems.

## How should you classify technical debt?

Martin Fowler's 2009 Technical Debt Quadrant sorts debt along two axes: whether it was taken on deliberately or inadvertently, and whether the choice was prudent or reckless.

| Type | Description | Example |
|---|---|---|
| Deliberate + prudent | The team knowingly accepts the cost | "We don't have time to design this properly before release, and we know it" |
| Deliberate + reckless | Good practice is skipped on purpose, with no plan to come back | "Someone will fix it later" |
| Inadvertent + prudent | Good engineers miss something, then learn and fix it | Code gets updated once a new constraint surfaces |
| Inadvertent + reckless | The team doesn't recognize the risk, caused by a skill or discipline gap | A critical module with no tests at all |

Fowler himself wrote that he couldn't fully reconcile the fourth cell (inadvertent + prudent) with a financial-debt parallel — it's better to treat this quadrant as a framing for discussion, not a precise measurement tool.

## What's the difference between local and systemic debt?

Local debt is confined to a single function or module, and whoever next touches that piece can notice and fix it. Systemic debt comes from an architectural decision — a poorly chosen data model, say — and spreads throughout the codebase; fixing it doesn't happen in one PR, it needs a staged plan. Keeping both on the same list at the same priority level leads teams to underestimate systemic debt.

## What does it take to make debt visible?

A "debt register" — a simple spreadsheet or issue-tracker label — should record three things for every debt item: what accumulated, which file or module, and an estimated "interest" (how much extra time this costs every sprint if left unpaid). A debt list with no interest estimate turns into noise during prioritization, because every item looks equally urgent.

## How do you weave boy-scout and strangler-fig tactics into feature work?

The boy-scout rule is simple: every time you touch a file, leave it a little better — rename something, delete dead code, add one test. This needs no separate PR; it fits naturally inside the feature PR you're already writing. The strangler-fig tactic works for bigger, systemic debt instead: rather than replacing an old module all at once, you gradually route new traffic to the new implementation and "strangle" the old code step by step. Our piece on [taming a legacy codebase with the strangler-fig pattern](/en/posts/taming-legacy-codebase-strangler-fig) walks through this tactic in detail, and our [guide to refactoring legacy code](/en/posts/how-to-refactor-legacy-code) covers practical ways to refactor in small, safe steps.

```text
Example sprint allocation (2-week sprint, 10 person-days of capacity):
- 80% (8 days): feature work
- 15% (1.5 days): debt repayment (pre-selected, highest-interest items)
- 5% (0.5 day): boy-scout fixes (small improvements in touched files)
```

## What does a debt register entry actually look like?

Instead of a vague "code quality is low" note, every entry should fill in three fields: location, estimated interest, and a proposed fix. A row like the ones below can be prioritized in minutes during sprint planning; a vague note usually just sits on the list because nobody can compare it against anything else.

| Location | Estimated interest | Proposed fix |
|---|---|---|
| `PaymentService.java` | 3 days of manual testing per change | Add unit tests, isolate mocks |
| `legacy/report-engine` | Every new report type takes 2x longer | Migrate the template engine to the new API |
| `users` table schema | Adding a new field makes migrations risky | Normalize, split into a separate preferences table |

## How do you measure whether debt repayment is working?

Three metrics are enough to prove debt repayment is paying off: time taken for the same kind of change (how many days it takes to add a new API endpoint, say), defect rate in a given module (bugs opened in the last 3 months), and time spent in code review. Comparing these before and after a round of debt repayment turns a subjective claim like "code quality improved" into a concrete result like "adding this kind of endpoint dropped from 4 days to 1.5." That number becomes your strongest argument the next time you need to get a debt-repayment request approved.

## How do you frame debt to get business buy-in?

"Let's improve code quality" means nothing to the business side. "This module has no tests, so every change needs three days of manual QA, which cuts our release speed in half" is a concrete delivery risk. Tying debt to a delivery risk — delay, defect rate, development speed — wins far more budget than a "tidiness" argument ever does.

## Who should defend debt-repayment capacity — a tech lead, or every engineer?

Both, but at different levels. A tech lead or engineering manager is responsible for defending the fixed slice of sprint capacity (say, 15%) against the business side — that's a recurring budget negotiation, usually settled with a product manager. Every engineer, meanwhile, is responsible for applying the boy-scout rule in daily work: leaving a touched file a little better needs no separate approval. The two reinforce each other; a top-down "15% for debt" policy alone isn't enough if engineers skip small improvements day to day, because most systemic debt accumulates from thousands of small local decisions, not one big one.

My honest take: the term "technical debt" gets used too loosely today — any piece of code someone dislikes gets labeled "debt." Cunningham's original idea was narrower: a deliberate trade-off, an investment made knowing it would be paid back. Bringing that precision back makes a debt list far easier to take seriously.

## Frequently Asked Questions

### When was the term technical debt first coined, and by whom?

Ward Cunningham introduced the term in 1992, in an OOPSLA experience report about the WyCash portfolio-management system. His original meaning was narrower than today's: early delivery was like a loan, one meant to be paid back through timely refactoring — a more deliberate trade-off than the term usually implies now.

### Does the strangler-fig tactic apply to every kind of tech debt?

No, it works best for large, systemic debt — for instance, when replacing an old module all at once would be too risky. For small, local debt items, the boy-scout rule (improve the file you're already touching) is usually a faster and sufficient fix.

### Are debt sprints always a bad idea?

Not always — a one-off cleanup with a clear scope, like a major library upgrade, can justify a dedicated sprint. But a recurring "debt week" model usually fails, because debt accumulates continuously in small pieces and isn't permanently solved by periodic big cleanups.

### Why doesn't a debt list without interest estimates work?

Without an interest estimate — how much time this item costs every sprint if left unpaid — hundreds of items on a list all look equally important, and the team can't tell what to tackle first. An interest estimate turns prioritization from a subjective argument into a concrete ranking.
