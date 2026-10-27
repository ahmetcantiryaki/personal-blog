---
title: "Gate PRs With Claude Code Review in CI"
slug: "gate-prs-with-claude-code-review-in-ci"
translationKey: "claude-code-review-ci-gating"
locale: "en"
excerpt: "Short answer: Anthropic's Code Review feature never approves or blocks a PR — it leaves findings as comments while the merge decision stays with your team."
category: "devops-cloud"
tags: ["ci-cd", "claude", "devops"]
publishedAt: "2026-10-27"
seoTitle: "Set Up Claude Code Review in GitHub Actions for PR Review"
seoDescription: "Comparing Anthropic's managed Code Review feature with running claude-code-action's code-review plugin yourself in GitHub Actions, review levels included."
---

Short answer: Anthropic's Code Review feature runs automatically on every pull request and leaves its findings as inline comments, but it never approves or blocks the PR — the merge decision always stays with your team. An organization Owner turns this on from a Team or Enterprise plan; if you want something that runs in your own GitHub Actions pipeline and can actually fail a check, you wire up `claude-code-action` with the `code-review` plugin in your own workflow file instead.

## What does Anthropic's Code Review feature actually do?

Code Review works by having several agents, running on Anthropic's infrastructure, read a pull request's diff alongside the surrounding code, looking for logic errors, security vulnerabilities, or broken edge cases. Findings first pass through a verification step that filters out candidates that don't actually hold up against the code, then get ranked by severity and posted to the PR as inline comments, a summary, and a check run named "Claude Code Review." The key detail: that check run never concludes as a failure, and it has no authority to approve or block — a deliberate design choice that keeps automated review from substituting for human sign-off.

## Who can actually use Code Review, and on what plan?

Code Review is available to organizations on a Team or Enterprise plan, and an organization Owner has to install the Claude GitHub App and pick a review level before it does anything. It works with repositories hosted on GitHub, including GitHub Enterprise Server, but it isn't available to organizations with Zero Data Retention or the HIPAA configuration turned on. That plan restriction puts Code Review out of reach for most solo developers or small teams — which is exactly where the self-hosted alternative below comes in.

## What's the actual difference between the Quick, Standard, and Deep review levels?

There are three levels, and each trades off depth, speed, and cost differently: Quick is the lightest and fastest pass at the lowest cost; Standard is the default, balancing depth, speed, and cost; Deep is the most thorough pass, taking the longest and costing the most. An organization Owner picks one default level for the whole organization but can assign a different level per repository — Quick for a routine codebase, Deep for a critical one, for example.

| Level | Speed | Cost | When to use it |
|---|---|---|---|
| Quick | Fastest | Lowest | Routine, low-risk repositories |
| Standard | Balanced | Medium (default) | Fits most projects |
| Deep | Slowest | Highest | Critical, security-sensitive repositories |

## How do I run Claude's review in my own GitHub Actions pipeline?

Use Anthropic's official `claude-code-action` to run the `code-review` plugin on a pull request event; this path needs no Team or Enterprise plan, just a Claude API key or OAuth token. The workflow below runs the plugin whenever a PR is opened, updated, or marked ready for review, and posts its findings as inline comments on the PR:

```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: "https://github.com/anthropics/claude-code.git"
          plugins: "code-review@claude-code-plugins"
          prompt: "/code-review:code-review --comment ${{ github.repository }}/pull/${{ github.event.pull_request.number }}"
          claude_args: '--allowedTools "mcp__github_inline_comment__create_inline_comment"'
```

The `--comment` flag here is the critical piece: without it, Claude only writes its findings to the workflow run log and posts nothing to the PR. The `--allowedTools` entry inside `claude_args` starts the MCP server needed to post inline comments — keep that line even though the plugin's own `allowed-tools` frontmatter names the same tool, because the GitHub Action only starts that tool when `claude_args` names it explicitly.

## What's the actual difference between "gating" and "advisory" comments?

Both paths here — Anthropic's managed Code Review and your own `claude-code-action` setup — are technically advisory: they surface findings without producing a merge-blocking status. If you want a real gate, you'd need to mark the check required in GitHub's branch protection rules; but the official documentation states plainly that the "Claude Code Review" check run never concludes as a failure, which means marking it required provides no actual enforcement. Practical gating is usually built in your own workflow instead — parsing the `--json` output yourself and failing the job (`exit 1`) based on how many critical findings came back.

## Does review run on draft PRs or PRs from forks?

No, not by default. Both Anthropic's managed Code Review and your own `claude-code-action` setup skip pull requests marked as drafts or closed. Fork PRs are a bit different: on public repositories, GitHub withholds secrets — including your API key — from workflow runs triggered by fork pull requests. That's a security measure to stop a fork owner from running your API key, but it also means the review step silently doesn't run at all on fork PRs. The practical consequence: if you want to cover outside contributions on an open-source project, you need a separate workflow using the `pull_request_target` event with a more careful permission model for passing the secret, scoped to only read the diff rather than execute any code from it.

It's also worth knowing that review doesn't necessarily re-run on every single push to a PR: after some pushes, Code Review keeps the earlier result instead of starting a fresh review, so a small change that doesn't affect the review (fixing a comment typo, say) doesn't trigger an unnecessary re-review cost.

## How do you manage cost and comment noise?

Each review consumes two resources: GitHub Actions minutes and API tokens, with token cost scaling by prompt length, task complexity, and codebase size. To cut noise, add a `REVIEW.md` file at your repository root to narrow what gets flagged — Code Review focuses by default on bugs that would actually break production, not on formatting preferences or missing test coverage. As we cover in [AI Code Review: Trust, but Verify](/en/posts/ai-code-review-trust-but-verify), none of these automated findings mean your code is bug-free — a clean review isn't proof that no vulnerability exists.

## How do you turn off an always-on subscription?

To turn off Anthropic's managed Code Review, an organization Owner disables it from the Claude organization settings; for your own `claude-code-action` setup, delete the workflow file from `.github/workflows/` and remove the associated secret if you shared one at the organization level. My own recommendation: if your team is small and not on a Team or Enterprise plan, start directly with your own `claude-code-action` setup — it's nothing more than one extra YAML file in your [CI/CD pipeline build](/en/posts/how-to-build-cicd-pipeline), and it carries no plan restriction.

## Frequently Asked Questions

### Can Claude Code Review block a pull request from merging?

No. Per the official documentation, a review never approves or blocks a pull request, and the "Claude Code Review" check run never concludes as a failure. The merge decision always stays with your team.

### What plans can use the Code Review feature?

Code Review is available to organizations on a Team or Enterprise plan, and an organization Owner has to turn it on. It isn't available to organizations with Zero Data Retention or the HIPAA configuration enabled.

### How do I run Claude's review in my own CI if I don't have a Team/Enterprise plan?

Add Anthropic's official `claude-code-action` and the `code-review` plugin to your own GitHub Actions workflow, authenticated with a Claude API key. This path requires no specific plan.

### What's the difference between the review levels?

Quick is the fastest and cheapest, lightest pass; Standard, the default, balances depth, speed, and cost; Deep runs the most thorough but slowest and most expensive review. An organization Owner can assign a different level to each repository.
