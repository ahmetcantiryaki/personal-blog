---
title: "Does Claude Code Now Support AGENTS.md?"
slug: "claude-code-now-supports-agents-md"
translationKey: "claude-code-agents-md-fallback-2026"
locale: "en"
excerpt: "Yes. Starting with 2.1.277, Claude Code reads AGENTS.md as a fallback when CLAUDE.md is missing, but Bedrock, Vertex AI, and Foundry don't support it yet."
category: "ai"
tags: ["claude", "ai-coding", "developer-experience", "open-source"]
publishedAt: "2026-09-19"
seoTitle: "Claude Code AGENTS.md Support: What 2.1.277 Changed"
seoDescription: "Yes. Starting with 2.1.277, Claude Code reads AGENTS.md as a fallback when CLAUDE.md is missing, but Bedrock, Vertex AI, and Foundry don't support it yet."
---

Short answer: yes. Anthropic shipped Claude Code version 2.1.277 on September 18, 2026, and it now reads `AGENTS.md` as a fallback whenever a project folder has no `CLAUDE.md`. The behavior is toggleable under `/config` in "Project instructions." It sounds minor, but it removes a real maintenance burden for teams running more than one AI coding assistant across the same codebase.

## What Is AGENTS.md?

AGENTS.md is an open, tool-agnostic standard for telling AI coding assistants how to build, test, and format code in a given repository. The spec is stewarded by the Agentic AI Foundation under the Linux Foundation, and its home is [agents.md](https://agents.md).

As of September 2026, more than 30 AI coding tools support AGENTS.md, including OpenAI Codex, Google Jules, Cursor, GitHub Copilot, and Amp. The idea is straightforward: instead of every tool inventing its own file (`CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`), they read the same one. If your repo doesn't have an AGENTS.md yet, our [guide to writing an AGENTS.md](/en/posts/agents-md-make-repo-readable-to-ai) walks through it.

## How Does Claude Code Read AGENTS.md?

Claude Code checks a project folder for `CLAUDE.md` first; if it isn't there, version 2.1.277 and later fall back to `AGENTS.md` and use it as project context instead. That's a clear break from the prior behavior: before September 18, 2026, Claude Code recognized only `CLAUDE.md`, and any AGENTS.md file in the repo was ignored outright.

In practice, this means a team that already maintains an AGENTS.md for Codex or Cursor can point Claude Code at the same repo without copying the file or setting up a symlink. The fallback can be switched off from `/config > Project instructions` if a team deliberately wants to keep relying on `CLAUDE.md` only.

## Which File Wins If Both Exist?

If a folder has both files, `CLAUDE.md` still wins. AGENTS.md is a fallback, not an override — it only gets used when `CLAUDE.md` is absent. That preserves any Claude-specific instructions (subagent configuration, tool restrictions specific to Claude Code) that a team might have written into `CLAUDE.md`, while still opening the door to the shared standard.

Here's the resolution order:

| Files present in folder | What Claude Code 2.1.277+ reads |
| --- | --- |
| Only `CLAUDE.md` | `CLAUDE.md` |
| Only `AGENTS.md` | `AGENTS.md` (new behavior) |
| Both present | `CLAUDE.md` (takes precedence) |
| Neither present | No project context |

A minimal AGENTS.md file looks like this:

```markdown
# AGENTS.md

## Build
npm install && npm run build

## Test
npm test -- --watch=false

## Code style
- TypeScript strict mode is required
- Do not use default exports for function components
```

## How Do You Enable or Disable the Fallback?

Run `/config` inside Claude Code and open "Project instructions" to toggle the AGENTS.md fallback on or off. It ships enabled by default starting with 2.1.277, so if your project has no `CLAUDE.md`, Claude Code picks up `AGENTS.md` automatically with no extra setup.

```bash
/config
# > Project instructions > "Read AGENTS.md as fallback" toggle
```

Keeping the `claude` CLI up to date is the only requirement — there's no separate install step. The change is listed in the [official changelog](https://code.claude.com/docs/en/changelog) under the 2.1.277 entry (September 18, 2026); the following release, 2.1.278 on September 19, added small configuration polish around the same feature.

## Does This Work on Bedrock or Vertex AI Too?

No. As of September 2026, the AGENTS.md fallback is only available through the direct Claude Code CLI and API. Deployments through AWS Bedrock, Google Vertex AI, and Anthropic Foundry don't have this behavior yet — users on those surfaces are still limited to `CLAUDE.md` alone.

| Platform | AGENTS.md fallback (September 2026) |
| --- | --- |
| Claude Code CLI (direct API) | Available |
| AWS Bedrock | Not yet available |
| Google Vertex AI | Not yet available |
| Anthropic Foundry | Not yet available |

That gap matters for enterprise teams: organizations running Claude Code through Bedrock or Vertex should keep maintaining `CLAUDE.md` until the fallback reaches those surfaces. Anthropic engineers Thariq and Addy Osmani announced the change on X, but the platform-scope detail is confirmed in the official changelog rather than the social posts.

## Why Does This Matter?

Because running more than one AI coding tool on the same repo is now the norm, not the exception. A team using Claude Code for day-to-day development, Cursor for in-editor completion, and GitHub Copilot for quick fixes previously had to keep three instruction files in sync by hand. The AGENTS.md standard, and Claude Code's adoption of it, collapses that into one file.

Config-file fragmentation — `.cursorrules`, `.github/copilot-instructions.md`, `CLAUDE.md`, `.aiderrules`, and the rest — has been one of the more pointless friction points in the AI coding tool ecosystem. Every tool insisting on its own file just pushed teams toward copy-pasting or writing sync scripts. Claude Code treating AGENTS.md as a fallback is a reasonable step toward standardization, not a full merger, since `CLAUDE.md` still takes precedence, but it's a step in the right direction.

If you're comparing the broader tool landscape, see our [Claude Code vs. Cursor vs. Antigravity comparison](/en/posts/claude-code-vs-cursor-vs-antigravity-2026) or our guide to [how Claude Code's auto mode works](/en/posts/claude-code-auto-mode-explained). If background automation is more your interest, our piece on [Claude Code subagents and background agents](/en/posts/claude-code-subagents-background-agents) is also relevant.

