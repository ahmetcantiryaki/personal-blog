---
title: "CSS Scroll-Driven Animasyonlar: Pratik Rehber"
slug: "css-scroll-driven-animasyonlar"
translationKey: "css-scroll-driven-animations-2026"
locale: "tr"
excerpt: "CSS scroll-driven animasyonlar, animation-timeline ile kaydırma animasyonlarını JavaScript olmadan çalıştırır. 2026'da tüm büyük tarayıcılarda destekleniyor."
category: "web-development"
tags: ["css", "web-performance", "frontend", "responsive-design"]
publishedAt: "2026-09-08"
seoTitle: "CSS Scroll-Driven Animasyonlar: Pratik Rehber"
seoDescription: "CSS scroll-driven animasyonlar, animation-timeline ile kaydırma animasyonlarını JavaScript olmadan çalıştırır. 2026'da tüm büyük tarayıcılarda destekleniyor."
---

Kısa cevap: `animation-timeline` özelliğine `scroll()` veya `view()` değeri vererek, bir animasyonun ilerlemesini scroll pozisyonuna veya bir öğenin görünürlüğüne bağlayabilirsiniz — hiç JavaScript scroll event listener'ı yazmadan. 2026 itibarıyla Chrome, Edge, Firefox ve Safari'nin güncel sürümleri bunu destekliyor.

## CSS scroll-driven animasyon nedir, JavaScript'e neden gerek kalmıyor?

Scroll-driven animasyon, bir CSS `@keyframes` animasyonunun zaman eksenini (timeline) sabit bir süre yerine scroll pozisyonuna bağlayan bir mekanizmadır. Normalde `animation-duration: 3s` yazdığınızda animasyon 3 saniyede oynar; `animation-timeline: scroll()` yazdığınızda ise `animation-duration` tamamen yok sayılır — animasyonun neresinde olduğunuzu artık zaman değil, kaydırma pozisyonu belirler.

Bunun pratik sonucu şu: `scroll` event'ine listener bağlayıp her karede `requestAnimationFrame` içinde stil hesaplayan JavaScript koduna ihtiyacınız kalmıyor. Tarayıcı bu işi compositor thread'inde yapıyor, yani ana iş parçacığı (main thread) hiç meşgul olmuyor — sayfa kaydırılırken JavaScript'iniz başka işler yapsa bile animasyon takılmıyor.

Bu fark, düşük performanslı cihazlarda özellikle belirgin. JavaScript tabanlı bir scroll listener, her scroll event'inde layout okuma ve stil yazma arasında geçiş yaparak "layout thrashing" riskine giriyor; tarayıcı her karede yeniden hesaplama yapmak zorunda kalıyor. Native `animation-timeline` ise bu hesaplamayı tarayıcının kendi render pipeline'ına devrediyor, bu yüzden düşük donanımlı telefonlarda bile animasyon akıcı kalıyor.

## scroll() ve view() arasındaki fark ne?

`scroll()` timeline'ı, bir scroll container'ın (genelde `<body>` veya `overflow: scroll` olan bir div) toplam kaydırma mesafesini 0-100 arası bir ilerlemeye çevirir; okuma ilerleme çubuğu veya arka plan paralaks efekti gibi "sayfa ne kadar kaydırıldı" sorularına cevap verir. `view()` timeline'ı ise farklı bir soruya cevap verir: "bu öğe viewport'ta ne kadar görünür durumda?" Bir öğe ekrana girdiğinde animasyon başlar, tam görünür olduğunda tamamlanır, ekrandan çıkarken tersine döner.

| Timeline türü | Neye bağlı | Tipik kullanım |
|---|---|---|
| `scroll()` | Container'ın toplam scroll mesafesi | Okuma ilerleme çubuğu, paralaks arka plan |
| `view()` | Öğenin viewport içindeki görünürlüğü | Scroll'da beliren kartlar, sayfa içi reveal efektleri |

## Okuma ilerleme çubuğu nasıl yapılır?

`scroll()` timeline'ının en yaygın kullanımı, bir makalenin ne kadarının okunduğunu gösteren üst çubuktur:

```css
@keyframes ilerleme {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.okuma-cubugu {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  width: 100%;
  transform-origin: left;
  background: var(--primary);
  animation: ilerleme linear;
  animation-timeline: scroll(root block);
}
```

`scroll(root block)` ifadesi, `<html>` elementinin dikey (block) kaydırmasını timeline olarak kullanır. `animation-duration` yazmadığımıza dikkat edin — zaten yok sayılacağı için gereksiz.

## Scroll'da beliren öğeler nasıl yapılır?

