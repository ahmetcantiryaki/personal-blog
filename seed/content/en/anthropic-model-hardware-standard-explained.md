---
title: "Anthropic's Model Hardware Standard, Explained"
slug: "anthropic-model-hardware-standard-explained"
translationKey: "anthropic-model-hardware-standard"
locale: "en"
excerpt: "MHS is Anthropic's model-agnostic standard letting AI agents like Claude safely control robot arms, microscopes and lab hardware, no custom integration."
category: "technology"
tags: ["claude", "ai-agents", "hardware", "automation"]
publishedAt: "2026-08-30"
seoTitle: "Anthropic's Model Hardware Standard (MHS) Explained"
seoDescription: "MHS is Anthropic's model-agnostic standard letting AI agents like Claude safely control robot arms, microscopes and lab hardware, no custom integration."
---

Short answer: the Model Hardware Standard (MHS) is a model-agnostic specification Anthropic previewed on August 27, 2026, letting AI agents safely operate physical hardware — robot arms, microscopes, liquid handlers — the way MCP lets them operate software tools. It works with Claude, GPT, Gemini, Llama, or a local open-source model.

## What does MHS actually do?

MHS is a shared interface layer that describes how a piece of hardware works in terms an AI model can act on. Anthropic says that without a standard like this, wiring a device into an AI workflow takes weeks or months and depends on paper manuals or tacit knowledge held by a handful of specialists. With MHS, that integration drops to hours or minutes.

Concretely, a robot-arm manufacturer can specify in the MHS description exactly how fast and through what angles the arm can move safely. The agent then operates inside those physical limits by design, not by trial and error. Per Anthropic's announcement, an agent can coordinate multiple instruments at once — microscopes, liquid handlers, robotic arms — for tasks ranging from routine drug-discovery experiments to laser calibration for quantum computing hardware.

## How is MHS different from MCP?

Think of MHS as MCP's hardware counterpart. MCP connects a model to software — databases, calendars, APIs. MHS connects that same model to a physical device. Anthropic designed MHS to work alongside existing agent frameworks, including MCP itself, so one agent can reach software tools over MCP and physical equipment over MHS in the same workflow.

| Aspect | MCP | MHS |
|---|---|---|
| Connects models to | Software tools, databases, APIs | Physical hardware (robots, microscopes, lasers) |
| Announced | November 2024 | August 27, 2026 (research preview) |
| Model dependency | Model-agnostic | Model-agnostic |
| Status (August 2026) | Widely adopted, open source | Early preview, open-sourcing planned |
| Typical use case | Agentic software workflows, data access | Lab equipment, robotics, manufacturing lines |

## Which companies are backing MHS?

Anthropic is running joint safety evaluations with preview partners AWS, Genentech, Universal Robots, and Danaher, with Tecan, QIAGEN, Raspberry Pi, and Hugging Face's LeRobot project listed as additional hardware partners. That spread covers a major cloud provider, lab-equipment makers, and the open-source robotics community in one preview cohort.

Anthropic says it plans to eventually open-source MHS, which would let any device manufacturer adopt it independently of Anthropic. The timing lines up with [Anthropic's expansion of budget, advisor, and data-residency controls for Claude Managed Agents](/en/posts/claude-managed-agents-budgets-advisors-data-residency) the same week — a sign the company is scaling its enterprise agent stack on both the software and hardware sides at once.

## Is MHS safe? What are the risks?

An AI agent mishandling a heavy robot arm or a laser cutter carries far higher stakes than a software bug, which is why Anthropic launched MHS as a closed preview rather than a general release. The company says it is working with partners to build safety evaluations and best practices, and is developing what it calls a physical safety roadmap to reduce the risk of misuse before any wider rollout.

In practice, that means the hardware manufacturer fixes the physical limits — speed, angle range — inside the MHS description itself, so the agent can't operate outside them because the boundary lives on the device side, not the model's judgment. It's the same logic behind [Claude Code's recent guardrails against runaway agents](/en/posts/claude-code-runaway-agent-guardrails): give the agent more capability while shrinking the room for a costly mistake.

## What does MHS look like in practice?

Take a concrete example: a drug-discovery lab wants to coordinate a robot arm, a liquid handler, and a microscope in a single experiment. Without MHS, that means writing a separate integration for each device, reading the manufacturer's safety limits — speed, angle, temperature — out of a PDF manual, translating that by hand into code, and keeping it up to date whenever the hardware changes. That process can take weeks and usually depends on the one or two engineers who already know that specific device.

With MHS, the manufacturer publishes those safe operating limits as a standard description up front. The agent reads that description and starts operating the device directly, cutting integration time from weeks to hours. In the examples Anthropic gives, this kind of coordination spans routine drug-discovery experiments to laser calibration for quantum computing components — the point isn't controlling one device, but running a workflow across several devices at once.

What actually changes here is where the knowledge lives. Hardware knowledge that used to sit in one specialist's head or in a PDF manual becomes a structured description the AI agent can read and act on directly. That's the same shift MCP made on the software side — turning API documentation from something a human has to read into an interface an agent can use directly.

## When will MHS be generally available?

As of August 2026, MHS is limited to the named lab and manufacturing partners; Anthropic has not given a date for general availability. The stated plan is to mature safety protocols with partners across science, robotics, electronics, and manufacturing first, then open-source the standard so any device maker and any model can use it.

That mirrors the path MCP took: a narrow initial ecosystem that grew into a de facto industry standard within roughly a year. Whether MHS follows the same trajectory will become clearer over the next few months.

For more coverage of AI agents moving into the physical world, see our [AI category page](/en/category/ai).

## Frequently Asked Questions

### Does MHS only work with Claude?

No. MHS is explicitly model-agnostic — Anthropic says Claude, GPT, Gemini, Llama, or a local open-source model can all use the same standard to connect to hardware. That makes MHS an industry-wide layer rather than an Anthropic-exclusive feature.

### Can I use MHS today?

Not yet. As of August 2026, MHS is a research preview limited to named partners including AWS, Genentech, Universal Robots, Danaher, Tecan, QIAGEN, Raspberry Pi, and Hugging Face's LeRobot. Anthropic plans to open-source the standard after safety evaluations are complete, but has not published a firm date.

### Is MHS the same thing as MCP?

No, but they're related. MCP connects an AI model to software tools and data; MHS connects that same model to physical hardware like robot arms, microscopes, and liquid handlers. Anthropic says agents can use both standards together — MCP for software, MHS for hardware — within a single workflow.

### What industries is MHS targeting first?

Anthropic's initial preview partners come from scientific research, robotics, and advanced manufacturing. Named use cases include automating drug-discovery experiments and calibrating lasers for quantum computing components; broader industry adoption is expected once the standard is open-sourced.
