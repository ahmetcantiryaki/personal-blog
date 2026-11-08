---
title: "CSS'te Modern Renk: OKLCH ve color-mix()"
slug: "csste-modern-renk-oklch-color-mix"
translationKey: "modern-css-color-oklch-color-mix"
locale: "tr"
excerpt: "Kısa cevap: OKLCH, algısal olarak tutarlı parlaklık sunan bir CSS renk fonksiyonudur; color-mix() ile de tek tek hex kodu seçmeden tonlar türetebilirsiniz."
category: "web-development"
tags: ["css", "frontend", "accessibility", "web-standards"]
publishedAt: "2026-11-08"
seoTitle: "CSS'te Modern Renk: OKLCH ve color-mix()"
seoDescription: "Kısa cevap: OKLCH, algısal olarak tutarlı parlaklık sunan bir CSS renk fonksiyonudur; color-mix() ile de tek tek hex kodu seçmeden tonlar türetebilirsiniz."
---

Kısa cevap: OKLCH kullanın, çünkü Lightness (parlaklık) kanalı her tonda algısal olarak tutarlıdır; hex veya HSL'de aynı "parlaklık" değeri maviyle sarıda çok farklı görünür. Bu da otomatik ton, gölge ve kontrast hesaplarını hex/HSL'de güvenilmez kılar, OKLCH'de ise öngörülebilir yapar.

## OKLCH nedir?

OKLCH, CSS Color Module Level 4 ile gelen bir renk fonksiyonudur ve bir rengi üç değerle tanımlar: L (Lightness, parlaklık), C (Chroma, renk doygunluğu) ve H (Hue, ton açısı). Söz dizimi `oklch(L C H)` biçimindedir; L 0 ile 1 arasında (ya da %0-%100), C sRGB için kabaca 0 ile 0,4 arasında, H ise 0-360 derece arasında bir değer alır.

Örneğin `oklch(0.7 0.15 250)` soluk bir mavi, `oklch(0.3 0.1 20)` ise koyu bir kırmızı-kahve tonu üretir; isteğe bağlı alfa kanalı için `oklch(0.7 0.15 250 / 0.5)` yazılır. Üç değerin de birbirinden bağımsız çalışması, tek bir kanalı değiştirerek rengi tahmin edilebilir şekilde açmanıza, koyultmanıza veya doygunluğunu ayarlamanıza izin verir.

## Neden hex veya HSL yerine OKLCH kullanmalıyım?

Çünkü HSL'nin parlaklık ekseni gözün gerçekte gördüğüyle örtüşmez. `hsl(240 100% 50%)` (saf mavi) ile `hsl(60 100% 50%)` (saf sarı) aynı HSL parlaklığına sahiptir, ama sarı gözle çok daha açık görünür. Bu tutarsızlık, bir paletten otomatik ton veya gölge üretmeye çalıştığınızda bazı renklerin beklenenden çok açık ya da çok koyu çıkmasına yol açar.

OKLCH'nin L kanalı, Oklab renk uzayından geldiği için tüm tonlarda algısal olarak eşit aralıklıdır; aynı L değeri, hangi H'de olursa olsun gözle yaklaşık aynı parlaklıkta görünür. Bu da bir tasarım sisteminde "bu mavi ile bu kırmızı aynı açıklıkta görünmeli" gibi kararları, deneme yanılmadan kurtarıp doğrudan sayıya dönüştürür.

