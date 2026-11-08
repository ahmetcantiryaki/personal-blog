---
title: "What Is Claude's Personal Finance Feature?"
slug: "claude-personal-finance-feature-explained"
translationKey: "claude-personal-finance-feature-2026"
locale: "en"
excerpt: "Claude's Personal Finance links bank accounts via Plaid in read-only mode to summarize spending; it can't move money and is US-only on Pro, Max, and Ultra."
category: "ai"
tags: ["claude", "ai-tools", "privacy", "productivity"]
publishedAt: "2026-11-08"
seoTitle: "What Is Claude's Personal Finance Feature?"
seoDescription: "Claude's Personal Finance links bank accounts via Plaid in read-only mode to summarize spending; it can't move money and is US-only on Pro, Max, and Ultra."
---

Short answer: Personal Finance is a beta feature Anthropic rolled out in the US in early November 2026 that reads your linked bank and card accounts through Plaid, in read-only mode, to answer plain-language questions about spending, balances, and upcoming bills. It cannot move money or invest, and as of November 2026 it's limited to US Pro, Max, and Ultra subscribers.

## What is Claude's Personal Finance feature?

Personal Finance adds a connected-accounts mode to Claude's chat interface: once you link a bank or card account, Claude can answer questions like "how much did I spend on groceries last month?" in plain language. According to [TechCrunch](https://techcrunch.com/2026/11/05/claude-can-now-analyze-your-spending-with-its-new-personal-finance-tool) and [9to5Mac](https://9to5mac.com/2026/11/05/anthropic-upgrades-claude-with-new-personal-finance-feature/), Anthropic opened the beta to US Pro, Max, and Ultra subscribers on November 4–5, 2026; it isn't on the Free plan. Anthropic hasn't published a dedicated post on its own [news page](https://www.anthropic.com/news) for this launch, but the rollout has been confirmed with matching details across multiple outlets.

## How do you connect an account, and which banks are supported?

Account linking runs through [Plaid](https://plaid.com), so you authenticate directly on your own bank's or card issuer's login screen — you never hand Claude your banking password. Plaid then passes along only the access scope your institution approves. You can remove the connection at any time from the Connectors menu on web and desktop, and on mobile you can require approval before every single read.

## Can Claude move money or make trades?

No, not at all. Personal Finance is strictly read-only: Claude cannot transfer funds, open accounts, or place trades. All it does is read the transaction history on accounts you've connected and summarize it. Reports describe it analyzing roughly two years of transaction history and sorting spending into categories such as rent and utilities, food and drink, and shopping.

## How private is this, and is there advertising?

Anthropic says conversations inside the Personal Finance hub are excluded from model training, that there are no ads or sponsored recommendations, and that the company doesn't sell its own credit cards, loans, or savings products through the feature. That lines up with the broader pattern we cover in [how AI assistants handle your data](/en/posts/protect-privacy-ai-assistants): granting read access isn't the same thing as handing data over for other uses.

## Who can use it, and on which plan?

As of November 2026, the feature is limited to US-based Pro, Max, and Ultra subscribers; it isn't available on the Free tier or outside the US yet. If you're weighing which plan fits your budget, our [AI subscription comparison](/en/posts/which-ai-subscription-2026) breaks down pricing across Claude, ChatGPT, and Gemini.

| Plan | Personal Finance access | Region |
|---|---|---|
| Free | No | - |
| Pro | Yes (beta) | US only |
| Max | Yes (beta) | US only |
| Ultra | Yes (beta) | US only |

## What kinds of questions can you actually ask it?

The feature works through ordinary conversation rather than an accounting-software-style menu. Example prompts: "How much did I spend on dining out this month?", "What's my average grocery bill over the last three months?", "Which recurring charges are coming up next week?", "What's my total subscription spending?" Claude scans transactions across your connected accounts to answer in plain language, and it can compare categories too — for instance, flagging which spending category rose the most compared with last month.

The important detail is that Claude only uses this account data within that specific session; as the privacy section above notes, none of it feeds model training, and it stays separate from your regular chats outside the Personal Finance hub.

## How does setup actually work, step by step?

Setup has three steps: open the Personal Finance section in the Claude app, choose "connect an account" and pick your institution from Plaid's supported list, then authenticate directly on your bank's own login screen and approve which accounts Claude can see. Claude never sees that third step — all authentication happens inside Plaid's and your bank's own interface. After you approve access, the first sync can take a few minutes, since it's pulling roughly two years of historical transaction data.

You can connect multiple accounts at once, and Claude rolls them into one combined view of total spending. You can also query a single account on its own — asking to see "just the credit card charges" works fine.

## What are the limitations?

Three limits stand out. Geographic: the feature currently works only in the US, and only with institutions Plaid supports, so banks outside the US are out of scope for now. Plan-based: Free users can't see the feature at all. Scope: Claude doesn't offer investment advice, tax guidance, or loan applications — it only reads and summarizes the data you already have. Anthropic draws that line deliberately, since regulated financial advice carries a separate licensing and liability burden the company hasn't taken on here.

## Is this really "a first step," or just a limited demo?

Anthropic itself calls this "a first step" and has invited wealth managers, banks, and other financial companies to build bigger tools on top of it. My honest take: branding a read-only, single-country feature as "a first step" is a bit of a reach — stacked against [the budget and advisor tooling Claude Managed Agents already offers on the enterprise side](/en/posts/claude-managed-agents-budgets-advisors-data-residency), this looks more like a scaled-down consumer version of a capability that already exists at a more advanced stage for business customers. Starting read-only is still the right call for anything that touches money, though.

For the bigger picture on how Claude retains and uses this kind of personal data, see our breakdown of [how Claude, ChatGPT, and Gemini remember you](/en/posts/how-claude-chatgpt-gemini-remember-you) — Personal Finance is really an extension of that same memory-and-privacy trade-off.

## Frequently Asked Questions

### Is Claude's Personal Finance feature free?

No. As of November 2026, it's limited to US-based Pro, Max, and Ultra subscribers; it isn't available on the Free plan, and it hasn't rolled out outside the US yet.

### Can Claude move money out of my bank account?

No. The feature is strictly read-only — Claude cannot transfer funds, place trades, or open accounts. It can only read and summarize transaction history on the accounts you've connected.

### Does Claude see my banking password?

No. The connection runs through Plaid, and you authenticate directly on your bank's own login screen; Claude and Anthropic never see your banking credentials.

### Can I disconnect my accounts later?

Yes. You can remove the connection at any time from the Connectors menu on web and desktop, which fully ends Claude's access to that account. On mobile, you can also require approval before each individual read.
