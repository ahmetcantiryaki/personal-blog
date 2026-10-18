---
title: "What Is Structured Concurrency? Python and JS in Practice"
slug: "structured-concurrency-explained-python-js"
translationKey: "structured-concurrency-explained-2026"
locale: "en"
excerpt: "Structured concurrency means a parent task can't finish until all its children do, and one child's failure cancels its siblings instead of leaking."
category: "software-engineering"
tags: ["python", "backend", "best-practices", "system-design"]
publishedAt: "2026-10-18"
seoTitle: "Structured Concurrency Explained: Python and JS Examples"
seoDescription: "Structured concurrency ties a parent task's lifetime to its children's. See Python's asyncio.TaskGroup and a JS AbortController pattern, side by side."
---

Structured concurrency means a parent task's lifetime strictly contains its children's: the parent cannot complete until every child task finishes, and if one child fails, its siblings are cancelled and the error propagates predictably to the parent. The opposite — unstructured, fire-and-forget tasks that can outlive their creator — is where leaked background work and swallowed exceptions usually come from.

## What problem does structured concurrency actually fix?

It fixes tasks that silently keep running, fail invisibly, or never get cleaned up after the code that started them has moved on. A classic bug: you call `asyncio.create_task()` or spin up a goroutine-style background job, the calling function returns, and if that task later throws, nothing is listening — the exception either vanishes into an event loop's default handler or crashes the whole process somewhere unrelated to where the bug actually is.

Nathaniel J. Smith's essay "Notes on structured concurrency, or: Go statement considered harmful" named this pattern and argued that unstructured concurrency primitives are the async equivalent of `goto`: technically powerful, but they make it impossible to reason locally about what a block of code can do, because a spawned task's lifetime isn't tied to any enclosing scope. His Trio library for Python was an early, influential implementation of the alternative.

## How does Python's asyncio.TaskGroup implement it?

