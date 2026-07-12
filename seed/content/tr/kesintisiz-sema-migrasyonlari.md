---
title: "Kesintisiz Veritabanı Şema Migrasyonları"
slug: "kesintisiz-sema-migrasyonlari"
translationKey: "zero-downtime-schema-migrations"
locale: "tr"
excerpt: "Bir ALTER TABLE üretim tablosunu kilitledi. Expand-contract deseni, batch backfill ve CREATE INDEX CONCURRENTLY ile kesintisiz şema değişikliği nasıl yapılır?"
category: "software-engineering"
tags: ["databases", "sql", "reliability", "deployment", "best-practices"]
publishedAt: "2026-07-12"
seoTitle: "Kesintisiz Şema Migrasyonu: Expand-Contract Deseni Rehberi"
seoDescription: "Bir ALTER TABLE üretim tablosunu kilitledi. Expand-contract deseni, batch backfill ve CREATE INDEX CONCURRENTLY ile kesintisiz şema değişikliği nasıl yapılır?"
---

Saat gece 2'de, 40 milyon satırlık `orders` tablosuna `NOT NULL` bir kolon eklemek için çalıştırılan tek bir `ALTER TABLE`, tabloyu dakikalarca kilitledi. Migration kendisi hızlıydı ama Postgres, mevcut her satırı doğrulamak için tabloyu yeniden yazarken `ACCESS EXCLUSIVE` kilit tuttu — o sürede ne okuma ne yazma yapılabildi, ödeme akışı durdu. Bu yazı o gecenin çıkardığı dersle başlıyor: şema değişiklikleri "tek adımda" güvenli değil, birden fazla küçük ve geri alınabilir adıma bölünmeli.

Expand-contract deseni tam olarak bunu sağlıyor. Bu yazıda deseni, güvenli backfill stratejilerini, `CREATE INDEX CONCURRENTLY` ile kilitlerden kaçınmayı ve uygulama-şema rollout'unu nasıl koordine edeceğinizi ele alıyoruz.

## Expand-contract deseni: neden bölmek zorunludasınız

