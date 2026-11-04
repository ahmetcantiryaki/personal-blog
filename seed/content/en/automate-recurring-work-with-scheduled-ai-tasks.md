---
title: "How Do You Automate Recurring Work With AI?"
slug: "automate-recurring-work-with-scheduled-ai-tasks"
translationKey: "recurring-ai-tasks-automation-2026"
locale: "en"
excerpt: "Short answer: Claude Cowork, ChatGPT, and Gemini Spark now run recurring work unattended, safe for reversible jobs but risky without a review step."
category: "career-productivity"
tags: ["claude", "chatgpt", "gemini", "automation", "productivity"]
publishedAt: "2026-11-04"
seoTitle: "Automate Recurring Work With Scheduled AI Tasks"
seoDescription: "How to automate recurring work with Claude Cowork, ChatGPT Scheduled Tasks, and Gemini Spark—setup steps, guardrails, cost, and privacy notes for 2026."
---

Short answer: Claude Cowork, ChatGPT's Scheduled Tasks, and Gemini Spark let you define a prompt once and have it run automatically on a cadence you set, instead of asking the assistant from scratch every time. They're safe for reversible work like daily briefs or weekly reports, and risky if you let them trigger permanent actions—payments, public posts—without a human checking first.

## What is a scheduled AI task?

A scheduled task is a prompt you write once, tied to a cadence (hourly, daily, weekly), that an assistant re-runs on its own without you reopening the chat. The assistant starts the job in the background, usually in the cloud, and hands you the result when it's done.

By mid-2026, all three major assistants shifted from "ask every time" to "define once, let it run." The table below compares what each tool offered as of November 2026.

| Tool | Scheduling options | Where it runs | Example use |
|---|---|---|---|
| Claude Cowork | Hourly, daily, weekly, weekdays-only, manual | Fully cloud-based since July 2026 (works with your laptop closed) | Weekly report, file organization |
| ChatGPT Scheduled Tasks | Specific time or broad window (morning/afternoon/evening), one-time, recurring, monitoring | Cloud; monitoring tasks capped at hourly checks | Competitor tracking, daily briefing |
| Gemini Spark | Recurring schedule or condition-triggered | Dedicated machines on Google Cloud, 24/7 | Scanning credit card statements for hidden fees |

## How do you set up a scheduled task in Claude Cowork?

You schedule a task in Claude Cowork by typing `/schedule` inside an existing task's chat, or by creating a new one from the dedicated "Scheduled tasks" page. Anthropic shipped the feature on February 25, 2026, and at launch it only fired while your computer was awake and the Claude Desktop app was open.

That changed in July 2026, when execution moved fully to the cloud: a scheduled task now runs at its set time even if your laptop is closed or asleep. Each scheduled run starts as its own independent Cowork session, so context from a previous run doesn't leak into the next one. Third-party guides report that the Pro plan caps scheduled tasks at roughly 50 per month, while Team removes that cap—but check Anthropic's own help center for the current figures, since plan limits shift with updates.

## What does ChatGPT's Scheduled Tasks feature offer?

OpenAI retired Pulse, its daily-briefing feature, on June 17, 2026, and replaced it with a dedicated "Scheduled" page in the ChatGPT sidebar that handles one-time tasks, recurring tasks, and monitoring tasks together. Monitoring tasks scan the web and connected apps and only notify you when something actually changes, and those checks are capped at once per hour.

You can pin a task to an exact time or to a broader window like morning, afternoon, or evening. A task created inside a ChatGPT project can't reach that project's files—a deliberate isolation boundary. Tasks left unattended for a long stretch can auto-pause. The feature is available on Go, Plus, Pro, Business, and Enterprise plans; some reports say Free users get a handful of active tasks too (around three), though that number is worth confirming on OpenAI's own help page.

## How does Gemini Spark work?

Google introduced Gemini Spark at I/O 2026 as a "24/7 personal agent" that runs on the Gemini 3.5 Flash model and Google's Antigravity harness, executing on dedicated machines in Google Cloud rather than on your own device. Google's own example: Spark can automatically parse your monthly credit card statements to flag new or hidden subscription fees.

