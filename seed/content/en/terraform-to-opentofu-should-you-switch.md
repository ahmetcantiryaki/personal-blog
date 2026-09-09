---
title: "Terraform to OpenTofu: Should You Switch?"
slug: "terraform-to-opentofu-should-you-switch"
translationKey: "terraform-to-opentofu-migration-2026"
locale: "en"
excerpt: "Switch if you need built-in state encryption or want to stay on a CNCF-governed, MPL-licensed tool; stay on Terraform if you depend on HCP-only features."
category: "devops-cloud"
tags: ["terraform", "infrastructure-as-code", "devops", "open-source"]
publishedAt: "2026-09-09"
seoTitle: "Terraform to OpenTofu: Should You Switch in 2026?"
seoDescription: "Switch if you need built-in state encryption or want to stay on a CNCF-governed, MPL-licensed tool; stay on Terraform if you depend on HCP-only features."
---

Short answer: switch to OpenTofu if you want built-in state encryption, a permissive MPL 2.0 license, or governance outside a single vendor — the migration is usually a same-day drop-in for most codebases. Stay on Terraform if your team is locked into HCP Terraform's managed features or a provider that hasn't shipped an OpenTofu-compatible release yet.

## Why did OpenTofu fork from Terraform?

OpenTofu exists because HashiCorp moved Terraform from the open MPL 2.0 license to the Business Source License (BSL) in August 2023. The BSL restricts using Terraform to build a competing commercial offering — for example, reselling it as a managed SaaS — while leaving normal internal use, including by consultancies and cloud providers, fully permitted.

A group of vendors and maintainers who depend on Terraform's ecosystem — including Gruntwork, Spacelift, env0, Harness, and Scalr — forked the last MPL-licensed commit and founded OpenTofu to guarantee a permanently open alternative. The Linux Foundation now hosts the project, and it was accepted into the CNCF in April 2025, putting its governance under a Technical Steering Committee rather than one company's product roadmap.

## What can OpenTofu do that Terraform can't?

OpenTofu has shipped several features that never landed in open-source Terraform, the most consequential being client-side state encryption.

| Feature | OpenTofu | Terraform (open source) |
|---|---|---|
| State encryption (client-side, before it leaves your machine) | Yes, since v1.7 | No |
| Early variable evaluation (in `count`, `for_each`, backend config) | Yes, since v1.8 | No |
| `for_each` on provider blocks | Yes, since v1.9 | No |
| `-exclude` flag for targeted plans | Yes, since v1.9 | No |
| OCI registry support for providers/modules | Yes, since v1.10 | No |
| License | MPL 2.0 | Business Source License |
| Governance | Linux Foundation / CNCF, community TSC | HashiCorp (IBM) |

State encryption matters because a `.tfstate` file routinely contains database passwords, API keys, and private IPs in plain text. OpenTofu encrypts it before it's written to disk or a remote backend:

```hcl
terraform {
  encryption {
    key_provider "pbkdf2" "mykey" {
      passphrase = var.state_encryption_passphrase
    }
    method "aes_gcm" "example" {
      keys = key_provider.pbkdf2.mykey
    }
    state {
      method = method.aes_gcm.example
    }
  }
}
```

## Does OpenTofu have full feature parity with Terraform?

For the vast majority of everyday HCL — resources, modules, providers, state management, workspaces — yes, parity is close enough that most configurations run unmodified. As of August 2026, OpenTofu's stable release is v1.12.6, and the two tools have genuinely diverged rather than being the same binary under a different name: OpenTofu now counts more than 3,900 providers and 23,600 modules in its registry.

Where you'll hit gaps is HashiCorp's commercial layer, not the core language. HCP Terraform's managed run environment, Sentinel policy-as-code, and some newer HCP-only integrations have no OpenTofu equivalent, because those live in HashiCorp's paid product rather than the open-source core both tools started from.

