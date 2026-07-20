---
title: "Apache Iceberg Nedir? Lakehouse'un Yeni Standardı"
slug: "apache-iceberg-nedir-lakehouse"
translationKey: "apache-iceberg-lakehouse"
locale: "tr"
excerpt: "Snowflake, Databricks, AWS, Google ve Apple aynı açık tablo formatını kullanıyor: Apache Iceberg. Lakehouse'un ambar ile gölü nasıl birleştirdiğini anlatıyoruz."
category: "devops-cloud"
tags: ["databases", "cloud", "open-source", "sql"]
publishedAt: "2026-07-20"
seoTitle: "Apache Iceberg Nedir? Lakehouse Standardı Rehberi"
seoDescription: "Apache Iceberg açık tablo formatı, veri ambarı ile gölünü tek katmanda birleştiriyor. V4 spesifikasyonu ve büyük şirketlerin benimsemesini anlatıyoruz."
---

Apache Iceberg, verinizi bir bulut depolama katmanında (S3, GCS, ADLS) bir kez tutup Spark, Snowflake, DuckDB veya Python'dan aynı anda sorgulamanızı sağlayan açık kaynak bir tablo formatı. 2026 itibarıyla bu format, veri ambarı (warehouse) ile veri gölünün (data lake) yıllardır süren çoğaltma sorununu çözen fiili standart hâline geldi.

Geleneksel kurulumda verinizi hem bir veri ambarında (raporlama için) hem bir veri gölünde (makine öğrenmesi ve ham işleme için) iki kere tutardınız; bu da senkronizasyon gecikmesi, çift depolama maliyeti ve "hangi kopya doğru" belirsizliği yaratırdı. Lakehouse mimarisi bu ayrımı ortadan kaldırıyor ve Apache Iceberg bunun teknik omurgasını oluşturuyor.

## Açık tablo formatı ne anlama geliyor?

