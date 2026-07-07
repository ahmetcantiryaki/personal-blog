// @ts-nocheck
/**
 * falai-studio.mjs — çok basit, SADECE LOKAL fal.ai görsel oluşturma arayüzü.
 *
 * Çalıştır:  node src/scripts/falai-studio.mjs
 * Aç:        http://localhost:4321
 *
 * FAL_KEY .env'den okunur ve yalnızca sunucu tarafında kalır (tarayıcıya asla
 * gönderilmez). Üretilen görseller local-studio-output/ klasörüne kaydedilir
 * (gitignored). Prod ile hiçbir bağı yoktur.
 *
 * İki görünüm:
 *  1) Serbest üretici — tek prompt, istediğin model/boyut.
 *  2) Kapak Promptları — kapak-promptlari.md dosyasındaki 66 kapak; her satır
 *     tek tek üretilir. Her tıklama YENİ rastgele seed kullanır (deneme-yanılma),
 *     tüm denemeler local-studio-output/kapak/ altında saklanır.
 */

import http from 'node:http'
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const outDir = path.join(projectRoot, 'local-studio-output')
const kapakMd = path.join(projectRoot, 'kapak-promptlari.md')

const PORT = 4321
const HOST = '127.0.0.1' // yalnızca localhost — dışarıya açılmaz

// Kapak üretimleri hep 16:9 hedefiyle (ratio-modelleri 16:9 oranına eşlenir).
const KAPAK_W = 1280
const KAPAK_H = 720

/**
 * Model kataloğu (fal.ai metin→görsel modelleri).
 *  price: { type: 'mp' (megapiksel başına) | 'image' (görsel başına), usd }
 *  sizing: 'size'  → image_size {width,height} gönderilir
 *          'ratio' → en yakın aspect_ratio gönderilir (model özel boyut kabul etmez)
 *  minPixels: modelin istediği minimum toplam piksel (boyut orantılı büyütülür)
 */
const MODELS = {
  'fal-ai/flux/schnell': {
    label: 'FLUX.1 [schnell] — en hızlı, en ucuz',
    price: { type: 'mp', usd: 0.003 },
    sizing: 'size',
  },
  'fal-ai/flux/dev': {
    label: 'FLUX.1 [dev] — dengeli kalite',
    price: { type: 'mp', usd: 0.025 },
    sizing: 'size',
  },
  'fal-ai/flux-pro/v1.1': {
    label: 'FLUX 1.1 [pro] — yüksek kalite',
    price: { type: 'image', usd: 0.04 },
    sizing: 'size',
  },
  'fal-ai/flux-pro/v1.1-ultra': {
    label: 'FLUX 1.1 [pro] ultra — en yüksek çözünürlük',
    price: { type: 'image', usd: 0.06 },
    sizing: 'ratio',
  },
  'fal-ai/nano-banana': {
    label: 'Nano Banana (Gemini Flash Image) — metin/düzen iyi',
    price: { type: 'image', usd: 0.0398 },
    sizing: 'ratio',
  },
  'fal-ai/bytedance/seedream/v4/text-to-image': {
    label: 'Seedream v4 (ByteDance) — fotogerçekçi',
    price: { type: 'image', usd: 0.03 },
    sizing: 'size',
    minPixels: 960 * 960,
  },
  'fal-ai/qwen-image': {
    label: 'Qwen Image — ucuz, metne sadık',
    price: { type: 'mp', usd: 0.02 },
    sizing: 'size',
  },
  'fal-ai/recraft/v3/text-to-image': {
    label: 'Recraft v3 — illüstrasyon/tasarım',
    price: { type: 'image', usd: 0.04 },
    sizing: 'size',
  },
}

const DEFAULT_KAPAK_MODEL = 'fal-ai/nano-banana'

const SIZES = [
  { w: 1216, h: 640, label: 'Blog kapak (1216×640)' },
  { w: 1024, h: 1024, label: 'Kare (1024×1024)' },
  { w: 1280, h: 720, label: 'Geniş 16:9 (1280×720)' },
  { w: 768, h: 1344, label: 'Dikey (768×1344)' },
]

