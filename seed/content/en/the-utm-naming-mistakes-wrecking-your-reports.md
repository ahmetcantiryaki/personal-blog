---
title: "The UTM Naming Mistakes Wrecking Your Reports"
slug: "the-utm-naming-mistakes-wrecking-your-reports"
translationKey: "utm-campaign-naming-system"
locale: "en"
excerpt: "Short answer: GA4 treats utm_source=Email and utm_source=email as different values, so inconsistent capitalization silently splits one channel into three rows."
category: "digital-marketing"
tags: ["marketing-analytics", "best-practices", "paid-advertising"]
publishedAt: "2026-10-27"
seoTitle: "UTM Naming Mistakes Wrecking Your Reports (and the Fix)"
seoDescription: "Why case sensitivity and missing governance in GA4 UTM tagging fragment your reports, and the lowercase, documented taxonomy that actually fixes it for good."
---

Short answer: Google Analytics 4 reads UTM parameter values as case-sensitive — `utm_source=email`, `utm_source=Email`, and `utm_source=EMAIL` are recorded as three separate sources, and one channel's performance ends up split across three rows in your report. The fix is a documented UTM standard that's always lowercase and draws from a controlled vocabulary.

## Why do UTM parameters silently wreck a report?

Google's own help documentation uses `utm_source=google` versus `utm_source=Google` as its example of two distinct values — that's not a typo, it's how GA4 is designed to work. If three people on a marketing team each tag the same email campaign and one writes `Email`, one writes `email`, and one writes `E-Mail`, GA4 records three separate sources, and channel grouping refuses to merge them back together. The result: your "Email" channel's reported performance looks far weaker than it actually is, because a third of its traffic is hiding in a different row.

The parameter name itself is also sensitive to spelling and case: `utm-source` (with a hyphen) or `UTM_Source` (capitalized) isn't recognized by GA4 at all — the whole parameter gets ignored, and that traffic gets tagged "(not set)." That's not one row affected; it's everyone who clicked that link losing their source entirely.

## Which of the five UTM parameters actually matter?

GA4 documentation names `utm_source`, `utm_medium`, and `utm_campaign` as the three parameters you should always use; the other six (`utm_term`, `utm_content`, and so on) are optional and exist for finer-grained segmentation. `utm_medium` matters most, because GA4's default channel grouping relies heavily on this one field: `utm_medium=email` always maps to the "Email" channel, `utm_medium=cpc` always maps to "Paid Search." A case mismatch in this single field doesn't just break your campaign report — it breaks your top-level channel report too.

| Parameter | Required | What it's for |
|---|---|---|
| `utm_source` | Yes | The platform traffic comes from (e.g., `google`, `newsletter`) |
| `utm_medium` | Yes | The marketing medium (e.g., `email`, `cpc`, `social`) — drives channel grouping |
| `utm_campaign` | Yes | The specific campaign name (e.g., `nov-sale-2026`) |
| `utm_term` | No | Paid search keyword |
| `utm_content` | No | Distinguishes different creative or CTA on the same link |

## What is a controlled vocabulary, and how do you set one up?

A controlled vocabulary is a fixed, pre-approved list of allowed values per parameter — for example, allowing only `email`, `cpc`, `social`, `display`, `referral`, and `organic` for `utm_medium`, and rejecting any other variation (like `e-mail` or `paid-social`). Keep this list in a shared spreadsheet and require every new campaign link to pull its value from that list — free-text entry eventually produces inconsistency, it's just a matter of time.

```text
utm_source controlled list: google, newsletter, linkedin, twitter, partner-x
utm_medium controlled list: cpc, email, social, display, referral, affiliate
utm_campaign format: {year}-{month}-{campaign-name} (e.g., 2026-11-blackfriday)
```

## Why do you need a shared URL builder plus a registry spreadsheet?

