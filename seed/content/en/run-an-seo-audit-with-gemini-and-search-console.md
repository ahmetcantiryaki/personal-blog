---
title: "Run an SEO Audit with Gemini and Search Console"
slug: "run-an-seo-audit-with-gemini-and-search-console"
translationKey: "seo-audit-gemini-search-console-2026"
locale: "en"
excerpt: "Short answer: export Search Console data to Sheets, have Gemini flag decaying pages and striking-distance keywords in positions 8-20, then verify it."
category: "digital-marketing"
tags: ["gemini", "seo", "marketing-analytics", "automation"]
publishedAt: "2026-11-06"
seoTitle: "SEO Audit with Gemini and Search Console (2026)"
seoDescription: "How to export Search Console data to Sheets and use Gemini to find decaying pages, striking-distance keywords, and low-CTR titles — as a monthly routine."
---

Short answer: export the Search Console Performance report to Sheets with query, page, clicks, impressions, and position as columns, then ask Gemini to flag pages with high impressions but falling clicks, "striking-distance" keywords sitting in positions 8-20, and pages competing against each other for the same query (cannibalization). Verify every suggested title rewrite against the raw numbers before you publish it.

## How Do You Export Search Console Data to Sheets?

Pick a date range in the Performance view, click Export, and choose Google Sheets — this pulls queries, pages, countries, devices, and search appearance (rich results) as separate dimensions into the same file. A manual export caps out around 1,000 rows, so a large site needs the BigQuery bulk export for an accurate table, but for a small-to-mid blog the Sheets export is enough for a monthly audit. Once the data lands in Sheets, Gemini works inside that same file, so there's no copying data between tools.

## How Does Gemini Find Decaying Pages?

A plain-language prompt is enough: "compare the last 90 days to the 90 days before that, and list the 15 pages with the biggest click drop." Gemini turns that into a Sheets formula, or for harder comparisons writes and runs its own code behind the scenes. This is exactly what [content decay](/en/posts/what-is-content-decay-how-to-fix-it) describes — a page losing position over time as competitors or freshness shift — and having Gemini write the formula turns a manual scan into a few minutes of work.

## What Are Striking-Distance Keywords in Positions 8-20?

Queries sitting between position 8 and 20 are ones a page already ranks for but not high enough to earn clicks — they're the band most likely to jump up with an on-page edit (title, opening paragraph, internal link) rather than a whole new piece of content. Asking Gemini to "sort queries with position 8-20 and impressions over 30" surfaces that list in seconds, and it points straight at the fastest traffic to win without writing anything new.

| Signal | What it means | Gemini prompt |
|---|---|---|
| High impressions, low CTR | Title/meta answers the query poorly | "List queries with CTR under 1% and impressions over 50" |
| Position 8-20 | On-page edit could lift it quickly | "Sort queries with position between 8 and 20" |
| 2+ pages ranking for one query | Cannibalization — pages compete with each other | "Group URLs that rank for the same query" |
| Click drop over 90 days | Content decay | "Compare last 90 days to the prior 90, sort by biggest click drop" |

## What Do You Do Once You Hit the 1,000-Row Limit?

A manual Sheets export caps out around 1,000 rows, which hides real data for any site with more than about 5,000 monthly queries — the rows that get cut first are usually the long-tail, low-volume queries that add up to real traffic in aggregate. The fix is switching to Search Console's BigQuery bulk export, but it comes with a catch: that export has no ready-made "average position" column, so you calculate it yourself with `SUM(sum_top_position)/SUM(impressions) + 1`, since the raw stored value is zero-based. Also note that `data_date` is recorded in Pacific time, and anonymized low-volume queries don't come through as readable text — if you don't explain that distinction to Gemini, it can misread "data withheld" as "zero traffic."

## How Much Should You Trust Gemini's Suggestions?

Don't approve a suggested title or meta description without seeing the raw rows the suggestion is based on — a model can read a trend into data that isn't really there, or flag a low-volume, statistically meaningless query as an "opportunity." The practical check: whenever Gemini flags a page as a priority, read that page's actual 90-day impressions and clicks yourself once more; if the number is small (say, 20 impressions), that "opportunity" might just be noise.

## How Do You Fix Cannibalization Once You Find It?

When Gemini flags two or more of your pages ranking for the same query, the fix usually comes down to one of three options: 301-redirect the weaker page into the stronger one, merge both into a single more thorough page, or confirm the pages genuinely serve different intents and sharpen each title to match that intent. Before picking an option, check both pages' last 90 days of clicks and position — if both are underperforming, merging usually wins; if one is already doing well, keeping that page and redirecting the weaker one is the safer call.

## How Do You Turn This into a Monthly Routine?

Set up a fixed Sheets template that repeats the same export, runs the same Gemini prompts, and compares the new list to last month's on the same day every month — a month-over-month comparable table, instead of a one-off audit, is what actually lets you see which fixes worked. Marking fixed pages in a separate tab with "fixed, date X" means you can answer "did that change actually work" three months later without digging through raw data again. This routine lines up directly with the data behind why the position 8-12 band matters as [AI summaries eat clicks on search results pages](/en/posts/ai-overviews-eating-clicks-survival); pairing the same striking-distance logic with the attribution framework in [measuring the search traffic decline](/en/posts/marketing-attribution-search-decline) helps separate which drops come from AI summaries and which come from an actual content problem.

My take: use Gemini here as a fast data analyst, not an SEO strategist — you decide which question to ask, you interpret the answer, and all the model is really doing is turning an hours-long Sheets formula into minutes.

## Frequently Asked Questions

### How do I export Search Console data to Sheets?

Pick a date range in the Performance view, click Export, and choose Google Sheets — this exports query, page, clicks, impressions, CTR, and position columns. A manual export caps out around 1,000 rows; larger sites need the BigQuery bulk export instead.

### How does Gemini detect decaying pages?

A plain-language prompt like "compare the last 90 days to the 90 days before, and list the pages with the biggest click drop" is enough; Gemini turns that into a Sheets formula or runs code behind the scenes. That's far faster than scanning for content decay by hand.

### What do striking-distance keywords mean?

Queries ranking between position 8 and 20 — already showing up, but not high enough to earn clicks. These pages represent the fastest traffic to win with an on-page edit rather than new content from scratch.

### Should I trust Gemini's SEO suggestions blindly?

No. Check every suggestion against the raw impression and click numbers it's based on; a low-volume query can look like an opportunity to the model when it's actually just statistical noise.
