---
title: "Build and Share Claude Code Plugins"
slug: "build-and-share-claude-code-plugins"
translationKey: "claude-code-plugins-marketplace-guide"
locale: "en"
excerpt: "Short answer: a Claude Code plugin bundles commands, subagents, skills, hooks and MCP/LSP servers into one package you distribute through a marketplace repo."
category: "ai"
tags: ["claude", "mcp", "open-source", "developer-experience"]
publishedAt: "2026-09-06"
seoTitle: "How to Build and Share a Claude Code Plugin (2026)"
seoDescription: "How do you scaffold plugin.json, test a Claude Code plugin locally, and publish your own marketplace? A step-by-step guide with data from 200+ live plugins."
---

Short answer: a Claude Code plugin bundles commands, subagents, skills, hooks, and MCP/LSP servers around a single `plugin.json` file. What separates it from dropping one skill into `~/.claude/skills` is distribution — a plugin ships through a marketplace repo that anyone can install with one command.

## How is a plugin different from a lone skill?

A skill you drop into `~/.claude/skills` is a text file that only works on your machine and has to be copied by hand to reach anyone else. A plugin packages that skill alongside commands, subagents, hooks, and MCP servers, then makes the whole bundle [installable with `/plugin marketplace add`](https://code.claude.com/docs/en/discover-plugins). The real difference is portability: sharing a skill means sending a file; sharing a plugin means sending a repo link. We covered sharing a single skill over GitHub in [Host Claude Skills on GitHub](/en/posts/host-claude-skills-on-github); a plugin is one level up from that approach.

## What can actually live inside a plugin?

A Claude Code plugin can carry five different component types in one package. You don't need all five — you add whichever ones your workflow actually needs.

| Component | What it does |
|---|---|
| Commands (`/command-name`) | Turns a repeated task into a one-line shortcut |
| Subagents | A helper agent that runs with its own context and tool set for one job |
| Skills | A ready-made set of instructions and examples for a specific task type |
| Hooks | Scripts that fire automatically on events, like before or after a tool call |
| MCP / LSP servers | Connections to external data sources or language servers |

[An update that shipped in April 2026](https://code.claude.com/docs/en/changelog) added a new hook type: `mcp_tool` lets a hook call a connected MCP server's tool directly, with no subprocess and no separate authentication step. That's a meaningful shortcut for anyone wiring plugin hooks straight into MCP servers.

## How do you scaffold plugin.json?

Drop a `.claude-plugin/plugin.json` file at the root of your plugin. Claude Code reads it to learn the plugin's name, version, and which components it ships.

```json
{
  "name": "deploy-checklist",
  "version": "1.0.0",
  "description": "Command and hook set that runs a pre-deploy checklist",
  "commands": ["./commands/deploy-check.md"],
  "hooks": ["./hooks/pre-deploy.json"]
}
```

This file is a map onto the `commands/`, `agents/`, `skills/`, and `hooks/` subdirectories in the folder — each component lives in its own file, and `plugin.json` just wires them together. A typical folder looks like this:

```text
deploy-checklist/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── deploy-check.md
├── hooks/
│   └── pre-deploy.json
└── agents/
    └── deploy-reviewer.md
```

Each command file (`commands/deploy-check.md`) is just a set of instructions written in Markdown; when you invoke the command, Claude Code reads that file's contents straight into context. Writing a command isn't learning a separate programming language — it's writing a well-structured instruction file.

## How do you test a plugin locally before publishing it?

Load the plugin folder from a local path and you can test it without touching a marketplace at all. Run `/plugin marketplace add ./my-local-folder`, then `/plugin install <plugin-name>` — that's enough to confirm commands, hooks, and subagents behave as expected before you ever publish a real repo. If something breaks, check that every file path referenced in `plugin.json` actually exists; that's where most failures come from.

Worth keeping in mind during testing: a recently fixed security issue closed a gap where symlink paths could escape a project's root. Path resolution now follows symlinks and verifies the requested path stays inside the allowed repository. Before you share your own plugin, check that none of its referenced paths use `../` to reach outside the repo.

## How do you publish your own marketplace?

A marketplace is just an ordinary Git repository with a `.claude-plugin/marketplace.json` file at its root, listing the plugins the repo hosts and each one's folder path:

```json
{
  "name": "team-marketplace",
  "plugins": [
    {
      "name": "deploy-checklist",
      "source": "./deploy-checklist"
    }
  ]
}
```

If you want a marketplace for your own team or open-source community, all you need to do is keep that list current and host the repo somewhere reachable — public, or access-restricted for an internal team. Adding a new plugin is as simple as adding one more line to the list; if the rest of the repo already follows the folder structure, there's no extra configuration needed.

Anthropic's own official marketplace passed 200 plugins as of July 2026; roughly twenty of those are first-party plugins Anthropic built itself (dev-workflow tools, frontend-design, skill-creator, and similar), and the rest are vetted partner integrations. That ratio is a reasonable model to follow for your own marketplace: a small number of well-tested plugins beats a large, unmaintained list.

## How does /plugin marketplace add actually work?

Joining a marketplace as a user is one command: `/plugin marketplace add <repo-url>`. It reads the `marketplace.json` file in the Git repo you named and adds the listed plugins to Claude Code's `/plugin` menu; from there you install each one individually with `/plugin install <plugin-name>`. If you need to restrict this flow for a whole organization, there's a managed-marketplace restriction that works similarly to the `managed-mcp.json` approach covered in [how Claude Code manages MCP servers](/en/posts/how-do-you-manage-mcp-servers-in-claude-code) — you can require installs to come only from an approved marketplace.



My take: what separates a plugin from a one-off dev script isn't code quality, it's how few assumptions `plugin.json` makes. A plugin that hardcodes paths or expects a specific environment variable breaks the moment someone else installs it. The portability principles in [Claude Code Subagents and Background Agents](/en/posts/claude-code-subagents-background-agents) apply just as much here.

## What should you watch for when updating a plugin?

Bump the `version` field in `plugin.json` on every change, so users can see which version they're running and trace a problem back to the change that caused it. A reasonable rule: bump the patch digit for a small fix (correcting a typo in a command), the minor digit for adding a new component, and the major digit for a breaking change to an existing command's behavior.

Updating a plugin through a marketplace is just pushing a new commit to the repo's main branch — there's no extra step on the user's side, since anyone connected via `/plugin marketplace add` pulls the new version automatically on their next update. If you're shipping a breaking change, spelling it out in the plugin's `README` keeps users from running into a surprise behavior change.

## Frequently Asked Questions

### What's the difference between a Claude Code plugin and an MCP server?

An MCP server, on its own, provides one connection to external data or tools. A plugin is the layer above that: it bundles an MCP server together with commands, hooks, and subagents into a single installable package. A plugin can contain zero, one, or several MCP servers.

### How do I get my plugin into the official marketplace?

Getting listed on Anthropic's official marketplace requires passing its review criteria. Publishing a `marketplace.json` in your own Git repo and sharing the `/plugin marketplace add <repo-url>` link directly with your team or community is a much faster path if you don't need that listing.

### Is it safe to use hooks in my plugin?

Yes, but hooks can run system commands, so only install plugins from sources you trust. `mcp_tool`-type hooks carry a smaller attack surface than hooks that spawn a subprocess directly, since they call a connected MCP server's tool without launching a separate process.

### What does a "symlink" error mean when installing a plugin?

It usually means a file path in `plugin.json` was trying to escape the repository root. The security fix now rejects paths like that outright. Check that every path your plugin references is a relative path that stays inside the repo.
