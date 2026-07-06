---
title: "How to Build a CI/CD Pipeline from Scratch"
slug: "how-to-build-cicd-pipeline"
translationKey: "build-cicd-pipeline"
locale: "en"
excerpt: "Learn how to build a CI/CD pipeline from scratch in 2026: stages, a working GitHub Actions config, testing gates, deployment, and the mistakes to avoid."
category: "devops-cloud"
tags: ["ci-cd", "devops", "automation", "deployment"]
publishedAt: "2026-05-06"
seoTitle: "How to Build a CI/CD Pipeline from Scratch (2026)"
seoDescription: "How to build a CI/CD pipeline step by step: wire up build, test, and deploy stages in GitHub Actions with real config, gates, and rollback you can copy."
---

To build a CI/CD pipeline, you connect your Git repository to an automation tool that runs the same steps on every push: install dependencies, build, run tests, and deploy if everything passes. That loop turns "works on my machine" into a repeatable, auditable process. This guide walks the full pipeline with a GitHub Actions config you can copy and run today.

## What is a CI/CD pipeline, and why build one?

A CI/CD pipeline is an automated sequence that takes code from commit to production without manual steps. **CI** (continuous integration) builds and tests every change so bugs surface in minutes, not at release. **CD** (continuous delivery or deployment) ships passing builds to staging or production automatically.

You build one to kill the slow, error-prone parts of shipping. Manual deploys drift, skip tests, and depend on one person who knows the ritual. A pipeline runs the same steps every time, blocks broken code from merging, and gives you a log of who changed what. For any team past two engineers, it pays for itself in the first month. If you containerize, pair it with our [Docker best practices for production](/blog/devops-cloud) guide.

## What are the stages of a CI/CD pipeline?

A standard pipeline moves through six stages, each a gate that stops bad code from reaching users. Learning how to build a CI/CD pipeline starts with knowing what each stage does and where it fails.

1. **Source.** A push or pull request triggers the pipeline. The runner checks out your exact commit.
2. **Build.** Install dependencies and compile or bundle the app. If this fails, nothing downstream runs.
3. **Test.** Run unit, integration, and sometimes end-to-end tests. This is your safety net.
4. **Scan.** Lint, type-check, and run security and dependency scans to catch issues static analysis can find.
5. **Package.** Produce a deployable artifact: a Docker image, a bundle, or a versioned release.
6. **Deploy.** Push the artifact to staging, run smoke tests, then promote to production.

Keep the fast, cheap stages first. A lint error should fail in 20 seconds, not after a 12-minute test suite.

## How do you build a CI/CD pipeline in GitHub Actions?

Start with a single workflow file and add stages incrementally. Below is a real, minimal pipeline for a Node.js app that builds, tests, and deploys on every push to `main`. It runs on GitHub-hosted runners, so there's no server to manage.

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build

  deploy:
    needs: build-test          # only runs if build-test passes
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - run: echo "Deploying commit ${{ github.sha }}"
        # replace with your deploy command, e.g. flyctl deploy
```

Two things make this safe. The `needs: build-test` line means **deploy never runs unless every test passes**. The `if: github.ref == 'refs/heads/main'` guard means pull requests get tested but never deployed. Commit this file, push, and open the Actions tab to watch it run.

## Which CI/CD tool should you choose?

Pick the tool that lives closest to your code and team. For most teams in 2026, the platform-native option wins because setup is near-zero and secrets, permissions, and logs are already integrated.

| Tool | Best for | Hosting | Notes |
|------|----------|---------|-------|
| GitHub Actions | Repos on GitHub | Cloud + self-hosted | Huge marketplace, free tier for public repos |
| GitLab CI/CD | GitLab users, full DevOps suite | Cloud + self-hosted | Built-in registry, strong for monorepos |
| CircleCI | Speed-focused teams | Cloud + self-hosted | Fast caching, flexible parallelism |
| Jenkins | Full control, legacy | Self-hosted | Most flexible, most maintenance |
| Argo CD | Kubernetes GitOps | Self-hosted | Declarative CD, syncs from Git to cluster |

Default to GitHub Actions or GitLab CI/CD if you're already on those platforms. Reach for Jenkins only when you need plugins or on-prem control nothing else offers. If you deploy to Kubernetes, Argo CD plus a GitOps flow pairs well with our [Kubernetes cost optimization](/blog/devops-cloud) playbook.

## How do you add testing and deployment gates?

Gates are conditions that must pass before code advances. Add them so the pipeline blocks risky changes automatically instead of relying on a human to remember. Branch protection plus required status checks is the highest-leverage gate you can set.

- **Required status checks.** In your repo settings, require the `build-test` job to pass before a PR can merge. Broken code physically cannot reach `main`.
- **Coverage threshold.** Fail the build if test coverage drops below a line, say 80%. Catch untested code at review time.
- **Manual approval for production.** Use a GitHub `environment` with a required reviewer so a human clicks "approve" before the production deploy runs.
- **Smoke tests after deploy.** Hit a health endpoint post-deploy; if it returns anything but 200, roll back automatically.

On a recent project we added a coverage gate and required checks in an afternoon. Merge-to-main incidents dropped from roughly one a week to zero over the next two months, because untested paths simply stopped merging.

## What breaks in CI/CD pipelines, and how do you fix it?

Three failures show up on nearly every pipeline we build.

- **Flaky tests.** A test passes locally and fails randomly in CI, usually a timing or ordering issue. Quarantine the flaky test, fix the race, and never paper over it with automatic retries — retries hide real bugs.
- **Slow pipelines.** A 25-minute run kills the feedback loop. Cache dependencies, run test suites in parallel jobs, and split the fast checks (lint, type-check) from the slow ones (e2e) so failures surface early.
- **Leaked or missing secrets.** Never hardcode tokens in YAML. Store them in your platform's encrypted secrets and reference them as variables. Rotate anything that ever touched a commit.

Measure your pipeline before you optimize it. Track build duration, failure rate, and how long a fix takes to reach production. Those numbers tell you where to spend effort far better than guessing.

## Frequently Asked Questions

### How long does it take to build a CI/CD pipeline?

A basic pipeline that builds and tests on every push takes an hour or two with a hosted tool like GitHub Actions. Adding real deployment, gates, secrets, and rollback typically takes a few days to a week, depending on how complex your infrastructure and approval process are.

### What's the difference between CI and CD?

CI (continuous integration) automatically builds and tests every code change so problems surface immediately. CD covers what happens after: continuous delivery keeps a deployable build ready for a one-click release, while continuous deployment ships every passing change to production automatically with no manual step.

### Do I need Docker to build a CI/CD pipeline?

No. You can build, test, and deploy plain application code without containers. But Docker makes builds reproducible and deploys consistent across environments, which removes a whole class of "works in CI, breaks in prod" bugs. Most teams adopt it once the pipeline itself is stable.

### How do I roll back a bad deployment?

Keep every build as a versioned, immutable artifact so rollback is redeploying the last good version, not reverting code by hand. Automate it: if post-deploy smoke tests fail, have the pipeline redeploy the previous artifact. On Kubernetes, `kubectl rollout undo` or an Argo CD sync to the prior revision does this in seconds.
