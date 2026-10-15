---
title: "Taming a Legacy Codebase: The Strangler-Fig Way"
slug: "taming-legacy-codebase-strangler-fig"
translationKey: "legacy-codebase-strangler-fig-2026"
locale: "en"
excerpt: "Tame a legacy codebase by growing a new system around the old one and routing traffic to it incrementally, using Fowler's strangler-fig pattern."
category: "software-engineering"
tags: ["legacy-code", "refactoring", "ai-coding", "testing", "software-architecture"]
publishedAt: "2026-10-15"
seoTitle: "Taming a Legacy Codebase: The Strangler-Fig Way"
seoDescription: "Tame a legacy codebase by growing a new system around the old one and routing traffic to it incrementally, using Fowler's strangler-fig pattern."
---

Short answer: you tame a legacy codebase by growing a new system around the old one and redirecting traffic to it piece by piece, never by stopping the world for one giant cutover. This is Martin Fowler's strangler-fig pattern. It avoids the scope creep, feature-parity traps, and stalled rewrites that kill most big-bang migrations before they ship.

## Why Do Big-Bang Rewrites Fail?

Big-bang rewrites fail because they trade a known, working system for an unknown, unproven one on a single flag day, and the longer that bet takes to pay off, the more it costs to keep losing it. Four failure modes show up again and again.

**Scope creep.** A rewrite that starts as "rebuild the checkout service" becomes "also fix the data model, also switch frameworks, also redesign the admin panel," because once you are touching everything, stopping at the original boundary feels arbitrary.

**The feature parity trap.** The new system must replicate every quirk of the old one, including the undocumented edge cases nobody remembers deciding on, before anyone will agree to cut over. Parity work has no natural finish line.

**The second-system effect.** Fred Brooks named this in *The Mythical Man-Month*: teams rebuilding a system they know well tend to over-design the replacement, adding every feature they wished the first version had. The second system becomes slower to ship than the first one was.

**Business pressure to run both.** While the rewrite drags on, the business still needs new features in the old system, so two codebases absorb the same engineering hours that one was supposed to need. For a deeper look at safe, incremental refactoring techniques, see [How to Refactor Legacy Code Safely](/en/posts/how-to-refactor-legacy-code).

## What Is the Strangler-Fig Pattern?

