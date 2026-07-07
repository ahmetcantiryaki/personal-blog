---
title: "Agentjacking: The New AI Agent Attack Class"
slug: "agentjacking-ai-agent-attack"
translationKey: "agentjacking-ai-agent-security"
locale: "en"
excerpt: "Agentjacking hijacks AI coding agents through poisoned telemetry pulled via MCP. Here is the real threat model and an evergreen defense checklist."
category: "software-engineering"
tags: ["web-security", "ai-agents", "mcp", "ai-coding", "ai-reliability"]
publishedAt: "2026-07-07"
seoTitle: "Agentjacking: The New AI Agent Attack Class"
seoDescription: "Agentjacking tricks AI coding agents into running malicious code from poisoned Sentry telemetry via MCP. The threat model and a defense checklist."
---

The headline writes itself: "Fake bug report hijacks a $250B company's AI agent." It is technically true and strategically useless. Framed as a Sentry problem or a Claude Code problem, agentjacking looks like a vendor patch away from solved. It isn't. The scary part is not the exploit chain — it's the assumption underneath it, and that assumption lives in almost every agent setup shipping today: your coding agent trusts your telemetry as if you wrote it.

Agentjacking was disclosed on 2026-06-13 by [Tenet Security](https://tenetsecurity.ai/blog/agentjacking-coding-agents-with-fake-sentry-errors/), and it names a genuinely new attack class rather than a one-off bug. The mechanics are almost insulting in their simplicity, which is exactly why the lesson is durable. Let me argue the nuance instead of the panic.

## What agentjacking actually is

A Sentry DSN — the client key that lets a frontend report errors — is public by design. It sits in plain JavaScript on production sites. Anyone who reads your page source can send error events to your Sentry project. That's not a leak; it's how the SDK works.

Now add an AI coding agent wired to Sentry through an [MCP server](/en/posts/model-context-protocol-explained). You ask it to "look at that new error and fix it." The agent calls the Sentry MCP tool, pulls the error report, and reads it as trusted diagnostic context — the same way it reads a compiler message. Here's the hinge: an attacker who found your public DSN has already planted a fake error whose body contains hidden markdown prompt-injection dressed up as Sentry's own "remediation steps." The agent cannot tell a real crash from a forged one. It follows the "fix," which quietly instructs it to run code — exfiltrating environment variables, AWS keys, GitHub and GitLab OAuth tokens, npm and Docker credentials, Kubernetes and CI/CD secrets — to an attacker's server.

Every step is authorized. As [The New Stack](https://thenewstack.io/agentjacking-sentry-mcp-attack/) put it, a public key is all it takes. EDR, WAF, IAM, and firewalls see nothing worth flagging, because nothing unauthorized happened. The agent did what it was told. It just couldn't tell who was telling it.

## Why this works: the trust boundary nobody drew

Traditional security assumes a clean line between *code* (trusted, executable) and *data* (untrusted, inert). Prompt injection erases that line, because to a language model, everything is text and text is instruction. The agent's tool output — telemetry, API responses, file contents, issue trackers — flows into the same context window as your actual prompt, with no privilege separation.

This is the same failure mode behind [package hallucinations and slopsquatting](/en/posts/ai-coding-assistant-mistakes): the model treats a plausible-looking string as ground truth. Agentjacking just weaponizes the highest-trust string an agent sees — the error report it was explicitly asked to fix. OWASP's 2026 work on agentic AI reached the same conclusion from the other direction: prompt injection still drives most agentic-AI failures, per [Help Net Security's June 2026 coverage](https://www.helpnetsecurity.com/2026/06/11/owasp-agentic-ai-security/). The novelty in agentjacking isn't the injection — it's the *delivery channel*. Your own observability pipeline becomes the payload carrier.

## The numbers — and how much to trust them

Tenet reports real scale. Treat these as vendor-reported, not independently reproduced.

| Metric | Reported figure | Caveat |
|---|---|---|
| Organizations exposed | 2,388 | Vendor scan; "exposed" ≠ compromised |
| Exploitation success rate | ~85% across popular agents | Controlled testing, not the wild |
| Agents observed acting | 100+ in testing | Tenet's own instrumentation |
| Agents affected | Claude Code, Cursor, Codex | Any MCP-telemetry agent, in principle |
| Secrets recovered in PoC | AWS, GitHub/GitLab, npm, Docker, K8s, CI/CD | Proof-of-concept, not confirmed theft |

An 85% success rate is alarming, and it's also a lab result under favorable conditions. My honest read: the exact percentage matters less than the shape of the finding. Even if the real-world rate were a fifth of that, an attack that needs only a public key and turns your telemetry into a code-execution channel is structurally dangerous. Discount the number; keep the threat model.

## The evergreen lesson: treat agent-ingested data as untrusted input

Sentry and the named agents will ship mitigations — Tenet already open-sourced `agent-jackstop`, drop-in hardening configs for Cursor and Claude Code. But patching one telemetry source is whack-a-mole. As of July 2026, the same class of attack applies to any channel an agent reads without a trust boundary: log aggregators, issue trackers, CI output, webhook payloads, scraped web pages, even other agents' messages.

The principle that outlives the news cycle: **anything your agent pulls through a tool is untrusted external input, exactly like a raw HTTP request body.** You already validate those. You've been doing it for twenty years. Agent tooling quietly reintroduced the mistake we spent two decades unlearning — trusting input because of where it came from.

## A defense checklist that survives the next exploit

Not "less trust." Structural controls. Sanitize before the model, gate before execution, verify the source.

- **Strip and normalize markdown** from tool output before it reaches the model context. Injection hides in link syntax, HTML comments, and invisible characters — flatten telemetry to plain text.
- **Require human approval before code execution.** No agent should run a shell command derived from telemetry it fetched. This one control breaks the entire chain.
- **Sandbox tool calls.** Run agents without ambient credentials. If AWS keys and OAuth tokens aren't in the environment, there's nothing to exfiltrate.
- **Pin and vet MCP servers.** Treat every server as a trust boundary — pin sources, review what they return, and don't wire in a telemetry server you haven't audited.
- **Scope secrets to nothing by default.** The blast radius of agentjacking is exactly your ambient credential set. Shrink it.

A minimal guardrail — never let telemetry-derived text become an executable command unreviewed:

```python
# Wrong: agent output piped straight to a shell
subprocess.run(agent_suggested_command, shell=True)  # game over

# Right: strip formatting, then gate on explicit human approval
clean = strip_markdown(tool_output)          # kill hidden injection
plan = agent.propose_fix(clean)              # a proposal, not an action
if human_approves(plan) and plan.no_secrets_access:
    run_in_sandbox(plan.command)             # no ambient credentials
```

If you're formalizing agent behavior into repeatable checks, our guide on [evaluating LLM outputs](/en/posts/how-to-evaluate-llm-outputs) covers turning ad-hoc safety rules into an eval suite, and the [reduce LLM hallucinations](/en/posts/reduce-llm-hallucinations) playbook shares the same root discipline: never let a fluent string stand in for a verified fact.

## The contrarian take

The reflex response is "audit your MCP servers," and it's not wrong — but it aims at the wrong layer. The design flaw isn't a bad server; it's that agent frameworks merge tool output and user intent into one undifferentiated context with no privilege model. Until agents separate "instructions I was given" from "data I retrieved," every new integration is a new injection surface. Agentjacking is the first widely-reported instance. It will not be the last, and the fix is architectural, not a config file. For the broader trade-offs of handing autonomy to agents, our [AI agents vs workflows](/en/posts/ai-agents-vs-workflows) breakdown is a useful gut-check on where an autonomous agent is even worth the risk. More engineering deep-dives live on the [Software Engineering](/en/category/software-engineering) hub.

## Frequently Asked Questions

### What is agentjacking?

Agentjacking is an attack class, disclosed by Tenet Security in June 2026, where an attacker plants prompt-injection inside data an AI coding agent fetches through a tool — typically fake error reports sent to a public Sentry DSN. The agent reads the poisoned telemetry via MCP as trusted diagnostic guidance and is tricked into running attacker-controlled code, leaking credentials and secrets from the developer's machine.

### Is agentjacking only a Sentry problem?

No, and that's the trap in the framing. Sentry is the disclosed delivery channel because its DSN is public by design, but the underlying flaw is that agents trust any tool output as ground truth. The same technique applies to log pipelines, issue trackers, CI output, webhooks, and scraped pages. Fixing Sentry alone leaves the attack class intact.

### How do I protect my AI coding agent from agentjacking?

Treat all agent-ingested external data as untrusted. Strip and normalize markdown before it reaches the model, require human approval before any code execution, run agents in a sandbox without ambient credentials, and pin and vet your MCP servers. Tenet also open-sourced `agent-jackstop` hardening configs for Cursor and Claude Code as a starting point.

### Are the reported 2,388 organizations and 85% success rate reliable?

Treat them as vendor-reported, not independently verified. Tenet Security produced both figures through its own scanning and controlled testing, so the exact numbers may not hold in the wild. The value is directional: the attack needs only a public key and turns telemetry into code execution, which is structurally dangerous even at a fraction of the reported rate.
