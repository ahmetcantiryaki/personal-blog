---
title: "Email Deliverability: A Practical Checklist"
slug: "email-deliverability-checklist"
translationKey: "email-marketing-deliverability-2026"
locale: "en"
excerpt: "SPF, DKIM, and DMARC are table stakes now, not extras. Here's the field-tested checklist for keeping bulk campaigns out of spam as of July 2026."
category: "digital-marketing"
tags: ["email-marketing", "automation", "best-practices"]
publishedAt: "2026-07-30"
seoTitle: "Email Deliverability Checklist for 2026"
seoDescription: "A practical, field-tested checklist covering SPF, DKIM, DMARC, list hygiene, and complaint rates for keeping bulk email campaigns out of spam."
---

If you send more than roughly 5,000 messages a day to Gmail addresses, you're a "bulk sender" by Google's own definition, and you're required to authenticate with SPF, DKIM, and DMARC, keep complaints under 0.3%, and offer one-click unsubscribe. Miss any of those and your mail lands in spam, not inboxes.

That threshold isn't a suggestion buried in a help doc anymore — it's an enforced gate. [Google and Yahoo tightened these rules together](https://martech.org/new-rules-for-bulk-email-senders-from-google-yahoo-what-you-need-to-know/), and by July 2026 the gap between "technically compliant" and "actually delivering" has gotten wider, not narrower. This is the checklist I'd hand a team starting from zero.

## Authentication: SPF, DKIM, DMARC, and BIMI

Authentication is the floor, not the ceiling. It proves you are who you say you are; it does nothing to prove your content is wanted. Still, without it, nothing else on this list matters.

| Mechanism | What it does | 2026 requirement level |
|---|---|---|
| SPF | Lists which servers are allowed to send mail for your domain | Required |
| DKIM | Cryptographically signs messages so receivers can verify they weren't altered in transit | Required |
| DMARC | Tells receivers what to do when SPF/DKIM fail, and reports back to you | Required |
| BIMI | Displays your verified logo next to authenticated mail in the inbox | Optional, but growing |

[Google and Yahoo's authentication requirements](https://powerdmarc.com/google-and-yahoo-email-authentication-requirements/) are non-negotiable for bulk senders at this point. A `p=none` DMARC policy is an acceptable starting point — it lets you collect reports without affecting delivery — but the real expectation is that you move toward `p=quarantine` or `p=reject` as your authentication stabilizes. In 2026, both Gmail and Yahoo are noticeably less forgiving of partial or broken DMARC setups than they were a couple of years ago. What used to cause a mild dip in inbox placement now causes outright rejection.

Here's what the underlying DNS records look like, illustratively:

```text
; SPF record (TXT on example.com)
example.com.    TXT    "v=spf1 include:_spf.example-esp.com ~all"

; DMARC record (TXT on _dmarc.example.com)
_dmarc.example.com.    TXT    "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@example.com; pct=100"
```

Replace `example.com` and the ESP include with your own values — this is a shape to copy, not a record to paste verbatim.

## Warming a new sending domain or IP

Mailbox providers judge new sending sources with suspicion by default, and rightly so — most spam originates from freshly spun-up infrastructure. If you're moving to a new domain, subdomain, or dedicated IP, ramp volume gradually: start with your most engaged segment (recent openers, recent purchasers), send small batches for one to two weeks, and increase volume only as opens and clicks hold steady. Skip this and you'll build a reputation problem before you've sent a single real campaign.

## List hygiene and sunset policies

A list full of addresses that never open anything is a liability, not an asset. Set a sunset policy: define what "inactive" means for your list (say, no open or click in 90–180 days), attempt a re-engagement send, and remove or suppress anyone who still doesn't respond. Every recipient who ignores your mail drags your engagement rate down, and engagement rate is what mailbox providers actually watch.

Bounce management belongs in the same bucket. Hard bounces should be suppressed immediately and permanently; soft bounces need a retry-then-suppress rule so they don't quietly accumulate.

## The engagement signals Gmail and Outlook actually weigh

Authentication gets you considered. Engagement gets you delivered. In 2026, whether recipients open, click, reply, reply-forward, or move a message out of a folder — versus ignore it or mark it as spam — is the dominant signal mailbox providers use to decide inbox versus spam placement. This is assessed as a pattern, not a single event: [reputation systems look at volume spikes, engagement drops, and list-quality issues together](https://redsift.com/guides/bulk-email-sender-requirements) over time, the same way a credit score reflects a pattern of behavior rather than one payment.

Practically, that means segmenting by engagement and sending your riskiest content (new offers, cold re-activation campaigns) to your warmest segments first, not blasting everyone at once.

## Content patterns that trigger spam filters

A few habits still reliably hurt deliverability in 2026:

- Misleading subject lines that don't match body content
- Heavy reliance on link shorteners or redirect chains
- Image-only emails with little or no text
- Sudden, unexplained changes in sending patterns (a dormant list suddenly getting daily mail)
- Purchased or scraped lists — these tank engagement and spike complaints simultaneously

Here's the mildly unpopular opinion: teams spend an outsized amount of time A/B testing subject-line emoji and preheader text while their SPF record is misconfigured or their DMARC policy has been sitting at `p=none` with nobody reading the reports. I've watched this happen more than once — a marketing team optimizing copy for a domain that's already been silently filtered for weeks. Fix the plumbing before you fuss over the paint.

## Monitoring bounce and complaint rates

A spam complaint rate at or above 0.30% makes your domain ineligible for Gmail's delivery-mitigation support, and — this is the part people miss — even after you fix the underlying cause, you have to hold under 0.30% for seven consecutive days before eligibility comes back. Google's actual internal guidance is stricter than the published threshold: stay under 0.1%, and treat 0.3% as a wall you never touch, not a target you approach.

One-click unsubscribe is part of this too. It's implemented through the `List-Unsubscribe` and `List-Unsubscribe-Post` headers ([RFC 8058](https://chronos.agency/blog/gmail-yahoo-email-sender-requirements-2026/)), the link has to work without forcing a login, and you have to honor the request within two days. Every unsubscribe you make hard to find turns into a spam complaint instead — and complaints, not unsubscribes, are what hurt your reputation.

If you're already automating parts of your marketing stack, deliverability monitoring is a natural thing to wire into that automation rather than checking manually — we cover the underlying setup in [our piece on marketing automation with Zapier and Make](/en/posts/marketing-automation-with-ai-zapier-make).

## Pre-send checklist and tools to test inbox placement

Before your next send:

- SPF, DKIM, and DMARC all pass and align
- DMARC policy is at least `p=quarantine`, moving toward `p=reject`
- One-click unsubscribe header is present and tested
- List has been through a sunset/re-engagement pass in the last quarter
- Bounce and complaint rates are visible on a dashboard, not just in a monthly export
- New domains or IPs are past their warm-up period before full-volume sends
- Subject line and preview text match the actual content

Tools worth having in the stack for inbox-placement testing: Google Postmaster Tools (domain reputation and spam-rate data straight from Gmail), a seed-list inbox placement tester, and your ESP's own authentication checker. None of these replace watching real campaign engagement, but they catch problems before a real send does.

If your list itself needs work before any of this matters, our guide on [growing and monetizing a newsletter](/en/posts/grow-monetize-newsletter-2026) covers building a list worth protecting in the first place. And if visibility beyond the inbox is also part of your strategy, see our [guide to generative engine optimization](/en/posts/generative-engine-optimization-guide) and our [digital marketing category](/en/category/digital-marketing) for related field notes.

## Frequently Asked Questions

### Do these rules apply if I send fewer than 5,000 emails a day?

The formal bulk-sender requirements don't technically apply below that threshold, but authenticating with SPF, DKIM, and DMARC is good practice at any volume — reputation systems don't reset just because you're under the line, and building the habit early avoids a scramble later.

### Is `p=none` on DMARC good enough long-term?

No. It's an acceptable starting point for collecting reports without risking delivery, but Google and Yahoo expect active progression toward `p=quarantine` or `p=reject`. Sitting at `p=none` indefinitely in 2026 reads as an unfinished setup, not a deliberate choice.

### How fast do I need to honor an unsubscribe request?

Within two days, per the one-click unsubscribe requirement. The link also can't force a login — if a recipient has to sign in to opt out, that's a compliance gap, not just a UX one.

### What's the fastest way to know if I've crossed the 0.3% complaint threshold?

Google Postmaster Tools shows domain-level spam-rate data directly from Gmail. Don't wait for a delivery drop to check it — by the time volume falls off, you're often already past the seven-day recovery window before you've even started the clock.
