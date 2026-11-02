---
title: "Web'de Canlı İmleç ve Varlık Göstergesi Nasıl Yapılır?"
slug: "webde-canli-imlec-ve-varlik-gostergesi-yapimi"
translationKey: "realtime-presence-cursors-web-2026"
locale: "tr"
excerpt: "Kısa cevap: imleç konumlarını kısıtlayıp WebSocket ile yayınlayın, aradaki boşluğu interpolasyonla doldurun, paylaşılan durumu bir CRDT'de saklayın."
category: "web-development"
tags: ["collaboration", "frontend", "performance", "web-standards"]
publishedAt: "2026-11-02"
seoTitle: "Kendi Soket Filonuz Olmadan Canlı İmleç ve Varlık"
seoDescription: "Varlık için WebSocket mi SSE mi WebTransport mı, imleç güncellemelerini kısıtlama, CRDT ile paylaşılan durum ve yönetilen servis ne zaman mantıklı."
---

Kısa cevap: varlık (presence) için iki ayrı veri akışına ihtiyacınız var — kısıtlanmış bir hızda düşük gecikmeli bir taşıyıcı üzerinden (çoğu durumda WebSocket) gönderilen geçici imleç konumları ve bir CRDT üzerinden senkronize edilen kalıcı paylaşılan durum (kim neyi seçti). Kendi soket filonuzu çalıştırmanıza gerek yok; Liveblocks veya PartyKit gibi yönetilen servisler ikisini de bağlı kullanıcı sayısına göre aylık bir ücretle hâlleder.

## "Varlık" tam olarak neden oluşur?

Varlık, birbirine karıştırılması kolay ama çok farklı davranan üç parçaya ayrılır: kimin çevrimiçi olduğu (basit bir katıldı/ayrıldı listesi), canlı imleçler (kimsenin saklamasına gerek olmayan yüksek frekanslı, geçici konum verisi) ve paylaşılan seçimler veya düzenlemeler (daha düşük frekanslı ama bağlantı kesilip yeniden kurulduğunda hayatta kalması ve aynı şeyi düzenleyen iki kişi arasındaki çatışmaları çözmesi gereken kalıcı durum). Üçünü de tek bir veri akışı olarak kurmak en yaygın tasarım hatası — bir liste güncellemesiyle bir imleç hareketinin kalıcılık ve frekans gereksinimleri tamamen farklı.

| Varlık parçası | Güncelleme sıklığı | Kalıcı olması gerekiyor mu? | Tipik taşıyıcı |
|---|---|---|---|
| Çevrimiçi listesi | Düşük (katılma/ayrılmada) | Hayır — aktif bağlantılardan yeniden kurulur | WebSocket veya SSE |
| Canlı imleçler | Yüksek (saniyede 10-60 güncelleme istenir) | Hayır — tamamen geçici | WebSocket (en düşük gecikme) |
| Paylaşılan seçim/düzenleme | Orta, olay tabanlı | Evet — yeniden bağlanmada uzlaştırılmalı | WebSocket üzerinden CRDT |

## WebSocket mi SSE mi WebTransport mı — hangi taşıyıcı?

İmleçler ve çoğu varlık verisini kapsayan, iki yönlü ve gecikmeye hassas her şey için WebSocket kullanın; evrensel tarayıcı desteği var ve 2026'da güvenli varsayılan seçim. SSE (Server-Sent Events) tek yönlüdür (yalnızca sunucudan istemciye), bu yüzden salt okunur bir "bu sayfayı kim görüntülüyor" göstergesi için işe yarar ama imleç konumlarını geri göndermek için değil — [SSE ve WebSocket arasındaki tam ödünleşim](/tr/posts/sse-mi-websocket-mi-gercek-zamanli) burada da diğer her gerçek zamanlı özellikte olduğu gibi geçerli. HTTP/3 üzerine kurulu WebTransport, daha düşük gecikmeli güvenilmez datagram'lar sunuyor — bir konum güncellemesinin kaybolmasının önemli olmadığı imleç verisi için gerçek bir uyum — ama Kasım 2026'ya girerken tarayıcı desteği hâlâ önce Chromium'da, Firefox ve Safari geride; bunu tek taşıyıcınız yapmak yerine bir WebSocket yedeğinin üzerine kademeli bir iyileştirme olarak ele alın.

## İmleç güncellemelerinin bağlantıyı doldurmasını nasıl önlersiniz?

