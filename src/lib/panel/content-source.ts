import 'server-only'

import { readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'

import type { Locale } from '@/i18n/config'
import { isValidSlug } from '@/lib/panel/content-guard'

/**
 * Read/write the SOURCE markdown for a post body.
 *
 * Post content lives in `seed/content/<locale>/<slug>.md`, and every Vercel
 * deploy runs `pnpm seed`, which overwrites the DB from those files. So the
 * panel must edit the source and commit it to GitHub — the push triggers a
 * deploy+seed that propagates the change to the live site. Direct DB edits are
 * reverted on the next deploy.
 *
 * Source selection:
 *  - `GITHUB_TOKEN` set  → GitHub Contents API (works on Vercel, commits to main).
 *  - no token, file on disk → local filesystem (dev convenience, no git ops).
 *  - neither → throw a clear Turkish error asking the user to set GITHUB_TOKEN.
 *
 * The token is never logged or returned.
 */

const GITHUB_OWNER = 'ahmetcantiryaki'
const GITHUB_REPO = 'personal-blog'
const GITHUB_BRANCH = 'main'
const GITHUB_API = 'https://api.github.com'

export type ContentSource = 'github' | 'fs'

export interface ReadPostMarkdownArgs {
  locale: Locale
  slug: string
}

export interface ReadPostMarkdownResult {
  markdown: string
  sha: string | null
  source: ContentSource
}

export interface WritePostMarkdownArgs {
  locale: Locale
  slug: string
  markdown: string
  sha?: string | null
  message?: string
}

export interface WritePostMarkdownResult {
  source: ContentSource
  sha: string | null
}

/** Repo-relative path used both as the GitHub API path and the local FS path. */
function contentPath(locale: Locale, slug: string): string {
  if (!isValidSlug(slug)) {
    throw new Error('Geçersiz slug: yalnızca küçük harf, rakam ve tire kullanılabilir.')
  }
  return `seed/content/${locale}/${slug}.md`
}

function localFsPath(locale: Locale, slug: string): string {
  return path.resolve(process.cwd(), contentPath(locale, slug))
}

function hasToken(): boolean {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim() !== '')
}

function githubHeaders(): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function fileExistsOnDisk(locale: Locale, slug: string): Promise<boolean> {
  try {
    await access(localFsPath(locale, slug))
    return true
  } catch {
    return false
  }
}

function missingSourceError(): Error {
  return new Error(
    'İçerik kaynağına ulaşılamıyor. Uzak (GitHub) yazma için GITHUB_TOKEN ortam ' +
      'değişkenini ayarlayın veya dosyayı yerel geliştirme ortamında düzenleyin.',
  )
}

// --- GitHub Contents API ---------------------------------------------------

interface GithubContentResponse {
  content?: string
  sha?: string
  encoding?: string
}

async function githubRead(locale: Locale, slug: string): Promise<ReadPostMarkdownResult> {
  const url = `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${contentPath(locale, slug)}?ref=${GITHUB_BRANCH}`
  const res = await fetch(url, { headers: githubHeaders(), cache: 'no-store' })

  if (res.status === 404) {
    return { markdown: '', sha: null, source: 'github' }
  }
  if (!res.ok) {
    throw new Error(`GitHub içerik okuma başarısız (HTTP ${res.status}).`)
  }

  const body = (await res.json()) as GithubContentResponse
  const encoded = body.content ?? ''
  const markdown = Buffer.from(encoded, 'base64').toString('utf8')
  return { markdown, sha: body.sha ?? null, source: 'github' }
}

async function githubWrite(args: WritePostMarkdownArgs): Promise<WritePostMarkdownResult> {
  const { locale, slug, markdown, sha, message } = args
  const url = `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${contentPath(locale, slug)}`
  const commitMessage = message ?? `content: edit ${slug} [${locale}] via panel`

  const payload: Record<string, string> = {
    message: commitMessage,
    content: Buffer.from(markdown, 'utf8').toString('base64'),
    branch: GITHUB_BRANCH,
  }
  if (sha) payload.sha = sha

  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...githubHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!res.ok) {
    // 409 typically means a stale sha (someone else committed meanwhile).
    if (res.status === 409) {
      throw new Error('İçerik bu sırada değişmiş. Sayfayı yenileyip tekrar deneyin.')
    }
    throw new Error(`GitHub commit başarısız (HTTP ${res.status}).`)
  }

  const body = (await res.json()) as { content?: { sha?: string } }
  return { source: 'github', sha: body.content?.sha ?? null }
}

// --- Local filesystem ------------------------------------------------------

async function fsRead(locale: Locale, slug: string): Promise<ReadPostMarkdownResult> {
  try {
    const markdown = await readFile(localFsPath(locale, slug), 'utf8')
    return { markdown, sha: null, source: 'fs' }
  } catch {
    return { markdown: '', sha: null, source: 'fs' }
  }
}

async function fsWrite(args: WritePostMarkdownArgs): Promise<WritePostMarkdownResult> {
  await writeFile(localFsPath(args.locale, args.slug), args.markdown, 'utf8')
  return { source: 'fs', sha: null }
}

// --- Public API ------------------------------------------------------------

export async function readPostMarkdown(
  args: ReadPostMarkdownArgs,
): Promise<ReadPostMarkdownResult> {
  const { locale, slug } = args
  if (hasToken()) return githubRead(locale, slug)
  if (await fileExistsOnDisk(locale, slug)) return fsRead(locale, slug)
  // No token and no local file: return an empty shell so the editor can still
  // render a warning instead of crashing the page.
  return { markdown: '', sha: null, source: 'fs' }
}

export async function writePostMarkdown(
  args: WritePostMarkdownArgs,
): Promise<WritePostMarkdownResult> {
  if (hasToken()) return githubWrite(args)
  if (await fileExistsOnDisk(args.locale, args.slug)) return fsWrite(args)
  throw missingSourceError()
}
