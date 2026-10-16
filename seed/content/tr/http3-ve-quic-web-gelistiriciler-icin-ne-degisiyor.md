---
title: "HTTP/3 ve QUIC: Web Geliştiriciler İçin Ne Değişiyor?"
slug: "http3-ve-quic-web-gelistiriciler-icin-ne-degisiyor"
translationKey: "http3-quic-web-developers-2026"
locale: "tr"
excerpt: "HTTP/3, head-of-line engellemeyi kaldırır, bağlantı kurulumunu hızlandırır; ama sitelerin yalnızca %34'ü sunuyor, asıl engel sunucu yapılandırması."
category: "web-development"
tags: ["web-performance", "web-standards", "backend"]
publishedAt: "2026-10-16"
seoTitle: "HTTP/3 ve QUIC: Web Geliştiriciler İçin Ne Değişiyor?"
seoDescription: "HTTP/3, head-of-line engellemeyi kaldırır, bağlantı kurulumunu hızlandırır; ama sitelerin yalnızca %34'ü sunuyor, asıl engel sunucu yapılandırması."
---

Kısa cevap: HTTP/3, TCP tabanlı HTTP/2'de hâlâ var olan head-of-line engellemeyi kaldırır ve taşıma ile TLS el sıkışmasını tek bir round trip'te birleştirerek bağlantı kurulum süresini kısaltır. Tarayıcı desteği zaten evrensel — 2026 ortası itibarıyla %95'in üzerinde — ama web'in en çok trafik alan sitelerinin yalnızca yaklaşık üçte biri bunu gerçekten sunuyor; çünkü asıl engel artık tarayıcı uyumluluğu değil, sunucu ve CDN yapılandırması.

## QUIC nedir ve TCP'den farkı ne?

QUIC, TCP yerine UDP üzerine kurulmuş bir taşıma protokolüdür; HTTP/3 ise TCP üzerinde değil, QUIC üzerinde çalışan HTTP'dir. Pratik fark iki noktada ortaya çıkıyor. Birincisi, bağlantı kurulumu: TCP + TLS 1.3, herhangi bir veri hareket etmeden önce iki round trip gerektirirken, QUIC taşıma ve şifreleme el sıkışmasını bire indiriyor ve bilinen bir bağlantıyı sıfır round trip'te devam ettirebiliyor. İkincisi ve gerçek dünya performansı için daha önemlisi: QUIC bağımsız akışları çoklular, böylece kaybolan tek bir paket sadece ait olduğu akışı bloke eder, bağlantıyı paylaşan diğer tüm istekleri değil — bu, birden fazla akışı paylaşan bir bağlantıda HTTP/2 over TCP'yi hâlâ etkileyen head-of-line engelleme problemidir.

## HTTP/3 şu an gerçekten her yerde destekleniyor mu?

Tarayıcı desteği evet; sunucu tarafı desteği henüz değil. Temmuz 2026 itibarıyla, aktif kullanımdaki tarayıcıların %95'inden fazlası — masaüstü ve mobil Chrome, Firefox, Safari ve Edge dahil — HTTP/3'ü destekliyor; bu konu bir süredir çözülmüş durumda. Boşluk sunucu tarafında: Mart 2026'da en çok trafik alan 1 milyon sitenin taraması, %34'ünün HTTP/3 sunduğunu buldu — yıllık bazda 8 puan artış — ve benimseme oranı hosting türüne göre çarpıcı şekilde ayrışıyor.

| Hosting türü | HTTP/3 benimsenme oranı |
|---|---|
| Cloudflare üzerinden sunulan siteler | ~%98 |
| Google üzerinden sunulan siteler | ~%96 |
| CDN'siz origin sunucular | ~%2,3 |

Bu tablo gerçek hikâyeyi gösteriyor: bugün HTTP/3 benimsenmesi neredeyse tamamen sitenin önünde hangi CDN'nin olduğuna bağlı, kendi yığınının bunu destekleyip desteklemediğine değil. Büyük bir CDN'nin arkasında değilsen ve kendin yapılandırmadıysan, şu an HTTP/3 sunma olasılığın sıfıra yakın.

## HTTP/3'ü kendi altyapında gerçekte nasıl etkinleştirirsin?

