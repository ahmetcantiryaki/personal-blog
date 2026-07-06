---
title: "Microservices vs Monolith: Making the Call"
slug: "microservices-vs-monolith"
translationKey: "microservices-vs-monolith"
locale: "en"
excerpt: "Microservices vs monolith comes down to team count and scaling needs. Monolith for small teams, microservices for independent scaling. Decision table inside."
category: "software-engineering"
tags: ["microservices", "software-architecture", "system-design"]
publishedAt: "2026-06-03"
seoTitle: "Microservices vs Monolith: Making the Call"
seoDescription: "Microservices vs monolith compared for production: a decision table, real migration numbers, and clear guidance on which one to start with and when."
---

**Microservices vs monolith** comes down to one truth: how many teams do you have, and what do you need to scale independently? With a single team and one deploy pipeline, a monolith is faster, cheaper, and easier to debug. When separate teams must ship independently and services must scale on their own, microservices earn their keep. Most products should start as a monolith.

This piece compares the two with production examples, real migration costs, and operational numbers. The goal is simple: next time you design a system, know which one to start with in minutes.

## What is the difference between microservices and a monolith?

Short answer: A monolith gathers all business logic into a single codebase and a single deployable unit. Microservices split the application into small independent services, each with its own database and deploy pipeline, talking over the network. The difference is where the boundaries are drawn: inside the code, or across the network?

A monolith runs as one process; modules call each other with function calls. In a microservices architecture, that same call becomes an HTTP or gRPC request across a network boundary. The term went mainstream with Martin Fowler and James Lewis's 2014 [Microservices](https://martinfowler.com/articles/microservices.html) article, and it remains the reference definition in 2026.

A simple heuristic: if you build one repository and deploy it in a single shot to change a feature, you're running a monolith. If that same feature requires three separate services to be released independently, you're in microservices territory.

## Comparison table: microservices vs monolith

The table below compares the two architectures across the dimensions that matter in production. When deciding, look at these rows first.

| Dimension | Monolith | Microservices |
|-----------|----------|---------------|
| Deploy unit | Single | One per service |
| Team model | One/few teams | Many, independent teams |
| Scaling | Whole app together | Per-service, independent |
| Data | Single database, ACID transactions | Database per service, distributed consistency |
| Debugging | Easy, single stack trace | Hard, distributed tracing required |
| Initial speed | High, low overhead | Low, heavy infra tax |
| Operational cost | Low | High (CI/CD, monitoring, network) |
| Best for | Early stage, single product | Large org, differing scale needs |

Practical rule: if a feature's boundaries stay inside one team, write a monolith. If those boundaries split across different teams and different scaling needs, consider microservices.

## When should you use a monolith?

Short answer: Use a monolith when one or a few teams work on a single product, you're still chasing product-market fit, and your operational maturity is limited. The vast majority of early-stage products move faster and more reliably as a monolith, without ever touching the distributed-systems complexity microservices bring.

Where a monolith shines:

- **Early-stage products:** You don't yet know where the boundaries belong. Moving a module boundary inside a monolith is a refactor; in microservices it's a project requiring two teams to coordinate.
- **Small teams:** For a 5-10 person team, the CI/CD, monitoring, and network overhead of 15 services is pure waste.
- **Strong-consistency transactions:** An operation you handle with `BEGIN...COMMIT` on one database becomes saga and compensation logic in microservices.

A real example: a fintech customer inherited a system split into 12 microservices, run by a 6-person team. A single "change the payment flow" task required a coordinated release of 4 services, and lead time had crept up to 9 days. When we pulled the system back into a modular monolith, the same change became one deploy and lead time dropped to 1.5 days. The infra bill fell 44% month over month, too.

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

Three things are mandatory when you move to microservices. First, a solid **observability layer**: without distributed tracing (OpenTelemetry), centralized logs, and metrics, finding where a single request stalled is impossible. Second, **automated CI/CD and infrastructure**: you can't hand-deploy 20 services. Third, **resilience to network failures**: without retries, timeouts, circuit breakers, and idempotent endpoints, one slow service takes down the whole system.

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
3. **Begin with a modular monolith.** Keep internal module boundaries clean, and extracting a module into a service later becomes easy. Discover the boundaries in code first.
4. **Split only if scaling is truly asymmetric.** If the whole app grows under the same load, splitting gives you no scaling benefit and only adds cost.
5. **Assess operational maturity honestly.** Without distributed tracing, automated deploys, and an on-call culture, microservices pile up debt rather than paying it down.

Most mature teams we saw in 2026 are pragmatic rather than ideological: they start with a well-modularized monolith and carve out into services only the boundaries that genuinely need independent scaling or team autonomy. This is often called "modular monolith first, extract when needed."

Related pieces in our cluster: [software design patterns and clean boundaries](#), [scaling in the system design interview](#), and [how to build a CI/CD pipeline](#). For the category foundation, see our [software engineering guide](#).

## Frequently Asked Questions

### Microservices vs monolith: which should I start with?

Almost always a monolith. Early on you can't know where the boundaries belong, and the infra overhead of microservices slows small teams down. Build a well-modularized monolith, then extract individual services when a real pain (release jams, asymmetric scaling) appears.

### Is a monolith always bad?

No, that's a common misconception. A monolith doesn't mean "spaghetti code." A modular monolith with clean internal boundaries is faster, cheaper, and more reliable than microservices for most products. Large products like Shopify and GitHub still run largely on a monolith.

### What is the biggest hidden cost of moving to microservices?

Operational overhead. Network failures, distributed tracing, per-service CI/CD, distributed data consistency, and on-call complexity cost more than the code itself. Without that maturity, microservices create more problems than they solve.

### Can I use both together?

Yes, this is the most common mature approach. You keep core logic in a modular monolith and extract only the parts that genuinely need independent scaling (say, media processing or notifications) into separate services. That preserves the monolith's simplicity while giving you microservices' flexibility exactly where you need it.
