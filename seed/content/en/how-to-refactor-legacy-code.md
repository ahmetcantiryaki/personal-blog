---
title: "How to Refactor Legacy Code Safely"
slug: "how-to-refactor-legacy-code"
translationKey: "refactor-legacy-code"
locale: "en"
excerpt: "Learn how to refactor legacy code safely: pin behavior with characterization tests, change in tiny reversible steps, and use the strangler pattern to replace risky code."
category: "software-engineering"
tags: ["refactoring", "clean-code", "legacy-code", "code-quality"]
publishedAt: "2026-07-02"
seoTitle: "How to Refactor Legacy Code Safely"
seoDescription: "How to refactor legacy code safely: pin behavior with characterization tests, change in tiny reversible steps, and use the strangler pattern to replace risk."
---

To refactor legacy code safely, wrap the existing behavior in characterization tests first, then change the code in tiny, reversible steps while the tests stay green. Never combine a refactor with a behavior change in the same commit. You can restructure fearlessly only when a test suite screams the moment behavior drifts.

Legacy code isn't "old code." It's code without tests you trust and without an author you can ask. This guide shows the exact sequence we use to change scary, untested modules in production without breaking them.

## What does "refactor legacy code safely" actually mean?

Refactoring means changing the internal structure of code without changing its observable behavior. Doing it *safely* on legacy code means you can prove behavior hasn't changed before, during, and after each edit. Without that proof, you're not refactoring — you're rewriting and hoping.

The trap most teams fall into is treating "make it cleaner" and "make it do something new" as one task. Keep them strictly separate. A safe refactor is a sequence of behavior-preserving edits, each small enough to revert in one `git revert` and each verified by a test.

## How do you refactor legacy code step by step?

Here's the repeatable process we run on every risky module. Follow it in order — the safety comes from the order, not the individual steps:

1. **Freeze the scope.** Pick the smallest unit that delivers value: one function, class, or endpoint. Resist the "while I'm here" urge.
2. **Find a seam.** Locate a place where you can observe behavior without editing the logic itself — a public method, HTTP boundary, or return value.
3. **Write characterization tests.** Capture what the code *currently* does, bugs included, by asserting on real outputs. Document reality, not correctness.
4. **Run the tests and watch them pass.** A suite that has never failed proves nothing. Break the code once to confirm the tests catch it.
5. **Make one structural change.** Extract a method, rename a variable, remove a dead branch — one edit, no behavior change.
6. **Run the tests again.** Green means continue. Red means revert immediately and go smaller.
7. **Commit the single change.** Small commits give precise revert points and a readable history.
8. **Repeat, then change behavior separately.** Only after the structure is clean do you touch behavior, in its own commits with new tests.

## Why write characterization tests before touching anything?

Characterization tests lock in the current behavior of code you don't fully understand, so any accidental change during a refactor shows up as a failing test instead of a production incident. They differ from normal unit tests in intent: you assert on whatever the code returns *right now*, even if it looks wrong.

The workflow is fast once you've done it a few times. Call the function with realistic input, log the output, then paste it straight into an assertion:

```python
# You don't know what calculate_fee "should" return.
# So you capture what it DOES return, then lock it in.

def test_characterize_calculate_fee():
    # Real inputs pulled from production logs
    result = calculate_fee(amount=1000, tier="gold", region="EU")

    # Paste the actual observed output as the expected value
    assert result == 87.50  # captured 2026-07-01, not "correct", just current
```

If `calculate_fee` has a rounding bug, this test *preserves* the bug on purpose. That's correct for a characterization test — your job during a refactor is to change structure, not results. Fix the bug later, in its own commit, with its own test.

## Which refactoring technique fits which situation?

Different legacy problems call for different techniques. Reaching for a full rewrite when a seam would do is the most expensive mistake in this space. Use this table to match each situation to the smallest safe move:

| Situation | Technique | Risk level | Why it works |
|-----------|-----------|------------|--------------|
| Untested function you must change | Characterization tests + extract method | Low | Pins behavior, then isolates the change |
| Tangled dependency you can't test | Introduce a seam (dependency injection) | Low | Lets you substitute a fake at the boundary |
| A whole subsystem to replace | Strangler fig pattern | Medium | Routes traffic to new code incrementally |
| Duplicated logic across files | Extract shared module | Low | One source of truth, tested once |
| Risky change you're unsure about | Branch by abstraction | Medium | Old and new run side by side behind a flag |
| Code nobody calls anymore | Delete it | Lowest | The safest refactor is removing dead code |