## How Do You Migrate an Existing CLAUDE.md to AGENTS.md?

Short answer: copy the file and rename it, since both use the same plain Markdown format — build, test, and code-style sections carry over as-is. The real work is separating out anything Claude-specific (subagent definitions, `/permissions` restrictions), which falls outside the AGENTS.md spec because other tools don't understand those concepts.

The recommended path: copy your existing `CLAUDE.md` content into a new `AGENTS.md`, then strip out any Claude-only sections from the new file while leaving them in `CLAUDE.md`. That way both files coexist — Claude Code still reads `CLAUDE.md` first, but Codex, Cursor, and other AGENTS.md-aware tools pick up the shared instructions from `AGENTS.md`. A team that wants to fully consolidate can delete `CLAUDE.md` entirely and keep only `AGENTS.md`; Claude Code then falls back to it automatically.

One caveat: in a monorepo, each subpackage can have its own `AGENTS.md`, and Claude Code searches upward from the working directory for the nearest one. Keeping separate files per subpackage, rather than one root-level file with mixed instructions, is still the safer approach when build commands differ between packages.

## Frequently Asked Questions

### Does Claude Code read AGENTS.md automatically?

Yes. Starting with version 2.1.277, released September 18, 2026, Claude Code automatically reads `AGENTS.md` when a project folder has no `CLAUDE.md`. The behavior ships enabled by default but can be turned off under `/config > Project instructions`.

### Which file takes priority if both CLAUDE.md and AGENTS.md exist?

`CLAUDE.md` always takes priority. AGENTS.md only kicks in as a fallback when `CLAUDE.md` is missing — if both files exist in the same folder, Claude Code ignores AGENTS.md entirely.

### Does the AGENTS.md fallback work on Bedrock or Vertex AI?

No. As of September 2026, this feature is only available through the direct Claude Code CLI and API. Deployments via AWS Bedrock, Google Vertex AI, and Anthropic Foundry don't support it yet, so users on those platforms still need a `CLAUDE.md` file.

### Which AI tools support the AGENTS.md standard?

As of September 2026, more than 30 AI coding tools support AGENTS.md, including OpenAI Codex, Google Jules, Cursor, GitHub Copilot, Amp, and now Claude Code. The standard is stewarded by the Agentic AI Foundation under the Linux Foundation, with its spec published at agents.md.
