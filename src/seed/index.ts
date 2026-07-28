import path from 'path'
import { fileURLToPath } from 'url'

import config from '@payload-config'
import { getPayload } from 'payload'

import { seedAdmin } from './admin'
import { seedArticles } from './articles'
import { createMarkdownConverter } from './lexical'
import { loadArticleGroups } from './loader'
import {
  isForceRequested,
  loadSeedManifest,
  saveSeedManifest,
  SEED_MANIFEST_FILENAME,
} from './manifest'
import { seedSiteSettings } from './siteSettings'
import { seedTaxonomy } from './taxonomy'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const contentDir = path.resolve(dirname, '../../seed/content')
const manifestPath = path.join(contentDir, SEED_MANIFEST_FILENAME)

const run = async (): Promise<void> => {
  const payload = await getPayload({ config })

  await seedAdmin(payload)
  await seedSiteSettings(payload)

  const taxonomy = await seedTaxonomy(payload)

  const convert = await createMarkdownConverter(payload)
  const groups = await loadArticleGroups(contentDir)
  payload.logger.info(`seed: found ${groups.length} article group(s) in ${contentDir}`)

  const force = isForceRequested(process.argv.slice(2), process.env)
  const manifest = force ? {} : await loadSeedManifest(manifestPath, payload.logger)
  if (force) {
    payload.logger.info('seed: --force / SEED_FORCE set — ignoring the manifest')
  }

  const summary = await seedArticles(payload, convert, groups, taxonomy, {
    manifest,
    force,
  })

  // Persisting the manifest only pays off where the filesystem survives the run
  // (a local `pnpm seed`, whose result should then be committed). On Vercel the
  // build filesystem is thrown away, so this write is a harmless no-op.
  const written = await saveSeedManifest(manifestPath, summary.manifest, payload.logger)
  if (written) {
    payload.logger.info(`seed: manifest written to ${manifestPath} — commit it to keep seeds cheap`)
  }

  payload.logger.info(
    `seed: completed successfully — ${summary.upserted} upserted, ${summary.skipped} unchanged`,
  )
  process.exit(0)
}

try {
  await run()
} catch (error) {
  console.error('seed: failed', error)
  process.exit(1)
}
