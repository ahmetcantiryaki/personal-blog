---
title: "Outbox Kalıbı: Güvenilir Olay Yayını"
slug: "outbox-kalibi-guvenilir-olay-yayini"
translationKey: "transactional-outbox-pattern"
locale: "tr"
excerpt: "Ödeme kaydedildi ama olay hiç yayınlanmadı — dual-write hatasının klasik hali. Outbox kalıbının bunu nasıl önlediğini, Debezium CDC röle kurulumuyla anlatıyor."
category: "software-engineering"
tags: ["microservices", "system-design", "reliability", "best-practices"]
publishedAt: "2026-07-17"
seoTitle: "Outbox Kalıbı: Olayları Veritabanınızla Atomik Yayınlayın"
seoDescription: "Dual-write problemi nedir, outbox tablosu neden çözer, Debezium ile log-tabanlı CDC röle nasıl kurulur ve idempotent tüketiciler neden zorunlu — anlatıyoruz."
---

Bir ödeme servisi `payments` tablosuna satırı yazdı, commit başarılı oldu — ama aynı anda Kafka'ya "ödeme tamamlandı" olayını yayınlayan ikinci çağrı ağ hatası yüzünden hiç ulaşmadı. Veritabanı doğru veriyi tutuyordu, ama faturalama servisi bu ödemeden hiç haberdar olmadı. Kimse hata görmedi çünkü ilk yazma başarılıydı — sorun sessizce, günler sonra "neden bu müşteriye fatura kesilmemiş" sorusuyla ortaya çıktı.

## Dual-Write Problemi: İki Sistemi Atomik Güncelleyemezsiniz

Bir veritabanına yazıp aynı anda bir mesaj kuyruğuna (Kafka, RabbitMQ, SQS) yayın yapmanız gerektiğinde, bu iki işlemi tek bir atomik birim haline getirecek yerleşik bir mekanizma yoktur. Dört senaryo mümkün: ikisi de başarılı (istenen durum), veritabanı başarılı mesaj başarısız (kayıp olay — yukarıdaki gibi), mesaj başarılı veritabanı başarısız (var olmayan bir kayıt için olay yayınlanmış olur) veya ikisi de başarısız. Dağıtık iki-fazlı commit (2PC) teorik olarak bunu çözer ama pratikte mesaj kuyruklarının çoğu 2PC'yi desteklemiyor, desteklese bile performans maliyeti ve operasyonel karmaşıklığı çoğu ekip için kabul edilemez.

## Çözüm: Olayı Aynı Transaction İçinde Bir Tabloya Yaz

Outbox kalıbının çözümü basit bir gözlem üzerine kurulu: tek bir veritabanına tek bir transaction içinde yazmak zaten atomiktir. Öyleyse mesaj kuyruğuna doğrudan yayın yapmak yerine, olayı da business verisiyle **aynı transaction içinde** kendi veritabanınızdaki bir `outbox` tablosuna yazın.

```sql
CREATE TABLE outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);
```

```sql
BEGIN;

INSERT INTO payments (id, order_id, amount, status)
VALUES ('pay_8f2a', 'ord_4471', 4999, 'completed');

INSERT INTO outbox (aggregate_type, aggregate_id, event_type, payload)
VALUES ('payment', 'pay_8f2a', 'PaymentCompleted',
        '{"orderId":"ord_4471","amount":4999}'::jsonb);

COMMIT;
```

Bu iki `INSERT` aynı transaction'da olduğu için ikisi birden başarılı olur ya da ikisi birden rollback olur — dual-write senaryosu yapısal olarak imkansız hale gelir. Artık geriye tek bir sorun kalıyor: outbox tablosundaki satırları gerçek mesaj kuyruğuna taşımak.

## Röle: Polling mi, Log-Tabanlı CDC mi

**Polling röle** en basit yaklaşım: ayrı bir işlem `outbox` tablosunu belirli aralıklarla sorgular, yayınlanmamış satırları alır, kuyruğa gönderir, `published_at`'i işaretler. Kurulumu kolaydır ama iki maliyeti var: sorgulama aralığı kadar gecikme ve sık polling'in veritabanına eklediği sürekli yük.

