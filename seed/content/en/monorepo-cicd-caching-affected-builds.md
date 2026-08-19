---
title: "CI/CD for Monorepos: Caching and Affected Builds"
slug: "monorepo-cicd-caching-affected-builds"
translationKey: "monorepo-cicd-pipelines"
locale: "en"
excerpt: "The key to fast monorepo CI is building only what changed (affected builds) and pulling already-done work from a remote cache instead of redoing it."
category: "devops-cloud"
tags: ["ci-cd", "monitoring", "performance", "developer-experience"]
publishedAt: "2026-08-19"
seoTitle: "Monorepo CI/CD: Affected Builds and Remote Caching Guide"
seoDescription: "If CI time keeps growing with your monorepo, the fix is affected builds plus remote caching. How to build a fast pipeline with Turborepo and Nx in 2026."
---

Short answer: two things keep monorepo CI fast — building only the packages a change actually affects (affected builds), and pulling previously-done build and test work from a cache instead of redoing it (remote caching). Without both, a monorepo turns into a CI monster that rebuilds the entire repo on every single file change.

## What Is an Affected Build, and Why Do You Need One?

An affected build is an approach that only builds and tests the packages a change actually touches. In a 200-package monorepo, changing one utility function builds the 5 packages that import it and skips the other 195 untouched. The alternative — building the whole repo on every push — produces CI time growth that's not linear but often super-linear as the repo grows.

Nx does this through a project graph and file-level dependency tracking: the `nx affected` command starts from a changed file and traces every project that imports from it, directly or transitively. Turborepo achieves the same result with the `--filter` flag — for example, `turbo run build --filter=[HEAD^1]` targets only the packages affected since the last commit.

```bash
# Nx: build only projects affected by the last commit
nx affected --target=build --base=HEAD~1

# Turborepo: build only packages affected by the last commit
turbo run build --filter=[HEAD^1]
```

## What Does Remote Caching Buy You?

Remote caching fetches a task's result (build, test, lint) from a shared store instead of re-running it, as long as that task's input hash hasn't changed. A test a developer already ran locally can be read straight from the cache instead of being re-run in CI with the same inputs — a real saving in CI minutes as a team grows.

Turborepo's remote cache runs through Vercel (free for personal use, paid for teams) or through open-source self-hosted implementations. On the Nx side, Nx Cloud offers remote caching plus distributed task execution, which splits a CI pipeline across multiple machines — free for small teams, paid for larger organizations.

| Feature | Turborepo | Nx |
| --- | --- | --- |
| Affected/only-changed | `--filter` flag | `nx affected` command, project-graph based |
| Remote caching | Vercel or self-hosted | Nx Cloud |
| Distributed task execution | Limited | Built in via Nx Cloud |
| 2026 headline feature | Rewritten from Go to Rust, closing the performance gap | Nx 22: Self-Healing CI, a graph view that handles thousands of projects |
| Default recommendation | Teams wanting a simple, fast task runner | Once coordination becomes the bottleneck |

## How Do You Set Up a Task Graph?

A task graph defines which task must run before which — for example, a package's `build` task must finish before the `build` of anything that depends on it. Both Turborepo and Nx derive this graph automatically from `package.json` dependencies; you only need to declare extra cross-task dependencies (like "run build before test") in a config file.

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

Once the graph is set up correctly, parallelization comes for free: packages with no dependency on each other build simultaneously, and total CI time collapses to the graph's longest dependency chain — the critical path — instead of one long sequential run.

## Test Sharding and Parallelization

Test sharding splits a large test suite across multiple CI workers to run in parallel — a 2,000-test suite split into 4 shards runs roughly 500 tests per worker, and total wall-clock time theoretically drops to a quarter. In practice the gain is a bit lower because each shard carries its own setup cost, but the difference is still dramatic for large suites.

Isolating flaky tests becomes critical here — if a flaky test in one shard breaks the whole pipeline, it gets hard to tell whether that shard is broken or whether there's a real regression. Moving flaky tests into a separate quarantine workflow and keeping the main pipeline isolated from them is the CI equivalent of the "separate signal from noise" principle we cover in our [guide to running effective code reviews](/en/posts/effective-code-reviews).

## Artifact Reuse and Deploy Gating

Once a build artifact exists, later stages — test, staging deploy, production deploy — should move it forward instead of rebuilding it. That's the "build once, deploy many" principle: it guarantees the exact same binary or container image progresses consistently across environments, and it removes the risk (and time cost) of rebuilding at every stage.

Deploy gating makes a stage fire only when the previous stage succeeded — combined with affected-build logic, it means only the affected services get deployed while untouched ones stay as they are. Unlike our general [guide to building a CI/CD pipeline from scratch](/en/posts/how-to-build-cicd-pipeline), this is specifically about answering "which package goes where" in a multi-package repo.

## How Do You Shorten Cache Warm-Up Time?

A CI pipeline's first run is always the slowest, because the cache starts empty — this is the "cold cache" problem. A practical fix is running a cache-warming job on every merge to the main branch that pre-computes the result of the most frequently run tasks, so tasks that developers run on feature branches build on top of the main branch's warm cache instead of starting from zero.

Another practical detail is what actually goes into the cache key. The key should cover not just source code but also tool versions (Node.js, compiler, package manager) and environment variables — otherwise a cache entry produced under one Node.js version can get mistakenly served to a job running a different version, producing exactly the kind of hard-to-track "works locally, fails in CI" bug that eats an afternoon.

## Keeping CI Fast as the Repo Scales: A Metrics Checklist

```text
Metrics to watch to keep monorepo CI fast:
- Average pipeline duration (p50 AND p95, not just the mean)
- Cache hit rate (as a percentage; below 70% needs investigation)
- Affected-to-total package ratio (a ratio consistently above 80%
  may mean your affected-detection logic is misconfigured)
- Count of flaky tests and the percentage quarantined
- Longest critical-path duration
```

## Frequently Asked Questions

### Should I choose Turborepo or Nx?

If you want a simple, fast task runner and coordination across teams isn't yet a problem, Turborepo is a solid starting point. As the project count grows and you need cross-team coordination, richer dependency-graph visualization, or built-in distributed task execution, switching to Nx makes sense.

### Does remote caching create a security risk?

It can if it's misconfigured — a shared cache can accidentally leak build outputs that contain secrets outside the team. Auditing what goes into the cache and confirming it doesn't carry sensitive data should be part of setting up remote caching in the first place.

### What happens if affected-build logic skips the wrong packages?

This usually traces back to a missing or incorrect dependency graph — implicit dependencies through dynamic imports or config files, for instance, may not show up in the graph. Running a full build periodically (weekly, say) is a practical way to catch these silent skips.

### Do small monorepos need these tools at all?

If you have fewer than 10 packages and CI already finishes in a few minutes, probably not — npm/pnpm workspaces plus a simple script can be enough. These tools earn their keep as package count and CI time grow.
