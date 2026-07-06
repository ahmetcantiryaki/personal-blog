import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, devices } from '@playwright/test'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

/**
 * Minimal .env parser (no dotenv dependency): KEY=VALUE lines, `#` comments.
 * Values already present in process.env win.
 */
function loadDotEnv(): Record<string, string> {
  const env: Record<string, string> = {}
  try {
    const raw = readFileSync(path.join(rootDir, '.env'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (!match || line.trim().startsWith('#')) continue
      env[match[1]] = match[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    // .env may be absent in CI — rely on process.env there.
  }
  return env
}

const dotEnv = loadDotEnv()
const PORT = Number(process.env.PORT || 3000)
const BASE_URL = `http://localhost:${PORT}`

// The Supabase session pooler caps clients at 15; the transaction pooler is the
// safe target for a running app + parallel test traffic.
const databaseUri =
  process.env.DATABASE_URI_TRANSACTION ||
  dotEnv.DATABASE_URI_TRANSACTION ||
  process.env.DATABASE_URI ||
  dotEnv.DATABASE_URI ||
  ''

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  // Modest worker count: every page render hits Supabase through the pooler.
  workers: 4,
  retries: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Serve the PRODUCTION build (`next build` must have run beforehand).
    command: `npx next start --port ${PORT}`,
    url: `${BASE_URL}/tr`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...dotEnv,
      ...(process.env as Record<string, string>),
      DATABASE_URI: databaseUri,
      NODE_OPTIONS: '--no-deprecation',
      PORT: String(PORT),
    },
  },
})
