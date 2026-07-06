---
title: "How to Write Unit Tests That Actually Help"
slug: "how-to-write-unit-tests"
translationKey: "how-to-write-unit-tests"
locale: "en"
excerpt: "Learn how to write unit tests that catch real bugs: name for behavior, use Arrange-Act-Assert, test one thing, and skip the brittle implementation-detail tests."
category: "software-engineering"
tags: ["testing", "unit-testing", "code-quality", "best-practices"]
publishedAt: "2026-06-13"
seoTitle: "How to Write Unit Tests That Actually Help"
seoDescription: "How to write unit tests that catch real bugs: name for behavior, use Arrange-Act-Assert, test one thing per case, and avoid brittle implementation-detail tests."
---

To write unit tests that actually help, test observable behavior instead of implementation details, give each test one clear reason to fail, and follow the Arrange-Act-Assert structure. A useful unit test breaks only when the behavior breaks. If it also breaks every time you rename a private method or reorder a call, you've written a maintenance liability, not a safety net.

Most teams don't struggle with *whether* to test. They struggle because their tests are slow, flaky, and coupled to internals, so people stop trusting them. This guide shows how to write unit tests you'll actually keep.

## What makes a unit test "good"?

A good unit test verifies one behavior, runs in milliseconds, and produces the same result every time regardless of order or machine. It reads like a specification: given some input, the function returns or does a specific thing. The classic acronym for this is **F.I.R.S.T.** — Fast, Isolated, Repeatable, Self-validating, Timely.

The distinction that matters most in 2026: test **behavior**, not **structure**. A test coupled to internal method calls turns every refactor into a red suite, which trains your team to ignore failures. That's the exact opposite of what testing is for.

## How do you write a unit test, step by step?

Here's the repeatable process we use on every new function. Follow it in order and your tests stay small and honest:

1. **Pick one behavior.** Name the single input-output rule you want to lock down (e.g. "empty cart returns total of 0").
2. **Write the test name as a sentence.** Describe the behavior: `returns zero for an empty cart`. The name should read without opening the body.
3. **Arrange.** Set up the minimal input and dependencies the case needs, nothing more.
4. **Act.** Call the function under test exactly once. If you need two calls, you probably have two tests.
5. **Assert.** Check the observable result: return value, thrown error, or a state change you can query.
6. **Run it red first.** Break the implementation or write the assertion before the code, and confirm the test fails for the right reason.
7. **Make it green.** Write the minimal code to pass.
8. **Add edge cases.** Empty, null, boundary, and error paths — one test each.

This is the core of test-driven development, but you get the benefit even when you write tests right after the code, as long as you watch each one fail once.

## What does a clean unit test look like?

A clean test has three visible blocks and a name that states the rule. Here's the Arrange-Act-Assert pattern in practice, testing a small pricing function:

```js
import { describe, it, expect } from 'vitest';
import { cartTotal } from './cart';

describe('cartTotal', () => {
  it('returns zero for an empty cart', () => {
    // Arrange
    const items = [];

    // Act
    const total = cartTotal(items);

    // Assert
    expect(total).toBe(0);
  });

  it('applies a 10% discount above 100', () => {
    const items = [{ price: 80 }, { price: 40 }]; // 120

    const total = cartTotal(items);

    expect(total).toBe(108); // 120 - 10%
  });
});
```

Notice each test touches `cartTotal` once and asserts on the return value only. It never inspects how the total is computed. Rewrite the function with `reduce`, a loop, or a lookup table, and both tests stay green. That's the property you're aiming for.

## Which tests should you avoid writing?

Avoid tests that assert on internals, mock everything, or verify what the framework already guarantees. These pass in CI but give you false confidence and slow you down. The table below shows the anti-patterns we flag most often in review and what to write instead:

| Anti-pattern | Why it hurts | Write this instead |
|--------------|--------------|--------------------|
| Asserting a private method was called | Breaks on every refactor | Assert the public return value or state |
| Mocking the thing under test | Tests the mock, not your code | Only mock external boundaries (network, clock, DB) |
| One test, many assertions | Vague failure message | One behavior per test |
| Testing getters/setters | No logic, no value | Test functions that make decisions |
| Snapshot of a huge object | Nobody reviews the diff | Assert the specific fields that matter |
| Sleeping to wait for async | Slow and flaky | Await the promise or use fake timers |

On one payments service we cut a 40-minute suite to 6 minutes mostly by deleting mock-heavy tests that verified call order instead of results. Coverage dropped 4%, and we caught *more* real bugs because the remaining tests actually described behavior.

## How much should you mock?

Mock only what you don't control: network calls, the system clock, randomness, the file system, and third-party services. Everything you own should run for real inside the test. Over-mocking is the single biggest reason unit tests give false confidence — you end up asserting that your mocks were configured correctly, not that your code works.

A practical rule: if replacing a real object with a mock changes *what* the test proves rather than just *how fast* it runs, don't mock it. For pure logic — calculations, validation, formatting, state transitions — you rarely need any mocks at all, which is why that logic is the highest-value thing to unit test.

## What about coverage numbers?

Coverage tells you what code *ran* during tests, not what behavior you *verified*, so treat it as a gap-finder, not a goal. Chasing 100% pushes teams to write trivial tests for getters and generated code while the tricky branches stay untested. Aim for meaningful coverage of decision logic — the `if`s, the error paths, the edge cases — and let simple glue code sit at whatever number falls out.

We target roughly 80% as a floor on business logic and read the *uncovered* lines in every PR. An untested `catch` block or an unhit boundary condition is worth ten covered getters. If you want the wider framing on quality gates, see our [clean code principles checklist](/blog/clean-code-principles-checklist) and the [software engineering category](/blog/software-engineering) pillar.

## How do you keep tests from becoming a burden?

Tests become a burden when they're coupled to structure, slow, or unclear about why they failed. Keep them cheap to maintain with a few habits:

- **One reason to fail per test.** When a test breaks, the name should tell you what regressed.
- **No logic in tests.** No loops or conditionals building expected values — hardcode them so the test can't share a bug with the code.
- **Fresh state every time.** Build inputs inside each test, not in shared mutable module state.
- **Delete tests that no longer describe behavior.** A deleted brittle test is a win, not a loss.
- **Test through the public API.** If a private function is complex enough to need direct tests, it probably wants to be its own well-named module — a point we expand on in our [advanced TypeScript patterns](/blog/advanced-typescript-patterns) guide.

Do these consistently and the suite becomes the thing that lets you refactor fearlessly, which is the entire point.

## Frequently Asked Questions

### How many unit tests should one function have?

Enough to cover its distinct behaviors, not a fixed number. A pure calculation might need three or four: the happy path, a boundary, an empty/zero input, and an error case. If you find yourself writing a dozen tests for one function, that's usually a signal the function does too much and wants to be split — the tests are showing you a design problem.

### Should I write the test before or after the code?

Either works, but you must watch the test fail at least once. Test-first (TDD) gives you a design pressure that tends to produce smaller, more testable functions. Test-after is fine if you deliberately break the implementation to confirm the test actually catches the regression. A test that has never failed is a test you can't trust.

### What's the difference between unit and integration tests?

A unit test isolates one piece of logic and runs in milliseconds with no real I/O; an integration test verifies that several pieces work together across a real boundary like a database or HTTP call. You want mostly fast unit tests plus a thinner layer of integration tests for the wiring. Both matter, but they answer different questions and shouldn't be confused.

### How do I test code that depends on the current time or randomness?

Inject the dependency instead of calling `Date.now()` or `Math.random()` directly, then supply a fixed value in the test. Most frameworks also ship fake timers (Vitest, Jest) that let you freeze and advance the clock. This turns non-deterministic code into repeatable tests, which is a hard requirement for the "R" in F.I.R.S.T.
