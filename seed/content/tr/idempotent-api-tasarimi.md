---
title: "İdempotent API: Güvenli Yeniden Deneme"
slug: "idempotent-api-tasarimi"
translationKey: "idempotency-api-design"
locale: "tr"
excerpt: "Bir ödeme isteği zaman aşımına uğradı, mobil uygulama tekrar denedi, müşteri iki kez ücretlendirildi. Idempotency key ve UPSERT ile bunu nasıl önlersiniz?"
category: "software-engineering"
tags: ["api-design", "backend", "databases", "reliability", "best-practices"]
publishedAt: "2026-07-09"
seoTitle: "İdempotent API Tasarımı: Çift Ücretlendirmeyi Önleme"
seoDescription: "Bir ödeme isteği zaman aşımına uğradı, mobil uygulama tekrar denedi, müşteri iki kez ücretlendirildi. Idempotency key ve UPSERT ile bunu nasıl önlersiniz?"
---

Geçen ay bir ödeme akışında şunu gördük: istemci `POST /charges` isteği attı, sunucu ücreti başarıyla işledi ama yanıt 3 saniyelik zaman aşımı sınırını aştığı için istemciye hiç ulaşmadı. Mobil uygulama "başarısız" sandı ve aynı isteği otomatik olarak tekrar gönderdi. Sonuç: aynı müşteriden iki kez tahsilat. Bu yazı o olaydan çıkardığımız notlar ve POST isteklerini retry-safe hale getirmenin somut yollarıdır.

## Idempotency ne demek, POST neden sorunlu

Bir işlem, birden fazla kez çalıştırıldığında tek seferde çalıştırılmışla aynı etkiyi üretiyorsa idempotent'tır. `GET` ve `PUT` doğası gereği idempotent'tır — aynı `PUT /users/5` isteğini on kez atsanız sonuç değişmez. Ama `POST /charges` varsayılan olarak idempotent değildir: her çağrı yeni bir kayıt, yeni bir ücret, yeni bir yan etki yaratır. Ağ zaman aşımları, mobil istemcilerin otomatik retry mantığı ve yük dengeleyicilerin isteği iki kez iletmesi gibi senaryolarda bu, sessiz bir çift-yazma riskine dönüşür.

## Idempotency key deseni: istemci bir anahtar üretir, sunucu hatırlar

En yaygın çözüm, istemcinin her mantıksal işlem için benzersiz bir **idempotency key** üretmesi ve bunu bir header'da (`Idempotency-Key: 8f14e45f-...`) göndermesidir. Sunucu bu anahtarı ilk gördüğünde işlemi normal şekilde yürütür ve yanıtı (status kodu + body) anahtarla birlikte saklar. Aynı anahtarla gelen sonraki isteklerde işlem tekrar çalıştırılmaz; saklanan yanıt doğrudan geri döner.

```
POST /charges
Idempotency-Key: 8f14e45f-9c1a-4b2e-9f3d-2a7c8e1b6d90

{ "amount": 4999, "currency": "try", "customer": "cus_123" }
```

Kritik nokta: yalnızca başarılı sonuçları ya da retry'de değişmeyecek hataları önbelleğe alın. Geçici bir hata (503) önbelleğe alınırsa, istemci gerçek bir retry'ye ihtiyaç duyduğunda kilitlenmiş bir hata yanıtı almaya devam eder.

Bir diğer ayrıntı, isteğin gövdesinin de kontrol edilmesi gerektiği. Aynı idempotency key'le farklı bir gövde (örneğin farklı bir tutar) gelirse, sunucu bunu sessizce görmezden gelip eski yanıtı döndürmemeli; bu durumda istemciye açıkça bir `422 Unprocessable Entity` ya da benzeri bir çakışma hatası dönmek, "aynı anahtar farklı istek" senaryosunun fark edilmeden geçmesini engeller. Anahtarla birlikte isteğin gövdesinin bir hash'ini saklamak bu kontrolü ucuza mal ediyor.

