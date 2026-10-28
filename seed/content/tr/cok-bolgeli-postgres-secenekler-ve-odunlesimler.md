---
title: "Çok Bölgeli Postgres: Seçenekler ve Ödünleşimler"
slug: "cok-bolgeli-postgres-secenekler-ve-odunlesimler"
translationKey: "multi-region-postgres-tradeoffs-2026"
locale: "tr"
excerpt: "Kısa cevap: çok bölgeli Postgres'e üç sebep geçerli — uzak kullanıcı gecikmesi, bölgesel felaket kurtarma, veri yerleşim yasası; 'ölçek' biri değil."
category: "devops-cloud"
tags: ["postgresql", "databases", "system-design", "reliability"]
publishedAt: "2026-10-28"
seoTitle: "Çok Bölgeli Postgres Ne Zaman Gerekir? Seçenekler"
seoDescription: "Read replica, mantıksal replikasyon ve dağıtık Postgres'i tutarlılık ve karmaşıklık açısından karşılaştırıyor, tek bölgede kalmanın savunmasını anlatıyoruz."
---

Kısa cevap: çok bölgeli Postgres'e geçmek için üç gerçek sebep var — uzak kullanıcılar için düşük gecikme, bölgesel felaket durumunda otomatik geçiş ve rows'un belirli bir coğrafyada kalmasını zorunlu kılan veri yerleşim (residency) yasası. "Ölçek" bu listede yok; tek bir güçlü Postgres örneği, çoğu ekibin ulaştığından çok daha fazla trafiği kaldırabiliyor.

## Çok bölgeli Postgres'e geçmek için gerçekten geçerli üç sebep ne?

Birincisi, dünyanın öbür ucundaki kullanıcı için gecikme: tek bölgeli bir veritabanı, 150-250 ms'lik round-trip gecikmesi ekleyebilir, bu da her sorguyu kullanıcı için yavaş kılar. İkincisi, bölgesel felaket kurtarma: bir bölge tamamen düştüğünde (bulut sağlayıcı kesintisi, doğal afet) trafiği başka bir bölgeye taşıyabilme. Üçüncüsü, veri yerleşim yasası: GDPR gibi düzenlemeler veya sektörel kurallar belirli kullanıcı verisinin belirli bir coğrafyada kalmasını zorunlu kılabiliyor. "Ölçek" bu listeye girmiyor çünkü dikey ölçeklenen (daha büyük makine) ve doğru indekslenen tek bir Postgres örneği, çoğu uygulamanın gerçek trafiğini tek bölgede karşılayabiliyor.

## Read replica + istek yönlendirme nasıl çalışır ve nerede tuzak var?

Read replica'lar, fiziksel (streaming) replikasyon üzerinden WAL (write-ahead log) akışını bir birincil düğümden bir veya daha fazla salt-okunur standby'a taşır. Standby'lar sorgu için kullanılabilir ama yazma kabul etmez; replikasyon gecikmesi `pg_stat_replication` görünümünden izlenebilir ve ağ kesintisi anında sıçrayabilir.

En büyük tuzak "oku-kendi-yazdığını" (read-your-writes) sorunu: bir kullanıcı bir veriyi yazdıktan hemen sonra aynı veriyi okumaya çalışırsa ve o okuma isteği henüz replikasyonun ulaşmadığı bir replica'ya yönlendirilirse, kullanıcı kendi az önce yaptığı değişikliği görmez. Bu, "kaydet butonuna bastım ama değişiklik kaybolmuş gibi görünüyor" şikayetlerinin klasik kaynağı. Çözüm genelde yazma sonrası bir süre birincile yönlendirmek veya replikasyon gecikmesini aktif olarak izleyip gecikmiş bir replica'ya trafik göndermemek.

Bu izleme pratikte ne demek: `pg_stat_replication` görünümünü düzenli örnekleyip bir replica'nın birincilden ne kadar geride olduğunu (bayt veya saniye cinsinden) bir dashboard'a yansıtmak. Gecikme belirli bir eşiği (örneğin 500 ms) aştığında o replica'yı yük dengeleyiciden geçici olarak çıkarmak, kullanıcıya tutarsız bir görünüm sunmaktan daha güvenli bir varsayılan.

## Mantıksal replikasyon ne zaman fiziksel replikasyondan daha uygun?

