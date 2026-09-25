---
title: "Geri Basınç ve Yük Atma: Servisi Ayakta Tutmak"
slug: "geri-basinc-yuk-atma-servis"
translationKey: "backpressure-load-shedding-2026"
locale: "tr"
excerpt: "Talep kapasiteyi aştığında servis çökmesin diye iki araç var: geri basınç yukarı akışı yavaşlatmayı sinyaller, yük atma düşük öncelikli isteği reddeder."
category: "software-engineering"
tags: [reliability, system-design, sre, performance]
publishedAt: "2026-09-25"
seoTitle: "Geri Basınç ve Yük Atma Nedir? Aşırı Yükte Hayatta Kalma"
seoDescription: "Geri basınç ve yük atma, talep kapasiteyi aştığında servisi ayakta tutan iki farklı mekanizma. Sınırlı kuyruk, admission control ve gözlem sinyalleri."
---

Kısa cevap: Talep, servisin işleyebileceği kapasiteyi aştığında iki araç devreye girer — geri basınç (backpressure) yukarı akıştaki gönderene "yavaşla" sinyali verir, yük atma (load shedding) ise düşük öncelikli isteği kuyruğa hiç almadan baştan reddeder. İkisi birlikte kullanıldığında servis, aşırı yük altında yavaşlamak yerine öngörülebilir biçimde bozulur.

## Talep kapasiteyi aştığında gerçekte ne olur?

Kuyruklar büyür, gecikme (latency) katlanarak artar ve zamanla kademeli çöküşe (cascading failure) dönüşür. Sınırsız bir kuyruk, gelen her isteği kabul ettiği için normal görünür — ama kuyrukta bekleme süresi arttıkça istemciler zaman aşımına uğrar, yeniden dener ve bu yeni istekler zaten dolu olan kuyruğa eklenir. Bu geri besleme döngüsü "bufferbloat" olarak bilinir: kuyruk boşalmaz, çünkü boşalan her yer anında yeni bir retry ile doluyor.

Kademeli çöküş, tek bir aşırı yüklü servisin arkasındaki bağımlı servisleri de düşürmesiyle oluşur. Bir servis timeout'a uğrayınca çağıran servis yeniden dener, bu da yukarı akışa ekstra yük bindirir; sistem bir noktadan sonra kendi kendini besleyen bir talep patlamasına dönüşür.

## Geri basınç tam olarak nasıl çalışıyor?

Geri basınç, alıcının kapasite durumunu göndericiye açıkça bildirmesiyle çalışır — böylece gönderici, alıcı boğulmadan önce hızını düşürür. Bunun üç somut mekanizması var: sınırlı kuyruklar (bounded queue), akış kontrolü (flow control) sinyalleri ve reaktif akışlarda (reactive streams) talep tabanlı çekme modeli.

Sınırlı bir kuyrukta, kapasite dolduğunda yeni istekler kuyruğa alınmaz; bunun yerine gönderene hemen bir hata veya "meşgul" sinyali döner. Bu, sınırsız kuyruğun aksine, doluluk durumunu gizlemek yerine erken ve açık şekilde bildiriyor. Servis mesh'leri (service mesh) veya RPC katmanları üzerinden dağıtık geri basınç yayılımı, kapasite bilgisini birkaç atlama (hop) öteye kadar taşıyabiliyor — böylece üçüncü bir servis, ikinci servisin dolu olduğunu ilk servise ulaşmadan önce öğrenebiliyor.

## Yük atma geri basınçtan nasıl farklı?

Yük atma, kapasiteyi korumak için isteği kuyruğa hiç almadan, girişte (admission control) reddeder veya düşürür. Geri basınç "yavaşla" derken, yük atma "şimdi değil, hiç" der — ayırt edici fark, kuyruğa alıp beklemek yerine anında karar vermek.

Pratikte kullanılan yük atma stratejileri şunlar: rastgele erken tespit (Random Early Detection, RED), gecikme kontrollü (Controlled Delay, CoDel), öncelik tabanlı atma ve giriş noktasında admission control. Öncelik tabanlı bir LoadShedder, servis girişinde kapasite bazlı ve önceliğe duyarlı kabul kontrolü yapar; kritik akışların gecikmesini korumak için düşük öncelikli işi önce atar ve kritik istekler için ayrılmış bir kapasite rezervi tutar.

