---
title: "Microservices vs Monolith: Making the Call"
slug: "microservices-vs-monolith"
translationKey: "microservices-vs-monolith"
locale: "en"
excerpt: "Per CNCF's 2025 survey, 42% of teams that adopted microservices are consolidating services back. Microservices vs monolith, with a 2026 decision table inside."
category: "software-engineering"
tags: ["microservices", "software-architecture", "system-design"]
publishedAt: "2026-07-06"
seoTitle: "Microservices vs Monolith: A 2026 Decision Guide"
seoDescription: "Microservices vs monolith with 2026 data: CNCF's survey, Amazon Prime Video's 90% cost cut, and a decision table to know which one to start with in minutes."
---

**Microservices vs monolith** has decisively shifted direction in 2026. CNCF's 2025 Annual Survey—689 respondents, ±3.8% margin of error—found that 42% of organizations that adopted microservices are now consolidating services back into larger deployable units. The question is no longer "how do I split this," it's "do I actually need to split at all?"

The answer comes down to one truth: how many teams do you have, and what must you scale independently? With a single team and one deploy pipeline, a monolith is faster, cheaper, and easier to debug. When separate teams must ship independently and services must scale on their own, microservices earn their keep. This piece compares the two with 2026 numbers, real migration costs, and production examples.

## What is the difference between microservices and a monolith?

Short answer: A monolith gathers all business logic into a single codebase and a single deployable unit. Microservices split the application into small independent services, each with its own database and deploy pipeline, talking over the network. The difference is where the boundaries are drawn: inside the code, or across the network?

A monolith runs as one process; modules call each other with function calls. In a microservices architecture, that same call becomes an HTTP or gRPC request across a network boundary. The term went mainstream with Martin Fowler and James Lewis's 2014 [Microservices](https://martinfowler.com/articles/microservices.html) article, and it remains the reference definition in 2026.

A simple heuristic: if you build one repository and deploy it in a single shot to change a feature, you're running a monolith. If that same feature requires three separate services to be released independently, you're in microservices territory.

## Comparison table: microservices vs monolith

The table below compares the two architectures across the dimensions that matter in production. When deciding, look at these rows first.

| Dimension | Modular Monolith | Microservices |
|-----------|------------------|---------------|
| Deploy unit | Single | One per service |
| Ideal team size | 10-50 developers | 50+, clearly bounded teams |
| Scaling | Whole app together | Per-service, independent |
| Data | Single database, ACID transactions | Database per service, distributed consistency |
| Debugging | Easy, single stack trace | Hard, distributed tracing (OpenTelemetry) required |
| Initial speed | High, low overhead | Low, heavy infra tax |
| Operational cost | Low | High (CI/CD, monitoring, network) |
| Boundary enforcement | Caught at compile time via Spring Modulith / ArchUnit | Network boundary is a natural wall, but an expensive one |

Practical rule: if a feature's boundaries stay inside one team, write a monolith. If those boundaries split across different teams and different scaling needs, consider microservices.

## When should you use a monolith?

Short answer: Use a monolith when one or a few teams work on a single product, you're still chasing product-market fit, and your operational maturity is limited. Per CNCF's data, for teams of 10-50 developers a modular monolith isn't just the default—it's usually the correct answer.

Where a monolith shines:

- **Early-stage products:** You don't yet know where the boundaries belong. Moving a module boundary inside a monolith is a refactor; in microservices it's a project requiring two teams to coordinate.
- **Small teams:** For a 5-10 person team, the CI/CD, monitoring, and network overhead of 15 services is pure waste.
- **Strong-consistency transactions:** An operation you handle with `BEGIN...COMMIT` on one database becomes saga and compensation logic in microservices.

The most striking example came from Amazon itself: Prime Video's Video Quality Analysis team pulled its distributed, AWS Step Functions–based system back into a single-process monolith and [cut infrastructure cost by 90%](https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90). The problem was in the architecture, not the code: every frame was uploaded to S3 and re-downloaded by the next service, and every state transition was billed separately.

```python
# Modular monolith: boundaries in code, calls are function calls
def create_order(cart: Cart) -> Order:
    with db.transaction():                  # one ACID transaction
        inventory.decrement(cart.items)     # same process, same DB
        payment = billing.charge(cart.total)  # no network, no saga
        return save_order(cart, payment)
```

In this code the transaction either fully commits or fully rolls back. There's no distributed-consistency headache, and that's a monolith's biggest early-stage value.

## When should you use microservices?

