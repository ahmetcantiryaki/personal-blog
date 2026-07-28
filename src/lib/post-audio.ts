import manifest from '../../seed/content/audio-manifest.json'

/** One synthesized narration, as recorded in seed/content/audio-manifest.json. */
export interface AudioEntry {
  hash: string
  url: string
  seconds: number
  voice: string
  bytes: number
  generatedAt: string
}

const entries = manifest as Record<string, AudioEntry | undefined>

/**
 * Full manifest entry for a post's narration (url + byte size + duration), or
 * null when that post has no audio in this locale. The podcast feed needs the
 * `bytes`/`seconds` fields that `getPostAudioUrl` deliberately hides.
 */
export function getPostAudioEntry(slug: string, locale: string): AudioEntry | null {
  const entry = entries[`${locale}/${slug}`]
  if (!entry || !entry.url) return null
  return entry
}

/**
 * Resolves the narrated-audio MP3 URL for a post, if one exists.
 *
 * Audio is synthesized offline by src/scripts/generate-audio.mjs (Piper TTS),
 * hosted as GitHub Release assets, and indexed in seed/content/
 * audio-manifest.json keyed by `<locale>/<slug>`. The manifest is bundled at
 * build time, so this lookup is synchronous under the hood; the async
 * signature leaves room to move the index into the database later without
 * touching callers.
 */
export async function getPostAudioUrl(slug: string, locale: string): Promise<string | null> {
  const entry = entries[`${locale}/${slug}`]
  return entry?.url || null
}
