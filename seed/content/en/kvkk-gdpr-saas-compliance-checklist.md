---
title: "KVKK & GDPR: A New SaaS Compliance Checklist"
slug: "kvkk-gdpr-saas-compliance-checklist"
translationKey: "kvkk-gdpr-saas-compliance-checklist-2026"
locale: "en"
excerpt: "A pre-revenue SaaS needs a lawful basis, a privacy policy, and a vendor DPA before its first customer — this is general guidance, not legal advice."
category: "business"
tags: ["compliance", "privacy", "saas", "best-practices"]
publishedAt: "2026-11-20"
seoTitle: "KVKK & GDPR Checklist for a New SaaS (2026)"
seoDescription: "A prioritized KVKK and GDPR checklist for a pre-revenue SaaS: lawful basis, privacy policy, VERBİS registration, data subject rights, and vendor DPAs."
---

A new SaaS needs four things before its first paying customer: a documented lawful basis for processing personal data, a privacy policy, a way to honor access and deletion requests, and signed data-processing agreements with its vendors. Everything else — VERBİS registration, cross-border transfer paperwork, formal records of processing — can usually wait until you have real users and real data flows to document. This is general information, not legal advice; verify specifics against Turkey's KVKK authority (kvkk.gov.tr) and the official GDPR text before you rely on it.

## Do You Need to Register with VERBİS?

Probably not on day one, unless your main activity is processing special-category personal data (health records, biometric data, political or religious affiliation) and you already have 10 or more employees. A Personal Data Protection Board decision published in the Official Gazette around October 1, 2025 exempts data controllers whose main activity involves special-category data from VERBİS registration if their annual employee count stays under 10 — tightening an earlier rule that exempted any controller (not processing special-category data as its main activity) with under 50 employees and under 100 million TRY in annual balance sheet total.

The counting method matters: the Board's December 25, 2025 decision (no. 2025/2393) says that for companies keeping double-entry books, employee count and balance sheet total are evaluated together; for others, only employee count is used, and the threshold has to be exceeded in at least 7 of the last 12 months before the registration obligation kicks in. A pre-revenue SaaS with three founders and no special-category data almost certainly doesn't need to register yet — but confirm your specific case against the current Board decision, not a law firm blog post from before late 2025, since several older summaries online still cite the superseded 50-employee/100-million-TRY threshold as if it applies to everyone.

## What Does GDPR Require Before Your First EU Customer?

You need a documented lawful basis (Article 6) for every category of personal data you collect — consent, contract performance, or legitimate interest are the common ones for a SaaS — and you need it in writing before you collect anything, not after a customer asks. "We'll figure out the legal basis later" is the single most common mistake new SaaS teams make, and it's expensive to retrofit once you have thousands of user records with no documented justification for why you have them.

## What Goes in a Privacy Policy vs. a Processing Record?

A privacy policy is the public-facing document a user reads before signing up; a Record of Processing Activities (ROPA, required under GDPR Article 30 for most controllers and processors) is an internal log of what data you process, why, where it's stored, and how long you keep it. Early-stage teams often publish a privacy policy and stop there — but a ROPA is what you actually need the day a regulator or an enterprise customer's security questionnaire asks "show me your data inventory."

| Document | Who reads it | Required by | When you need it |
|---|---|---|---|
| Privacy policy | Your users, publicly | GDPR Art. 13/14, KVKK Art. 10 | Before first signup |
| Record of Processing Activities (ROPA) | Regulators, auditors, enterprise buyers | GDPR Art. 30 | Before first enterprise deal |
| Data Processing Agreement (DPA) | Your vendors and customers | GDPR Art. 28 | Before sending any data to a vendor |
| VERBİS registration | KVKK authority | KVKK, with 2025 exemption update | Only above the employee/balance thresholds |

## How Do You Handle a Data Subject Request?