Short answer: Use microservices when separate teams need to ship independently, you must scale services independently of each other, and you have the operational maturity to run a distributed system. Microservices only pay back the cost of team autonomy and selective scaling once the organization grows large enough.

Where microservices shine:

- **Independent team scale:** When 8 teams commit to one monolith, the release pipeline jams. If each team ships its own service at its own pace, throughput rises. Amazon and Netflix went this way for exactly this reason.
- **Asymmetric scaling:** If your video-encoding service wants 40 machines while your user-profile service gets by on 2, scaling them separately saves serious money.
- **Technology diversity:** If you want a service in Go, ML inference in Python, and a real-time layer in Rust, service boundaries make that natural.

Three things are mandatory when you move to microservices. First, a solid **observability layer**: without [distributed tracing (OpenTelemetry)](https://opentelemetry.io/docs/), centralized logs, and metrics, finding where a single request stalled is impossible—we cover this in our [observability 101 guide](/en/posts/observability-logs-metrics-traces). Second, automated [CI/CD and infrastructure](/en/posts/how-to-build-cicd-pipeline): you can't hand-deploy 20 services. Third, resilience to network failures: without retries, timeouts, circuit breakers, and idempotent endpoints, one slow service takes down the whole system.

```python
# Microservices: boundary on the network, calls are network requests — resilience required
async def create_order(cart: Cart) -> Order:
    async with circuit_breaker, timeout(2.0):      # the network can drop anytime
        await inventory_service.reserve(cart.items)   # HTTP/gRPC
        payment = await payment_service.charge(cart.total)  # separate DB, separate team
    # On failure, compensation (saga) logic kicks in
    return await order_service.save(cart, payment)
```

## Microservices vs monolith: how do I decide?

Short answer: Ask three questions in order. "Is one or a few teams working on a single product?" If yes, monolith. "Do I truly need to scale services separately?" If no, monolith. "Do I have the monitoring, CI/CD, and on-call maturity to run a distributed system?" If no, monolith. If you drift toward microservices on all three, use microservices.

Practical criteria that speed up the decision:

1. **Start with the simplest thing.** Nearly every successful system started as a monolith. Add complexity only when a measurable pain (release jams, team collisions) shows up.
2. **Anchor on team count.** By Conway's Law, your architecture mirrors your org. If you're one team, one service makes sense; keep service count close to team count.
3. **Begin with a modular monolith.** Discover the boundaries in code first. Tools like [Spring Modulith 2.0](https://spring.io/projects/spring-modulith) (GA November 2025, built on Spring Boot 4) enforce module boundaries at compile time with ArchUnit—so extracting a module into a service later becomes easy.
4. **Split only if scaling is truly asymmetric.** If the whole app grows under the same load, splitting gives you no scaling benefit and only adds cost.
5. **Assess operational maturity honestly.** Without distributed tracing, automated deploys, and an on-call culture, microservices pile up debt rather than paying it down.

An opinionated take: in 2026, adopting microservices "because it's modern" is burning money. Even service mesh adoption slid from 18% in Q3 2023 to 8% by late 2025. Mature teams are pragmatic—they start with a well-modularized monolith and carve out only the 2-5 "hot paths" that genuinely need independent scaling. This is part of a broader discipline; our pieces on [design patterns](/en/posts/design-patterns-for-developers) and the [system design interview](/en/posts/system-design-interview-guide) go deeper on drawing clean boundaries. For the full picture, browse our [Software Engineering category](/en/category/software-engineering).

## Frequently Asked Questions

### Microservices vs monolith: which should I start with?

Almost always a monolith. Early on you can't know where the boundaries belong, and the infra overhead of microservices slows small teams down. Build a well-modularized monolith, then extract individual services when a real pain (release jams, asymmetric scaling) appears.

### Is a monolith always bad?

No, that's a common misconception. A monolith doesn't mean "spaghetti code." A modular monolith with clean internal boundaries is faster, cheaper, and more reliable than microservices for most products. Large products like Shopify and GitHub still run largely on a monolith.

### What is the biggest hidden cost of moving to microservices?

Operational overhead. Network failures, distributed tracing, per-service CI/CD, distributed data consistency, and on-call complexity cost more than the code itself. Per DORA data, most microservices teams still deploy their services together anyway—maximum complexity for minimum benefit.

### Can I use both together?

Yes, this is the most common mature approach. You keep core logic in a modular monolith and extract only the parts that genuinely need independent scaling (say, media processing or notifications) into separate services. That preserves the monolith's simplicity while giving you microservices' flexibility exactly where you need it.
