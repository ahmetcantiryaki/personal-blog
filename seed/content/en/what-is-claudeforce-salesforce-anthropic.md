---
title: "What Is Claudeforce? Salesforce Meets Claude"
slug: "what-is-claudeforce-salesforce-anthropic"
translationKey: "claudeforce-salesforce-anthropic"
locale: "en"
excerpt: "Claudeforce is the August 26, 2026 Salesforce-Anthropic deal that brings CRM data into Claude and makes Claude the default model inside Agentforce."
category: "business"
tags: ["claude", "saas", "integration", "automation"]
publishedAt: "2026-08-31"
seoTitle: "What Is Claudeforce? The Salesforce-Anthropic Deal"
seoDescription: "Claudeforce is the August 26, 2026 Salesforce-Anthropic deal that brings CRM data into Claude and makes Claude the default model inside Agentforce."
---

Short answer: Claudeforce is the expanded partnership Salesforce and Anthropic announced on August 26, 2026. It runs in three directions at once: Salesforce's CRM data moves into Claude as a plugin, Claude becomes Agentforce's default reasoning model, and Claude gets embedded into Slack. It's not a competing product — it's two ecosystems wiring into each other.

## What does Claudeforce actually include?

Claudeforce is an umbrella name for three separate integrations, not one product. The first is "Salesforce in Claude": Salesforce moves into the Claude interface as a plugin with 37 prebuilt sales skills. The second is "Claude in Agentforce": Claude becomes the reasoning model behind Agentforce's Atlas Reasoning Engine and runs Agentforce Vibes and Agentforce Coworker by default. The third is Claude embedded inside Slack.

These three tracks aren't moving at the same pace. Claude's presence across Agentforce surfaces — Atlas, Vibes, Coworker, and Agent Builder — went live with the announcement. The "Salesforce in Claude" plugin, by contrast, is still limited to select pilot customers.

## How does Salesforce data work inside Claude?

When a sales rep opens a conversation in Claude, the "Salesforce in Claude" plugin connects to live CRM data: it can read pipeline status, pull an account summary before a meeting, update records, and take governed actions bound by the company's existing permissions and business rules. The plugin ships with 37 prebuilt sales skills, and Salesforce and Anthropic plan to expand that skill set through the rest of 2026.

In practice, that means a rep can update a pipeline record without ever opening the Salesforce app — straight from a Claude conversation. The plugin is currently pilot-only; general availability as an open beta is expected in September 2026.

## Is enterprise data safe? What is the Trust Boundary?

Claude runs through Amazon Bedrock inside what Salesforce calls its Trust Boundary — the model operates inside Salesforce's own VPC, under the same data-handling commitments that banks and healthcare organizations have already approved for Salesforce itself. The practical effect: an institution that has already cleared Salesforce's security review doesn't have to restart that process from scratch just because Claude is now in the loop, since Claude runs inside the same reviewed infrastructure.

The table below compares the three integration tracks:

| Track | What it does | Status (August 2026) |
|---|---|---|
| Salesforce in Claude | CRM data and 37 sales skills move into Claude as a plugin | Select pilot customers; open beta expected September 2026 |
| Claude in Agentforce | Claude becomes the Atlas Reasoning Engine's model; runs Vibes and Coworker by default | Live |
| Claude in Slack | Claude gets embedded into Slack workflows | Announced, scope expanding |

## What does this change against Microsoft Copilot and Google Agentspace?

Competition in the enterprise CRM-plus-AI market has largely been shaped by Microsoft's Copilot, embedded into Dynamics 365, and Google's Agentspace. Claudeforce gives Salesforce something neither of those has: a partnership with an independent frontier-model provider outside its own ecosystem. Where Microsoft embeds its own model family into its own CRM, Salesforce chose to bring in one of the strongest outside reasoning models and integrate it rather than build one in-house.

