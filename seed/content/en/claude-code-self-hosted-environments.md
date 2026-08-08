---
title: "Claude Code Self-Hosted Environments Explained"
slug: "claude-code-self-hosted-environments"
translationKey: "claude-code-self-hosted-environments"
locale: "en"
excerpt: "Anthropic opened a beta that runs Claude Code cloud sessions on your own servers. The runner architecture, network model, and setup steps in this guide."
category: "ai"
tags: ["claude", "self-hosting", "devops", "ai-agents"]
publishedAt: "2026-08-08"
seoTitle: "Claude Code Self-Hosted Environments: A Guide"
seoDescription: "Claude Code's self-hosted environments run cloud sessions on your own infrastructure. Runner architecture, network model, and setup steps in this guide."
---

Claude Code cloud sessions no longer have to run on Anthropic's servers by default. **Self-hosted environments**, a beta feature that opened up in early August 2026, lets you run that same cloud experience — sessions started from claude.ai, the mobile or desktop app, `claude --cloud`, or scheduled routines — on machines inside your own network instead. This piece walks through how it works, the network model, and when you actually need it.

## What This Actually Changes

Previously, starting a Claude Code cloud session meant the work ran on Anthropic's infrastructure by default, full stop. Now your organization can define its own **environment**: when a developer starts a session, the environment picker shows Anthropic-hosted environments alongside any you've created. Pick yours, and the control plane places the session on your queue, a **runner** claims it, clones your repository, and spawns a Claude Code process on your own host.

It's a natural extension of the agent architecture we covered in [our piece on Claude Code subagents and background agents](/en/posts/claude-code-subagents-background-agents) — the difference is you now control where that agent process actually executes.

## Three Concepts: Environment, Runner, Session

The easiest way to think about the system is three pieces:

- **Environment**: a named destination you create in claude.ai admin settings. Sessions route to an environment, not to an individual runner.
- **Runner**: a long-lived process running on your own infrastructure. Same idea as a self-hosted CI runner — it picks work off a queue and executes it.
- **Session**: one Claude Code task a developer started.

A runner serves exactly one user at a time: the first session it picks up locks the runner to that user's account, and it only runs that account's work until its capacity is full. That rule is what keeps different users' checked-out code from mixing on the same disk — isolation without the runner having to wipe state between users.

## The Network Model: Nothing Comes In

The question every security team asks first: can Anthropic connect into our network? No. The runner and session processes only make outbound HTTPS connections — to `api.anthropic.com` for queue polling, the event stream, and model inference. No connection from Anthropic reaches into your network.

Repository checkouts, build artifacts, secrets, and any files a session creates or modifies stay on the machines you provision. The conversation itself — prompts, responses, and tool results — still goes to `api.anthropic.com` for model inference, and Anthropic stores the session transcript so you can resume it from another surface.

| Component | Where it runs | Outbound connection |
|---|---|---|
| Runner | Your infrastructure | `api.anthropic.com` (queue, heartbeat) |
| Session process | Your infrastructure | `api.anthropic.com` (event stream, inference) |
| Repo checkouts, build artifacts, secrets | Your infrastructure | Never leaves your network |
| Conversation (prompt/response/tool result) | — | Sent to Anthropic for inference |
| Session orchestration, queue, claude.ai UI | Anthropic | — |

## Setup: Fixed Fleet or Autoscaling

There are two operating modes. In **fixed mode**, you keep a set number of runners running and sessions get distributed across them. With the **autoscaling orchestrator**, a second process you host starts runners as sessions queue up; each runner exits on its own once its work finishes. A minimal start looks like this:

```bash
claude self-hosted-runner start \
  --environment-id env_abc123 \
  --capacity 4
```

The `--capacity` flag sets how many sessions a single runner can execute concurrently. If your runner runs under an orchestrator like Kubernetes, the default behavior (`--drain-grace-sec 0`) is for it to exit as soon as its active sessions finish, letting the orchestrator restart it with a fresh disk — so the next runner can serve any account.

## Who This Is Actually For

Anthropic's own documentation is upfront about this: most teams are better served by hosted environments, which need no infrastructure to run or maintain — that stays the default recommendation. Self-hosting exists for teams whose network, tooling, or compliance requirements demand keeping session execution on infrastructure they control. In exchange, you get three things:

- **Network access**: sessions run inside your network and can reach internal services, databases, and registries without exposing them to the public internet.
- **Custom tooling**: pre-install compilers, SDKs, and internal CLIs into your runner image so every session starts ready to build.
- **Compliance**: repository checkouts and build artifacts stay on infrastructure you control.

That comes with a real cost: you build and maintain the runner image, operate the fleet, and control its network. For a small team, that's likely more operational overhead than it's worth.

## Limitations

The beta is currently limited to Team and Enterprise plans and is off by default — an Owner or admin has to enable it from the **Cloud environments** page. It's unavailable for organizations with Zero Data Retention enabled. Model inference goes directly through the Anthropic API, so it can't be routed through Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, or an LLM gateway. Claude Tag, Claude Security, and Code Review sessions don't route to self-hosted environments yet either — support for those surfaces is coming separately.

## An Honest Take

Read alongside recent updates like [Claude Code's cross-session messaging](/en/posts/claude-code-cross-session-messaging) and [its guardrails against runaway agents](/en/posts/claude-code-runaway-agent-guardrails), a pattern emerges: Anthropic is turning Claude Code from an individual CLI tool into an enterprise platform. Self-hosted environments specifically answer the "our code can never leave our network" requirement that comes up constantly in finance and government engagements — but it's worth being precise about what it actually solves. The conversation itself still goes to Anthropic, so this isn't a fully offline setup; it's a "code and secrets stay put" setup. Pitching it to a security team as "everything now stays with us" glosses over that distinction, and it's the kind of gap that gets caught at the first real compliance review.

## Frequently Asked Questions

### Which plans can use self-hosted environments?

It's currently a beta available on Team and Enterprise plans. An Owner or admin has to turn it on from the Cloud environments page in claude.ai admin settings — it ships off by default.

### Does this affect regular Claude Code sessions running in a terminal or IDE?

No. Terminal and IDE sessions already always run on the developer's own machine. Self-hosted environments only apply to cloud sessions — those started from claude.ai, the mobile or desktop app, `claude --cloud`, or scheduled routines.

### Does our codebase ever leave our network with this setup?

Repository checkouts, build artifacts, and secrets stay on your infrastructure. But prompts, model responses, and tool results are sent to the Anthropic API for inference — this isn't a fully isolated system.

### How many runners should we run?

Your minimum fleet size should match the number of users you expect to be active at once, since a runner locks to a single user's account at a time. The autoscaling orchestrator removes the need to track that number by hand.
