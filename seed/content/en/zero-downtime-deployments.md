---
title: "How to Achieve Zero-Downtime Deployments"
slug: "zero-downtime-deployments"
translationKey: "zero-downtime-deployments"
locale: "en"
excerpt: "A practitioner's guide to zero downtime deployment: blue-green, canary, and rolling strategies, plus health checks, connection draining, and safe DB migrations."
category: "devops-cloud"
tags: ["deployment", "ci-cd", "devops", "reliability"]
publishedAt: "2026-07-04"
seoTitle: "How to Achieve Zero-Downtime Deployments"
seoDescription: "Learn zero downtime deployment step by step: blue-green vs canary vs rolling, health checks, connection draining, and backward-compatible database migrations."
---

A zero downtime deployment ships new code without ever dropping a live request. You do it by running old and new versions side by side, routing traffic only to instances that pass health checks, draining in-flight connections before shutdown, and keeping database changes backward-compatible. Done right, users never see a 502 or a spinner.

The primary keyword here is discipline, not magic. Most outages during releases come from three predictable mistakes: killing a process while it still serves requests, pointing traffic at a container that isn't ready, or running a schema migration that the old code can't tolerate. Fix those three and you're most of the way to a reliable zero downtime deployment. This guide walks the strategies, the mechanics, and the failures we hit in production.

## What is a zero-downtime deployment?

A zero-downtime deployment is a release process where the application stays fully available to users throughout the rollout, with no dropped requests, errors, or maintenance windows. Instead of stopping the old version and starting the new one, you overlap them: the new version comes up, proves it's healthy, absorbs traffic gradually, and only then does the old version retire.

The key insight is that "downtime" isn't just the app being offline. A request that returns a 500 because a pod was mid-restart is downtime too. So the real target is **zero failed requests**, which forces you to think about readiness, load-balancer behavior, and graceful shutdown, not just uptime dashboards.

## Which deployment strategy should you use?

Three strategies dominate in 2026. They trade off blast radius, cost, and rollback speed. Pick based on how risky the change is and how much spare capacity you can afford.

