---
title: "Mobilde 100vh Neden Taşar? dvh ve svh ile Çözüm"
slug: "mobil-viewport-dvh-svh-guvenli-alan"
translationKey: "fix-mobile-viewport-dvh-svh-safe-areas"
locale: "tr"
excerpt: "Kısa cevap: 100vh, mobil tarayıcı arayüzü gizlenip göründüğünde sabit kalır ve taşmaya yol açar; dvh birimi tarayıcı çubuğuna göre otomatik güncellenir."
category: "web-development"
tags: ["css", "responsive-design", "frontend", "web-standards"]
publishedAt: "2026-11-09"
seoTitle: "Mobilde 100vh Neden Taşar? dvh ve svh ile Çözüm"
seoDescription: "Kısa cevap: 100vh, mobil tarayıcı arayüzü gizlenip göründüğünde sabit kalır ve taşmaya yol açar; dvh birimi tarayıcı çubuğuna göre otomatik güncellenir."
---

Kısa cevap: `100vh`, sayfa yüklendiği andaki viewport yüksekliğini sabitler; mobilde adres çubuğu gizlenip göründüğünde gerçek görünür alan değişir ama `vh` değişmez, bu da taşmaya yol açar. `dvh` bu değişimi anlık takip eder, `svh` ise arayüz tam açıkken kalan en küçük alanı verir. Kasım 2026 itibarıyla dvh/svh/lvh, Chrome 108, Firefox 101 ve Safari 15.4'ten beri destekleniyor.

## 100vh mobilde neden bozuluyor?

Mobil tarayıcılar adres çubuğunu ve araç çubuğunu sayfa kaydırıldığında gizler, yukarı kaydırınca geri gösterir. `100vh`, sayfa ilk yüklendiğindeki (çubuklar görünürken) viewport yüksekliğini temel alır ve bu değer sabit kalır; çubuklar gizlendiğinde gerçek görünür alan büyür ama `vh` birimi büyümez. Sonuç: tam ekran bir kahraman bölüm ya alt tarafta boşluk bırakır ya da çubuklar tekrar göründüğünde içerik kesilir.

## Yeni viewport birimleri ne fark yapıyor?

Üç yeni birim farklı senaryolara hizmet ediyor; hangisini seçeceğiniz, tarayıcı arayüzünün açılıp kapanmasına tepki vermesini isteyip istemediğinize bağlı.

| Birim | Ne ölçer | Tipik kullanım |
|---|---|---|
| `svh` | Tarayıcı arayüzü tam açıkken kalan en küçük alan | Üstte sabit bir CTA'nın her zaman görünmesi gereken düzen |
| `lvh` | Tarayıcı arayüzü tam gizliyken en büyük alan | Arka plan görseli veya video, taşma önemli değilse |
| `dvh` | Anlık gerçek görünür alan, kaydırmaya göre güncellenir | Tam ekran kahraman bölüm, bottom sheet |

## dvh her zaman doğru seçim mi?

Hayır. `dvh`, tarayıcı arayüzü her açılıp kapandığında elemanın yeniden boyutlanmasına yol açar; bu, bir bottom sheet veya hero görsel için beklenen davranış ama kaydırma sırasında sürekli yeniden boyutlanan bir buton grubu için rahatsız edici bir "zıplama" hissi yaratabilir. Sabit yükseklik isteyen, kaydırmadan bağımsız kalması gereken bir öğe için `svh` daha öngörülebilir bir seçim.

## Güvenli alan (safe area) ne zaman gerekir?

`env(safe-area-inset-*)`, çentikli ekranlar ve ana ekran göstergesi olan iPhone'larda içeriğin bu alanların altında kalmasını önler. Sabit konumlu bir alt gezinme çubuğu veya tam ekran bir modal, bu değerleri dolgu olarak eklemezse ana ekran göstergesinin arkasında yarı gizlenebilir.

```css
.tam-ekran-hero {
  height: 100dvh;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.alt-gezinme {
  position: fixed;
  bottom: 0;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
}
```

## Sanal klavye açıldığında ne oluyor?

