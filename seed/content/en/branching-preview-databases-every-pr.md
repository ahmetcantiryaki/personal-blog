---
title: "Branching Preview Databases for Every PR"
slug: "branching-preview-databases-every-pr"
translationKey: "branching-preview-databases-pr-2026"
locale: "en"
excerpt: "Short answer: use copy-on-write branching so every PR gets its own isolated Postgres database in seconds, with no data copying and no shared staging lock."
category: "devops-cloud"
tags: ["databases", "ci-cd", "postgresql", "devops"]
publishedAt: "2026-09-19"
seoTitle: "A Real Database for Every PR with Copy-on-Write Branching"
seoDescription: "Short answer: use copy-on-write branching so every PR gets its own isolated Postgres database in seconds, with no data copying and no shared staging lock."
---

Short answer: give every pull request its own database with copy-on-write branching instead of a shared staging database. A new branch starts as a pointer to the parent's current state and only stores the pages it later changes, so branching a 100 GB database takes a few seconds and costs nothing extra until you actually write to it.

## Why do shared staging databases break preview environments?

One staging database shared across a team breaks in three predictable ways: migrations collide, test data pollutes other people's runs, and teams end up blocking each other. One engineer applies a schema change while another runs integration tests against the same tables, and a third seeds manual test data on top of both — the result is a shared resource nobody fully trusts.

This does not scale even on small teams, because staging turns into a queue. While one developer's migration sits applied on staging, anyone else working against that branch either waits or overwrites it and hopes for the best. As PR volume grows, people start skipping staging entirely and testing straight against production — which defeats the entire point of having a preview environment.

## What is copy-on-write database branching?

Copy-on-write branching creates an instant copy of a database at the storage layer without duplicating any data. When you open a new branch, the system does not copy data pages up front. It creates a pointer to the parent branch's current state, and only writes new pages once you actually change something on that branch.

