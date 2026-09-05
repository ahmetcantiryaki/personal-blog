---
title: "CSS Anchor Positioning: JS'siz Popover ve İpucu"
slug: "css-anchor-positioning-jssiz-popover"
translationKey: "css-anchor-positioning-2026"
locale: "tr"
excerpt: "Kısa cevap: anchor-name ve position-anchor ile bir tooltip'i hedef elemana bağlayıp, @position-try ile taşma durumunda otomatik konum değiştirebilirsiniz."
category: "web-development"
tags: ["css", "frontend", "web-standards", "responsive-design"]
publishedAt: "2026-09-05"
seoTitle: "CSS Anchor Positioning ile JS'siz Tooltip ve Popover Kurma"
seoDescription: "Kısa cevap: anchor-name ve position-anchor ile bir tooltip'i hedef elemana bağlayıp, @position-try ile taşma durumunda otomatik konum değiştirebilirsiniz."
---

Kısa cevap: CSS Anchor Positioning, bir elemanı (tooltip, dropdown, popover) başka bir elemana `anchor-name` ve `position-anchor` özellikleriyle doğrudan CSS'te bağlamanızı sağlıyor; Popper.js veya Floating UI gibi bir JavaScript kütüphanesine gerek kalmıyor. Temmuz 2026 itibarıyla caniuse'a göre destek yaklaşık %81 seviyesinde.

## Bu özellik hangi sorunu çözüyor?

Kısa cevap: Şu ana kadar bir tooltip'i bir butona "yapıştırmak" için JavaScript'te her scroll ve resize olayında elemanın konumunu yeniden hesaplayan bir kütüphane çalıştırmanız gerekiyordu — Anchor Positioning bu hesaplamayı tarayıcının render motoruna devrediyor.

Floating UI veya Popper.js gibi kütüphaneler hâlâ iyi çalışıyor, ama her biri bundle'a 5-10 KB ekliyor ve z-index çakışmaları ile overflow: hidden konteynerlerin tooltip'i kesmesi gibi klasik sorunları elle çözmenizi gerektiriyor. Anchor Positioning, konumlandırmayı tarayıcının layout motoru seviyesinde çözdüğü için bu sorunların çoğu kendiliğinden ortadan kalkıyor.

## anchor-name ve position-anchor nasıl çalışıyor?

Kısa cevap: Hedef elemana `anchor-name: --my-anchor` verip, konumlandırılacak elemana `position-anchor: --my-anchor` ve `position: absolute` tanımlayarak, ikinci elemanı birinciye bağlıyorsunuz; ardından `top: anchor(bottom)` gibi bir değerle tam olarak hangi kenara göre yerleşeceğini belirliyorsunuz.

```css
.trigger-button {
  anchor-name: --my-tooltip-anchor;
}

.tooltip {
  position: absolute;
  position-anchor: --my-tooltip-anchor;
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 8px;
}
```

Bu birkaç satır, önceden bir JavaScript kütüphanesinin `useFloating()` hook'uyla yaptığı işin aynısını, hiçbir çalışma zamanı (runtime) hesaplaması olmadan yapıyor.

## Viewport taşmasını @position-try nasıl çözüyor?

Kısa cevap: `@position-try` kuralı, tooltip'in normal konumda ekran dışına taşacağı durumlar için alternatif bir yerleşim tanımlamanızı sağlıyor; tarayıcı, öncelikli konumun sığmadığını fark ettiğinde otomatik olarak bu alternatife geçiyor. Bu, önceden Popper.js'in "flip" middleware'inin yaptığı işin CSS karşılığı.

```css
.tooltip {
  position-try-fallbacks: flip-block, flip-inline;
}

@position-try --tooltip-above {
  top: anchor(top);
  bottom: unset;
}
```

`position-area` özelliği de benzer bir amaca hizmet ediyor: dokuz bölgeli bir ızgara (grid) üzerinden ("top center", "bottom end" gibi) konum tanımlamanıza izin veriyor. Not: bu özellik daha önce `inset-area` adıyla biliniyordu; Chrome 129'dan itibaren `position-area` olarak yeniden adlandırıldı, eski isim Chrome 131'e kadar geriye dönük destekleniyor.

