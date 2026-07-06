---
title: "CSS Container Queries Nasıl Kullanılır"
slug: "css-container-queries-kullanimi"
translationKey: "css-container-queries"
locale: "tr"
excerpt: "CSS container queries kullanımı: bir üst öğeye container-type verip @container ile ebeveynin genişliğini sorgulayarak her yere uyum sağlayan bileşenler yapın."
category: "web-development"
tags: ["css", "frontend", "responsive-design"]
publishedAt: "2026-04-23"
seoTitle: "CSS Container Queries Nasıl Kullanılır"
seoDescription: "CSS container queries kullanımı: container-type ile konteyner tanımlayın, @container ile genişliğini sorgulayın ve gerçekten yeniden kullanılabilir bileşenler yapın."
---

CSS container queries kullanımı tek cümlede şudur: bir üst öğeye `container-type: inline-size` verin, ardından çocuklarını `@container (min-width: ...)` ile biçimlendirin; böylece öğeler ekranın değil **ebeveynlerinin** boyutuna tepki verir. 2026 itibarıyla tüm büyük tarayıcılar bunu destekliyor ve bir bileşeni koyduğunuz her yere uyarlamanın en temiz yolu bu.

Media query "ekran ne kadar büyük?" diye sorar; container query ise "ebeveynim ne kadar büyük?" diye sorar. Bir kartı, kenar çubuğunu ya da widget'ı gerçekten yeniden kullanılabilir kılan işte bu tek fark.

## CSS container queries nedir?

CSS container queries, bir öğenin tarayıcı görünüm alanına (viewport) değil, kendisini kapsayan öğenin boyutuna tepki vermesini sağlar. Bir üst öğeyi `container-type` ile sorgu konteyneri olarak işaretlersiniz, sonra o konteynerin genişliğine veya yüksekliğine göre uygulanan `@container` kuralları yazarsınız. Aynı bileşen kenar çubuğunda dar, ana kolonda geniş görünür; hiçbir viewport hesabı yapmadan.

Bu, media query'lerin temel zayıflığını çözer: 1200px'lik viewport için biçimlendirdiğiniz bir bileşen, onu dar bir alanda yeniden kullandığınız an bozulur. Container queries kararı ait olduğu yere, yani bileşenin gerçekte sahip olduğu boş alana taşır.

## Container queries media query'lerden nasıl farklı?

Kısa cevap: media query'ler viewport'a, container queries ebeveyn öğeye tepki verir. Media query'ler global ve yerleşim düzeyindedir; container queries yerel ve bileşen düzeyindedir. Yine de ikisini birlikte kullanırsınız: sayfa iskeleti ve global kırılım noktaları için media query, öngörülemeyen alanlarda yaşayan yeniden kullanılabilir bileşenler için container query.

| Boyut | Media query | Container query |
|-------|-------------|-----------------|
| Neye tepki verir | Viewport / cihaz | En yakın sorgu konteyneri |
| Kapsam | Global, sayfa geneli | Yerel, bileşen bazında |
| En uygun kullanım | Sayfa yerleşimi, iskelet | Yeniden kullanılabilir bileşenler |
| Yeniden kullanılabilirlik | Yeni bağlamda bozulur | Her yere taşınabilir |
| Sözdizimi | `@media (min-width: 600px)` | `@container (min-width: 400px)` |
| Tarayıcı desteği (2026) | Evrensel | Tüm güncel tarayıcılar |

## CSS container queries kullanımı: adım adım kurulum

Bir bileşeni konteyner tabanlı duyarlılığa geçirmek için bu adımları sırayla izleyin. Her biri bir öncekine dayanır, o yüzden kapsama bağlamını atlamayın:

