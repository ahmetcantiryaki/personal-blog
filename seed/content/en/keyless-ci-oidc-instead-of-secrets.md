---
title: "How Do You Set Up Keyless CI With OIDC?"
slug: "keyless-ci-oidc-instead-of-secrets"
translationKey: "keyless-ci-oidc-instead-of-secrets"
locale: "en"
excerpt: "Short answer: grant id-token: write, trust GitHub's OIDC issuer in a cloud role, and CI gets short-lived credentials instead of a stored long-lived key."
category: "devops-cloud"
tags: ["ci-cd", "aws", "authentication", "devops"]
publishedAt: "2026-11-10"
seoTitle: "Keyless CI: Set Up OIDC Instead of Long-Lived Secrets"
seoDescription: "How do you connect GitHub Actions to AWS without a long-lived key? Here's the OIDC federation setup, the sub claim, trust policy syntax, and common mistakes."
---

Short answer: add `permissions: id-token: write` to the workflow, configure a role in your cloud provider that trusts GitHub's OIDC issuer, and every run exchanges a signed token for credentials that expire in 15–60 minutes. No long-lived key ever touches the repository.

## Why Are Long-Lived Cloud Keys in CI a Security Risk?

Because once an `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` pair lands in repo secrets, it stays valid for months — sometimes years — until someone remembers to rotate it. A misbehaving step that logs the secret, a forked PR probing for access to secrets, or a compromised dependency hands whoever holds that key the full set of permissions attached to it.

OIDC federation flips the model: CI generates a signed JWT that proves its own identity, the cloud provider validates it against a trust policy configured in advance, and hands back credentials that expire within the hour. Even a stolen token is worthless within minutes of the run finishing.

## How Does GitHub Actions OIDC Federation Actually Work?

