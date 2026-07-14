---
title: "Redis ve Kafka'ya Elveda: Her Şey İçin Postgres"
slug: "her-sey-icin-postgres"
translationKey: "postgres-for-everything"
locale: "tr"
excerpt: "postgres redis yerine geçer mi? Temmuz 2026'da tek bir Postgres cache, kuyruk, tam metin arama ve vektörü tek çatı altında toplayıp işletme yükünü siler."
category: "software-engineering"
tags: ["databases", "sql", "backend", "software-architecture", "cost-optimization", "postgresql"]
publishedAt: "2026-07-13"
seoTitle: "Postgres Redis Yerine: Her Şey İçin Tek Veritabanı"
seoDescription: "Redis, Kafka ve Elasticsearch yerine tek Postgres: UNLOGGED cache, SKIP LOCKED kuyruk, pgvector ve TimescaleDB ile yedi sistemin yükünü nasıl silersin?"
---

postgres redis yerine geçer mi? Çoğu ekip için evet. Temmuz 2026'da orta ölçekli bir uygulamanın Redis, Kafka, Elasticsearch ve ayrı bir vektör veritabanına ihtiyacı yok; tek bir Postgres örneği cache, kuyruk, tam metin arama ve vektör aramayı aynı çatı altında karşılayabiliyor. Kazanç sadece lisans değil, işletme yükünün kendisi.

## Yedi veritabanının gizli işletme vergisi

Tipik bir "modern" mimari şöyle görünür: kalıcı veri için Postgres, cache için Redis, olay akışı için Kafka, arama için Elasticsearch, benzerlik için bir vektör veritabanı, metrikler için InfluxDB ve konum için ayrı bir GIS katmanı. Her biri tek başına mantıklı; toplamı ise gizli bir vergidir.

Bu verginin kalemleri nettir: yedi ayrı yedekleme ve geri yükleme prosedürü, yedi güvenlik yaması takvimi, yedi izleme panosu ve aralarında tutarlılığı sağlayacak dual-write kodu. En acısı da bileşik erişilebilirlik: yüzde 99,9 SLA'ya sahip üç sistemi arka arkaya dizdiğinizde toplam erişilebilirlik yüzde 99,7'ye düşer. Sistem sayısı arttıkça bu çarpım sizin aleyhinize çalışır.

