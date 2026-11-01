---
title: "Why Do AI Agents Run in Sandboxes and VMs?"
slug: "why-ai-agents-run-in-sandboxes-vms"
translationKey: "why-ai-agents-run-in-sandboxes-2026"
locale: "en"
excerpt: "Short answer: the agent runs in an isolated VM built fresh for that session, not on your real computer, so a bug or an attack can't reach your actual files."
category: "ai"
tags: ["ai-agents", "web-security", "privacy", "best-practices"]
publishedAt: "2026-11-01"
seoTitle: "Why Do AI Agents Run in Sandboxes and VMs?"
seoDescription: "Why do Claude Cowork, ChatGPT Agent, and Gemini run in isolated VMs? What sandboxing actually blocks, what it can't, and the habits that close the gap."
---

Short answer: Claude Cowork, ChatGPT Agent, and similar tools run inside a virtual machine (VM) built fresh for each session, with its own network rules and file system, specifically to contain irreversible damage like a deleted file or a malicious command. That VM gets wiped entirely when the session ends — whatever the agent did inside it never touches your actual computer or server.

## Why don't AI agents just run on your real computer?

When you tell an agent to "clean up this folder," you're handing control to software that makes independent decisions and runs commands on its own; a bad command, a broken dependency, or a hidden instruction buried in a web page (prompt injection) can push it toward something you never intended. If the agent ran directly on your real operating system, the blast radius of that mistake would reach every file, browser session, and network connection you have.

A VM contains that blast radius to a single disposable box. Anthropic's [support documentation on the Cowork architecture](https://support.claude.com/en/articles/14479288-claude-cowork-architecture-overview) states that the VM enforces its own network egress filtering, syscall restrictions, and per-session user isolation on desktop sessions. In practice, that means every command the agent runs passes through this constrained environment first and never touches the host system directly.

## What exactly does the sandbox prevent?

The sandbox blocks three concrete risks: unwanted file deletion or modification from reaching your real system, unauthorized exfiltration of the data the agent processes, and limiting the damage a hidden instruction from a web page (prompt injection) can do if it hijacks the agent mid-task. In cloud sessions, each session gets its own sandbox with no shared state between sessions or organizations — which structurally stops a leak in one session from reaching another user or session.

| Risk type | Does the sandbox block it? |
|---|---|
| Agent accidentally deletes system files | Yes — it can't reach outside the VM |
| Hijacked via prompt injection into running a malicious command | Partially — the damage stays inside the VM, it doesn't escape |
| Unauthorized outbound network connection | Yes — all traffic passes through a mandatory proxy |
| Outcome of an action you explicitly authorized (e.g. telling it to delete the wrong file) | No — that's an action you authorized |
| Misuse of a connector you attached (email, CRM) | No — connector tokens run server-side, outside the sandbox |

## What can't the sandbox prevent?

The sandbox can't prevent the outcome of an action you explicitly authorized — if you tell an agent to "delete this file" and it deletes the wrong one, that's a failure of the instruction or the authorization, not a failure of the VM. The same applies to connectors: an agent you've linked to your real email account or CRM can take real, irreversible actions through that link, because the connector token talks directly to that service from outside the sandbox.

A July 2026 [research note from the Cloud Security Alliance](https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/07/CSA_research_note_claude_cowork_sharedroot_sandbox_escape_20260724-csa-styled.pdf) described a chain called "SharedRoot" that let an unprivileged session user inside the local VM reach the host Mac's file system without a permission prompt; Anthropic disputed the severity of the report. That example shows the sandbox is a strong boundary, not a perfect one — it shouldn't be treated as your only layer of defense.

## How does Claude Cowork's isolation model work?

In Cowork, local sessions run inside a dedicated Linux guest separated by a hypervisor — Apple Virtualization on macOS, Hyper-V on Windows. Each session gets its own randomly named user account, and the disk is reformatted on every VM boot. Cloud sessions get their own sandbox created at the start of the session and destroyed at the end, with connector tokens scoped to that session and expiring within hours.

Some capabilities, like computer use and browser control, run outside the VM, which puts them under a separate layer of permissions and review. With [Cowork's expansion to web and mobile](/en/posts/claude-cowork-web-mobile-expansion), this same isolation model now extends to sessions started outside the desktop app.

## How are ChatGPT Agent and Gemini isolated?

ChatGPT Agent runs in OpenAI's own sandbox and can only see files you've explicitly uploaded to the conversation — but in the Atlas browser's "logged-in" mode, it can use sites you're already signed into, which means the standalone agent and the in-browser agent operate at different isolation levels. OpenAI says it added safeguards for the risk that comes with logged-in access, including pausing on sensitive sites like financial institutions; agent mode in Atlas can't run code in the browser, download files, install extensions, or access saved passwords.

| Platform | Isolation model | Direct access to your computer |
|---|---|---|
| Claude Cowork (desktop) | Hypervisor-separated Linux VM | None — computer use is a separate layer |
| Claude Cowork (cloud) | Sandbox created and destroyed per session | None |
| ChatGPT Agent (standalone) | OpenAI's own sandbox, clean browser | None |
| ChatGPT Agent (Atlas, logged-in mode) | Sandbox + access to signed-in sites | Limited — no files/extensions/saved passwords |

## What's the trade-off of giving an agent real file or system access?

The moment you give an agent access to your real files or accounts, you give up part of the protection the sandbox provides — the boundary of the risk is no longer the VM's walls, it's the scope of the authority you handed over. That trade-off is unavoidable, because an agent only becomes genuinely useful once it touches real data — but it means how wide you open that access should be a deliberate decision, not a default.

My take: most people frame this as an all-or-nothing choice — full access or no agent at all — but there's a practical middle path: scope access per task. The "test in isolation first" principle covered in [testing AI agents before production](/en/posts/test-ai-agents-before-production) applies here too: granting broad access directly is riskier than starting with a narrow folder or a read-only connection, building trust, and widening it from there.

## What safety habits should you build when using agents?

Four habits cut most of the risk: point the agent at only the folder it needs, not your whole disk or home directory; read the diff before applying any change it proposes; back up before any irreversible action; and connect integrations under least privilege — if read access to your inbox is enough, don't grant send access too.

These habits matter most for connectors specifically, because connector tokens operate outside the sandbox's protected boundary. The data-sharing principles in [protecting your privacy in the age of AI assistants](/en/posts/protect-privacy-ai-assistants) apply directly here too: every new connector you attach opens a new risk surface outside the line the sandbox draws.

## Frequently Asked Questions

### Why do AI agents run in a virtual machine?

To stop commands the agent runs, or a prompt-injection attack against it, from reaching your real computer or server. The VM is wiped entirely when the session ends, which contains any possible damage to a single disposable box.

### Does the sandbox protect me from every risk?

No. The sandbox can't prevent the outcome of an action you explicitly authorized — like telling it to delete the wrong file — or the misuse of a connector you've attached, because both of those happen outside the sandbox's protected boundary.

### What's the difference between Claude Cowork's and ChatGPT Agent's isolation?

Cowork uses a hypervisor-separated Linux VM on desktop and a sandbox created and destroyed per session in the cloud. ChatGPT Agent runs in a clean sandbox in standalone mode, but in the Atlas browser's "logged-in" mode it can access sites you're already signed into — a different isolation level between the two modes.

### What should I watch for before connecting an agent to a service like email or a CRM?

Connect it under least privilege — grant only the access it actually needs, back up before any irreversible action, and read the diff before applying a proposed change. Connector tokens run outside the sandbox, so this care doesn't substitute for VM isolation — it covers the part the VM can't.
