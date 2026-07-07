---
title: "Docker Best Practices for Production"
slug: "docker-best-practices-production"
translationKey: "docker-best-practices"
locale: "en"
excerpt: "Docker best practices for production: a practical, 2026-current checklist covering multi-stage builds, non-root users, image scanning, health checks, and resource limits."
category: "devops-cloud"
tags: ["docker", "containers", "devops", "best-practices"]
publishedAt: "2026-07-01"
seoTitle: "Docker Best Practices for Production (2026)"
seoDescription: "Docker best practices production checklist: multi-stage builds, non-root users, Docker Scout image scanning, health checks, and resource limits for ship-ready containers."
---

Docker best practices for production center on small, pinned base images, non-root users, multi-stage builds, image scanning, health checks, and resource limits. These six moves shrink image size, cut your attack surface, and reduce the number of 3 a.m. pages you get. Below is a checklist that walks each one with real commands, updated to the versions shipping as of July 2026.

This isn't a concept explainer; it's the audit list we actually run. We ran every item while shipping a Node.js API to production, including the steps that dropped our image from 1.1 GB to 180 MB.

## What is the Docker production best practices checklist?

Short answer: there are ten checks every image should pass before it ships. Bake them into your CI pipeline so they don't depend on someone remembering. The table below summarizes each item, its risk, and the one-line fix.

| Check | Why it matters | Quick fix |
|-------|----------------|-----------|
| Pinned base image tag | `latest` drifts every build | Exact version like `node:24.18-alpine3.22` |
| Multi-stage build | Keep build tools out of the image | `AS build` + `AS runtime` |
| Non-root user | Limits blast radius on escape | `USER app` |
| .dockerignore | Stop secrets and `node_modules` leaks | `.git`, `.env`, `node_modules` |
| Layer caching | Slow builds clog CI | Copy dependencies first |
| Health check | Orchestrator sees a dead container | `HEALTHCHECK` directive |
| Resource limits | One container can't starve the host | `--memory`, `--cpus` |
| Image scanning | Catch known CVEs | `docker scout cves` |
| Read-only filesystem | Block runtime tampering | `--read-only` |
| Secret management | Keep secrets out of layers | BuildKit secrets |

