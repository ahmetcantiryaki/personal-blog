---
title: "What Is Anthropic's Cyber Verification Program?"
slug: "what-is-anthropic-cyber-verification-program"
translationKey: "anthropic-cyber-verification-program-2026"
locale: "en"
excerpt: "Short answer: a three-tier Anthropic system that relaxes Claude cyber safeguards for vetted security teams — Defense, Red Team, and Specialized Access."
category: "ai"
tags: ["claude", "web-security", "compliance", "ai-regulation"]
publishedAt: "2026-10-09"
seoTitle: "Anthropic Cyber Verification Program: Tiers Explained"
seoDescription: "Anthropic's expanded Cyber Verification Program (Oct 6, 2026) has three tiers — Defense, Red Team, Specialized — unlocking Claude's cyber work for vetted teams."
---

Short answer: the Cyber Verification Program (CVP) is Anthropic's vetting system that relaxes Claude's default cyber safeguards for verified security professionals. Announced October 6, 2026, it replaces the old all-or-nothing access model with three tiers — Defense, Red Team, and Specialized — and folds in the earlier Project Glasswing initiative.

## What is the Cyber Verification Program?

It's a verification process that lets qualifying security teams run offensive and defensive cyber work on Claude that the model would otherwise refuse. By default, Claude Opus 5.5, Sonnet 5.5, and other generally available models carry conservative classifiers that block most penetration-testing and exploit-development requests, precisely to limit misuse. CVP removes a graduated amount of that blocking once an organization proves who it is and what it's authorized to do — but prohibited activity, like deploying ransomware, stays blocked for every tier, verified or not.

## What are the three access tiers?

Each tier matches a different kind of work and carries its own review bar. Defense Access is the widest door; Specialized Access is the narrowest.

| Tier | Who qualifies | Typical work | Review time |
|---|---|---|---|
| Defense Access | Security teams, universities, critical-infrastructure operators, open-source maintainers, researchers with a vulnerability track record | SOC monitoring, incident response, malware reverse-engineering, vulnerability validation | A few days |
| Red Team Access | Organizations only — in-house and government red teams, authorized testing firms | Penetration testing and red-teaming on systems they're authorized to test | A few weeks (enrolled in Defense Access while waiting) |
| Specialized Access | A limited set of organizations reviewed jointly with the US government | Testing safety-critical systems: flight operations, power grids, telecom, interbank transfer rails | Full government-backed review |

Individual researchers can apply for Defense Access but are excluded from Red Team and Specialized Access — those two require an organizational affiliation.

## Which Claude models does CVP cover?

CVP applies to Claude Opus 5.5, Claude Sonnet 5.5, and Claude Mythos 5.1, plus any future model Anthropic adds to the program. Claude Fable 5.1 remains generally available with the standard conservative cyber safeguards outside CVP. Organizations that already hold zero-data-retention access to Fable 5.1 or Mythos 5.1 can use CVP under the same zero-retention terms until Enterprise Frontier Safeguards (EFS) ships later this fall — see our breakdown of [what EFS actually changes](/en/posts/what-is-anthropic-enterprise-frontier-safeguards).

## What happened to Project Glasswing?

