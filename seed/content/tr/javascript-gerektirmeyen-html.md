---
title: "Artık JavaScript Gerektirmeyen HTML"
slug: "javascript-gerektirmeyen-html"
translationKey: "native-html-no-js-dialog-popover"
locale: "tr"
excerpt: "Modal, menü, tooltip ve akordeon için artık bir kütüphaneye ihtiyacınız yok. Native dialog, Popover API ve CSS anchor positioning ile bu bileşenler yazılır."
category: "web-development"
tags: ["css", "accessibility", "frontend", "web-standards"]
publishedAt: "2026-08-08"
seoTitle: "JavaScript Gerektirmeyen Native HTML Bileşenleri"
seoDescription: "Native dialog, Popover API, CSS anchor positioning ve details ile modal, menü, tooltip ve akordeon nasıl yazılır? 2026 tarayıcı desteğiyle pratik rehber."
---

Bir modal, bir açılır menü ya da bir tooltip için hâlâ bir JavaScript kütüphanesi kuruyorsanız, muhtemelen tarayıcının artık ücretsiz sunduğu bir şeyi elle yeniden yazıyorsunuz. 2026 itibarıyla `<dialog>`, Popover API, CSS anchor positioning ve `<details>` büyük tarayıcıların tamamında destekleniyor — ve odak yönetimi, klavye erişilebilirliği gibi en can sıkıcı detayları sizin yerinize hallediyor.

## Modallar: `<dialog>`

`<dialog>` elementi artık modal ve non-modal diyaloglar için native bir çözüm. `showModal()` çağrıldığında tarayıcı otomatik olarak arka plan karartması (backdrop) ekliyor, odağı diyalog içine hapsediyor ve Escape tuşuyla kapatmayı destekliyor — bunların hiçbiri elle yazılmıyor:

```html
<dialog id="confirm-dialog">
  <form method="dialog">
    <p>Bu işlemi onaylıyor musunuz?</p>
    <button value="cancel">Vazgeç</button>
    <button value="confirm">Onayla</button>
  </form>
</dialog>

<script>
  const dialog = document.getElementById('confirm-dialog')
  document.getElementById('open-btn').addEventListener('click', () => dialog.showModal())
</script>
```

`method="dialog"` olan bir form, herhangi bir submit butonuna tıklandığında diyaloğu otomatik kapatıyor ve tıklanan butonun `value`'sunu `dialog.returnValue`'ya yazıyor — kapatma mantığını elle yazmanıza gerek kalmıyor.

## Menüler ve Tooltip'ler: Popover API

Popover API, [Chrome for Developers'ın tanıttığı yazıya](https://developer.chrome.com/blog/introducing-popover-api/) göre 2025'in başında Baseline Widely Available durumuna ulaştı — yani Chrome, Firefox, Safari ve Edge'de tam destekli. `popovertarget` özniteliği, bir butonu bir popover elementine bağlamak için tek satır yeterli:

```html
<button popovertarget="user-menu">Menü</button>

<div id="user-menu" popover>
  <a href="/profil">Profil</a>
  <a href="/ayarlar">Ayarlar</a>
  <a href="/cikis">Çıkış</a>
</div>
```

Tarayıcı, popover dışına tıklandığında otomatik kapatma, Escape tuşu desteği ve doğru ARIA ilişkilendirmesini kendisi yapıyor — bunların hepsini elle yazmak, önceki nesil kütüphanelerde yüzlerce satır tutabiliyordu. `popover="manual"` değeriyle bu otomatik kapatma davranışını devre dışı bırakabiliyorsunuz — örneğin bir bildirim panelinin dışa tıklamayla kapanmasını istemiyorsanız.

## Konumlandırma: CSS Anchor Positioning

Popover API'nin eksik kaldığı yer konumlandırma — bir tooltip'i tetikleyen butonun tam altına, ekran kenarına taşarsa otomatik olarak yukarı kaydırarak yerleştirmek geleneksel olarak bir JavaScript kütüphanesi (Floating UI gibi) gerektiriyordu. CSS anchor positioning bunu native CSS'e taşıyor:

```css
.tooltip {
  position: fixed;
  position-anchor: --trigger;
  top: anchor(bottom);
  left: anchor(left);
  position-try-fallbacks: flip-block, flip-inline;
}

.trigger-button {
  anchor-name: --trigger;
}
```

`position-try-fallbacks` özelliği, tooltip ekran dışına taşacaksa otomatik olarak alternatif bir konuma geçmesini sağlıyor — Floating UI'ın "collision detection" özelliğinin, ek bir kütüphane kurmadan elde ettiğiniz CSS karşılığı. Sözdizimi ve tarayıcı desteği detayları için [MDN'nin anchor() fonksiyonu dokümantasyonuna](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/anchor) bakabilirsiniz.

