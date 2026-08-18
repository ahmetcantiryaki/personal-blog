---
title: "2026'da Tarayıcı Eklentisi Nasıl Yapılır?"
slug: "2026-tarayici-eklentisi-nasil-yapilir"
translationKey: "build-browser-extension-2026"
locale: "tr"
excerpt: "2026'da eklenti; Manifest V3, service worker arka plan ve WebExtensions API ile yazılır, Chrome, Firefox ve Edge mağazalarına ayrı ayrı gönderilir."
category: "web-development"
tags: ["frontend", "web-standards", "best-practices", "automation"]
publishedAt: "2026-08-18"
seoTitle: "2026'da Tarayıcı Eklentisi Nasıl Yapılır?"
seoDescription: "Manifest V3, service worker, side panel, storage ve mesajlaşma ile 2026'da sıfırdan tarayıcı eklentisi geliştirme rehberi; mağaza onayı dahil."
---

Kısa cevap: 2026'da bir tarayıcı eklentisi `manifest_version: 3` ile yazılır, arka planda kalıcı sayfa yerine bir service worker çalıştırır, Chrome, Firefox ve Edge arasında WebExtensions API'siyle aynı kod tabanını paylaşır ve her tarayıcının mağazasına ayrı ayrı gönderilir. Manifest V2 artık geçmişte kaldı; Chrome'da Ağustos 2026 itibarıyla fiilen tamamen kapandı.

## Manifest V3 nedir, Manifest V2 gerçekten bitti mi?

Manifest V3, eklentinin izinlerini, arka plan davranışını ve ağ isteği kurallarını tanımlayan `manifest.json` dosyasının üçüncü ve şu an tek geçerli sürümü. Chrome, kullanıcıların MV2 eklentilerini yeniden etkinleştirmesine izin veren seçeneği Temmuz 2025'te (sürüm 138) kaldırdı, kurumsal politika bayraklarını da 2026 ortasında (sürüm 150-151) koddan tamamen sildi; ayrıntılı takvim Chrome'un resmi [Manifest V2 destek takvimi](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline) sayfasında. Chrome Web Store, geriye kalan MV2 listelemelerini 31 Ağustos 2026'da mağazadan siliyor. Yani bugün yeni bir eklentiye MV2 ile başlamanın hiçbir mantığı yok; Firefox hâlâ MV2'yi çalıştırabiliyor olsa da Mozilla da yeni geliştirmeleri MV3'e yönlendiriyor.

MV3'ün en büyük farkı `background.page` yerine `background.service_worker` kullanması ve ağ isteklerini engellemek için kod yerine bildirimsel `declarativeNetRequest` kurallarını zorunlu kılması. Bu, reklam engelleyiciler gibi ağır DOM/istek manipülasyonu yapan eklentiler için hâlâ gerçek bir kısıt; bazı gelişmiş filtreleme senaryoları MV3'te MV2'deki kadar esnek değil.

| Özellik | Manifest V2 | Manifest V3 |
|---|---|---|
| Arka plan | Kalıcı background page | Service worker (uykuya dalar, olay tabanlı) |
| Ağ filtreleme | `webRequestBlocking` (serbest kod) | `declarativeNetRequest` (kural tabanlı) |
| Uzak kod çalıştırma | İzinliydi | Yasak, tüm kod pakette olmalı |
| Chrome'da durum | Ağustos 2026 itibarıyla kaldırıldı | Tek desteklenen sürüm |

## Content script, service worker ve side panel ne işe yarar?

Bu üçü eklentinin farklı bağlamlarda çalışan üç ayrı parçası: content script sayfanın DOM'una erişir, service worker arka planda olayları dinler, side panel ise kullanıcıya sabit bir yan panel arayüzü sunar. Content script, ziyaret edilen sayfanın içine enjekte edilir ve o sayfanın DOM'unu okuyup değiştirebilir, ama sayfanın kendi JavaScript'inden izole bir "dünyada" çalışır. Service worker olay güdümlüdür; sürekli açık kalmaz, bir mesaj veya alarm geldiğinde uyanır, işini bitirince tekrar uykuya dalar — bu yüzden state'i `chrome.storage`'da tutmak gerekir, değişkende değil.

[`chrome.sidePanel` API'si](https://developer.chrome.com/docs/extensions/reference/api/sidePanel) Chrome 116 ile geldi ve kullanıcı eklenti simgesine tıkladığında tarayıcının kenarında kalıcı bir panel açmayı sağlıyor; Edge de aynı API'yi Chromium tabanı sayesinde destekliyor. Firefox'ta karşılığı yok; onun yerine [`sidebar_action` manifest anahtarı ve ayrı `sidebarAction` API'si](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sidebarAction) kullanılıyor, bu da tek bir manifest ile üç tarayıcıyı da kapsamak isteyenlerin build sürecinde tarayıcıya özel bir manifest üretmesini gerektiriyor.

