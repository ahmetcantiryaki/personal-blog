---
title: "Modern CSS: :has() ve Yerel İç İçe Yazım"
slug: "modern-css-has-ic-ice-yazim"
translationKey: "modern-css-has-nesting"
locale: "tr"
excerpt: "İki CSS özelliği JavaScript'imizin ve Sass build adımımızın büyük kısmını sessizce sildi: :has() ebeveyn seçici ve yerel iç içe yazım. Neyin yerini alıyorlar?"
category: "web-development"
tags: ["css", "frontend", "web-standards", "best-practices"]
publishedAt: "2026-07-16"
seoTitle: ":has() ve Yerel CSS Nesting: Pratik Rehber"
seoDescription: "CSS :has() ve yerel iç içe yazım artık her modern tarayıcıda çalışıyor. Hangi JavaScript ve Sass kodunu silebileceğinizi üç kopyala-yapıştır örnekle görün."
---

CSS bir ebeveyn seçici gönderdi. Bu cümle olması gerekenden çok daha az gündem oldu: `:has()`, bir elemanı içinde ne olduğuna göre stillendirmenizi sağlıyor — Sass'ın bunu atlatmak için özgüllük numaraları uydurduğu günden beri CSS yazarlarının istediği şey tam olarak buydu. Yerel iç içe yazımla birleşince, class-toggling için yazdığımız JavaScript'in ve sadece seçicileri iç içe geçirmek için çalıştırdığımız Sass build adımının önemli bir kısmı artık gerekli değil.

## :has(), CSS'in hiç sahip olmadığı ebeveyn seçici

Yirmi küsur yıl boyunca CSS bir elemanı yalnızca kendi özelliklerine ya da atalarına göre seçebiliyordu — asla altındaki elemanlara göre değil. `:has()` bunu tersine çeviriyor: `.card:has(img)`, içinde bir `img` bulunan `.card` ile eşleşiyor; `label:has(input:checked)` ise checkbox'ı işaretli bir label ile eşleşiyor. 2026 itibarıyla Chrome 105+, Edge 105+, Firefox 121+, Safari 15.4+, Opera 91+ ve Samsung Internet 20+'da — yani her modern motorda — çalışıyor ve [Baseline Widely Available](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has) durumuna 19 Haziran 2026'da ulaştı; yani 2,5 yıldan eski tarayıcıları desteklemesi gerekmeyen hiçbir projede fallback'e gerek kalmadan kullanılabilir.

Sürekli karşınıza çıkan iki kalıp şöyle:

```css
/* İçinde görsel varsa kartı farklı stille */
.card:has(img) {
  grid-template-rows: auto 1fr;
}

/* Form doğrulama UI'sini tek satır JS yazmadan yönet */
.field:has(input:invalid:not(:placeholder-shown)) {
  border-color: var(--color-danger);
}

.field:has(input:invalid:not(:placeholder-shown)) .error-message {
  display: block;
}
```

İkinci kalıp eskiden bir `change` ya da `input` event listener'ının bir class'ı açıp kapatmasını gerektirirdi. Artık tek bir seçici. Bilmeniz gereken tuzak: tarayıcı motorları `:has()`'i ilgili her DOM değişikliğinde yeniden değerlendiriyor; document köküne yakın, büyük bir alt ağaca karşı kapsamı geniş tutulmuş bir `:has()` seçicisi sık güncellemelerde layout'u ölçülebilir şekilde yavaşlatabiliyor. Kapsamı dar tutun — `body:has(...)` yerine bir bileşen köküne bağlayın — o zaman maliyeti ihmal edilebilir kalıyor.

## Yerel iç içe yazım (nesting), çoğu ekibin Sass'ı elde tutma sebebini siliyor

