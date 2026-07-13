import { describe, expect, it } from 'vitest'

import { isLikelyBot } from '@/lib/bot-detect'

const REAL_BROWSERS = [
  // Chrome on Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  // Safari on iPhone
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  // Firefox on macOS
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.5; rv:127.0) Gecko/20100101 Firefox/127.0',
  // Samsung Internet on Android
  'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36',
  // "Cubot" phone brand contains the letters b-o-t — must NOT be flagged
  'Mozilla/5.0 (Linux; Android 13; Cubot X70) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
]

const BOTS = [
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)',
  'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
  'Mozilla/5.0 (compatible; Claude-SearchBot/1.0)',
  'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
  'Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)',
  'CCBot/2.0 (https://commoncrawl.org/faq/)',
  'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)',
  'Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)',
  'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Chrome-Lighthouse',
  'curl/8.4.0',
  'python-requests/2.32.0',
  'axios/1.7.2',
  'Go-http-client/2.0',
  'UptimeRobot/2.0 (http://www.uptimerobot.com/)',
  'vercel-screenshot/1.0',
  'Twitterbot/1.0',
  'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
]

describe('isLikelyBot', () => {
  it.each(REAL_BROWSERS)('gerçek tarayıcıyı bot saymaz: %s', (ua) => {
    expect(isLikelyBot(ua)).toBe(false)
  })

  it.each(BOTS)('botu yakalar: %s', (ua) => {
    expect(isLikelyBot(ua)).toBe(true)
  })

  it('boş veya eksik user-agent bot sayılır', () => {
    expect(isLikelyBot(null)).toBe(true)
    expect(isLikelyBot(undefined)).toBe(true)
    expect(isLikelyBot('')).toBe(true)
    expect(isLikelyBot('   ')).toBe(true)
    expect(isLikelyBot('Mo')).toBe(true)
  })
})
