---
title: "HTMX vs React: When Do You Actually Need React?"
slug: "htmx-vs-react-when-to-use"
translationKey: "htmx-vs-react"
locale: "en"
excerpt: "Most CRUD apps don't need a SPA. Here's how bundle size, the hypermedia model, and HTMX 4.0's built-in View Transitions change the React calculus."
category: "web-development"
tags: ["htmx", "react", "frontend", "web-performance"]
publishedAt: "2026-07-08"
seoTitle: "HTMX vs React: When Do You Actually Need React?"
seoDescription: "Most CRUD apps don't need a SPA. Here's how bundle size, the hypermedia model, and HTMX 4.0's built-in View Transitions change the React calculus."
---

Most CRUD apps do not need React. If you are building a screen that submits a form, filters a list, or mostly displays data that already lives on the server, the answer is straightforward: htmx does the job with fewer dependencies and less long-term maintenance. React earns its keep when rich client state, offline support, or genuinely complex interactivity sit at the center of the product. Here is the comparison as it stands in July 2026.

## Two different mental models: hypermedia vs components

React's mental model is well understood: state lives on the client, the UI is a function of that state, and every change triggers a virtual DOM recalculation that gets diffed against the real DOM. The application's "brain" sits in the browser; the server is usually reduced to a JSON-returning API.

htmx runs on a different contract entirely: hypermedia. The server renders HTML fragments, the client requests them through attributes like `hx-get` and `hx-post`, and `hx-swap` drops the result into the right spot in the DOM. State mostly stays on the server — the client only has to answer "which HTML fragment goes where." It is a much closer match to the original idea of transferring application state through hypermedia, a principle the React ecosystem has largely abandoned in practice.

The snippet below shows the same task solved two different ways: clicking a button to pull a fresh user list from the server.

```html
<!-- htmx: the server returns HTML, the client just drops it in -->
<button hx-get="/users" hx-target="#user-list" hx-swap="innerHTML">
  Refresh List
</button>
<div id="user-list"></div>
```

```jsx
// React: the client fetches JSON and computes its own DOM
function UserList() {
  const [users, setUsers] = useState([]);
  const refresh = async () => {
    const res = await fetch('/api/users');
    setUsers(await res.json());
  };
  return (
    <>
      <button onClick={refresh}>Refresh List</button>
      <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </>
  );
}
```

In the htmx example, the rendering logic lives in exactly one place: the server. In the React example, that same rendering logic gets rewritten a second time on the client. It looks trivial at this scale, but that duplication compounds into real maintenance cost once you have dozens of screens.

## Bundle size: the numbers don't lie

Most performance debates stay abstract until you look at the actual numbers. [htmx.org](https://htmx.org/) lists the library at roughly 14KB minified and gzipped; React plus React DOM together weigh in around 42KB — nearly a 3x gap before you write a single line of application code.

| Metric | htmx | React (+ React DOM) |
|--------|------|----------------------|
| Core library size | ~14KB (min+gzip) | ~42KB (min+gzip) |
| Typical production bundle | 14–30KB | 200–500KB (with router, state management, dependencies) |
| Mental model | Hypermedia / server-driven | Component / client-driven |
| Learning curve | Low (HTML attributes) | Moderate-to-high (JSX, hooks, state management) |
| Best fit | CRUD, form-heavy, content-driven sites | Rich client state, offline, complex interactivity |

The gap widens further at hydration: a React app has to download, parse, execute, and "wake up" its JavaScript before the first meaningful paint. htmx skips most of that step because the server already ships ready-to-use HTML. As we cover in our [Core Web Vitals checklist](/en/posts/core-web-vitals-checklist), INP and LCP are exactly the metrics that suffer from this download-parse-execute chain — shrink the bundle, and those metrics tend to improve on their own.

## HTMX 4.0: View Transitions are now the default

HTMX 4.0, released in July 2026, also modernized the library's architecture. According to [InfoWorld's coverage](https://www.infoworld.com/article/4150864/htmx-4-0-hypermedia-finds-a-new-gear.html), the release drops the legacy XHR transport layer entirely in favor of the modern Fetch API, which enables real HTML fragment streaming over `ReadableStream`. More notably for this comparison, the browser's native [View Transitions API](https://htmx.org/essays/view-transitions/) is now wired up by default, with zero extra CSS or JavaScript required.

In practice, that means an `hx-swap` can now animate into a smooth transition automatically. The manual `document.startViewTransition()` calls we walked through in our [guide to the View Transitions API](/en/posts/view-transitions-api-how-to) are, at least on the htmx side, no longer something you have to wire up by hand. Getting the same effect in React still requires an extra library or hand-rolled transition logic.

## Where React is still the right call

This piece is making the case for htmx, but let's be honest about where React genuinely wins:

- **Rich client state**: A spreadsheet-style editor, a kanban board, or a multi-step wizard where most of the screen needs to stay internally consistent without a round trip to the server — that is React's home turf. Tools like Zustand and Jotai, which we cover in our [React state management comparison](/en/posts/react-state-management-comparison), earn their complexity here.
- **Offline support**: Apps that sync through service workers and must keep working without a network connection need state that lives on the client by design; htmx's server-driven model does not naturally support that.
- **Complex interactivity**: Drag-and-drop, real-time collaborative editing, canvas-based editors — high-frequency, low-latency interactions are still React's (or a comparable component framework's) territory.
- **If you've already invested in Next.js**: As we cover in our [React Server Components guide](/en/posts/react-server-components-nextjs-15), Next.js 15's server components already claw back a meaningful chunk of React's bundle disadvantage. If your team is deep in that ecosystem, the migration cost to htmx can outweigh the gain.

