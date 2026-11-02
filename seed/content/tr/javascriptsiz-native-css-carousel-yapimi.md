---
title: "CSS Carousel JavaScript'siz Nasıl Yapılır?"
slug: "javascriptsiz-native-css-carousel-yapimi"
translationKey: "css-native-carousels-2026"
locale: "tr"
excerpt: "Kısa cevap: scroll-snap ile ::scroll-marker ve ::scroll-button() sözde elemanlarını kullanın. Chromium destekliyor, diğer tarayıcılar sade kaydırmaya düşer."
category: "web-development"
tags: ["css", "frontend", "accessibility", "web-standards"]
publishedAt: "2026-11-02"
seoTitle: "JavaScript'siz Native CSS Carousel (2026)"
seoDescription: "Saf CSS ile erişilebilir carousel yapın: scroll-snap, ::scroll-marker, ::scroll-button(). Geri düşüş davranışı ve JS kütüphanesini ne zaman bırakmalısınız."
---

Kısa cevap: öğelerinizi bir `scroll-snap-type` konteynerine sarın, nokta ve ok düğmeleri için `scroll-marker-group`, `::scroll-marker` ve `::scroll-button()` ekleyin; tarayıcı kaydırma, odak ve klavye gezinmesini kendisi halleder. Chromium (Chrome ve Edge 135+, Nisan 2025) tam destek sunuyor; Firefox ve Safari ise nokta ve ok olmadan çalışan düz bir kaydırma alanına düşüyor, yani carousel bozulmuyor, sadece sadeleşiyor.

## Native CSS carousel nedir?

