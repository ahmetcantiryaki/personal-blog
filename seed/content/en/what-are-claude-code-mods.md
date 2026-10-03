---
title: "What Are Claude Code Mods? Plugins That Rewrite Claude"
slug: "what-are-claude-code-mods"
translationKey: "claude-code-mods-explained-2026"
locale: "en"
excerpt: "Claude Code mods, shipped October 1, 2026 in v2.1.287, are plugins that run inside the process and can intercept tool calls and rewrite the UI."
category: "ai"
tags: ["claude", "ai-coding", "automation", "developer-experience"]
publishedAt: "2026-10-03"
seoTitle: "Claude Code Mods Explained: Setup, API, and Security"
seoDescription: "Claude Code mods are plugins that run inside the process and can rewrite prompts, block tool calls, and redraw the UI. Here's how they work since v2.1.287."
---

Short answer: a Claude Code mod is a plugin of JavaScript or TypeScript event handlers that run inside the Claude Code process itself. Shipped in v2.1.287 on October 1, 2026, a mod can intercept a tool call, rewrite the prompt Claude reads, redraw the interface, or add its own commands — things a settings hook, skill, or MCP server can't do, since those all run outside the process.

## What are Claude Code mods?

A mod is a plugin whose code registers event handlers called hooks, and Claude Code calls one whenever a matching event fires — a tool call, a submitted prompt, or a piece of the interface being drawn. Because the handler runs inside Claude Code's own process, it can observe the event, change it, or answer it outright instead of letting the usual behavior continue.

A minimal mod is three files: a `.claude-plugin/plugin.json` manifest, a `hooks/hooks.json` pointer, and a `hooks/register.js` entry point that exports a `register(on)` function. Anthropic's own documentation gives a complete working example that counts tool calls and shows the running total next to the spinner — about ten lines of code.

## How are mods different from settings hooks, skills, and MCP servers?

They solve overlapping problems with different amounts of access. A settings hook runs a shell command or HTTP request you configure in a settings file; a skill is a Markdown file of instructions Claude reads; an MCP server is an external process that hands Claude new tools. A mod is the only one of the four that runs inside Claude Code's process and can draw its own interface.

| | Mod | Settings hook | Skill | MCP server |
|---|---|---|---|---|
| Runs | Inside Claude Code's process | Outside, as a script or request | N/A — read as instructions | Outside, as a separate server |
| Can draw UI | Yes (pane, band, buttons) | No | No | No |
| Can rewrite a tool call | Yes | Limited (allow/deny/log) | No | No |
| Written in | JavaScript/TypeScript | Any language for the script | Markdown | Any language |
| Best for | Custom panes, rewriting events, new commands | Blocking/logging with a script you already have | Repeated instructions you keep pasting | Giving Claude access to an external system |

The practical rule from Anthropic's own docs: reach for a settings hook first if a script already does the job, and reach for a mod only when you need to draw something or change an event's data, not just allow or deny it.

## What can a mod actually do?

A mod can hold a tool call and ask the user a question before it runs, answer a tool call without running it at all, redirect one turn's request to a different model, or add a slash command that runs instantly, even while Claude is mid-task. It does all of this through the mods API, the `$` object every hook receives, which exposes namespaces like `$.ui`, `$.fs`, `$.http`, and `$.model`.

```javascript
// hooks/register.js — counts tool calls and shows the total by the spinner
let calls = 0

export function register(on) {
  on('tool.call', async ($, e, next) => {
    calls += 1
    $.ui.invalidate('ui.render')
    return next(e)
  })

  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    return next({ ...e, props: { ...e.props, suffix: ' · tool calls: ' + calls + '…' } })
  })
}
```

This is the exact example from Anthropic's documentation: the first hook increments a shared counter on every tool call, and the second rewrites the spinner's text to show it — turning "Thinking…" into "Thinking · tool calls: 3…" as Claude works.

## Are Claude Code mods safe to install?

