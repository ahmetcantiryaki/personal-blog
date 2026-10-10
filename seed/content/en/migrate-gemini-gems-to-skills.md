---
title: "Migrate Your Gemini Gems to Skills Before Nov 17"
slug: "migrate-gemini-gems-to-skills"
translationKey: "migrate-gemini-gems-skills-2026"
locale: "en"
excerpt: "Google auto-migrates personal-account Gems to Skills starting November 17, 2026; Workspace follows in March 2027 and Education in June 2027."
category: "business"
tags: ["gemini", "automation", "productivity", "saas"]
publishedAt: "2026-10-10"
seoTitle: "Gemini Gems to Skills: Migration Checklist"
seoDescription: "Google is retiring Gemini Gems for Skills: the Nov 17, 2026 cutover date, Workspace and Education timelines, the 100-skill cap, and what to check first."
---

Short answer: most of your Gem's instructions and knowledge files will carry over on their own, but not everything does. Google starts auto-migrating personal-account Gems to Skills on November 17, 2026. Premade Gems from Google Labs do not migrate at all, and GitHub-linked files and sharing permissions need to be rebuilt by hand.

## What is the difference between Gemini Gems and Skills?

A Gem was Gemini's custom-instruction-plus-knowledge-file assistant, and a chat could only run one at a time. A Skill does the same underlying job, but you call it by typing a forward slash in the prompt box and picking it from a list, and a single conversation can run several Skills back to back — a change Google calls stacking.

Google announced the shift on September 30, 2026, in a post titled "Let skills in Gemini tackle your most repetitive tasks," framing Skills as the direct replacement for Gems. The practical difference: Gems forced a single choice per chat, while Skills let you enable one and have Gemini apply it automatically when it judges the request relevant, on top of the explicit slash-call option.

## When do Gems actually disappear?

The timeline depends on account type, and there are three separate dates to track. Personal accounts begin automatic migration on November 17, 2026. Workspace business and enterprise accounts lose the ability to create or edit Gems no earlier than March 1, 2027, and Workspace for Education accounts follow no earlier than June 1, 2027.

| Account type | Skills available from | Gems retirement |
|---|---|---|
| Personal Google account | Gemini app, starting October 13, 2026 | Auto-migration begins November 17, 2026 |
| Workspace (business/enterprise) | Starting October 5, 2026 | No earlier than March 1, 2027 for create/edit |
| Workspace for Education | Same window as business | No earlier than June 1, 2027 |

Google's own support page qualifies the Workspace and Education dates with "no earlier than," meaning the real cutoff for a given organization could land later than the floor date. The personal-account date is firmer: the in-app notice states November 17 directly.

## Which Gems auto-migrate, and which do I have to redo by hand?

Google converts most existing Gems without any action on your part, but the migration has real gaps. Premade Gems published by Google Labs do not migrate at all, GitHub-linked files are not yet supported inside Skills, and team sharing links may need to be rebuilt after the cutover.

| Migrates automatically | You redo manually |
|---|---|
| Custom instruction text | Google Labs' premade Gems |
| Supported knowledge/reference files | Files linked from GitHub |
| Gem name and core settings | Sharing links, team access permissions |
| — | Setups that depend on Canvas, Deep Research, or Guided Learning |

The most commonly missed item is Google Labs Gems. People who assume anything in their Gem list migrates get a surprise after November 17, when that premade Gem simply is not in their Skills list.

## What does the 100-active-skill cap mean?

You can create an unlimited number of Skills on an account, but only 100 can be active at the same time. Once you hit that cap, adding a new Skill means disabling an existing one first, which makes tracking who is still using which Skill a real operational task on shared accounts.

A single user rarely bumps into 100 Skills. A shared Workspace account where several teams each add their own Skills can fill that cap much faster, which is a good reason to ask "who still uses this Skill" before the migration, not after.

## What capabilities don't Skills support yet?

As of this writing, Skills do not support Canvas, Deep Research, Guided Learning, video generation, or music generation. If one of your Gems relies on any of those, you'll need a manual workaround — either a different tool or the native Gemini feature directly — after the cutover.

