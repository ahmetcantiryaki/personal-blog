import path from 'path'
import { fileURLToPath } from 'url'

import config from '@payload-config'
import { getPayload } from 'payload'

import { seedAdmin } from './admin'
import { createMarkdownConverter } from './lexical'
import { loadArticleGroups } from './loader'
import { upsertArticle } from './upsert'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const contentDir = path.resolve(dirname, '../../seed/content')

const run = async (): Promise<void> => {
  const payload = await getPayload({ config })

  await seedAdmin(payload)

  const convert = await createMarkdownConverter(payload)
  const groups = await loadArticleGroups(contentDir)
  payload.logger.info(`seed: found ${groups.length} article group(s) in ${contentDir}`)

  for (const group of groups) {
    await upsertArticle(payload, convert, group)
    payload.logger.info(`seed: upserted "${group.translationKey}"`)
  }

  payload.logger.info('seed: completed successfully')
  process.exit(0)
}

try {
  await run()
} catch (error) {
  console.error('seed: failed', error)
  process.exit(1)
}
