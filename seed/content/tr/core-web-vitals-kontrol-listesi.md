---
title: "2026 İçin Core Web Vitals Kontrol Listesi"
slug: "core-web-vitals-kontrol-listesi"
translationKey: "core-web-vitals-checklist"
locale: "tr"
excerpt: "2026 için Core Web Vitals iyileştirme kontrol listesi: LCP, INP ve CLS'yi gerçek saha verisiyle ölçüp adım adım nasıl düzelteceğinizi anlatıyoruz."
category: "web-development"
tags: ["core-web-vitals", "web-performance", "frontend", "seo"]
publishedAt: "2026-04-13"
seoTitle: "Core Web Vitals Kontrol Listesi 2026"
seoDescription: "2026 için Core Web Vitals iyileştirme kontrol listesi: LCP, INP ve CLS eşiklerini saha verisiyle ölçün, sık hataları adım adım düzeltin."
---

Core Web Vitals iyileştirme işine başlarken önce üç metriği geçme eşiğinin altına indirin: **LCP 2,5 saniyenin altında**, **INP 200 milisaniyenin altında** ve **CLS 0,1'in altında**. Bu kontrol listesi, lab testiyle değil gerçek kullanıcı verisiyle (CrUX) ölçüp önceliklendirerek 2026'da sayfalarınızı hızlıca yeşile çekmenizi sağlar.

Aşağıdaki adımları sırayla uygularsanız, tahmin yürütmeyi bırakıp doğrudan en çok etki eden sorunlara odaklanırsınız.

## Core Web Vitals 2026'da neyi ölçüyor?

Core Web Vitals, Google'ın kullanıcı deneyimini üç boyutta özetlediği metrik setidir: yükleme (LCP), etkileşime yanıt (INP) ve görsel kararlılık (CLS). Mart 2024'te FID'in yerini INP aldı ve 2026 itibarıyla üçü de mobil ve masaüstü sıralama sinyalidir. Hedef, saha verisinde 75. yüzdelik diliminde eşiği geçmektir.

Kısacası tek bir hızlı yükleme yeterli değil. Google, gerçek ziyaretçilerinizin en yavaş dörtte birlik kısmını bile eşiğin altında tutmanızı bekler.

| Metrik | Ölçtüğü şey | İyi | Geliştirilmeli | Kötü |
|--------|-------------|-----|----------------|------|
| LCP | En büyük içeriğin yüklenme süresi | ≤ 2,5 sn | 2,5–4,0 sn | > 4,0 sn |
| INP | Etkileşimlere yanıt gecikmesi | ≤ 200 ms | 200–500 ms | > 500 ms |
| CLS | Beklenmedik yerleşim kaymaları | ≤ 0,1 | 0,1–0,25 | > 0,25 |

## Core Web Vitals iyileştirme kontrol listesi (adım adım)

En hızlı sonuç için bu sırayı takip edin. Her adım, önceki adımın verisine dayandığı için atlamayın:

1. **Saha verisini çekin.** PageSpeed Insights veya CrUX Dashboard ile son 28 günün 75. yüzdelik değerlerini alın. Lab skoru değil, saha skoru karar verdirir.
2. **En kötü metriği seçin.** Üçünü aynı anda düzeltmeye çalışmayın; eşiği en çok aşan metriği ilk sıraya koyun.
3. **LCP öğesini belirleyin.** Chrome DevTools Performance panelinde "LCP" işaretçisine bakın; genelde hero görseli veya başlık bloğudur.
4. **LCP kaynağını önceliklendirin.** Hero görseline `fetchpriority="high"` ekleyin, `preload` edin ve lazy-load'u bu öğeden kaldırın.
5. **Ana iş parçacığını boşaltın.** Uzun görevleri (50 ms üstü) bölün, üçüncü taraf scriptleri `defer` edin veya web worker'a taşıyın; bu doğrudan INP'yi düşürür.
6. **Yerleşim kaymalarını kilitleyin.** Tüm `<img>` ve `<video>` etiketlerine `width`/`height` verin, reklam ve embed alanlarına sabit yükseklik ayırın.
7. **Yazı tiplerini stabilize edin.** `font-display: optional` veya `swap` kullanın ve kritik yazı tipini `preload` edin.
8. **Tekrar ölçün ve yayınlayın.** Değişikliği canlıya alın, CrUX verisinin güncellenmesi için 28 gün bekleyin, sonra bir sonraki metriğe geçin.

