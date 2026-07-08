---
title: "Signals in Frontend Frameworks, Explained"
slug: "frontend-signals-explained"
translationKey: "frontend-signals-explained"
locale: "en"
excerpt: "Signals are a fine-grained reactivity model: only the changed value updates, no virtual-DOM diffing. Here's how Solid, Angular, Preact, and Svelte 5 use it."
category: "web-development"
tags: ["frontend", "react", "performance", "state-management"]
publishedAt: "2026-07-08"
seoTitle: "Signals in Frontend Frameworks, Explained (2026)"
seoDescription: "What are signals in frontend frameworks, and how do they differ from virtual-DOM diffing? Compare Solid.js, Angular, Preact, and Svelte 5 runes for 2026."
---

Signals are a fine-grained reactivity primitive: instead of re-running a whole component and diffing the result against the previous tree, a signal updates only the exact DOM node that actually depends on the value that changed. As of July 2026, nearly every major framework except React — Solid.js, Angular, Preact, and Svelte 5 — has rebuilt its state model around this idea, because it delivers the same update precision without paying for virtual-DOM diffing.

## What problem was virtual-DOM diffing solving?

React's original 2013 pitch was simple: describe the UI as a function of state instead of touching the DOM by hand, and let the framework figure out the difference. In practice, that means every state change re-runs the component function, produces a new virtual tree, diffs it against the previous one, and patches only the parts of the real DOM that changed. That solved the fragility of manual DOM manipulation, but it introduced a new cost: bump a single counter by one, and the component that owns it — often its entire subtree — re-runs anyway. The diffing algorithm itself is fast, but the real expense is re-rendering dozens of child components that never actually changed. React's answer has long been `useMemo`, `useCallback`, and `React.memo`, which shifts the cost from the runtime to your own cognitive load.

## Signals vs. virtual-DOM diffing: two different reactivity models

