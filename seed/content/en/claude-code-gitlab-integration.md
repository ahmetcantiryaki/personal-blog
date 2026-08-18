---
title: "Does Claude Code Support GitLab Now?"
slug: "claude-code-gitlab-integration"
translationKey: "claude-code-gitlab-integration"
locale: "en"
excerpt: "Yes: three releases between August 12 and 17, 2026 (v2.1.232-234) gave Claude Code GitLab repo cloning, merge request workflows, and token redaction."
category: "ai"
tags: ["claude", "ai-coding", "git", "developer-experience", "automation"]
publishedAt: "2026-08-18"
seoTitle: "Does Claude Code Support GitLab Now?"
seoDescription: "Claude Code shipped GitLab support across three releases in August 2026. Here is what changed, how it compares to GitHub support, and how to set it up."
---

Short answer: yes. Between August 12 and 17, 2026, Anthropic shipped three consecutive releases (v2.1.232, v2.1.233, v2.1.234) that gave Claude Code GitLab repo cloning, merge request support, secret redaction for GitLab tokens, and a statusline MR badge. GitLab is no longer a second-tier option next to GitHub.

## What exactly did Claude Code's GitLab support add?

The support didn't land in one release — it arrived across three targeted releases in five days, each covering a different part of the workflow: repo access first, then working with merge requests, then visibility in the UI.

| Version | Date | What shipped |
| --- | --- | --- |
| v2.1.232 | August 13, 2026 | Bare `gitlab.com` repo URLs (including nested subgroups) in plugin marketplaces now clone the same way `github.com` URLs do; secret redaction added for `glrt-`, `gloas-`, `glptt-`, `glagent-`, `glimt-`, `glsoat-`, `glcbt-`, `glft-`, `glffct-` token families, plus full redaction for `glpat-`/`gldt-` |
| v2.1.233 | August 14, 2026 | The `--worktree` flag and the `claude agents` view now accept GitLab merge request URLs; MRs display using GitLab's native `!N` numbering |
| v2.1.234 | August 17, 2026 | A GitLab merge request badge was added to the footer and statusline for repos with a GitLab remote and an authenticated `glab` CLI, showing draft/pending/passing states; the `CLAUDE_CODE_PROJECT_DIR_NAME` environment variable was added for per-project transcript directories |

One detail worth knowing: GitHub pull requests show up as `#N`, while GitLab merge requests show up as `!N` — GitLab's own native numbering convention. Claude Code now tracks that distinction correctly, so a glance at `claude agents` output tells you which platform you're looking at without checking the remote.

## How does GitLab support compare to Claude Code's GitHub support?

As of August 2026, the gap between the two platforms isn't really about missing features — it's about GitHub simply having a multi-year head start. GitLab support is new, but it now covers every core workflow GitHub does.

| Feature | GitHub | GitLab (as of August 2026) |
| --- | --- | --- |
| Bare-URL repo cloning | Supported | Supported since v2.1.232 |
| PR/MR URL in `--worktree` | Supported (`#N`) | Supported since v2.1.233 (`!N`) |
| Statusline PR/MR badge | Supported | Supported since v2.1.234 (requires `glab`) |
| Token/secret redaction | Supported | Supported since v2.1.232 (9+ token prefixes) |
| Required CLI | `gh` CLI | `glab` CLI |
| PR/MR numbering shown | `#N` | `!N` |

In day-to-day use, the practical gap has mostly closed. What remains is a maturity gap: GitHub integration has been part of Claude Code since its early releases, while GitLab support was built out in a five-day release burst. That means the GitLab path has had less real-world mileage — don't be surprised if you hit an edge case GitHub users already filed a bug for.

## How does a GitLab team set up Claude Code?

Setup follows the same shape as GitHub: install the platform's official CLI, authenticate it, then point Claude Code at a repo or MR URL. The only real difference is using `glab` instead of `gh`.

```bash
# 1. Install and authenticate the GitLab CLI
brew install glab
glab auth login

# 2. Point Claude Code at a bare GitLab URL (nested subgroups work too)
claude "review the gitlab.com/team-name/subgroup/project repo"

# 3. Work on a specific merge request using a worktree
claude --worktree https://gitlab.com/team-name/project/-/merge_requests/42

# 4. Confirm glab is authenticated so the statusline MR badge shows up
glab auth status
```

