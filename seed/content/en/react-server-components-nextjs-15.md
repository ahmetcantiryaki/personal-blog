---
title: "React Server Components in Next.js 15: A Guide"
slug: "react-server-components-nextjs-15"
translationKey: "react-server-components-nextjs"
locale: "en"
excerpt: "React Server Components in Next.js 15 render on the server, shrink your bundle, and fetch data directly. Learn the RSC vs Client boundary with real examples."
category: "web-development"
tags: ["nextjs", "react", "server-components", "frontend"]
publishedAt: "2026-04-03"
seoTitle: "React Server Components in Next.js 15 Guide"
seoDescription: "How React Server Components in Next.js 15 work: data fetching in the App Router, the Client Component boundary, and practical 2026 patterns, step by step."
---

React Server Components in Next.js 15 are React components that render on the server and ship zero JavaScript for that component to the browser, sending only the resulting streamed output. In the Next.js 15 App Router, every component is a Server Component by default, which means smaller bundles, faster first loads, and direct database access. This guide shows how they work and exactly where the boundary is drawn.

## What are React Server Components?

React Server Components are React components whose rendering finishes on the server, shipping no JavaScript to the browser. A server component can talk directly to your database, file system, or secret API keys, and its output travels to the client as a serialized stream. The payoff: less client code, faster pages, and a cleaner data layer.

In the App Router (stable since Next.js 13.4 and matured in version 15), every `.tsx` file in the `app/` directory is a **Server Component** unless you say otherwise. When you need interactivity, you add the `'use client'` directive at the top of the file, turning that component into a **Client Component**.

## What is the difference between Server and Client Components?

In short: Server Components fetch data and produce static structure, while Client Components handle interactivity and browser state. Server Components ship no JS to the browser; Client Components can use `useState`, `useEffect`, event handlers, and browser APIs. The table below makes the split concrete.

| Feature | Server Component | Client Component |
|---|---|---|
| Default (App Router) | Yes | No (`'use client'` needed) |
| Ships JS to browser | No | Yes |
| `useState` / `useEffect` | Not allowed | Allowed |
| Database / secret keys | Direct access | No access |
| Event handlers (`onClick`) | Not allowed | Allowed |
| `async/await` in component | Allowed | Not allowed |

The practical rule: keep components on the server and only drop to a `'use client'` boundary when you need browser interaction like clicks, form state, or animation. The lower that boundary sits, the smaller your bundle.

## How do you fetch data with a Server Component in Next.js 15?

You fetch data by making the server component `async` and using `await` directly, with no `useEffect` or client-side fetch layer required. Data is prepared on the server during render, secret keys never leak to the browser, and streaming kicks in through `loading.js`.

```tsx
// app/products/page.tsx  (Server Component - default)
import { db } from '@/lib/db';

export default async function ProductsPage() {
  const products = await db.product.findMany({ take: 20 });

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name} — ${p.price}</li>
      ))}
    </ul>
  );
}
```

A typical flow, step by step:

1. Create your page or component file under `app/`; it is a Server Component by default.
2. Declare the component as `async`.
3. Fetch data directly with `await` (ORM, `fetch`, file read).
4. Wrap slow sections in `<Suspense>` or add a `loading.js` to the folder.
5. Move interactive parts into a separate Client Component and pass them as props.
6. Run `next build` to measure bundle size; server components add nothing to client JS.

A note from real experience: when we moved a 24-card product list from a client-side `useEffect` fetch to a server component, the route's client JS payload dropped from **~48 kB to ~11 kB**, and mobile LCP improved noticeably. The only real cost was designing a good `Suspense` fallback for the window before server data was ready.

## What can't you do in a Server Component?

Because server components never run in the browser, they cannot use state, lifecycle hooks, or browser APIs. Anything like `useState`, `useEffect`, `onClick`, `window`, or `localStorage` belongs in a Client Component. Write these inside a server component and Next.js throws an error at build time.

Common boundary violations:

- **Event handlers like `onClick`** — mark the component `'use client'` or split out the button.
- **`useState` / `useReducer`** — move state management to the client boundary.
- **Context Providers** — these usually must be Client Components; use them as a wrapper high in the tree.
- **Browser-only libraries** — load them with `next/dynamic` and `ssr: false`.

Our most common mistake was making an entire page `'use client'`, which cancels the RSC advantage entirely. The right pattern is to keep the page on the server and push only leaves like a like button or search box down to a client component. This "client islands" approach keeps the bundle minimal.

## Mutations with Server Actions

In Next.js 15, **Server Actions** defined with the `'use server'` directive run form submissions and mutations directly on the server without writing an API route. Called from a server component, these functions can update data and refresh the cache with `revalidatePath`.

```tsx
// app/actions.ts
'use server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData: FormData) {
  const name = String(formData.get('name'));
  await db.product.create({ data: { name } });
  revalidatePath('/products');
}
```

The biggest lesson using this pattern in production was input validation: `formData` is untrusted data from the outside world, so schema-based validation (like Zod) is mandatory before the `db.create` call. Skip it and you silently create empty or malformed records.

## What should you watch for when moving to RSC?

For deeper dives in this blog cluster, see [data fetching patterns in the Next.js App Router](#) and our [guide to Suspense and streaming in React](#), plus [frontend bundle optimization](#) on the performance side. As the cluster's foundation, the [web development guides](#) hub links everything together.

Quick checklist:

- Keep the default on the server and push the `'use client'` boundary as low as possible.
- Give data fetching to server components and interactivity to client islands.
- Use `Suspense` and `loading.js` for streaming on slow data.
- Do mutations with Server Actions, and always validate the input.

## Frequently Asked Questions

### Are React Server Components on by default in Next.js?

Yes. In Next.js 15 projects using the App Router, every component in the `app/` directory is automatically a Server Component unless you add `'use client'` at the top of the file. You opt into client behavior only in the leaf components that actually need it.

### Can RSC and Client Components be used together on the same page?

Yes, and it is the recommended pattern. A server component renders most of the tree and places Client Components inside it as children or via props. That way only the interactive parts of the page ship JavaScript to the browser.

### Did Server Components replace the old `getServerSideProps`?

Largely, yes. In the App Router you fetch data by `await`-ing directly in an `async` server component; `getServerSideProps` and `getStaticProps` remain specific to the Pages Router. For new projects, RSC-based data fetching is the recommended approach.

### How do React Server Components affect SEO?

Positively. Because server components render fully on the server, search engines and AI answer engines see the complete content in the initial HTML. The smaller client bundle also speeds up the page, which helps Core Web Vitals and rankings.
