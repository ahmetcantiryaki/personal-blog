---
title: "What Is ant apply? Manage Claude Agents as Code"
slug: "what-is-ant-apply-claude-agents-as-code"
translationKey: "ant-apply-cli-claude-agents-as-code"
locale: "en"
excerpt: "Short answer: ant apply is a Terraform-style CLI command that syncs Claude Managed Agents resources (agents, environments, skills) from repo files to the API."
category: "ai"
tags: ["claude", "ai-agents", "infrastructure-as-code", "gitops"]
publishedAt: "2026-09-07"
seoTitle: "What Is ant apply? Manage Claude Agents as Code"
seoDescription: "Anthropic's ant apply command syncs Claude Managed Agents resources from files to the API. We cover setup, claude-lock.json, and how to run it in CI."
---

Short answer: `ant apply` is a command Anthropic shipped on September 3, 2026 with CLI version 1.30.0. It reads Claude Managed Agents resources — agents, environments, skills, memory stores, and scheduled deployments — from Markdown and YAML files in your repository and syncs them to the Claude API, the same way Terraform syncs infrastructure from `.tf` files.

## What does ant apply actually do?

You describe each resource in a file, run `ant apply`, and approve the plan it shows. The command then writes a lockfile called `claude-lock.json`; commit it, and the next run updates the same resources instead of creating new ones. The lockfile stores each resource's API ID, version, and a pair of hashes — what was last sent and what the API returned — which is how a later run notices an edited file or a resource that changed outside these files.

The command infers each file's kind in a fixed order: a top-level `type` field in the file, the directory it sits in (`agents/`, `environments/`, `memory_stores/`, `deployments/`), or a filename that starts with the kind's name. A skill must always be a directory with a `SKILL.md` at its root; every other resource can be written as YAML, JSON, or Markdown.

## How do you apply your first agent?

The simplest case is a single agent file. Write `agents/summarizer.md` with the agent's configuration in the frontmatter and its system prompt in the body:

```markdown
---
name: Summarizer
model: claude-opus-5
tools:
  - type: agent_toolset_20260401
---

You are a helpful assistant that writes concise summaries.
```

Running `ant apply agents/summarizer.md` prints a plan (`+ ./agents/summarizer.md create`), waits for your approval, then creates the agent and records its ID (something like `agent_011CYm1BLqPXpQRk5khsSXrs`) in `claude-lock.json`. Edit the file and run the command again, and the plan shows an update instead of a create.

## How do resources reference each other?

A file points at another resource by relative path instead of an API ID. A reviewer agent lists `../skills/pr-summary` under `skills`, a coordinator agent lists `./reviewer.md` under `multiagent.agents`, and a deployment names its agent, environment, and memory store the same way. Running `ant apply .` applies the whole directory: the command resolves those dependencies in order and fills in the real IDs as it goes.

| Resource type | Location | File format |
|---|---|---|
| Agent | `agents/` | Markdown (frontmatter + system prompt) |
| Environment | `environments/` | YAML/JSON |
| Memory store | `memory_stores/` | YAML/JSON |
| Scheduled deployment | `deployments/` | Markdown (frontmatter + first message) |
| Skill | `skills/<name>/SKILL.md` | Directory + SKILL.md |

A skill reference can also be a GitHub URL (`https://github.com/<owner>/<repo>/tree/<branch>/<dir>`); `ant apply` downloads and uploads that directory, then pins it to the resolved commit until you pass `--upgrade`.

## How do you run ant apply in CI?

Without a terminal, the command prints the plan and stops — it won't apply anything unless you pass `--yes`, which keeps a CI step from stalling on a confirmation prompt it can never get. Anthropic's recommended pattern: run `ant apply --yes .` on your default branch after a merge, and run `ant apply --dry-run .` on pull requests, which only prints the plan for reviewers and changes nothing.

```bash
# On the default branch, after merge
ant apply --yes .

# On a pull request, preview only
ant apply --dry-run .
```