Burada gerçek bir boşluk var: `dvh`, `svh` ve `lvh` hiçbiri sanal klavye açıldığında otomatik güncellenmez — bu birimler tarayıcı arayüzü (adres çubuğu, araç çubuğu) değişikliğini takip eder, klavyeyi değil. iOS'ta tek bir motor (WebKit) olduğu için davranış Safari, Chrome ve diğer tüm iOS tarayıcılarında aynı; Android'de ise tarayıcıya göre klavye davranışı değişebilir. Klavyeyi programatik olarak hesaba katmak isteyen ekipler için Chrome'da `VirtualKeyboard` API'si var, ama Firefox ve Safari'de henüz desteklenmiyor; bu yüzden bugün için en güvenilir çözüm, klavye açıldığında inputun görünür kalmasını `scrollIntoView` gibi JavaScript yöntemleriyle garanti etmek.

## interactive-widget meta etiketi neye yarıyor?

Android Chrome'da `<meta name="viewport" content="interactive-widget=resizes-content">` etiketi, sanal klavye açıldığında viewport'un gerçekten küçülmesini (resize) sağlar; varsayılan davranış olan `overlays-content` ise klavyeyi içerik üzerine bindirir ve viewport boyutu değişmez. Bu ayrım özellikle alt kısımda sabit bir "gönder" butonu olan bir mesajlaşma ekranında fark yaratıyor: `resizes-content` ile buton klavyenin üzerinde kalır, `overlays-content` ile buton klavyenin altında gizlenebilir. Bu meta etiket şu an sadece Chromium tabanlı Android tarayıcılarda çalışıyor; Safari'de karşılığı yok, bu yüzden iOS için hâlâ JavaScript tabanlı bir çözüm gerekiyor.

## Tam ekran bir bottom sheet örneğinde dvh nasıl kullanılır?

Bir bottom sheet (alttan açılan panel), açıldığında ekranın büyük kısmını kaplamalı ama adres çubuğu her göründüğünde zıplamamalı. Pratikte `max-height` ile `dvh`'ı birlikte kullanmak, panel hem viewport'u doldursun hem de içerik azsa gereksiz yere uzamasın diye işe yarıyor:

```css
.alt-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 90dvh;
  overflow-y: auto;
  border-radius: 16px 16px 0 0;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
}
```

Burada `90dvh` kullanmak, panelin viewport'un tamamını kaplayıp arkadaki sayfayı tamamen gizlememesini, kullanıcının panelin açık olduğunu hâlâ arka planda hissetmesini sağlıyor. `100dvh` yerine `90dvh` tercih etmek küçük ama kullanıcı deneyimini doğrudan etkileyen bir karar.

## Hangi düzenlerde dvh/svh gerçekten fark yaratır?

Tam ekran bir giriş ekranı, bottom sheet veya splash sayfası gibi "viewport'u tamamen doldur" isteyen her düzen, `100vh` yerine `100dvh` kullanıldığında mobilde taşma sorununu ortadan kaldırıyor. [CSS container query kullanımını ele aldığımız yazıda](/tr/posts/css-container-queries-kullanimi) da benzer bir "duyarlı birim" mantığından bahsediyoruz; ikisi birlikte, piksel yerine bağlama göre ölçeklenen bir CSS yaklaşımının parçası.

## dvh, eski bir JavaScript çözümünün (window.innerHeight) yerini tam olarak alıyor mu?

Büyük ölçüde evet. dvh'dan önce birçok ekip, `window.innerHeight` değerini JavaScript ile okuyup bir CSS değişkenine yazarak aynı sorunu çözmeye çalışıyordu; bu yaklaşım çalışıyordu ama her `resize` ve `scroll` olayında yeniden hesaplama gerektiriyordu ve sayfa ilk yüklendiğinde bir anlık yanlış boyut gösterme riski taşıyordu. dvh, bu mantığı tarayıcının kendi layout motoruna taşıyarak hem JavaScript bağımlılığını kaldırıyor hem de ilk render'da doğru değeri garantiliyor; tek eksik, daha önce belirtildiği gibi klavye açılma olayını hâlâ kapsamaması.

## CSS framework'leri (Tailwind gibi) dvh/svh'ı destekliyor mu?

