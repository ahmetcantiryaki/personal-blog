---
title: "Virtual Try-On in ChatGPT: A Retailer's Playbook"
slug: "chatgpt-virtual-try-on-retail"
translationKey: "chatgpt-virtual-try-on-retail-2026"
locale: "en"
excerpt: "Short answer: ChatGPT's Try On button lets shoppers preview clothing on a selfie using Images 2.5; retailers need clean, well-lit product photos for it to work."
category: "digital-marketing"
tags: ["chatgpt", "openai", "conversion-optimization", "images"]
publishedAt: "2026-10-12"
seoTitle: "ChatGPT Virtual Try-On: A Retailer's Playbook"
seoDescription: "ChatGPT's virtual try-on launched October 1, 2026. Here's how it works, what catalog images need to fix to appear in it, and how to measure its impact."
---

Short answer: as of October 2026, a "Try On" button appears next to supported clothing and accessory listings in ChatGPT's shopping results. A shopper uploads a selfie or full-body photo, ChatGPT's Images 2.5 model generates a preview of the item on them, and the photo is saved for reuse on future try-ons unless they delete it.

## What exactly did OpenAI launch?

OpenAI globally launched two ChatGPT shopping features on October 1, 2026: virtual try-on and a Favorites system. Try On runs on ChatGPT Images 2.5 and appears as a button on clothing and accessory listings; shoppers can also upload a screenshot of an item from another website and ask ChatGPT to try it on them directly, without the item needing to be in a retailer's existing listing. Both features work on web and mobile, and OpenAI hasn't published usage numbers or a per-retailer opt-out for Try On.

## How does the try-on actually work for a shopper?

A shopper selects Try On, then takes or uploads a photo — a selfie works, but a full-body shot gives a more useful preview. ChatGPT saves that reference photo under Settings → Personalization → Reference Photos so it doesn't need to be re-uploaded for every item; shoppers can replace or delete it at any time. The generated image is explicitly a preview, not a fit guarantee — OpenAI's own framing is that it cannot confirm whether a garment will actually fit, which matters for your return-rate expectations below.

## What is Favorites, and why does it matter for discovery?

Favorites lets shoppers save products they've seen in ChatGPT directly to their Library, or sort them into folders — a wish list that lives inside the chat interface instead of a separate tab a shopper has to remember to open. For a retailer, this changes the shape of the funnel: a shopper who tries on an item and doesn't buy immediately can now save it instead of losing the thread entirely, which means a listing that photographs and try-on's well can collect intent over days instead of needing to convert in one session.

## What does your catalog need to fix to surface well?

Three things, in order of how often they're the actual blocker:

1. **Clean, front-facing product shots on a plain background.** Images 2.5 is generating a composite of your garment onto a photo of the shopper — the cleaner the separation between garment and background in your source image, the fewer artifacts in the result.
2. **Accurate size and fit metadata.** Since the preview can't confirm fit, your product page's size chart and fit notes are doing the work the image can't — a shopper who gets a flattering try-on image but wrong size expectations is a return, not a sale.
3. **Multiple angles per SKU where possible.** A single front-on shot limits what Images 2.5 has to work from; retailers with side and back shots in their feed give the model more to match against body position and pose.

| Catalog requirement | Why it matters for Try On | Effort to fix |
|---|---|---|
| Plain-background product photos | Reduces composite artifacts in the generated preview | Low — reshoot or crop existing assets |
| Structured size/fit data in the feed | Preview can't confirm fit; metadata has to | Medium — audit and standardize product data |
| Multiple angles per SKU | Gives the model more to match against pose | Medium–high — new photography for older SKUs |
| Fast feed refresh cadence | Keeps try-on previews matched to current inventory | Low — automate the existing feed pipeline |

## How should you measure whether this is working?

Track three numbers before and after enabling try-on-ready images for a product category: add-to-cart rate on listings with a Try On button versus without, return rate for try-on-assisted purchases versus the category average, and time-to-purchase for items a shopper first saved to Favorites. A rising add-to-cart rate with a flat or falling return rate is the signal that the preview is setting accurate expectations rather than just generating a flattering image that doesn't match reality in hand.

```text
Minimal tracking setup for a Shopify or similar catalog:
  - Tag SKUs with try-on-eligible = true/false in your feed
  - Add a UTM or referrer check for ChatGPT shopping traffic
  - Compare: add-to-cart rate, return rate, days-to-purchase
  - Segment by: tried-on vs. not tried-on, saved-to-Favorites vs. not
```

## Where does this fall short of on-site AR try-on?

ChatGPT's version is a single generated image per attempt, not a live, adjustable 3D fitting like dedicated on-site AR tools offer — a shopper can't rotate the view or see how fabric drapes in motion. What it trades for that is reach: the try-on lives inside a conversation shoppers are already having while researching, with no app install and no separate AR flow to build and maintain. For most mid-size retailers, that reach is worth more than the fidelity gap, at least until OpenAI or a competitor ships a more dynamic version.

There's also a timing argument for acting now rather than waiting for the feature to mature. Early movers who get their catalogs try-on-ready while competitors are still shipping unoptimized product shots get disproportionate visibility in a channel where "which listing renders well" is still mostly a matter of image quality, not ad spend — that asymmetry narrows fast once everyone fixes their photography, so the catalog work done this month is worth more than the same work done next quarter.

My take: the real risk here isn't image quality, it's brand control. A composite generated by a third-party model is standing in for your product photography in a channel you don't own — if Images 2.5 renders your garment oddly on certain body types, that's now part of how shoppers experience your brand, and you have no opt-out for the feature itself, only for whether your catalog is optimized to use it well.

## Frequently Asked Questions

### How does ChatGPT's virtual try-on work?

A shopper uploads a selfie or full-body photo, and ChatGPT's Images 2.5 model generates a composite image showing a clothing or accessory item on them. The reference photo is saved for future try-ons unless the shopper deletes it under Settings → Personalization → Reference Photos.

### Can retailers opt out of virtual try-on for their products?

As of the October 1, 2026 launch, OpenAI had not published a per-retailer opt-out for the Try On feature itself. Retailers can only control how well their catalog performs in it — clean background photos and accurate size data are what's within a retailer's control.

### Does ChatGPT's try-on confirm whether an item will fit?

No. OpenAI is explicit that the generated preview cannot confirm fit — it shows how the item might look, not whether the size is correct. Retailers should keep size charts and fit notes prominent on the product page, since the image can't carry that information on its own.

### What should a retailer fix first to appear well in ChatGPT shopping?

Start with clean, front-facing product photos on a plain background — this is the single biggest factor in how well Images 2.5 composites the garment onto a shopper's photo. Accurate size metadata and multiple product angles matter next, but a messy source photo undermines everything downstream of it.
