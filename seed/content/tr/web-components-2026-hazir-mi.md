---
title: "Web Components 2026'da Hazır mı?"
slug: "web-components-2026-hazir-mi"
translationKey: "web-components-2026"
locale: "tr"
excerpt: "Web Components ile 2026'da gerçek ürün mü çıkarırsınız yoksa demo mu kalır? Shadow DOM, declarative SSR ve React/Vue entegrasyonunu dürüstçe inceliyoruz."
category: "web-development"
tags: ["frontend", "web-standards", "react", "css"]
publishedAt: "2026-07-08"
seoTitle: "Web Components 2026'da Hazır mı? Dürüst Bakış"
seoDescription: "Web Components ile 2026'da gerçek ürün mü çıkarırsınız yoksa demo mu kalır? Shadow DOM, declarative SSR ve React/Vue entegrasyonunu dürüstçe inceliyoruz."
---

Kısa cevap: evet, ama her yerde değil. Temmuz 2026 itibarıyla native custom element'ler, Shadow DOM ve declarative shadow DOM ile artık gerçek ürünlerde çalışan bileşenler yazabilirsiniz; özellikle birden fazla framework'ün paylaştığı bir tasarım sistemi kuruyorsanız. Ama uygulama genelinde durum yönetimi ve derin iki yönlü veri bağlama söz konusu olunca hâlâ React ya da Vue'nun gerisindeler.

Bu yazı, "Web Components ile gerçek bir ürün çıkarabilir miyim?" sorusuna framework'süz bir satış konuşması yapmadan cevap arıyor. Temelleri, SSR açığının ne kadar kapandığını, React/Vue ile yaşarken nerede sürtündüğünüzü ve tasarım sistemi olarak nerede gerçekten kazandıklarını sırayla ele alıyoruz.

## Temel yapı taşları: custom element'ler, Shadow DOM ve slotlar

Bir Web Component üç parçadan oluşur. **Custom element'ler**, `customElements.define('urun-karti', UrunKarti)` gibi bir çağrıyla tarayıcıya yeni bir HTML etiketi tanıtır; bu etiket artık `<urun-karti>` olarak herhangi bir sayfada kullanılabilir. **Shadow DOM**, bu elementin iç DOM'unu ve stillerini sayfanın geri kalanından izole eder; kart içindeki `.baslik` sınıfı, sayfanın başka yerindeki aynı isimli sınıfla çakışmaz. **Slot'lar** ise dışarıdan içerik enjekte etmenizi sağlar: `<urun-karti><span slot="fiyat">299 TL</span></urun-karti>` yazdığınızda, bileşenin şablonundaki `<slot name="fiyat">` o içeriği yerine koyar.

Bu üçü birlikte, framework'e bağımlı olmayan, gerçekten kapsüllenmiş bir bileşen üretir. [MDN'in Web Components dokümantasyonu](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) bu API'lerin tamamını kapsıyor ve hâlâ en güvenilir referans.

