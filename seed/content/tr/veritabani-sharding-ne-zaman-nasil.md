---
title: "Veritabanı Sharding Ne Zaman Gerekir, Nasıl Yapılır?"
slug: "veritabani-sharding-ne-zaman-nasil"
translationKey: "database-sharding-when-and-how"
locale: "tr"
excerpt: "Kısa cevap: write throughput veya tablo boyutu, dikey ölçeklemenin ve read replica'ların sınırına ulaştığında sharding gerekir; önce daha ucuz yollar denenmeli."
category: "software-engineering"
tags: ["databases", "postgresql", "system-design", "backend"]
publishedAt: "2026-11-09"
seoTitle: "Veritabanı Sharding Ne Zaman Gerekir, Nasıl Yapılır?"
seoDescription: "Kısa cevap: write throughput veya tablo boyutu, dikey ölçeklemenin ve read replica'ların sınırına ulaştığında sharding gerekir; önce daha ucuz yollar denenmeli."
---

Kısa cevap: tek bir primary veritabanı yazma (write) trafiğini karşılayamadığında, tablo boyutu indeks ve bakım sürelerini pratik olmayan seviyelere çıkardığında veya dikey ölçekleme (daha büyük sunucu) maliyeti mantıksız hale geldiğinde sharding'i düşünmeye başlarsınız. Ama sharding son çare olmalı: önce read replica, partitioning ve connection pooling gibi daha ucuz çözümler tüketilmeli, çünkü sharding cross-shard sorguları ve transaction'ları ciddi şekilde karmaşıklaştırır.

## Sharding'e geçmeden önce hangi sinyalleri kontrol etmeli?

Write throughput'ın tek primary'nin disk I/O veya CPU limitine sürekli çarpması, tablo boyutunun indeks yeniden kurma veya VACUUM gibi bakım işlerini saatler sürdürmesi ve dikey ölçeklemenin (daha fazla RAM/CPU) bir sonraki adımının maliyetinin gelir artışını haklı çıkaramaması, üç somut sinyaldir. Bu sinyallerden sadece biri varsa, sharding'den önce daha ucuz bir çözüm genellikle yeterlidir.

## Sharding'den önce denenmesi gereken daha ucuz alternatifler neler?

Read-heavy bir yük için read replica'lar, okuma trafiğini primary'den ayırarak yazma kapasitesini serbest bırakır. Bağlantı sayısı sorunu için PgBouncer gibi bir connection pooler, veritabanı bağlantı limitine çarpmadan binlerce eşzamanlı isteği yönetir. [PgBouncer ile bağlantı havuzlamasını ele aldığımız yazıda](/tr/posts/pgbouncer-postgres-baglanti-havuzu) bu yaklaşımı detaylı anlatıyoruz. Tek sunucuda kalıp büyük tabloları bölmek isterseniz, PostgreSQL'in native declarative partitioning'i (RANGE, LIST, HASH) PG10'dan beri var ve sabit bir partisyon sayısı sınırı yok; pratik sınır, planlayıcı ve katalog yükünden kaynaklanıyor, sabit bir rakamdan değil. [Veritabanı indeksleme yazımızda](/tr/posts/veritabani-indeksleme) de bu aşamadan önce indeks optimizasyonunun ne kadar kazanç sağlayabileceğini gösteriyoruz.

## Shard key nasıl seçilir?

Shard key, verinizi parçalara ayırırken kullandığınız sütundur ve en kritik karardır; yanlış seçim "hotspot" yaratır — tüm trafiğin tek bir shard'a yığılması. Çok kullanıcılı bir SaaS'ta `tenant_id` iyi bir shard key'dir çünkü sorguların büyük kısmı tek bir müşteriye ait veriyi hedefler ve cross-shard join'e gerek kalmaz. Zaman serisi verisinde `created_at` ile range sharding mantıklıdır, ama yeni verinin her zaman en son shard'a yazılması "hot shard" riski taşır.

## Range, hash ve directory sharding arasındaki fark nedir?

Aşağıdaki tablo üç temel stratejiyi karşılaştırır:

| Strateji | Nasıl çalışır | Risk |
|---|---|---|
| Range sharding | Anahtar aralıklara bölünür (örn. tarih aralığı) | Son aralık her zaman "sıcak" olabilir |
| Hash sharding | Anahtar hash'lenip shard sayısına modulo alınır | Dağılım dengeli ama range sorguları zorlaşır |
| Directory sharding | Ayrı bir lookup tablosu, hangi anahtarın hangi shard'da olduğunu tutar | Esnek ama lookup tablosu kendisi bir darboğaz olabilir |

