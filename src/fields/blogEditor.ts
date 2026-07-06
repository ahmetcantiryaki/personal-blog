import { BlocksFeature, CodeBlock, lexicalEditor } from '@payloadcms/richtext-lexical'

/**
 * Languages the fenced-code block accepts. The premade CodeBlock validates its
 * `language` against this map (a `select`), so it MUST include every info-string
 * used in the seeded content — the defaults omit common aliases like `bash`,
 * `js`, `ts`, `tsx`, `jsx`, `text`, `json`, plus a few niche ones (`promql`,
 * `http`, `astro`). Missing keys make the seed fail with
 * "Content > Language is invalid".
 */
const CODE_LANGUAGES: Record<string, string> = {
  text: 'Plain Text',
  bash: 'Bash',
  shell: 'Shell',
  json: 'JSON',
  yaml: 'YAML',
  javascript: 'JavaScript',
  js: 'JavaScript',
  jsx: 'JSX',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  tsx: 'TSX',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  python: 'Python',
  sql: 'SQL',
  graphql: 'GraphQL',
  dockerfile: 'Dockerfile',
  hcl: 'HCL',
  http: 'HTTP',
  markdown: 'Markdown',
  promql: 'PromQL',
  astro: 'Astro',
  go: 'Go',
  rust: 'Rust',
}

/**
 * The blog's lexical editor: default features plus a fenced-code block.
 *
 * Exported as a single shared instance so BOTH the admin editor (payload.config)
 * and the seed's markdown→lexical converter build from the exact same feature
 * set. The converter previously used `editorConfigFactory.default()`, which
 * returns the *default* features (no code block) and re-parsed ``` fences as
 * markdown — turning `# comment` lines into stray <h1> headings. Reusing this
 * instance via `editorConfigFactory.fromEditor()` keeps them in lock-step.
 */
export const blogEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    BlocksFeature({ blocks: [CodeBlock({ languages: CODE_LANGUAGES })] }),
  ],
})
