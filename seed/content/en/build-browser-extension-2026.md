---
title: "How to Build a Browser Extension in 2026"
slug: "build-browser-extension-2026"
translationKey: "build-browser-extension-2026"
locale: "en"
excerpt: "In 2026 you build with Manifest V3, a service worker background, and the WebExtensions API, then submit separately to Chrome, Firefox, and Edge stores."
category: "web-development"
tags: ["frontend", "web-standards", "best-practices", "automation"]
publishedAt: "2026-08-18"
seoTitle: "How to Build a Browser Extension in 2026"
seoDescription: "A practical guide to building a cross-browser extension in 2026: Manifest V3, service workers, side panel, storage, messaging, and store review."
---

Short answer: in 2026 you build an extension on `manifest_version: 3`, run a service worker instead of a persistent background page, share one codebase across Chrome, Firefox, and Edge through the WebExtensions API, and submit separately to each browser's store. Manifest V2 is effectively dead in Chrome as of August 2026.

## What is Manifest V3, and is Manifest V2 really gone?

Manifest V3 is the current, and now only viable, version of the `manifest.json` file that declares an extension's permissions, background behavior, and network rules. Chrome removed the toggle letting users re-enable Manifest V2 extensions in Chrome 138 (July 2025), then deleted the enterprise policy flags that still allowed it in Chrome 150-151 around mid-2026, per Chrome's own [Manifest V2 support timeline](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline). The Chrome Web Store is removing remaining Manifest V2 listings entirely by August 31, 2026. Firefox still runs Manifest V2 extensions, but Mozilla points new development at Manifest V3 too, so there is no practical reason to start a new project on V2 today.

The core shift in MV3 is `background.service_worker` replacing `background.page`, plus a mandatory declarative `declarativeNetRequest` API for network filtering instead of arbitrary blocking code. That restriction is a genuine pain point for ad blockers and similar tools: some advanced filtering patterns that worked freely under MV2's `webRequestBlocking` are simply not possible under MV3's rule-based model.

| Feature | Manifest V2 | Manifest V3 |
|---|---|---|
| Background | Persistent background page | Service worker (event-driven, can sleep) |
| Network filtering | `webRequestBlocking` (arbitrary code) | `declarativeNetRequest` (rule-based) |
| Remote code execution | Allowed | Banned, all code must ship in the package |
| Status in Chrome | Removed as of August 2026 | Only supported version |

## What do content scripts, service workers, and the side panel actually do?

These are the three isolated contexts an extension runs in: content scripts touch the page DOM, the service worker handles background logic, and the side panel gives the user a persistent UI docked in the browser chrome. A content script is injected into the visited page and can read or modify its DOM, but it runs in its own isolated world, separate from the page's own JavaScript. The service worker is event-driven — it wakes on a message or alarm, does its work, and goes back to sleep, so you must keep state in `chrome.storage`, not in a module-level variable that disappears when the worker terminates.

The [`chrome.sidePanel` API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel) shipped in Chrome 116 and lets a click on the extension icon open a persistent panel docked to the side of the browser window; Edge supports the same API since it shares Chrome's extension platform. Firefox has no equivalent — it uses a separate `sidebar_action` manifest key and [`sidebarAction` API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sidebarAction) instead, which means a codebase targeting all three browsers needs a build step that generates a browser-specific manifest rather than one file that works everywhere.

## How do you share data and messages between extension parts?

Content scripts, the service worker, and the popup are isolated from each other, so state moves through two channels: persistent storage via `chrome.storage.local` or `chrome.storage.sync`, and live communication via `chrome.runtime.sendMessage` and `chrome.runtime.onMessage`. `storage.sync` replicates across a user's signed-in devices but is capped (roughly 8 KB per item, about 100 KB total), so anything larger belongs in `storage.local` instead.

```json
{
  "manifest_version": 3,
  "name": "Woyable Page Summarizer",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "background.js" },
  "side_panel": { "default_path": "sidepanel.html" },
  "permissions": ["storage", "sidePanel", "activeTab"],
  "host_permissions": ["https://api.woyable.com/*"],
  "content_scripts": [
    {
      "matches": ["https://*/*"],
      "js": ["content.js"]
    }
  ]
}
```

Messaging is not one-directional: a content script can message the service worker, and the worker can reply into a specific tab with `chrome.tabs.sendMessage`. This event-driven communication model carries the same failure modes as any pub/sub system — no guaranteed delivery order, no guaranteed delivery at all — which is the same class of problem covered in [event-driven architecture patterns and pitfalls](/en/posts/event-driven-architecture-patterns).

## What permissions should you request, and how do you get through store review?

Request only the permission your feature actually uses, because every extra permission both scares users and lengthens review. Narrow permissions like `activeTab` clear automated review far faster than broad host permissions like `<all_urls>`; the Chrome Web Store routes extensions requesting wide access into manual review, which can add days to the timeline.

