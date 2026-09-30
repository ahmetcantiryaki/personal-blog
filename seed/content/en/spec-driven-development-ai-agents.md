---
title: "What Is Spec-Driven Development With AI Agents?"
slug: "spec-driven-development-ai-agents"
translationKey: "spec-driven-development-ai-agents-2026"
locale: "en"
excerpt: "Spec-driven development means writing down expected behavior before an AI agent codes it, then checking the output against that spec. Here's the workflow."
category: "software-engineering"
tags: [ai-coding, ai-agents, best-practices, documentation]
publishedAt: "2026-09-30"
seoTitle: "Spec-Driven Development With AI Agents: A Guide"
seoDescription: "What is spec-driven development, what belongs in a spec, and how do you verify an agent's output against it? Field notes, tooling, and a comparison table."
---

Short answer: spec-driven development (SDD) means writing down what an AI coding agent should build, why, and within what constraints before it writes any code, then checking the resulting implementation against that document line by line. Writing code stopped being the bottleneck. Clarifying intent and verifying output became the bottleneck instead.

## What did AI coding agents actually change?

As of September 2026, agents like Claude Code, Cursor, and GitHub Copilot can turn a medium-sized feature request into working code in minutes. That solved the "writing code is slow" problem in practice. It opened a different one: an agent fills in every requirement you didn't state with its own guess, and those guesses rarely match what was in your head.

The hard work moved to both ends of the process. Upstream, you now have to spell out what you want before the agent starts — edge cases, error behavior, what's explicitly out of scope. Downstream, you have to check the agent's output against that written intent instead of eyeballing it and saying it looks fine. Spec-driven development is the discipline that connects those two ends.

It's the mirror image of [vibe coding](/en/posts/spec-driven-development-end-of-vibe-coding): with vibe coding you start from a vague prompt and approve whatever comes out by feel; with SDD you write the intent first and verify against it after.

## What actually counts as a "spec" here?

Short answer: an SDD spec is a structured, behavior-oriented natural-language document — not a formal mathematical specification like TLA+, and not a vague ticket that says "let users edit their profile." Its job is to give you and the agent the same acceptance criteria to check against.

A good spec usually has four parts: purpose, scope (and explicit non-scope), behavior rules, and acceptance criteria. A short example like the one below also catches the "the system knows this but the user doesn't" edge cases that vague tickets tend to miss:

```markdown
# Spec: Email-change verification flow

## Purpose
When a user changes their account email, the old address gets a
notification, the new address gets a verification link.

## Scope
- Affected: POST /api/account/email
- Not affected: password changes, 2FA settings

## Behavior rules
1. If the new email is already registered, return 409, send no email.
2. The verification link is valid for 24 hours and single-use.
3. The old email stays active until the link is clicked.

## Acceptance criteria
- [ ] Attempting a registered email returns 409, no new record created
- [ ] An expired link returns 410
- [ ] The notification to the old address includes IP and timestamp

## Out of scope
Enterprise SSO accounts (covered in a separate spec)
```

Keep this under two or three pages. Anything longer turns into a document neither you nor the agent will actually read.

