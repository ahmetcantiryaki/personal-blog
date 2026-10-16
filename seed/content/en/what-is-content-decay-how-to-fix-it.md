---
title: "What Is Content Decay, and How Do You Fix It?"
slug: "what-is-content-decay-how-to-fix-it"
translationKey: "content-decay-fix-declining-pages-2026"
locale: "en"
excerpt: "Content decay is a sustained drop in clicks, rankings, or CTR on a page that once performed well. Find it with 90-day Search Console comparisons."
category: "digital-marketing"
tags: ["seo", "marketing-analytics", "best-practices"]
publishedAt: "2026-10-16"
seoTitle: "What Is Content Decay, and How Do You Fix It?"
seoDescription: "Content decay is a sustained drop in clicks, rankings, or CTR on a page that once performed well. Find it with 90-day Search Console comparisons."
---

Short answer: content decay is a sustained drop in organic clicks, rankings, or click-through rate on a page that used to perform well, usually because the information went stale, a competitor published something better, or search intent shifted. You find it by comparing 90-day windows in Search Console, then you either refresh it, merge it with a competing page, or retire it — not all three at once.

## What exactly is content decay?

Content decay is the gradual loss of organic traffic on a page that once ranked and converted, distinct from a page that never performed in the first place. It shows up as three overlapping signals: falling clicks, a dropping average position for the page's core query, and a shrinking click-through rate even while impressions hold steady — that last pattern usually means the title and meta description now look dated next to newer competing results, not that the page vanished from the index.

Several SEO guides point to AI Overviews and shifting search intent as accelerants in 2026: one industry report cites a median 10% year-over-year organic traffic decline for publishers in the first half of 2025, which means decay is now partly a function of how search results are displayed, not just how good your content is.

## How do you actually find decaying pages?

Compare two 90-day windows in Google Search Console — the trailing 90 days against the 90 days before that — filtered to your top-trafficked pages, and flag anything with a sustained drop rather than a one-week dip. Ahrefs' Top Pages report offers a faster filter: set the date range to 12 months, filter for "Declining" traffic, and sort by the largest negative change.

A practical threshold used by several SEO teams: flag a page if it's older than six months and shows any two of the following — a traffic drop over 20%, a core-keyword ranking drop of more than five positions, or a CTR drop over 15%. That's a heuristic, not an official Google standard, but it keeps you from chasing normal week-to-week noise.

| Signal | What it suggests |
|---|---|
| Clicks down, position stable | Demand for the query itself is shrinking |
| Position down, clicks down | A competitor is outranking you, or content is stale |
| Impressions stable, CTR down | Title/meta description look dated vs. newer results |
| Clicks down across many related pages | Possible cannibalization between your own pages |

## Should you refresh, merge, or delete a decaying page?

Refresh when the page still targets a keyword you want to own and the content is simply outdated — old statistics, dead links, a screenshot from two product versions ago. Merge when two or more of your own pages compete for the same or overlapping keywords, since Ahrefs' guidance is direct on this: publishing near-duplicate articles splits authority between them instead of combining it into one stronger page. Retire — redirect or remove — a page that no longer fits your current strategy or targets a topic you've abandoned; recovering it isn't worth the effort a refresh would take.

## What does a refresh actually involve, beyond updating the date?

A refresh starts by re-verifying every statistic and claim in the piece against its current, live source — not just changing the "last updated" date, which search engines and readers both see through quickly. After that: replace dead links, update screenshots and product references, and add genuinely new coverage the original version was missing, rather than padding the word count. Give the refresh four to six weeks before judging the result, then check Search Console clicks and average position for the page's core query specifically, not site-wide traffic.

```text
Content decay triage
1. Pull 90-day vs. prior-90-day Search Console comparison
2. Flag pages older than 6 months with 2+ of:
   - clicks down >20%
   - core keyword position down >5
   - CTR down >15%
3. For each flagged page, decide:
   REFRESH -> still-relevant topic, stale facts/links
   MERGE   -> overlaps another page targeting the same keyword
   RETIRE  -> topic no longer fits strategy
4. Re-check 4-6 weeks after refresh, not before
```

## How often should you run this check?

Run it quarterly rather than reactively. A quarterly cadence catches decay early enough to fix it with a refresh, before the gap between your page and a newer competing result grows wide enough that a refresh alone won't close it. Waiting for a dramatic traffic drop to notice decay usually means you're already a full content cycle behind whoever outranked you.

## What's the honest risk of over-refreshing?

Refreshing pages too aggressively, or refreshing a page that's declining simply because its query's search volume is shrinking, wastes effort that won't move the metric you're chasing. Before committing to a refresh, check whether impressions for the target query are also falling — if the whole market for that search term is shrinking, no amount of content work recovers the lost clicks, and that page is a retire-or-ignore candidate, not a refresh candidate.

## Frequently Asked Questions

### What is content decay in SEO?

Content decay is a sustained drop in organic clicks, search rankings, or click-through rate on a page that previously performed well, typically caused by outdated information, a competitor publishing stronger content, or a shift in how search engines display results for that query.

### How do I find which pages on my site are decaying?

Compare a trailing 90-day window against the prior 90 days in Google Search Console for your top pages, or use a tool like Ahrefs' Top Pages report filtered to "Declining" traffic over a 12-month range. Flag pages older than six months showing a traffic drop over 20%, a ranking drop of more than five positions, or a CTR drop over 15%.

### Should I refresh every page that's losing traffic?

No. Refresh pages where the topic is still relevant but the content is outdated. Merge pages that compete with each other for the same keyword instead of refreshing both separately, and retire pages whose topic no longer fits your strategy — refreshing those wastes effort a redirect or removal would save.

### How long after refreshing a page should I check if it worked?

Wait four to six weeks before judging a refresh, since search engines need time to recrawl and reassess the page. Check Search Console clicks and average position specifically for the page's core target query, not your site's overall traffic, which can mask a single page's real change.

For related SEO reading, see our guides on [schema markup for AI search visibility](/en/posts/schema-markup-ai-search-visibility), [programmatic SEO for small sites, done right](/en/posts/programmatic-seo-small-sites), and [AI Overviews are eating clicks: a survival plan](/en/posts/ai-overviews-eating-clicks-survival). Browse more in our [Digital Marketing & SEO category](/en/category/digital-marketing).

Sources: [Priority Pixels on content decay in 2026](https://prioritypixels.co.uk/insights/content-decay-why-your-best-pages-are-losing-traffic/), [eesel.ai's practical guide to reducing content decay](https://www.eesel.ai/blog/how-to-reduce-content-decay), and [Ahrefs on content cannibalization and refresh strategy](https://ahrefs.com/blog?p=195958).
