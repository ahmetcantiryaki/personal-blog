---
title: "Why Did Claude Code Change Sandboxed Bash Permissions?"
slug: "claude-code-sandboxed-bash-permissions-change"
translationKey: "claude-code-sandboxed-bash-permissions-2026"
locale: "en"
excerpt: "Claude Code 2.1.325 moved sandboxed Bash commands onto the normal permission flow. Restore silent runs with sandbox.autoAllowBashIfSandboxed before CI stalls."
category: "ai"
tags: ["claude", "ai-agents", "automation", "best-practices"]
publishedAt: "2026-11-16"
seoTitle: "Claude Code Sandboxed Bash Permissions Explained"
seoDescription: "Claude Code 2.1.325 moved sandboxed Bash commands onto the normal permission flow. Here's what changed, the settings fix, and the CI impact."
---

Short answer: as of Claude Code 2.1.325, released November 13, 2026, Bash commands running inside the sandbox now go through the normal permission flow instead of running silently. If your automation relied on sandboxed commands executing without a prompt, you need to set `sandbox.autoAllowBashIfSandboxed: true` in your settings to keep that behavior.

## What exactly changed in Claude Code 2.1.325?

Before this release, any Bash command running inside Claude Code's OS-level sandbox was treated as automatically safe and skipped the permission prompt entirely — being inside the sandbox was itself the approval. Starting November 13, 2026, that assumption is gone: sandboxed commands now follow the same permission flow as unsandboxed ones. A command like `rm`, `git push`, or a setup script can now trigger a confirmation prompt even while running inside the sandbox.

The sandbox's isolation behavior itself didn't change — files and network access are still contained the same way. What changed is the assumption that isolation equals automatic approval.

## Why did Anthropic make this change?

Anthropic's own changelog doesn't spell out a rationale, but the shift lines up with a broader pattern: treating the sandbox as an isolated-but-still-supervised workspace rather than a permission bypass. Isolation limits what a command can touch on disk and over the network, but it doesn't guarantee the command itself is harmless — you can still delete the wrong file or fire an unexpected network request from inside a sandbox. The same 2.1.325 release also keeps the sandbox refusing writes to `.claude` settings, skills, agents, and hooks, which fits the same "sandboxed isn't the same as unlimited trust" direction.

## How do you restore the old silent-run behavior?

Add this to your `settings.json` to keep sandboxed Bash commands running without a prompt:

```json
{
  "sandbox": {
    "autoAllowBashIfSandboxed": true
  }
}
```

You can set this in user, project, or managed (organization) settings. If your sandbox is turned on through managed settings at the organization level, the setting needs to go in your highest-ranking managed settings source — a user-level setting alone won't override organization policy.

## What else changed for automation in the same release?

2.1.325 shipped two other changes that affect unattended runs. First, scheduled tasks and `/loop` now ask before running a skill that declares `allowed-tools` or hooks; add `Skill(skill-name)` to `permissions.allow` to keep that skill running unattended. Second, read-only git commands — things like `git log` or `git diff` — now ask first the first time they touch a repository that isn't the project's own or one you've already trusted; the fix is naming that directory with `--add-dir`, not the `additionalDirectories` setting.

| Behavior | Before 2.1.325 | 2.1.325 and later |
|---|---|---|
| Bash command inside the sandbox | Runs with no prompt | Goes through the normal permission flow |
| Restoring silent runs | Not needed (silent was default) | Requires `sandbox.autoAllowBashIfSandboxed: true` |
| Skill with `allowed-tools`/hooks in a scheduled task or `/loop` | Runs with no prompt | Needs `Skill(name)` added to `permissions.allow` |
| Read-only git command in an untrusted repo | Runs with no prompt | Needs the directory named via `--add-dir` |

## How does this affect CI and unattended pipelines?

