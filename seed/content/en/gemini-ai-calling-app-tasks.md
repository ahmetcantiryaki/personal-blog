---
title: "Gemini Can Now Call and Do Tasks for You"
slug: "gemini-ai-calling-app-tasks"
translationKey: "gemini-ai-calling-app-tasks-2026"
locale: "en"
excerpt: "Short answer: on Pixel 10/11 in the US, Gemini can call a business from your number to check stock or book a reservation, and automate tasks in apps."
category: "technology"
tags: ["gemini", "ai-agents", "privacy", "smartphones"]
publishedAt: "2026-11-18"
seoTitle: "Gemini AI Calling and Task Automation, Explained"
seoDescription: "On Pixel 10/11 in the US, Gemini can call businesses from your number and run multi-step tasks in allowlisted apps. Here's what it can and can't do."
---

Short answer: Google's November 2026 Pixel Drop, rolling out from November 10, lets Gemini place a phone call to a business from your own number — to check stock, ask for a reservation, or request an item be held — on Pixel 10 and Pixel 11 in the US, in English. Separately, a wider task-automation feature lets Gemini complete multi-step actions inside a set of allowlisted apps (groceries, rideshare, food delivery, marketplace purchases) in India, Japan, and the UK.

These are two distinct features that got announced together and keep getting conflated in coverage: one makes phone calls on your behalf, the other operates inside apps you already have installed. Knowing which one you're using matters, because they fail differently and raise different privacy questions.

## What Exactly Did Google Announce in the November 2026 Pixel Drop?

Google's own Pixel Drop post describes Gemini making calls to businesses using the phone owner's number to manage reservations, check inventory, or ask a store to hold a product — available now on Pixel 10 and Pixel 11, in the US, in English, for users 18 and older. The rollout is explicitly phased: Google says it continues "over the coming weeks," so not every eligible device gets it the same day.

Separately, the same Pixel Drop expands Gemini's task automation inside allowlisted apps to new regions — India, Japan, and the UK — covering grocery orders, rideshare bookings, food delivery, and marketplace purchases. This is app automation, not calling: Gemini operates inside an app's own interface on your behalf rather than talking to a human on the phone.

## How Is "Calling a Business" Different From "Automating an App"?

Calling a business means Gemini has an actual voice conversation with a person (or an IVR system) on the other end of the line, using your phone number, to accomplish something a form or app can't — asking a specific question, negotiating a hold on an item, or getting information a business hasn't put online. Automating an app means Gemini is tapping through an interface you could tap through yourself, just faster and without you watching every step.

| Feature | What Gemini does | Where it's live | Who can use it |
|---|---|---|---|
| Calling businesses | Has a live phone conversation from your number | Pixel 10, Pixel 11 — US, English | Users 18+ |
| Task automation in apps | Completes multi-step actions inside allowlisted apps | India, Japan, UK (expanded regions) | Varies by app and region |
| Upgraded Call Screen | Has a back-and-forth with unknown incoming callers to learn why they're calling | Pixel 11 — US | Pixel 11 owners |

The Call Screen upgrade is a third, related feature: it's Gemini handling an incoming call for you, rather than placing an outgoing one — useful for screening unknown numbers, but a different use case from asking Gemini to call a restaurant.

## What Can It Actually Do, and Where Does It Fail?

Gemini's calling feature handles narrow, answerable questions well — "do you have this in stock," "can I get a reservation for four at 7pm" — because those map to a short, predictable conversation a business is used to having with any caller. It struggles with anything that needs judgment, negotiation beyond a simple yes/no, or a business that simply refuses to engage.

Coverage of the rollout notes a real and fairly obvious failure mode: some businesses decline to speak with an AI caller and ask to talk to the actual phone owner instead, which stalls the task entirely. Google frames results as variable rather than guaranteed, which is a reasonable way to describe a feature that depends on a stranger on the other end of the line cooperating with a machine.

## How Does Gemini Ask Before Acting, and What Can You Still Control?

