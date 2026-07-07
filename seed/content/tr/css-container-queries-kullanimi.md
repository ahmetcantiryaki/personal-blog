---
title: "CSS Container Queries Nasıl Kullanılır"
slug: "css-container-queries-kullanimi"
translationKey: "css-container-queries"
locale: "tr"
excerpt: "2026 için pratik CSS container queries rehberi: kapsama bağlamı kurun, ebeveynin genişliğini sorgulayın ve yeni style ile scroll-state sorgularını kullanın."
category: "web-development"
tags: ["css", "frontend", "responsive-design"]
publishedAt: "2026-07-03"
seoTitle: "CSS Container Queries Nasıl Kullanılır (2026)"
seoDescription: "2026 için CSS container queries kullanımı: container-type ile konteyner tanımlayın, @container ile sorgulayın ve yeni style ile scroll-state sorgularını öğrenin."
---

CSS container queries kullanımı tek cümlede şudur: bir üst öğeye `container-type: inline-size` verin, ardından çocuklarını `@container (min-width: ...)` ile biçimlendirin; böylece öğeler ekranın değil **ebeveynlerinin** boyutuna tepki verir. Temmuz 2026 itibarıyla tüm güncel tarayıcılar boyut sürümünü destekliyor ve bir bileşeni koyduğunuz her yere uyarlamanın en temiz yolu bu.

Media query "ekran ne kadar büyük?" diye sorar; container query ise "ebeveynim ne kadar büyük?" diye sorar. Bir kartı, kenar çubuğunu ya da widget'ı gerçekten yeniden kullanılabilir kılan işte bu tek fark. Ve 2026, bu özelliğin olgunlaştığı yıl oldu: style sorguları mayısta tüm tarayıcılara yayıldı ve Chrome, bir sürü JavaScript scroll dinleyicisini gereksiz kılan scroll-state sorgularını yayınladı.

## CSS container queries nedir?

CSS container queries, bir öğenin tarayıcı görünüm alanına (viewport) değil, kendisini kapsayan öğenin boyutuna tepki vermesini sağlar. Bir üst öğeyi `container-type` ile sorgu konteyneri olarak işaretlersiniz, sonra o konteynerin genişliğine, yüksekliğine, stiline veya scroll durumuna göre uygulanan `@container` kuralları yazarsınız. Aynı bileşen kenar çubuğunda dar, ana kolonda geniş görünür; hiçbir viewport hesabı yapmadan.

Bu, media query'lerin temel zayıflığını çözer: 1200px'lik viewport için biçimlendirdiğiniz bir bileşen, onu dar bir alanda yeniden kullandığınız an bozulur. Container queries kararı ait olduğu yere, yani bileşenin gerçekte sahip olduğu boş alana taşır.

## Media query'lerden nasıl farklı?

Kısa cevap: media query'ler viewport'a, container queries ebeveyn öğeye tepki verir. Media query'ler global ve yerleşim düzeyindedir; container queries yerel ve bileşen düzeyindedir. Yine de ikisini birlikte kullanırsınız: sayfa iskeleti ve global kırılım noktaları için media query, öngörülemeyen alanlarda yaşayan yeniden kullanılabilir bileşenler için container query.

| Boyut | Media query | Container query |
|-------|-------------|-----------------|
| Neye tepki verir | Viewport / cihaz | En yakın sorgu konteyneri |
| Kapsam | Global, sayfa geneli | Yerel, bileşen bazında |
| En uygun kullanım | Sayfa iskeleti, yazdırma | Yeniden kullanılabilir bileşenler |
| Yeniden kullanılabilirlik | Yeni bağlamda bozulur | Her yere taşınabilir |
| Sözdizimi | `@media (min-width: 600px)` | `@container (min-width: 400px)` |
| Destek (Temmuz 2026) | Evrensel | ~%93+ global, 2023'ten beri Baseline |

## Bunu nasıl kurarsınız?

Şu adımları sırayla izleyin. Her biri bir öncekine dayanır, o yüzden kapsama bağlamını atlamayın:

1. **Bileşeni bir konteyner öğesiyle sarın.** Sorgulayacak bir üst öğeye ihtiyacınız var; saran bir `<div>` ya da bileşenin kendi kök öğesi işe yarar.
2. **Kapsama türünü tanımlayın.** `container-type: inline-size` ekleyin ki tarayıcı yatay (inline) boyutu izlesin.
3. **Konteynere isim verin.** `container-name: kart` ekleyin; böylece onu açıkça hedefler, yanlış üst öğeyi sorgulamaktan kaçınırsınız.
4. **`@container` kurallarınızı** isimli konteynere göre yazın: `@container kart (min-width: 400px) { ... }`.
5. **Mobil öncelikli varsayılanları** herhangi bir sorgunun dışında belirleyin, sonra üzerine geniş yerleşimleri ekleyin.
6. **Birden fazla alanda test edin**: kenar çubuğu, bir grid hücresi ve tam genişlikli bir satır.

