// @ts-nocheck
/**
 * twitter-studio.mjs — SADECE LOKAL Twitter/X paylaşım stüdyosu.
 *
 * Çalıştır:  node src/scripts/twitter-studio.mjs
 * Aç:        http://localhost:4322
 *
 * Mevcut yazıları (seed/content/<locale>/*.md) listeler; birini seçince X'e
 * yapıştırmaya hazır çıktıyı verir:
 *   • Kapak görseli (public/covers/<translationKey>.jpg) — önizleme + dosyayı aç.
 *   • Başlık — 100 karakter sayacı, aşınca kırmızı uyarı (X makale başlığı sınırı).
 *   • İçerik — markdown'dan düz metne çevrilir: tablolar
 *     `| a | b |` / `| --- | --- |` pipe formatında KORUNUR (copy-paste'te
 *     kaybolmasın diye), kalın/italik işaretleri temizlenir, iç linkler
 *     https://woyable.com mutlak URL'lerine çevrilir.
 *
 * Prod ile hiçbir bağı yoktur; hiçbir şey yazmaz, sadece okur.
 */

import http from 'node:http'
import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const contentDir = path.join(projectRoot, 'seed', 'content')
const coversDir = path.join(projectRoot, 'public', 'covers')

const PORT = 4322
const HOST = '127.0.0.1' // yalnızca localhost — dışarıya açılmaz
const SITE = 'https://woyable.com'
const TITLE_LIMIT = 100

// --- front matter parser (seed formatıyla aynı sözleşme) ---------------------
const parseFrontMatter = (raw) => {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { meta: {}, body: raw }
  const meta = {}
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i === -1) continue
    const key = line.slice(0, i).trim()
    let v = line.slice(i + 1).trim()
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1)
    meta[key] = v
  }
  return { meta, body: raw.slice(m[0].length) }
}

// --- yazı kataloğu ------------------------------------------------------------
const loadPosts = async (locale) => {
  const dir = path.join(contentDir, locale)
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md'))
  const posts = []
  for (const file of files) {
    const raw = await readFile(path.join(dir, file), 'utf8')
    const { meta } = parseFrontMatter(raw)
    posts.push({
      file,
      slug: meta.slug || file.replace(/\.md$/, ''),
      title: meta.title || file,
      translationKey: meta.translationKey || '',
      excerpt: meta.excerpt || '',
      publishedAt: meta.publishedAt || '',
      category: meta.category || '',
      hasCover: meta.translationKey
        ? existsSync(path.join(coversDir, `${meta.translationKey}.jpg`))
        : false,
    })
  }
  posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  return posts
}

// --- markdown → X'e yapıştırılabilir düz metin --------------------------------
const isTableLine = (l) => /^\s*\|.*\|\s*$/.test(l)
const isSeparatorLine = (l) => /^\s*\|(\s*:?-{3,}:?\s*\|)+\s*$/.test(l)

const cleanInline = (s) =>
  s
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1') // görseller → alt metin
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
      const abs = url.startsWith('/') ? SITE + url : url
      return text === abs ? abs : `${text} (${abs})`
    })
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(^|\s)\*([^*\s][^*]*)\*/g, '$1$2')
    .replace(/(^|\s)_([^_\s][^_]*)_/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1')

const normalizeTableRow = (l) =>
  '| ' +
  l
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => cleanInline(c.trim()))
    .join(' | ') +
  ' |'

const separatorFor = (l) => {
  const cols = l.trim().replace(/^\||\|$/g, '').split('|').length
  return '| ' + Array(cols).fill('---').join(' | ') + ' |'
}

export const convertForX = (body) => {
  const out = []
  const lines = body.split(/\r?\n/)
  let inCode = false
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inCode = !inCode
      out.push(inCode ? '' : '') // fence satırlarını at, blok boşlukla ayrılsın
      continue
    }
    if (inCode) {
      out.push(line) // kod satırları olduğu gibi
      continue
    }
    if (isSeparatorLine(line)) {
      out.push(separatorFor(line))
      continue
    }
    if (isTableLine(line)) {
      out.push(normalizeTableRow(line))
      continue
    }
    const h = line.match(/^(#{2,6})\s+(.*)$/)
    if (h) {
      out.push('')
      out.push(cleanInline(h[2]).toUpperCase())
      continue
    }
    if (/^\s*[-*]\s+/.test(line)) {
      out.push('• ' + cleanInline(line.replace(/^\s*[-*]\s+/, '')))
      continue
    }
    out.push(cleanInline(line))
  }
  // 3+ boş satırı teke indir
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

// --- HTTP ----------------------------------------------------------------------
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const json = (res, code, data) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(data))
}