[Martin Fowler'ın "Parallel Change" olarak adlandırdığı](https://martinfowler.com/bliki/ParallelChange.html) fikir basit: geriye dönük uyumsuz bir şema değişikliğini tek bir deploy yerine dört ayrı, her biri kendi başına güvenli adıma bölüyorsunuz. **Expand**: yeni kolonu (ya da tabloyu) `NULL` olabilir şekilde ekleyin — eski kod bundan etkilenmez. **Backfill**: mevcut satırları yeni kolona kopyalayın, küçük batch'ler hâlinde. **Switch**: uygulama kodunu yeni kolonu okuyup yazacak şekilde deploy edin, gerekirse bir süre her iki kolona da yazın (dual-write). **Contract**: hiçbir kod eski kolonu referans almadığında onu kaldırın. Bu, tek adımlık bir migration'ı birden fazla deploy'a yayıyor ama her adım bağımsız olarak geri alınabilir — ilk gece yaşadığımız felaketin tam tersi bir garanti.

## Backfill'i batch'lere bölmek neden şart

Tüm satırları tek bir `UPDATE` ile backfill etmek, tek bir `ALTER TABLE` kadar tehlikeli: hem uzun süre satır kilitleri tutar hem de transaction log'unuzu şişirir. Pratik yaklaşım, birincil anahtara göre 1.000-10.000 satırlık batch'ler hâlinde `UPDATE ... WHERE id BETWEEN ... AND ...` çalıştırıp batch'ler arasına kısa bir bekleme koymak — bu, canlı trafiğin replikasyon gecikmesini ya da kilit çekişmesini fark edilir düzeyde büyütmeden ilerlemenizi sağlıyor. Büyük tablolarda bu iş saatler sürebilir; acele etmemek, gece yarısı acil müdahalesinden çok daha ucuz.

## CREATE INDEX CONCURRENTLY: yazma kilidi olmadan indeks

Standart `CREATE INDEX`, tamamlanana kadar tabloya yazma işlemlerini engelleyen bir kilit tutar. [Postgres'in resmi dokümantasyonuna göre](https://www.postgresql.org/docs/current/sql-createindex.html), `CREATE INDEX CONCURRENTLY` bunun yerine `SHARE UPDATE EXCLUSIVE` kilidi kullanıyor — eşzamanlı ekleme, güncelleme ve silme işlemlerini engellemiyor. Bedeli var: tabloyu iki kez taramanız gerekiyor ve indeksi kullanabilecek tüm mevcut transaction'ların bitmesini beklemeniz gerekiyor, bu yüzden standart yönteme göre belirgin şekilde daha uzun sürüyor. Ayrıca `CONCURRENTLY` bir transaction bloğu içinde çalışamaz ve yarıda kesilirse geçersiz (`INVALID`) bir indeks bırakabilir — bu durumda indeksi düşürüp yeniden denemeniz gerekir.

```sql
-- Yazma kilidi olmadan indeks oluşturma
CREATE INDEX CONCURRENTLY idx_orders_customer_id
  ON orders (customer_id);

-- Yarıda kesilirse kontrol edin ve temizleyin
SELECT indexrelid::regclass, indisvalid
FROM pg_index
WHERE indexrelid = 'idx_orders_customer_id'::regclass;
-- indisvalid = false ise: DROP INDEX idx_orders_customer_id; ve tekrar deneyin
```

## Uygulama ve şema rollout'unu koordine etmek

Expand-contract'ın en kolay bozulan noktası, uygulama deploy'u ile şema migration'ının senkron olmaması. Güvenli sıra şu: önce şemayı genişletin (yeni kolon `NULL`), sonra uygulamayı hem eski hem yeni kolona yazacak, ama sadece eskisinden okuyacak şekilde deploy edin, backfill'i çalıştırın, ardından uygulamayı yeni kolondan okuyacak şekilde deploy edin, son olarak eski kolonu kaldırın. Her adımda önceki adıma geri dönebiliyor olmanız kritik — bu da [kesintisiz deployment yazımızda](/tr/posts/kesintisiz-deployment) savunduğumuz "her deploy adımı kendi başına rollback edilebilir olmalı" ilkesinin şema tarafındaki karşılığı.

| Adım | Şema durumu | Uygulama davranışı | Geri dönüş güvenli mi? |
|---|---|---|---|
| 1. Expand | Yeni kolon eklendi (NULL) | Değişmedi | Evet, kolon henüz kullanılmıyor |
| 2. Dual-write | Aynı | Her iki kolona da yazar | Evet, eski kolon hâlâ okunuyor |
| 3. Backfill | Aynı | Aynı | Evet, sadece veri kopyalanıyor |
| 4. Switch (oku) | Aynı | Yeni kolondan okur | Evet, eski kolona geri dönebilirsiniz |
| 5. Contract | Eski kolon kaldırıldı | Yeni kolonu kullanır | Hayır — bu adımdan sonra rollback yok |

## Ne zaman expand-contract gereksiz karmaşıklık

Küçük bir tabloda (birkaç bin satır) ya da düşük trafikli bir iç araçta, standart `ALTER TABLE`'ın birkaç saniyelik kilidi fark edilmeyebilir — bu durumda dört adımlık süreç gereksiz bir yük. Buradaki karar kriteri tablo boyutu değil, kilit süresinin kullanıcı tarafından hissedilip hissedilmeyeceği: [database indexleme yazımızda](/tr/posts/veritabani-indeksleme) da vurguladığımız gibi, ölçüm yapmadan optimize etmek zaman kaybı. Migration'ı çalıştırmadan önce `EXPLAIN` ve tablo boyutuyla kabaca kilit süresini tahmin edin; saniyelerden bahsediyorsanız basit yol yeterli.

Feature flag'lerle birlikte yürüttüğünüz migrasyonlarda, [feature flag yönetimi yazımızda](/tr/posts/feature-flag-teknik-borc) anlattığımız release/switch ayrımı burada da işe yarıyor: şema geçişini bir flag'in arkasına almak, "switch" adımını anında geri alınabilir kılıyor. N+1 sorgu problemleriyle uğraşıyorsanız, backfill sırasında eklediğiniz indeksler genelde [N+1 sorgu problemini çözme yazımızda](/tr/posts/n-plus-one-sorgu-problemi) bahsettiğimiz sorguları da hızlandırıyor — iki taşı bir kuşla vurmuş oluyorsunuz.

## Migrasyonu izlemek: neye bakmalısınız

Backfill çalışırken kör uçmayın. En az üç metriği canlı izleyin: replikasyon gecikmesi (özellikle okuma replikalarınız varsa), aktif kilit sayısı (`pg_locks` üzerinden) ve backfill batch'lerinin tamamlanma hızı. Replikasyon gecikmesi normalin belirgin üzerine çıkarsa batch boyutunu küçültün ya da batch'ler arası bekleme süresini uzatın — bu, hızdan ödün verip güvenilirlik kazanmanın en ucuz yolu. Migrasyonu bir gece yarısı "ateşle ve unut" işi olarak değil, ilerlemesini gerçek zamanlı gözlemlediğiniz bir deploy gibi ele almak, [OpenTelemetry'e başlangıç rehberimizde](/tr/posts/opentelemetry-baslangic-rehberi) savunduğumuz "üretimdeki her değişikliği gözlemlenebilir kılın" ilkesinin migrasyonlara uygulanmış hâli.

Son olarak, migrasyon script'lerinizi bir kere yazıp unutulan tek seferlik araçlar olarak değil, versiyon kontrollü ve gözden geçirilen kod olarak ele alın. Batch boyutu, bekleme süresi ve rollback adımları PR incelemesinden geçmeli — tıpkı uygulama kodunuz gibi. Bu disiplin, ilk paragraftaki gece yarısı olayının bir daha yaşanmaması için attığınız en ucuz adım.

Migrasyonu hangi saatte çalıştıracağınız da bu disiplinin bir parçası: trafiğin en düşük olduğu pencere en güvenlisi, ama expand-contract deseninin asıl avantajı bunu daha az kritik hâle getirmesi. Backfill ve indeks oluşturma adımlarını düşük trafik saatinde, kilit riski taşımayan "switch" adımını ise gündüz, ekip tam kadro müsaitken çalıştırmak, bir sorun çıktığında hızlıca müdahale edebilmenizi sağlıyor.

Daha fazla veritabanı ve güvenilirlik pratiği için [Yazılım Mühendisliği kategorisine](/tr/category/yazilim-muhendisligi) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Expand-contract her migration için mi gerekli?

Hayır. Yeni bir `NULL` olabilen kolon eklemek zaten kilitsiz ve hızlıdır, tek adımda güvenlidir. Expand-contract asıl kolon yeniden adlandırma, tip değiştirme ya da `NOT NULL` kısıtı ekleme gibi geriye dönük uyumsuz değişikliklerde gerekli.

### CREATE INDEX CONCURRENTLY her zaman standart yönteme tercih edilmeli mi?

Üretimde eşzamanlı trafik varsa evet. Ama bakım penceresinde, tablo zaten izole edilmişse, standart `CREATE INDEX` daha hızlı tamamlanır çünkü tek tarama yeterli — `CONCURRENTLY`'nin bedelini gerçekten kilitsiz çalışmaya ihtiyacınız olduğunda ödemeye değer.

### Dual-write aşaması ne kadar sürmeli?

Backfill'in tamamlanıp doğrulanmasına yetecek kadar — genelde birkaç saat ile birkaç gün arası. Bu süreyi çok kısa tutmak, backfill tamamlanmadan okuma anahtarını değiştirip eksik veriyle karşılaşma riski taşır.

### CREATE INDEX CONCURRENTLY yarıda kalırsa ne olur?

Geçersiz (`INVALID`) bir indeks tabloda kalır; bu indeks sorgu planlayıcısı tarafından kullanılmaz ama disk alanı kaplamaya devam eder. `pg_index` üzerinden `indisvalid` durumunu kontrol edip, geçersizse indeksi `DROP INDEX` ile kaldırıp yeniden denemeniz gerekir.
