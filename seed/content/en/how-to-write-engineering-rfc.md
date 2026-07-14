---
title: "How to Write an Engineering RFC"
slug: "how-to-write-engineering-rfc"
translationKey: "how-to-write-rfc"
locale: "en"
excerpt: "After watching dozens of internal RFCs live or die, the lesson isn't idea quality — it's how honestly the options section handles tradeoffs and non-goals."
category: "career-productivity"
tags: ["technical-writing", "documentation", "communication", "best-practices", "career"]
publishedAt: "2026-07-14"
seoTitle: "How to Write an Engineering RFC: Template and Guide"
seoDescription: "What separates RFCs that ship from ones that stall: context, non-goals, honest option tradeoffs, a decision, and rollout. Copy-paste template included."
---

The short answer to how to write an engineering RFC: put context, goals, options, and risks into one skimmable document. But that answer means little until you've watched dozens of RFCs die inside a company. This piece collects field notes on what separates the ones that shipped from the ones that stalled.

## When an RFC is actually worth writing

Not every decision needs an RFC. For changes that stay inside one team's boundary, are cheap to reverse, and carry low risk, writing an RFC is a waste of time — a Slack message or a short meeting will do. RFCs earn their keep when a decision carries at least two of these three traits: expensive to reverse, affects multiple teams, or creates a constraint the organization will live with for a long time. In short: if getting it wrong is expensive, write the RFC.

## The template: from context to rollout

Nearly every RFC that actually shipped shares the same skeleton, and the order matters — each section sets up the next:

1. **Context**: What's the problem, why does it matter now, who's affected. Assume the reader has zero prior context.
2. **Goals / Non-Goals**: What this RFC is trying to solve, and what it deliberately leaves out. The non-goals section is the most-skipped and most-critical part.
3. **Options with tradeoffs**: At least two, ideally three options — including "do nothing" as a legitimate option. Cost, risk, and benefit for each.
4. **Decision**: Which option was chosen and why. This is the moment the RFC turns from a draft into a decision record.
5. **Risks**: Known weak points of the chosen approach, failure scenarios.
6. **Rollout**: How the change ships — phased, behind a feature flag, and what the rollback plan is.

## Why writing is the highest-leverage Staff-track skill

This claim isn't abstract: per [jobsbyculture's 2026 Staff Engineer guide](https://jobsbyculture.com/blog/staff-engineer-career-path-2026), the ability to communicate complex technical ideas in clear writing is the most underrated skill on the Staff track. The reason is simple — code doesn't persuade a team, doesn't explain the reasoning behind a decision, doesn't compare alternatives. An RFC is the one document type built to do exactly those three things.

Rust's own [RFC process](https://github.com/rust-lang/rfcs) follows the same discipline: every major language change gets written as an RFC first, the community debates it, and a core team makes the final call. The process looks slow, but it prevents decisions from being relitigated later — because the debate is already on the record.

## Writing for skimmers

The number of people who read an RFC start to finish is always smaller than the number who comment on it. Most stakeholders open a document to skim: they scan the title, the summary paragraph, and any tables or bullet points, then decide whether to go deeper or move on. Instead of fighting that behavior, write for it — put a one-sentence summary at the top of each section, prefer tables over long paragraphs, and add a three-to-four-sentence TL;DR at the very top of the document. For broader principles on technical readability, see our [guide to writing documentation](/en/posts/how-to-write-documentation).

## Running async review and closing the debate

Most RFCs die in comment threads, not in meetings. The typical failure mode: the RFC gets shared, a few comments trickle in, the discussion branches, nobody closes the decision, and the document is quietly abandoned. Three practical fixes:

- **Set a clear review window**: "This RFC is open until [date]; the decision will be made with the feedback available at that point." An unbounded review period is an unbounded delay.
- **Classify comments**: separate blocking from non-blocking feedback. If everyone gets veto power over every detail, nothing ever closes.
- **The author owns the decision**: rather than waiting for consensus, the RFC author listens to all input and then makes the final call, documenting the reasoning. An RFC is a decision record, not a vote.

## Recording the decision

The most common mistake after an RFC gets approved is leaving the document as-is. An accepted RFC should remain the permanent record of the decision — its status should move from "Draft" to "Accepted" or "Superseded," and the decision should be linked from the relevant codebase, wiki, or project tracker. Someone asking "why did we decide this" six months later should be able to check one document instead of digging through chat history.

## Comparing RFCs that shipped vs. stalled

| Trait | RFC that shipped | RFC that stalled |
|---|---|---|
| Non-goals section | Present, draws clear boundaries | Missing or vague |
| Number of options | 2–3, including "do nothing" | Single solution, no alternative |
| Review window | Fixed end date | Open indefinitely |
| Comment classification | Blocking vs. non-blocking | Every comment weighted equally |
| Decision ownership | Author closes it out | Consensus expected, never arrives |
| Closure | Status updated, decision linked | Document quietly abandoned |

## Anti-patterns to avoid

- **Solution-first writing**: writing the RFC to justify a decision that's already been made. This turns the discussion into theater and suppresses genuine feedback.
- **Skipping non-goals**: without a scope boundary, everyone adds their own pet concern to the RFC and it never converges.
- **Unbounded scope**: trying to solve architecture, roadmap, and org structure in a single RFC. Narrow the scope — writing a second RFC is always cheaper than bloating the first one.

Here's my observation: even the most technically correct RFCs stall without a non-goals section, because that's exactly when everyone starts loading their own agenda onto the document. Drawing the boundary takes more effort than the idea itself — but the payoff is a decision that actually closes.

## A common trap: owning the decision without losing transparency

Saying the author should own the decision doesn't mean deciding behind closed doors. In a healthy process, the RFC author folds every objection that came in into the "Decision" section as a short note: "Option X was considered and rejected because Y." That one-line transparency prevents the same objection from resurfacing six months later — because the answer is already on the record.

## Fill-in template

```
# RFC: [Title]
Status: Draft | Review | Accepted | Superseded
Author(s):
Date:

## Context
[What's the problem, why now]

## Goals
- ...
## Non-Goals
- ...

## Options
### Option A: [name]
Cost / Risk / Benefit

### Option B: [name]
Cost / Risk / Benefit

## Decision
[Chosen option and reasoning]

## Risks
- ...

## Rollout
[Phases, rollback plan]
```

The RFC-writing habit is one of the highest-leverage signals on the path to Staff — we covered that connection in more depth in our [Staff engineer path guide](/en/posts/staff-engineer-career-path).

## Frequently Asked Questions

### Should I write an RFC for every technical decision?

No. Write one when the decision is expensive to reverse, affects multiple teams, or has long-term consequences. For low-risk, single-team decisions, a Slack message is enough.

### How many options should an RFC present?

At least two, ideally three — include "do nothing" as an option. An RFC that presents only one option is usually an attempt to justify a decision that's already been made, and it blocks genuine discussion.

### How long should the review window be?

Proportional to the decision's impact, but one to two weeks is usually enough. A review window left open indefinitely means an indefinite delay — set a firm end date.

### Who makes the final call, and do you need consensus?

Waiting for consensus rarely works. The healthiest model is the RFC author listening to all feedback and then making the final decision, documenting the reasoning in writing. See how the RFC habit ties into your promotion case in our [career and productivity category](/en/category/career-productivity).
