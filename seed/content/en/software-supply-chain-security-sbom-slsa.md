---
title: "Software Supply Chain Security: SBOM to SLSA"
slug: "software-supply-chain-security-sbom-slsa"
translationKey: "supply-chain-security-sbom"
locale: "en"
excerpt: "Over 454,000 new malicious packages surfaced in 2025. Here's how SBOM+VEX, Sigstore signing, and SLSA provenance stop a poisoned dependency in CI."
category: "devops-cloud"
tags: ["web-security", "ci-cd", "open-source", "devops"]
publishedAt: "2026-07-19"
seoTitle: "Software Supply Chain Security: SBOM, Sigstore, SLSA"
seoDescription: "Could a poisoned dependency reach your production system? How SBOM+VEX, cosign signing, and SLSA build provenance close the gap, with a CI checklist."
---

Yes, and the only thing stopping it right now is probably luck. Sonatype identified more than 454,000 new malicious packages in 2025 alone. The defense is three layers deep: enrich your SBOM with VEX, sign artifacts with Sigstore, and make build provenance verifiable with SLSA.

The moment you run `npm install`, you implicitly trust the package's author, that the account wasn't hijacked, and that the build chain producing it is intact. As of July 2026, supply chain attacks are a cheaper, stealthier entry point than zero-days, because most defenses still rest on "we trust our dependencies" rather than any way to verify it.

## How bad is the threat landscape, really?

Sonatype's [2026 State of the Software Supply Chain report](https://www.sonatype.com/state-of-the-software-supply-chain/2026/open-source-malware), published January 28, 2026, lays out the numbers: more than 454,600 NEW malicious packages were identified during 2025 alone, pushing the CUMULATIVE total of known or blocked malicious packages across npm, PyPI, Maven Central, NuGet, and Hugging Face past 1.233 million. Over 99% of open-source malware occurs on npm, making the JavaScript ecosystem attackers' most efficient target by a wide margin.

Scale itself is part of the risk. Total downloads across the four largest registries reached 9.8 trillion in 2025, up 67% year-over-year, as automation and AI coding accelerate consumption. State-linked actors, the Lazarus Group a notable example per Sonatype, have moved from simple droppers and crypto-miners to five-stage chains combining droppers, credential theft, and persistent remote access.

The AI angle adds a distinct risk layer. In an analysis of 37,000 AI coding-assistant recommendations, GPT-5 hallucinated component versions 27.8% of the time and, without real-time package intelligence, sometimes suggested packages that were themselves malware. If an AI agent drafts your `package.json`, SBOM and provenance checks stop being nice-to-haves — the assumption that a human reads every line no longer holds.

## Why isn't an SBOM alone enough, and where does VEX fit in?

An SBOM (Software Bill of Materials) is a static inventory listing every component, version, and license inside your software. CycloneDX and SPDX are the two dominant formats. The problem: scan an SBOM against a CVE database and you typically get hundreds of "matches," most of which pose no real risk because the affected code path never actually executes in your build. Security teams drown in that noise, and the odds of missing a genuine emergency go up accordingly.

VEX (Vulnerability Exploitability eXchange) exists precisely to solve this. A VEX document declares whether a component listed in the SBOM is actually exploitable in your build against a given CVE, using statuses like "affected," "not_affected," "fixed," or "under_investigation." It turns a static inventory into a dynamic risk assessment, separating "this is technically on the list" from "this genuinely threatens us" and freeing the security team's time for CVEs that actually matter.

| Approach | What it provides | What it's missing |
|---|---|---|
| Static SBOM (inventory only) | Component list, version, license | No exploitability context, high false-positive rate |
| SBOM + VEX | Which CVEs actually affect you | No proof of who built the artifact or how |
| SBOM + VEX + signing (Sigstore) | Cryptographic proof the artifact wasn't tampered with | No full traceability from source to artifact |
| SBOM + VEX + signing + SLSA provenance | End-to-end verifiable supply chain | Requires sustained discipline, not a one-time setup |

## How does artifact signing with Sigstore actually work?

Traditional code signing requires safeguarding a long-lived private key — leak it, and every signature you've ever produced becomes suspect. [Sigstore](https://www.sigstore.dev/) solves this with keyless signing, and it's a CNCF-graduated, production-ready toolchain at this point. It has three components: **cosign** signs artifacts (container images, binaries, SBOMs); **Fulcio** acts as a short-lived certificate authority, issuing a certificate tied to your OIDC identity that's valid for minutes before it's discarded; **Rekor** writes every signature to a public, immutable transparency log. The result: you can prove an artifact was genuinely signed by your CI system without anyone ever managing a private key.

Sigstore is not a niche tool anymore. Kubernetes, npm's provenance feature, and PyPI's trusted publishing mechanism are all built on top of it. A typical signing step in GitHub Actions looks like this:

