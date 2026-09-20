---
title: "AI That Builds Itself: Claude Now Does 26% of R&D"
slug: "ai-building-itself-claude-26-percent-rnd"
translationKey: "ai-building-itself-rnd-2026"
locale: "en"
excerpt: "Short answer: Anthropic says Claude completes 26% of its own model R&D end-to-end, but that isn't the same as running without human oversight."
category: "ai"
tags: ["claude", "ai-agents", "machine-learning", "ai-reliability"]
publishedAt: "2026-09-20"
seoTitle: "Is Claude Really Doing 26% of Its Own R&D?"
seoDescription: "Short answer: Anthropic says Claude completes 26% of its own model R&D end-to-end from a high-level prompt, but that's not the same as no human oversight."
---

Short answer: on September 17-18, 2026, Anthropic said Claude now completes about 26% of its own model research and development end-to-end from a high-level prompt, with roughly 90% of all R&D work done "in collaboration" with Claude. That doesn't mean human oversight is gone — by Anthropic's own wording, this work still happens "under close human direction."

## What exactly does Anthropic's 26% claim say?

According to Anthropic's announcement, Claude completes about a quarter of the company's model research and development tasks entirely on its own, end to end; for most of the remaining workload, it works alongside human engineers. The company's second, broader figure is that roughly 90% of R&D work happens in "collaboration" with Claude — meaning Claude can take on large chunks of the workload under human direction, though Anthropic doesn't specify how much of that 90% runs autonomously.

These two numbers measure different things and shouldn't be conflated: 26% is the share of tasks Claude completes by itself from start to finish; 90% is the share of tasks where Claude contributes at any level. The second is naturally larger because its bar is much lower.

## What does "end-to-end from a high-level prompt" actually mean?

Anthropic's definition of "end-to-end" means an engineer gives Claude a high-level goal — something like "improve this component's performance" — instead of describing each step, and Claude breaks that goal down into writing code, running tests, and evaluating results on its own. This maps directly onto the agent side of the distinction we cover in [AI Agents vs Workflows: When to Use Each](/en/posts/ai-agents-vs-workflows): not a pre-defined workflow, but a system that plans its own path to a goal.

But "completed end-to-end" doesn't mean the result ships to production without human review. Anthropic's statement explicitly says this work happens "under close human supervision" — final sign-off still rests with people.

## Is this running without human oversight?

No, and this is where it's worth separating the hype from what was actually said. By Anthropic's own account, most of this work happens "under close human direction," meaning Claude can plan and execute a task start to finish, but the result isn't left uncontrolled. Headlines framing this as "AI is improving itself" grab attention, but the more accurate read is "AI is taking on progressively larger chunks of work under human supervision."

That distinction matters because "recursive self-improvement" has a specific meaning in AI safety literature: a system improving its own capabilities without human intervention. The scenario Anthropic described doesn't meet that definition — human direction is still in the loop.

## Why is AI improving AI controversial from a safety standpoint?

AI safety researchers' core concern is a loop where a model sets its own success criteria and human oversight gradually thins out. Anthropic's 26% figure is far from that scenario, but the direction of the trend is clear: the share of tasks Claude can complete end-to-end keeps growing over time. The question worth asking isn't "how autonomous is this today," but "how fast is that share growing, and at what point does human oversight stop being meaningful in practice."

| Metric | Figure | What it means |
|---|---|---|
| R&D tasks Claude completes end-to-end | ~26% | Work started from a high-level prompt and finished solo |
| R&D done "in collaboration" with Claude | ~90% | Work involving Claude's contribution at any level |
| Human oversight model | "Close human direction" | Output doesn't ship to production unchecked |

## What does this mean for engineers?

In the short term, this means Anthropic's own engineers can hand off routine, well-defined R&D tasks to Claude and spend their time on more ambiguous, high-level decisions — a concrete data point for the ongoing question of whether [AI actually makes developers faster](/en/posts/does-ai-make-developers-faster). Longer term, this trend reopens the question of what "AI-proof" skills actually mean: as more end-to-end work automates, a human engineer's added value concentrates more in setting goals, evaluating outcomes, and giving final sign-off.

## How does this claim compare with other AI companies' statements?

Anthropic isn't alone here: OpenAI and Google have both said, at various points, that they put their own models into their research teams' daily workflow for tasks like code review and experiment design. But neither company has published a concrete, quantified figure the way Anthropic did — "we use it heavily" is typically as specific as those statements get. That makes Anthropic's 26% one of the more specific self-reported metrics in the industry, but it also means there's no directly comparable benchmark to check it against.

One thing worth keeping in mind when weighing a number like this: the company defines its own metric. "Task completed end-to-end" can cover a wide range of complexity — if a simple test-writing task and a complex architecture change both count in the same bucket, the practical meaning of 26% shifts substantially. Anthropic hasn't publicly broken down that distinction.

Regardless of the exact figure, the direction is clear: a similar metric wasn't publicly disclosed in early 2025, and now the company presents it directly as a success indicator. That shows AI companies growing more comfortable saying "our model contributes to its own development" out loud — closing the gap between that message's marketing value and its technical reality is left to the reader.

## Frequently Asked Questions

### Is Claude improving itself without human help?

Not exactly. Anthropic says Claude completes about 26% of its own model R&D tasks end-to-end, but that work happens "under close human direction" — meaning Claude isn't operating in an autonomous loop that improves its own capabilities without human intervention.

### What is recursive self-improvement?

In AI safety literature, this term describes a system improving its own capabilities without human intervention; the 26% scenario Anthropic described doesn't fully match that definition, since human direction remains part of the loop.

### Can this 26% figure be independently verified?

Not currently — the number comes directly from Anthropic's own statement, and no independent audit or third-party verification has been made public; there's also no shared industry standard yet for how this kind of self-reported metric should be measured.

### Should developers be worried about this trend?

Tracking the trend is more useful than worrying about it: as the share of work Claude can complete end-to-end grows, a human engineer's role shifts from routine implementation toward setting goals and evaluating outcomes — preparing for that shift is a more constructive response than alarm.

For more on Claude's current model lineup, see [Claude Opus 5 Arrives: Frontier AI at Half Price](/en/posts/claude-opus-5-launch); for building skills that hold up as automation grows, see our guide to [Building an AI-Proof Developer Skill Set](/en/posts/ai-proof-developer-skills). Browse more AI coverage in our [AI category](/en/category/ai).

Sources: [Anthropic's statement on Claude helping build its successor, via US News](https://www.usnews.com/news/business/articles/2026-09-17/anthropic-says-its-model-claude-is-helping-to-build-the-next-version-of-itself) and [Spectrum Local News coverage](https://spectrumlocalnews.com/us/snplus/business/2026/09/18/anthropic-claude-helping-to-build-next-version).
