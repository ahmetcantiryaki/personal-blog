---
title: "Olay Güdümlü Mimari: Desenler ve Tuzaklar"
slug: "olay-gudumlu-mimari-desenler-tuzaklar"
translationKey: "event-driven-architecture-patterns"
locale: "tr"
excerpt: "Pub/sub, streaming ve kuyruk farklı problemleri çözer; 'tam olarak bir kez' teslimat bir efsanedir ve event sourcing çoğu CRUD servis için gereksiz yüktür."
category: "software-engineering"
tags: ["software-architecture", "system-design", "microservices", "backend"]
publishedAt: "2026-08-18"
seoTitle: "Olay Güdümlü Mimari: Desenler ve Tuzaklar"
seoDescription: "Pub/sub, event streaming ve kuyruk karşılaştırması, exactly-once efsanesi, şema versiyonlama ve CQRS'i sayılarla anlatan karar rehberi eşliğinde bir yazı."
---

Kısa cevap: nokta-nokta iş dağıtımı için kuyruk, anlık bildirim yayını için pub/sub, birden fazla bağımsız tüketici grubunun aynı veriyi tekrar okuyabilmesi gerektiğinde log tabanlı bir streaming platformu (Kafka, Kinesis), değişim geçmişinin kendisi ürünün parçasıysa event sourcing kullanın. Çoğu ekip, bir kuyruğun yeteceği yerde doğrudan Kafka'ya yönelir.

## Pub/Sub mü, Event Streaming mi, Yoksa Kuyruk mu Kullanmalıyım?

Gerçek fark, mesaj okunduktan sonra ne olduğunda saklı. Bir kuyruk (SQS, RabbitMQ) tüketici mesajı onayladığında onu siler veya gizler, yani her mesajı yalnızca bir tüketici alır. Pub/sub sistemi (SNS, Redis Pub/Sub) mesajı o anda dinleyen herkese dağıtır ama geçmiş tutmaz. Streaming platformu (Kafka, Kinesis) ise mesajları kalıcı, sıralı bir log'a ekler; birden çok tüketici grubu bu log'u birbirinden bağımsız okuyabilir ve eski bir offset'ten tekrar oynatabilir.

Mimari kararlarınızı değiştiren asıl özellik bu log'dur. Apache Kafka, mesajları varsayılan olarak yedi gün saklar; bu pencere genellikle 30 güne çıkarılır veya anahtarlı bir topic'te log compaction ile süresiz hale getirilir. Amazon Kinesis varsayılan olarak 24 saat saklar, ek ücretle 365 güne kadar uzatılabilir. Klasik bir kuyruk ya da pub/sub sistemi ise gerçek kaynak (source of truth) değildir: mesaj bir kez teslim edildi mi, gitmiştir.

| Özellik | Kuyruk (SQS, RabbitMQ) | Pub/Sub (SNS, Redis) | Streaming (Kafka, Kinesis) |
|---|---|---|---|
| Teslimat hedefi | Mesaj başına tek tüketici | O an dinleyen herkes | Her tüketici grubu, bağımsız olarak |
| Geçmişi tekrar oynatma | Yok | Yok | Var, saklama penceresi içinde |
| Sıralama garantisi | En iyi çaba, ya da yalnızca FIFO kuyruklarda | Garanti yok | Partition/shard bazında sıralı |
| Tipik saklama süresi | Dakikalar - 14 gün (SQS azami) | Yok (anlık teslimat) | Günler - süresiz (compaction ile) |
| İyi uyduğu senaryo | İş dağıtımı, yük dengeleme | Canlı bildirim, önbellek geçersizleştirme | Denetim izi, analitik, çoklu ekip tüketimi |

İki ekip aynı olay akışını aylar sonra farklı amaçlarla tüketmek isterse, geçmişten başlayabilmeyi yalnızca log tabanlı bir platform sağlar. Pub/sub'da o an kimse dinlemiyorsa mesaj basitçe kaybolur.

