---
title: "Fix ChatGPT 'Memory Full' and Use Projects Right"
slug: "chatgpt-memory-full-projects-guide"
translationKey: "chatgpt-memory-cleanup-projects"
locale: "en"
excerpt: "Short answer: ChatGPT's persistent memory holds roughly 900-1,500 words. When you hit the cap, delete stale entries and move durable context into a Project."
category: "career-productivity"
tags: ["chatgpt", "productivity", "ai-tools", "time-management"]
publishedAt: "2026-08-30"
seoTitle: "How to Fix ChatGPT's 'Memory Full' Problem"
seoDescription: "Short answer: ChatGPT's persistent memory holds roughly 900-1,500 words. When you hit the cap, delete stale entries and move durable context into a Project."
---

Short answer: ChatGPT's persistent memory holds roughly 1,200-2,000 tokens — about 900-1,500 words — usually showing up as 8-12 entries under Settings → Personalization → Memory. When you hit the "memory full" wall, delete stale entries that no longer apply, and move anything that needs to stay permanent into a Project's instructions instead of global memory.

## Why does ChatGPT say memory is full?

ChatGPT's memory system is a completely different thing from the in-conversation context window. The context window is the temporary working space inside a single conversation, typically ranging from 8,000 to 200,000 tokens — roughly 6,000 to 150,000 words. Persistent memory is a much smaller store carried across conversations, and once it's full, ChatGPT asks you to remove an old entry to make room for a new one.

That cap fills up fastest for people who've used ChatGPT daily for months and want it to keep remembering personal preferences, project details, and work context continuously. The problem isn't misuse — memory was designed as a small store from the start.

## How do you clear out memory?

Go to Settings → Personalization → Memory → Manage memories to see every saved entry as a list. The cleanup loop is straightforward: list everything, summarize still-relevant entries into a single combined entry, delete anything no longer accurate, and re-save the summarized version if needed. Doing this once a month keeps memory from staying permanently full.

As of June 2026, Plus and Pro accounts default to a "dreaming" system that automatically synthesizes memory from past chats, and paid capacity doubled at the same time. That reduces manual cleanup but doesn't eliminate it — even with automatic synthesis, you still need to manually remove information that's become outdated.

## Does labeling memory entries actually help?

Yes. Sorting memory entries into categories like "About Me" and "Work" clarifies which context applies where. Keeping personal preferences (writing tone, language) under "About Me" and active project details under "Work" prevents the two from bleeding into each other and surfacing in the wrong context.

If you're running reproducible prompt tests — comparing the same prompt's output across different sessions — turning memory off temporarily makes sense, because with memory on, the same prompt's answer can shift based on context leaking in from past conversations. That makes A/B-style comparisons unreliable.

## What's the difference between global memory and Projects?

Global memory is a size-limited store that runs quietly in the background across every conversation. A Project is a separate workspace scoped to a specific piece of work, with its own instructions and files — and a Project's instruction field holds far more text than global memory, plus it supports attached files.

The practical rule: if a piece of information only applies to one specific piece of work ("use format X for this client"), put it in that Project's instructions, not global memory. Reserve global memory for things that genuinely apply to every conversation — your preferred language, your general writing tone. That split slows down how fast memory fills up and stops context from leaking into the wrong project.

| Feature | Global Memory | Custom Instructions | Project Instructions |
|---|---|---|---|
| Capacity | ~900-1,500 words (August 2026) | 1,500-character limit | Much larger, supports file attachments |
| Scope | Every conversation | Every conversation | Only conversations inside that Project |
| How it updates | Automatic ("dreaming") or manual | Fully manual, you control every word | Manual, edited per project |
| Best use | Durable, universal personal preferences | Fixed, predictable behavior rules | Project-specific context and files |

## What does moving an entry from memory to a Project look like?

Take a concrete example: if your memory holds an entry like "Always write reports for Client X in bullet points and in English," that instruction is really only relevant to conversations about that one client — but since it sits in global memory, ChatGPT might recall it during a conversation about Client Y and produce a wrongly formatted answer. The fix is to delete that line from memory and move it into the instructions for the Project you've set up for Client X.

That move takes three steps: find and copy the relevant entry from Settings → Personalization → Memory, open that client's Project and paste it into the instructions field, then delete the original entry from global memory. Once that's done, the same instruction only applies inside conversations within that Project — it stops leaking anywhere else.

## When are custom instructions better than memory?

Custom instructions are capped at 1,500 characters but fully under your control — there's no automatic synthesis, nothing gets added or removed on its own. When you need behavior to stay predictable and fixed ("always answer in bullet points"), custom instructions are more reliable than memory entries, which can shift over time.

Memory exists more for "ChatGPT getting to know you"; custom instructions exist for "the same rule applying in every conversation." Mixing the two up makes it hard to track which setting is triggering which behavior.

## How do you turn memory management into a habit?

Set a monthly maintenance rhythm: at the start of each month, open Settings → Personalization → Memory, review the list, delete anything no longer accurate, and merge duplicate or overlapping entries into one sentence. You can even pair this with the logic in our guide to [ChatGPT's scheduled tasks that replaced Pulse](/en/posts/chatgpt-pulse-daily-briefing) and set up a scheduled task that reminds you to do this on the first of every month.

If you want the full picture of which ChatGPT plan and features you're working with, see our [ChatGPT Complete Guide 2026](/en/posts/chatgpt-complete-guide-2026). For a related workflow-management angle around spreadsheet-heavy work, our comparison of [ChatGPT vs Gemini for Spreadsheets](/en/posts/chatgpt-vs-gemini-spreadsheets) covers similar ground.

## Frequently Asked Questions

### How many words can ChatGPT's memory actually hold?

As of August 2026, ChatGPT's persistent memory holds roughly 1,200-2,000 tokens, or about 900-1,500 words, usually showing up as 8-12 entries. That's far smaller than the in-conversation context window (8,000-200,000 tokens), because memory is a permanent store carried across conversations rather than a single conversation's working space.

### Will clearing memory make me lose data?

Only the specific entry you delete disappears — your conversation history itself is unaffected. Summarizing an important entry into a single combined note before deleting the originals, or moving durable context into a Project's instructions, is the safest way to free up memory without losing information.

### Should I use custom instructions or memory?

If you need behavior to stay identical and predictable across every conversation, custom instructions are more reliable since they're fully under your control and capped at a clear 1,500 characters. Memory is better suited to letting ChatGPT get to know you over time and carry context from past conversations, though automatic synthesis makes it somewhat less predictable.

### What kind of information belongs in Project instructions?

Put only context specific to that one piece of work into Project instructions: client name, formatting preferences, terminology specific to that job, and relevant files. Keeping information that should apply everywhere — your preferred language, your general tone — in global memory or custom instructions instead prevents context from bleeding between projects.
