---
title: "What Is Claude Code's Easel Mod?"
slug: "claude-code-easel-chart-mod"
translationKey: "claude-code-easel-mod-2026"
locale: "en"
excerpt: "Easel is a built-in mod, shipped in Claude Code 2.1.330 on November 20, 2026, that draws charts directly in the terminal on Pro, Max, Team, and Enterprise."
category: "software-engineering"
tags: ["claude", "developer-experience", "automation", "productivity"]
publishedAt: "2026-11-21"
seoTitle: "What Is Claude Code's Easel Mod? (2026)"
seoDescription: "Easel is a built-in mod, shipped in Claude Code 2.1.330 on November 20, 2026, that draws charts directly in the terminal on Pro, Max, Team, and Enterprise."
---

Short answer: Easel is a built-in mod that shipped with Claude Code 2.1.330 on November 20, 2026, and it lets Claude draw charts straight inside the terminal. It runs on macOS and Linux, on Pro, Max, and — where available — Team and Enterprise plans; the changelog does not mention separate Windows support. Easel is built on top of Claude Code's existing "mods" system.

## What does Easel mod actually do?

When Easel is active, Claude renders numeric results from code execution or data analysis as a chart inside a terminal panel, instead of only printing numbers or writing a file. That panel sits right next to the conversation, so you get a live visual readout without opening a browser tab or exporting a PNG.

The panel shows as a sidebar next to the transcript on a wide fullscreen terminal, or as a framed area above the prompt when the window is narrower. Opening the panel does not draw anything by itself — Claude Code fires a `ui.render` event, and that event is what tells the mod what to draw inside the panel.

## What are "mods," and how does Easel fit into that system?

Easel is one example of Claude Code's broader "mods" system. Mods are small TypeScript functions that change how Claude Code behaves or looks, and they ship inside plugins. Mods have been enabled by default since Claude Code 2.1.287, so you typically don't need to flip a setting to start using Easel once you're on 2.1.330 or later.

Mods aren't limited to adding panels — they can also restyle built-in UI that Claude Code draws itself, such as a tool call's row, the spinner, or the permission/question dialog's frame. There's one firm boundary worth knowing: mods cannot change the permission prompt itself, so a mod can't skip or disguise the moment Claude asks before deleting a file or running a command.

A related capability is custom theming. A `$.theme.set` call applies a backdrop/color theme and `$.theme.clear` removes it; a `theme-examples` plugin ships ready-made starter themes, and Claude can generate a new theme from a written description. Theming requires Claude Code 2.1.319 or later, so it landed just before Easel in the same release line.

## Where does Easel mod work, and where doesn't it?

Easel and mod-drawn UI elements in general work in the terminal and in the desktop app's "Code" tab. They do not render in VS Code, in `claude -p` (print/non-interactive mode), or via the Agent SDK. That's a practical detail to check before you go looking for Easel's chart output in the wrong place.

If your team runs Claude Code through the VS Code extension, you simply won't see Easel's chart panel there — you'd need to reproduce the same workflow in the terminal or the desktop app instead.

## What else shipped in Claude Code 2.1.330?

Easel wasn't the only thing in the November 20, 2026 release. The same build added sign-in support for organizations managed through Anthropic's Enterprise Admin Console, extended recurring scheduled tasks and `/loop` from a 7-day cap to up to 30 days, introduced new `/fork` and `/workflows` commands in the VS Code extension, and rolled in 98 other bug fixes.

| Change | What it does | Platform/plan note |
|---|---|---|
| Easel mod | Live chart rendering in the terminal | macOS, Linux; Pro/Max/Team/Enterprise |
| Enterprise Admin Console sign-in | Sign in via managed enterprise org | Enterprise-managed organizations |
| Scheduled tasks and `/loop` up to 30 days | Longer-running automation loops | Previous cap was 7 days |
| VS Code `/fork`, `/workflows` | Session forking and workflow management | VS Code extension |
| 98 bug fixes | General stability | All platforms |

That spread, from a visual feature to enterprise authentication in a single release, is a reminder that reading the changelog weekly is still the cheapest way to track Claude Code's direction.

## What does a minimal mod look like in code?

The snippet below is a simplified, illustrative example of how a mod might register a panel and respond to the `ui.render` event. The exact API names may differ in practice, so check the official docs before copying anything like this into production code.

```typescript
// Simplified, illustrative example only
export default function myMod($) {
  $.panel.register("chart-panel", {
    onRender: (event) => {
      if (event.type === "ui.render") {
        return { kind: "chart", data: event.payload.series };
      }
    },
  });
}
```

My take: the real story here isn't that Claude Code can draw a chart — it's that Claude Code's terminal interface is turning into an extensible platform. A chat-driven coding tool growing a plugin ecosystem is a more durable shift than any single feature shipped inside it.

## How do you try Easel mod yourself?

To try Easel, update Claude Code to 2.1.330 or later and run it from the terminal on macOS or Linux; because mods are enabled by default, there's usually no extra setup step. Check your installed version with:

```bash
claude --version
```

If you want to see how Easel fits alongside other recent settings, the [Claude Code effort parameter](/en/posts/claude-code-effort-parameter-explained) is a good companion read for understanding how day-to-day workflow controls keep evolving. The same release line also carries [AGENTS.md support](/en/posts/claude-code-now-supports-agents-md), another developer-experience change worth tracking alongside Easel.

## Frequently Asked Questions

### What version of Claude Code added Easel mod?

Easel shipped in Claude Code 2.1.330, released on November 20, 2026. You need at least that version to use it, and you can check your current version by running `claude --version` in a terminal.

### Which plans and platforms support Easel mod?

Easel works on Pro and Max plans, and on Team and Enterprise plans where they're available, running on macOS and Linux. The changelog does not list separate Windows support for this feature.

### Does Easel mod work inside VS Code?

No, Easel's panel-based chart output does not display inside the VS Code extension. Mod-drawn custom UI elements render only in the terminal and in the desktop app's "Code" tab, and they're absent from `claude -p` print mode and the Agent SDK as well.

### Can mods change Claude Code's permission prompts?

No, mods can restyle a tool call's row, the spinner, or a dialog's frame, but they cannot change the permission prompt itself. That boundary keeps Claude passing through a standard confirmation step before risky actions like deleting files or running commands, regardless of which mods are installed.

Sources: [Claude Code changelog](https://code.claude.com/docs/en/changelog), [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview), [Claude Code mods blog post](https://claude.com/blog/claude-code-mods). To see how Claude Code stacks up against other tools, read the [Claude Code vs. Cursor vs. Antigravity comparison](/en/posts/claude-code-vs-cursor-vs-antigravity-2026) or browse the [software engineering category](/en/category/software-engineering).
