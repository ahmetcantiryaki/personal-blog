---
title: "First SaaS Metrics: MRR, Churn, and CAC"
slug: "first-saas-metrics-mrr-churn-cac"
translationKey: "saas-metrics-founders-mrr-churn-cac"
locale: "en"
excerpt: "Here's what to track before you have a data team: MRR, churn, and CAC. What each number tells you, and when it should set off alarms, with examples."
category: "business"
tags: ["productivity", "cost-optimization", "ai-tools"]
publishedAt: "2026-08-02"
seoTitle: "First SaaS Metrics for Founders: MRR, Churn, CAC"
seoDescription: "Here's what to track before you have a data team: MRR, churn, and CAC. What each number tells you, and when it should set off alarms, with examples."
---

You shipped your first SaaS product, a handful of customers are paying, and now you need to answer "are we growing or not." You don't have a data team, and you don't need a fancy BI tool — you just need to read a few numbers correctly. Here's what an early-stage founder actually needs to track, and when each one should set off alarms.

## MRR and ARR: Net or Gross Retention

Monthly recurring revenue (MRR) and its annual counterpart (ARR) are your baseline growth signal. But the total MRR figure alone can mislead — what matters is how it got assembled. New-customer revenue, upgrades, downgrades, and lost customers all need separate tracking. Gross revenue retention counts only losses and downgrades, while net revenue retention (NRR) also folds in upgrades — and NRR is the one that actually matters.

Per 2026 data, SaaS companies with high NRR grow 2.5x faster than their low-NRR counterparts; the top quartile at 110%+ NRR grows 2.3x faster than peers in the 95–100% range. Bootstrapped SaaS companies in the $3M–$20M ARR range see a median NRR around 103%, with top performers reaching 117.9%. That gap isn't a coincidence: growth driven by high NRR is cheaper, more predictable, and more sustainable, because expansion from existing customers costs far less than acquiring new ones.

## Logo Churn vs. Revenue Churn

Measuring churn with a single number is a common mistake. You need to separate two distinct kinds:

- **Logo churn:** How many customers canceled (a headcount).
- **Revenue churn:** What share of your total revenue those canceling customers represented.

A small customer canceling raises your logo churn while your revenue churn stays low; lose one big enterprise account and it can be the reverse. Tracking both lets you answer "how many customers are we losing" and "how much revenue are we losing" as separate questions. Churn compounds far faster than founders expect: 5% monthly churn sounds small, but by year's end it can erode more than half your customer base.

Here's a concrete example: at a 100-customer SaaS, 5% monthly logo churn compounds to roughly 46% annual customer loss — meaning that with zero new customers, you'd be down to about 54 customers a year later. That's the point where founders who dismiss "5% monthly is small" get the biggest surprise; you have to read churn through its annual compounding effect, not its monthly face value. That's why, at most early-stage SaaS companies, cutting churn is a higher-return investment than acquiring new customers.

## CAC, Payback Period, and LTV/CAC

Customer acquisition cost (CAC) is your marketing and sales spend divided by the number of new customers it bought. But CAC alone tells you little; the metric that actually matters is the CAC payback period — how many months it takes the gross profit from that customer to cover their CAC.

| Metric | Healthy Threshold | 2026 Median |
| --- | --- | --- |
| CAC payback (overall) | 12 months or under | 15–16 months |
| CAC payback (bootstrapped) | 6 months or under | ~4.8 months |
| CAC payback (top quartile) | 6–8 months | 6–8 months |
| Net revenue retention (NRR) | Above 100% | Enterprise: 118%, broad B2B: 82% |

The widely cited healthy benchmark puts CAC payback at 12 months or under; top-quartile companies bring that down to 6–8 months. Bootstrapped companies see a median around 4.8 months — one reason they can stay less dependent on outside capital. LTV/CAC ratio is customer lifetime value divided by CAC; the common rule of thumb wants this at 3 or above, but early on you rarely have enough reliable data to calculate it — lean on CAC payback period instead at that stage.

## Activation and the "Aha Moment"

A user converting from signup to a loyal, paying customer usually hinges on one single point — the "aha moment" where they first genuinely feel your product's value. Defining that moment (say, "completing the first task" in a project-management tool, or "seeing the first meaningful report" in an analytics tool) and tracking how fast new users reach it is one of the strongest ways to predict churn ahead of time. Compare users who hit the aha moment within 24 hours against those who take a week, and the first group's long-term retention is usually markedly higher — which means shortening time-to-activation is a product decision that directly cuts churn.

## Leading vs. Lagging Indicators

Lagging indicators (MRR, churn) tell you what already happened; leading indicators (activation rate, usage frequency, support-ticket volume) hint at what's coming next month. Keeping one metric of each kind on a simple weekly dashboard — say, "this week's MRR" and "this week's activation rate" — keeps you from getting blindsided by a surprise churn wave.

A simple Python function like this can help you calculate your core metrics in one place:

```python
def cac_payback_months(cac, gross_margin_per_customer_monthly):
    if gross_margin_per_customer_monthly <= 0:
        return float("inf")
    return cac / gross_margin_per_customer_monthly

def net_revenue_retention(start_mrr, expansion, contraction, churned):
    return (start_mrr + expansion - contraction - churned) / start_mrr * 100

# Example: $1,000 CAC, $150/month gross profit per customer
print(cac_payback_months(1000, 150))  # ~6.7 months
```

## A Starter Metrics Sheet

A reasonable minimum to track weekly: total MRR, new MRR, expansion MRR, churned MRR, logo churn rate, activation rate, and CAC payback period. Those seven numbers are enough to see your business's health week to week without a data team. A dedicated metrics dashboard becomes worthwhile once your customer count and data volume make manual tracking unwieldy; until then, a spreadsheet is more than enough for most early-stage founders.

While you're tracking these, it's worth revisiting your pricing decisions too — our piece on [SaaS pricing mistakes](/en/posts/saas-pricing-founder-mistakes) covers the common traps. If you haven't settled on a funding path yet, see our [bootstrap vs VC comparison](/en/posts/bootstrap-or-vc-2026); for landing your early customers, our [first 10 customers as a solo AI founder](/en/posts/first-10-customers-solo-ai-founder) guide is a useful companion. For more entrepreneurship content, follow our [Business section](/en/category/business).

## Frequently Asked Questions

### Should I track MRR or ARR?

MRR is more useful early on because it lets you break out the monthly moving parts (new, expansion, churned). ARR — MRR times 12 — works fine for investor decks and annual planning, but focus on MRR for day-to-day decisions.

### Why does net revenue retention matter more than gross retention?

Net revenue retention accounts for upgrades from existing customers, so it shows your business's real growth engine. NRR above 100% means your revenue grows even if you land zero new customers.

### How do I improve my CAC payback period?

Either lower CAC (more efficient acquisition channels, referral programs) or raise gross profit per customer (revisit pricing, pursue upsell opportunities). Trying both at once usually gets you there fastest.

### How many metrics should I track at once?

Don't go past seven at the start: MRR, new/expansion/churned MRR, logo churn, activation rate, and CAC payback period. Adding more will happen naturally as your data team grows. You don't need a dedicated tool this early either — pulling raw data from Stripe into a spreadsheet and applying the formulas above is usually enough for the first six to twelve months.
