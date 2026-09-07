---
title: "How to Fix Flaky Tests for Good"
slug: "how-to-fix-flaky-tests-for-good"
translationKey: "fix-flaky-tests-for-good"
locale: "en"
excerpt: "Short answer: quarantine a flaky test the moment you spot it, then fix the root cause by ruling out timing, shared state, order dependence, and real clocks."
category: "software-engineering"
tags: ["testing", "ci-cd", "code-quality", "best-practices"]
publishedAt: "2026-09-07"
seoTitle: "How to Fix Flaky Tests for Good"
seoDescription: "What actually causes flaky tests, how do you detect them, and how do you fix them for good? A quarantine, root-cause, and flake-rate measurement guide."
---

Short answer: the moment you spot a flaky test, pull it out of CI's required-to-pass gate into quarantine, then fix it by ruling out four common root causes one at a time — async timing, shared state, order dependence, and real clocks or network calls. Deleting it or retrying it forever doesn't solve the problem; it just makes it invisible.

## What exactly is a flaky test?

A flaky test passes sometimes and fails other times with no code change in between. That's different from a real regression: a regression means the code broke, flakiness means the test itself — or its environment — is non-deterministic. The share of teams reporting flakiness grew from 10% in 2022 to **26%** in 2025, so the problem isn't shrinking, it's growing.

The impact isn't abstract. In Atlassian's Jira Frontend repository, flakiness accounts for **21%** of master build failures, and roughly **15%** in the backend repo. Google has reported that **16%** of its total testing compute goes toward running and rerunning flaky tests.

## What are the four root causes behind a flaky test?

Almost every flaky test falls into one of four categories: async timing (a missing `await`, or a fixed `sleep` that isn't long enough), shared state between tests (one test inherits data another one left behind), order dependence (the test only passes in a specific run order), and real clocks or network calls (an assertion that depends on the system clock or an external service).

| Root cause | Typical symptom | Durable fix |
|---|---|---|
| Async timing | Fails under parallel runs or on a slow machine | Replace a fixed `sleep` with a condition-based wait/poll helper |
| Shared state | Passes alone, fails as part of the suite | Reset the database or filesystem fresh for every test |
| Order dependence | Different result when test order changes | Run tests in randomized order to surface the dependency early |
| Real clock/network | Different result at midnight or on weekends, fails during an outage | Fake the clock, mock the external call |

## How do you detect a flaky test?

The most reliable method is running the suspect test 50-100 times in a row in isolation: a real regression fails every single time, while a flaky test passes on some fraction of those runs. If your CI already retries failed tests, logging "how many attempts it took to pass" to a separate dashboard catches tests quietly turning flaky before anyone notices — the retry itself hides the problem, so without that metric flakiness accumulates unseen.

```bash
# Run a single test 100 times in isolation (vitest example)
for i in $(seq 1 100); do
  pnpm vitest run tests/unit/checkout.test.ts --reporter=basic || echo "FAILED on run $i"
done
```

A script like this settles, in a few minutes, whether a test is genuinely flaky or just rarely but consistently failing — far cheaper than arguing about "sometimes red" in CI for days.

## Quarantine or delete — which one, and when?

Quarantine means pulling a test out of the required-to-pass gate and into a separate, tracked list — it still runs, its result still gets reported, but it no longer blocks the main branch. Any flaky test with a known root cause and a fix plan should be quarantined, not deleted, because it's probably validating real behavior — it just isn't validating it reliably. Deletion is the right call only when the test no longer matches a valid feature, or the feature itself was removed entirely.

Tying quarantine to a time limit matters: a test that's been quarantined for more than two weeks should either get fixed or be deliberately deleted. Indefinite quarantine is the most common way a "temporary" list turns into permanent junk — and once that list grows large enough, the team starts ignoring it entirely.

If you want to fit this discipline into a broader framework, see [Clean Code Principles](/en/posts/clean-code-principles-checklist): the rule "always passing or clearly broken, never ambiguous" for a test matches the same predictability standard you'd expect from the rest of the codebase.

## Why does measuring the flake rate matter?

Once the flake rate crosses **5%**, teams see release cycles run **20-40% longer** — because every failed build triggers a "is this real or flaky" argument that eats time. For a 20-engineer team running a 500-minute-per-day CI pipeline, a 12% flake rate works out to roughly **$120,000 a year** once you model CI-minute cost and engineer triage time together; at a 100-person engineering org, that figure can climb to **$2.6 million a year**.

That cost is hard to prioritize until it's visible. The simplest dashboard: track a "total runs / failed runs" ratio per test weekly, keep a separate list of the 10 tests with the highest flake rate, and put at least one fix from that list into every sprint's planning.

## How do you prevent flakiness while writing the test in the first place?

Most flakiness is preventable at the point the test is written. Three habits do most of the work: use a condition-based wait helper instead of a fixed delay (`sleep(2000)`); make every test create and clean up its own test data instead of relying on the state a previous test left behind; and never make a real network call unless a test genuinely needs one — use a mock or a fake server instead.

```text
Bad:  await sleep(2000); expect(button).toBeEnabled()
Good: await waitFor(() => expect(button).toBeEnabled())
```

That one-line difference matters: `sleep(2000)` can come up short on a slow CI machine, or needlessly slow the test down on a fast one; `waitFor` waits until the condition actually holds, within a reasonable timeout, so it ends up both faster and more reliable.

## How do you prioritize flakiness by source?

Not every flaky test carries the same urgency. A test covering a payment flow that fails once a week is a much bigger risk than a test covering a cosmetic component that fails ten times a day — but the second one grabs more of the team's attention simply because it fails more often, and usually gets fixed first regardless of stakes. Prioritizing correctly runs along two axes: how critical the code path under test is, and how often the test actually fails. A simple score that multiplies the two (criticality × weekly failure count) picks the 10 tests that genuinely need fixing first far more reliably than ranking by "whoever complained most recently."

## Frequently Asked Questions

### How do you tell a flaky test apart from a real regression?

Run the suspect test several times in a row in isolation: a real regression fails the same way every time the code stays unchanged, while a flaky test passes on some fraction of those runs. A result changing with no code change is the most reliable sign of flakiness.

### Does retrying in CI fix flaky tests?

No, it hides the problem rather than fixing it. Retrying keeps the build from showing red, which saves time short-term, but the underlying timing or shared-state issue stays unresolved and usually gets worse over time; without tracking the retry rate as its own metric, that buildup goes unnoticed.

### When should a test be deleted versus quarantined?

A test with a known root cause and a fix plan should be quarantined, since it's probably testing real behavior. Deletion is right only when the test no longer matches a valid feature or that feature was removed entirely — uncertainty shouldn't turn into indefinite quarantine under the excuse of "we'll fix it later."

### How much does flakiness actually cost?

For a 20-engineer team running a 500-minute-per-day CI pipeline, a 12% flake rate works out to roughly $120,000 a year once CI-minute cost and triage time are modeled together; at a 100-person org, that can climb to $2.6 million a year. Release cycles also run 20-40% longer once the flake rate crosses 5%.