That also signals Salesforce isn't locking itself to a single model vendor. The company still runs its own Atlas Reasoning Engine, and Claude is positioned as *a* model powering it, not the only option. The practical takeaway for enterprise customers: Salesforce can plug in other models to the same architecture later, so betting on Claudeforce today doesn't mean betting on one model forever.

## How does Claudeforce affect teams outside of sales?

The announcement centers on sales teams and the 37 prebuilt sales skills, but Claude's embedding into Slack and its default role in Agentforce Coworker point to impact beyond sales. Agentforce Coworker is also used by support and operations teams, so Claude's presence there opens up use cases like summarizing support tickets or drafting operational reports, both grounded in the same underlying CRM data.

On the marketing side, no dedicated "Marketing in Claude" plugin has been announced yet — a sign Salesforce chose to prove the model in sales first before extending it to other departments. Additional prebuilt skill sets, potentially covering marketing and customer service, are expected to roll out through the rest of 2026, though that hasn't been officially confirmed as of August 2026.

## Does Claudeforce replace Agentforce?

No — Claudeforce doesn't replace Agentforce, it puts Claude inside it as the reasoning engine. Salesforce's own product line (Agentforce, Slack, Data Cloud) stays intact; only the default intelligence layer underneath those products is now Claude. It's the same strategy behind [Anthropic's expansion of budget, advisor, and data-residency controls for Claude Managed Agents](/en/posts/claude-managed-agents-budgets-advisors-data-residency): sell Claude to enterprise customers by embedding it inside the tools they already run, not by asking them to switch tools.

Pricing stays split between the two companies too: Salesforce bills for headless API consumption, while Claude inference is contracted separately with Anthropic — there's no single combined contract yet.

## When is it available, and who should pilot it?

As of August 2026, Claude is generally available across Agentforce surfaces, while the "Salesforce in Claude" plugin is pilot-only. Salesforce also said it plans to make Claude Code and Claude Enterprise available to its own developers and knowledge workers as its preferred AI assistant and productivity tools — meaning the partnership extends into Salesforce's internal operations too.

If your sales team is already deeply invested in Salesforce and operates in a regulated industry — finance, healthcare — the pre-cleared security review that comes through the Trust Boundary makes piloting now worthwhile. Teams that aren't locked into Salesforce, or that want a custom CRM integration, may still prefer [building their own MCP connector](/en/posts/build-your-first-mcp-connector): it's more flexible than Claudeforce's packaged, governed path, at the cost of building that flexibility yourself.

For more on how teams are operationalizing Claude day to day, see our guide to [automating weekly marketing reports with Claude Cowork](/en/posts/automate-weekly-marketing-reports-cowork) — what Claudeforce does for enterprise sales, Cowork does for small-team reporting.

For more enterprise AI coverage, browse our [Business category](/en/category/business).

## Frequently Asked Questions

### What is Claudeforce, in one sentence?

Claudeforce is the expanded partnership Salesforce and Anthropic announced on August 26, 2026, bringing Salesforce CRM data into Claude and making Claude the default reasoning model inside Agentforce. It runs in three directions: Salesforce in Claude, Claude in Agentforce, and Claude in Slack.

### Can I use Claudeforce today?

Partly. Claude's presence across Agentforce surfaces (Atlas, Vibes, Coworker, Agent Builder) is live as of August 2026. The "Salesforce in Claude" plugin is still limited to select pilot customers, with a general open beta expected in September 2026.

### Is Claudeforce a competitor to Agentforce?

No. Claudeforce puts Claude inside Agentforce as its reasoning layer — it doesn't replace Salesforce's own products. Salesforce bills for headless API consumption, while Anthropic charges separately for Claude inference.

### Is data safe under Claudeforce in regulated industries like finance or healthcare?

Claude runs through Amazon Bedrock inside Salesforce's Trust Boundary, operating within Salesforce's own VPC under the data-handling commitments banks and healthcare organizations have already approved for Salesforce. That shortens the security review for organizations that have already cleared Salesforce itself.
