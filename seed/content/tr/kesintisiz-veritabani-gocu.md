---
title: "Kesintisiz Veritabanı Göçü Nasıl Yapılır?"
slug: "kesintisiz-veritabani-gocu"
translationKey: "zero-downtime-db-migrations-2026"
locale: "tr"
excerpt: "Kısa cevap: expand-contract deseniyle şemayı önce genişletin, veriyi arka planda taşıyın, feature flag ile geçin, eskisini en son silin. Stripe böyle yaptı."
category: "software-engineering"
tags: ["databases", "deployment", "reliability", "best-practices", "sql"]
publishedAt: "2026-10-06"
seoTitle: "Kesintisiz Veritabanı Göçü: Expand-Contract Rehberi"
seoDescription: "Kesintisiz veritabanı göçü, expand-contract deseniyle yapılır: şemayı genişlet, arka planda taşı, feature flag ile geçiş yap, eskisini en son sil."
---

Kısa cevap: şemayı tek adımda değiştirmeyin. Önce yeni yapıyı ekleyin (expand), veriyi küçük parçalar hâlinde arka planda taşıyın, okuma yolunu bir feature flag arkasında kontrollü şekilde değiştirin ve eski yapıyı yalnızca her şey doğrulandıktan sonra ayrı bir adımda silin (contract). Bu sıralama, 100 milyon kaydı sıfır kesintiyle taşıyan Stripe'ın da kullandığı yöntem.

## Tek adımda şema değişikliği neden tehlikeli?