Jama Software makes a similar point in a [guide it published in September 2025](https://www.jamasoftware.com/blog/what-is-spec-driven-development-sdd-for-ai-powered-engineering/): AI agents generate code fast, but producing traceable, audit-ready code requires a structured spec behind it, not a one-line prompt. An [arXiv paper from September 2025](https://arxiv.org/abs/2509.00252) draws a further distinction between system specs (architecture and conventions, loaded once per session) and feature specs (the acceptance criteria for one change, like the example above).

## What does a spec-driven workflow actually look like day to day?

Short answer: a four-step loop — write the spec, let the agent implement it, verify the output against the spec, and periodically re-sync spec and code during long sessions so they don't drift apart. In order:

**1. Write the spec.** Before starting a task, draft a short document like the one above. Put it in the task description, in a `specs/` folder in the repo, or wherever the agent reads context from.

**2. Let the agent implement.** Hand the spec to the agent directly and say "implement against this." Break large features into small tasks that map to individual acceptance criteria rather than shipping the whole thing in one pass — this also makes verification tractable.

**3. Verify the output against the spec.** At the end of each task, check off acceptance criteria one by one. Code review here stops being "does this look reasonable" and becomes "was the criterion actually met." Skip this step and SDD loses its entire point; this is essentially what [trust-but-verify AI code review](/en/posts/ai-code-review-trust-but-verify) means in practice.

```bash
# Quick check at the end of a task
git diff --stat HEAD~1                    # what did the agent actually change?
grep -c "\[x\]" specs/email-change.md     # how many criteria got checked off?
```

**4. Guard against drift.** In a long session — several hours, a multi-step feature — an agent starts making decisions the spec never covered: renaming variables, inventing its own handling for an error path the spec didn't mention. Every three or four tasks, have it re-read the spec and confirm the implementation still matches. The same checkpoint habit used to [manage context in long AI coding sessions](/en/posts/stop-losing-context-ai-coding-sessions) applies directly here.

## What tools actually support spec-driven development right now?

Short answer: the best-known one is GitHub's open-source **[Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)**, announced in July 2025, MIT-licensed, and compatible with agents including Claude Code, Copilot, Cursor, and Gemini CLI. AWS's **Kiro** and the community project **OpenSpec** cover similar ground.

Spec Kit's approach is a "constitution → plan → tasks → implement" pipeline: each phase produces a Markdown artifact that feeds the next one, so the agent gets structured context instead of a freeform prompt. Think of it as an SDD-specific flavor of [context engineering](/en/posts/context-engineering-for-ai-agents).

None of these tools are mandatory. You can run SDD with nothing more than a `specs/` folder and the discipline of breaking work into verifiable tasks. Tooling makes the workflow smoother; it doesn't replace the discipline.

| Approach | Who writes the spec | Verification step | Best fit |
|---|---|---|---|
| Vibe coding | No one, or a one-line prompt | Eyeballing the result, "looks like it works" | One-off demos, weekend experiments |
| Classic upfront-spec waterfall | A business analyst or architect, months before any code | QA doing manual testing weeks later | Regulated systems with fixed, stable requirements |
| Spec-driven development (SDD) | The developer, right before starting the task | Agent output checked against criteria at the end of every task | Multi-session feature work, team handoffs, long-lived production code |

## When does spec-driven development actually help, and when is it pure overhead?

Short answer: SDD pays off when a feature spans multiple sessions, someone else will pick up the code, or it's heading to production; it's pure overhead for a one-off script, a throwaway prototype, or anything you'll write tonight and delete tomorrow.

Writing a spec has a fixed cost — roughly fifteen minutes of your time. That cost gets paid back when the code will be read again, modified, or handed off to another agent or developer. If you're writing a CLI for a one-time data cleanup job, nobody is ever going to reopen that code, and writing a spec for it is just time lost.

If you ask us, the most common mistake teams make is going to one extreme or the other — skipping SDD entirely, or applying it to everything down to a three-line helper function. Both are wrong. The actual test is simple: will this code outlive the session it was written in?

## Frequently Asked Questions

### What's the difference between spec-driven development and a classic requirements document?

A classic requirements document is written months in advance, often in business language, long before any code exists. An SDD spec is written right before a task starts, focuses on behavior and acceptance criteria, and is meant to be consumed directly by an agent. The difference is timing and purpose: one supports an approval process, the other is a working instruction the agent can execute against.

### Who should write the spec — a product manager or a developer?

Usually the developer who will implement the task writes it, because they know the technical edge cases — error codes, data models — best. A product manager can contribute the "what" and "why," but turning acceptance criteria into something technically checkable is a developer's job. On small teams this is often the same person.

### What do you do when the agent's output doesn't match the spec?

First check whether the spec itself was ambiguous — most mismatches come from a spec skipping an edge case, not from the agent making an arbitrary mistake. If the spec was genuinely clear and the agent still drifted, split the task into smaller pieces and verify each one separately; drift compounds fast on large, unbroken tasks.

### Is it worth writing a spec for a small script or a quick prototype?

No, spec-driven development is generally overkill for one-off scripts and disposable prototypes. That kind of code has a short lifespan and nobody will read it again, so the cost of writing a spec outweighs what it buys you. The equation flips once the code is heading to production or someone else will maintain it.
