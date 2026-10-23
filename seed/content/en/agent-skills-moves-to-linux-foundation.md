---
title: "Agent Skills Moves to the Linux Foundation: What Changes?"
slug: "agent-skills-moves-to-linux-foundation"
translationKey: "agent-skills-aaif-donation-2026"
locale: "en"
excerpt: "Anthropic donated the Agent Skills standard to the Linux Foundation's Agentic AI Foundation on October 22, 2026. Here's what changes and what doesn't."
category: "ai"
tags: ["claude", "mcp", "ai-agents", "open-source"]
publishedAt: "2026-10-23"
seoTitle: "Agent Skills Moves to the Agentic AI Foundation"
seoDescription: "Anthropic donated Agent Skills to the Agentic AI Foundation on Oct 22, 2026. We cover the scope, new maintainer model, and current security gaps."
---

Short answer: on October 22, 2026, Anthropic donated the Agent Skills name, logo, GitHub organization, and the agentskills.io domain to the Agentic AI Foundation (AAIF), a Linux Foundation project. Published as an open standard in December 2025, Agent Skills is now integrated into more than 70 platforms — including ChatGPT, Cursor, GitHub Copilot, and VS Code — with 1 million skills published and roughly 280 million installs to date.

## What is Agent Skills?

Agent Skills is a folder standard that teaches an AI agent how to do a specific task step by step: a `SKILL.md` file, plus any scripts or reference material it needs. Anthropic built the format while developing Claude Code, after finding that raw model capability alone didn't cover the procedural knowledge real work tasks require — which file to check, what order to follow, which command to run. A typical skill folder looks like this:

```text
pdf-invoice-processing/
  SKILL.md
  scripts/
    parse_invoice.py
  reference/
    tax-codes.md
```

That structure is deliberately simple: `SKILL.md` acts as an instruction sheet for the agent, the scripts are concrete tools the agent can call while following those instructions, and reference files hold the longer background material the agent can consult when it needs to. The format still lives at [agentskills.io](https://agentskills.io); what changes after the donation is who owns the domain, not what's published on it.

## When exactly did the donation happen, and what does it cover?

Anthropic [announced the donation on its own news page on October 22, 2026](https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation). It covers three concrete things: the Agent Skills name and logo, the standard's GitHub organization, and the agentskills.io domain. AAIF is the same foundation Anthropic donated the Model Context Protocol (MCP) to in 2025; it was co-founded by Anthropic, Block, and OpenAI the year before and operates under the Linux Foundation. In other words, this isn't AAIF's first major donation — it's a repeat of an already-established pattern: a standard starts under one company's control, then moves to shared governance once adoption is wide enough to justify it.

| | Before the donation | After the donation |
| --- | --- | --- |
| Standard owner | Anthropic | Agentic AI Foundation (Linux Foundation) |
| Maintainers | Anthropic's team | Engineers from Anthropic, Google, OpenAI (as individuals) |
| Lead Maintainer | Unassigned | David Soria Parra, Mahesh Murag |
| Change process | Anthropic's call | Planned: formal proposal process |
| Membership requirement | — | Not required to use or contribute |

## Do I need to join AAIF to keep using Agent Skills?

No. Anthropic's announcement explicitly says developers and companies can keep using and contributing to the standard without joining the Agentic AI Foundation. The point of the donation isn't to restrict access — it's to move who decides the standard's future out of a single company and into a shared governance structure.

## How does this relate to MCP?

This donation is the second run of a model Anthropic already used once. Anthropic [donated MCP itself to AAIF in 2025](/en/posts/mcp-2026-07-28-stateless-spec), and our guide on [building your first MCP connector](/en/posts/build-your-first-mcp-connector) walks through how that protocol works in practice. MCP standardizes *what tools* an agent can reach; Agent Skills standardizes *how* an agent carries out a given task — the two are complementary, not competing. We covered the forces behind this convergence in [why every AI assistant now has "skills"](/en/posts/ai-assistants-converging-on-skills); this donation is the institutional follow-through on that trend.

## Is skill security actually in good shape?

Don't get ahead of yourself here. Security firm Snyk published a study called ["ToxicSkills"](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) in February 2026, scanning 3,984 skills across the ClawHub and skills.sh directories: 13.4% of them (534 skills) carried a critical-severity issue — malware distribution, prompt-injection payloads, or exposed credentials. Counting every severity level, 36.82% (1,467 skills) had at least one flaw. Snyk describes the ecosystem as having "a supply chain problem similar to early npm and PyPI, but with unprecedented access to credentials, file systems, and APIs" — because running a skill usually grants shell access, filesystem access, and sometimes persistent memory, which turns a malicious skill into an ongoing insider threat rather than a one-time attack. Anthropic's announcement puts security guidance on AAIF's roadmap, but it hasn't shipped yet — the manual vetting steps we recommended in [Claude's skill and plugin security scanning](/en/posts/claude-skill-plugin-security-scanning) still apply until that guidance lands.

## What else is on AAIF's roadmap?

Anthropic's stated plan covers four items: versioned releases, a formal change-proposal process, security guidance for people who write and install skills, and using the standard's Discord to gather community feedback. This mirrors, almost exactly, the transparent decision-making model AAIF already runs for MCP, which moved to a community proposal process before settling into a predictable, versioned release calendar. Agent Skills is still pre-1.0, which means the formal proposal process landing soon should make breaking changes more predictable going forward, rather than something Anthropic alone decides to ship.

## What does this actually change for Claude Code users?

Day to day, nothing changes immediately: your existing skills, the `SKILL.md` format, and the way Claude Code runs skills are unaffected. What does change is that decisions about the format's future now route through AAIF's open proposal process instead of Anthropic's internal roadmap. The practical effect: the next major format change might still be announced by Anthropic first, but Anthropic no longer decides it alone — engineers from Google and OpenAI now have a seat at that table too.

My honest read: this donation is a consistent move for Anthropic — after giving up exclusive control of MCP, giving up Agent Skills too turns the format from "Anthropic's thing" into the ecosystem's shared thing. The numbers back up why this wasn't a token gesture: 1 million skills and 280 million installs in the ten months since the December 2025 launch is a scale that's hard for any single company to keep steering alone, and a standard growing that fast usually raises the "who controls it" question just as fast. But security guidance is still a roadmap line, not a shipped document, which means checking a skill's source yourself remains your job today, not the foundation's.

## Frequently Asked Questions

### What is Agent Skills in one sentence?

Agent Skills is a folder standard — a `SKILL.md` file plus supporting scripts and reference material — that teaches an AI agent how to perform a specific task. Anthropic built it for Claude Code, published it as an open standard in December 2025, and more than 70 platforms now support it.

### Do I need to join AAIF to use Agent Skills?

No. Anthropic's announcement explicitly states that joining the Agentic AI Foundation is not required to use or contribute to the standard. The donation moves governance into a shared foundation; it does not restrict who can use the format.

### What's the difference between Agent Skills and MCP?

MCP (Model Context Protocol) standardizes which tools and data sources an AI agent can access. Agent Skills standardizes the steps an agent follows to complete a specific task. They're complementary, and both are now governed by the same foundation, AAIF.

### Which platforms support Agent Skills?

According to Anthropic's October 2026 announcement, more than 70 platforms — including ChatGPT, Cursor, GitHub Copilot, and VS Code — have integrated Agent Skills since its December 2025 launch. To date, 1 million skills have been published with roughly 280 million installs.
