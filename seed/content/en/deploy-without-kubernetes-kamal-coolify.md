---
title: "Deploy Without Kubernetes: Kamal vs Coolify"
slug: "deploy-without-kubernetes-kamal-coolify"
translationKey: "self-hosted-paas-kamal-coolify"
locale: "en"
excerpt: "Small teams that don't want Kubernetes's overhead are turning to Kamal and Coolify. From an SSH proxy to a dashboard PaaS, when does each win?"
category: "devops-cloud"
tags: ["self-hosting", "deployment", "devops", "docker"]
publishedAt: "2026-07-20"
seoTitle: "Deploy Without Kubernetes: Kamal vs Coolify Compared"
seoDescription: "Small teams are ditching Kubernetes and rising PaaS bills alike. We compare Kamal's SSH-plus-proxy model against Coolify's dashboard-driven self-hosted PaaS."
---

Want to ship to your own VPS in minutes without installing Kubernetes? You have two realistic options: Kamal, a minimal CLI that manages your Docker containers over SSH with a single YAML file, and Coolify, a full self-hosted PaaS with a dashboard for databases, SSL, and deploys. Both retire Kubernetes's cluster, control plane, and YAML sprawl entirely.

A clear pattern has emerged among small teams and solo developers in 2026: an escape from both Kubernetes's operational complexity and the climbing bills of managed cloud PaaS platforms like Heroku or Render. The answer usually lands on "deploy to my own server, with Docker, but without Kubernetes." This piece compares the two tools leading that movement — Kamal and Coolify — with real use cases in mind.

## Why are teams moving away from Kubernetes?

Kubernetes is powerful, but it has a cost: running a control plane, managing RBAC, learning Helm charts, tuning autoscaling policies. For a five-person team, that becomes operational overhead eating into time that should go to the product. At the same time, the convenience of Heroku-style managed PaaS turns into bill shock as you scale. Kamal and Coolify offer a third path between the two: deploy to a handful of vanilla servers, over Docker, with minimal operational weight.

## How does Kamal actually work?

Kamal is an open-source CLI from 37signals, the creators of Basecamp and Ruby on Rails. It connects to your servers over SSH, starts your Docker containers, and switches traffic from the old container to the new one with zero downtime using its own reverse proxy, `kamal-proxy`. Unlike Kubernetes's dozens of YAML manifests, Kamal's entire configuration lives in a single `config/deploy.yml` file.

```yaml
# config/deploy.yml
service: myapp
image: myorg/myapp

servers:
  web:
    - 192.0.2.10
    - 192.0.2.11

proxy:
  ssl: true
  host: myapp.example.com

registry:
  username: myorg
  password:
    - KAMAL_REGISTRY_PASSWORD
```

With this file, `kamal deploy` installs Docker on a handful of unprepared Ubuntu servers, pulls the image, starts the container, and configures SSL automatically through `kamal-proxy`. Rolling restarts, asset bridging, and managing accessory services (helper containers like Postgres or Redis) are built in too. It's arguably one of the lowest operational-cost ways to apply [zero-downtime deployment](/en/posts/zero-downtime-deployments) principles in practice.

## How does Coolify differ?

Where Kamal is CLI-first, Coolify is a dashboard-first self-hosted PaaS. It runs as a web app installed on your own server and gives you a dashboard for connecting a GitHub repo, deploying containers, and managing databases. Its v4.0 release, shipped May 18, 2026, added support for more than 280 one-click services.

| Feature | Kamal | Coolify |
|---|---|---|
| Interface | CLI, single YAML file | Web dashboard |
| Install model | SSH to servers, no agent | Management app installed on server |
| SSL | Automatic via `kamal-proxy` | Automatic Let's Encrypt |
| Database management | Manual, as accessory service | One-click provisioning from dashboard |
| PR preview deployments | Not built in | Yes, as of v4.0 |
| Multi-server | Listed in config file | Centralized dashboard management |
| Best fit | CLI-comfortable, Rails/Docker-centric teams | Dashboard-preferring, mixed-stack teams |

Coolify's dashboard-driven database provisioning — covering PostgreSQL, MySQL, MariaDB, MongoDB, and Redis — live deploy logs, and one-click rollback are conveniences Kamal's minimalist philosophy deliberately skips. In exchange, running a management layer on the server gives up some of Kamal's "no agent on the box" simplicity.

## Where does Dokku fit in?

A third contender, Dokku, is an older and more minimal tool that mimics Heroku's `git push` experience on your own server. It has fewer features than Coolify but a lighter footprint, making it a reasonable pick for the smallest, single-server setups. The choice between Kamal and Coolify usually comes down to whether the team is more comfortable with a CLI or a dashboard, while Dokku is worth considering for the most budget-constrained, single-server projects.

## Which team should pick which?

The decision matrix boils down to this: teams running Rails or a similar monolith, comfortable with a CLI and config-as-code, and not wanting an extra management interface, get less friction from Kamal. Teams running a mixed tech stack, where not everyone is equally comfortable with a CLI, and who want database provisioning and PR previews from a dashboard, are better served by Coolify. Both still require getting [Docker right in production](/en/posts/docker-best-practices-production) — neither is a magic fix without container discipline.

My honest take: most five-to-ten-person teams never actually need Kubernetes — the industry discourse just makes it feel that way. A year in production on Kamal or Coolify buys you far more shipped product features than a year spent learning and operating Kubernetes would. For more examples of this self-hosting trend, see our piece on [open-source SaaS alternatives](/en/posts/open-source-saas-alternatives-2026).

## How do the two handle secrets and security?

The two tools take different philosophies on secrets. Kamal reads secrets from environment variables or an external secret store (including a 1Password integration) and injects them into the container at deploy time — secrets never sit in plaintext inside `deploy.yml`, only the name of the environment variable to read does. Coolify offers an encrypted secret store through its dashboard, which is less friction for teams uncomfortable with a CLI, but it means secrets live inside the management app's own database. Either way, restricting SSH access to the server, keeping firewall rules tight, and never exposing kamal-proxy or the Coolify dashboard directly to the internet with default credentials are baseline hygiene. For a more complete secrets strategy, see our piece on [cloud secrets management](/en/posts/cloud-secrets-management-done-right) — several of the OIDC-based approaches there apply cleanly to both Kamal and Coolify, especially in setups where CI/CD triggers the deploy.

## Frequently Asked Questions

### Do Kamal or Coolify match everything Kubernetes offers?

No, and that's deliberate. Neither targets Kubernetes-specific capabilities like automatic horizontal autoscaling, a complex service mesh, or multi-region orchestration. Their goal is reliably deploying a typical web app running on a handful of servers, without Kubernetes's operational overhead.

### What are Kamal's minimum requirements?

SSH access and Docker installed on the servers — that's it. Kamal doesn't install an agent; it runs commands over SSH. You can deploy to a vanilla Ubuntu server, with zero prior setup, in minutes.

### What changed in Coolify's v4.0 release?

Shipped May 18, 2026, v4.0 added more than 280 one-click services, Git auto-deploy, automatic Let's Encrypt TLS, and built-in database provisioning for PostgreSQL, MySQL, MongoDB, and Redis. Automatic PR preview URLs also arrived with this release.

### Which one requires less maintenance for a small team?

Generally Kamal, since it doesn't run an extra management app on the server — the only things you need to keep updated are Docker and your deploy.yml. Coolify is an application you need to manage updates for yourself, which asks a bit more maintenance in exchange for far more automation through its dashboard.