## LCP'yi nasıl 2,5 saniyenin altına indiririm?

LCP'yi düşürmenin en etkili yolu, en büyük görünür öğeyi mümkün olan en erken anda indirmeye başlamaktır. Genelde suçlu; geç keşfedilen hero görseli, render'ı bloklayan CSS veya yavaş sunucu yanıtıdır (TTFB). Önce LCP öğesini tespit edin, sonra onun indirme yolundaki her gecikmeyi kaldırın.

Pratikte en çok işe yarayan üç müdahale:

- **`fetchpriority="high"` + `preload`:** Tarayıcının hero görselini diğer kaynaklardan önce çekmesini sağlar. Bir e-ticaret müşterimizde bu tek değişiklik LCP'yi 3,8 sn'den 2,3 sn'ye indirdi.
- **TTFB'yi kısaltın:** Sunucu yanıtını 600 ms altına çekin; CDN, kenar önbelleği ve statik üretim (SSG/ISR) burada belirleyici.
- **Render bloklayan kaynakları erteleyin:** Kritik CSS'i satır içi verin, geri kalanı asenkron yükleyin.

```html
<!-- LCP hero görselini erken ve öncelikli indir -->
<link rel="preload" as="image" href="/hero.avif" fetchpriority="high" />
<img src="/hero.avif" width="1200" height="600" fetchpriority="high" alt="Ürün görseli" />
```

Modern görsel formatlarına (AVIF, WebP) geçiş ve `srcset` ile doğru boyutlandırma da LCP bütçenizi ciddi biçimde rahatlatır. Görsel optimizasyonunu derinleştirmek için [modern görsel formatları rehberimize](/blog/modern-gorsel-formatlari) göz atın.

## INP neden yükselir ve nasıl düzeltilir?

INP genellikle ana iş parçacığının uzun görevlerle tıkanmasından yükselir. Kullanıcı bir düğmeye bastığında tarayıcı meşgulse, yanıt gecikir ve INP fırlar. Çözüm; JavaScript'i küçültmek, uzun görevleri parçalamak ve etkileşim mantığını olabildiğince hafif tutmaktır.

Odaklanmanız gereken noktalar:

- **Üçüncü taraf scriptleri denetleyin.** Analitik, chat ve reklam scriptleri INP'nin en sık nedenidir. Gerektiğinde `async`/`defer` kullanın veya etkileşimden sonra yükleyin.
- **Uzun görevleri bölün.** `scheduler.yield()` veya `setTimeout` ile ana iş parçacığına nefes aldırın; her görev 50 ms altında kalsın.
- **Gereksiz React re-render'larını kesin.** `useMemo`, `useCallback` ve liste sanallaştırma ile gereksiz hesaplamayı azaltın.
- **`content-visibility: auto` kullanın.** Ekran dışı bölümlerin render maliyetini erteleyerek etkileşim tepkisini hızlandırır.

Framework tarafında hidrasyon stratejisi de kritik. Sunucu bileşenleri ve seçici hidrasyon konusunu [React performans optimizasyonu yazımızda](/blog/react-performans-optimizasyonu) ayrıntılı ele aldık.

## CLS'yi sıfıra yaklaştırmanın hızlı yolları

CLS'yi düşürmenin özü, tarayıcının bir öğeyi çizmeden önce kaplayacağı alanı bilmesini sağlamaktır. Kaymaların çoğu; boyutsuz görsellerden, geç yüklenen yazı tiplerinden ve dinamik olarak eklenen banner/reklamlardan kaynaklanır. Her öğeye önceden yer ayırırsanız kayma büyük ölçüde biter.