## UPSERT mi, başarısız insert mi

İdempotency key tablosunu veritabanı seviyesinde garanti altına almanın iki yolu var. Birincisi, `payment_intent_id` üzerinde bir unique constraint tanımlamak ve retry'de insert'in başarısız olmasına izin vermek: insert `UNIQUE VIOLATION` hatası verirse, uygulama katmanı bunu "zaten işlendi" olarak yorumlar ve mevcut satırı döner. İkincisi, doğrudan `UPSERT` kullanmaktır:

```sql
INSERT INTO charges (idempotency_key, customer_id, amount_cents, status)
VALUES ($1, $2, $3, 'succeeded')
ON CONFLICT (idempotency_key)
DO UPDATE SET status = EXCLUDED.status
RETURNING id, status;
```

`ON CONFLICT DO UPDATE` deseni işlemi tek bir atomik satıra yakınsatır ve concurrency altında güvenlidir çünkü garantiyi uygulama kodu değil veritabanının unique index'i sağlar. Postgres'in resmi dokümantasyonuna göre bu, [`INSERT ... ON CONFLICT` sözdiziminin](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT) tam olarak tasarlandığı senaryodur. `ON CONFLICT DO NOTHING` de bir seçenektir ama yalnızca "ikinci istekte hiçbir şey yapma" yeterliyse işe yarar; ücret durumunu güncellemeniz gerekiyorsa `DO UPDATE` daha doğru davranır.

## Ön koşullu güncellemeler ve TTL

Her idempotency key kaydı sonsuza kadar saklanmamalı. Tipik pratik, anahtarları 24 saatlik bir TTL ile tutmak ve süresi dolanları temizlemektir — bu hem tabloyu küçük tutar hem de istemcinin gerçekten aynı işlemi kastettiğini varsaymak için makul bir pencere sağlar. TTL'i çok kısa tutmak, geç gelen meşru bir retry'nin (örneğin mobil cihaz uzun süre offline kaldıysa) yeni bir işlem olarak algılanmasına yol açabilir; çok uzun tutmak ise tabloyu gereksiz büyütür ve temizlik işini zorlaştırır. Ödeme sistemlerinin çoğu bu ikisi arasında 24 saati makul bir orta nokta olarak kabul ediyor. Anahtarları müşteri veya hesap kimliğiyle scope'lamak da önemlidir; iki farklı müşterinin aynı UUID'yi (çok düşük ihtimalle de olsa) üretmesi durumunda çapraz kirlenmeyi önler.

Koşullu güncellemeler için bir diğer desen, isteğe bir `expected_version` ya da `expected_status` ön koşulu eklemektir: sunucu, mevcut durum beklenenle eşleşmiyorsa güncellemeyi reddeder. Bu, özellikle bir siparişin "hazırlanıyor" → "kargoya verildi" gibi sıralı durumlar arasında ilerlediği çok adımlı akışlarda önemli; ön koşul olmadan, sırası karışmış iki retry isteği durumu geriye doğru da değiştirebilir. Bu, [retry, backoff ve circuit breaker yazımızda](/tr/posts/retry-backoff-circuit-breaker) ele aldığımız "retry'nin ne zaman güvenli olduğu" sorusuyla doğrudan bağlantılı: idempotency olmadan retry, backoff ne kadar iyi ayarlanırsa ayarlansın yan etkileri çoğaltabilir.

| Yaklaşım | Concurrency güvenliği | Ne zaman kullanılır |
|---|---|---|
| Unique constraint + başarısız insert | Yüksek, veritabanı garantili | "İkinci istekte mevcut satırı dön" yeterliyse |
| `INSERT ... ON CONFLICT DO UPDATE` | Yüksek, atomik | Durumun retry'de güncellenmesi gerekiyorsa |
| Sadece uygulama katmanında kontrol (SELECT sonra INSERT) | Düşük, race condition riski | Önerilmez |
| Ön koşullu güncelleme (expected_version) | Yüksek | Çok adımlı durum makinelerinde |