Commit the updated `claude-lock.json` at the end of the job even when the apply step fails partway through, since a partial apply still records what it actually created. For authentication, Workload Identity Federation is recommended over a stored API key — the command refuses any credential that resolves to an organization or workspace other than the one recorded in `claude-lock.json`.

This discipline runs in the same direction as the staged-permission logic in [wiring AI agents into your CI/CD safely](/en/posts/ai-agents-in-cicd-safely): agent configuration is now a versioned artifact that goes through code review like anything else.

## What are ant apply's limits?

The command can't adopt a resource you created by hand — in the Console, or with `ant beta:agents create`. Only what's tracked in the lockfile is managed, so applying a file that describes an existing agent by the same name creates a second one. Deleting a file doesn't delete the resource; it leaves it in place with a warning, and you need `--prune` to actually remove it. If a resource was edited, archived, or deleted outside these files, the plan ends with `refusing to apply`, and you need `--force` to overwrite it.

An agent downloaded from the Console with **Export as code** comes with its own `claude-lock.json`, so applying it updates the resources you built there — which makes it possible to start by hand in the Console and migrate to code later.

This code-as-infrastructure approach lines up with [Claude Managed Agents' September budget and data-residency updates](/en/posts/claude-managed-agents-budgets-advisors-data-residency): the platform's runtime controls and its deployment process are both moving toward production standards at the same time.

## How do you use ant apply in day-to-day development?

The typical loop looks like this: edit an agent file, run `ant apply`, read the plan printed in your terminal, approve with `y` or answer `d` to see the full field-by-field diff. The `--dry-run` flag prints that same plan and exits without changing anything — ideal for seeing what would happen before you commit a change. `--verbose` lists unchanged resources too and shows every field's full value, which helps when you want to understand why a resource shows as "unchanged."

For a team working across multiple organizations or workspaces, the `--lock-file <path>` flag lets you point explicitly at which lockfile to use; by default the command searches upward from your current directory for a `claude-lock.json`, and if more than one project lives in the same repo, that automatic search can find the wrong file. Anthropic also recommends against running more than one `ant apply` at a time, since nothing locks the lockfile itself — two parallel runs updating the same resource in a different order can leave it inconsistent.

| Approach | When it fits |
|---|---|
| Creating by hand in the Console | A one-off experiment, a quick prototype |
| `ant apply` (local) | Fast iteration during development, a single person's change |
| `ant apply --yes` (CI, after merge) | Automatically applying team-wide, reviewed changes |
| `ant apply --dry-run` (CI, on a PR) | Showing reviewers the plan without changing anything |

The point worth taking from that table: `ant apply` can be more overhead than it's worth for a small, single-person prototype — setting up the file structure and managing the lockfile is slower than creating one agent by hand in the Console. Its real value shows up once the number of agents grows and more than one person touches the same resources — at that point, the answer to "who changed what, and when" lives in the commit history.

## Frequently Asked Questions

### What do you need to use ant apply?

You need CLI version 1.30.0 or later; setup and authentication steps are covered in the Claude Platform CLI quickstart docs. You also need a Claude API credential — an API key or Workload Identity Federation — to run the command.

### Does ant apply replace CLAUDE.md in Claude Code?

No, they work at different layers. CLAUDE.md tells Claude Code how to handle a specific repository; `ant apply` manages API resources on the Claude Managed Agents platform, like agents, environments, and deployments. A team can use both at once.

### What happens if you don't commit claude-lock.json?

The next `ant apply` run re-reads your files and, finding no matching entry in the lockfile, creates every resource from scratch — which leaves you with duplicate agents or environments piling up. Committing the lockfile is what guarantees the command updates existing resources instead.

### Can ant apply take over an existing, hand-created agent?

Not directly. The command only tracks resources it created and recorded in the lockfile itself; applying a file that describes an agent you built in the Console, or with `ant beta:agents create`, by the same name creates a second agent instead. To move an existing agent into code, use the Console's **Export as code** option.
