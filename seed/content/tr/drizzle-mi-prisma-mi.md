---
title: "Drizzle mi Prisma mı? 2026 TypeScript ORM Seçimi"
slug: "drizzle-mi-prisma-mi"
translationKey: "drizzle-vs-prisma-orm"
locale: "tr"
excerpt: "Drizzle mi Prisma mı? Temmuz 2026'da TypeScript ORM seçimi: Drizzle'ın ~7,4 KB paketi, Prisma 7'nin WASM geçişi ve proje tipine göre karar tablosu."
category: "web-development"
tags: ["databases", "typescript", "backend", "performance", "best-practices"]
publishedAt: "2026-07-13"
seoTitle: "Drizzle mi Prisma mı? 2026 ORM Karşılaştırması"
seoDescription: "Drizzle mi Prisma mı? 2026 TypeScript ORM kıyası: paket boyutu, edge soğuk başlangıç, Prisma 7 WASM motoru, migration DX ve proje tipine göre karar tablosu."
---

Drizzle mi Prisma mı sorusunun 2026 yanıtı projenizin şekline bağlı: Drizzle, ~7,4 KB'lık paketi ve SQL'e yakın API'siyle edge ve serverless ortamlarda öne çıkar; Prisma ise 7.0 sürümüyle 14 MB'lık Rust motorunu ~1,6 MB'lık WASM derleyiciye taşıyarak eski soğuk başlangıç cezasını büyük ölçüde kapattı. Aşağıda ikisini sayılarla, şema stilleriyle ve proje tipine göre bir karar tablosuyla karşılaştırıyorum.

## Temel fark: kod öncelikli TS mi, şema öncelikli PSL mi?

İki ORM'in en görünür ayrımı şemayı nerede tanımladığınız. Drizzle şemayı doğrudan TypeScript içinde tanımlar; tablolarınız birer TS nesnesidir ve tipler oradan türer. Prisma ise şemayı ayrı bir `.prisma` dosyasında, Prisma Schema Language (PSL) adı verilen deklaratif bir dille tutar ve tipleri bu tek kaynaktan üretir.

Drizzle'ın kod öncelikli yaklaşımı şöyle görünür:

```typescript
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

Prisma'nın şema öncelikli PSL'i ise ayrı bir dosyada yaşar:

```text
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