If you run Claude Code in auto mode, inside a CI pipeline, or as a scheduled task with nobody watching, upgrading to 2.1.325 can leave that pipeline stuck on a permission prompt nobody answers — the run times out or hangs instead of failing cleanly. The practical fix is to add `sandbox.autoAllowBashIfSandboxed: true` and the matching `Skill(name)` entries in `permissions.allow` before you upgrade, not after you find the broken run in production.

My honest take: the change itself is defensible, but Anthropic tends to compress behavior changes like this into a single changelog line. Teams that built unattended automation around the old default deserved a deprecation window or a dedicated migration note, not a silent default flip buried in a point release. A similar tightening shows up in [Claude Code's rollout of auto mode as the default](/en/posts/claude-code-auto-mode-becomes-default) — Anthropic keeps making unattended runs more capable while also adding more places where they can stop and ask.

## What should you check before upgrading?

Start by listing every pipeline, scheduled task, or `/loop` routine that runs Bash inside the sandbox. For each one, answer three questions: does it need to run with nobody present, does it use any skill that declares `allowed-tools` or hooks, and does it touch repositories outside the project directory. Once you have those answers, adding the right `sandbox.autoAllowBashIfSandboxed` and `permissions.allow` entries to `settings.json` takes a few minutes, not a few hours. This ties into the broader reason [AI agents run inside sandboxes or VMs](/en/posts/why-ai-agents-run-in-sandboxes-vms) in the first place — isolation was never meant to replace oversight, just contain the blast radius when oversight fails.

## How does this interact with auto mode?

Auto mode works by running a classifier that blocks commands it judges risky and lets safe-looking ones through without a prompt, and the sandbox has usually been one of auto mode's supporting safety layers. Before 2.1.325, the auto-mode-plus-sandbox combination let a lot of Bash commands through unprompted, simply because running inside the sandbox already counted as approval. That shortcut is gone now — the classifier still blocks commands it considers risky, but "I'm in the sandbox" no longer auto-approves anything on its own. In practice, that means teams that rolled out [auto mode as the default](/en/posts/claude-code-auto-mode-becomes-default) can see new, unexpected stalls on any sandboxed task that doesn't already have `autoAllowBashIfSandboxed` set.

This fits the same pattern as earlier safeguards, like [Claude Code warning before it leaks your email](/en/posts/claude-code-warns-before-leaking-email) — Anthropic keeps closing off individual cases where the agent could act without a prompt. What makes the sandbox change different is scope: it's not one specific action, it's every piece of automation that leans on the sandbox.

## Frequently Asked Questions

### Why did Claude Code suddenly start asking for permission on Bash commands after an update?

Short answer: Claude Code 2.1.325, released November 13, 2026, moved sandboxed Bash commands onto the normal permission flow. Being inside the sandbox used to mean automatic approval; now it doesn't. Set `sandbox.autoAllowBashIfSandboxed: true` in `settings.json` to restore the old silent behavior.

### Where should I set sandbox.autoAllowBashIfSandboxed?

Short answer: in whichever settings file fits your setup — user, project, or managed (organization) settings. If your organization enforces the sandbox through managed settings, the setting must go in your highest-ranking managed settings source, since a local setting can't override organization policy.

### Does this change also affect scheduled tasks and /loop?

Yes. The same release made scheduled tasks and `/loop` ask before running any skill that declares `allowed-tools` or hooks. To keep a specific skill running unattended, add `Skill(skill-name)` to the `permissions.allow` list in your settings.

### Why is my CI pipeline hanging after upgrading Claude Code?

Short answer: your pipeline likely runs sandboxed Bash and is now waiting on a permission prompt that nobody can answer. Add `sandbox.autoAllowBashIfSandboxed: true` and any required `Skill(name)` entries to `permissions.allow` in `settings.json` before upgrading to avoid the stall.

**Sources:** [Claude Code changelog](https://code.claude.com/docs/en/changelog), [Claude release notes overview](https://platform.claude.com/docs/en/release-notes/overview).
