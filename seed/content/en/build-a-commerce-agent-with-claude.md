---
title: "Build a Commerce Agent With Claude"
slug: "build-a-commerce-agent-with-claude"
translationKey: "build-commerce-agent-with-claude"
locale: "en"
excerpt: "Short answer: start from Anthropic's Claude Commerce Agents blueprint, released September 2, 2026. Keep payment off the model, in the merchant's own checkout."
category: "ai"
tags: ["claude", "ai-agents", "automation", "integration"]
publishedAt: "2026-09-06"
seoTitle: "How to Build a Commerce Agent With Claude (2026)"
seoDescription: "What is the Claude Commerce Agents blueprint? We cover catalog-search, cart and order-status tool design, payment guardrails, and prompt-injection defense."
---

Short answer: start from [Claude Commerce Agents](https://www.explainx.ai/blog/claude-commerce-agents-open-source-blueprint-september-2026), the open-source blueprint Anthropic released on September 2, 2026. This Apache 2.0 reference architecture ships ready-made catalog-search, cart, and order-status tools, and deliberately keeps the payment step out of the model, inside the merchant's own checkout system.

## What does the Claude Commerce Agents blueprint actually give you?

The blueprint is an open-source reference package with two working agents and demo apps across four industries: retail, travel, telecom, and ticketing. The point isn't to design an architecture from scratch — it's to build your own catalog on top of a tool set and prompt structure that's already been tried in production. The package also ships as a Claude Code plugin, so if you already know [Claude Code's plugin system](/en/posts/build-and-share-claude-code-plugins), the install will feel familiar.

According to early figures Anthropic shared, retailers running a Claude-based shopping agent report carts **up to 35% larger** and shoppers **60% more likely to complete a purchase**. Those numbers come from a single case study, not a universal guarantee — but they show the design pays off when it's done right.

## What's the difference between the Shopping Agent and the Merchant Agent?

The two serve different users and do different jobs. The Shopping Agent faces the customer: it searches the catalog, compares products, fills the cart, answers policy questions like returns and shipping windows, and hands off to the store's own checkout at the final step. The Merchant Agent faces store staff: it analyzes sales data and drafts product descriptions, price suggestions, and campaign copy — none of which goes live without human approval.

That split is deliberate. A customer-facing agent that changes its own prices or launches its own campaign is a catastrophic failure mode waiting to happen. The blueprint keeps the two roles strictly separate for exactly that reason.

## How should you design a commerce agent's tools?

Three tools are enough to build a working Shopping Agent: catalog search, cart management, and order-status lookup. Each one needs a narrow, predictable scope — giving an agent one tool that "does everything" makes debugging harder and widens the attack surface at the same time.

| Tool | Scope | What it must not do |
|---|---|---|
| `search_catalog` | Search by product name, category, price range | Never update stock or price |
| `manage_cart` | Add/remove items, change quantity | Never trigger payment or generate discount codes |
| `get_order_status` | Look up order status and shipping tracking | Never cancel an order or start a refund |

Anything beyond those three — starting a refund, applying a discount — belongs in a separately approved tool or a flow with a human in the loop. The staged-permission logic in [wiring AI agents into your CI/CD safely](/en/posts/ai-agents-in-cicd-safely) applies here too: start with narrow scope, widen only as the need proves out.

The blueprint's four industry demos show how the same three tools adapt to different catalogs:

| Demo | Catalog type | Distinctive scenario |
|---|---|---|
| Retail | Physical products | Size/color variants, stock checks |
| Travel | Flights and hotels | Date-range search, cancellation-policy questions |
| Telecom | Plans and bundles | Comparing current plan, contract terms |
| Ticketing | Events and seats | Time-pressured inventory, seat-map lookups |

All four run on the same `search_catalog` / `manage_cart` / `get_order_status` trio; the only thing that changes is the catalog's data schema. That means adapting the blueprint to your own industry is mostly a data-schema exercise, not an architecture redesign.

## How do you keep payment off the model?

The rule is absolute: the model never sees card data, and it never triggers payment itself. The Shopping Agent fills the cart and hands the customer to the store's existing checkout flow; payment confirmation, card data, and final capture stay entirely inside the store's existing payment infrastructure. That simplifies PCI-DSS compliance and, just as importantly, makes it structurally impossible for a model hallucination to move real money.

That principle lines up with where agentic-commerce protocols are heading in general. OpenAI's Agentic Commerce Protocol (ACP), built for Instant Checkout, retired in March 2026, while Google's Universal Commerce Protocol (UCP) keeps a similar "agent selects, merchant collects" split — [a rundown of Claude's commerce-agent blueprint covers that context](https://www.datastudios.org/post/claude-shopping-merchant-agents-anthropic-ai-commerce-blueprints) in more detail. Claude's blueprint isn't locked to any one protocol; it proposes a tool layer that talks to the merchant's own API, which keeps you from getting stuck on a single payment ecosystem.

## What guardrails do you need against prompt injection and over-purchasing?

Two risk classes matter most: instructions hidden inside catalog text (prompt injection) and an agent inflating a cart with no budget ceiling of its own (over-purchasing). Against the first, your system prompt needs to say explicitly that anything coming back from the catalog is data, never an instruction to follow. Against the second, set a hard cap on cart total and an approval threshold for any single transaction.

A concrete checklist: pause and request human approval once cart total crosses a set amount; never let the agent apply a discount code it generated itself as if it were real; log every tool call so an anomaly can be traced back afterward.

A simple threshold check embedded in the `manage_cart` tool itself might look like this:

```json
{
  "tool": "manage_cart",
  "guardrail": {
    "max_cart_total": 5000,
    "on_exceed": "require_human_approval",
    "trust_catalog_text_as_instruction": false
  }
}
```

The `trust_catalog_text_as_instruction: false` line makes explicit, in code, that nothing coming back from the catalog is ever interpreted as a command — an architectural guarantee instead of something you're hoping the system prompt enforces.

## How do you test a commerce agent before production?

Before testing with real money, run the agent's tool calls end-to-end against a mock catalog and a mock order service. The blueprint's demo apps exist for exactly this purpose: you can confirm the agent behaves within expected bounds against a fake dataset resembling one of the four industries before ever connecting it to a real store. Deliberately test prompt-injection scenarios at this stage too — plant a hidden instruction inside a catalog description and confirm the agent ignores it.

If you want to fit this testing discipline into a broader framework, the steps in [How to Test AI Agents Before Production](/en/posts/test-ai-agents-before-production) — enumerating edge cases, testing with adversarial inputs, simulating the human-approval threshold — apply directly to a commerce agent too.

## Frequently Asked Questions

### Is Claude Commerce Agents free, and where do you get it?

Yes — the blueprint is open source under Apache 2.0 and available from Anthropic's GitHub repository, shipping with demo apps for retail, travel, telecom, and ticketing.

### Which Claude model does a commerce agent run on?

The blueprint isn't locked to one model; it's built to work with current Claude models available through the Claude Developer Platform. A stronger model suits complex comparison and policy questions, while a cheaper one handles plain catalog search.

### Can a commerce agent actually make a payment?

Not by design: the agent fills the cart and hands the customer to the store's own checkout, never seeing card data. Wiring payment directly into an agent is a separate architectural decision that needs its own risk assessment.

### With ACP retired, which protocol will commerce agents use?

No single standard has settled yet: OpenAI's ACP retired in March 2026, while Google's UCP and Microsoft's Copilot Checkout are moving forward with different approaches. Claude's blueprint proposes a protocol-agnostic tool layer specifically to stay flexible through that uncertainty.
