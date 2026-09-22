---
title: "Claude for Small Business: 43 Workflows, 27 Connectors"
slug: "claude-for-small-business-workflows"
translationKey: "claude-small-business-workflows-2026"
locale: "en"
excerpt: "As of September 2026, Claude for Small Business runs 43 workflows and 27 new connectors inside Claude Cowork, and it waits for your approval first."
category: "business"
tags: [claude, automation, saas, workflow, integration]
publishedAt: "2026-09-22"
seoTitle: "Claude for Small Business: 43 Workflows, 27 Connectors"
seoDescription: "As of September 2026, Claude for Small Business runs 43 workflows and 27 new connectors in Claude Cowork, staging every action for your approval first."
---

Short answer: Claude for Small Business is Anthropic's plugin for small-business owners, and as of the September 2026 update it ships 43 ready-made workflows and 27 new connectors, runs inside the Claude Cowork desktop app, and stages every action for the owner's approval before it fires. Setup starts with one slash command and the plugin itself costs nothing extra on top of a paid Claude plan.

This walkthrough covers one real setup end to end: installing the plugin, connecting your tools, the three workflows worth turning on first, and how the approval gate actually behaves in practice.

## What did the September 2026 update actually add?

On September 15, 2026, Anthropic expanded Claude for Small Business, which it first launched in May 2026, taking the workflow count to 43 and adding 27 new connectors. [Anthropic's own announcement](https://www.anthropic.com/news/claude-for-small-business) and [Unite.AI's independent coverage](https://www.unite.ai/anthropic-adds-43-workflows-27-integrations-to-claude-for-small-business/) both confirm these figures. The plugin has been installed more than 900,000 times since its May debut, according to [Forbes' September 2026 reporting](https://www.forbes.com/sites/boazsobrado/2026/09/15/anthropic-puts-claude-on-small-business-sales-after-900000-installs/).

The new connectors include Shopify, Salesforce, TikTok, Atlassian, Zoom, Xero, Gusto, Square, Stripe, and Zapier, stacked on top of existing connections to QuickBooks, PayPal, HubSpot, Canva, DocuSign, Google Workspace, and Microsoft 365. Alongside the release, Anthropic announced a fall schedule of free workshops and partner webinars to help owners onboard.

## How does Claude for Small Business actually run?

It is not a standalone app — it is a plugin bundle that runs inside Claude Cowork, the desktop app where Claude works directly with your files and connected tools.

Setup has three steps. First you install the plugin from Cowork. Then you either tell Claude "help me get set up" or run `/smb-onboard` directly; the command asks which tools you already use and walks you through connecting each one. Finally, you pick one of the suggested workflows and set a schedule for it — for example, "every Monday at 8am."

```bash
# Onboarding command inside Cowork
/smb-onboard
```

There's no separate fee for the plugin. It rides along with any paid Claude plan — Pro at $20/month, Max at $100–200/month, or Team at $25–30 per seat per month. You pay for the Claude subscription; the small-business package is included.

One thing worth flagging during setup: each connector gets its own OAuth grant, so you can scope Claude to read-only access on, say, Stripe rather than handing over full account control. If you share bookkeeping with an accountant or a partner, it's worth logging who granted which connector and with what scope — you don't want to be untangling that three months later.

## Which three workflows are worth setting up first?

Short answer: the weekly financial brief, after-hours lead qualification, and proposal drafting — because these recur constantly and touch revenue directly, unlike more cosmetic automations.

**The Weekly Brief** pulls cash position, sales, pipeline, and overdue invoices onto one page. Connected to Xero or QuickBooks, Claude assembles this every Monday and hands you an email draft ready to send.

**Lead Qualification** answers after-hours inquiries, qualifies them, and logs them to your CRM (Salesforce or HubSpot). A customer messages at 11pm through a web form or WhatsApp, Claude asks about budget and timeline, and you get a summary waiting the next morning.

**Proposal Drafting** turns a voice memo into a priced, branded proposal. Record a note in your car after a site visit, and Claude turns it into a structured PDF proposal staged for a DocuSign signature.

Marketing calendar drafting and bookkeeping reconciliation are also high-value picks, but the first three are the ones that touch cash flow fastest.

| Workflow | Primary connectors | What it produces |
|---|---|---|
| Weekly Brief | Xero, QuickBooks, Stripe | Cash, sales, and overdue-invoice report |
| Lead Qualification | Salesforce, HubSpot, Zapier | Qualified lead, logged to CRM |
| Proposal Drafting | DocuSign, Google Workspace | Priced, branded proposal draft |
| Marketing Calendar | Canva, TikTok, Zoom | Draft posts and review replies for the week |
| Bookkeeping Reconciliation | QuickBooks, Xero, Square | Reconciled accounts, accountant-ready close packet |

If you're weighing whether to start with one voice-memo-to-proposal loop first, that's the setup I'd recommend testing before touching the rest — it's the one owners report saving the most hours on per week.

## Does Claude take actions automatically, or does it ask first?

It asks first. By default, every workflow starts in approval mode: Claude drafts the work and stages it, then waits for the owner's sign-off before anything sends, posts, or pays. Both [Anthropic's own announcement](https://claude.com/blog/claude-for-small-business-launches-new-workflows-integrations-and-training-programs) and independent coverage highlight this as a deliberate design choice, not a fallback setting.

In practice, that means Claude prepares a proposal but doesn't email it until you click send, and it can flag an invoice in Stripe but won't trigger a payment request without your go-ahead. You can turn off approval mode per workflow for genuinely low-stakes, repetitive tasks — Anthropic suggests this for something like generating a weekly report — but it's worth leaving approval on for anything irreversible, like sending contracts or moving money.

My honest read after setting this up: the approval step feels like friction in week one, because you're reading and clicking through every draft. But that friction is the point — it's what stops a wrong email or a miscalculated invoice from reaching a customer, and for a small operation that's worth more than raw speed.

## What are the limits and costs?

The plugin itself is free, but you're still bound by your Claude plan's usage limits — heavy weekly reporting plus a lot of lead qualification can push against a Pro plan's message caps faster than you'd expect. Twenty-seven new connectors is a meaningful expansion, but niche vertical-specific tools still fall outside the roster; for those, you'll likely need to bridge through Zapier rather than a native connection.

The plugin currently runs only inside the Cowork desktop app — there's no equivalent mobile or browser-only access to the same workflows yet. If more than one person on your team will use the same workflows, the Team plan's per-seat pricing tends to make more sense than stacking individual Pro accounts.

Honestly, my bigger concern isn't the numbers — it's habit formation. Turning on all 43 workflows at once is tempting, but clicking "approve" fifteen times a day turns into a routine nobody actually reads within a few months. Starting with two or three workflows and genuinely reading each approval preserves the thing automation is supposed to give you: a chance to catch the mistake before it ships.

For the broader trend of Claude handling recurring back-office work, see our piece on [Claude Scheduled Tasks: Automate Recurring Work](/en/posts/claude-scheduled-tasks-automate-recurring-work). If you're running a similar setup on the marketing side, [Automate Weekly Marketing Reports With Cowork](/en/posts/automate-weekly-marketing-reports-cowork) is a useful companion. And if you're still deciding between a fixed workflow and a more autonomous agent for a given task, [AI Agents vs Workflows: When to Use Each](/en/posts/ai-agents-vs-workflows) lays out the tradeoff.

## Frequently Asked Questions

### How many workflows and connectors does Claude for Small Business have?

As of September 2026, the plugin offers 43 ready-made workflows and 27 new connectors — including Shopify, Salesforce, Xero, Square, Stripe, and Zapier — on top of existing connections like QuickBooks and HubSpot. Anthropic confirmed these numbers in its September 15, 2026 announcement.

### Is Claude for Small Business a paid add-on?

No, the plugin itself carries no separate charge. It's included with any paid Claude plan — Pro at $20/month, Max at $100–200/month, or Team at $25–30 per seat per month — and you enable it from within Cowork at no extra cost.

### What app does Claude for Small Business run in?

It runs inside the Claude Cowork desktop app, where Claude works directly with your files and connected tools. As of September 2026, there's no equivalent mobile or browser-only version of the same workflows.

### Does Claude take actions without asking?

No. The default setting is approval mode: Claude stages every task as a draft and waits for your sign-off before sending an email, making a payment, or posting anything. You can disable approval mode per workflow, but Anthropic recommends keeping it on for anything irreversible.