GitHub Actions automatically mints an OIDC token for every job, issued by `token.actions.githubusercontent.com`, confirmed in [GitHub's security hardening documentation](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect). The token carries separate `repository` and `ref` claims, plus a combined `sub` (subject) claim that defaults to `repo:ORG/REPO:ref:refs/heads/BRANCH`, or `repo:ORG/REPO:environment:ENV_NAME` when the job references a GitHub Environment. The environment claim is only populated when the job explicitly uses the `environment:` key.

The only setup required on the cloud side is registering `token.actions.githubusercontent.com` as an OIDC identity provider and writing a trust policy that states which `sub`/`aud` values are acceptable for a given role or service account. The workflow exchanges the token for that role at run time — no static key is stored anywhere.

## How Do You Connect GitHub Actions to AWS?

Three steps: register GitHub as an OIDC provider in AWS IAM, create an IAM role whose trust policy checks the token's `sub`/`aud` claims, and call `aws-actions/configure-aws-credentials` in the workflow with `permissions: id-token: write` set.

```yaml
permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/ci-deploy-role
          aws-region: eu-central-1
```

There is no static credential here besides `role-to-assume`; the action exchanges the token for temporary credentials via `sts:AssumeRoleWithWebIdentity` behind the scenes.

## How Do You Scope the Trust Policy to One Repo and Branch?

You lock it down by pinning `aud` to `sts.amazonaws.com` and `sub` to the exact repo-and-branch combination you want to trust — the sample configuration in [AWS Builder Center's GitHub-to-AWS guide](https://builder.aws.com/content/3KcAhcSWqRFsYQRrL2kiyhfDOmm/github-actions-to-aws-without-long-lived-keys) uses exactly this `StringEquals` pattern.

```json
{
  "Effect": "Allow",
  "Principal": { "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com" },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
      "token.actions.githubusercontent.com:sub": "repo:acme-corp/payments-api:ref:refs/heads/main"
    }
  }
}
```

| Property | Long-lived key | OIDC short-lived credential |
| --- | --- | --- |
| Validity window | Until rotated (often months or years) | 15–60 minutes |
| Rotation needed | Manual, frequently forgotten | None — reissued every run |
| Blast radius if leaked | Full account access for the key's lifetime | Scoped to one role, until the token expires |
| Audit trail | One long-lived identity, hard to distinguish in logs | A separate `AssumeRoleWithWebIdentity` event per run |

GCP implements the same pattern through Workload Identity Federation, and Azure through federated credentials — both follow the same principle: no stored secret, just token and claim verification.

## What Are the Most Common OIDC Mistakes?

The most common mistake is loosening the `sub` condition to a wildcard like `repo:acme-corp/*`, which lets any repository in the organization — including a run triggered by a forked PR — assume the same role. GitHub's 2026 rollout of immutable subject claims complicates this further: alongside the classic `repo:ORG/REPO:ref:...` pattern, subjects can now also arrive as `repo:ORG@ORG_ID/REPO@REPO_ID:ref:...`, so old wildcard conditions can silently stop matching new repositories. [AWS Builder Center's write-up on the change](https://builder.aws.com/content/3Gkby3FG8juxMqEXkwPzk5hsPz3/github-oidc-changes-that-can-break-aws-deployments/) recommends listing both the classic and ID-based formats in the condition during the transition.

The second common mistake is skipping the `aud` check. A trust policy that only checks `sub` is exposed to a token from any other GitHub organization sharing the same issuer; pinning `aud: sts.amazonaws.com` closes that gap. A third mistake is sharing one role across multiple pipelines — if a deploy workflow and a test workflow both assume the same role, a vulnerability in the test workflow can escalate directly into production deploy access.

## How Do You Audit an OIDC Setup?

A least-privilege checklist: pin `sub` to an exact repo-and-branch or repo-and-environment combination; only use a wildcard when multiple branches genuinely need to deploy, and keep the pattern as narrow as possible; scope each role to exactly what one workflow needs, never share one broad "ci-admin" role across pipelines; never skip the `aud` check.

For auditing, filter CloudTrail for `AssumeRoleWithWebIdentity` events against that role — each entry records which repo, branch, or environment the token came from, because the `sub` value lands directly in the event. A line from an unexpected repository or branch is the clearest sign the trust policy is too loose.

If you're [building a CI/CD pipeline from scratch](/en/posts/how-to-build-cicd-pipeline), wiring in OIDC from day one is far easier than retrofitting it later. For the rest of your secrets outside CI, see our [guide to secrets management in the cloud](/en/posts/cloud-secrets-management-done-right). If AI agents also touch your pipeline, [wiring AI agents into CI/CD safely](/en/posts/ai-agents-in-cicd-safely) covers the same least-privilege logic for agent identities. Browse the [full DevOps/Cloud category](/en/category/devops-cloud) for more.

OIDC itself rarely causes incidents — the real failure mode is leaving the `sub` condition loose with a "we'll tighten it later" note that nobody revisits.

## Frequently Asked Questions

### What is the sub claim in a GitHub Actions OIDC token?

The `sub` (subject) claim is a combined field identifying who issued the token; by default it's `repo:ORG/REPO:ref:refs/heads/BRANCH`, or `repo:ORG/REPO:environment:ENV_NAME` when a job uses a GitHub Environment. The trust policy on the cloud side checks this value so only runs from a specific repo, branch, or environment can assume the role.

### Why is OIDC more secure than long-lived AWS keys?

Because OIDC-issued credentials expire on their own within 15–60 minutes and get reissued on every CI run, so a leaked token has a very short window of use. A long-lived key, by contrast, grants full account access until someone notices and rotates it — often for months.

### What do you need to connect GitHub Actions to AWS with OIDC?

Three things: registering `token.actions.githubusercontent.com` as an OIDC identity provider in AWS IAM, creating an IAM role with a trust policy that checks the `sub`/`aud` claims, and setting `permissions: id-token: write` with the `aws-actions/configure-aws-credentials` action in the workflow. No static key is ever added to repo secrets.

### Is it safe to use a wildcard in the trust policy's sub condition?

Only when it's narrow and deliberate — for example, `repo:acme-corp/payments-api:ref:refs/heads/release-*` scoped to one repository's release branches. An organization-wide wildcard like `repo:acme-corp/*` defeats least privilege entirely, since it lets any repository in that organization assume the same role.