const PAGE = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><title>Woyable · Twitter Studio</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root{--bg:#fdfcf9;--fg:#2b2926;--muted:#8a857d;--line:#e8e4dc;--accent:#2f7d78;--danger:#b3402e}
  *{box-sizing:border-box}body{margin:0;font:15px/1.5 system-ui,sans-serif;background:var(--bg);color:var(--fg)}
  header{padding:14px 20px;border-bottom:1px solid var(--line);display:flex;gap:14px;align-items:center}
  header h1{font-size:16px;margin:0}
  main{display:grid;grid-template-columns:360px 1fr;min-height:calc(100vh - 53px)}
  #list{border-right:1px solid var(--line);overflow-y:auto;max-height:calc(100vh - 53px)}
  #search{width:100%;padding:10px 12px;border:0;border-bottom:1px solid var(--line);background:transparent;font:inherit;outline:none}
  .row{display:flex;gap:10px;padding:10px 12px;border-bottom:1px solid var(--line);cursor:pointer;align-items:center}
  .row:hover,.row.active{background:#f3f0e9}
  .row img{width:72px;height:40px;object-fit:cover;border-radius:4px;background:#eee}
  .row .noimg{width:72px;height:40px;border-radius:4px;background:#efece5;color:var(--muted);display:flex;align-items:center;justify-content:center;font-size:10px}
  .row b{font-size:13px;font-weight:600;display:block}
  .row small{color:var(--muted)}
  #detail{padding:20px 24px;overflow-y:auto;max-height:calc(100vh - 53px)}
  #detail .placeholder{color:var(--muted);padding-top:40px;text-align:center}
  .cover{max-width:560px;width:100%;border-radius:8px;border:1px solid var(--line);display:block}
  .nocover{max-width:560px;padding:30px;border:1px dashed var(--line);border-radius:8px;color:var(--muted);text-align:center}
  label{display:block;margin:18px 0 6px;font-weight:600;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
  input[type=text]{width:100%;max-width:720px;padding:10px 12px;border:1px solid var(--line);border-radius:8px;font:inherit;background:#fff}
  textarea{width:100%;max-width:720px;height:420px;padding:12px;border:1px solid var(--line);border-radius:8px;font:13px/1.5 ui-monospace,Consolas,monospace;background:#fff;resize:vertical}
  .count{font-size:12px;color:var(--muted);margin-top:4px}
  .count.over{color:var(--danger);font-weight:700}
  button{padding:8px 14px;border:1px solid var(--line);border-radius:8px;background:#fff;font:inherit;cursor:pointer;margin:8px 8px 0 0}
  button:hover{border-color:var(--accent);color:var(--accent)}
  button.copied{background:var(--accent);color:#fff;border-color:var(--accent)}
  .meta{color:var(--muted);font-size:13px;margin-top:6px}
  .locale-toggle{margin-left:auto;display:flex;gap:6px}
  .locale-toggle button{margin:0}
  .locale-toggle button.on{background:var(--accent);color:#fff;border-color:var(--accent)}
</style></head><body>
<header><h1>🐦 Woyable · Twitter Studio</h1>
  <span class="meta">yazıyı seç → başlığı ve tablolu içeriği tek tıkla kopyala</span>
  <div class="locale-toggle"><button id="tr" class="on">TR</button><button id="en">EN</button></div>
</header>
<main>
  <div id="list"><input id="search" placeholder="Ara: başlık / key / kategori…"><div id="rows"></div></div>
  <div id="detail"><div class="placeholder">← Soldan bir yazı seç</div></div>
</main>
<script>
let posts = [], locale = 'tr', activeSlug = null
const $ = (s) => document.querySelector(s)

async function load() {
  posts = await (await fetch('/api/posts?locale=' + locale)).json()
  renderList()
}
function renderList() {
  const q = $('#search').value.toLowerCase()
  const rows = posts.filter(p => (p.title + p.translationKey + p.category).toLowerCase().includes(q))
  $('#rows').innerHTML = rows.map(p => \`
    <div class="row \${p.slug === activeSlug ? 'active' : ''}" data-slug="\${p.slug}">
      \${p.hasCover ? \`<img src="/covers/\${p.translationKey}.jpg" loading="lazy">\` : '<div class="noimg">SVG</div>'}
      <div><b>\${p.title}</b><small>\${p.publishedAt} · \${p.category}</small></div>
    </div>\`).join('')
  document.querySelectorAll('.row').forEach(r => r.onclick = () => open(r.dataset.slug))
}
async function open(slug) {
  activeSlug = slug
  renderList()
  const d = await (await fetch('/api/post?locale=' + locale + '&slug=' + encodeURIComponent(slug))).json()
  const over = d.title.length > ${TITLE_LIMIT}
  $('#detail').innerHTML = \`
    <label>Kapak</label>
    \${d.hasCover
      ? \`<img class="cover" src="/covers/\${d.translationKey}.jpg">
         <div class="meta">\${d.coverPath} — X'e görsel olarak bu dosyayı yükle</div>
         <button onclick="copyText(this, '\${d.coverAbs.replace(/\\\\/g, '\\\\\\\\')}')">Dosya yolunu kopyala</button>\`
      : '<div class="nocover">Bu yazının jpg kapağı yok (SVG fallback kullanılıyor)</div>'}
    <label>Başlık</label>
    <input type="text" id="title" value="\${d.title.replace(/"/g, '&quot;')}">
    <div class="count \${over ? 'over' : ''}" id="titleCount"></div>
    <button onclick="copyText(this, $('#title').value)">Başlığı kopyala</button>
    <label>İçerik (tablolar pipe formatında korunur)</label>
    <textarea id="content">\${d.content.replace(/</g, '&lt;')}</textarea>
    <div class="count" id="contentCount"></div>
    <button onclick="copyText(this, $('#content').value)">İçeriği kopyala</button>
    <div class="meta">Canlı: <a href="\${d.url}" target="_blank">\${d.url}</a></div>\`
  const upd = () => {
    const t = $('#title').value
    $('#titleCount').textContent = t.length + ' / ${TITLE_LIMIT} karakter' + (t.length > ${TITLE_LIMIT} ? ' — SINIRI AŞTIN' : '')
    $('#titleCount').className = 'count' + (t.length > ${TITLE_LIMIT} ? ' over' : '')
    $('#contentCount').textContent = $('#content').value.length + ' karakter'
  }
  $('#title').oninput = upd
  $('#content').oninput = upd
  upd()
}
async function copyText(btn, text) {
  await navigator.clipboard.writeText(text)
  const old = btn.textContent
  btn.textContent = 'Kopyalandı ✓'
  btn.classList.add('copied')
  setTimeout(() => { btn.textContent = old; btn.classList.remove('copied') }, 1400)
}
$('#search').oninput = renderList
$('#tr').onclick = () => setLocale('tr')
$('#en').onclick = () => setLocale('en')
function setLocale(l) {
  locale = l; activeSlug = null
  $('#tr').classList.toggle('on', l === 'tr')
  $('#en').classList.toggle('on', l === 'en')
  $('#detail').innerHTML = '<div class="placeholder">← Soldan bir yazı seç</div>'
  load()
}
load()
</script></body></html>`

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}:${PORT}`)
    if (url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(PAGE)
    }
    if (url.pathname === '/api/posts') {
      const locale = url.searchParams.get('locale') === 'en' ? 'en' : 'tr'
      return json(res, 200, await loadPosts(locale))
    }
    if (url.pathname === '/api/post') {
      const locale = url.searchParams.get('locale') === 'en' ? 'en' : 'tr'
      const slug = url.searchParams.get('slug') || ''
      const file = path.join(contentDir, locale, slug + '.md')
      if (!slug || slug.includes('..') || slug.includes('/') || !existsSync(file)) {
        return json(res, 404, { error: 'yazı bulunamadı' })
      }
      const raw = await readFile(file, 'utf8')
      const { meta, body } = parseFrontMatter(raw)
      const key = meta.translationKey || ''
      const coverAbs = path.join(coversDir, `${key}.jpg`)
      return json(res, 200, {
        title: meta.title || slug,
        translationKey: key,
        hasCover: key ? existsSync(coverAbs) : false,
        coverPath: `public/covers/${key}.jpg`,
        coverAbs,
        url: `${SITE}/${locale}/posts/${meta.slug || slug}`,
        content: convertForX(body),
      })
    }
    if (url.pathname.startsWith('/covers/')) {
      const name = path.basename(url.pathname)
      const file = path.join(coversDir, name)
      if (!name.endsWith('.jpg') || !existsSync(file)) {
        res.writeHead(404)
        return res.end()
      }
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' })
      return res.end(await readFile(file))
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('bulunamadı')
  } catch (err) {
    json(res, 500, { error: String(err && err.message) })
  }
})

// Doğrudan çalıştırıldığında sunucuyu başlat (test importlarında başlamaz).
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(PORT, HOST, () => {
    console.log(`Twitter Studio hazır → http://localhost:${PORT}`)
  })
}
