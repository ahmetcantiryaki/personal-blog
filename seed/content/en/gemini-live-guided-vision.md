---
title: "What Is Gemini Live Guided Vision?"
slug: "gemini-live-guided-vision"
translationKey: "gemini-live-guided-vision-2026"
locale: "en"
excerpt: "Guided Vision is a Gemini Live mode that narrates a live camera feed aloud and gives spoken framing cues; Google rolled it out on Android in October 2026."
category: "technology"
tags: ["gemini", "ai-tools", "accessibility", "smartphones"]
publishedAt: "2026-10-10"
seoTitle: "What Is Gemini Live Guided Vision?"
seoDescription: "Guided Vision is a Gemini Live mode that narrates a live camera feed aloud and gives spoken framing cues; Google rolled it out on Android in October 2026."
---

Short answer: Guided Vision is a Gemini Live mode that keeps your phone's camera feed open and narrates what it sees out loud, continuously, while giving spoken cues like "pan right" or "step back" to help you frame a shot. Google built it with accessibility organization Aira and rolled it out broadly on Android on October 1, 2026.

## What exactly does Guided Vision add to Gemini Live?

Guided Vision adds a persistent, two-way voice layer on top of the "share your camera" option Gemini Live already had. Instead of interpreting one photo and stopping, it keeps describing the scene second by second for as long as the camera stays open, and it tells you how to move the phone to get a usable view.