Gönderilen konum güncellemelerini en fazla saniyede yaklaşık 20-30'a kısıtlayın, ardından alıcı tarafta interpolasyon yaparak hareketin gerçekten gönderdiğiniz güncellemeler arasında da akıcı görünmesini sağlayın. Ham bir `mousemove` dinleyicisi bundan çok daha sık tetiklenir — her olayı göndermek, kendi imlecini hareket ettiren kişi dışında herkes için varlık özelliğini gecikmeli hissettiren en büyük tek neden.

```js
let lastSent = 0;
const THROTTLE_MS = 40; // saniyede ~25 güncelleme

function onMouseMove(e) {
  const now = performance.now();
  if (now - lastSent < THROTTLE_MS) return;
  lastSent = now;
  channel.send({ type: 'cursor', x: e.clientX, y: e.clientY, t: now });
}
```

Alıcı tarafta, her uzak imleci doğrudan en son koordinata zıplatmayın — son bilinen konumundan yenisine kısıtlama aralığı boyunca doğrusal interpolasyon yapın; böylece saniyede 25 güncellemeyle gelen bir imleç, görünür biçimde ışınlanmak yerine 60fps'te sürekli bir hareket olarak çizilir.

## Birisi bağlantısı kesilip yeniden bağlandığında ne olur?

Yeniden bağlanmayı bir uç durum değil, normal durum olarak tasarlayın — mobil kullanıcılar ağ değiştirir, laptoplar uykuya dalar, sekmeler sürekli arka plana atılır. Bağlantı kesildiğinde, liste o kullanıcıyı anında değil, kısa bir tolerans süresinden (2-5 saniye) sonra düşürmeli; böylece kısa bir ağ dalgalanması birinin avatarını yanıp söndürmez. Yeniden bağlanmada imleçler ve liste durumu geçici olduğu için sıfırdan yeniden kurulabilir, ama paylaşılan düzenlemeler ve seçimler, bağlantı kesikken değişen her şeye karşı uzlaştırılmalıdır — bu da tam olarak CRDT'lerin çözdüğü problem.

## Paylaşılan durum için neden özellikle CRDT'ye ihtiyacınız var?