Kartların veya bölümlerin ekrana girerken belirmesi için `view()` timeline'ını kullanırsınız:

```css
@keyframes belir {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.kart {
  animation: belir linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
```

`animation-range: entry 0% cover 40%` ifadesi, animasyonun öğe viewport'a girmeye başladığı anda (entry 0%) başlayıp, öğe %40 oranında görünür hale geldiğinde tamamlanacağını belirtir. Bu aralığı değiştirerek efektin ne kadar "erken" veya "geç" tetikleneceğini ince ayarlayabilirsiniz.

Bir sayfada onlarca kartı aynı anda `view()` timeline'ına bağlarsanız, her kartın kendi görünürlük durumuna göre bağımsız çalıştığını unutmayın — bu, tek bir global scroll değişkeni izlemek yerine, tarayıcının her öğe için ayrı ayrı hesap yapmasını gerektirir. Pratikte bu performans sorunu yaratmaz çünkü hesaplama compositor thread'inde yapılıyor, ama çok sayıda öğede farklı `animation-range` değerleri kullanmak, tasarımda tutarlılığı korumak için dikkat gerektirir.

## Paralaks arka plan nasıl yapılır?

Paralaks efekti, arka plan görselinin ön plandaki içerikten daha yavaş kaymasıyla oluşan derinlik hissi verir. `scroll()` timeline'ı ile bunu tek satır JavaScript yazmadan yapabilirsiniz:

```css
@keyframes paralaks-kaydir {
  from { transform: translateY(0); }
  to { transform: translateY(-15%); }
}

.hero-arka-plan {
  animation: paralaks-kaydir linear;
  animation-timeline: scroll(nearest block);
  animation-range: cover 0% cover 100%;
}
```

`scroll(nearest block)` ifadesi, en yakın kaydırılabilir üst container'ı timeline olarak kullanır — bu genelde `<body>` olur ama iç içe scroll container'lı bir sayfada bunu değiştirebilirsiniz.

Birden fazla bileşen ağacında aynı isimli bir scroll timeline'ı paylaşmak isterseniz `timeline-scope` özelliği, timeline'ın tanımlandığı elementin dışındaki öğelerin de ona referans verebilmesini sağlar — örneğin bir üst container'daki scroll ilerlemesine, DOM'da tamamen farklı bir dalda bulunan bir öğenin animasyonunu bağlayabilirsiniz:

```css
.container {
  timeline-scope: --ana-scroll;
  scroll-timeline: --ana-scroll block;
}

/* DOM'da .container'ın dışında, farklı bir dalda olan bir öğe */
.uzak-ogeler {
  animation: belir linear;
  animation-timeline: --ana-scroll;
}
```

Bu, özellikle bir header'daki bir göstergeyi, sayfanın çok aşağısındaki bir bölümün scroll ilerlemesine bağlamak istediğinizde işe yarıyor.

## Tarayıcı desteği yeterli mi?

2026 ortası itibarıyla Chrome 115+, Edge 115+, Firefox 132+ ve Safari 18+ scroll-driven animasyonları destekliyor; küresel tarayıcı desteği %84'ün üzerinde, bazı ölçümlerde %90'ı geçiyor. Yine de eski tarayıcı desteği gereken projelerde `@supports` sorgusuyla aşamalı geliştirme (progressive enhancement) uygulamak gerekiyor:

```css
.kart {
  opacity: 1; /* varsayılan: her zaman görünür */
}

@supports (animation-timeline: scroll()) {
  .kart {
    animation: belir linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 40%;
  }
}
```

Bu yaklaşım sayesinde desteklemeyen bir tarayıcıda öğe her zaman görünür kalır — animasyon eksikliği bir hataya değil, sadece daha sade bir deneyime dönüşür.

Kurumsal projelerde eski Safari sürümleri veya kurumsal Chrome dağıtımları hâlâ görülebiliyor; bu yüzden `@supports` kontrolünü atlamak, "bende çalışıyor" tuzağına düşmenin en yaygın yollarından biri. Geliştirme ortamınızda güncel bir tarayıcı kullanıyor olmanız, kullanıcılarınızın da öyle olduğu anlamına gelmiyor.

Analytics verinizde önemli bir kurumsal müşteri segmenti varsa (ör. Windows üzerinde eski bir Edge sürümü kullanan bir B2B müşteri kitlesi), bu segmentin tarayıcı dağılımını ayrıca kontrol etmek, sadece küresel ortalamaya güvenmekten daha güvenli bir karar verdirir. Bir SaaS ürününde kurumsal müşterilerin tarayıcı güncelleme hızı, tüketici tarafındaki kullanıcılardan genellikle daha yavaştır — bu yüzden `@supports` sorgusunu "gereksiz bir ekstra adım" değil, gerçek kullanıcı tabanınızı koruyan bir güvenlik ağı olarak görmek daha doğru bir çerçeve.