Aira is an accessibility company that connects blind and low-vision people with live visual assistance; Google partnered with it to build Guided Vision. According to [Google's own announcement](https://blog.google/innovation-and-ai/products/gemini-app/guided-vision-gemini-live/), the feature was trained on tens of thousands of hours of visual interpretation data and stress-tested before launch by more than 1,000 members of Aira's Trusted Tester network, a detail also covered by [AI Weekly](https://aiweekly.co/alerts/google-launches-guided-vision-in-gemini-live-built-with-aira). A typical session looks like this:

```text
User: Turn on Guided Vision.
Gemini: Camera's on, I'm listening.
User: (points the phone at a kitchen counter)
Gemini: I see two boxes on the counter. Can you bring the one
  on the left a little closer?
User: (moves the box closer)
Gemini: That's a cinnamon granola box. It says "no added sugar."
```

The loop keeps running until you stop it or end the session, so you do not need to close and reopen the camera for every follow-up question. The responses are deliberately voice-first: you can listen while walking or holding something, without needing to look at the screen.

## Which use cases does Guided Vision actually cover?

Google built Guided Vision specifically for blind and low-vision users, around concrete everyday tasks: according to [Android Authority](https://www.androidauthority.com/gemini-live-guided-vision-3705480/), examples include reading the fine print on a food label, having a menu read aloud in a dim restaurant, or finding the right jar on a spice rack. Framed this way, it works like a physical-world counterpart to the [standards covered in web accessibility checklists](/en/posts/web-accessibility-checklist).

One distinction matters here: the Guided Vision brand officially covers only this accessibility mode. Repair, cooking, and shopping examples come from Gemini Live's general camera- and screen-sharing feature, not from Guided Vision itself, even though the underlying mechanism — a live video stream plus continuous voice dialogue — is the same. In that general mode, people point the camera at a bike problem and get step-by-step repair suggestions, get cooking guidance by showing ingredients on a counter, or share their screen to compare products while shopping online; a similar camera-driven shopping approach shows up in [ChatGPT's camera feature](/en/posts/chatgpt-camera-scan-shop).

| Scenario | Official name | Example prompt |
|---|---|---|
| Reading a menu or label | Guided Vision | "Can you read what's on this box?" |
| Finding a product | Guided Vision | "Which one is the cinnamon?" |
| Diagnosing a bike or appliance | General Gemini Live camera sharing | "Can you see why the chain is slipping?" |
| Following a recipe | General Gemini Live camera sharing | "When do I add the onions?" |
| Comparing products while shopping | General Gemini Live screen sharing | "Compare the cameras on these two phones" |

Google built this with an outside accessibility partner rather than purely in-house. Most large tech companies bolt accessibility features on after a product ships, so an Aira collaboration from the design stage reads as a deliberate attempt to build around a real need rather than retrofit one.

## How is Guided Vision different from a plain image Q&A?

The core difference is persistence. A plain "what's in this photo?" question processes a single frame and returns one answer, in text or voice. Guided Vision keeps the camera stream open, runs the model in a loop, and keeps describing the scene and asking you to reposition until you decide to stop.

| Trait | Guided Vision | Plain image Q&A |
|---|---|---|
| Input | Continuous live camera stream | A single captured photo |
| Output | Ongoing spoken narration plus framing cues | One-time answer |
| Follow-up questions | Asked without a new capture | Usually needs a new photo |
| How you turn it on | Gemini app settings, an Android accessibility shortcut, or a TalkBack three-finger tap | Tapping the camera icon in chat |
| Primary audience | Anyone who wants ongoing guidance, especially blind or low-vision users | Anyone who wants a quick, one-off visual answer |

This split shows up in broader coverage of voice assistants too: one-off visual question answering is now common across most assistants, but a continuously open camera that keeps talking back is still rare, a point that comes up in [comparisons of live voice assistants](/en/posts/ai-voice-assistants-compared-gpt-live-gemini-claude).

## Which devices support Guided Vision, and when did it roll out?

As of October 2026, Guided Vision works on Android 9 and newer, in the regions and languages where Gemini Live is already supported. Google first previewed the feature on September 1, 2026, as part of that month's Android feature drop, then expanded it to general availability on October 1, 2026.

Google says the rollout is gradual, so a phone that does not yet show the option is not necessarily unsupported; it may just not have received it yet. Users can turn it on from the Gemini app's settings, from Android's accessibility shortcuts, or with a three-finger tap using TalkBack, Android's built-in screen reader. On the iPhone side, there is no official support announcement as of October 2026; Guided Vision currently appears to be Android-only, which adds one more data point to ongoing debates about [AI assistants on Android versus iPhone](/en/posts/ai-assistants-android-vs-iphone). A [July 2026 report](https://www.indiatvnews.com/technology/news/google-may-soon-allow-users-to-turn-off-gemini-live-guided-vision-feature-2026-07-08-1047537) also said Google was testing a toggle to turn Guided Vision off entirely, though Google has not confirmed that setting officially.

## What are the privacy implications of streaming live video to an assistant?

With Guided Vision running, your phone's camera continuously sends video and audio to Google's servers; that stream can capture the inside of your home, private information on screens, people around you, and personal details on documents. That is a much larger data surface than a single-frame question and answer, which matters for anyone weighing [how AI assistants handle their data](/en/posts/protect-privacy-ai-assistants).

Google draws a clear liability line at the feature level: it states that Guided Vision is not a medical device, a mobility aid, or a replacement for a white cane, and that it is not designed for navigation or obstacle detection.

My take: the accessibility case for Guided Vision is genuine and strong, and it answers a real need that justifies building an always-listening camera mode in the first place. But once a product normalizes an always-on camera for one well-justified use case, extending the same mechanism to non-accessibility scenarios like repairs, cooking, or shopping quietly loosens the privacy norm for everyone else. A similar friction is building around [always-on recording on smart glasses](/en/posts/smart-glasses-consent-etiquette); the difference is that the person holding the phone at least knows when the camera is live, while the people around them usually do not.

## Frequently Asked Questions

### Is Guided Vision available in languages other than English?

Google is rolling Guided Vision out gradually across the regions and languages where Gemini Live is already supported, but as of October 2026 it has not published an official per-language list, so support for any specific non-English language is not confirmed.

### How do I turn on Guided Vision?

You can enable it from the Gemini app's settings menu, from Android's accessibility shortcuts, or with a three-finger tap using TalkBack; Google's own announcement lists all three activation paths.

### Can Guided Vision replace a white cane or navigation app?

No. Google explicitly states that Guided Vision is not a medical device, a mobility aid, or a replacement for a white cane, and that it was not designed for navigation or obstacle detection, so it should not be relied on alone for safety-critical movement decisions.

### Is Guided Vision available on iPhone?

Not as of October 2026. The feature currently works only on Android 9 and newer, and Google has not announced official iOS support.