Provider compatibility is the other place parity can slip. Most major providers — AWS, Google Cloud, Azure, Kubernetes — publish builds that work identically under both CLIs, since the provider protocol itself didn't change. Smaller or newer providers, especially ones maintained by a single vendor for their own SaaS product, sometimes lag: they test and certify against Terraform first and OpenTofu compatibility follows weeks or months later, if the maintainer bothers to test against it at all.

## How do you migrate to OpenTofu?

For most repositories, the migration is a rename, not a rewrite, because `tofu` reads existing `.tf` files and `.tfstate` files without conversion.

```bash
# 1. Install the tofu CLI alongside terraform
brew install opentofu

# 2. Run tofu against your existing state — no migration flag needed
tofu init
tofu plan

# 3. If the plan matches terraform plan exactly, you're done
tofu apply
```

The gotchas worth checking before you commit to the switch: any custom provider you maintain in-house needs to publish (or already have) a build compatible with OpenTofu's registry; any CI pipeline hardcoding `terraform` binary paths needs updating to `tofu`; and if you use HCP Terraform as your remote backend, you'll need to move state to an OpenTofu-compatible backend such as Spacelift, Scalr, or S3 with native locking first.

Run the migration as a side-by-side comparison rather than a cutover: keep both binaries installed, run `tofu plan` next to your existing `terraform plan` on the same state for a week or two of normal changes, and only remove the `terraform` binary from CI once the plans have matched consistently. That gives you a rollback path if a provider or module behaves unexpectedly under OpenTofu's evaluation order, which is rare but not impossible given the two tools have been diverging since 2023.

## When should you stay on Terraform?

Stay on Terraform if your organization already pays for HCP Terraform and relies on Sentinel policies, private module registry UI, or run-task integrations you'd otherwise have to rebuild elsewhere. Also stay if a critical provider in your stack — often true for newer or niche cloud services — hasn't published an OpenTofu-verified release, since community-maintained provider mirrors can lag behind HashiCorp's official ones by weeks.

If neither of those applies and you're running plain open-source Terraform today, the honest opinion here is that there's little reason left not to switch: you get an MPL license, community governance, and features like state encryption for the cost of an afternoon's testing.

For a broader infrastructure-as-code comparison rather than this fork-specific decision, see [our Terraform vs Pulumi breakdown](/en/posts/terraform-vs-pulumi). If you're rebuilding your deployment pipeline around either tool, [our CI/CD pipeline guide](/en/posts/how-to-build-cicd-pipeline) and [our blue-green vs canary deployments piece](/en/posts/blue-green-vs-canary-deployments) cover the release-strategy side. More infrastructure coverage is in [our DevOps & Cloud category](/en/category/devops-cloud).

Sources: [OpenTofu's official blog](https://opentofu.org/blog/), [HashiCorp's licensing FAQ](https://www.hashicorp.com/en/license-faq), and the [OpenTofu GitHub releases page](https://github.com/opentofu/opentofu/releases).

## Frequently Asked Questions

### Is OpenTofu a drop-in replacement for Terraform?

For the vast majority of `.tf` configurations, yes — `tofu init` and `tofu plan` work directly against existing Terraform state files with no conversion step. The exceptions are HCP Terraform's managed features (Sentinel, run tasks, hosted state) and providers that haven't published an OpenTofu-compatible build.

### Does OpenTofu cost anything?

No. OpenTofu is free and MPL 2.0-licensed with no paid tier of the core tool itself. Companies like Spacelift, Scalr, and env0 sell commercial platforms built around it, but the CLI and registry are free.

### Can I use my existing Terraform state file with OpenTofu?

Yes. OpenTofu reads standard `.tfstate` files without any migration command — `tofu init` followed by `tofu plan` against your existing backend is usually all that's needed to confirm compatibility before switching your team over.

### Why did companies like Gruntwork and Spacelift fork Terraform instead of just using it under the new license?

The Business Source License restricts building a competing commercial offering on top of Terraform, which directly affected vendors selling Terraform-adjacent products. Forking the last MPL-licensed version under Linux Foundation governance guaranteed those companies, and the wider community, a permanently open license going forward.
