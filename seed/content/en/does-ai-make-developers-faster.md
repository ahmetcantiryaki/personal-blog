---
title: "Does AI Really Make Developers Faster?"
slug: "does-ai-make-developers-faster"
translationKey: "ai-productivity-paradox"
locale: "en"
excerpt: "METR's RCT found developers were 19% slower with AI while feeling 20% faster. July 2026: the evidence, the conflicting data, and how to measure your own speed."
category: "career-productivity"
tags: ["productivity", "ai-coding", "developer-experience", "code-quality", "best-practices"]
publishedAt: "2026-07-13"
seoTitle: "Does AI Really Make Developers Faster?"
seoDescription: "Does AI coding really speed developers up? A look at METR's 19% slowdown, the McKinsey and GitClear data, and a checklist to measure your own throughput."
---

Does AI make developers faster? The most rigorous evidence we have, METR's 2025 randomized controlled trial, found the opposite: experienced open-source developers completed tasks 19% slower with AI tools, yet believed they had worked 20% faster. A February 2026 methodology update softened that number, but the "feels fast, ships slow" paradox is still standing.

## What the evidence says: METR's randomized trial

[METR's July 2025 study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) is the most striking result in this space because it is a real experiment, not a survey. Sixteen experienced developers completed 246 real tasks on their own mature open-source projects. Each task was randomly assigned to one of two arms: one where AI tools were allowed, one where they were forbidden.

The result inverted expectations. Before starting, developers predicted AI would speed them up by 24%. When the study ended, they still believed AI had sped them up by 20%. Yet the measured times showed tasks took 19% longer when AI was allowed. The gap between perception and reality was nearly 40 points.

This does not mean "AI does not work." It means experienced developers, working in a familiar codebase, systematically overestimate their own speed. The psychology is intuitive: time spent waiting on a model's response feels like progress, while reading and fixing the generated code quietly eats the clock in the background.

## Why METR revised 19% down to about −4%

Here is where the nuance begins. In its [February 24, 2026 update](https://metr.org/blog/2026-02-24-uplift-update/), METR acknowledged that the original 19% figure looked more precise than the data warranted. When they re-ran the experiment, two different results emerged: the arm with the same original developers still showed an 18% slowdown (confidence interval −38% to +9%), but the arm with newly recruited developers showed an effect of only about −4% (confidence interval −15% to +9%). That second interval straddles zero, so "no clear effect" is the honest reading.

The problems that drove the revision are methodological; they do not erase the finding:

- **Selection bias.** Developers increasingly declined to work without AI, so the people most optimistic about the tools were systematically excluded from the sample.
- **Task selection effects.** Between 30% and 50% of developers said they chose not to submit some tasks because they did not want to do them without AI.
- **Pay change.** The hourly rate dropped from $150 to $50, which shifted who took part.
- **Measurement reliability.** Time tracking became unreliable once developers ran several agents in parallel and switched to unrelated work while waiting.

In METR's own words, the data offers "only very weak evidence" for a true productivity gain. So the honest summary is this: no solid evidence shows AI clearly speeds up experienced developers, but the clean slowdown headline is no longer as strong as it first read either.

## What about the "46% time savings" claims?

The other camp reports much brighter numbers. [McKinsey's research](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/unleashing-developer-productivity-with-generative-ai) found serious savings on controlled tasks: 45–50% for code documentation, 35–45% for writing new code, and 20–30% for refactoring. But the same study carries a sharp caveat: on high-complexity tasks where the developer was unfamiliar with the framework, savings shrank to under 10%.

The difference lies in what gets measured. McKinsey timed isolated, lab-style tasks; METR timed end-to-end flow in a real repository. Writing a function from scratch can speed up, while fitting that code into an existing system, reviewing it, and fixing it can slow down.

[GitClear's 2025 report](https://www.gitclear.com/ai_assistant_code_quality_2025_research) measures that second half. Across 211 million changed lines, it found that copy-pasted ("cloned") code blocks quadrupled, with the share of copied lines rising from 8.3% in 2021 to 12.3% in 2024. Over the same period, refactoring fell from 25% of changed lines to under 10%. Code churn — lines reworked within two weeks of being committed — climbed from 3.1% in 2020 to 5.7% in 2024. In short: more code is produced, less of it is refactored, and more of it is copied.

| Source | Setup | Headline number | What it measures |
|---|---|---|---|
| METR (Jul 2025) | 16 experienced devs, 246 real tasks, RCT | 19% slower (CI +2% to +39%) | Task completion time in a real repo |
| METR update (Feb 2026) | Newly recruited arm | ~−4% (CI −15% to +9%) | Same measure, selection bias corrected |
| McKinsey (2023) | Controlled lab tasks | 20–50% time savings | Isolated task time (new code, refactor, docs) |
| GitClear (2025) | 211M changed lines | 4x code cloning | Code quality and churn |

## Why "feels fast, ships slow" happens

Why does the same tool feel like savings to one person and a burden to another? Three mechanisms stand out.

**Review load.** AI makes writing code cheap; it does not make reading it cheap. Every generated line still has to be reviewed. As the cost of production drops, the total work shifts from writing toward reviewing. As we cover in our roundup of [mistakes developers make with AI coding assistants](/en/posts/ai-coding-assistant-mistakes), the most expensive error is approving code that looks plausible but is quietly wrong.

**Rework.** GitClear's churn data shows exactly this: some of the quickly generated code comes back within two weeks. The half hour you save today can be repaid next week as a debugging session.

**Context switching.** Tabbing away while a model responds feels productive, but every return means rebuilding your mental context. That cost grows with the number of parallel agents — which is precisely what made METR's time tracking so hard.

## Measure your own productivity

General studies may not hold for your team. The only honest answer is to measure your own data. These three metrics, compared across two-week sprints run with AI on and off, are enough for most teams:

| Metric | How to measure | Healthy sign | Warning sign |
|---|---|---|---|
| Cycle time | Time from first commit to merge | Drops noticeably with AI | Flat or rising |
| Review load | Review time and comment count per PR | Stays flat | PRs balloon, review drags on |
| Rework rate | Share of code changed or deleted within 2 weeks | Under 5% | Climbing toward GitClear's 5.7% for 2024 |

The key point: do not just look at "how much code I produced" or "how fast I felt." Measure the value shipped. If cycle time drops but churn rises, you are handing back the time you thought you saved to rework.

## Where AI genuinely does speed things up

Let me be direct: I think both "AI speeds everyone up" and "AI slows everyone down" are the wrong frame. The right question is "who, on which task." Where the evidence converges is here: AI wins clearly on work that is cheap to verify and low on familiarity, and usually becomes a drag on work that is expensive to verify and high on familiarity.

Concretely, the areas where AI demonstrably helps: scaffolding code in an unfamiliar language or framework, drafting documentation and tests, one-off scripts, explaining an error message, sketching a regular expression or a SQL query. In these cases the output is either obviously correct or quickly tested. We stress this same task-selection logic in our guide to [learning to code faster with AI](/en/posts/learn-coding-with-ai).

By contrast, critical business logic, deep changes in a tightly coupled architecture, and security-sensitive code are places where human verification is expensive; there, writing a clear spec first is faster than generating roughly and fixing afterward. [Spec-driven development](/en/posts/spec-driven-development-end-of-vibe-coding) fills exactly that gap. This piece is the evidence-and-debate view; for the daily workflow, our guide on [boosting developer productivity with AI tools](/en/posts/developer-productivity-ai-tools) has the practical steps. For more on this theme, see our [career and productivity category](/en/category/career-productivity).

## Frequently Asked Questions

### Does the METR study say AI does not work?

No. It shows that experienced developers overestimate their speed in familiar codebases. The original finding was a 19% slowdown; the February 2026 update pulled the newly recruited arm to about −4%, with a confidence interval that straddles zero. The right reading is "no clear speedup was proven," not "AI is useless."

### Then why did McKinsey find 45–50% savings?

Because it measured something different. McKinsey timed isolated, lab-style tasks, while METR timed end-to-end flow in a real repository. Writing new code can speed up, but fitting it into an existing system, reviewing it, and fixing it can pull total time back the other way.

### How do I measure this on my own team?

Run two weeks with AI on and two weeks with measured use, then compare three things: cycle time, review load per PR, and rework rate within two weeks. Look at value shipped and kept, not just the volume of code produced.

### Where does AI speed things up the most?

On work that is cheap to verify and low on familiarity: scaffolding, documentation, test drafts, one-off scripts, regular expressions, and SQL sketches. For critical business logic and tightly coupled architectures, writing a spec first is usually faster.
