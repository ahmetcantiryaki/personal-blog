---
title: "PWA 2026'da Hâlâ Mantıklı mı?"
slug: "pwa-2026da-hala-mantikli-mi"
translationKey: "pwa-in-2026-still-worth-it"
locale: "tr"
excerpt: "Service worker'lar, push bildirimleri, offline mod — PWA'lar çok yol kat etti. Peki iOS hâlâ nerede sınırlıyor ve ne zaman native uygulama kazanıyor?"
category: "web-development"
tags: ["frontend", "performance", "web-standards"]
publishedAt: "2026-08-02"
seoTitle: "PWA 2026'da Hâlâ Mantıklı mı? Karar Rehberi"
seoDescription: "Service worker'lar, push bildirimleri, offline mod — PWA'lar çok yol kat etti. Peki iOS hâlâ nerede sınırlıyor ve ne zaman native uygulama kazanıyor?"
---

Bir müşteriniz "native uygulama mı yoksa web uygulaması mı yapalım" diye sorduğunda, 2026'da bu artık eskisi kadar basit bir soru değil. Progressive web app'ler (PWA) kurulabilirlik, offline çalışma, push bildirimleri ve donanım API'lerine erişim konusunda ciddi mesafe kat etti. Ama iOS/Safari tarafındaki sınırlamalar hâlâ duruyor ve bazıları geçen yıl daha da sıkılaştı. Bu yazı, hangi uygulama türü için PWA'nın hâlâ doğru seçim olduğunu netleştiriyor.

## Modern PWA'lar Ne Yapabiliyor

Bir PWA'nın temelini iki teknoloji oluşturuyor: Web App Manifest (uygulamanın ana ekrana kurulmasını, simgesini ve görünümünü tanımlayan bir JSON dosyası) ve service worker (ağ isteklerini yakalayıp önbellekleyen, arka planda çalışan bir script). Bu ikili birlikte şunu sağlıyor: kurulabilirlik (ana ekrana eklenip native bir uygulama gibi açılma), offline çalışma (önbelleklenen içeriğin internetsiz erişilebilir olması), push bildirimleri ve dosya sistemi/donanım API'lerine sınırlı erişim (kamera, konum, paylaşım hedefi gibi).

