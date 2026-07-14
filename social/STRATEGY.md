# Woyable / @ahmetcantryk — X (Twitter) Strategy

> Language: **English only** on X. Owner: Ahmet (@ahmetcantryk).
> Positioning: *the developer who built a blog that runs itself* — AI agents
> research, write, illustrate and narrate Woyable daily; Ahmet is the
> architect. Build-in-public, honest numbers, real lessons.

## The one-line brand

"I'm building Woyable — a bilingual blog written, illustrated and narrated by
an AI agent pipeline I designed. I share how it works, what it costs, and what
breaks."

## Content pillars (map to what we actually do)

| Pillar | Share | Example |
|---|---|---|
| 1. Build in public | Woyable metrics, costs, failures, wins | "My blog published 8 articles today. My cost: $0.52 for covers. Here's the pipeline." |
| 2. How-it-works deep dives | One pipeline component per post | "How I get AI to draw 116 matching vintage covers for $0.04 each" |
| 3. Article-to-thread | Condense a Woyable article into a thread | GEO guide → "AI search is eating Google. 7 things that make LLMs cite you" |
| 4. Hot takes / lessons | Short opinions earned from real work | "AI content doesn't fail because it's AI. It fails because nobody verifies it." |

Ratio: roughly 2 build-in-public : 1 deep dive : 1 article thread : 1 take per week.

## Algorithm rules (2026, verified July 2026)

1. **Never put a link in the main post.** External links = 30-50% reach
   penalty; near-zero for non-Premium. Put the link in the FIRST REPLY.
2. **Write for bookmarks** (worth ~20x a like): checklists, numbered steps,
   "save this" density.
3. **Replies outrank likes.** End posts with a question when natural. Spend
   15-20 min/day replying substantively to larger accounts in the AI/indie
   space — this is the cheapest reach that exists.
4. Native images/screenshots boost; threads of 4-8 posts perform best;
   post 1 must stand alone as a hook.
5. Consistency beats virality: 3-5 posts/week for 6 months minimum.

## Cadence (minimum viable, ~30 min/day)

- **Mon** — build-in-public update (numbers from the week)
- **Wed** — article thread (use `/x-thread` skill on the newest EN article)
- **Fri** — deep dive or hot take
- **Daily** — 5-10 thoughtful replies to accounts in the niche
  (indie hackers, AI builders, levelsio-adjacent circles)

## What you need (setup checklist)

- [ ] **X Premium** (~$8/mo) — without it, link posts get near-zero reach and
      you lose the long-post/analytics tools. The single highest-ROI spend.
- [ ] Update bio + pin the intro thread (see `profile/bio.md`)
- [ ] Post drafts live in `social/drafts/` — post manually, or paste into
      Typefully (free tier) to schedule
- [ ] After posting, move the file to `social/posted/` (keeps the archive and
      lets future agents avoid repeats)
- [ ] Repo tool: `node src/scripts/twitter-studio.mjs` → localhost paste-ready
      article content

## KPIs (check monthly, don't obsess daily)

- Followers are a vanity metric; track: profile visits, replies per post,
  bookmarks per post, and **blog sessions from x.com/t.co** (GA4).
- Month 1 goal: 20 posts shipped, reply habit formed. That's it.

## Voice

Plain English, first person, concrete numbers, no hype words ("game-changer",
"insane"), no emoji walls (0-2 per post), admit failures openly — the honest
tone IS the differentiator, same as the blog's transparency page.