The strangler-fig pattern is an incremental migration strategy, named by Martin Fowler after a vine that grows around a host tree and gradually replaces it, where a new system grows around an old one and takes over its responsibilities piece by piece instead of in one cutover. Fowler described it in a [2004 bliki post](https://www.martinfowler.com/bliki/StranglerFigApplication.html), later retitled "Strangler Fig Application."

In practice, a facade or router sits in front of the legacy system. New functionality, and eventually migrated old functionality, lives behind that facade in the new system. Traffic shifts route by route or feature by feature, so at any point in the migration, the application is a working mix of old and new code. This is the same incremental mindset behind decomposing a [monolith into services](/en/posts/microservices-vs-monolith): you decide what to peel off next, not everything at once.

## What Are Characterization Tests, and Why Write Them First?

A characterization test is a test that records what code currently does, not what it is supposed to do, so you can tell the moment you accidentally change behavior. Michael Feathers coined the term in *Working Effectively with Legacy Code*, and the workflow he describes is almost mechanical: call the code, assert something you expect to fail, run the test, read the actual output, and paste that output in as the expected value. For background on the mechanics, see [InfoQ's 2007 write-up on characterization testing](https://www.infoq.com/news/2007/03/characterization-testing).

The point is sequencing. You write characterization tests before touching legacy code, not after, because untested legacy code gives you no way to know whether a change preserved behavior or quietly broke it. Characterization tests are not a replacement for well-designed unit tests going forward; see [How to Write Unit Tests That Actually Help](/en/posts/how-to-write-unit-tests) for that side of the practice. They are a safety net specifically for code you did not write and do not fully trust yet.

## What Is a Seam, and What Does an Anti-Corruption Layer Do?

A seam, Feathers' other key term, is a place in the code where you can change behavior without editing the code at that exact spot, such as a function call you can override from a test. Seams are how you get characterization tests around code that was never designed to be testable, by injecting a fake dependency at a seam instead of rewriting the dependency itself.

An anti-corruption layer is a translation boundary, defined by Eric Evans in *Domain-Driven Design*, that sits between two systems with different data models and translates requests between them so neither model leaks into the other. During a strangler-fig migration, the anti-corruption layer is what lets the new system call the old one's APIs, or vice versa, without the old system's assumptions bleeding into the new codebase. Microsoft's architecture guidance has a concise description of the [anti-corruption layer pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer) and when migrations need one.

## How Do You Route Traffic to the New System Incrementally?

You route traffic incrementally with a facade that decides, per request, whether the old system or the new system handles it, based on a route, a user segment, or a rollout percentage. This is the mechanism that makes strangler-fig migrations reversible: flip the percentage back to zero and you are running on the old system again, with no redeploy.

```javascript
// Facade in front of the legacy order service.
// Routes a growing percentage of traffic to the new path.
function routeOrderRequest(req) {
  const migratedRoutes = new Set(["/orders/create", "/orders/:id/cancel"]);
  const rolloutPercent = 25; // raised in small, reviewed steps

  if (migratedRoutes.has(req.routePattern)) {
    const bucket = hashToBucket(req.userId); // stable 0-99 bucket per user
    if (bucket < rolloutPercent) {
      return newOrderService.handle(req);
    }
  }
  return legacyOrderService.handle(req);
}
```

This is the same percentage-based control that [feature flags](/en/posts/feature-flags-without-tech-debt) give you elsewhere, applied to an entire migration path instead of a single toggle. Keep the rollout percentage in config, not in code, so a bad migration step is a config change away from a rollback, not a deploy.

## Can You Let AI Coding Agents Work on Legacy Code Safely in 2026?

Yes, but only with the same guardrails you would want for a human making the same change: characterization tests in place first, and a diff small enough to review line by line. As of 2026, coding agents are fast enough at writing code that the real bottleneck in legacy work has shifted to review, so the discipline that matters most is keeping each agent-generated change scoped to one seam or one route at a time. See [AI Code Review: Trust, but Verify](/en/posts/ai-code-review-trust-but-verify) for how that review discipline should change when the author is an agent.

An agent asked to migrate an entire legacy module in one pass will tend to reproduce the second-system effect inside a single pull request, redesigning things nobody asked it to touch. Never let an agent attempt its own big-bang rewrite of legacy code. Point it at one characterized seam, let it propose a small diff, run the characterization tests, and merge or reject before moving to the next seam.

## How Do You Measure Migration Progress?

Measure a strangler-fig migration by the share of traffic and routes already on the new path, plus the defect rate and cycle time on each side, not by calendar time elapsed. These three numbers tell you whether the migration is actually converging.

| Signal | Big-bang rewrite | Strangler-fig migration |
|---|---|---|
| Risk of cutover | High: all traffic switches at once | Low: traffic shifts in small, reversible steps |
| Rollback-ability | Hard: often no path back once live | Easy: drop the rollout percentage to zero |
| Cost over time | Spikes late, often doubles (two systems running) | Spreads out, overlap window stays short |
| Team disruption | High: freeze on old system invites drift | Low: teams ship features on both sides throughout |
| Progress visibility | Binary: "done" or "not done" | Continuous: % routes migrated, defect rate, cycle time |

Rising defect rate on the new path as traffic share grows is the signal to slow the rollout, not push through it. A shrinking cycle time on migrated routes, meanwhile, is usually the strongest evidence the new system is actually easier to work in, which is the whole point of doing this instead of living with the legacy system forever.

## Frequently Asked Questions

### Is the strangler-fig pattern only for microservices migrations?

No. The strangler-fig pattern works for any incremental replacement of a system, including moving a monolith's modules behind a new facade without ever splitting it into services. Fowler's original description predates the current microservices vocabulary and applies equally to monolith-to-monolith rewrites.

### How long does a strangler-fig migration usually take?

It depends on codebase size and traffic complexity, but most strangler-fig migrations run for months to a few years, with both systems live the entire time. The pattern trades a shorter, riskier cutover for a longer migration window where the business keeps shipping on both sides.

### Do characterization tests replace normal unit tests?

No. Characterization tests pin down existing, possibly messy, behavior so you can refactor without regressions, while unit tests verify intended behavior against a specification going forward. Teams typically replace characterization tests with proper unit tests once a section of legacy code has been cleaned up and understood.

### Can an AI coding agent run a strangler-fig migration on its own?

Not safely end to end. An agent can propose the facade logic, generate characterization tests, and write small migration diffs for one seam at a time, but a human still needs to review each diff, approve rollout percentage increases, and decide when a route is fully migrated.

Sources:
- [Martin Fowler, "Strangler Fig Application"](https://www.martinfowler.com/bliki/StranglerFigApplication.html)
- [InfoQ, "Characterization Testing"](https://www.infoq.com/news/2007/03/characterization-testing)
- [Microsoft Azure Architecture Center, "Anti-corruption Layer pattern"](https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer)