Letting every marketer type their own link by hand eventually produces a typo or a capitalization mismatch. Instead, use a simple UTM builder (a form or a basic spreadsheet template) that presents the controlled vocabulary as a dropdown, and log every generated link — who created it and which campaign it belongs to — in a central registry. That registry becomes your single source of truth when you need to answer "who created this link" six months from now.

## Who should own UTM governance, and how do new values get added?

One person or a small team — usually marketing ops or whoever owns analytics — should be the sole owner of the controlled vocabulary; when someone needs a new source or campaign type added, the request goes to that owner, who updates the list and notifies the team. Letting everyone add their own values defeats the entire point of a controlled vocabulary — it just reproduces the same mess you were trying to prevent.

## Does Google Ads auto-tagging conflict with my own UTMs?

It can, and this is one of the most common UTM mistakes: Google Ads, on a linked GA4 account, uses its own auto-tagging by default (via the `gclid` parameter), which automatically classifies traffic as "Paid Search" / "google / cpc." If someone manually adds `utm_source` and `utm_medium` to that same link, GA4 can behave inconsistently about which signal takes priority, and some campaigns end up misclassified. The practical rule: trust auto-tagging when the Google Ads link is active, and don't manually add UTMs to Google Ads links unless you need extra context auto-tagging doesn't capture — the one case where manual tagging is worth it is distinguishing two different creatives in the same ad group with `utm_content`.

A similar conflict shows up in social ad platforms: when a platform's own click-tracking parameter sits on the same link as a manually added UTM, don't assume which one GA4 prioritizes without testing it. Before rolling UTMs out on a new ad channel, send a small test budget through the tagged links and confirm the source/medium actually shows up in GA4 the way you expect — that's far cheaper than discovering an entire campaign was mistagged after the budget is spent.

## Why does auto-lowercasing at ingestion actually work?

Adding a step to your link-generation process that automatically lowercases UTM parameter values removes human error from the system entirely. You can implement this as a form validation rule, a Google Apps Script, or a pre-processing step in a link shortener — what matters is that the value gets standardized before it ever reaches GA4. Applying the same auto-lowercasing step when tagging [landing-page variants you draft with Claude](/en/posts/draft-landing-page-variants-to-ab-test-with-claude) keeps your A/B test reports from splitting the same way.

## How do you clean up messy historical data without losing attribution?

You can't retroactively fix historical raw data inside the GA4 interface, but if that raw data is exported to BigQuery, you can apply a mapping table (`Email` → `email`, `E-Mail` → `email`) at the reporting layer — in Looker Studio or a custom dashboard — to merge those values back together. That merge isn't possible in the raw GA4 UI because the values are already stored as separate dimensions, which means accounts without a BigQuery export stay permanently fragmented for historical data — the real win comes from keeping everything clean going forward.

My own observation: most teams push UTM governance off as a "we'll deal with it later" problem, but once data has already split into three pieces, retroactively fixing it costs far more than enforcing a standard up front would have. The cheapest moment to fix this is the moment before you create your very first link.

## Frequently Asked Questions

### Are UTM parameter values case-sensitive in GA4?

Yes. Google's own documentation uses `utm_source=google` versus `utm_source=Google` as its example of two distinct values. This isn't a bug — it's a design decision in GA4, and inconsistent use splits one channel across multiple rows.

### Which UTM parameters should I always use?

Google names `utm_source`, `utm_medium`, and `utm_campaign` as the three parameters you should always use. The other six, including `utm_term` and `utm_content`, are optional and exist for finer-grained segmentation.

### Why does the utm_medium field matter so much?

Because GA4's default channel grouping relies heavily on it — `utm_medium=email` always maps to the Email channel, and `cpc` always maps to Paid Search. A case mismatch in this field breaks your top-level channel report, not just a single campaign report.

### Can I fix inconsistent historical UTM data after the fact?

You can't merge historical raw data retroactively inside the GA4 interface. If that data is exported to BigQuery, you can apply a mapping table at the reporting layer; without a BigQuery export, historical data stays permanently fragmented.
