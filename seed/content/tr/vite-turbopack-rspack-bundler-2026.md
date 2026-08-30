---
title: "Vite, Turbopack, Rspack: 2026 Bundler Savaşı"
slug: "vite-turbopack-rspack-bundler-2026"
translationKey: "frontend-bundlers-2026"
locale: "tr"
excerpt: "Kısa cevap: Vite 8'i yeni projede, Rspack'i webpack göçünde, Turbopack'i sadece Next.js dev sunucusunda kullan. Prod build'de Turbopack henüz kararlı değil."
category: "web-development"
tags: ["frontend", "performance", "nextjs", "rust"]
publishedAt: "2026-08-30"
seoTitle: "Vite, Turbopack, Rspack: 2026 Bundler Karşılaştırması"
seoDescription: "Kısa cevap: Vite 8'i yeni projede, Rspack'i webpack göçünde, Turbopack'i sadece Next.js dev sunucusunda kullan. Prod build'de Turbopack henüz kararlı değil."
---

Kısa cevap: yeni bir proje başlatıyorsan Vite 8'i (Rolldown motoruyla) kullan; mevcut bir webpack projesini göçürüyorsan Rspack'e geç; Next.js'te çalışıyorsan Turbopack'i sadece geliştirme sunucusunda kullan, çünkü prod build tarafı Ağustos 2026 itibarıyla hâlâ kararlı değil. Üçü de Rust tabanlı ve webpack'in JavaScript darboğazını aşmak için var, ama olgunluk seviyeleri farklı.

## Neden herkes webpack'ten Rust/Go tabanlı araçlara geçiyor?

webpack'in temel sorunu, bundling mantığının JavaScript ile yazılmış olması: büyük projelerde tek çekirdekli ayrıştırma, dakikalarca süren cold start ve HMR gecikmesi anlamına geliyor. Vite, Turbopack ve Rspack bu darboğazı Rust (Turbopack, Rspack) veya Rust tabanlı bir motor (Vite'ın Rolldown'ı) ile ortadan kaldırıyor; ayrıştırma ve dönüştürme işini birden fazla CPU çekirdeğine paralel dağıtıyorlar.

Sonuç, geliştirme deneyiminde ölçülebilir bir fark: Rolldown'ın kendi ölçümlerine göre 19.000 modül, minifikasyon ve source map dahil 1,61 saniyede bundle edilebiliyor. Bu, webpack'in benzer boyuttaki bir projede onlarca saniye sürebilen prod build süresiyle karşılaştırıldığında büyük bir fark.

## Vite (Rolldown) ne durumda?

Vite 8, 12 Mart 2026'da yayınlandı ve tek bundler olarak Rolldown'ı kullanıyor; böylece eskiden dev sunucusunda esbuild, prod build'de Rollup kullanan ikili yapı ortadan kalktı. Rolldown'ın kendisi 7 Mayıs 2026'da 1.0 sürümüne ulaştı — yani Ağustos 2026 itibarıyla hem Vite 8 hem de Rolldown üretim için kararlı kabul ediliyor.

Bu birleşme, dev ve prod build arasındaki tutarsızlık sorununu (dev'de çalışan bir kodun prod'da farklı davranması) büyük ölçüde ortadan kaldırdı, çünkü artık aynı Rust motoru iki ortamda da çalışıyor. Ekosistem uyumluluğu açısından Vite eklenti API'si stabil kaldığı için mevcut Vite eklentilerinin büyük kısmı Rolldown ile sorunsuz çalışıyor.

## Turbopack neden hâlâ tam bir bundler değil?

Turbopack, Next.js'in geliştirme sunucusunda hızlı ve olgun, ama prod build tarafı (`next build --turbo`) Ağustos 2026 itibarıyla hâlâ kararlı değil. Bu, Turbopack'i günlük geliştirme için mükemmel ama üretim pipeline'ının tamamı için henüz önerilemeyecek bir araç yapıyor.

Next.js dışında bir framework kullanıyorsan Turbopack seçeneği zaten yok, çünkü Vercel bunu öncelikli olarak kendi framework'üne bağlı geliştiriyor. Next.js ekosistemine kilitli kalmak seni rahatsız etmiyorsa ve prod build'i webpack veya Rspack'te bırakmaya razıysan, dev deneyimi için Turbopack mantıklı bir seçim.

## Rspack ne zaman tercih edilmeli?

Rspack, ham prod build hızında öne çıkıyor çünkü bundling sürecinin tamamını Rust'ta paralelleştiriyor ve CPU çekirdek sayısıyla doğrusal ölçekleniyor; büyük, çok çekirdekli CI makinelerinde bu fark daha da açılıyor. webpack API'siyle büyük ölçüde uyumlu olduğu için, mevcut bir webpack config'ini sıfırdan yeniden yazmadan Rspack'e taşımak genelde mümkün.

Bu yüzden Rspack'in asıl kullanım senaryosu net: yıllardır büyüyen, eklenti ve loader dolu bir webpack projen varsa ve yeniden yazmak istemiyorsan, Rspack en düşük sürtünmeli geçiş yolu. Sıfırdan proje başlatıyorsan bu avantaj işe yaramıyor, çünkü zaten göçürülecek bir webpack config'in yok. Büyük monorepo'larda bu fark daha da belirginleşiyor: yüzlerce paketin her birinde ayrı ayrı loader ayarı olan bir yapı, Rspack'e geçince config'lerin büyük kısmını neredeyse hiç değiştirmeden koruyabiliyor.

## Üç aracı hangi kritere göre karşılaştırmalı?

Aşağıdaki tablo üç aracı güncel durumlarına göre özetliyor:

