---
title: "Why Can't Claude Code Write Outside Your Working Directory?"
slug: "why-cant-claude-code-write-outside-working-directory"
translationKey: "claude-code-blocks-writes-outside-working-dir-2026"
locale: "en"
excerpt: "Short answer: Claude Code 2.1.314 (Oct 30, 2026) blocks Write, Edit, and NotebookEdit from writing outside the working directory, in every permission mode."
category: "software-engineering"
tags: ["claude", "ai-coding", "ai-agents"]
publishedAt: "2026-10-30"
seoTitle: "Claude Code 2.1.314: Blocks Writes Outside Your Dir"
seoDescription: "Claude Code's new blockWritesOutsideWorkingDirectories setting explained: what it blocks, how it interacts with bypassPermissions, and why it matters for CI."
---

Short answer: Claude Code 2.1.314, released October 30, 2026, adds the `permissions.blockWritesOutsideWorkingDirectories` setting. With it on, the Write, Edit, and NotebookEdit tools refuse to touch any path outside the working directories — in every permission mode, including `bypassPermissions` and auto mode.

## What does blockWritesOutsideWorkingDirectories actually do?

It stops Claude Code's three file-modifying tools — Write, Edit, NotebookEdit — before they write to any path outside the session's working directories. The [official changelog](https://code.claude.com/docs/en/changelog) states it plainly: "Write, Edit and NotebookEdit refuse paths outside the working directories in every permission mode." That's not a permission prompt you can approve past — it's a fixed rule the agent cannot override by switching to a looser mode.

Turning it on is one line in `.claude/settings.json`:

```json
{
  "permissions": {
    "blockWritesOutsideWorkingDirectories": true
  }
}
```

## Which permission modes does this cover?

All of them — `default`, `acceptEdits`, `bypassPermissions`, and `auto`. That's the key behavioral change: `bypassPermissions` mode, as the name implies, skips approval prompts, but with this setting on, the directory boundary becomes a constant independent of permission mode. An unattended CI agent or automation script can't be steered — by accident or by a malicious prompt — into writing a file outside its working directory.

A separate change in 2.1.309 (October 22, 2026) points the same direction: dangerous `rm`/`rmdir` commands in bypass mode now get denied instantly, with a rewrite hint, instead of prompting — keeping unattended sessions moving while still filtering out destructive commands.

## How is this different from the read-side equivalent?

The read-side counterpart, `permissions.blockReadsOutsideWorkingDirectories`, had already been live for weeks, restricting tools like Read, Grep, and Glob from reading outside the working directory. The October 26, 2026 release (2.1.311) fixed a Linux sandbox bug (`bwrap: Can't create file`) tied to that same setting — meaning it had been running in production for a while already. It took close to a month for the write side to get the same hard boundary.

That gap isn't an accident: the risk of an unintended read (accidentally seeing a file you shouldn't) is lower-stakes than the risk of an unintended write (corrupting or overwriting a file outside the project, possibly a system file). Anthropic appears to have locked down the lower-risk side first, observed it in production, then closed the higher-risk gap.

| | Read block (blockReadsOutsideWorkingDirectories) | Write block (blockWritesOutsideWorkingDirectories) |
|---|---|---|
| Tools affected | Read, Grep, Glob, LSP | Write, Edit, NotebookEdit |
| Shipped | ~v2.1.257 (in production for weeks) | v2.1.314, October 30, 2026 |
| Risk type | Data leakage / privacy | Data corruption / destructive write |
| Independent of permission mode | Yes | Yes |

## Why does this matter for agents running unattended in CI/CD?

Because a CI agent typically runs without a human approving each step, which is exactly why a guarantee of "cannot write outside the working directory" stops being a nicety and becomes a security boundary. When [wiring agents into CI/CD](/en/posts/ai-agents-in-cicd-safely), the biggest risk is an agent getting steered — say, by instructions buried inside a dependency — into writing outside the repo or onto a shared build machine. This setting closes a meaningful slice of that exposure, not all of it.

That connects directly to the attack class known as [agentjacking](/en/posts/agentjacking-ai-agent-attack): an attacker who hijacks or misleads an agent is usually after filesystem access as the end goal. Making the working-directory boundary hold regardless of permission mode narrows that attack surface.

## How do you actually turn the setting on?

You add one key to a settings file, and where you put that file decides its scope. Claude Code reads permission settings from `.claude/settings.json` (project-wide, usually checked into the repo), `.claude/settings.local.json` (local overrides, typically gitignored), or a user-level settings file for every project on a machine. Dropping `blockWritesOutsideWorkingDirectories: true` under the `permissions` key in the project file means every contributor and every CI job that checks out the repo inherits the same boundary — nobody has to remember to turn it on by hand.

That matters operationally: a setting that depends on each developer enabling it locally will drift, because someone always forgets. A setting committed to `.claude/settings.json` ships with the repo, so a fresh `git clone` followed by a Claude Code session gets the restriction automatically, including on a CI runner that checks out the repo fresh for every job.

## Does this close off every risk?

No — the setting only covers Write, Edit, and NotebookEdit; a command run through Bash can still write outside the working directory, because shell commands aren't in scope for these three tools. As the [Claude Code vs Cursor vs Antigravity](/en/posts/claude-code-vs-cursor-vs-antigravity-2026) comparison shows, different agent tools enforce file-access boundaries at different layers — some lean on OS-level sandboxing (Linux's `bwrap`, referenced in the 2.1.311 fix above, is one such layer), others on per-tool checks like this one. This new setting is a boundary at Claude Code's tool layer, not its shell or OS layer, so teams running agents unattended should pair it with sandboxed command execution rather than treat it as a complete containment story.

The full list of changes for this and every other release is tracked in the project's own [CHANGELOG.md on GitHub](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md), which is the fastest place to confirm a specific version's behavior if the hosted changelog page is slow to update.

My take: this is less a new capability than a hardened guarantee about what the agent *cannot* do — and that kind of negative guarantee is worth more than a positive feature, especially in unattended automation. The story completes once a follow-up setting applies the same rigor to Bash commands.

For teams evaluating agents through an [open-source security](/en/posts/ai-slop-open-source-security) lens, this is a concrete example of "secure by default" enforced at the tool layer rather than left to the agent's judgment.

## Frequently Asked Questions

### What does blockWritesOutsideWorkingDirectories do?

It blocks Claude Code's Write, Edit, and NotebookEdit tools from writing to any path outside the working directories, regardless of permission mode — including bypassPermissions and auto mode. Enable it in `.claude/settings.json` with `permissions.blockWritesOutsideWorkingDirectories: true`.

### Does this setting also apply in bypassPermissions mode?

Yes. The changelog says it applies "in every permission mode"; bypassPermissions skipping approval prompts doesn't let it skip this directory boundary — the boundary is enforced independently of permission mode.

### How is the write block different from the read block?

`blockReadsOutsideWorkingDirectories` started restricting tools like Read, Grep, and Glob from reading outside the working directory weeks earlier; `blockWritesOutsideWorkingDirectories` brought the same boundary to the write-side tools on October 30, 2026 (v2.1.314). The distinction matters because an unintended write is typically more destructive than an unintended read.

### Does this setting stop Bash commands from writing outside the directory too?

No. It only covers the Write, Edit, and NotebookEdit tools; a command run through Bash (a script or CLI tool, for example) can still write files outside the working directory, since shell commands aren't within these three tools' enforcement scope.
