# Woyable — Büyüme Stratejisi ve Altyapı Göçü

> Araştırma tarihi: 2026-07-28. Kaynaklar dosyanın sonunda.
> İki bağımsız konu: (A) Supabase egress/maliyet sorunu, (B) trafik ve büyüme.

---

# A. Altyapı: Supabase'den çıkış

## A.1 Önce teşhis — egress'i ne yiyor?

Sağlayıcı değiştirmeden önce bu bölüm okunmalı. Egress sorununun büyük kısmı
Supabase'in değil, bu repodaki iki tasarım kararının sonucu. Sağlayıcıyı değiştirip
bunları düzeltmezsen aynı duvara yeni sağlayıcıda çarparsın.

### Sebep 1 — her deploy'da 272 makalenin tamamı yeniden seed'leniyor

`vercel.json`:

```json
"buildCommand": "pnpm run seed && pnpm run build"
```

`src/seed/index.ts` tüm `seed/content/{tr,en}/*.md` gruplarını döngüyle
`upsertArticle`'a veriyor — değişmiş olup olmadığına bakmadan. Günlük routine
5 yazı ekliyor, ama her push'ta **136 grup (272 dosya)** okunup DB'ye yazılıyor.
Her makalenin Lexical JSON'u ham markdown'dan birkaç kat büyük.

### Sebep 2 — liste sorguları tam makale gövdesini çekiyor

`src/lib/posts.ts:74` (`listPosts`) ve `:96` (`getFeaturedPost`):

```ts
const result = await payload.find({
  collection: 'posts',
  where: { and },
  locale,
  depth: 1,       // ← select yok
  limit,
  page,
})
```

`select` verilmediği için Payload **her kart için tüm alanları** döndürüyor —
kartta hiç kullanılmayan `content` (Lexical JSON) dahil. Ana sayfa, kategori
sayfaları, etiket sayfaları, pagination... `generateStaticParams` ile 272 × 2
sayfalık statik build'de bu yüzlerce kez tekrarlanıyor.

### Sebep 3 — `POST /api/track` her sayfa görüntülemesinde DB yazıyor

Şu an trafik düşükken sorun değil. Bu dokümanın B bölümü işe yararsa **en hızlı
büyüyen kalem bu olur**. Şimdiden batch'lemeye hazırlan.

### Düzeltmeler (sağlayıcıdan bağımsız, hepsi ücretsiz)

Öncelik sırasıyla:

1. **`select` ekle.** Liste/kart sorgularında `select: { title: true, slug: true,
   excerpt: true, publishedAt: true, readingTime: true, coverStyle: true,
   translationKey: true, category: true, tags: true }`. Tek satırlık değişiklik,
   muhtemelen egress'in en büyük tek kalemi. Önce bunu yap, bir hafta ölç.

