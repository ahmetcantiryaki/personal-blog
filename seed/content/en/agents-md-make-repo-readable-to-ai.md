---
title: "AGENTS.md: Make Your Repo Readable to AI Agents"
slug: "agents-md-make-repo-readable-to-ai"
translationKey: "agents-md-repo-setup-2026"
locale: "en"
excerpt: "Short answer: AGENTS.md is one file at your repo root that tells 30+ AI agents your build/test commands, code style, and which paths not to touch."
category: "software-engineering"
tags: ["ai-coding", "documentation", "best-practices", "open-source"]
publishedAt: "2026-09-07"
seoTitle: "AGENTS.md Explained: A 2026 Repo Setup Guide"
seoDescription: "What should go in an AGENTS.md file? A practical guide to the sections Claude Code, Cursor, Copilot, and Codex actually read, and the common mistakes."
---

Short answer: `AGENTS.md` is a single Markdown file at your repo root that spells out build and test commands, code style, paths not to touch, and review rules. As of mid-2026, more than 30 agents read it directly — OpenAI Codex, GitHub Copilot, Cursor, Gemini CLI, Google Jules, Factory, Aider, Zed, VS Code, Windsurf, and Devin among them — and Claude Code can import it alongside its own CLAUDE.md.

## Where did AGENTS.md come from, and who maintains it?

The file grew out of joint work between the teams behind OpenAI Codex, Amp, Google Jules, Cursor, and Factory — a convention, not something owned by a single vendor. It's now stewarded by the Agentic AI Foundation, a Linux Foundation project, so the spec itself doesn't sit at the mercy of one company's roadmap. As of mid-2026, more than 60,000 open-source repositories carry an AGENTS.md file.

The problem it solves is real: every tool wanted its own instruction file — `.cursorrules`, `CLAUDE.md`, `.github/copilot-instructions.md`. AGENTS.md collapses that sprawl into one file, portable across tools, that acts as a single onboarding guide for whichever agent shows up.

## A repo an agent kept breaking

One team kept watching their AI agent run the wrong test command instead of `npm test`, call a removed legacy API, and edit files under `legacy/` — and kept re-explaining the same three things at the start of every session. They added a three-paragraph AGENTS.md at the repo root: the correct test command, a "don't touch `legacy/`" rule, and the preferred HTTP client library. The mistakes stopped showing up in later sessions, because every agent now read the same context automatically at the start of each one.

## Which sections of AGENTS.md actually pay off?