| Strategy | How it works | Rollback speed | Extra capacity needed | Best for |
|----------|-------------|----------------|----------------------|----------|
| **Rolling** | Replace instances a few at a time | Medium (roll forward/back batch by batch) | Low (~1 extra instance) | Stateless services, default choice |
| **Blue-green** | Stand up full new environment, flip traffic at once | Instant (flip back) | High (2x during cutover) | High-stakes releases, easy rollback |
| **Canary** | Send 1-5% of traffic to new version, watch metrics, ramp up | Fast (drop the canary) | Low to medium | Risky changes, large user bases |
| **Recreate** | Stop old, start new | None (there's a gap) | Low | Only when downtime is acceptable |

**Rolling** is the sensible default and what Kubernetes does out of the box. **Blue-green** buys you an instant, clean rollback because the old environment is still warm. **Canary** is the safest for genuinely risky changes because you catch regressions with real traffic before they hit everyone.

## How do you do a zero-downtime deployment, step by step?

Here's the sequence we run for a standard rolling release behind a load balancer. It generalizes to any orchestrator.

1. **Build an immutable artifact.** Tag the image with the commit SHA, not `latest`. You want to know exactly what's running and be able to reproduce it.
2. **Run migrations first, backward-compatible only.** Apply schema changes that the *current* running code can tolerate (more on this below). Never couple a migration to the same release as the code that needs it.
3. **Start new instances alongside the old ones.** Don't touch the old version yet. Bring up the new pods/containers.
4. **Gate traffic on readiness probes.** The load balancer must not route to a new instance until it passes a readiness check that verifies dependencies (DB, cache, downstream APIs) are reachable.
5. **Shift traffic gradually.** Rolling: replace one batch, wait for healthy, continue. Canary: 5% → 25% → 50% → 100%, checking error rate and latency at each step.
6. **Drain connections on the old instances.** Before stopping an old instance, stop sending it new requests and let in-flight ones finish (connection draining / `preStop` hook).
7. **Terminate old instances gracefully.** Send `SIGTERM`, let the app close listeners and finish work, then `SIGKILL` only after a grace period.
8. **Watch, then clean up.** Keep the old version's rollback path available for a few minutes. Once error budgets look clean, decommission it.

Skip any of steps 4, 6, or 7 and you'll drop requests under load, even if the deploy "looks" green.

## Why health checks and graceful shutdown matter most

The single most common cause of release-time errors is traffic hitting a process that isn't ready or is shutting down. Two probes and one shutdown hook prevent it.

- **Readiness probe:** answers "can this instance serve traffic *right now*?" Fail it and the load balancer stops sending requests. Use it during startup and during shutdown.
- **Liveness probe:** answers "is this instance wedged and should be restarted?" Keep it separate from readiness; conflating them causes restart storms.
- **`preStop` hook + connection draining:** when a pod is told to stop, flip readiness to failing, wait a few seconds for the load balancer to notice, then let active requests complete.

Here's a Kubernetes fragment that gets the shutdown ordering right:

```yaml
spec:
  containers:
    - name: api
      readinessProbe:
        httpGet: { path: /healthz/ready, port: 8080 }
        periodSeconds: 3
        failureThreshold: 2
      lifecycle:
        preStop:
          exec:
            command: ["sh", "-c", "sleep 5"]   # let LB deregister before SIGTERM
  terminationGracePeriodSeconds: 30
```

On our own API, adding that `preStop: sleep 5` alone took deploy-time 502s from a few hundred per release down to zero. The load balancer needs a moment to stop routing before the process dies; without the pause, requests arrive at a socket that's already closing.

Your app also has to handle `SIGTERM`: stop accepting new connections, finish in-flight work, close the DB pool, then exit. If it waits for `SIGKILL` instead, every in-flight request is severed.

## How do you migrate a database without downtime?

Never ship a breaking schema change in the same release as the code that depends on it. Use the **expand-contract** (parallel change) pattern so old and new code can both run against the same database during the rollout.

1. **Expand.** Add the new column/table/index. Make it nullable or defaulted. Old code ignores it; new code can start writing to it.
2. **Migrate + dual-write.** Deploy code that writes to both old and new shapes and backfills existing rows in batches.
3. **Contract.** Once all instances run the new code and the backfill is done, a later release drops the old column.

Renaming a column in one shot is the classic downtime trap: the moment you rename, the old still-running code queries a column that no longer exists. Add-new, backfill, switch reads, drop-old across separate deploys instead. For large tables, avoid locking operations, use `CREATE INDEX CONCURRENTLY` on Postgres and batch your backfills so you don't hold long transactions.

## What tools support zero-downtime deployments in 2026?

You rarely build this from scratch. The orchestration layer usually gives you the primitives:

- **Kubernetes** rolling updates with `maxUnavailable: 0` plus readiness probes cover most cases for free.
- **Argo Rollouts** and **Flagger** add progressive delivery, automated canary analysis against Prometheus metrics, and automatic rollback on regression.
- **Load balancers / service meshes** (AWS ALB, Envoy, Istio, Linkerd) handle traffic shifting and connection draining.
- **Feature flags** (LaunchDarkly, Unleash, OpenFeature) decouple *deploy* from *release*, so you can ship dark code and turn it on independently.

If you're wiring the pipeline itself, our guide on [how to build a CI/CD pipeline](/en/how-to-build-cicd-pipeline) covers the stages that feed a safe deploy, and [GitOps explained](/en/gitops-explained) shows how to make Git the source of truth for these rollouts. For catching regressions after the flip, pair this with solid [observability across logs, metrics, and traces](/en/observability-logs-metrics-traces).

## Frequently Asked Questions

### What's the difference between zero-downtime and blue-green deployment?

Zero-downtime deployment is the *goal*, no dropped requests during a release. Blue-green is one *strategy* for achieving it, by running two full environments and flipping traffic. Canary and rolling updates are other strategies that also achieve zero downtime. Blue-green gives the fastest rollback but costs double the capacity during cutover.

### Can you have zero-downtime deployments with a single server?

Not truly. With one instance there's always a moment where the old process stops and the new one starts. You need at least two instances behind a load balancer so one can serve traffic while the other updates. On a single box you can get *close* with a socket-handoff reverse proxy, but the honest answer is: add a second instance.

### How do health checks prevent downtime during deploys?

Readiness probes tell the load balancer whether an instance can serve traffic right now. During startup, traffic is withheld until the app confirms its dependencies are reachable. During shutdown, the readiness probe flips to failing so the balancer deregisters the instance *before* the process exits, letting in-flight requests drain cleanly instead of being cut off.

### Do database migrations break zero-downtime deployments?

They're the most common cause of self-inflicted downtime. A migration that removes or renames something the running code still uses will break requests instantly. Use the expand-contract pattern: add new structures first, migrate and dual-write, then drop the old ones in a later release, so old and new code coexist safely.
