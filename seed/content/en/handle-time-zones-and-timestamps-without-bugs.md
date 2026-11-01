---
title: "Handle Time Zones and Timestamps Without Bugs"
slug: "handle-time-zones-and-timestamps-without-bugs"
translationKey: "time-zones-timestamps-without-bugs"
locale: "en"
excerpt: "Short answer: store timestamps as UTC using timestamptz, send offset-aware ISO 8601 over the wire, and convert to the user's time zone only at display time."
category: "software-engineering"
tags: ["postgresql", "backend", "best-practices", "testing"]
publishedAt: "2026-11-01"
seoTitle: "How Do You Avoid Time Zone and Timestamp Bugs?"
seoDescription: "UTC or local time, timestamptz or timestamp, how should you send ISO 8601? A practical checklist and testing approach to avoid time zone bugs."
---

Short answer: store every timestamp in your database as UTC using `timestamptz`, send offset-aware ISO 8601 between services, and push the conversion to the user's local time zone to the very last step, in the UI. Skip any of these three rules and DST transitions will shift appointments by an hour, or fire recurring events on the wrong day.

## What's the actual difference between UTC and local time?

UTC represents a single, universal instant, while local time is the wall-clock rendering of that instant in a specific time zone. A server event logged as "2026-11-01 14:00 UTC" refers to the same moment everywhere on Earth, but its wall-clock equivalent in Istanbul depends on whether daylight saving is currently in effect there.

The most common bug from confusing the two is storing an event "in local time" and having that value lose meaning the moment the server's time zone setting changes or a user from a different region reads it. An instant is fixed; a wall-clock rendering depends on your point of view — your database design needs to know which one it's actually storing.

## Should you use timestamptz or timestamp in Postgres?

Use `timestamptz` in almost every case: it stores an instant and converts the input to UTC using whatever offset was supplied, while plain `timestamp` ignores the offset entirely and stores only the date-and-clock fields as written. Both types occupy the same 8 bytes on disk — `timestamptz` doesn't cost extra storage, it just interprets the input differently.

The difference shows up in practice like this: write a value with a `+05:00` offset into a `timestamp` column, and the offset is silently dropped, storing the clock reading as-is. Write the same value into a `timestamptz` column, and Postgres converts it to its UTC equivalent, then renders it back according to the session's `timezone` setting on read.

```sql
-- timestamp: the offset is ignored, the value is stored as written
SELECT '2026-11-01 14:00:00+05:00'::timestamp;
-- 2026-11-01 14:00:00

-- timestamptz: the offset is applied, converted to UTC
SELECT '2026-11-01 14:00:00+05:00'::timestamptz;
-- with session timezone UTC: 2026-11-01 09:00:00+00
```

Reserve plain `timestamp` for values that genuinely carry no time zone — a recipe step like "preheat the oven for 20 minutes," with no geographic location attached at all.

## How should you send timestamps over the wire?

Always send timestamps between services as offset-aware ISO 8601 — for example `2026-11-01T09:00:00Z` or `2026-11-01T14:00:00+05:00` — because this format is both machine-parseable and leaves zero ambiguity. A locale-formatted string like "01/11/2026 2:00 PM" doesn't specify whether it's day/month or month/day order, which makes it a frequent source of bugs in cross-service integrations.

| Format | Example | Ambiguity |
|---|---|---|
| ISO 8601 (Z) | `2026-11-01T09:00:00Z` | None — the UTC instant is explicit |
| ISO 8601 (offset) | `2026-11-01T14:00:00+05:00` | None — the offset is explicit |
| Unix epoch (seconds) | `1762000800` | None, but not human-readable |
| Locale format | `01/11/2026 14:00` | High — day/month order is unclear |

When designing an API contract, never leave a timestamp field as a bare string like `"14:00"` — date, time, and offset need to travel together every time.

## What traps do DST transitions create?

