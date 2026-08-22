---
title: "What Is Claude's New Browser Use Tool?"
slug: "what-is-claude-browser-use-tool"
translationKey: "claude-browser-use-tool-ga"
locale: "en"
excerpt: "Claude's browser use tool went GA on August 19, 2026: it drives a browser your app hosts by reading the page's structure, not just screenshots."
category: "ai"
tags: ["claude", "ai-agents", "automation"]
publishedAt: "2026-08-22"
seoTitle: "Claude Browser Use Tool: GA Explained (Aug 2026)"
seoDescription: "Anthropic's browser use tool reached GA on August 19, 2026. Here's what browser_toolset_20260801 does, how it differs from computer use, and how to call it."
---

Claude's browser use tool is an API toolset, `browser_toolset_20260801`, that lets Claude navigate and act inside a browser your own application runs, by reading the page's structure — its accessibility tree, form fields, and tabs — instead of only looking at screenshots. Anthropic took it out of beta on August 19, 2026, alongside the computer use tool and the Agent Skills API.

## What Does the Browser Use Tool Actually Do?

It gives Claude a set of member tools — `navigate`, `read_page`, `left_click`, `type`, `screenshot`, `scroll`, `find`, and more — that run against a browser your application controls, not a browser hosted on Anthropic's infrastructure. Twenty-seven member tools are enabled by default; four more (`javascript_exec`, `file_upload`, `read_console`, `read_network`) are opt-in. Claude also gets tagged element references (like `[ref_2]`) it can act on directly, built-in multi-tab management (`new_tab`, `switch_tab`, `close_tab`), and a `form_input` action that sets form values without simulated typing.

The tool runs as a loop: Claude returns a member tool call, your code executes it against the real browser, and you send the result back until Claude replies in plain text. No page content or network traffic passes through Anthropic's servers — your infrastructure hosts the browser and controls what it can reach.

## How Is Browser Use Different From Computer Use?

Computer use controls an entire desktop through screenshots and pixel coordinates; browser use is scoped to one browser viewport and reads the page's own structure. That single difference changes what "acting" means for the model.

| | Browser use | Computer use |
| --- | --- | --- |
| Toolset version | `browser_toolset_20260801` | `computer_toolset_20260801` |
| Scope | One browser viewport | Entire desktop/OS |
| Sees | Accessibility tree + DOM elements + screenshots | Screenshots only |
| Acts via | Element references, `form_input`, coordinates | Coordinates only |
| Tabs | Built-in (`new_tab`, `switch_tab`, `close_tab`) | Not applicable |
| Hosting | Your application's browser | Your application's desktop |

Reading the DOM instead of guessing from pixels means fewer misclicks on dynamic layouts and no need to zoom in to read small text — a form field is addressed by its reference, not by a screen coordinate that shifts if the window resizes.

## Which Claude Models Support It?

`browser_toolset_20260801` and `computer_toolset_20260801` are both available, as of August 19, 2026, on Claude Fable 5, Claude Mythos 5, Claude Opus 5, Claude Sonnet 5, and Claude Opus 4.8 through the Claude API. Support is API-only for now — it hasn't shipped on Amazon Bedrock, Google Vertex AI, or Microsoft Foundry yet. If you're deciding which model to route this workload to, our [Claude model guide](/en/posts/which-claude-model-2026) breaks down the current lineup.

## How Do You Call the Browser Use Tool?

You add the toolset to a Messages API request the same way you'd add any other tool, then run the returned tool calls against a browser you control (Playwright and Puppeteer both work — Anthropic's SDK samples use Playwright):

```json
{
  "model": "claude-sonnet-5",
  "max_tokens": 1024,
  "tools": [
    {
      "type": "browser_toolset_20260801",
      "name": "browser"
    }
  ],
  "messages": [
    {
      "role": "user",
      "content": "Go to our staging checkout page and confirm the discount code field accepts BLACKFRIDAY25."
    }
  ]
}
```

Claude responds with member tool calls like `navigate` and `find`; your code executes each one against the live browser session and returns the result (a screenshot, the matched element reference, or a status) in the next request. No beta header is required — earlier beta versions of the toolset keep working if you already integrated them.