Store review is honestly still the most frustrating part of shipping an extension in 2026: Chrome Web Store's mixed automated and manual review is regularly criticized for vague "policy violation" rejections and a slow appeals process. Firefox's AMO more often asks for readable source when submitted code is minified. The most practical fix is keeping permissions minimal, shipping a complete privacy policy link, and avoiding remote code entirely — which MV3 already forbids by design.

## How does the same extension work across Chrome, Firefox, and Edge?

One codebase can target all three browsers because they share a common API surface, documented jointly in [MDN's WebExtensions reference](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions), defined by the W3C WebExtensions Community Group. Firefox exposes the `browser.*` namespace with Promise-based APIs, while Chrome and Edge use the callback-based `chrome.*` namespace, though Chrome now returns Promises from most APIs too. The `webextension-polyfill` library collapses that difference into a single Promise-based interface you can write against once.

| Feature | Chrome | Firefox | Edge |
|---|---|---|---|
| Manifest version | MV3 only | MV3 recommended, MV2 still runs | MV3 only |
| API namespace | `chrome.*` | `browser.*` (Promises) + `chrome.*` | `chrome.*` |
| Background | Service worker | Service worker or event page | Service worker |
| Side panel API | `chrome.sidePanel` | Not supported, uses `sidebarAction` | `chrome.sidePanel` supported |
| Store | Chrome Web Store | Firefox Add-ons (AMO) | Microsoft Edge Add-ons |

In practice, generating browser-specific output from one `manifest.json` template with a build tool — `webextension-polyfill`, `web-ext`, or `wxt` — is the lowest-friction path; you need a config step that maps Chrome/Edge-only fields like `side_panel` to Firefox's `sidebar_action` automatically.

## How do you publish an extension, and how do updates work?

Each store gets a separately signed package: a zip to the Chrome Web Store behind a one-time $5 developer fee, a signed xpi to Firefox via `web-ext sign`, and a separate zip to Edge Add-ons. Auto-updates require no user action — all three browsers periodically poll the store's `update_url` and silently install approved new versions. Publishing an update is just bumping `version` in `manifest.json` and resubmitting.

## How do you add an AI feature to an extension?

The simplest approach is calling an AI API (a language model endpoint, for example) with `fetch` from the service worker, and keeping the API key out of content scripts and page code entirely — it should live only in the service worker's storage. Add just that API's domain to `host_permissions`; MV3's default `content_security_policy` already blocks executing remote scripts, so the AI call should be pure data exchange (fetch plus JSON), never remote code execution. Letting the user paste their API key into `chrome.storage.local` and reading it from there per request is far safer than hardcoding it into the bundle.

## What does a starter architecture look like?

A reasonable file layout for a small extension: `manifest.json` at the root, `background.js` as the service worker handling events and AI calls, `content.js` for DOM interaction on the page, `popup.html`/`sidepanel.html` for the UI, and a `shared/` folder for storage and messaging helpers used by every context. Centralizing state in the service worker plus `chrome.storage`, rather than scattering it across popup and side panel components, keeps behavior consistent across tabs — the same principle behind centralized state discussed in [signals in frontend frameworks, explained](/en/posts/frontend-signals-explained).

## What should you check before submitting to a store?

Before submission: confirm no unused permissions remain in the manifest, scope `host_permissions` to the exact domains you call, add a complete privacy policy URL, prepare icons at 16/48/128 px, bump the version number, provide readable source alongside any minified build, and run one final manual test in each browser's dev environment (Chrome's "Load unpacked," Firefox's `about:debugging`). It's also worth reviewing the popup and side panel UI for accessibility gaps before you ship, following the same checks laid out in the [web accessibility checklist](/en/posts/web-accessibility-checklist).

## Frequently Asked Questions

### Do Manifest V2 extensions still work in Chrome?

No, not as of August 2026. Chrome removed the user-facing toggle to re-enable Manifest V2 extensions in Chrome 138 (July 2025), deleted the enterprise policy flags that extended support in Chrome 150-151 in mid-2026, and the Chrome Web Store is removing the remaining Manifest V2 listings by August 31, 2026.

### Does the side panel API work in every browser?

No. `chrome.sidePanel` works in Chrome 116 and later and in Chromium-based Edge, but Firefox has no equivalent API. Firefox provides the same kind of docked UI through its own `sidebar_action` manifest key and `sidebarAction` API, so a cross-browser extension needs a build step that outputs a different manifest per browser.

### Do you need separate code to publish on Chrome and Firefox?

Usually not. Both browsers implement the W3C WebExtensions standard, so core APIs like `content_scripts`, `storage`, and `runtime.sendMessage` work the same way in both. `webextension-polyfill` closes the namespace gap between `chrome.*` and `browser.*`; you only need to branch a handful of browser-specific manifest fields, such as the side panel.

### Is there a fee to publish a browser extension?

The Chrome Web Store charges a one-time $5 developer registration fee; Firefox Add-ons (AMO) and Microsoft Edge Add-ons are both free to register on. The fee has no bearing on review speed — the scope of requested permissions is what actually determines how long review takes.
