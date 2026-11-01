---
title: "CSS if() ile Koşullu Stil Yazmak"
slug: "css-if-ile-kosullu-stil-yazmak"
translationKey: "css-if-conditional-styling-2026"
locale: "tr"
excerpt: "Kısa cevap: CSS if(), bir özelliğin değerini style(), media() veya supports() testine göre seçtirir; Chromium'da çalışır, Firefox/Safari'de henüz yok."
category: "web-development"
tags: ["css", "web-standards", "frontend", "responsive-design"]
publishedAt: "2026-11-01"
seoTitle: "CSS if() Nasıl Kullanılır? Syntax ve Tarayıcı Desteği"
seoDescription: "CSS if() fonksiyonu nedir, style() media() supports() koşulları nasıl yazılır, hangi tarayıcılar destekliyor ve JS toggle'ların yerini ne zaman alır?"
---

Kısa cevap: CSS `if()`, bir özelliğin değerini `style()`, `media()` veya `supports()` koşuluna göre seçmenizi sağlayan yeni bir değer fonksiyonu. Kasım 2026 itibarıyla sadece Chromium tabanlı tarayıcılarda (Chrome ve Edge 137+) çalışıyor; Firefox geliştirme aşamasında, Safari'de henüz destek yok — yani üretimde `@supports` korumasıyla kullanmanız gerekiyor.

## CSS if() nedir ve neden eklendi?

CSS `if()`, önceden JavaScript'e veya `data-*` özelliklerine bırakılan basit koşullu stil kararlarını doğrudan CSS'e taşıyan bir değer fonksiyonu. Bir özelliğin değerini "eğer bu koşul doğruysa X, değilse Y" mantığıyla seçmenize izin veriyor — tarayıcı her yeniden boyamada bu kararı kendisi veriyor, JS'in `classList.toggle` çağırmasını beklemeden.

Bunun pratik faydası, basit varyant mantığının CSS dosyasından çıkmaması. Bir butonun rengini tema özel özelliğine göre değiştirmek için artık ayrı bir `data-theme` özniteliği yönetmenize veya her tema için ayrı bir sınıf yazmanıza gerek yok; tek bir `color` satırı bunu halledebiliyor.

## CSS if() hangi tarayıcılarda çalışıyor?

`if()` Kasım 2026 itibarıyla Baseline durumunda değil — MDN bunu "sınırlı destek" olarak işaretliyor çünkü yaygın kullanılan tarayıcıların bazılarında çalışmıyor. Chrome ve Edge sürüm 137 ve sonrasında destekleniyor, Firefox'ta geliştirme aşamasında, Safari'de ise henüz duyurulmuş bir destek yok.

| Tarayıcı | Durum (Kasım 2026) |
|---|---|
| Chrome / Edge | Destekleniyor (137+) |
| Firefox | Geliştirme aşamasında, tarih belirtilmedi |
| Safari | Henüz desteklenmiyor |
| Chrome for Android | Destekleniyor |

Bu tablo şunu söylüyor: `if()`'i bugün üretime koyarsanız, kullanıcılarınızın bir kısmı (Safari ve Firefox kullanıcıları) hiçbir koşullu stil görmeyecek — bu yüzden her zaman bir varsayılan değer bırakmanız gerekiyor.

Baseline'a girmesi için genelde tüm büyük tarayıcıların desteklediği tarihten itibaren otuz ay geçmesi gerekiyor; `if()` şu anda bu sürenin başında, yani 2028'den önce "Baseline: widely available" etiketini almasını beklemeyin. Bu süre boyunca `if()`'i üretim kodunda sadece aşamalı geliştirme (`@supports` korumalı) olarak kullanmak, Safari ve Firefox kullanıcılarının deneyimini bozmamanın tek güvenli yolu.

## style(), media() ve supports() koşulları nasıl yazılır?

`if()` içinde üç farklı koşul testi kullanabilirsiniz ve her biri farklı bir soruya cevap veriyor: `style()` elementin kendi özel özelliğini veya hesaplanmış stilini sorgular, `media()` bir satır içi media query gibi çalışır, `supports()` ise tarayıcının belirli bir CSS özelliğini destekleyip desteklemediğini test eder.

