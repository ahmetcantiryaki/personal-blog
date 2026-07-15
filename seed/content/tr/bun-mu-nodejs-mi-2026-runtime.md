---
title: "Bun mu Node.js mi: 2026 Runtime Kararı"
slug: "bun-mu-nodejs-mi-2026-runtime"
translationKey: "bun-vs-node-runtime"
locale: "tr"
excerpt: "Bun'ın ham HTTP hızı Node.js'in 4 katı ama gerçek bir Postgres sorgusu girince fark %3'e iniyor. 2026 verileriyle hız, soğuk başlangıç ve migrasyon kararı."
category: "web-development"
tags: ["bun", "nodejs", "backend", "performance", "developer-experience"]
publishedAt: "2026-07-15"
seoTitle: "Bun mu Node.js mi 2026: Benchmark ve Gerçek Performans"
seoDescription: "Bun mu Node.js mi 2026'da? Ham HTTP'de 4 kat fark, Postgres girince %3'e iniyor. Soğuk başlangıç, kurulum hızı, native TypeScript ve migrasyon kararı burada."
---

Kısa cevap şu: basit bir "hello world" testinde Bun, Node.js'ten kabaca dört kat daha fazla istek/saniye kaldırıyor; ama işin içine gerçek bir Postgres sorgusu girdiğinde bu fark %3'e kadar eriyor, çünkü darboğaz artık veritabanı I/O'sudur, JavaScript motoru değil. 2026'da hangisini seçeceğiniz büyük ölçüde projenin yaşına, iş yüküne ve ekibin risk iştahına bağlı.

## Ham HTTP verimi: Bun neden 4 kat önde görünüyor

