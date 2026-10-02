---
title: "What Is OpenAI Dots? ChatGPT's Always-On Agents"
slug: "what-is-openai-dots"
translationKey: "openai-dots-always-on-agents-2026"
locale: "en"
excerpt: "OpenAI Dots are always-on ChatGPT agents powered by GPT-6 Astra that connect to 4,000+ apps and keep working on a task after the conversation ends."
category: "ai"
tags: ["openai", "chatgpt", "ai-agents", "automation"]
publishedAt: "2026-10-02"
seoTitle: "What Is OpenAI Dots? Pricing, Access, and vs ChatGPT Work"
seoDescription: "OpenAI Dots are always-on ChatGPT agents on GPT-6 Astra that connect to 4,000+ apps. Here's the pricing, access rules, and how they differ from ChatGPT Work."
---

Short answer: OpenAI Dots are always-on ChatGPT agents, announced at DevDay on September 29, 2026, that run on GPT-6 Astra and each get their own cloud computer. Unlike a one-off chat task, a dot keeps working on a job after the conversation ends, connects to more than 4,000 apps, and comes back to you only when a decision needs your judgment. The first dot comes bundled with the $100/month Pro plan or a Business Premium seat.

## What is OpenAI Dots?

A dot is an agent that lives inside ChatGPT, takes on a responsibility, and keeps tracking it over time. A regular ChatGPT conversation helps you plan a piece of work; a dot actually carries that work out across your connected apps and keeps adjusting as circumstances change.

Each dot gets its own cloud computer and its own browser, runs on GPT-6 Astra, and can reach more than 4,000 apps through ChatGPT's plugin ecosystem. You might hand a dot an ongoing job like "watch competitor pricing weekly and summarize any changes for me," and it keeps that job running in the background, accumulates context over time, and surfaces for your input only when a call needs a human.

## How is OpenAI Dots different from ChatGPT Work?

They're separate products. [ChatGPT Work](/en/posts/chatgpt-work-openai-agent-explained) completes a one-off, multi-step deliverable — research, file handling, web tasks — inside a session you start and that ends when the work is done. Dots run 24/7, can track several projects in parallel, and keep making progress even after you close the conversation.

| Feature | ChatGPT Work | OpenAI Dots |
|---|---|---|
| How it runs | You start it, finishes in one session | Always-on, continues after the chat closes |
| Duration | Single task, hours | Ongoing responsibility, days to weeks |
| Connections | Web browser, local files with permission | 4,000+ apps, email, local software |
| Model | GPT-6 Astra | GPT-6 Astra |
| Example use | "Finish this market research report" | "Watch competitor pricing every week" |

The distinction matters because mixing them up sets the wrong expectation: assign Work to an ongoing monitoring job and it stops the moment the session closes; set up a dot for a single research task and you end up with an agent running needlessly in the background.

## How much does OpenAI Dots cost?

The first dot ships inside the $100/month ChatGPT Pro subscription, which already includes GPT-6 Astra, deep research, Codex, and ChatGPT Work. A Business Premium seat also carries dot access at $100 per user per month billed annually ($125 billed monthly). OpenAI introduced a $500 tier on top of that for power users who need more capacity.

Access rules vary by plan: on Pro 100, Pro 200, and Pro 500, dots are limited to users 18 and older outside the European Economic Area, the United Kingdom, and Switzerland. Business Premium carries no such regional carve-out — it's available to enterprise users across every supported ChatGPT region.

## How do you use OpenAI Dots?

Setting up a dot means defining three things: what the responsibility is, which apps it can reach, and which decisions stay with you. An e-commerce team, for example, could set up a dot that watches stock levels and drafts a supplier purchase order whenever a product drops below a threshold, while leaving the actual order approval to a human.

```json
{
  "task": "Draft a supplier purchase order for any product that drops below 50 units in stock",
  "connectedApps": ["shopify", "gmail", "google-sheets"],
  "requiresApproval": ["purchase_order_send"],
  "checkInterval": "daily"
}
```

This example shows the logic of a task definition, not a real API schema — OpenAI hasn't published a separate developer-facing Dots API yet, so configuration happens through the ChatGPT interface for now.

## What's the security risk with OpenAI Dots, and what permissions does it need?