Virtual-DOM diffing is pull-based: state changes, the component re-runs, and the framework compares the result to the old tree to find the difference. Signals are push-based: a signal already knows who reads it. When you use a signal called `count` inside a text node, the framework records that dependency at compile time or on first run. When the signal changes, there's no diffing step, because the framework already knows exactly which node needs updating. As [Solid's own documentation puts it](https://docs.solidjs.com/concepts/signals), this means a Solid component function typically runs only once — the very notion of a "re-render" mostly disappears.

## Why does fine-grained reactivity mean fewer, smaller re-renders?

Because the component never re-runs, there's no need for the `memo`/`useCallback` dance either — the update is already routed straight to the changed expression. Independent benchmarks comparing Solid.js against React on list-heavy workloads report DOM mutation counts dropping by orders of magnitude: where React might touch tens of thousands of nodes updating a large table, a signal-based approach touches only the cells that actually changed. The mechanism is simple: update cost now scales with the number of things that actually changed, not with the size of the component tree. That gain isn't universal, though — more on that below.

## How do Solid.js, Angular, Preact, and Svelte 5 runes compare?

All four use the word "signal," but the API shape and how well they interoperate with existing patterns differ quite a bit:

| Framework | API shape | Reactivity granularity | Interop with existing patterns |
|---|---|---|---|
| Solid.js | `createSignal`, `createMemo`, `createEffect` | Fully fine-grained; no virtual DOM, component runs once | Deeply embedded in JSX; looks like hooks but behaves differently |
| Angular | `signal()`, `computed()`, `effect()` | Opt-in fine-grained, replacing zone.js-based change detection | Templates track dependencies automatically; coexists with RxJS |
| Preact Signals | `signal()`, `computed()`, `.value` access | Opt-in; only code that reads `.value` subscribes | Sits alongside hooks; portable to React via `@preact/signals-react` |
| Svelte 5 (runes) | `$state`, `$derived`, `$effect` | Compiler-generated fine-grained updates | Replaced Svelte 3/4's implicit reactivity; also works in `.svelte.js` files |

The [official Angular signals guide](https://angular.dev/guide/signals) is explicit that the goal is to gradually supersede zone.js-based change detection. The [Preact signals guide](https://preactjs.com/guide/v10/signals/) makes a related point: passing a signal down as a prop passes only a reference, not a value, so an update can flow straight to the deepest consumer without re-rendering any component in between.

## The mental-model shift for developers coming from useState

If you grew up on `useState`, you assume that a state change re-runs the whole component, so you spend effort containing that cost with `useMemo` and dependency arrays. Signals drop that assumption entirely: the component function typically sets up once, and whatever expression reads the signal subscribes and updates on its own. That's a genuinely different axis from the `useState`/`useReducer`/context debate we cover in [our comparison of React state management approaches](/en/posts/react-state-management-comparison) — the question there is "where does state live," while the question with signals is "which expression subscribes to which value." The most common migration trap is destructuring a store or prop: in Solid, writing `const { count } = props` silently breaks tracking, because `count` is now a plain value, not a signal.

The first time I ported a small React component to Solid.js, I kept my old `useState` reflex and tried to recreate everything inside the component body on every pass, then spent a while confused about why the signal seemed "frozen." Looking back, I'd say the real difficulty isn't learning a new API at all — it's giving up the assumption that a component body is a function that reruns on every render.

## A small concrete example: the same counter, two signal APIs

Writing the same trivial counter in Solid.js and Svelte 5 runes shows how each arrives at the same destination — a world where the component function never reruns and only the text node updates — by a different route:

```jsx
// Solid.js — counter
import { createSignal } from "solid-js";

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(count() + 1)}>
      Clicked {count()} times
    </button>
  );
}
```

```svelte
<!-- Svelte 5 (runes) — same counter -->
<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>
  Clicked {count} times
</button>
```

In Solid, `Counter` runs exactly once; when the JSX compiles, `count()` gets wired directly to the relevant DOM text node. In Svelte, `$state` tells the compiler "track this," and the compiler emits code that updates only that text node when `count++` runs, as [Svelte's runes documentation](https://svelte.dev/docs/svelte/what-are-runes) explains. In both cases, the `button` element itself is never recreated — only the one thing that actually changed gets touched.

## When are signals overkill?

For a small form, a handful-of-fields admin panel, or any app that never builds an expensive render tree in the first place, adopting signals adds conceptual overhead without a payoff: you now have to think about which values to wrap, avoid destructuring pitfalls, and learn a new store API. If re-render cost was never a real bottleneck, `useState` plus the occasional `memo` is still perfectly fine. This lines up with the same "pick the simplest tool" principle we discuss in [HTMX vs. React: when to use each](/en/posts/htmx-vs-react-when-to-use) — reach for signals where profiling actually shows re-render cost, like large lists, live dashboards, or frequently updating editors. In a small app, it's not a solution, just added complexity.

That conclusion tracks with the rest of our architecture coverage in [Web Development](/en/category/web-development): a new primitive is never automatically the right tool — it's the right tool for a specific problem.

## Frequently Asked Questions

### Does React have signals too?

No. React hasn't officially adopted the signals model; instead it bet on the React Compiler, which performs automatic memoization at build time. Community libraries like `@preact/signals-react` can bolt signal-like behavior onto React, but that isn't React's own API.

### Do signals replace useState entirely?

No. They play different roles in different frameworks: `useState` remains the default inside React, while signals form the core reactivity model for frameworks like Solid, Angular, Preact, and Svelte. There's no requirement to "migrate" an existing React app to signals.

### Are signals always faster?

No. In small apps that rarely re-render, the difference is imperceptible, and fine-grained tracking can even add a small, unmeasurable amount of overhead. The payoff shows up in large lists, live data, and trees with genuinely expensive re-render costs.

### Do I have to migrate an existing app to signals?

No, adoption can be incremental. Preact signals can be used opt-in alongside existing hooks code, and Angular lets signals and RxJS coexist. A full rewrite usually isn't necessary.