## Eklenti parçaları arasında veri ve mesaj nasıl paylaşılır?

Content script, service worker ve popup birbirinden izole çalıştığı için veri paylaşımı iki yoldan yapılır: kalıcı veri için `chrome.storage.local` veya `chrome.storage.sync`, anlık iletişim için `chrome.runtime.sendMessage` ve `chrome.runtime.onMessage`. `storage.sync` tarayıcı hesabına bağlı cihazlar arasında senkronize olur ama boyutu sınırlıdır (öğe başına 8 KB, toplam 100 KB civarı); büyük veri için `storage.local` tercih edilmeli.

```json
{
  "manifest_version": 3,
  "name": "Woyable Sayfa Özetleyici",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "background.js" },
  "side_panel": { "default_path": "sidepanel.html" },
  "permissions": ["storage", "sidePanel", "activeTab"],
  "host_permissions": ["https://api.woyable.com/*"],
  "content_scripts": [
    {
      "matches": ["https://*/*"],
      "js": ["content.js"]
    }
  ]
}
```

Mesajlaşma tek yönlü değil: content script service worker'a mesaj gönderebilir, service worker de sekmeye `chrome.tabs.sendMessage` ile geri yanıt yollayabilir. Bu event-driven iletişim modeli, servisler arası mesajlaşmayla aynı tuzaklara sahip — sıra garantisi yok, mesaj kaybolabilir; bu tür asenkron akışların tasarımını [olay güdümlü mimari desenleri ve tuzakları](/tr/posts/olay-gudumlu-mimari-desenler-tuzaklar) yazısında daha ayrıntılı ele aldık.

## Hangi izinleri istemeliyim, mağaza incelemesinden nasıl geçerim?

Kural basit: sadece gerçekten kullandığın izni iste, çünkü her ek izin hem kullanıcıyı ürkütür hem de inceleme süresini uzatır. `activeTab` gibi dar kapsamlı izinler, `<all_urls>` gibi geniş host permission'lara göre incelemeden çok daha hızlı geçer; Chrome Web Store, geniş izin isteyen eklentileri manuel incelemeye yönlendiriyor ve bu süreç günler sürebilir.

Açıkçası mağaza incelemesi 2026'da hâlâ en can sıkıcı adım: Chrome Web Store'un otomatik + manuel karışık incelemesi bazen gerekçesiz reddedilen eklentilerle, belirsiz "politika ihlali" mesajlarıyla ve itiraz sürecinin yavaşlığıyla eleştiriliyor. Firefox'un AMO'su kaynak kodunu daha sık talep ediyor, özellikle kod minify edilmişse. Bu sürtünmeyi azaltmanın en pratik yolu; manifest'te izinleri minimumda tutmak, gizlilik politikası linkini eksiksiz eklemek ve uzak sunucudan kod çekmemek (MV3 zaten bunu yasaklıyor).

## Chrome, Firefox ve Edge'de aynı eklenti nasıl çalışır?