```yaml
# .github/workflows/release.yml
- name: Generate SBOM
  run: syft packages dir:. -o cyclonedx-json > sbom.json

- name: Sign artifact with cosign (keyless)
  run: |
    cosign sign-blob --yes \
      --output-signature app.sig \
      --output-certificate app.pem \
      dist/app.tar.gz

- name: Verify signature (consumer side)
  run: |
    cosign verify-blob \
      --certificate app.pem \
      --signature app.sig \
      --certificate-identity-regexp "https://github.com/ORG/REPO/.*" \
      --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
      dist/app.tar.gz
```

The critical detail is the `--certificate-identity-regexp` and `--certificate-oidc-issuer` flags: verification isn't answering "does a signature exist," it's answering "did the exact CI workflow I expect issue this signature." If you're [building a CI/CD pipeline from scratch](/en/posts/how-to-build-cicd-pipeline), wiring this in from day one is cheaper than retrofitting it later.

## What does build provenance via SLSA actually guarantee?

Sigstore proves the artifact's integrity, but it doesn't prove *which source code, built on which system,* produced that artifact. That's what [SLSA](https://slsa.dev/) (Supply-chain Levels for Software Artifacts) provides — a levels-based framework that makes the source-to-artifact chain verifiable:

| SLSA level | What it guarantees |
|---|---|
| SLSA 1 | Build process is documented; provenance is generated but unverified |
| SLSA 2 | Signed provenance; produced by version control and a build service |
| SLSA 3 | Isolated, hardened build platform; extra protection against tampering |
| SLSA 4 (proposed) | Two-person review plus hermetic, reproducible builds |

In practice, a consumer can cryptographically verify whether a container image was built by the GitHub Actions workflow it claims, from the commit it claims. Even if an attacker compromises your CI environment and injects a malicious build, the mismatch between the provenance record and the actual source becomes detectable. This dovetails with the declarative, auditable deployment philosophy behind [GitOps](/en/posts/gitops-explained) — combine the two and you get provable answers to both "what is being deployed" and "how was it built."

My honestly opinionated take here: chasing SLSA 3 in one leap is a waste of most teams' time. Producing and consuming signed provenance at SLSA 2, running that stable for a few months, and then moving to an isolated build platform creates far less friction than trying to jump straight to the top level.

## How do you wire this into CI? A hardening checklist

None of these tools work in isolation; together they form a layered defense. A reasonable CI hardening checklist as of July 2026:

- Generate an SBOM automatically on every build (with tools like Syft or cdxgen), in CycloneDX or SPDX format.
- Don't let the SBOM go stale: set up a process that updates VEX documents as new CVEs land.
- Sign every release artifact keylessly with cosign; verify the signature against Rekor.
- Make `cosign verify` a mandatory gate in the deploy pipeline before release, not an optional check.
- Ensure your build system emits SLSA provenance (official generators like `slsa-github-generator` exist for GitHub Actions).
- Run automated malicious-package scanning on every dependency-addition or update PR (tools like Sonatype or Socket).
- Route dependencies an AI agent suggests through real-time package intelligence before human approval, every time.
- Keep secrets out of the CI environment entirely; prefer OIDC-based keyless flows over long-lived signing keys.

Secrets management is inseparable from this checklist — the signing process itself can collapse the moment a leaked credential is involved. That's why getting [cloud secrets management](/en/posts/cloud-secrets-management-done-right) right belongs on the prerequisite list, not treated as a separate concern. For a wider view of how AI agents reshape dependency risk, our pieces on [AI slop breaking open-source security](/en/posts/ai-slop-open-source-security) and [agentjacking attacks](/en/posts/agentjacking-ai-agent-attack) targeting the agents themselves are useful companion reads. Browse the [DevOps & Cloud](/en/category/devops-cloud) category for more.

## Frequently Asked Questions

### What's the difference between an SBOM and a VEX document?

An SBOM is a static list of the components and versions inside a piece of software, typically in CycloneDX or SPDX format. A VEX document is a dynamic statement about which of those components are actually exploitable in your build for a given CVE. An SBOM alone tends to generate noise; SBOM plus VEX lets a security team focus on the risks that are real.

### Why doesn't Sigstore require a private key?

Sigstore's cosign tool uses keyless signing: the Fulcio certificate authority issues a short-lived certificate tied to your OIDC identity (say, a GitHub Actions workflow identity) that expires within minutes, and signing happens with that certificate. You never store, rotate, or worry about leaking a long-lived private key. Every signature is written to the Rekor transparency log, where anyone can verify it.

### What's the difference between SLSA levels, and which one should I target?

SLSA 1 only requires the build process to be documented. SLSA 2 requires signed provenance from version-controlled source and a build service. SLSA 3 requires an isolated, hardened build platform with tamper protection. For most teams, SLSA 2 is the realistic starting point: get a CI system producing and consuming signed provenance, run it stably for a few months, then move to SLSA 3. That creates far less friction than aiming for the top level immediately.

### How are AI coding assistants increasing supply chain risk?

In an analysis of 37,000 AI code suggestions, GPT-5 hallucinated component versions 27.8% of the time and, without real-time package intelligence, sometimes recommended packages that were actual malware. If an AI agent is editing your `package.json` or `requirements.txt`, screening every newly suggested dependency against real-time malicious-package intelligence before human approval is no longer optional.
