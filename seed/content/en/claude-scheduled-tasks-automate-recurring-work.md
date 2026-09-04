---
title: "Claude Scheduled Tasks: Automate Recurring Work"
slug: "claude-scheduled-tasks-automate-recurring-work"
translationKey: "claude-cowork-scheduled-tasks"
locale: "en"
excerpt: "Short answer: in Cowork you describe a task once and pick a cadence; Claude runs it in its own session automatically, even while your computer is off."
category: "ai"
tags: ["claude", "automation", "workflow", "productivity"]
publishedAt: "2026-09-04"
seoTitle: "Claude Scheduled Tasks: A 2026 Automation Guide"
seoDescription: "How do Claude Cowork's scheduled tasks work? Good prompt design, the notification gap, and safety limits for autonomous runs, plus a weekly template."
---

Short answer: a scheduled task in Claude Cowork is an automation where you describe an instruction once and Claude saves it, then runs it automatically on a cadence you choose — daily, weekly, weekdays, or hourly — with each run spinning up its own Cowork session, remotely, even while your computer is off.

One catch: Cowork currently doesn't send a notification when a task finishes or fails — you have to check the Scheduled tab to see the result.

## What Is a Scheduled Task, and Where Does It Run?

A scheduled task is a Cowork feature where you write an instruction once, Claude saves it, and it re-runs automatically at the cadence you pick — daily, weekly, weekdays, hourly, or on demand. Each run spins up its own independent Cowork session rather than continuing a past conversation, which means every run starts from a clean state and past errors don't carry forward into the next one.

Tasks run remotely, so depending on their cadence they keep going even while your computer is asleep or the Claude Desktop app is closed. They can use connected Slack, file system, or other plugins to do web research, query files, and produce reports — a scheduled task can do anything a manually run Cowork session can do.

## How Do You Design a Good Recurring Prompt?

By writing an instruction with three properties: self-contained (it doesn't rely on a prior conversation for context), idempotent (running it twice doesn't produce a harmful side effect), and a clear success criterion (it states explicitly when the task counts as "done"). Because a scheduled task starts fresh every time it runs, instructions that reference a prior message — like "update the table above" — simply don't work.

For example, "summarize this week's sales numbers" is less reliable than a self-contained, measurable instruction like "pull the rows from the last 7 days from this Google Sheet link, calculate the total and week-over-week change, and write the result as a report in this format." Idempotency matters most for tasks that write files or send messages: if the task fires twice, it should overwrite the same file rather than create a new copy.

## How Do Results Actually Reach You When You're Away?

Right now, they don't fully reach you — that's the biggest practical limit of Cowork's scheduled tasks. Cowork doesn't send a push notification or email when a task completes or fails; you have to manually check the run history in the Scheduled tab to see the result. That can be a surprise for teams that set one up expecting to automatically get a weekly summary Monday morning.

Claude Code's situation is different: its Routines feature can send push and email notifications when triggered, and can even feed the result back into the same session. So if you need "notify me automatically when it's done" and you're using Claude Code, that's the more reliable option today versus Cowork's scheduled tasks. If you're staying in Cowork, the practical workaround is building a "send the result to Slack or email" step into the task itself — getting notified from the task's output, not from the platform.

## What Safety Guardrails Does an Autonomous Run Need?

By limiting three things: scope (which files, connectors, and plugins the task can access), permissions (which actions the task can take without asking for approval), and cost (how much token spend or time a single run can use). Because a scheduled task runs without human oversight, a broad permission that would be acceptable for a "one-off" manual session becomes much riskier when it's automatic and recurring.

The practical rule: give a scheduled task the narrowest set of connectors and file access it actually needs, not broad access "just in case." Tasks that read data and produce a report (like a weekly summary) carry low risk; tasks that delete files, make payments, or write to external systems need a much more careful approval step.