1. **Bileşeni bir konteyner öğesiyle sarın.** Sorgulayacak bir üst öğeye ihtiyacınız var. Saran bir `<div>` ya da bileşenin kendi kök öğesi işe yarar.
2. **Kapsama türünü tanımlayın.** O sarmalayıcıya `container-type: inline-size` ekleyin; böylece tarayıcı öğenin yatay (inline) boyutunu izler.
3. **Konteynere isim verin (opsiyonel ama önerilir).** `container-name: kart` ekleyin; böylece onu açıkça hedefler, yanlış üst öğeyi sorgulamaktan kaçınırsınız.
4. **`@container` kurallarınızı yazın.** Çocukları konteyner genişliğine göre biçimlendirin: `@container kart (min-width: 400px) { ... }`.
5. **Mobil öncelikli varsayılanları belirleyin.** Önce dar yerleşimi (herhangi bir sorgunun dışında) biçimlendirin, sonra üzerine geniş yerleşimleri ekleyin.
6. **Gerektiğinde konteyner sorgu birimlerini kullanın.** Yazı tipi ve boşlukları konteynere göre ölçeklemek için `cqi`, `cqw` veya `cqh` kullanın.
7. **Birden fazla alanda test edin.** Bileşeni kenar çubuğuna, bir grid hücresine ve tam genişlikli bir satıra koyup kendi başına uyum sağladığını doğrulayın.

## Kod nasıl görünüyor?

En yaygın kalıp, kendi genişliğine göre alt alta yerleşimden yan yana yerleşime geçen bir karttır. Konteyneri bir kez tanımlayıp tek bir `@container` kuralı yazarsınız. İşte çalışan, eksiksiz bir örnek:

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

`.kart-sarmalayici`'yi 300px'lik bir kenar çubuğuna koyun, alt alta dizilir; 800px'lik bir kolona koyun, yan yana geçer. HTML hiç değişmez. Bütün mesele de bu zaten.

## Konteyner sorgu birimlerini ne zaman kullanmalı?

Konteyner sorgu birimlerini (`cqi`, `cqw`, `cqh`, `cqb`) tipografi ve boşlukların ekran yerine bileşenle ölçeklenmesini istediğinizde kullanın. `1cqi`, konteynerin inline boyutunun %1'ine eşittir; yani `font-size: 4cqi` konteynerle birlikte büyüyüp küçülür. Bu, `vw` biriminin konteyner kapsamındaki karşılığıdır ve akıcı, sınırlı tipografi için `clamp()` ile harika çalışır.

- **`cqi`** — Konteynerin inline boyutunun (genelde genişlik) %1'i. En sık uzanacağınız birim.
- **`cqw` / `cqh`** — Açıkça konteyner genişliğinin / yüksekliğinin %1'i.
- **`cqmin` / `cqmax`** — Konteynerin küçük / büyük boyutunun %1'i.

Bunları `clamp()` içine sarın ki metin ne saçma derecede küçülsün ne de büyüsün: `clamp(1rem, 4cqi, 2rem)` bir taban ve tavan korurken arada akıcı kalır.

## Canlıya alırken ne bozuldu (ve nasıl düzelttik)

Üretimde bizi iki şey ısırdı ve ikisini de baştan söylemekte fayda var. Birincisi kapsama bağlamı çökmesi: `container-type: inline-size` vermek kapsama (containment) oluşturur ve bunu yanlışlıkla çocukları `height: 100%`'e dayanan bir öğeye koyarsanız yükseklik sıfıra hesaplanabilir. Bunu `container-type`'ı flex ebeveyni yerine ayrı bir sarmalayıcıya taşıyarak çözdük.

İkincisi, bir öğeyi kendi konteynerine göre sorgulayamazsınız. `@container` kuralı konteynerin kendisini değil, alt öğelerini hedefler. `.kart-sarmalayici`'yi kendi sorgusundan biçimlendirmeyi denedik ve hiçbir şey olmadı; sorgu yalnızca çocukları görür. İçe bir öğe ekleyin ve onu sorgulayın.

