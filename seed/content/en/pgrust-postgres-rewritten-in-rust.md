---
title: "pgrust: Postgres Rewritten in Rust by AI Agents"
slug: "pgrust-postgres-rewritten-in-rust"
translationKey: "pgrust-postgres-rust-rewrite"
locale: "en"
excerpt: "pgrust just passed 100% of Postgres's 46,000+ regression tests — 450K lines of Rust written by eight parallel AI agents in 12 weeks. Is it production-ready?"
category: "software-engineering"
tags: ["databases", "sql", "open-source", "ai-coding", "software-architecture", "postgresql"]
publishedAt: "2026-07-14"
seoTitle: "pgrust: Postgres Rewritten in Rust, Explained"
seoDescription: "pgrust passed all 46,000+ Postgres regression tests. Built by eight AI agents in 12 weeks, 450K lines of Rust — what it means and its real limits."
---

Has Postgres been rewritten in Rust? Yes — but it is nowhere near production-ready yet. A project called pgrust became the most discussed story on Hacker News this week in July 2026 after passing all 46,000+ regression tests in the Postgres 18.3 test suite. The more striking detail is how the codebase got written: eight parallel AI coding agents produced 450,000 lines of Rust in 12 weeks.

## What is pgrust?

pgrust is the work of Michael Malis, a former Freshpaint CEO and Postgres veteran who ran petabyte-scale clusters at Heap. The goal is not to build a new database that merely resembles Postgres — it is a Rust-based core that speaks the existing Postgres disk format and wire protocol directly. The project is open source at [github.com/malisper/pgrust](https://github.com/malisper/pgrust), and the codebase weighs in at roughly 98 MB of Rust plus vendored Postgres test files.

The key distinction: pgrust is not a "Postgres-like" product — it claims to be a drop-in replacement that boots straight from an existing Postgres data directory and speaks the same wire protocol. Racking up 740 points and 620 comments on the [Hacker News thread](https://news.ycombinator.com/item?id=48841676) shows the community is taking that claim seriously.

## 450,000 lines in 12 weeks: how eight AI agents built it

What sets pgrust apart from other "rewrite X in language Y" projects is development velocity. Malis ran eight parallel AI coding agents against the same codebase simultaneously, producing 450,000 lines of Rust in roughly 12 weeks — work that could take a traditional team years, compressed into a single quarter through an aggressive AI-assisted development pipeline.

The result depended on continuous validation against Postgres's own regression suite: more than 46,000 queries matched expected output exactly. Without a verification set at that scale, manually auditing consistency across code produced by eight parallel agents would have been effectively impossible. As we noted in our piece on [mistakes when using AI coding assistants](/en/posts/ai-coding-assistant-mistakes), what makes AI speed trustworthy is always the test discipline underneath it.

## Postgres's "four horsemen" and pgrust's answer

Malis frames his motivation around four chronic Postgres pain points: VACUUM-triggered outages, transaction ID wraparound, connection limits, and JSONB's performance ceiling. All four trace back to design decisions baked into Postgres's thirty-year-old C architecture.

pgrust's architectural claims include:

- **Thread-per-connection model**: replacing Postgres's process-per-connection architecture with lightweight threads to improve connection scalability.
- **Native disk compatibility**: it can boot directly from an existing Postgres data directory, so no data migration is required to try it.
- **A planned OrioleDB integration**: to address storage-layer limitations, future versions may incorporate OrioleDB, currently in beta.

## Performance claims and honest limits

Early benchmarks circulating online claim analytical performance approaching ClickHouse, but Malis himself is explicit that the v0.1 release is neither production-ready nor performance-optimized. Procedural languages like PL/Python, PL/Perl, and PL/Tcl are not yet supported, and only some contrib modules have been ported.

| Dimension | Postgres (C) | pgrust v0.1 |
|---|---|---|
| Regression test pass rate | Reference (100%) | 100% (46,000+ queries) |
| Connection model | Process-per-connection | Thread-per-connection |
| Disk format compatibility | — | Boots from an existing Postgres directory |
| Procedural language support | Full (PL/pgSQL, PL/Python, PL/Perl, PL/Tcl) | Limited, some contrib modules missing |
| Production readiness | Mature, 30 years | No — experimental by the author's own account |
| Development time | Decades | ~12 weeks |

That table is really a caution: a 100% regression pass rate means "functionally equivalent," not "production-reliable." Behavior under sustained load, whether memory-safety gains translate into real-world wins, and whether a community forms around it are all still open questions.

## Why this matters beyond database performance

Here is my take: pgrust's real news value is not database performance — it is what kind of software projects are now attemptable in a reasonable timeframe with a fleet of AI agents. Rewriting a thirty-year-old system with 46,000 test scenarios in 12 weeks would have sounded absurd a couple of years ago; today it exists as a proof of concept. It reads as the next, more radical step after the trend that started with [TypeScript 7's rewrite in Go](/en/posts/typescript-7-go-native-compiler): "rewrite critical infrastructure in a fast systems language" is no longer bottlenecked on human engineering headcount — the bottleneck is test coverage and verification speed.

That has a practical consequence for engineering teams: if your system lacks a comprehensive regression suite, you cannot borrow AI agents' speed for a rewrite like this — there is no ground truth to validate against. pgrust's story is really evidence that testing matters more in the AI era, not less.

## Don't confuse it with neighboring Rust-Postgres projects

Two neighboring projects are easy to conflate with pgrust, and shouldn't be. The first is `pgrx`: it doesn't rewrite Postgres at all — it's a mature, actively maintained framework for writing Postgres extensions in Rust. The second is OrioleDB: a separate, still-in-beta project aimed at replacing Postgres's storage engine. pgrust's roadmap includes integrating OrioleDB as a storage layer eventually, but that hasn't happened yet. So today you're really looking at three projects at three different maturity levels — lumping them together is misleading.

## A practical decision framework for your team

Three questions for evaluating pgrust today:

1. **Does your system have a comprehensive regression test suite?** If not, the lesson to take from pgrust's story is less about AI speed and more about building that test discipline first.
2. **Do you rely on PL/Python, PL/Perl, or PL/Tcl?** If so, pgrust isn't an option for you right now.
3. **Is it worth trying an experimental project in an isolated environment?** Running pgrust in a dev or test environment to observe its disk compatibility firsthand is a reasonable first step before considering production.

How you answer those three questions should tell you whether to keep an eye on pgrust or set it aside for now.

## The honest limits

Running pgrust in production today would be irresponsible. Missing procedural language support, an unoptimized performance profile, and an operational track record that simply does not exist yet (backups, replication, monitoring-tool compatibility) all mean the project is currently a research and proof-of-concept effort. We covered how Postgres itself adapts to varied workloads in [our "just use Postgres" piece](/en/posts/just-use-postgres-for-everything), and how indexing choices affect performance in our [database indexing guide](/en/posts/database-indexing-explained).

## Frequently Asked Questions

### Is pgrust ready for production use?

No. The author himself states the v0.1 release is neither production-ready nor performance-optimized. Procedural languages like PL/Python, PL/Perl, and PL/Tcl are unsupported, and some contrib modules are still missing.

### Can pgrust really open an existing Postgres database?

Yes — the project claims disk-format and wire-protocol compatibility, meaning it can boot directly from an existing Postgres data directory and speak to the same clients, including psql. That lets you try it without migrating data.

### Is it reliable to have eight AI agents write code in parallel?

What made this reliable was not the agents themselves but Postgres's regression suite of 46,000+ queries. The agents produced code quickly, but every change was continuously checked against that comprehensive test set. Without test coverage at that scale, a parallel AI development process like this would be practically unauditable.

### Will pgrust replace Postgres?

Not in the short term. The project remains experimental and lacks complete procedural language support. But its disk and protocol compatibility gives it real potential as an alternative for specific workloads down the line — for example, scenarios that demand very high connection counts.