Notice that "rewrite from scratch" isn't in the table. Full rewrites throw away years of hard-won bug fixes encoded in the current logic, and they rarely ship on schedule. Prefer the strangler fig pattern, popularized by Martin Fowler: build the new system around the edges of the old and shift traffic over piece by piece until the legacy code is starved out.

## How do you change legacy code that has no seams?

When code is too tangled to test, add a seam before you refactor — a single point where you can swap a real dependency for a fake without changing behavior. The most common seam is dependency injection: pass a collaborator in instead of constructing it inside the function.

Before, the function grabs the clock and the database directly, so you can't test it in isolation:

```js
// Before: no seam. This hits a real DB and the real clock.
function expireSessions() {
  const now = Date.now();
  const sessions = database.query('SELECT * FROM sessions');
  return sessions.filter(s => s.expiresAt < now);
}

// After: seams added. Now you can inject fakes in tests.
function expireSessions(db = database, clock = Date) {
  const now = clock.now();
  const sessions = db.query('SELECT * FROM sessions');
  return sessions.filter(s => s.expiresAt < now);
}
```

The default arguments keep every existing caller working unchanged, so this edit is itself behavior-preserving. But now a test can pass a fake `db` and a frozen `clock`, letting you write the characterization tests you need before the real refactor. This "add a seam, then test, then change" order is the core skill for the hardest legacy code.

## How do you avoid breaking production during a large refactor?

Ship large refactors behind guardrails so a mistake degrades gracefully instead of taking down the service. The goal: no single deploy can cause an irreversible failure. Combine a few habits:

- **Branch by abstraction.** Put an interface in front of the code you're replacing, run old and new behind a feature flag, and switch with a config change you can revert instantly.
- **Ship in small commits.** Ten reviewable commits beat one 4,000-line pull request nobody can read.
- **Keep tests green on every commit.** A red build is a full stop, not something to fix later in the branch.
- **Compare old vs new in production.** For critical paths, run both implementations and log any mismatch before you trust the new one — a pattern GitHub's Scientist library was built for.
- **Watch your metrics after each deploy.** Error rate and latency tell you within minutes whether a "behavior-preserving" change actually preserved behavior.

We used branch by abstraction to replace a 9-year-old billing calculator last quarter. Two weeks of shadow-mode comparison surfaced 11 edge cases the characterization tests missed, all caught before a customer saw a wrong invoice. For the testing foundation this relies on, see [how to write unit tests that actually help](/blog/how-to-write-unit-tests) and the [clean code principles checklist](/blog/clean-code-principles-checklist).

## When should you not refactor legacy code?

Don't refactor code that works, rarely changes, and isn't blocking you — stability has value and every edit carries risk. Refactoring earns its keep only when it reduces the cost of a change you're about to make. Rearranging a stable module purely for aesthetics spends risk budget for no return.

A simple test: does this refactor make the next feature or bug fix cheaper? If yes, do it as part of that work. If you can't name the change it enables, leave it alone. For the patterns behind cleaner structure once you do refactor, our [design patterns for developers](/blog/design-patterns-for-developers) guide and the [software engineering category](/blog/software-engineering) pillar go deeper.

## Frequently Asked Questions

### What is the difference between refactoring and rewriting legacy code?

Refactoring preserves behavior while improving structure, in small verified steps against existing tests. Rewriting replaces the code entirely, discarding the accumulated bug fixes baked into the original. Refactoring is low-risk and incremental; rewrites are high-risk and often overrun schedules. Choose a rewrite only when the code is genuinely unsalvageable — and even then, strangle it gradually.

### How do I refactor legacy code without any tests?

Add tests before you change anything. Find a seam — a public method or an I/O boundary — call the code with realistic inputs, and write characterization tests that assert on whatever it currently returns, bugs included. If there's no seam, introduce one first via dependency injection. Only once behavior is pinned do you start restructuring.

### How small should each refactoring step be?

Small enough to revert with a single `git revert` and verify with one test run. In practice that means one extract-method, one rename, or one dead-branch removal per commit. If a step feels large enough that you're unsure whether it changed behavior, it's too big — split it. Tiny steps feel slow but beat debugging a giant change that broke something you can't localize.

### What is the strangler fig pattern in refactoring?

The strangler fig pattern replaces a legacy system incrementally: you build new functionality around its edges and gradually route traffic away from the old code until it can be deleted. Named by Martin Fowler after the vine that grows around a tree, it keeps a working product the entire time, avoiding the all-or-nothing risk of a big-bang rewrite.