Basit bir service worker kaydı hâlâ birkaç satırla kurulabiliyor:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    console.log('Service worker kaydedildi:', registration.scope);
  });
}
```

Manifest dosyası ise tarayıcıya "bu bir kurulabilir uygulama" sinyalini veriyor:

```json
{
  "name": "Örnek Uygulama",
  "short_name": "Örnek",
  "start_url": "/?source=pwa",
  "display": "standalone",
  "background_color": "#fdfcf9",
  "theme_color": "#123338",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

`display: standalone` ayarı, uygulamanın tarayıcı çubuğu olmadan native bir uygulama gibi açılmasını sağlıyor — kullanıcı deneyimi açısından PWA'yı native'den ayırt etmeyi zorlaştıran en önemli detaylardan biri bu.

## iOS/Safari Hâlâ Nerede Sınırlıyor

Android tarafında PWA'lar artık native uygulamalara çok yakın bir deneyim sunuyor. Ama iOS/Safari tarafında tablo farklı:

- **Push bildirimleri:** iOS 16.4 ve üzerinde Push API ve Notification API üzerinden çalışıyor, ama tek bir kritik kısıtla — sadece PWA ana ekrana kurulduğunda çalışıyor; bir tarayıcı sekmesi izin verilse bile push alamıyor.
- **AB kısıtlaması:** Apple, Dijital Pazarlar Yasası (DMA) kapsamında AB'de bağımsız PWA desteğini kaldırdı; AB ülkelerinde PWA'lar artık Safari sekmelerinde push desteği olmadan açılıyor.
- **Depolama sınırları:** Safari, Cache API depolamasına 50MB'lık sert bir sınır koyuyor ve cihaz depolaması azaldığında agresif bir şekilde önbelleği temizliyor.
- **Arka plan senkronizasyonu yok:** iOS Safari, background sync desteği sunmuyor; bu da offline'da yapılan değişikliklerin senkronize edilmesini zorlaştırıyor.

Bu sınırların pratik etkisi şu: push bildirimlerine ulaşılabilir kitle, çok adımlı kurulum süreci de hesaba katıldığında native uygulama push'una göre kabaca 10-15 kat daha küçük kalıyor. Bir işletme için push bildirimi kritik bir kullanıcı geri kazanım kanalıysa, bu fark göz ardı edilemez.

## Kurulum Sürtünmesi ve Keşfedilebilirlik

PWA'ların en büyük dezavantajı, App Store veya Google Play'de listelenmemeleri — kullanıcı bir PWA'yı "keşfetmez", ona bir bağlantı üzerinden ulaşır ve manuel olarak ana ekrana ekler. Bu ekstra adım, kurulum oranını native uygulamalara göre belirgin şekilde düşürüyor. App store keşfedilebilirliği hâlâ büyük ölçüde native uygulamaların lehine; bu, özellikle organik keşfe dayanan tüketici uygulamaları için önemli bir dezavantaj.

## PWA vs Native vs Capacitor/Tauri Sarmalayıcılar

Üç yol arasındaki farkı netleştirmek karar vermenizi kolaylaştırır:

| Kriter | PWA | Capacitor/Tauri Sarmalayıcı | Tam Native |
| --- | --- | --- | --- |
| Geliştirme maliyeti | En düşük (tek kod tabanı) | Orta (tek kod tabanı + native köprü) | En yüksek (platform başına ayrı) |
| App store dağıtımı | Yok (iOS'ta kısıtlı) | Var | Var |
| Donanım API erişimi | Sınırlı | Geniş (native eklentiler üzerinden) | Tam |
| Push bildirimi (iOS) | Kısıtlı, kurulum şartlı | Native düzeyde | Native düzeyde |
| Güncelleme hızı | Anında (deploy = güncelleme) | App store onay süreci gerekebilir | App store onay süreci gerekli |

Tauri ve Electron arasındaki masaüstü kararına dair daha fazla ayrıntı için [Tauri mi Electron mu karşılaştırmamıza](/tr/posts/tauri-mi-electron-mu) bakabilirsiniz; benzer mantık mobil sarmalayıcılar için de geçerli.

## Karar Çerçevesi: Uygulama Türüne Göre

Aşağıdaki basit çerçeve, çoğu proje için doğru yönü gösteriyor:

- **İçerik/bilgi odaklı uygulamalar (haber, blog, e-ticaret vitrin):** PWA neredeyse her zaman doğru seçim. Core Web Vitals'a uygun hızlı bir PWA, hem SEO hem kullanıcı deneyimi açısından native'e göre daha az sürtünmeyle daha geniş kitleye ulaşır — bir PWA normal bir web sayfası gibi indekslenebilir ve aranabilirken, native bir uygulama app store dışında keşfedilemez.
- **Push bildiriminin kritik olduğu tüketici uygulamaları (sosyal, mesajlaşma):** Native veya Capacitor/Tauri sarmalayıcı tercih edin; iOS push kısıtlamaları burada gerçek bir iş kaybı yaratabilir.
- **Kurumsal/dahili araçlar:** PWA genelde ideal — kullanıcılar zaten bir bağlantı üzerinden erişiyor, app store onay sürecine ihtiyaç yok, güncellemeler anında yayılıyor.
- **Yoğun donanım erişimi gereken uygulamalar (kamera işleme, arka plan konumu):** Tam native veya güçlü bir sarmalayıcı gerekiyor; PWA'nın donanım API erişimi bu senaryolar için hâlâ yetersiz.

Benim görüşüm şu ki "PWA mı native mi" sorusunu tek bir cevapla kapatmaya çalışmak yanlış çerçeve; asıl soru "bu uygulamanın hangi özelliği olmazsa olmaz" sorusu ve cevap onu yanıtlıyor.

Bunun ötesinde, hibrit bir yaklaşım da giderek daha yaygın: bir ürün PWA olarak başlayıp, kullanıcı tabanı büyüdükçe ve push bildirimi veya derin donanım erişimi gerçek bir ihtiyaç haline geldikçe Capacitor gibi bir sarmalayıcıyla app store'a taşınıyor. Bu, erken aşamada geliştirme hızını korurken, ürün olgunlaştıkça platform sınırlamalarını aşmanın maliyetini erteleyen makul bir strateji. Erken karar vermek zorunda değilsiniz — asıl önemli olan, bugünkü kısıtların yarın sizi köşeye sıkıştırmayacağından emin olmak.

PWA performansını Core Web Vitals açısından değerlendirmek isteyenler [Core Web Vitals kontrol listemize](/tr/posts/core-web-vitals-kontrol-listesi) bakabilir; render stratejinizi netleştirmek için [SSR, SSG ve ISR farkını](/tr/posts/ssr-ssg-isr-farki) inceleyebilirsiniz. Framework kararınızı henüz vermediyseniz [Astro mu Next.js mi karşılaştırmamız](/tr/posts/astro-mu-nextjs-mi) da faydalı olacaktır.

## PWA mı Değil mi Kontrol Listesi

```text
1. Push bildirimi kritik bir özellik mi? (Evet ise iOS kısıtlamalarını değerlendirin)
2. App store keşfedilebilirliğine ihtiyacınız var mı?
3. Kamera/konum gibi derin donanım erişimi gerekiyor mu?
4. Kurumsal/dahili bir araç mı, yoksa tüketici uygulaması mı?
5. Anında güncelleme (app store onayı olmadan) sizin için önemli mi?
```

Cevaplarınızın çoğu "hayır" ise, PWA muhtemelen en verimli yol. Web geliştirme kategorisindeki diğer içerikler için [Web Geliştirme bölümümüzü](/tr/category/web-gelistirme) takip edebilirsiniz.

## Sıkça Sorulan Sorular

### PWA'lar 2026'da iOS'ta gerçekten çalışıyor mu?

Evet ama sınırlı: service worker'lar ve offline mod çalışıyor, push bildirimleri iOS 16.4+ üzerinde ana ekrana kurulmuş PWA'larda destekleniyor. AB'de ise Apple'ın DMA uyumu nedeniyle bağımsız PWA desteği kaldırıldı, bu bölgede PWA'lar Safari sekmelerinde push olmadan açılıyor.

### PWA push bildirimi native uygulama kadar etkili mi?

Hayır. Kurulum sürtünmesi ve iOS kısıtlamaları nedeniyle ulaşılabilir kitle, native push'a göre kabaca 10-15 kat daha küçük kalıyor. Push kritikse bu farkı göz önünde bulundurun.

### Küçük bir ekip için PWA mı Capacitor mı daha mantıklı?

Donanım erişimine ve app store varlığına ihtiyacınız yoksa PWA daha az geliştirme yüküyle daha hızlı sonuç verir. App store'da yer almanız gerekiyorsa Capacitor, tek kod tabanını korurken bu ihtiyacı karşılar.

### PWA'dan native'e geçiş kolay mı?

Web tarafındaki iş mantığınızı ve arayüzünüzü büyük ölçüde koruyarak Capacitor gibi bir sarmalayıcıyla app store'a taşınabilirsiniz; bu, sıfırdan native yazmaktan çok daha az maliyetli bir orta adım.
