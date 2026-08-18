---
title: "Concurrency Bugs and How to Avoid Them"
slug: "concurrency-bugs-how-to-avoid"
translationKey: "concurrency-bugs-mistakes"
locale: "en"
excerpt: "A data race is two threads touching the same memory unsynchronized; a race condition is broader, and atomic writes still need memory barriers to be visible."
category: "software-engineering"
tags: ["backend", "best-practices", "testing", "code-quality"]
publishedAt: "2026-08-18"
seoTitle: "Concurrency Bugs and How to Avoid Them"
seoDescription: "The exact difference between race conditions and data races, why atomic writes can still be invisible, and how to catch async bugs before they ship."
---

Short answer: adding `async` or spawning a goroutine does not make your code thread-safe. Awaiting a promise guarantees order, not protection of shared state — and JavaScript, despite its single thread, still produces race conditions through interleaving. Below: the exact mechanisms behind these bugs and how to catch them before merge.

## What's the difference between a race condition and a data race?

A data race happens when two or more threads access the same memory location, at least one access is a write, and there is no ordering between them — the compiler and hardware are then free to produce undefined behavior. A race condition is broader: the outcome depends on the relative timing of operations, and it can happen without a data race at all.

JavaScript runs on a single thread, so classic data races cannot occur — but between two `await` points, the event loop can run another task that mutates a shared object you're still holding a reference to. That's a race condition without a data race, since no two threads ever touch the same memory simultaneously. Rust draws this line explicitly: the Rustonomicon states plainly that Rust prevents data races, not race conditions. The borrow checker rejects concurrent mutable aliasing at compile time, but it cannot guarantee two threads message each other in the right logical order.

## How do deadlocks and livelocks actually happen?

A deadlock is two or more threads each waiting on a lock the other one holds, so all of them wait forever. A livelock is threads actively changing state to dodge the deadlock — repeatedly yielding to each other — but making zero forward progress. Both stall the system; deadlocked threads sit idle, livelocked threads burn CPU cycles going nowhere.

The textbook deadlock: thread A acquires lock-1 then wants lock-2, while thread B acquires lock-2 then wants lock-1. The standard fix is a global lock-ordering convention, or a `TryLock` with a timeout so a thread backs off. A livelock shows up when two threads detect contention, both politely retreat, then retry at the same instant, forever — fixed with random jitter before a retry so the two desynchronize.

## Why is shared mutable state the root cause of most concurrency bugs?

The root cause is simple: once more than one execution unit can read and write the same data without an enforced order, predicting the outcome becomes a function of scheduling, not logic. Remove the mutability, or remove the sharing by funneling access through a single owner, and most of this bug class disappears at the source.

That's why Rust's ownership model, Go's "do not communicate by sharing memory; share memory by communicating" philosophy, and immutable data structures in functional languages attack the same problem from different angles — they make shared mutable state either impossible or routed through one access point. This is also why [refactoring legacy code](/en/posts/how-to-refactor-legacy-code) so often starts by hunting down module-level mutable globals.

## Why doesn't an atomic write guarantee visibility to other threads?

Atomicity means an operation completes as one indivisible step; visibility means when another thread can actually observe that change — two separate guarantees. CPU core caches and compiler reordering mean a thread can atomically update a variable while another thread keeps reading a stale cached copy, unless a memory barrier forces the update to propagate.

This is why Go's `sync/atomic` package documents that its `Store` and `Load` functions establish a happens-before relationship: not just the value becomes visible, but every side effect that happened before the store. Java's `volatile` and C++'s `std::memory_order` solve the same problem in their own memory models. A plain `counter++` isn't even atomic — it's a read-modify-write in three steps — but even an atomic version leaves the other thread's timing for seeing the new value undefined without a memory barrier.

## What are the most common async/await footguns?

Three stand out: unawaited "fire-and-forget" promises, missing cancellation, and forgetting `await` inside a loop. All three produce silent bugs — the code runs, but ordering or the count of operations is wrong.

```javascript
// Wrong: missing await swallows errors and breaks ordering guarantees
async function saveOrder(order) {
  db.save(order) // no "await" — this promise is fire-and-forget
  return { status: 'saved' }
}

// Wrong: forEach's callback await is never awaited by the caller
async function notifyAll(users) {
  users.forEach(async (u) => {
    await sendEmail(u) // fires all emails in parallel, uncontrolled
  })
}

// Right: errors are handled, ordering and concurrency are explicit
async function notifyAllSafely(users) {
  const results = await Promise.allSettled(users.map(sendEmail))
  return results.filter((r) => r.status === 'rejected')
}
```