Cloudflare, Fastly veya benzer bir CDN'nin arkasındaysan, HTTP/3 büyük olasılıkla zaten açık — yapılandırma yazmak yerine panelde bir anahtarı kontrol et. Kendi origin sunucunu işletiyorsan, Nginx 1.25 sürümünde kararlı HTTP/3 desteği eklendi; güncel dağıtım rehberlerinin çoğu bu sürüme işaret ediyor. HTTP/1.1 ve HTTP/2'nin yanında HTTP/3 sunan minimal bir Nginx yapılandırması şöyle görünür:

```nginx
server {
    listen 443 quic reuseport;
    listen 443 ssl;
    http2 on;

    ssl_certificate     /etc/ssl/certs/example.com.pem;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    add_header Alt-Svc 'h3=":443"; ma=86400';
}
```

`Alt-Svc` başlığı, HTTP/1.1 veya HTTP/2 üzerinden zaten bağlanmış bir tarayıcıya HTTP/3'ün kullanılabilir olduğunu söyler; böylece tarayıcı bir sonraki istekte yükseltme yapabilir. Bu başlık olmadan istemcilerin origin sunucunda QUIC desteğini keşfetmesinin bir yolu yok.

## HTTP/3'e geçmek gerçekten ölçülebilir bir fark yaratıyor mu?

Kazanımlar gerçek ama iş yüküne bağlı. Bağlantı kurulumundaki tasarruf en çok yüksek gecikmeli veya paket kaybı olan bağlantılarda önemli — mobil ağlar, uzun coğrafi rotalar, paket kaybı olan her şey — burada QUIC'in tek round trip'lik el sıkışması ve akış bazlı kayıp izolasyonu, HTTP/2'yi zorlayan yeniden iletim duraklamalarından kurtarır. Birkaç kaynağı yükleyen hızlı, düşük gecikmeli kablolu bir bağlantıda fark genelde fark edilmeyecek kadar küçük. Trafiğinin büyük kısmı değişken hücresel bağlantılardaki mobil kullanıcılardan geliyorsa, HTTP/3'e öncelik vermeye değer; trafiğin çoğunlukla birkaç milisaniye uzaklıktaki bir CDN edge düğümüne ulaşan sabit geniş bantta masaüstü kullanıcılarındansa, kazanım daha küçük.

## HTTP/3 mevcut HTTP/1.1 ve HTTP/2 istemcilerini bozar mı?

Hayır, doğru yapılandırıldığında bozmaz. HTTP/3 ek bir protokol olarak sunulur, yerine geçen bir protokol değil; yukarıdaki Nginx örneğinde görüldüğü gibi aynı sunucu hem `listen 443 ssl` (HTTP/1.1 ve HTTP/2 için) hem de `listen 443 quic` (HTTP/3 için) satırlarını aynı anda taşır. HTTP/3'ü desteklemeyen eski bir istemci veya kurumsal proxy, sorunsuz şekilde HTTP/2'ye düşer; `Alt-Svc` başlığı sadece destekleyen istemcilere bir yükseltme seçeneği sunar, zorunlu kılmaz. Bu kademeli geçiş modeli, HTTP/3'ü riskli bir anahtar çevirme işlemi değil, düşük riskli bir ek yapılandırma haline getirir.

## Production'da HTTP/3'ü etkinleştirmeden önce neyi kontrol etmelisin?

