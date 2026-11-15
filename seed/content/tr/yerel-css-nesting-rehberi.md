---
title: "Yerel CSS Nesting Nasıl Kullanılır?"
slug: "yerel-css-nesting-rehberi"
translationKey: "css-native-nesting-2026"
locale: "tr"
excerpt: "Kısa cevap: Chrome 120, Firefox 117 ve Safari 17.2'den beri tüm tarayıcılar yerel CSS nesting'i destekliyor; Sass'ı bırakabilirsiniz, loop ve mixin hariç."
category: "web-development"
tags: ["css", "frontend", "web-standards", "best-practices"]
publishedAt: "2026-11-15"
seoTitle: "Yerel CSS Nesting Rehberi: Sass'tan Geçiş"
seoDescription: "CSS nesting artık Baseline. Chrome 120, Firefox 117, Safari 17.2'den beri destekleniyor. & kuralı, medya sorgusu nesting'i ve Sass'a göre özgüllük farkları."
---

Kısa cevap: evet, bugün itibarıyla büyük bir bileşenin stilini saf CSS'te yazabilirsiniz — Chrome 120, Edge 120, Firefox 117 ve Safari 17.2'den beri yerel CSS nesting tüm büyük tarayıcılarda çalışıyor ve Haziran 2026'dan itibaren Baseline "widely available" statüsünde. Sass'ı tamamen atmanız gerekmiyor; loop, mixin ve fonksiyon gibi işler hâlâ bir preprocessor'ı hak ediyor, ama basit iç içe seçiciler için artık bir derleme adımına gerek yok.

## CSS nesting sözdizimi nasıl çalışıyor?

Nesting, bir seçicinin içine başka bir seçici yazıp onu üst seçiciye bağlamanızı sağlıyor; `&` karakteri üst seçiciyi temsil ediyor. Chrome 120, Firefox 117 ve Safari 17.2 öncesinde yalnızca `& h2` gibi `&` ile başlayan iç içe kurallar kabul ediliyordu; bu sürümlerden sonra gelen "gevşetilmiş sözdizimi" (relaxed syntax) sayesinde `h2` gibi çıplak bir element seçiciyle de doğrudan başlayabiliyorsunuz.

```css
.card {
  padding: 1rem;
  border-radius: 0.5rem;

  h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  }

  &.featured {
    border: 2px solid var(--accent);
  }
}
```

`:hover` ve `.featured` gibi bileşik seçicilerde `&` hâlâ gerekli; sadece element adıyla başlayan basit torun seçicilerde `&` opsiyonel oldu.

## Medya sorgularını nasıl nestliyorsunuz?

Bir bileşenin stilini ve onun responsive davranışını aynı blokta tutmak için medya sorgusunu doğrudan kuralın içine yazabilirsiniz; bu, Sass'ta `@include breakpoint` gibi bir mixin'le taklit etmeniz gereken bir şeyi yerel olarak veriyor.

```css
.sidebar {
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
}
```

Bu yapı, aynı bileşenin tüm breakpoint davranışını tek bir yerde tutmanızı sağlıyor — stil dosyasında sidebar'ı ararken üç farklı medya sorgusu bloğuna dağılmış kuralları aramak zorunda kalmıyorsunuz.

## CSS nesting'in özgüllüğü Sass'tan nasıl farklı?

Yerel CSS nesting'de `&`, üst seçici listesinin en yüksek özgüllüğünü alıyor — bu, `:is()` seçicisinin çalışma mantığıyla aynı. Sass ise derleme sırasında ayrı, düz torun seçiciler üretiyor; bu da iki sistemin özgüllük hesaplamasını farklılaştırabiliyor. Örneğin üst seçici bir ID içeriyorsa, `.card .title` gibi bir iç içe kural beklenmedik şekilde yüksek bir özgüllük kazanabiliyor ve bu da öngörülemeyen ezme (override) sorunlarına yol açabiliyor.

| | Sass nesting | Yerel CSS nesting |
|---|---|---|
| Derleme adımı | Gerekli | Gerekmiyor |
| Özgüllük hesaplama | Düz torun seçici gibi | `:is()` mantığıyla en yüksek özgüllük |
| Medya sorgusu nesting'i | Mixin ile taklit | Yerel destekleniyor |
| Loop/fonksiyon/mixin | Var | Yok |
| Tarayıcı desteği gerekli mi | Hayır, derleme zamanında çözülüyor | Evet, Chrome 120/Firefox 117/Safari 17.2+ |

## Preprocessor'ı tamamen bırakmalı mısınız?

Hayır, projeniz `@each` ile döngü kuran, bir fonksiyonla renk tonu hesaplayan veya birden fazla dosyada paylaşılan mixin'ler kullanan bir tasarım sistemiyse Sass hâlâ gerçek bir değer katıyor — bunlar CSS'in yerel özellik kümesinde karşılığı olmayan işler. Ama projenizin Sass kullanımı büyük ölçüde iç içe seçicilerden ibaretse (çoğu küçük-orta bileşen kütüphanesinde durum bu), yerel nesting'e geçmek derleme adımını tamamen ortadan kaldırabiliyor.

## Bir bileşeni Sass'tan native CSS'e nasıl taşırsınız?

Aşağıdaki örnek, tipik bir Sass kart bileşeninin satır satır native CSS'e dönüşümünü gösteriyor:

```css
/* Önce: Sass */
.card {
  padding: 1rem;
  &__title {
    font-size: 1.25rem;
  }
  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  }
}

/* Sonra: native CSS */
.card {
  padding: 1rem;

  .card__title {
    font-size: 1.25rem;
  }

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  }
}
```

