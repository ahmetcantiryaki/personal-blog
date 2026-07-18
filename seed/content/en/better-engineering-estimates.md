---
title: "How to Make Better Engineering Estimates"
slug: "better-engineering-estimates"
translationKey: "engineering-estimates"
locale: "en"
excerpt: "Why does a boring three-day task turn into three weeks? A field-tested method for ranges, decomposition, and calibrating estimates on real team data."
category: "career-productivity"
tags: ["career", "productivity", "best-practices", "communication"]
publishedAt: "2026-07-18"
seoTitle: "How to Make Better Engineering Estimates"
seoDescription: "Why does a boring three-day task turn into three weeks? A field-tested method for ranges, decomposition, and calibrating estimates on real team data."
---

A single-number estimate isn't more accurate than a range — it's just a range someone rounded off under pressure and forgot to mention. Better estimates come from giving ranges instead of point numbers, breaking work into pieces small enough to be boring, and tracking your own team's estimate-versus-actual data over time.

Here's the story that taught me this the hard way. I told a planning meeting "add the integration endpoint, three days." It sounded boring in the good sense: copy an existing pattern, map the fields, write the tests. Three weeks later it still wasn't done. The gap lived in one question nobody asked out loud: what's the rate limit on the third-party API. Questions we don't ask become assumptions that never made it into the estimate, and every one of them detonated once the work actually started.

## Why Estimates Blow Up

Bad estimates rarely come from bad intentions — they come from four habits repeating themselves. First, unstated assumptions: "test data will be ready," "design will be signed off" get baked into the number without anyone saying them out loud. Second, ignored unknowns — the integration, the legacy module, the third-party service we wave away with "probably fine." Third, optimism bias, which is just how the brain works: it pictures finishing the task, not the friction along the way. Fourth, sizing only the happy path — error handling, backward compatibility, review rounds, and post-deploy monitoring never make it into the number at all.

Steve McConnell makes the case in *Software Estimation: Demystifying the Black Art* that this isn't random error, it's a systematic bias — which means "just be more careful" doesn't fix it, changing the method does ([Microsoft Press excerpt](https://www.microsoftpressstore.com/articles/article.aspx?p=2191414&seqNum=3)). Writing this in July 2026, most teams still hand over a gut-feel date and then watch it calcify into a promise, when a range given on day one, with the exact same information, would have left them in a far more defensible spot.

## Relative Sizing Beats Raw Hours

"This will take 14 hours" sounds precise, but it carries zero information about the odds behind it. Relative sizing — this is roughly like the thing we shipped last month, which took that long, so this should land near there too — tends to beat raw-hour guessing because people are better at comparing than at estimating absolutes. "About the size of last sprint's profile endpoint" is less misleading than "6 hours" because the reference point is concrete and arguable, which is a feature, not a bug.

The real payoff shows up in the conversation it forces: once you're sizing relatively, the team starts asking whether this task genuinely resembles the reference one, or just looks similar on the surface while hiding different complexity underneath. That argument is usually the most useful five minutes of the whole estimation meeting.

## Give a Range, Not a Single Number

