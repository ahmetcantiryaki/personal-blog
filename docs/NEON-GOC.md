# woyable.com → Neon göç runbook'u

> Karar: woyable.com Supabase'den Neon'a taşınıyor. Diğer projeler ayrı ele alınacak.
> Ön koşul: `docs/BUYUME-VE-ALTYAPI.md` §A.1'deki egress düzeltmeleri merge edilmiş olmalı.

## Neden risksiz

Kod tabanında **hiçbir yerde `supabase-js` yok**. Payload kendi auth'unu kullanıyor,
dosya yüklemesi yok (kapaklar `public/covers/` altında repoda), realtime yok, edge
function yok. Supabase burada sadece bir Postgres bağlantı dizesi. Göç sonrası
uygulama kodunda **tek satır değişmiyor** — yalnızca iki ortam değişkeni.

## Adım 0 — Sen yapacaksın (hesap)

1. https://neon.com üzerinden hesap aç (GitHub ile giriş yeterli).
2. Yeni proje: **woyable**, bölge **AWS eu-central-1 (Frankfurt)** — Supabase
   projen de eu-central-1'de, Vercel fonksiyonlarına yakınlık korunur.
3. Postgres sürümünü mevcut Supabase sürümüyle eşle (Supabase Dashboard →
   Settings → Infrastructure'da yazıyor; genelde 15 veya 17).
4. Connection Details panelinden **Pooled connection** dizesini kopyala
   (`-pooler` içeren host). Hem `DATABASE_URI` hem `DATABASE_URI_TRANSACTION`
   için bunu kullanacağız — Neon'da Supabase'deki gibi ayrı port ayrımı yok.

## Adım 1 — Yedek al (atlanmaz)

```bash
# Supabase → Settings → Database → Connection string (session pooler, 5432)
export SUPABASE_URI="postgresql://..."

pg_dump "$SUPABASE_URI" -Fc --no-owner --no-privileges -f woyable-$(date +%Y%m%d).dump
```

Dump boyutunu kontrol et — 0 byte ise bağlantı başarısızdır, devam etme.

> `pg_dump` sürümü hedef Postgres sürümünden eski olmamalı. Değilse
> `docker run --rm -v ${PWD}:/out postgres:17 pg_dump ...` ile doğru sürümü kullan.

## Adım 2 — Şemayı Neon'da kur

İki yol var. **B yolu tercih edilir** — daha temiz ve seed idempotensini doğrular.

### A) Doğrudan restore (her şeyi taşır)

```bash
export NEON_URI="postgresql://...-pooler...neon.tech/neondb?sslmode=require"
pg_restore -d "$NEON_URI" --no-owner --no-privileges woyable-YYYYMMDD.dump
```

### B) Migrate + seed (temiz kurulum)

```bash
DATABASE_URI="$NEON_URI" pnpm migrate
DATABASE_URI="$NEON_URI" SEED_FORCE=1 pnpm seed
```

İçeriğin tamamı zaten `seed/content/` altındaki markdown'larda ve seed idempotent.
B yolunda kaybolan tek şey kullanıcı üretimi veri: `likes`, `bookmarks`,
`page_views`, `users`. Bunlar için kısmi dump al ve ayrıca yükle:

```bash
pg_dump "$SUPABASE_URI" --data-only --no-owner \
  -t users -t likes -t bookmarks -t page_views \
  -f user-data.sql

psql "$NEON_URI" -f user-data.sql
```

## Adım 3 — Doğrula

```bash
psql "$NEON_URI" <<'SQL'
select 'posts'      as t, count(*) from posts
union all select 'categories', count(*) from categories
union all select 'tags',       count(*) from tags
union all select 'users',      count(*) from users
union all select 'likes',      count(*) from likes
union all select 'bookmarks',  count(*) from bookmarks
union all select 'page_views', count(*) from page_views;
SQL
```

Aynı sorguyu `$SUPABASE_URI` üzerinde çalıştır ve **satır satır karşılaştır**.
`posts` için 272 beklenir (136 translationKey × 2 locale).

Yerelde son kontrol:

```bash
DATABASE_URI="$NEON_URI" DATABASE_URI_TRANSACTION="$NEON_URI" pnpm dev
```

- Ana sayfa yükleniyor mu, kapaklar geliyor mu
- Bir yazı detayına gir, TR/EN geçişini dene
- `/panel/login` ile admin girişi çalışıyor mu (auth = kullanıcı tablosu taşındı mı)
- Beğeni/kaydetme butonları çalışıyor mu

## Adım 4 — Ortam değişkenlerini geçir

**Vercel** → Project → Settings → Environment Variables:

| Değişken | Yeni değer |
|---|---|
| `DATABASE_URI` | Neon pooled connection string |
| `DATABASE_URI_TRANSACTION` | Aynı pooled string |

**GitHub** → Settings → Secrets and variables → Actions:

Yeni `seed-content.yml` workflow'u için gerekli secret'lar:

| Secret | Not |
|---|---|
| `DATABASE_URI` | Neon pooled string |
| `PAYLOAD_SECRET` | Mevcut `.env`'deki değerin aynısı — değiştirme, oturumlar bozulur |
| `NEXT_PUBLIC_SERVER_URL` | `https://woyable.com` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed'in admin kullanıcısını kurması için |

Yerel `.env` dosyanı da güncelle.

## Adım 5 — Yayına al

1. Önce bir **preview deploy**'da doğrula (Vercel'de preview ortamına Neon
   değişkenlerini ver, production'a henüz dokunma).
2. Preview yeşilse production değişkenlerini geçir ve redeploy et.
3. `seed-content.yml` workflow'unu **`workflow_dispatch` ile elle bir kez çalıştır**
   ve yeşil olduğunu gör. İlk çalışmada manifest yok, tam seed yapacak — normal.
4. Canlıda kontrol: ana sayfa, bir yazı, `/panel`, `/tr/feed.xml`, `/sitemap.xml`.

## Adım 6 — Temizlik (1 hafta sonra)

- Supabase projesini **hemen silme**. En az 1 hafta geri dönüş yolu olarak dursun.
- Bir hafta boyunca Neon Dashboard → Usage'da compute saati ve egress'i izle.
  Ücretsiz kademe: proje başına 0.5 GB depolama, 100 CU-saat, 5 GB egress.
- Egress hâlâ yüksekse `docs/BUYUME-VE-ALTYAPI.md` §A.1'deki 5. maddeye dön:
  `/api/track` görüntüleme başına DB yazıyor, trafik büyüdükçe baskın kalem olur.

## Dikkat edilecekler

- **`translationKey` ve taksonomi `key` alanlarına dokunma** — seed idempotensinin
  temeli. Göçte bunlar değişirse seed her şeyi çoğaltır.
- **`PAYLOAD_SECRET`'i değiştirme** — mevcut kullanıcı oturumları ve şifrelenmiş
  alanlar buna bağlı.
- Neon ücretsiz kademede 5 dakika hareketsizlikte compute'u durduruyor. İlk istek
  ~500ms gecikir (cold start). woyable ISR ile statik servis ettiği için kullanıcı
  bunu görmez, ama panel/API ilk isteğinde hissedilebilir.
- Neon'un ücretsiz kademesinde **depolama 0.5 GB**. Şu anki DB boyutunu göçten
  önce ölç: `select pg_size_pretty(pg_database_size(current_database()));`
  Sınıra yakınsan `page_views` tablosunu budamak ilk hedef.
