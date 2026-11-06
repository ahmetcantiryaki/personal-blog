---
title: "How Do You Set Up IP Allowlisting for the Claude API?"
slug: "how-to-set-up-ip-allowlisting-claude-api"
translationKey: "claude-api-ip-allowlisting-2026"
locale: "en"
excerpt: "Short answer: turn on IP allowlisting in the Claude Console's Identity and Access page, add your IP ranges, and save. Requests outside it get a 403."
category: "ai"
tags: ["claude", "api-design", "web-security", "backend"]
publishedAt: "2026-11-06"
seoTitle: "Claude API IP Allowlisting: Setup Guide (2026)"
seoDescription: "Anthropic shipped IP allowlisting for the Claude API in beta on November 5, 2026. How to turn it on, what it covers, and how to avoid locking yourself out."
---

Short answer: open the **Identity and Access** page in the Claude Console, turn on the IP allowlist toggle, add the public IP addresses or CIDR ranges your servers, CI, and office connect from, then save. From that point on, any request to a covered endpoint — Messages, Files, the Admin API — from an address outside that list gets rejected with a 403 `permission_error`, which means a leaked API key stops being useful to whoever stole it.

## What Is IP Allowlisting for the Claude API?

IP allowlisting is the beta feature Anthropic shipped on November 5, 2026: you define a list of IP ranges at the organization level, and Anthropic checks every covered request's source address against it, rejecting anything that doesn't match. The logic closes a real gap — an API key alone answers "does this caller know the secret," not "is this caller who we expect." Once a key leaks, that distinction collapses. An allowlist adds a third condition: even with a valid key, a request from an unexpected network gets denied.

## Why Do You Actually Need This?

When an API key leaks — pushed in a `.env` file, printed in a log line, left in a CI artifact — whoever finds it has a working credential they can call from anywhere on the internet. An IP allowlist stops that exact scenario, because the leaked key only works from networks you've explicitly listed. Anthropic's own documentation frames the benefit precisely: it can prevent data leaks and reduce the chance of getting billed for abusive use. It does not change how long the key stays valid, which is why Anthropic recommends pairing it with short key expiration or moving to Workload Identity Federation, which drops static keys entirely.

## Which Endpoints Does It Actually Cover?

The allowlist doesn't cover everything, and knowing the boundary matters so you don't end up with false confidence.

| Covered | Examples |
|---|---|
| Claude Console UI | Panel sign-in |
| Claude API (API key or WIF token) | Messages, Message Batches, Token Counting, Models, Files, Skills |
| Claude Managed Agents endpoints | Agents, Sessions, Environments, Vaults, Memory stores |
| Organization APIs | Admin API, Compliance API |
| **Not covered** | Claude via Amazon Bedrock, Google Cloud, or Microsoft Foundry; the Managed Agents runtime's own networking |

If the same organization also calls Claude through Bedrock, the allowlist never sees that traffic — you'd need to control it separately through that cloud provider's own security groups.

## How Do You Turn On the Allowlist?

The setup is three steps: flip the toggle, add your ranges, then watch your traffic.

```bash
# Once the allowlist is active, a request from an address outside it returns:
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
# -> 403 Forbidden
# {"type":"error","error":{"type":"permission_error",
#   "message":"Your IP address isn't in this organization's allowed range."}}
```

Each entry is a single IPv4/IPv6 address (`203.0.113.5`) or a CIDR range (`203.0.113.0/24`, no broader than `/8`; `/32` for IPv6), and the list holds up to 1,000 entries. Changes can take up to 15 minutes to propagate, so after saving, watch for 403 responses on jobs that only run daily or weekly — those are the ones people forget to list.

## How Do You Avoid Locking Yourself Out?

The save screen only checks your own current address — not your servers, not your teammates, not the network you'll connect from tomorrow. Before you list data centers, CI systems, offices, VPNs, and proxies, keep the **"Allow admins to access this settings page from any IP address"** checkbox selected, which Anthropic recommends specifically so an admin can always get back to the settings page and fix the list. The trade-off is that an attacker who compromises an admin session could change the list remotely too — if you've set up the Compliance API, its Activity Feed makes those changes auditable.

## Is IP Allowlisting Enough on Its Own?

No — an allowlist limits *where* a key works, not *how long* it works, so treating it as the only layer creates false confidence. A stolen key still works if the attacker also happens to be routing through a network you listed, such as a shared corporate proxy — which is exactly why Anthropic's docs call out shared proxy addresses as a specific risk. The real defense layers the allowlist with short-lived keys or, better, Workload Identity Federation, which removes static keys altogether; the rotation and least-privilege principles in [cloud secrets management done right](/en/posts/cloud-secrets-management-done-right) apply just as directly here, and [zero-trust networking for small teams](/en/posts/zero-trust-networking-small-teams) already reduces network access to the same "is this on the list" question at a broader scale.

My take: treat this feature as a layer that lowers the cost of a leak, not a guarantee that leaks won't happen — setup takes about 10 minutes, and the payoff is avoiding the bill shock when a key accidentally ends up in a public repo. Anthropic shipping [Claude Files API reaching general availability](/en/posts/claude-files-api-ga-explained) and [changing its enterprise data retention policy](/en/posts/why-anthropic-is-changing-data-retention-policy) in the same stretch of weeks says something too: enterprise security surface area is expanding fast in late 2026, and allowlisting is the cheapest, fastest item on that list to actually turn on.

## How Does This Pair with Sign Members Out Everywhere?

In the same week — November 5, 2026 — Anthropic shipped a second beta feature alongside IP allowlisting: signing a Claude Enterprise member out of every device at once through the Admin API. The two solve different problems but tell a stronger story together — the allowlist controls *where* a request can come from, while sign-out-everywhere controls *how fast* access gets cut when an employee leaves or a session gets stolen. When someone leaves the company, signing their session out through that endpoint first and then removing the company's network from the allowlist makes for a sturdier offboarding step than either one alone; the member stays in the organization and can sign back in later, but every session open at that moment is invalidated instantly.

In practice, thinking about these two features together turns "what do I do the moment a key leaks" from a one-off panic into a checklist you've already written: revoke the key, sign the user out everywhere, update the allowlist, confirm the change in the Compliance API's Activity Feed. Writing those four steps down once and putting them in the team wiki saves real minutes during an actual incident.

## Frequently Asked Questions

### What is Claude API IP allowlisting?

An organization-level list of IP ranges; any request to a covered endpoint like Messages, Files, or the Admin API from outside that list gets rejected with a 403 `permission_error`. Even a valid, unexpired API key stops working if the request doesn't come from a listed network.

### What do I do if I lock myself out after setting up the allowlist?

First, reconnect from a listed network (office or VPN) and try again. If that's not possible, another admin on a listed network can add your address, or you can add it yourself remotely if the "allow access from any IP" checkbox was left checked. If neither works, you'll need to ask Anthropic support to turn the allowlist off.

### Is IP allowlisting enough to secure an API key by itself?

No. It limits where a key can be used but not how long it stays valid. Anthropic recommends pairing it with short key expiration, or moving to Workload Identity Federation, which eliminates static keys entirely.

### Does IP allowlisting cover Claude running on Amazon Bedrock or Google Cloud?

No. The allowlist only covers the direct Claude API, the Claude Console, and Managed Agents endpoints. It does not apply to calls made through Amazon Bedrock, Claude Models on Google Cloud, or Microsoft Foundry.