Tek fark, Sass'ın `&__title` kısayolunun yerel CSS'te karşılığı olmaması — BEM benzeri bir isimlendirme kullanıyorsanız, sınıf adını nested seçicinin içinde tam olarak yazmanız gerekiyor. Bunun dışında dönüşüm neredeyse birebir.

## Nesting'i kötüye kullanmanın yaygın bir yolu var mı?

En sık görülen hata, nesting'i çok derine götürmek — dört veya beş seviyeli bir nesting bloğu, Sass'ta da native CSS'te de okunabilirliği bozuyor ve özgüllüğü tahmin edilemez hale getiriyor. Pratik bir kural olarak nesting'i iki, en fazla üç seviyeyle sınırlı tutmak; dördüncü seviyeye ihtiyaç duyduğunuz anda, bu genelde bileşeni küçük parçalara ayırmanız gerektiğinin işareti. İkinci yaygın hata, `&` özgüllük davranışını bilmeden bir üst seçiciye ID eklemek — bu, nested bir kuralın beklenmedik şekilde başka bir kuralı ezmesine yol açabiliyor, özellikle büyük bir CSS dosyasında bu hatayı DevTools'ta "neden bu stil uygulanmıyor" diye saatlerce aramadan önce fark etmek zor.

## Bir build aracı (PostCSS, Vite) olmadan nesting kullanabilir misiniz?

Evet, bu nesting'in asıl kazancı — hedef tarayıcılarınız Chrome/Edge 120, Firefox 117 ve Safari 17.2 veya üzerini kapsıyorsa, herhangi bir derleyici, eklenti veya build adımı olmadan doğrudan `.css` dosyanıza yazabilirsiniz. Bu, özellikle statik bir site, bir Astro veya basit bir Next.js projesinde, Sass'ı kurmak için gereken `node-sass` veya `sass` paketini, ilgili webpack/Vite eklentisini ve derleme adımını tamamen ortadan kaldırıyor. Daha az bağımlılık, daha az güvenlik yaması takibi ve daha kısa `npm install` süresi anlamına geliyor — küçük bir kazanç gibi görünse de, 50'den fazla bileşenlik bir projede derleme süresinden gerçek saniyeler kazandırıyor.

## Hangi tarayıcı sürümleri nesting'i destekliyor?

Chrome ve Edge 120, Firefox 117 ve Safari 17.2'den beri gevşetilmiş sözdizimiyle birlikte destekleniyor; bu sürümlerden önceki Chrome 112-119 ve Safari 16.5-17.1 gibi aralıklar, torun seçicilerin önünde `&` gerektiren daha kısıtlı bir eski sözdizimine sahipti. Shadow DOM içinde `:host` ile nesting kullanıyorsanız, 18.1'den önceki Safari sürümlerinde bilinen sorunlar var — bu özel durumda eski bir fallback bırakmak mantıklı.

Dürüst görüşüm: CSS nesting'in asıl kazancı "daha az kod" değil, "daha az araç" — bir derleme adımını kaldırmak, özellikle statik sitelerde ve küçük bileşen kütüphanelerinde build süresini ve bağımlılık yüzeyini gerçekten azaltıyor. Ama özgüllük farkını küçümsemeyin; Sass'tan native'e geçerken bir ID içeren bir üst seçiciniz varsa, görsel regresyon testini atlamayın.

Diğer saf CSS teknikleri için [JavaScript'siz native CSS carousel rehberimize](/tr/posts/javascriptsiz-native-css-carousel-yapimi) bakabilirsiniz; [web geliştirme kategorimizde](/tr/category/web-gelistirme) daha fazla pratik rehber var.

Kaynak: [MDN'nin CSS nesting modülü](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting) ve [Chrome'un gevşetilmiş sözdizimi duyurusu](https://developer.chrome.com/blog/css-nesting-relaxed-syntax-update).

## Sıkça Sorulan Sorular

### CSS nesting hangi tarayıcılarda çalışıyor?

Chrome ve Edge 120, Firefox 117 ve Safari 17.2'den beri gevşetilmiş sözdizimiyle birlikte destekleniyor ve Haziran 2026'dan itibaren Baseline "widely available" statüsünde. Daha eski sürümler (Chrome 112-119, Safari 16.5-17.1) yalnızca `&` ile başlayan daha kısıtlı bir sözdizimini destekliyordu.

### CSS nesting'de & neden gerekli, ne zaman gerekmiyor?

`&` karakteri üst seçiciyi temsil ediyor ve `:hover`, `.featured` gibi bileşik seçicilerde hâlâ zorunlu. Gevşetilmiş sözdizimi sayesinde `h2` gibi çıplak bir element adıyla başlayan basit torun seçicilerde artık `&` yazmanız gerekmiyor.

### Native CSS nesting, Sass'tan daha mı az güvenilir özgüllük üretiyor?

Daha az güvenilir değil, ama farklı: `&`, üst seçici listesinin en yüksek özgüllüğünü alıyor (`:is()` mantığıyla), Sass ise düz bir torun seçici üretiyor. Üst seçici bir ID içeriyorsa bu fark beklenmedik ezme sorunlarına yol açabilir, bu yüzden geçiş sırasında görsel regresyon testi önemli.

### Sass'ı tamamen bırakabilir miyim?

Projeniz yalnızca iç içe seçiciler için Sass kullanıyorsa evet, native CSS nesting'e geçip derleme adımını kaldırabilirsiniz. Ama `@each` döngüleri, renk hesaplayan fonksiyonlar veya paylaşılan mixin'ler kullanıyorsanız, bunların yerel CSS karşılığı yok, Sass hâlâ gerekli.
