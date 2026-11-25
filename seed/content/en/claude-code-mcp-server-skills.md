---
title: "What Are Claude Code's New MCP Server Skills?"
slug: "claude-code-mcp-server-skills"
translationKey: "claude-code-mcp-server-skills-2026"
locale: "en"
excerpt: "Claude Code 2.1.332 lets MCP servers ship Skills directly, shown as server:skill in the / menu, so one connection delivers both tools and ready-made workflows."
category: "ai"
tags: ["claude", "mcp", "ai-tools", "automation"]
publishedAt: "2026-11-25"
seoTitle: "Claude Code's MCP Server Skills (Beta), Explained"
seoDescription: "Claude Code 2.1.332 adds Skills from MCP servers (beta): one MCP connection can now bundle tools and Skills together, shown as server:skill in the / menu."
---

Short answer: as of Claude Code 2.1.332, released November 25, 2026, an MCP (Model Context Protocol) server can ship its own Skills, not just tools. They show up in the `/` menu as `server:skill` — for example `jira:triage-ticket` — so connecting to one MCP server now hands you both callable tools and ready-made, reusable workflows at the same time.

## What exactly changed in Claude Code 2.1.332?

Before this release, Skills came from exactly two places: a folder on your machine (`~/.claude/skills/`) or a plugin installed from a marketplace. Tools, separately, came from an MCP server — a connection built on the open [Model Context Protocol](https://modelcontextprotocol.io). Version 2.1.332 merges those two paths for the first time: an MCP server can now expose a Skill alongside its tools, and Claude Code loads it the same way it loads a local one, just namespaced under the server's name. A skill named `triage-ticket` served by a Jira MCP connection shows up as `jira:triage-ticket`, while a Skill you installed yourself keeps its plain name, so there's never ambiguity about where a given Skill actually came from.

## How is a server-hosted skill different from one you installed yourself?

A local Skill is a file you or a plugin maintainer wrote, and it only changes when you edit it or pull a plugin update. A server-hosted Skill is fetched over the MCP connection every time Claude Code talks to that server, so the server's maintainer can revise the Skill's instructions on their end, and every connected client picks up the change on the next session — no separate install step, no version to track by hand.

| | Local skill | MCP server skill (beta) |
|---|---|---|
| Where it lives | `~/.claude/skills/` or a plugin | The MCP server you're connected to |
| Name in the `/` menu | Its own name | `server:skill` |
| Update path | You edit it, or update the plugin | Server-side; picked up on next connect |
| Who controls the content | You, or the plugin's maintainer | The MCP server's maintainer |
| Shell commands at load time | Gated by `PreSkillShellCommand` | Gated by the same hook |

## Why does this change how teams distribute AI tooling?

Until now, a team that wanted to hand developers both a tool (say, "query our internal ticketing API") and a workflow for using it well (say, "triage a ticket the way our on-call rotation expects") had to ship two separate things: an MCP server for the tool, and a Skill — usually installed as its own plugin — for the workflow. One MCP connection now covers both, which matters most for internal tooling teams: publish a single server, and everyone who connects to it gets the tool and the house workflow in the same step, already versioned together, instead of two things that can silently drift apart.

## What is the new `PreSkillShellCommand` hook, and why pair it with this?

`PreSkillShellCommand` is a hook event, also added in 2.1.332, that can refuse a Skill's or command's inline shell commands as the Skill loads — before any of them run. On 2.1.331 and earlier, a settings file that merely named this hook opened a confirmation dialog at startup instead of actually enforcing anything. The pairing matters because MCP server skills introduce a genuinely new trust boundary: a Skill used to come from your own filesystem or a vetted plugin marketplace, and now it can come from any MCP server you've connected to. `PreSkillShellCommand` gives a security team one enforcement point to inspect — and block — a shell command a third-party server's Skill tries to run on load, instead of relying on having read that Skill's source code first.

## How do you try MCP server skills today?

The feature is beta, which Anthropic's own changelog flags explicitly, so expect the serving side to be uneven: only an MCP server whose maintainer has implemented skill-serving will expose one, and most servers in the wild as of late November 2026 don't yet. To check what you've got, connect to a server and look at the `/` menu — a server-hosted Skill is unmistakable by its `server:skill` naming. If you maintain [an internal MCP server for your company's tools](/en/posts/build-an-internal-mcp-server-for-your-tools), this is the moment to check whether packaging your team's internal workflows as Skills alongside your existing tools is worth the move — doing so means a new teammate who connects to the server never has to be told separately, "and also install this plugin for how we do X."

A minimal `PreSkillShellCommand` gate in settings, as a starting point:

```json
{
  "hooks": {
    "PreSkillShellCommand": [
      {
        "matcher": "server:*",
        "hooks": [{ "type": "command", "command": "./scripts/vet-skill-shell.sh" }]
      }
    ]
  }
}
```

## What should you watch out for, since this is still beta?

Treat a server-hosted Skill the way you'd treat a dependency from a registry you don't control: read what it actually does before letting it run anything with shell access, and don't assume the `server:skill` namespacing alone protects you — it tells you where a Skill came from, not whether it's safe. The same November releases that shipped this feature also tightened unrelated guardrails elsewhere — [Claude Code's sandboxed bash permissions](/en/posts/claude-code-sandboxed-bash-permissions-change) and [restricted mode](/en/posts/claude-code-restricted-mode-explained) are both part of the same broader direction: more confirmation before anything a Skill or a tool does that touches your shell or filesystem.

My honest take: this is the more interesting of the two Skill-related changes buried in 2.1.332 — not because "skills from a server" sounds exciting on its own, but because it quietly answers the actual distribution problem teams had with Skills, which was never writing them, it was keeping twenty people's installs in sync with the one correct version.

Primary source: [Claude Code's changelog](https://code.claude.com/docs/en/changelog).

## Frequently Asked Questions

### What version of Claude Code added Skills from MCP servers?

Claude Code 2.1.332, released November 25, 2026, added Skills from MCP servers as a beta feature. They appear in the `/` menu as `server:skill`, distinct from locally installed Skills, which keep their own plain names.

### How do MCP server skills differ from Claude Code plugins?

A plugin is something you install once and update by hand or through a marketplace; a Skill served by an MCP server is fetched over that connection and updates whenever the server's maintainer changes it, with no separate install step on your end.

### Does PreSkillShellCommand block all MCP server skills by default?

No. `PreSkillShellCommand` is a hook event you configure yourself; it lets you write a rule that inspects or refuses a Skill's inline shell commands as the Skill loads. With no hook configured, a Skill's shell commands run as they would have before 2.1.332.

### Is Skills from MCP servers available outside the beta?

Not yet, as of the November 25, 2026 release. Anthropic's changelog marks it explicitly as beta, and it depends on the specific MCP server you connect to having implemented skill-serving — most servers haven't, as of this writing.