Çünkü production'da zaten çalışan bir sütunu veya tabloyu doğrudan değiştirmek, uygulamanızın eski ve yeni kod sürümlerinin aynı anda çalıştığı anlarda (deploy sırasında, rollback sırasında) birini kırar. [PlanetScale'in belgelediği](https://planetscale.com/blog/backward-compatible-databases-changes) gibi, bir sütunu yeniden adlandırmak ya da tipini değiştirmek yüksek risklidir çünkü o anda hangi kod sürümünün çalıştığını garanti edemezsiniz.

Yakın zamanda yaşanan bir örnek şunu gösteriyor: bir ekip, kullanıcı tablosundaki `status` sütununu doğrudan `ALTER COLUMN` ile yeniden adlandırmaya kalktı. Deploy başladığı anda eski kod sürümü hâlâ `status` sütununu okumaya çalışırken yeni sütun adı devredeydi — birkaç dakika boyunca tüm giriş işlemleri 500 hatası döndü. Çözüm basitti ama geç geldi: önce yeni sütunu eklemek, iki sütuna da yazmak, veriyi taşımak, sonra eskisini silmek gerekiyordu.

## Expand-contract deseni nasıl çalışır?

Üç ayrı, geri alınabilir aşamadan oluşur ve her aşama kendi deploy döngüsünde yayınlanır.

| Aşama | Ne yapılır | Geri alınabilir mi? |
|---|---|---|
| Expand | Yeni sütun/tablo eklenir, eski yapı dokunulmadan kalır | Evet — henüz hiçbir okuma değişmedi |
| Migrate | Veri arka planda küçük gruplar hâlinde taşınır, çift yazma başlar | Evet — eski yapı hâlâ doğru veriyi taşıyor |
| Contract | Okuma yeni yapıya geçer, eski yapı en son silinir | Yalnızca contract'tan önce |

Her aşamayı ayrı bir pull request ve ayrı bir deploy olarak ele almak, ekibin "bugün hangi aşamadayız" sorusuna her zaman net bir cevap vermesini sağlıyor; üç aşamayı tek bir büyük PR'da birleştirmek, deseni uygulamanın değil sadece adını kullanmanın en yaygın yolu.

Expand aşamasında yeni sütunu her zaman nullable olarak ekleyin; `NOT NULL` ile eklemek büyük bir tabloda tüm satırları kilitleyebilir. İndeks oluşturuyorsanız `CREATE INDEX CONCURRENTLY` (Postgres) ya da eşdeğer online araç kullanın — aksi hâlde tablo yazma kilidi altına girer.

## Veriyi arka planda taşırken nelere dikkat edilir?

Backfill işleminin altın kuralı: küçük gruplar, ölçülebilir ilerleme, kontrollü hız. Pratikte şöyle işler:

```sql
UPDATE users
SET status_v2 = status
WHERE id BETWEEN :batch_start AND :batch_end
  AND status_v2 IS NULL;
```

Bu sorguyu birkaç bin satırlık gruplar hâlinde, her grup arasında kısa bir bekleme ile çalıştırın. İki metrik izleyin: işlenen satır sayısı ve başarısız satır sayısı. Backfill çalışırken production'a gelen yeni yazmaları kaçırmamak için change data capture (CDC) kullanın ya da uygulamanızı geçici olarak çift yazma moduna alın — hem eski hem yeni sütuna aynı anda yazsın. Aksi hâlde backfill bitene kadar gelen yeni kayıtlar yeni sütunda eksik kalır.

CDC tarafında yaygın kurulum, Debezium gibi bir aracı veritabanının replikasyon günlüğüne (Postgres'te WAL, MySQL'de binlog) bağlamak ve her değişikliği bir mesaj kuyruğuna akıtmak. Bu sayede backfill script'i geçmiş veriyi taşırken, CDC akışı da o sırada gelen yeni yazmaları yakalayıp yeni sütuna uyguluyor; iki mekanizma birbirini tamamlıyor, biri geçmişi, diğeri şimdiki zamanı kapatıyor. CDC kurmak size fazla geliyorsa, uygulama kodunda açık bir çift yazma (hem eski hem yeni sütuna yazan iki satırlık ek kod) çoğu orta ölçekli proje için yeterli.

[Stripe'ın belgelediği](https://stripe.com/en-sk/blog/how-stripes-document-databases-supported-99.999-uptime-with-zero-downtime-data-migrations) 100 milyon abonelik kaydını taşıma örneği bu ölçeğin neden önemli olduğunu gösteriyor: her kayıt dönüşümü 1 saniye sürseydi, sıralı bir göç yaklaşık 3 yıl alırdı. Stripe bunun yerine çift yazma deseniyle çalıştı — önce hem eski hem yeni tabloya yaz, sonra okuma yolunu taşı, sonra yazma yolunu taşı, en son eski veriyi sil.

## Okuma geçişini feature flag ile nasıl kontrol edersiniz?

Veri taşındıktan sonra okuma yolunu bir anda değiştirmeyin. Yeni sütunu okuyan kod yolunu bir feature flag arkasına koyup, trafiğin küçük bir yüzdesinde (örneğin %1, sonra %10, sonra %50) açın. Her adımda hata oranını, gecikme metriklerini ve veri tutarlılığını (eski ve yeni sütunun aynı değeri döndürdüğünü) izleyin. Bir sorun görürseniz flag'i kapatmak, kod deploy etmeden saniyeler içinde eski davranışa dönmenizi sağlar — bu, [blue-green ve canary deployment](/tr/posts/blue-green-mi-canary-mi) stratejilerinde kullanılan kademeli geçiş mantığının aynısı.

## Her adımda geri dönüş nasıl yapılır?

Expand aşamasında geri dönüş bedavadır: yeni sütunu bırakın, hiçbir şey bozulmaz. Migrate aşamasında da güvenlisiniz çünkü eski yapı hâlâ doğru veriyi taşıyor; backfill'i durdurup eski okuma yoluna devam edebilirsiniz. Asıl dikkat gereken an contract aşaması: eski sütunu sildikten sonra geri dönüş artık mümkün değil. Bu yüzden contract adımını, yeni yapının en az bir tam üretim döngüsü boyunca hatasız çalıştığını doğruladıktan sonra, ayrı bir deploy olarak yapın — asla migrate ile aynı deploy'da değil.

## Hangi araçlar bu süreci güvenli hâle getiriyor?

MySQL tarafında `gh-ost` ve Vitess, tabloyu kilitlemeden online şema değişikliği yapıyor; PlanetScale bu araçları production ortamında bu amaçla kullanıyor. Postgres'te `CREATE INDEX CONCURRENTLY` ve `pg_repack` benzer bir rol oynuyor. Migration runner tarafında Flyway, Liquibase, Prisma Migrate veya framework'ünüzün kendi migration aracı, expand ve contract adımlarını ayrı migration dosyaları olarak tutmanızı sağlıyor — tek bir migration dosyasında hem ekleme hem silme yapmak, bu desenin bütün amacını ortadan kaldırır.

`gh-ost` ile bir sütun eklemek pratikte şuna benziyor: aracı `--alter` bayrağıyla çalıştırırsınız, o da arka planda tablonun bir gölge kopyasını oluşturup değişikliği orada uygular, binlog'u takip ederek aradaki farkı senkronize eder ve son anda atomik bir yeniden adlandırmayla devreye alır. Bu süreç boyunca orijinal tablo okuma ve yazmaya açık kalır — kilitlenme, yalnızca son yeniden adlandırma anında, milisaniyeler mertebesinde yaşanır.

Burada vurgulamam gereken bir nokta var: ekiplerin çoğu expand ve migrate adımlarına yeterince özen gösteriyor ama contract adımını unutuyor. Aylar sonra kullanılmayan eski sütunlarla dolu bir şema, teknik borcun en sinsi hâli — kimse silmeye cesaret edemiyor çünkü "belki bir yerde hâlâ okunuyordur" endişesi var. Contract adımını baştan planın takvimine (örneğin "iki hafta sonra sil") yazın, aksi hâlde hiç olmaz. Bu konuyu [kesintisiz şema migrasyonları](/tr/posts/kesintisiz-sema-migrasyonlari) yazımızda daha dar bir kapsamda, uygulama kodunun şemaya nasıl uyum sağlaması gerektiği açısından ele almıştık; [kesintisiz deployment](/tr/posts/kesintisiz-deployment) yazımız ise uygulama tarafındaki kademeli geçişi anlatıyor. Benzer additive-first mantığı [API versiyonlama stratejileri](/tr/posts/api-versiyonlama-stratejileri) yazımızda da görebilirsiniz. Diğer mühendislik pratikleri için [yazılım mühendisliği kategorimize](/tr/category/yazilim-muhendisligi) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Expand-contract deseni tam olarak nedir?

Bir şema değişikliğini tek adımda değil üç ayrı, geri alınabilir aşamada yapma yöntemi: önce yeni yapıyı ekleyin (expand), veriyi arka planda taşıyın ve çift yazın (migrate), son olarak eski yapıyı silin (contract). Her aşama ayrı bir deploy döngüsünde yayınlanır.

### Backfill işlemini nasıl güvenli hâle getiririm?

Veriyi küçük gruplar hâlinde (birkaç bin satır), gruplar arasında kısa beklemelerle taşıyın; işlenen ve başarısız satır sayısını izleyin. Backfill çalışırken gelen yeni yazmaları kaçırmamak için change data capture kullanın ya da uygulamayı geçici olarak çift yazma moduna alın.

### Contract adımını ne zaman yapmalıyım?

Yeni yapının en az bir tam üretim döngüsü boyunca hatasız çalıştığını doğruladıktan sonra, ayrı bir deploy olarak. Migrate adımıyla aynı deploy'da yapmayın — contract geri dönüşü imkânsız kılan tek adımdır.

### Bu süreç için hangi araçları kullanmalıyım?

MySQL'de gh-ost veya Vitess, Postgres'te CREATE INDEX CONCURRENTLY ve pg_repack tabloyu kilitlemeden değişiklik yapmanızı sağlar. Flyway, Liquibase veya Prisma Migrate gibi migration runner'lar expand ve contract adımlarını ayrı dosyalar olarak tutmanıza yardımcı olur.