En yaygın kalıp, kendi genişliğine göre alt alta yerleşimden yan yana yerleşime geçen bir karttır:

```css
/* 1. Sorgu konteynerini kur */
.kart-sarmalayici {
  container-type: inline-size;
  container-name: kart;
}

/* 2. Mobil öncelikli varsayılan: görsel üstte, alt alta */
.kart {
  display: grid;
  gap: 1rem;
}

/* 3. KONTEYNER en az 400px olduğunda yan yana geç */
@container kart (min-width: 400px) {
  .kart {
    grid-template-columns: 40% 1fr;
    align-items: center;
  }
}

/* 4. Başlığı viewport'a değil konteynere göre ölçekle */
.kart h3 {
  font-size: clamp(1rem, 4cqi, 1.5rem);
}
```

`.kart-sarmalayici`'yi 300px'lik bir kenar çubuğuna koyun, alt alta dizilir; 800px'lik bir kolona koyun, yan yana geçer. HTML hiç değişmez. Bütün mesele de bu zaten. Bu kalıpları kurarken açık tuttuğum kaynak [resmi MDN container queries rehberidir](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries).

## Konteyner sorgu birimlerini ne zaman kullanmalı?

Konteyner sorgu birimlerini (`cqi`, `cqw`, `cqh`, `cqb`) tipografi ve boşlukların ekran yerine bileşenle ölçeklenmesini istediğinizde kullanın. `1cqi`, konteynerin inline boyutunun %1'ine eşittir; yani `font-size: 4cqi` konteynerle birlikte büyüyüp küçülür. Bu, `vw` biriminin konteyner kapsamındaki karşılığıdır ve akıcı, sınırlı tipografi için `clamp()` ile harika çalışır.

- **`cqi`** — Konteynerin inline boyutunun (genelde genişlik) %1'i. En sık uzanacağınız birim.
- **`cqw` / `cqh`** — Açıkça konteyner genişliğinin / yüksekliğinin %1'i.
- **`cqmin` / `cqmax`** — Konteynerin küçük / büyük boyutunun %1'i.

Bunları `clamp()` içine sarın ki metin ne saçma derecede küçülsün ne de büyüsün: `clamp(1rem, 4cqi, 2rem)` bir taban ve tavan korurken arada akıcı kalır. Akıcı tipografiyi performans için ayarlıyorsanız bu, [Core Web Vitals kontrol listemizle](/tr/posts/core-web-vitals-kontrol-listesi) örtüşür.

## 2026'da yeni ne var: style ve scroll-state sorguları

İşte fikrimi açıkça söyleyeyim: 2026'da "container queries" artık yalnızca boyut demek değil. Bu yıl üretime hazır hâle gelen iki ekleme, özelliğe yeniden bakmanın asıl sebebi.

**Style sorguları**, bir konteynerin boyutlarını değil özel özelliklerini (custom properties) sorgulamanızı sağlar. Bir üst öğeye `--tema: koyu` verin, herhangi bir alt öğe `@container style(--tema: koyu)` ile tepki verebilir. Sınıfları elden ele taşımadan tema ve varyant sistemleri için mükemmel. Bunlar 2023'te Chrome ve Edge 111'de, 2024'te Safari 18'de yayınlandı; 19 Mayıs 2026'da çıkan Firefox 151 nihayet özel özellik `style()` sorgularını ekleyerek onları Baseline "yeni kullanılabilir" hâline getirdi.

**Scroll-state sorguları** ise daha gösterişli olan. `container-type: scroll-state` verin ve bir konteyner çocuklarını `stuck`, `snapped`, `scrollable` ya da `scrolled` durumuna göre biçimlendirebilir; hiç JavaScript scroll dinleyicisi olmadan. Bu, yapışkan başlık gölgelerini, kaydırma ipucu oklarını ve gizlenen başlık çubuklarını saf CSS ile çalıştırır. Chrome ve Edge 133 `stuck`, `snapped` ve `scrollable`'ı yayınladı; Chrome 144 kaydırma yönünü izleyen `scrolled`'ı ekledi.

| Özellik | Chrome / Edge | Safari | Firefox | Baseline durumu |
|---------|---------------|--------|---------|-----------------|
| Boyut sorguları (`inline-size`) | 105+ (2022) | 16+ (2022) | 110+ (2023) | Geniş çapta kullanılabilir |
| Style sorguları (özel özellik) | 111+ (2023) | 18+ (2024) | 151+ (May 2026) | Yeni kullanılabilir |
| Scroll-state sorguları | 133/144 | Henüz yok | Henüz yok | Yalnızca Chrome/Edge |

