---
title: "Retry, Backoff ve Circuit Breaker"
slug: "retry-backoff-circuit-breaker"
translationKey: "retries-backoff-circuit-breakers"
locale: "tr"
excerpt: "Bağımlılık servisimiz 90 saniyeliğine yavaşladı, retry mantığımız onu tamamen düşürdü. Jitter'lı backoff olmadan retry'nin kendini nasıl yediğini anlatıyoruz."
category: "software-engineering"
tags: ["reliability", "backend", "best-practices", "sre"]
publishedAt: "2026-07-09"
seoTitle: "Retry, Backoff ve Circuit Breaker: Retry Storm'dan Kaçınma"
seoDescription: "Bağımlılık servisimiz 90 saniyeliğine yavaşladı, retry mantığımız onu tamamen düşürdü. Jitter'lı backoff olmadan retry'nin kendini nasıl yediğini anlatıyoruz."
---

Geçen çeyrekte bir downstream bağımlılık 90 saniyeliğine yavaşladı — çökmedi, sadece yavaşladı. Bizim istemci kodumuz sabit 2 saniyelik bir bekleme ile retry yapıyordu ve jitter yoktu. Binlerce eş zamanlı istemci aynı anda zaman aşımına uğradı, aynı anda 2 saniye bekledi, aynı anda tekrar denedi. Zaten zorlanan servise senkronize bir istek dalgası çarptı ve servis tamamen düştü. Bu yazı o retry storm'dan çıkardığımız notlar.

## Ne zaman retry, ne zaman fail-fast

Retry ve circuit breaker farklı problemler çözer. Retry, **geçici** hataları ele alır: ağ paketi kayboldu, sunucu anlık olarak meşguldü, tek seferlik bir zaman aşımı oldu. Circuit breaker ise **sistemik** hataları ele alır: bağımlılık gerçekten çökmüş ya da sürekli hata veriyor ve retry denemek durumu düzeltmeyecek, sadece kaynağı israf edecek.

Hangi hataların retry edilebilir olduğu net olmalı: ağ zaman aşımları (408), rate limit (429) ve geçici kullanılamazlık (503) genelde retry'e uygun. İstemci hataları (400 Bad Request) ve kimlik doğrulama hataları (401) asla retry edilmemeli — bunlar tekrar denemekle düzelmez. 500 Internal Server Error gri bir alan: yalnızca işlemin idempotent olduğunu biliyorsanız retry edin; aksi halde [idempotent API tasarımı yazımızda](/tr/posts/idempotent-api-tasarimi) anlattığımız gibi yan etkiyi çoğaltma riski taşırsınız.

## Exponential backoff ve jitter'ın matematiği

Temel formül basit: `min(max_delay, base_delay * 2^deneme_sayisi)`. Ama bu formülün tek başına ciddi bir kusuru var — sabit gecikmeler yük altında ölçeklenmiyor. 10.000 istemci aynı anda zaman aşımına uğrarsa ve hepsi aynı `2^deneme` süresini beklerse, hepsi aynı anda uyanıp aynı anda tekrar dener. Tam olarak bizim başımıza geleni.

Çözüm, gecikmeye rastgelelik (jitter) eklemek: `gecikme * (0.5 + rastgele(0, 0.5))`. AWS'nin dağıtık sistemler araştırmasına göre, [jitter'lı exponential backoff retry storm'ları %60-80 oranında azaltıyor](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/). Google Cloud istemci kütüphaneleri jitter'ı her zaman etkin tutuyor; .NET'in Polly v8+ kütüphanesi de `UseJitter = true` varsayılanını kullanıyor — bu artık endüstri standardı, opsiyonel bir iyileştirme değil.

```python
import random
import time

def backoff_with_jitter(attempt, base_delay=0.5, max_delay=20):
    delay = min(max_delay, base_delay * (2 ** attempt))
    jittered = delay * (0.5 + random.uniform(0, 0.5))
    time.sleep(jittered)
```

## Retry bütçeleri: kaç deneme yeterli, kaç deneme fazla

Retry'nin katmanlar arasında birikmesi de ayrı bir tuzak. İstemci uygulaması 3 kez retry yapıyor, önündeki API gateway de kendi 3 denemesini ekliyor, servis mesh'i de kendi retry politikasını uyguluyorsa, tek bir mantıksal istek arka planda 9 ila 27 fiziksel isteğe dönüşebilir. Her katmandaki retry sayısını görmeden "toplam retry maruziyeti" hesaplanamaz; bu yüzden retry politikasını tek bir katmanda merkezi tutmak (örneğin yalnızca servis mesh seviyesinde) ya da her katmanın kendi bütçesini açıkça loglaması gerekiyor.

Sınırsız retry, kendi başına bir kaynak tükenmesi saldırısına dönüşebilir. AWS SDK'ları varsayılan olarak 3 maksimum deneme ve 20 saniyelik maksimum backoff kullanıyor. Bunun ötesinde, servis seviyesinde bir **retry bütçesi** tanımlamak gerekir: toplam trafiğin %10-20'sini aşmayan bir token bucket, "kaç istek şu an retry durumunda" sorusunu sınırlar. Bir servis %100 çalışan bir dış bağımlılığa >100 istek/saniye gönderiyorsa, global bir retry bütçesi olmadan tek bir yavaşlama, retry'lerin kendisi yüzünden trafiği ikiye üçe katlayabilir.

## Circuit breaker: closed, open, half-open

Circuit breaker üç durum arasında geçiş yapar:

- **Closed**: Normal çalışma, istekler doğrudan geçer, hata oranı izlenir.
- **Open**: Hata oranı eşiği aştığında breaker açılır; bu durumda istekler bağımlılığa hiç gönderilmez, anında hata döner. Bu, zaten zorlanan bir servise ek yük bindirmeyi engeller.
- **Half-open**: Belirli bir süre sonra breaker sınırlı sayıda "deneme" isteğine izin verir. Bunlar başarılı olursa closed'a döner, başarısız olursa tekrar open'a geçer.

