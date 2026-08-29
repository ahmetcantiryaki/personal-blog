---
title: "Host Your Claude Skills on GitHub: A Guide"
slug: "host-claude-skills-on-github"
translationKey: "host-claude-skills-on-github"
locale: "en"
excerpt: "Hosting Claude Skills on GitHub means a repo with marketplace.json and SKILL.md that teammates add with /plugin marketplace add and install in one command."
category: "ai"
tags: ["claude", "automation", "documentation", "best-practices", "open-source"]
publishedAt: "2026-08-29"
seoTitle: "Host Your Claude Skills on GitHub: A Guide (2026)"
seoDescription: "Hosting Claude Skills on GitHub means a repo with marketplace.json and SKILL.md that teammates add with /plugin marketplace add and install in one command."
---

Short answer: to host Claude Skills on GitHub, add a `.claude-plugin/marketplace.json` file at the repo root, plus a `plugin.json` and `SKILL.md` for each skill; teammates then add the repo with `/plugin marketplace add owner/repo` and install a skill in a single line. That turns a skill from a copy-pasted folder into a versioned, reviewable package.

The difference between keeping a skill on your own machine and shipping it to a team comes down to repo structure. Put three files in the right place, and Claude Code recognizes that repo as a marketplace.

## What Is a Claude Skill, and Why Host It on GitHub?

A Claude Skill is a reusable instruction pack that Claude loads on demand, describing when to use it and how to behave — usually a `SKILL.md` file plus optional supporting scripts. Our [general explainer on Claude Skills](/en/posts/claude-skills-explained-for-everyone) covers the concept from scratch; the focus here is turning a skill you use alone into a package a team or a community can reuse.

Hosting on GitHub buys you three concrete things: versioning (pin to a tag or branch), review (changes go through a pull request), and reuse (the same repo can be added by multiple projects or teammates). The gap between sharing a local skill folder over Slack and adding the same repo with `/plugin marketplace add` is that the latter tracks updates automatically.

## What Repo Structure Do You Need?

A marketplace repo follows a three-level layout: the marketplace definition at the root, one or more plugins beneath it, and one or more skills inside each plugin.

```text
your-repo/
├── .claude-plugin/
│   └── marketplace.json
└── plugins/
    └── your-skill-pack/
        ├── .claude-plugin/
        │   └── plugin.json
        └── skills/
            └── your-skill/
                └── SKILL.md
```

`marketplace.json` defines the repo's name, owner, and the list of plugins it contains:

```json
{
  "name": "team-marketplace",
  "owner": {
    "name": "Your Team",
    "url": "https://github.com/your-org"
  },
  "plugins": [
    {
      "name": "your-skill-pack",
      "source": "./plugins/your-skill-pack",
      "description": "Skills the team shares across projects"
    }
  ]
}
```

`plugin.json` carries the plugin's name, version, and author; `SKILL.md` is the skill's actual body — a `description` field up top, followed by plain-text instructions on when and how to use it.

## How Do You Add the Repo as a Marketplace?

To add a repo as a marketplace, run `/plugin marketplace add owner/repo` inside Claude Code; pin to a specific branch or tag with `owner/repo@v1.0.0`. Once the marketplace is added, installing a single plugin from it takes one more command: `/plugin install your-skill-pack@team-marketplace`.

| Source type | Example |
| --- | --- |
| Relative path | `"./plugins/your-skill-pack"` |
| GitHub | `{"source": "github", "repo": "owner/repo"}` |
| Git URL | `{"source": "url", "url": "https://gitlab.com/team/skill.git"}` |
| npm | `{"source": "npm", "package": "@org/skill"}` |
| Archive (SHA-256 verified) | `{"source": "archive", "url": "https://...zip", "sha256": "..."}` |

Before sharing, validate the repo with `claude plugin validate .` — it catches schema errors in `marketplace.json` and `plugin.json` before you publish, not after.

## How Do You Distribute a Skill Across a Team or Organization?

On Team or Enterprise plans, you can distribute a marketplace through Organization settings > Plugins, which requires the repo to be private and synced via the Claude GitHub App. Plugins distributed at the organization level can only use relative-path, GitHub, or git-URL sources — npm and archive sources aren't supported through that path.

That setup lets you keep a skill in one repo and manage updates centrally: when a developer tags a new version, everyone who added that marketplace sees the update.

## How Do You Keep Secrets Out, and What Does Security Scanning Catch?

The rule for keeping secrets out of a skill repo is simple: `SKILL.md` and any supporting scripts should never contain an API key, token, or credential — reference an environment variable name instead and let the organization's own secret management supply the real value. If a skill needs a key to run, document that as "set this environment variable" in the skill itself, never commit it.

Beyond that, [Claude's plugin and skill security scanner](/en/posts/claude-skill-plugin-security-scanning) checks a skill for malicious command patterns and suspicious outbound links before it ships; running a marketplace you host on GitHub through that scan before distributing it team-wide should be as routine as the official `claude plugin validate` check. My take: a team that installs a skill repo without reviewing it is taking on the same risk as one that runs an unsigned npm package with `sudo`.

## What Practices Work for Versioning a Skill?

The most reliable way to version a skill is to bump the `version` field in `plugin.json` following semantic versioning on every meaningful change, and create a matching Git tag (like `v1.1.0`) in the same commit. That lets teammates pin to a specific version with something like `owner/repo@v1.1.0`, so a change you haven't tested yet can't quietly leak into everyone else's session.

A three-step loop works well in practice: change `SKILL.md` and test it in your own session, run `claude plugin validate .` to catch schema errors, then route the change through a pull request instead of merging straight to the default branch. Even on a small team, that loop catches most "works on my machine, not on mine" failures before they ever reach the repo.

Keeping a CHANGELOG is a cheap habit that pays off later: noting what changed in one line per release means you can answer "which version introduced this behavior" in minutes instead of digging through commit history six months on. If you're opening the repo up to a larger team or a community, those notes double as a lightweight contribution guide.

| Step | What to do | Why it matters |
| --- | --- | --- |
| Test | Try `SKILL.md` in a local session | Confirm behavior before publishing |
| Validate | Run `claude plugin validate .` | Catch schema errors early |
| Tag | Bump `version` in `plugin.json`, add a Git tag | Let teammates pin to a specific release |
| Document | Add one line to the CHANGELOG | Keep the history searchable |

## Frequently Asked Questions

### Do I need a separate repo to host a Claude Skill?

No — you can add `.claude-plugin/` and `plugins/` folders inside an existing project repo. But for a skill collection you'll share outside the team and update often, a dedicated repo usually keeps the version history cleaner and the pull-request flow less noisy.

### What's the difference between /plugin marketplace add and /plugin install?

`/plugin marketplace add owner/repo` introduces a repo to Claude Code as a marketplace but installs nothing; `/plugin install skill-name@marketplace-name` is the actual install step for a specific plugin defined in that marketplace. You add the marketplace first, then install individual plugins from it.

### Does a skill hosted on GitHub update automatically?

No, not automatically. Unless a marketplace is pinned to a specific version (like `@v1.0.0`), it pulls the latest content from the default branch — but that pull happens when you re-run `/plugin marketplace add` or Claude Code refreshes the marketplace, not as a silent background sync.

### Can I share skills from a private GitHub repo across my whole organization?

Yes — on a Team or Enterprise plan, you can register a private repo as a marketplace through Organization settings > Plugins. That sync runs through the Claude GitHub App, and source types are limited to relative path, GitHub, or git URL.
