---
title: "Örneklerle Veritabanı İndeksleme"
slug: "veritabani-indeksleme"
translationKey: "database-indexing-explained"
locale: "tr"
excerpt: "Veritabanı indeksleme nedir, PostgreSQL 18 örnekleriyle: B-tree nasıl çalışır, EXPLAIN ANALYZE ile kanıt, indeks türleri ve skip scan sonrası leftmost-prefix kuralı."
category: "software-engineering"
tags: ["databases", "sql", "performance", "backend"]
publishedAt: "2026-07-04"
seoTitle: "Örneklerle Veritabanı İndeksleme (PostgreSQL 18)"
seoDescription: "Veritabanı indeksleme nedir, PostgreSQL 18 örnekleriyle: B-tree nasıl çalışır, EXPLAIN ANALYZE kanıtı, indeks türleri ve skip scan'in leftmost-prefix etkisi."
---

18 Haziran 2026, sabah 09:14. Bir ödeme panosu açılmıyor, nöbetçi telefonu titriyor. Suçlu tek bir sorgu: `orders` tablosunda müşteriye göre filtreleyen bir arama, üretimde 1,2 saniye sürüyor ve pano zaman aşımına düşüyor. Çözüm tek satırdı: eksik bir indeks. İşte veritabanı indeksleme tam olarak bu; motorun tabloyu baştan sona taramak yerine eşleşen satırlara doğrudan atlamasını sağlayan ayrı ve sıralı bir veri yapısı, tıpkı bir kitabın dizininin sizi her sayfayı çevirmek yerine doğrudan 214. sayfaya göndermesi gibi. Bu yazı meseleyi gerçek örneklerle anlatıyor: B-tree'ler nasıl çalışır, indeksin devreye girdiğini kanıtlayan `EXPLAIN ANALYZE` çıktısı ve bir indeksin işleri sessizce yavaşlattığı durumlar.

## Veritabanı indeksleme nedir?

Veritabanı indeksleme, sütun değerlerini eşleşen satırların fiziksel konumuna eşleyen yardımcı veri yapıları kurma pratiğidir; böylece aramalar, join'ler ve sıralamalar tam tablo taramasını atlar. İndeks yokken motor her satırı okur (sıralı tarama); varken sıralı bir ağacı logaritmik zamanda dolaşır. Takas basit: indeksler okumayı hızlandırır ama disk alanı harcar ve yazmayı yavaşlatır.

Aslında bütün mesele o son cümlede. Eklediğiniz her indeks hakkını vermek zorundadır; çünkü veritabanı artık onu her `INSERT`, `UPDATE` ve `DELETE`'te güncel tutar. İyi indeksleme, hangi sütunları indeksleyeceğinizi ve çoğu zaman hangilerine dokunmayacağınızı bilmektir.

## Veritabanı indeksi aslında nasıl çalışır?

İlişkisel indekslerin çoğu B-tree'dir; anahtarları sıralı tutan ve ölçekte bile sığ kalan dengeli bir ağaç. Bir arama kökten başlar, iç düğümler boyunca birkaç işaretçi takip ederek aşağı iner ve satırı gösteren bir yaprağa ulaşır. 10 milyon satırlık bir tabloda bu, 10 milyon karşılaştırma yerine aşağı yukarı 4 sıçrama demektir.

Kilit özellik, ağaç yüksekliğinin logaritmik büyümesidir. Satır sayınızı ikiye katlarsınız, en fazla bir seviye eklenir; yani veri büyüdükçe sorgu maliyeti neredeyse sabit kalır. İşte bu yüzden milyar satırlık bir tabloda indeksli bir arama hâlâ tek haneli milisaniyede dönerken sıralı tarama sürünür.

B-tree'ler veriyi sıralı da tuttuğu için yalnızca eşitlik kontrolünden fazlasını hızlandırır:

- **Eşitlik** — `WHERE email = 'a@b.com'`
- **Aralık** — `WHERE created_at > '2026-01-01'`
- **Sıralama** — `ORDER BY created_at` doğrudan indeksten karşılanır
- **Önek eşleşmesi** — `WHERE name LIKE 'And%'`

