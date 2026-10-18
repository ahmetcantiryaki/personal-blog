---
title: "What Is Dagger? Portable, Container-Based CI/CD"
slug: "what-is-dagger-container-based-ci-cd"
translationKey: "dagger-ci-as-code-2026"
locale: "en"
excerpt: "Dagger runs every pipeline step in a container and lets you write the pipeline as real code, so a run reproduces identically on your laptop and in CI."
category: "devops-cloud"
tags: ["ci-cd", "devops", "containers", "automation"]
publishedAt: "2026-10-18"
seoTitle: "What Is Dagger? Container-Based CI/CD Explained"
seoDescription: "Dagger replaces YAML pipelines with real code and runs every step in a container, so CI behaves identically on your laptop. Here's how it works."
---

[Dagger](https://dagger.io/) is an open-source engine that runs every CI/CD pipeline step inside an OCI container and lets you define the pipeline as code in a real programming language instead of YAML. Because each step is just a container invocation, the exact same pipeline produces the exact same result on your laptop, in GitHub Actions, or in any other CI runner.

## What does Dagger actually do?

Dagger takes the logic you'd normally write as a CI provider's YAML — checkout, install, build, test, push — and turns each step into a function call that executes inside a container, via Docker or any other OCI-compatible runtime. The pipeline itself is a Dagger "module," written in Go, Python, TypeScript, or one of several other [supported SDK languages](https://docs.dagger.io/), so you get real functions, real types, and a real debugger instead of a flat text file of `run:` lines.

The practical shift is where the pipeline lives: it's a piece of your codebase, versioned and reviewed like any other code, rather than a YAML dialect that only means something once it's uploaded to a specific CI provider's servers.

## Why does running everything in a container matter?

It matters because it removes the gap between "works on my machine" and "works in CI." A traditional CI job runs your build on the CI provider's bespoke runner image, with whatever tool versions and environment variables that runner happens to carry — which is rarely identical to a developer's laptop. Dagger's containers pin the exact same OS, tool versions, and environment for a step whether it runs locally or on a runner, so a pipeline that passes on your machine passes in CI for the same reason, not by coincidence.

Content-addressed caching is the second half of the benefit. Each container layer and each step's inputs are hashed, so re-running a pipeline reuses cached layers whenever the inputs haven't changed — locally or in CI. That means you can reproduce a failing CI step by re-running the same Dagger call on your own machine, hitting the same cache, instead of pushing a commit and waiting for a CI run just to see a log.

```bash
# run the same pipeline function locally that CI would run
dagger call build-and-test --source=.

# invoke it from inside a GitHub Actions step — same function, same container
- name: CI
  run: dagger call build-and-test --source=.
```

## How do you write a Dagger pipeline?

You write a module that exposes functions, each one chaining container operations — pull a base image, mount your source, run a command, export an artifact. Here's a minimal pipeline function in Python:

```python
import dagger
from dagger import dag, function, object_type

@object_type
class CiPipeline:
    @function
    async def build_and_test(self, source: dagger.Directory) -> str:
        return await (
            dag.container()
            .from_("python:3.12-slim")
            .with_directory("/app", source)
            .with_workdir("/app")
            .with_exec(["pip", "install", "-r", "requirements.txt"])
            .with_exec(["pytest", "-q"])
            .stdout()
        )
```

That function is callable from `dagger call build_and_test`, from a CI YAML step that shells out to the Dagger CLI, or from another Dagger module — the pipeline logic doesn't change based on who invokes it.

## Do you still need GitHub Actions or GitLab CI?

Yes, usually — Dagger replaces the step logic, not the trigger. Most teams keep their existing CI provider (GitHub Actions, GitLab CI, CircleCI, Jenkins) as the thing that reacts to a push or a pull request and simply has that provider call `dagger call <function>` as its only real step. The CI provider becomes a thin trigger; the actual build/test/deploy logic, caching behavior, and container definitions live in the Dagger module, portable to any other runner later without a rewrite.

## Dagger vs. a traditional YAML pipeline

| | Traditional CI YAML | Dagger module |
|---|---|---|
| Where logic lives | CI provider's YAML dialect | Real code (Go, Python, TypeScript, and others) |
| Local reproducibility | Often impossible without a separate "act"-style emulator | Native — `dagger call` runs the identical container step |
| Caching | Provider-specific cache actions, easy to misconfigure | Content-addressed, automatic across local and CI runs |
| Debugging a failure | Push, wait, read logs | Re-run the same function locally against the same cache |
| Portability across CI providers | Low — logic is tied to one provider's YAML schema | High — swap the trigger, keep the module |

## What are the real tradeoffs?

The main cost is a new abstraction your team has to learn: instead of reading a CI provider's YAML reference, engineers read Dagger's SDK docs and think in terms of container chains. For a small, single-language project with a five-line CI file, that's probably not worth it. The value shows up once pipelines get complex enough that debugging them in CI logs alone becomes painful, or once a team runs the same logic across multiple CI providers or needs to test pipeline changes locally before trusting them in production CI.

## My take

Dagger's real pitch isn't "faster CI," it's "CI you can run and debug like normal code." That's a genuine fix for the worst part of working with YAML pipelines — the ten-minute feedback loop of push, wait, read a log, guess, repeat. Whether it's worth adopting in October 2026 comes down to how much pain your team already feels from that loop; teams with a five-step build-and-deploy YAML that already works reliably have little to gain, while teams juggling multi-stage builds across several languages or several CI providers get the most out of it.

Related reading: see our guide on [running AI agents in CI/CD safely](/en/posts/ai-agents-in-cicd-safely) for a related trend in pipeline automation, our walkthrough on [how to build a CI/CD pipeline](/en/posts/how-to-build-cicd-pipeline) for the YAML-first baseline Dagger replaces, and [monorepo CI/CD caching](/en/posts/monorepo-cicd-caching-affected-builds) for another angle on the same caching problem. If you're deciding how much infrastructure to run alongside your CI, [do you still need Kubernetes in 2026?](/en/posts/do-you-still-need-kubernetes-2026) and [deploying without Kubernetes with Kamal or Coolify](/en/posts/deploy-without-kubernetes-kamal-coolify) cover the deployment side. More in our [DevOps & Cloud](/en/category/devops-cloud) section.

## Frequently Asked Questions

### What is Dagger used for?
Dagger is used to write CI/CD pipelines as real code instead of YAML, with every step running inside a container so the pipeline behaves identically whether it runs on a developer's laptop or inside a CI provider's runner.

### Does Dagger replace GitHub Actions or GitLab CI?
No, most teams keep their existing CI provider as the trigger that reacts to pushes and pull requests, and have it call into a Dagger module for the actual build, test, and deploy logic — Dagger replaces the step logic, not the scheduling and trigger layer.

### What languages can you write Dagger pipelines in?
As of October 2026, Dagger ships SDKs for several languages, commonly cited as Go, Python, TypeScript, PHP, Java, .NET, Elixir, and Rust — check [Dagger's own documentation](https://docs.dagger.io/) and its [GitHub repository](https://github.com/dagger/dagger) for the exact current list, since SDK support has expanded over time.

### Can I test a Dagger pipeline without pushing to CI?
Yes — that's one of Dagger's main selling points. Running `dagger call <function>` locally executes the exact same containerized step that CI would run and hits the same content-addressed cache, so you can reproduce and debug a failing step on your own machine before pushing a commit.