**Log-tabanlı CDC (Change Data Capture)** ise veritabanının kendi write-ahead log'unu (WAL) okuyarak `outbox` tablosuna yapılan her `INSERT`'i neredeyse anlık yakalar — ekstra sorgu yükü eklemeden. Debezium bu yaklaşımın fiili standardı: Postgres, MySQL, SQL Server ve MongoDB için CDC konektörleri sunuyor ve outbox tablosundaki olayları doğrudan Kafka konusuna yönlendiren özel bir "outbox event router" transformasyonu içeriyor.

| Kriter | Polling röle | Log-tabanlı CDC (Debezium) |
|---|---|---|
| Gecikme | Polling aralığı kadar (saniyeler) | Neredeyse anlık (WAL'dan okur) |
| Veritabanı yükü | Sürekli sorgu trafiği ekler | WAL okuma, ek sorgu yükü eklemez |
| Kurulum karmaşıklığı | Düşük — basit bir cron/worker | Orta — Kafka Connect + Debezium konektörü |
| Ölçek | Küçük/orta hacimde yeterli | Yüksek hacimli olay akışları için tercih edilir |

Küçük bir sistem için polling röle fazlasıyla yeterli olabilir; olay hacmi arttıkça ya da gecikme kritik hale geldikçe log-tabanlı CDC'ye geçiş doğal bir sonraki adım. Geçiş genelde tek seferde değil kademeli yapılır: önce en yüksek hacimli veya en gecikme-hassas olay türü CDC'ye taşınır, düşük hacimli diğer olaylar bir süre daha polling üzerinde kalabilir — iki mekanizmayı aynı outbox tablosu üzerinde geçici olarak birlikte çalıştırmak teknik olarak sorun değil.

## Idempotent Tüketiciler: At-Least-Once Teslimatın Bedeli

Outbox kalıbı "en az bir kez" (at-least-once) teslimat garantisi verir, "tam olarak bir kez" (exactly-once) değil — röle bir olayı yayınladıktan sonra ama `published_at`'i işaretlemeden önce çökerse, aynı olay yeniden yayınlanır. Bu, tüketici tarafında bir tasarım zorunluluğu doğurur: her tüketici, aynı olayı iki kez işlese bile sonucun değişmemesi gereken idempotent bir mantıkla yazılmalı.

```javascript
async function handlePaymentCompleted(event) {
  const alreadyProcessed = await db.query(
    'SELECT 1 FROM processed_events WHERE event_id = $1',
    [event.id]
  );
  if (alreadyProcessed.rowCount > 0) return; // zaten işlendi, sessizce çık

  await db.transaction(async (tx) => {
    await tx.query('UPDATE invoices SET status = $1 WHERE order_id = $2',
      ['paid', event.payload.orderId]);
    await tx.query('INSERT INTO processed_events (event_id) VALUES ($1)',
      [event.id]);
  });
}
```

Olayın kendi `id`'sini bir "işlendi" tablosunda tutup her işlemden önce kontrol etmek, en yaygın idempotency deseni — kontrol ve güncelleme aynı transaction'da olduğu sürece iki kez işleme riski ortadan kalkar.

## Röle Kontrol Listesi

Outbox kalıbını kurarken gözden kaçan noktalar genelde şunlar: outbox tablosunun büyümesini önlemek için yayınlanmış satırları düzenli temizleyen bir arşivleme işi; röle çöktüğünde nereden devam edeceğini bilmesi için bir offset/checkpoint mekanizması; ve tüketici tarafında idempotency'nin "olsa iyi olur" değil kalıbın zorunlu bir parçası olduğunun ekipçe anlaşılması. Bu üçü atlanırsa outbox tablosu sınırsız büyür, röle yeniden başladığında olayları baştan yayınlar ve idempotent olmayan tüketiciler veriyi bozar.

Outbox kalıbı genelde retry ve circuit breaker mantığıyla birlikte kurulur; [retry, backoff ve circuit breaker rehberimiz](/tr/posts/retry-backoff-circuit-breaker) röle tarafındaki hataları nasıl ele alacağınızı tamamlıyor. API'lerinizde idempotency'i uçtan uca nasıl tasarlayacağınızı [idempotent API tasarımı](/tr/posts/idempotent-api-tasarimi) yazımızda detaylandırdık. Mikroservis mi monolit mi kararında olay güdümlü mimarinin nerede gerekli olduğunu tartıştığımız [mikroservis mi monolit mi](/tr/posts/mikroservis-mi-monolit-mi) yazısı da bu kalıbın ne zaman gerçekten gerekli olduğuna dair bağlam veriyor.

## Saga Kalıbıyla İlişkisi

Outbox kalıbı sıkça saga kalıbıyla karıştırılıyor ama ikisi farklı problemleri çözüyor. Saga, birden fazla servis arasında dağıtık bir iş akışını (örneğin sipariş → ödeme → stok düşürme → kargo) telafi edici işlemlerle (compensating transaction) yönetir; her adımın başarısız olması durumunda önceki adımları geri almanın yolunu tanımlar. Outbox ise sadece tek bir servisin kendi veritabanı yazması ile olay yayını arasındaki atomiklik sorununu çözer. Pratikte ikisi birlikte çalışır: saga'nın her adımı, bir sonraki adımı tetikleyen olayı outbox kalıbıyla güvenilir şekilde yayınlar. Outbox olmadan bir saga kurmak, adımlardan birinin olayını hiç yayınlamama riskini saga'nın telafi mantığına taşır — bu da "neden sipariş askıda kaldı" türünden hataları saga seviyesinde debug etmeyi zorlaştırır.

## Outbox'ı Ne Zaman Kurmamalısınız

Her olay yayınına outbox eklemek gerekmiyor. Tek bir monolitik uygulama içinde, aynı süreçte çalışan bir olay dinleyicisine (in-process event emitter) bildirim gönderiyorsanız zaten aynı transaction/bellek alanındasınız — outbox'ın çözdüğü dual-write problemi burada yok. Kalıp asıl değerini, olay yayınının **ayrı bir sürece veya servise** gitmesi gerektiği ve bu yayının kaybının iş açısından kabul edilemez olduğu durumlarda gösteriyor: ödeme onayları, sipariş durumu değişiklikleri, stok güncellemeleri gibi. Düşük riskli, kaybı sorun olmayan bildirimler (örneğin bir analytics event'i) için outbox'ın operasyonel yükünü (ekstra tablo, röle, temizlik işi) taşımak genelde gereksiz.