## Cross-shard sorgular ve transaction'lar nasıl ele alınır?

Bir shard'daki veriyi diğer shard'daki veriyle birleştiren bir sorgu, uygulama katmanında birden fazla sorgu çalıştırıp sonuçları birleştirmeyi gerektirir — veritabanı bunu sizin için yapmaz. Çoklu shard'a yazan bir transaction için ACID garantisi almak zorsa; pratikte çoğu sistem, mümkün olduğunca shard içi transaction'larla sınırlı kalmayı ve shard'lar arası tutarlılığı event-driven senkronizasyonla (örneğin bir outbox pattern) sağlamayı tercih eder.

## Hangi araçlar sharding'i kolaylaştırıyor?

Citus, PostgreSQL üzerine inşa edilmiş bir dağıtık veritabanı uzantısı; 2026'da çıkan Citus 14.0, PostgreSQL 18 desteği ekledi ve native partitioning'in *yerine* değil, *üzerine* katman olarak çalışıyor — yani partitioning'i terk etmenize gerek yok. Vitess, YouTube ölçeğinde kullanılan, proxy tabanlı yönlendirmeyle MySQL/Postgres uyumlu iş yüklerini sharding'leyen bir sistem; uygulama kodunuzu büyük ölçüde değiştirmeden sharding ekler. Uygulama seviyesinde kendi sharding mantığınızı yazmak da bir seçenek ama bakım yükü genellikle hafife alınıyor.

```sql
-- Citus ile dağıtık tablo oluşturma örneği
SELECT create_distributed_table('orders', 'tenant_id');
```

## Sharding'e geçerken uygulama kodu ne kadar değişir?

Sharding'e geçiş, veritabanı katmanından çok uygulama katmanını değiştirir. Her sorgunun hangi shard'a gideceğini belirleyen bir yönlendirme katmanı eklemeniz gerekir — bu katman shard key'i (örneğin `tenant_id`) alır, hangi shard'da olduğunu bir hash fonksiyonuyla veya lookup tablosuyla bulur ve sorguyu o shard'a yönlendirir. ORM'lerin çoğu bu yönlendirmeyi otomatik yapmaz; Citus gibi araçlar bunu PostgreSQL'in kendi sorgu planlayıcısı seviyesinde çözerken, uygulama seviyesinde kendi sharding'inizi yazarsanız her repository/DAO katmanının shard-farkında olması gerekir. Test ortamında tek shard'la çalışıp üretimde birden fazla shard'a geçmek, aradaki farkı gözden kaçırmanıza yol açabilir — bu yüzden cross-shard sorguları geliştirme ortamında da en az iki shard'la test etmek önemlidir.

## Hash sharding'e geçişte dikkat edilmesi gereken bir örnek nedir?

`tenant_id` üzerinden hash sharding yaparken, shard sayısını değiştirmek (örneğin 4 shard'dan 8 shard'a çıkmak) hash fonksiyonunun sonucunu değiştirir ve mevcut verinin büyük kısmının yeniden dağıtılmasını gerektirir. Bunu önlemek için "consistent hashing" tekniği kullanılır: shard sayısı değiştiğinde sadece verinin küçük bir kısmı taşınır, tamamı değil. Bu detayı en başta planlamayan ekipler, ilk rebalancing'de üretim trafiğini saatlerce yavaşlatan bir veri taşıma operasyonuyla karşılaşıyor.

```text
Örnek: consistent hashing olmadan 4 -> 8 shard geçişi
- Her anahtarın shard'ı = hash(anahtar) % shard_sayisi
- Shard sayısı değişince NEREDEYSE TÜM anahtarların hedef shard'ı değişir
- Consistent hashing ile sadece anahtarların ~1/8'i yeni shard'a taşınır
```

## Rebalancing ne zaman ve neden gerekir?

Shard'lardan biri diğerlerinden çok daha fazla veri veya trafik taşımaya başladığında (hotspot), verinin shard'lar arasında yeniden dağıtılması gerekir. Bu işlem canlı trafik varken yapılmalı ve genellikle çift yazma (dual-write) veya kademeli veri taşıma stratejisi gerektirir; rebalancing'i düşünmeden hash sharding'e geçmek, ilerde bu maliyeti göz ardı etmek anlamına gelir.

## Sharding, NoSQL'e geçişle aynı şey mi?

