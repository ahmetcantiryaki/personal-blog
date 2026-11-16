---
title: "Write a README People Actually Read"
slug: "write-a-better-readme"
translationKey: "write-readme-that-gets-used-2026"
locale: "en"
excerpt: "A README that gets used states what the project does in one sentence, then gives a quickstart that runs in under a minute on a clean machine."
category: "software-engineering"
tags: ["documentation", "open-source", "developer-experience", "best-practices"]
publishedAt: "2026-11-16"
seoTitle: "Write a README People Actually Read"
seoDescription: "A README that gets used states what the project does in one sentence, then gives a quickstart that runs in under a minute on a clean machine."
---

Short answer: a README that gets used leads with a one-sentence explanation of what the project does and why, follows it with a quickstart a stranger can finish in under a minute, and pushes everything else — API details, contributing rules, troubleshooting — below the fold. Most abandoned repositories fail at the first two steps, not the tenth.

I once starred a project that promised exactly the integration I needed, opened the README, and found four badges, a logo, and a "Coming Soon" section where the install instructions should have been. I closed the tab and wrote my own version from scratch instead. That's the entire failure mode in one story: the README didn't tell me what to do next, so I didn't do anything.

## What has to appear above the fold?

The first thing a visitor reads must answer two questions at once: what does this do, and why would I use it instead of the obvious alternative. One sentence is enough — "A CLI that diffs two Postgres schemas and generates the migration SQL" tells a reader more than a paragraph of marketing language. Put this sentence directly under the title, before any badge, logo, or table of contents.

GitHub renders Markdown headings into an automatic table of contents for any README file, so a hand-written one is redundant work that goes stale the moment you rename a section. Skip it and let the platform build it for you.

## Why does a 30-second quickstart beat a complete one?

A quickstart's job is to get someone from zero to a working result as fast as possible, not to document every flag. The [Standard Readme specification](https://github.com/RichardLitt/standard-readme) — one of the most-referenced README structures on GitHub — separates "Install" and "Usage" from a longer "API" section precisely so the fast path stays short.

Most quickstarts fail for three repeatable reasons: an unstated prerequisite ("requires Node 20+" written nowhere), a version pin that silently rotted (a command that worked against last year's release but not this one), or a copy-paste command nobody re-ran after editing the README by hand. The fix for all three is mechanical: run your own quickstart on a clean machine or a fresh container before every release, not just when you first wrote it.

```markdown
# project-name

One sentence: what it does and who it's for.

## Install

\`\`\`bash
npm install project-name
\`\`\`

## Quickstart

\`\`\`bash
npx project-name init
npx project-name run ./example.json
\`\`\`

## Usage

The one example that covers the golden path — not every flag.

## Configuration

| Option | Default | What it does |
|---|---|---|
| `--timeout` | `30s` | Max wait before failing |

## Troubleshooting

- **"command not found"** → you need Node 20+.
- **Empty output** → check the file path is relative to cwd, not the project root.

## Contributing

See CONTRIBUTING.md.

## License

MIT
```

## What order should README sections follow?

Standard Readme's own compliant example, which the spec repository ships as a reference, orders sections as: title and one-line description, a table of contents, Background, Install, Usage, a badge section, Maintainers, Contributing, and License. You don't have to follow it exactly, but the underlying logic is worth keeping — context and installation first, deep reference material (API, architecture) in the middle, and project governance (maintainers, contributing, license) last.

GitHub's own guidance narrows this further: a README should hold only what a developer needs to get started using and contributing to the project, while longer documentation belongs in a wiki or a dedicated docs site. That's a direct argument against stuffing a full API reference into the README itself once a project has more than a handful of functions.

## Which README badges actually help, and which just clutter?

A badge helps when it answers a question a reader would otherwise have to go dig for — is the build currently passing, what's the latest published version, what license am I agreeing to. A badge clutters when it's purely decorative and carries no information a reader needs before deciding whether to use the project.

| Badge | Helps? | Why |
|---|---|---|
| Build status (CI passing/failing) | Yes | Answers "is this currently broken?" |
| Latest version (npm, crates.io) | Yes | Answers "what do I actually get if I install this now?" |
| License | Yes | Answers a real legal question in one glance |
| Generic "powered by X" with no link | No | Carries zero actionable information |
| Code coverage percentage | Depends | Useful for a library people will depend on; noise for a CLI tool |
| Social badges (stars, forks, as decoration) | No | Doesn't help someone decide whether to use the project today |

Standard Readme itself treats its badge as optional, and explicitly warns that piling on badges clutters the README and hurts readability — keep two or three at most, placed right under the title.

Contributing guidelines belong near the bottom, but they matter more than their position suggests: a project that explains its branch and PR conventions up front, the way our [git branching strategy comparison](/en/posts/git-branching-strategies) lays out trunk-based versus Git Flow trade-offs, gets cleaner first pull requests than one that leaves new contributors guessing. If you want more on the contributor's side of that exchange, see [how to make your first open-source contribution](/en/posts/make-your-first-open-source-contribution).

## What goes in configuration and troubleshooting?

Configuration should list only the options someone will actually touch, as a table of flag, default, and effect — not every internal setting your code happens to expose. Troubleshooting should be a short, scannable list of the actual errors people hit, each paired with the fix, built from your real GitHub issues rather than hypothetical edge cases. If you've closed the same issue three times with the same explanation, that explanation belongs in the README, not buried in issue #214.

## What are the README smells worth deleting today?

A few patterns reliably predict an abandoned or frustrating project, and each one is a five-minute fix:

- **A wall of badges and no quickstart.** Five badges above the first working command is a signal the author cared more about appearance than onboarding.
- **An install command that no longer works.** If nobody has run the README's own instructions since the last major version bump, assume it's broken.
- **No license file.** Without one, the legal default in most jurisdictions is "all rights reserved" — even for a public repository — which makes contribution and reuse legally murky.
- **A "Coming Soon" section left in for months.** Either ship the feature or remove the placeholder; a stale promise reads as abandonment.
- **A hand-maintained table of contents.** It will drift from the actual headings the first time someone edits a section title.

Projects on GitHub that follow this smell list tend to look more maintained within a day, with no code changes — which says something about how much of "project health" readers judge from the README alone, as of November 2026. It's also worth remembering that a README is itself a trust signal in an ecosystem increasingly wary of unmaintained or low-effort packages; see our piece on [AI slop and open-source security](/en/posts/ai-slop-open-source-security) for why that trust matters more than it used to.

For a broader look at the engineering habits covered on this blog, browse the [Software Engineering category](/en/category/software-engineering).

## Frequently Asked Questions

### What's the most important sentence in a README?

Short answer: the one-sentence description of what the project does and who it's for, placed directly under the title before any badge. Readers decide within seconds whether to keep reading, and that sentence is what they decide on.

### Do I need a table of contents in my README?

No, if your README is on GitHub. GitHub automatically generates a table of contents from your Markdown headings when the file renders, so a hand-written one is extra maintenance that can drift out of sync with your actual section titles.

### How long should a README's quickstart section be?

Short answer: short enough to run in under a minute on a clean machine — typically three to five commands. A quickstart's job is proving the project works, not documenting every option; save full configuration detail for a separate section further down.

### Should every project have a Standard Readme-compliant badge?

No. The [Standard Readme specification](https://github.com/RichardLitt/standard-readme) treats its own compliance badge as optional and recommends against piling on badges in general, since too many clutter the top of the file and reduce readability for the sentence that matters most: what the project does.

**Sources:** [Standard Readme specification](https://github.com/RichardLitt/standard-readme), [GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes).