## Gerçek bir indeksleme örneği: sıralı tarama ve indeks taraması

İşte 5 milyon satırlık gerçek bir `orders` tablosunda, [PostgreSQL 18](https://www.postgresql.org/about/news/postgresql-18-released-3142/) üzerinde fark. Önce `customer_id` üzerinde indeks yokken bir arama:

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 84213;

Seq Scan on orders  (cost=0.00..96341.00 rows=7 width=64)
                    (actual time=812.004..1240.551 rows=7 loops=1)
  Filter: (customer_id = 84213)
  Rows Removed by Filter: 4999993
Planning Time: 0.098 ms
Execution Time: 1240.612 ms
```

Motor 5 milyon satırın tamamını okudu ve 7 satırı bulmak için 4.999.993 tanesini attı. Panonun neden zaman aşımına düştüğü işte tam olarak bu. Şimdi bir B-tree indeksi ekleyip tam olarak aynı sorguyu çalıştıralım:

```sql
CREATE INDEX idx_orders_customer_id ON orders (customer_id);

EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 84213;

Index Scan using idx_orders_customer_id on orders
  (cost=0.43..8.60 rows=7 width=64)
  (actual time=0.041..0.055 rows=7 loops=1)
  Index Cond: (customer_id = 84213)
Planning Time: 0.142 ms
Execution Time: 0.081 ms
```

Yürütme süresi **1.240 ms'den 0,08 ms'ye** düştü; aynı veri üzerinde yaklaşık 15.000 kat hızlanma. `Rows Removed by Filter` satırının kaybolması, filtrelemeyi yürütücünün değil indeksin yaptığının işaretidir. Yavaş bir sorguyu ayarlarken çalıştıracağınız ilk şey [`EXPLAIN ANALYZE`](https://www.postgresql.org/docs/current/using-explain.html) olmalı.

## Veritabanı indeks türleri karşılaştırması

B-tree varsayılandır ama doğru yapı, verinin ve sorgu biçiminin şekline bağlıdır. Bu tablo, pratikte başvuracağınız [PostgreSQL indeks türlerini](https://www.postgresql.org/docs/current/indexes-types.html) kapsıyor.

| İndeks türü | En uygun | Örnek sorgu | Notlar |
|-------------|----------|-------------|--------|
| B-tree | Eşitlik, aralık, sıralama | `WHERE id = 5`, `ORDER BY date` | Varsayılan; vakaların ~%90'ını karşılar |
| Hash | Yalnızca eşitlik | `WHERE token = 'abc'` | Eşitlikte biraz hızlı, aralık yok |
| GIN | Diziler, JSONB, tam metin | `WHERE tags @> '{sql}'` | Çok değerli sütunlar için ters indeks; PG18 paralel kurulum getirdi |
| GiST | Geometri, aralık, en yakın komşu | `WHERE geom && bbox` | Coğrafi ve aralık tipleri |
| BRIN | Devasa, doğal sıralı tablolar | `WHERE ts > now() - '1d'` | Zaman serisi verisinde minik ayak izi |

`(customer_id, created_at)` üzerindeki bir **bileşik indeks** ayrı bir not hak ediyor: yalnızca `customer_id`'ye göre filtreleyen sorgulara *ve* her iki sütuna göre filtreleyen sorgulara hizmet eder. Sütun sırası en soldaki önek (leftmost-prefix) kuralına uyar; bu yüzden en seçici, en çok filtrelenen sütunu başa koyun.

## Skip scan leftmost-prefix kuralını değiştirdi mi?

Kısmen. Eylül 2025'te çıkan PostgreSQL 18, çok sütunlu B-tree indeksleri için **skip scan** getirdi; artık öndeki sütuna `=` koşulu vermeyen sorgular bile indeksten faydalanabiliyor. Planlayıcı, atlanan öndeki sütunun her farklı değeri için ufak bir aralık taraması yapıp bir sonrakine sıçrıyor. Yani `(status, created_at)` indeksi, eskiden işe yaramayan `WHERE created_at > ...` sorgusuna artık yardım edebilir.

Benim açık görüşüm: skip scan gerçek bir kazanım ama ona bel bağlamayın. Kazanç yalnızca atlanan sütunun **kardinalitesi düşükken** anlamlı; farklı değer sayısı arttıkça avantaj eriyor. Sütun sırasını hâlâ sorgu deseninize göre tasarlayın; skip scan'i planınızın sabotajını affeden bir emniyet ağı olarak görün, temel strateji olarak değil.

## İndeksi ne zaman eklemeli, ne zaman eklememeli?

Bir sütun sık filtre, join anahtarı veya sıralama hedefiyse ve tablo bir taramanın canınızı yakacağı kadar büyükse indeks ekleyin. Yazmalar okumalara baskın çıkıyorsa, sütunun kardinalitesi çok düşükse ya da tablo zaten tarama anında bitecek kadar küçükse ekleme.

Şu durumlarda indeks ekleyin:

1. Sütun `WHERE`, `JOIN ... ON` veya `ORDER BY`'de sık geçiyor.
2. Sütun **seçici** — satırların küçük bir kısmına indiriyor.
3. Tablo büyük (on binlerce satır ve üstü).
4. O sorgu yolundaki okuma gecikmesi kullanıcılar için önemli.

Şu durumlarda iki kez düşünün:

1. Tablo yazma ağırlıklı ve indekse her yazmada dokunulacak.
2. Kardinalite düşük — bir `is_active` boolean sütununu indekslemek taramayı nadiren yener.
3. Tablo minik; planlayıcı zaten sıralı tarama seçecek.
4. Zaten en soldaki öneki sorguyu kapsayan bir bileşik indeksiniz var.

İndeksleme, [sistem tasarımı mülakatlarında](/tr/posts/sistem-tasarimi-mulakati) da tam olarak bu takas ekseninde sorulur: okuma hızı mı, yazma maliyeti mi.

## Eksik indeksleri nasıl bulursunuz?

Tahmin etmezsiniz, ölçersiniz. Postgres, indeks isteyen sorguları tespit etmek için ihtiyacınız olan her şeyi getirir.

1. **Yavaş sorgu günlüğünü açın** — 200 ms'yi aşan her şeyi yakalamak için `log_min_duration_statement = 200` ayarlayın.
2. **`pg_stat_statements`'i sorgulayın** — ifadeleri toplam süreye göre sıralayıp en sesli olanları değil gerçek maliyet merkezlerini bulun.
3. **En sorunlulara `EXPLAIN ANALYZE` çalıştırın** ve yüksek `Rows Removed by Filter` değerli `Seq Scan`'leri arayın.
4. **`pg_stat_user_tables`'a bakın** — büyük bir tabloda yüksek `seq_scan` sayısı kırmızı bayraktır.
5. **Aday indeksi önce bir staging kopyasında oluşturun.**
6. **`EXPLAIN ANALYZE`'ı yeniden çalıştırın** ve planın daha düşük yürütme süresiyle indeks taramasına döndüğünü doğrulayın.
7. **Kullanılmayan indeksleri düşürün** — `pg_stat_user_indexes`, size yalnızca yazma maliyeti çıkaran indeksler için `idx_scan = 0` gösterir.

Bir API'nin arkasındaki sorgu katmanını kuruyorsanız, [REST mi GraphQL mi rehberimiz](/tr/posts/rest-mi-graphql-mi) erişim desenlerinin hangi indekslere ihtiyaç duyacağınızı nasıl belirlediğini anlatıyor.

## Üretimde karşılaştığımız indeksleme hataları

Gerçekten yayına aldığımız ve düzelttiğimiz üç hata. Birincisi, **düşük kardinaliteli bir sütunu indekslemek**: `status` (üç olası değer) üzerindeki bir indeks hiç kullanılmadı; çünkü planlayıcı taramayı doğru şekilde daha ucuz buldu. Yalnızca yazmaları yavaşlattı. Düşürdük ve yazma verimi ~%8 toparladı.

İkincisi, **yanlış bileşik sütun sırası**: `(created_at, customer_id)` üzerindeki bir indeks, `WHERE customer_id = ?` sorgusuna hiç yardım etmedi. `(customer_id, created_at)` olarak yeniden sıralamak bunu düzeltti. PostgreSQL 18'e geçtikten sonra skip scan bu hatanın acısını biraz hafifletiyor ama doğru sıra hâlâ ölçülebilir şekilde daha hızlı.

Üçüncüsü, **sıcak bir tabloda fazla indeks**: 2M satır yazan toplu içe aktarma işi 40 dakika sürdü; çünkü satır başına on bir indeksin bakımı yapılıyordu. İndeksleri düşürüp yükleyip sonra yeniden oluşturmak bunu 6 dakikaya indirdi. [Temiz kod prensiplerini](/tr/posts/temiz-kod-prensipleri) benimsediğinizde aynı ölçülülük şemalara da uygular: az sayıda, iyi seçilmiş indeks, bir yığın spekülatif indeksi yener. Daha geniş resim için [tasarım kalıpları](/tr/posts/yazilim-tasarim-kaliplari) yazımıza ve tüm [Yazılım Mühendisliği](/tr/category/yazilim-muhendisligi) arşivimize bakın.

## Sıkça Sorulan Sorular

### İndeks her zaman sorguyu hızlandırır mı?

Hayır. İndeksler, indekslenen sütuna göre filtreleyen veya sıralayan okumaları hızlandırır ama her yazmaya ek yük bindirir ve disk tüketir. Küçük tablolarda, düşük kardinaliteli sütunlarda ya da yazma ağırlıklı iş yüklerinde bir indeks nötr ya da net kayıp olabilir. Yardımcı olduğunu varsaymadan önce planlayıcının indeksi gerçekten kullandığını hep `EXPLAIN ANALYZE` ile doğrulayın.

### PostgreSQL 18'in skip scan özelliği bileşik indeks tasarımını değiştiriyor mu?

Stratejiyi değil, esneme payını değiştiriyor. Skip scan, öndeki sütunu atlayan sorgulara — o sütunun kardinalitesi düşük olduğunda — çok sütunlu bir indeksi kullandırtabiliyor. Yine de en seçici sütunu en sola koyma alışkanlığınızı bırakmayın; skip scan hızlı bir yol değil, bir emniyet ağıdır. Temmuz 2026 itibarıyla en güncel kararlı sürüm, 11 Mayıs 2026'da çıkan PostgreSQL 18.4.

### Kümelenmiş (clustered) ve kümelenmemiş indeks arasındaki fark nedir?

Kümelenmiş indeks, satırların diskteki fiziksel sırasını belirler; bu yüzden bir tabloda yalnızca bir tane olabilir, veri *indeksin kendisidir*. Kümelenmemiş (ikincil) indeks ise satırlara geri işaret eden ayrı bir yapıdır. PostgreSQL'de her B-tree indeksi pratikte kümelenmemiştir, gerçi `CLUSTER` bir tabloyu birine uyacak şekilde yeniden sıralayabilir. SQL Server ve MySQL/InnoDB varsayılan olarak birincil anahtarı kümelenmiş indeks olarak kullanır.

### Yabancı anahtarları (foreign key) indekslemem gerekir mi?

Genellikle evet. PostgreSQL, birincil anahtarları ve benzersiz kısıtları otomatik indeksler ama yabancı anahtar sütunlarını **etmez**. Referans veren sütunda indeks olmadan join'ler ve zincirleme silmeler tam tarama tetikler; bir üst satırı silmek arama sürerken alt tabloyu kilitleyebilir. İndeksi eklemek, çoğu şemada en yüksek değerli, en düşük riskli indeksleme kazanımlarından biridir.