## Popover API ile birlikte nasıl kullanılır?

Kısa cevap: HTML'in yerleşik `popover` özelliği ile Anchor Positioning birleştiğinde, bir `<div popover>` elemanı hem otomatik üst katman (top layer) render'ı hem de CSS ile konumlandırma alıyor — dışarı tıklamayı kapatma veya ESC ile kapama gibi davranışları da JavaScript yazmadan elde ediyorsunuz.

```html
<button popovertarget="info-popover" style="anchor-name: --info-btn">Bilgi</button>
<div id="info-popover" popover style="position-anchor: --info-btn; top: anchor(bottom);">
  İçerik burada.
</div>
```

Bu ikili, [JavaScript gerektirmeyen HTML dialog ve popover](/tr/posts/javascript-gerektirmeyen-html) yaklaşımının doğal bir devamı — popover'ın davranışını `popover` özelliğinden, konumunu ise Anchor Positioning'den alıyorsunuz.

## Tarayıcı desteği ne durumda?

Kısa cevap: Chrome, Edge ve Opera (Chromium tabanlı) Mart 2024'ten beri (Chrome 125) stabil destek veriyor; Safari 18.x temel `anchor-name`, `position-anchor` ve `anchor()` fonksiyonunu destekliyor ama `@position-try` henüz Safari 19'u bekliyor; Firefox spesifikasyonu uygulamış durumda ve 2026 ortasında stabil sürümde bekleniyor.

| Tarayıcı | Temel Anchor Positioning | @position-try | Durum (Eylül 2026) |
|---|---|---|---|
| Chrome/Edge/Opera | Var (v125+, Mart 2024) | Var | Tam destek |
| Safari 18.x | Var | Yok | Kısmi destek, v19 bekleniyor |
| Firefox | Uygulandı | Uygulandı | Stabil sürüme yakın |

Genel destek caniuse'a göre Temmuz 2026 itibarıyla %81; ancak Anchor Positioning Level 2'deki daha yeni özellikler (çoklu `position-try-fallbacks` gibi) yalnızca kullanıcıların %64'üne ulaşıyor. Bu fark, hangi özelliği kullanacağınızı seçerken önemli.

## Dropdown menü örneği nasıl kurulur?

Kısa cevap: Bir dropdown menüde, `anchor-name` menüyü açan butona, `position-anchor` ise menünün kendisine verilir; `position-area: bottom span-right` gibi bir değerle menünün butonun altında ve sağa doğru genişleyecek şekilde konumlanması sağlanır. Bu, klasik bir dropdown kütüphanesinin varsayılan davranışını tek bir CSS bildirimiyle karşılıyor.

```css
.menu-trigger {
  anchor-name: --dropdown-anchor;
}

.dropdown-menu {
  position: absolute;
  position-anchor: --dropdown-anchor;
  position-area: bottom span-right;
  margin-top: 4px;
  min-width: anchor-size(width);
}
```

Buradaki `anchor-size()` fonksiyonu da ayrıca faydalı: menünün genişliğini, tetikleyici butonun genişliğine eşitlemenizi sağlıyor — önceden bunun için JavaScript'te butonun `getBoundingClientRect()` değerini okuyup menüye uygulamanız gerekiyordu.

## Çoklu anchor ile karmaşık düzenler mümkün mü?

Kısa cevap: Evet — bir eleman birden fazla `anchor-name`'e sahip olabiliyor ve bir konumlandırılan eleman farklı kenarlar için farklı anchor'lara referans verebiliyor; bu, örneğin bir öğenin üst kenarını bir elemana, sol kenarını başka bir elemana hizalamanızı mümkün kılıyor. Bu düzey bir esneklik, önceden yalnızca elle yazılmış JavaScript hesaplamalarıyla mümkündü.

Bununla birlikte, çoklu anchor kullanımı Anchor Positioning Level 2'ye ait daha yeni bir özellik olduğu için tarayıcı desteği (kullanıcıların %64'ü) tekli anchor kullanımına göre daha sınırlı. Karmaşık, çok-anchor'lu bir düzen kuracaksanız, `@supports` ile daha kapsamlı bir özellik testi yazmanız gerekiyor.