## Event Notification mı, Event-Carried State Transfer mı, Event Sourcing mi?

Seçim, tüketicinin ne kadar veriye ihtiyaç duyduğuna ve ne kadar bağımlılığa razı olduğunuza bağlı. [Martin Fowler'ın olay güdümlü desenler üzerine yazısı](https://martinfowler.com/articles/201701-event-driven.html) üç farklı yaklaşımı ayırıyor; aralarındaki sınır teknoloji değil, payload büyüklüğü ve bağımlılık seviyesi.

- **Event notification** — yalnızca "sipariş kargoya verildi, ID: X" gibi ince bir olay; tüketici detay için geri arama yapmak zorunda kalır. Bağımlılık düşük ama yük altında geri çağrı trafiği artar.
- **Event-carried state transfer** — olay verinin tamamını taşır, tüketici yerel ve nihai tutarlı (eventually consistent) bir kopyayı elinde tutar, geri arama yapmaz. Veri tekrarı fazla ama senkron çağrı yok denecek kadar az.
- **Event sourcing** — sistem kaydının kendisi olay log'udur; mevcut durum satır güncellenerek değil, ilgili varlığın tüm olayları yeniden oynatılarak türetilir.

Çoğu mikroservis entegrasyonunda asıl iş atı event-carried state transfer'dır, çünkü event notification'ın hâlâ taşıdığı çalışma zamanı bağımlılığını ortadan kaldırır. Event sourcing ise çok daha büyük bir taahhüt: kalıcılık modelinizi append-only bir log etrafında yeniden kuruyorsunuz ve on servis bu şemaya bağımlı hale geldikten sonra geri dönmek neredeyse imkansız.

## "Exactly-Once" (Tam Olarak Bir Kez) Teslimat Gerçek mi?

Hayır, ağ sınırını aşan bir sistemde değil. Satıcıların "exactly-once semantics" dediği şey, aslında at-least-once (en az bir kez) teslimat artı, sonucu tam-olarak-bir-kez gibi gösteren tekilleştirmedir. [Confluent'in kendi dokümantasyonu](https://docs.confluent.io/kafka/design/delivery-semantics.html) bunu açıkça belirtir: Kafka'nın exactly-once garantisi yazma yolunu kapsar (idempotent producer'lar artı partition'lar arası transaction'lar), tüketicinin mesajı okuduktan sonra yaptığı keyfi yan etkileri değil.

Kafka'nın 0.11 sürümünden beri sunduğu idempotent producer, her producer'a partition başına artan bir sıra numarası atar; broker, bu numara son kabul edilenden tam olarak bir fazla değilse yazmayı reddeder. Bu, producer'ın yeniden denemesinden kaynaklanan yinelenen yazmaları engeller. Ama bir tüketicinin mesajı işledikten sonra, offset'i commit etmeden önce çökmesini engellemez — o tüketici yeniden başladığında mesajı tekrar işler, nokta.

Pratikteki çözüm idempotent (aynı sonucu üreten) işleme tasarlamaktır: aynı olay iki kez işlense de son durum aynı kalsın. Yaygın yöntem, olay ID'sine göre anahtarlanmış bir tekilleştirme tablosunu iş yazmasıyla aynı transaction içinde kontrol etmektir:

```sql
CREATE TABLE processed_events (
  event_id UUID PRIMARY KEY,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- tüketicinin transaction'ı içinde:
INSERT INTO processed_events (event_id) VALUES ($1)
ON CONFLICT (event_id) DO NOTHING;
-- 0 satır etkilendiyse iş mantığını atla; olay zaten uygulanmış demektir
```

Bu, [idempotent API tasarımı](/tr/posts/idempotent-api-tasarimi) yazısında anlattığımızla aynı disiplin — tetikleyici bir HTTP istemcisi de olsa, bir tüketici grubu rebalance'ı da olsa yeniden deneme güvenliği sorunu birebir aynı. Buna, zaten güvenilmez her ağ çağrısı için kullandığınız [retry, backoff ve circuit breaker desenlerini](/tr/posts/retry-backoff-circuit-breaker) eşlik ettirin.

Yayınlama tarafındaki karşılığı ise "dual write" (çift yazma) problemidir: veritabanınızı güncellemek ve olayı yayınlamak iki ayrı işlemdir, aralarında bir çökme ya olayı kaybettirir ya da hiç commit edilmemiş bir yazma için olay gönderilmesine yol açar. Transactional outbox deseni bunu, olayı iş değişikliğiyle aynı veritabanı transaction'ı içinde bir outbox tablosuna yazıp, ayrı bir relay sürecinin bu tablodan yayın yapmasını sağlayarak çözer — bilinmesi gereken bir araç, ama bu yazının konusu değil.

## Olay Şemalarını Tüketicileri Kırmadan Nasıl Versiyonlarım?

Her olay şemasını herkese açık bir API gibi ele alın, çünkü ikinci bir ekip abone olduğu anda gerçekten öyle olur. Çoğu kırılmayı önleyen kural şudur: yalnızca opsiyonel alan ekleyin, mevcut bir alanı asla silmeyin veya amacını değiştirmeyin, bir alanın tipini yerinde değiştirmeyin.

```json
{
  "eventType": "order.shipped",
  "eventVersion": 2,
  "orderId": "ord_8f21a9",
  "carrier": "ups",
  "trackingUrl": "https://example.com/track/8f21a9"
}
```

Burada versiyon 2, yeni opsiyonel bir alan olarak `trackingUrl` ekledi — bunu bilmeyen eski tüketiciler alanı yok sayar. Bir şema kayıt sistemi (Confluent Schema Registry, AWS Glue Schema Registry) bunu yazma anında zorunlu kılar: Avro veya Protobuf kurallarına göre geriye uyumlu olmayan producer değişikliklerini, hata bir tüketiciye ulaşıp haftalar sonra fark edilmeden önce reddeder.

## CQRS Sınırları Ne Zaman Gerçekten Önemli?

CQRS (Command Query Responsibility Segregation), yazma ve okuma için ayrı modeller — bazen ayrı veritabanları — kullanmak demektir. Okuma deseniniz yazma modelinizle hiç örtüşmüyorsa önem kazanır: yazma tarafında normalize bir sipariş tablosu, okuma tarafında ise üç farklı servisten derlenen "kargo durumuyla sipariş geçmişi" gibi denormalize bir görünüm. Event-carried state transfer, bu okuma modelini istek anında servisler arası sorgu yapmadan senkron tutmanın yoludur.

Tek bir tablonun hem okuma hem yazmayı sorunsuz karşıladığı tipik bir CRUD kaynağı için önemli değildir. Bir ayarlar sayfası için ayrı bir okuma deposu, bir projeksiyon hattı ve nihai tutarlılık yönetimi kurmak, karşılığı olmayan bir karmaşıklık vergisidir.

## Ne Zaman Olay Güdümlü Mimariye Geçmemeliyim?

İş akışınız senkron bir cevap gerektiriyorsa, ekibiniz bir avuç servisi yöneten yaklaşık on mühendisten azsa veya tek bir veritabanı transaction'ı zaten ihtiyacınız olan tutarlılığı sağlıyorsa vazgeçin. Olay güdümlü sistemler, anlık tutarlılığı ve sade hata izlerini gevşek bağımlılık ile ölçeklenme kabiliyetiyle takas eder — bu takas ancak çözdüğü bağımlılık sorunu size gerçekten maliyet çıkarmaya başladığında karşılığını verir.

Dürüst görüşüm şu: event sourcing, altında aslında zaman çizelgesi eklenmiş bir CRUD uygulaması yatan servislerde "modern" olsun diye varsayılan seçim olarak kullanılıyor. Gerçek ihtiyaç "değişim geçmişini göster" ise, trigger'lı bir denetim log tablosu, gerçek bir event-sourced varlığın gerektirdiği replay altyapısı, snapshot stratejisi ve şema göçü mekanizması olmadan değerin %90'ını verir. Event sourcing'i, geçmişin kendisinin iş değeri olduğu alanlara saklayın — muhasebe defterleri, sipariş yaşam döngüleri, uyumluluk izleri — bir yönetim paneli için değil.

## Karar Rehberi: Hangi Deseni Kullanmalıyım?

| İhtiyacınız... | Kullanın |
|---|---|
| Her işi tek bir çalışan alsın, en az bir kez teslimat, basit retry | Kuyruk (SQS, RabbitMQ) |
| Canlı bir olayı o an dinleyen herkese dağıtmak, geçmiş gerekmiyor | Pub/sub (SNS, Redis Pub/Sub) |
| Birden fazla ekip aynı olayları bağımsız tüketsin, geçmişe dönebilsin | Streaming platformu (Kafka, Kinesis) |
| Servisler senkron çağrı yapmadan senkronize kalsın | Streaming üzerinde event-carried state transfer |
| Değişim geçmişinin kendisi temel iş varlığı | Event sourcing |
| Okuma ve yazma modelleri tamamen farklı şekillenmiş | CQRS, genelde event-carried state transfer ile birlikte |
| ~10 mühendisten az bir ekip, tek veritabanı, senkron ihtiyaçlar | Olay güdümlüden vazgeçin — doğrudan çağrı ya da DB transaction'ı daha sade |

Halen karar aşamasındaysanız ve bu bir [mikroservis mi monolit mi](/tr/posts/mikroservis-mi-monolit-mi) sorusunun parçasıysa, varsayılan olarak kuyruğu seçin. Streaming'i, ikinci bir tüketici grubu gerçekten aynı olaylara ihtiyaç duyduğunda ekleyebilirsiniz; beş servis Kafka'nın saklama penceresine bağımlı hale geldikten sonra onu kaldırmak çok daha zordur.

## Sıkça Sorulan Sorular

### Kafka bir mesaj kuyruğu mudur?

Tam olarak değil — Kafka dağıtık bir commit log'dur, kuyruk değildir. Mesajlar bir tüketici okuduktan sonra silinmez; saklama penceresi (genelde 7-30 gün) dolana ya da compaction politikası devreye girene kadar kalırlar, bu da birden fazla bağımsız tüketici grubunun aynı topic'i farklı noktalardan tekrar okuyabilmesini sağlar.

### Idempotent olay işleme pratikte ne anlama gelir?

Aynı olayı iki kez işlemenin, bir kez işlemekle aynı sonucu vermesi demektir; genellikle iş yazmasıyla aynı transaction içinde kontrol edilen bir tekilleştirme tablosu ya da idempotency key ile sağlanır. Önemlidir çünkü at-least-once teslimat, producer yeniden denemeleri, tüketici yeniden başlatmaları ya da rebalance'lar yüzünden her tüketicinin er ya da geç yinelenen mesaj görmesini garanti eder.

### Olay güdümlü mimari için şema kayıt sistemine ihtiyacım var mı?

Aynı olay tipini birden fazla ekip yayınladığında ya da tükettiğinde gerekir, çünkü geriye uyumsuz değişiklikleri yazma anında reddeder; aksi halde hata haftalar sonra bir tüketicide ortaya çıkar. Tek ekip, tek tüketicili bir kurulumda kod incelemesinde kontrol edilen versiyonlu bir şema genellikle yeterlidir.

### Event sourcing ile CQRS aynı şey midir?

Hayır, sıklıkla birlikte kullanılan ama birbirinden bağımsız iki karardır. Event sourcing, durumu nasıl sakladığınızla ilgilidir — değişebilir satırlar yerine tekrar oynatılabilir bir olay log'u olarak. CQRS ise okuma ve yazma modellerini ayırmakla ilgilidir. Normal bir veritabanıyla CQRS uygulayabilir, tek bir birleşik modelle de event sourcing yapabilirsiniz; pratikte ikisi doğal olarak birlikte kullanılsa da.
