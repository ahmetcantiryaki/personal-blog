---
title: "How to Build an Internal Developer Portal"
slug: "how-to-build-internal-developer-portal"
translationKey: "build-internal-developer-portal-2026"
locale: "en"
excerpt: "An internal developer portal centralizes scattered knowledge with a catalog and scorecards. Run Backstage as the base, layer Cortex on top for standards."
category: "devops-cloud"
tags: ["platform-engineering", "devops", "developer-experience", "automation"]
publishedAt: "2026-09-08"
seoTitle: "How to Build an Internal Developer Portal"
seoDescription: "An internal developer portal centralizes scattered knowledge with a service catalog and scorecards. Backstage is the base; Cortex or OpsLevel layers on top."
---

Short answer: build your internal developer portal on open-source Backstage for the service catalog and golden-path templates, then layer a scorecard tool like Cortex or OpsLevel on top to measure standards — and roll it out incrementally with a two-to-three-person core team, not a platform team of 20.

## What problem does an internal developer portal actually solve?

An IDP exists to reduce the cognitive load and tribal knowledge that build up as a team grows. In a ten-person team, questions like "who owns this service, which environment is it running in, how do I spin up a new one" get asked and answered in Slack; in a fifty-person engineering org, those same questions get asked dozens of times a day, each one stealing someone's focus.

2026 platform engineering reports frame a mature IDP around six core capabilities: service catalog, golden paths (template-driven service creation), self-service provisioning, scorecards, workflow automation, and governance/standards enforcement. Rather than expecting one tool to cover all six, the practical move is to prioritize whichever capability relieves the most pain in your specific organization first.

## Backstage or a managed tool (Port, Cortex)?

Short answer: pick Backstage if you want open-source flexibility and zero license cost; pick a managed SaaS tool like Port or Cortex if you want to start fast without taking on maintenance overhead.

| Tool | Model | Strength | Weakness |
|---|---|---|---|
| Backstage | Open source, self-hosted | Service catalog + Scaffolder for golden-path templates | No built-in scorecards, you own the maintenance |
| Port | SaaS, no-code | Fast setup, free tier up to 15 users | Priced per seat plus entities, limited customization |
| Cortex | SaaS, scorecard-first | Strongest at standards and ownership tracking | Least customizable, catalog not as flexible as Backstage's |

Backstage, open-sourced by Spotify, is the tool that defined this category. Its Scaffolder plugin offers template-driven, guardrailed service creation, but it doesn't ship scorecards on its own — so if you want to see a score for "is this service production-ready," you need a separate tool. That's exactly why most mature IDP stacks pair Backstage with a scorecard platform like Cortex or OpsLevel: one answers the catalog question, the other answers the standards question.

## How do you start with a service catalog and golden paths?

A service catalog is the central inventory answering "what services exist, who owns them, which environment are they running in." In Backstage, each service is defined by a `catalog-info.yaml` file:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: payments-service
  description: Handles payment processing
  annotations:
    github.com/project-slug: company/payments-service
spec:
  type: service
  lifecycle: production
  owner: payments-team
  system: e-commerce
```

A golden path gives a standard answer to "how do I spin up a new service" — a Scaffolder template asks the developer a few questions (service name, language, owning team) and then automates steps like repo creation, wiring up a CI/CD pipeline, and baseline monitoring setup behind the scenes. This replaces the "every team writes its own CI file from scratch" pattern; a new service comes up in minutes, already matching company standards.

## What do scorecards measure, and why doesn't Backstage have them?

A scorecard is a table showing how a service scores against standards like production readiness, security posture, or operational maturity. It automatically grades checks like "does this service have a health check endpoint, is an on-call rotation defined, has a security scan run in the last 90 days" and surfaces that to teams.

Cortex is the strongest tool in this category — its positioning is built entirely around standardizing best practices and golden paths — but that comes at the cost of a less customizable catalog. Backstage not shipping scorecards is a deliberate design choice: it solves the catalog and templating problem and leaves standards tracking to a separate tool. That's why most production IDP stacks layer a portal (Backstage) with a scorecard platform (Cortex or OpsLevel) on top — the two answer different questions.

## How do you roll this out without a platform team of 20?

Short answer: don't try to build all six capabilities at once — solve the one or two that cause the most pain in the first three months. A typical incremental roadmap looks like this:

1. **Months 1-2:** Stand up just the service catalog — inventory existing services with `catalog-info.yaml` files. Solving "who owns what" on its own is already a major win at this stage.
2. **Months 3-4:** Write one golden-path template for your most commonly created service type (say, "a new Node.js microservice"). Getting one template right beats shipping ten half-finished ones.
3. **Months 5-6:** Add one or two critical scorecard checks (does a health check exist, is on-call defined) — not all of them, just the most urgent two.

A two-to-three-person core platform team following this sequence ends up, after six months, with a working IDP that has a catalog, a golden path, and a baseline scorecard — without ever standing up a 20-person team.

The real benefit of this approach is that each stage delivers value on its own. Stop after the catalog alone and "who owns what" is already solved; stop before adding a golden path and nothing built so far goes to waste. That's the opposite of "design everything up front, then build it all at once" — and most platform engineering efforts that stall do so precisely because they chose that opposite approach.

For the broader framework around this discipline, see [our guide to what platform engineering is](/en/posts/what-is-platform-engineering). To keep cloud costs under control, [our FinOps guide](/en/posts/finops-reduce-cloud-costs) is a useful companion. If you're building a CI/CD pipeline from scratch, see [this guide](/en/posts/how-to-build-cicd-pipeline); to cut Kubernetes costs, check [our Kubernetes cost optimization post](/en/posts/kubernetes-cost-optimization). If you're wondering how AI agents fit into on-call processes, see [our piece on that](/en/posts/can-ai-agents-take-over-on-call). For more DevOps coverage, browse [our DevOps & Cloud category](/en/category/devops-cloud).

For sources, see [Backstage's official documentation](https://backstage.io/docs) and [SquareOps's Backstage vs Port vs Cortex comparison](https://squareops.com/blog/backstage-vs-port-vs-cortex/) for tool benchmarks.

## Frequently Asked Questions

### Is an internal developer portal the same thing as platform engineering?

No. Platform engineering is the broader discipline — it covers infrastructure, self-service tooling, and process. An internal developer portal is the developer-facing surface of that discipline: the tool layer that presents the service catalog, templates, and scorecards in one interface.

### How much engineering effort does it take to stand up Backstage?

A two-to-three-person core team is enough to get a service catalog running; getting one golden-path template and a baseline catalog live in the first three months is a realistic target. Running Backstage at full capacity — multiple plugins, custom integrations — takes more resources, but you can grow into that incrementally.

### Do I need scorecards right away, or is a catalog enough?

For small and mid-sized teams, a service catalog alone already delivers major value by answering "who owns what." Scorecards become a priority once team count grows and "which services don't meet the production standard" can no longer be tracked manually.

### Can Port or Cortex fully replace Backstage?

Partially. Port and Cortex are managed alternatives that reduce setup and maintenance overhead, but they aren't as customizable as Backstage's open-source flexibility and community plugin ecosystem. Most teams either start with a managed tool for a fast launch and migrate to Backstage as customization needs grow, or run both together.
