---
title: "Gemini 3.5 Transcribe: Speech-to-Text Guide"
slug: "gemini-3-5-transcribe-speech-to-text"
translationKey: "gemini-3-5-transcribe-speech-to-text-2026"
locale: "en"
excerpt: "Gemini 3.5 Transcribe is Google's dedicated speech-to-text model: 85+ languages, 8-speaker diarization on recordings, and a 2.6% English word error rate."
category: "technology"
tags: [gemini, ai-tools, machine-learning, automation]
publishedAt: "2026-09-28"
seoTitle: "Gemini 3.5 Transcribe: Pricing, Languages, Accuracy"
seoDescription: "Gemini 3.5 Transcribe handles 85+ languages, diarizes up to 8 speakers, and reports a 2.6% WER on English. Pricing, API basics and Whisper compared."
---

Short answer: Gemini 3.5 Transcribe is Google's dedicated speech-to-text model, separate from the general Gemini chat models, built for low-latency transcription with automatic language detection across 85+ languages, speaker diarization on prerecorded audio, and word-level timestamps — priced at roughly $0.005 per minute of recorded audio.

## What is Gemini 3.5 Transcribe, exactly?

It's a purpose-built transcription model rather than a general-purpose chat model asked to transcribe audio as a side task. That distinction matters for latency and cost: a dedicated transcription model is tuned specifically for turning audio into accurate text quickly, instead of carrying the overhead of a model that also reasons, writes code, and holds a conversation.

Google offers two modes through the Gemini API: a non-streaming mode for prerecorded audio files, and a live-streaming mode for real-time transcription as audio comes in. They behave differently in one important way — diarization (telling speakers apart) is only available for prerecorded audio; live streaming transcribes in real time but doesn't currently separate speakers.

## How accurate is it, really?

Google reports a 2.6% word error rate (WER) for non-streaming English transcription and 4.0% for streaming. For comparison, Whisper Large v3 scores 4.1% WER on the same class of non-streaming benchmark tracked by the Artificial Analysis leaderboard — meaning Gemini 3.5 Transcribe currently reports a lower error rate on English than that Whisper variant, based on separately tracked, non-head-to-head numbers.

Treat that comparison as directional rather than final: Google hasn't published a direct benchmark against Whisper, and because Gemini 3.5 Transcribe only became publicly available in the past few weeks, independent adversarial comparisons across accents, noise conditions, and non-English languages are still thin. WER numbers on a clean benchmark rarely tell the whole story once you throw in cross-talk, background noise, or a strong regional accent.

| | Gemini 3.5 Transcribe | Whisper Large v3 |
|---|---|---|
| Non-streaming WER (English) | 2.6% | 4.1% |
| Streaming support | Yes (4.0% WER) | Not natively |
| Speaker diarization | Yes, up to 8 speakers (prerecorded only) | Not built in |
| Hosting | Google-hosted API, per-minute pricing | Self-hostable, no per-minute fee |
| Custom vocabulary | Up to 1,000 terms | Not built in |

## What does it cost to run?

Recorded (non-streaming) audio runs at roughly $0.005 per minute blended — about $0.003/min for the audio input and $0.002/min for the transcribed text output. Live streaming costs more, around $0.009 per minute, reflecting the extra infrastructure needed for real-time processing.

That's cheap in absolute terms for occasional use — an hour of recorded audio costs about $0.30 — but it adds up at scale in a way self-hosted Whisper doesn't, since Whisper has no per-minute API fee once you're running your own inference. The trade-off is operational: self-hosting Whisper means managing your own GPU infrastructure, model updates, and scaling, while the Gemini API means paying per minute but skipping all of that.

## What languages and speakers does it actually handle?

The model automatically detects speech across 85+ languages and dialects without manual configuration, and it handles code-switching — a speaker moving between two languages within the same sentence or across sentences — without requiring you to declare which language is coming next.