Sass, CSS'e doğal olarak sahip olmadığı üç şeyi verdi: değişkenler, iç içe yazım ve disiplini zorlayan bir build adımı. CSS custom property'leri ilk sebebi yıllar önce ortadan kaldırdı. [Yerel CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting) — 2024'ten beri standartlaşmış ve `:has()`'in ulaştığı aynı tarayıcı setinde eşit destekle — ikinci sebebi ortadan kaldırıyor. Geriye kalan çoğunlukla build adımının kendisi ve Vite ya da PostCSS çalıştıran birçok ekip zaten Sass olmadan da autoprefixing alıyor.

```css
/* Yerel nesting — preprocessor yok, build adımı gerekmiyor */
.card {
  padding: 1rem;
  border-radius: 0.5rem;

  & > h3 {
    font-size: 1.25rem;
  }

  &:has(img) {
    grid-template-rows: auto 1fr;
  }

  @media (min-width: 640px) {
    padding: 1.5rem;
  }
}
```

Bir alt kırınım seçicisi değilse — `& > h3` ve `&:has(img)` gibi — iç içe geçmiş bir bileşik seçicinin başında `&` zorunlu; sade bir `h3 { ... }` iç içe yazıldığında ise atalık seçicisinin kısayolu olarak yine çalışıyor. Sass'tan doğrudan gelen geliştiricileri şaşırtan nokta bu; Sass'ta `&` daha çok yerde isteğe bağlıdır.

## :has() ve nesting'i container query'lerle eşleştirmek

Bunlarla birleştirmeye değer diğer 2026 dönemi CSS özelliği container query'ler; ayrıntılı olarak [pratik container queries rehberimizde](/tr/posts/css-container-queries-kullanimi) ele alındı. Üçü birlikte, tek bir class-toggling script'i olmadan bir bileşen kütüphanesinin ihtiyacının çoğunu karşılıyor:

```css
.card {
  container-type: inline-size;

  &:has(img) {
    grid-template-columns: 120px 1fr;
  }

  @container (min-width: 400px) {
    &:has(img) {
      grid-template-columns: 180px 1fr;
    }
  }
}
```

Bu, hem kendi container genişliğine hem de içinde görsel olup olmadığına göre tepki veren bir kart — sıfır JavaScript, sıfır Sass, tek bir iç içe kural.