Bir CRDT (çatışmasız çoğaltılmış veri tipi), aynı verinin iki ayrışmış kopyasını, merkezi bir sunucunun "kim kazandı" diye karar vermesine gerek kalmadan tek ve tutarlı bir sonuca birleştirir; bu önemli, çünkü aynı belgeyi düzenleyen ve kısa süre birbirinden kopan iki kullanıcı, yeniden bağlanıldığında otomatik olarak birleşmesi gereken çatışan yerel durumlar üretir. Yjs bunun için en yaygın kullanılan CRDT kütüphanesi; belge senkronizasyon çekirdeğinin yanında, özellikle varlık için (imleçler, seçimler, çevrimiçi durum) bir "awareness" modülü sunuyor, yani varlığın hem geçici hem kalıcı yarısı için tek bir kütüphane kullanabilirsiniz. Liveblocks, [Yjs uyumlu bir senkronizasyon adaptörüyle](https://electric.ax/docs/streams/integrations/yjs) yönetilen CRDT altyapısı sunuyor; bu sayede Yjs üzerine kurulu bir uygulama, senkronizasyon mantığını yeniden yazmadan barındırılan bir arka uca geçebiliyor.

## Kendi soket filonuzu mu çalıştırmalısınız yoksa yönetilen bir servis mi kullanmalısınız?

Kendi filonuzu yalnızca zaten ölçekte WebSocket altyapısı işletiyorsanız veya yönetilen bir servisin karşılayamayacağı gereksinimleriniz varsa (veri konumu, çok yüksek bağlantı sayılarında aşırı maliyet hassasiyeti) çalıştırın. Çoğu ekip için yönetilen bir varlık servisi, göndermenin daha ucuz ve daha hızlı yolu: yapışkan oturum yük dengeleyicileri çalıştırmanın, yeniden bağlanma fırtınalarını yönetmenin ve soket sunucularını yatay ölçeklendirmenin operasyonel maliyetini — ürününüzle hiçbir ilgisi olmayan gerçek mühendislik sorunlarını — ortadan kaldırıyor. Ödünleşim, kullanımla ölçeklenen bağlı-kullanıcı-başına maliyet; bu, kendi barındırmanın sunucu maliyetinden değil, tasarruf edilen mühendislik zamanından kendini ödediği ölçeğin altındaki çoğu uygulama için iyi bir ödünleşim. [Liveblocks, PartyKit ve Hocuspocus'u karşılaştıran 2026 tarihli bir inceleme](https://www.pkgpulse.com/guides/liveblocks-vs-partykit-vs-hocuspocus-realtime-2026), yönetilen seçenekleri birbirine karşı tartmak için mantıklı bir başlangıç noktası.

## Gizlilik ve kötüye kullanım riskleri nedir?

Canlı imleçler ve varlık, gerçek zamanlı davranışsal veriyi ortaya çıkarır — şu anda kimin neye baktığını — ve bu göründüğünden daha büyük bir gizlilik yüzeyidir. Ürünün izin verdiği yerlerde kullanıcıların çevrimdışı veya anonim görünmesine her zaman izin verin, hassas imleç verisini sızabileceği herhangi bir analitik hattından ayıklayın ve varlık bağlantılarını diğer her yazma yolunu kısıtladığınız gibi kullanıcı başına hız sınırlayın; çünkü kısıtlanmamış bir varlık kanalı, tek bir istemcinin bağlı diğer tüm istemcileri gereksiz güncellemelerle boğması için de kolay bir yoldur.

Benim yorumum: çoğu ekip, yönetilen bir servisin gerçek sorunlarını zaten çözüp çözmediğini kontrol etmeden özel bir WebSocket sunucusuna yöneliyor, sonra Liveblocks veya PartyKit'in ilk günden sunduğu yeniden bağlanma yönetimini, interpolasyonu ve CRDT birleştirme mantığını haftalarca yeniden inşa ediyor. "Kendi altyapımıza sahip olmalıyız" daha ciddi bir mühendislik cevabı gibi duyulduğu için değil, yönetilen seçeneğin fiyatlandırması veya veri konumu koşulları size uymadığını doğruladıktan sonra özel çözüm kurun. Varlık özelliğiniz, yapay zeka tarafından üretilen öneriler veya içerik sunan daha büyük bir uygulamanın içindeyse, [yapay zeka özellikleri için durum yönetimi kalıpları](/tr/posts/yapay-zeka-ozelliklerinde-sessiz-hata-tuzaklari) varlığın yeniden bağlanma durumlarına da doğrudan uygulanıyor; buradaki taşıyıcı ödünleşimleri de [yapay zeka ajanları için API tasarımındaki](/tr/posts/yapay-zeka-ajanlari-icin-api-tasarimi) aynı araç tasarımı düşüncesini yansıtıyor.

## Sıkça Sorulan Sorular

### Canlı imleçler için hangi taşıyıcıyı kullanmalıyım?

2026'daki çoğu durumda WebSocket — iki yönlü, evrensel olarak destekleniyor ve imleç verisi için yeterince düşük gecikmeli. WebTransport aynı kullanım durumu için daha düşük gecikme sunabilir, ama tarayıcı desteği hâlâ önce Chromium'da; bu yüzden tek taşıyıcınız olarak değil, kademeli bir iyileştirme olarak kullanın.

### İmleç konum güncellemelerini ne sıklıkta göndermeliyim?

Gönderen tarafta saniyede yaklaşık 20-30 güncellemeye kısıtlayın, ardından alıcı tarafta alınan konumlar arasında interpolasyon yaparak hareketin akıcı görünmesini sağlayın. Her ham `mousemove` olayını göndermek bağlantıyı doldurur ve özelliği diğer herkes için gecikmeli hissettirir.

### Sadece imleç konumları için CRDT'ye ihtiyacım var mı?

Hayır — imleç konumları geçicidir ve yeniden bağlanmada basitçe sıfırdan kurulabilir. CRDT'ye, seçimler veya ortak düzenlemeler gibi, iki kullanıcı kısa süre senkron dışı kaldığında doğru biçimde birleşmesi gereken kalıcı paylaşılan durum için ihtiyacınız var.

### Kendi WebSocket varlık sunucumu mu kurmalıyım, yoksa yönetilen bir servis mi kullanmalıyım?

Zaten ölçekte soket altyapısı işletmiyorsanız veya karşılayamayacağı gereksinimleriniz yoksa yönetilen bir servis (Liveblocks, PartyKit veya benzeri) kullanın. Çoğu ekip, yönetilen servislerin zaten çözdüğü yeniden bağlanma yönetimi, ölçeklendirme ve CRDT birleştirme mantığının mühendislik maliyetini hafife alıyor.