Google's framing throughout both features emphasizes checking in before and during the task — Gemini can be monitored mid-task and canceled if you change your mind, rather than running fully unsupervised to completion. For app automation specifically, the model operates within an allowlist of apps and task types rather than acting freely across anything installed on your phone, which caps the blast radius of a mistake to a known, bounded set of actions.

That said, "can be monitored" is not the same as "requires your explicit sign-off at every step," and exactly how much confirmation happens before Gemini dials a number or places an order is the detail Google's own post is lighter on than the privacy question deserves.

## What Are the Real Privacy and Consent Questions Here?

The core tension is that a business receiving a call now has to figure out, often with no clear signal, whether it's talking to the account owner or an AI acting on their behalf — and the account owner's phone number is what's actually placing the call, which means the business's caller ID shows a real person's number attached to an AI-initiated conversation. That's a meaningfully different trust situation than a chatbot on a website, where everyone already assumes they might be talking to software.

There's also a quieter question worth asking before turning this on: a call placed "on your behalf" still happens using your identity, your number, and implicitly your authority to commit to something (a reservation, a hold) — so the convenience trades away a small amount of control over exactly what gets said and agreed to in your name, even with monitoring available.

## Is This Actually Useful Yet, or Early and Overhyped?

It's genuinely useful for the narrow case it's built for — checking stock or booking a simple reservation without you having to make the call yourself — but it's early enough that device scope (two phone models, one country, one language) and the "businesses may refuse to engage" failure mode mean it won't replace calling yourself for anything that matters. Treat it as a convenience for low-stakes errands right now, not as a general-purpose calling agent you can rely on for anything you'd actually worry about getting wrong.

The honest framing: this is a feature-drop expansion of what [Gemini's agent mode](/en/posts/gemini-agent-mode-automate-multi-step-work) has been doing inside software all year, now extended to the phone call itself — which is a bigger leap in some ways (a real person on the other end) and a smaller one in others (the task itself is usually trivial). For the broader context on what Gemini can and can't be trusted to remember and act on, see [how Claude, ChatGPT and Gemini remember you](/en/posts/how-claude-chatgpt-gemini-remember-you), and for Google's other on-device assistant push, [Gemini Spark](/en/posts/gemini-spark-explained) covers the phone-native agent angle this calling feature extends. If you're deciding which Gemini tier actually gets you these features, [which Gemini model should you use](/en/posts/which-gemini-model-should-you-use-2026) breaks down the lineup. More coverage like this lives in our [technology category](/en/category/technology).

## Frequently Asked Questions

### Can Gemini actually call people or businesses for me?

Yes, as of the November 2026 Pixel Drop, Gemini can call a business from your own phone number on Pixel 10 and Pixel 11 in the US, in English, to check stock, manage a reservation, or ask a store to hold an item — the feature is limited to users 18 and older and is still rolling out in phases.

### Which phones support Gemini's calling feature?

Google's own announcement names Pixel 10 and Pixel 11 for the calling feature, in the US and in English only; the broader Gemini Intelligence features on the same Pixel Drop extend to Pixel 10 and newer (not the 10a) in select countries and languages, but calling specifically is narrower than that.

### Is it safe for an AI to call a business using my phone number?

It's reasonably safe for low-stakes requests like checking stock, but it does mean the business sees your real number attached to an AI-initiated conversation, and you're trusting Gemini to represent you accurately on a call you're not actively listening to. Google allows monitoring the task and canceling it, but treat it as a convenience feature for errands you wouldn't mind going slightly wrong, not for anything where the exact wording matters.

### What happens if a business refuses to talk to an AI caller?

Coverage of the rollout confirms this happens: some businesses decline to engage with an AI caller and ask to speak with the actual phone owner, which stops the task. There's no documented workaround beyond calling yourself in that case — it's a real limitation of the feature, not a rare edge case.

**Sources:** [Google — Pixel 10 with Gemini Intelligence, custom widgets, and more in our November Pixel Drop](https://blog.google/products-and-platforms/devices/pixel/november-2026-pixel-drop/), [9to5Google — November 2026 Pixel Feature Drop](https://9to5google.com/2026/11/10/november-2026-pixel-feature-drop/).
