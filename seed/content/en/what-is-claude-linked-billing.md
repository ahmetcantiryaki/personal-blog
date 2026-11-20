---
title: "What Is Claude's Linked Billing Feature?"
slug: "what-is-claude-linked-billing"
translationKey: "claude-linked-billing-2026"
locale: "en"
excerpt: "Linked Billing, in beta since Nov 17, 2026, lets a customer pay Anthropic directly for their own Claude API usage through their own organization."
category: "ai"
tags: ["claude", "pricing", "saas", "monetization"]
publishedAt: "2026-11-20"
seoTitle: "Claude Linked Billing: What It Is and How It Works"
seoDescription: "Linked Billing (beta, Nov 17, 2026) lets Claude API platforms pass usage costs to the customer's own Anthropic organization via a billing_policy field."
---

Linked Billing is a beta feature Anthropic shipped on November 17, 2026 that lets a platform built on the Claude API charge usage costs to a customer's own Anthropic organization instead of its own. A customer links their organization once, then every request can carry a `billing_policy` field that routes the bill to them instead of to you.

## What Problem Does Linked Billing Actually Solve?

Before this feature, every platform built on top of Claude absorbed 100% of its customers' API costs and then had to recoup that spend through its own pricing, margins, and usage caps. If one customer suddenly ran a heavy batch job, the platform's own Anthropic bill spiked, not the customer's. Linked Billing moves that risk: once a customer connects their own paying Anthropic organization to your app, their usage can be billed to them directly, the same way AWS Marketplace or Snowflake let a reseller's customer pay the underlying cloud bill themselves.

## How Does the billing_policy Field Work?

A customer first links their Claude organization to your app through Anthropic's organization billing connections flow. After that, your app sends the beta header `anthropic-beta: user-profiles-billing-2026-10-01` and includes `billing_policy` on each `/v1/messages` or `/v1/chat/completions` call to tell Anthropic who pays for that specific request.

```http
POST /v1/messages HTTP/1.1
Host: api.anthropic.com
anthropic-beta: user-profiles-billing-2026-10-01
content-type: application/json

{
  "model": "claude-sonnet-5-5",
  "billing_policy": "customer_organization",
  "messages": [{"role": "user", "content": "Summarize this contract."}]
}
```

Anthropic's release note doesn't publish the full list of accepted `billing_policy` values, so check the organization billing connections documentation before you ship this in production rather than guessing at the field's exact options.

## Who Should Actually Turn This On?

Linked Billing is built for platforms, agent gateways, and resellers whose customers already have (or are willing to create) their own Claude organization that pays Anthropic directly. A dev-tools startup reselling Claude access to other companies is the clearest fit; a consumer app with casual, non-technical users is the weakest fit, because most of those users have no Anthropic organization at all and won't create one just to use your product.

| Business model | Who pays Anthropic today | Fits Linked Billing? |
|---|---|---|
| Agent gateway / API reseller for other companies | Your organization | Yes — customers likely already run their own org |
| Vertical SaaS billed per seat, usage hidden from the user | Your organization | Rarely — adds friction for non-technical buyers |
| Internal tooling across a large enterprise's business units | One central org | Yes — bills usage back to the requesting unit |
| Consumer chat app | Your organization | No — consumers won't manage a Claude org |

## What Does This Change for Your Margins?

If your customer's own organization pays for their usage, your gross margin per request goes from "selling tokens at a markup" to "selling the product wrapped around the tokens." That is a meaningfully different business, and it only works if your product still has value once the token cost disappears from your P&L — things like orchestration, UI, workflow logic, and support. Teams thinking through unit economics as model prices keep shifting should read how [cheaper tokens don't automatically protect margin](/en/posts/falling-ai-token-prices-margins), since passing the bill through doesn't remove the pricing-strategy problem, it just moves it to a different line item.

## What's the Catch?

Three things to check before relying on Linked Billing. First, it's still in beta as of November 2026, so treat the contract and the accepted `billing_policy` values as subject to change. Second, the customer controls the relationship from their side too: Anthropic's release note confirms a linked customer can set a spend cap on your app or unlink it entirely from the Claude Console, at any time, without asking you. Third, it only works for customers who already pay Anthropic directly — it is not a general-purpose way to split a bill between you and a customer who has no Anthropic account.

## How Does This Compare to a Traditional Reseller Markup?

In the traditional model, you buy Claude access wholesale from Anthropic and sell it to customers at a markup — your invoice to Anthropic and your invoice to the customer are two separate numbers, and the spread between them is your margin on infrastructure. Linked Billing collapses that spread for any request tagged with `billing_policy: customer_organization`: Anthropic bills the customer directly for the exact tokens they used, and you no longer carry that cost on your books at all. That's closer to how a cloud marketplace listing works than how a typical API wrapper works — you're selling access and tooling around a resource, not reselling the resource itself at a markup. For a platform with thin or negative margins on raw usage, that's a meaningful shift in what you're actually charging for.

## How Do You Turn It On?

You implement the organization billing connections flow so a customer can link their Claude organization to your app, start sending `billing_policy` on requests once a customer is linked, and fall back to your own organization's billing for every customer who isn't. Anthropic's current flagship for cost-sensitive production traffic is [Claude Fable 5.2](/en/posts/claude-fable-5-2-mythos-5-2-launch), priced at $8 per million input tokens and $40 per million output tokens as of November 2026 — worth knowing even when a customer is footing their own bill, since they will ask you why the number on their invoice looks the way it does.

My honest take: Linked Billing is a good sign that Anthropic is treating the "built on Claude" ecosystem as infrastructure rather than just a chatbot API, but it will matter to a narrow slice of platforms for now — specifically the ones selling to other technical teams, not to end consumers.

## Frequently Asked Questions

### Does Linked Billing let me split one bill between my company and a customer?

No. A given request is billed either to your organization or to the customer's linked organization, based on the `billing_policy` value you send — Anthropic's release note doesn't describe a split-bill or shared-cost arrangement within a single request.

### Do I need my customer to have an existing Anthropic account?

Yes. Linked Billing only works once a customer has linked their own Claude organization that already pays Anthropic directly; it is not a way to onboard a customer who has never used Claude before.

### Is Linked Billing available outside of beta?

As of November 20, 2026, Linked Billing is in beta behind the `anthropic-beta: user-profiles-billing-2026-10-01` header. Anthropic's release notes don't give a general-availability date, so confirm current status in the official documentation before building critical billing logic on top of it.

### Can a customer cancel Linked Billing without telling me?

Yes. A customer can set a spend cap on your app or unlink it entirely from inside their own Claude Console at any time, so your integration should handle a sudden fallback to your own organization's billing gracefully.
