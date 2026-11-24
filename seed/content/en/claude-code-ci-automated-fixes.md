---
title: "Run Claude Code in CI for Automated Fixes"
slug: "claude-code-ci-automated-fixes"
translationKey: "claude-code-ci-automated-fixes-2026"
locale: "en"
excerpt: "Run Claude Code headless in CI with a scoped permission mode and no secret access; it should open a PR, never push to main or auto-merge its own fix."
category: "devops-cloud"
tags: ["claude", "ci-cd", "automation", "ai-coding"]
publishedAt: "2026-11-24"
seoTitle: "Claude Code in CI: Automated Fixes, Done Safely"
seoDescription: "Run Claude Code headless in CI with a scoped permission mode and no secret access; it should open a PR for review, never push directly or auto-merge."
---

Short answer: wire Claude Code into your pipeline as a headless step that runs on a red build, works in a sandboxed checkout with no secret access, and opens a pull request with its fix instead of pushing anywhere directly. A build that failed on a flaky test or a lint error can have a PR waiting for review before the engineer who broke it has poured a second cup of coffee — but only if the guardrails are in place before the first run, not after.

## When does CI automation with Claude Code actually pay off?

It pays off on the failure categories that are mechanical and bounded: formatting violations, an outdated snapshot test, an import that lint flags, a dependency bump that breaks one assertion in a predictable way. These are failures where "what changed" and "what the fix looks like" are both narrow, which is exactly where an automated fix is cheap to verify even if it's wrong.

It stops paying off — and starts generating noise — on anything that requires a judgment call: a failing integration test that might indicate a real design problem, a flaky test that's flaky because of a race condition rather than bad luck, a regression that touches business logic. Routing those to an automated fixer either produces a plausible-looking patch that hides the real bug, or burns CI minutes on retries that were never going to succeed without a human decision. The filter is simple: if a senior engineer would fix it without thinking for more than thirty seconds, automate it; if they'd open a design discussion, don't.

## How do you actually run Claude Code headless in a pipeline?

Claude Code runs non-interactively with a prompt and a permission mode set explicitly for the CI context — you do not want the same permissions your local terminal session has. A minimal pattern:

```yaml
- name: Claude Code auto-fix
  if: failure()
  run: |
    claude -p "The build failed. Read the CI logs in ./ci-output.log,
    fix only the specific failure described, and do not touch
    unrelated files. Open a PR; do not push to main." \
      --permission-mode plan \
      --allowedTools "Read,Edit,Bash(npm test:*)" \
  env:
    ANTHROPIC_API_KEY: ${{ secrets.CLAUDE_CODE_CI_KEY }}
```

Scope `--allowedTools` to the smallest set the fix category needs — a linter fix needs `Edit` and a formatter command, not a general shell. Auto mode, which Anthropic extended to Amazon Bedrock, Google Cloud's Agent Platform, and Microsoft Foundry in Claude Code 2.1.328 on November 19, 2026, is worth enabling here specifically because it classifies routine edits and routes them through a faster pass — the exact profile of a lint fix or a snapshot update, as opposed to a judgment-heavy debugging session.

## What guardrails actually keep this safe?

Three rules do almost all of the work. First, Claude Code opens a pull request and never pushes to a protected branch or merges on its own — a human approves every change before it ships, full stop. Second, the CI job's credentials carry no access to secrets beyond what the specific fix category needs, and definitely nothing with write access to infrastructure; Claude Code's own [sandboxed bash permissions](/en/posts/claude-code-sandboxed-bash-permissions-change) and [--restricted mode](/en/posts/claude-code-restricted-mode-explained) exist precisely to make that boundary enforceable rather than just a policy you hope holds. Third, give it a narrow, falsifiable instruction — "fix this specific failing assertion," not "make CI pass" — because a vague goal invites a fixer that disables the test instead of fixing the bug.

| Guardrail | What it prevents |
|---|---|
| Open a PR, never auto-merge | An unreviewed change reaching production |
| Scoped `--allowedTools`, no shell beyond the fix category | Lateral movement into unrelated parts of the repo |
| No secret access beyond the CI job's own narrow scope | Credential leakage through a compromised or confused run |
| Narrow, specific prompt tied to the actual CI failure | Disabling a test instead of fixing the underlying bug |

Anthropic's own November releases reinforce the same posture outside of CI specifically: Claude Code 2.1.330 now requires approval for more `rm` commands aimed at the root, home, or working directory, and 2.1.329 added a trust-dialog warning that shows exactly where a repository's hooks are declared before they run. The direction is consistent — more confirmation before anything destructive or opaque, which is the same principle a CI guardrail should enforce.

## How should a human review the bot's diff?

Treat it like a junior engineer's PR, not a trusted system's automatic action — read the diff in full, not just the test output that went from red to green. Check specifically whether the fix addresses the actual failure or works around it: a snapshot update that matches new, correct output is fine; a snapshot update that just encodes a regression is not, and a static CI check can't tell the two apart. [Gating PRs with Claude Code review in CI](/en/posts/gate-prs-with-claude-code-review-in-ci) covers the review side of this loop in more detail — the same tool that can write the fix can also review someone else's, and running both isn't redundant, since a second, differently-prompted pass catches a different class of mistake than the first.

## What should stay manual, even with all of this working?

Anything that changes behavior a user can observe, anything touching authentication or payments, and anything where the "fix" could plausibly mean three different things to three different engineers. Automate the mechanical tail of your build failures — formatting, flaky-but-not-actually-broken tests, dependency-bump breakage — and leave the judgment calls to the person who'll be on call when it's wrong.

My honest take: the interesting part of this isn't that Claude Code can write the fix — it's that most teams' real bottleneck was never "can an AI fix a lint error," it was "do we trust the guardrail enough to let it try." Get the permission scope and the PR-only rule right first; the fix quality mostly takes care of itself on the bounded failure categories where this is worth doing at all.

Primary source: [Claude Code's changelog](https://code.claude.com/docs/en/changelog).

## Frequently Asked Questions

### Can Claude Code push fixes directly to main in CI?

It shouldn't be configured to. The safe pattern is to have Claude Code open a pull request for any CI-triggered fix and require human approval before merge — never grant it push access to a protected branch or let it merge its own change.

### What permissions should a CI-triggered Claude Code run have?

The narrowest set the specific fix category needs — typically `Read` and `Edit` plus one scoped `Bash` command for running tests, no broader shell access, and no credentials beyond what that CI job already needs for its own narrow purpose. No secret access beyond that scope.

### Does Claude Code's auto mode work in enterprise CI environments on Bedrock or Google Cloud?

Yes. Anthropic extended auto mode for Claude Opus 4.6 and Sonnet 4.6 to Amazon Bedrock, Google Cloud's Agent Platform, and Microsoft Foundry in the Claude Code 2.1.328 release on November 19, 2026, which covers CI runners configured against any of those providers.

### What kinds of CI failures are safe to automate with Claude Code?

Mechanical, bounded failures: formatting and lint violations, outdated snapshots that should match new correct output, and predictable breakage from a dependency bump. Avoid automating fixes for failures that require a judgment call, such as flaky tests caused by race conditions or regressions touching business logic.
