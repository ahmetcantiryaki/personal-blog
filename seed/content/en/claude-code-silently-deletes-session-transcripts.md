---
title: "Claude Code Silently Deletes Session Transcripts"
slug: "claude-code-silently-deletes-session-transcripts"
translationKey: "claude-code-transcript-deletion-bug"
locale: "en"
excerpt: "Claude Code erases local session transcripts older than 30 days by default, with no warning and no recovery. Here's why, what Anthropic says, and the fix."
category: "ai"
tags: ["claude", "reliability", "ai-tools", "best-practices"]
publishedAt: "2026-07-21"
seoTitle: "Claude Code's 30-Day Transcript Deletion Bug, Explained"
seoDescription: "Claude Code deletes local chat transcripts after 30 days by default, silently. We cover the open GitHub issues, Anthropic's rationale, and the workaround."
---

Claude Code deletes local session transcripts older than 30 days by default, every time it starts up — with no warning dialog, no first-run disclosure, and no recovery command. The setting is real, it is documented in `~/.claude/settings.json`, and as of July 2026 Anthropic has confirmed it is not changing the underlying policy, only acknowledging the rollout was badly communicated.

## How the cleanup actually works

Claude Code stores every chat as a plain JSONL transcript under `~/.claude/projects/<encoded-cwd>/` — one file per session, readable as plain text. A config key called `cleanupPeriodDays` controls how long those files live before Claude Code unlinks them, and it defaults to 30 days. There is no soft delete, no trash folder, and no `claude history restore` command; the file is simply gone. The cleanup runs on every startup, not on a schedule, so a transcript can vanish the moment you next open your terminal after the retention window passes. None of this is surfaced in the `/config` command, and nothing in the CLI's first-run flow mentions it, which is why most developers only discover the setting exists after they've already lost something.

## The open GitHub issues

