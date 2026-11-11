---
title: "How to Mentor Junior Developers Well"
slug: "how-to-mentor-junior-developers"
translationKey: "how-to-mentor-junior-developers"
locale: "en"
excerpt: "Short answer: make the decision process visible instead of writing the fix yourself. Good mentoring teaches how you reached a solution, not just the solution."
category: "career-productivity"
tags: ["career", "developer-growth", "learning", "communication"]
publishedAt: "2026-11-11"
seoTitle: "How to Mentor Junior Developers Well"
seoDescription: "The biggest mentoring mistake is fixing the bug yourself. Here's a 90-day plan, the struggle budget, and how to turn code review into teaching, not gatekeeping."
---

Short answer: make the decision process visible instead of grabbing the keyboard and writing the fix yourself. Good mentoring means asking "how did you get here, what are you going to try next" when someone gets stuck, and waiting for the answer — that builds the junior's own problem-solving muscle instead of having them memorize your solution.

## What's the Biggest Mistake Mentors Make?

The biggest mistake is taking over the keyboard the moment a junior gets stuck and fixing the problem yourself. It feels fast in the moment, but it means the junior will likely hit the same wall again next month, because they never got to practice finding the bug on their own. A better mentor asks "what do you know right now, what have you already tried" and has the junior think out loud through their own diagnosis — asking the right question teaches more than handing over the answer.

## What Do Juniors Need to Learn Now That AI Writes Boilerplate?

Boilerplate code gets generated in seconds now, so the skill juniors need isn't writing code — it's deciding whether the generated code is correct. That breaks down into three concrete skills: reading a proposed solution and understanding why it works (or doesn't), isolating a bug systematically, and asking the right question of an AI assistant or a senior. As we discussed in [the piece on the AI productivity paradox](/en/posts/does-ai-make-developers-faster), the faster code gets generated, the more the actual bottleneck shifts to the skill of evaluating that generated code — and that skill doesn't develop on its own, without mentoring.

Multiple analyses of [Stanford HAI's 2026 AI Index report](https://hai.stanford.edu/ai-index/2026-ai-index-report) found that employment for software developers aged 22 to 25 fell roughly 20% from its 2022 peak, while employment for developers aged 30 and over grew over the same period. That doesn't mean junior roles are disappearing; it means companies now expect something different from that role — not writing code, but reviewing it. [LinkedIn's Economic Graph report on the software engineering job market](https://economicgraph.linkedin.com/workforce-data/publications) points the same way: postings listing AI-literacy skills, prompt engineering included, grew 70% year over year in the US, which signals hiring is shifting from "can you write code" to "can you evaluate code someone else — or something else — wrote."

## How Do You Structure the First 90 Days?

Split the first 90 days into three clear stages: the first month is reading and small, reversible changes (a test fix, a docs update); the second month is supervised but solo feature work; the third month is a junior's first unsupervised pass at an incident or a genuinely hard bug. Give each stage a concrete "done" criterion — not a subjective "feels comfortable now," but something measurable like "merged these three PRs without a review comment."

## How Does Code Review Become a Teaching Tool?

Code review becomes teaching, not gatekeeping, when you ask questions that help the junior find their own mistake instead of pointing at the bug and saying "fix this." A question like "why is this line here" or "did you test this edge case" produces slower but more durable learning than a direct correction. The difference between gatekeeping and teaching: a gatekeeper wants the PR flawless before it merges; a teacher asks whether something was learned in this PR, and can let a minor flaw ride into the next one.

## What Is a "Struggle Budget" and Why Does It Matter?

A struggle budget is the amount of time you decide in advance a junior should wrestle with a problem alone — long enough to learn, not so long it burns them out. In practice it can be as simple as saying, when you hand off a task, "message me if you're stuck after 45 minutes, not before." Telling someone to "just ask if you're stuck," with no time limit, leaves most juniors unsure when asking is even allowed; a stated budget removes that ambiguity entirely.

| Stage | Duration | Mentor's role | Success signal |
| --- | --- | --- | --- |
| Reading + small fixes | Month 1 | Observer, gives lots of context | Small PRs merge with few comments |
| Supervised feature work | Month 2 | Asks questions, rarely solves | Can explain the design upfront |
| Solo intervention | Month 3 | Backup, only steps in once the struggle budget runs out | Handles first incident, with notes |

## What Does a Good Intervention Actually Look Like?

A junior spent three days stuck on the same 401 error in an API integration, regenerating the token each time and hitting the same error. The wrong intervention would have been checking the token myself and saying "here's the problem, fix it like this." The right one was asking, "show me exactly what gets logged the moment you get the 401" — and once we logged it together, the problem turned out to be the request hitting the wrong environment URL, not a token expiry at all. The junior found it with their own eyes; I only pointed at where to look. A week later, they solved a similar bug entirely on their own. Had I swapped the token myself that day and said "fine, it works now," that independent fix a week later would never have happened — the junior would have come back to me next time, because they'd never learned where to even start debugging a 401.

## How Do You Measure Growth?

Measure growth not by how much code someone wrote, but by the curve of problem complexity they can solve independently over time. Practical signals: how often they're the first responder on an incident, how few review comments their own PRs get over time, and whether the questions they ask a senior shift from "what should I do" to "which of these two approaches would you pick." That last shift is the clearest sign of a quality jump — it means the junior already knows the solution and is now shopping for a preference, not an answer. You don't need a complicated tracking tool for this: one single-sentence note a month ("triaged their first incident solo this month") shows a clear line of progress when you look back six months later.

Most companies still treat mentoring as a side task that "good people just do naturally," with no dedicated time or recognition attached to it — which is exactly why even the best mentors burn out or quietly stop. At a company that doesn't count mentoring as a real performance criterion, even the most well-intentioned senior never finds the time to actually run a struggle budget. Anyone reading our [junior-to-senior developer roadmap](/en/posts/junior-to-senior-developer) can map these stages onto where they currently sit in their own growth, and our piece on [the state of the junior developer job market in 2026](/en/posts/junior-developer-jobs-2026) explains why this kind of mentoring matters more right now than it used to. You can browse the rest of the career and productivity category [here](/en/category/career-productivity).

## Frequently Asked Questions

### What's the most common mistake when mentoring a junior developer?

The most common mistake is fixing the problem yourself the moment a junior gets stuck; it feels efficient in the short term, but it stops the junior from building their own diagnostic process and makes the same mistake more likely to repeat.

### How do you set up a "struggle budget"?

State upfront, when you assign a task, how long the junior should try on their own before reaching out — for example, "message me if you're stuck after 45 minutes, not before." This removes the ambiguity that leaves juniors unsure when it's acceptable to ask for help, and prevents both premature and delayed intervention.

### How do you use code review as a mentoring tool?

Instead of pointing out the bug and writing a fix request, ask questions that help the junior find their own mistake: "why is this line here," "did you test this edge case." This approach produces slower but more durable learning than a direct correction, and turns code review from gatekeeping into teaching.

### Have AI tools changed what junior developers need to learn?

Yes — since boilerplate code now gets generated in seconds, the real skill is no longer writing code but deciding whether generated code is correct, isolating a bug systematically, and asking the right question. None of those three skills develop on their own without active mentoring.
