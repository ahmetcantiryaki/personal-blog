---
title: "What Is Claude Code Projects? Parallel Cloud Sessions"
slug: "claude-code-projects-parallel-cloud-sessions"
translationKey: "claude-code-projects-parallel-sessions-2026"
locale: "en"
excerpt: "Claude Code Projects is no longer a shared context folder. As of September 2026 it's a coordinator that splits one conversation into parallel cloud sessions."
category: "ai"
tags: [claude, ai-agents, ai-coding, workflow, developer-experience]
publishedAt: "2026-09-22"
seoTitle: "What Is Claude Code Projects? Parallel Sessions"
seoDescription: "Claude Code Projects is no longer a shared context folder. As of September 2026 it's a coordinator that splits one conversation into parallel cloud sessions."
---

Short answer: Claude Code Projects, redesigned and launched in beta on September 17, 2026, is one ongoing conversation where Claude acts as a coordinator. You describe work, Claude decides what becomes a "thread," and each thread is a full cloud session running on its own git branch that keeps working after you close your laptop.

## What is Claude Code Projects, exactly?

Projects is Anthropic's new orchestration layer built on top of Claude Code. Inside a single project conversation, Claude reads what you send and either answers directly or starts a thread for it. Each thread is a fully independent [Claude Code cloud session](https://code.claude.com/docs/en/claude-code-on-the-web) with its own context window, working on its own branch and its own copy of the repository. Per [Anthropic's official documentation](https://code.claude.com/docs/en/claude-projects), the coordinator "sees what threads report back, not every step they take" — so you review outcomes, not a play-by-play.

That's a real break from the old Projects. The previous version was a shared context folder inside claude.ai chat, used to store instructions and reference files. It didn't write code or dispatch work; it just held information.

## Old Projects vs new Projects: what changed?

The shift is from a passive context store to an active work orchestrator. Here's the comparison:

| Feature | Old Projects (claude.ai chat) | New Claude Code Projects (Sept 2026) |
| --- | --- | --- |
| Core function | Shared knowledge/instruction folder | Conversation plus parallel cloud-session orchestration |
| Code access | None or very limited | Each thread gets its own branch and repo copy |
| Working model | You drive every step yourself | Claude coordinates and routes work to threads |
| When laptop closes | Conversation stops | Threads keep running in the cloud |
| Model control | One model, one context | Separate model/effort settings for coordinator and threads |
| Output | Text replies | Pull requests, files, test results, reports |

In practice, this means the coordination work you used to do by hand — repeating the same background to five separate sessions, then checking back on each one — now belongs to Claude.

## What is a "thread," and how does one get created?

A thread is a full Claude Code cloud session spun up from a task you send in the project conversation. Paste in a bug report, a stack trace, or a list of tasks, and Claude decides whether that becomes a new thread or gets routed to a thread already working in that area. Every thread starts with the project's repositories, instructions, and memory, plus the relevant `CLAUDE.md` files and any [MCP connectors](/en/posts/how-do-you-manage-mcp-servers-in-claude-code) linked to your claude.ai account — the same server-management model covered in our piece on managing MCP servers in Claude Code applies here too.

When a thread changes code, it works on a new branch and opens a pull request when the task calls for it. Once a PR is open, the thread watches it with auto-fix on: it pushes fixes when CI fails and responds to review comments on its own.

## What does "always-on" actually mean?

Short answer: closing your laptop does not stop your threads. Each one runs as a cloud session on Anthropic's servers, independent of your machine, so work continues while you're away. Come back an hour later, or the next morning, and the Overview pane shows which threads finished, which pull requests are ready for review, and which one is waiting on your answer — and you can steer any of it from your phone.

That's the headline behavior change from single-session Claude Code use: instead of babysitting one session, you're now checking in on several that moved forward without you. It pairs naturally with [cross-session messaging](/en/posts/claude-code-cross-session-messaging), another recent Claude Code capability built on the same idea of sessions reporting to each other rather than staying siloed.

## Who gets beta access, and when does it open up more?

The beta opened on September 17, 2026 to a subset of Pro and Max subscribers who had already used cloud sessions and had no existing projects in claude.ai chat or Cowork. Other Pro/Max users can join a waitlist, as [MLQ News reported](https://mlq.ai/news/anthropic-opens-parallel-claude-code-projects-beta-to-select-pro-and-max-users/). Anthropic's stated rollout plan looks like this:

| Stage | Scope |
| --- | --- |
| Sept 17, 2026 | Beta to select Pro/Max subscribers who use cloud sessions |
| Coming weeks | Expansion to more Pro/Max users |
| Next | Team and Enterprise plans |
| Next | Integration into Claude.ai chat and Cowork |
| No date yet | Local execution alongside cloud threads |

For now, Projects only works with repositories on github.com — GitHub Enterprise Server, GitLab, and Bitbucket aren't supported — and the repository needs the Claude GitHub App installed with push access.

## Why does this matter for developers?

The real gain is parallelizing work that used to happen sequentially. In the example Anthropic and outlets like [MarkTechPost](https://www.marktechpost.com/2026/09/17/anthropic-launches-claude-code-projects-in-beta-parallel-cloud-sessions-that-keep-running-after-you-close-your-laptop/) cited, a developer creates a project with the goal of reducing an application's checkout p75 latency. Claude spins up parallel threads to profile endpoints, test optimizations, and open pull requests — all reporting back into the one conversation. That's a concrete case for the "agent" side of the [agents vs. workflows](/en/posts/ai-agents-vs-workflows) question: you state the goal, and Claude handles task decomposition and sequencing.

My take: the real value here isn't raw speed, it's not having to re-explain context five times. Write which branch to target and how a thread should verify its work once, in project instructions, and every new thread inherits it — instead of you repeating the same briefing to five separate sessions.

## What are the limits and risks?

The biggest risk is burning through usage limits fast. A new project runs every thread on Opus at high effort by default, which draws down plan limits far faster than a single session would. Anthropic caps new thread creation at 200 per day per account, and a thread that hits your plan's limit simply waits and resumes automatically once the limit resets — worth knowing if you're already tracking [Claude Code's September 2026 weekly limit changes](/en/posts/claude-code-weekly-limits-september-2026-cut).

Second, review burden. Five or six threads running in parallel can open five or six pull requests at once, and actually reading and approving all of them becomes the human bottleneck, not the coding. Third, Projects currently only works against GitHub repositories and uploaded files — not a local database, a device emulator, or an API reachable only through your VPN; local execution is on the roadmap with no date attached. And this is still a narrow beta, so behavior is likely to shift over the coming weeks.

## How do you actually start using it?

If **Projects** shows up in the sidebar at claude.ai/code or in the desktop app's Code tab, your Pro or Max plan has beta access. Starting from scratch, you name the project, optionally set a one-line goal ("keep checkout p75 latency under 300ms"), and add the repositories it should work on. On the first turn, Claude can explore the repo and post setup recommendations — repositories to add, routines to create, threads it could start. Writing project instructions before sending your first real batch of work — which branch to target, how a thread should verify its own work — is what makes the first threads come back the way you want.

If you're evaluating a smaller-scale use case first, the same "define once, reuse repeatedly" logic shows up in our guide to [Claude workflows for small business teams](/en/posts/claude-for-small-business-workflows).

## Frequently Asked Questions

### Is Claude Code Projects free?

No. Projects is only available on Pro and Max plans, and usage draws from the same token limits as your other Claude Code sessions. With default settings (Opus, high effort, multiple parallel threads), a project burns through your plan's limits noticeably faster than a single session.

### Did the old Projects feature disappear?

No, but its behavior changed completely. The previous version was a passive folder in claude.ai chat for instructions and reference files. The September 2026 redesign replaces that with an active orchestrator that writes code, opens pull requests, and keeps running after you close your laptop.

### Is there a limit on how many threads can run?

Yes. Anthropic enforces a cap of 200 new threads per day across your projects. There's no fixed number of threads that can run at once — you can state a preference, but Claude starts as many as the work calls for, up to that daily cap.

### Does Claude Code Projects run locally on my machine?

No, not yet. Every thread currently runs only on Anthropic's servers, against a copy of a repository hosted on github.com. It can't reach a local database or a service behind your VPN. Local execution support is planned for a future date that Anthropic hasn't announced yet.