Glasswing — the program that gave organizations securing critical software trusted access to Claude Mythos — is retired as a standalone track and merged into CVP, according to [Anthropic's own announcement](https://www.anthropic.com/news/cyber-verification-program). Existing Glasswing members move straight into Specialized Access without reapplying for current models. Anthropic says the program mattered in practice: Glasswing partners surfaced **at least 129,000 verified software vulnerabilities between April and July 2026**, and Anthropic's own open-source scanning found another 5,500 between April and October. More than 33,000 of the combined total are rated critical or high severity, and Anthropic calls that an undercount — fewer than half of partners reported patch numbers, and the company expects the true count to run at least five times higher. Several partners told Anthropic that Mythos access had sped up their own vulnerability-finding work by months, in some cases years, compared with their prior manual process.

## How much cyber work does each tier actually unblock?

Anthropic tested Claude Opus 5.5 on CyScenarioBench, a benchmark of 10 multi-stage cyber operations run five times each per tier (50 trials per tier), to show the practical gap between tiers.

| Access level | Trials blocked | Trials completed |
|---|---|---|
| No CVP access | 50 of 50 | 0 of 50 |
| Defense Access | 46 of 50 | 4 of 50 |
| Red Team Access | 0 of 50 | 34 of 50 |

Red Team Access produces the same 68% completion rate the model hits with no safeguards at all — which is also representative of what Specialized Access unlocks. That's a 34-point jump in completed trials between Defense and Red Team, not a gradual slope, so picking the right tier for your actual work matters more than it might look from the names alone.

## How do you apply for CVP access?

Apply through the CVP portal at `portal.anthropic.com/programs/cvp`. Anthropic verifies the applicant and requests proof of the security controls that match the requested tier — a SOC-2 report for Defense Access, scoped authorization letters for Red Team Access, government sign-off for Specialized Access. Once approved, a workspace admin has to explicitly assign the program to the relevant workspace; access isn't automatic account-wide. CVP currently runs on the Claude Platform, Google Cloud Vertex AI, and Microsoft Foundry; Amazon Bedrock access is limited to customers who also qualify for EFS. If a verified team gets blocked on work their tier should allow, Anthropic's false-positive report form is the fix, not a support ticket. [Coverage of the rollout by SiliconANGLE](https://siliconangle.com/?p=849593) and other outlets largely agrees on these mechanics, though model-naming details vary enough between secondary sources that the portal page itself is the one to trust on specifics.

## Is loosening Claude's cyber safeguards actually safe?

The honest tension here is real: the same capability that helps a red team find a flaw before an attacker does is the capability an attacker would want. Anthropic's bet is that mandatory data retention for every CVP tier — so misuse can be traced after the fact — plus strict eligibility review is a reasonable trade for faster vulnerability discovery at scale. The 129,000-vulnerability number from Glasswing alone suggests the trade is paying off operationally; whether the vetting process itself stays tight enough as more teams apply is the part worth watching, not the concept.

CVP sits next to Anthropic's broader threat-response work — our coverage of [Anthropic's 2026 threat intelligence report](/en/posts/anthropic-2026-threat-intelligence-report) and [the fourth Claude cybersecurity incident](/en/posts/claude-fourth-unauthorized-access-incident) both show the same pattern: more capable models get both more dangerous and more useful for defense at the same time, and the safeguard conversation moves with them. The vulnerability-discovery numbers here also echo a related problem on the other side of the fence — see [how AI slop is straining open-source security review](/en/posts/ai-slop-open-source-security).

## Frequently Asked Questions

### What is Anthropic's Cyber Verification Program?

It's a three-tier vetting system — Defense, Red Team, and Specialized Access — that relaxes Claude's default cyber safeguards for verified security professionals on Claude Opus 5.5, Sonnet 5.5, and Mythos 5.1. It launched October 6, 2026, and absorbed the earlier Project Glasswing program.

### Who can apply for Defense Access?

Security teams at companies, nonprofits, universities, and government bodies; critical-infrastructure operators; smaller security firms; open-source maintainers; and individual researchers with a track record of reported vulnerabilities. Anthropic aims to respond within a few days.

### Can an individual researcher get Red Team or Specialized Access?

No. Both tiers require an organizational affiliation — Red Team Access is limited to in-house or government red teams and authorized testing firms, and Specialized Access requires a joint review with the US government for safety-critical systems.

### Does CVP let Claude do anything with no restrictions at all?

No. Prohibited activity, such as deploying ransomware or causing physical harm, stays blocked at every tier regardless of verification status. CVP widens what legitimate security work is possible; it does not remove Anthropic's hard limits.