Speaker diarization, available for prerecorded audio, labels up to 8 distinct speakers (tagged like `spk_1`, `spk_2`), though attribution accuracy for three or more simultaneous speakers is marked experimental by Google. For a two-person interview or a small meeting, diarization is solid; for a large roundtable with many overlapping voices, expect more manual correction.

## How do you actually call it?

A basic transcription request through the Gemini API takes an audio file and returns text with optional timestamps and speaker labels:

```python
import google.generativeai as genai

model = genai.GenerativeModel("gemini-3.5-transcribe")
response = model.generate_content(
    [
        {"mime_type": "audio/mp3", "data": audio_bytes},
        "Transcribe this audio with speaker labels and word-level timestamps.",
    ]
)
print(response.text)
```

For domain-specific terms — product names, acronyms, or people's names the model would otherwise mishear — you can pass a `custom_vocabulary` list of up to 1,000 terms to bias recognition toward the words you expect, which matters more for accuracy in specialized use cases than the base WER number does.

## What is it actually good for?

Meeting notes and interviews are the obvious fit: diarization plus word-level timestamps means you can jump straight to what a specific person said at a specific moment, instead of scrubbing through raw audio. Podcast and video subtitling benefits from the same timestamp precision, since subtitle files need exact timing, not just correct words.

For live use cases — captioning a talk as it happens, or transcribing a phone call in real time — the streaming mode is the right tool, with the trade-off that you lose speaker separation and pick up a slightly higher error rate in exchange for immediacy. If your actual need is cleaning up your own rambling voice notes into structured drafts rather than producing a verbatim transcript, that's a different job entirely — see [our guide to voice-first drafting with Gemini's Rambler](/en/posts/voice-first-productivity-dictation) for that workflow instead.

For recorded meetings specifically, pair the raw transcript with a purpose-built assistant that also summarizes decisions and action items — we compare the leading options in [our AI meeting assistants comparison](/en/posts/ai-meeting-assistants-compared-2026). And if you're deciding between a phone app, a software API, and a dedicated recording gadget for capturing audio in the first place, [our look at AI voice recorder devices](/en/posts/ai-voice-recorders-note-gadgets-2026) covers where a standalone recorder still beats your phone.

## Frequently Asked Questions

### Is Gemini 3.5 Transcribe free to use?

No. It's priced per minute of audio through the Gemini API — roughly $0.005/minute blended for recorded audio and about $0.009/minute for live streaming, as of September 2026. There's no free self-hosted option the way there is with open-source Whisper.

### Does Gemini 3.5 Transcribe support Turkish?

Yes — it automatically detects speech across 85+ languages and dialects, and Turkish is among the widely spoken languages Google's multilingual models target, but accuracy for less common phrasing, heavy accents, or code-switched Turkish-English speech should be tested against your specific use case before relying on it in production.

### Can it separate speakers in a live phone call?

No. Speaker diarization — telling distinct speakers apart and labeling them — is only available for prerecorded audio files as of September 2026. Live streaming transcribes in real time but does not currently separate speakers.

### How is this different from Gboard's Rambler?

They solve different problems. Rambler is a keyboard-level feature that cleans up your own rambling speech into structured, edited text as you dictate into any app. Gemini 3.5 Transcribe is a developer API that produces accurate, often verbatim transcripts of any audio — including other people's voices in meetings or interviews — with timestamps and speaker labels, not a cleaned-up rewrite.

**Sources:** [Google — Intelligent transcription with Gemini 3.5 Transcribe](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5-transcribe/), [OrcaRouter — Gemini 3.5 Transcribe vs Whisper Large v3 Turbo](https://www.orcarouter.ai/blog/gemini-3-5-transcribe-vs-whisper-large-v3-turbo), [eesel AI — Gemini 3.5 Transcribe pricing and accuracy](https://www.eesel.ai/blog/gemini-3-5-transcribe).
