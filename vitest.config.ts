import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vitest/config'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(rootDir, 'src')

/**
 * Vitest configuration for unit/integration tests of the pure logic in
 * `src/lib`, `src/i18n`, and `src/seed`. No real database or Payload instance is
 * used: `@payload-config`, the `payload` package and `server-only` are aliased
 * to lightweight stubs so DB-touching modules import cleanly and are exercised
 * against a mocked Payload client (`tests/unit/helpers/payload-mock.ts`).
 */
export default defineConfig({
  resolve: {
    alias: [
      { find: '@payload-config', replacement: path.resolve(rootDir, 'tests/unit/stubs/payload-config.ts') },
      { find: 'server-only', replacement: path.resolve(rootDir, 'tests/unit/stubs/empty.ts') },
      { find: /^payload$/, replacement: path.resolve(rootDir, 'tests/unit/stubs/payload-pkg.ts') },
      { find: '@', replacement: srcDir },
    ],
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json-summary', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/lib/**', 'src/i18n/**'],
      // Client-only React hook (covered by e2e) and thin, side-effectful wrappers
      // that only exist to bind the real Payload/font runtime are excluded — they
      // carry no branching logic to unit test.
      exclude: ['src/lib/use-current-user.ts', 'src/lib/fonts.ts', 'src/lib/payload.ts'],
    },
  },
})
