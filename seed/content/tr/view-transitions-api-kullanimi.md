---
title: "View Transitions API: Pratik Kullanım"
slug: "view-transitions-api-kullanimi"
translationKey: "view-transitions-api-guide"
locale: "tr"
excerpt: "View Transitions API nasıl kullanılır: SPA'da startViewTransition(), MPA'da @view-transition kuralı, ortak eleman morph'u ve azaltılmış hareket desteği."
category: "web-development"
tags: ["css", "rendering", "web-standards", "frontend"]
publishedAt: "2026-07-08"
seoTitle: "View Transitions API: Pratik Kullanım Rehberi"
seoDescription: "View Transitions API nasıl kullanılır: SPA'da startViewTransition(), MPA'da @view-transition kuralı, ortak eleman morph'u ve azaltılmış hareket desteği."
---

View Transitions API'yi kullanmak için tek sayfa uygulamalarda DOM güncellemesini `document.startViewTransition(callback)` içine sarmanız, çok sayfalı sitelerde ise CSS'e `@view-transition { navigation: auto; }` eklemeniz yeterli — ikisi de eski ve yeni durumu otomatik olarak animasyonla geçirir, ayrı bir animasyon kütüphanesi gerekmez.

## Kurulum: iki giriş kapısı, tek zihinsel model

API, aynı mekanizmaya iki farklı kapıdan giriş sunar. Seçim tercihe değil mimariye bağlı.

- **Aynı doküman (SPA):** Durumu değiştiren DOM mutasyonunu `document.startViewTransition()` ile sarmalayın. Tarayıcı önce "eski" durumun anlık görüntüsünü alır, callback'inizi çalıştırır, sonra "yeni" durumun görüntüsünü alır ve varsayılan olarak ikisi arasında çapraz geçiş (crossfade) uygular.
- **Farklı doküman (MPA):** Hiç JavaScript gerekmez. Hem kaynak hem hedef sayfada bir CSS kuralıyla bu davranışa dahil olursunuz; navigasyondan navigasyona animasyonu tarayıcı kendisi yönetir.

Her iki varyant da geçici bir üst katmana (top-layer) render edilen `::view-transition-old(isim)` ve `::view-transition-new(isim)` sözde elemanları üzerinden çalışır; bunları sıradan CSS geçiş ve animasyonlarıyla biçimlendirebilirsiniz.

## SPA senaryosu: `startViewTransition()`

İnsanların takıldığı nokta zamanlama. Fonksiyona verdiğiniz callback, DOM açısından senkron olmalı — veriyi önce çekin, `startViewTransition`'a verdiğiniz callback sadece elinizdeki hazır durumu uygulasın:

```js
async function detayaGit(kartEl, item) {
  // 1. Veriyi geçiş başlamadan ÖNCE çekin, callback içinde değil
  const detay = await urunDetayiGetir(item.id);

  if (!document.startViewTransition) {
    detayGorunumunuRenderla(detay); // aşamalı geliştirme yedeği
    return;
  }

  const gecis = document.startViewTransition(() => {
    detayGorunumunuRenderla(detay); // sadece senkron DOM değişimi
  });

  gecis.ready.then(() => {
    // scroll gibi JS tabanlı ekstralar için güvenli kanca
  });
}
```

`startViewTransition()` geriye `.ready`, `.updateCallbackDone` ve `.finished` promise'leri barındıran bir `ViewTransition` nesnesi döndürür; işleri animasyonun içine değil etrafına sıralamanız gerektiğinde işinize yarar.

## Somut bir morph örneği: karttan detaya

Ortak eleman morph'u tek bir CSS özelliğinden gelir: `view-transition-name`. Kart küçük resmiyle detay sayfasındaki büyük görsele aynı ismi verin; tarayıcı aralarında çapraz geçiş yapmak yerine boyut ve konumu birbirine dönüştürür.

```css
/* Liste görünümü */
.card[data-active="true"] .card-thumb {
  view-transition-name: urun-hero;
  contain: layout; /* view-transition-name ile birlikte gerekli */
}

/* Detay görünümü */
.detail-hero {
  view-transition-name: urun-hero;
}

/* Morph'un kendisini ince ayarlayın */
::view-transition-group(urun-hero) {
  animation-duration: 320ms;
  animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
}
```

İsim, aynı anda görünür olan elemanlar arasında benzersiz olmalı; bu yüzden sabit kodlamak yerine `data-active` ile açıp kapatın. İki eleman aynı `view-transition-name`'i aynı anda taşırsa tarayıcı hata verir ve geçişi sessizce atlar.

## MPA yolu: `@view-transition` ile farklı doküman geçişleri