## Test: aynı isteği iki kez ateşleyin

Idempotency'yi doğrulamanın en güvenilir yolu, entegrasyon testinde aynı isteği aynı anahtarla iki kez göndermek ve hem yanıtların hem de veritabanı satır sayısının aynı kalmasını doğrulamaktır:

```js
test('aynı idempotency key ile ikinci istek yeni ücret yaratmaz', async () => {
  const key = crypto.randomUUID();
  const first = await postCharge({ amount: 4999 }, key);
  const second = await postCharge({ amount: 4999 }, key);

  expect(second.body.id).toBe(first.body.id);
  const rows = await db.query('SELECT count(*) FROM charges WHERE idempotency_key = $1', [key]);
  expect(rows[0].count).toBe('1');
});
```

[AWS'nin durable execution rehberine göre](https://docs.aws.amazon.com/durable-execution/patterns/best-practices/idempotency/) dedup mantığını veritabanına bırakmak, uygulama tarafında tahmin yürütmekten daha hızlı ve daha güvenilirdir — çünkü unique index zaten concurrency-safe bir birincil kaynak.

Bence buradaki asıl ders şu: idempotency key header'ı eklemek kolay kısım. Zor kısım, "hangi alanlar bu anahtarın kapsamına giriyor" sorusunu net cevaplamak — tutar değişirse aynı anahtar geçerli mi, geçersiz mi? Bu kararı baştan yazılı hale getirmeyen ekipler, altı ay sonra prod'da garip, ilk bakışta açıklanamayan bir edge case'le karşılaşıyor ve genelde kaynağını bulmak günler alıyor.

Retry mantığınızın geri kalanı için [retry, backoff ve circuit breaker rehberimize](/tr/posts/retry-backoff-circuit-breaker), rate limit tarafı için [rate limiting algoritmaları karşılaştırmamıza](/tr/posts/rate-limiting-algoritmalari) göz atabilirsiniz. API tasarımı tercihleri için [REST mi GraphQL mi yazımız](/tr/posts/rest-mi-graphql-mi) da ilgili bir başlangıç noktası. Daha fazla mühendislik pratiği için [Yazılım Mühendisliği kategorisine](/tr/category/yazilim-muhendisligi) göz atın.

## Sıkça Sorulan Sorular

### Idempotency key'i her endpoint'e eklemeli miyim?

Hayır, yalnızca durumu değiştiren (ödeme, sipariş oluşturma, e-posta gönderme gibi) `POST` endpoint'lerine gerek var. `GET` zaten idempotent, `PUT`/`DELETE` genellikle doğal olarak idempotent'tır; oraya ekstra bir anahtar sistemi eklemek gereksiz karmaşıklık yaratır.

### Idempotency key ile rate limiting aynı şey mi?

Hayır. Idempotency key, aynı isteğin yanlışlıkla iki kez işlenmesini önler; rate limiting ise bir istemcinin belirli bir sürede kaç istek atabileceğini sınırlar. İkisi genelde birlikte çalışır ama farklı problemleri çözer.

### Idempotency key'i ne kadar süre saklamalıyım?

Çoğu ödeme sistemi 24 saatlik bir pencere kullanıyor; bu, istemci tarafı retry mantığının makul bir üst sınırını kapsıyor. Daha uzun tutmak tabloyu şişirir, daha kısa tutmak geç gelen bir retry'nin gerçek bir çift işlem yaratma riskini artırır.

### UPSERT her zaman başarısız insert'ten daha mı iyi?

Değil. Yalnızca durumu ilk istekten sonra güncellemeniz gerekiyorsa (örneğin ücretin durumu "pending"den "succeeded"a geçiyorsa) `UPSERT` daha doğru. İkinci istekte hiçbir şeyin değişmesini istemiyorsanız `ON CONFLICT DO NOTHING` ya da başarısız insert + mevcut satırı döndürme yeterli ve daha basit.