Google's support page lists these under "Gemini features Skills don't support yet," language that leaves room for the list to shrink over time. Treat that as a possibility, not a plan: there's no published date for any of these capabilities to land in Skills, so don't build your migration around one showing up before March 2027.

## How do slash-invoked, stackable Skills change team workflows?

Gems capped you at one assistant per chat. Skills can be chained in the same conversation — stacking lets one Skill's output feed directly into the next, so a research Skill can hand off to a formatting Skill, which hands off to a Skill that drafts a Gmail message, all without leaving the thread.

My own take here: stackable, slash-invoked Skills are a genuine step up from the one-Gem-per-chat ceiling, but only if a team actually governs the 100-skill cap. Left unmanaged, you get the same sprawl Gems had — unused assistants nobody remembers creating — just reachable with a forward slash instead of a dropdown.

The practical shift for teams: instead of one monolithic "customer support Gem," building three or four small, chained Skills tends to hold up better. Each one does a single job well, and you can update or retire it on its own without touching the rest of the chain.

## What should a pre-cutover audit checklist cover?

Before the November window opens, sort your existing Gems into three buckets: ones you built yourself, premade Gems from Google Labs, and ones shared across your team. The checklist below is built to move through that sort quickly.

```text
Pre-migration Gems audit:
1. List every active Gem (Settings > Gems).
2. Tag each one: self-built / Google Labs premade / team-shared.
3. Flag Google Labs Gems — these won't migrate, plan to rebuild as a Skill.
4. Check each Gem's knowledge source — GitHub-linked files need a manual plan, others migrate automatically.
5. Flag any Gem using Canvas, Deep Research, or Guided Learning, and pick an alternative.
6. List team sharing links so you can reshare them after the migration.
7. Estimate your active Skill count; if you're near 100, retire unused ones now.
```

Run this once before November 17, and again for Workspace accounts before March 2027 — doing it twice avoids surprise downtime for whoever depends on these assistants.

For background on the feature this replaces, see [Gemini Gems for custom business assistants](/en/posts/gemini-gems-custom-ai-assistants-business); for how Skills stack up against the alternatives, see [Custom GPTs vs. Gems vs. Skills](/en/posts/custom-gpts-vs-gems-vs-skills); and for the broader industry pattern, see [Why every AI assistant is converging on Skills](/en/posts/ai-assistants-converging-on-skills). If you want habits for keeping assistants organized day to day, [Organize your AI chats and Gems](/en/posts/organize-ai-chats-and-gems) covers that. For more coverage like this, browse the [Business](/en/category/business) category.

Sources used for this piece include Google's own [transition support page](https://support.google.com/gemini/answer/18560919), [TechRepublic's coverage](https://www.techrepublic.com/article/news-gemini-gems-skills-migration/) of the dates and feature gaps, and [Android Central's timeline summary](https://www.androidcentral.com/apps-software/ai/google-outlines-timeline-to-phase-out-gemini-gems-in-favor-of-skills) of the staged rollout.

## Frequently Asked Questions

### Will my Gems migrate to Skills automatically?

Most will: custom instruction text and supported knowledge files migrate automatically for personal accounts starting November 17, 2026. Premade Gems from Google Labs and GitHub-linked files are excluded from that automatic migration, so you'll need to rebuild those manually.

### When do Gems shut down on my Workspace account?

Google Workspace business and enterprise accounts lose the ability to create or edit Gems no earlier than March 1, 2027, and Workspace for Education accounts follow no earlier than June 1, 2027. Because Google phrases these as floor dates, check your own organization's notice for the exact cutoff.

### How many Skills can be active on one account at once?

You can create an unlimited number of Skills, but only 100 can be active on an account at the same time. Once you reach that limit, you need to disable an existing Skill before a new one can be turned on.

### Does Skills support Gems that used Canvas or Deep Research?

No, not currently. Skills don't yet support Canvas, Deep Research, Guided Learning, video generation, or music generation, so any Gem built around those features needs a manual alternative lined up before you rely on the migration.