Dürüst uyarı: [scroll-state sorguları](https://developer.chrome.com/blog/css-scroll-state-queries) Temmuz 2026'da yalnızca Chromium'da çalışıyor; WebKit ve Gecko yetişene kadar onları aşamalı zenginleştirme (progressive enhancement) olarak kullanın. [MDN boyut ve style sorguları rehberi](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_size_and_style_queries) kararlı kısımları belgeliyor.

## Canlıya alırken ne bozuldu

Üretimde bizi iki şey ısırdı. Birincisi kapsama bağlamı çökmesi: `container-type: inline-size` vermek kapsama (containment) oluşturur ve bunu çocukları `height: 100%`'e dayanan bir öğeye koyarsanız yükseklik sıfıra hesaplanabilir. Bunu `container-type`'ı flex ebeveyni yerine ayrı bir sarmalayıcıya taşıyarak çözdük.

İkincisi, bir öğeyi kendi konteynerine göre sorgulayamazsınız. `@container` kuralı konteynerin kendisini değil, alt öğelerini hedefler. `.kart-sarmalayici`'yi kendi sorgusundan biçimlendirmeyi denedik ve hiçbir şey olmadı. İçe bir öğe ekleyin ve onu sorgulayın.

- **Yapmayın:** Yeniden biçimlendirmek istediğiniz öğeye `container-type` koymayın. Ebeveynine koyun.
- **Yapın:** Konteynere `container-name` verin ki iç içe konteynerler birbirini tetiklemesin.
- **Dikkat:** Boyut konteyneri içindeki `height: 100%` çocuklara dikkat; boyut kapsaması blok yüksekliğini sıfırlayabilir.

Daha derin bileşen çalışması için [kaçınmanız gereken Tailwind CSS hatalarına](/tr/posts/tailwind-css-hatalari) ve [web erişilebilirlik kontrol listesine](/tr/posts/web-erisilebilirlik-kontrol-listesi) göz atın; böylece duyarlı bileşenler yalnızca uyum sağlamakla kalmaz, kullanılabilir de kalır.

## 2026'da hâlâ media query'ye ihtiyacınız var mı?

Evet, ama daha dar bir iş için. Media query'leri gerçekten cihaza veya viewport'a bağlı şeyler için tutun: genel sayfa iskeleti, global navigasyon, yazdırma stilleri ve `prefers-color-scheme` ya da `prefers-reduced-motion` gibi kullanıcı tercihleri. Bir bileşenin ekrana değil bulunduğu alana uyum sağlaması gerektiğinde ise container query'ye uzanın.

Basit bir pusula: biçimlendirdiğiniz şey birden fazla genişlikte konteynerde görünebiliyorsa container query kullanın. Viewport'a bağlı tek seferlik bir sayfa bölümüyse media query yeterli. Bileşen kütüphaneleri ve tasarım sistemleri için container queries artık varsayılan ve [Web Geliştirme kategorisindeki](/tr/category/web-gelistirme) diğer frontend rehberleriyle yan yana durur.

## Sıkça Sorulan Sorular

### CSS container queries 2026'da tüm tarayıcılarda çalışıyor mu?

Boyut sorguları evet, evrensel olarak. Chrome/Edge (2022), Safari 16 (2022) ve Firefox 110'da (2023) yayınlandı; Temmuz 2026 itibarıyla global destek %93'ün üzerinde. Özel özellik style sorguları, Mayıs 2026'daki Firefox 151 ile tüm tarayıcılara ulaştı. Scroll-state sorguları yalnızca Chrome ve Edge'de olduğundan onları aşamalı zenginleştirme olarak kullanın.

### `@container` kuralım neden uygulanmıyor?

En sık neden, üst öğede eksik bir `container-type`'tır; o olmadan sorgulanacak konteyner yoktur. İkincisi, konteyner öğesinin kendisini biçimlendirmeye çalışmaktır; `@container` yalnızca alt öğeleri etkiler. Ayrıca `container-name`'in eşleştiğini ve daha yakın bir üst öğenin istemeden konteyner gibi davranmadığını doğrulayın.

### `cqi` ile `vw` arasındaki fark nedir?

`vw`, viewport genişliğinin %1'idir; yani tarayıcı penceresiyle ölçeklenir. `cqi` ise en yakın sorgu konteynerinin inline boyutunun %1'idir; yani bileşenin ebeveyniyle ölçeklenir. Metin ve boşlukların tüm ekrana değil, bileşenin bulunduğu yere tepki vermesini istediğinizde `cqi` kullanın.

### Artık JavaScript olmadan kaydırma konumunu sorgulayabilir miyim?

Chromium'da evet. `container-type: scroll-state` ile çocukları `stuck`, `snapped`, `scrollable` veya `scrolled` durumuna göre biçimlendirebilir, yaygın scroll-event dinleyicilerini ortadan kaldırabilirsiniz. Safari ve Firefox Temmuz 2026'da henüz yayınlamadı, o yüzden bu tarayıcılar için JavaScript yedeği tutun.