No — not inherently, and Anthropic says so directly: a mod runs with your full user permissions, is not sandboxed, and can read files, start processes, make network requests, read environment variables and API keys, and approve its own tool calls without asking you. Turning on [Claude Code's sandbox](/en/posts/claude-code-restricted-mode-explained) isolates the Bash commands Claude runs, but a process a mod starts runs outside that sandbox entirely.

Before installing one, run `claude plugin validate ./some-mod` on its source, which lists every event it handles and every mods-API call it makes — reads, writes, network requests — without actually running it. That audit step matters more for mods than for a typical [Claude Code plugin](/en/posts/build-and-share-claude-code-plugins), because a mod's access is broader by design. Anthropic's own [skill and plugin security scanner](/en/posts/claude-skill-plugin-security-scanning) covers a related but separate risk: it flags malicious instructions in a skill or plugin manifest, not a mod's runtime behavior once loaded.

## Which mods ship built into Claude Code?

Five mods ship built-in and can't be uninstalled, only disabled individually through `/plugin`: `cc-plugin-agents-md` loads `AGENTS.md` as project instructions, `cc-plugin-diff` runs the `/diff` pane, `cc-plugin-sec-default` guards organization-managed settings from user-installed mods, `cc-plugin-telemetry` sends Claude Code's own analytics, and `cc-plugin-you-should-know` — disabled by default — runs a side agent that watches a long task and surfaces a note above the prompt when it spots something worth knowing. The source for several of these is public in the `mods` directory of the `claude-code` GitHub repository, which doubles as a working reference for anyone writing their own.

## In what order do mods run?

When a session has more than one mod loaded, each runs at one of four tiers — `prepend`, `user`, `append`, or `builtin` — and events are processed in that order. Mods in an organization's managed `prependPlugins` list run before anything a user installs themselves, and `appendPlugins` mods run after all of them. That ordering is what lets an organization's own policy mod, such as `cc-plugin-sec-default`, run first and stay authoritative: a user-installed mod can't override a managed `deny` rule unless `allowManagedModsOnly`'s companion setting, `allowModsToOverrideDenyRules`, is explicitly turned on.

The ordering also matters for debugging. When an event comes out changed in a way you didn't expect, knowing which mods are loaded and in what tier narrows down which one to blame. `claude plugin validate` lists the events a given mod subscribes to, and `/plugin` shows the load order that applies within a session.

## Should you actually install a mod right now?

For a solo developer customizing their own terminal, the risk is proportional to what you choose to trust — install from a marketplace you know, validate first, and the downside is limited to your own machine. For a team, the calculus changes: a mod runs with the same reach as [Claude Code's MCP connections](/en/posts/how-do-you-manage-mcp-servers-in-claude-code) but without a sandbox boundary, which is exactly why Anthropic shipped `allowManagedModsOnly` and `prependPlugins` alongside the feature itself. An organization that already locked down [auto mode's classifier behavior](/en/posts/claude-code-auto-mode-classifier-fees-removed) should treat mod approval with the same seriousness before rolling it out past a single machine.

The feature itself is a genuine capability gap closed — redrawing the interface and intercepting events from inside the process wasn't possible for a plugin author before. But "not sandboxed by default" on a tool that now sits at the center of many engineers' daily workflow is the kind of tradeoff that deserves a policy, not just a warning note in the docs.

## Frequently Asked Questions

### When were Claude Code mods released?

Mods shipped in Claude Code version 2.1.287, released October 1, 2026, and are on by default for any installation of that version or later. Run `claude --version` to check which version you have.

### Are Claude Code mods sandboxed?

No. A mod runs with the same permissions as the user running Claude Code and is not sandboxed — it can read and write files, start processes, and make network requests outside of any Bash sandbox Claude Code's own commands use. Install mods only from sources you trust.

### How do I see which mods are active in my session?

Run `/plugin` at the Claude Code prompt. A line under the tabs shows the count and names of active non-built-in mods, such as "1 mod active · first-mod". Built-in mods are listed separately under the Installed tab.

### What's the difference between a mod and a regular Claude Code plugin?

A mod is a specific kind of plugin: one that registers JavaScript or TypeScript event handlers running inside Claude Code's own process. A plugin without a mod can still ship skills, commands, agents, or MCP servers, none of which touch the process directly or can redraw the interface the way a mod can.
