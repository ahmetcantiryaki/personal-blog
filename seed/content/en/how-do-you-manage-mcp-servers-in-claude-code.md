---
title: "How Do You Manage MCP Servers in Claude Code?"
slug: "how-do-you-manage-mcp-servers-in-claude-code"
translationKey: "claude-code-managed-mcp-servers"
locale: "en"
excerpt: "Short answer: deploy the managedMcpServers setting. Claude Code 2.1.259 lets admins push one fixed set of HTTP/SSE MCP servers to every user, no exceptions."
category: "ai"
tags: ["claude", "mcp", "compliance", "devops"]
publishedAt: "2026-09-06"
seoTitle: "How to Manage MCP Servers in Claude Code (2026)"
seoDescription: "What does Claude Code 2.1.259's managedMcpServers setting do? We cover fixed deployment, approved catalog and denylist patterns with a working JSON example."
---

Short answer: deploy the [`managedMcpServers` managed setting](https://code.claude.com/docs/en/managed-mcp). Shipped in Claude Code 2.1.259 on September 2, 2026, it lets an organization push one fixed set of HTTP or SSE MCP servers to every user's session; users can't add a different one through `.mcp.json`, and any entry that names a command to run is skipped automatically.

## What does the managedMcpServers setting actually do?

It injects an administrator-defined MCP server set into every user's session, using the exact same format as a project-level `.mcp.json`. The point is to move the "which MCP server do we trust" decision out of individual judgment and into a central policy. The setting only covers remote (HTTP/SSE) servers; local stdio entries that launch a command are silently skipped for safety.

A companion flag shipped in the same release: `--permission-prompts none`. On headless hosts with nobody watching, anything that would normally trigger an approval prompt is denied automatically, while the [active permission mode](/en/posts/claude-code-restricted-mode-explained) (including auto mode) keeps deciding everything else. Together, the two are built for CI runners and shared machines that run without a human in the loop. The full release notes live in the [Claude Code changelog](https://code.claude.com/docs/en/changelog).

## How many ways are there to restrict MCP server access?

Claude Code supports six restriction patterns, ranging from wide open to fully locked down. The table below is the one to bookmark when you're deciding which one fits your team.

| Pattern | What it does | How you configure it |
|---|---|---|
| Disable MCP entirely | No servers load except in-process ones | `managed-mcp.json` with an empty server map |
| Fixed deployment | Everyone gets the same servers, can't add others | `managed-mcp.json` with your servers listed |
| Approved catalog | Publish a list, users add what they want from it | `allowedMcpServers` + `allowManagedMcpServersOnly: true` |
| Plugin servers only | Blocks `.mcp.json` additions, plugin servers still load | `strictPluginOnlyCustomization` with `mcp` in the list |
| Soft allowlist | Users can broaden the list in their own settings | `allowedMcpServers` without `allowManagedMcpServersOnly` |
| Denylist only | Blocks known-bad servers, allows everything else | `deniedMcpServers` |

## Where does managed-mcp.json live and how does it behave?

The file sits at a fixed system path per OS and is typically deployed through device management tooling like Jamf, Group Policy, or Intune. On macOS that's `/Library/Application Support/ClaudeCode/managed-mcp.json`; on Linux and WSL, `/etc/claude-code/managed-mcp.json`; on Windows, `C:\Program Files\ClaudeCode\managed-mcp.json`. It's a standalone file, so it cannot be delivered through server-managed settings — you need write access to the system path itself.

Once the file is present, running `claude mcp add` fails with `Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers`. Servers a user had configured before the policy landed stop loading on their next session with no warning at all, so tell people what changed before you roll this out.

A minimal working config looks like this:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

Don't put credentials in `env` blocks — any user on the machine can read this file. Use `${VAR}` expansion so each user's own environment supplies the secret, or set up OAuth or per-user headers so each person authenticates as themselves.

## Should you pick a fixed deployment or an approved catalog?

It depends on team size and risk tolerance. A fixed deployment (`managed-mcp.json`) is the right call for regulated industries or large fleets where consistency matters more than flexibility — nobody can reach a server that isn't on the list. An approved catalog (`allowedMcpServers` plus `allowManagedMcpServersOnly: true`) is more practical for mid-size teams that still want developers to pick their own servers within a security boundary; users run `claude mcp add` themselves against anything on the published list.

`allowedMcpServers` and `deniedMcpServers` match servers by `serverUrl`, `serverCommand`, or `serverName`. `serverUrl` supports `*` wildcards and is case-insensitive on the hostname; `serverName` matches literally only and is not, by itself, a security control, since a user can name any server whatever they like. For anything that actually matters, match on `serverUrl` or `serverCommand` instead.

Here's what the approved-catalog pattern looks like in practice. The `allowManagedMcpServersOnly` line is what stops users from broadening the list in their own settings — only this list counts:

```json
{
  "allowManagedMcpServersOnly": true,
  "allowedMcpServers": [
    { "serverUrl": "https://api.githubcopilot.com/*" },
    { "serverUrl": "https://*.internal.example.com/*" }
  ],
  "deniedMcpServers": [
    { "serverName": "unverified-server" }
  ]
}
```

Server evaluation runs in three steps: first, the lists from every settings scope merge together; then the denylist is checked, and anything matching it is blocked with nothing able to override that; only then does the allowlist get checked. If `allowedMcpServers` isn't set anywhere, every server that passed the denylist loads; if it is set, only matching servers load.

## How do you monitor which MCP servers your organization actually uses?

With OpenTelemetry export configured, Claude Code can log which MCP servers and tools users actually invoke. Setting the `OTEL_LOG_TOOL_DETAILS=1` environment variable adds server and tool names to tool events; aggregate that data in your own collector and you'll see which servers get real use and which ones nobody ever touches. That's the most reliable input for growing or shrinking an approved catalog over time — deciding from actual usage instead of a guess.

My take: most companies jump straight to a fixed deployment on day one, and that's more friction than most teams need. Block the obviously risky servers with a denylist first, watch actual usage with `OTEL_LOG_TOOL_DETAILS=1`, then promote the three or four servers people actually use into an approved catalog. The staged-rollout logic in [wiring AI agents into your CI/CD safely](/en/posts/ai-agents-in-cicd-safely) applies just as well here.

## How do you verify the policy is actually in effect?

Two commands on a managed machine confirm it. First, run `claude mcp list` — it should show only the servers defined in `managed-mcp.json`. Second, try `claude mcp add --transport http test https://example.com/mcp`; it should fail with `Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers`. The URL doesn't need to point anywhere real, because the policy check rejects the command before it ever tries to connect.

That verification step matters most in self-hosted runner setups like the ones covered in [Claude Code Self-Hosted Environments](/en/posts/claude-code-self-hosted-environments), where cloud sessions give users no signal about which servers got left out — only a warning written to stderr.

## Frequently Asked Questions

### What's the difference between managedMcpServers and allowedMcpServers?

`managedMcpServers` (the `managed-mcp.json` file) enforces one fixed server set and blocks users from adding anything else at all. `allowedMcpServers` is a policy that filters servers users configure themselves through a published list. One is a deployment mechanism, the other is a gatekeeper — you can run both together.

### What happens when a user tries to reach a blocked MCP server?

Running `claude mcp add` against a blocked server returns a specific error naming the server. But if a server was already configured and policy blocks it afterward, it disappears silently from `/mcp` and `claude mcp list` with no warning at all, so admins need to communicate policy changes separately.

### Do claude.ai connectors still work alongside managed-mcp.json?

Not by default: deploying `managed-mcp.json` also suppresses the claude.ai connectors Claude Code fetches on its own. To load them alongside the managed set, set `allowAllClaudeAiMcps: true` in a managed settings source — server-managed settings or an MDM-deployed profile, since user or project settings can't re-enable it.

### Which Claude Code version do I need for managed MCP servers?

`managedMcpServers` and `--permission-prompts none` both shipped in Claude Code 2.1.259 on September 2, 2026. The environment-variable expansion behavior used in server matching rules requires 2.1.219 or later, so update first if you're running an older build.