/** ratio-modelleri için seçilen boyuta en yakın desteklenen oran. */
const RATIOS = ['21:9', '16:9', '3:2', '4:3', '1:1', '3:4', '2:3', '9:16']
const nearestRatio = (w, h) => {
  const target = w / h
  let best = RATIOS[0]
  let bestDiff = Infinity
  for (const r of RATIOS) {
    const [a, b] = r.split(':').map(Number)
    const diff = Math.abs(a / b - target)
    if (diff < bestDiff) { bestDiff = diff; best = r }
  }
  return best
}

const readEnv = async () => {
  const raw = await readFile(path.join(projectRoot, '.env'), 'utf8')
  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    let v = t.slice(i + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    env[t.slice(0, i).trim()] = v
  }
  return env
}

const FAL_KEY = (await readEnv()).FAL_KEY || process.env.FAL_KEY
if (!FAL_KEY) {
  console.error('HATA: FAL_KEY .env içinde bulunamadı.')
  process.exit(1)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// --- Türkçe→ascii slug -------------------------------------------------------
const TR_MAP = {
  ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
  Ç: 'c', Ğ: 'g', İ: 'i', I: 'i', Ö: 'o', Ş: 's', Ü: 'u',
}
const slugify = (s) =>
  s.replace(/[çğıöşüÇĞİIÖŞÜ]/g, (m) => TR_MAP[m])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// --- kapak-promptlari.md ayrıştırıcı (her istekte taze okunur = canlı yenileme)
const parseKapak = async () => {
  const raw = await readFile(kapakMd, 'utf8')
  const lines = raw.split(/\r?\n/)
  const cats = []
  let cat = null
  let entry = null
  let inCode = false
  let code = []

  for (const line of lines) {
    const em = line.match(/^###\s+(\d+)\.\s+(.+?)\s*$/)
    if (em) {
      if (!cat) { cat = { name: 'Kapaklar', entries: [] }; cats.push(cat) }
      entry = {
        num: Number(em[1]),
        nn: String(em[1]).padStart(2, '0'),
        title: em[2].trim(),
        slug: slugify(em[2].trim()),
        hook: '',
        prompt: '',
      }
      cat.entries.push(entry)
      inCode = false
      code = []
      continue
    }
    const cm = line.match(/^##\s+(.+?)\s*$/)
    if (cm && !line.startsWith('###')) {
      cat = { name: cm[1].trim(), entries: [] }
      cats.push(cat)
      entry = null
      inCode = false
      continue
    }
    if (line.trim() === '```') {
      if (!inCode) { inCode = true; code = [] }
      else { inCode = false; if (entry) entry.prompt = code.join('\n').trim() }
      continue
    }
    if (inCode) { code.push(line); continue }
    if (entry && /^\*\*Kanca:\*\*/.test(line)) {
      entry.hook = line.replace(/^\*\*Kanca:\*\*/, '').trim()
    }
  }

  // Yalnızca prompt'u olan girdileri içeren kategorileri döndür.
  return cats
    .map((c) => ({ name: c.name, entries: c.entries.filter((e) => e.prompt) }))
    .filter((c) => c.entries.length)
}

/** Bir kapak için mevcut deneme dosyalarını (sıralı) döndürür. */
const listAttempts = async (nn, slug) => {
  const dir = path.join(outDir, 'kapak')
  let files = []
  try { files = await readdir(dir) } catch { files = [] }
  const esc = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp('^' + nn + '-' + esc + '-a(\\d+)\\.jpg$')
  return files
    .map((f) => { const m = f.match(re); return m ? { file: f, a: Number(m[1]) } : null })
    .filter(Boolean)
    .sort((x, y) => x.a - y.a)
}

const generate = async ({ prompt, model, width, height, seed, outSubdir = '', outFile }) => {
  const spec = MODELS[model]
  const auth = { Authorization: `Key ${FAL_KEY}` }
  const started = Date.now()

  // Modelin şemasına göre boyut parametresini kur.
  const input = {
    prompt,
    num_images: 1,
    output_format: 'jpeg',
    ...(Number.isFinite(seed) ? { seed } : {}),
  }
  if (spec.sizing === 'ratio') {
    input.aspect_ratio = nearestRatio(width, height)
  } else {
    let w = width
    let h = height
    if (spec.minPixels && w * h < spec.minPixels) {
      const scale = Math.sqrt(spec.minPixels / (w * h))
      w = Math.ceil((w * scale) / 8) * 8
      h = Math.ceil((h * scale) / 8) * 8
    }
    input.image_size = { width: w, height: h }
  }

  const submit = await fetch(`https://queue.fal.run/${model}`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!submit.ok) throw new Error(`fal.ai submit ${submit.status}: ${await submit.text()}`)
  const { status_url, response_url } = await submit.json()

  const deadline = Date.now() + 300_000
  while (Date.now() < deadline) {
    const st = await (await fetch(status_url, { headers: auth })).json()
    if (st.status === 'COMPLETED') break
    if (st.status === 'FAILED' || st.status === 'ERROR') {
      throw new Error(`Üretim başarısız: ${JSON.stringify(st)}`)
    }
    await sleep(1200)
  }

  const result = await (await fetch(response_url, { headers: auth })).json()
  const image = result.images && result.images[0]
  if (!image || !image.url) throw new Error('Sonuçta görsel yok.')

  const bytes = Buffer.from(await (await fetch(image.url)).arrayBuffer())
  const dir = outSubdir ? path.join(outDir, outSubdir) : outDir
  await mkdir(dir, { recursive: true })
  const file = outFile || `studio-${Date.now()}.jpg`
  await writeFile(path.join(dir, file), bytes)
  const urlPath = outSubdir ? `/out/${outSubdir}/${file}` : `/out/${file}`

  return {
    file,
    url: urlPath,
    ms: Date.now() - started,
    kb: Math.round(bytes.length / 1024),
    width: image.width || null,
    height: image.height || null,
    seed: result.seed ?? null,
    sentAs: spec.sizing === 'ratio' ? `aspect_ratio=${input.aspect_ratio}` :
      `image_size=${input.image_size.width}x${input.image_size.height}`,
  }
}

const modelInfoForClient = Object.fromEntries(
  Object.entries(MODELS).map(([id, m]) => [
    id,
    { label: m.label, price: m.price, sizing: m.sizing, minPixels: m.minPixels || null },
  ]),
)

const MODEL_OPTIONS = Object.entries(MODELS)
  .map(([id, m]) => `<option value="${id}">${escapeHtml(m.label)}</option>`).join('')
const SIZE_OPTIONS = SIZES
  .map((s) => `<option value="${s.w}x${s.h}">${escapeHtml(s.label)}</option>`).join('')
const KAPAK_MODEL_OPTIONS = Object.entries(MODELS)
  .map(([id, m]) => `<option value="${id}"${id === DEFAULT_KAPAK_MODEL ? ' selected' : ''}>${escapeHtml(m.label)}</option>`)
  .join('')

const buildKapakSection = (cats) => {
  const total = cats.reduce((n, c) => n + c.entries.length, 0)
  const rows = cats.map((c) => {
    const items = c.entries.map((e) => `
      <div class="krow" data-num="${e.num}">
        <div class="kmain">
          <span class="knum">${e.nn}</span>
          <span class="ktitle">${escapeHtml(e.title)}</span>
          <span class="khook">${escapeHtml(e.hook)}</span>
        </div>
        <div class="kctrl">
          <select class="kmodel" title="Model">${KAPAK_MODEL_OPTIONS}</select>
          <button class="kgo" type="button">Oluştur</button>
          <button class="ktoggle" type="button">prompt'u göster</button>
          <span class="kstatus"></span>
          <span class="kattempt"></span>
          <span class="kcost"></span>
        </div>
        <pre class="kprompt hidden">${escapeHtml(e.prompt)}</pre>
        <div class="kthumb"></div>
      </div>`).join('')
    return `<h3 class="kcat">${escapeHtml(c.name)}</h3>${items}`
  }).join('')

  return `
  <div class="kbar">
    <span>${total} kapak · her tıklama yeni rastgele seed (deneme-yanılma) · 16:9</span>
    <span>Toplam: <b id="ktotal">$0.0000</b></span>
  </div>
  <div id="klist">${rows}</div>`
}

const renderPage = (cats) => `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>fal.ai Studio — lokal</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 2rem 1rem; background: #fdfcf9; color: #3a352e;
         font: 15px/1.5 ui-sans-serif, system-ui, sans-serif;
         display: flex; justify-content: center; }
  main { width: 100%; max-width: 900px; }
  h1 { font-size: 1.2rem; font-weight: 600; margin: 0 0 .25rem; }
  .sub { color: #8a8378; font-size: .85rem; margin: 0 0 1rem; }
  .tabs { display: flex; gap: .5rem; margin: 0 0 1.25rem; border-bottom: 1px solid #e2ded6; }
  .tab { background: none; border: 0; padding: .5rem .8rem; margin: 0; width: auto;
         font: inherit; font-weight: 600; color: #8a8378; cursor: pointer;
         border-bottom: 2px solid transparent; border-radius: 0; }
  .tab.active { color: #2f7d78; border-bottom-color: #2f7d78; }
  label { display: block; font-size: .8rem; font-weight: 600; margin: 1rem 0 .3rem; color: #6b6559; }
  textarea, select, input { width: 100%; padding: .6rem .7rem; border: 1px solid #e2ded6;
         border-radius: 9px; background: #fff; font: inherit; color: inherit; }
  textarea { min-height: 96px; resize: vertical; }
  textarea:focus, select:focus, input:focus { outline: 2px solid #2f7d78; outline-offset: 1px; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem; }
  .cost { margin-top: 1rem; padding: .7rem .9rem; background: #f2efe9; border-radius: 9px;
          font-size: .85rem; display: flex; justify-content: space-between; }
  .cost b { color: #2f7d78; }
  .note { font-size: .75rem; color: #8a8378; margin-top: .35rem; }
  button { margin-top: 1rem; width: 100%; padding: .75rem; border: 0; border-radius: 9px;
           background: #2f7d78; color: #fff; font: inherit; font-weight: 600; cursor: pointer; }
  button:disabled { opacity: .55; cursor: wait; }
  .result { margin-top: 1.5rem; }
  .result img { width: 100%; border-radius: 12px; border: 1px solid #e2ded6; display: block; }
  .meta { margin-top: .6rem; font-size: .8rem; color: #6b6559; display: flex; flex-wrap: wrap; gap: .4rem 1.2rem; }
  .err { margin-top: 1rem; padding: .7rem .9rem; background: #fbeaea; color: #8f3030;
         border-radius: 9px; font-size: .85rem; white-space: pre-wrap; }
  .hidden { display: none; }

  /* --- Kapak paneli --- */
  .kbar { position: sticky; top: 0; z-index: 5; margin: 0 0 .75rem;
          padding: .6rem .8rem; background: #f2efe9; border: 1px solid #e2ded6;
          border-radius: 9px; font-size: .82rem; display: flex; justify-content: space-between; gap: 1rem; }
  .kbar b { color: #2f7d78; }
  .kcat { font-size: .82rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
          color: #8a8378; margin: 1.25rem 0 .4rem; padding-bottom: .2rem; border-bottom: 1px solid #eee7dc; }
  .krow { padding: .55rem 0; border-bottom: 1px solid #f0ece4; }
  .kmain { display: flex; align-items: baseline; gap: .5rem; flex-wrap: wrap; }
  .knum { font-variant-numeric: tabular-nums; color: #b6ad9d; font-weight: 700; font-size: .8rem; min-width: 1.4rem; }
  .ktitle { font-weight: 600; font-size: .9rem; }
  .khook { color: #8a8378; font-size: .8rem; }
  .kctrl { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; margin-top: .35rem; }
  .kctrl select.kmodel { width: auto; max-width: 260px; padding: .3rem .45rem; font-size: .78rem; border-radius: 7px; }
  .kctrl button { width: auto; margin: 0; padding: .32rem .7rem; font-size: .78rem; border-radius: 7px; }
  .kctrl .ktoggle { background: none; color: #6b6559; border: 1px solid #e2ded6; font-weight: 500; }
  .kstatus { font-size: .78rem; }
  .kstatus.s-run { color: #9a7b2f; }
  .kstatus.s-ok { color: #2f7d78; }
  .kstatus.s-err { color: #8f3030; }
  .kattempt { font-size: .75rem; color: #8a8378; }
  .kcost { font-size: .75rem; color: #6b6559; }
  .kprompt { margin: .5rem 0 0; padding: .5rem .6rem; background: #f7f4ee; border: 1px solid #eee7dc;
             border-radius: 8px; font-size: .72rem; white-space: pre-wrap; color: #5a544a; }
  .kthumb { margin-top: .5rem; }
  .kthumb img { width: 320px; max-width: 100%; border-radius: 8px; border: 1px solid #e2ded6; display: block; }
  .kprev { margin-top: .3rem; font-size: .72rem; color: #8a8378; }
  .kprev a { color: #2f7d78; margin-right: .4rem; }
</style>
</head>
<body>
<main>
  <h1>fal.ai Studio</h1>
  <p class="sub">Sadece lokal — FAL_KEY sunucuda kalır, görseller <code>local-studio-output/</code> klasörüne kaydedilir.</p>

  <div class="tabs">
    <button class="tab active" data-view="free" type="button">Serbest</button>
    <button class="tab" data-view="kapak" type="button">Kapak Promptları</button>
  </div>

  <section id="view-free">
    <label for="prompt">Prompt</label>
    <textarea id="prompt" placeholder="Ne üretmek istiyorsun?"></textarea>

    <div class="row">
      <div>
        <label for="model">Model</label>
        <select id="model">${MODEL_OPTIONS}</select>
      </div>
      <div>
        <label for="size">Boyut</label>
        <select id="size">${SIZE_OPTIONS}</select>
      </div>
    </div>

    <label for="seed">Seed (opsiyonel — aynı seed = tekrarlanabilir sonuç)</label>
    <input id="seed" type="number" placeholder="boş bırakılabilir">

    <div class="cost">
      <span>Görsel başına tahmini maliyet</span>
      <b id="cost">—</b>
    </div>
    <div class="note" id="note"></div>

    <button id="go">Görsel Oluştur</button>

    <div id="err" class="err hidden"></div>
    <div id="result" class="result hidden">
      <img id="img" alt="Üretilen görsel">
      <div class="meta" id="meta"></div>
    </div>
  </section>

  <section id="view-kapak" class="hidden">
    ${buildKapakSection(cats)}
  </section>
</main>
<script>
  const MODEL_INFO = ${JSON.stringify(modelInfoForClient)};
  const KAPAK_W = ${KAPAK_W}, KAPAK_H = ${KAPAK_H};
  const el = (id) => document.getElementById(id);

  // --- Sekmeler ---
  document.querySelectorAll('.tab').forEach((t) => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
      t.classList.add('active');
      el('view-free').classList.toggle('hidden', t.dataset.view !== 'free');
      el('view-kapak').classList.toggle('hidden', t.dataset.view !== 'kapak');
    });
  });

  // --- Serbest üretici ---
  function currentCost() {
    const [w, h] = el('size').value.split('x').map(Number);
    const info = MODEL_INFO[el('model').value];
    if (info.price.type === 'image') return info.price.usd;
    return ((w * h) / 1e6) * info.price.usd;
  }

  function updateCost() {
    const [w, h] = el('size').value.split('x').map(Number);
    const info = MODEL_INFO[el('model').value];
    const usd = currentCost();
    if (info.price.type === 'image') {
      el('cost').textContent = '~$' + usd.toFixed(4) + '  (görsel başına sabit)';
    } else {
      el('cost').textContent = '~$' + usd.toFixed(4) + '  (' + ((w * h) / 1e6).toFixed(2) + ' MP × $' + info.price.usd + '/MP)';
    }
    el('note').textContent = info.sizing === 'ratio'
      ? 'Not: bu model özel boyut kabul etmez; seçilen boyuta en yakın en-boy oranı gönderilir.'
      : (info.minPixels ? 'Not: bu model küçük boyutları desteklemez; gerekirse boyut orantılı büyütülür.' : '');
  }
  el('model').addEventListener('change', updateCost);
  el('size').addEventListener('change', updateCost);
  updateCost();

  el('go').addEventListener('click', async () => {
    const prompt = el('prompt').value.trim();
    if (!prompt) { el('prompt').focus(); return; }
    const [width, height] = el('size').value.split('x').map(Number);
    const seedRaw = el('seed').value.trim();
    const usd = currentCost();
    const modelLabel = MODEL_INFO[el('model').value].label;

    el('go').disabled = true;
    el('go').textContent = 'Üretiliyor…';
    el('err').classList.add('hidden');
    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt, model: el('model').value, width, height,
          seed: seedRaw ? Number(seedRaw) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || res.statusText);

      el('img').src = data.url + '?t=' + Date.now();
      el('meta').innerHTML =
        '<span><b>Model:</b> ' + modelLabel + '</span>' +
        '<span><b>Süre:</b> ' + (data.ms / 1000).toFixed(1) + ' sn</span>' +
        (data.width ? '<span><b>Boyut:</b> ' + data.width + '×' + data.height + '</span>' : '') +
        '<span><b>İstek:</b> ' + data.sentAs + '</span>' +
        '<span><b>Dosya:</b> local-studio-output/' + data.file + ' (' + data.kb + ' KB)</span>' +
        (data.seed !== null ? '<span><b>Seed:</b> ' + data.seed + '</span>' : '') +
        '<span><b>Maliyet:</b> ~$' + usd.toFixed(4) + '</span>';
      el('result').classList.remove('hidden');
    } catch (e) {
      el('err').textContent = e.message;
      el('err').classList.remove('hidden');
    } finally {
      el('go').disabled = false;
      el('go').textContent = 'Görsel Oluştur';
    }
  });

  // --- Kapak paneli ---
  function kapakCost(model) {
    const info = MODEL_INFO[model];
    if (info.price.type === 'image') return info.price.usd;
    return ((KAPAK_W * KAPAK_H) / 1e6) * info.price.usd;
  }

  let kapakTotal = 0;
  document.querySelectorAll('.krow').forEach((row) => {
    const go = row.querySelector('.kgo');
    const toggle = row.querySelector('.ktoggle');
    const pre = row.querySelector('.kprompt');
    const status = row.querySelector('.kstatus');
    const attemptEl = row.querySelector('.kattempt');
    const costEl = row.querySelector('.kcost');
    const thumb = row.querySelector('.kthumb');

    toggle.addEventListener('click', () => {
      const hidden = pre.classList.toggle('hidden');
      toggle.textContent = hidden ? "prompt'u göster" : "prompt'u gizle";
    });

    go.addEventListener('click', async () => {
      const num = Number(row.dataset.num);
      const model = row.querySelector('.kmodel').value;
      go.disabled = true;
      status.textContent = 'üretiliyor…';
      status.className = 'kstatus s-run';
      try {
        const res = await fetch('/generate-kapak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ num, model }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || res.statusText);

        const usd = kapakCost(model);
        kapakTotal += usd;
        el('ktotal').textContent = '$' + kapakTotal.toFixed(4);

        status.textContent = 'hazır (' + (data.ms / 1000).toFixed(1) + ' sn)';
        status.className = 'kstatus s-ok';
        attemptEl.textContent = 'deneme ' + data.attempt;
        costEl.textContent = '~$' + usd.toFixed(4);

        let html = '<a href="' + data.url + '" target="_blank" rel="noopener">' +
          '<img src="' + data.url + '?t=' + Date.now() + '" alt="kapak ' + num + '"></a>';
        if (data.prevUrls && data.prevUrls.length) {
          html += '<div class="kprev">önceki: ' + data.prevUrls
            .map((u, i) => '<a href="' + u + '" target="_blank" rel="noopener">a' + (i + 1) + '</a>')
            .join('') + '</div>';
        }
        thumb.innerHTML = html;
      } catch (e) {
        status.textContent = 'hata: ' + e.message;
        status.className = 'kstatus s-err';
      } finally {
        go.disabled = false;
      }
    });
  });
</script>
</body>
</html>`

const readBody = (req) => new Promise((resolve, reject) => {
  let body = ''
  req.on('data', (c) => { body += c; if (body.length > 100_000) req.destroy() })
  req.on('end', () => resolve(body))
  req.on('error', reject)
})

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/') {
      let cats = []
      try { cats = await parseKapak() } catch (e) {
        console.error('kapak-promptlari.md okunamadı:', e.message)
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(renderPage(cats))
    }

    if (req.method === 'POST' && req.url === '/generate') {
      const { prompt, model, width, height, seed } = JSON.parse(await readBody(req))
      if (typeof prompt !== 'string' || !prompt.trim()) throw new Error('Prompt boş olamaz.')
      if (!MODELS[model]) throw new Error('Geçersiz model.')
      const w = Number(width), h = Number(height)
      if (!SIZES.some((s) => s.w === w && s.h === h)) throw new Error('Geçersiz boyut.')

      const out = await generate({
        prompt: prompt.trim(), model, width: w, height: h,
        seed: seed === undefined ? undefined : Number(seed),
      })
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify(out))
    }

    if (req.method === 'POST' && req.url === '/generate-kapak') {
      const { num, model } = JSON.parse(await readBody(req))
      if (!MODELS[model]) throw new Error('Geçersiz model.')
      const n = Number(num)
      if (!Number.isInteger(n)) throw new Error('Geçersiz kapak numarası.')

      const cats = await parseKapak() // taze oku — düzenlemeler anında yansır
      const entry = cats.flatMap((c) => c.entries).find((e) => e.num === n)
      if (!entry) throw new Error(`Kapak #${n} bulunamadı.`)

      const prev = await listAttempts(entry.nn, entry.slug)
      const attempt = (prev.length ? prev[prev.length - 1].a : 0) + 1
      const outFile = `${entry.nn}-${entry.slug}-a${attempt}.jpg`
      const seed = Math.floor(Math.random() * 2_147_483_647) // her tıklama yeni seed

      const out = await generate({
        prompt: entry.prompt, model, width: KAPAK_W, height: KAPAK_H, seed,
        outSubdir: 'kapak', outFile,
      })
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({
        ...out,
        attempt,
        prevUrls: prev.map((p) => `/out/kapak/${p.file}`),
      }))
    }

    if (req.method === 'GET' && req.url.startsWith('/out/')) {
      const rel = decodeURIComponent(req.url.split('?')[0].slice('/out/'.length))
      const parts = rel.split('/').filter(Boolean).map((p) => path.basename(p)) // dizin kaçışını engelle
      const safe = parts.join('/')
      if (!/\.jpe?g$/i.test(safe)) { res.writeHead(404); return res.end() }
      const full = path.join(outDir, safe)
      if (!full.startsWith(outDir + path.sep)) { res.writeHead(404); return res.end() }
      let bytes
      try { bytes = await readFile(full) } catch { res.writeHead(404); return res.end() }
      res.writeHead(200, { 'Content-Type': 'image/jpeg' })
      return res.end(bytes)
    }

    res.writeHead(404)
    res.end('not found')
  } catch (error) {
    res.writeHead(error.message?.startsWith('fal.ai') ? 502 : 400, {
      'Content-Type': 'application/json',
    })
    res.end(JSON.stringify({ error: error.message }))
  }
})

server.listen(PORT, HOST, () => {
  console.log(`fal.ai Studio hazır → http://localhost:${PORT}`)
  console.log(`Modeller: ${Object.keys(MODELS).length} adet. Durdurmak için Ctrl+C.`)
})
