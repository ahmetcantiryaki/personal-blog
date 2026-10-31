---
title: "Keep a Decision Log to Think More Clearly"
slug: "keep-a-decision-log-to-think-more-clearly"
translationKey: "build-a-decision-log-think-clearly"
locale: "en"
excerpt: "Short answer: record context, options, and expected outcome for every real decision; comparing it to reality weeks later reveals where memory lied."
category: "career-productivity"
tags: ["productivity", "time-management", "documentation", "career"]
publishedAt: "2026-10-31"
seoTitle: "How to Keep a Decision Log: Template and Guide"
seoDescription: "What is a decision log, what fields does it need, how does it differ from an ADR, and how can AI summarize it? A practical guide to thinking more clearly."
---

Short answer: a decision log is a short record you write for every meaningful decision, capturing the context, the options you weighed, your reasoning, and the outcome you expected. Comparing that note to what actually happened weeks or months later shows you how your memory distorts the decision — a distortion called hindsight bias.

## What is a decision log and why does memory lie?

A decision log is a record that freezes your thinking at the moment you make a decision and puts it in writing. The reason you need this is simple: human memory rewrites a decision after you learn its outcome, making it feel like "I knew it all along." [Hindsight bias](https://en.wikipedia.org/wiki/Hindsight_bias) is the tendency to see a past event as having been predictable or inevitable once you already know how it turned out.

The practical consequence shows up after a failed project: you say "I knew it was risky," but without a written record of your actual confidence level at the time, you can't verify that claim. A decision log closes exactly that gap — your real thinking at the moment of the decision gets locked in before hindsight can rewrite it.

## What fields should a decision log entry include?

An effective entry has six fields: context, options considered, the decision made, expected outcome, confidence level, and a review date. These six fields let you both understand the decision as it stood at the time and compare it to reality later.

| Field | What it captures | Example |
|---|---|---|
| Context | The situation requiring a decision | "Ship the API without versioning or with a /v1 prefix?" |
| Options | Alternatives considered | "No versioning, /v1 prefix, header-based versioning" |
| Decision | The chosen path and a short reason | "/v1 prefix — simplest for clients, least confusion" |
| Expected outcome | The assumed benefit of the decision | "Easy migration path if a second breaking change hits within 6 months" |
| Confidence level | A 1–5 subjective confidence score | "4/5" |
| Review date | The date you'll check the outcome | "May 2027" |

```markdown
## Decision: API versioning strategy
- Date: 2026-10-31
- Context: Shipping the first public API version.
- Options: (1) no versioning, (2) /v1 prefix, (3) header-based.
- Decision: /v1 prefix chosen.
- Reasoning: Least client-side complexity, version visible in logs.
- Expected outcome: No need for a second version before mid-2027.
- Confidence: 4/5
- Review date: 2027-05-01
```

## Where should you keep a decision log?

A notes app works fine for personal decisions; for engineering decisions, an Architecture Decision Record (ADR) stored in the repo fits better. The [ADR format](https://adr.github.io/) was proposed by Michael Nygard in 2011 and uses four fixed sections — Status, Context, Decision, and Consequences — with records typically running one to two pages and living in version control alongside the code.

The difference between a personal decision log and a team ADR comes down to audience: a personal log speaks only to your future self, while an ADR speaks to every engineer who will later touch the same codebase. Using the ADR format for architectural calls like [API versioning strategies](/en/posts/api-versioning-strategies) means you never have to re-explain the reasoning to someone who joins the team six months later.

## How do you compare predictions against reality?

When the review date arrives, reopen the entry and write the actual outcome next to the expected one — the gap between them shows how well-calibrated your confidence level actually is. If a third of your 5/5-confidence decisions turn out wrong, that's concrete evidence of a tendency toward overconfident predictions.

Someone who runs this comparison regularly learns two things over time: which kinds of decisions they're systematically too optimistic about, and which contexts their first instinct was actually reliable in. This is also an indirect tool for avoiding [developer burnout](/en/posts/avoid-developer-burnout) — the feeling of "why do I keep making bad calls" usually comes from a lack of records, not actual incompetence.

## How can AI help summarize a decision log?

Pasting your accumulated entries into Claude, ChatGPT, or Gemini and asking "which decision types am I systematically overconfident about but get a worse outcome on?" gives you a much faster pattern analysis than scanning entries by hand. It follows the same principle as [using AI to write a self-review](/en/posts/write-self-review-brag-doc-with-ai): you collect the raw material, and the assistant does the pattern-finding.

One thing to watch: scrub sensitive details (salary figures, names, customer data) before handing an assistant your raw entries — an anonymized version is usually enough for the summary to work.

## What mistakes should you avoid when starting a decision log?

The most common mistake is writing the entry days after the decision, once you already have a rough sense of the outcome — that lets hindsight bias leak straight into the log and defeats the whole exercise. Writing the entry at the moment of the decision, or at the latest the same day, is the only way to capture your actual confidence level.

The second mistake is trying to log every small decision. That turns into the reason people quit the habit, not a reason to keep it, because the log starts to feel like a chore. A practical threshold: log it if reversing the decision would take more than a day, or if the outcome will stay uncertain for more than six months.

The third mistake is skipping the review step entirely. Writing an entry and never reopening it turns the log into an archive instead of a log — the real value comes from the moment of comparing "what I thought" against "what actually happened."

## Should you keep a personal log or a team log?

Both serve a different purpose: a personal log improves your own decision quality, while a team log stops different people from repeating the same mistake. If a team folds lessons from a [blameless postmortem](/en/posts/how-to-run-a-blameless-postmortem) into the decision log, those lessons surface automatically the next time a similar decision comes up.

My take: most people keep a decision log for the first two weeks and then drop it, because the payoff isn't visible right away. The real value shows up three or four months later, when you go back and find a clear answer to "what was I actually thinking about this?"

## Frequently Asked Questions

### What's the difference between a decision log and an ADR?

A decision log can cover any personal or team decision and uses a flexible format; an ADR follows Nygard's fixed four-section format (Status, Context, Decision, Consequences) specifically for architectural and engineering decisions, stored alongside the code in the repo.

### Do you need to log every decision?

No — only decisions that are hard to reverse or whose outcome is uncertain. Logging low-stakes, easily reversible choices like where to eat lunch wastes time; the real value shows up for big, uncertain decisions.

### How often should you review a decision log?

Giving each entry its own review date works best, since some decisions resolve within a month and others take six. A fixed monthly review misses decisions that resolve on their own timeline, so reviewing per-entry gives more accurate results.

### How can AI help with keeping a decision log?

It can summarize accumulated entries and surface recurring patterns, like being consistently overconfident about a specific type of decision. You provide the raw decisions, and the assistant handles the pattern analysis — just scrub sensitive details before sharing them.
