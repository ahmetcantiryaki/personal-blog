---
title: "Using Plugins in ChatGPT Voice Mode"
slug: "chatgpt-voice-mode-plugins"
translationKey: "chatgpt-voice-plugins-live-2026"
locale: "en"
excerpt: "As of September 23, 2026, ChatGPT's Live voice mode supports plugins and connected apps on web, iOS and Android, letting you trigger real actions by talking."
category: "technology"
tags: [chatgpt, openai, ai-tools, productivity]
publishedAt: "2026-09-28"
seoTitle: "ChatGPT Voice Mode Plugins: What Shipped, How to Use It"
seoDescription: "ChatGPT Live now runs plugins and connected apps on web, iOS and Android. Here's what shipped Sept 23, 2026, how to set it up, and three hands-free workflows."
---

Short answer: yes, as of September 23, 2026, ChatGPT's Live voice mode can call plugins and connected apps directly during a spoken conversation, on web, iOS and Android — meaning you can check your calendar, search your email, or trigger a connected app's action just by talking, not only by typing.

## Can you actually do work by talking to ChatGPT now?

Before this update, ChatGPT's voice mode was mainly a conversational layer bolted on top of the text model — you could talk to it, but anything requiring a connected app, a plugin, or a specific tool call meant switching back to typing. That gap is what closed on September 23, 2026: Live voice mode now supports plugins on web, iOS, and Android, so a spoken request can trigger the same connected-app actions that used to require a text prompt.

ChatGPT Business went further the same week, adding live voice support for plugins on web and mobile plus a separate "Voice in Work" mode, letting business users work with connected apps, create documents, presentations, and spreadsheets, and pick up an unfinished Work task in text later — by voice, from the start.

## What exactly shipped, and when?

Three related changes landed close together in September 2026. On September 23, Live voice mode gained plugin and connected-app support across web, iOS, and Android for general users, plus Voice in Work for ChatGPT Business. On September 24, OpenAI added admin controls: global admins in ChatGPT Business and Enterprise organizations can now manage, through a redesigned External Access page in the OpenAI Admin Console, whether ChatGPT Sites can use members' connected apps and whether outside applications can access ChatGPT Ads.

| Date (Sept 2026) | What shipped | Who it affects |
|---|---|---|
| Sept 23 | Live voice mode gets plugins + connected apps (web, iOS, Android) | All ChatGPT users with connected apps enabled |
| Sept 23 | Voice in Work for ChatGPT Business | ChatGPT Business subscribers |
| Sept 24 | External Access admin controls for connected apps and Ads | Business/Enterprise org admins |

## How do you turn on connected apps for voice mode?

Connected apps have to be linked in your account settings before voice mode can use them — voice doesn't add new connection capability, it just extends the same connections you already granted for text into the voice interface. If you've already connected apps like Google Calendar, Gmail, or a business tool for text use, they carry over to Live voice mode automatically; if not, you enable them the same way you always did, through the connected apps settings, before starting a voice session.

For ChatGPT Business and Enterprise accounts, the new admin control matters here: if your organization's admin has restricted which connected apps members can use inside ChatGPT Sites, that restriction applies whether the request comes from typed text or from voice — voice isn't a way around an admin-level restriction.

## What can you actually do hands-free right now?

Three workflows show what changed concretely. First, checking your schedule: ask "what's on my calendar this afternoon?" out loud, and if Calendar is connected, Live reads back your actual events instead of giving a generic answer about how to check your calendar yourself. Second, finding information buried in email: "find the invoice from [vendor] last month" now triggers a real search through a connected Gmail account rather than requiring you to switch to typing and searching manually.

Third, triggering an action in a connected app — for ChatGPT Business users specifically, this now extends to drafting a document or spreadsheet by voice and continuing it later in text, which matters for anyone who thinks out loud better than they type a first draft. All three depend on having granted the relevant connection beforehand; voice mode extends existing permissions, it doesn't request new ones through conversation.

## What are the friction points and privacy trade-offs?

The obvious friction is environmental: voice mode with connected apps works well in private, but reading back calendar details, email contents, or financial information out loud in a shared space defeats the purpose of privacy settings you've configured elsewhere. There's also a precision cost — voice requests are inherently less precise than a typed query with exact filters, so a spoken "find that email" sometimes returns more candidates than a typed search with specific keywords would.

The bigger structural point is that connecting an app to ChatGPT at all — for either text or voice — means granting it read (and sometimes write) access to that account, and voice mode doesn't change that risk calculus, it just makes triggering actions on an already-connected account faster and more casual, which is exactly why the new admin controls for Business and Enterprise accounts arrived the very next day. An organization that's fine with employees reading their own calendar by voice may still want tighter limits on what a connected app can post to a shared workspace, which is precisely what the External Access page is for.

## Is this different for ChatGPT Business users?

Yes, in scope rather than mechanism. Regular users get plugins and connected apps in Live voice mode; ChatGPT Business users additionally get Voice in Work, which extends voice into the Work agent mode used for longer, multi-step projects — meaning you can start a Work task by talking through what you need, then switch to text later to review and refine it, rather than voice being limited to quick single-turn requests. We cover ChatGPT Work's broader capabilities, text and voice both, in [our guide to ChatGPT Work](/en/posts/chatgpt-work-openai-agent-explained), and if you're deciding between OpenAI's, Anthropic's and Google's agentic workspace products more generally, [our comparison of ChatGPT Work, Cowork and Gemini](/en/posts/chatgpt-work-vs-cowork-vs-gemini) covers where each one currently stands.

If you're building a broader voice-first routine rather than just using ChatGPT's connected apps, it's worth comparing how different assistants handle spoken interaction — see [our AI voice assistants comparison](/en/posts/ai-voice-assistants-compared-gpt-live-gemini-claude) for how ChatGPT Live stacks up against Gemini Live and Claude's voice features specifically.

## Frequently Asked Questions

### Does ChatGPT voice mode support plugins on all platforms?

Yes, as of September 23, 2026, Live voice mode supports plugins and connected apps on web, iOS, and Android — it's not limited to one platform, though the specific connected apps available depend on what you've linked in your account settings.

### Do I need ChatGPT Plus or Business for voice plugins?

Plugin and connected-app support in Live voice mode rolled out to general ChatGPT users, not just paid business tiers. ChatGPT Business adds an additional capability on top — Voice in Work — for the agent mode used on longer, multi-step tasks, which is specific to Business subscribers.

### Can ChatGPT's voice mode see my calendar and email by default?

No. Voice mode only accesses apps you've explicitly connected in your account settings, the same permission model as text-based connected apps. Voice doesn't request new access on its own — it uses whatever connections already exist on your account.

### What happens if I start a task by voice and want to finish it later in text?

For ChatGPT Business users, Voice in Work is built for exactly this: you can start a Work task by talking through it and continue or finish it in text later, picking up from where the voice session left off rather than starting over.

**Sources:** [OpenAI — ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes), [Releasebot — OpenAI ChatGPT updates, September 2026](https://releasebot.io/updates/openai/chatgpt).
