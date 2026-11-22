---
title: "Your ChatGPT Plan Now Includes API Credits"
slug: "chatgpt-plan-api-credits"
translationKey: "chatgpt-plan-api-credits-2026"
locale: "en"
excerpt: "Short answer: ChatGPT Pro gets monthly API credit equal to its plan price, Business gets credit pooled by seat type; claim it in ChatGPT's billing settings."
category: "ai"
tags: ["openai", "chatgpt", "pricing", "automation"]
publishedAt: "2026-11-22"
seoTitle: "ChatGPT Pro/Business API Credits: How to Claim Them"
seoDescription: "ChatGPT Pro and Business plans now bundle monthly API credits. Here is where to claim yours and a weekend project that fits inside the free allowance."
---

Short answer: ChatGPT Pro subscribers get monthly API credit equal to their plan price ($100, $200 or $500); Business subscribers earn credit by seat type (Standard seats get $20, Premium seats get $100), pooled across the workspace up to $500 a month. You claim the credit in ChatGPT's billing settings.

[OpenAI announced on October 28, 2026](https://cryptobriefing.com/openai-api-credits-chatgpt-pro-business/) that eligible Pro and Business subscribers can claim up to $500 a month in API credits. That means part of your subscription fee can now convert directly into API usage — previously, ChatGPT subscriptions and API usage were billed entirely separately, with no connection between the two.

## Who qualifies, and where do I find the credit?

On Pro, every tier gets credit equal to its own plan price: the $100 Pro tier gets $100 in credit, the $200 tier gets $200, the $500 tier gets $500. On Business, credit depends on seat type: Standard seats earn $20 a month, Premium seats earn $100 a month; those amounts pool across the workspace, capped at $500 a month in total. The announcement doesn't mention Plus, so it's likely excluded for now. To see and claim your credit, go to ChatGPT's billing settings screen.

## How do I set up an API key to use it?

You need a separate API key to spend the credit — your ChatGPT subscription login doesn't automatically link to API access.

```bash
# 1. Create a new key at platform.openai.com/api-keys
# 2. Store it as an environment variable (never hardcode it)
export OPENAI_API_KEY="sk-..."

# 3. Quickly confirm the credit is actually attached
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

Once the key exists, you'll see usage draw down from the credit in your billing settings; your subscription fee doesn't change, you're just activating a benefit that used to go unused.

## What small weekend project fits inside the free allowance?

The most practical way to put the credit to use is a small tool that stays well inside the free allowance. Two examples, both cheap to run on a budget model like GPT-6.2 Sol:

- **A text summarizer**: a script that reads long documents or weekly report emails from a folder and returns a 3-5 sentence summary. Given [Sol's cost advantage](/en/posts/gpt-6-2-astra-vs-sol), summarizing hundreds of pages a week still burns only a small slice of the credit.
- **A Slack or Discord bot**: a simple webhook bot that watches a channel and responds when it sees a trigger word like "summarize."

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

def summarize(text: str) -> str:
    response = client.responses.create(
        model="gpt-6.2-sol",
        input=f"Summarize this text in 3 bullet points:\n\n{text}",
    )
    return response.output_text

# Example: summarize every .txt file in a folder
for filename in os.listdir("reports"):
    if filename.endswith(".txt"):
        with open(f"reports/{filename}", encoding="utf-8") as f:
            print(filename, "->", summarize(f.read()))
```

At Sol's $2-per-million-token input price, summarizing a medium-sized folder of reports typically burns a few percent of the credit, not all of it — so using the credit to experiment doesn't put your budget at risk.

## How do I keep an eye on burn rate?

Running an automation without watching how fast your credit pool drains is risky, especially for something like a Slack bot whose trigger frequency isn't fully under your control.

| Checkpoint | Why it matters |
|---|---|
| Daily/weekly spend chart | Catches an unexpected spike early |
| Model choice (Sol vs. Astra) | Sol costs a quarter of Astra; accidentally defaulting to Astra burns the budget fast |
| Credit expiration | Secondary reports say the credit resets each billing cycle, so hoarding it makes no sense |
| Codex API key usage | One secondary source says the credit may not cover Codex usage via API keys; confirm this in OpenAI's help center |

The last two rows come from secondary sources and aren't confirmed in OpenAI's primary announcement; check your own account's terms on [OpenAI's help center page](https://help.openai.com/en/articles/11481834-chatgpt-rate-card-business-enterprise-edu-credit-based-pricing) before wiring the credit into anything that matters.

Honestly, the smartest part of this move is that it turns subscription spend into a use-it-or-lose-it benefit. Previously, $200 of your Pro subscription stayed locked inside the chat interface; now the same money can flow into a tool you actually wrote yourself. That changes the math for teams weighing [ChatGPT Business Premium seats](/en/posts/chatgpt-business-premium-seats-explained) too — a Premium seat's $100 credit can make the seat itself partly "free."

## Where should I go for a bigger project?

Once you've started with a single-purpose tool like a summarizer or bot and seen how fast it burns through the credit, you can move on to something bigger from our [weekend AI project ideas](/en/posts/ai-project-ideas-weekend) list. The point is to spend the credit on something cheap and reversible first; wiring it straight into a production automation before you understand your burn rate is taking a risk you haven't measured yet.

## Why does this move make sense for OpenAI?

The old model was simple: a ChatGPT subscription paid for the chat interface, and API usage went on a separate bill. That split made it easy for a developer to think "I'm already paying for Pro, why would I open a separate bill for the API" and drift to a competing provider instead, such as Anthropic's Claude API or Google's Gemini API. Folding the credit into the subscription price closes that gap: part of the Pro or Business fee you're already paying flows automatically into API usage, so the "why pay extra" question disappears. It's part of a broader trend of merging subscription and API products under one bill, the same logic we see in how [ChatGPT Business Premium seats](/en/posts/chatgpt-business-premium-seats-explained) are priced.

## What pitfalls should I watch for when spending the credit?

Three practical warnings. First, because the credit is pooled, one team member's single script can burn through the whole Business pool; setting a spend cap (budget alerts on the API side) is worth doing even for solo experiments. Second, the credit may only apply to certain models — the announcement doesn't clarify this, so check your billing screen for which models actually draw from the credit before making an expensive one your default. Third, since the credit is a monthly benefit, hoarding it for one big project doesn't make sense given the reset risk; small, steady use is safer than one large burst.

## Frequently Asked Questions

### Which plan do I need for ChatGPT API credits?

Pro and Business are the plans explicitly named in this announcement. On Pro, every tier gets credit equal to its own plan price; on Business, credit varies by seat type and is capped workspace-wide at $500 a month. Whether Plus is included was not stated in the announcement.

### How do I claim my credit?

Go to ChatGPT's billing settings screen to see and activate the credit. You also need to create a separate API key at platform.openai.com to actually spend it — your subscription login alone isn't enough.

### Does the API credit reset every month?

One secondary source says the credit expires at the end of each billing cycle, but this isn't confirmed in OpenAI's primary announcement. Check OpenAI's help center for the current terms before planning to bank it.

### Does the credit cover Codex usage through an API key?

One secondary report says the credit doesn't cover Codex usage made through an API key. Since this detail isn't confirmed in OpenAI's primary source, verify it in the help center before building a large Codex integration around it.
