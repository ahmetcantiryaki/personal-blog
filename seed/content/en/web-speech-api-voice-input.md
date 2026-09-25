---
title: "Web Speech API: Add Voice Input to Your App"
slug: "web-speech-api-voice-input"
translationKey: "web-speech-api-voice-input-2026"
locale: "en"
excerpt: "The Web Speech API adds voice input via the built-in SpeechRecognition and SpeechSynthesis interfaces, but Firefox ships it disabled, so it needs a fallback."
category: "web-development"
tags: ["accessibility", "frontend", "web-standards", "best-practices"]
publishedAt: "2026-09-25"
seoTitle: "Web Speech API: Voice Input Setup and Fallbacks"
seoDescription: "The Web Speech API brings voice input to the browser via SpeechRecognition and SpeechSynthesis. Browser support, the permission model, and a fallback plan."
---

Short answer: the Web Speech API is a built-in browser interface that turns speech into text (`SpeechRecognition`) and text into speech (`SpeechSynthesis`) without loading an extra library. It's fully supported in Chrome, Edge, and Opera, works with a prefix (`webkitSpeechRecognition`) in Safari, and ships disabled by default in Firefox — which means production code needs a real fallback strategy.

## What does the Web Speech API actually cover?

It covers two separate interfaces: `SpeechSynthesis` (text-to-speech) and `SpeechRecognition` (speech-to-text). The two work independently — an app can speak text aloud only, accept voice commands only, or use both together.

`SpeechSynthesis` uses the operating system's built-in voice engines, so it needs no network request and works offline. `SpeechRecognition` varies by browser: Chrome sends recorded audio to a server for processing, so it requires an internet connection, while Safari can run recognition on-device once the user grants permission and the language pack is downloaded.

## Why is voice-first UX rising in 2026?

Because typing on a mobile keyboard is still the slowest way to enter text, while daily-use assistant apps (Gemini, ChatGPT voice mode) have raised the baseline for what users expect a voice interaction to feel like. Users have started expecting a similar voice shortcut in a plain web form too — especially in search boxes, note-taking tools, and accessibility-sensitive flows.

## How does browser support and API behavior differ?

| Browser | SpeechRecognition | Notes |
|---|---|---|
| Chrome / Edge / Opera | Full support | Audio is sent to a server-based recognition engine (requires being online) |
| Safari (macOS 14.1+, iOS 14.5+) | Behind the `webkitSpeechRecognition` prefix | Can run on-device after permission plus a language pack download |
| Firefox | Behind a flag | `dom.webspeech.recognition.enable` is disabled by default |

Support for `SpeechSynthesis` is far more consistent; nearly every modern browser handles text-to-speech reliably. The real fragility sits on the `SpeechRecognition` side — which is why treating voice input as progressive enhancement is far safer than shipping it as the only input method.

## How do you build a working example with interim results?

The code below sets up a dictation field that updates live as the user speaks, then finalizes the text once a phrase completes:

```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

function startVoiceInput(onInterim, onFinal, onError) {
  if (!SpeechRecognition) {
    onError(new Error("SpeechRecognition is not supported"))
    return null
  }

  const recognition = new SpeechRecognition()
  recognition.lang = "en-US"
  recognition.interimResults = true
  recognition.continuous = false

  recognition.onresult = (event) => {
    let interim = ""
    let final = ""
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        final += transcript
      } else {
        interim += transcript
      }
    }
    if (interim) onInterim(interim)
    if (final) onFinal(final)
  }

  recognition.onerror = (event) => onError(new Error(event.error))
  recognition.start()
  return recognition
}
```

Setting `interimResults: true` lets you show partial results before the user finishes speaking — that gives the user instant feedback that the system is listening, which is one of the most important UX details in a voice search flow.

## How are permissions and languages handled?

Microphone access shares the same browser permission model as `getUserMedia` — once the user grants it, the browser remembers that per site, but a denial surfaces as a `not-allowed` error through `recognition.onerror`, and your code needs to catch that and show a clear message. Language is set through `recognition.lang` in BCP 47 format (`en-US`, `tr-TR`, and so on); if the browser lacks recognition support for that language, it can silently return an empty result, so it's worth testing your supported-language list ahead of time.

