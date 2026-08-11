---
title: "Claude Managed Agents Gets Budgets, Advisors, Data Residency"
slug: "claude-managed-agents-budgets-advisors-data-residency"
translationKey: "claude-managed-agents-budgets-advisors-residency"
locale: "en"
excerpt: "Anthropic shipped session budgets, advisor models, inference geo controls, and GitHub skill loading to Managed Agents on August 7 — all built for production."
category: "ai"
tags: [claude, ai-agents, ai-infrastructure, automation]
publishedAt: "2026-08-11"
seoTitle: "Claude Managed Agents: Budgets, Advisors, Data Residency"
seoDescription: "Anthropic shipped session budgets, advisor models, inference geography controls, and GitHub-based skill loading to Managed Agents on August 7, 2026."
---

On August 7, 2026, Anthropic shipped four concrete additions to the Managed Agents layer of the Claude Developer Platform, per the [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview): a hard per-session spend cap, a mid-turn advisor model, control over where model inference physically runs, and automatic skill discovery from a mounted GitHub repository. Together they read less like feature-flag housekeeping and more like the platform quietly growing the guardrails a production agent deployment actually needs.

Worth being precise upfront: Managed Agents is not Claude Code. It's Anthropic's hosted API for building and running autonomous agents — you define an agent (model, system prompt, tools), then start sessions that reference it, and Anthropic runs the agent loop plus the sandbox the tools execute in. Claude Code is a separate product, a CLI that runs on a developer's own machine. This week's four features apply only to Managed Agents.

## The four features that shipped this week

| Feature | What it does | Where it's configured | Why it matters |
|---|---|---|---|
| Session budgets | Sets a hard dollar cap on a session, priced at public list rates; the session pauses instead of making new model requests once the cap is hit | `budget` field on `sessions.create()` | Removes the possibility of a runaway agent loop blowing up the bill |
| Advisors | Lets the session's main workflow consult a separate model — at least as capable as its own — mid-turn, without that model taking over the task | `{"type": "advisor"}` entry in the agent's `multiagent.agents` roster | A much cheaper "second opinion" pattern than standing up full multi-agent orchestration |
| Inference geo | Pins the geography where the model's inference requests are physically served | `model.inference_geo` on the agent, overridable per session | Concrete data-residency lever for EU and other regulated customers |
| Skills from a GitHub repo | A session with a mounted GitHub repo auto-discovers Claude Skills in the repo's root `.claude/skills` directory at session start | Nothing extra — it rides on the existing `github_repository` resource | Kills the manual upload-and-resync loop for skill management |

### Session budgets: capping spend without writing your own meter