Native CSS carousel, nokta ve gezinme düğmelerinin JavaScript yerine tarayıcının kendisi tarafından CSS sözde elemanları (pseudo-element) üzerinden üretildiği bir scroll-snap konteyneridir — [Chrome for Developers'ın özelliği ele aldığı rehber](https://developer.chrome.com/blog/carousels-with-css), bu yazı itibarıyla en ayrıntılı birincil kaynak. Üç yapı taşı şunlar: `scroll-marker-group` (tarayıcıya bir işaretçi şeridi üretmesini söyleyen konteyner özelliği), `::scroll-marker` (her scroll-snap çocuğu için bir sözde eleman, nokta veya küçük resim gibi stillenebilir) ve `::scroll-button()` (kaydırma konteynerine bağlı ileri/geri ok düğmeleri).

Perde arkasında hâlâ yıllardır her modern tarayıcıda desteklenen `scroll-snap-type` ve `scroll-snap-align` özellikleri çalışıyor. Yeni olan şey, tarayıcının artık kontrolleri de çizebilmesi — bu iş önceden kaydırma konumunu takip edip bir nokta göstergesiyle senkronize eden Swiper veya Slick gibi bir JavaScript kütüphanesi gerektiriyordu.

## Adım adım nasıl kurulur?

Yatay kayan bir flex veya grid konteyner oluşturun, onu snap konteyneri olarak işaretleyin ve her çocuğu snap hedefi olarak işaretleyin:

```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-marker-group: after;
  gap: 1rem;
}

.carousel > .slide {
  scroll-snap-align: start;
  flex: 0 0 100%;
}

.carousel > .slide::scroll-marker {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: light-dark(#ccc, #555);
}

.carousel > .slide::scroll-marker:target-current {
  background: light-dark(#111, #eee);
}

.carousel::scroll-button(left) {
  content: "←";
}

.carousel::scroll-button(right) {
  content: "→";
}
```

`scroll-marker-group: after` üretilen nokta şeridini erişilebilirlik ağacında ve görsel sırada carousel'den sonra yerleştirir; `before` değeri ise şeridi slaytların önüne koyar. `:target-current` sözde sınıfı, aktif noktayı tek satır JavaScript yazmadan stillemenizi sağlayan şey.

## Hangi klavye ve ekran okuyucu davranışı ücretsiz geliyor?

Her `::scroll-marker`, gerçek, odaklanabilir, tıklanabilir bir eleman olarak sunuluyor — Tab tuşu nokta şeridine ulaşıyor, destekleyen tarayıcılarda ok tuşları işaretçiler arasında geziniyor, Enter veya Space ise o slayta atlamak için işaretçiyi etkinleştiriyor. `::scroll-button()` elemanları da düğme gibi davranıyor: odaklanabilir ve kaydırma aralığının başında veya sonunda varsayılan olarak devre dışı kalıyor, böylece kullanıcı son slaytın ötesine tıklayamıyor.

Kendiniz eklemeniz gereken şeyler: her `::scroll-marker` için bir `aria-label` (tek başına bir nokta, ekran okuyucuya hiçbir anlamlı şey okutmaz), carousel konteynerinin amacını açıklayan bir `aria-label` ve slaytlar otomatik oynatılıyorsa görünür bir durdurma kontrolü — çünkü durdurma düğmesi olmayan otomatik oynatma, carousel CSS veya JavaScript ile yapılmış olsun, WCAG 2.2'nin 2.2.2 Durdur, Dondur, Gizle kriterini her durumda ihlal ediyor.

## Bugün hangi tarayıcılar destekliyor?

Kasım 2026 itibarıyla destek önce Chromium'da geliyor, diğer tarayıcılarda hâlâ dengesiz — bu yüzden her yerde doğrudan değiştirme değil, kademeli iyileştirme (progressive enhancement) olarak ele almak gerekiyor. [Scroll ile tetiklenen CSS carousel'leri konu alan 2026 tarihli bir derinlemesine inceleme](https://www.sitepoint.com/scrolldriven-css-in-2026-building-carousels-without-javascript/) aynı yayılımı takip ediyor; JS yedeğini tamamen bırakmadan önce okumaya değer.

| Özellik | Chrome / Edge | Firefox | Safari |
|---|---|---|---|
| `scroll-snap-type` / `scroll-snap-align` | Destekleniyor | Destekleniyor | Destekleniyor |
| `scroll-marker-group` | 135'ten beri destekleniyor (Nisan 2025) | Henüz yok | Henüz yok |
| `::scroll-marker` | 135'ten beri destekleniyor | Bazı derlemelerde bayrak (flag) arkasında | Henüz yok |
| `::scroll-button()` | 135'ten beri destekleniyor | Bazı derlemelerde bayrak arkasında | Henüz yok |

Yayına almadan önce MDN veya caniuse'daki canlı tabloları kontrol edin, çünkü Firefox ve Safari'nin durumu sürümden sürüme değişiyor. Her hâlükârda geri düşüş hiçbir zaman bozuk bir sayfa anlamına gelmiyor: sözde elemanlar olmadan, nokta ve ok olmadan çalışan, kaydırılabilir ve snap yapan bir alan elde ediyorsunuz — işlevsel ama sade bir carousel, ölü bir carousel değil.

Performans tarafında da fark somut: native yaklaşımda tarayıcı hiçbir JavaScript ayrıştırmıyor, çalıştırmıyor ve olay dinleyicisi bağlamıyor, bu yüzden Interaction to Next Paint gibi etkileşim metriklerinde bir carousel kütüphanesinin ana iş parçacığını (main thread) bloke etmesi riski ortadan kalkıyor. Özellikle düşük güçlü mobil cihazlarda, sayfa yüklenirken 30-40KB'lık bir kütüphaneyi ayrıştırıp çalıştırmak genellikle onlarca milisaniyelik gecikme ekliyor; native CSS carousel bu maliyeti sıfıra indiriyor çünkü tarayıcı zaten render motorunun bir parçası olarak scroll-snap ve sözde elemanları işliyor.

## Gerçek bir sitede nasıl test edilir?

Yayına almadan önce carousel'i gerçek bir Chromium tarayıcısında klavye ile (Tab, ok tuşları, Enter) ve bir ekran okuyucuyla (VoiceOver veya NVDA) deneyin; ardından Firefox ve Safari'de aynı sayfayı açıp geri düşüşün gerçekten çalıştığını, yani kaydırmanın takılmadığını ve içeriğin eksiksiz göründüğünü doğrulayın. Otomatik bir uçtan uca test, `@supports` dallarının her ikisinin de doğru render edildiğini kontrol edecek şekilde iki ayrı tarayıcı motorunda çalıştırılmalı; sadece Chromium'da test etmek, Firefox ve Safari kullanıcılarının gördüğü sade sürümü hiç görmemiş olmanız anlamına gelir.

## Geri düşüşü nasıl zarif hâle getirirsiniz?

`@supports selector(::scroll-marker)` kullanarak JavaScript'siz iyileştirmeleri yalnızca tarayıcı onları çizebiliyorsa ekleyin, destek olmayan durumda yükleme döngüsü veya boş kutu göstermeyin:

```css
@supports not selector(::scroll-marker) {
  .carousel-dots-fallback {
    display: flex;
  }
}

@supports selector(::scroll-marker) {
  .carousel-dots-fallback {
    display: none;
  }
}
```

Bu kalıp — `@supports selector()` ile özellik tespiti yapıp sadece gerektiğinde minimal statik bir yedek arayüz göstermek — Safari ve Firefox kullanıcılarını yarım çizilmiş değil, kullanılabilir bir carousel ile baş başa bırakıyor; ayrıca CSS'in zaten destekleyen tarayıcılarda doğal olarak çizdiği noktaları boyamak için tek amaçlı bir JavaScript polyfill göndermekten kurtarıyor.

## Hangi JavaScript carousel kütüphanelerini bırakabilirsiniz?

Carousel'inizin yalnızca destekleyen tarayıcılarda snap, nokta gezinmesi ve ileri/geri düğmelerine ihtiyacı varsa — ve diğer her yerde düz kaydırma yeterliyse — bir kaydırma takip kütüphanesini tamamen kaldırabilirsiniz. Durdurma kontrollü otomatik oynatma, sonsuz döngü (CSS scroll-snap'te yerleşik döngüye geri dönüş yok) ve senkronize dış durum (carousel dışındaki "8'den 3" gibi bir sayaç) için hâlâ JavaScript'e ihtiyacınız var. Bu durumlarda, native CSS snap ve işaretçilerin üzerine ince bir ~2KB'lık otomatik oynatma ve döngü betiği, genellikle minify edilmiş hâliyle 30-40KB gönderen Swiper gibi tam bir carousel kütüphanesinden çok daha küçük bir bağımlılık.