Tek bir kod tabanıyla üç tarayıcıyı da desteklemek mümkün, çünkü hepsi [MDN'nin WebExtensions dokümantasyonunda](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions) tanımlanan, W3C WebExtensions Community Group standardına dayanan ortak bir API yüzeyi paylaşıyor. Firefox, `browser.*` namespace'ini ve Promise tabanlı API'leri destekler; Chrome ve Edge callback tabanlı `chrome.*`'i kullanır ama Chrome da artık çoğu API'de Promise döndürebiliyor. `webextension-polyfill` kütüphanesi bu farkı tek bir Promise tabanlı arayüze indirger.

| Özellik | Chrome | Firefox | Edge |
|---|---|---|---|
| Manifest sürümü | Sadece MV3 | MV3 önerilir, MV2 hâlâ çalışıyor | Sadece MV3 |
| API namespace | `chrome.*` | `browser.*` (Promise) + `chrome.*` | `chrome.*` |
| Arka plan | Service worker | Service worker veya event page | Service worker |
| Yan panel API'si | `chrome.sidePanel` | Yok, `sidebarAction` kullanılır | `chrome.sidePanel` |
| Mağaza | Chrome Web Store | Firefox Add-ons (AMO) | Microsoft Edge Add-ons |

Pratikte tek bir `manifest.json` şablonundan, build aracıyla (`webextension-polyfill`, `web-ext` veya `wxt` gibi) tarayıcıya özel çıktı üretmek en az sürtünmeli yol; side panel gibi Chrome/Edge'e özel alanları Firefox derlemesinde otomatik olarak `sidebar_action`'a çeviren bir yapılandırma kurman gerekiyor.

## Eklentimi nasıl yayınlarım, otomatik güncelleme nasıl çalışır?

Her mağazaya ayrı ayrı, imzalı bir paket yüklenir: Chrome Web Store'a zip, geliştirici hesabı başına tek seferlik 5 dolarlık kayıt ücretiyle; Firefox'a `web-ext sign` ile imzalanmış xpi; Edge Add-ons'a da ayrı bir zip. Otomatik güncelleme kullanıcı tarafında hiçbir şey gerektirmez: her üç tarayıcı da arka planda periyodik olarak mağazadaki `update_url`'i kontrol eder ve yeni sürüm onaylandığında sessizce indirip yükler; sen sadece `manifest.json`'daki `version` alanını artırıp yeni paketi gönderirsin.

## Eklentiye yapay zeka özelliği nasıl eklenir?

En basit yol, service worker'dan bir AI API'sine (örneğin bir dil modeli uç noktasına) `fetch` ile istek atmak ve API anahtarını asla content script veya sayfa koduna değil, sadece service worker'a koymak. `host_permissions`'a sadece o API'nin domainini eklemek yeterli; `manifest.json`'daki `content_security_policy` varsayılan olarak zaten uzak script çalıştırmayı engelliyor, bu yüzden AI çağrısı sadece veri alışverişi (fetch + JSON) olmalı, uzaktan kod indirip çalıştırma olmamalı. API anahtarını kullanıcıdan `chrome.storage.local`'a kaydettirip her istekte oradan okumak, anahtarı koda gömmekten çok daha güvenli.

## Başlangıç mimarisi nasıl kurulur?

Küçük bir eklenti için önerilen dosya yapısı şu şekilde: `manifest.json` kök dizinde, `background.js` service worker olarak olayları ve AI çağrılarını yönetir, `content.js` sayfa DOM'una müdahale eder, `popup.html`/`sidepanel.html` kullanıcı arayüzünü taşır, `shared/` klasörü storage ve mesajlaşma yardımcı fonksiyonlarını barındırır. Durum yönetimini popup veya side panel içinde tutmak yerine service worker + `chrome.storage` merkezinde toplamak, sekmeler arası tutarlılığı garanti eder; bu yaklaşım [frontend'de state yönetimi ve signals](/tr/posts/frontend-signals-nedir) yazısındaki merkezi durum mantığına benziyor.

## Mağazaya göndermeden önce neler kontrol edilmeli?

Gönderim öncesi kontrol listesi: manifest'te kullanılmayan izin kalmadığından emin ol, `host_permissions`'ı gerçekten çağrılan domainlerle sınırla, gizlilik politikası URL'sini ekle, ikonları 16/48/128 px olarak hazırla, sürüm numarasını artır, minify edilmiş kodun kaynağını (varsa) ayrı bir zip'te sağla ve her tarayıcının test ortamında (Chrome'da "Paketlenmemiş yükle", Firefox'ta `about:debugging`) son bir manuel testten geçir. Erişilebilirlik açısından popup ve side panel arayüzlerini de gözden geçirmek faydalı; bu konudaki genel kontrol listesi [web erişilebilirlik kontrol listesi](/tr/posts/web-erisilebilirlik-kontrol-listesi) yazısında.

## Sıkça Sorulan Sorular

### Manifest V2 eklentiler Chrome'da hâlâ çalışıyor mu?

Hayır, Ağustos 2026 itibarıyla çalışmıyor. Chrome, kullanıcıların MV2 eklentilerini yeniden etkinleştirme seçeneğini Temmuz 2025'te kaldırdı, kurumsal politika bayraklarını 2026 ortasında koddan sildi ve Chrome Web Store 31 Ağustos 2026'da kalan MV2 listelemelerini mağazadan da temizliyor.

### Side panel API tüm tarayıcılarda çalışıyor mu?

Hayır. `chrome.sidePanel`, Chrome 116 ve üzeri ile Chromium tabanlı Edge'de çalışıyor ama Firefox'ta karşılığı yok. Firefox'ta aynı işlevi `sidebar_action` manifest anahtarı ve `sidebarAction` API'si sağlıyor, dolayısıyla üç tarayıcıyı da desteklemek için build aşamasında ayrı manifest üretmek gerekiyor.

### Bir eklentiyi hem Chrome hem Firefox'ta yayınlamak için ayrı kod mu yazmak gerekiyor?

Genellikle hayır; her ikisi de W3C WebExtensions standardına dayandığı için `content_scripts`, `storage` ve `runtime.sendMessage` gibi çekirdek API'ler ortak. `webextension-polyfill` ile namespace farkını (`chrome.*` vs `browser.*`) kapatabilir, sadece side panel gibi tarayıcıya özel birkaç alanı manifest düzeyinde ayırman yeterli.

### Eklenti geliştirmek için mağaza kayıt ücreti var mı?

Chrome Web Store'da geliştirici hesabı açmak için tek seferlik 5 dolar ödenir; Firefox Add-ons (AMO) ve Microsoft Edge Add-ons'ta ise kayıt ücretsiz. Ücretin varlığı incelemenin hızını etkilemez, incelemeyi belirleyen asıl faktör istenen izinlerin kapsamıdır.
