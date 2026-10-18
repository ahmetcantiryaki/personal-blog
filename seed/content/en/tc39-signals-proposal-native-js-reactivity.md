---
title: "The TC39 Signals Proposal: Native JS Reactivity"
slug: "tc39-signals-proposal-native-js-reactivity"
translationKey: "tc39-signals-proposal-2026"
locale: "en"
excerpt: "TC39's Signals proposal is at Stage 1: an early push for a shared, framework-agnostic reactive-state primitive built into JavaScript itself."
category: "web-development"
tags: ["frontend", "state-management", "web-standards", "performance"]
publishedAt: "2026-10-18"
seoTitle: "TC39 Signals Proposal Explained: Stage, Champions, Timeline"
seoDescription: "TC39's proposal-signals reached Stage 1 in 2026. Here's what signals are, who's behind the proposal, and why native reactivity is still years away."
---

The TC39 Signals proposal is an early-stage effort (Stage 1) to add a shared, framework-agnostic reactive-state primitive directly to the JavaScript language, instead of every framework shipping its own incompatible version. A signal is a container holding a value that automatically notifies whatever depends on it when the value changes — the mechanism already powering Preact Signals, SolidJS, Vue's reactivity system, Angular signals, Svelte runes, and MobX, each built separately today.

## What is a signal, concretely?

A signal is a small wrapper around a value with two parts: reading it registers a dependency, and writing it notifies every dependent that it needs to recompute. In pseudocode terms:

```javascript
const count = signal(0);
const doubled = computed(() => count.get() * 2);

effect(() => {
  console.log(`doubled is now ${doubled.get()}`);
});

count.set(5); // logs: "doubled is now 10"
```

No framework is required to understand this snippet conceptually — that's the point of standardizing it. Today, the exact API above exists in slightly different shapes across Preact Signals, Solid, Vue, Angular, and others, and none of them interoperate directly.

## Why do framework authors want a shared primitive?

Because today's fragmentation means a signal created inside one framework's reactivity system can't be consumed natively by another's. A Preact Signal and a Vue `ref` solve the same underlying problem with incompatible implementations, so any code that needs to work across both — a shared design-system library, a micro-frontend architecture mixing frameworks, or a utility library trying to be framework-neutral — ends up writing adapter layers or picking one framework's primitive and hoping consumers tolerate it.

A language-level signal would give every framework a common reactive core to build on top of, the same way every framework already shares `Promise`, `Map`, and `Array` instead of each defining its own. [State management choices already vary widely](/en/posts/react-state-management-comparison) across the React ecosystem alone; a native signals primitive wouldn't erase that choice, but it would mean the lowest-level reactive wiring could be shared infrastructure instead of competing implementations.

## What stage is the proposal at, and who's behind it?

The [proposal](https://github.com/tc39/proposal-signals) is at Stage 1 in the [TC39 process](https://tc39.es/process-document/) — the explainer stage, where the committee agrees a problem is worth solving and a general direction is worth exploring, well before any committed syntax or semantics. Credited champions advancing it include Daniel Ehrenberg, Yehuda Katz, Jatin Ramanathan, Shay Lewis, Kristen Hewell Garrett, Dominic Gannaway, Preston Sego, Milo M, and Rob Eisenberg.

A wide set of framework and library authors gave [design input](https://github.com/tc39/proposal-signals/blob/main/README.md) during its development, with people and projects connected to Angular, Ember, MobX, Preact, Qwik, RxJS, Solid, Svelte, Vue, and Wiz represented in the discussion. React is notably not among the named co-champions or the most visible design-input contributors — worth knowing if you assumed this was a pan-ecosystem effort with every major framework signed on equally.

| TC39 stage | What it means | Signals proposal status |
|---|---|---|
| Stage 0 | Strawman — an idea, no committee buy-in yet | Passed |
| Stage 1 | Explainer accepted — problem is worth solving | **Current stage** |
| Stage 2 | Draft spec text exists, committee expects it to land | Not yet reached |
| Stage 3 | Spec complete, implementers start building | Not yet reached |
| Stage 4 | Shipped in engines, ready for the ECMAScript spec | Not yet reached |

## How long until native signals actually ship in browsers?

Realistically, years. Even an optimistic estimate from commentary following the proposal's progress in 2026 puts it at a minimum of 2-3 years before anything native lands across browsers, and that's an informal estimate, not a committed timeline from TC39 — Stage 1 proposals can also stall indefinitely, change shape substantially at Stage 2, or never advance at all. The TC39 process intentionally moves slowly: each stage requires committee consensus, and Stage 3 alone typically means multiple engine implementations maturing in parallel before Stage 4.

## What would interop actually unlock if this ships?

Shared state across framework boundaries without adapter code — a genuinely useful case for micro-frontend architectures that mix frameworks on one page, design-system libraries that want to expose reactive primitives without picking a framework dependency, and any library author currently maintaining separate reactivity bindings for Vue, React-adjacent signal libraries, and Solid just to reach the same audience. [React Server Components](/en/posts/react-server-components-nextjs-15) and the broader push toward framework-agnostic rendering patterns both point at the same underlying motivation: less duplicated plumbing between ecosystems that otherwise overlap in what they're trying to do.

## What should you actually do about this today?

Nothing urgent — there's no new syntax to adopt, no polyfill to add, and no migration to plan, since Stage 1 carries no implementation commitment from any browser. The practical move is to keep using your framework's existing reactivity primitives exactly as you do now, and treat the proposal as a thing worth bookmarking rather than a roadmap item. If you maintain a library that currently ships separate reactive bindings for multiple frameworks, it's worth watching the repository for a Stage 2 advance specifically, since that's the point where concrete API shape would start to stabilize enough to plan around.

## Is cross-framework interop actually what most teams need?

My honest take: probably not for the average product team shipping inside one framework, where the practical value is closer to zero — you already have a reactivity system, and a native one years out doesn't change today's code. The real beneficiaries are library authors and teams running [HTMX-style or mixed-framework setups](/en/posts/htmx-vs-react-when-to-use), where one shared primitive removes a category of integration work that currently exists only because JavaScript never had a native answer. If you're not maintaining a library or bridging frameworks, this is worth tracking, not waiting for.

## Frequently Asked Questions

### What TC39 stage is the Signals proposal at right now?
The Signals proposal is at Stage 1, the explainer stage where TC39 has agreed the underlying problem — fragmented, incompatible reactivity implementations across frameworks — is worth solving, but no committed syntax or semantics exist yet. Stage 2 (draft spec text) and beyond haven't been reached.

### Is React involved in the TC39 Signals proposal?
React is not listed among the proposal's named champions or its most visible framework contributors; the design input documented during development comes primarily from people and projects connected to Angular, Ember, MobX, Preact, Qwik, RxJS, Solid, Svelte, Vue, and Wiz. That makes this closer to a broad-but-not-universal framework effort rather than a pan-ecosystem consensus.

### How is a TC39 signal different from a framework's own signal, like Preact Signals?
A native TC39 signal would work the same way conceptually — a value container that tracks dependents and notifies them on change — but it would live in the language itself, so any framework or library could consume it without an adapter. Preact Signals, Vue's reactivity, and similar systems today are separate, incompatible implementations of the same underlying idea.

### When will native JavaScript signals be usable in production?
There's no committed date. An informal 2026 estimate from commentary tracking the proposal suggests at least 2-3 years before anything native could ship across browsers, assuming the proposal keeps advancing through Stage 2, 3, and 4 without stalling — and Stage 1 proposals frequently do stall or change direction before reaching that point.
