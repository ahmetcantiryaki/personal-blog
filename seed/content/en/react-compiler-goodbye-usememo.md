---
title: "React Compiler: Goodbye useMemo?"
slug: "react-compiler-goodbye-usememo"
translationKey: "react-compiler-explained"
locale: "en"
excerpt: "A codebase with 400 useMemo calls and still-broken re-renders is what pushed us to React Compiler 1.0. What it auto-memoizes, and where useMemo survives."
category: "web-development"
tags: ["react", "frontend", "performance", "developer-experience"]
publishedAt: "2026-07-16"
seoTitle: "React Compiler Explained: What Replaces useMemo in 2026"
seoDescription: "React Compiler 1.0 auto-memoizes most components at build time. See what it replaces, where useMemo survives as an escape hatch, and a safe rollout checklist."
---

We had 400-plus `useMemo` and `useCallback` calls across one dashboard codebase, and re-renders were still janky. Half the memoization was stale — dependency arrays nobody updated after a refactor — and the other half was defending against re-renders that weren't actually expensive. That's the exact problem React Compiler was built to end: it shipped stable at version 1.0 on [October 7, 2025](https://react.dev/blog/2025/10/07/react-compiler-1), and in the roughly nine months since, it's become the default recommendation for new React and React Native code.

## What the compiler actually does at build time

React Compiler is a build-time tool, not a runtime library — it runs as a Babel or SWC plugin during your build and rewrites components to memoize values and callbacks automatically, based on static analysis of what actually changes between renders. The output looks like hand-written `useMemo`/`useCallback` calls, except the compiler places them more precisely than most developers do by hand, including in cases manual memoization can't reach at all, like values computed after an early return.

```jsx
// What you write
function ProductCard({ product, onAddToCart }) {
  const formattedPrice = formatCurrency(product.price);
  const handleClick = () => onAddToCart(product.id);

  return (
    <div onClick={handleClick}>
      {product.name} — {formattedPrice}
    </div>
  );
}

// What the compiler effectively produces at build time —
// you never write this by hand anymore
function ProductCard({ product, onAddToCart }) {
  const formattedPrice = useMemo(() => formatCurrency(product.price), [product.price]);
  const handleClick = useCallback(() => onAddToCart(product.id), [onAddToCart, product.id]);
  // ...
}
```

The compiler memoizes in roughly 95% of the cases where manual memoization used to be the answer, according to the migration guidance that's accumulated since the 1.0 release. That leaves a real, if shrinking, 5% where you still need to think about it yourself.

## Where manual memoization still survives

The escape hatches that remain aren't edge cases you can ignore — they're the ones most likely to bite a team that deletes all memoization on faith:

- **Interior-mutability libraries.** Something like `react-hook-form`'s `watch()` API returns a value that mutates outside React's normal render cycle. The compiler's static analysis can't see that mutation coming, so code depending on it for reactivity still needs explicit `useMemo` or a subscription pattern.
- **Effect dependencies where reference stability is load-bearing.** If a `useEffect` depends on a callback and the effect's correctness depends on that callback *not* changing identity unless something meaningful changed, don't assume the compiler's inference matches your intent — verify it, or keep the explicit `useCallback`.
- **Anything the compiler bails out on.** The compiler detects patterns it can't safely optimize and skips them rather than guessing; those components silently fall back to no automatic memoization; the ESLint plugin flags bail-outs so they don't hide silently.

## The safe rollout: don't mass-delete existing memoization

The single most common mistake in the migration guides that circulated after the 1.0 release: ripping out every existing `useMemo`/`useCallback` call the day you turn the compiler on. Don't. Removing existing memoization can change the compiler's output in subtle ways, and if an effect relies on a callback's reference stability as a dependency, deleting the manual memoization before confirming the compiler preserves that stability can cause the effect to over-fire — a regression that's much harder to spot than a missing optimization.

The staged rollout that's held up in production:

1. **Enable the compiler on new code first.** Ship it in a branch of the codebase you're not simultaneously trying to migrate.
2. **Upgrade `eslint-plugin-react-hooks`** to the compiler-aware version — it now flags patterns the compiler can't safely optimize, which is your early-warning system before a bail-out surprises you in production.
3. **Leave existing memoization in place initially.** Let the compiler layer on top; don't delete anything until you've verified behavior with real testing.
4. **Pin the compiler version during rollout** and run your full end-to-end suite before bumping it, the same discipline you'd apply to any build-tool upgrade.
5. **Remove manual memoization incrementally**, component by component, once you've confirmed the compiler's output is stable for that component.

```json
// .eslintrc — compiler-aware lint rule catches bail-outs
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/react-compiler": "error"
  }
}
```

| Before React Compiler | After React Compiler |
|---|---|
| Manual `useMemo`/`useCallback` everywhere | Compiler infers memoization automatically |
| Stale dependency arrays cause silent bugs | No dependency array to go stale |
| Memoization skipped after early returns | Compiler memoizes past early returns too |
| Reviewers argue over memoization style | Style question mostly disappears |
| `react-hooks/exhaustive-deps` lint warnings | `react-hooks/react-compiler` flags bail-outs |

## Where this fits with the rest of your stack

If you're also weighing [React Server Components in Next.js 15](/en/posts/react-server-components-nextjs-15), it's worth knowing the compiler applies to client components — Server Components don't re-render on the client at all, so there's nothing for the compiler to optimize there. And if you're deciding between [state-management approaches](/en/posts/react-state-management-comparison) or reaching for [React Hook Form with Zod](/en/posts/react-hook-form-zod-accessible-forms), the compiler doesn't replace state-management judgment — it just removes the tax you used to pay for memoizing derived values correctly.

My take, unpopular with the "delete it all" crowd: treat React Compiler as a very good assistant, not an oracle. It gets memoization right dramatically more often than a team hand-rolling it under deadline pressure ever will, but "dramatically more often" isn't "always," and the failure mode when it's wrong — an effect over-firing because a reference changed identity when your code assumed it wouldn't — is exactly the kind of bug that's expensive to trace back to a memoization removal three sprints later. Keep the eslint rule on, keep testing during rollout, and let the 5% stay a deliberate decision, not an accident.

## Frequently Asked Questions

### When did React Compiler become stable?

React Compiler reached version 1.0, its first stable release, on October 7, 2025. It's now the standard recommendation for new React and React Native projects.

### Do I still need useMemo and useCallback?

Rarely for new code — the compiler handles roughly 95% of cases automatically. You still need them as an explicit escape hatch for interior-mutability libraries and effects where reference stability is load-bearing and must be guaranteed rather than inferred.

### Is it safe to delete all my existing useMemo calls after enabling the compiler?

No. Removing existing memoization can subtly change the compiler's output, especially for effects that depend on a callback's reference stability. Remove it incrementally, component by component, after verifying behavior with real testing — not all at once on day one.

### Does React Compiler help with Server Components?

Not directly. Server Components render on the server and don't re-render on the client, so there's no client-side memoization for the compiler to optimize there. The compiler's gains apply to client components.
