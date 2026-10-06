---
title: "What Changes When You Review AI-Written Code?"
slug: "reviewing-ai-written-code"
translationKey: "reviewing-ai-generated-code-2026"
locale: "en"
excerpt: "Short answer: stop reading line by line and focus on intent, security, and data flow. At Google, 75% of new code is AI-generated; at Microsoft, 20–30%."
category: "software-engineering"
tags: ["ai-coding", "code-quality", "best-practices", "clean-code", "testing"]
publishedAt: "2026-10-06"
seoTitle: "Reviewing AI-Generated Code: What to Focus On"
seoDescription: "Reviewing AI-written code means shifting from line-by-line reading to intent, security, and data flow. 2026 adoption stats and a diff hygiene checklist."
---

Short answer: stop reading every line and concentrate on three things instead — the author's intent, the security boundaries, and the data flow. At Google, 75% of new code was AI-generated as of 2026. At that volume, line-by-line reading is already impossible, so the review strategy itself has to change.

## How much code is actually AI-written now?

The numbers vary by company, but the direction is consistent. Google CEO Sundar Pichai said at Google Cloud Next in 2026 that 75% of new code at Google is now AI-generated, up from roughly 50% the previous fall. Microsoft CEO Satya Nadella separately put the figure at 20–30% inside Microsoft's own repositories. Across top tech companies broadly, roughly 25–30% of new production code is AI-written.

| Source | Share | Scope |
|---|---|---|
| Google (Pichai, 2026) | 75% | All new code at Google |
| Microsoft (Nadella, 2025) | 20–30% | Microsoft internal repos |
| Industry average (2026) | 25–30% | Top tech companies, production code |
| Business logic | 15–30% | Most teams |
| Boilerplate and tests | 50–70% | Most teams |

The breakdown matters as much as the headline number: boilerplate and tests skew heavily AI-written, while critical infrastructure and algorithms are still mostly human-authored. Your review strategy should match that distribution — reading every line with equal scrutiny wastes time and misdirects attention away from the parts that actually carry risk.

## Is the "55.8% faster" claim actually true?

The claim that GitHub Copilot makes developers 55.8% faster gets repeated constantly, but the source tells a narrower story. That figure comes from a 2023 arXiv study measuring a single, well-scoped HTTP server task. The task was isolated, the codebase was clean, and the study never tracked the downstream quality of the code produced. It doesn't generalize to production engineering work.

A more grounded reference is GitHub's own enterprise research with Accenture: developers saw an 8.69% increase in pull requests, a 15% increase in the PR merge rate, and an 84% increase in successful builds. 90% of developers reported committing Copilot-suggested code, and 91% said their teams had merged PRs containing it. Those numbers are positive but far less dramatic than "55.8% faster" — and that gap is exactly the point: a headline figure from one lab task doesn't repeat at the same magnitude once it's applied to a real team's daily workflow.

## What new failure modes show up in AI-generated code?

Three patterns recur more than others, and classic code-review habits don't catch them well.

**Plausible-but-wrong code.** AI produces syntactically correct, easy-to-read code, which relaxes scrutiny. But "looks clean" and "works correctly" aren't the same thing. The most expensive mistake is conflating the two and approving on sight.

**Silent scope creep.** A PR that does more than what was asked — changing a function signature while fixing an unrelated bug, or editing a file nobody mentioned. The extra change usually looks harmless, but it can carry a side effect that falls outside the tests anyone wrote.

**Phantom dependencies.** The model references a package version, an API method, or a function that doesn't exist, or no longer exists. If it isn't caught at compile time, it might not surface until runtime.

## Where should human review actually concentrate?

Mechanical checks — formatting, linting, type checking, basic tests — belong in automation. Human attention should concentrate on four areas instead.

| Focus area | Why it matters | Example question |
|---|---|---|
| Intent | The model can misread the requirement | Does this PR solve what the issue actually asked for? |
| Security boundaries | The model doesn't know the security context | Is user input validated? Is authorization checked? |
| Data flow | Side effects aren't always visible line by line | What tables does this change touch, and in what order? |
| Blast radius | Failure size needs to be estimated | How many users are affected if this fails? |

These four areas echo the principle in our piece on [AI code review: trust, but verify](/en/posts/ai-code-review-trust-but-verify): trust the model, but keep the critical judgment call human. The difference is that as volume grows, concentrating on these four stops being a nice-to-have and becomes the only workable approach.

## How should diff hygiene change for agent-opened PRs?

A PR opened by an agent shouldn't be read the way you'd read one written by a person. Three practical rules help:

- **Ask for small, single-purpose PRs.** Instead of telling an agent "also fix this," scope each PR to one change; scope creep is far easier to spot in a small diff.
- **Read the changed-file list before the diff.** Before diving into the diff itself, check which files were touched — an unexpected file is usually the first sign of an out-of-scope change.
- **Review tests separately.** If the agent wrote the test alongside the code, check whether the test actually verifies the right behavior, or just mirrors whatever the model produced.

Automating mechanical checks in CI — linting, type checking, security scanning, dependency verification — frees human review to spend its time entirely on judgment. In practice that means running a linter (ESLint or Biome), a static security scanner (Semgrep), and a dependency-update bot (Dependabot or Renovate) the moment a PR opens. Those three checks answer "is this formatted correctly" and "does this introduce a known vulnerability" before a human ever has to ask — so whoever opens the PR is already looking at a cleaned-up diff. As we covered in [AI slop is breaking open-source security](/en/posts/ai-slop-open-source-security), the absence of that automation is where dependency-chain risk piles up fastest.

Honestly, the view that AI makes code review obsolete is about as overstated as the view that AI code is inherently riskier than human code. What's actually changing is where review time goes: time spent on formatting and syntax should move to automation, and human attention should shift to intent and security. As we noted in [7 mistakes using AI coding assistants](/en/posts/ai-coding-assistant-mistakes), the real skill isn't using the tool — it's knowing exactly where to question its output.

Team ownership needs to be explicit, too: whoever merges a PR an agent opened owns that code — "the agent wrote it" isn't a defense in production. [Agentjacking: the new AI agent attack class](/en/posts/agentjacking-ai-agent-attack) goes deeper into how that ownership gap gets exploited. For more on Claude's latest releases, see our [AI category](/en/category/ai).

## Frequently Asked Questions

### What percentage of code is AI-written now?

It varies by company: Google said in 2026 that 75% of its new code is AI-generated, while Microsoft put its internal figure at 20–30%. Across top tech companies broadly, it's roughly 25–30%.

### Is the "55.8% faster" Copilot statistic accurate?

It's accurate for one task but doesn't generalize. The figure comes from a 2023 arXiv study on a single, isolated HTTP server task that never tracked code quality afterward. GitHub's real enterprise research with Accenture found more modest but real gains: a 15% increase in PR merge rate and an 84% increase in successful builds.

### What's the most common failure mode in AI-generated code?

"Plausible-but-wrong" code: syntactically correct and easy to read, but logically flawed. The only way to catch it is shifting review attention from formatting to intent.

### How should I review a PR an agent opened differently?

Ask for small, single-purpose PRs, read the changed-file list before diving into the diff, and review tests separately from the code they cover. Automate mechanical checks in CI so human attention stays on intent, security, and data flow.