Most DST traps cluster around the moment a country changes its clock rules, or the specific night the clock jumps forward or back — during that transition, certain local times either never happen or happen twice. On the night clocks spring forward, a local time like 02:30 simply never occurs that day; on the night clocks fall back, 02:30 occurs twice, and it's ambiguous which occurrence a stored value refers to.

The [IANA time zone database's 2026e release](https://www.iana.org/time-zones/releases/2026e) records Manitoba moving to a permanent -05 offset as of 2026-10-31, and the [2026c release](https://www.iana.org/time-zones/releases/2026c) records Morocco moving to a permanent +00 as of 2026-09-20 — proof that DST rules change not just on a calendar schedule but by political decision, repeatedly through the year.

When you store a recurring event ("meeting every Monday at 09:00"), store it as a region name plus a wall-clock time, not as a fixed UTC offset — otherwise the meeting shifts by an hour once DST changes. This is why calendar apps store recurring events with a zone identifier like `America/New_York` and a wall-clock value of `09:00`, never a fixed UTC offset.

## Why does the IANA time zone database keep changing?

The IANA tz database gets updated every time a government changes its DST rules, time zone boundaries, or permanent offset — these changes land several times a year and are inherently unpredictable because they follow political decisions, not a fixed calendar. The [five releases published across 2026 (2026a through 2026e)](https://www.iana.org/time-zones/releases) cover permanent-offset switches in Alberta, Canada's Northwest Territories, British Columbia, Morocco, and Manitoba.

The practical consequence: if you don't keep your server's `tzdata` package (or your language's time zone library) up to date, your application starts computing the wrong offset for a region the moment that region's government changes its rules — the code doesn't change, but stale data makes it wrong anyway.

## How should you test time zone logic?

Test time zone logic by freezing the system clock at deliberately chosen instants, and include at least one "unusual" time zone in your test matrix — for example Kathmandu, which runs on a 45-minute offset (UTC+5:45), or a region that doesn't observe DST at all. Passing all your tests on a UTC-0 development machine doesn't mean production is safe; time zone bugs tend to surface only at specific offsets.

```text
Suggested test matrix:
1. UTC (baseline)
2. America/New_York (observes DST, negative offset)
3. Asia/Kathmandu (UTC+5:45, non-standard offset)
4. Pacific/Kiritimati (UTC+14, extreme positive offset)
5. A DST transition night (the instant a local time like 02:30 is skipped or repeated)
```

My take: teams keep pushing time zone testing off as a "later" problem, because developing on UTC makes everything look simple. That's the same trap described in [structured logging that's actually useful](/en/posts/structured-logging-thats-actually-useful) — a booking bug that explodes in production on a DST transition night costs far more than adding Kathmandu to the test matrix up front would have.

The problem compounds in a multi-tenant system, where every tenant can carry a different time zone preference. Much like the backward-compatibility trade-offs covered in [API versioning strategies](/en/posts/api-versioning-strategies), changing your timestamp contract after the fact risks breaking integrations that already depend on it — which is exactly why you commit to ISO 8601 and UTC from day one instead of retrofitting it later.

## Frequently Asked Questions

### Should I use timestamptz or timestamp in Postgres?

Use `timestamptz` in almost every case — it stores an instant and converts the input to UTC using the offset supplied at write time. Reserve plain `timestamp` only for values with no time zone relationship at all, such as a pure wall-clock reading.

### What format should I use to send timestamps between APIs?

Send offset-aware ISO 8601, such as `2026-11-01T09:00:00Z`. This format parses unambiguously by machine and never leaves a day/month-vs-month/day question open the way locale-formatted strings do.

### Why do recurring events shift after a DST transition?

They shift because the event was stored with a fixed UTC offset instead of a zone name plus wall-clock time. When a region's clock rule changes — a DST transition or a permanent-offset switch — an event stored with a fixed offset no longer lands on the intended local time.

### How often should I update the IANA time zone database?

Update it every time a new release ships — five releases shipped across 2026 (2026a through 2026e) because governments changed clock rules several times during the year. A stale `tzdata` package computes the wrong offset the moment a region's government changes its rules.