| Task type | Risk level | Recommended control |
|---|---|---|
| Report/summary generation | Low | Read-only access is sufficient |
| File updates | Medium | Access scoped to a specific folder |
| Sending email/Slack | Medium-high | A content-verification step before sending |
| Payments or writing to external systems | High | Human-approved flow, not automatic |

## When Should You Prefer a Scheduled Agent Over Zapier/Make?

When the task requires natural-language reasoning and judgment rather than a fixed API connection. Zapier or Make are more reliable and cheaper for deterministic, predefined flows like "when event A happens, do action B." But for a task that requires interpretation and synthesis — like "read this week's customer feedback, extract common themes, and write a prioritized list" — an agent that can reason beats a fixed flow.

The practical distinction: if the input and output can be fully defined ahead of time (when data in format X arrives, send an email in format Y), a classic automation tool is sufficient and cheaper. If the input varies and the output requires a summary, judgment call, or report, a scheduled Claude task produces a less brittle result.

## How Do You Debug Silent Failures?

By regularly checking the run history in the Scheduled tab after each run — since there's no notification, that's the only way to catch failures. When a task fails silently, it's usually one of three causes: it references a file or connector it no longer has access to, the instruction is too vague so the model interprets it differently each time, or a connected plugin's (Slack, email) authentication has expired.

The first debugging step is always the same: compare the output of the last several runs and check for inconsistency. Inconsistent results are usually a sign the instruction wasn't self-contained enough — which loops back to the first rule above.

For a deeper comparison of this automation pattern on the competing side, see our [guide to OpenAI's Scheduled Tasks after ChatGPT Pulse shut down](/en/posts/chatgpt-pulse-daily-briefing); our [guide to Claude Code's subagents and background agents](/en/posts/claude-code-subagents-background-agents) covers wiring scheduled tasks into a wider agent workflow. The permission and scoping logic overlaps heavily with wiring AI agents into automated environments like CI/CD, so our [guide to safely wiring AI agents into CI/CD](/en/posts/ai-agents-in-cicd-safely) shows the same containment principles applied in a different context.

My take: the lack of notifications is the most annoying part of this feature, but it actually forces good discipline — being pushed to build the notification step into the task itself usually results in a more complete, self-contained task definition anyway.

## What Does a Template for a Weekly Digest Task Look Like?

```text
Task: Run every Monday at 09:00.
1. Pull last week's completed tasks from the connected project management tool.
2. Calculate the number completed, the breakdown by category, and the count of overdue tasks.
3. Write the result as a 5-bullet summary.
4. Send the summary to the connected Slack channel.
Success criterion: the task counts as done once the Slack message is sent; no email or file output is required.
```

For more on Claude's agent and automation features, see Woyable's [AI category](/en/category/ai).

## Frequently Asked Questions

### Do I get notified when a Claude Cowork scheduled task finishes?

No, not currently. Cowork doesn't send a push notification or email when a task completes or fails; you need to check the run history in the Scheduled tab to see the result. If you want a notification, you can build a "send the result to Slack or email" step into the task itself.

### Do scheduled tasks run while my computer is off?

Yes. Scheduled tasks run remotely, so depending on the cadence you pick, they continue automatically even while your computer is asleep or the Claude Desktop app is closed.

### When should I use Claude instead of Zapier for a scheduled task?

When the task requires natural-language interpretation and synthesis rather than a fixed, predefined flow. If input and output can be fully defined ahead of time, a classic automation tool is cheaper and more reliable; if the input varies and the output needs a summary or judgment call, a scheduled Claude task fits better.

### Why might a scheduled task fail silently?

Usually one of three reasons: it references a file or connector it no longer has access to, the instruction isn't specific enough so the model interprets it differently each run, or a connected plugin's authentication has expired. Since there's no notification, regularly checking the run history in the Scheduled tab is the only way to catch this.

Sources: [Anthropic's documentation on scheduling recurring tasks in Claude Cowork](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork), [Anthropic's announcement of Routines in Claude Code](https://claude.com/blog/introducing-routines-in-claude-code).
