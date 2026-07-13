/**
 * Heuristic user-agent bot detection for analytics endpoints.
 *
 * View counts must reflect humans: AI crawlers (GPTBot, ClaudeBot,
 * PerplexityBot, Bytespider…), search engines, SEO tools, link previewers,
 * uptime monitors, headless browsers and HTTP libraries all self-identify in
 * the user-agent and are dropped before a view is recorded. Compliant search
 * bots already skip /api/* via robots.txt; this catches the ones that render
 * JavaScript or ignore robots.txt.
 */

const BOT_SIGNATURES = [
  // Search engines
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandex',
  'seznambot',
  'applebot',
  'petalbot',
  // AI / LLM crawlers and assistants
  'gptbot',
  'oai-searchbot',
  'chatgpt-user',
  'claudebot',
  'claude-web',
  'claude-searchbot',
  'anthropic-ai',
  'perplexitybot',
  'perplexity-user',
  'google-extended',
  'bytespider',
  'ccbot',
  'cohere-ai',
  'meta-externalagent',
  'amazonbot',
  'diffbot',
  // SEO / marketing crawlers
  'semrushbot',
  'ahrefs',
  'mj12bot',
  'dotbot',
  'rogerbot',
  'screaming frog',
  // Social link previewers
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'discordbot',
  'telegrambot',
  'slackbot',
  'whatsapp',
  'skypeuripreview',
  'pinterestbot',
  'redditbot',
  'embedly',
  // Headless browsers / test & audit tooling
  'headlesschrome',
  'phantomjs',
  'puppeteer',
  'playwright',
  'selenium',
  'lighthouse',
  'pagespeed',
  'gtmetrix',
  // Monitors and platform pingers
  'pingdom',
  'uptimerobot',
  'statuscake',
  'site24x7',
  'vercel-screenshot',
  'vercel-favicon',
  // HTTP libraries
  'curl/',
  'wget/',
  'python-requests',
  'python-urllib',
  'aiohttp',
  'httpx/',
  'scrapy',
  'okhttp',
  'go-http-client',
  'node-fetch',
  'undici',
  'axios/',
  'java/',
  'libwww',
] as const

const SIGNATURE_PATTERN = new RegExp(
  BOT_SIGNATURES.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'i',
)

// Generic fallback: "bot"/"crawler"/"spider"/"scraper" as a standalone token.
// The leading non-letter guard keeps device names like "Cubot" from matching.
const GENERIC_PATTERN = /(?:^|[^a-z])(?:bot|crawler|crawling|spider|scraper)(?![a-z])/i

/** True when the user-agent is missing, degenerate, or matches a known bot. */
export const isLikelyBot = (userAgent: string | null | undefined): boolean => {
  const ua = userAgent?.trim() ?? ''
  if (ua.length < 4) return true
  return SIGNATURE_PATTERN.test(ua) || GENERIC_PATTERN.test(ua)
}
