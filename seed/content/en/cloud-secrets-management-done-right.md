---
title: "Secrets Management in the Cloud, Done Right"
slug: "cloud-secrets-management-done-right"
translationKey: "secrets-management-cloud"
locale: "en"
excerpt: "Your .env file is a breach waiting to happen. Here is how SOPS, HashiCorp Vault, and dynamic short-lived credentials fix that the right way."
category: "devops-cloud"
tags: ["cloud", "devops", "best-practices", "infrastructure-as-code"]
publishedAt: "2026-07-13"
seoTitle: "Secrets Management in the Cloud, Done Right"
seoDescription: "Your .env file is a breach waiting to happen. Here is how SOPS, HashiCorp Vault, and dynamic short-lived credentials fix that the right way."
---

That `.env` file sitting in your repo root is a breach waiting to happen, it just has not happened yet. Plaintext API keys persist forever in git history, leak through a careless CI log line, or ride along in a screenshot someone posts to Slack. The real question is not whether it leaks. It is when, and whether anyone notices.

That claim sounds dramatic until you look at the mechanics. A `.env` file is written to disk in plaintext, one missed `.gitignore` entry bakes a secret into history forever, and even `git filter-repo` cannot fully undo the damage because forks and local clones already hold copies. An open terminal during a screen share, a debug flag that dumps environment variables into a CI log, a contractor who had repo access and moved on, all of it traces back to the same root cause: the secret lives in a file that is versioned like code, because it is code.

## Why .env files and committed secrets fail

The problem is not that someone might make a mistake. The system itself invites the mistake. Once a `.env` file gets caught by `git add .`, it becomes part of the codebase: it gets branched, merged, and potentially forked into a public repository. There is no rotation, because nobody centrally tracks which key is used where. There is no access control, because anyone with repo access can also read the production database password. There is no audit trail, because a file on disk cannot answer "who read this secret, and when."

The fix is a dedicated secrets layer that separates credentials from code, centralizes access control, and automates rotation.

## Managed options: cloud secret managers, Vault, and SOPS-encrypted git

Three approaches dominate, and in practice teams often combine them rather than picking one.

Cloud-native secret managers (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault) integrate with IAM, store secrets encrypted, and version them. For teams already committed to a single cloud, this is the lowest-friction option.