| Mekanizma | Ne yapar | Ne zaman devreye girer |
|---|---|---|
| Sınırlı kuyruk | Kapasite dolunca yeni isteği reddeder | Kuyruk kapasiteye ulaştığında |
| Akış kontrolü sinyali | Göndericiye yavaşlama talebi iletir | Alıcı işleme hızı düşerken |
| Admission control | İsteği kuyruğa almadan girişte reddeder | Her istek kapasite kontrolünden geçerken |
| Öncelik tabanlı atma | Düşük öncelikli işi önce düşürür | Kapasite kritik eşiğin altına inince |
| Kesme noktası (deadline) | Süresi dolan isteği işlemeden bırakır | İstek, kalan süre bütçesini aştığında |

## Deadline yayılımı (deadline propagation) neden önemli?

Çünkü bir isteğin toplam süre bütçesini, çağrı zincirindeki her servise iletmezseniz, zaten anlamsız hale gelmiş bir isteği işlemeye devam edersiniz. İstemci 2 saniye sonra vazgeçmişse ama üçüncü servis hâlâ o isteği işliyorsa, harcanan CPU ve bellek boşa gitmiş demektir — deadline'ı zincirin başından sonuna kadar taşımak, bu israfı önler.

Aşağıdaki basitleştirilmiş TypeScript örneği, gelen bir isteğin kalan süre bütçesini bir sonraki servise nasıl aktarabileceğini gösteriyor:

```typescript
interface RequestContext {
  deadlineMs: number // epoch zaman damgası
}

function shouldProcess(ctx: RequestContext): boolean {
  const remaining = ctx.deadlineMs - Date.now()
  return remaining > MIN_PROCESSING_BUDGET_MS
}

async function callDownstream(ctx: RequestContext, payload: unknown) {
  if (!shouldProcess(ctx)) {
    throw new DeadlineExceededError()
  }
  return fetch(DOWNSTREAM_URL, {
    method: "POST",
    headers: { "x-deadline-ms": String(ctx.deadlineMs) },
    body: JSON.stringify(payload),
  })
}
```

Burada `x-deadline-ms` başlığı, bir sonraki servise "bu isteğe ne kadar süre kaldığını" taşıyor; her servis kendi işleme süresini bu bütçeden düşerek karar veriyor. Retry ve circuit breaker mekanizmaları da benzer bir bütçe mantığıyla çalışıyor; bu ikisini [Retry, Backoff ve Circuit Breaker yazımızda](/tr/posts/retry-backoff-circuit-breaker) ayrıntılı ele alıyoruz.

## "Brownout modu" nedir, normal moddan farkı ne?

Brownout modu, servisin tamamen çökmek yerine bilinçli olarak daha az iş yaptığı, kontrollü bir bozulma (graceful degradation) durumudur. Örneğin bir e-ticaret sitesi aşırı yük altında ürün önerilerini, kişiselleştirilmiş banner'ları veya ikincil API çağrılarını geçici olarak kapatıp yalnızca "sepete ekle" ve "ödeme" akışını canlı tutabilir.

Bunun rate limiting'den farkı, brownout'un istekleri reddetmek yerine isteğin maliyetini düşürmesi — kullanıcı hâlâ bir yanıt alıyor, sadece daha "ucuz" bir yanıt. Token bucket ve sliding window gibi rate limiting algoritmalarını [bu konudaki yazımızda](/tr/posts/rate-limiting-algoritmalari) karşılaştırdık; rate limiting genellikle istemci başına adil kullanımı sınırlarken, yük atma tüm sistemin kapasitesini korumaya odaklanıyor.

## Hangi gözlem sinyallerini izlemelisiniz?

Dört sinyal, aşırı yükün erken belirtisi: kuyruk derinliği (queue depth), p99 gecikme, retry oranı ve reddedilen istek oranı. Kuyruk derinliği aniden artıyorsa ve retry oranı da eş zamanlı yükseliyorsa, bu genellikle bir geri besleme döngüsünün başladığının işareti — yük atmayı devreye sokmak için beklemek yerine bu noktada müdahale etmek gerekiyor.

