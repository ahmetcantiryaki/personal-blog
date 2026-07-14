# Intro thread — pin this after posting

> Post each block as one tweet. Link goes ONLY in the reply marked [REPLY].
> Attach: screenshot of woyable.com/en homepage to tweet 1.

---

**1/**
I built a blog that runs itself.

Every morning, AI agents research trending topics, write articles in two
languages, draw matching cover art, and narrate them like a podcast.

I haven't written a single article. It publishes daily.

Here's how it works 🧵

**2/**
The pipeline:

- A weekly "strategist" agent researches what people search for and fills a
  topic queue
- A daily writer agent picks a topic, verifies facts against primary sources,
  and writes native Turkish + English pairs

116 article pairs so far.

**3/**
The covers are my favorite part.

Every article gets a hand-drawn vintage illustration — ink + watercolor, a
little brass robot mascot, and a handwritten hook.

Drawn by nano-banana running on @fal — $0.04 per cover.
Consistency: one shared prompt template.

**4/**
This week I added narration.

An open-source TTS model (Piper) reads every English article like a podcast.
GitHub Actions generates the audio for free on every push, hosts the MP3s as
release assets, and never regenerates unchanged text.

14.8 hours of audio. Total cost: $0.

**5/**
The rules I set for the agents:

- Never invent facts — verify against primary sources
- Never touch the database or secrets
- Every article ends with a real FAQ (structured data for AI search)
- A human (me) reviews the system, not every word

**6/**
Why I'm sharing this: I think one-person media companies run by agent
pipelines are about to be everywhere, and the playbook is being written right
now.

I'll be posting the numbers, the costs, and the failures here.

What part should I break down first?

**[REPLY]**
The blog, if you want to see the result: https://woyable.com/en

Articles have listen buttons, the covers are all AI-drawn, and there's a
transparency page explaining exactly how it's made.
