---
title: "Claude Code Subagents and Background Agents: A Workflow Guide"
slug: "claude-code-subagents-background-agents"
translationKey: "claude-code-subagents"
locale: "en"
excerpt: "As of July 2026, Claude Code subagents run in the background by default and background agents open draft PRs on their own. Here is the hands-on workflow."
category: "ai"
tags: ["ai-agents", "ai-coding", "ai-tools", "workflow", "automation", "claude"]
publishedAt: "2026-07-07"
seoTitle: "Claude Code Subagents & Background Agents Guide"
seoDescription: "A hands-on guide to Claude Code subagents running in the background by default, background agents that open draft PRs, and the new Manual permission mode."
---

On July 1, 2026, Claude Code v2.1.198 flipped a default that quietly changes how you work all day: **subagents now run in the background by default**. The same release let background agents auto-commit, push, and open draft pull requests without you babysitting the loop. Two days later, v2.1.200 switched the default permission mode from Default to Manual. If you updated Claude Code this week and felt the ground shift, that is why.

This is not a feature dump but a working guide to the three shifts that matter — when to fan out **Claude Code subagents**, how background agents turn a request into a draft PR, and what Manual permission mode changes about your day. All facts below are current as of July 2026, sourced from the [Claude Code changelog](https://code.claude.com/docs/en/changelog).

## What changed this week, in one table

The week of July 1–6 shipped five releases. Here is what each one actually does to your workflow.

| Version | Date | Change that matters | Why you care |
|---------|------|---------------------|--------------|
| v2.1.196 | Jun 29 | Org default models; untrusted-repo `.mcp.json` no longer auto-spawns | Safer clones, org-wide model policy |
| v2.1.198 | Jul 1 | Subagents run in the background by default; background agents auto-commit/push and open draft PRs; `/dataviz` skill; Claude-in-Chrome GA | The big one — parallelism becomes the default |
| v2.1.199 | Jul 2 | Stacked skill invocations; subagent partial-work recovery after rate limits | Long runs survive a 429 |
| v2.1.200 | Jul 3 | Default permission mode switched from Default to **Manual** | Every action is reviewed unless you opt out |
| v2.1.202 | Jul 6 | Dynamic workflow-size config; workflow telemetry | Tune fan-out width; see where turns go |

Underpinning all of it: **Claude Sonnet 5**, released June 30, is now the default model. The velocity is not academic — Anthropic's [2026 Agentic Coding Trends Report](https://resources.anthropic.com) says most of its own code is now written by Claude Code, and Stripe rolled it out to 1,370 engineers, one team finishing a 10,000-line Scala-to-Java migration in four days — roughly ten engineer-weeks by hand.

## When to fan out subagents

A subagent is a Claude Code instance you dispatch to a scoped task with its own context window. Background is now the default, so the right mental model is fan-out: split independent work across several subagents and run them in parallel while you steer the main thread.

The heuristic is the one that governs [AI agents versus workflows](/en/posts/ai-agents-vs-workflows) — fan out only when the subtasks are genuinely independent. Good candidates:

- **Parallel investigation.** "Audit the auth module for security issues" and "profile the cache layer" have no data dependency. Two subagents, two reports, no waiting.
- **Fan-out by file or package.** A monorepo migration where each package is isolated. One subagent per package, each opening its own draft PR.
- **Split-role review.** One subagent reviews for correctness, another for security, a third for test coverage — the multi-perspective pattern, now cheap because they run concurrently.

Bad candidates are tasks with a shared, evolving state: if subagent B needs subagent A's output to even start, you have a chain, not a fan-out, and a single agent with a plan will beat two agents stepping on each other.

```bash
# In the main session, dispatch three scoped subagents.
# As of v2.1.198 each runs in the background by default.
> Use a subagent to audit src/auth for injection and authz gaps.
> In parallel, use a subagent to profile the Redis cache hot paths.
> And a third to check test coverage on the payments package.

# v2.1.202 adds dynamic workflow-size config — cap the fan-out width
# so you don't spawn twenty agents against a rate limit.
```

One genuinely useful upgrade landed in v2.1.199: **subagent partial-work recovery after rate limits**. A subagent that hits a 429 mid-task now recovers its partial work and continues instead of losing progress — if you have ever watched a 20-minute migration evaporate on a rate limit, you know why this matters more than it reads.

## How background agents commit, push, and open draft PRs

This is the headline capability. A background agent no longer stops at "here's the diff." As of v2.1.198 it can carry the task all the way to a reviewable pull request: make the change, run the tests, **commit, push a branch, and open a draft PR** — then hand you a link.

The workflow that emerges looks less like pair programming and more like delegation. You describe the outcome, the agent works while you do something else, and a draft PR shows up for review. Draft is the key word: nothing merges without a human marking it ready and approving. That maps cleanly onto a sane branch strategy — see [Git branching strategies compared](/en/posts/git-branching-strategies) for where these short-lived agent branches should live.

A realistic loop:

1. You: "Migrate the `UserService` tests from Jest to Vitest and open a PR."
2. Agent: edits files, runs the suite, iterates until green.
3. Agent: commits with a descriptive message, pushes `chore/vitest-userservice`, opens a **draft** PR.
4. You: review the draft, request changes in-thread, or mark ready and merge.

The discipline this demands is not new — it is the same review rigor you would apply to any teammate's PR, and it pairs naturally with a CI gate. If your [CI/CD pipeline](/en/posts/how-to-build-cicd-pipeline) runs the full suite and blocks on red, an agent-opened draft PR is exactly as safe as a human one: the tests are the contract, not the author. My opinionated take: let agents open PRs freely, but never loosen the merge gate to accommodate them.

## The Manual permission-mode shift

Here is the change that surprised people. As of v2.1.200 (July 3), the default permission mode is **Manual** — the mode that surfaces every action for review before it runs. It is a deliberate counterweight to all that new autonomy: agents can do more on their own, so the default posture tightened to keep a human in the loop.

A naming quirk that trips people up in config files: the mode is labeled **Manual** in the CLI and the editor extensions, but its config value is still `default`. The CLI accepts `manual` as an alias, so `--permission-mode manual` and `"defaultMode": "manual"` both work on v2.1.200+.

| You want | Set |
|----------|-----|
| Review every action (new default) | `--permission-mode manual` (config value `default`) |
| Auto-accept edits within the workspace | `--permission-mode acceptEdits` |
| Fully autonomous, no prompts | `--permission-mode bypassPermissions` |

Crucially, background subagents no longer silently auto-deny prompts. When a background subagent hits a tool call that needs permission, the prompt **surfaces in your main session and names which subagent is asking** — approve to continue, or press Esc to deny that one call without killing the subagent. This is what makes background-by-default usable: parallel agents can request risky actions and you adjudicate them from one place, not ten transcripts.

If you are tempted to run `bypassPermissions` to make the prompts go away, resist it on anything touching a shared repo — that is precisely the reflex the Manual default is trying to break. For more on where automation earns its keep versus where it bites, our roundup of [common AI coding assistant mistakes](/en/posts/ai-coding-assistant-mistakes) covers the failure modes teams hit first.

## Putting it together

The through-line this week is a division of labor: **subagents give you breadth** (fan out independent work), **background agents give you depth** (carry one task to a draft PR), and **Manual mode keeps you in control** (review the actions that matter). Together they turn Claude Code from an assistant that drafts into a small team you delegate to — with the merge button, and the judgment, still yours.

Start small: pick one genuinely parallel task this week, fan out two subagents, and let one open a draft PR against a CI-gated branch. For the broader picture, see [boosting developer productivity with AI tools](/en/posts/developer-productivity-ai-tools) and the rest of our [AI articles](/en/category/ai).

## Frequently Asked Questions

### Do Claude Code subagents run in the background automatically now?

Yes. As of v2.1.198 (July 1, 2026), subagents run in the background by default — you no longer opt them in. You dispatch scoped tasks from the main session and they execute concurrently. When one needs a permission, the prompt surfaces in your main session and names which subagent is asking, so you approve or deny from one place.

### How do background agents open pull requests?

Since v2.1.198, a background agent can carry a task end to end: make the change, run tests, commit, push a branch, and open a **draft** pull request, then return a link. It lands as a draft on purpose — nothing merges until a human marks it ready and approves. Pair it with a CI gate so the test suite, not the author, is the contract.

### What is the Manual permission mode in Claude Code?

Manual is the permission mode that reviews every action before it runs. As of v2.1.200 (July 3, 2026) it is the default. Note the naming: the label is "Manual" in the CLI and extensions, but its config value is `default`; the CLI also accepts `manual` as an alias, so `--permission-mode manual` works on v2.1.200+.

### When should I fan out subagents versus using one agent?

Fan out when the subtasks are genuinely independent — separate files, packages, or review dimensions with no shared evolving state. If subagent B needs subagent A's output to start, that is a chain, and a single agent with a plan will beat two agents stepping on each other. Cap the fan-out width with the dynamic workflow-size config added in v2.1.202.