Bize göre ekiplerin en sık yaptığı hata, bu sinyalleri izlemeye yalnızca üretimde bir kesinti yaşandıktan sonra başlamaları. Chaos engineering pratiği, bu sinyalleri gerçek bir kesinti olmadan önce test etmenin en ucuz yolu; küçük ekipler için nasıl başlanacağını [Chaos Engineering yazımızda](/tr/posts/kucuk-ekipler-icin-chaos-engineering) anlatıyoruz.

## Bir kesinti hikayesi: yük atma olsaydı ne değişirdi?

2025 sonunda orta ölçekli bir SaaS ekibinin yaşadığı tipik bir senaryoyu düşünün: bir pazarlama kampanyası beklenmedik şekilde viral oldu, trafik 10 dakikada 4 kata çıktı. Sistemde sınırsız bir kuyruk vardı, bu yüzden gelen her istek kabul edildi — ama işleme hızı sabit kaldığı için kuyruk derinliği dakikada binlerce isteğe ulaştı. İstemciler 30 saniyede zaman aşımına uğrayıp yeniden denedi, bu da kuyruğa ikinci bir dalga ekledi. 40 dakika içinde tüm servis, gerçek kapasitesinin çok altında bir trafikte bile yanıt veremez hale geldi.

Eğer sistemde admission control tabanlı bir yük atma katmanı olsaydı, kuyruk belirli bir derinliğe ulaştığında düşük öncelikli istekler (örneğin analytics çağrıları, öneri motoru istekleri) anında reddedilir, "sepete ekle" ve "ödeme" gibi kritik akışlar için kapasite korunurdu. Kullanıcıların bir kısmı bir hata mesajı görürdü, ama sistemin tamamı çökmezdi — bu, "herkes için yavaş" ile "çoğu için hızlı, bazıları için net bir hata" arasındaki fark.

## Servis mesh'i olmayan basit bir sistemde nereden başlamalı?

Kısa cevap: Önce sınırlı kuyruk, sonra admission control. Servis mesh'i veya karmaşık bir dağıtık sistem kurmadan önce bile, tek bir servisin önüne kapasiteye dayalı basit bir admission control katmanı eklemek (örneğin gelen istek sayısı işlem hızının belirli bir katını aştığında 503 döndürmek) çoğu küçük ekip için yeterli bir ilk adım. Deploy stratejinizin bu tür bir kapasite testine nasıl entegre edileceğini [Blue-Green mi Canary mi Deployment yazımızda](/tr/posts/blue-green-mi-canary-mi) da ele aldık — kademeli trafik artışı, yük atma eşiklerini üretime almadan önce test etmenin güvenli bir yolu.

## Sıkça Sorulan Sorular

### Geri basınç mı yoksa yük atma mı önce uygulanmalı?

Kısa cevap: Genellikle ikisi birlikte, ama geri basınç önce devreye girer. Geri basınç yukarı akışı yavaşlatarak kuyruğun büyümesini önler; kuyruk yine de kapasiteyi aşarsa yük atma devreye girip düşük öncelikli isteği baştan reddeder.

### Sınırlı kuyruk boyutunu nasıl belirlerim?

Kısa cevap: Kuyruk boyutunu, kabul edilebilir maksimum gecikme bütçenizden geriye doğru hesaplayın — kuyruktaki her istek, işlenmeyi beklerken kendi süre bütçesini tüketiyor, bu yüzden çok büyük bir kuyruk yalnızca "geç ama başarılı" yanıtlar üretir.

### Yük atma kullanıcı deneyimini kötüleştirmez mi?

Kısa cevap: Doğru uygulandığında hayır — çünkü hedef, tüm kullanıcıları eşit derecede yavaşlatmak yerine kritik olmayan isteği erken ve net bir hata mesajıyla reddetmek; bu, sessizce donan bir arayüzden çok daha iyi bir deneyim.

### Backpressure ve rate limiting aynı şey mi?

Kısa cevap: Hayır. Rate limiting, istemci başına adil kullanımı sınırlamak için önceden belirlenmiş bir eşik kullanır; geri basınç ise servisin gerçek zamanlı kapasite durumuna göre dinamik olarak yavaşlama sinyali verir.

**Kaynaklar:** [SRE School — What is Backpressure?](https://sreschool.com/blog/backpressure/), [SRE School — What is Load Shedding?](https://sreschool.com/blog/load-shedding/), [Codelit.io — Backpressure Patterns](https://codelit.io/blog/backpressure-flow-control).