| Özellik | Hex / RGB | HSL | OKLCH |
|---|---|---|---|
| Parlaklık algısal olarak tutarlı mı | Hayır | Hayır | Evet |
| Otomatik ton/gölge üretimi güvenilir mi | Hayır | Kısmen, tonlara göre değişir | Evet |
| sRGB dışı (display-p3) renk tanımlayabilir mi | Hayır | Hayır | Evet |
| color-mix() ile öngörülebilir karışım | Zayıf | Orta | İyi |
| 2026 tarayıcı desteği | Evrensel | Evrensel | Baseline (2023'ten beri) |

Tablo, aynı görevi hex veya HSL ile de yapabileceğinizi ama OKLCH'nin bunu daha az deneme yanılma ile yaptığını gösteriyor; özellikle çok tonlu bir paleti otomatik olarak türetmeniz gerektiğinde fark büyüyor.

## color-mix() ne işe yarar?

color-mix(), iki rengi belirlediğiniz bir renk uzayında belirli oranlarda karıştırıp yeni bir renk üretir; söz dizimi `color-mix(in oklch, renkA %p1, renkB %p2)` şeklindedir. En pratik kullanım, bir marka rengini beyaza ya da siyaha belirli yüzdelerle karıştırarak hover, active ya da disabled durumları türetmektir.

Karıştırma işlemini `oklch` veya `oklab` uzayında yapmak, `hsl` veya `srgb` uzayına göre daha pürüzsüz ve öngörülebilir geçişler verir; çünkü ara adımlar da algısal olarak tutarlı kalır. Tek tek hex kod seçmek yerine tek bir temel renkten tutarlı bir skala elde edersiniz.

## Token sistemi: OKLCH ile marka renk skalası nasıl kurulur?

Beş adımlık bir skala kurmak için tek bir temel tona ihtiyacınız var; gerisini color-mix() hesaplar.

```css
:root {
  --brand-500: oklch(0.58 0.19 250);
  --brand-hover: color-mix(in oklch, var(--brand-500) 85%, black 15%);
  --brand-active: color-mix(in oklch, var(--brand-500) 70%, black 30%);
  --brand-tint-100: color-mix(in oklch, var(--brand-500) 15%, white 85%);
  --brand-disabled: color-mix(in oklch, var(--brand-500) 40%, white 60%);
}

.button {
  background: var(--brand-500);
}

.button:hover {
  background: var(--brand-hover);
}

.button:disabled {
  background: var(--brand-disabled);
}
```

Bu düzende tasarımcı tek bir `--brand-500` değerini değiştirdiğinde hover, active ve disabled durumları otomatik olarak güncellenir; Figma'da beş farklı hex kodu elle eşleştirmeye gerek kalmaz.

Kişisel görüşüm şu: çoğu ekip hâlâ Figma'da beş-altı hex tonunu elle seçiyor, oysa color-mix() bu tonları tek bir temel renkten otomatik türetip tasarım ile kodu senkron tutabilir; elle seçilen paletler birkaç sprint içinde kod tabanından sapmaya başlıyor.

## Karanlık tema OKLCH ile nasıl türetilir?

Kısa cevap: her token'ın L değerini kabaca 1'den çıkarıp C ve H'yi sabit tutarak başlayın; bu size makul bir karanlık tema taslağı verir, ama kontrol etmeden üretime almayın.

Örneğin `oklch(0.3 0.1 20)` açık temada koyu bir vurgu rengiyse, karanlık temada `oklch(0.7 0.1 20)` civarı bir değer benzer bir izlenim bırakır. Bu ters çevirme kusursuz değildir; bazı tonlarda chroma'yı da hafifçe ayarlamanız gerekir, o yüzden her token'ı göz ile ve bir kontrast denetleyiciyle kontrol edin. Hızlı bir ilk taslak olarak düşünün, garanti bir dönüşüm olarak değil.

## Geniş gamut (display-p3) ne zaman önemli olur?

OKLCH, sRGB üçgeninin dışındaki renkleri de tanımlayabilir; bu, display-p3 ekranlarda daha doygun tonlar göstermek isteyenler için önemlidir. Bir OKLCH değeri geçerli ekranın gamutunun dışında kalırsa, destekleyen tarayıcılar bunu otomatik olarak ekranın gösterebileceği en yakın tona eşler; yani sert bir kırpılma yerine yumuşak bir geçiş olur.

Eski tarayıcılar ise OKLCH satırını tanımadığı için yok sayar; bu yüzden aynı özelliğe önce bir sRGB (hex veya rgb()) değer, ardından OKLCH değerini yazın. CSS bir özellikte geçerli olan son değeri kullanır, böylece destekleyen tarayıcı OKLCH'yi, desteklemeyen tarayıcı sRGB yedeğini otomatik olarak uygular.

## Tüm tarayıcılar destekliyor mu?

2026 itibarıyla büyük ölçüde evet. oklch(), oklab(), lch(), lab() renk fonksiyonları ve color-mix(), Chrome 111, Edge 111, Firefox 113 ve Safari 16.2'de 2023'ün ilk yarısında kullanıma girdikten sonra aynı yıl içinde Baseline durumuna ulaştı; bu, dört büyük tarayıcı motorunda da güvenle kullanılabilir anlamına geliyor.

Üçüncü taraf kullanım izleyicileri 2026 itibarıyla küresel desteği yüzde 90'ların ortasında gösteriyor; bu rakam resmi bir ölçüm olmadığı için yaklaşık kabul edin, daha kesin bir sayı iddia etmeyin.

Not: OKLCH kullanmak erişilebilir kontrastı otomatik garanti etmez. Türetilmiş her ton ve gölgeyi, özellikle karanlık tema için ters çevirdiğiniz L değerlerini, bir kontrast denetleyiciyle ayrıca kontrol edin.

Bu renk sistemini [CSS @layer ile büyük stil dosyalarını evcilleştirme rehberimizde](/tr/posts/css-cascade-layers-buyuk-stil) anlattığımız katman yapısına oturtabilir, aynı token'ları [container query'lerle](/tr/posts/css-container-queries-kullanimi) duyarlı bileşenlerde kullanabilirsiniz. Renk kararlarınızı [erişilebilirlik kontrol listemizle](/tr/posts/web-erisilebilirlik-kontrol-listesi) doğrulamayı, koşullu stil ihtiyaçları için de [CSS if() rehberimize](/tr/posts/css-if-ile-kosullu-stil-yazmak) bakmayı unutmayın. Daha fazla [web geliştirme yazısı için kategori sayfamıza](/tr/category/web-gelistirme) göz atabilirsiniz.