Community bug reports go back months, and three issues capture most of the pattern. The most alarming one, [issue #62272](https://github.com/anthropics/claude-code/issues/62272), documents a user who had explicitly set `cleanupPeriodDays: 36500` — roughly a 100-year retention window — and still lost 490 sessions. That report suggests the deletion sometimes runs through a code path that ignores the configured override entirely; Anthropic has not fully isolated the trigger, but community reports point most often to VS Code or extension restarts and CLI updates as the moments it happens.

| Issue | Core symptom | Status (July 2026) |
|---|---|---|
| #62272 | `cleanupPeriodDays` set to 36500 days, 490 sessions still deleted | Open |
| #62476 | Transcripts silently deleted after 30 days by default, no warning | Open |
| #59248 | No opt-in, no warning, and no recovery mechanism for cleanup | Open |

A related annoyance compounds the trust problem: the Claude Code sidebar keeps listing sessions that have already been deleted from disk. Click one of those "ghost" entries and you get a "session not found on disk" error instead of your history — the UI simply hasn't caught up with what the cleanup job already destroyed.

## Anthropic's rationale, and why it's not the whole story

Asked about this by The Register, Anthropic said the 30-day erasure has existed since Claude Code's launch as a deliberate security measure: coding transcripts can contain source code, API keys, and other credentials in plain text, and leaving that on disk indefinitely is its own risk. That's a defensible position on its own — retention limits are a normal part of a sane security posture, and plenty of engineering tools age out logs by default. Deleting sensitive data on a schedule as a security default is reasonable; shipping it with zero warning, no confirmation step, and a config override that some users report doesn't even hold is not, and that's the actual complaint driving these GitHub issues, not the existence of a retention policy. Coverage of the story, including [The Register's June 30 report](https://www.theregister.com/ai-and-ml/2026/06/30/claude-code-users-complain-their-chat-records-are-being-mysteriously-wiped-out/5264673) and a widely upvoted Hacker News thread, converged on the same read: the concept is fine, the execution is not.

## The July 14 rumor, fact-checked

A separate rumor circulated on July 14, 2026, claiming "a new Claude update deleted conversations," and it got tangled up with the 30-day cleanup story even though the two are largely unrelated. Checking Anthropic's own [Claude Code changelog](https://code.claude.com/docs/en/changelog), the only things that shipped that day were a self-serve HIPAA configuration option for Claude Enterprise and API customers — unrelated to transcript retention — and two minor CLI patch releases, 2.1.208 and 2.1.209, with routine bug fixes. There was no major update on July 14 that mass-deleted anyone's history. Separately, some desktop app users did report the app silently crashing and restarting without an error dialog, losing an in-progress, unsynced conversation — a real but narrower bug, distinct from the scheduled 30-day cleanup. As of Claude Code 2.1.216, released July 20, 2026, the changelog still does not mention any fix to `cleanupPeriodDays` behavior; recent releases have focused on other stability and permission issues.

## What to do right now

The community workaround is to raise the retention window in your settings file:

```json
{
  "cleanupPeriodDays": 3650
}
```

Set this in `~/.claude/settings.json` (or your project's `.claude/settings.json` for a per-project override) and Claude Code will, in most cases, keep transcripts for roughly ten years instead of 30 days. Treat that as a mitigation, not a guarantee — issue #62272 is exactly a case where a much larger number than this still didn't stop deletion, so the override is not airtight. If you actually depend on your session history for audits, billing, or reconstructing a decision trail, back the JSONL files up externally: a simple cron job that copies `~/.claude/projects/` to cloud storage or a separate disk is more reliable than any config value. If you're already relying on Claude Code for team workflows, it's worth reading up on the [subagent and background agent model](/en/posts/claude-code-subagents-background-agents) and the CLI's [recently added guardrails against runaway agents](/en/posts/claude-code-runaway-agent-guardrails) — both areas where "silent by default" behavior has been a recurring theme this year, alongside [Claude Code's hidden tracking code](/en/posts/claude-code-hidden-tracking-code) from an earlier report.

## If you've already lost history

For macOS users who had Time Machine running, a third-party tool called [`restore-claude-history`](https://github.com/garrettmoss/restore-claude-history) on GitHub can recover deleted JSONL transcripts from Time Machine snapshots. It's not an Anthropic-supported tool, so use it with the usual caution for anything that touches your filesystem, but it's the most concrete recovery path available today for data that's already gone. There is currently no equivalent for Windows or Linux, and no server-side backup you can request from Anthropic — local transcripts are exactly that, local.

## The broader lesson for anyone scripting around Claude Code

If you're building tooling on top of Claude Code — piping transcripts into an internal dashboard, logging sessions for compliance, or just relying on `/resume` to pick up old conversations — treat `~/.claude/projects/` as ephemeral storage by design, not an archive. That's true independent of whether Anthropic eventually adds a confirmation dialog or an explicit opt-out; the current failure mode (override sometimes ignored, no recovery, no first-run disclosure) is unresolved as of this writing, and the same discipline that applies to [avoiding common AI coding assistant mistakes](/en/posts/ai-coding-assistant-mistakes) — don't trust a tool's defaults with anything you can't afford to lose — applies here directly.

## Frequently Asked Questions

### Does Claude Code really delete my chat history automatically?

Yes. By default, any local session transcript older than 30 days is deleted the next time Claude Code starts, controlled by the `cleanupPeriodDays` setting in `~/.claude/settings.json`. There's no confirmation prompt and no built-in way to recover a deleted file.

### Does raising `cleanupPeriodDays` actually stop the deletions?

For most users, yes — setting it to a much larger number, like 3650, extends retention accordingly. But GitHub issue #62272 documents a case where `cleanupPeriodDays` was set to 36500 and 490 sessions were still deleted, so the override is not guaranteed to hold in every scenario. Anthropic has not published a root cause for that discrepancy.

### Was this caused by a recent Claude Code update?

No. The 30-day cleanup has existed since launch as a stated security measure. A separate rumor on July 14, 2026 wrongly attributed mass deletions to a new update; the actual changes that day were an unrelated HIPAA configuration option and two minor patch releases with routine fixes.

### How can I back up my Claude Code session transcripts?

Copy the `~/.claude/projects/` directory to external storage on a schedule — a cron job or a simple backup script is more reliable than relying on the `cleanupPeriodDays` override alone. macOS users with Time Machine enabled also have a community recovery tool, `restore-claude-history`, for transcripts already deleted.