Node.js's event-loop documentation explains that the microtask queue (where promise callbacks live) drains completely between macrotasks — exactly why skipping one `await` can make code run far earlier or later than expected. Missing cancellation is the same bug class: a `fetch` with no `AbortController` keeps running after a user navigates away, and its `.then()` may try to update state on a component that no longer exists.

## Should I reach for a lock, a channel, or immutability?

Short answer: a lock for short, tightly scoped critical sections; a channel or actor to isolate units of work from each other; immutability when the data never needs to change after creation. All three solve the same problem but fail differently.

| Approach | When to use | Typical failure mode |
|---|---|---|
| Lock (mutex) | Protecting a short, shared critical section | Deadlock, forgotten unlock, contention bottleneck |
| Channel / actor (message passing) | Passing data or work between independent units | Backpressure (full channel), message ordering bugs |
| Immutability | Data that never changes, or is cheap to copy | Extra allocation/copy overhead |
| Atomic operations | A single counter or flag update | Wrong granularity, wrong visibility assumptions |

In Go, reaching for a channel instead of a `sync.Mutex` often produces less error-prone code, because the channel turns "who is allowed to touch this and when" into part of the type system rather than a convention developers must remember. See [message-passing pitfalls in event-driven architectures](/en/posts/event-driven-architecture-patterns) before committing to this at scale.

## How do I actually test concurrent code?

The reliable path runs through stress tests and automated race detectors, not deterministic unit tests, because race conditions depend on timing and won't necessarily show up on one run. Go's `go test -race` (or `go run -race`) instruments the binary with a ThreadSanitizer-based detector that flags unsynchronized shared-memory access at runtime; as of August 2026 it still ships built into the standard Go toolchain, and Uber has reported using it to find and fix over a thousand data races across tens of millions of lines of Go.

In practice, three things work: making `-race` mandatory in CI, running the same test hundreds of times in parallel (`go test -race -count=100`) to surface flaky-looking failures, and load tests that expose lock contention invisible at low concurrency. The isolation discipline from [writing effective unit tests](/en/posts/how-to-write-unit-tests) still matters, but isn't sufficient alone — a standard unit test doesn't control scheduling, so it can pass 999 times and fail on the thousandth production run.

My honest take: "I tested it manually, looked fine" proves close to nothing for concurrent code — race conditions surface in production, under load, once a month, not on your laptop. Merging concurrent code that has never run under a race detector is functionally the same as merging code with no tests.

## What should I check for concurrency bugs in code review?

Run through this any time a pull request touches shared state or `async`/`await`:

- Is this variable or object reachable from more than one goroutine, thread, or async task? If so, what protects it — a lock, a channel, or an atomic operation?
- Is every promise in this chain either awaited or explicitly handled with `.catch()`/`Promise.allSettled()`?
- Is `await` missing inside a loop, or is the parallelism intentional and expressed with `Promise.all()`?
- If multiple locks are acquired, is the acquisition order identical everywhere in the codebase?
- Does a long-running or cancellable operation actually respond to a `context.CancelFunc` or `AbortController` when the caller gives up?
- Does this change run under `-race` (or an equivalent detector) in CI, and does that job block merge?
- Could the shared state be removed entirely in favor of an immutable copy or a message-passing handoff?

Folding this into your normal [code review process](/en/posts/effective-code-reviews) catches most concurrency bugs before they reach a user.

## Frequently Asked Questions

### Is a race condition always a bug?

No — it's only a bug when the outcome's dependence on timing breaks correctness or data integrity. If it's genuinely irrelevant which of two independent workers logs first, that's a benign race condition, not something worth fixing.

### Can single-threaded JavaScript really have concurrency bugs?

Yes. JavaScript has no threads, but it has an event loop, and control can pass to another task at every `await` point. A shared variable read before one `await` and used after it may have been mutated by a different async function in between — a genuine race condition despite the single thread.

### Is a lock always the safest choice for shared state?

No — locks carry their own risks, including deadlock from inconsistent acquisition order and throughput bottlenecks under contention. Removing the sharing with immutability, or funneling access through one owner via message passing, is often more robust than adding another lock.

### Does Go's -race flag catch every concurrency bug?

No — `-race` only flags data races that actually execute during the run, so a code path never exercised in testing produces no warning. Deadlocks, livelocks, and pure logical race conditions without a data race need separate techniques: stress tests, timeouts, and static analysis.