2. **Seed'i artımlı yap.** Her makale grubu için içerik hash'i hesapla
   (`audio-manifest.json`'daki desenin aynısı — o zaten çalışıyor), hash
   değişmediyse upsert'i atla. `seed/content/seed-manifest.json` olarak commit et.
   272 yazma → günde 5 yazma.

3. **Seed'i build'den çıkar.** `generate-audio.yml` ile aynı desen: push'ta bir
   GitHub Action seed'i çalıştırsın, sonra Vercel deploy hook'unu tetiklesin.
   Build sadece okusun. Yan fayda: seed hatası artık deploy'u düşürmez
   (`05c99fc` commit'indeki kod-bloğu-dili kazasının tekrarını önler).

4. **ISR aralığını yükselt.** Post sayfalarında `revalidate = 300` × 272 sayfa =
   sürekli arka plan yenilemesi. `3600` yap, seed adımından on-demand
   `revalidatePath` çağır. İçerik zaten günde bir kez değişiyor.

5. **`/api/track`'i batch'le.** Görüntüleme başına bir INSERT/UPDATE yerine bellekte
   biriktirip periyodik flush, ya da sayaçları Vercel KV / Upstash Redis'te tutup
   günlük bir cron ile Postgres'e yaz.

> Doğrulama: Supabase Dashboard → Settings → Usage, egress'in tablo/istek bazında
> dökümünü veriyor. Göçten önce bir hafta ölç — hangi düzeltmenin ne kadar
> kazandırdığını bilmeden taşınma.

## A.2 Woyable'ın Supabase'e bağımlılığı: sıfır

Kritik bulgu: kod tabanında **hiçbir yerde `supabase-js` yok**. `.env.example`'daki
tek bağ bir Postgres connection string'i:

```
DATABASE_URI=<postgres bağlantısı>
DATABASE_URI_TRANSACTION=<transaction pooler>
```

Payload kendi auth'unu kullanıyor (`users` koleksiyonu), dosya yüklemesi yok
(kapaklar `public/covers/` altında repoda), realtime yok, edge function yok.

**Sonuç:** woyable için göç = `pg_dump` + `pg_restore` + `DATABASE_URI` değiştir.
Uygulama kodunda tek satır değişiklik gerekmiyor. `src/migrations/` zaten mevcut,
temiz bir DB'ye `pnpm migrate` + `pnpm seed` ile sıfırdan da kurulabilir.

Diğer Supabase projelerin Auth/Storage/Realtime kullanıyorsa onların göçü bundan
zor — aşağıdaki self-host seçeneği tam da bu yüzden var.

## A.3 Sağlayıcı karşılaştırması (Temmuz 2026)

| Sağlayıcı | Ücretsiz kademe | İlk ücretli | Proje başına maliyet | Egress |
|---|---|---|---|---|
| **Supabase** | 500 MB DB, **5 GB egress**, **2 aktif proje**, 1 hafta hareketsizlikte durur | $25/ay **organizasyon** başına + proje başına compute ($10 Micro, $10 kredi dahil) | 2. proje +$10, 3. proje +$10… | 5 GB → 250 GB (Pro), sonra $0.09/GB |
| **Neon** | Proje başına 0.5 GB depolama + 100 CU-saat, **100 projeye kadar**, 5 GB egress, scale-to-zero | Launch: aylık taban yok, $0.106/CU-saat + $0.35/GB-ay | Ücretsizde 0 | 5 GB (free) / proje başına 500 GB (Launch) |
| **Aiven** | 5 GB depolama (tek servis), yedek + monitoring dahil | — | — | — |
| **Hetzner VPS** (self-host) | — | **CX22 €4.49/ay** (2 vCPU, 4 GB RAM, 40 GB NVMe) | **Sınırsız proje, ek maliyet yok** | **20 TB/ay dahil**, aşımı €1/TB |

Supabase'in "$25 tek proje için" algısının doğrusu: $25 organizasyon başına, ama
her ek proje kendi compute'unu ekliyor. 2 projeli bir Pro org = $25 + $10 + $10 − $10
kredi = **$35/ay**. 5 proje ≈ **$65/ay**. Çok projeli senaryoda hızla büyüyor.

Neon'un ücretsiz kademesindeki asıl kazanç egress değil (o da 5 GB, Supabase ile
aynı) — **100 projeye kadar** izin vermesi ve scale-to-zero. Supabase'in 2 aktif
proje sınırı senin durumunda asıl kısıt.

## A.4 Öneri: iki kademeli

### Kademe 1 — hemen, ücretsiz: A.1'deki düzeltmeler + Neon

Bu hafta `select` düzeltmesini yap ve ölç. Egress 5 GB'ın altına inerse acele
etmene gerek yok. Yine de Supabase'in **2 aktif proje** sınırı ve **1 hafta
hareketsizlikte durdurma** politikası seni sıkıştırıyorsa:

- woyable.com → Neon'a taşı (dump/restore, kod değişikliği yok)
- Diğer küçük/uyuyan projeler → her biri kendi Neon projesi (100'e kadar ücretsiz)
- Neon'un scale-to-zero'su hareketsiz projeler için Supabase'in "pause"undan iyi:
  duruyor ama ilk istekte kendiliğinden kalkıyor, elle "restore" gerekmiyor

Riski düşük, geri dönülebilir, $0.

### Kademe 2 — kalıcı çözüm: tek Hetzner sunucusu + Coolify

Çok sayıda projeyi kalıcı olarak barındırmak istiyorsan matematik tartışmasız:

- **Hetzner CX22 — €4.49/ay** (~$5). 20 TB egress dahil. Sınırsız proje.
- Üstüne **Coolify** (açık kaynak, ücretsiz PaaS) → tek panelden Postgres
  instance'ları, uygulamalar, otomatik SSL, git-push deploy.
- Supabase'in Auth/Storage/Realtime'ına ihtiyacı olan projeler için **self-hosted
  Supabase** (Coolify'ın hazır şablonu var). Woyable için gereksiz — ona düz
  Postgres yeter.
- Rahat bir self-hosted Supabase için 4 GB RAM sınırda; birden fazla proje +
  Supabase stack'i koşacaksan **CPX21 (3 vCPU / 4 GB, €8.39/ay)** veya 8 GB'lık
  bir plana çık.

Karşılaştırma: 5 projelik Supabase Pro ≈ $65/ay → Hetzner ≈ $5/ay. Yılda ~$720 fark.

**Dürüst uyarılar** — self-host ucuz ama bedava değil, bedeli zaman:

- Yedekleme senin sorumluluğun. Hetzner snapshot (ücretli, ~%20 disk fiyatı) +
  günlük `pg_dump` → Cloudflare R2 / Backblaze B2 (ikisi de ucuz/ücretsiz kademeli).
  **Bunu kurmadan production veriyi taşıma.**
- SLA yok. Sunucu düşerse kaldıran sensin.
- Güvenlik yamaları, Docker güncellemeleri, disk dolması izlemesi sende.
- Genel kural: self-host, yönetilen fatura $50-100/ay bandını geçtiğinde ve
  DevOps deneyimin olduğunda mantıklı. Senin çok-projeli durumun bu eşiği geçiyor.

**Ara yol (önerilen):** woyable.com gibi ayakta kalması kritik olan tek proje
Neon'da yönetilen kalsın; geri kalan tüm projeler Hetzner'a. Böylece hem maliyet
düşer hem de üretim sitesi senin uptime'ına bağlı olmaz.

## A.5 Göç adımları (woyable.com)

```bash
# 1. Kaynaktan tam dump (Supabase session pooler, port 5432)
pg_dump "$SUPABASE_URI" -Fc -f woyable.dump

# 2. Hedefte boş DB oluştur (Neon veya Hetzner Postgres)

# 3. Geri yükle
pg_restore -d "$NEW_URI" --no-owner --no-privileges woyable.dump

# 4. Doğrula: satır sayıları
psql "$NEW_URI" -c "select count(*) from posts;"   # 272 beklenir (136 × 2 locale)

# 5. Vercel env: DATABASE_URI + DATABASE_URI_TRANSACTION güncelle
# 6. Preview deploy'da doğrula, sonra production
# 7. Supabase projesini 1 hafta silme — geri dönüş yolu kalsın
```

Alternatif (daha temiz): boş DB'de `pnpm migrate` + `pnpm seed`. Tüm içerik zaten
markdown'da ve seed idempotent. Kaybolan tek şey `likes` / `bookmarks` /
`page_views` — bunlar için kısmi dump al.

> Dikkat: `translationKey` ve taksonomi `key` alanları seed idempotensinin temeli.
> Göçte bunlara dokunma.

---

# B. Büyüme: trafik, özellikler, pazarlama

## B.1 Dürüst başlangıç noktası

**Elindeki güçlü kartlar:** 136 konu × 2 dil = 272 yazı, günlük otomatik üretim,
her yazıda özgün el çizimi kapak, EN yazılarda seslendirme, temiz teknik SEO
(hreflang, JSON-LD, sitemap, OG), kendi admin paneli, public repo.

**Karşındaki asıl risk — bunu atlamak yanlış olur:** Google'ın Şubat 2026 Discover
core güncellemesi tam olarak senin ürettiğin içerik sınıfını hedefliyor: özgün
içerik daha ağır puanlanıyor, **yalnızca özetleyen içerik geri plana atılıyor**,
E-E-A-T sinyalleri belirleyici hale geldi. Günde 5 AI yazısı, hiçbir birincil
veri içermiyorsa, hacim büyüdükçe getirisi azalan bir yatırım.

Bu yüzden aşağıdaki plan iki koldan gidiyor: **(1) mevcut hacmi savunulabilir
kılmak**, **(2) hacmin sağlayamayacağı farklılaşmayı eklemek**.

## B.2 En büyük fırsat: elindeki şeyi göremiyorsun

İki tane var:

### ~~Fırsat 1 — Podcast~~ (KAPSAM DIŞI, 2026-08-17)

> Değerlendirildi ve **reddedildi**: dizinlere yükleme yapılmayacak. Feed yazılmış,
> denenmiş ve tamamen kaldırılmıştır — kodda podcast'e ait hiçbir şey kalmadı.
> Aşağıdaki gerekçe, karar tekrar açılırsa diye kayıt olarak duruyor.

`generate-audio.yml` + Piper TTS ile makalelerin MP3'lerini üretip GitHub
Release'e koyuyorsun. `audio-manifest.json`'da süre, boyut, URL var.

**Bu, bir podcast RSS feed'inden 50 satır uzakta.** `/[locale]/podcast.xml`
route'u yaz (mevcut `feed.xml/route.ts` deseninin aynısı, `<enclosure>` ve
iTunes namespace'i eklenmiş), Spotify for Podcasters + Apple Podcasts'e gönder.

Neden önemli: podcast dizinleri kendi keşif motorlarına sahip, SEO'dan tamamen
bağımsız bir trafik kanalı, rekabet blog'a göre çok düşük ve **ek maliyeti sıfır**.
TR seslendirmesi açıldığında (`AUDIO_LOCALES=tr,en`) Türkçe teknoloji podcast'i
alanı çok daha boş.

Yapılacak: TR sesini seç (`ses-ornekleri/` klasöründe zaten karşılaştırma var),
`AUDIO_LOCALES`'i aç, podcast feed'ini yaz, 3 dizine gönder.

### Fırsat 2 — Meta-hikaye: "tamamen otomatik çalışan bir blog"

`/transparency` sayfan ve `ai-transparency-badge` bileşenin var — AI ile
üretildiğini zaten saklamıyorsun. Bu bir zayıflık değil, **asıl ürünün**.

Hacker News, Reddit ve Indie Hackers'ta "AI ile yazılmış 5 teknoloji yazısı"
sıfır ilgi görür. **"Günde 5 iki dilli yazı üreten, kapaklarını çizen,
seslendirmesini yapan, kendi kendini deploy eden bir hattı nasıl kurdum — kod
açık, maliyeti ayda $X"** yazısı HN ön sayfası malzemesidir. Repo zaten public.

Bu tek yazı, 272 yazının toplamından fazla nitelikli trafik ve backlink getirebilir.
Ve backlink'ler tüm siteyi yukarı çeker.

Devamı: aylık "build in public" raporu (trafik, maliyet, ne çalıştı/çalışmadı).
Bu format Indie Hackers ve r/SideProject'te düzenli olarak ilgi görüyor.

## B.3 Nerede paylaşmalısın

### Uluslararası (EN içerik)

**Yüksek getiri, önce bunlar:**

| Kanal | Ne gönderilir | Not |
|---|---|---|
| **daily.dev** | RSS'i kaynak olarak kaydet | Geliştirici eklentisi; kabul edilirsen her yazı otomatik dağıtılır. En yüksek getiri/emek oranı. |
| **Hacker News** | Yazı değil — B.2'deki meta-hikaye ve araçlar (`Show HN`) | Hafta içi 08:00-10:00 ET. Kendi yazını "Show HN" yapma, sadece çalışan şeyleri. |
| **Reddit** | r/webdev, r/nextjs, r/SideProject, r/selfhosted, r/artificial, r/LocalLLaMA | Link atıp kaçmak ban sebebi. Önce 2-3 hafta yorum yaparak hesap ısıt. |
| **dev.to / Hashnode / Medium (In Plain English)** | Tam metin çapraz yayın, `rel=canonical` woyable'a | Kendi SEO'nu yemeden erişim. |
| **Bülten gönderimleri** | TLDR, Hacker Newsletter, Console.dev (araçlar), Bytes.dev / JavaScript Weekly / Node Weekly (JS), Changelog News, Pointer.io | Tek seferlik gönderim, sürekli getiri. |
| **Product Hunt** | Blog değil — araçların (AI Tool Picker gibi) | |
| **Lobste.rs** | Davetle giriliyor | Küçük ama çok kaliteli trafik. |
| **HackerNoon / DZone / freeCodeCamp News** | Sendikasyon | Yüksek otoriteli backlink. |

**Sosyal:** LinkedIn (aşağıya bak), X, Bluesky, Mastodon (fosstodon — self-host/açık
kaynak içerikleri için şaşırtıcı derecede iyi).

### Türkiye (TR içerik) — asıl avantajın burada

Türkçe teknik içerikte rekabet İngilizce'ye göre bir-iki kat daha düşük, sen ise
zaten iki dilli üretiyorsun. Türkçe tarafını ikinci sınıf muamelesi yapma.

| Kanal | Nasıl kullanılır |
|---|---|
| **LinkedIn (TR)** | Türk yazılım kitlesinin ana mecrası. Yazının özetini gönderi olarak yaz, linki ilk yoruma koy. En yüksek getirili tek TR kanalı. |
| **Telegram grupları** | Python Türkiye, GNU/Linux Türkiye, JS/TS toplulukları, `cengturkey` yazılım grupları. Konuyla alakalı, kişisel yorumla paylaş. |
| **Discord** | Türkiye Geliştiriciler Topluluğu, Patika.dev topluluğu, Kodluyoruz. |
| **Kommunity** | Etkinlik + topluluk platformu; TR tech topluluklarının merkezi. |
| **Devnot** | Developer Summit'i düzenliyor, yazı gönderimi kabul ediyor. Konuşmacı başvurusu da bir kanal. |
| **Technopat Sosyal / DonanımHaber forum** | Yazılım/teknoloji alt forumları; hâlâ ciddi organik trafik alıyorlar. |
| **Medium TR yayınları** | Kodcular, Devnot, Türkiye Yazılım Topluluğu — canonical ile çapraz yayın. |
| **Reddit** | r/CodingTR, r/Turkey (teknik içerikte çok seçici ol). |
| **Ekşi Sözlük** | Sadece gerçekten ilgili başlıklarda, reklam gibi durmadan. Yanlış yaparsan geri teper. |
| **Webrazzi** | Haber değeri olan şey için (ör. B.2'deki otomasyon hikayesi). |

**Boşluk:** Türkçe haftalık yazılım bülteni alanında yalnızca birkaç oyuncu var
(Erman Taylan, Muhammed Hilmi Koca — her biri ~1500 abone bandında). Günde 5 yazı
üreten bir hattın varken haftalık TR bülteni çıkarmamak kaçırılmış fırsat.

## B.4 Eklenecek özellikler — getiriye göre sıralı

### Kademe 1 (önce bunlar)

1. ~~Podcast feed'i~~ — kapsam dışı (2026-08-17).
2. **Bülten** — kendi domaininde. Buttondown veya Resend + kendi `subscribers`
   koleksiyonu (Payload zaten var). RSS-to-email otomatik gönderim. Trafik değil
   **sahiplik** kazandırır: Google güncellemesi seni vurduğunda kalan tek şey.
3. **Google Publisher Center kaydı** — resmî şart değil ama pratikte Discover
   trafiğini tetiklediği gözlemleniyor. Teknik gereksinimler: HTTPS ✓, mobil ✓,
   1200px+ görsel ✓ (kapaklar 1344×768). **`max-image-preview:large` meta
   etiketini doğrula** — yoksa ekle, Discover için kritik.
4. **GEO / AI arama görünürlüğü** — AI motorları artık İngilizce bilgi
   sorgularının %12-18'ini karşılıyor ve dönüşüm oranları organikten kat kat
   yüksek. Yapılacaklar: `llms.txt`, her yazıda net tanım paragrafı ("X nedir?"e
   doğrudan cevap), alıntılanabilir istatistikler, görünür güncelleme tarihi,
   Article JSON-LD ✓ (zaten var). Not: AI Overviews ağırlıkla zaten organikte
   sıralanan sayfaları alıntılıyor — GEO, SEO'nun yerine geçmez, üstüne biner.
5. **Yorumlar (Giscus)** — GitHub Discussions üstünde, ücretsiz, altyapı yok.
   Etkileşim sinyali + tekrar ziyaret.
6. **Ücretsiz araçlar** — `AI Tool Picker` doğru fikirdi, çoğalt. Araçlar
   organik olarak backlink toplar, HN/Product Hunt'a gönderilebilir ve yazıların
   aksine bayatlamaz. Her araç bir yazıdan 10 kat değerli.

### Kademe 2

7. **Web push bildirimleri** — tek tıkla abonelik, e-posta listelerinden çok daha
   hızlı büyüyor, blog için dönüş ziyareti getirisi yüksek.
8. **Seri / çok bölümlü içerik** — "Bölüm 2 yarın" tekrar ziyaret üretir.
9. **Sözlük / kavram wiki'si** — uzun kuyruk SEO + iç link ağı. `link-map.json`
   altyapın buna hazır.
10. **Karşılaştırma sayfaları** ("X vs Y") — teknik SEO'da en yüksek arama
    niyeti olan format.
11. **E-E-A-T sertleştirme** — gerçek yazar kimliği, fotoğraf, LinkedIn bağlantısı,
    "bu yazı nasıl üretildi" bloğu. Şubat 2026 güncellemesinden sonra pazarlık
    konusu değil.

### Kademe 3

12. **Kısa video** — YouTube Shorts / TikTok TR, yazıdan türetilmiş. Kapak
    illüstrasyonların bu formatta ayrışır.
13. **Gömülebilir widget / public API** — başkasının sitesinde çalışan şey backlink
    üretir.
14. **Üçüncü dil** — hat zaten iki dilli; marjinal maliyet düşük.

## B.5 İçerik stratejisinde bir düzeltme

Günde 5 yazı, hiçbiri birincil veri içermiyorsa, Şubat 2026 sonrası ortamda
verimsiz. Öneri: **hacmi düşürme, kompozisyonu değiştir.**

Haftalık 35 yazının 3-5'ini "özgün" kategorisine ayır:
- Kendi benchmark'ın (ör. "Piper TTS'i 6 Türkçe ses modeliyle test ettim" —
  `ses-ornekleri/` klasöründe veri zaten duruyor)
- Kendi maliyet/altyapı verilerin (bu dokümanın A bölümü tam bir yazı konusu:
  "Supabase egress faturamı nasıl 10'a böldüm")
- Kendi hattından çıkan ölçümler (272 yazı, X kapak, aylık $Y)

Bunlar Discover ve AI alıntıları için "özgün içerik" sinyali üretir ve tüm domain'i
yukarı çeker. Otomatik yazılar da bu otoriteden faydalanır.

## B.6 Ölçüm

- **Google Search Console** — TR ve EN için ayrı property; **Discover raporunu**
  ayrıca izle (Arama raporundan bağımsız).
- **AI referral takibi** — `chatgpt.com`, `perplexity.ai`, `claude.ai`
  referrer'larını GTM'de ayrı segment yap. Bu kanalın büyüyüp büyümediğini
  bilmeden GEO'ya yatırım yapma.
- **UTM** — daily.dev, Reddit, LinkedIn, Telegram için ayrı etiketler; hangi
  kanalın gerçekten getirdiğini üç ay sonra bileceksin.
- **Kendi `page_views` tablon** ✓ zaten var — panel dashboard'unda duruyor.

## B.7 90 günlük sıra

**1-2. hafta (altyapı borcu):** `select` düzeltmesi → egress ölç → artımlı seed →
seed'i build'den çıkar. Karar: Neon'a taşı veya bekle.

**3-4. hafta (sahiplik):** Bülten kurulumu. Giscus yorumlar.
Bülten kurulumu. Giscus yorumlar.

**5-6. hafta (keşfedilebilirlik):** Publisher Center kaydı, `max-image-preview`
doğrulaması, `llms.txt`, E-E-A-T yazar bloğu. daily.dev kaynak başvurusu.

**7-8. hafta (asıl atış):** B.2'deki meta-hikaye yazısını yaz — HN, Reddit,
Indie Hackers, Webrazzi, LinkedIn. Bülten gönderimleri (TLDR, Console.dev, Bytes).

**9-12. hafta (kalıcılık):** Haftada 1 özgün/veri yazısı ritmi. TR haftalık
bülten. 2-3 yeni ücretsiz araç. Aylık build-in-public raporu.

---

## Kaynaklar

**Altyapı**
- [Supabase Pricing](https://supabase.com/pricing) — Free limitleri, Pro organizasyon bazlı faturalama
- [Neon Pricing](https://neon.com/pricing) — Free/Launch kademeleri, proje ve egress limitleri
- [Hetzner CX22 Pricing 2026](https://vpsfor.dev/posts/hetzner-cx22-pricing-2026/) — Nisan 2026 zamlı fiyatlar
- [Hetzner Cloud Review 2026 — Better Stack](https://betterstack.com/community/guides/web-servers/hetzner-cloud-review/) — 20 TB trafik, €1/TB aşım
- [Deploy Self-Hosted Supabase on Hetzner with Coolify](https://community.hetzner.com/tutorials/coolify-supabase-deploy/) — resmî Hetzner rehberi
- [The True Cost of Self-Hosting Supabase](https://www.supascale.app/blog/the-true-cost-of-selfhosting-supabase-a-breakdown) — kaynak gereksinimleri
- [I Self-Hosted 4 Projects on Hetzner + Coolify](https://ceaksan.com/en/hetzner-coolify-self-hosting-reality) — gerçek çok-projeli deneyim
- [PostgreSQL Hosting Options 2026 — Bytebase](https://www.bytebase.com/blog/postgres-hosting-options-pricing-comparison/)
- [Free PostgreSQL Hosting: Every Real Option (2026)](https://swyftstack.com/blog/free-postgresql-hosting)
- [Payload CMS with Neon Postgres — Neon Guides](https://neon.com/guides/payload)
- [Payload Postgres docs](https://payloadcms.com/docs/database/postgres)

**Büyüme**
- [Google February 2026 Discover Core Update — Publisher Guide](https://almcorp.com/blog/google-february-2026-discover-core-update-guide/)
- [Ultimate Google Discover Optimization Guide 2026](https://www.newsifier.com/blog/news-seo/the-ultimate-google-discover-optimization-guide-12-tips-on-how-to-get-more-traffic-2026)
- [How to increase Google Discover traffic with technical fixes — Search Engine Land](https://searchengineland.com/google-discover-technical-fixes-470448)
- [Generative Engine Optimization: The Complete 2026 Guide](https://www.enrichlabs.ai/blog/generative-engine-optimization-geo-complete-guide-2026)
- [GEO: Getting Cited in ChatGPT, Claude, and Perplexity in 2026](https://www.aimagicx.com/blog/generative-engine-optimization-chatgpt-perplexity-2026)
- [How to promote your blog post in 2026](https://thebreakoutinsights.substack.com/p/how-to-promote-your-blog-post-in)
- [Best Tech Blogs for Developers 2026: Where to Publish](https://resources.plainenglish.io/best-tech-blogs-for-developers-in-2026-expert-picks-and-where-to-publish)
- [Yazılım Geliştirici Toplulukları — TalentGrid](https://talentgrid.io/tr/yazilim-gelistirici-topluluklari/)
- [Telegram Yazılım Grupları 2026](https://telegramtr.co/telegram-yazilim-gruplari/)
- [Yazılımcılar İçin Discord Rehberi — Patika.dev](https://www.patika.dev/blog/yazilimcilar-icin-discord-rehberi-verimli-iletisim-is-birligi-ve-topluluk-olusturma-stratejileri)
- [Devnot Developer Summit](https://summit.devnot.com/)
- [Türkiye'deki teknoloji bültenleri ve podcastleri](https://medium.com/@GorkemCetin/t%C3%BCrkiyedeki-teknoloji-b%C3%BCltenleri-ve-teknoloji-podcastleri-1744f5d32222)
- [Web Push Notification araçları 2026 — Moosend](https://moosend.com/blog/web-push-notification-tools/)
