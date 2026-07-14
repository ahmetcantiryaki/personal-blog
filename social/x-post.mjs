#!/usr/bin/env node
/**
 * Post a Woyable social draft to X as a thread.
 *
 *   node social/x-post.mjs drafts/2026-07-14-intro-thread.md --dry-run
 *   node social/x-post.mjs drafts/2026-07-14-intro-thread.md
 *
 * Draft format (see social/templates/post-formats.md): tweets are the text
 * under `**1/**`, `**2/**`, ... headers; the block under `**[REPLY]**` is
 * posted as the final reply (this is where the link lives — never in a main
 * tweet). Lines starting with `>` and the `# title` / `---` scaffolding are
 * ignored. Uses OAuth 1.0a user context against POST /2/tweets (free tier).
 */
import { createHmac, randomBytes } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')

function env(name) {
  const m = readFileSync(join(ROOT, '.env'), 'utf8').match(new RegExp(`^${name}=(.+)$`, 'm'))
  if (!m) throw new Error(`${name} missing from .env`)
  return m[1].trim()
}

const CREDS = {
  key: env('X_API_KEY'),
  secret: env('X_API_SECRET'),
  token: env('X_ACCESS_TOKEN'),
  tokenSecret: env('X_ACCESS_SECRET'),
}

const pct = (s) => encodeURIComponent(s).replace(/[!*'()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)

function oauthHeader(method, url) {
  const p = {
    oauth_consumer_key: CREDS.key,
    oauth_nonce: randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: CREDS.token,
    oauth_version: '1.0',
  }
  const base = [
    method,
    pct(url),
    pct(
      Object.keys(p)
        .sort()
        .map((k) => `${pct(k)}=${pct(p[k])}`)
        .join('&'),
    ),
  ].join('&')
  const signingKey = `${pct(CREDS.secret)}&${pct(CREDS.tokenSecret)}`
  p.oauth_signature = createHmac('sha1', signingKey).update(base).digest('base64')
  return (
    'OAuth ' +
    Object.keys(p)
      .sort()
      .map((k) => `${pct(k)}="${pct(p[k])}"`)
      .join(', ')
  )
}

async function postTweet(text, replyToId) {
  const url = 'https://api.x.com/2/tweets'
  const body = replyToId ? { text, reply: { in_reply_to_tweet_id: replyToId } } : { text }
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: oauthHeader('POST', url), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`)
  return data.data.id
}

export function parseDraft(md) {
  const normalized = md.replace(/\r\n/g, '\n')
  const tweets = []
  // Split on **N/** or **[REPLY]** markers; keep marker info.
  const re = /\*\*(\d+\/|\[REPLY\])\*\*\n([\s\S]*?)(?=\n\*\*(?:\d+\/|\[REPLY\])\*\*|$)/g
  let m
  while ((m = re.exec(normalized))) {
    const text = m[2]
      .split('\n')
      .filter((l) => !l.startsWith('>') && l.trim() !== '---')
      .join('\n')
      .trim()
    if (text) tweets.push({ marker: m[1], text })
  }
  return tweets
}

async function main() {
  const file = process.argv[2]
  const dryRun = process.argv.includes('--dry-run')
  if (!file) {
    console.log('Usage: node social/x-post.mjs <draft.md relative to social/> [--dry-run]')
    process.exit(1)
  }
  const path = join(ROOT, 'social', file)
  const tweets = parseDraft(readFileSync(path, 'utf8'))
  if (!tweets.length) throw new Error('No tweet blocks found in draft')

  let ok = true
  for (const t of tweets) {
    // t.co wraps every URL to 23 chars regardless of length.
    const effective = t.text.replace(/https?:\/\/\S+/g, 'x'.repeat(23)).length
    const flag = effective > 280 ? ' *** OVER 280 ***' : ''
    if (effective > 280) ok = false
    console.log(`[${t.marker}] ${effective} chars${flag}\n${t.text}\n`)
  }
  if (!ok) {
    console.error('Some tweets exceed 280 chars — fix the draft first.')
    process.exit(2)
  }
  if (dryRun) {
    console.log(`DRY RUN OK — ${tweets.length} tweets ready (${basename(path)})`)
    return
  }

  let lastId
  let firstId
  for (const t of tweets) {
    lastId = await postTweet(t.text, lastId)
    if (!firstId) firstId = lastId
    console.log(`posted ${t.marker} -> ${lastId}`)
    await new Promise((r) => setTimeout(r, 1500))
  }
  console.log(`\nTHREAD LIVE: https://x.com/ahmetcantryk/status/${firstId}`)
}

const isDirectRun =
  process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())
if (isDirectRun) {
  main().catch((err) => {
    console.error(err.message)
    process.exit(1)
  })
}
