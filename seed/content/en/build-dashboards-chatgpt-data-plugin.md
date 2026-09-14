---
title: "Build Dashboards From Data With ChatGPT Data"
slug: "build-dashboards-chatgpt-data-plugin"
translationKey: "chatgpt-data-plugin-dashboards-2026"
locale: "en"
excerpt: "Short answer: ask @Data your question in ChatGPT Work, it queries connected sources like Snowflake or BigQuery, and builds an editable dashboard with no SQL."
category: "business"
tags: ["chatgpt", "openai", "automation", "productivity"]
publishedAt: "2026-09-14"
seoTitle: "ChatGPT Data Plugin: Build Dashboards Without SQL (2026)"
seoDescription: "How ChatGPT Work's Data agent investigates business questions and builds interactive dashboards from connected sources, with a worked example."
---

Short answer: in ChatGPT Work, you ask @Data your question in plain language, it pulls from connected sources like Snowflake, BigQuery, or Redshift, investigates what changed, and builds an editable interactive dashboard styled to your company's brand. OpenAI added the Data agent to ChatGPT Work and Codex on September 10, 2026, and it requires no SQL.

Until now, answering a question like "why did churn go up" meant waiting in a data analyst's queue or writing your own SQL. The Data agent aims to remove that middle step: you ask the question in plain language and let the agent decide which table to look at and which comparison to run.

## What does the ChatGPT Data plugin actually do?

The Data agent connects to approved company data sources, investigates a business question, explains what it found, and builds a shareable interactive dashboard or report. Supported sources include Amazon Redshift, Google BigQuery, ClickHouse, Databricks, MongoDB, and Snowflake, and it can also pull business context from Google Drive and SharePoint.

This differs from a generic "analyze my data" tool in one important way: the agent operates within the access rules your company already enforces, so an employee who can't see a table in Snowflake can't see it through ChatGPT either.

## Which data sources can you connect?

| Source | Type | Note |
|---|---|---|
| Snowflake | Data warehouse | Direct query |
| Google BigQuery | Data warehouse | Direct query |
| Amazon Redshift | Data warehouse | Direct query |
| Databricks | Lakehouse | Direct query |
| ClickHouse | Analytics database | Launch partner |
| MongoDB | Document database | Direct query |
| Google Drive / SharePoint | Context | Reference docs, not metrics |

Connecting a source requires approval from your IT or data team, and each source's own access permissions keep applying exactly as they do outside ChatGPT.

## How it works on a real example: "Why did churn rise?"

You start a conversation with @Data and state the question, ideally naming the source, metric, time period, and comparison: "Why did churn rise in the enterprise segment over the last 3 months? Compare against the prior quarter." The agent scans the relevant tables, identifies which cohort was affected, states an initial finding, and builds an interactive dashboard to back it up.

```text
Prompt: @Data Why did churn rise in the enterprise segment
over the last 3 months? Compare against the prior quarter,
and break it down by pricing plan changes.
```

If the first answer isn't quite right, you refine it in the same conversation: "filter to Europe only" or "show weekly instead of monthly" reshapes the dashboard while the agent keeps the prior context.

## What follow-up questions actually improve the dashboard?

The most productive follow-ups change one variable and hold the rest constant: narrowing the time window, adding a segment, or converting a metric to a percentage. A vague "make it better" gives the agent little to work with; "break this down by plan and add percent change" gives it a concrete target.

| Weak follow-up | Strong follow-up |
|---|---|
| "Make it more detailed" | "Break down by region and show the 3 biggest declines" |
| "Try a different chart" | "Use a cumulative area chart instead of a line chart" |
| "Verify this" | "Compare this figure against last quarter's raw table" |

## How do you control who sees what?

The Data agent inherits the access rules of whatever source it's connected to, so a schema an employee can't see in Snowflake stays invisible through ChatGPT too. There's still a new risk layer, though: once a dashboard is shared, that snapshot becomes a standalone artifact independent of the source's access controls. Checking that a shared dashboard contains only data the recipient already has access to is on your IT team, not the agent.

## When is a real BI tool still the better call?

The Data agent is strong for one-off exploratory questions and quick prototype dashboards, but it doesn't replace a dedicated BI tool like Looker or Tableau for a production-grade dashboard that refreshes daily and many people rely on. Its first dashboard usually answers "is this question worth investigating further" quickly; if the answer is yes, moving that analysis into a permanent BI tool is still the right next step.

My honest take: this tool doesn't replace data analysts — it shortens their queue of "which question should I investigate next." [ChatGPT Work](/en/posts/chatgpt-work-openai-agent-explained) already aimed at automating multi-step business tasks; the Data agent is the most concrete example of that on the analytics side. The [ChatGPT vs Gemini spreadsheet comparison](/en/posts/chatgpt-vs-gemini-spreadsheets) shows a similar pattern: the model is fast at preparing the data, but final verification is still a human job.

## What does this mean for founders?

For companies too small to have a dedicated data team, the Data agent fills a gap similar to [AI bookkeeping automation](/en/posts/ai-bookkeeping-for-founders): a founder with no SQL knowledge can ask "show this month's MRR change by segment" and get a first look in minutes. The risk sits in the same place, too — don't hand raw numbers to a board without cross-checking at least one metric against the source data by hand first.

## What mistakes are people making with it?

The three most common mistakes: asking a question without naming the source (the agent has to guess which table to look at), skipping the time window (the agent picks a default range and can compare the wrong periods), and sharing the first result without verifying it. All three are avoidable just by being more specific — "how did sales do" turns into "how did monthly recurring revenue change in Europe in August 2026 compared to July," which sharply raises the odds the agent finds the right table.

| Mistake | Result | Fix |
|---|---|---|
| No source named | Agent may query the wrong table | Name the source/schema in the prompt |
| Vague time window | Wrong period gets compared | Give an explicit range, e.g. "last 3 months vs. prior quarter" |
| Unverified sharing | A decision gets made on a wrong number | Cross-check at least one metric against raw data |

## Frequently Asked Questions

### Which ChatGPT plan includes the Data plugin?

It's available to ChatGPT Work and Codex users; it isn't part of the standard ChatGPT Plus or Pro consumer plans. Per OpenAI's September 2026 announcement, access is limited to business accounts that can connect enterprise data sources.

### Do I need to know SQL to use the Data agent?

No. You write your question in plain language and the agent generates the underlying query itself. Still, checking which table and time range it actually looked at in the result panel helps you catch a misread metric early.

### Can I trust the dashboard the Data agent builds?

Trust it provisionally, then verify. Even when the agent claims to have looked at the right source, complex business logic — like the exceptions in your "active user" definition — can get lost in translation. Cross-check at least one headline metric against raw data or a known report before it reaches a leadership meeting.

### Which data sources aren't supported?

At launch, Redshift, BigQuery, ClickHouse, Databricks, MongoDB, and Snowflake were supported. If you run a self-hosted or otherwise unlisted database, check connection options with your IT team first.
