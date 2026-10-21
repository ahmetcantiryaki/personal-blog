---
title: "What Are Claude API User Profiles?"
slug: "what-are-claude-api-user-profiles"
translationKey: "claude-api-user-profiles-2026"
locale: "en"
excerpt: "Short answer: User Profiles attribute Claude API requests to your end customers, so a safety action hits one customer instead of your whole organization."
category: "ai"
tags: ["claude", "api-design", "ai-infrastructure", "saas", "compliance"]
publishedAt: "2026-10-21"
seoTitle: "What Are Claude API User Profiles?"
seoDescription: "Short answer: User Profiles attribute Claude API requests to your end customers, so a safety action hits one customer instead of your whole organization."
---

Short answer: User Profiles is a Claude API feature, launched October 20, 2026, that lets you tell Anthropic which of your end customers each request is for. Before this, a safety violation could affect your entire organization; now it restricts only the responsible end customer, and the rest of your traffic keeps running untouched.

## What problem does this actually solve?

If you've built a platform, gateway, or resale layer on top of Claude, all of your end customers' traffic flows through a single Anthropic organization. Anthropic runs automated safety classifiers over API traffic, and on a request sent with no profile attached, one end customer's abuse can trigger an enforcement action that applies to your entire organization. That means one bad actor can take down access for hundreds of your legitimate customers at once. Any team that puts the API behind its own product — a customer support bot, a coding assistant, a content tool — carries this risk, and it scales linearly with how many customers you have.

## How do you create a profile and attach it to a request?

You call `POST /v1/user_profiles` once per end customer, and store the `uprof_` ID it returns on your own customer record. From then on, you send that ID in the `anthropic-user-profile-id` header on every request you make on that customer's behalf. Creating a profile is free — profiles don't affect billing or pricing.

```bash
# Once per end customer: create a profile
curl https://api.anthropic.com/v1/user_profiles \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"name": "Acme Analytics, Inc.", "access_type": "passthrough"}'

# On every request: send the profile ID in the header
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-user-profile-id: $PROFILE_ID" \
  -d '{"model": "claude-opus-5-5", "max_tokens": 1024, "messages": [...]}'
```

The official SDKs and the `ant` CLI set this header for you through a `user_profile_id` parameter — you don't have to write the raw header by hand. If you haven't upgraded the Python SDK to 1.0 yet, our [SDK migration guide](/en/posts/anthropic-python-sdk-v1-migration-guide) covers what else changed; the `user_profile_id` parameter works the same way on both versions.

## What's the difference between the `application` and `passthrough` access types?

The `access_type` field tells Anthropic who the profile represents. The default, `application`, represents an individual user signed up to your product. `passthrough` represents a company you resell API access to through a gateway — in that case you don't open a profile per person inside that company, one profile per company is enough.

| access_type | Represents | Default? |
|---|---|---|
| `application` | An individual user signed up to your product | Yes |
| `passthrough` | A company you resell API access to | No, you have to set it |
| No profile | Your own organization's internal usage | — |

If a single identifiable person is sending requests under a `passthrough` profile, you can additionally send an identifier for that person in the Messages request's own `metadata.user_id` field, separate from the profile's own `metadata` field, to help Anthropic distinguish misuse by one individual.

## What happens when an end customer gets restricted or banned?

The enforcement action applies only to requests carrying that specific profile ID; traffic sent with no profile or a different profile is unaffected. That's the whole point of User Profiles: what used to be "one customer misbehaves, the whole organization gets restricted" becomes "one customer misbehaves, only that customer gets restricted."

## When do organization webhooks kick in?

The same October 20 announcement added organization webhooks to the Admin API, in beta, which notify you when a profile is restricted or banned, and when that restriction ends. They use the `webhooks-2026-10-07` beta header, and access requires contacting your Anthropic account team. Without these webhooks, you'd only notice a restriction once that customer's requests start failing; with them, the notification is immediate — though until your access is approved, you may need to watch for sudden spikes in your own `400` error rate as an indirect signal.

## Is this different from Inference Hooks?

Yes, the two serve different purposes. As we cover in our [inference hooks guide](/en/posts/claude-inference-hooks-explained), inference hooks let you route every request through your own security server to approve or reject it in real time — that feature also came out of beta for Enterprise organizations on October 20. User Profiles doesn't touch the request itself; it only tags whose request it is. Using both together gives you real-time control plus targeted enforcement after the fact.

## How does this work on Amazon Bedrock and Google Cloud?

You can only create profiles through the Claude API or Claude Platform on AWS — Bedrock and Google Cloud don't have `/v1/user_profiles` endpoints. You send the profile ID you created as a top-level `user_profile_id` field in the request body on Bedrock, or the same `anthropic-user-profile-id` header on Google Cloud. One important difference: Bedrock and Google Cloud check the ID's format but don't verify the profile actually exists, so a malformed-but-well-formed ID can be silently accepted there, where the Claude API would reject it with a `400`.

## Is deleting a profile enough when a customer closes their account?

No — deleting isn't enough on its own; you need to stop sending that customer's requests with the profile ID first. `DELETE /v1/user_profiles/{id}` permanently removes the profile and everything you supplied for it (name, external user details, metadata), but it doesn't erase the trust-and-safety records Anthropic keeps tied to that ID. For roughly 10 minutes after deletion, requests still carrying the deleted ID can keep succeeding; after that window, the same ID gets rejected with a `400`. If the customer is staying with you but asked you to erase their data, the right order is creating a new profile, switching to its ID, then deleting the old one.

## Who does this actually matter for?

It mainly matters for teams building a platform, SaaS product, or gateway on top of the Claude API; if you're calling the API directly for your own internal use, this feature gives you no direct benefit, because you're already the only "customer." If you run a multi-tenant product where end-user traffic flows through a single Anthropic organization, not turning this on means one user's mistake can put your entire customer base at risk.

My own take: this feature exposes a responsibility API providers have quietly left on platform operators for a while. The "one organization, one enforcement surface" model was always a hidden risk if you ran a large gateway; User Profiles hands you control over that risk, but it also hands you the responsibility — tagging every end customer with the right profile is now your job, not Anthropic's. A team that skips that tagging gets no protection from the feature at all; every request sent without a profile ID still carries the old "one customer sinks everyone" risk unchanged.

For the technical details, Anthropic's official [User Profiles guide](https://platform.claude.com/docs/en/manage-claude/user-profiles) and [API reference](https://platform.claude.com/docs/en/api/user_profiles) are the most current sources, and all of October 2026's changes are listed on the [official release notes page](https://platform.claude.com/docs/en/release-notes/overview). If you're weighing the Claude API against other AI subscriptions more broadly, see our [AI subscription buyer's guide](/en/posts/which-ai-subscription-2026).

## Frequently Asked Questions

### Is it free to create a User Profile?

Yes. Per Anthropic's official documentation, profiles aren't billed and don't affect pricing — you only pay your normal API usage charges.

### Do you need a separate profile for every individual end user?

Under the `application` access type, yes — one profile per signed-up user. Under `passthrough`, one profile per company is enough; you use the request's own `metadata.user_id` field to distinguish individuals within that company.

### What happens to a request sent with no profile attached?

It processes normally, but it isn't tied to any profile — so any safety violation that request triggers applies to your entire organization, not to a single customer.

### Can User Profiles be used on Amazon Bedrock too?

Yes, but you have to create the profile on the Claude API or Claude Platform on AWS first — Bedrock itself has no profile-creation endpoint, you can only send an existing profile's ID in the request body.