## prefers-reduced-motion'a nasıl saygı gösterilir?

Kaydırmaya bağlı animasyonlar, hareket hassasiyeti olan kullanıcılar için özellikle rahatsız edici olabilir çünkü kullanıcı animasyonu durduramaz — her scroll hareketi animasyonu tetikler. `prefers-reduced-motion: reduce` medya sorgusuyla bu animasyonları tamamen kapatmak veya sadece opaklık gibi daha yumuşak bir geçişe indirmek gerekir:

```css
@media (prefers-reduced-motion: reduce) {
  .kart {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

Bu, scroll-driven animasyonlarda opsiyonel bir iyileştirme değil, erişilebilirlik açısından pratikte zorunlu bir adımdır. Bir tasarım sistemi kuruyorsanız bu medya sorgusunu her animasyonlu bileşende tekrar yazmak yerine, ortak bir CSS sınıfı veya mixin olarak tanımlayıp tüm scroll-driven animasyonlarınıza uygulamak, hem tutarlılığı hem de bakım kolaylığını artırır, çünkü kuralı tek bir yerden değiştirip tüm bileşenlere yayabilirsiniz.

Container query'lerle birlikte responsive tasarım yapıyorsanız [CSS container query kullanımı yazımıza](/tr/posts/css-container-queries-kullanimi) bakabilirsiniz. `:has()` seçicisi ve iç içe CSS yazımı hakkında [modern CSS yazımıza](/tr/posts/modern-css-has-ic-ice-yazim) göz atabilirsiniz. JavaScript olmadan konumlandırılmış popover'lar için [CSS anchor positioning rehberimiz](/tr/posts/css-anchor-positioning-jssiz-popover) faydalı olacaktır. Sayfa performansını genel olarak iyileştirmek isteyenler [görsel optimizasyonu yazımıza](/tr/posts/web-gorsel-optimizasyonu) bakabilir. Daha fazla web geliştirme içeriği için [web geliştirme kategorimizi](/tr/category/web-gelistirme) inceleyebilirsiniz.

Spesifikasyon detayları ve tam sözdizimi için [MDN'nin scroll-driven animasyonlar rehberini](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations) kaynak olarak kullanabilirsiniz.

## Sıkça Sorulan Sorular

### animation-duration neden scroll-driven animasyonlarda işe yaramıyor?

`animation-timeline` bir `scroll()` veya `view()` değeri aldığında, animasyonun ilerlemesini artık zaman değil scroll pozisyonu belirliyor. `animation-duration` tanımlasanız bile tarayıcı bunu yok sayıyor; bu yüzden bu özelliği yazmak gereksiz, `auto` bırakmak yeterli.

### scroll() ve view() aynı öğede birlikte kullanılabilir mi?

Hayır, bir `animation-timeline` özelliği tek bir timeline türüne bağlanır. Aynı öğede hem scroll pozisyonuna hem görünürlüğe tepki veren bir efekt istiyorsanız, iki ayrı animasyon tanımlayıp her birine farklı bir `animation-timeline` değeri atamanız gerekir.

### Bu animasyonlar GSAP veya Framer Motion'ın yerini tamamen alır mı?

Basit scroll-tetiklemeli efektler (fade-in, ilerleme çubuğu, paralaks) için evet, native CSS yeterli ve daha performanslı. Ama karmaşık sekans zamanlama, fizik tabanlı yaylanma (spring) veya scroll dışı tetikleyicilerle senkronize animasyonlar için JavaScript tabanlı kütüphaneler hâlâ daha esnek kontrol sunuyor. Çoğu üretim projesi için pratik yaklaşım, iki yaklaşımı bir arada kullanmak: basit efektleri CSS'e, karmaşık olanları JavaScript'e bırakmak ve ikisi arasındaki sınırı projenin ihtiyacına göre çizmek.

### Eski tarayıcı desteği gerekiyorsa ne yapmalıyım?

`@supports (animation-timeline: scroll())` sorgusuyla aşamalı geliştirme uygulayın: desteklemeyen tarayıcılarda öğeler varsayılan olarak görünür kalsın, destekleyen tarayıcılarda animasyon eklensin. Bu, kritik içeriğin hiçbir tarayıcıda görünmez kalmamasını garantiler.
