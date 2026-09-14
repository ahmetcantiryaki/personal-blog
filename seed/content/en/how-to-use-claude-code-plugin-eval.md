---
title: "How to Use Claude Code's plugin eval Command"
slug: "how-to-use-claude-code-plugin-eval"
translationKey: "claude-code-plugin-eval-explained"
locale: "en"
excerpt: "claude plugin eval runs your Claude Code plugin against real prompts three times, compares it to a no-plugin baseline, and gates CI on the score."
category: "ai"
tags: ["claude", "ai-coding", "testing", "developer-experience"]
publishedAt: "2026-09-14"
seoTitle: "How to Use Claude Code's plugin eval Command (2026)"
seoDescription: "Claude Code v2.1.269 shipped claude plugin eval. Here's how the six grader types, the no-plugin baseline, and CI gating actually work in practice."
---

Short answer: `claude plugin eval` runs your Claude Code plugin against real user prompts three times, compares the result to the same prompt with no plugin loaded, and scores the difference as Δ. It went generally available in Claude Code 2.1.269 on September 11, 2026, and `claude plugin eval init` can write you a working test suite in a few minutes.

Before this command, there was no way to prove a plugin or skill actually helped — you could only say "it worked when I tried it." `claude plugin eval` answers three concrete questions instead: does the skill trigger on natural phrasing, does it survive an edit or a new model, and does it beat the bare model with no plugin at all?

## What does claude plugin eval actually do?

The command runs the test cases in your plugin's `evals/` directory and scores each one with one or more graders. A case is a realistic prompt a user might type, plus at least one grader — a regex check, a tool-call assertion, or a rubric a second model votes on.

You don't have to write cases by hand: `claude plugin eval init` reads your plugin, asks what prompts should and shouldn't trigger each skill, designs graders, pilots them once, and writes the files under `evals/`.

## Why does the no-plugin baseline matter?

A high score alone doesn't prove the plugin helped — Claude might produce the same answer without it. To separate the two, each case runs twice by default: once with the plugin loaded (`WITH`) and once without it (`W/OUT`). The difference, `Δ`, is what the plugin actually contributed.

```text
CASE        WITH  W/OUT Δ      RUNS COST    NOTES
first-case  1.00  0.33  +0.67  6    $0.41

1 case(s) · mean Δ +0.67 · 74s · $0.41
Report: /Users/you/my-plugin/evals/results/2026-09-10T17-02-11-482Z/report.html
```

If a case scores 1.00 in both arms, the plugin isn't what made it pass. A `Δ` near zero with the case's `tool_used: Skill` grader failing usually means the skill's `description` doesn't trigger on that phrasing — suspect the description before the grader.

## What do the six grader types check?

Four graders — `regex`, `tool_used`, `tool_order`, `file_exists` — are computed from the transcript and files and cost nothing; `llm` and `baseline` call a judge model and add to the run's cost. `tool_used` checks how many times a tool was called and, optionally, whether its input matches a regex; `llm` asks a judge model for a PASS/FAIL vote on a plain-language rubric, with at least two of three votes deciding the verdict.

| Grader | What it checks | Cost |
|---|---|---|
| `regex` | Pattern match in transcript or file | Free |
| `tool_used` | Whether a tool was called, with what input | Free |
| `tool_order` | The order two tools were called in | Free |
| `file_exists` | Whether a file was created at a path | Free |
| `llm` | Judge-model vote on a free-text rubric | Model call |
| `baseline` | Comparison against a reference transcript | Model call |

For long outputs, such as a generated file, a `regex` grader gives a far more stable signal than an `llm` grader — a judge model can score the same text slightly differently between runs.

## How do you gate CI on the score?

The `--threshold` flag sets the minimum score a case needs to pass (default 1.0); any case that falls short exits the command with code 1. `--trust-plugin` skips the first-run trust prompt in CI, and `--max-cost-usd` caps the run's list-price cost estimate.

```bash
claude plugin eval . \
  --trust-plugin \
  --json results.json \
  --threshold 0.8 \
  --model claude-sonnet-5 \
  --judge-model claude-haiku-4-5 \
  --no-publish \
  --max-cost-usd 20
```

This writes `results.json` for archiving, pins both the model under test and the judge model so scores stay comparable over time, and keeps the report local. Exit code 0 means every case cleared the threshold; exit code 2 means the cost ceiling or an auth failure cut the run short.

## Why does this matter for [Claude Code subagents](/en/posts/claude-code-subagents-background-agents) and [Claude Skills](/en/posts/claude-skills-explained-for-everyone)?

Skills and subagents live or die on whether they trigger correctly: a poorly worded `description` means Claude may never call the skill at all. Until now, the only way to test that was trial and error. The `tool_used: Skill` grader turns "did this skill fire on the right phrasing" into an automated check. Teams building an [MCP connector](/en/posts/build-your-first-mcp-connector) can also mock MCP tools instead of running the real server — drop a file under `evals/mocks/<server>/<tool>.md` and the case answers from it.

My honest take: the real value here isn't the score table, it's that this command pushes plugin changes into the same "trust, but verify" discipline we already apply to [AI code review](/en/posts/ai-code-review-trust-but-verify). Shipping a skill to production without gating it in CI is the same risk class as deploying a function with no tests.

## What do you need to run it?

You need Claude Code 2.1.269 or later, a plugin directory with a `plugin.json` manifest, and the same authentication your normal Claude Code sessions use. Every run makes a real model call, so it counts against your plan's usage limits or API bill; when the command reports a cost, that figure is a list-price estimate.

| Step | Command |
|---|---|
| Check version | `claude --version` |
| Update | `claude update` |
| Generate cases | `claude plugin eval init` |
| Run the suite | `claude plugin eval .` |
| Single case, single run | `claude plugin eval . --case <name> --runs 1 --ablation none` |

## Frequently Asked Questions

### Is claude plugin eval free to run?

No, not entirely. The `regex`, `tool_used`, `tool_order`, and `file_exists` graders are computed and cost nothing, but every case run is a real model call that counts against your plan's usage limits or API bill, and `llm` or `baseline` graders add a further judge-model call on top.

### Can I turn off the no-plugin baseline?

Yes. Pass `--ablation none` to run only the with-plugin arm, which halves the cost. Use it when you don't need the `Δ` comparison, such as while you're still iterating on graders.

### How do I enforce claude plugin eval in CI?

Set a minimum score with `--threshold`, skip the trust prompt with `--trust-plugin`, cap spend with `--max-cost-usd`, and write the result with `--json results.json`. Any case that falls below the threshold exits the command with code 1, which fails the CI job automatically.

### Which Claude Code version added this command?

Claude Code 2.1.269 and later, since September 11, 2026. An older version returns an "early access" error; run `claude update` and try again in a fresh session.
