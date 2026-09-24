---
title: "Property-Based Testing: Find Bugs You Didn't Expect"
slug: "property-based-testing-find-bugs"
translationKey: "property-based-testing-2026"
locale: "en"
excerpt: "Property-based testing defines a rule that must always hold instead of a single example, then lets the framework generate random inputs trying to break it."
category: "software-engineering"
tags: ["testing", "unit-testing", "code-quality", "python"]
publishedAt: "2026-09-24"
seoTitle: "Property-Based Testing Explained: Hypothesis, fast-check"
seoDescription: "Property-based testing checks invariants against thousands of generated inputs instead of hand-picked examples. Shrinking and stateful testing here."
---

Short answer: property-based testing means you write "for every input, this rule must always hold" instead of "for this input, the output must be that" — the test framework then generates hundreds or thousands of random inputs trying to break that rule.

## Why this matters: a real example

A team had a JSON serialization function fully covered by unit tests, all green. Then they wrote a single property with Hypothesis: "for any object, encode it and decode it back, and the result must equal the original" — a roundtrip property. Within seconds, the framework found that the roundtrip broke whenever the object contained a `NaN` float, because the JSON spec doesn't support `NaN` and the library was silently converting it to `null`. No hand-written test had covered that case, because nobody had thought to ask "what if the value is NaN?" The framework didn't need to think — it just generated.

## How is this different from example-based testing?

An example-based test hand-writes a specific input and its expected output: a line like `assert encode(decode(x)) == x` checked against one chosen value of `x`. A property-based test writes the same assertion, but you don't pick `x` — the framework generates hundreds of different values of `x` from a generator definition and checks whether the property still holds for each one. The two approaches aren't interchangeable: example-based tests document specific, known edge cases; property-based tests discover edge cases you didn't know existed.

A generator definition can express more than a single line implies, too: `st.integers()` generates plain integers, but adding a constraint like `st.integers(min_value=0, max_value=100)` narrows the input space, and composing generators with something like `st.lists(st.integers(), min_size=1)` defines "a list of integers with at least one element." That composability makes it possible to generate realistic test data even for complex input types — nested JSON objects, date ranges, custom class instances.

## Why does shrinking matter so much?

When a property fails on one of thousands of random inputs, that input is usually complex and hard to read — a deeply nested list of 40 elements, say. Shrinking is the framework's process of progressively simplifying that failing input down to the smallest example that still breaks the property. Hypothesis, fast-check, and jqwik all include this mechanism: when a property fails, jqwik doesn't just report the failure, it repeatedly simplifies the input until it finds the minimal failing case. Without shrinking, property-based testing would be practically unusable — debugging with a random 40-element list is far harder than debugging with a single element.

## Which tool should you use in which language?

Property-based testing traces back to Haskell's QuickCheck framework; today, nearly every mainstream language has an implementation.

| Language | Framework | Note |
|---|---|---|
| Python | Hypothesis | Stands out for its sophisticated stateful testing support |
| JavaScript/TypeScript | fast-check | Type-based generators, shrinking included |
| Java | jqwik | `@Property` annotation, configurable try count |
| Rust | proptest, quickcheck | Tightly integrated with Rust's type system |
| Scala | ScalaCheck | One of the closest ports of the original QuickCheck |

## What is stateful testing?

Simple property tests work well for pure functions, but most real systems carry state — a cache, a database connection, a user session. Stateful testing generates a random sequence of commands (`add`, `remove`, `update`, and so on), applies them to both the real system and a simple "shadow model," and shrinks the failure down to a minimal command sequence whenever the two diverge at any step. This approach, which Hypothesis brought to Python, can surface something like an LRU cache implementing eviction order incorrectly — the kind of ordering bug that hand-written scenario tests tend to miss.

```python
from hypothesis import given, strategies as st

@given(st.lists(st.integers()))
def test_sort_is_idempotent(xs):
    once = sorted(xs)
    twice = sorted(sorted(xs))
    assert once == twice

@given(st.floats(allow_nan=True))
def test_json_roundtrip(x):
    import json
    assert json.loads(json.dumps(x)) == x  # this line breaks for NaN
```

In jqwik, you configure the same try count and shrinking behavior on the `@Property` annotation — `tries = 5000` raises the number of generated cases, and `shrinking = ShrinkingMode.OFF` turns shrinking off, usually a temporary setting while debugging.

## Which properties are actually worth testing?

Properties that catch real bugs usually fall into one of four patterns: roundtrip (encode, then decode, and you get the original back), invariant (a sort function must never drop or duplicate an element), idempotence (applying an operation twice must give the same result as applying it once), and different-paths-same-result (two different algorithms must produce the same output for the same input). A scattershot "let's test everything" approach wastes time; the real value is in finding the mathematical or logical rule your code is supposed to uphold and turning that into a single assertion.

Our take: property-based testing doesn't replace unit tests — it complements them. Using unit tests to document the edge cases you already know about, and property tests to find the ones you don't, lets each do the job it's actually good at.

## How do you keep property-based tests stable in CI?

A test that generates random inputs looking "flaky" in CI — red one run, green the next — is a common worry, but the fix is straightforward: frameworks report the random seed used on every failing run. When Hypothesis finds a bug, it saves that example to a local database and retries these known failures first on every subsequent run, so a bug that's been found once keeps reappearing on every CI run until it's actually fixed, instead of randomly vanishing. fast-check and jqwik follow the same logic, logging the failing seed and letting you reproduce it exactly with a `seed` parameter locally.

A practical rule of thumb: keep the try count (`max_examples` or `tries`) lower in CI than in local development, and run a separate nightly job with a much higher count (10,000+) for deep scanning — that balances fast feedback against thorough coverage.

## Frequently Asked Questions

### Does property-based testing replace unit tests?

Short answer: no, they serve different purposes. Unit tests document known, specific edge cases; property-based tests discover edge cases the framework generates randomly that you hadn't reasoned about. Most teams use both together.

### How does shrinking actually work?

Short answer: when a property test fails, the framework progressively shrinks and simplifies the failing input, repeating that process until it finds the smallest example that still breaks the property. That usually leaves you debugging a single element or a handful of elements, not a random 40-element list.

### Should I start with Hypothesis or fast-check?

Short answer: use Hypothesis for a Python project and fast-check for a JavaScript or TypeScript project — both are the natural starting points for their ecosystems. Both support shrinking and integrate directly with your existing test runner (pytest, Jest/Vitest), so you don't need to learn a new test harness.

**Sources:** [jqwik user guide](https://jqwik.net/docs/current/user-guide.html), [Baeldung: Property-Based Testing with jqwik](https://www.baeldung.com/java-jqwik-property-based-testing), [Property-Based Testing in Practice: generators and stateful properties](https://www.trinitylogic.co.uk/blog/testing-property-based-testing-practice/).
