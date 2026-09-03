---
title: "How to Opt Out of Data Brokers"
slug: "opt-out-data-brokers-privacy-2026"
translationKey: "delete-data-broker-opt-out-2026"
locale: "en"
excerpt: "Short answer: your data is already sold. Opting out of data brokers isn't a one-time setting — it's ongoing cleanup you need to repeat every few months."
category: "technology"
tags: ["privacy", "best-practices", "automation", "smart-home"]
publishedAt: "2026-09-03"
seoTitle: "How to Opt Out of Data Brokers (September 2026)"
seoDescription: "As of September 2026: manual data broker opt-outs, paid removal services, GDPR erasure rights, and California's DROP platform, plus a quarterly checklist."
---

Short answer: there's no single opt-out button. You have to submit manual removal forms to each major broker one at a time, invoke your GDPR erasure right if you're in the EU/EEA, or file one bulk deletion request through a state system like California's DROP — and none of it sticks permanently. Brokers keep re-buying data, so listings reappearing within a few months is normal, which means privacy here isn't a setting you flip once. It's a maintenance task you repeat.

## What Is a Data Broker, and How Does It Profile You?

A data broker is a company that collects information about you without asking your permission directly, then sells it to third parties. Sources vary: public records like property deeds and court filings, purchase history sold by loyalty programs, location and advertising-ID data pulled from mobile apps, and profile details scraped from social media.

Each piece looks harmless on its own, but combined they form a file with your name, address, phone number, close relatives, estimated income, and habits. People-search sites like Spokeo, Whitepages, and BeenVerified sell that file directly to anyone who searches your name; larger brokers like Acxiom and LexisNexis sell the same underlying data wholesale to advertisers, insurers, and background-check firms. As of January 2026, California's data broker registry — which only covers brokers registered in that one state — listed 545 registered companies.

## How Do You Manually Opt Out of Major Brokers?

Every broker runs its own form, its own identity-verification step, and its own turnaround time, but removing yourself from the roughly 10 most-visited sites eliminates most of your exposure, since a handful of the same sites dominate the top of most name searches. The workflow: search your full name in quotes plus your city on Google, then try variations with a maiden name, past addresses, and old phone numbers; list every site that surfaces, then find each one's "opt out" or "remove my information" page individually.

| Broker | Opt-out method | Typical turnaround |
| --- | --- | --- |
| Whitepages | Form + phone verification code | 1–3 days |
| Spokeo | Email confirmation link | A few days–2 weeks |
| BeenVerified | Form, sometimes requests ID upload | 1–2 weeks |
| MyLife | Form + may require a phone call | 2–4 weeks |
| Acxiom | Web form (bulk data processor, no individual profile page) | Not specified, often several weeks |

Turnarounds vary by broker and request volume, so treat these as rough ranges rather than guarantees. Logging the email address and date you used for each form makes it much faster to answer "did I already submit this one?" three months from now.

## Are Paid Removal Services Like Incogni or DeleteMe Worth It?

Short answer: worth it if your time is genuinely scarce, but not a magic fix. Services like Incogni, DeleteMe, and Kanary charge $5–$25 a month to automatically file opt-out requests with hundreds of brokers and periodically re-scan for your data reappearing — handing off the repetitive part of the job.

