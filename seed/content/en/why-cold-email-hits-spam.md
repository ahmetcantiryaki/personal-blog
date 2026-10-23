---
title: "Why Does Your Cold Email Hit Spam (and How to Fix It)?"
slug: "why-cold-email-hits-spam"
translationKey: "cold-email-deliverability-2026"
locale: "en"
excerpt: "Short answer: it's almost always one of two things — SPF, DKIM or DMARC isn't aligned, or your complaint rate tops 0.3%. Both fix with a technical checklist."
category: "digital-marketing"
tags: ["email-marketing", "best-practices", "marketing-analytics"]
publishedAt: "2026-10-23"
seoTitle: "Why Cold Email Hits Spam: 2026 Deliverability Fixes"
seoDescription: "SPF, DKIM, DMARC alignment, one-click unsubscribe, and complaint-rate thresholds: why your cold email lands in spam and the checklist that fixes it."
---

Short answer: your cold email is almost certainly landing in spam for one of two reasons — one of your SPF, DKIM, or DMARC records isn't aligned, or your spam complaint rate is above Gmail's 0.3% threshold. Neither is a copywriting problem; both get fixed with a technical checklist.

## What are SPF, DKIM, and DMARC, and why do you need them?

These three records prove to the receiving server that an email genuinely came from your domain. SPF lists which servers are allowed to send mail on your domain's behalf; DKIM attaches a cryptographic signature to the email to prevent tampering; DMARC decides what happens when SPF and DKIM don't both pass in alignment. For accounts sending more than 5,000 emails a day, [Google's bulk sender guidelines](https://support.google.com/mail/answer/81126) are explicit: both SPF and DKIM must pass, and you need a DMARC record published at least at `p=none`. Miss any of the three, and your email either lands in spam or never reaches the receiving server at all. This isn't just a rule for big marketing lists, either — a small cold-email campaign well under the 5,000 threshold can still land in spam without these same three checks in place, because Gmail's filtering looks at this signal regardless of volume.

```text
; Example DMARC DNS record (p=none, minimum monitoring level)
_dmarc.yourdomain.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com"
```

## Is one-click unsubscribe actually required?

Yes, for marketing email; transactional email (like order confirmations) is exempt. One-click unsubscribe, based on [RFC 8058](https://www.rfc-editor.org/rfc/rfc8058), requires a link embedded in the email's header — a mechanism that works without the recipient even opening the email body. Senders are expected to process unsubscribe requests within roughly two days; dragging that out indirectly raises your complaint rate, because the recipient hits "report spam" instead of waiting on the unsubscribe link. This matters more in cold email specifically, since the recipient has never heard from you before — if the unsubscribe link isn't visible and easy, their reaction tends to skip straight to a complaint rather than an opt-out.

## What complaint rate should you actually aim for?

Gmail's official threshold is 0.3% — if more than 3 out of every 1,000 emails you send get marked "spam," your account hits bulk-sender restrictions. Deliverability specialists don't treat that threshold as safe, though: the practical target is 0.1%, and some sources recommend 0.08% as the genuinely safe line. That gap matters — sitting right at the official threshold means a small shift in Gmail's filtering can push you into restricted territory overnight.

| Metric | Gmail's threshold | Safe target |
| --- | --- | --- |
| Complaint rate | 0.3% (restricted above this) | 0.1% (some sources say 0.08%) |
| SPF + DKIM | Both must pass | Both must pass |
| DMARC record | At least `p=none` | `p=quarantine` or `p=reject` (stronger) |
| One-click unsubscribe | Required for marketing email | Honored within ~2 days of request |

## How do you warm up a new domain?

If you're sending from a new domain or a new sending IP, blasting 5,000 emails on day one almost guarantees your complaint rate spikes. The practical warmup path: start with 20-50 emails a day in the first week, roughly double volume every 3-4 days as long as reply rate and complaint rate stay stable, and reach your target volume over 4-6 weeks. When you fold this into an [AI-assisted email marketing workflow](/en/posts/email-marketing-with-chatgpt-and-gemini), the thing to watch is that automation doesn't skip the warmup ramp — the model doesn't scale volume for you; you still control the pace by hand.

## Why isn't list hygiene enough on its own?

Sending to a verified, active list lowers your complaint rate, but you can still land in spam without SPF/DKIM/DMARC alignment — list quality and authentication are two separate layers, and neither substitutes for the other. Our [email deliverability checklist](/en/posts/email-deliverability-checklist) covers both layers together in more detail; what's specific to cold email is that the recipient has never heard from you before, which makes your open rate far more dependent on copy quality than it is for a list that already opted in. There's a separate wrinkle worth watching on the reading side, too: as we covered in [why AI might be the first reader of your email](/en/posts/email-first-reader-is-ai), some corporate inboxes now have an AI assistant scan incoming mail before a human ever sees it, which makes your subject line and opening sentence matter even more than before.

## How should you ramp up sending volume?

Complaint rate isn't the only metric to watch while scaling volume — a sudden drop in open rate is a warning sign too. If open rate falls more than 3 points in a week, pausing the volume ramp to review the previous week's list and copy is safer than pushing forward blind. Some deliverability vendors report that since November 2025, Gmail outright rejects non-compliant mail with a 550 error instead of deferring it; we couldn't confirm that specific claim against Google's own documentation, but the practical outcome is the same either way — staying under the threshold now leaves less margin for error than it used to.

Here's the thing: the most common misconception here is treating deliverability as a copywriting problem. Copy quality does affect open rate, sure — but the decision to land in spam is made mostly by your DNS records and your complaint rate. Even the best-written cold email never reaches the inbox behind an unaligned DMARC record.

## Frequently Asked Questions

### Why does my cold email keep landing in spam?

The two most common causes are a missing or misaligned SPF, DKIM, or DMARC record, and a spam complaint rate above Gmail's 0.3% threshold. You fix both by checking your DNS records and reviewing your sending volume and list quality.

### Can I send cold email without a DMARC record?

Technically yes, but if you're sending more than 5,000 emails a day, Gmail and Yahoo no longer accept it — a DMARC record at least at `p=none` is now effectively required. Senders without one fall into bulk-sender restrictions.

### What spam complaint rate should I target?

Gmail's official threshold is 0.3%, but sitting at that line is risky. Deliverability specialists recommend targeting 0.1%, with some suggesting 0.08% as the genuinely safe target, since staying close to the official limit leaves no margin for a bad week.

### How do I start sending cold email from a brand-new domain?

Start with 20-50 emails a day in the first week, then roughly double your volume every 3-4 days as long as your complaint rate and reply rate stay stable, reaching your target volume over 4-6 weeks. Sending high volume from day one is the fastest way to spike your complaint rate.
