import manifest from '../../seed/content/audio-manifest.json'

interface AudioEntry {
  hash: string
  url: string
  seconds: number
  voice: string
  bytes: number
  generatedAt: string
}

const entries = manifest as Record<string, AudioEntry | undefined>

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