Connecting a dot to your email account, Shopify store, or payment system opens up a risk surface proportional to that access. OpenAI addresses this with a three-layer permission model: you define which apps a dot can reach at setup, you decide which actions require your approval (sending a purchase order, for instance, stays gated behind human sign-off), and a dot pauses to ask for authorization before attempting anything outside its defined scope.

That model lines up with the same cautious pattern OpenAI used when it classified GPT-6 Astra at a "critical" risk tier — Dots launching first to a narrow slice of Pro and Business Premium users, with age and regional gating, isn't an accident. An enterprise team setting up a dot should apply least-privilege thinking: grant access only to the apps a task actually needs, and leave the rest closed off. If a dot only needs to track invoices, scoping it to the invoice folder instead of full inbox access reduces both the security exposure and the room for error.

A dot's most common failure mode is a task defined too broadly. "Manage my marketing" leaves it unclear what the dot should escalate for approval versus decide on its own, which leads either to an avalanche of approval requests or to the dot taking an action you didn't expect. Narrow, outcome-specific tasks — "check competitor pricing every Monday and update the spreadsheet" — run more reliably and make it far easier to spot where something went wrong.

## Which jobs is OpenAI Dots actually good for?

The clearest win shows up in repetitive monitoring and reporting work that doesn't fit full automation: competitor price tracking, stock-level monitoring, weekly report assembly, and categorizing or prioritizing support tickets. These share a trait — they need human judgment occasionally but not constant attention, which is exactly the workload a dot's "work in the background, surface when needed" model fits.

By contrast, for one-off work with a clean finish line — drafting a presentation, reviewing a piece of code — [ChatGPT Work](/en/posts/chatgpt-work-openai-agent-explained) is still the better tool; the extra setup overhead of configuring a dot doesn't pay off for that kind of task.

## What is ChatGPT Space, the feature that launched alongside Dots?

ChatGPT Space is a shared workspace, announced the same day at DevDay, where teams work on the same document together with each other and with their dots. It replaces the earlier "Library" feature and introduces "Pages," a shared document format that can hold writing, research, charts, and images. Space is available on desktop and web for Pro, Business, and Enterprise users, and includes automated meeting summaries plus Slack and Microsoft Teams integration.

The move is part of OpenAI's push to turn ChatGPT, used by 1.2 billion people weekly, from a single-player tool into a shared surface where humans and agents collaborate. It follows a pattern similar to what we covered in [wiring AI agents into your CI/CD safely](/en/posts/ai-agents-in-cicd-safely): give an agent broad access, but keep a human in the loop at the steps that matter.

## Is Dots a real leap or just a subscription upsell?

The technical claim holds up: an agent that keeps working after you close the conversation solves a real gap that products like [ChatGPT Work](/en/posts/chatgpt-work-openai-agent-explained) don't address. But look at the pricing and the target audience is clearly people already paying for the $100 Pro plan — this isn't a mass-market agent revolution, it's a new reason to justify the top subscription tier. For small teams, that's a new line item to budget against in an already-stretched tool stack.

Teams comparing agent-based tools right now may also want our [AI That Does the Work: ChatGPT Work vs Cowork vs Gemini](/en/posts/chatgpt-work-vs-cowork-vs-gemini) breakdown, and for deciding when a task needs an agent versus a fixed workflow, see [AI Agents vs Workflows](/en/posts/ai-agents-vs-workflows).

## Frequently Asked Questions

### When did OpenAI Dots launch?

OpenAI announced Dots at its DevDay event on September 29, 2026. The feature is rolling out gradually to Pro and Business Premium accounts in supported markets and is not available on the free or Plus plans.

### Who can use OpenAI Dots?

On Pro 100, Pro 200, and Pro 500, dot access is limited to users 18 and older outside the European Economic Area, the United Kingdom, and Switzerland. Business Premium seats have no such regional restriction and work across every supported ChatGPT region.

### What's the difference between OpenAI Dots and ChatGPT Work?

ChatGPT Work completes a multi-step task you start, inside a single session that ends when the work is done. Dots are always-on agents that keep running after the conversation closes and can track multiple projects at once.

### What apps can OpenAI Dots connect to?

A dot can reach more than 4,000 apps through ChatGPT's plugin ecosystem, link personal email accounts, and interact with local software when you grant it permission.