[Their limits are real](https://innovation.consumerreports.org/new-report-data-defense-evaluating-people-search-site-removal-services/): none of them can scrub your social media profiles, content you posted yourself, or niche and regional brokers outside their coverage list. "I paid, so I'm invisible now" is not a realistic expectation — think of these services as an automation layer scanning a list of roughly 100–200 brokers, not a complete erasure. My take: if you have time to manually clear the top 10 sites yourself, skip the subscription; if you know you'll never get around to the recurring follow-up, the monthly fee buys real automation you'd otherwise skip entirely.

## How Does GDPR's Right to Erasure Apply to Data Brokers?

[Article 17 of the GDPR](https://gdpr-info.eu/art-17-gdpr/) gives anyone living in the EU/EEA the right to request deletion of their personal data, and organizations must respond within one month. This right applies to data brokers directly — a broker can't refuse the request unless it can point to a legal obligation, like a tax record requirement, that justifies keeping the data.

Article 19 adds a critical piece: if a company shared your data with a data broker, your erasure request obligates that company to notify the broker too, unless doing so would take disproportionate effort. So filing a deletion request with a retailer can cascade to the brokers that retailer sold your data to. The maximum fine for GDPR non-compliance is €20 million or 4% of global annual revenue, whichever is higher. Putting your request in writing creates a paper trail you can escalate to your national data protection authority once the one-month window passes.

## What Do US State Privacy Laws Actually Give You Against Data Brokers?

Under CCPA/CPRA, California residents can request deletion and opt out of sale from any company, not just brokers — but doing that manually against hundreds of companies was never practical. California's Delete Act addressed that gap: [DROP (the Delete Request and Opt-Out Platform)](https://cppa.ca.gov/regulations/drop.html) launched January 1, 2026, letting residents file one free request that's automatically routed to every broker registered in the state.

Brokers' obligation to actually act on those requests starts August 1, 2026, and they must check and apply them at least every 45 days; noncompliance carries a penalty of $200 per request per day. Vermont has a similar broker-registration law, expanded by amendments signed in June 2026, but as of September 2026 Vermont has no centralized deletion platform equivalent to California's DROP — residents there still have to file broker by broker. Which rights you actually have depends heavily on which state you live in.

## How Do You Lock Down the Upstream Sources?

Cleaning out brokers without closing the upstream sources is like mopping a floor with the faucet still running. Three sources matter most: opt out of public-record address disclosure where your state allows it (voter registration, property records), decline third-party data sharing when you sign up for loyalty programs (grocery cards, airline miles), and disable or periodically reset your device's advertising ID (iOS's "Limit Ad Tracking," Android's "Delete Advertising ID").

Smart home devices feed this same pipeline — manufacturers routinely share usage data with third-party analytics and ad partners, a topic we cover in more depth in our [Matter and smart home interoperability guide](/en/posts/smart-home-2026-matter-interoperability). Collecting your own site's visitor data through cookieless tools follows the same logic of minimizing upstream exposure; we compared the options in our [GA4 alternatives roundup](/en/posts/ga4-alternatives-privacy-analytics-2026).

## Why Do Removed Listings Come Back, and How Often Should You Recheck?

Brokers don't buy your data once and store it forever — they continuously re-scan public records, credit applications, and new loyalty-program signups. That means a Whitepages profile you removed today can reappear from a different source six months later. That's not a bug in the removal process; it's the natural result of the business model.

The practical fix is a recurring quarterly check: search your name again, recheck the sites from your last pass, add any newly surfaced site to your list, and if you're using a paid service, review its "found again" alerts. It's worth auditing how AI assistants store your chat and memory data on the same quarterly rhythm — we cover that separate angle in [protecting your privacy in the age of AI assistants](/en/posts/protect-privacy-ai-assistants).

## Quarterly Privacy Cleanup Checklist

```text
Every three months:
1. Search your name in quotes + city on Google, note any newly listed site.
2. Recheck the ~10 sites you previously opted out of.
3. Review loyalty program and app permissions, disable unnecessary
   third-party data sharing.
4. Reset or limit your phone's advertising ID.
5. If you're in California, check request status on DROP; if you're in
   the EU/EEA, follow up on any unanswered GDPR erasure requests.
6. If you use a paid removal service, review its "found again" alerts.
```

Running this once a quarter takes a few minutes per broker and catches new leaks before they compound. For more privacy and security coverage, browse our [technology category](/en/category/technology).

## Frequently Asked Questions

### Is opting out of data brokers permanent?

No. Brokers continuously re-collect data from public records, loyalty programs, and new data purchases, so a profile you had removed can reappear from a different source within a few months. Getting a lasting result requires a recurring quarterly check, not a one-time removal pass.

### Is it worth paying for a data removal service?

Yes, if your time is limited: services like Incogni and DeleteMe charge $5–$25 a month to automatically file requests with hundreds of brokers and monitor for reappearance. But they can't reach niche brokers outside their coverage list or scrub your social media profiles, so treat any service promising 100% invisibility with skepticism.

### Does GDPR cover data brokers?

Yes. Article 17 of the GDPR gives anyone in the EU/EEA the right to request deletion of their personal data, and that right applies to data brokers directly — companies must respond within one month. Article 19 also requires notifying any third-party broker the data was shared with.

### How does California's DROP system work?

DROP (the Delete Request and Opt-Out Platform) launched January 1, 2026, and lets you file one free deletion request that's automatically routed to every data broker registered in California. Brokers' obligation to process those requests began August 1, 2026, and they must check and apply them at least every 45 days.
