---
title: "Optimistic UI With React's useOptimistic Hook"
slug: "optimistic-ui-with-reacts-useoptimistic-hook"
translationKey: "optimistic-ui-react-useoptimistic"
locale: "en"
excerpt: "Short answer: useOptimistic updates the UI before the server responds, hiding the wait, and automatically rolls the state back if the server rejects it."
category: "web-development"
tags: ["react", "nextjs", "frontend", "performance"]
publishedAt: "2026-10-29"
seoTitle: "How Do You Use React's useOptimistic Hook?"
seoDescription: "Here's how to pair useOptimistic with a Server Action to build a UI that updates instantly and rolls back correctly when the server rejects the request."
---

Short answer: `useOptimistic(state, updateFn)` updates the UI immediately, before the server responds, when called inside an Action, and automatically reverts the state to the real value once the result arrives or the operation fails. It requires React 19, and the call must happen inside an Action — otherwise the hook just returns the value you passed in unchanged.

## What exactly does optimistic UI hide?

When a user clicks a button, the 200–800 millisecond delay before the server responds creates a "did I click it, did it work" uncertainty if nothing on screen changes. Optimistic UI hides that delay by showing the "probably successful" outcome immediately, without waiting to ask the server — for easily reversible, high-success-probability actions like likes, to-do items, and comment submissions, that assumption is almost always correct.

It's worth stressing that this isn't "fake speed": the UI is predicting the real result the server will return, not inventing one. If the server rejects the request, `useOptimistic` rolls that prediction back and shows the user the real state — which is exactly why the hook is called "optimistic," not "fake."

## How does useOptimistic actually pair with a Server Action?

The `useOptimistic(value, reducer?)` signature takes the current state and an optional reducer function, and returns the `[optimisticState, setOptimistic]` pair. If no reducer is given, the value you pass to `setOptimistic` is used directly as the optimistic state; if a reducer is given, it needs to be a pure function that takes the current state and the action and computes the next optimistic state.

```tsx
"use client"
import { useOptimistic } from "react"
import { likePost } from "./actions"

type Post = { id: string; likes: number; likedByMe: boolean }

export function LikeButton({ post }: { post: Post }) {
  const [optimisticPost, setOptimisticPost] = useOptimistic(
    post,
    (state, newLiked: boolean) => ({
      ...state,
      likedByMe: newLiked,
      likes: newLiked ? state.likes + 1 : state.likes - 1,
    })
  )

  return (
    <form
      action={async () => {
        setOptimisticPost(!optimisticPost.likedByMe)
        await likePost(post.id, !optimisticPost.likedByMe)
      }}
    >
      <button type="submit">
        {optimisticPost.likedByMe ? "Liked" : "Like"} ({optimisticPost.likes})
      </button>
    </form>
  )
}
```

The critical detail here is that `setOptimisticPost` runs inside a `form action` that calls a Server Action — React recognizes this as an Action and shows the optimistic state until the real result arrives. Calling `setOptimistic` outside an Action doesn't trigger the hook's normal behavior.

## How does the temporary optimistic state reconcile with the server result?

Once the real value arrives from the server (in this example, when the `post` prop updates), React automatically swaps the optimistic state for the real state — you don't write a manual "cleanup" step. This reconciliation happens on its own once the Action completes and the component re-renders with real data; a `revalidatePath` call or similar revalidation refreshes that real data from the server, letting React drop its optimistic guess.

## How do you handle rollback and show an error on a failed request?

If the Server Action throws or returns a rejected result, the optimistic state automatically reverts to its previous (real) value — but that rollback shouldn't happen silently. Wrapping the Action in a `try/catch`, writing the error into a state variable, and showing that as a short error message next to the button answers the user's "why did my like disappear" question.

| Situation | What shows in the UI | Code side |
|---|---|---|
| Request succeeds | Optimistic state stays the same as real state | No extra work needed |
| Request fails | State reverts to its previous value | Set an error-message state in the `catch` block |
| Request is slow but succeeds | Optimistic state shows until the real result arrives | Default behavior |