If `glab auth status` doesn't show an authenticated session, the statusline badge simply never appears — this is the most common setup mistake. Once authentication is in place, Claude Code detects GitLab automatically from the repo's remote URL; there's no separate config flag to flip.

## Is anything still GitHub-only in Claude Code?

Per the August 2026 changelog, the core workflows — cloning, worktree support, PR/MR badges, and secret redaction — are now available on both platforms. What's less certain is parity around GitHub Actions-specific integrations, like triggering CI workflows or reading Actions logs directly; GitLab CI/CD doesn't yet have a confirmed one-to-one equivalent documented in the same changelog. For anything mission-critical, checking the [official changelog](https://code.claude.com/docs/en/changelog) for your exact version is the safest move, since Anthropic ships this project fast.

One thing about the rollout pattern stands out: Anthropic didn't bundle this into one splashy "GitLab launch" release — it drip-fed the work across three releases in five days. That reads less like a marketing push and more like an engineering backlog getting worked down in order, which for a tool teams put in their CI path is a better sign than a single feature-flag flip would have been.

If your team already treats [Git branching strategy](/en/posts/git-branching-strategies) as a first-class decision, plugging Claude Code's `--worktree` flag into your existing [GitOps](/en/posts/gitops-explained) pipeline shouldn't require rethinking anything. Teams already running [Claude Code subagents](/en/posts/claude-code-subagents-background-agents) should know those same agents can now act on GitLab MRs, not just GitHub PRs. And if you're running Claude Code in your own infrastructure, the [self-hosted environments](/en/posts/claude-code-self-hosted-environments) guide is worth checking when you're planning where `glab` authentication lives inside your container image.

## Who does this change actually matter for?

Short answer: teams whose codebase already lives on GitLab, who previously ruled out Claude Code on the assumption it was GitHub-only. Self-hosted GitLab instances are common in regulated industries — finance, healthcare, government — where teams often prefer a self-hosted Git platform over a SaaS-only option like GitHub. For those teams, GitLab support is a reason to put Claude Code back on the evaluation list.

The second group is multi-repo organizations running both GitHub and GitLab side by side. Before August 2026, that setup meant an inconsistent Claude Code experience depending on which repo you were in — an MR badge on one, nothing on the other. Now both platforms support the same core workflow, so there's no need to build a separate GitLab-specific process just to standardize tooling across teams.

The reverse is also true: for a small team working on a single repo on a single platform, this news changes essentially nothing about your day-to-day — the workflow you already use stays the same.

## Frequently Asked Questions

### Do GitLab merge requests look the same as GitHub pull requests in Claude Code?

Not quite. GitLab merge requests display using `!N` notation (like `!42`), while GitHub pull requests display as `#N` (like `#42`) — this has been true since v2.1.233 in both the `--worktree` flag and the `claude agents` view. The formatting matches each platform's own convention exactly.

### What do I need for the GitLab MR badge to show up in the statusline?

You need an authenticated `glab` CLI session and a repo with a GitLab remote. This feature shipped in v2.1.234 on August 17, 2026, and shows draft, pending, or passing merge request states directly in the footer and statusline.

### Does Claude Code work with self-hosted GitLab instances?

The changelog doesn't call out a specific limitation here. The `glab` CLI already supports authenticating against self-hosted GitLab instances, so as long as `glab auth login` points at the right server, Claude Code should follow the same detection path. For an enterprise GitLab instance, running `glab auth status` first to confirm the connection is the safest check.

### Which GitLab token types does the new secret redaction cover?

As of v2.1.232, Claude Code redacts the `glrt-`, `gloas-`, `glptt-`, `glagent-`, `glimt-`, `glsoat-`, `glcbt-`, `glft-`, and `glffct-` token families, plus full redaction for `glpat-` (personal access tokens) and `gldt-` (deploy tokens). That prevents these tokens from leaking into Claude Code's output or logs.
