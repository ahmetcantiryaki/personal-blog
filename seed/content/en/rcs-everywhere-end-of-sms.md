---
title: "RCS Is Everywhere Now: The End of SMS?"
slug: "rcs-everywhere-end-of-sms"
translationKey: "rcs-everywhere-sms-2026"
locale: "en"
excerpt: "No: as of October 2026, RCS brings encrypted iPhone-to-Android messaging, but carrier support is still patchy, so SMS remains the universal fallback."
category: "technology"
tags: ["smartphones", "connectivity", "privacy"]
publishedAt: "2026-10-10"
seoTitle: "RCS Everywhere: Is This the End of SMS?"
seoDescription: "RCS now works encrypted between iPhone and Android, but coverage is limited. See the SMS vs RCS differences, RBM growth, and the October 2026 status."
---

Short answer: no, SMS is not ending. As of October 2026, encrypted RCS messaging is rolling out between iPhone and Android, bringing read receipts, typing indicators, and high-resolution media across platforms. Carrier support remains incomplete, though, so SMS stays the one universal fallback that needs no data connection at all.

## What does RCS add over SMS?

RCS (Rich Communication Services) is a carrier-network messaging standard defined by the [GSMA](https://www.gsma.com/solutions-and-impact/technologies/networks/rcs/), built to replace SMS and MMS, both of which date back to the 1990s. RCS adds read receipts, typing indicators, high-resolution photo and video sharing, named group chats with avatars, delivery over Wi-Fi, and, as of May 2026, end-to-end encryption.

The clearest difference shows up in media quality: MMS, the carrier of SMS-era images, typically compresses photos down to under 1 MB, while RCS can send photos and video close to their original resolution. The table below compares the two standards as of October 2026:

| Feature | SMS | RCS (October 2026) |
|---|---|---|
| Delivery channel | Cellular signaling channel | Mobile data or Wi-Fi (IP-based) |
| Media quality | Heavily compressed via MMS, ~1 MB limit | Near-original resolution photo/video |
| Read receipts / typing indicators | None | Yes |
| Group chats | Limited, carrier-dependent MMS group | Named members, avatars, rich group management |
| End-to-end encryption | None | Beta between iPhone and Android since May 2026, carrier-dependent |
| Works without data or Wi-Fi | Yes | No |
| Device coverage | Any phone with a SIM card | Only devices, carriers, and apps that support RCS |

For a broader look at how the two platforms diverge, see our [comparison of AI assistants on Android versus iPhone](/en/posts/ai-assistants-android-vs-iphone), since OS-level differences shape the messaging experience too. The device you pick matters here as well; our [iPhone 18 Pro vs Pixel 11 comparison](/en/posts/iphone-18-pro-vs-pixel-11) covers the differences beyond messaging.

## Is RCS end-to-end encrypted between iPhone and Android?

[Apple and Google announced](https://blog.google/products-and-platforms/platforms/android/android-ios-end-to-end-encrypted-rcs-messaging) on May 11, 2026 that end-to-end encrypted RCS messaging between iPhone and Android had begun rolling out in beta, on by default for supported conversations. The feature requires iOS 26.5 and a current Google Messages app; the encryption is built on Messaging Layer Security (MLS), which the GSMA added to the RCS Universal Profile standard in March 2025 as part of Universal Profile 3.0.

As of October 2026, coverage is still carrier-dependent: not every carrier supports encrypted RCS yet, and the global rollout is expected to take several more months. Encryption only kicks in when both sides run a current Messages app and their carriers allow RCS; encryption support for group chats is arriving on a slower, separate timeline. In practice, this means the same conversation between two people can be encrypted RCS one day and fall back to plain SMS the next, depending on a carrier or app update.

## What is RCS Business Messaging (RBM), and why are brands adopting it?

RCS Business Messaging (RBM) is a business messaging channel built on RCS that lets verified brands send customers messages with a logo, a verified sender badge, and interactive buttons such as "Confirm appointment." [Messaging platform Infobip reported](https://www.infobip.com/news/infobip-global-rcs-traffic-growth-led-by-growth-in-the-us) that global RCS-for-business traffic grew 169.3% between the first half of 2025 and the first half of 2026, with more than 7,300 unique brands registering for RCS in that period.

Growth varies sharply by country: Infobip recorded a 1,298.8% year-over-year jump in US business RCS interactions, followed by Spain (+290%), the UK (+282%), India (+108%), and France (+48%). A 2025 Twilio survey separately found that 75% of businesses planned to adopt RCS that year.

One distinction matters here: RBM messages are **not** end-to-end encrypted. The channel is built for marketing, order updates, and customer support, and carriers plus messaging aggregators can see the message content. A typical RBM message payload looks like this:

```json
{
  "contentMessage": {
    "text": "Your appointment is tomorrow at 2:00 PM. Can you confirm?",
    "suggestions": [
      { "reply": { "text": "Confirm", "postbackData": "confirm_001" } },
      { "reply": { "text": "Reschedule", "postbackData": "reschedule_001" } }
    ]
  }
}
```

The `suggestions` field lets a customer reply with one tap, which is why brands report higher engagement than plain SMS or email notifications. Our [guide to notification fatigue](/en/posts/notification-detox-reclaim-your-focus) covers how this kind of interactive prompt competes for attention on a crowded lock screen.

## Where does SMS still win?

SMS travels over the cellular signaling channel rather than data, so it needs no mobile data or Wi-Fi connection, works on any phone with a SIM card, and stays the one universal fallback across carriers. RCS, by contrast, requires both the sender and recipient to have a compatible device, carrier, and messaging app; when any one of those is missing, apps automatically fall back to SMS or MMS.

That makes SMS hard to replace in three places: areas with no data signal or during international roaming, low-latency delivery for banking and two-factor authentication (2FA) codes, and emergency alert systems. No carrier wants to risk a software update locking millions of users out of messaging entirely, which is exactly why the SMS network stays switched on.

## Is this really the end of SMS?

My take: the "end of SMS" framing is overstated. Much like 2G networks stay alive specifically for emergency calls, SMS will likely remain a fallback layer for at least another decade. RCS's real impact will not be erasing SMS; it will be quietly bringing everyday texting closer to the experience WhatsApp and iMessage already offer, while SMS keeps working in the background as the insurance policy.

Privacy also still differs by platform combination: as our piece on [what AI assistants do with your data](/en/posts/protect-privacy-ai-assistants) points out, a feature being labeled "encrypted" doesn't always guarantee the same protection level, and RCS encryption only activates when both sides use a matching app-and-carrier combination. For more coverage like this, see our [technology category page](/en/category/technology).

## Frequently Asked Questions

### What is the difference between RCS and SMS?

RCS is a messaging standard that runs over mobile data or Wi-Fi and adds read receipts, typing indicators, high-resolution media, and richer group chats. SMS runs over the cellular signaling channel, needs no data connection, and carries only 160 characters of plain text, relying on the separate MMS standard for media.

### Is RCS encrypted on iPhone?

Partially: Apple and Google began rolling out default end-to-end encrypted RCS messaging between iPhone and Android in beta starting May 11, 2026, but as of October 2026 the feature only activates for users running current iOS and Google Messages versions whose carriers support it.

### Why do some RCS messages get sent as SMS instead?

When the recipient's device doesn't support RCS, runs an outdated messaging app, or their carrier hasn't enabled RCS, the messaging app automatically falls back to SMS or MMS. This fallback guarantees the message still arrives, but it disables RCS features like read receipts and high-resolution media for that conversation.

### Does using RCS cost extra?

No, RCS isn't billed as a separate line item; it runs over your mobile data or Wi-Fi connection, so it draws from your data plan instead. SMS, by contrast, is bundled into your carrier's messaging plan and uses no data, which is still why SMS can be more reliable when you're roaming internationally or out of data.