A single number doesn't deliver certainty — it delivers the illusion of certainty. McConnell's recommendation is blunt: estimate with a low-high range, because it both improves accuracy and acts as a political buffer that keeps the estimate from hardening into a promise ([the book's O'Reilly page](https://www.oreilly.com/library/view/software-estimation-demystifying/0735605351/)). "3–5 days" looks less confident than "4 days," but it reflects reality more honestly — and when someone inevitably asks "okay, but what's the real number," you get to insist they plan against the high end, not the middle.

| Approach | Accuracy | Effort to Produce | Political Risk |
|---|---|---|---|
| Point estimate ("4 days") | Low — hides the uncertainty | Very low, said off the cuff | High — hardens into a promise instantly |
| Range ("3–5 days") | Medium — surfaces the uncertainty | Low, needs a little thought | Medium — still gets negotiated down |
| Decomposed range (subtasks + summed range) | High — each piece is independently checkable | High, needs real analysis | Low — the range comes with a paper trail |

The point of the table isn't that accuracy and effort trade off cleanly — it's that extra effort buys you a number you can actually defend. When the deadline is consequential, the third row is worth the time.

## Decompose Until the Work Is Boring

By "boring" I mean each subtask is small and concrete enough that there's little room left for anything to go sideways. "Payment integration" isn't boring — it's hiding ten surprises inside one line item. "Add webhook signature verification," "write retry logic for failed charges," "pass three sandbox test scenarios" — those are boring, because each one is small enough to reason about on its own.

Construx's "cone of uncertainty" describes exactly this mechanism: uncertainty narrows as you define the work, meaning it shrinks when you make decisions and decompose the task, not simply because time has passed ([Construx's explainer](https://www.construx.com/resources/software-developments-cone-of-uncertainty/)). The practical implication is that the estimate you give at kickoff should get revised two weeks in, once you actually know more — it's a working number, not a stone tablet. Nailing down scope during RFC writing is usually the first real decomposition pass; we cover that in [how to write an engineering RFC](/en/posts/how-to-write-engineering-rfc).

## Calibrate Against Your Own History

A team lead I know once told me: "We thought we were already padding for optimism — we just never measured how much." Once they started logging estimate-versus-actual per sprint, the pattern was concrete: backend work ran about 20% over, integration work almost double. That number did more for their planning than any amount of "try to be more careful," because now they had an actual correction factor instead of a vibe.

That's the core of what McConnell calls calibration: estimating against your own team's historical data is far less subjective than borrowing an industry average or trusting a gut feeling. Teams that don't track this repeat the same optimism-bias mistake sprint after sprint; teams that do track it visibly get more accurate over time. This discipline runs in the same family as code review discipline — both improve through a repeated feedback loop, not a one-time act of good intentions; see [how to run effective code reviews](/en/posts/effective-code-reviews).

Calibration has a side benefit worth naming: teams that consistently underestimate, then scramble to defend the number anyway, burn out faster than teams that give themselves an honest range. Constantly racing a calendar you never agreed to is a chronic stress source in its own right — we go deeper on that in [how to avoid burnout as a developer](/en/posts/avoid-developer-burnout).

## An Estimation Checklist

Before your next estimation meeting, run the work through this: Does it contain an assumption nobody's said out loud? Did you size error handling, tests, review cycles, and deploy monitoring, or only the happy path? Could you give a range instead of a single number? Would decomposing further actually narrow that range, or just add busywork? Have you shipped anything comparable before, and how long did that actually take? Is there a checkpoint on the calendar to revisit this number once you know more?

When someone under deadline pressure demands a single number anyway, a few lines that tend to work: "I can give you one number, but then you're the one who picked which end of the range to plan against — I'll say 3 to 6, you tell me which side matters more to you." Or: "Given what we know right now, the honest answer is a range; close two of these unknowns and I'll narrow it in two days." Managing exactly this kind of pushback is a big part of the job once you're past senior — our guide to the [staff engineer path](/en/posts/staff-engineer-career-path) covers how that shows up in scope and estimation conversations specifically.

## Frequently Asked Questions

### Doesn't giving a range just sound like "I don't know"?

It's the opposite. A range is an honest report of exactly what you do and don't know, compressed into two numbers. "I don't know" refuses to answer; a range answers precisely, which is why most stakeholders trust a clear range more than false confidence dressed up as a single date.

### What if our team has no historical estimate-versus-actual data yet?

Start today. Log the estimate and the actual time for every task you close out; after two or three sprints you'll have your first real correction factors. Waiting for a perfect tracking system before you start is worse than starting with a spreadsheet.

### We use story points already — does any of this still apply?

Yes, story points are already a form of relative sizing. What changes is converting points to calendar time using a range instead of one fixed multiplier, and tracking your velocity data specifically to calibrate that conversion, not just to fill a burndown chart.

### Leadership always wants one date and won't accept a range — now what?

Present the top of your range as the committed date and the bottom as the "if everything goes right" case. It reads like a single number to anyone skimming the roadmap, but you've quietly put the risk on the correct side of the ledger.