Tailwind CSS, `h-dvh`, `h-svh` ve `h-lvh` gibi utility sınıflarını hazır olarak sunuyor; bu, framework'ün bu birimleri "deneysel" değil, üretime hazır kabul ettiği anlamına geliyor. Bootstrap gibi daha eski framework'lerde ise bu birimler için hazır bir utility sınıfı yok, kendi CSS'inizi yazmanız gerekiyor. Bir framework'e geçmeden önce dokümantasyonunu kontrol etmek önemli, çünkü bazı eski proje şablonları hâlâ `vh-100` gibi eski bir utility ismiyle geliyor ve bu, gerçekte `100vh`'a karşılık geliyor, `dvh`'a değil. Bir framework yükseltmesi sırasında bu tür eski utility isimlerini olduğu gibi bırakmak, "framework güncel ama tasarım hâlâ eski birimle çalışıyor" gibi görünüşte anlaşılması zor bir hataya yol açabiliyor; bu yüzden yükseltme sonrası mobil görünümü gerçek bir cihazda tekrar test etmek gerekiyor.

Kişisel görüşüm: `100vh` kullanan her mobil düzenin varsayılan olarak `100dvh`'a geçmesi gerekiyor, çünkü geriye dönük uyumluluk maliyeti sıfıra yakın ve kazanç somut. Buna karşın takımlar hâlâ eski alışkanlıkla `vh` yazıyor çünkü üç yıl önce bu birimler yoktu ve kod tabanları o döneme ait. Bir CSS linter kuralı eklemek, bu eski alışkanlığı yeni kod yazılırken otomatik olarak yakalamanın en ucuz yolu.

## Test checklist'i nedir?

Gerçek bir cihazda adres çubuğunu önce gizleyip sonra geri getirerek test edin; emülatörler bu davranışı her zaman doğru simüle etmez. iOS Safari'de hem dikey hem yatay modda, klavye açıkken bir form alanına dokunarak test edin. Android'de Chrome ve varsa cihaz üreticisinin kendi tarayıcısını (Samsung Internet gibi) ayrı ayrı deneyin, çünkü araç çubuğu davranışı üreticiye göre değişebiliyor.

## Sıkça Sorulan Sorular

### dvh ile svh arasındaki fark nedir?

`svh`, tarayıcı arayüzü (adres çubuğu, araç çubuğu) tam açıkken kalan en küçük görünür alanı temsil eder ve sabit kalır; `dvh` ise kaydırma sırasında arayüz gizlenip göründüğünde anlık olarak güncellenir. Sabit bir yükseklik isterseniz `svh`, viewport'u her zaman tam dolduran bir düzen isterseniz `dvh` kullanın.

### 100vh kullanmayı tamamen bırakmalı mıyım?

Masaüstünde `vh` hâlâ güvenli çünkü tarayıcı arayüzü kaydırmaya göre değişmiyor; ama mobil hedefleyen her düzende `100dvh` kullanmak, ek bir uyumluluk maliyeti olmadan taşma sorununu ortadan kaldırıyor, bu yüzden pratik cevap "mobilde evet, bırak."

### Sanal klavye açıldığında dvh otomatik küçülür mü?

Hayır. dvh, svh ve lvh birimleri klavye açılmasını değil, tarayıcı arayüzünün (adres çubuğu gibi) görünürlük değişimini takip eder. Klavye açıldığında bir input'un görünür kalmasını garantilemek için hâlâ JavaScript'e veya Chrome'a özel `VirtualKeyboard` API'sine ihtiyacınız var.

### safe-area-inset değerleri her cihazda sıfır mı gösterir, Android'de davranış aynı mı?

Çentiği veya ana ekran göstergesi olmayan cihazlarda ve masaüstünde `env()` değerleri sıfır döner, yani `env(safe-area-inset-bottom, 0px)` yazmak zararsızdır ve her cihazda güvenle kullanılabilir. dvh biriminin kendisi için ise Android'de tam bir garanti yok: iOS'ta tek bir motor (WebKit) aynı davranışı garantilerken, Android'de Chrome ve Samsung Internet gibi tarayıcılar farklı motor sürümleri kullanabiliyor, bu da adres çubuğu animasyonunda küçük görsel farklara yol açabiliyor — düzeni bozmuyor, sadece geçiş hissini değiştiriyor.