[`asyncio.TaskGroup`](https://docs.python.org/3/library/asyncio-task.html#task-groups), added in Python 3.11, ties a set of child tasks to a single `async with` block: the block doesn't exit until every task inside it has finished, and if any task raises (other than `CancelledError`), the group cancels the remaining tasks and raises an [`ExceptionGroup`](https://docs.python.org/3/library/exceptions.html#ExceptionGroup) containing every failure collected, not just the first one.

```python
import asyncio

async def fetch_user(user_id: int) -> dict:
    await asyncio.sleep(0.1)
    if user_id == 3:
        raise ValueError(f"user {user_id} not found")
    return {"id": user_id, "name": f"user-{user_id}"}

async def fetch_all(ids: list[int]) -> list[dict]:
    results = []
    try:
        async with asyncio.TaskGroup() as tg:
            tasks = [tg.create_task(fetch_user(i)) for i in ids]
        results = [t.result() for t in tasks]
    except* ValueError as eg:
        for exc in eg.exceptions:
            print(f"failed: {exc}")
    return results
```

If `fetch_user(3)` raises, `TaskGroup` cancels the other in-flight fetches immediately instead of letting them keep running pointlessly, and `except*` (from [PEP 654](https://peps.python.org/pep-0654/)) lets you handle `ValueError` instances specifically while leaving other exception types to propagate. That selective handling by exception type, across potentially many simultaneous failures, is the part plain `try/except` around a list of awaited tasks can't give you cleanly.

## Does JavaScript have a built-in equivalent?

Not natively — JavaScript has no built-in primitive equivalent to `TaskGroup` that cancels sibling operations automatically on failure. The closest common pattern is a manual one: wire an [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) so a parent can cancel a group of child operations when one of them fails or when the parent itself needs to stop.

```javascript
async function fetchAll(ids) {
  const controller = new AbortController();
  const { signal } = controller;

  const tasks = ids.map(async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, { signal });
      if (!res.ok) throw new Error(`user ${id}: ${res.status}`);
      return await res.json();
    } catch (err) {
      controller.abort();
      throw err;
    }
  });

  return Promise.allSettled(tasks);
}
```

This approximates structured concurrency — one failure aborts the rest — but it's something you build by hand every time, not a language guarantee. `Promise.allSettled` waits for everything, `Promise.all` rejects on the first failure without automatically cancelling the others unless you wire the `AbortController` yourself, and nothing stops a future contributor from forgetting the abort call entirely.

## How do structured and unstructured concurrency actually compare?

The practical differences show up in exactly the failure cases teams debug at 2 a.m. — what happens to siblings, where errors surface, and whether a task can outlive the scope that created it.

| Property | Unstructured (fire-and-forget) | Structured (TaskGroup / coroutineScope / Swift TaskGroup) |
|---|---|---|
| Child task lifetime | Can outlive its creator | Bound to the enclosing scope |
| One child fails | Others keep running unaware | Siblings are cancelled |
| Error visibility | Easy to swallow silently | Propagates to the parent by default |
| Multiple simultaneous failures | Usually only the first is seen | Collected together (e.g. `ExceptionGroup`) |
| Cleanup guarantee | Manual, easy to forget | Enforced by the scope exiting |

Kotlin's coroutines (`coroutineScope`, `supervisorScope`) and Swift's concurrency model (`TaskGroup`, `async let`) are both widely cited as language-level implementations of the same underlying idea: a scope owns its children, and the scope can't close while any of them is still running.

## When is unstructured concurrency still the right call?

Rarely, but it exists for genuinely detached background work — a task whose purpose is specifically to outlive the request or function that triggered it, like a fire-and-forget audit log write or a best-effort cache warm-up where you've deliberately decided failure shouldn't affect the caller. Even then, it's worth attaching explicit error handling (a `.catch()` or a logged callback) so a failure is at least recorded, since structured concurrency's biggest practical benefit — making failure someone's responsibility — still applies even when you intentionally opt out of waiting for the result.

My honest take: most "fire-and-forget" tasks in production codebases aren't a deliberate design decision, they're a bug someone will eventually have to chase through logs, because nothing was watching when the task failed. If you're reaching for `asyncio.create_task()` or an unawaited promise without a specific reason to detach it, `TaskGroup` or an explicit `AbortController` pattern is very often the safer default — and the gap where JavaScript has no native equivalent is a real ergonomic cost compared to Python.

Teams that have already hit [common concurrency bugs](/en/posts/concurrency-bugs-how-to-avoid) tend to recognize this pattern immediately: half of those bugs are really "a task kept running after we stopped caring about it." The same discipline that makes [cache invalidation safer](/en/posts/caching-strategies-and-invalidation) — knowing exactly which operations are still in flight and who owns cleaning them up — is the same discipline structured concurrency enforces for async tasks. If you're also running [zero-downtime database migrations](/en/posts/zero-downtime-database-migrations), the same question applies: does every background step have an owner that's still watching it when it fails?

## Frequently Asked Questions

### What is structured concurrency in simple terms?
Structured concurrency means a parent task can't finish until all the child tasks it started have finished, and if one child fails, the parent cancels the rest instead of letting them run on uselessly. It replaces fire-and-forget tasks, whose failures and lifetimes aren't tied to anything, with tasks whose lifetime is bound to an enclosing scope.

### Does Python's asyncio.TaskGroup replace asyncio.gather()?
Not entirely, but it covers the common case better. `asyncio.gather()` can keep other tasks running after one fails unless you pass `return_exceptions=True` and handle errors yourself, while `TaskGroup` cancels siblings automatically on an unhandled failure and collects every exception into an `ExceptionGroup`, which `except*` can filter by type.

### Why doesn't JavaScript have a native TaskGroup like Python's?
JavaScript's `Promise` and `async`/`await` model was never built around a scope that owns cancellation of its children; cancellation was added later via `AbortController`, which you have to wire manually to each operation. There's no language-level primitive today that automatically cancels sibling promises when one fails, so teams build that behavior themselves.

### Is structured concurrency the same thing as Kotlin's coroutineScope or Swift's TaskGroup?
They implement the same underlying idea at the language level: a scope owns the lifetime of the tasks created inside it, and the scope can't exit while any child is still running. The exact cancellation and error-propagation details differ by language, but the core guarantee — a parent can't outlive-ignore its children — is the same pattern Python's `asyncio.TaskGroup` brings to async code.