- **Yapmayın:** Yeniden biçimlendirmek istediğiniz öğeye `container-type` koymayın. Ebeveynine koyun.
- **Yapın:** Konteynere `container-name` verin ki iç içe konteynerler birbirini tetiklemesin.
- **Dikkat:** Boyut konteyneri içindeki `height: 100%` çocuklara dikkat; boyut kapsaması blok yüksekliğini sıfırlayabilir.

Daha derin yerleşim kalıpları için [grid ve flexbox ile modern CSS yerleşim rehberimize](/blog/modern-css-yerlesim) ve daha geniş [duyarlı tasarım temelleri yazımıza](/blog/duyarli-tasarim-temelleri) göz atın. Performans etkisini denetliyorsanız [Core Web Vitals kontrol listemizle](/blog/core-web-vitals-kontrol-listesi) karşılaştırın.

## 2026'da hâlâ media query'ye ihtiyacınız var mı?

Evet, ama daha dar bir iş için. Media query'leri gerçekten cihaza veya viewport'a bağlı şeyler için tutun: genel sayfa iskeleti, global navigasyon, yazdırma stilleri ve `prefers-color-scheme` ya da `prefers-reduced-motion` gibi kullanıcı tercihleri. Bir bileşenin ekrana değil bulunduğu alana uyum sağlaması gerektiğinde ise container query'ye uzanın. 2026 kod tabanlarının çoğu ikisini birlikte kullanır ve bu doğru bir tercih.

Basit bir pusula: biçimlendirdiğiniz şey birden fazla genişlikte konteynerde görünebiliyorsa container query kullanın. Viewport'a bağlı tek seferlik bir sayfa bölümüyse media query yeterli. Bileşen kütüphaneleri ve tasarım sistemleri için container queries artık varsayılan hâle geldi ve [kategori sayfamızdaki diğer frontend rehberleriyle](/blog/web-development) uyum içinde çalışır.

## Sıkça Sorulan Sorular

### CSS container queries 2026'da tüm tarayıcılarda çalışıyor mu?

Evet. Boyut container query'leri Chrome ve Edge'de (2022), Safari 16'da (2022) ve Firefox 110'da (2023) yayınlandı; yani 2026'ya gelindiğinde her güncel tarayıcı bunları yıllardır destekliyor. Stil container query'leri (özel özellik sorgulama) de artık geniş çapta kullanılabilir. Boyut sorgularını kullanıcıların büyük çoğunluğu için bir fallback olmadan üretimde kullanabilirsiniz.

### `@container` kuralım neden uygulanmıyor?

En sık neden, üst öğede eksik bir `container-type`'tır; o olmadan sorgulanacak konteyner yoktur. İkincisi, konteyner öğesinin kendisini biçimlendirmeye çalışmaktır; `@container` yalnızca alt öğeleri etkiler. Ayrıca `container-name`'in eşleştiğini ve daha yakın bir üst öğenin istemeden konteyner gibi davranmadığını doğrulayın.

### `cqi` ile `vw` arasındaki fark nedir?

`vw`, viewport genişliğinin %1'idir; yani tarayıcı penceresiyle ölçeklenir. `cqi` ise en yakın sorgu konteynerinin inline boyutunun %1'idir; yani bileşenin ebeveyniyle ölçeklenir. Metin ve boşlukların tüm ekrana değil, bileşenin bulunduğu yere tepki vermesini istediğinizde `cqi` kullanın.

### Container query'leri genişlik yerine yükseklikle kullanabilir miyim?

Evet, ama dikkatli olun. İki boyutu da sorgulamak için `container-type: size` (`inline-size` değil) verin, sonra `@container (min-height: ...)` kullanın. İşin püf noktası, `container-type: size`'ın her iki eksende de kapsama uygulaması ve yüksekliğini içerikten alan öğeleri çökertebilmesidir. Gerçekten yükseklik tabanlı sorgu gerekmedikçe `inline-size`'ı tercih edin.
