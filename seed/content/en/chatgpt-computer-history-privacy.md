---
title: "ChatGPT Computer History: How to Use It Safely"
slug: "chatgpt-computer-history-privacy"
translationKey: "chatgpt-computer-history-privacy"
locale: "en"
excerpt: "Computer History is ChatGPT's opt-in Mac feature that builds context from approved app and web activity. How to enable it, what it records, when to skip it."
category: "ai"
tags: ["chatgpt", "openai", "ai-tools"]
publishedAt: "2026-08-17"
seoTitle: "ChatGPT Computer History: How to Use It Safely"
seoDescription: "Computer History is ChatGPT's opt-in Mac feature that builds context from approved app and web activity. How to enable it, what it records, when to skip it."
---

Short answer: Computer History, shipped by OpenAI on August 13, 2026, is an opt-in feature that lets the ChatGPT desktop app on macOS build a searchable timeline from the app and website activity you approve. Turn it on, and ChatGPT and Codex remember what you've been working on without you re-explaining it.

It replaces the earlier Chronicle system, but it isn't the same thing: instead of continuous screen capture, it records interaction events — clicks, typing, keyboard shortcuts, and app switches — exposed through macOS's accessibility APIs.

## What is Computer History exactly?

Short answer: a system that collects activity from sources you've approved on your Mac and turns it into a timeline and memory record that ChatGPT and Codex can pull as context. It doesn't record screenshots, screen recordings, microphone input, or system audio; private browsing activity is also excluded. Per [OpenAI's ChatGPT Learn documentation](https://learn.chatgpt.com/docs/customization/computer-history), the feature requires Memories to be on, since it uses the context it gathers through the memory system across chats and tasks.

The difference from the old Chronicle system matters: Chronicle relied on visual capture, while Computer History is a rebuilt system based on interaction events. That reduces both storage size and the "is ChatGPT keeping screenshots of my screen" worry in practice — but it doesn't eliminate it entirely, which we cover below.

## How do you turn it on and scope it?

Short answer: you enable the feature from Settings on a per-app/per-website basis, approving each source individually. It ships off by default — nothing gets recorded until a user turns it on.

Scoping works in practice like this: you might approve a code editor and your browser, but never add your banking app or password manager to the list. Any app you don't approve stays completely outside ChatGPT's view.

## What real workflows does this enable?

Short answer: the biggest win is continuing work without re-explaining prior context. A few concrete examples:

- You leave a Codex task half-finished in the morning and pick it back up in the afternoon without asking "where did we leave off" — Computer History already knows.
- You research something in a browser tab, then return to ChatGPT and say "based on the article I just read," with no copy-paste required.
- On a task that spans multiple apps — say, moving from a design tool to a code editor — ChatGPT doesn't need you to re-describe each step.

This fits the broader direction of [agentic features like ChatGPT Work that run multi-step tasks on their own](/en/posts/chatgpt-work-openai-agent-explained): gathering context from outside the chat window and feeding it back in, cutting down on how often you repeat yourself.

## What privacy controls does it offer?

| Control | What it does |
|---|---|
| Per-source approval | Only apps/websites you explicitly add are tracked |
| Timeline review | View recorded entries from Settings |
| Reveal in Finder | Inspect individual memory files in Finder |
| Selective deletion | Delete specific entries one at a time |
| Time-range clearing | Clear the last 10 minutes, hour, day, or all time |

The most important caveat here concerns local encryption: according to [Notebookcheck's reporting](https://www.notebookcheck.net/ChatGPT-logs-your-Mac-activity-and-the-files-are-not-encrypted.1369344.0.html), OpenAI has disclosed that the locally stored memory files are not encrypted. That means other programs running under the same macOS account could, in theory, access those files — full-disk encryption (FileVault) being on doesn't guarantee isolation within the account.

## When should you NOT use it with sensitive data?

Here's my honest take: Computer History is a genuinely useful feature, but "turn everything on and forget about it" is the wrong default here. Given the unencrypted local storage, it's reasonable to keep the following out of your tracked list entirely:

- Password managers and authentication apps
- Banking and payment apps
- Portals containing health records
- Internal company tools handling customer PII

If you're on a company account, don't enable Computer History before checking with your IT team whether your organization's data-handling policy covers it — the same "what am I actually allowed to share" logic we covered when comparing [custom instructions across ChatGPT, Claude, and Gemini](/en/posts/custom-instructions-chatgpt-claude-gemini) applies here too.

## Extra care on shared and managed accounts

Short answer: on a shared or managed account, confirm who administers the account and who can see the recorded history before turning Computer History on. On a family plan with parental controls enabled, turning on Computer History for a child's account can make that account's activity history visible to the parent — a feature some families want and others don't, but one you should know about by default rather than discover later.

The picture is more complicated on a company (Business/Enterprise) account: OpenAI's documentation doesn't spell out exactly how much workspace-admin visibility exists into a given user's Computer History data. If you're a developer on a company device and considering pointing Computer History at your code editor, confirming your company's AI-tools policy covers it upfront is cheaper than dealing with a compliance question after the fact.

A concrete example: picture a developer at a software company who also has access to an internal dashboard containing customer support tickets. If they point Computer History at both their code editor and that dashboard, customer names and emails visible on the dashboard could end up recorded in the timeline too. If the company's data-processing agreement doesn't cover that kind of capture, a feature turned on with good intentions can turn into an unintended contract violation.

## A pre-enable privacy checklist

1. Decide in advance exactly which apps and websites you want to add — nothing is selected by default.
2. Never add tools that handle sensitive data (password managers, banking, health) to the tracked list.
3. Remember Memories must be on; don't think of Computer History as independent of it.
4. On a company device, check your IT/security policy first.
5. Periodically review the timeline in Settings and delete entries you no longer need.

## Frequently Asked Questions

### What is ChatGPT Computer History?

Computer History is a feature, shipped August 13, 2026, that lets the ChatGPT desktop app on macOS build a searchable timeline and memory record from app and website activity you approve. It doesn't take screenshots — it records macOS accessibility events like clicks, typing, and app switches.

### Is Computer History on by default?

No, it ships off by default. Each user has to turn it on themselves and individually approve which apps and websites get tracked.

### Does Computer History take screenshots?

No. According to OpenAI, the feature doesn't record screenshots, screen recordings, microphone input, or system audio; private browsing activity is also excluded. It only records interaction events — clicks, typing, keyboard shortcuts, and app switches.

### Is Computer History data stored encrypted?

No — OpenAI has disclosed that the locally stored memory files aren't encrypted. That means other programs running under the same macOS account could, in theory, access those files, which is why it's recommended you never add apps that handle sensitive data to the tracked list.
