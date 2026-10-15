---
title: "Internal Developer Platforms: Build or Buy?"
slug: "internal-developer-platform-build-or-buy"
translationKey: "idp-build-or-buy-2026"
locale: "en"
excerpt: "Build an IDP only once ticket-queue pain is real; otherwise buy a managed platform or assemble Backstage plus OSS tools, since building costs a full team."
category: "devops-cloud"
tags: ["platform-engineering", "devops", "cost-optimization", "best-practices"]
publishedAt: "2026-10-15"
seoTitle: "Internal Developer Platform: Build or Buy in 2026?"
seoDescription: "Build an IDP only once ticket-queue pain is real; otherwise buy a managed platform or assemble Backstage plus OSS tools, since building costs years."
---

## What Is an Internal Developer Platform?

An internal developer platform (IDP) is the set of self-service tools, templates, and automated workflows that let application developers provision infrastructure, deploy services, and get a working environment without filing a ticket to another team. The core idea is the "paved road": a small number of pre-approved, well-supported ways to do common tasks, so most developers never need to go off-road into raw cloud consoles or hand-rolled Terraform.

The three load-bearing concepts are golden paths (opinionated, supported defaults for shipping a service), self-service (developers trigger the workflow through a portal, CLI, or Git-based pull request), and paved roads (the platform team supports a narrow set of approved patterns instead of every possible configuration). An IDP is not a tool you install. It is an internal product with an internal customer base, and like any product it can be built well, built badly, or not need building yet.

## Is Your Team Actually Ready for an IDP?

Short answer: you are ready when platform cognitive load and ticket-queue operations pain are measurably slowing down shipping, not when a conference talk says every org needs one. The signal is operational, not aspirational.

Real readiness signs: developers routinely wait days for infrastructure tickets actioned by a central ops team; onboarding a new engineer to "deploy a service" takes a longer runbook than the actual code change; the same Terraform module has been copy-pasted and subtly broken across a dozen repos; and incident postmortems keep naming "nobody knew which config was correct" as a root cause. A ticket queue with a measurable backlog and a mean time-to-fulfillment in days, not minutes, means the absence of a platform is now the bottleneck.

Premature-investment signs look almost identical to ambition: a VP read about Spotify's internal platform and wants one; the org has fewer than 30–40 engineers and two or three services; nobody can name the top three recurring developer complaints because nobody has asked. CNCF's State of Platform Engineering Report (Vol. 4, 518 respondents) found that 29.6% of platform teams don't measure success at all, and 40.9% cannot show measurable value within 12 months of launch — a sign that many platforms get built before anyone defined "working" ([sdtimes.com coverage](https://sdtimes.com/cloud-native/the-2026-cloud-native-developer-survey-tracking-adoption-and-maturity-in-platform-engineering/)). Gartner projects that 80% of large engineering organizations will have a dedicated platform team by the end of 2026 — a forecast, not a measured outcome, and not a reason to build one before the pain is real.

## Build, Buy, or Assemble From Open Source: Which Should You Choose?

Short answer: assemble from open source (Backstage plus a curated toolchain) fits most mid-size engineering orgs best, buy fits teams that want to skip the integration work and pay for it, and build-from-scratch almost never pays for itself unless your platform *is* your product.

"Build" means writing a custom portal, CI/CD orchestration, and catalog logic in-house with no base framework. "Buy" means a managed platform-as-a-product offering (Humanitec, Port, Cortex, and similar vendors) where the vendor owns the catalog, scorecards, and workflow engine and you configure it. "Assemble from OSS" means standing up Backstage — the CNCF project originally built at Spotify and donated in 2020 — as the catalog and portal frontend, wired to your existing CI/CD, Kubernetes, and secrets tooling.

| Approach | Upfront cost | Time to first value | Flexibility | Ongoing maintenance burden |
|---|---|---|---|---|
| Build from scratch | Very high (months of senior eng time) | 6–12+ months | Maximum | High — you own every bug, upgrade, and integration forever |
| Buy (managed platform) | License fee, usually per-developer-seat | Weeks | Limited to vendor's extension model | Low — vendor patches and upgrades the core |
| Assemble from OSS (Backstage + plugins) | Moderate (1–2 engineers for setup) | 1–3 months | High — plugin ecosystem, but you integrate it | Moderate — you track Backstage releases and plugin breakage |