## What Else Went GA the Same Day?

August 19, 2026 was a coordinated release for Anthropic's agent stack, not a single-feature launch:

- **Computer use** (`computer_toolset_20260801`) exited beta with batch actions (multiple actions per turn), `zoom` on by default, and per-tool `configs`.
- **Agent Skills and the Skills API** (`/v1/skills`) exited beta — the `skills-2025-10-02` beta header is no longer required. We cover what Skills are for non-developers in [Claude Skills, Explained for Everyone](/en/posts/claude-skills-explained-for-everyone).
- **The Files API** also went GA the same day, which we covered separately in [Claude's Files API GA, Explained](/en/posts/claude-files-api-ga-explained).

Shipping all four the same day signals Anthropic treats "browser + desktop + skills + files" as one coherent agent toolkit, not four unrelated betas graduating on their own schedules.

The same August 19 update also shipped two smaller changes that matter for agents already in production: Claude Managed Agents can now restrict which sites an agent's `web_search` and `web_fetch` tools may reach via `allowed_domains` and `blocked_domains`, and the session viewer in the Claude Console was redesigned with a timeline minimap, a transcript grouped by model request, and an Inspector panel for cost, raw events, and per-tool statistics. Neither is headline-worthy on its own, but both are the kind of practical detail you'll touch daily once an agent is running in production.

## What Does a Playwright or Puppeteer Setup Look Like?

Anthropic's SDK samples use Playwright, but the toolset isn't tied to a specific library — you write an "executor" that translates each member tool call Claude returns (a `navigate`, a `left_click`, a `screenshot`) into a call against your own browser automation layer. In practice, that means if you already have a Playwright test suite or a browser automation script, you can wire Claude into it through a thin translation layer rather than building a browser integration from scratch.

## How Does This Compare to OpenAI's and Google's Approach?

Anthropic's bet is that your application should host the browser Claude drives, keeping page content and network identity inside your own infrastructure. That's a different architecture from a fully-hosted agent browser that runs on the vendor's own servers, which is the model OpenAI and Google have leaned toward with their agentic browsing efforts (see our [comparison of AI browsers](/en/posts/ai-browsers-compared-comet-atlas-gemini) and how [OpenAI's Atlas browser shut down](/en/posts/openai-atlas-shutdown-ai-browsers) in favor of folding agentic browsing back into ChatGPT). Neither approach is strictly better — a client-hosted browser keeps sensitive session cookies and internal URLs off a third party's infrastructure, while a vendor-hosted browser needs zero setup on your end.

## What Does This Mean for Developers?

If you're already running computer use in production, migrating to the new `computer_toolset_20260801` gets you batch actions and default zoom, but changes the request shape — read Anthropic's migration notes before you swap the toolset string. If you're building a new browser-automation agent, `browser_toolset_20260801` is very likely the better starting point over computer use: DOM-aware actions are more reliable than coordinate clicks on any page whose layout isn't pixel-stable, which in practice is nearly every modern web app.

The trade-off worth calling out: because Claude only sees what your executor's browser can see, you're still responsible for authentication, proxying, and rate limits — the tool automates the interaction, not the infrastructure around it.

## Frequently Asked Questions

### What is the browser use tool in the Claude API?

It's `browser_toolset_20260801`, a set of 27 default and 4 opt-in member tools that let Claude navigate, read, and act on a webpage inside a browser your own application hosts, using the page's accessibility tree and DOM elements rather than only screenshots.

### When did Claude's browser use tool go GA?

Anthropic took it out of beta on August 19, 2026, on the same day the computer use tool and the Agent Skills API also exited beta on the Claude API.

### Does browser use replace computer use?

No. Browser use is scoped to a single browser viewport and reads page structure; computer use controls an entire desktop through screenshots and coordinates. Pick browser use for web-only tasks and computer use when the workflow spans desktop apps outside the browser.

### Which models support the browser use tool?

As of August 2026, Claude Fable 5, Claude Mythos 5, Claude Opus 5, Claude Sonnet 5, and Claude Opus 4.8 support it through the Claude API. It is not yet available on Amazon Bedrock, Google Vertex AI, or Microsoft Foundry.
