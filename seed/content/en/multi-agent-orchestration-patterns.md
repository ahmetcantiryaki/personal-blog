---
title: "Multi-Agent Orchestration Patterns Explained"
slug: "multi-agent-orchestration-patterns"
translationKey: "multi-agent-orchestration-patterns"
locale: "en"
excerpt: "When does a second AI agent actually help? A breakdown of supervisor, hand-off, and parallel fan-out patterns, their failure modes, and their real token cost."
category: "ai"
tags: ["ai-agents", "workflow", "best-practices", "automation"]
publishedAt: "2026-07-08"
seoTitle: "Multi-Agent Orchestration Patterns Explained"
seoDescription: "When does a second AI agent actually help? Supervisor, hand-off, and parallel fan-out patterns compared, with their failure modes and real token cost."
---

A second agent earns its keep only when a task splits into genuinely independent subtasks, needs a distinct persona or tool scope per step, or a single context window would otherwise overflow. Everything else is one agent with better tools; multi-agent orchestration should be the exception, not the default.

## When Does Adding a Second Agent Actually Help?

The honest answer is: less often than the marketing suggests. Anthropic's engineering team, describing the multi-agent research system behind Claude, found that a lead-and-subagents setup used roughly 15 times more tokens than a single chat interaction, and that token usage alone explained about 80% of the variance in output quality on their internal evaluation. The upside was real — the multi-agent version beat a single Claude Opus 4 agent by more than 90% on breadth-heavy research tasks — but the team also noted that this style of orchestration struggles with tightly interdependent work like coding, where subagents keep stepping on each other's state ([Anthropic Engineering, "How we built our multi-agent research system"](https://www.anthropic.com/engineering/multi-agent-research-system)). That single data point captures the whole design question: orchestration wins when work decomposes into parallel, low-interdependency chunks, and loses when the task is one continuous train of thought a second agent can only interrupt.

If you have not settled the more basic question — an agent loop versus a fixed workflow — start with [AI agents versus workflows](/en/posts/ai-agents-vs-workflows); orchestration patterns only matter once you are past that fork.

## What Is the Supervisor/Router Pattern, and When Does It Pay Off?

A supervisor (or router) is a single agent that reads the incoming request, decides which specialist agent or tool should handle it, dispatches the work, and reconciles the result before replying. It is the pattern most teams reach for first because it maps cleanly onto how a human team lead delegates: one point of contact, a few narrow specialists behind it.

It pays off when specialists genuinely differ — a billing agent with database write access, a docs agent with read-only search, a code agent with a sandboxed shell — and routing is cheap relative to the work dispatched. It stops paying off when the supervisor becomes the bottleneck: every hand-off round-trips through it, so its context window accumulates every sub-conversation's state. Claude Code's subagent model keeps this pattern lightweight: subagents run in their own context and report back a summary, not a full transcript, which is exactly what keeps a supervisor from becoming that bottleneck ([Claude Code subagents and background agents](/en/posts/claude-code-subagents-background-agents)).

## When Is Sequential Hand-off Better Than a Supervisor?

Sequential hand-off is a pipeline: agent A finishes its stage and passes a structured artifact to agent B, who passes it to agent C, with no agent holding the full picture at once — a research agent feeding an outline agent feeding a drafting agent feeding a fact-checking agent.

This pattern beats a supervisor when stages are naturally ordered and each needs a different tool scope or persona but not the others' raw reasoning — only their output. It also caps context growth better, since each agent holds only its own stage plus the artifact it received, not the whole run's history. The trade-off is latency: a five-stage pipeline means five sequential round-trips, and an error in stage two silently propagates into three through five unless you validate between hops.

## When Should You Fan Out in Parallel — and Who Reduces the Results?

Parallel fan-out sends related sub-questions to several agents at once, then a reducer step merges their outputs into one answer. This is the pattern behind Anthropic's research system: a lead agent decomposes a query into independent research directions, spins up subagents to chase each one concurrently, and synthesizes the returned findings.

It pays off precisely when subtasks are independent enough to run without talking to each other — competitive analysis across five companies, testing five prompt variants, scanning a codebase for five different issue classes. It fails when subtasks depend on each other's findings, because parallel agents cannot see what their siblings are doing mid-flight, so you get duplicated searches, contradictory conclusions, or five agents pulling the same low-effort source. A reducer is not optional here; without a deliberate merge step that resolves conflicts and drops redundant findings, fan-out just produces more noise for a human to sift through by hand.

```text
// Sketch of a supervisor/router dispatch loop with a fan-out + reduce step
function handleRequest(request):
    plan = supervisor.decompose(request)       // one LLM call, cheap
    if plan.independent_subtasks:
        results = parallel_map(plan.subtasks, agent.run)   // fan-out
        answer  = reducer.merge(results)                   // reduce
    else:
        answer = pipeline.run_sequential(plan.subtasks)    // hand-off
    return supervisor.finalize(answer, request)
```

## Which Pattern Fits Which Job?

| Pattern | Best for | Common failure mode | Relative token cost |
|---|---|---|---|
| Supervisor/router | Distinct specialist tools, low-latency routing | Supervisor context bloat as hand-offs accumulate | ~2–4x a single agent |
| Sequential hand-off | Ordered stages, each needing a different persona | Errors compound silently across stages | ~1.5–3x a single agent |
| Parallel fan-out + reducer | Independent, decomposable research or analysis | Duplicated work, contradictory outputs without a real reducer | ~10–15x a single agent |
| Shared-context layer | Long-running teams of agents needing common state | Stale or bloated shared memory, race conditions on writes | Variable — proportional to state size, not agent count |

## Do You Need a Shared-Context Layer?

A shared-context layer is a persistent store — a scratchpad, a memory service, a vector store — that every agent reads from and writes to instead of passing full transcripts to each other. It is less a fourth pattern than infrastructure under the other three, and it becomes necessary once agents outlive a single request or must avoid rediscovering the same facts repeatedly.

The design mistake we see most often is agents writing their entire reasoning trace into the shared store instead of a compact summary. That reproduces the context-blow-up problem the shared layer was meant to solve, just one level removed. Our [context engineering field guide](/en/posts/context-engineering-for-ai-agents) covers keeping what goes into a shared context small and high-signal, and our piece on [AI agent memory](/en/posts/ai-agent-memory-systems) covers the short-term-versus-long-term split that decides what belongs in that layer at all.

## What Actually Breaks in Multi-Agent Systems?

Three failure modes account for most multi-agent incidents, and they compound:

- **Context blow-up.** Every hand-off that includes a full transcript instead of a summary makes the next agent's context window bigger. In a supervisor pattern this hits the supervisor hardest; in a shared-context layer, it hits everyone reading from the store.
- **Duplicated work.** Parallel agents with overlapping scopes redo the same search, call the same API, or reach the same conclusion independently, burning tokens without adding information — the most common symptom of skipping the reducer step.
- **Runaway cost.** Agents that spawn further subagents, or retry failed sub-tasks without a cap, turn a bounded workflow into an unbounded one. This is less a flaw in any one pattern and more a missing guardrail — the same category covered in our [LLM guardrails checklist](/en/posts/llm-guardrails-production-checklist), which applies as much to what an agent may spawn as to what it may write.

Before reaching for orchestration, it is worth comparing against a single, well-scoped agent acting directly in a tool — a browser session, a shell, an API client — with no coordination layer at all.

## So, Is Multi-Agent Orchestration Worth the Cost?

As of July 2026: worth it for decomposable, high-value research and analysis work; rarely worth it for anything a single well-tooled agent can do in one continuous context. The cost is not hypothetical. If a single-agent chat interaction costs $0.02 in tokens, a fan-out pattern at roughly 15x that overhead costs closer to $0.30 for the same request — and that multiplies again if the supervisor retries a failed subagent or a shared-context store keeps growing unchecked. Before adding a second agent, price the token multiplier against the task's value, not just against getting an answer faster. Our guide on [cutting LLM token costs](/en/posts/cut-llm-token-costs) has concrete tactics for keeping that multiplier down once a pattern proves worth it. The tooling landscape reflects this trade-off: mid-2026 counts well over 120 production-ready agent tools across a dozen-plus categories, and orchestration frameworks — LangGraph, CrewAI, AutoGen/AG2, Google's ADK — are among the fastest-growing long-tail segments, precisely because more teams hit this coordination problem ([AI Agents Landscape & Ecosystem, July 2026](https://aiagentsdirectory.com/landscape)).

## Frequently Asked Questions

### Is a multi-agent system always more accurate than a single agent?

No. Anthropic's own benchmark showed a real accuracy gain on breadth-heavy research tasks, but the same team notes that tightly coupled tasks like coding tend to get worse with multiple agents, not better, since subagents cannot see each other's in-progress state and end up conflicting.

### How do I pick between hand-off and parallel fan-out?

Ask whether subtasks depend on each other's output. If stage two needs stage one's result, use sequential hand-off. If subtasks can run in any order without needing each other's intermediate state, fan out and add a reducer.

### Do I need a supervisor if I'm already using hand-off or fan-out?

Often yes, in a thin form — something has to decide which pattern applies and finalize the response. Keep that supervisor's job narrow (route, don't re-derive) so it does not become the context bottleneck the pattern was meant to avoid.

### What's the single biggest cost lever in multi-agent orchestration?

Passing full transcripts between agents instead of compact summaries. That habit, more than agent count, drives the 10–15x token multipliers seen in production fan-out systems.