Backstage itself is not a finished platform; it is a framework and a plugin ecosystem. As of October 2026 it sits at CNCF's incubating maturity stage (promoted from sandbox in March 2022), and CNCF's 2025 Annual Project Velocity ranking placed it 6th out of 230+ CNCF projects, up from 8th in 2020, the year Spotify contributed it ([CNCF, March 2026](https://www.cncf.io/announcements/2026/03/25/cncf-backstage-documentary-highlights-project-evolution-from-development-to-global-open-source-standard-for-platform-engineering/)). That velocity shows an active ecosystem, not a finished product. You still write the plugins that connect Backstage to your specific cloud account, CI system, and secrets manager — check [backstage.io](https://backstage.io) for the current plugin catalog before assuming your integration already exists.

A minimal service entry in Backstage's catalog looks like this:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: checkout-service
  description: Handles order checkout and payment capture
  annotations:
    github.com/project-slug: woyable/checkout-service
spec:
  type: service
  lifecycle: production
  owner: team-payments
  system: ecommerce-platform
```

That file is cheap to write. The expensive part is the automation behind it: scaffolding templates, CI hooks that keep the catalog in sync with reality, and access controls that stop it from becoming stale documentation nobody trusts.

For where IDPs fit inside platform engineering as a discipline, see our [deep dive on what platform engineering actually is](/en/posts/what-is-platform-engineering) and the [step-by-step guide to building an internal developer portal](/en/posts/how-to-build-internal-developer-portal). Whether platform engineering is replacing DevOps outright or just reorganizing it is covered separately in [our comparison of platform engineering and DevOps](/en/posts/platform-engineering-vs-devops).

## What Does a Platform Team Actually Cost?

Short answer: a real platform team is 3–6 engineers minimum for a mid-size org, run as a permanent cost center with its own roadmap and on-call rotation, not a part-time project bolted onto two infrastructure engineers' existing workload.

Only 28% of organizations report having a dedicated platform engineering team, per a CNCF-linked survey — the other 72% either skip formal platform engineering or run it as an unstaffed side effort, which tends to produce an abandoned internal tool within a year. CNCF's Vol. 4 report also found that 55.9% of companies already run more than one internal developer platform, often split by frontend, backend, and data/AI workloads — multiplying the staffing problem, since each platform needs its own catalog maintenance and plugin tracking.

The real cost line items are easy to underestimate: salary is the smallest piece. Add the opportunity cost of pulling senior engineers off product work, the upkeep of golden-path templates as frameworks and base images change monthly, the on-call burden when the platform itself breaks and takes every team's deploy pipeline with it, and the slow cost of a catalog that drifts out of sync with the services it describes. None of that shows up on a vendor's pricing page or an open-source README.

## How Do You Avoid Turning Your Platform Into a Ticket Queue?

Short answer: measure requester wait time and self-service completion rate from day one, and treat any workflow a developer cannot finish without human approval as a platform bug, not a feature.

The trap is common: a team builds self-service provisioning, but every request still routes through a manual approval queue "for safety." The result is a platform with a UI but the same throughput as the ticket system it replaced, now with extra steps. If developers still wait two days for a new environment, you built a prettier intake form, not a platform.

Three guardrails:

- Set a hard SLA for self-service actions (e.g., new environments provision in under 10 minutes, no human in the loop) and alert on breach.
- Default to policy-as-code gates (automated pass/fail checks) instead of a person approving each request by hand.
- Review platform usage weekly like any internal product: adoption rate, drop-off points, top complaints — not just uptime.

Our take: most teams under roughly 50 engineers don't need a platform team yet — a documented paved road, a couple of good Terraform modules, and a part-time-maintained Backstage instance will outperform a staffed platform org with nothing proportionate to manage. Build the team when the ticket queue, not the ambition, demands it.

## Frequently Asked Questions

### What is the difference between platform engineering and an internal developer platform?

Platform engineering is the discipline and team function; an internal developer platform (IDP) is the product that team builds and operates. You can do platform engineering work — paving golden paths, writing shared Terraform modules — without shipping a single unified portal, and you can also buy an IDP off the shelf without a dedicated team to run it well.

### Is Backstage free to use?

Yes, Backstage is free and open source under the Apache 2.0 license, since it is a CNCF project, not a commercial product. The cost is not the software; it is the engineering time to deploy, integrate, and maintain it — typically one to two engineers for initial setup and ongoing plugin maintenance.

### How many engineers does it take to run an internal developer platform?

Most mid-size organizations need 3–6 dedicated platform engineers to run an IDP properly, covering catalog upkeep, golden-path templates, on-call, and plugin integration. Teams that run one with a single part-time owner typically see it decay into stale documentation within a year.

### Should a small startup build an internal developer platform?

No, a startup with fewer than roughly 30–40 engineers and a handful of services almost never needs a dedicated IDP yet. A small, documented paved road — a couple of maintained Terraform modules, a standard CI template, and clear ownership — delivers most of the benefit without the multi-engineer cost center a full platform team requires.

Sources: [CNCF: Backstage documentary highlights project evolution, March 2026](https://www.cncf.io/announcements/2026/03/25/cncf-backstage-documentary-highlights-project-evolution-from-development-to-global-open-source-standard-for-platform-engineering/) · [backstage.io](https://backstage.io) · [SD Times: The 2026 Cloud Native Developer Survey](https://sdtimes.com/cloud-native/the-2026-cloud-native-developer-survey-tracking-adoption-and-maturity-in-platform-engineering/) · [CNCF Projects: Backstage](https://www.cncf.io/projects/backstage/)
