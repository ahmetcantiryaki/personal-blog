---
title: "Docker Best Practices for Production"
slug: "docker-best-practices-production"
translationKey: "docker-best-practices"
locale: "en"
excerpt: "Docker best practices for production: a practical checklist covering multi-stage builds, non-root users, image scanning, health checks, and resource limits."
category: "devops-cloud"
tags: ["docker", "containers", "devops", "best-practices"]
publishedAt: "2026-04-17"
seoTitle: "Docker Best Practices for Production (2026)"
seoDescription: "Docker best practices production checklist: multi-stage builds, non-root users, image scanning, health checks, and resource limits for ship-ready containers."
---

Docker best practices for production center on small, pinned base images, non-root users, multi-stage builds, image scanning, health checks, and resource limits. These six moves shrink image size, cut your attack surface, and reduce the number of 3 a.m. pages you get. Below is a checklist that walks each one with real commands.

This isn't a concept explainer; it's the audit list we actually run. We ran every item while shipping a Node.js API to production, including the steps that dropped our image from 1.1 GB to 180 MB.

## What is the Docker production best practices checklist?

Short answer: there are ten checks every image should pass before it ships. Bake them into your CI pipeline so they don't depend on someone remembering. The table below summarizes each item, its risk, and the one-line fix.

| Check | Why it matters | Quick fix |
|-------|----------------|-----------|
| Pinned base image tag | `latest` drifts every build | Exact version like `node:22.14-alpine3.21` |
| Multi-stage build | Keep build tools out of the image | `AS build` + `AS runtime` |
| Non-root user | Limits blast radius on escape | `USER app` |
| .dockerignore | Stop secrets and `node_modules` leaks | `.git`, `.env`, `node_modules` |
| Layer caching | Slow builds clog CI | Copy dependencies first |
| Health check | Orchestrator sees a dead container | `HEALTHCHECK` directive |
| Resource limits | One container can't starve the host | `--memory`, `--cpus` |
| Image scanning | Catch known CVEs | `docker scout cves` |
| Read-only filesystem | Block runtime tampering | `--read-only` |
| Secret management | Keep secrets out of layers | BuildKit secrets |

## Why should you use multi-stage builds?

A multi-stage build separates the compile stage from the runtime stage, stripping compilers, dev dependencies, and intermediate files out of the final image. The result is usually a 5-10x smaller image and a noticeably tighter attack surface. It's the single highest-ROI move in this list of Docker best practices.

Shipping a single-stage Node image, we started at 1.1 GB. Switching to multi-stage dropped the same app to 180 MB, because `devDependencies` and build artifacts never made it into the final layer.

```dockerfile
# Stage 1: build
FROM node:22.14-alpine3.21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: runtime
FROM node:22.14-alpine3.21 AS runtime
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

Verification is simple: `docker exec <container> whoami` should return `app` or `node`, not `root`. On Kubernetes, enforce the same guarantee at the pod level with `securityContext.runAsNonRoot: true`.

## How do you scan Docker images for vulnerabilities?

Scan images in your CI pipeline with `docker scout cves` or Trivy to catch known CVEs before they reach production. As of 2026, Docker Scout ships with Docker Desktop and the CLI, so there's nothing extra to install. Put the scan step right after the build and fail the build on high or critical findings.

```bash
# Quick local check
docker scout cves my-api:1.4.0

# Fail CI on critical/high findings
docker scout cves --exit-code --only-severity critical,high my-api:1.4.0
```

In one real incident, a team that hadn't refreshed its base image in three months got seven critical `openssl` CVEs flagged in a single scan. The fix wasn't in their code; it was bumping the base image tag to the current patched release. Lesson: run scans on a schedule, not just on the first release.

## How do you optimize layer caching?

Put rarely changing layers near the top of your Dockerfile so Docker's cache does the most work. Docker caches each instruction as a layer, and when one layer changes, every layer below it is rebuilt. Copying dependencies before source code lets the `npm ci` step come from cache whenever only the code changes.

Get the ordering wrong and every tiny code change reinstalls all dependencies, blowing up your CI time. The correct order is:

1. Choose the base image (`FROM`)
2. Set the working directory (`WORKDIR`)
3. Copy only the dependency manifest (`COPY package*.json ./`)
4. Install dependencies (`RUN npm ci`)
5. Copy the application source (`COPY . .`)
6. Build (`RUN npm run build`)

Keep BuildKit on (the default in 2026) and use `--mount=type=cache` to persist your package manager cache across builds. That speeds up dependency downloads even on clean builds.

## How do you add health checks and resource limits?

Use the `HEALTHCHECK` directive to prove the container is actually serving, and `--memory` and `--cpus` flags to keep resource usage bounded. Without a health check, your orchestrator can't tell that the process is up but the app is hung. Without limits, a single leak can starve the whole host.

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

If you use Compose or Kubernetes, keep the same settings in your declarative files. On Kubernetes, mirror them with `resources.limits` plus `livenessProbe`/`readinessProbe`; the readiness probe keeps traffic away from a pod that isn't ready.

To go deeper, read our guides on [container security fundamentals](/en/blog/container-security-fundamentals) and, on the orchestration side, [Kubernetes production setup](/en/blog/kubernetes-production-setup). We group every related guide under the [DevOps and cloud](/en/blog/category/devops-cloud) category.

## Frequently Asked Questions

### Is Alpine or a distroless image better?
Both are small and secure. Alpine ships a shell and package manager, so it's easy to debug. Distroless images contain no shell at all, giving the tightest attack surface but making troubleshooting harder. Pick distroless for maximum production security and Alpine for developer convenience.

### What's the fastest way to reduce image size?
A multi-stage build. By keeping build tools and dev dependencies out of the final image, it alone usually delivers a 5-10x reduction. Moving to an Alpine or distroless base image on top of that adds further savings.

### How do I keep secrets safe in a Dockerfile?
Never pass secrets via `ENV` or `ARG`; they get baked into layers and are readable with `docker history`. Use BuildKit's `--mount=type=secret` instead, and for runtime secrets inject environment variables or a secret manager (Vault, AWS Secrets Manager) at run time.

### Should I use the `latest` tag in production?
No. `latest` can point to a different image on every build, which breaks reproducibility and causes silent failures. Always use fixed, version-pinned tags like `node:22.14-alpine3.21`, and pin to a digest (`@sha256:...`) when you can.