## What are the accessibility wins and pitfalls?

The win is clear: for users with limited motor ability, voice input provides an alternative channel to keyboard or touch interaction. But there's a real pitfall too — shipping voice input as the only input method excludes users who need a quiet environment (a library, an open office) or users with speech impairments. A WCAG-compliant form should always pair voice input with a keyboard and touch alternative; we've collected the broader checklist in [our Web Accessibility Checklist (WCAG 2.2)](/en/posts/web-accessibility-checklist).

## When should you switch to a server-side STT API instead?

Short answer: when accuracy is critical, multiple languages need simultaneous support, or you need an offline guarantee. The Web Speech API is free and simple to set up, but it makes no accuracy guarantee — which engine runs behind the scenes depends on the browser, and you have no control over it. In high-accuracy scenarios like medical, legal, or multilingual transcription, a dedicated STT API (Whisper-based services, for example) gives far more predictable results — at the cost of added latency and per-request pricing.

Our take: for most products, the right sequence is to prototype fast with the Web Speech API, measure real demand with usage data, then move to a server-side solution once accuracy actually becomes a problem. We cover a similar progressive-enhancement pattern with modern CSS features in [our guide to :has() and native CSS nesting](/en/posts/modern-css-has-native-nesting) — the same "guarantee the baseline experience first, then enhance" logic applies here too.

## What should you watch for on the text-to-speech (SpeechSynthesis) side?

The `SpeechSynthesis` interface lists available voices through `speechSynthesis.getVoices()` and speaks text through a `SpeechSynthesisUtterance` object. The most common mistake is calling `getVoices()` as soon as the page loads — in some browsers the voice list loads asynchronously, and that first call can return an empty array. The correct approach is to listen for the `voiceschanged` event instead:

```javascript
function loadVoices() {
  return new Promise((resolve) => {
    let voices = speechSynthesis.getVoices()
    if (voices.length) {
      resolve(voices)
      return
    }
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices()
      resolve(voices)
    }
  })
}
```

This matters especially in a multilingual app — if the user's browser has no voice pack for a given language, calling `speak()` can silently do nothing, so you need a visible text fallback in that case.

## Which real-world use cases actually benefit from voice input?

Three scenarios stand out clearly: search boxes (users speaking a query instead of typing it), form filling (dictating into long text fields, especially on mobile), and accessibility-focused control interfaces (voice-driven navigation when hands are busy). Beyond that, browser extensions also use the Web Speech API to bind voice commands to in-page actions; we cover building one of those from scratch in [our guide to building a browser extension in 2026](/en/posts/build-browser-extension-2026).

By contrast, voice input doesn't pay off everywhere: for short, single-word inputs (search filters, numeric values), speaking can end up slower than typing — recognition latency plus a possible error-correction step takes longer than a couple of keystrokes. That threshold is worth keeping in mind when deciding where to add the feature.

## Frequently Asked Questions

### Does the Web Speech API work in every browser?

Short answer: no. It works fully in Chrome, Edge, and Opera, Safari supports it with a prefix, and Firefox ships it disabled behind a flag by default — so feature detection and a fallback are mandatory.

### Does SpeechRecognition work offline?

Short answer: it depends on the browser. Chrome sends audio to a server for processing, so it requires an internet connection, while Safari can run recognition on-device offline once the user grants permission and downloads the language pack.

### What happens if microphone permission is denied?

Short answer: a `not-allowed` error fires through `recognition.onerror`; your code needs to catch that and show the user a clear message on how to change their permission settings.

### When should you avoid using voice input?

Short answer: don't ship it as the only input method for scenarios where accuracy is critical (medical records, legal documents) or where the environment is likely to be noisy; those cases need a server-side STT service and always a keyboard alternative.

**Sources:** [MDN — Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API), [MDN — Using the Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API), [MDN — SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).