CDN'inin veya load balancer'ının `Alt-Svc` başlığını doğru şekilde geçirdiğini doğrula; trafik yolundaki bir güvenlik duvarının veya kurumsal ağ politikasının UDP 443 portunu engellemediğinden emin ol (bazı kısıtlayıcı ağlar standart olmayan desenlerde hâlâ UDP'yi engelliyor) ve izleme veya APM aracının HTTP/3 bağlantılarını gerçekten ayırt ettiğini kontrol et — bazı eski gözlemlenebilirlik kurulumları QUIC trafiğini hâlâ "bilinmeyen" protokol olarak gruplar; bu da dağıtımın etkisini ölçmek için gereken veriyi gizler.

```text
HTTP/3 dağıtım kontrol listesi
[ ] CDN'in HTTP/3 desteğini doğrula (panel anahtarını kontrol et)
[ ] Kendi sunucundaysan: quic listener yapılandırılmış Nginx 1.25+
[ ] Alt-Svc başlığı mevcut ve her proxy/LB tarafından geçiriliyor
[ ] UDP/443, güvenlik duvarı veya kurumsal ağ tarafından engellenmiyor
[ ] İzleme, HTTP/3 trafiğini HTTP/2'den ayrı etiketliyor
[ ] Mobil ve masaüstü segmentlerde gecikmeyi ayrı ayrı A/B ölç
```

## QUIC'in sıfır round trip'lik devam ettirmesi yeni bir risk getiriyor mu?

Evet, etkinleştirmeden önce bilmeye değer. QUIC'in 0-RTT devam ettirmesi, geri dönen bir istemcinin sunucu el sıkışmayı onaylamadan önce ilk paketinde veri göndermesine izin verir — bu hız için harika ama bu ilk paketin, onu yakalayan bir saldırgan tarafından tekrar oynatılabileceği anlamına gelir; taze bir TLS 1.3 el sıkışmasından farklı olarak. Standart önlem, 0-RTT'yi yalnızca idempotent isteklere (sunucu durumunu değiştirmeyen bir GET) izin vermek ve veri yazan her şey için reddetmektir — bu, bir zaman aşımı sonrası idempotent olmayan bir HTTP isteğini yeniden denerken uygulayacağın aynı dikkattir. Çoğu CDN ve Nginx'in QUIC modülü bu kısıtlamayı varsayılan olarak uygular; ama kendi QUIC sonlandırmanı kuruyorsan, bunu varsaymak yerine kontrol etmeye değer bir ayar.

## Sıkça Sorulan Sorular

### HTTP/3 ile HTTP/2 arasındaki ana fark nedir?

HTTP/2, TCP üzerinde çalışır; bu nedenle kaybolan tek bir paket, o TCP bağlantısını paylaşan tüm akışları bloke edebilir (head-of-line engelleme). HTTP/3, UDP tabanlı bir taşıma olan QUIC üzerinde çalışır; bu, her akışı izole eder, böylece paket kaybı sadece ait olduğu akışı etkiler, ve taşıma ile TLS el sıkışmasını daha az round trip'te birleştirir.

### 2026'da tüm tarayıcılar HTTP/3'ü destekliyor mu?

Tarayıcı desteği fiilen evrensel: 2026 ortası itibarıyla, aktif kullanımdaki tarayıcıların %95'inden fazlası — masaüstü ve mobilde Chrome, Firefox, Safari ve Edge'in güncel sürümleri dahil — HTTP/3'ü destekliyor. Benimseme boşluğu neredeyse tamamen sunucu tarafında, tarayıcı tarafında değil.

### CDN kullanmıyorsam HTTP/3'ü nasıl etkinleştiririm?

Kararlı HTTP/3 desteği ekleyen Nginx 1.25 veya üstüne yükselt, 443 portunda bir `quic` listener yapılandır ve tarayıcıların HTTP/3'ün kullanılabilir olduğunu bilmesi için bir `Alt-Svc` yanıt başlığı ekle. CDN olmadan, UDP tabanlı QUIC el sıkışmasından ve sertifika kurulumundan kendin sorumlu olursun.

### HTTP/3'ü her site için etkinleştirmeye değer mi?

En çok yüksek gecikmeli veya mobil ağırlıklı trafikte yardımcı olur; burada QUIC'in daha hızlı el sıkışması ve akış bazlı kayıp izolasyonu, yeniden iletim duraklamalarını önler. Çoğunlukla zaten yakın bir CDN edge düğümünden sunulan, sabit geniş bantta masaüstü kullanıcıları olan siteler için ölçülebilir fark genelde küçüktür.

İlgili web performansı içerikleri için [edge fonksiyonları ve render](/tr/posts/edge-fonksiyonlari-render-rehberi), [örnekleme ile gözlemlenebilirlik faturanı nasıl kesersin](/tr/posts/gozlemlenebilirlik-faturasini-dusur) ve [Next.js Partial Prerendering'i ne zaman kullan](/tr/posts/nextjs-partial-prerendering-kullanim) yazılarımıza bakabilirsin. Daha fazlası için [Web Geliştirme kategorisine](/tr/category/web-gelistirme) göz atabilirsin.

Kaynaklar: [Wikipedia'nın HTTP/3 tarayıcı ve site benimsenmesi maddesi](https://en.wikipedia.org/wiki/HTTP/3), [enterno.io'nun Mart 2026 HTTP/3 benimsenme taraması](https://enterno.io/en/s/research-http3-quic-adoption-2026) ve [administrator.de'nin HTTP/3 standardizasyonu üzerine yazısı](https://administrator.de/en/http3-officially-adopted-as-a-standard-3018207274.html).
