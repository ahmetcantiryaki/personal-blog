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
 */

import http from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const outDir = path.join(projectRoot, 'local-studio-output')

const PORT = 4321
const HOST = '127.0.0.1' // yalnızca localhost — dışarıya açılmaz

/** Model kataloğu: uç nokta + megapiksel başına fiyat (USD, fal.ai fiyatları). */
const MODELS = {
  'fal-ai/flux/schnell': { label: 'FLUX.1 [schnell] — hızlı ve ucuz', pricePerMP: 0.003 },
  'fal-ai/flux/dev': { label: 'FLUX.1 [dev] — daha kaliteli', pricePerMP: 0.025 },
}

const SIZES = [
  { w: 1216, h: 640, label: 'Blog kapak (1216×640)' },
  { w: 1024, h: 1024, label: 'Kare (1024×1024)' },
  { w: 1280, h: 720, label: 'Geniş 16:9 (1280×720)' },
  { w: 768, h: 1344, label: 'Dikey (768×1344)' },
]

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

const generate = async ({ prompt, model, width, height, seed }) => {
  const auth = { Authorization: `Key ${FAL_KEY}` }
  const started = Date.now()

  const submit = await fetch(`https://queue.fal.run/${model}`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      image_size: { width, height },
      num_images: 1,
      output_format: 'jpeg',
      ...(Number.isFinite(seed) ? { seed } : {}),
    }),
  })
  if (!submit.ok) throw new Error(`fal.ai submit ${submit.status}: ${await submit.text()}`)
  const { status_url, response_url } = await submit.json()

  const deadline = Date.now() + 180_000
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
  await mkdir(outDir, { recursive: true })
  const file = `studio-${Date.now()}.jpg`
  await writeFile(path.join(outDir, file), bytes)

  return {
    file,
    url: `/out/${file}`,
    ms: Date.now() - started,
    kb: Math.round(bytes.length / 1024),
    width: image.width,
    height: image.height,
    seed: result.seed,
  }
}

const HTML = `<!doctype html>
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
  main { width: 100%; max-width: 720px; }
  h1 { font-size: 1.2rem; font-weight: 600; margin: 0 0 .25rem; }
  .sub { color: #8a8378; font-size: .85rem; margin: 0 0 1.5rem; }
  label { display: block; font-size: .8rem; font-weight: 600; margin: 1rem 0 .3rem; color: #6b6559; }
  textarea, select, input { width: 100%; padding: .6rem .7rem; border: 1px solid #e2ded6;
         border-radius: 9px; background: #fff; font: inherit; color: inherit; }
  textarea { min-height: 96px; resize: vertical; }
  textarea:focus, select:focus, input:focus { outline: 2px solid #2f7d78; outline-offset: 1px; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem; }
  .cost { margin-top: 1rem; padding: .7rem .9rem; background: #f2efe9; border-radius: 9px;
          font-size: .85rem; display: flex; justify-content: space-between; }
  .cost b { color: #2f7d78; }
  button { margin-top: 1rem; width: 100%; padding: .75rem; border: 0; border-radius: 9px;
           background: #2f7d78; color: #fff; font: inherit; font-weight: 600; cursor: pointer; }
  button:disabled { opacity: .55; cursor: wait; }
  .result { margin-top: 1.5rem; }
  .result img { width: 100%; border-radius: 12px; border: 1px solid #e2ded6; display: block; }
  .meta { margin-top: .6rem; font-size: .8rem; color: #6b6559; display: flex; flex-wrap: wrap; gap: .4rem 1.2rem; }
  .err { margin-top: 1rem; padding: .7rem .9rem; background: #fbeaea; color: #8f3030;
         border-radius: 9px; font-size: .85rem; white-space: pre-wrap; }
  .hidden { display: none; }
</style>
</head>
<body>
<main>
  <h1>fal.ai Studio</h1>
  <p class="sub">Sadece lokal — FAL_KEY sunucuda kalır, görseller <code>local-studio-output/</code> klasörüne kaydedilir.</p>

  <label for="prompt">Prompt</label>
  <textarea id="prompt" placeholder="Ne üretmek istiyorsun?"></textarea>

  <div class="row">
    <div>
      <label for="model">Model</label>
      <select id="model">__MODEL_OPTIONS__</select>
    </div>
    <div>
      <label for="size">Boyut</label>
      <select id="size">__SIZE_OPTIONS__</select>
    </div>
  </div>

  <label for="seed">Seed (opsiyonel — aynı seed = tekrarlanabilir sonuç)</label>
  <input id="seed" type="number" placeholder="boş bırakılabilir">

  <div class="cost">
    <span>Görsel başına tahmini maliyet</span>
    <b id="cost">—</b>
  </div>

  <button id="go">Görsel Oluştur</button>

  <div id="err" class="err hidden"></div>
  <div id="result" class="result hidden">
    <img id="img" alt="Üretilen görsel">
    <div class="meta" id="meta"></div>
  </div>
</main>
<script>
  const PRICES = __PRICES__;
  const el = (id) => document.getElementById(id);

  function updateCost() {
    const [w, h] = el('size').value.split('x').map(Number);
    const mp = (w * h) / 1e6;
    const usd = mp * PRICES[el('model').value];
    el('cost').textContent = '~$' + usd.toFixed(4) + '  (' + mp.toFixed(2) + ' MP)';
  }
  el('model').addEventListener('change', updateCost);
  el('size').addEventListener('change', updateCost);
  updateCost();

  el('go').addEventListener('click', async () => {
    const prompt = el('prompt').value.trim();
    if (!prompt) { el('prompt').focus(); return; }
    const [width, height] = el('size').value.split('x').map(Number);
    const seedRaw = el('seed').value.trim();

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
      const mp = (width * height) / 1e6;
      const usd = mp * PRICES[el('model').value];
      el('meta').innerHTML =
        '<span><b>Süre:</b> ' + (data.ms / 1000).toFixed(1) + ' sn</span>' +
        '<span><b>Boyut:</b> ' + data.width + '×' + data.height + '</span>' +
        '<span><b>Dosya:</b> local-studio-output/' + data.file + ' (' + data.kb + ' KB)</span>' +
        '<span><b>Seed:</b> ' + data.seed + '</span>' +
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
</script>
</body>
</html>`

const page = HTML
  .replace('__MODEL_OPTIONS__', Object.entries(MODELS)
    .map(([id, m]) => `<option value="${id}">${m.label}</option>`).join(''))
  .replace('__SIZE_OPTIONS__', SIZES
    .map((s) => `<option value="${s.w}x${s.h}">${s.label}</option>`).join(''))
  .replace('__PRICES__', JSON.stringify(
    Object.fromEntries(Object.entries(MODELS).map(([id, m]) => [id, m.pricePerMP])),
  ))

const readBody = (req) => new Promise((resolve, reject) => {
  let body = ''
  req.on('data', (c) => { body += c; if (body.length > 100_000) req.destroy() })
  req.on('end', () => resolve(body))
  req.on('error', reject)
})

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(page)
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

    if (req.method === 'GET' && req.url.startsWith('/out/')) {
      const name = path.basename(req.url.split('?')[0]) // dizin kaçışını engelle
      if (!/^studio-\d+\.jpg$/.test(name)) { res.writeHead(404); return res.end() }
      const bytes = await readFile(path.join(outDir, name))
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
  console.log(`fal.ai Studio hazır → http://localhost:${PORT}  (durdurmak için Ctrl+C)`)
})