Bir açık tablo formatı, ham Parquet veya ORC dosyalarının üzerine bir metadata katmanı ekler: hangi dosyaların hangi tabloya ait olduğunu, şema geçmişini, partition bilgisini ve zaman içindeki değişiklikleri (snapshot'ları) takip eder. Bu metadata katmanı sayesinde bir motor (Spark, Trino, Snowflake, DuckDB) dosyaları taramadan doğrudan "bu tabloda hangi dosyalar var" sorusuna cevap alır; ayrıca ACID işlemleri, zaman yolculuğu (time travel) ve şema evrimi gibi veritabanı özellikleri düz dosyalara eklenmiş olur.

## Iceberg, Delta Lake ve Hudi'den nasıl ayrışıyor?

Üç açık tablo formatı da benzer bir sorunu çözüyor ama Iceberg, motor-bağımsızlığı konusunda en agresif duruşu sergiliyor. Delta Lake tarihsel olarak Databricks ekosistemine daha yakın gelişti, Hudi ise akış (streaming) odaklı use case'lerde güçlü. Iceberg ise 2026'da Snowflake, Databricks, AWS, Google ve Microsoft'un hepsinin okuyup yazdığı, açık kaynak motorların varsayılan kabul ettiği format hâline geldi. Yeni bir lakehouse tasarlıyorsanız ve Iceberg kullanmıyorsanız, bunun iyi bir gerekçesi olmalı; format artık istisna değil, norm.

| Şirket/Katkı | Rolü |
|---|---|
| Netflix, Apple | Orijinal geliştirme ve büyük ölçekli üretim kullanımı |
| Snowflake, Databricks | Tam okuma/yazma desteği, V3 genel kullanıma açık |
| AWS (S3 Tables) | Yönetilen Iceberg tablo servisi |
| Google, Microsoft | V4 spesifikasyon tasarımına aktif katkı |
| Dremio, Tabular | Katalog ve sorgu motoru ekosistemi |

## Store-once, query-many pratikte nasıl işliyor?

Iceberg'in vaadi basit: veriyi bir kez, ucuz nesne depolamada (S3 gibi) tutun; sonra Spark ile büyük toplu iş yükünü, SQL motoruyla (Snowflake, Trino) raporlamayı, Python/pandas ile veri bilimini, ML pipeline'ıyla feature mühendisliğini aynı tablo üzerinde, veri taşımadan çalıştırın. Bu, [DuckDB'nin doğrudan Parquet ve SQLite dosyalarını sorgulama](/tr/posts/duckdb-mi-sqlite-mi) felsefesiyle aynı köke dayanıyor: veriyi kopyalamadan, doğru motoru doğru işe yönlendirmek.

```sql
-- Bir sorgu motorundan Iceberg tablosuna bağlanma (Spark SQL örneği)
CREATE TABLE local.sales.orders (
  order_id BIGINT,
  customer_id BIGINT,
  amount DECIMAL(10,2),
  created_at TIMESTAMP
)
USING iceberg
PARTITIONED BY (days(created_at));

-- Zaman yolculuğu: dünkü snapshot'ı sorgula
SELECT * FROM local.sales.orders
FOR TIMESTAMP AS OF '2026-07-19T00:00:00';
```

Katalog katmanı (REST catalog, AWS Glue, Nessie gibi) hangi tabloların hangi metadata dosyasına işaret ettiğini merkezi olarak yönetir; bu da farklı motorların aynı tabloyu tutarlı şekilde görmesini sağlayan yönetişim katmanı işlevi görür.

## Iceberg Summit 2026 ne gösterdi?

Temmuz 2026'da San Francisco'da düzenlenen Iceberg Summit'e 600'ün üzerinde katılımcı geldi; iki gün boyunca 70'in üzerinde oturum yapıldı. Dikkat çeken nokta: hiçbir oturum "Iceberg'i neden kullanmalısınız" sorusuna cevap vermeye çalışmadı, tüm katılımcıların zaten Iceberg kullandığı varsayıldı ve tartışma "sırada ne var" sorusuna odaklandı. Google, Apple, Snowflake, Databricks, Microsoft, Netflix ve LinkedIn'den mühendisler aynı tasarım tartışmalarında, aynı PR'ları inceliyor; bu da formatın artık tek bir şirketin kontrolünde olmadığının somut kanıtı.

## V4 spesifikasyonu neyi çözüyor?

Iceberg başlangıçta büyük, yavaş değişen analitik tablolar için tasarlanmıştı; ama bugün üzerinde çalışan iş yükleri hiç de öyle değil: her birkaç saniyede commit atan streaming pipeline'lar, binlerce sütunlu ML feature tabloları, tablo taşınabilirliği gerektiren felaket kurtarma senaryoları. V4'ün öne çıkan önerisi "adaptive metadata tree" ile tek dosyalık commit'ler; bu, büyük tablolarda okuma performansından ödün vermeden düşük gecikmeli yazmaları mümkün kılıyor. Ayrıca genişletilmiş REST catalog yetenekleri ve iyileştirilmiş compaction da yol haritasında.

## Kurumunuz için gerçekten gerekli mi?

Açıkçası burada dengeli bir görüşüm var: Iceberg'in getirdiği yönetişim ve motor-bağımsızlığı gerçek, ama küçük bir ekip için tek bir veri ambarı (Postgres, hatta [her şey için Postgres](/tr/posts/her-sey-icin-postgres) yaklaşımı) hâlâ daha az operasyonel yük demek. Iceberg'in asıl karşılığını aldığı nokta, birden fazla ekibin birden fazla motorla aynı veriye farklı açılardan erişmesi gerektiği an; o eşiği geçmeden Iceberg kurmak, ihtiyaç duymadığınız bir soyutlama katmanı eklemek olur. Bulut maliyetlerini kontrol altında tutma konusunda daha geniş bir bakış için [FinOps: bulut faturasını düşürme](/tr/posts/finops-bulut-maliyeti-dusurme) yazımıza bakabilirsiniz.

## Mevcut bir veri ambarından geçiş nasıl işliyor?

Iceberg'e geçiş genellikle büyük patlama tarzı bir taşıma değil, kademeli bir süreç. Çoğu ekip önce en büyük, en pahalı sorgulanan tabloları Iceberg'e taşıyor; çünkü asıl kazanç orada. Snowflake ve Databricks gibi motorlar, mevcut tabloları "in-place" olarak Iceberg formatına dönüştürebilen araçlar sunuyor; bu da tüm veriyi yeniden yazmadan sadece metadata katmanını eklemek anlamına geliyor. Katalog seçimi bu noktada kritik bir karar: bir REST catalog (Iceberg'in kendi standart protokolü) motor-bağımsızlığı en üst düzeye çıkarırken, AWS Glue Data Catalog AWS ekosistemine daha derin entegrasyon sağlıyor, Nessie ise Git benzeri branch/commit semantiği isteyen ekipler için düşünülmeye değer. Katalog seçimini erken ve bilinçli yapmak önemli, çünkü sonradan katalog değiştirmek tüm motorların yeniden yapılandırılmasını gerektiriyor.

## Depolama maliyeti gerçekten düşüyor mu?

Evet, ama kaynağı beklediğiniz yer olmayabilir. Asıl tasarruf, ayrı ayrı tutulan iki kopyanın (ambar + göl) tek kopyaya inmesinden geliyor; nesne depolama zaten ucuz olduğu için Iceberg'in kendisi depolamayı dramatik ucuzlatmıyor, çoğaltmayı ortadan kaldırıyor. İkinci kaynak, compaction: küçük dosyaların sık commit'lerle birikmesi sorgu performansını düşürür, düzenli compaction bu küçük dosyaları birleştirerek hem depolama hem tarama maliyetini azaltır. Bunu otomatikleştirmeyen ekipler, zamanla "küçük dosya sorunu" olarak bilinen, sorgu maliyetlerini sessizce şişiren bir duruma düşüyor; bu yüzden V4'ün compaction iyileştirmeleri sadece bir performans detayı değil, doğrudan bir maliyet konusu.

## Sıkça Sorulan Sorular

### Apache Iceberg, Delta Lake'in yerini mi alıyor?

Doğrudan "yerini alma" değil ama 2026'da motor-bağımsız benimsemede önde. Snowflake, Databricks, AWS, Google ve Microsoft'un hepsi Iceberg'i okuyup yazıyor; Delta Lake hâlâ güçlü bir format ama tarihsel olarak Databricks ekosistemine daha yakın gelişti. Yeni bir lakehouse kuruyorsanız Iceberg şu an varsayılan tercih.

### Lakehouse mimarisi tam olarak neyi çözüyor?

Geleneksel kurulumda veri hem raporlama için bir veri ambarında hem ham işleme/ML için bir veri gölünde iki kez tutulur. Lakehouse, Iceberg gibi açık bir tablo formatı üzerinde tek bir veri kopyası tutarak hem ambar hem göl kullanım senaryolarına aynı katmandan hizmet verir; senkronizasyon gecikmesini ve çift depolama maliyetini ortadan kaldırır.

### Iceberg V4 ne zaman geliyor ve ne getiriyor?

V4 hâlâ topluluk tartışma aşamasında; öne çıkan öneriler arasında "adaptive metadata tree" ile tek dosyalık commit'ler, genişletilmiş REST catalog yetenekleri ve iyileştirilmiş compaction var. Amaç, formatı büyük, yavaş tablolardan streaming ve yüksek sütunlu ML iş yüklerine kadar genişletmek.

### Küçük bir ekip Iceberg kurmalı mı?

Genellikle hayır, en azından hemen değil. Iceberg'in asıl faydası birden fazla ekip birden fazla motorla aynı veriye eriştiğinde ortaya çıkıyor; tek bir uygulama ve tek bir raporlama aracı kullanan küçük bir ekip için klasik bir veritabanı hâlâ daha az operasyonel yük demek.