Fark yalnızca sözdizimsel değil. PSL tek bir dosyada tüm veri modelini gösterdiği için bir ilişkiyi tek bakışta görselleştirmek kolaydır ve SQL bilmeyen ekip üyeleri de katkı verebilir. Drizzle'da ise şema, TypeScript dünyasının bir parçasıdır: aynı tip sistemi içinde kalırsınız, ayrı bir dil öğrenmezsiniz ama karmaşık bir modelde tablolar birden çok dosyaya yayılabilir. Prisma'nın kendi [karşılaştırma dokümanı](https://www.prisma.io/docs/orm/more/comparisons/prisma-and-drizzle) bu ayrımı "tek gerçek kaynak" lehine yorumlarken, Drizzle "SQL biliyorsan Drizzle'ı biliyorsun" sloganıyla ters yönü savunur.

## Sorgu yazımı: SQL'e yakınlık

Drizzle sorguları SQL'e bilinçli olarak yakın durur; `select`, `where`, `join` zincirini SQL'i tanıyan biri anında okur:

```typescript
import { eq } from 'drizzle-orm'

const activeUsers = await db
  .select({ id: users.id, email: users.email })
  .from(users)
  .where(eq(users.name, 'Burak'))
```

Prisma ise daha yüksek bir soyutlama sunar: `prisma.user.findMany({ where: { name: 'Burak' } })` gibi çağrılar SQL bilgisini gerektirmez. Bu, karmaşık `JOIN` ve alt sorgularda [N+1 sorgu problemini](/tr/posts/n-plus-one-sorgu-problemi) fark etmeyi kolaylaştıran bir seçim; ORM ne kadar soyutlarsa üretilen SQL o kadar gözden kaçar. İki tarafta da doğru indeksleme kritik kalır; temeller için [veritabanı indeksleme](/tr/posts/veritabani-indeksleme) yazımıza bakabilirsiniz.

## Paket boyutu ve edge soğuk başlangıç

En keskin sayısal fark burada. Drizzle, harici bağımlılığı olmayan yaklaşık 7,4 KB'lık (min+gzip) bir çalışma zamanıyla gelir; bu, Cloudflare Workers veya Lambda gibi soğuk başlangıcın milisaniyelerle ölçüldüğü ortamlarda somut bir avantaj.

Prisma tarihsel olarak ~14 MB'lık bir Rust sorgu motoru taşıyordu ve bu, serverless soğuk başlangıçta hissedilir bir cezaydı. Kasım 2025'te çıkan Prisma 7.0 bu mimariyi tersine çevirdi: Rust motoru yerini TypeScript/WebAssembly tabanlı bir Query Compiler'a bıraktı. Prisma'nın [duyurusuna](https://www.prisma.io/blog/announcing-prisma-orm-7-0-0) ve [mimari geçiş yazısına](https://www.prisma.io/blog/from-rust-to-typescript-a-new-chapter-for-prisma-orm) göre yeni WASM paketi ~1,6 MB (gzip'te ~600 KB), yani eski ikiliye göre kabaca %90 daha küçük ve sorgularda 3,4 kata kadar hızlı. WASM modülünün kendisi hâlâ Rust'la derleniyor; kritik değişiklik, artık native bir ikili göndermemesi ve edge çalışma zamanlarını desteklemesi.

| Boyut | Drizzle | Prisma 7 |
|---|---|---|
| Paket boyutu | ~7,4 KB (min+gzip) | ~1,6 MB WASM (~600 KB gzip) |
| Şema stili | Kod öncelikli TypeScript | Şema öncelikli PSL (.prisma) |
| Motor | Yok, saf TypeScript | TS/WASM Query Compiler (eski: 14 MB Rust) |
| Sorgu hızı | İnce katman, düşük ek yük | Prisma 6'ya göre 3,4 kata kadar hızlı |
| Migration | drizzle-kit, SQL öncelikli | prisma migrate, deklaratif |
| Edge / serverless | Minimum soğuk başlangıç | v7'de ceza büyük ölçüde kalktı |
| Ekosistem | Büyüyor | Olgun |

Not: Prisma 7 cezayı büyük ölçüde kapatsa da, tek dosyalık ~7,4 KB'lık Drizzle hâlâ paket boyutunda açık ara önde. Bir bağlantı havuzuyla birlikte serverless bağlantı sayısını yönetmek isteyen ekipler için tamamlayıcı okuma: [PgBouncer ile Postgres bağlantı havuzu](/tr/posts/pgbouncer-postgres-baglanti-havuzu).

## Migration DX'i

Prisma'nın en olgun tarafı migration akışı. `prisma migrate`, PSL şemasındaki değişiklikten deklaratif olarak SQL migration üretir ve Prisma Studio gibi hazır araçlarla gelir; hızlı prototip ve yönetim panellerinde bu, dakikalarca zaman kazandırır. Drizzle tarafında `drizzle-kit` SQL öncelikli bir yaklaşım benimser: üretilen migration'lar sade SQL'dir, dolayısıyla ne çalıştığını tam olarak görürsünüz ama bazı adımlar daha elle yönetilir. Kesintisiz şema değişikliği pratikleri için [kesintisiz şema migrasyonları](/tr/posts/kesintisiz-sema-migrasyonlari) yazımız iki ORM'den de bağımsız olarak geçerli.

## Ekosistem ve benimseme

Prisma yıllardır daha geniş bir ekosisteme, daha fazla entegrasyona ve MongoDB, SQL Server, CockroachDB gibi Drizzle'ın desteklemediği veritabanlarına sahip. Drizzle ise Turso, Cloudflare D1 ve çeşitli edge SQLite varyantlarında öne çıkıyor.

Benimseme eğrisi hızla değişti. Temmuz 2026 itibarıyla `drizzle-orm` paketinin haftalık npm indirmeleri `prisma` paketini geçmiş durumda; Drizzle 2025 başındaki ~300 binlerden 2026'da milyonlu haftalık indirmelere çıktı ve GitHub'da ~32 bin yıldıza ulaştı. Yine de nüans önemli: Drizzle ekibinin kurucu ortağının da belirttiği gibi, Prisma'nın çalışma zamanı paketi `@prisma/client` hâlâ yaklaşık 1 milyon daha fazla haftalık indirmeye sahip; yani "geçti" başlığı hangi paketi saydığınıza bağlı. Yön ise net: `create-t3-app` 2024'ten beri Drizzle'ı seçenek olarak sunuyordu ve 2026 başında yeni t3-app projelerinde Drizzle, seçim sayısında Prisma'yı geçti.

## Proje tipine göre karar tablosu

| Proje tipi | Öneri | Neden |
|---|---|---|
| Edge / serverless (Workers, Lambda) | Drizzle | ~7,4 KB paket, minimum soğuk başlangıç |
| Büyük ekip, karışık SQL seviyesi | Prisma | PSL tek kaynak, düşük bilişsel yük |
| SQL ağırlıklı, karmaşık sorgular | Drizzle | SQL'e yakın, ince API |
| Hızlı prototip / yönetim paneli | Prisma | Studio, migrate, hazır DX |
| MongoDB / SQL Server / CockroachDB | Prisma | yalnızca Prisma destekliyor |
| Turso / D1 / edge SQLite | Drizzle | daha geniş edge veritabanı desteği |

## Hangisini seçmeliyim?

Açıkça söyleyeyim: greenfield bir edge veya serverless projesinde varsayılanım Drizzle. Tek dosyalık ~7,4 KB'lık ayak izi ve SQL'e yakınlığı, soğuk başlangıcın ve öngörülebilir sorguların önemli olduğu yerlerde bana daha az sürpriz yaşatıyor. Ama bu genel bir "kazanan" ilanı değil: SQL seviyesi karışık büyük bir ekipte, MongoDB'ye ihtiyaç duyan bir üründe veya hızlı bir yönetim paneli çıkarırken Prisma'nın olgun migration akışı ve tek kaynaklı PSL şeması hâlâ daha hızlı yol aldırıyor.

2026'nın asıl haberi, seçimin artık "küçük ve hızlı" ile "olgun ama ağır" arasında olmaktan çıkması. Prisma 7'nin WASM geçişiyle eski soğuk başlangıç argümanı büyük ölçüde zayıfladı; karar giderek daha çok şema stili tercihine, ekip profiline ve veritabanı desteğine dayanıyor. TypeScript tarafında tip güvenliğini daha da sıkılaştırmak isteyenler için [ileri TypeScript kalıpları](/tr/posts/ileri-typescript-kaliplari) iki ORM'le de uyumlu bir temel sunuyor. Postgres'i tek altyapı olarak merkeze almak isteyenlerse [her şey için Postgres](/tr/posts/her-sey-icin-postgres) yaklaşımımıza göz atabilir.

## Sıkça Sorulan Sorular

### Drizzle mi Prisma mı, hangisi daha hızlı?

Ham sorgu ek yükünde Drizzle'ın ince katmanı avantajlı. Prisma 7, WASM Query Compiler'la Prisma 6'ya göre 3,4 kata kadar hızlandı ve eski Rust motorunun soğuk başlangıç cezasını büyük ölçüde kapattı, ama tek dosyalık ~7,4 KB'lık Drizzle edge ortamlarında hâlâ en düşük başlangıç yüküne sahip.

### Prisma 7 gerçekten Rust'sız mı?

Tam olarak değil. Prisma 7, native Rust ikilisini kaldırıp yerine TypeScript/WASM tabanlı bir Query Compiler koydu; fakat WASM modülünün kendisi hâlâ Rust'la derleniyor. Pratik kazanç, ~14 MB'lık native ikilinin ~1,6 MB'lık WASM'a inmesi ve edge çalışma zamanlarının desteklenmesi.

### Drizzle, Prisma'yı npm indirmelerinde gerçekten geçti mi?

`drizzle-orm` paketi haftalık indirmelerde `prisma` paketini geçti, ancak Prisma'nın çalışma zamanı paketi `@prisma/client` hâlâ yaklaşık 1 milyon daha fazla indirmeye sahip. Yani başlık, hangi paketleri karşılaştırdığınıza bağlı; genel yön Drizzle lehine ama Prisma'nın kurulu tabanı büyük.

### Mevcut Prisma projesini Drizzle'a taşımalı mıyım?

Yalnızca paket boyutu için genelde hayır. Prisma 7 sonrası soğuk başlangıç farkı çoğu uygulamada belirleyici değil; migration akışınız oturmuşsa taşıma maliyeti kazanımı aşabilir. Diğer web geliştirme karşılaştırmaları için [web geliştirme kategorimize](/tr/category/web-gelistirme) göz atabilirsiniz.
