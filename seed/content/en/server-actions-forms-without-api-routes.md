---
title: "Server Actions: Forms Without API Routes"
slug: "server-actions-forms-without-api-routes"
translationKey: "react-server-actions-forms-2026"
locale: "en"
excerpt: "Short answer: React 19's Server Actions wire a form straight to a server function, with no separate API route, client-side fetch, or manual state to write."
category: "web-development"
tags: ["react", "nextjs", "frontend", "server-components"]
publishedAt: "2026-09-07"
seoTitle: "React Server Actions: Forms Without API Routes"
seoDescription: "How do you build a form with React 19 Server Actions? We cover useActionState, useFormStatus, Zod validation, and progressive enhancement with examples."
---

Short answer: React 19's Server Actions wire a form directly to a function that runs on the server, using `<form action={serverFunction}>`. You don't write a separate API route, call `fetch` on the client, or manage pending and error state by hand with `useState` — React handles all of that through `useActionState` and `useFormStatus`.

## What do Server Actions replace?

The old pattern usually needed three pieces for a single form submission: an API route handler, a client-side function that called `fetch` against that route, and hand-written state tracking pending and error status. Server Actions collapse all three into one function: mark it with the `'use server'` directive, pass it directly to a form's `action` prop, and React calls it on submit. React 19 shipped stable in December 2024; as of mid-2026 the latest patch is 19.2.7, with no React 20 announced — this API isn't "new" anymore, it's just what React is.

## How do you build a form end-to-end with useActionState?

`useActionState` takes an Action function and returns a wrapped Action plus the latest state; when the form submits, React calls that Action and manages pending state, errors, and optimistic updates on its own.

```tsx
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

export async function subscribe(prevState: unknown, formData: FormData) {
  const parsed = schema.safeParse({ email: formData.get('email') })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  await saveSubscriber(parsed.data.email)
  return { success: true }
}
```

```tsx
'use client'

import { useActionState } from 'react'
import { subscribe } from './actions'

export function SubscribeForm() {
  const [state, formAction, isPending] = useActionState(subscribe, {})

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <button disabled={isPending}>{isPending ? 'Submitting…' : 'Subscribe'}</button>
      {state?.error && <p role="alert">{state.error}</p>}
    </form>
  )
}
```

Notice there's no manual `fetch` call anywhere, and no `isLoading` state you wrote yourself — `isPending` comes straight out of `useActionState`'s third return value.

## When do you need useFormStatus, and how is it different from useActionState?

`useFormStatus` reads the status of the last form submission, and it can only be called from a component nested inside a form — never from the form itself. The real distinction: `useActionState` holds state in the parent component that triggers the form, while `useFormStatus` lets a component *nested inside* that form — one that has no direct knowledge of the action, like a shared `SubmitButton` — read that same status. In React 19, the object `useFormStatus` returns includes `data`, `method`, and `action` alongside `pending`; if you're not on React 19, only `pending` is available.

| Hook | Where it's used | What it returns |
|---|---|---|
| `useActionState` | The component that renders the form | `[state, formAction, isPending]` |
| `useFormStatus` | A component nested inside the form | `{ pending, data, method, action }` |
| `useOptimistic` | When you want the UI to update before the server responds | Optimistic state plus an update function |

## Does progressive enhancement actually work here?

Yes — even before JavaScript loads, `<form action={serverAction}>` behaves like a normal form submission to the browser, because Server Actions fall back to a standard form POST under the hood. That's a natural extension of the [React Server Components](/en/posts/react-server-components-nextjs-15) architecture: since server-side rendering is already the default, form submission follows the same default. On a slow connection, if a user submits before JS becomes interactive, the form still submits — the only thing missing is client-side enhancements like `isPending` and optimistic updates.

## Why should you still validate on the server?

Client-side validation exists only for user experience, not as a security boundary — any request to a form action can bypass the browser UI entirely and be sent directly. The rule is simple: never trust data coming from the client, and run schema validation (Zod, for example) at the top of every Server Action. The validation-schema approach from [React Hook Form + Zod: Accessible Forms](/en/posts/react-hook-form-zod-accessible-forms) applies here too — the difference is that the schema now runs at the first line of the Server Action instead of on the client.

## How do revalidation and optimistic updates work?

When a Server Action mutates data, React doesn't automatically refresh cached data — you call `revalidatePath` or `revalidateTag` for that. `useOptimistic` comes in when you want the UI to update immediately, before the server responds: pressing a "like" button, for instance, can bump the counter instantly without waiting for the server, and React automatically rolls the state back if the server returns an error. That's the form-mutation version of the "give the user feedback without waiting" principle covered in [Streaming AI Chat UIs in React](/en/posts/streaming-ai-chat-uis-react).

## What security mistake do people make with Server Actions?

The most common one is assuming a Server Action will only ever be called from its form, and skipping authorization checks as a result. In reality, a Server Action is an HTTP endpoint under the hood — it can be called directly with the right parameters, without ever going through the page that renders the form. Every Server Action needs a session check at the top, exactly as an API route would:

```tsx
'use server'

export async function deletePost(postId: string) {
  const session = await getSession()
  if (!session?.userId) {
    throw new Error('Unauthorized')
  }
  const post = await getPost(postId)
  if (post.authorId !== session.userId) {
    throw new Error('You cannot delete this post')
  }
  await deletePostFromDb(postId)
  revalidatePath('/posts')
}
```

Those three checks — is there a session, does the resource exist, does it belong to this user — are as necessary in a Server Action as they'd be in an API route. "I only show the form to logged-in users" isn't a security boundary, because not showing something in the UI doesn't make the endpoint uncallable.

## How do Server Actions coexist with an existing API route architecture?

Even in an app that moves most of its mutations to Server Actions, a public-facing API — a mobile client, a webhook, a third-party integration — still needs its own route, since Server Actions are tied to React's own form/mutation model and don't offer a general-purpose HTTP contract. The practical split: mutations triggered from the app's own UI (a form submission, a button click) go through Server Actions, and anything that needs to be called from outside goes through an API route. Using both models at once is a common, expected pattern, not an either-or choice.

| Scenario | Right tool |
|---|---|
| In-app form submission | Server Action |
| Endpoint a mobile app calls | API route |
| Webhook receiver | API route |
| Mutation triggered by a button click | Server Action |

## Frequently Asked Questions

### Which React and Next.js versions support Server Actions?

Server Actions are stable in React 19, in production since December 2024, and directly supported in the Next.js 15 App Router. As of mid-2026, the latest React patch is 19.2.7, and the API has stayed unchanged.

### Can I use useActionState and useFormStatus together in the same form?

Yes, they serve different purposes: `useActionState` holds state and pending status in the parent component that renders the form, while `useFormStatus` lets a shared child component nested inside the form — a submit button, say — read that status independently of the form's own logic.

### Do Server Actions make API routes completely unnecessary?

No, not entirely. Form mutations and in-page data changes need less code with Server Actions, but a general-purpose API meant to be called by a mobile app or a third-party client still needs its own dedicated route.

### If I already validate on the client, do I still need server-side validation?

Yes, absolutely. A request to a form action can be sent directly, bypassing the browser UI entirely, so client-side validation only improves the experience — it doesn't secure anything. Every Server Action has to validate incoming data from scratch on its own.
