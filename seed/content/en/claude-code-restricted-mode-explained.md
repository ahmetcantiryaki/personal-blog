---
title: "What Is Claude Code's --restricted Mode?"
slug: "claude-code-restricted-mode-explained"
translationKey: "claude-code-restricted-mode"
locale: "en"
excerpt: "Claude Code's --restricted flag (v2.1.248+) removes command and code tools, locks file access to the working directory, and refuses bypassPermissions in CI."
category: "ai"
tags: ["claude", "ci-cd", "web-security", "automation", "devops"]
publishedAt: "2026-08-28"
seoTitle: "What Is Claude Code's --restricted Mode?"
seoDescription: "Claude Code's --restricted flag (v2.1.248+, Aug 2026) drops command and code tools, locks file access to the working directory, and blocks bypassPermissions."
---

Claude Code's `--restricted` mode is a CLI flag, shipped in v2.1.248 on August 27, 2026, that starts a session locked down for shared or automated machines. It removes tools that run commands or code, confines file access to the session's working directories, ignores user- and project-level settings files, and refuses `bypassPermissions` outright — no session started with `--restricted` can be told to skip permission checks.

## What Is Claude Code's --restricted Mode?

`--restricted` is a startup flag for the `claude` CLI, not a runtime toggle you flip mid-session. You pass it when you launch Claude Code, and it changes what the session is allowed to do for its entire lifetime. Anthropic built it for a specific problem: evaluation harnesses and CI pipelines that drive `claude` on a shared machine, where the person running the harness isn't necessarily the person who owns that machine's settings or its file system.

The core idea is that a `--restricted` session should not be able to run arbitrary commands, read personal configuration it wasn't handed explicitly, or touch files outside the job it was given. That is a different posture than every other Claude Code permission mode, which assumes the operator running the session is also the one who should decide what it can touch.

## What Does --restricted Actually Lock Down?

`--restricted` changes four things about how a session behaves, and all four are on by default the moment the flag is set. First, it removes every built-in tool that runs commands or code — plus `WebFetch` — unless you name that tool explicitly in `--tools`; passing the `default` preset does not bring them back. Second, it confines file-reading and file-writing tools to the session's working directories, so a restricted session can't wander into other parts of the disk. Third, it loads only managed (org-level) settings plus whatever you pass via `--settings`, and ignores user-level and project-level settings files entirely. Fourth, it refuses `bypassPermissions` mode and the `--dangerously-skip-permissions` flag — you cannot combine `--restricted` with a request to skip permission checks; the CLI rejects it.

That last point is worth sitting with: `--restricted` isn't just a stricter default, it's a ceiling. No config file, no flag combination, and no `default` preset can raise a restricted session back to full command-and-code access.

## How Does --restricted Compare to Claude Code's Other Permission Modes?

Claude Code has run several permission modes for a while — `default` (manual), `plan`, `acceptEdits`, `dontAsk`/`auto`, and `bypassPermissions` — and `--restricted` sits at the opposite end of that spectrum from `bypassPermissions`.

| Mode | Runs Without Asking | Best For |
| --- | --- | --- |
| `default` (manual) | Nothing risky; every command or write prompts | Interactive coding sessions with a human at the keyboard |
| `plan` | Nothing; Claude proposes a plan before any edit or command runs | Reviewing an approach before touching a codebase |
| `acceptEdits` | File edits only; commands still prompt | Fast iterative editing with a trusted human still watching commands |
| `dontAsk` / `auto` | Most tool calls, per configured allow/deny rules | Trusted local workflows where prompts would just slow things down |
| `bypassPermissions` | Everything, no prompts at all | Fully sandboxed, disposable environments only |
| `--restricted` | Only file tools scoped to the working directory; command/code tools removed unless named explicitly | CI runners, eval harnesses, and other unattended sessions on shared machines |

The distinction that matters most: every mode above `--restricted` decides how much to ask a trusted operator. `--restricted` starts from the assumption that the process launching the session, or the machine it's running on, might not be trustworthy at all — so it removes capability rather than adjusting how much it prompts for it.

## When Should You Reach for --restricted?

Use `--restricted` whenever `claude` is driven by an automated process on infrastructure you don't fully control — a shared CI runner, a third-party eval harness, a grading pipeline, or a build agent that also runs other tenants' jobs. In those contexts, a compromised or malicious prompt should not be able to escalate into running arbitrary shell commands or reading another job's settings.