Hayır, ikisi bağımsız kararlar. Sharding, veriyi birden fazla sunucuya dağıtan bir ölçekleme tekniğidir ve hem ilişkisel (PostgreSQL, MySQL) hem de doküman tabanlı (MongoDB) veritabanlarında uygulanabilir. NoSQL'e geçiş ise veri modelini (şema, ilişkiler, sorgu dili) değiştirme kararıdır. Bazı NoSQL sistemleri sharding'i yerleşik olarak sunduğu için ikisi sık karıştırılıyor, ama ilişkisel bir veritabanını değiştirmeden, sadece onu sharding'leyerek de aynı ölçekleme kazancının büyük kısmını almak mümkün.

## Sharding kararını kim vermeli, tek bir mühendis mi?

Hayır — sharding, tek bir mühendisin PR'da verebileceği bir karar değil, çünkü etkisi uygulama kodunun her katmanına, operasyon ekibinin izleme alışkanlıklarına ve gelecekteki her yeni özelliğin nasıl tasarlanacağına yayılıyor. Karar öncesi en az şu üç rolün aynı masada olması gerekiyor: veritabanı performansını gerçek sayılarla bilen biri (mevcut darboğazı kanıtlayabilen), uygulama mimarisini bilen biri (cross-shard sorguların nereye yayılacağını tahmin edebilen) ve operasyonu yürütecek ekip (rebalancing ve izleme yükünü üstlenecek olan). Bu üçü olmadan alınan bir sharding kararı, genellikle üretimde beklenmedik bir cross-shard sorgu veya izleme boşluğuyla karşılaşıyor. Kararı belgelemek de kritik: hangi shard key'in seçildiğini, neden seçildiğini ve hangi alternatiflerin elendiğini yazılı tutmak, altı ay sonra işe başlayan bir mühendisin aynı tartışmayı sıfırdan açmasını önlüyor.

Kişisel görüşüm: çoğu ekip sharding'e, [çok bölgeli Postgres seçeneklerini ele aldığımız yazıda](/tr/posts/cok-bolgeli-postgres-secenekler-ve-odunlesimler) bahsettiğimiz türden daha ucuz ölçekleme adımlarını denemeden atlıyor. Sharding geri dönüşü zor bir mimari karardır; bir kez cross-shard sorgu mantığı uygulama koduna yayıldıktan sonra geri almak, ileriye gitmekten daha maliyetli olabiliyor. Bu yüzden her adımı somut metriklerle gerekçelendirmek, altı ay sonra "neden sharding'e geçtik" sorusuna net bir cevap verebilmek için de işe yarıyor.

## Sıkça Sorulan Sorular

### PostgreSQL'de kaç partition'a kadar native partitioning çalışır?

PostgreSQL'in declarative partitioning'i sabit bir partition sayısı sınırı koymaz; pratik sınır, çok fazla partition olduğunda planlayıcının ve sistem katalogunun yükünden kaynaklanır, belgelenmiş sabit bir rakam yoktur. Binlerce partition teorik olarak mümkün ama performans testiyle doğrulanmalı.

### Sharding ile partitioning aynı şey mi?

Hayır. Partitioning, tek bir veritabanı sunucusu içinde bir tabloyu mantıksal parçalara böler; sharding ise veriyi tamamen ayrı veritabanı sunucularına (veya node'lara) dağıtır. Citus gibi araçlar ikisini birleştirerek partitioning'i dağıtık bir mimaride kullanır.

### Shard key'i yanlış seçersem ne olur?

Yanlış shard key, trafiğin veya verinin eşit olmayan dağılımına (hotspot) yol açar; bir shard aşırı yüklenirken diğerleri boşta kalır. Düzeltmek, tüm veriyi yeni bir shard key ile yeniden dağıtmayı gerektirir — bu yüzden shard key kararı, sharding'e geçmeden önce en dikkatli verilmesi gereken karardır.

### Sharding'den vazgeçip tek sunucuya geri dönebilir miyim, kendi sharding'imi yazabilir miyim?

Teknik olarak tek sunucuya dönmek mümkün ama maliyeti yüksek: tüm shard'lardaki veriyi birleştirmek ve cross-shard mantığını geri almak gerekir. Citus veya Vitess kullanmadan kendi sharding'inizi uygulama seviyesinde yazmak da mümkün, ama bakım yükü genelde hafife alınıyor — her yeni sorgu türü ve entegrasyon bu katmanın shard-farkında olmasını gerektiriyor; olgun bir araç bu yönlendirme mantığının çoğunu sizin adınıza çözüyor.