[Martin Fowler'ın klasik Circuit Breaker yazısında](https://martinfowler.com/bliki/CircuitBreaker.html) tanımlandığı gibi bu desen, "breaker açıkken retry'ler anında başarısız olmalı" ilkesini merkeze koyar — yani circuit breaker açıkken retry mantığınız hâlâ backoff bekliyorsa, breaker'ın amacını baltalıyorsunuz demektir. Half-open durumundaki deneme isteklerinin sayısını da bilinçli sınırlamak gerekir; tek bir başarılı deneme yeterli görülüp breaker hemen closed'a dönerse, henüz gerçekten toparlanmamış bir servise tam trafik hacmi aniden geri döner ve ikinci bir düşüşü tetikleyebilir.

| Bileşen | Ne yapar | Olmadan ne olur |
|---|---|---|
| Idempotency | Retry'nin yan etkiyi tekrarlamamasını garanti eder | Retry çift işlem yaratır |
| Backoff + jitter | Senkronize retry dalgalarını dağıtır | Retry storm, thundering herd |
| Retry bütçesi | Eş zamanlı retry sayısını sınırlar | Retry'lerin kendisi trafiği katlar |
| Circuit breaker | Zaten çökmüş bağımlılığa istek göndermeyi durdurur | Kaynak israfı, kademeli çökme (cascading failure) |
| Timeout | Bir isteğin ne kadar bekleyeceğini sınırlar | Bağlantı havuzu tükenir, tüm sistem yavaşlar |

## Varsayılan değerler ve anti-pattern listesi

Pratik varsayılanlar: base delay 200-500ms, maksimum 3-5 deneme, maksimum backoff 15-30 saniye, her zaman jitter açık. Circuit breaker için tipik eşik, 10 saniyelik pencerede %50 hata oranı, half-open'da 1-3 deneme isteği.

Kaçınılması gereken anti-pattern'ler: retry'yi timeout olmadan kullanmak (bir isteğin sonsuza kadar asılı kalmasına izin vermek), her katmanda ayrı ayrı retry yapmak (istemci retry yapar, API gateway de retry yapar, toplamda 3x3=9 istek gönderilir) ve circuit breaker durumunu izlememek (breaker sürekli açık kalıyor ama kimse fark etmiyor, bu da sessiz bir kesinti anlamına gelir). Bunlara bir dördüncüsünü ekleyebiliriz: circuit breaker eşiklerini bağımlılık bazında değil global olarak tanımlamak. Farklı bağımlılıkların farklı gecikme ve hata profilleri var; tek bir global eşik, düşük trafikli bir bağımlılıkta gereğinden hassas, yüksek trafikli birinde ise gereğinden toleranslı davranabilir.

Bence buradaki en büyük öğrenme şuydu: retry mantığını "hata oldu, bekle, tekrar dene" kadar basit görmek, sistemi göründüğünden çok daha kırılgan hale getiriyor ve bu kırılganlık ancak gerçek bir yük altında ortaya çıkıyor. Retry, backoff, jitter, bütçe ve circuit breaker birlikte tasarlanmalı; biri eksikse diğerleri de işe yaramıyor. [Rate limiting algoritmaları karşılaştırmamızda](/tr/posts/rate-limiting-algoritmalari) ele aldığımız gibi, bir rate limiter'ın kendisi de bu zincirin bir parçası — limitlenen istemci retry yapıyorsa, limitin ne kadar iyi tasarlandığı önemli hale geliyor. Gözlemlenebilirlik tarafında bu durumları nasıl izleyeceğinizi [Observability 101 yazımızda](/tr/posts/observability-nedir) bulabilirsiniz; mimari düzeyde bu desenlerin [mikroservis mi monolit mi kararıyla](/tr/posts/mikroservis-mi-monolit-mi) nasıl kesiştiğini de inceleyebilirsiniz.

Daha fazla mühendislik pratiği için [Yazılım Mühendisliği kategorisine](/tr/category/yazilim-muhendisligi) göz atın.

## Sıkça Sorulan Sorular

### Her HTTP hatası retry edilmeli mi?

Hayır. Yalnızca geçici olduğu bilinen hatalar (408, 429, 503 ve idempotent olduğunuz durumda 500) retry edilmeli. 400 ve 401 gibi istemci hataları asla retry edilmemeli çünkü tekrar denemek sonucu değiştirmez, sadece kaynağı israf eder.

### Circuit breaker kaç saniyede bir half-open'a geçmeli?

Bu bağımlılığın toparlanma süresine bağlı; tipik değer 10-30 saniye arasında başlayıp gözlemlenen toparlanma süresine göre ayarlanır. Çok kısa bir süre breaker'ı gereksiz yere sık sık test moduna sokar, çok uzun bir süre gereksiz kesinti süresini uzatır.

### Jitter olmadan sadece exponential backoff yeterli değil mi?

Tek bir istemci için yeterli olabilir ama binlerce eş zamanlı istemci varsa değil. Jitter olmadan hepsi aynı anda zaman aşımına uğrar, aynı süreyi bekler ve aynı anda tekrar dener — bu tam olarak retry storm'un sebebi.

### Retry bütçesini nasıl hesaplarım?

Toplam trafiğinizin normal saatlerdeki hacmine göre bir yüzde belirleyin (yaygın pratik %10-20) ve bunu bir token bucket olarak uygulayın. Bütçe tükendiğinde yeni retry'ler reddedilir, böylece bir yavaşlama anında retry'lerin kendisi trafiği katlamaz.