```css
.card {
  /* style(): aynı elementteki özel özelliği kontrol eder, üst elemana gerek yok */
  background: if(style(--theme: dark): #111; else: #fff);

  /* media(): satır içi media query gibi davranır */
  margin: if(media(width > 700px): 0 auto; else: 1rem);

  /* supports(): tarayıcı desteğini test eder */
  color: if(supports(color: lch(75% 0 0)): lch(75% 0 0); else: #333);
}
```

Her koşulun ardından bir `:` ve bir değer geliyor, koşullar `;` ile ayrılıyor, ve isteğe bağlı bir `else:` dalı son çare değerini veriyor. `style()` testleri içinde `not`, `and` ve `or` birleştiricilerini de kullanabiliyorsunuz — yani "tema koyu değilse ve genişlik 700px'den büyükse" gibi bileşik koşullar yazılabiliyor.

Bu, container style query'lerden farklı: `style()` testi çalışması için bir üst elemente ihtiyaç duymuyor, doğrudan aynı elementin özel özelliğini okuyor.

## if() ile JS toggle'larının yerini nasıl alırsınız?

Bir buton varyantını `data-variant="primary"` özniteliğiyle yöneten eski yaklaşım yerine, varyantı bir özel özellikte tutup `if()` ile okuyabilirsiniz; bu, JS'in DOM'a dokunmasına hiç gerek kalmadan stil kararını CSS'e taşıyor.

```css
.button {
  --variant: primary;
  background: if(
    style(--variant: primary): var(--color-brand);
    style(--variant: danger): var(--color-danger);
    else: var(--color-neutral)
  );
}
```

Bu örnekte JavaScript'in tek görevi `--variant` özel özelliğini inline style ile güncellemek; renk, kenarlık ve metin rengi gibi tüm bağımlı kararları CSS kendi başına veriyor. [İleri TypeScript kalıpları](/tr/posts/ileri-typescript-kaliplari) yazısında ele alınan tip güvenliği mantığına benzer şekilde, burada da mantığı tek bir yere (CSS'e) toplamak, bileşenin farklı yerlerinde tutarsız varyant kodu yazma riskini azaltıyor.

Eski yaklaşımda her yeni varyant eklediğinizde hem JS tarafında `classList` mantığını hem CSS tarafında ilgili sınıf seçicisini güncellemeniz gerekiyordu; `if()` ile bu ikinci adım ortadan kalkıyor, çünkü varyant listesi tamamen CSS dosyasında tutuluyor. Bu, özellikle bir bileşen kütüphanesinde üç veya dört varyantlı küçük bileşenler (rozet, etiket, bildirim çipi) için gözle görülür bir bakım kazancı sağlıyor.

## if() performans açısından ne anlama gelir?

`if()` testleri tarayıcının her stil hesaplamasında (style recalculation) yeniden değerlendirdiği basit karşılaştırmalar; bu nedenle tek bir elementte birkaç `if()` kullanmak ölçülebilir bir performans maliyeti getirmiyor. Asıl risk performans değil, okunabilirlik: aynı elementte beşten fazla iç içe `if()` koşulu, CSS dosyasını JavaScript'ten daha zor okunur hale getirebiliyor.

Chrome DevTools'un Performance panelinde `if()` içeren bir sayfayı kayda alırsanız, style recalculation süresinde ölçülebilir bir fark görmezsiniz; bu da aracın üretim ortamında performans kaygısı olmadan denenebileceğini gösteriyor.

## if() özel özelliklerle ve @property ile nasıl etkileşir?

`if()` okuduğu özel özellik `@property` ile tipli (typed) olarak tanımlanmışsa, koşul testi değeri tip güvenli şekilde karşılaştırıyor; tipsiz bir özel özellikte ise karşılaştırma ham metin eşleşmesine dayanıyor. Pratik etkisi şu: `@property --variant { syntax: "primary | danger | neutral"; }` gibi bir tanım yaptığınızda, geçersiz bir değer atandığında tarayıcı varsayılana düşüyor ve `if()` testi öngörülebilir çalışıyor.