In Spark, "scheduling" is built directly on top of tasks: a schedule is simply a task Spark repeats at a set time. At launch it integrated natively with Gmail, Google Docs, Slides, and Workspace, with Google saying it would add capabilities like sending texts and emails and operating a browser in the following weeks. A macOS desktop version was also planned so Spark could work with local files.

Google's own caveat matters here: hidden instructions embedded in emails, documents, or websites can override the tasks you've assigned Spark. That's a concrete security risk worth weighing before you connect a scheduled agent to accounts with real access.

## Which tasks make good automation candidates—and which don't?

Good candidates are jobs where a wrong result costs you minutes, not damage, and where the output is easy to undo: a daily news or inbox digest, a weekly sales report, inbox triage, competitor price tracking. The worst-case failure is re-running the task or fixing the output by hand.

Bad candidates are anything that triggers a permanent, hard-to-reverse action without a checkpoint: sending a payment automatically, posting to a public channel, deleting files, permanently updating a CRM record. For this category, the automation's last step should always be a human approval—otherwise one misread instruction turns into an outcome you can't take back.

## What guardrails does a scheduled AI task need?

Three rules hold up in practice: scope the task narrowly (name exactly which accounts and folders the assistant can touch), insert an approval step before any permanent action, and review outputs on a regular cadence—set-and-forget automation lets errors compound silently.

Google's own prompt-injection warning for Spark applies to every tool, not just Spark: if a scheduled task reads email or web content, an instruction hidden inside that content can override the assistant's original task. The mitigation is the same everywhere—keep the task's data access as narrow as the job allows, and glance at the output before you trust it.

## What do scheduled AI tasks cost, and what's the privacy risk?

None of the three tools charges separately for scheduling; it's bundled into your existing subscription (Pro, Plus, Team, Ultra), though the number of monthly runs can be capped by plan. The real cost driver is whether your run volume forces an upgrade.

The bigger privacy exposure is that these tasks typically need access to connected accounts—Gmail, Drive, your CRM. Before scheduling anything, check which accounts it's connected to and whether that access is broader than the job actually needs; otherwise an assistant ends up with standing access to far more data than one recurring report requires.

My take: it's not a coincidence that all three assistants converged on scheduling at the same time—automating repetitive, low-risk work is a genuine productivity win, but teams that stop asking "what did the agent actually do this week" pay for it the first time a run goes wrong. Our guides on [inbox zero with AI email triage](/en/posts/inbox-zero-with-ai-email-triage) and [inbox triage with ChatGPT and Gemini](/en/posts/inbox-triage-chatgpt-gemini) cover the most common—and safest—use case for this kind of automation in detail.

Scheduled tasks also tie into a broader shift in [which skills matter when AI writes the draft](/en/posts/which-skills-matter-when-ai-writes-the-draft): the valuable skill is no longer asking the assistant, it's managing what it's allowed to do unattended. If you're connecting internal tools to an agent, our [guide to building an internal MCP server](/en/posts/build-an-internal-mcp-server-for-your-tools) covers how to scope that access properly. And if you haven't picked a subscription yet, our [Claude vs ChatGPT vs Gemini comparison](/en/posts/which-ai-subscription-2026) lines up the plans side by side.

## Frequently Asked Questions

### What is a scheduled AI task?

A scheduled task is a prompt you give an assistant once, tied to a cadence like hourly, daily, or weekly, that the assistant re-runs on its own. You don't ask again—the assistant starts the job in the background.

### How do you schedule a task in Claude Cowork?

Type `/schedule` inside an existing task's chat, or create one directly from the "Scheduled tasks" page. Since July 2026, execution runs fully in the cloud, so the task fires even if your laptop is closed.

### What plans include ChatGPT's Scheduled Tasks feature?

It's available on Go, Plus, Pro, Business, and Enterprise plans; some reports say Free users get a limited number of active tasks too. Check OpenAI's own help page for the current, exact limits.

### Is Gemini Spark safe to use?

Google explicitly warns that Spark can be affected by hidden instructions embedded in emails, documents, or websites, which can override the tasks you've assigned it. Keep the accounts you connect to Spark narrowly scoped and review its outputs regularly.