Mantıksal replikasyon, satır veya tablo düzeyinde çalışır ve fiziksel replikasyonun aksine abone (subscriber) tarafın yerel yazma kabul etmesine izin verir. Bu, seçici senkronizasyon (sadece belirli tabloları başka bir bölgeye kopyalamak) veya sıfır kesintili büyük sürüm geçişleri için [PostgreSQL'in resmi dokümantasyonunda](https://www.postgresql.org/docs/current/logical-replication.html) tanımlanan standart kullanım alanı. Bedeli, mantıksal çözümlemenin (logical decoding) getirdiği ek yük — bu yük fiziksel replikasyondan daha yüksek olma eğiliminde, özellikle yüksek yazma hacminde.

```sql
-- Birincil düğümde: hangi tabloların yayınlanacağını tanımla
CREATE PUBLICATION orders_pub FOR TABLE orders, order_items;

-- Hedef bölgedeki düğümde: bu yayına abone ol
CREATE SUBSCRIPTION orders_sub
  CONNECTION 'host=primary-eu dbname=app'
  PUBLICATION orders_pub;
```

## Dağıtık Postgres (Citus gibi) ne kazandırır, karşılığında ne alır?

Citus, verileri parçalara (shard) ayırıp düğümler arasında dağıtan ve sütunsal (columnar) depolama ekleyen bir Postgres uzantısı; Şubat 2026'da yayınlanan 14.0/14.1 sürümü PostgreSQL 18 desteği getirdi ve [Azure Database for PostgreSQL Flexible Server'ın Elastic Clusters özelliği](https://www.citusdata.com/blog/2026/) üzerinden yönetilen bir seçenek olarak sunuluyor. Ölçeklemek düğüm eklemek ve shard'ları yeniden dengelemek kadar basit görünüyor, ama bedeli gerçek: çapraz-shard join'ler ve transaction'lar, tek düğümlü Postgres'teki kadar basit değil, ve operasyonel karmaşıklık (rebalancing, shard dağılımı izleme) tek örnekli bir kurulumdan kat kat fazla.

| | Read Replica | Mantıksal Replikasyon | Dağıtık Postgres (Citus) |
|---|---|---|---|
| Tutarlılık | Eventual, replikasyon gecikmesine bağlı | Eventual, seçici tablo bazında | Shard içinde güçlü, çapraz-shard'da karmaşık |
| Yazma kabul eden düğüm | Sadece birincil | Abone de yerel yazma kabul edebilir | Her shard kendi yazmasını kabul eder |
| Operasyonel karmaşıklık | Düşük-orta | Orta | Yüksek |
| Tipik kullanım | Coğrafi okuma dağıtımı | Seçici senkron, sürüm geçişi | Çok büyük veri setini yatay ölçekleme |

## Sıkı tutarlılık mı düşük gecikme mi: bu ödünleşimi nasıl yönetirsin?

Burada kaçamayacağın bir fizik kuralı var: birden fazla bölgede güçlü (strong) tutarlılık istiyorsan, yazmanın her bölgeye ulaşıp onay almasını beklemek zorundasın, bu da gecikmeyi artırır. Gecikmeyi düşük tutmak istiyorsan, bölgeler arası tutarlılıktan ödün vermek zorundasın — bu, "CAP teoreminin" günlük hayattaki hali. Çoğu ekip için pratik çözüm, hangi veri için gerçekten güçlü tutarlılık gerektiğini (ödeme, bakiye) ve hangi veri için eventual tutarlılığın kabul edilebilir olduğunu (profil bilgisi, görüntülenme sayacı) ayırmak.

## Failover ve split-brain riskini nasıl test edersin?

Bir bölge düştüğünde bir replica'yı birincile yükseltmek (promote) basit bir komut gibi görünür, ama gerçek risk split-brain: eski birincil geri gelip hâlâ yazma kabul etmeye başlarsa iki birincil aynı anda var olur ve veriler çatallanır. Bunu önlemek için düzenli "promotion drill" (planlı failover tatbikatı) yapmak ve eski birincili otomatik olarak salt-okunur moda düşüren bir mekanizma (fencing) kurmak gerekiyor — bunu sadece dokümantasyonda yazılı bırakmak, gerçek bir kesintide işe yaramaz.

Bir promotion drill'in gerçekçi olması için prod benzeri bir ortamda, gerçek trafik yüküyle çeyreklik olarak tekrarlanması gerekiyor — yılda bir yapılan bir tatbikat, araçların ve run-book'un aylar içinde eskimesine izin veriyor. Drill sırasında ölçülmesi gereken en önemli rakam, "algılamadan tam geçişe kadar geçen süre" (time to promote); bu süre dakikalarsa failover planı gerçek bir kesintide işe yarar, saatlerse henüz hazır değilsin.

DNS yayılma süresi de bu süreye dahil edilmeli — bir kayıt değişikliği uygulansa bile, istemci tarafındaki cache'ler eski adrese dakikalarca bağlı kalabilir.

## Tek bölgede kalmak için dürüst savunma ne?

Kendi değerlendirmem: çoğu ekip, "ölçek" endişesiyle çok bölgeli bir mimariye geçiyor ama asıl ihtiyaçları doğru indeksleme ve dikey ölçekleme. Veri yerleşim yasası seni zorlamıyorsa, kullanıcı tabanın coğrafi olarak dar bir bölgede toplanıyorsa ve henüz bir bölgesel kesinti seni gerçekten vurmadıysa, tek bölgede kalmak — ve o bölgeyi iyi işletmek — çok bölgeli karmaşıklığı erken almaktan daha ucuz. Bu mantık, [hücre tabanlı mimarinin](/tr/posts/hucre-tabanli-mimari-patlama-yaricapi) patlama yarıçapını küçültme yaklaşımıyla da örtüşüyor: önce blast radius'u küçült, sonra coğrafi dağıtıma geç.

Veri katmanını büyütmeden önce [her PR için önizleme veritabanı](/tr/posts/her-pr-icin-onizleme-veritabani) gibi daha ucuz pratikler, şema değişikliklerini üretime çıkmadan test etmeni sağlıyor. Sorgu yükünü azaltmak için [cache stratejileri](/tr/posts/cache-stratejileri-gecersiz-kilma) genelde çok bölgeli bir Postgres kurulumundan önce denenmesi gereken daha ucuz bir adım. Analitik yükü ayırmak isteyenler için [Apache Iceberg'in lakehouse yaklaşımı](/tr/posts/apache-iceberg-nedir-lakehouse) de OLTP trafiğini Postgres'te tutup analitik sorguları ayrı bir katmana taşımanın bir yolu.

## Sıkça Sorulan Sorular

### Çok bölgeli Postgres'e geçmek için gerçek sebepler neler?

Üç gerçek sebep var: uzak kullanıcılar için düşük gecikme, bölgesel felaket kurtarma ve veri yerleşim yasası. "Ölçek" bu listede değil — doğru indekslenen ve dikey ölçeklenen tek bir Postgres örneği, çoğu uygulamanın trafiğini tek bölgede karşılayabiliyor.

### Read replica kullanırken "oku-kendi-yazdığını" sorunu nedir?

Bir kullanıcı veriyi yazdıktan hemen sonra aynı veriyi okumaya çalıştığında, okuma isteği henüz replikasyonun ulaşmadığı bir replica'ya giderse kullanıcı kendi değişikliğini göremez. Çözüm, yazma sonrası bir süre birincile yönlendirmek veya replikasyon gecikmesini aktif izlemek.

### Mantıksal replikasyon fiziksel replikasyondan ne zaman daha iyi?

Mantıksal replikasyon, seçici tablo senkronizasyonu veya sıfır kesintili büyük sürüm geçişleri gerektiğinde fiziksel replikasyondan daha uygun, çünkü satır/tablo düzeyinde çalışır ve abone tarafın yerel yazma kabul etmesine izin verir. Bedeli, mantıksal çözümlemenin getirdiği ek işlem yükü.

### Dağıtık Postgres (Citus gibi) ne zaman gerekir?

Tek bir Postgres örneğinin dikey ölçeklemeyle kaldıramayacağı kadar büyük bir veri setini yatay olarak ölçeklemen gerektiğinde. Karşılığında çapraz-shard join ve transaction karmaşıklığı ile daha yüksek operasyonel yük gelir, dolayısıyla bu bedeli ödemeden önce dikey ölçeklemenin gerçekten yetersiz olduğunu doğrulamak gerekir.