```js
class UrunKarti extends HTMLElement {
  static formAssociated = false;

  connectedCallback() {
    const sarma = this.attachShadow({ mode: 'open' });
    sarma.innerHTML = `
      <style>
        .kart { border: 1px solid #ddd; padding: 1rem; border-radius: 8px; }
      </style>
      <div class="kart">
        <slot name="baslik"></slot>
        <slot name="fiyat"></slot>
      </div>
    `;
  }
}

customElements.define('urun-karti', UrunKarti);
```

## SSR açığı kapandı mı? Declarative Shadow DOM

Web Components'in en büyük tarihsel zayıflığı sunucu tarafı render'dı: Shadow DOM eskiden yalnızca JavaScript çalıştıktan sonra tarayıcıda kurulabiliyordu, yani ilk HTML boş bir kabuk gibi geliyordu. **Declarative Shadow DOM**, `<template shadowrootmode="open">` etiketiyle bu sorunu çözüyor: shadow root'u doğrudan HTML içine gömüyorsunuz, tarayıcı sayfayı ayrıştırırken hiç JavaScript beklemeden shadow ağacını kuruyor.

```html
<urun-karti>
  <template shadowrootmode="open">
    <style>.kart { border: 1px solid #ddd; padding: 1rem; }</style>
    <div class="kart"><slot name="fiyat"></slot></div>
  </template>
  <span slot="fiyat">299 TL</span>
</urun-karti>
```

Bu özellik artık Chrome, Firefox, Safari ve Edge'de yerleşik olarak destekleniyor ve [web.dev'in declarative shadow DOM yazısı](https://web.dev/articles/declarative-shadow-dom) bunu Core Web Vitals açısından da bir kazanım olarak tanımlıyor: içerik, hiçbir istemci JavaScript'i beklemeden ilk boyamada görünür oluyor. Bu, gerçek bir kapanış; ama tek başına yeterli değil. Astro veya Eleventy gibi statik/adalar mimarisine sahip araçlarla doğal olarak iyi çalışıyor, Next.js gibi tamamen React ağacına gömülü bir SSR hattında ise ekstra köprü kodu gerektiriyor.

## React ve Vue ile birlikte yaşamak: sürtünme noktaları

Web Components'i bir React ya da Vue projesine sokmak göründüğü kadar kolay değil. Üç nokta gerçekten sürtünüyor.

### Karmaşık prop'lar ve nesneler

HTML özellikleri (attribute) string'dir. Bir custom element'e dizi ya da nesne geçirmek istediğinizde, React'in `<urun-karti data={obj}>` yazımı işe yaramaz; DOM özelliği olarak değil string attribute olarak serileştirilir. Çözüm, DOM property'sini doğrudan atamak (`ref.current.data = obj`) ya da `lit`'in reaktif property sistemine güvenmektir. Bu, React'in bildirimsel JSX modeliyle sürtünüyor ve genelde bir sarmalayıcı bileşen yazmanızı gerektiriyor.

### Custom event'ler ve sentetik event sistemi

Custom element'ler durumu `CustomEvent` ile dışa bildirir, React ise kendi sentetik event sistemini kullanır ve `onChange` gibi prop'ları otomatik olarak yalnızca bilinen DOM event'lerine bağlar. React 19 öncesinde `addEventListener` ile manuel dinleme gerekiyordu; React 19'un custom element desteği bu köprüyü biraz iyileştirdi, ama Vue ve Svelte'de de benzer küçük adaptasyonlar gerekiyor. Framework seçimi tartışmasında event modeli farkları önemli bir kriter; bu konuyu [HTMX mi React mi karşılaştırmamızda](/tr/posts/htmx-mi-react-mi) daha geniş ele aldık.

### Form katılımı: ElementInternals

Native `<input>` bir formun parçasıdır, ama custom element'ler varsayılan olarak değildir. **ElementInternals** ve `attachInternals()` API'si bunu çözer: `static formAssociated = true` işaretiyle bir elementi form-ilişkili yapar, `internals.setFormValue(deger)` ile forma değer bildirir. [WebKit'in ElementInternals yazısı](https://webkit.org/blog/13711/elementinternals-and-form-associated-custom-elements/) bu API'nin doğrulama ve erişilebilirlik durumlarını da kapsadığını gösteriyor. Yine de bu, sıfırdan yazılması gereken ek bir katman; React Hook Form gibi kütüphanelerle entegrasyon hâlâ elle bağlanıyor.

## Tasarım sistemi olarak yeniden kullanım: bir kez yaz, her yerde tüket

Web Components'in en net kazandığı yer burası. Bir buton ya da kart bileşenini native custom element olarak yazarsanız; React, Vue, Svelte ve düz HTML sayfalarından aynı bileşeni tüketebilirsiniz, çünkü hedef bir framework API'si değil tarayıcının kendisi. Şirket içinde beş farklı ekip beş farklı framework kullanıyorsa, tasarım sistemi kütüphanesini Web Components olarak dağıtmak "React'i güncelle, Vue'yu unutma" senkronizasyon derdini ortadan kaldırır. Durum yönetimini bileşen dışına, hafif imzalarla (attribute + event) tutan takımlar için bu gerçek bir kazanç. Aynı mantık, kullanıcıya görsel geçişler sunan [View Transitions API kullanımı](/tr/posts/view-transitions-api-kullanimi) gibi native API'lerle de örtüşüyor: framework'ten bağımsız, tarayıcıya gömülü yetenekler.

| Boyut | Web Components | React bileşenleri |
|---|---|---|
| SSR desteği | Declarative Shadow DOM ile native | Framework'e bağlı (Next.js, RSC vb.) |
| Bundle boyutu | Küçük, framework runtime'ı yok | React + ReactDOM runtime'ı gerekli |
| Framework interop | Her yerde çalışır (React/Vue/Svelte/düz HTML) | Yalnızca React ağacında native |
| Durum yönetimi | Yerel, sınırlı; global state için ek kütüphane gerekir | Context, Redux, Zustand gibi olgun ekosistem |
| Form katılımı | ElementInternals ile mümkün, elle kurulur | Native, kütüphanelerle sorunsuz |
| En iyi kullanım | Paylaşılan tasarım sistemi, gömülü widget'lar | Uygulama düzeyinde karmaşık mantık |

## Nerede kazanıyorlar, nerede hâlâ acıtıyor

Web Components şu durumlarda net bir tercih: birden fazla framework/ekip arasında paylaşılan tasarım sistemleri, üçüncü taraf sitelere gömülecek widget'lar (canlı destek kutusu, ödeme formu, banner) ve framework döngülerinden bağımsız uzun ömürlü olması gereken arayüzler. Bir bileşeni beş yıl sonra da çalışır tutmak istiyorsanız, native tarayıcı API'sine yazmak, üç yıl sonra "major sürüm" kırılımı yaşayan bir framework'e yazmaktan daha güvenli.

Buna karşılık, uygulama düzeyinde karmaşık durum yönetimi, derin iki yönlü veri bağlama ve zaten tek bir framework ekosistemine tam bağlanmış ekipler için Web Components ekstra yük anlamına geliyor. [React state yönetimi karşılaştırmamızda](/tr/posts/react-state-yonetimi-karsilastirma) ele aldığımız Context, Redux ya da Zustand gibi olgun çözümlerin sunduğu geliştirici deneyimini custom element'lerle sıfırdan kurmak zaman kaybı olur. Reaktif durum tarafında sinyal tabanlı yaklaşımlar ilginç bir köprü kuruyor; bu konuyu [Frontend Signals Nedir](/tr/posts/frontend-signals-nedir) yazımızda ayrıca inceledik.

Açıkçası söylemem gereken şey şu: Web Components, bir tasarım sisteminin *içindeki* uygulama detayı olarak kazanıyor, kendi başına bir uygulama kurma paradigması olarak değil.

Daha fazla frontend rehberi için [Web Geliştirme kategorisine](/tr/category/web-gelistirme) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Web Components 2026'da React'in yerini alabilir mi?

Hayır, ve bu amaçla tasarlanmadılar. Web Components bileşen kapsüllemesi için bir standart sunar; React ise uygulama düzeyinde durum yönetimi, yönlendirme ve render optimizasyonu için bir ekosistem sunar. İkisi rakip değil, farklı katmanlarda çalışıyor; birçok ekip ikisini bir arada kullanıyor.

### Declarative Shadow DOM tüm tarayıcılarda çalışıyor mu?

Temmuz 2026 itibarıyla evet, Chrome, Edge, Firefox ve Safari'nin güncel sürümlerinde native destekleniyor. Eski tarayıcı desteği gerekiyorsa bir polyfill katmanı eklemeniz gerekebilir, ama modern tarayıcı hedefleyen projeler için ek bir kütüphaneye ihtiyaç yok.

### Custom element'lere karmaşık veri nasıl geçilir?

Attribute'lar yalnızca string taşıdığı için nesne veya dizi geçmek istediğinizde DOM property'sini doğrudan atamanız gerekir (`element.data = {...}`), attribute yazımı değil. React'te bu genelde bir `ref` üzerinden yapılır; Lit gibi kütüphaneler bunu reaktif property tanımlarıyla otomatikleştirir.

### ElementInternals olmadan form içinde custom element kullanabilir miyim?

Kullanabilirsiniz ama form otomatik olarak değerini toplamaz; gizli bir `<input>` ile senkronize etmeniz gerekir. `attachInternals()` ve `formAssociated = true` ile bu senkronizasyonu tarayıcıya devredebilir, doğrulama ve erişilebilirlik durumlarını da native olarak yönetebilirsiniz.