Note: with [Docker Engine 28](https://docs.docker.com/engine/release-notes/28/), BuildKit is now the default builder, so most of the steps below work with no extra configuration.

## Which base image and tag should I pick?

Don't use the `latest` tag in production; it can point to a different image on every build and breaks reproducibility. Pin to a fixed, version-locked tag instead. On the Node.js side, as of July 2026 the Active LTS is **Node.js 24 (Krypton)**; Node.js 26 shipped in April 2026 but doesn't enter LTS until October 2026 (see the [official Node image](https://hub.docker.com/_/node) for current tags). For production, stay on LTS: a tag like `node:24.18-alpine3.22` pins both the runtime version and the base distro.

Go one step further and pin the image by digest (`node@sha256:...`). That way, even if the publisher silently republishes under the same tag, you run exactly the bytes you tested. It's the cheapest security win in this list of Docker best practices.

## Why should you use multi-stage builds?

A multi-stage build separates the compile stage from the runtime stage, stripping compilers, dev dependencies, and intermediate files out of the final image. The result is usually a 5-10x smaller image and a noticeably tighter attack surface. It's the single highest-ROI move on this list.

Shipping a single-stage Node image, we started at 1.1 GB. Switching to multi-stage dropped the same app to 180 MB, because `devDependencies` and build artifacts never made it into the final layer. A smaller image isn't just about disk: pull times drop, deploys speed up, and there are fewer binaries to hand an attacker.

A practical rule: copy only what the runtime needs into the final stage. Compilers, test tools, `git` history, and source `.ts` files are useless in a runtime image.

```dockerfile
# Stage 1: build
FROM node:24.18-alpine3.22 AS build
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

# Stage 2: runtime
FROM node:24.18-alpine3.22 AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node healthcheck.js || exit 1
CMD ["node", "dist/server.js"]
```

## How do you run containers as a non-root user?

Add a `USER` directive to your Dockerfile so the container runs as an unprivileged account. By default containers run as root, so if an attacker escapes the app they risk gaining root on the host. A non-root user sharply limits the damage in that scenario.

The official Alpine-based Node images ship a ready-made `node` user, so you only need `USER node`. In a custom image, create the user yourself:

```dockerfile
RUN addgroup -S app && adduser -S app -G app
USER app
```

Verification is simple: `docker exec <container> whoami` should return `app` or `node`, not `root`. On Kubernetes, enforce the same guarantee at the pod level with `securityContext.runAsNonRoot: true`. We collected the usual cluster-level slip-ups in [10 Kubernetes mistakes to avoid](/en/posts/kubernetes-mistakes-to-avoid).

## How do you scan Docker images for vulnerabilities?

Scan images in your CI pipeline with `docker scout cves` or Trivy to catch known CVEs before they reach production. As of July 2026, [Docker Scout](https://docs.docker.com/scout/) ships with Docker Desktop and the CLI, so there's nothing extra to install. It aggregates data from 23 advisory sources including NVD and the GitHub Advisory Database, and shows CVSS v4 scores when available. Put the scan step right after the build and fail the build on high or critical findings.

```bash
# Quick local check
docker scout cves my-api:1.4.0

# Fail CI on critical/high findings
docker scout cves --exit-code --only-severity critical,high my-api:1.4.0
```

If you prefer open source, [Trivy](https://github.com/aquasecurity/trivy/releases/latest) is a strong alternative; the latest stable release in early July 2026 is **v0.70.0** (April 17, 2026). Heads up: that release rotated the GPG signing keys for the deb and rpm repos, so pipelines that install Trivy from the package repository need to re-import the new key first.

In one real incident, a team that hadn't refreshed its base image in three months got seven critical `openssl` CVEs flagged in a single scan. The fix wasn't in their code; it was bumping the base image tag to the current patched release. Lesson: run scans on a schedule, not just on the first release. To wire the same discipline into your delivery flow, see [how to build a CI/CD pipeline from scratch](/en/posts/how-to-build-cicd-pipeline).

## How do you tune layer caching, health checks, and limits?

Put rarely changing layers near the top of your Dockerfile so Docker's cache does the most work. Docker caches each instruction as a layer, and when one layer changes, every layer below it is rebuilt. Copying dependencies before source code lets the `npm ci` step come from cache whenever only the code changes. The correct order is:

1. Choose the base image (`FROM`)
2. Set the working directory (`WORKDIR`)
3. Copy only the dependency manifest (`COPY package*.json ./`)
4. Install dependencies (`RUN npm ci`)
5. Copy the application source (`COPY . .`)
6. Build (`RUN npm run build`)

Use BuildKit's `--mount=type=cache` to persist your package manager cache across builds; that speeds up dependency downloads even on clean builds. On the runtime side, use `HEALTHCHECK` to prove the container is actually serving, and `--memory` and `--cpus` to keep resource usage bounded.

```bash
docker run -d \
  --name my-api \
  --memory=512m \
  --cpus=1.5 \
  --read-only \
  --tmpfs /tmp \
  --restart=on-failure:5 \
  my-api:1.4.0
```

Without a health check, your orchestrator can't tell that the process is up but the app is hung. Making the root filesystem `--read-only` and mounting only the paths you need (like `/tmp`) as `--tmpfs` shuts the door on most runtime tampering. On Kubernetes, mirror these with `resources.limits` plus `livenessProbe`/`readinessProbe`.

My opinionated take: the most-neglected item here isn't image scanning, it's digest pinning. Even during a clean [zero-downtime deployment](/en/posts/zero-downtime-deployments), the "same tag" assumption can bite you silently. For the wider picture, browse the [DevOps and Cloud](/en/category/devops-cloud) category.

## Frequently Asked Questions

### Is Alpine or a distroless image better?
Both are small and secure. Alpine ships a shell and package manager, so it's easy to debug. Distroless images contain no shell at all, giving the tightest attack surface but making troubleshooting harder. Pick distroless for maximum production security and Alpine for developer convenience.

### What's the fastest way to reduce image size?
A multi-stage build. By keeping build tools and dev dependencies out of the final image, it alone usually delivers a 5-10x reduction. Moving to an Alpine or distroless base image on top of that adds further savings.

### How do I keep secrets safe in a Dockerfile?
Never pass secrets via `ENV` or `ARG`; they get baked into layers and are readable with `docker history`. Use BuildKit's `--mount=type=secret` instead, and for runtime secrets inject environment variables or a secret manager (Vault, AWS Secrets Manager) at run time.

### Which Node.js tag should I use in production?
Stay on Active LTS. As of July 2026 that's Node.js 24; pick a tag like `node:24.18-alpine3.22` that pins both the version and the Alpine distro, and pin to a digest (`@sha256:...`) when you can. Node.js 26 has shipped but isn't LTS until October 2026, so waiting is the safer call for critical production.
