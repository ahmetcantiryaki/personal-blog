---
title: "What Does Claude Code's /skill-doctor Command Do?"
slug: "claude-code-skill-doctor-command-explained"
translationKey: "claude-code-skill-doctor-plugin-dir-2026"
locale: "en"
excerpt: "Claude Code's /skill-doctor, shipped September 4, 2026, reports which loaded skills go unused and how many tokens each one costs your context every turn."
category: "ai"
tags: ["claude", "ai-coding", "developer-experience", "ai-tools"]
publishedAt: "2026-09-09"
seoTitle: "Claude Code's /skill-doctor Command Explained"
seoDescription: "Claude Code's /skill-doctor, shipped September 4, 2026, reports which loaded skills go unused and how many tokens each one costs your context every turn."
---

Short answer: `/skill-doctor` is a Claude Code command that lists every skill loaded into your session, flags the ones you never invoked, and shows how many tokens each one adds to your context on every turn. It shipped on September 4, 2026, in Claude Code 2.1.252, and it exists because a skill sitting unused in your listing still costs you context on every single message.

## What does /skill-doctor do?

`/skill-doctor` generates a report of every skill's context cost and how often it actually gets used, then recommends which ones to turn off, starting with the most expensive. Run it with no arguments:

```bash
/skill-doctor
```

The report covers personal skills, project skills, and plugin skills, including plugins you installed but haven't used recently. It deliberately skips two categories: bundled skills (the ones Claude Code ships with) and enterprise skills pushed by an admin. Those aren't yours to disable, so the tool doesn't bother auditing them.

## How do you read the /skill-doctor report?

The report has one job: show you which skills are earning their keep and which aren't. In an interactive session, it opens inside the `/plugin` manager's Stats tab; run Claude Code non-interactively with the `-p` flag and it prints as plain text instead.

For each skill, the report lists three things: how many tokens its entry adds to the skill listing, how many times it was actually invoked in the session, and whether it's ever been called at all. A skill flagged as unused isn't automatically a bad skill — it may simply not have come up in your recent work. Whether that's a problem depends on why you installed it in the first place.

| Skill source | Covered by /skill-doctor |
|---|---|
| Personal skills (`~/.claude/skills`) | Yes |
| Project skills (`.claude/skills`) | Yes |
| Plugin skills | Yes, including unused plugins |
| Bundled skills (ship with Claude Code) | No |
| Enterprise skills (admin-managed) | No |

Two caveats worth knowing before you rely on it: `/skill-doctor` requires Claude Code 2.1.252 or later, and it doesn't work at all if your session skipped feature-flag fetching. It also isn't available over Remote Control — running it from your phone or browser returns "Skill usage reports are not available on this connection." The workaround is simple: run it in the terminal, on the machine where the session actually lives.

## Why does an unused skill cost you context?

Every skill in your listing gets added to context on every turn, whether Claude uses it or not — that listing is how the model knows what's available to call. A skill you installed for one project and forgot about is still billed against your context budget on message 200 of an unrelated session, even if it never fires once.

Claude Code caps how much of your context window the skill listing can consume. The `skillListingBudgetFraction` setting controls that cap, and it defaults to 1% of your context window:

```json
{
  "skillListingBudgetFraction": 0.01
}
```

Run `/context` and check the "Skills" row to see the actual post-budget size of your listing — that's what the model receives, not the raw sum of every skill's description. If you're running a dozen skills across three plugins on a long-lived project repo, `/skill-doctor` is how you find out which ones are worth that cross-turn tax and which ones are dead weight.

## What changed with --plugin-dir?

The same September 8, 2026 release (Claude Code 2.1.265) extended `--plugin-dir` to load a whole folder of plugins at once instead of just one. Previously, testing multiple local plugins meant repeating the flag:

```bash
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

Now you can point `--plugin-dir` at a parent directory, and Claude Code auto-loads every child folder that has its own plugin manifest — no need to enumerate each one by hand. `--plugin-dir` still accepts a single plugin folder or a `.zip` archive as before, and a local plugin loaded this way still takes precedence over an installed marketplace plugin of the same name for that session, with one exception: it can't override a plugin an admin has force-enabled or force-disabled through managed settings.

This matters most for teams building an internal plugin collection: instead of a `--plugin-dir` flag per plugin in a launch script, one flag pointing at the shared plugins folder now loads all of them.

## Should you run /skill-doctor on every project?

Run it on any project where skills and plugins accumulate over time — team repos are the clearest case, since different people add skills for their own workflows and nobody circles back to prune the ones nobody else uses. On a personal setup with one or two skills, the audit isn't worth the interruption; the context saved by disabling a single unused skill is marginal.

The pattern worth watching for is a plugin that seemed useful when you installed it, kept showing up in every `/skill-doctor` report as unused for weeks, and never got removed. That's the exact case the command was built to surface — set a reminder to run it after any sprint where you or a teammate added new skills, not on some fixed weekly schedule.

If you're building your own plugins rather than just consuming them, see our guide on how to [build and share Claude Code plugins](/en/posts/build-and-share-claude-code-plugins). For the mechanics of how skills work more broadly, [our Claude Skills explainer](/en/posts/claude-skills-explained-for-everyone) covers the basics, and if context and cost tracking is what you're after, [our piece on Claude Code's spend limits and cache metrics](/en/posts/claude-code-spend-limits-prompt-cache-metrics) covers the budget side. For background agents and multi-skill workflows, see [our subagents guide](/en/posts/claude-code-subagents-background-agents). More coverage lives in [our AI category](/en/category/ai).

Sources: [Claude Code's skills documentation](https://code.claude.com/docs/en/skills), [the plugins guide](https://code.claude.com/docs/en/plugins), and [the Claude Code changelog](https://code.claude.com/docs/en/changelog).

## Frequently Asked Questions

### Does /skill-doctor audit Claude Code's bundled skills?

No. `/skill-doctor` only reports on personal skills, project skills, and plugin skills. Bundled skills that ship with Claude Code and enterprise skills pushed by an admin are excluded from the report because you can't disable either one yourself.

### Can I run /skill-doctor from my phone over Remote Control?

No. Claude Code returns "Skill usage reports are not available on this connection" when you run `/skill-doctor` over Remote Control. Run it directly in the terminal on the machine where the session lives instead.

### What Claude Code version do I need for /skill-doctor?

You need Claude Code 2.1.252 or later. The command also won't run in sessions that have skipped feature-flag fetching, regardless of version.

### Does --plugin-dir replace plugin marketplaces for distribution?

No. `--plugin-dir` is a local development and testing tool — it loads plugins directly from disk for one session without installing them. Marketplaces are still how you distribute a finished plugin to teammates or the community.