| Özellik | Baseline durumu (2026) | Neyin yerini alıyor |
|---|---|---|
| `:has()` | Widely Available (19 Haziran 2026) | İçeriğe dayalı stilleme için class-toggling JS |
| Yerel nesting | Widely Available | Sass nesting |
| Container query | Widely Available | Sadece media-query'ye dayalı responsive bileşenler |
| CSS custom property | Widely Available (2020'den beri) | Sass değişkenleri |

## @supports ile kademeli iyileştirme

Bunların hiçbiri, eski tarayıcılarda gerçek bir kitleniz varsa fallback yolunu silebileceğiniz anlamına gelmiyor. `@supports selector(:has(a))`, özellikle `:has()`'i feature-detect etmenizi sağlar — destek tablosundaki seçici sözdizimi girdileri property sözdiziminden geride kalabiliyor, o yüzden gönderdiğiniz gerçek seçici formunu test edin:

```css
.field .error-message {
  display: none;
}

@supports selector(:has(a)) {
  .field:has(input:invalid:not(:placeholder-shown)) .error-message {
    display: block;
  }
  .field .error-message {
    display: none;
  }
}
```

Nesting için, 2023 öncesi tarayıcıları desteklemeniz gerekiyorsa en güvenli yol hâlâ iç içe CSS'inizi build zamanında düzleştiren [Lightning CSS ya da PostCSS](/tr/posts/tailwind-css-hatalari) gibi bir araçtan geçirmek — yazarken yerel ergonomiyi alırsınız, derlenmiş bir fallback da bedavaya gelir, hiçbir senaryoda runtime maliyeti olmaz.

Bunu ne zaman class-toggling'e tercih etmeli, ne zaman etmemeli? Koşul tamamen DOM yapısına ya da CSS'in zaten bildiği bir duruma (`:checked`, `:invalid`, çocuk sayısı) dayanıyorsa `:has()` her zaman tercih edilmeli — daha az kod, senkronizasyon hatası riski yok. Koşul CSS'in erişemediği bir uygulama durumuna (bir API çağrısının sonucu, bir kullanıcı izni) dayanıyorsa class-toggling hâlâ doğru araç; `:has()` bir CSS seçicisi, genel amaçlı bir state yönetim mekanizması değil.

## Bilinmeye değer üçüncü bir kalıp: boş durumları stillemek

Yaygın bir koşullu render hack'ini sessizce ortadan kaldıran bir `:has()` numarası daha var: bir container'ı, çocuklarının *yokluğuna* göre stillemek — `:not()`'u `:has()` ile birleştirerek.

```css
/* Liste container'ı sıfır öğeye sahipse stille */
.list:not(:has(li)) {
  display: grid;
  place-items: center;
  min-height: 12rem;
}

.list:not(:has(li))::after {
  content: "Henüz bir şey yok.";
  color: var(--color-muted);
}
```

Bu gerçek bir boş durum — bileşeninizde `items.length === 0 ? <EmptyState /> : <List />` dalı yok, sadece koşullu gizlemek için gönderilen fazladan markup yok. Küçük bir kalıp ama eskiden ya bir JavaScript koşulu ya da uygulamanın açıp kapatmayı hatırlaması gereken özel bir "empty" class gerektiren türden bir şey; artık sadece CSS, zaten bağlı olduğu DOM'u okuyor.

Bu çeyrek bir bileşen kütüphanesinden yaklaşık 200 satır class-toggling mantığını söktükten sonraki görüşüm şu: `:has()`, son beş yılda gelen tek en yüksek kaldıraçlı CSS özelliği — çünkü JavaScript'in zaten kapsaması gerekmeyen bir CSS yeteneği eklemek yerine doğrudan JavaScript'i siliyor. Nesting daha küçük bir kazanç — bir build adımını kurtarıyor, runtime'ı değil — ama ikisi üst üste geldiğinde 2026'da projenizin gerçekten Sass'a ihtiyacı olup olmadığını sorgulamak için güçlü bir gerekçe oluşturuyorlar.

## Sıkça Sorulan Sorular

### :has() 2026'da üretimde kullanılabilir mi?

Evet, yaklaşık 2,5 yıldan eski tarayıcıları desteklemesi gerekmeyen her proje için. 19 Haziran 2026'da Baseline Widely Available durumuna ulaştı ve her güncel büyük tarayıcı motorunda çalışıyor.

### Yerel CSS nesting, Sass'ın tamamen yerini alıyor mu?

Sass'ın nesting'inin ve CSS custom property'leriyle birlikte değişkenlerinin yerini alıyor. Sass'ın hâlâ native CSS'te karşılığı olmayan mixin, fonksiyon ve döngüleri var; bu özellikleri kullanan ekipler hâlâ bir preprocessor'a ya da build adımına ihtiyaç duyuyor.

### :has() performansı olumsuz etkileyebilir mi?

Evet, büyük ve sık değişen bir alt ağaca karşı geniş kapsamda kullanılırsa; çünkü tarayıcılar ilgili DOM değişikliklerinde `:has()` eşleşmelerini yeniden değerlendiriyor. Seçicileri sayfa geneli bir ata yerine bir bileşen köküne kapsamlandırmak maliyeti ihmal edilebilir düzeyde tutar.

### :has() ile sade bir altsoy seçicisi arasındaki fark nedir?

`.card img` gibi bir altsoy seçicisi altsoyu (görseli) seçer. `:has()` ise atayı içinde ne olduğuna göre seçer — `.card:has(img)` görseli değil, kartın kendisini seçer. Onu gerçek bir ebeveyn seçici yapan kısım da bu.
