---
title: "Multi-Agent Handoffs With the Claude Agent SDK"
slug: "multi-agent-handoffs-with-claude-agent-sdk"
translationKey: "multi-agent-handoffs-claude-agent-sdk"
locale: "en"
excerpt: "Each Claude Agent SDK subagent runs in a fresh, isolated conversation and returns only its final message. Pass a task spec, not a transcript dump."
category: "ai"
tags: ["ai-agents", "claude", "mcp", "workflow"]
publishedAt: "2026-10-25"
seoTitle: "Multi-Agent Handoffs With the Claude Agent SDK"
seoDescription: "A Claude Agent SDK subagent returns only its final message, not its reasoning trace. Here's what to pass at handoff so your pipeline doesn't lose context."
---

Short answer: pass a subagent a self-contained task spec — the goal, ruled-out paths, and pointers to files instead of raw dumps — because it starts with zero memory of the parent conversation, and the parent only sees its final message, not its reasoning trail. Get this wrong and you either flood the subagent with noise or starve it of what it needed.

## What is the handoff problem in multi-agent systems?

Short answer: it's the information loss that happens whenever control passes from one agent to another — the receiving agent either gets too little context to do its job, or the sender dumps so much raw history that the receiver can't find the signal in it. Both failure modes produce the same symptom: an agent that repeats work already done, or contradicts a decision already made upstream.

The subtler version of this is confirmation bias across a chain of agents. If agent A concludes "the bug is in the cache layer" and hands that framing to agent B, agent B tends to go looking for evidence that confirms it rather than independently verifying the claim — especially if the handoff passes A's conclusion without A's reasoning or the alternatives A ruled out.

## How does context isolation actually work in the Claude Agent SDK?

Short answer: every subagent launched by the Claude Agent SDK starts a completely fresh conversation. It does not inherit the parent's message history, its intermediate tool calls stay invisible to the parent, and only its final returned message crosses back across the boundary. This is a deliberate design, not a limitation to work around.

What a subagent does inherit: its own system prompt (set on its `AgentDefinition`), the task message the orchestrator sends it, the project's CLAUDE.md files, and whichever tools and skills are explicitly listed on its definition. It does not see the orchestrator's system prompt, the orchestrator's raw tool-call transcript, or skills that weren't explicitly granted to it.

```typescript
import { query, type AgentDefinition } from "@anthropic-ai/claude-agent-sdk";

const researchAgent: AgentDefinition = {
  description: "Investigates a narrow technical question and returns a verdict",
  prompt: "You are a focused research agent. Verify claims against primary sources only.",
  tools: ["WebSearch", "WebFetch"],
};

for await (const message of query({
  prompt: "Research whether library X has a known CVE in version 4.x",
  options: { agents: { researcher: researchAgent } },
})) {
  // only the researcher's final message appears here — not its search steps
}
```

## What should you actually pass at a handoff?

Short answer: pass a task spec, not a transcript — the concrete goal, the constraints, any paths already ruled out and why, and pointers to files or line numbers rather than pasted file contents. A pointer costs a few tokens; a raw dump costs thousands and still might miss the one line that mattered.

| Pass this | Not this | Why |
| --- | --- | --- |
| "Fix the race condition in `queue.ts:142`, confirmed by this stack trace" | The full chat log that led to that diagnosis | The conclusion plus its evidence is reproducible; the chat log is not |
| "Options A and B were ruled out because of X" | Silence on what was already tried | Without this, the subagent re-explores dead ends |
| A file path and line range | The full file pasted inline | Pointers are cheap; dumps burn context budget fast |
| A structured output schema the subagent must return | "Just tell me what you find" | Free-text returns are harder for the orchestrator to parse reliably |

## What are the common multi-agent handoff patterns?

Short answer: three patterns cover most real systems — orchestrator-worker, where one coordinator dispatches independent subtasks and merges the results; sequential pipeline, where each agent's output becomes the next agent's input in a fixed order; and shared scratchpad, where agents read and write to a common store instead of passing messages directly to each other.

Orchestrator-worker fits parallelizable research or data-gathering tasks, since isolated subagents can run concurrently without stepping on each other's context. Sequential pipelines fit tasks with a natural order — plan, then implement, then review — where each stage genuinely depends on the last one's finished output. A shared scratchpad fits long-running work where multiple agents need visibility into evolving state (a shared task list, a running set of findings) without every agent needing a direct handoff from every other one.

## How do you budget context across a chain of agents?

Short answer: treat each subagent's context window as a fixed budget you spend deliberately, and summarize at the boundary rather than forwarding raw history forward. Every handoff is a chance to compress — keep the conclusion and the evidence that supports it, drop the exploration that didn't pan out.

A pipeline that chains five agents, each forwarding the full prior transcript, hits context limits or degraded attention long before the task is done. A pipeline that forwards a compressed summary at each boundary can run far longer, because each agent only pays for the information it actually needs to act.

## What happens when a handoff fails, and how do you recover?

Short answer: the most common failure is a subagent returning a result the orchestrator can't parse or act on, usually because the task spec didn't specify an output format. The fix is to require structured output — a fixed schema the subagent must return — and to retry with a clarified task spec rather than silently accepting a malformed response.

Build the retry path explicitly: if a subagent's output fails schema validation, re-dispatch it with the validation error appended to the task spec, not a vague "try again." Two or three retries with increasingly specific error feedback resolves most failures; beyond that, surface the failure to a human rather than looping indefinitely.

For the protocol layer underneath a lot of this — how an agent actually calls external tools — see our guide on [building your first MCP connector](/en/posts/build-your-first-mcp-connector). If you're deciding whether a task needs this kind of multi-agent orchestration at all, read [AI agents vs. workflows](/en/posts/ai-agents-vs-workflows) first; plenty of tasks that look agentic are better served by a fixed pipeline. For a worked end-to-end example, see [building a commerce agent with Claude](/en/posts/build-a-commerce-agent-with-claude).

My take: most teams reach for multi-agent architectures before they've exhausted what a single well-scoped agent with good tools can do, and the handoff overhead above is exactly the tax you pay for splitting work that didn't need splitting. Reach for subagents when a task genuinely needs isolated context or real parallelism — not as a default architecture.

## Frequently Asked Questions

### Does a Claude Agent SDK subagent see the parent conversation's history?

No. Each subagent starts a completely fresh conversation with no access to the parent's message history or intermediate tool calls. It only receives its own system prompt, the task message sent to it, and the project's CLAUDE.md files.

### What does a subagent return to the orchestrator in the Claude Agent SDK?

Only its final message. Every intermediate tool call and reasoning step the subagent takes stays inside its own isolated context and never crosses back to the orchestrator — which is why requiring structured output from subagents makes results easier to parse reliably.

### What is the difference between orchestrator-worker and sequential pipeline patterns?

Orchestrator-worker dispatches independent subtasks to multiple subagents that can run in parallel, then merges their results. A sequential pipeline runs agents in a fixed order where each one's output becomes the next one's input, which fits tasks with a genuine dependency chain, like plan-then-implement-then-review.

### Why does passing full conversation history between agents cause problems?

It burns context budget fast and buries the signal the receiving agent actually needs inside irrelevant exploration history. A compressed task spec — the goal, ruled-out paths, and pointers to files instead of raw dumps — lets each agent in a chain run longer before hitting context limits.

Sources:
- [Claude Agent SDK: Subagents (platform.claude.com)](https://platform.claude.com/docs/en/agent-sdk/subagents)
- [Anthropic's multi-agent research system (anthropic.com/engineering)](https://www.anthropic.com/engineering/multi-agent-research-system)