## Kademeli iyileştirme (progressive enhancement) nasıl yapılır?

Kısa cevap: `@supports (anchor-name: --test)` ile özelliği destekleyen tarayıcılarda native CSS konumlandırmayı, desteklemeyenlerde ise sabit bir fallback konumu (örneğin `position: fixed; bottom: 16px;`) kullanın — kritik olmayan bir tooltip için bu, kullanıcı deneyimini bozmadan Safari 18 ve eski tarayıcılarda da makul bir görünüm sağlıyor.

```css
.tooltip {
  position: fixed;
  bottom: 16px;
  right: 16px;
}

@supports (anchor-name: --test) {
  .tooltip {
    position: absolute;
    position-anchor: --my-tooltip-anchor;
    top: anchor(bottom);
    position-try-fallbacks: flip-block;
  }
}
```

Benim önerim: kritik olmayan UI elemanlarında (tooltip, basit dropdown) bugünden Anchor Positioning'e geçin ve fallback'i basit tutun; ama karmaşık, çok yönlü konumlandırma mantığı gereken bir bileşen (örneğin bir date picker) için Firefox'un stabil desteği yaygınlaşana kadar Floating UI'ı elde tutmak daha güvenli.

Performans açısından da somut bir kazanç var: bir JavaScript kütüphanesi her scroll ve resize olayında yeniden hesaplama yaptığı için ana thread'i meşgul ediyor, native Anchor Positioning ise bu işi tarayıcının kompozitör katmanına devrediyor. Sayfada onlarca tooltip veya popover barındıran bir arayüzde bu fark, özellikle düşük güçlü cihazlarda fark edilir bir akıcılık artışı olarak ortaya çıkıyor.

Ekip içinde bu geçişi planlarken, mevcut tasarım sisteminizdeki tüm tooltip ve popover bileşenlerini tek seferde değil, en sık kullanılan birkaç bileşenden başlayarak kademeli taşımanızı öneririm. Bu, hem test yükünü dağıtıyor hem de Safari veya eski tarayıcı kullanıcılarında bir sorun çıkması durumunda etkiyi sınırlı tutuyor.

[CSS container query'leri](/tr/posts/css-container-queries-kullanimi) ile birlikte kullanıldığında, Anchor Positioning'in konumlandırdığı popover'ın kendi iç düzenini de responsive hale getirebilirsiniz — ikisi farklı problemleri çözüyor ama aynı bileşende yan yana duruyorlar.

## Sıkça Sorulan Sorular

### CSS Anchor Positioning'i şimdi kullanmaya değer mi?

Kritik olmayan UI elemanları (tooltip, basit dropdown) için evet — `@supports` ile fallback tanımlayarak bugün üretime alabilirsiniz. Temmuz 2026 itibarıyla destek %81 seviyesinde, ama Safari'nin `@position-try` desteği hâlâ eksik.

### Anchor Positioning, Floating UI'ın yerini tamamen alıyor mu?

Basit konumlandırma senaryolarında (tooltip, basit popover) evet, JavaScript kütüphanesine gerek kalmıyor. Karmaşık, çok değişkenli konumlandırma mantığı gereken bileşenlerde Firefox desteği stabilleşene kadar Floating UI daha güvenli bir seçim.

### position-area ile inset-area arasındaki fark ne?

Aynı özellik — `inset-area`, Chrome 129'dan itibaren `position-area` olarak yeniden adlandırıldı. Eski isim geriye dönük uyumluluk için Chrome 131'e kadar destekleniyor, ama yeni kodda `position-area` kullanılmalı.

### @position-try ne işe yarıyor?

Bir elemanın tercih edilen konumda viewport dışına taşacağı durumlarda otomatik olarak devreye giren alternatif bir yerleşim tanımlamanızı sağlıyor. Bu, önceden Popper.js'in "flip" middleware'inin yaptığı işi saf CSS ile karşılıyor, ama Safari'de henüz desteklenmiyor.