[HashiCorp Vault](https://www.vaultproject.io/) is the industry-standard centralized secrets manager. Beyond static secret storage, it can generate dynamic secrets, such as database credentials created on demand and automatically revoked after use or once their TTL expires, alongside fine-grained access policies, detailed audit logging, and automatic rotation. Here is the catch: plenty of teams adopt Vault as security theater. They stand up the server, migrate existing secrets into it, and never turn on dynamic secrets or rotation. What they end up with is all of Vault's operational overhead, running a highly available cluster, managing unseal keys, patching a new service, without the actual security benefit that justified the migration in the first place.

[Mozilla SOPS](https://github.com/getsops/sops) takes a different approach entirely. It is an editor and tool for encrypted files supporting YAML, JSON, ENV, INI, and BINARY formats, and it encrypts only the values, leaving keys in plaintext so diffs stay readable and code review stays meaningful. It uses envelope encryption: a random 256-bit data key encrypts the file content with AES256-GCM, and that data key is itself encrypted with a master key (AWS KMS, GCP KMS, Azure Key Vault, age, or PGP) and stored in the file's metadata. SOPS integrates naturally with GitOps tools like [Flux](https://fluxcd.io/flux/guides/mozilla-sops/) and Argo CD: encrypted secrets live safely in git and get decrypted only at deploy time. If your GitOps pipeline is not yet solid, our [GitOps explained](/en/posts/gitops-explained) piece is a good place to start.

## Short-lived dynamic credentials versus long-lived keys

The real shift here is moving from "store the key" thinking to "generate the key on demand" thinking. A long-lived static key stays valid from the moment it leaks until someone remembers to revoke it, and that window is often measured in weeks or months because nobody rotates keys on a schedule. Vault's dynamic secrets model inverts this: when a service needs to connect to a database, it requests a credential from Vault, Vault generates it on the spot, and it automatically expires once its TTL runs out or the task finishes. Leaks are still possible, but what leaks is only valid for hours, not for as long as anyone forgets to rotate it.

If you run Kubernetes, this pattern extends into the cluster through the External Secrets Operator (ESO): a central secrets store, whether that is Vault, a cloud KMS, or an alternative like Infisical, gets surfaced into Kubernetes Secrets through ESO, while SOPS is reserved specifically for encrypted config files that need to live in git for GitOps. As of July 2026, this combined pattern, rather than a single tool, is what most mature teams are converging on. If you are also managing a scaling cluster, our [Kubernetes autoscaling guide](/en/posts/kubernetes-autoscaling-guide) covers the adjacent infrastructure decisions.

## Automatic rotation and least privilege

Rotation does not mean "we manually swap keys every quarter." It means the system itself generates a new credential and invalidates the old one without a human in the loop. In Vault, this comes built in through rotation policies and dynamic secret engines. In cloud secret managers, it is typically wired up through a scheduled function trigger. In SOPS, rotation works differently: when the encrypted value changes, the file gets re-encrypted and the GitOps pipeline deploys the new value automatically, but the actual generation step still has to come from somewhere else.

On least privilege, the question to ask is simple: can this service reach more than it actually needs? Vault's policy engine lets you define, per token, which identity can access which path with which operation (read, write, list). Cloud IAM roles offer a similar model. Audit logs matter just as much here: if you cannot answer who read a given secret and when, you do not actually have least privilege, you only assume you do.

## Comparison

| Tool | Model | Best fit | Rotation support | Git-native? |
|---|---|---|---|---|
| Mozilla SOPS | Encrypts values in-file (envelope encryption) | GitOps-centric, smaller teams | Indirect; depends on re-encryption plus pipeline | Yes, encrypted secrets live in git |
| HashiCorp Vault | Centralized server, dynamic secret generation | Complex infrastructure, teams needing centralized audit | Built in, automatic (TTL-based) | No, runs as a separate service |
| Cloud secret manager (AWS/GCP/Azure) | Managed service, IAM-integrated | Single-cloud teams wanting low operational overhead | Built in, varies by provider | No, runs as a separate service |

## Example: a SOPS-encrypted config file

The example below uses placeholder values only. It is not a real key or credential.

```yaml
# secrets.enc.yaml (SOPS-encrypted, values only)
database:
    username: ENC[AES256_GCM,data:...,tag:...,type:str]
    password: ENC[AES256_GCM,data:...,tag:...,type:str]
sops:
    kms:
        - arn: arn:aws:kms:eu-west-1:000000000000:key/PLACEHOLDER-KEY-ID
    version: 3.8.1
```

And a Vault request for a dynamic database credential looks like this:

```bash
vault read database/creds/PLACEHOLDER-ROLE-NAME
# Lease ID:       database/creds/PLACEHOLDER-ROLE-NAME/PLACEHOLDER-LEASE-ID
# Lease Duration: 1h
# username:       PLACEHOLDER-GENERATED-USER
# password:       PLACEHOLDER-GENERATED-PASSWORD
```

For how these patterns fit into a broader production setup, see our [Docker best practices for production](/en/posts/docker-best-practices-production) guide, or browse our [DevOps & Cloud](/en/category/devops-cloud) category for more.

## Migration path: from .env to a secrets manager

1. Scan your repos and git history for `.env` files and hardcoded keys, including history, with a tool like `trufflehog`.
2. Pick a target based on team size and infrastructure complexity: SOPS for small, GitOps-centric teams; Vault or a cloud secret manager once you need dynamic secrets and centralized audit.
3. Update applications to pull from the secrets manager instead of reading environment variables directly; on Kubernetes, sync this into Secret objects through ESO.
4. Generate new credentials, cut applications over, then revoke the old keys. Never leave the old key active "to clean up later."
5. Add `.env` files to `.gitignore` and wire secret scanning into CI with pre-commit hooks.

Rotation checklist: assign an owner to every secret; define a TTL or rotation period; automate rotation instead of relying on a calendar reminder; log every access; periodically clean up unused secrets.

## Frequently Asked Questions

### Should I stop using .env files entirely?

For local development, a `.env.example` template with no real secrets, kept out of git via `.gitignore`, is fine. The problem is not the `.env` file itself, it is putting a real production secret in one and committing it.

### Should I choose SOPS or Vault?

If you are a small team already running GitOps, SOPS adds less operational overhead. If you need dynamic, short-lived credentials, or your infrastructure has grown complex enough to require centralized audit and rotation, Vault or a cloud secret manager is the better fit.

### Is standing up Vault enough on its own?

No. Installing Vault and migrating secrets into it only adds operational overhead unless you also turn on dynamic secrets and automatic rotation. The actual security benefit comes from replacing static keys with short-lived, automatically generated credentials, not from running the server.

### How do I apply least privilege on a small team?

Start by scoping each service to only the secrets it actually needs, and avoid a single service account that can read everything. Use path-based restrictions in cloud IAM roles or Vault policies, and review access logs regularly.
