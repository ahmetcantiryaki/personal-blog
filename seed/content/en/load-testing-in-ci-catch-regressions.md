---
title: "How Do You Catch Latency Regressions in CI?"
slug: "load-testing-in-ci-catch-regressions"
translationKey: "load-testing-in-ci-catch-regressions"
locale: "en"
excerpt: "Short answer: wire a smoke-sized k6 test into CI and gate its threshold on the service's own trailing p95 baseline, not a fixed millisecond number."
category: "devops-cloud"
tags: ["ci-cd", "testing", "devops", "performance", "monitoring"]
publishedAt: "2026-11-10"
seoTitle: "Catch Performance Regressions in CI With k6"
seoDescription: "How to wire a smoke-sized k6 load test into CI, define thresholds that fail the build, and gate on relative regression instead of fixed numbers."
---

Short answer: run a smoke-sized k6 scenario on every PR instead of a one-off load test, and set the threshold against the service's own trailing baseline rather than a fixed millisecond number. That way a regression that creeps in a few percent at a time breaks the build on the PR that caused it, not weeks later.

## k6 vs Gatling: Which Should You Use?

For most HTTP APIs, k6 is faster to stand up: it's written in JavaScript, ships as a single binary, and has a built-in `thresholds` feature designed for CI gating. Gatling, built on a Scala/Java/Kotlin DSL with a JVM dependency, is heavier to adopt but stronger for complex multi-protocol scenarios and SLO-based reporting through Gatling Enterprise.

| Tool | Language | CI gating via exit code | Learning curve | Best fit |
| --- | --- | --- | --- | --- |
| k6 | JavaScript | Built-in; threshold breach exits 99 | Low | Lightweight HTTP APIs, fast PR checks |
| Gatling | Scala/Java/Kotlin/JS DSL | Non-zero on `assertions` failure (some Windows bundle versions reported skipping this) | Medium-high | Complex protocol mixes, enterprise SLO reporting |
| Locust | Python | No built-in fixed threshold gate; needs `--exit-code-on-error` or custom assertions | Low-medium | Python-leaning teams, flexible scripted scenarios |

If your team already has Python test infrastructure, Locust is a reasonable default, but you'll need to wire an extra flag or custom check to fail CI — in k6 that gate ships built in.

## Why Should Load Tests in CI Stay Smoke-Sized?

A full stress test takes minutes and clogs the pipeline; a smoke-sized scenario finishes in 1-2 minutes with low concurrency (say, 10-20 virtual users) hitting the critical endpoints, and that's enough to catch p95 latency or error-rate drift. A separate "real" stress test, run weekly or nightly outside CI, still has its place for capacity planning — the CI smoke test's only job is telling you whether this PR made latency worse.

If a team merges small changes that each add 2-3% latency over six months, a single periodic load-test report will never catch it, because every individual measurement looks "normal" on its own. Running the smoke test continuously in CI surfaces that drift on the PR that caused it, not weeks after the fact.

## How Do You Define a Threshold That Fails the Build?

Per k6's official learning-path docs, when a `thresholds` block is breached, the `k6 run` process exits with a non-zero code (commonly 99 for a threshold failure); if every threshold passes, the exit code is 0. CI systems (GitHub Actions, GitLab CI, Jenkins) read that exit code directly to mark the job failed — no extra "parse the results" step required.

```javascript
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '2m',
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  http.get(`${__ENV.PREVIEW_URL}/api/orders`);
  sleep(1);
}
```

One catch: a failed `checks` assertion (per-request validation) doesn't change the exit code on its own — the run still reports as "passed" unless you also define a `threshold` on the built-in `checks` metric. Gatling's `assertions` block, by contrast, is evaluated when the simulation ends and a violation produces a non-zero code, though community reports note this behavior has been skipped on some Windows bundle versions — verifying the exit code once in your own CI runner is cheap insurance.

## Should You Gate on Absolute Numbers or Relative Regression?

This is where most guides get it backwards: instead of pinning the threshold to one absolute number ("p95 < 300ms"), define it as a percentage against the service's own trailing 7-14 day p95 baseline (for example, "p95 can't regress more than 15% from baseline"). A fixed absolute number is meaninglessly loose for a low-traffic microservice and chronically flaky for a busy one; a relative threshold scales to each service's own normal and doesn't need manual recalibration as traffic grows.

In practice, that means the CI job first reads the p95/p99 trend from the last successful run on the main branch (from a time-series store or k6 Cloud/Grafana), then injects the `thresholds` block dynamically against that baseline. It's one extra step, but once it's wired up it's less maintenance than re-arguing a fixed number every quarter.

## How Do You Run It Against Ephemeral Preview Environments?

Running the smoke test against the per-PR preview environment tests the actual code that PR produced — waiting until it merges to staging delays the moment you find the regression by days. Passing the preview URL into k6 via `__ENV.PREVIEW_URL` and triggering the job after the preview environment's "ready" health check is enough; if the preview environment isn't a shared staging box, you also remove the risk of concurrent PRs polluting each other's measurements.

If the preview environment already spins up as part of your [CI/CD pipeline](/en/posts/how-to-build-cicd-pipeline), the load-test step slots in as one more job in the existing pipeline — no separate orchestration layer needed.

## How Do You Keep These Tests From Being Flaky?

If the smoke test itself runs noisy (CPU contention on a shared CI runner, cold-start latency), threshold breaches become indistinguishable from real regressions. Three things that work in practice: warming up for the first 10-15 seconds before measurements count, using percentile metrics like p95/p99 instead of averages (one slow request skews an average but rarely moves a p95), and evaluating the threshold against the average of two consecutive runs instead of a single run.

Charting p95/p99 over time on a dashboard (Grafana, Datadog, or k6 Cloud) makes "did this PR make things worse" visible next to the commit history — and that same trend data doubles as input when tuning [Kubernetes autoscaling](/en/posts/kubernetes-autoscaling-guide).

For how to store the service account credentials and preview-environment secrets the load-test pipeline needs, our [cloud secrets management guide](/en/posts/cloud-secrets-management-done-right) is a practical starting point. If you're adding an AI agent to CI, the same boundaries are covered in [wiring AI agents into CI/CD safely](/en/posts/ai-agents-in-cicd-safely). More DevOps and cloud coverage lives in the [DevOps & Cloud category](/en/category/devops-cloud).

## Frequently Asked Questions

### How long should a load test run in CI take?

A smoke-sized k6 scenario should finish in 1-2 minutes; hitting the critical endpoints with 10-20 virtual users is enough to catch p95/p99 drift without meaningfully slowing the build. Full-scale stress tests belong in a separate weekly or nightly job outside the per-PR pipeline.

### How does a k6 threshold breach fail CI?

Per k6's official learning-path docs, when a `thresholds` block is violated, the `k6 run` process exits with a non-zero code (commonly 99); the CI system reads that exit code and marks the job failed. A shell wrapper script can swallow that code, so make k6 the last command in the step or capture it explicitly with `K6_EXIT=$?`.

### Why is a relative threshold better than an absolute one?

A fixed number like "p95 < 300ms" doesn't mean the same thing for every service: it's needlessly loose for a low-traffic service and chronically flaky for a busy one. Defining the threshold as a percentage drift against the service's own trailing 7-14 day baseline scales the gate to each service's own normal automatically.

### Is Gatling as reliable as k6 for CI gating?

Gatling's `assertions` block is evaluated when the simulation ends and produces a non-zero exit code on violation, but community reports describe this behavior being skipped on some Windows bundle versions. Deliberately breaking a threshold once in your own CI runner and confirming the exit code is the cheapest way to verify the gate actually works.
