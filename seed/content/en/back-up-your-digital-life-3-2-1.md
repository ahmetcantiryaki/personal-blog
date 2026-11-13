---
title: "Back Up Your Digital Life: A 3-2-1 Plan"
slug: "back-up-your-digital-life-3-2-1"
translationKey: "back-up-your-digital-life-3-2-1"
locale: "en"
excerpt: "The 3-2-1 rule means three copies, two kinds of storage, one copy kept offsite — it's the setup that actually survives loss, theft, and ransomware."
category: "technology"
tags: ["data-backup", "privacy", "scam-prevention", "smartphones"]
publishedAt: "2026-11-13"
seoTitle: "3-2-1 Backup Plan: Protect Your Digital Life"
seoDescription: "What is the 3-2-1 backup rule, is cloud sync a real backup, and how do you survive ransomware or account lockout? A practical setup for phone and PC."
---

Short answer: keep three copies of your data, store them on two different kinds of media, and keep one copy physically away from your home — that's the 3-2-1 rule. In practice it means your phone photos live on the device, in an encrypted cloud backup, and on an external drive you update regularly, with one of those copies periodically moved somewhere with no internet connection at all.

## What is the 3-2-1 backup rule?

The 3-2-1 rule is the standard recommended by [CISA](https://www.cisa.gov/back-government-data), the US cybersecurity agency: keep **three** copies of your important files, store them on **two** different types of media (an external drive and a cloud service, for example), and keep **one** of those copies physically offsite.

The logic is simple: any single storage medium carries a single point of failure. Rely only on the cloud and a locked account takes everything with it. Rely only on a drive sitting next to your laptop and a fire, theft, or hardware failure does the same. Three copies across two media make it statistically unlikely that two unrelated failures hit you at once.

A friend's phone fell into a pool last summer, and two years of his kids' photos existed in exactly one place — on that phone. No cloud backup, no computer copy. The repair shop couldn't recover the data. Since then, the only question I ask anyone about an important file is: how many copies of this exist right now, and where?

## Is cloud sync the same as a backup?

No, sync alone is not a backup. Sync keeps every copy of a file identical to every other copy; delete a file, or let ransomware encrypt it, and that change propagates to every synced copy within seconds. A real backup has to be independent of the live copy and recoverable to a point in the past.

Here's how the three common storage types compare:

| Storage type | Speed | Ransomware resistance | Cost | Best for |
|---|---|---|---|---|
| External drive (local) | Very fast | Low — stays encrypted too if it's attached when the attack hits | One-time, roughly $50–100 | Daily/weekly automated backups |
| Encrypted cloud backup | Medium | Medium-high, depends on version history | Monthly subscription | Access from anywhere, runs automatically |
| Cold/offline copy (disconnected drive) | Slow, manual | Very high — never connected during an attack | One-time | 2–4 times a year, disaster scenario |

A provider's "version history" or "recycle bin" feature gets closer to a real backup, but it has limits: an attacker with admin-level access to your account can purge version history and empty the recycle bin along with everything else. That's why an offline copy is the piece of the 3-2-1 plan that actually makes it ransomware-proof.

## How do you set up a practical 3-2-1 plan for phone and computer?

Split your three copies across the device itself, an automated encrypted cloud backup, and a regularly updated external drive or periodic cold copy.

### On your phone

Turn on automatic backup under Settings > [Your Name] > iCloud on iOS, or Settings > System > Backup on Android. Then, every three months, copy your photo and video folder to a computer or external drive by hand. Don't rely on the cloud backup alone — a suspended account or a forgotten password locks you out of it, which is one more reason our [guide to going passwordless with passkeys](/en/posts/going-passwordless-passkeys-2026) is worth reading: it cuts the account-lockout risk this plan still leaves open.

### On your computer

Use Time Machine on a Mac or File History on Windows to run automatic backups to an external drive. Add an encrypted cloud backup service on top — one that keeps real version history, not just a synced copy. Two to four times a year, copy one of those backups to a fully disconnected drive and store it in a drawer or a safe; that's your "1" offsite copy.

## How do you survive ransomware or an account lockout?

The strongest defense against ransomware is having at least one copy that was offline when the attack happened. Encryption malware can only reach files it can access, and a disconnected drive sits entirely outside that reach.

Cloud version history adds a real but limited second layer. Microsoft, for example, keeps deleted files in the recycle bin for 30 days on personal OneDrive accounts and 93 days on work or school accounts, with at least 500 versions retained per file ([Microsoft Tech Community](https://techcommunity.microsoft.com/blog/microsoft365insiderblog/the-best-backup-is-the-one-you-never-think-about/4506402), as of November 2026). Some ransomware strains, though, encrypt the file and then delete the original along with its version history — which is exactly why version history is an extra safety net, not a substitute for a backup.

| Account type | Recycle bin window | Versions kept |
|---|---|---|
| Personal OneDrive | 30 days | Varies by file |
| Work/school OneDrive | 93 days | At least 500 |

Build a recovery kit for account lockouts too: write down your account recovery codes, your backup service's password, and your two-factor backup codes on paper and keep it somewhere safe. For other privacy steps worth taking alongside this, see our [guide to protecting your privacy in the age of AI assistants](/en/posts/protect-privacy-ai-assistants).

## How do you know your backup actually works?

A backup you've never restored from is a hope, not a backup. At least every six months, pick a random file or photo folder and actually restore it from your backup to confirm it opens. Most people trust the "backup complete" notification and never run a real restore — then find out the drive was corrupted, or the cloud sync had been silently stuck for years, at exactly the wrong moment.

If you're curious whether deleted sensitive data — passwords, financial records — ever truly disappears from your own devices, our piece on [the real difference between soft and hard deletes](/en/posts/soft-deletes-vs-hard-deletes-getting-it-right) covers the same logic that applies to personal files. Honestly, almost nobody runs this restore test until after they've lost something; reading this and testing today means you skip that lesson the hard way.

If you run a server or a personal project's database, consumer backup habits aren't enough — see our [database backup and disaster recovery guide](/en/posts/database-backups-disaster-recovery) for that. If you also want to shrink your exposure elsewhere, our [guide to opting out of data brokers](/en/posts/opt-out-data-brokers-privacy-2026) and the broader [technology category](/en/category/technology) are good next stops.

## Frequently Asked Questions

### Is cloud sync like iCloud or Google Photos a real backup?

No, not by itself. Sync keeps every copy of a file identical, so deleting or encrypting one copy changes all the others within seconds. A real backup needs either an offline copy or a separate service that keeps genuine version history, independent of the live synced files.

### Where should the offsite copy in the 3-2-1 rule go?

Anywhere physically separate from your home: an office drawer, a relative's house, or a cloud provider's servers all work. The point is that a fire, flood, or theft at your home can't reach that copy too.

### Can ransomware encrypt my backups as well?

A backup that stays connected to your network can be encrypted along with everything else, which is exactly why a fully offline copy is the most critical piece of a 3-2-1 plan. Cloud version history helps, but an attacker with admin access to your account can delete that history too.

### How often should I test that my backup works?

At least every six months, restore a randomly chosen file from your backup and confirm it opens correctly. An untested backup is one you can't actually trust, and most data-loss horror stories trace back to a restore test that was never run.