## Tarayıcı Desteği Tablosu

| Özellik | Baseline durumu (2026 ortası) | Not |
|---|---|---|
| `<dialog>` | Tam destek, tüm büyük tarayıcılar | Odak tuzağı ve backdrop native |
| Popover API | Baseline Widely Available (Nisan 2025'ten beri) | `popovertarget` ile sıfır JS |
| CSS anchor positioning (level 1) | Baseline 2026, Chrome 125+/Firefox 132+/Safari 18.2+ | Küresel trafiğin yaklaşık %91'ini kapsıyor |
| CSS anchor positioning (level 2) | Sadece Chromium tarayıcılarda | Interop 2026 hedefinde, yıl sonuna doğru yaygınlaşması bekleniyor |
| `<details>`/`<summary>` | Tam destek, yıllardır | Akordeon için sıfır JS |

## Akordeonlar: `<details>`

Akordeon bileşenleri için genelde bir state kütüphanesi ya da en azından birkaç `useState` çağrısı kurulur — oysa `<details>`/`<summary>` bunu native olarak, hiç JavaScript olmadan yapıyor:

```html
<details>
  <summary>Sıkça Sorulan Soru Başlığı</summary>
  <p>Cevap metni burada yer alıyor.</p>
</details>
```

`name` özniteliği paylaşan birden fazla `<details>` elementi, aynı anda sadece birinin açık kalmasını sağlayan bir grup oluşturuyor — klasik "akordeon" davranışını tek bir öznitelikle elde ediyorsunuz. Güncel tarayıcı destek yüzdelerini [caniuse'un anchor positioning tablosundan](https://caniuse.com/css-anchor-positioning) takip edebilirsiniz. `open` özniteliğini elle eklemek ya da kaldırmak, akordeonu programatik olarak kontrol etmenizi sağlıyor — bir arama sonucuna göre ilgili paneli otomatik açmak gibi senaryolarda hâlâ birkaç satır JavaScript yazıyorsunuz, ama bu artık odak yönetimi ya da klavye gezinme mantığı değil, sadece hangi panelin açık olacağına karar veren basit bir durum kontrolü.

## Invoker Komutları: Genel Bir Mekanizma

2026 başında Baseline'a ulaşan bir başka gelişme, `command` ve `commandfor` özniteliklerinden oluşan invoker komutları. Bu mekanizma, `popovertarget`'ın yaptığı işi genelleştiriyor — bir butonun, herhangi bir hedef elementte belirli bir eylemi tetiklemesini sağlıyor:

```html
<button command="show-modal" commandfor="my-dialog">Aç</button>
<dialog id="my-dialog">...</dialog>
```

Burada `command="show-modal"` değeri, butona tıklandığında hedef `<dialog>` elementinin `showModal()` metodunu native olarak çağırıyor — `addEventListener` yazmanıza bile gerek kalmıyor. `close`, `toggle-popover`, `show-popover` gibi başka komutlar da aynı özniteliklerle çalışıyor. Bu, native elementlerin sadece kendi başlarına değil, birbirleriyle de JavaScript'siz konuşabildiği anlamına geliyor.

## Hâlâ Biraz JavaScript Gerektiren Yerler

Bu native elementler her şeyi çözmüyor. Bir modal içinde form doğrulaması, bir popover'ın içeriğini dinamik olarak yüklemek ya da bir akordeonun açılma/kapanma animasyonunu özelleştirmek hâlâ JavaScript gerektiriyor. Fark şu: artık JavaScript'i *davranışı* (odak yönetimi, klavye erişilebilirliği, konumlandırma) yeniden icat etmek için değil, sadece *içeriği* yönetmek için yazıyorsunuz. Bu ayrım, erişilebilirlik açısından da önemli — [web erişilebilirlik kontrol listemizde](/tr/posts/web-erisilebilirlik-kontrol-listesi) detaylandırdığımız gibi, elle yazılan odak tuzağı mantığı genelde eksik kalıyor; native elementler bunu tarayıcı seviyesinde garanti ediyor.

## Ne Zaman Hâlâ Bir Kütüphane Gerekir

Karmaşık, çok adımlı bir combobox, sürüklenebilir (draggable) bir modal ya da özel geçiş animasyonlarına ihtiyacınız varsa, native elementler yeterli esnekliği sunmayabiliyor. Ama basit modal, menü, tooltip ve akordeon gibi %80'lik kısım için artık bir kütüphaneye bağımlı kalmanın gerekçesi giderek zayıflıyor — özellikle bundle boyutunu düşürmeye çalışıyorsanız. Kütüphaneyi tamamen kaldırmadan önce projenizdeki her kullanımı tek tek gözden geçirmek makul bir ara adım: bazı bileşenler native karşılığa birebir taşınabilirken, bazıları (örneğin çok seviyeli iç içe menüler) hâlâ ek mantık gerektirebiliyor.

## Bu JS'i Bu HTML'le Değiştir: Hızlı Referans

| Eski yaklaşım | Native karşılığı |
|---|---|
| `react-modal`, custom overlay + focus-trap | `<dialog>` + `showModal()` |
| Headless UI Menu, custom dropdown | Popover API + `popovertarget` |
| Floating UI / Popper.js | CSS anchor positioning |
| Accordion state kütüphanesi | `<details>`/`<summary>` + `name` |

Container query'lerle birlikte kullanıldığında bu native elementler, [CSS container queries yazımızda](/tr/posts/css-container-queries-kullanimi) anlattığımız responsive yaklaşımla iyi tamamlanıyor — ikisi de "JavaScript'e ihtiyaç duymadan tarayıcının kendisine daha fazla iş yaptırmak" felsefesinin parçası. Tailwind kullanıyorsanız [Tailwind CSS hataları yazımızda](/tr/posts/tailwind-css-hatalari) bahsettiğimiz gibi, bu native elementleri utility class'larla birlikte kullanmak genelde sorunsuz.

## Sıkça Sorulan Sorular

### `<dialog>` ile modal kütüphanelerini tamamen bırakabilir miyim?

Basit onay/form modalları için evet. Karmaşık geçiş animasyonları ya da iç içe modal yönetimi gerekiyorsa hâlâ ek JavaScript yazmanız gerekebilir, ama temel odak/backdrop/Escape davranışı, en sık karşılaşılan modal senaryolarının çoğunda native olarak geliyor.

### Popover API ile `<dialog>` arasındaki fark ne?

Popover API menü ve tooltip gibi modal olmayan, sayfanın geri kalanını engellemeyen içerikler için tasarlandı. `<dialog>` ise sayfanın geri kalanını etkileşimsiz bırakması gereken modal etkileşimler için daha uygun.

### CSS anchor positioning tüm tarayıcılarda çalışıyor mu?

Level 1, Chrome, Firefox ve Safari'nin güncel sürümlerinde Baseline 2026 durumunda ve küresel trafiğin büyük kısmını kapsıyor. Level 2 şu an sadece Chromium tabanlı tarayıcılarda mevcut; Interop 2026 hedefleri arasında olduğu için yıl sonuna doğru diğer tarayıcılara da yaygınlaşması bekleniyor.

### Bu elementler eski tarayıcılarda ne oluyor?

Desteklenmeyen bir tarayıcıda `<dialog>` düz bir `<div>` gibi davranıyor, popover özniteliği yok sayılıyor. Kritik bir akış için eski tarayıcı desteği gerekiyorsa, bir polyfill ya da aşamalı geliştirme (progressive enhancement) stratejisi planlamanız, kullanıcıların önemli bir kısmını dışarıda bırakmamanın en güvenli yolu.