Dürüst görüşüm: basit görsel veya referans carousel'leri için — ki çoğu sitenin gönderdiği şey tam olarak bu — native CSS artık etkileşimin tamamını kapsıyor ve sırf nokta gezinmesi için bir carousel kütüphanesi eklemek, Chromium ağırlıklı bir trafik tabanında artık haklı değil. Üzerine [scroll ile tetiklenen animasyonlar](/tr/posts/css-scroll-driven-animasyonlar) eklemek veya bir carousel'in yanına [CSS anchor positioning ile popover](/tr/posts/css-anchor-positioning-jssiz-popover) koymak istediğinizde de "gönder, boşluğu `@supports` halletsin" kalıbı aynı şekilde geçerli. Herhangi bir carousel markup'ı hâlâ [standart bir erişilebilirlik kontrol listesinden](/tr/posts/web-erisilebilirlik-kontrol-listesi) geçmeli — native işaretçiler sizi etiketleme ve odak sırası incelemesinden muaf tutmuyor.

## Sıkça Sorulan Sorular

### JavaScript'siz carousel için hangi CSS özellikleri kullanılır?

`scroll-snap-type` ve `scroll-snap-align`, kaydırma anında hedefe kilitlenmeyi sağlar; `scroll-marker-group`, `::scroll-marker` ve `::scroll-button()` ise nokta gezinmesini ve ileri/geri düğmelerini bir JavaScript kütüphanesi olmadan native olarak üretir.

### Native CSS carousel'ler Firefox ve Safari'de çalışıyor mu?

Kasım 2026 itibarıyla tam olarak çalışmıyor. Temel scroll-snap davranışı her yerde çalışıyor, ama `::scroll-marker` ve `::scroll-button()` sözde elemanları şu an sadece Chromium'da (Chrome/Edge 135+) var; Firefox'ta bazı derlemelerde bayrak arkasında, Safari'de ise taahhüt edilmiş bir takvim yok — kullanmadan önce caniuse'u kontrol edin.

### Native CSS carousel varsayılan olarak erişilebilir mi?

Kısmen. İşaretçiler ve düğmeler varsayılan olarak odaklanabilir ve klavyeyle çalıştırılabilir, ama yine de her işaretçiye ve konteynere `aria-label` metni eklemeniz gerekiyor; slaytlar otomatik oynatılıyorsa da elle bir durdurma kontrolü eklemelisiniz, çünkü WCAG 2.2.2 uygulama biçiminden bağımsız olarak bunu şart koşuyor.

### Carousel JavaScript kütüphanemi tamamen kaldırabilir miyim?

Sadece carousel'iniz snap, nokta ve ileri/geri düğmelerinin ötesinde bir şeye ihtiyaç duymuyorsa. Durdurma kontrollü otomatik oynatma, sonsuz döngü veya dış bir slayt sayacını senkronize etmek için küçük bir betik tutun — native CSS scroll-snap bu üçünden hiçbirini kendi başına desteklemiyor.