## Sıkça Sorulan Sorular

### Outbox kalıbı exactly-once teslimat garantisi verir mi?

Hayır, at-least-once garantisi verir. Aynı olay nadiren de olsa iki kez yayınlanabilir; bu yüzden tüketici tarafında idempotent işleme zorunludur.

### Polling röle ne zaman yeterli, ne zaman CDC'ye geçmeli?

Olay hacmi düşükse ve saniyeler mertebesinde gecikme kabul edilebilirse polling yeterlidir. Hacim arttıkça veya gecikme iş açısından kritik hale geldikçe (ödeme, envanter gibi) log-tabanlı CDC'ye geçiş gerekir.

### Debezium hangi veritabanlarını destekliyor?

Postgres, MySQL, SQL Server ve MongoDB için üretime hazır CDC konektörleri sunuyor; outbox tablosundaki olayları doğrudan Kafka konusuna yönlendiren özel bir event router transformasyonu içeriyor.

### Outbox tablosu neden düzenli temizlenmeli?

Yayınlanmış satırlar tabloda kalmaya devam ederse tablo sınırsız büyür, indeks performansı bozulur ve CDC'nin WAL üzerinden okuma maliyeti artar. Yayınlandığı doğrulanan satırları arşivleyen veya silen ayrı bir temizlik işi gerekir.