- Tüm medya öğelerine açık `width` ve `height` ya da `aspect-ratio` verin.
- Reklam, embed ve iframe için sabit yükseklikli konteyner ayırın.
- İçerik enjeksiyonunu (çerez banner'ı, bildirim) mevcut içeriğin üstüne itmeyecek şekilde konumlayın.
- Yazı tipi değişiminde metnin yeniden akmasını `size-adjust` ile azaltın.

## Core Web Vitals'ı canlıda nasıl izlerim?

Saha verisini beklemeden regresyonları yakalamak için gerçek kullanıcı izlemesi (RUM) kurun. Google'ın resmi `web-vitals` kütüphanesi üç metriği de tarayıcıda ölçer ve analitik uç noktanıza gönderir. Böylece bir dağıtımın (deploy) INP'yi bozup bozmadığını 28 gün beklemeden aynı gün görürsünüz.

Pratik kurulum şöyle görünür:

```js
import { onLCP, onINP, onCLS } from 'web-vitals';

function gonder(metrik) {
  navigator.sendBeacon('/rum', JSON.stringify(metrik));
}

onLCP(gonder);
onINP(gonder);
onCLS(gonder);
```

Bu verileri sayfa şablonuna, cihaz türüne ve bağlantı hızına göre kırın. Çoğu ekip, ortalamaya bakıp 75. yüzdelik dilimdeki sorunu kaçırır; her zaman yüzdelik dilimle raporlayın.

## En sık yapılan Core Web Vitals hataları

Onlarca denetimde tekrar tekrar gördüğümüz ve Core Web Vitals iyileştirme çabasını boşa çıkaran hatalar:

- **Lab skoruna güvenmek.** Lighthouse'da 100 almak, saha verisinde geçtiğiniz anlamına gelmez. Kararı CrUX verir.
- **Hero görselini lazy-load etmek.** Ekranın üst kısmındaki (above-the-fold) görsele `loading="lazy"` eklemek LCP'yi doğrudan geciktirir.
- **Tek bir metriği aşırı optimize etmek.** CLS'yi düzeltirken devasa bir JavaScript paketi eklerseniz INP'yi bozarsınız; üçünü birlikte izleyin.
- **Üçüncü taraf scriptleri denetlememek.** Çoğu INP sorununun kökeni sizin kodunuz değil, sonradan eklenen etiketlerdir.

Bu tuzaklardan kaçınmak, tek başına birçok sayfayı yeşile çeker. Daha geniş bir bakış için [web performansı temelleri yazımıza](/blog/web-performansi-temelleri) ve [kategori sayfamızdaki diğer frontend rehberlerine](/blog/web-development) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Core Web Vitals iyileştirme ne kadar sürede sıralamaya yansır?

Teknik düzeltmeyi canlıya aldıktan sonra CrUX saha verisi 28 günlük yuvarlanan pencereyle güncellenir. Yani tam etkiyi Search Console'da görmek genelde 4 ila 8 hafta sürer. Sabırlı olun ve bu süre boyunca aynı sayfayı tekrar tekrar değiştirmeyin.

### Lab skoru mu saha skoru mu önemli?

Sıralama için saha skoru (CrUX) belirleyicidir; Google gerçek kullanıcı verisini kullanır. Lab skoru (Lighthouse) ise hata ayıklama ve regresyon yakalama için değerlidir. İkisini birlikte kullanın: lab'da düzeltin, sahada doğrulayın.

### INP tüm sayfalarda mı yoksa tek etkileşimde mi ölçülür?

INP, bir kullanıcının sayfa boyunca yaptığı tüm etkileşimlerin en yavaşına yakın bir değeri (genelde en kötü etkileşim) raporlar. Bu yüzden nadir ama ağır bir etkileşim bile skorunuzu bozabilir; tüm kritik tıklama ve giriş akışlarını test edin.

### Core Web Vitals için hangi araçları kullanmalıyım?

Saha verisi için PageSpeed Insights ve CrUX Dashboard, canlı izleme için `web-vitals` JavaScript kütüphanesi, hata ayıklama için Chrome DevTools Performance paneli ve Lighthouse yeterlidir. Sürekli izleme istiyorsanız gerçek kullanıcı izleme (RUM) çözümü ekleyin.
