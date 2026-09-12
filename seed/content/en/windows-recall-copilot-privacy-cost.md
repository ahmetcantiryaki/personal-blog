---
title: "Windows Recall and Copilot: The Privacy Cost"
slug: "windows-recall-copilot-privacy-cost"
translationKey: "windows-recall-copilot-privacy-2026"
locale: "en"
excerpt: "Short answer: Recall now ships off by default, encrypted behind Windows Hello, limited to Copilot+ PCs — the real risk is how you configure it."
category: "technology"
tags: ["privacy", "on-device-ai", "authentication"]
publishedAt: "2026-09-12"
seoTitle: "Windows Recall and Copilot: What's the Privacy Cost?"
seoDescription: "How Windows Recall works as of 2026, what encryption protects your snapshots, and how to configure it safely for personal or enterprise use today."
---

Short answer: Windows Recall takes periodic screenshots and stores them locally, encrypted behind Windows Hello Enhanced Sign-in Security (ESS); as of 2026 it ships off by default and only runs on Copilot+ PCs. The real privacy cost isn't that the feature exists — it's that once you turn it on, it builds a searchable archive of everything you've done.

## What does Windows Recall actually capture, and where does your data live?

Short answer: Recall takes a screenshot every few seconds, indexes them with optical character recognition, and stores everything entirely on your device without ever sending it to the cloud. That's what lets you ask Copilot to "search your history" and have it find a document you opened months ago, a webpage you visited, or a message you typed.

Data gets processed on the Neural Processing Unit (NPU — dedicated hardware for AI workloads) of a Copilot+-qualified device. That means screenshots and the OCR index write straight to your local disk instead of a server — though staying on-disk doesn't automatically mean secure.

## How has Recall's opt-in status changed since the 2024 backlash?

Short answer: Recall is now fully opt-in — off by default on new Copilot+ PCs, requiring you to actively enable "Recall & snapshots" in Settings > Privacy & security. The original 2024 announcement triggered a major backlash after security researchers found plaintext screen data in an unencrypted SQLite database; Microsoft has redesigned the feature three times since.

Recall reached general availability on Copilot+ PCs in December 2025, following a gradual rollout that began with an April 2025 non-security preview update. As of 2026, the setup screen clearly explains what the feature does and requires active consent — a full reversal from the original "on by default" approach.

| Period | Default state | Encryption | Requirement |
|---|---|---|---|
| 2024 (original announcement) | On (opt-out) | Unencrypted local database | Copilot+ PC |
| 2025 (relaunch) | Off (opt-in) | Basic Windows Hello encryption | Copilot+ PC + Windows Hello |
| 2026 (current) | Off (opt-in) | Just-in-time decryption, ESS-protected | Copilot+ PC meeting Secured-core standard |

## What encryption actually protects your data?

Short answer: Microsoft added "just in time" decryption — Recall snapshots only decrypt and become accessible when you authenticate with Windows Hello Enhanced Sign-in Security. That means even if your laptop is stolen, the data on disk stays unreadable unless the attacker can pass biometric authentication.

Windows Hello enrollment is mandatory to turn Recall on, and viewing or searching your timeline requires "proof of presence" every time — so even someone sitting at your unlocked machine can't browse your history without re-authenticating.

## How reliable is the sensitive-content filtering?

Short answer: Microsoft automatically tries to detect and exclude certain sensitive data types — credit card numbers, passwords — from snapshots, but the filtering isn't perfect and organizations shouldn't treat it as a sole layer of defense. Because filtering is pattern-based, sensitive information in non-standard formats (say, a proprietary app's own financial data layout) can slip through.

If you're running Recall in an enterprise environment, defining explicit exclusion lists for which apps and windows get skipped entirely is more reliable than trusting the filter alone.

For example, if an in-house accounting app displays payroll data in its own custom layout, Recall's general pattern-recognition filter may not flag it as "sensitive financial data" — the format doesn't match the standard credit-card or IBAN patterns the filter was trained on. That gap is a real risk especially for companies running proprietary internal tools.

## What extra controls exist for enterprise environments?

Short answer: Microsoft gives IT admins Group Policy and Intune templates that restrict Recall by device, user group, or application, letting a company enable it only in specific departments or disable it entirely across the organization. Most companies in regulated industries (finance, healthcare) choose to keep Recall off organization-wide until compliance requirements are clearer.

The reason is straightforward: the search index Recall builds can surface a level of detailed user activity history that wouldn't normally be accessible in an e-discovery request or a data breach investigation. If a company's data retention policy says "delete after 90 days" but Recall data lives on its own separate lifecycle on the device, those two policies can conflict — IT teams need to explicitly reconcile them.

For teams managing a corporate device fleet, a practical checklist looks like this: deploy Recall off by default via policy template, grant exceptions only to employees who explicitly request it with a stated reason, and confirm Recall data can be remotely wiped in a lost-or-stolen device scenario. Those three steps cut most of the risk without giving up the feature's productivity benefit entirely.

## How do you disable Recall or scope it down?

Short answer: turn the feature off entirely from Settings > Privacy & security > Recall & snapshots, or exclude specific apps and websites from being captured; in enterprise environments, IT admins can disable Recall organization-wide via Group Policy or Intune. For individual users, the most practical approach is adding apps that handle sensitive workflows — banking, health records, legal documents — to the exclusion list.

For enterprise IT teams, Microsoft provides centralized policy templates that disable Recall by default and enable it only on explicitly approved devices, which stops employees from turning the feature on by personal preference on corporate hardware.

My honest take: the 2026 version of Recall is nowhere near as reckless as its 2024 debut — but the idea of a "searchable record of your life" is still fundamentally a trust question. No matter how strong the encryption, a feature that exists means someone will eventually try to access it, so the real question isn't "is Recall secure," it's "is this data worth keeping against the threat model you actually face."

For more on the privacy trade-offs of AI-powered OS features, see our [Technology category](/en/category/technology); for a comparison of how chat assistants store your history, see our [ChatGPT Computer History privacy guide](/en/posts/chatgpt-computer-history-privacy).

## Frequently Asked Questions

### Is Windows Recall on by default?

No. As of 2026, Recall ships off by default on new Copilot+ PCs; you must actively enable it from Settings > Privacy & security.

### What hardware do I need to use Recall?

Recall only runs on a Copilot+ PC that meets the Secured-core standard, which requires a dedicated Neural Processing Unit (NPU). The feature isn't available on standard Windows 11 machines.

### Is Recall data stored encrypted?

Yes. Microsoft uses "just in time" decryption, so snapshots only decrypt and become accessible after authenticating with Windows Hello Enhanced Sign-in Security — meaning the data stays unreadable even if the device is stolen, without authentication.

### How do I disable Recall in an enterprise environment?

IT admins can disable Recall organization-wide, or enable it only on explicitly approved devices, using centralized policy templates through Group Policy or Microsoft Intune — this prevents employees from turning the feature on by personal choice.