The practical result: branching a 100 GB production database takes a few seconds, regardless of the dataset's size. Storage cost follows the same logic — a branch only consumes extra space for the data that diverges from its parent, so you never pay for a full duplicate. As of 2026, on platforms like Neon this means a database pre-seeded with the current production schema can be created in under a second and torn down automatically once the PR that needed it closes, [as Neon's writeup on branching for preview environments describes](https://neon.com/blog/branching-with-preview-environments).

## How do you wire a branch-per-PR into CI?

A typical flow has four steps: when a PR opens, create a branch named after the PR number off the `main` parent branch (for example `ci-pr-123`); run migrations and tests against that branch; delete the branch when the PR closes or merges. This is usually automated through a GitHub Action, so nobody has to remember the teardown step.

```yaml
# .github/workflows/pr-database.yml
name: PR Preview Database

on:
  pull_request:
    types: [opened, synchronize, closed]

jobs:
  branch-database:
    runs-on: ubuntu-latest
    steps:
      - name: Create branch for this PR
        if: github.event.action != 'closed'
        run: |
          neonctl branches create \
            --name "ci-pr-${{ github.event.number }}" \
            --parent main

      - name: Run migrations against the branch
        if: github.event.action != 'closed'
        run: |
          DATABASE_URL=$(neonctl connection-string "ci-pr-${{ github.event.number }}") \
            npm run migrate

      - name: Delete branch on PR close
        if: github.event.action == 'closed'
        run: |
          neonctl branches delete "ci-pr-${{ github.event.number }}"
```

Each branch gets its own compute endpoint and its own connection string, which makes isolation complete — queries run against one PR's branch cannot touch another PR's branch. Idle branches can scale to zero, so you're billed only for what diverges from the parent, not for a full copy sitting around unused, a pattern [Neon's branching workflows documentation](https://neon.com/use-cases/branching-workflows) recommends for both per-developer and per-CI-run branches.

## Why is this better than spinning up a container per PR?

Standing up a fresh container or database server per PR also gives you isolation, but it comes at a cost: provisioning a new server takes minutes, seeding or anonymizing data needs a separate step, and teardown is often manual and gets forgotten. Copy-on-write branching delivers the same isolation at a fixed, sub-second-to-seconds speed regardless of dataset size, with automatic teardown built into the branch lifecycle.

| Approach | Isolation | Speed | Cost | Teardown |
|---|---|---|---|---|
| Shared staging DB | None — everyone shares the same data | Instant (no setup) | Low, single instance | Not needed, but drift accumulates |
| Container/DB per PR | Full | Minutes (provision + seed) | High, full copy per PR | Manual, often skipped |
| Copy-on-write branch per PR | Full | Seconds | Only the diff, zero when idle | Automatic, on PR close |

That table makes one point: instant, isolated, affordable, and disposable have to arrive together, or the preview environment doesn't scale. Shared staging isn't isolated. Container-per-PR isn't fast or cheap. Copy-on-write branching is the only row that checks all four boxes, a comparison [Neon's rundown on automatic database creation in CI pipelines](https://neon.com/faqs/best-postgres-platforms-automatic-database-creation-ci-pipeline) makes explicitly against the container-per-PR pattern.

## How do you protect PII when branches inherit production data?

A branch inherits whatever is in its parent — if the parent is production and holds real customer data, the PR branch carries that same data. There are two ways to handle this: branch off a parent that's already anonymized, such as a masked staging branch, or run a masking step immediately after branch creation and before the branch is used in an open CI environment. The second approach is more flexible but adds a pipeline step; the first is simpler but requires keeping the anonymized staging branch current. The same discipline we cover in [our database backups and disaster recovery piece](/en/posts/database-backups-disaster-recovery) — know exactly which copy of your data lives where — applies here: track which parent each branch descends from and that parent's sensitivity level, or PII leaks into places it was never meant to be.

## Why does testing migrations pre-merge on a branch actually work?

Because a branch is a real, fully functional Postgres instance, you can run a schema migration against a PR's branch before merging it. That means a broken migration fails on an isolated, disposable branch instead of on the shared `main` database — zero production impact and zero cost to roll back. Even the expand-contract pattern we describe in [our zero-downtime schema migrations post](/en/posts/zero-downtime-schema-migrations) is safer to trust once it's been exercised on a real Postgres branch; a migration being reversible in theory is not the same as it running cleanly against real data.

This flow also touches connection management: because every PR branch gets its own endpoint, you need [connection pooling with PgBouncer](/en/posts/postgres-connection-pooling-pgbouncer) configured correctly in your test setup too — otherwise dozens of PR jobs running in parallel, each against its own branch, can hit unexpected connection limits.

## Why is "just buy a bigger staging server" a false economy?

The usual fix for a congested shared staging database is to scale up the server or stand up a second staging environment. That's a false economy: the bottleneck isn't capacity, it's sharing. Even with two staging databases, if three teams are working at once, the same collision happens — you've just changed which pair collides. The real fix isn't fewer databases, it's giving every unit of work — a PR, a developer, a CI run — its own database, without paying full-copy cost to do it.

If you're wiring this into a broader pipeline, [our guide to building a CI/CD pipeline](/en/posts/how-to-build-cicd-pipeline) covers where database branching fits into the overall pipeline architecture. And if Postgres is already your team's default data layer, [our piece on just using Postgres for everything](/en/posts/just-use-postgres-for-everything) explains why this branching model matured specifically around the Postgres ecosystem.

For more infrastructure and database practices, browse the [DevOps & Cloud category](/en/category/devops-cloud).

## Frequently Asked Questions

### Do you really need a separate database for every PR?

For small, single-developer projects, no — a shared staging database can be enough. But once multiple people run migrations concurrently or test data starts polluting other runs, a branch per PR is the cheapest fix because it doesn't carry full-copy cost.

### Does copy-on-write branching risk losing data?

No, branches are fully independent. A `DROP TABLE` or a broken migration run on a PR branch only affects that branch; the parent branch — typically `main` or production — is never modified, because the branch keeps its own diverging pages separate.

### How much do PR branches cost to run?

Storage cost scales only with how much a branch diverges from its parent, so you never pay for a full copy. On the compute side, idle branches can scale to zero, so a PR branch that isn't actively being used costs close to nothing.

### Does branching copy sensitive production data too?

Yes — a branch inherits everything in its parent, including PII. Handle this by branching off an already-anonymized staging parent, or by running a masking step right after branch creation and before the branch is used in CI.
