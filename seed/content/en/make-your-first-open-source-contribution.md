---
title: "Make Your First Open-Source Contribution"
slug: "make-your-first-open-source-contribution"
translationKey: "make-your-first-open-source-contribution"
locale: "en"
excerpt: "Short answer: start small. A 10-line fix built around a 'good first issue' and a CONTRIBUTING file you read proves more than an unfinished side project."
category: "career-productivity"
tags: ["open-source", "career", "git", "community"]
publishedAt: "2026-11-11"
seoTitle: "How to Make Your First Open-Source Contribution"
seoDescription: "Merge your first PR without the intimidation: find a good-first-issue, read CONTRIBUTING, scope a small fix, write a clear description, and handle rejection."
---

Short answer: start small. A 10-line fix built around a "good first issue" and a CONTRIBUTING file you actually read proves more than a half-finished side project — because someone else actually reviewed and accepted it.

## Why Does an Open-Source Contribution Beat Another Side Project?

A side project only shows you can write code; a merged PR proves you can read someone else's codebase, follow a team's conventions, and take criticism and turn it into a fix. That second signal is far rarer and far more sought after in hiring — in an interview, you have a real answer to "why did you write this PR the way you did" instead of having to talk through a made-up project. As we noted in [our junior-to-senior developer roadmap](/en/posts/junior-to-senior-developer), the real differentiator in hiring now isn't "can you write code" but "can you move confidently through someone else's codebase" — and an open-source contribution is the cheapest way to prove exactly that.

## Which Issue Should You Pick for Your First Contribution?

The safest starting point is an issue labeled "good first issue," which [GitHub's own docs explain](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-open-source) is a label maintainers apply to surface the most approachable issues in a repository; you can list these directly for any repo at `github.com/<owner>/<repo>/contribute`. Non-code work counts too: a documentation fix, an added test for an uncovered edge case, a translation, or triaging issues — [Open Source Guides is explicit](https://opensource.guide/how-to-contribute/) that all of this is a real contribution, not just code.

## How Do You Set Up the Project Locally?

Read the CONTRIBUTING file start to finish first — most projects spell out their branching strategy, how to run tests, and their commit message format there, and skipping straight to code is the single biggest cause of wasted review cycles. Then follow the standard flow:

```bash
git clone https://github.com/<your-username>/<repo>.git
cd <repo>
git checkout -b fix/short-description
# make the change, run the tests
git commit -m "fix: short, clear description"
git push origin fix/short-description
```

Some projects require a DCO (Developer Certificate of Origin), others require a CLA (Contributor License Agreement). A DCO is a "Signed-off-by" line added to each commit affirming you wrote the code (`git commit -s` adds it automatically); a CLA is a separate legal document, signed once, that covers all your future contributions. The Linux kernel, GitLab (in 2017), and Chef (in 2016) all moved from CLA to DCO because the latter creates far less friction for contributors.

## How Small Should You Keep the Scope?

Fix exactly one thing in your first PR — a bug, a missing test, or a documentation error — and don't bundle in an unrelated refactor. A 300-line PR solving three different problems at once takes a maintainer hours to review and usually sits unreviewed; a 15-line, single-purpose PR can get reviewed the same day. Keeping scope small speeds up review and lowers the odds of rejection. If your change already spans multiple files or multiple logical concerns, splitting it into separate PRs is almost always the right call.

## How Should You Write the PR Description?

State three things clearly: what problem you're solving, how you tested it, and the related issue number if there is one. A description like "Fixes #482: adds input validation to fix the crash on an empty array; existing tests and the new edge-case test pass with `npm test`" gives a maintainer everything they need to start reviewing. A vague "small fix" title forces the maintainer to open the PR and reconstruct the context from scratch, which usually means it gets queued behind everything else.

| Contribution type | Difficulty | Example |
| --- | --- | --- |
| Documentation fix | Very low | Correcting a wrong command example |
| Adding a missing test | Low | Writing a test for an uncovered edge case |
| Good-first-issue | Low–medium | A small bug flagged by a maintainer |
| New feature | Medium–high | Open an issue first; don't start without buy-in |

## How Should You Use an AI Assistant on an Unfamiliar Codebase?

Asking an AI assistant "what does this function do, where is it called from" to understand an unfamiliar codebase is a safe use — pasting a secret or a private token is not. Because open-source code is already public, this use carries no privacy risk, but be careful not to paste a key from your local `.env` file or code from a private repo into the assistant — keeping that line clear matters for both your own security and the project's. [Our comparison of open-source AI coding agents](/en/posts/open-source-ai-coding-agents-compared) covers which of these tools is best suited to scanning a repo quickly, but none of them read the CONTRIBUTING file for you — skipping that step is still on you.

## What Do You Do If a PR Gets Rejected?

When a maintainer says "we don't want this approach," read it as information about the project's direction, not as personal criticism; asking "why do you prefer this direction, would an alternative PR be worth trying" and stepping back leaves a far better second impression than digging in defensively. Even a rejected PR stays with you as practice reading that codebase — you carry that experience into the next issue.

The pressure to make your first PR perfect is honestly the main reason most people never start — in reality, maintainers appreciate a small, clearly scoped PR more than a perfect one, because it takes less time to review. A concrete one-week plan looks like this: day 1, browse good-first-issue lists across three projects and read their CONTRIBUTING files; day 2, set the project up locally and run the tests before writing any code; days 3-4, solve the issue you picked; day 5, open the PR and write the description; days 6-7, respond to review comments. This mirrors a junior's first mentoring experience — as we noted in [our piece on the struggle budget for mentoring junior developers](/en/posts/how-to-mentor-junior-developers), a time limit you set for yourself beats getting stuck with no boundary at all. You can browse the rest of the career and productivity category [here](/en/category/career-productivity).

## Frequently Asked Questions

### Which issue should I pick for my first open-source contribution?

Pick one labeled "good-first-issue," which maintainers flag specifically for newcomers; on GitHub you can list these directly at `github.com/<owner>/<repo>/contribute`. Non-code contributions — documentation, tests, translation — are just as valid a starting point.

### What's the difference between a DCO and a CLA?

A DCO is a lightweight system where you affirm you wrote the code by adding a "Signed-off-by" line to each commit, with no separate agreement to sign; a CLA is a standalone legal agreement, signed once, that covers all your future contributions to that project.

### How small should my first PR be?

Small enough to solve exactly one problem — a bug fix, a missing test, or a documentation error. A 15–30-line, single-purpose PR typically gets reviewed the same day, while a large PR bundling multiple concerns usually sits unreviewed for far longer.

### Is it bad if my PR gets rejected?

No — a maintainer saying "we don't want this approach" is information about the project's direction, not a judgment of your skill. Even a rejected PR counts as practice reading that codebase, and that experience pays off on your next contribution.
