---
title: "npm 12 Security: Install Scripts Off by Default"
slug: "npm-12-security-install-scripts-default"
translationKey: "npm-12-security-defaults-2026"
locale: "en"
excerpt: "npm 12 shipped July 8, 2026 and turned off preinstall, install, and postinstall scripts by default, closing the path used by the ChainDrop worm."
category: "devops-cloud"
tags: ["nodejs", "web-security", "ci-cd", "open-source"]
publishedAt: "2026-09-24"
seoTitle: "npm 12 Security Defaults: Install Scripts Blocked"
seoDescription: "npm 12 blocks preinstall/install/postinstall scripts, Git and remote URL dependencies by default. Here's the CI/CD migration path and why it matters."
---

Short answer: npm 12 shipped on July 8, 2026, and stopped running a dependency's `preinstall`, `install`, and `postinstall` lifecycle scripts by default — along with Git and remote-URL dependencies, which now also require explicit opt-in before npm will resolve them.

## What exactly changed in npm 12?

Three defaults flipped at once. First, `allowScripts` now defaults to off: a dependency's lifecycle scripts and implicit `node-gyp` builds no longer run unless you explicitly allow them. Second, `--allow-git` now defaults to none, so Git-sourced dependencies aren't resolved without permission. Third, `--allow-remote` also defaults to none, blocking dependencies pulled from remote URLs the same way.

Together, these three changes are meant to guarantee that running `npm install` can no longer execute code you didn't know about.

One important detail: this covers not just your direct dependencies but your dependencies' dependencies too. Previously, a postinstall script three levels deep in a dependency tree could run without you ever knowing it existed; under npm 12, every package in that tree, including the deep ones, waits for individual approval. That directly targets the sneakiest part of attacks like ChainDrop: the worm didn't run from its own package, it ran from inside a dependency you already trusted and had probably never inspected.

## Why did npm need this change now?

The direct trigger: postinstall scripts have been the delivery mechanism for the most damaging npm supply-chain attacks of the past year. The clearest recent example is the ChainDrop worm, which surfaced in August 2026. Attackers compromised a maintainer's GitHub account and seeded 11 malicious packages into the `keyv` and `cacheable` namespaces; the worm started with `keyv@6.0.0` and self-propagated using stolen npm and GitHub credentials.

The result: 444 packages and 2,212 versions got infected in under four hours, and the combined weekly download count of affected packages topped 500 million. The payload was a heavily obfuscated Bun-based JavaScript file that ran automatically through the `preinstall` hook before installation even finished — meaning running `npm install` on one infected package was enough to have your credentials stolen with zero further action.

## How do I update my CI/CD pipeline?

First, find out which packages in your dependency tree try to run scripts:

```bash
npm approve-scripts --allow-scripts-pending
```

This lists every package that requests a lifecycle script; you approve the ones you trust, and npm writes those approvals into an updated `package.json`. If you try to build in CI before committing that approval list, a package that installed cleanly yesterday can suddenly fail its build step because its script is now blocked — so finishing the migration locally and committing the approvals is the only reliable way to avoid a surprise CI break.

| npm version | Install scripts | Git dependencies | Remote URL dependencies |
|---|---|---|---|
| npm 11 and earlier | On by default | Resolved by default | Resolved by default |
| npm 12 | Off by default, needs manual approval | Blocked by default, needs explicit permission | Blocked by default, needs explicit permission |

## Which packages should I actually trust?

A package requesting a lifecycle script isn't automatically suspicious — packages requiring native builds, like `node-sass` or `sharp`, legitimately need an `install` script. The real question is whether the maintainer's account is well-secured and whether the current release changed behavior unexpectedly. Three layers help here: always commit your lockfile, pin dependencies to exact versions instead of caret ranges, and enforce npm's provenance verification in CI. Checking whether maintainer accounts use 2FA or passkeys cuts third-party risk further — as does scoping your own publish tokens to the minimum permission they need (publish-only, not read-write).

## Do I need to switch to pnpm or Yarn Berry?

Not necessarily, but it's worth considering. pnpm and Yarn Berry (in Plug'n'Play mode) already restricted install scripts by default before npm caught up; npm 12 has closed that gap. Bun sits at a different point on the risk curve — fast, but not yet as strict as npm 12 on script permissions. If your team already uses npm, there's no forcing function to switch, since npm 12's new defaults now provide the same protection. If you're starting a new project, comparing all three package managers' script-permission models against your team's CI discipline is a reasonable exercise.

Our honest take: this is a late but correct move from npm — it finally flips the ecosystem's biggest single attack surface, code that runs silently during install, from opt-out to opt-in. It reduces risk, but doesn't eliminate it: a stolen publish token can still push a legitimate-looking release, which is why 2FA and provenance checks don't become optional just because script-blocking exists — they complement it.

## What other layers of defense should I add besides script blocking?

npm 12's defaults aren't enough on their own; an attack like ChainDrop can publish a *legitimate-looking* release using stolen credentials, and script blocking doesn't stop that scenario. A real defense runs four layers together: always commit your lockfile (`package-lock.json`) and use `npm ci` in CI, so a version range doesn't get re-resolved during install; pin dependencies to exact versions instead of caret (`^`) ranges, especially for widely used utility packages; enforce npm's provenance verification (`npm publish --provenance`) for your own packages and, where possible, your dependencies too; and scope publish tokens to the minimum permission needed — a CI token that can only publish, with no read or delete access.

None of these four layers is sufficient alone, but together they substantially change the answer to "what happens if a maintainer account gets compromised": even with a stolen token, a release without provenance verification looks suspicious, a pinned lockfile won't automatically pull it in, and a minimally scoped token limits how much damage a stolen one can actually do.

## Frequently Asked Questions

### Will upgrading to npm 12 break my existing project?

Short answer: it can, if any of your dependencies rely on lifecycle scripts — `npm install` may skip a build step or a native module compile may fail silently. Running `npm approve-scripts --allow-scripts-pending` to see and approve which packages need scripts resolves this cleanly before it hits CI.

### Which packages did the ChainDrop worm affect?

Short answer: ChainDrop, which surfaced in August 2026, started in the `keyv` and `cacheable` namespaces and infected 444 packages and 2,212 versions in under four hours; the combined weekly download count of the affected packages exceeded 500 million.

### How do I bulk-approve install scripts in npm 12?

Short answer: run `npm approve-scripts --allow-scripts-pending`, which lists every package requesting a lifecycle script; approvals get written into `package.json`. Skip committing that file, and scripts stay blocked in any environment that installs from a clean checkout, including CI.

**Sources:** [The Hacker News: npm 12 disables install scripts by default](https://thehackernews.com/2026/07/npm-12-disables-install-scripts-by.html), [Microsoft Security Blog: ChainDrop worm analysis](https://www.microsoft.com/en-us/security/blog/2026/08/04/chaindrop-supply-chain-compromise-anatomy-self-propagating-worm/), [SecurityWeek: Over 400 npm packages infected in ChainDrop](https://www.securityweek.com/over-400-npm-packages-infected-in-chaindrop-supply-chain-attack/).