MDN'in [oklch() referansı](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) ve [color-mix() referansı](https://developer.mozilla.org/en-US/docs/Web/CSS/color-mix), web.dev'in [Baseline 2023 duyurusu](https://web.dev/blog/baseline2023) ve [W3C CSS Color 4 spesifikasyonu](https://www.w3.org/TR/css-color-4/) teknik ayrıntılar için iyi birer kaynak.

## Sıkça Sorulan Sorular

### OKLCH tarayıcılarda güvenle kullanılabilir mi?

Evet. oklch() ve color-mix(), 2023'te Chrome, Edge, Firefox ve Safari'nin güncel sürümlerinde aynı anda desteklenmeye başladı ve o yıl içinde Baseline durumuna ulaştı; 2026 itibarıyla güncel tarayıcıların büyük kısmı bu fonksiyonları destekliyor, yalnızca çok eski sürümler dışarıda kalıyor.

### color-mix() ile Sass/Less fonksiyonlarının farkı ne?

Sass'in `darken()` ve `lighten()` fonksiyonları derleme zamanında çalışır ve genelde HSL üzerinde işlem yapar; color-mix() ise tarayıcıda çalışır, CSS custom property'leriyle birlikte kullanılabilir ve OKLCH gibi algısal olarak tutarlı bir uzayda karıştırma yapabilir. Bu da Sass'in HSL tabanlı fonksiyonlarına göre daha öngörülebilir sonuç verir.

### OKLCH değerleri hex'e nasıl çevrilir?

Elle çevirmeniz gerekmez; tarayıcı OKLCH değerini otomatik olarak ekranın renk uzayına dönüştürür. Mevcut bir hex paletten geçmek istiyorsanız tarayıcınızın geliştirici araçlarındaki renk seçiciyi veya bir OKLCH dönüştürücüyü kullanabilirsiniz; elle hesaplamaya gerek yoktur.

### Karanlık tema için ayrı bir OKLCH paleti mi oluşturmalıyım?

Genelde hayır, aynı token setini L değerini ters çevirerek yeniden kullanabilirsiniz. Chroma ve Hue'yu sabit tutup Lightness'i kabaca 1'den çıkarmak size hızlı bir başlangıç noktası verir; sonucu gözle ve kontrast denetleyiciyle kontrol edip gerekirse chroma'yı küçük miktarlarda ayarlayın.
