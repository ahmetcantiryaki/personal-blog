---
title: "How Did Claude Code's /code-review Change?"
slug: "claude-code-code-review-severity-levels"
translationKey: "claude-code-code-review-severity-levels-2026"
locale: "en"
excerpt: "Since Nov 19, 2026, Claude Code's /code-review reports only bugs and CLAUDE.md violations on most models, tagging each Important, Pre-existing, or Nit."
category: "software-engineering"
tags: ["claude", "code-quality", "ai-coding", "best-practices"]
publishedAt: "2026-11-20"
seoTitle: "Claude Code's /code-review: What Changed in Nov 2026"
seoDescription: "Claude Code 2.1.328–2.1.329 (Nov 2026) narrowed /code-review to bugs and CLAUDE.md violations, tagged Important, Pre-existing, Nit, added branch review."
---

Claude Code's `/code-review` command changed twice in its November 19, 2026 release (version 2.1.328 and 2.1.329): it now reports only bugs and CLAUDE.md violations on most models, tags every finding as Important, Pre-existing, or Nit, and reviews the whole current branch against the default branch when you run it with no target.

## What Exactly Changed in /code-review?

Before this release, `/code-review` surfaced a broader mix of findings — style suggestions, simplification ideas, and bugs together, with no severity signal to tell you which ones mattered. As of version 2.1.328, the command narrows its scope on most models to two categories: actual bugs and violations of your project's CLAUDE.md rules. Anything else — a cleaner variable name, a slightly different pattern — falls outside what `/code-review` now surfaces by default.

| Behavior | Before Nov 19, 2026 | After version 2.1.328/2.1.329 |
|---|---|---|
| What gets reported | Bugs, style, simplification mixed together | Bugs and CLAUDE.md violations only (most models) |
| Severity signal | None | Important, Pre-existing, or Nit on each finding |
| Review scope with no target | Varied by setup | Whole current branch vs. default branch (most models) |
| Where to find style/simplification feedback | `/code-review` | A separate pass, such as `/simplify` |

## What Do "Important," "Pre-existing," and "Nit" Actually Mean?

Important marks a bug your change introduces or makes worse — the kind of finding that should block a merge. Pre-existing marks a bug that was already in the code before your change touched it, which matters for triage but doesn't mean your diff caused it. Nit marks a minor issue worth a glance but not worth blocking on. This three-way split exists specifically so a reviewer — human or Claude — can scan a report and act on Important findings first instead of re-reading every line to figure out which of ten flagged issues actually matters.

## Does /code-review Still Catch Style Nits and Simplification Ideas?

Not by default on most models, and that's the point of the change — `/code-review` is now scoped to correctness, not general code quality. If you want reuse, simplification, and efficiency feedback, that's a separate concern the project's tooling splits out rather than bundling into every review pass. Keeping the two concerns apart means a `/code-review` report full of real bugs doesn't get buried under a dozen stylistic nitpicks, which is exactly the kind of signal-to-noise problem teams run into when they first try [AI code review and learn to trust it, but verify it](/en/posts/ai-code-review-trust-but-verify).

## How Do You Review a Whole Branch Without Picking a Target?

Running `/code-review` with no target now reviews your whole current branch against the default branch on most models, as of version 2.1.329 (November 19, 2026). That's a meaningful default shift: previously, what "no target" meant depended more on your local setup. Now it behaves consistently — closer to what a reviewer does before approving a pull request, diffing your entire branch rather than just the most recent commit.

```bash
# Review the whole current branch against the default branch
claude
> /code-review

# Review a specific PR number, branch, or path instead
> /code-review 482
> /code-review feature/billing-refactor
```

## Can You Control How Many Findings You See, or How Deep the Review Goes?

Yes, on both axes, and neither of these controls is new in this release but they matter more now that findings carry a severity tag. You can pass an effort level — low, medium, high, xhigh, or max — before the target, so `/code-review high src/billing` runs a deeper pass than the default on a sensitive area of the codebase; with no level given, it reuses whatever you typed last. You can also cap how many findings come back with `--max-findings <n>`, or ask for every finding with `--max-findings all`, which is useful once you're filtering by Important first and only want to see the full Nit pile occasionally rather than every single run. Combine the two: a `high` or `xhigh` pass with `--max-findings all` on a release branch, and the default effort with a small `--max-findings` cap on a routine feature branch.

## Does This Replace a Human Code Review?

No, and the severity labels themselves are a hint why: Pre-existing findings exist because Claude Code is explicitly trying to separate "bugs your change caused" from "bugs that were already there," which is a triage aid, not a verdict on whether to merge. Treat the Important/Pre-existing/Nit split the same way you'd treat a thorough but fallible junior reviewer's pass — a fast first filter that still benefits from a human looking at anything genuinely risky before it ships, especially around the kind of effort-sensitive review you'd configure with [Claude Code's effort parameter](/en/posts/claude-code-effort-parameter-explained) on a complex change.

## What Should You Do Differently Starting Now?

If your team built workflows or dashboards around `/code-review`'s old, unfiled output, update them to expect the three-way severity tag, since filtering on it is now the fastest way to triage a report — start with Important, batch Pre-existing findings for a separate cleanup pass, and treat Nit as optional reading. If you were relying on `/code-review` for style feedback too, switch that habit to a dedicated pass rather than expecting it back in this command's default output, and keep an eye on [Claude Code's changelog](https://code.claude.com/docs/en/changelog) directly since this kind of command-scope change tends to land without a lot of fanfare outside the release notes.

My take: narrowing `/code-review` to bugs and CLAUDE.md violations is the right call — a review tool that reports everything trains you to skim past the one finding that actually matters, and the Important/Pre-existing/Nit split is a small addition that fixes a real triage problem.

## Frequently Asked Questions

### When did Claude Code change /code-review's severity levels?

The Important/Pre-existing/Nit classification and the narrower bugs-and-CLAUDE.md-violations scope shipped in Claude Code version 2.1.328 on November 19, 2026, with whole-branch review as the no-target default following in version 2.1.329 the same day.

### What does "Pre-existing" mean in a /code-review finding?

It means the bug was already present in the code before your current change touched it — the finding is worth knowing about, but it isn't something your diff introduced or made worse, unlike an "Important" finding.

### Does /code-review still flag style issues and simplification opportunities?

Not by default on most models after the November 19, 2026 update — the command is now scoped to bugs and CLAUDE.md violations, so style and simplification feedback comes from a separate pass rather than being mixed into every code review.

### How do you review an entire branch instead of a single commit?

Run `/code-review` with no target; as of version 2.1.329, it reviews your whole current branch against the default branch on most models, rather than just the most recent change.