Five sections carry most of the value: build and test commands (the exact command line, not a paraphrase), code style rules (skip anything the linter already catches — write only the project-specific preferences it doesn't), paths not to touch (`legacy/`, `generated/`), review rules (commit-message format, which tests are required), and environment setup (required environment variables, which package manager).

| Section | Why it pays off |
|---|---|
| Build/test commands | The agent runs the exact command instead of guessing |
| Code style | Project-specific preferences the linter doesn't catch get spelled out |
| Do-not-touch paths | Keeps the agent from editing generated or legacy code by mistake |
| Review rules | PRs land closer to what a human reviewer expects |
| Environment setup | The agent sets up the environment correctly from a cold start |

## How does AGENTS.md coexist with CLAUDE.md?

Claude Code still reads its own CLAUDE.md but can import AGENTS.md, so a repo can carry both: CLAUDE.md for Claude-specific behavior settings (permission modes, subagent definitions), AGENTS.md for the tool-agnostic instructions every agent reads. When an agent runs unattended for long stretches, as with [Claude Code's auto mode](/en/posts/claude-code-auto-mode-explained) now being the default, getting these baseline instructions right and current matters even more.

The practical rule: put project-wide, tool-agnostic constraints in AGENTS.md, and Claude-specific behavior tuning in CLAUDE.md. Trying to keep both files in sync with the same information recreates exactly the maintenance burden AGENTS.md was meant to remove.

## How do you keep AGENTS.md short and current?

The biggest trap is a file that quietly rots — an AGENTS.md still recommending a removed command, or listing a constraint that no longer applies, is worse than having no file at all, because the agent trusts it and heads in the wrong direction. The practical discipline: any PR that changes `package.json` scripts should also review AGENTS.md; verify the file against the real repo state by hand every few months; and try to keep it under 100 lines — the longer it gets, the harder it is for the agent to prioritize.

If any of these show up in your AGENTS.md, it's probably stale: a removed package name, a directory path that no longer exists, or a temporary note like "we're doing X now but migrating to Y." Temporary notes belong in the relevant PR description or issue, not in AGENTS.md.

```markdown
# AGENTS.md — short example

## Build & Test
- `pnpm install` then `pnpm test` (vitest, no DB required)
- `pnpm lint` — don't try to auto-fix, just report errors

## Do Not Touch
- `legacy/` — being removed, no new code goes here
- `generated/` — auto-generated, never edit by hand

## Code Style
- Use `fetch` for HTTP calls, don't add axios
- Prefer named exports over default exports in new files
```

Even this short example is far cheaper than re-explaining the same three constraints every session — and it leaves out anything the linter already enforces, like semicolons or indentation, because those are already applied automatically.

Even a post explaining project-specific conventions like [Advanced TypeScript Patterns](/en/posts/advanced-typescript-patterns) doesn't replace the short, direct answer AGENTS.md gives to "how is this done in this repo" — that kind of post explains a general principle, while AGENTS.md states your repo's specific decision.

## Which tools actually trigger which behavior from AGENTS.md?

Every tool reads the file, but not the same way. Codex, Cursor, Copilot, and Windsurf support it natively and load it automatically at the start of every session; Claude Code treats its own CLAUDE.md as the primary source and reads AGENTS.md only when it's explicitly imported, or when no CLAUDE.md exists. That difference matters in a repo carrying both files: put a tool-specific behavior setting (say, which model a particular subagent should run on) in AGENTS.md, and it effectively doesn't exist for tools that never read it.

| Tool | Reads AGENTS.md? | How |
|---|---|---|
| OpenAI Codex | Yes | Automatically, at session start |
| GitHub Copilot | Yes | Automatically, at session start |
| Cursor | Yes | Automatically, at session start |
| Claude Code | Partially | Only when imported; CLAUDE.md is primary |
| Gemini CLI | Yes | Automatically, at session start |

## How does AGENTS.md scale in a monorepo?

In a monorepo hosting more than one service, it works to split the root AGENTS.md into general rules (a shared lint command, commit format) and keep each package's own package-specific build/test commands in its own AGENTS.md. Most agents search upward from the directory they're working in for the nearest AGENTS.md, which turns the root file into "general" and subdirectory files into "specific" in a natural hierarchy. The risk: if a subdirectory file contradicts the root — the root says "use pnpm" while a package still recommends an npm script — the agent is left guessing which one to follow, so keep subdirectory files limited to information that's genuinely specific to that package.

## Frequently Asked Questions

### Which tools read the AGENTS.md file?

As of mid-2026, more than 30 agents read it directly, including OpenAI Codex, GitHub Copilot, Cursor, Gemini CLI, Google Jules, Factory, Aider, Zed, VS Code, and Windsurf. Claude Code can import it alongside its own CLAUDE.md.

### Is AGENTS.md the same thing as CLAUDE.md?

No. CLAUDE.md carries Claude Code-specific behavior settings, like permission modes and subagent definitions. AGENTS.md carries tool-agnostic baseline instructions — build commands, do-not-touch paths — that every agent reads the same way. A repo can have both.

### How much should I write in AGENTS.md?

As little as possible. Don't repeat rules the linter already enforces; write only what the agent can't guess — exact commands, do-not-touch paths, project-specific preferences. Keeping it under 100 lines makes it both easier to keep current and easier for the agent to prioritize correctly.

### Can a stale AGENTS.md actually cause harm?

Yes — it can be worse than having no file at all. A file that still recommends a removed command, or lists a constraint that no longer applies, leads the agent to trust wrong information and head in the wrong direction. Reviewing the file on any PR that changes `package.json` scripts cuts that risk significantly.