It's a weaker fit for your own laptop or a dedicated, single-tenant CI box you fully trust, where `acceptEdits` or `dontAsk` gets more done with less friction. `--restricted` trades convenience for a hard ceiling on capability, and that trade only pays off when the environment itself is the thing you're not sure about.

This is the same reasoning behind [Claude Code's guardrails against runaway agents](/en/posts/claude-code-runaway-agent-guardrails) and its move toward [self-hosted execution environments](/en/posts/claude-code-self-hosted-environments): as more of Claude Code's usage shifts from a human at a terminal to an unattended process in a pipeline, the default assumption has to shift from "trust the operator" to "assume the sandbox might be hostile." If you're also weighing when [auto mode](/en/posts/claude-code-auto-mode-explained) is appropriate versus when it isn't, `--restricted` is the mode for exactly the cases where auto mode would be too permissive.

## How Do You Enable --restricted Mode?

`--restricted` works with any Claude Code entry point that accepts CLI flags, including non-interactive `-p` (print) invocations, which is the shape most CI jobs and eval harnesses use:

```bash
claude --restricted -p "query"
```

If a specific job genuinely needs a command-running tool — say, a test runner invoked through Bash — you have to name it explicitly:

```bash
claude --restricted --tools Bash -p "run the test suite and report failures"
```

Naming `Bash` here restores just that one tool; every other command- or code-running tool, plus `WebFetch`, stays removed. Passing `--tools default` does not undo the restriction — the docs are explicit that the `default` preset is not a backdoor around `--restricted`.

## Why Does This Matter in August 2026?

`--restricted` is new, but the risk it targets isn't. In February 2026, Anthropic patched [CVE-2026-33068](https://code.claude.com/docs/en/changelog), a "Workspace Trust Dialog Bypass via Repo-Controlled Settings File" affecting Claude Code versions before v2.1.53: a malicious repository could ship a committed `.claude/settings.json` with `permissions.defaultMode` set to `bypassPermissions`, silently skipping the trust dialog the first time someone opened that repo (CVSS 7.7, High). That bug is old news — it was fixed months before this release, and it isn't what shipped on August 27.

What `--restricted` adds is a direct, stronger continuation of that same fix. Where the CVE patch stopped a repo's settings file from silently *escalating* permissions, `--restricted` goes further and stops a session from reading project- or user-level settings files at all, loading only managed org policy and anything passed explicitly via `--settings`. A repo-controlled settings file simply can't reach a `--restricted` session, whether or not it tries anything malicious.

My honest take: this is the right default for any agentic CLI tool that runs unattended, and more of them should ship an equivalent. An eval harness or CI runner is, by construction, feeding an agent input it didn't fully author — untrusted prompts, untrusted repos, sometimes untrusted plugins, as covered in [Claude's plugin and skill security scanner](/en/posts/claude-skill-plugin-security-scanning). Treating the execution environment as adversarial by default, rather than bolting restrictions on after an incident like the one in [Friendly Fire's RCE writeup](/en/posts/friendly-fire-claude-code-security-exploit), is the posture agentic tooling needs as it moves further from a human's own laptop and further into other people's infrastructure. See the full mode reference in Anthropic's [permission modes docs](https://code.claude.com/docs/en/permission-modes) and [CLI reference](https://code.claude.com/docs/en/cli-reference) for the rest of the category — this piece is filed under [AI](/en/category/ai) alongside our other Claude Code coverage.

## Frequently Asked Questions

### What version of Claude Code do I need for --restricted mode?

You need Claude Code v2.1.248 or later, released August 27, 2026. Earlier versions don't recognize the `--restricted` flag at all, so CI images and eval harness containers pinned to older versions need an upgrade before they can use it.

### Can I run bash commands in Claude Code's --restricted mode?

Not by default — `--restricted` removes every built-in tool that runs commands or code, including Bash, unless you name it explicitly with `--tools`. Running `claude --restricted --tools Bash -p "..."` restores Bash specifically while every other command- and code-running tool, plus `WebFetch`, stays removed.

### Does --restricted mode read my project's .claude/settings.json?

No. `--restricted` loads only managed (org-level) settings plus anything passed via `--settings` on the command line, and ignores user-level and project-level settings files entirely. That's a deliberate design choice, not a bug — it keeps a repo-controlled settings file from influencing a restricted session at all.

### Is --restricted the same as bypassPermissions with extra logging?

No, they're opposites. `bypassPermissions` runs every tool call without asking; `--restricted` refuses to even start in `bypassPermissions` mode and rejects the `--dangerously-skip-permissions` flag outright, so a restricted session can never be told to skip its own permission checks.