## What can go wrong with rapid repeated clicks?

If a user clicks the like button three times in quick succession, three separate Actions fire, and their server responses don't always come back in the order they were sent — the second request can arrive after the third due to network latency. Since every `useOptimistic` call builds on the most current optimistic state, consecutive clicks usually accumulate correctly, but building server-side logic that's based on final state rather than request order (for example, using a boolean "liked: yes/no" instead of an incrementing counter) prevents a race condition.

The safest way to reduce this risk isn't disabling the button until the request completes — that defeats the whole point of optimistic UI — it's making the server-side mutation idempotent, so the same request arriving twice or out of order still lands on the correct final state. We ran into a similar async-state problem when [loading commands asynchronously in a React command palette](/en/posts/build-a-command-palette-cmd-k-in-react).

## How do you manage multiple optimistic updates on the same list?

When adding three items to a to-do list in quick succession, each `setOptimistic` call builds on the previous optimistic state, so the reducer needs to take the current state (the previous items) and append the new one to it — ignoring the `state` parameter and building a fresh array from scratch loses the previous optimistic additions. Writing the reducer to always build on the incoming `state` (something like `[...state, newItem]`) guarantees sequential additions accumulate correctly in a list like this.

The same logic applies to deletions: when optimistically removing an item from the list, the reducer needs to keep the other items in the current optimistic state and only filter out the target item. This keeps the list consistent when a user quickly deletes several items in a row.

## How do you test optimistic state with React Testing Library?

To verify the optimistic value appears on screen immediately after a button click — before the server responds — you need a mock Server Action in your test environment that deliberately delays (wrapped in a `setTimeout`, for instance), since that's the only way to test the gap between optimistic and real state without a real-time network request. Asserting the optimistic value synchronously right after `fireEvent.click`, then verifying the real value with `await waitFor`, captures both stages separately.

To test the failure path, make the mock Action throw an error, then verify both that the error message appears on screen and that the state reverts to its previous value. Teams that skip this test usually find out the rollback logic doesn't work in production from their first user complaint.

## Where is optimism actually dangerous?

Using optimistic UI for a payment, a balance update, or an irreversible deletion risks showing the user something that hasn't actually happened as if it had — saying "your payment went through" and then "actually it didn't" is a far more expensive trust break than "your like was reverted." For these actions, the right approach is to wait for server confirmation and communicate that wait with a clear loading indicator.

The practical rule: use optimistic UI when the action is easily reversible and the failure probability is low (95%+); wait when the action is irreversible or touches money or access. Thinking about this split alongside the form-submission patterns in [Server Actions: forms without API routes](/en/posts/server-actions-forms-without-api-routes) makes it easier to decide which forms can afford to be optimistic.

## Is testing the happy path enough?

No — most teams write a test for "does the count increase instantly when the button is clicked" and call it done, but the test that actually matters is the scenario where the server rejects the request: does the state actually revert, does the error message show, is the button re-triable? Shipping without testing this failure path leaves `useOptimistic`'s most important behavior — the rollback — unverified.

Pairing this hook with [advanced TypeScript patterns](/en/posts/advanced-typescript-patterns) to define the reducer's action type as a discriminated union catches passing the wrong action type at compile time as an app grows.

## Frequently Asked Questions

### When should you use useOptimistic?

Use it for easily reversible, high-success-probability actions like likes, adding a to-do item, or submitting a comment. For irreversible actions like payments or balance updates, waiting for server confirmation is the safer choice.

### Which React version does useOptimistic require?

It requires React 19 or Canary. The hook itself is framework-agnostic, but the Server Actions and `revalidatePath` usage in examples are Next.js-specific.

### What happens to the optimistic state if the server request fails?

React automatically reverts the optimistic state back to its previous (real) value. But that rollback shouldn't happen silently — catch the error and show the user a short message explaining what happened.

### Can rapid repeated clicks mess up the state?

Usually not, since each call builds on the most current optimistic state, but writing an idempotent server-side mutation that's based on final state rather than request order prevents a possible race condition.