The short version: React wins where the client genuinely needs complex, self-contained state. It loses where the job is really just displaying and editing data that already lives on the server.

## What the numbers actually say: State of JS 2025

This is not just an opinion. The [State of JS 2025 survey](https://2025.stateofjs.com/en-US/libraries/front-end-frameworks/) shows React usage still on top at 83.6%, while its satisfaction score dropped to its lowest point on record — growing ecosystem complexity is the most commonly cited reason. In the same survey, htmx kept its place among the tools developers rate as "most admired" once they have actually used it. Usage rankings barely moved year over year — Alpine.js and htmx were the only two frameworks that swapped positions — and satisfaction rankings stayed largely stable too, which means htmx's high satisfaction is not a fluke; it is a multi-year pattern. That is a clean demonstration that high usage and high satisfaction are not the same thing.

## Decision checklist

Ask these questions before you pick a stack for your next project:

1. Do most screens display server data through forms and lists? Lean htmx.
2. Does a large chunk of client state need to stay consistent without a network round trip (kanban, editor, wizard)? Lean React.
3. Do you need offline support or PWA sync? React (or a comparable client framework) is close to mandatory.
4. Is the team already deep into Next.js/React, using React Server Components? Weigh the migration cost before jumping ship.
5. Do you want animated page transitions without writing extra JavaScript? HTMX 4.0's built-in View Transitions support is a real edge here.
6. Is bundle size and page-load performance (FCP, LCP) a top priority? htmx's 14KB footprint is a meaningful advantage.

If most of your answers point to htmx, you probably do not need React at all. The same theme keeps showing up in our [Astro vs Next.js comparison](/en/posts/astro-vs-nextjs) and our piece on [SSR vs SSG vs ISR](/en/posts/ssr-vs-ssg-vs-isr): the right tool is the least complex one that actually matches what the project needs.

## Frequently Asked Questions

### Can htmx fully replace React?

No, and that was never the goal. htmx offers a simpler, lighter approach for server-driven, form-and-list-heavy applications than React does. But for apps that need rich client state, offline sync, or complex interactivity like a canvas-based editor, React's component model is still the better fit.

### How does htmx affect SEO?

Generally in a positive way. Because htmx returns full HTML from the server, search engines can see the content without executing JavaScript. React apps need server-side rendering (SSR) or static generation (SSG) to get the same result; otherwise the content simply is not there until the browser runs the JavaScript.

### Can I add htmx to an existing React project incrementally?

Yes. htmx can be scoped to specific parts of a page — a single form or table component, for example — without touching the rest of a React app. Many teams migrate this way: new CRUD screens get built in htmx while existing, more complex React screens stay exactly as they are.

### Do I need to change my existing htmx code to move to HTMX 4.0?

In most cases, no — your `hx-*` attributes stay the same. The real change is the transport layer moving from XHR to the Fetch API and View Transitions support being turned on by default, both of which work without breaking your existing markup. If you wrote custom JavaScript extensions, it is worth reviewing the Fetch-based event model once.