Sıradan çok sayfalı sitelerde tarayıcının aradaki geçişi animasyonlu yapabilmesi için hem mevcut hem sonraki dokümanın bu kuralı bildirmesi gerekir:

```css
/* Farklı doküman geçişine dahil olacak her sayfada */
@view-transition {
  navigation: auto;
}

/* Azaltılmış hareket yedeği — iki varyant için de geçerli */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

Spesifikasyonun bu kısmına HTMX 4.0 dayanıyor. [InfoWorld'ün HTMX 4.0 haberine](https://www.infoworld.com/article/4150864/htmx-4-0-hypermedia-finds-a-new-gear.html) göre bu sürüm, tarayıcının native View Transitions API'sini swap işlemlerine varsayılan olarak bağlıyor — HTMX 1.x ve 3.x'te `htmx.config.globalViewTransitions`'ı elle açmanız ya da `transition:true` eklemeniz gerekirken, bu artık gerçek bir davranış değişikliği. Şunu da belirtmek gerek: bu varsayılan ayar şimdiden sürtünme yaratmış durumda — [bildirilen bir GitHub sorunu](https://github.com/bigskysoftware/htmx/issues/3566), varsayılan geçişlerin ardışık isteklerde yaklaşık 500ms boyunca etkileşimi bloke ettiğini anlatıyor. Yani "varsayılan olarak bağlı" ifadesini bitmiş bir özellik değil, ayarlamanız gerekebilecek bir başlangıç noktası olarak görün. Bir proje için hypermedia ile istemci framework'ü arasında karar veriyorsanız [HTMX mi React mi karşılaştırmamız](/tr/posts/htmx-mi-react-mi) hangi yaklaşımın nerede kazandığını ele alıyor.

## Temmuz 2026 itibarıyla tarayıcı desteği

Destek, varyanta göre net şekilde ayrılıyor ve bu fark ürünü nasıl yayınlayacağınızı doğrudan etkiliyor.

| Varyant | Chrome / Edge | Safari | Firefox |
|---|---|---|---|
| Aynı doküman (`startViewTransition()`) | 111 ve sonrası | 18 ve sonrası | 144 ve sonrası (Ekim 2025'te Baseline) |
| Farklı doküman (`@view-transition`) | 126 ve sonrası | 18.2 ve sonrası | Henüz yok — kural yok sayılır, geçiş normal şekilde gerçekleşir |

Bu rakamlar hızla değiştiği için yayına almadan önce [MDN'in View Transition API referansına](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) ve [caniuse'un farklı doküman geçişleri tablosuna](https://caniuse.com/cross-document-view-transitions) bakın. Farklı doküman desteği spesifikasyonun daha yeni ve daha kırılgan yarısı — Firefox aynı doküman geçişlerini gönderdi ama navigasyon varyantını henüz göndermedi; bu yüzden `@view-transition`'a dayanan bir MPA orada sıradan, animasyonsuz bir navigasyona düşer. Bu düşüş bedelsizdir: bir hata durumu değil, düz bir sayfa yüklemesidir.

## Gerçekten sorun çıkaran noktalar

- **Morph sırasında layout kayması.** API, sabit bir boyutta anlık görüntü alıp onu ara değerlerle dönüştürür; "yeni" elemanın doğal boyutu "eski"den çok farklıysa (küçük bir thumbnail'in tam boy bir hero görsele genişlemesi gibi) bu dönüşüm yumuşak bir büyüme yerine ani bir sıçrama gibi görünebilir. En-boy oranlarını birbirine yakın tutun ya da biraz daha az gerçekçi bir morph'u kabul edin.
- **Z-index beklediğiniz gibi çalışmaz.** Geçiş sözde elemanları, dokümanınızın normal yığılma sırasından bağımsız, tarayıcının yönettiği bir üst katman yığılma bağlamında yaşar. İki isimli grup arasındaki üst üste binmeyi sayfa seviyesinde bir `z-index` ile düzeltemezsiniz; bunu doğrudan `::view-transition-group(isim)` üzerinde ayarlamanız gerekir.
- **Asenkron veri, anlık görüntüyle yarışır.** Veri gelmeden `startViewTransition()`'ı çağırıp veri gelince DOM'u tekrar değiştirirseniz çift geçiş ya da eski içeriğin kısa bir yanıp sönmesiyle karşılaşırsınız. Önce fetch işlemini bitirin, callback'i sadece senkron tutun.
- **Etiketlenmemiş her değişiklik de geçiş yapar.** Tek bir `view-transition-name` bile kullanmasanız, `startViewTransition()` içindeyken tüm doküman kökü varsayılan olarak çapraz geçiş uygular. Arayüzün bir kısmı animasyonlu olmamalıysa bunu açıkça belirtmeniz gerekir — ya mutasyonu callback dışına taşıyın ya da gerekli yerde `view-transition-name: none` verin.

## Aşamalı geliştirme

Burada hiçbir şey ayrı bir yedek kütüphane gerektirmiyor: `document.startViewTransition` desteklemeyen bir tarayıcı DOM güncellemenizi doğrudan çalıştırır, `@view-transition` desteklemeyen bir MPA sayfası ise sıradan şekilde yüklenir. SPA tarafı için özellik tespiti yapın, iki varyant için de `prefers-reduced-motion`'a saygı gösterin; hepsi bu kadar:

```js
if (document.startViewTransition) {
  document.startViewTransition(() => domGuncelle());
} else {
  domGuncelle();
}
```

Bunu yukarıdaki `prefers-reduced-motion` bloğuyla birlikte kullanınca elinizde eksiksiz, kopyala-yapıştır'a hazır bir temel kalıyor: JS'te özellik tespiti, hareketsiz CSS geçersiz kılma ve farklı doküman navigasyonu için bir at-rule. Tarayıcı desteklemese bile hiçbiri altta yatan işlevi bloke etmez — en kötü ihtimalle kullanıcı, bu API hiç olmasaydı zaten alacağı animasyonsuz anlık geçişi görür.

Bu tür gözle görülür, algılanan performans cilası [Core Web Vitals kontrol listemizdeki](/tr/posts/core-web-vitals-kontrol-listesi) metriklerle iyi eşleşiyor — bir view transition tek başına CLS veya INP rakamlarınızı değiştirmez ama kötü boyutlandırılmış bir tanesi CLS'i bozabilir; aynı titizlikle test edin. Bu yazıda örnek olarak kullanılan ortak eleman kartlarını kuruyorsanız [CSS container queries rehberimiz](/tr/posts/css-container-queries-kullanimi) doğal bir tamamlayıcı, çünkü bu morph'lar tam olarak responsive kart düzenlerinde kullanılır. Bir sayfanın en başta nasıl render edileceğine karar veriyorsanız [SSR, SSG ve ISR rehberimiz](/tr/posts/ssr-ssg-isr-farki) bu konunun eşlikçisi — farklı doküman geçişleri, sayfayı hangi render modu sunmuş olursa olsun çalışır. Bu alandaki diğer yazılar için [Web Geliştirme](/tr/category/web-gelistirme) kategorisine göz atabilirsiniz.

## Sıkça Sorulan Sorular

### View Transitions API, JavaScript olmadan çalışır mı?

Farklı doküman (MPA) navigasyonları için evet. `@view-transition { navigation: auto; }` kuralı saf CSS'tir — navigasyona dahil iki sayfada da tanımlayın, tarayıcı geçişi hiç script olmadan animasyonlar. JavaScript sadece aynı doküman `startViewTransition()` senaryosunda gerekir.

### React, Vue ya da başka bir SPA framework'üyle kullanabilir miyim?

Evet. Framework'ünüzün durum güncellemesini tetikleyen ne varsa (route değişimi, liste yeniden render'ı) `document.startViewTransition()` ile sarın; tek şart callback'in sardığı DOM mutasyonunun senkron olması. Bazı router'lar (Next.js'in App Router'ı, Astro'nun client router'ı) bunun etrafında zaten ince bir sarmalayıcı sunuyor; kendiniz yazmadan önce kullandığınız aracın olup olmadığını kontrol edin.

### Ortak eleman morph'um neden animasyonlanmıyor?

En sık neden `view-transition-name` çakışması: aynı isme sahip iki elemanın DOM'da aynı anda görünür olması, bu da geçişi sessizce devre dışı bırakır. İkinci neden zamanlama — tarayıcı anlık görüntüyü alırken "yeni" eleman henüz DOM'da değilse, geçiş bir morph yerine çapraz geçiş yedeğini yakalar. Ayrıntı için `document.startViewTransition`'ın `ready` promise'inin reddedilip reddedilmediğine bakın.

### Bu, CSS transition ve animasyonların yerini alıyor mu?

Hayır, onları tamamlıyor. View Transitions API neyin animasyonlanacağına karar verir — DOM değişimi ya da navigasyon boyunca eski durumdan yeni duruma — sıradan CSS transition'lar ve `::view-transition-*` sözde elemanları üzerindeki `@keyframes` ise bunun nasıl olacağına karar verir. Süre, easing ve koreografiyi hâlâ normal CSS ile kontrol edersiniz.
