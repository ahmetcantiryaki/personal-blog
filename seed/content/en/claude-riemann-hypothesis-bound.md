---
title: "Claude Just Raised the Riemann Hypothesis Bound to 67%"
slug: "claude-riemann-hypothesis-bound"
translationKey: "claude-riemann-hypothesis-bound-2026"
locale: "en"
excerpt: "An unreleased Claude model raised the proven lower bound for Riemann zeta zeros on the critical line from 41.6% to 67.2%, verified by outside mathematicians."
category: "ai"
tags: [claude, ai-agents, machine-learning, ai-coding]
publishedAt: "2026-09-28"
seoTitle: "Claude and the Riemann Hypothesis: What 67.2% Means"
seoDescription: "Anthropic says an unreleased Claude model pushed the Riemann zeta critical-line bound from 41.6% to 67.2%, using 60 subagents. Here's what actually happened."
---

Short answer: Anthropic says an unreleased Claude model raised the proven lower bound for Riemann zeta zeros on the critical line from 41.6% to 67.2%, a figure that had stood for decades. It didn't solve the Riemann hypothesis, but Oxford's James Maynard called the underlying idea genuinely new.

## What did Claude actually prove?

Claude improved a specific, narrower result tied to the Riemann hypothesis, not the hypothesis itself. The Riemann hypothesis, posed in 1859, claims that every non-trivial zero of the Riemann zeta function has real part exactly 1/2 — sitting on what mathematicians call the "critical line." Nobody has proven that for all zeros, so mathematicians instead prove lower bounds: a guaranteed percentage of zeros that must lie on that line, even without knowing about every single one.

Anthropic reports that an unreleased Claude research model raised that guaranteed percentage from 41.6% to 67.2%, using a new argument that mathematicians hadn't found on their own.

## How is that different from solving the Riemann hypothesis?

Proving the hypothesis would require showing 100% of zeros sit on the critical line, for every one of infinitely many zeros — a full proof, not a statistical bound. The 67.2% figure only guarantees that at least that share of zeros lies on the line; it says nothing about the rest, and it doesn't rule out a counterexample turning up among them.

The Riemann hypothesis remains open. It's one of the seven Clay Millennium Prize Problems, carrying a $1 million reward, and Claude's result doesn't touch that prize — the work published so far addresses a well-known, decades-old sub-problem instead.

## How did Claude arrive at the result?

According to Anthropic, an Anthropic staff member, Jarred Sumner, prompted Claude — running inside Claude Code — to attempt the Riemann hypothesis and then left the actual mathematical decisions to the model. The first attempt failed outright: Claude generated and tested 650 different approaches, and none of them worked.

Told to try again, Claude spent roughly a day and a half coordinating around 60 subagents in parallel, which between them ran about 2,400 shell commands and wrote hundreds of Python scripts to test ideas computationally before committing to one. That's a workflow closer to a research lab running many simultaneous experiments than a single model writing a proof line by line.

| Milestone | Proven lower bound | Who / when |
|---|---|---|
| Levinson's theorem | ~34.7% | Norman Levinson, 1974 |
| Conrey-era refinements | ~41.6% (held for decades) | Brian Conrey and successors, late 1980s–2000s |
| Claude research model | 67.2% | Unreleased Claude, via Claude Code, September 2026 |

## Who verified the result, and what did they say?

Anthropic says the proof was checked internally by two in-house mathematicians, with an independent external review from Brian Conrey and Dan Goldston — two of the mathematicians whose own earlier work set the previous 41.6% bound. Claude produced both a human-readable version of the proof and a separate, formally verifiable version, which makes independent checking easier than reviewing free-form prose alone.

Oxford mathematician James Maynard, commenting publicly on the result, said: "The problem was in need of a new real idea, which this new result seems to provide," adding that "it seems that the AI has made a genuinely interesting mathematical contribution." That's a stronger endorsement than a typical "AI got a number right" story — Maynard is crediting the model with a new mathematical idea, not just a faster calculation.

## Why does the process matter more than the number?

The interesting part for developers isn't the specific 67.2% figure — it's that a coding agent, given a hard, open-ended research problem and no algorithm to follow, organized its own exploration at scale: hundreds of failed ideas discarded, dozens of subagents run in parallel, thousands of shell commands, and a final result checked well enough that specialists in the field are willing to put their name behind calling it "genuinely interesting."

Our take: this reads less like "Claude did math" and more like a preview of how agentic coding tools will get used for open research questions generally — throwing compute and parallel exploration at a problem where no one has a proven approach yet, then having domain experts validate whichever branch actually worked. The same orchestration pattern — many subagents, thousands of tool calls, structured verification at the end — shows up in production agentic coding today; we cover how Claude Code handles that kind of subagent coordination in [our comparison of Claude Code, Cursor and Antigravity](/en/posts/claude-code-vs-cursor-vs-antigravity-2026).

## What does this mean for AI-assisted research generally?

It's one data point, not a trend line, but it lands alongside other 2026 claims from Anthropic about Claude contributing to R&D work and even biology research — we look at that broader claim, including how much of it is independently verifiable, in [our piece on Claude's expanding role in Anthropic's own R&D](/en/posts/ai-building-itself-claude-26-percent-rnd). For a working developer, the more immediately useful signal is what the workflow looked like: a model given a vague, hard goal, allowed to fail hundreds of times, and coordinated through subagents and shell access rather than a single long chat turn — the same pattern behind [building your first MCP connector](/en/posts/build-your-first-mcp-connector) or running [Claude Code's own subagents](/en/posts/claude-code-subagents-background-agents) on ordinary engineering work.

As of September 2026, this result hasn't been published in a peer-reviewed journal — it's gone through Anthropic's internal review plus informal review by named outside mathematicians, which is faster but less formal than the usual academic publication cycle. Treat "verified" here as "checked by credentialed mathematicians who put their names on a public comment," not as "published and cited."

## Frequently Asked Questions

### Did Claude solve the Riemann hypothesis?

No. Claude improved the proven lower bound for the share of zeros known to sit on the critical line, from 41.6% to 67.2%. The Riemann hypothesis itself — that 100% of zeros sit on that line — remains unproven, and the $1 million Clay Millennium Prize for a full proof is still unclaimed.

### What is the Riemann hypothesis, in plain terms?

The Riemann hypothesis, proposed in 1859, predicts that every non-trivial zero of the Riemann zeta function has real part exactly 1/2. It matters because a proof would tighten our understanding of how prime numbers are distributed, with consequences across number theory.

### Is Claude's result peer-reviewed?

Not in the traditional journal sense as of September 2026. Anthropic says it was checked by two in-house mathematicians and reviewed externally by Brian Conrey and Dan Goldston, with Oxford's James Maynard commenting publicly that the approach looks genuinely new — but it hasn't gone through a formal academic peer-review and publication cycle yet.

### Can I use Claude for my own research problems like this?

The specific research model used here is unreleased, but the workflow — giving a coding agent a hard, open-ended problem and letting it run many parallel exploratory attempts through subagents — is available today in Claude Code for engineering tasks, and the same orchestration ideas apply whether the problem is a math proof or a gnarly production bug.

**Sources:** [Anthropic — Claude's Riemann zeta result](https://www.anthropic.com/research/riemann-zeta), [TechSpot coverage](https://www.techspot.com/news/113472-anthropic-claude-tried-solve-riemann-hypothesis-found-something.html), [DataCamp explainer](https://www.datacamp.com/tutorial/claude-and-the-riemann-hypothesis).