| Kriter | Vite 8 (Rolldown) | Turbopack | Rspack |
|---|---|---|---|
| Prod build hızı | Çok hızlı, Rolldown ile eski Vite'a göre 13 kata kadar iyileşme | Kararsız (hâlâ deneysel) | En hızlı; çekirdek sayısıyla doğrusal ölçekleniyor |
| HMR / dev deneyimi | Hızlı, olgun | Çok hızlı, Next.js'e özel optimize | Hızlı, webpack'e yakın API |
| Framework bağımlılığı | Framework-agnostic | Sadece Next.js | Framework-agnostic |
| webpack config uyumluluğu | Düşük (farklı eklenti API'si) | Yok | Yüksek |
| Önerilen kullanım | Yeni proje, framework-agnostic ekip | Next.js dev sunucusu | Mevcut webpack projesini göçürme |

## Vite 8'e geçerken config nasıl görünüyor?

Rolldown geçişinin en rahatlatıcı yanı, çoğu projede `vite.config` dosyasının neredeyse değişmeden kalması. Aşağıdaki örnek, tipik bir Vite 8 yapılandırmasının ne kadar sade kaldığını gösteriyor:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: true,
  },
})
```

Rolldown, bu dosyayı okuyan motor olarak esbuild ve Rollup'ın ikisinin de yerini alıyor; eklenti tanımların (`plugins` dizisi) aynı kalması, çoğu ekibin config dosyasına dokunmadan sürüm yükseltmesi anlamına geliyor. Asıl dikkat edilmesi gereken yer, doğrudan esbuild veya Rollup API'sine bağımlı özel eklentiler — bunlar Rolldown'ın eşdeğer API'sine göre güncellenmesi gereken nadir istisnalar.

## Göç ederken nelere dikkat etmeli?

En büyük risk, eklenti uyumluluğu: webpack'ten Vite'a geçerken loader tabanlı eklentilerin (ör. özel babel dönüşümleri) Vite eşdeğerini bulman gerekiyor, bu bazen doğrudan bire bir karşılık gelmiyor. Rspack'e göçte ise webpack API uyumluluğu yüksek olsa da, bazı az kullanılan webpack eklentileri (özellikle native Node.js modüllerine bağımlı olanlar) hâlâ sorun çıkarabiliyor.

Ekibinin CI süresini kısaltmak asıl hedefse, önce tek bir paketi (monorepo'daysan) veya bir feature branch'i yeni bundler'a taşıyıp build sürelerini gerçek verilerle ölç — üç aracın da pazarlama sayfalarındaki benchmark'lar farklı donanım ve proje boyutlarıyla ölçülüyor, bu yüzden kendi projenle test etmeden karar verme.

Kaynak haritası (source map) üretimi de gözden kaçan bir detay: geliştirme sırasında hızlı görünen bir bundler, prod build'de tam source map üretirken yavaşlayabiliyor. Göç öncesi hem source map'li hem source map'siz build sürelerini ayrı ayrı ölçmek, CI pipeline'ında gerçekten ne kadar kazanacağını daha net gösteriyor.

Bundler seçimi tek başına yeterli değil; lint ve format katmanını da hızlandırmak istiyorsan [ESLint yerine Biome ve Oxlint kullanımına dair yazımıza](/tr/posts/eslint-yerine-biome-ve-oxlint) bakabilirsin. TypeScript derleme hızını da aynı mantıkla artırmak istiyorsan [TypeScript 7'nin Go tabanlı derleyicisini](/tr/posts/typescript-7-go-derleyici) incelemeni öneririz. Next.js ile Astro arasında framework seviyesinde karar veriyorsan [Astro mu Next.js mi yazımız](/tr/posts/astro-mu-nextjs-mi) da bu kararı tamamlayan bir kaynak.

## Hangi bundler'ı seçmeliyim?

Framework-agnostic yeni bir proje için Vite 8, en az sürtünmeli ve en olgun seçenek. Next.js'te kalıp sadece dev deneyimini hızlandırmak istiyorsan Turbopack'i dev sunucusunda kullan, prod build'i webpack veya Rspack'te bırak. Büyük, eski bir webpack projesini elden geçirmeden hızlandırmak istiyorsan Rspack en pratik yol.

## Sıkça Sorulan Sorular

### Vite mı Turbopack mı daha hızlı?

Geliştirme sunucusunda ikisi de çok hızlı ve fark genelde proje boyutuna göre değişiyor. Prod build karşılaştırmasında ise Turbopack Ağustos 2026 itibarıyla hâlâ kararsız olduğu için adil bir kıyas mümkün değil; Vite 8 (Rolldown) prod build'de kararlı ve hızlı bir seçenek sunuyor.

### Rspack webpack'in yerini tamamen alabilir mi?

Çoğu proje için evet, çünkü Rspack webpack API'siyle büyük ölçüde uyumlu ve config'i sıfırdan yazmadan geçiş yapılabiliyor. Native Node.js modüllerine bağımlı az sayıda niş webpack eklentisi hâlâ sorun çıkarabildiği için, geçiş öncesi bir test dalında deneme yapmak gerekiyor.

### Rolldown ve Vite 8 aynı şey mi?

Hayır. Rolldown, Rust'ta yazılmış bağımsız bir bundling motoru ve 7 Mayıs 2026'da 1.0 sürümüne ulaştı. Vite 8, 12 Mart 2026'da bu motoru tek bundler olarak benimseyerek eski esbuild (dev) + Rollup (prod) ikili yapısını ortadan kaldırdı.

### Turbopack'i prod build'de kullanmak güvenli mi?

Ağustos 2026 itibarıyla önerilmiyor. `next build --turbo` hâlâ deneysel durumda; kritik bir üretim projesinde prod build'i webpack veya Rspack'te bırakıp Turbopack'i sadece dev sunucusu için kullanmak daha güvenli.