Both laws give a person the right to ask what data you hold on them and to have it deleted — GDPR calls these the right of access (Article 15) and the right to erasure (Article 17); KVKK gives equivalent rights under its Article 11. For a pre-revenue SaaS, the practical requirement is just a documented process: a support inbox that routes these requests to someone who can actually query your database and respond within GDPR's one-month default deadline, not a fully automated self-service portal. Build the portal once you have enough users that manual handling becomes a bottleneck, not before.

## What About Your Vendors (Processor Agreements)?

Every vendor that touches personal data on your behalf — your cloud host, your email provider, your analytics tool, your support-ticket system — needs a signed Data Processing Agreement under GDPR Article 28 before you send them a single real user record, not after. Most major vendors (AWS, Google Cloud, Stripe, Intercom) publish a standard DPA you can accept in a dashboard in minutes; the gap is usually smaller or regional vendors that don't have one ready, which is itself a signal worth weighing before you commit to them. If you're choosing an analytics stack with this in mind, a [privacy-first analytics alternative to GA4](/en/posts/ga4-alternatives-privacy-analytics-2026) often comes with a cleaner DPA story than a general-purpose ad-tech platform.

## Can You Transfer Data Outside Turkey or the EU?

This is the part most teams get wrong, and it changed recently. Turkey's KVKK was amended in 2024 (Law No. 7499) to move closer to GDPR's model: cross-border transfers can now rely on a Board adequacy decision for the destination country, a signed undertaking between the parties with Board approval, or binding corporate rules, instead of the older, narrower consent-only approach. GDPR's own transfer rules (Articles 44–49) work similarly, through adequacy decisions, Standard Contractual Clauses, or binding corporate rules. Don't assume your US-based cloud vendor is automatically fine under either law — check the current adequacy list and your vendor's specific transfer mechanism before you store Turkish or EU user data on their infrastructure.

## What's Must-Do-Now vs. Can-Wait for a Pre-Revenue SaaS?

Must-do-now: a written lawful basis per data category, a public privacy policy, signed DPAs with every vendor touching personal data, and a documented (even if manual) process for data subject requests. Can-wait, until you cross the relevant size or risk threshold: VERBİS registration, a formal ROPA beyond a working spreadsheet, and a dedicated data protection officer. If you're validating a [one-person micro-SaaS](/en/posts/validate-one-person-micro-saas), spend your limited hours on the must-do-now list first — it's the part that actually blocks a signed contract with your first customer.

My honest opinion: most early-stage teams over-invest in VERBİS anxiety and under-invest in vendor DPAs, which is backwards — the DPA gap is what an enterprise security review actually catches first.

## Frequently Asked Questions

### Does a small Turkish SaaS need to register with VERBİS?

Usually not, as of the Board's exemption update effective around October 1, 2025: a controller is exempt if its main activity isn't processing special-category data, or if it is but its annual employee count stays under 10. Confirm your specific numbers against the current Board decision rather than an older source, since the pre-2025 50-employee/100-million-TRY threshold no longer applies universally.

### What's the difference between KVKK and GDPR for a SaaS founder?

They cover the same core rights — lawful basis, access, deletion, cross-border transfer limits — but KVKK is Turkey's law enforced by the Personal Data Protection Board, while GDPR is the EU's regulation enforced by national data protection authorities; a SaaS serving both markets generally needs to satisfy both, and KVKK's 2024 amendment (Law No. 7499) brought its transfer rules closer to GDPR's.

### Do I need a Data Processing Agreement with every vendor?

Yes, with every vendor that processes personal data on your behalf — cloud hosting, email delivery, analytics, support tools — under GDPR Article 28; most major vendors publish a standard DPA you accept directly in their dashboard.

### Is this article legal advice?

No. This is general, educational information current as of November 2026. Confirm specific obligations for your company against Turkey's KVKK authority (kvkk.gov.tr), the official GDPR text, or a qualified lawyer before making compliance decisions.