Sentetik benchmark'lara bakıldığında fark çarpıcı. Basit bir "hello world" HTTP sunucusunda Bun saniyede yaklaşık **52.000 istek** işlerken, Node.js aynı donanımda **13.000 istek** civarında düzleşiyor ([PkgPulse'un 2026 runtime karşılaştırması](https://www.pkgpulse.com/guides/bun-vs-nodejs-npm-runtime-speed-2026)). Bu, kabaca 4 kat fark demek ve Bun'ın altındaki JavaScriptCore motoru ile daha ince bir HTTP sunucu implementasyonunun getirdiği gerçek bir avantaj.

Ama bu sayı, üretimdeki hiçbir sistemi temsil etmiyor. Gerçek bir API endpoint'i JSON parse eder, bir ORM çağırır, bir veritabanına gider ve sonucu serialize eder. Sonraki bölüm tam olarak burada ne olduğunu gösteriyor.

## Gerçek bir Postgres girince fark neden eriyor

Yazının asıl can alıcı noktası burada: aynı benchmark'ı bir Postgres sorgusuyla ve gerçek bir serialization adımıyla tekrarladığınızda, Bun'ın 4 katlık üstünlüğü neredeyse tamamen buharlaşıyor. [Strapi'nin performans karşılaştırma rehberi](https://strapi.io/blog/bun-vs-nodejs-performance-comparison-guide) ve PkgPulse'un verileri aynı yöne işaret ediyor: Postgres'e bağlı, gerçekçi bir endpoint'te Bun saniyede yaklaşık **12.400 istek**, Node.js ise yaklaşık **12.000 istek** işliyor — fark yalnızca **%3** civarında.

Sebep basit: veritabanı I/O'su toplam gecikmeye JavaScript motorundan çok daha fazla hakim oluyor. Sorgu ağdan gidip gelirken, connection pool'da sıraya girerken ya da disk I/O'sunu beklerken, hangi runtime'ın döngüsünü çalıştırdığınızın artık pek önemi kalmıyor. p99 gecikmesinde küçük ama gerçek bir fark var: yaklaşık 10 bin istek/saniyelik sürdürülebilir yükte Node.js **~48ms**, Bun ise **~31ms** p99 gösteriyor — DB I/O baskın olsa da event loop ve I/O implementasyonundaki farklar hâlâ ölçülebilir bir iz bırakıyor.

Aşağıdaki tablo iki senaryoyu yan yana koyuyor:

| Senaryo | Bun | Node.js | Fark |
|---|---|---|---|
| Hello-world HTTP (istek/sn) | ~52.000 | ~13.000 | ~4x |
| Postgres'e bağlı endpoint (istek/sn) | ~12.400 | ~12.000 | ~%3 |
| p99 gecikme (10K istek/sn, Postgres) | ~31ms | ~48ms | ~%35 |
| Çıplak hello-world soğuk başlangıç | ~9ms | ~41ms | ~4,5x |
| Kurulum (1.847 bağımlılık) | ~47sn | ~28dk | ~35x |

Bir ORM kullanıyorsanız — mesela [Drizzle ya da Prisma](/tr/posts/drizzle-mi-prisma-mi) — runtime seçiminin toplam yanıt süresine katkısı, sorgu planlamasından ve indeks tasarımından çok daha küçük kalıyor. Aynı mantık [her şey için Postgres kullanan mimarilerde](/tr/posts/her-sey-icin-postgres) de geçerli: veritabanı katmanını optimize etmek, runtime değiştirmekten neredeyse her zaman daha yüksek getiri sağlıyor.

## Soğuk başlangıçlar: sunucusuzda neden önemli

Soğuk başlangıç, isteğin ilk milisaniyelerinde runtime'ın ayağa kalkma süresidir ve serverless mimarilerde doğrudan kullanıcı gecikmesine yansır. Çıplak bir "hello world" HTTP sunucusunda Bun 1.2 yaklaşık **9ms**'de ayağa kalkarken, Node.js 22 için bu süre yaklaşık **41ms**. Gerçek uygulamalarda bu sayılar, yüklenen modül sayısına ve bundle boyutuna göre büyür; yukarıdaki rakamları bir taban çizgisi olarak okuyun, bir garanti olarak değil.

Bunu, Lambda tarzı sunucusuz soğuk başlangıçlarla karıştırmayın — bu farklı ve daha büyük ölçekli bir metrik. [Tech Insider'ın 2026 karşılaştırması](https://tech-insider.org/bun-vs-node-2026/), bir AWS Lambda soğuk başlangıcında Bun'ın yaklaşık **290ms**, Node.js'in ise yaklaşık **940ms** sürdüğünü gösteriyor; container başlatma, runtime yükleme ve handler init'i üst üste bindiği için sayılar çıplak sunucu testinden çok daha yüksek çıkıyor. [Edge fonksiyonları ve render stratejileri üzerine rehberimiz](/tr/posts/edge-fonksiyonlari-render-rehberi), bu farkın kullanıcı tarafında ne zaman gerçekten hissedildiğini detaylandırıyor. Tek bir runtime'ı [birden fazla framework'ü aynı projede çalıştıran Vercel Services gibi platformlarda](/tr/posts/vercel-services-tek-projede-mikroservisler) kullanmayı düşünüyorsanız, soğuk başlangıç farkı özellikle düşük trafikli fonksiyonlarda katlanarak öne çıkıyor.

## Kurulum hızı: npm'e karşı 35 kata kadar

Bun'ın kurulum hızı gerçek ama abartılmaya çok müsait bir sayı. En sık alıntılanan rakam — npm'e göre **35 kata kadar** hızlı — 1.847 bağımlılığı olan büyük bir monorepo'dan geliyor: Bun kurulumu **47 saniyede**, npm ise **yaklaşık 28 dakikada** tamamlıyor ([PkgPulse](https://www.pkgpulse.com/guides/bun-vs-nodejs-npm-runtime-speed-2026)). Bu, evrensel bir çarpan değil, büyük bağımlılık ağaçlarında görülen bir tavan rakamı.

Daha küçük, tipik bir projede fark **10-30x** aralığına iniyor; hâlâ çarpıcı ama "her zaman 35 kat" beklentisiyle CI pipeline'ınızı planlamayın. Kurulum hızı asıl CI/CD süresinde, büyük monorepo'larda ve günlük geliştirici deneyiminde hissediliyor.

## Native TypeScript, yerleşik test çalıştırıcı ve kalan ekosistem boşlukları

Bun, .ts dosyalarını ayrı bir derleme adımı olmadan doğrudan çalıştırır; Node.js'te aynı işi yapmak için hâlâ ts-node, tsx ya da bir build adımı gerekiyor. [TypeScript 7'nin Go tabanlı derleyicisi](/tr/posts/typescript-7-go-derleyici) tip kontrolünü hızlandırsa da bu ayrı bir konu — Bun'ın avantajı, çalışma zamanında derleme adımını tamamen atlamasıdır.

Bun'ın yerleşik test çalıştırıcısı (`bun test`) da aynı felsefeden geliyor: ek bir bağımlılık kurmadan Jest'e benzer bir API ile test yazıp çalıştırabilirsiniz. Node.js yalnızca yakın zamanda deneysel bir yerleşik test çalıştırıcısına kavuştu; olgunluk ve ekosistem desteği açısından hâlâ Bun'ın gerisinde.

İki minimal HTTP sunucusu yan yana böyle görünüyor:

```javascript
// Bun — native, ek bağımlılık yok
Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("merhaba");
  },
});

// Node.js — yerleşik http modülü
import { createServer } from "node:http";

createServer((req, res) => {
  res.end("merhaba");
}).listen(3000);
```

Madalyonun öteki yüzü ekosistem olgunluğu. Bun'ın Node-API native eklentileriyle ve bazı Node'a özgü internal'lara dayanan npm paketleriyle uyumluluğu her sürümde iyileşiyor ama hâlâ uç durumlar var. Ağır native bağımlılıkları olan (görüntü işleme, kripto, veritabanı sürücüleri gibi) olgun bir Node uygulamasını taşımak "paketi kur ve çalıştır" kadar basit değil; bazı paketler sessizce bozuluyor ya da hiç derlenmiyor.

## Greenfield mi migrasyon mu: karar kuralı

Açık görüşüm şu: olgun bir Node.js uygulamasını sırf "belki %3'lük farktan daha iyisini alırım" diye Bun'a taşımak, çoğu ekip için riski ödülden fazla büyütüyor. Gerçek kazanç DB-ağırlıklı üretim trafiğinde değil; kurulum hızında, native TypeScript'te ve geliştirici deneyiminde saklı.

Basit bir karar kuralı:

- **Greenfield bir servis veya API başlatıyorsanız**, özellikle serverless/edge ağırlıklıysa, Bun varsayılan seçim olmalı: soğuk başlangıç, kurulum hızı ve native TypeScript üçü birden doğrudan kazanç.
- **Ağır native bağımlılıkları olan, DB-bound, olgun bir Node uygulamanız varsa**, migrasyonun riski üretim performansındaki kazançtan büyük — bunun yerine Bun'ı yalnızca yerel geliştirme, CI kurulumu ve test çalıştırma için deneyin; prod runtime'ı değiştirmeden de bu kazanımların çoğunu alırsınız.
- **Arada bir yerdeyseniz** (orta ölçekli, az native bağımlılık, trafiğiniz zaten DB-bound), önce staging'de gerçekçi bir yük testiyle kendi %3'ünüzü ölçün — genellenmiş bir benchmark yerine kendi verinize güvenin.

[Web Geliştirme kategorisindeki](/tr/category/web-gelistirme) diğer runtime ve framework karşılaştırmaları, bu tür kararları verirken işinize yarayabilir.

## Sıkça Sorulan Sorular

### Bun 2026'da prodüksiyonda kullanılabilir mi?

Evet. Bun 1.2 ve sonrası sürümler, greenfield API'ler ve serverless fonksiyonlar için üretime hazır kabul ediliyor. Riskli olan taraf runtime'ın kendisi değil, ağır native bağımlılıkları olan mevcut bir Node uygulamasını taşımak.

### Bun, Node.js'in yerini tamamen alacak mı?

Kısa vadede hayır. Node.js'in ekosistem olgunluğu, native eklenti desteği ve kurumsal benimsenmesi hâlâ çok daha geniş. Bun özellikle yeni projelerde ve geliştirici deneyiminde pay kazanıyor ama Node.js'in yerini bütünüyle alması yıllar sürecek bir süreç.

### Bun'a geçişte en büyük risk nedir?

Node-API native eklentilerine veya Node'a özgü internal davranışlara bağımlı paketler. Bu paketler Bun'da sessizce bozulabilir ya da hiç derlenmeyebilir; geçişten önce bağımlılık ağacınızı bu açıdan denetlemeniz gerekir.

### Node.js'in yerleşik test çalıştırıcısı bun test'e yetişti mi?

Henüz tam değil. Node'un yerleşik test çalıştırıcısı hâlâ deneysel aşamada ve ekosistem desteği sınırlı; `bun test` daha olgun bir API ve daha hızlı çalışma süresi sunuyor.