Postgres bu tabloyu değiştiriyor çünkü artık genişletilebilir bir veri platformu. [Stack Overflow 2025 geliştirici anketine](https://survey.stackoverflow.co/2025/technology) göre Postgres, geliştiricilerin yüzde 55,6'sı tarafından kullanılan en popüler veritabanı; profesyonel geliştiricilerde bu oran yüzde 58,2'ye çıkıyor. Bu yaygınlık tesadüf değil: eklenti mimarisi, tek motorun birçok özel sistemi yutmasını sağlıyor.

## UNLOGGED tablolar ile cache

Redis'i çoğu senaryoda değiştiren şey `UNLOGGED` tablolardır. Normal bir Postgres tablosu her yazımı write-ahead log'a (WAL) yazar; bu, çökme sonrası dayanıklılık sağlar ama yazma başına maliyet ekler. `UNLOGGED` tablolarda WAL devre dışıdır, yani yazma neredeyse bellek hızındadır. Bedeli açık: sunucu çökerse tablo boşalır. Cache için bu zaten kabul edilebilir bir davranış.

```sql
CREATE UNLOGGED TABLE cache_kv (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  expires_at timestamptz NOT NULL
);

CREATE INDEX ON cache_kv (expires_at);
```

Bir TTL süpürme işiyle süresi geçmiş anahtarları temizlersiniz. Doğru indeks seçimi burada kritik; nedenini [veritabanı indeksleme yazımızda](/tr/posts/veritabani-indeksleme) örneklerle anlatmıştık. Redis'in sub-milisaniye gecikmesine ihtiyacınız yoksa, `UNLOGGED` tablo bir ağ atlaması ve bir sistem daha az demektir.

## LISTEN/NOTIFY ile pub/sub

Basit yayınla-abone ol akışları için Postgres'in yerleşik `LISTEN/NOTIFY` mekanizması küçük bir mesaj kuyruğu ihtiyacını karşılar. Bir bağlantı `NOTIFY kanal, 'mesaj'` çağırır, dinleyen bağlantılar bildirimi anında alır. Webhook tetikleme, cache geçersizleştirme veya canlı gösterge güncellemeleri gibi işler için Kafka kurmadan çalışır.

Sınırı da baştan bilmek gerekir: `NOTIFY` yükü 8000 bayttan küçük olmalı ve mesajlar kalıcı değildir; dinleyici o an bağlı değilse mesajı kaçırır. Pratikte en sağlam desen, `LISTEN/NOTIFY`'ı yalnızca bir "uyandırma" sinyali olarak kullanmaktır: bildirim gelince worker kalıcı iş tablosunu yoklar. Böylece hem düşük gecikme hem de kayıpsız teslimat elde edersiniz. Dayanıklı teslimatın çekirdeği ise bir sonraki bölümde.

## SKIP LOCKED ile iş kuyruğu

Postgres 9.5'ten beri var olan `FOR UPDATE SKIP LOCKED`, veritabanını sağlam bir iş kuyruğuna dönüştürür. Birden fazla worker aynı tabloyu yoklar; her worker kilitli satırları atlayıp yalnızca boşta olanı kapar. Çakışma yok, çift işleme yok:

```sql
WITH job AS (
  SELECT id
  FROM   jobs
  WHERE  status = 'pending'
  ORDER  BY created_at
  FOR UPDATE SKIP LOCKED
  LIMIT  1
)
UPDATE jobs
SET    status = 'processing', started_at = now()
FROM   job
WHERE  jobs.id = job.id
RETURNING jobs.id, jobs.payload;
```

Bu kalıp saniyede binlerce işi rahatça taşır ve `LISTEN/NOTIFY`'ın aksine kalıcıdır; worker düşse bile iş tabloda durur. Sistemin sınırlarını dürüstçe koyan [Tiger Data'nın 2026 analizi](https://www.tigerdata.com/blog/its-2026-just-use-postgres) de kuyruk için aynı yaklaşımı öneriyor. Kendi ölçeğimizde onlarca milyon satırlık kuyruklarda bu deseni sorunsuz çalıştırdık; darboğaz genelde Postgres değil, worker mantığı oluyor.

## Tam metin arama ve pgvector

Elasticsearch'ü çoğu ürün için gereksiz kılan iki yetenek var. Birincisi Postgres'in yerleşik tam metin araması: `tsvector` sütunu, GIN indeksi ve `to_tsquery` ile dil-farkında, sıralamalı arama sunucu içinde çalışır. Yeni BM25 tabanlı eklentiler bunu Elasticsearch'e daha da yaklaştırıyor.

İkincisi `pgvector`: embedding'leri saklayıp HNSW indeksiyle yaklaşık en yakın komşu araması yapar. RAG ve semantik arama için ayrı bir Pinecone kurmak zorunda değilsiniz. Tiger Data'nın `pgvectorscale` kıyaslamasında Postgres, 50 milyon vektörde Pinecone'a kıyasla p95 gecikmede 28 kata kadar iyileşme raporluyor. Buradaki asıl kazanç sayıların ötesinde: embedding'ler ilişkisel verinizle aynı tabloda, aynı işlem sınırında durur, yani "kullanıcıyı sil" gibi bir işlem hem satırı hem vektörünü tek transaction'da temizler. İki ayrı sistemde bu tutarlılığı elde etmek için ekstra senkronizasyon kodu yazmanız gerekir. Postgres'in vektör tarafını ayrı sistemlerle nasıl kıyasladığımızı [vektör veritabanı karşılaştırmamızda](/tr/posts/vektor-veritabani-karsilastirma) bulabilirsiniz.

## Hangi sistemi, hangi ölçeğe kadar yutar?

Postgres her özel sistemi sonsuza kadar taklit edemez. Gerçekçi eşikler şöyle:

| Özel sistem | Postgres karşılığı | Rahat ölçek | Nerede kırılır |
|---|---|---|---|
| Redis (cache) | UNLOGGED tablo | ~50K istek/sn | Sub-ms gecikme, dev fan-out |
| Kafka (kuyruk) | SKIP LOCKED | Saniyede binlerce iş | Milyon+ olay/sn akışı |
| RabbitMQ (pub/sub) | LISTEN/NOTIFY | Orta hacim | Kalıcı, çok tüketicili teslimat |
| Elasticsearch (arama) | tsvector + GIN / BM25 | Milyonlarca doküman | Milyar ölçekli log analitiği |
| Pinecone (vektör) | pgvector + HNSW | ~50M vektör | Milyar+ vektör, dev fan-out |
| InfluxDB (zaman serisi) | TimescaleDB | Milyarlarca satır | Petabayt ölçekli metrik |

TimescaleDB, Postgres üzerine zaman-bölümlemeli hypertable'lar ekleyerek zaman serisi tarafını kapatır; milyarlarca satıra kadar rahat ölçeklenir. Sınır çizgisi hep aynı: aşırı fan-out, petabayt hacim ve tek haneli milisaniye gecikme dayatması olmadıkça Postgres yeter.

## AI ajanı çağında tek veritabanı

Bu tartışma 2026'da yeni bir boyut kazandı. Bir AI ajanına yedi ayrı veri sistemi vermek, ona yedi şema, yedi sorgu dili ve yedi hata modu öğretmek demek. Ajanın her araç çağrısında yanlış sistemi seçme ihtimali artar. Tek bir Postgres ise ajana tek bir mental model sunar: her şey SQL, her şey aynı işlem sınırında.

İşte benim iddiam: çoğu ekip için "önce Redis, önce Kafka" refleksi 2026'da erken optimizasyondan ibaret. Postgres ile başlayıp yalnızca ölçüm sizi zorladığında özel sistem eklemek, tersini yapmaktan neredeyse her zaman daha ucuz ve daha az kırılgan. Şema değişikliklerini kesintisiz yapmanın yolunu [sıfır kesintili şema migrasyonları yazımızda](/tr/posts/kesintisiz-sema-migrasyonlari) ele aldık.

## Dürüst sınırlar

Postgres her şey değildir. Petabayt ölçekli log analitiği için ClickHouse gibi kolon tabanlı motorlar hâlâ kat kat önde. Saniyede milyonlarca olayın yüzlerce tüketiciye dağıtıldığı gerçek olay-akışı senaryolarında Kafka'nın yerini tutamaz. Sub-milisaniye p99 gecikme dayatan sıcak yollarda Redis'in bellek-içi modeli daha hızlıdır.

Bir de bağlantı ölçekleme sorunu var: tek Postgres'e binlerce eşzamanlı istemci bağlarsanız bağlantı havuzu şart olur; nedenini ve çözümünü [PgBouncer bağlantı havuzu yazımızda](/tr/posts/pgbouncer-postgres-baglanti-havuzu) anlattık. Ama bunlar istisna; kural değil. Yazma ve okuma yollarını bir motorda toplamanın operasyonel sadeliği, çoğu ekip için bu istisnalardan çok daha değerli. Bu perspektifin en keskin savunusunu [amazingcto'nun "her şey için Postgres"](https://www.amazingcto.com/postgres-for-everything/) yazısında bulabilirsiniz.

## Sıkça Sorulan Sorular

### Postgres gerçekten Redis'in yerini tutar mı?

Çoğu cache senaryosunda evet. `UNLOGGED` tablolar WAL yazmadığı için bellek hızına yaklaşır ve süresi geçen anahtarları bir TTL işiyle temizlersiniz. Yalnızca sub-milisaniye gecikme veya çok yüksek fan-out gerektiren sıcak yollarda Redis'in bellek-içi modeli hâlâ önde olur.

### SKIP LOCKED üretim ölçeğinde iş kuyruğu için güvenli mi?

Evet. `FOR UPDATE SKIP LOCKED` Postgres 9.5'ten beri var ve worker'ların kilitli satırları atlayıp yalnızca boştakini kapmasını sağlar; çakışma ve çift işleme olmaz. Saniyede binlerce işi rahatça taşır ve kalıcıdır. Milyon+ olay/sn seviyesindeki akışlarda ise Kafka'ya geçmek gerekir.

### Ne zaman yine de özel sistem eklemeliyim?

Ölçüm sizi zorladığında. Petabayt log analitiği, saniyede milyonlarca olayın dev fan-out'u veya dayatılan tek haneli milisaniye p99 gecikme, Postgres'in rahat bölgesinin dışındadır. Bu eşiklere ulaşmadan özel sistem eklemek genelde erken optimizasyondur.

### pgvector ayrı bir vektör veritabanının yerini tutar mı?

Orta ölçekte tutar. `pgvector` ve HNSW indeksi, RAG ve semantik arama için yaklaşık 50 milyon vektöre kadar üretim-hazır performans verir; embedding'ler ilişkisel verinizle aynı işlem sınırında kalır. Daha fazla ayrıntı için [yazılım mühendisliği kategorimize](/tr/category/yazilim-muhendisligi) göz atabilirsiniz.