Bu kombinasyon, özellikle büyük bir tasarım sisteminde varyant adlarının yazım hatasına karşı daha dayanıklı olmasını sağlıyor — tipsiz bir özel özellikte "primray" gibi bir yazım hatası sessizce geçerken, tipli bir tanımda bu değer reddediliyor.

## if() ne zaman yanlış araçtır?

`if()`, tek bir elementin kendi durumuna bağlı basit, tekil değer kararları için uygun; ama bir elementin üst elemanının boyutuna veya bir breakpoint'e göre birden fazla özelliği birden değiştirmeniz gerekiyorsa [container query'ler](/tr/posts/css-container-queries-kullanimi) veya [cascade layers](/tr/posts/css-cascade-layers-buyuk-stil) daha doğru araç. Container query'ler bir bütün bloğun düzenini değiştirmek için tasarlandı, `if()` ise tek bir değeri değiştirmek için.

Kendi değerlendirmem: `if()`'i gördüğünüz her `data-*` özniteliğini değiştirmek için kullanmaya çalışmak hataya açık bir refactor. Üç veya daha az varyantı olan basit renk/boşluk kararları için `if()` gerçek bir kazanç; beş veya daha fazla varyantlı karmaşık bir bileşen için hâlâ sınıf tabanlı yaklaşım veya cascade layers daha okunaklı kalıyor.

Pratik bir kural olarak: yeni bir bileşen yazarken önce "bu karar tek bir değeri mi, yoksa birden fazla özelliği birlikte mi etkiliyor" sorusunu sorun. Cevap "tek değer" ise `if()`'e, "birden fazla özellik" ise container query veya cascade layers'a yönelin — bu basit ayrım, hangi aracı seçeceğiniz konusunda çoğu tartışmayı baştan çözüyor.

## Desteklenmeyen tarayıcılar için fallback nasıl yazılır?

Güvenli yöntem, `if()`'i her zaman bir `@supports` bloğu içine almak ve blok dışında sade bir varsayılan değer bırakmak; bu sırayla CSS, `if()` destekleyen tarayıcılarda gelişmiş davranışı, desteklemeyenlerde ise sade ama çalışan bir görünümü garantiliyor.

```css
.card {
  background: #fff; /* varsayılan, if() desteklenmezse bu kalır */
}

@supports (background: if(style(--x: 1): red; else: blue)) {
  .card {
    background: if(style(--theme: dark): #111; else: #fff);
  }
}
```

Bu, [erişilebilir form oluşturma kontrol listesinde](/tr/posts/erisilebilir-form-olusturma-kontrol-listesi) vurgulanan "aşamalı geliştirme" prensibiyle aynı mantık: temel deneyimi hiçbir yeni özelliğe bağlamadan çalışır tutup, gelişmiş davranışı destekleyen tarayıcılara ekstra olarak sunmak.

## Sıkça Sorulan Sorular

### CSS if() nedir?

CSS `if()`, bir özelliğin değerini `style()`, `media()` veya `supports()` koşuluna göre seçmenizi sağlayan bir değer fonksiyonudur. Koşullu stil mantığını JavaScript'ten veya `data-*` özniteliklerinden doğrudan CSS'e taşır.

### CSS if() hangi tarayıcılarda çalışır?

Kasım 2026 itibarıyla Chrome ve Edge sürüm 137 ve sonrasında çalışır; Firefox geliştirme aşamasında, Safari'de henüz destek yoktur. Bu nedenle üretimde her zaman bir `@supports` koruması ve varsayılan değer bırakmak gerekir.

### if() ile media query arasındaki fark nedir?

Bir `@media` bloğu tüm stil kuralını koşullu hale getirirken, `if()` içindeki `media()` testi sadece tek bir özelliğin değerini koşullu yapar. Birden fazla özelliği aynı anda değiştirmeniz gerekiyorsa `@media` veya container query daha uygun kalır.

### if() ne zaman container query yerine kullanılmalı?

`if()`, tek bir elementin kendi özel özelliğine veya basit bir media/destek koşuluna bağlı tek bir değer kararı için uygundur. Bir üst elemanın boyutuna göre birden fazla özelliği birlikte değiştirmeniz gerekiyorsa container query daha doğru araçtır.