Until now, bounding what a Managed Agents session could spend meant writing your own usage-tracking code and killing the session once it crossed a threshold — a lagging fix that could never match a check the platform runs before every model request. Per the [budgets documentation](https://platform.claude.com/docs/en/managed-agents/budgets), `sessions.create()` now accepts a `budget` object; the platform continuously prices everything the session consumes (tokens, web searches, running time) at public list rates and stops issuing new model requests once that total reaches the cap. The session doesn't terminate — it goes `idle` with `stop_reason: "budget_reached"` and waits; changing or removing the budget resumes the paused work automatically.

Scheduled deployments — cron-driven, repeated agent runs — can copy the same budget onto every session they fire, so a rule like "the nightly reporting agent never spends more than $50" is defined in exactly one place. A realistic use case: capping a customer-support agent at a weekly $200 ceiling and handing off to a human queue once it's hit.

### Advisors: a cheaper pattern than full orchestration

Per the [multiagent orchestration docs](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration#give-the-session-an-advisor), you add a `{"type": "advisor", "model": "..."}` entry to a session's multiagent roster, and the main workflow can consult that model mid-turn — while planning an approach, when it's stuck, or to sanity-check its work before finishing. The advisor doesn't take over; it runs in its own isolated thread, replies with guidance, and the primary agent continues. The advisor model must be at least as capable as the executor's own — pairing a weaker model as advisor is rejected when the agent is saved.

A realistic scenario: a fast, cheap Sonnet-based agent asking a more capable model "does this hold up?" on a gnarly refactor — without standing up the full roster covered in [our multi-agent orchestration patterns piece](/en/posts/multi-agent-orchestration-patterns).

### Inference geo: where the data actually gets processed

Per the [data residency docs](https://platform.claude.com/docs/en/manage-claude/data-residency), `inference_geo` sits inside the `model` object at agent-creation time (optionally overridden per session) and pins which geography serves the agent's model requests. For EU customers or any other regulated business with a contractual data-residency obligation, this is a concrete control point for "our data never leaves a given region" rather than a policy statement with nothing enforcing it. The pin is fixed for a session's lifetime, and every agent in a multiagent roster must share the same pin — a mismatched roster fails validation.

### Skills from a GitHub repository

Per the [skills documentation](https://platform.claude.com/docs/en/managed-agents/skills#load-skills-from-a-github-repository), when a session mounts a GitHub repo as a `github_repository` resource, the platform now scans that repo's root `.claude/skills` directory at session start and makes any skills it finds available to the agent — no manual upload, no separate Skills API call, nothing to keep in sync by hand. Skills live in version control alongside the code they support: a team updates a skill, the next session picks it up automatically. The scan happens once, at session start, against whatever branch or commit is checked out — pushes made mid-session don't take effect until a new session starts.

## Putting it together

The snippet below sketches an agent for a regulated customer — EU inference, an advisor for judgment calls, and a spend cap. The model and advisor roster live on the agent definition; the budget lives on session creation — shown together here for clarity:

```json
{
  "agent_config": {
    "model": {
      "id": "claude-opus-5",
      "inference_geo": "eu"
    },
    "system": "You are a support agent for EU customers. Consult your advisor before responding to ambiguous refund requests.",
    "multiagent": {
      "type": "coordinator",
      "agents": [
        { "type": "advisor", "model": "claude-opus-5" }
      ]
    }
  },
  "session_config": {
    "environment_id": "env_01H8X2K9QZ",
    "budget": {
      "type": "limit",
      "max_list_cost": { "amount": "5000", "currency": "USD" }
    }
  }
}
```

The combination isn't incidental: the budget handles cost control, the advisor adds a quality check while keeping the main model cheap, and `inference_geo` checks the compliance box — one deployment satisfying finance and security at once.

## Is the advisor actually a new primitive?

Worth being honest here: the advisor pattern is, technically, a polished version of something already possible — calling a second agent and reading its answer. The real win isn't architectural, it's operational: an advisor thread is exempt from the 25-concurrent-thread limit, manages its own prompt caching, and the platform enforces valid pairing (the executor/advisor capability check) — so you're not resolving "should the cheap model ask the expensive one, or the reverse" by hand. Call it a well-worn pattern promoted to first-class status, not a genuinely new primitive. Session budgets feel more overdue — a safety net any production agent needs from day one, which everyone was rewriting themselves until now.

## When to reach for which

A practical rule of thumb: put a budget on every scheduled deployment and measure actual cost instead of assuming zero. Reach for the advisor on tasks where a full multi-agent roster isn't warranted but "is this actually right?" still matters — unlike [Claude Code's background subagents](/en/posts/claude-code-subagents-background-agents), the advisor never takes over the primary task — it only weighs in. Turn on `inference_geo` only for a genuine compliance requirement; otherwise trust the workspace default. Loading skills from GitHub is close to a free win, with one caveat: audit who can write to `.claude/skills` in your mounted repo, since the platform loads whatever's there with zero review step.

Read alongside [Anthropic's inference hooks, shipped the same week](/en/posts/claude-inference-hooks-explained), these four changes point in a clear direction: enterprise buyers aren't asking "does the demo work," they're asking "can I govern this in production." If you're deciding which model to wire into a deployment, our [model comparison guide](/en/posts/which-claude-model-2026) is worth a look, and if you're extending an agent's tool surface, so is [building your first MCP connector](/en/posts/build-your-first-mcp-connector). Platform controls like budgets and advisors are the infrastructure-level counterpart to the layered defense in our [LLM guardrails checklist](/en/posts/llm-guardrails-production-checklist) — they complement application-level guardrails, not replace them. For more on what's shipping across the Claude ecosystem, see our [AI category](/en/category/ai).

## Frequently Asked Questions

### Is Managed Agents the same thing as Claude Code?

No. Managed Agents is the hosted API for building and running autonomous agents inside Anthropic-hosted sandboxes — it works in terms of agents and sessions. Claude Code is a separate CLI product that runs on a developer's own machine with direct filesystem access. The four features in this article apply only to Managed Agents.

### Exactly when does a session budget kick in?

The platform checks, before every model request, whether the consumed list cost has already reached the cap. A request that's already in flight when the cap is crossed is allowed to complete, so the final spend can exceed the cap by at most one request per running thread. The session doesn't terminate at that point — it pauses with `stop_reason: "budget_reached"`; raising or removing the budget resumes the work automatically.

### Can an advisor model be weaker than the main agent?

No. The advisor must be at least as capable as the executor's own model, and this is validated when the agent is saved. An invalid pairing is rejected with a 400 error.

### Does `inference_geo` work on every model?

Setting `inference_geo` on a model that doesn't support geographic inference pinning returns an error. Every agent in a multiagent roster must also share the same pin value — a roster with mismatched pins fails validation.
