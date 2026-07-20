---
title: "DuckDB mi SQLite mı? Gömülü Veritabanı Rehberi"
slug: "duckdb-mi-sqlite-mi"
translationKey: "duckdb-vs-sqlite"
locale: "tr"
excerpt: "DuckDB analitik sorgularda SQLite'a göre 10-100 kat hızlı, ama ikisi aynı işi görmüyor. OLAP-OLTP ayrımını ve local-first yığını anlatıyoruz."
category: "software-engineering"
tags: ["databases", "sql", "performance", "backend"]
publishedAt: "2026-07-20"
seoTitle: "DuckDB mi SQLite mı? Gömülü Veritabanı Karşılaştırması"
seoDescription: "DuckDB ve SQLite aynı 'gömülü veritabanı' etiketini taşır ama farklı işler görür. Aggregation hız farkını, Turso senkronunu ve doğru seçimi anlatıyoruz."
---

Kısa cevap: raporlama ve aggregation ağırlıklı işler için DuckDB, uygulamanızın işlemsel (transactional) durumunu tutmak için SQLite. İkisi de tek dosyalık, sunucusuz gömülü veritabanları ama biri sütun tabanlı OLAP motoru, diğeri satır tabanlı OLTP motoru; birbirinin yerine geçmiyor, birlikte çalışıyor.

"Hangisini kullanmalıyım" sorusu aslında yanlış soru. 2026'da olgunlaşan local-first mimarilerde ikisi genellikle aynı pipeline'ın farklı katmanlarında yaşıyor: SQLite veriyi toplar ve kalıcı hâle getirir, DuckDB o veriyi analiz eder ve raporlar. Bu yazıda ikisinin mimari farkını, gerçek performans rakamlarını ve 2026'nın en yaygın local-first kurulumunu ele alıyoruz.

## Neden aynı cümlede anılıyorlar da farklı işler görüyorlar?

SQLite, satır tabanlı (row-store) bir depolama motoru kullanır: bir kaydın tüm sütunları diskte yan yana durur. Bu, "tek bir siparişi getir, güncelle, kaydet" gibi OLTP (Online Transaction Processing) işlemlerini hızlı yapar; web uygulamanızın, mobil istemcinizin veya CLI aracınızın durumunu tutmak için birebir uygundur.

DuckDB ise sütun tabanlı (columnar) bir depolama motoru kullanır: her sütun diskte ayrı tutulur. "Son 90 günün toplam gelirini müşteri segmentine göre grupla" gibi OLAP (Online Analytical Processing) sorgularında bu düzen, sadece ilgili sütunları okuyup vektörleştirilmiş yürütme ile çok çekirdekte paralel işlemeyi mümkün kılar. Aynı disk formatını iki farklı işe zorlamak yerine, DuckDB baştan analitik sorgular için tasarlanmış.

## Aggregation sorgularında fark gerçekten 10-100 kat mı?

Evet, çoklu benchmark bu aralığı doğruluyor: DuckDB'nin aggregation, join ve büyük taramalar içeren sorgularda SQLite'a göre 10-100 kat daha hızlı olduğu ölçülüyor. Fark, tek bir optimizasyondan değil üç katmanlı bir mimari avantajdan geliyor: sütun tabanlı depolama gereksiz I/O'yu eler, vektörleştirilmiş yürütme motoru CPU önbelleğini verimli kullanır, çoklu iş parçacığı (multi-threading) taramaları ve join'leri çekirdekler arasında paralelleştirir.

| Kriter | SQLite | DuckDB |
|---|---|---|
| Depolama modeli | Satır tabanlı (row-store) | Sütun tabanlı (columnar) |
| İdeal iş yükü | OLTP: tekil kayıt okuma/yazma | OLAP: aggregation, büyük taramalar |
| Paralellik | Tek iş parçacığı, dosya kilidi | Çok çekirdekli, vektörleştirilmiş |
| Aggregation hızı | Referans | Tipik olarak 10-100 kat daha hızlı |
| En iyi kullanım | Uygulama durumu, mobil, edge | Raporlama, veri bilimi, ETL |

## SQLite ne zaman doğru seçim?

SQLite'ın gücü, her yerde çalışan tek dosyalık bir motor olması. Mobil uygulamalar, masaüstü yazılımlar, CLI araçları ve edge fonksiyonları için varsayılan seçim hâline geldi; çünkü sıfır operasyonel yük ister, milisaniye altı tekil kayıt erişimi verir ve dosya sistemine kopyalamak kadar basit bir yedekleme sunar. Yazma yoğun, çok kullanıcılı bir üretim API'sinin arkasında kalıcı ana veritabanı olarak da yaygınlaşıyor; özellikle [Postgres yerine her şeyi tek araçla çözme](/tr/posts/her-sey-icin-postgres) trendinin SQLite tarafındaki karşılığı olarak.

## DuckDB ne zaman devreye girmeli?

DuckDB'yi bir "uygulama veritabanı" olarak düşünmeyin; bir "analiz motoru" olarak düşünün. Tipik tetikleyiciler: bir dashboard'un her yüklenişinde milyonlarca satırı gruplayıp toplaması gerekiyor, bir veri bilimi notebook'unda Parquet dosyaları üzerinde SQL çalıştırmak istiyorsunuz, ya da gece çalışan bir ETL job'unun aggregation adımı dakikalar sürüyor ve saniyelere inmesi gerekiyor. DuckDB bu senaryoların hepsinde tek satır kurulum kodu istemeden çalışır; çünkü SQLite gibi gömülüdür, ayrı bir sunucu süreci gerektirmez.

## 2026'nın local-first yığını: SQLite'ta topla, DuckDB'de sorgula

En yaygın 2026 mimarisi şu: uygulama SQLite'a yazar, gece (veya event-driven) bir job SQLite dosyasını ya da onun Parquet dökümünü DuckDB ile sorgular. DuckDB'nin `sqlite_scanner` ve `postgres_scanner` uzantıları, veriyi taşımadan doğrudan SQLite dosyalarını ve canlı bir Postgres bağlantısını sorgulamanıza izin verir; bu da ayrı bir ETL adımını ortadan kaldırır.

```sql
-- DuckDB içinden bir SQLite dosyasını doğrudan sorgula
INSTALL sqlite;
LOAD sqlite;
ATTACH 'app.db' AS app (TYPE sqlite);

SELECT customer_segment, SUM(amount) AS total_revenue
FROM app.orders
WHERE created_at >= now() - INTERVAL 90 DAY
GROUP BY customer_segment
ORDER BY total_revenue DESC;
```

Bu tek sorgu, SQLite'ın işlemsel doğruluğunu korurken DuckDB'nin analitik hızından faydalanmanızı sağlıyor; iki motoru birbirine rakip değil, tamamlayıcı olarak konumlandırıyor.

## Turso ve embedded replica'lar tabloyu nasıl değiştiriyor?

SQLite tarafında 2026'nın en büyük gelişmesi Turso'nun embedded replica modeli. libSQL (SQLite'ın açık kaynak bir fork'u) üzerine kurulu Turso, uzak bir birincil veritabanını uygulamanızın içinde çalışan yerel bir SQLite dosyasıyla senkronize ediyor; okumalar yerel disk hızında (mikrosaniye altı) gerçekleşirken yazmalar uzak birincile gidip "kendi yazdığını okuma" tutarlılığıyla geri senkronize oluyor. Turso'nun yeni CDC tabanlı senkron mekanizması, eski embedded replica yaklaşımına göre önemli ölçüde daha az ağ trafiğiyle çok daha hızlı senkron iddia ediyor. Bu, edge fonksiyonlarında ve çok kiracılı (multi-tenant) uygulamalarda her kullanıcıya kendi SQLite replikasını verme deseni için pratik bir temel oluşturuyor; [edge fonksiyonları ve render mimarileri](/tr/posts/edge-fonksiyonlari-render-rehberi) üzerine yazımızda bu deseni daha geniş bağlamda ele alıyoruz.

Açıkçası burada net bir görüşüm var: "hangisi daha iyi" tartışması yanlış çerçeve. SQLite'ı DuckDB ile değiştirmeye çalışmak, DuckDB'yi uygulama durumu için kullanmaya çalışmak kadar anlamsız; ikisini birlikte, doğru katmanda kullanmak 2026'nın en pragmatik veri mimarisi kararlarından biri. Daha geniş veritabanı seçim kararları için [veritabanı indeksleme](/tr/posts/veritabani-indeksleme) yazımıza da göz atabilirsiniz.

## DuckDB'nin sınırları neler?

DuckDB'yi bir uygulamanın ana veritabanı yapmayı cazip kılan basitlik, aynı zamanda sınırlarını da belirliyor. Tek bir süreç aynı anda yazma erişimi alabiliyor; SQLite'ın WAL modu gibi çoklu okuyucu tek yazarlı bir eşzamanlılık modeli var ama Postgres seviyesinde çoklu yazarlı eşzamanlılık sunmuyor. Bu yüzden yüksek eşzamanlı, yazma ağırlıklı bir API'nin arkasına DuckDB koymak yanlış tercih olur; DuckDB'nin doğru yeri, tek bir job'un veya tek bir analiz sürecinin büyük veriyi hızlıca işlediği senaryolar. Bellek kullanımı da dikkat gerektiriyor: büyük aggregation'lar için DuckDB verinin önemli bir kısmını bellekte tutmaya çalışıyor, bu da çok büyük veri setlerinde disk'e taşan (spill) bir yürütme moduna geçmesini gerektirebiliyor. Pratikte bu, DuckDB'yi seçerken "kaç eşzamanlı yazar var" ve "tek sorgu ne kadar veriyi tarayacak" sorularını en baştan sormanız gerektiği anlamına geliyor.

## Nasıl başlarım?

İkisine de başlamak dakikalar sürüyor, ayrı bir sunucu kurulumu gerekmiyor. DuckDB'yi bir CLI aracı, bir Python kütüphanesi (`pip install duckdb`) veya bir Node.js paketi olarak kurabilir, tek satır kodla bir CSV veya Parquet dosyasını sorgulamaya başlayabilirsiniz. SQLite ise zaten çoğu dilin standart kütüphanesinde hazır geliyor; Python'da `import sqlite3` yazmak yeterli. İkisini birlikte denemenin en hızlı yolu, mevcut bir SQLite dosyanız varsa DuckDB CLI'ı açıp `ATTACH` komutuyla bağlamak ve aynı veri üzerinde bir aggregation sorgusunun ne kadar sürdüğünü iki motorda da ölçmek; fark genellikle ilk denemede bile gözle görülür.

## Sıkça Sorulan Sorular

### DuckDB, SQLite'ın yerini alabilir mi?

Hayır, çoğu senaryoda alamaz. SQLite işlemsel iş yükleri (tekil kayıt okuma/yazma, eşzamanlı küçük güncellemeler) için tasarlanmış; DuckDB ise aggregation ve büyük taramalar için. Bir web uygulamasının ana veritabanını DuckDB ile değiştirmek, yazma eşzamanlılığı ve kilitleme modeli farklarından dolayı önerilmez.

### DuckDB, doğrudan bir SQLite dosyasını sorgulayabilir mi?

Evet. DuckDB'nin `sqlite_scanner` uzantısı bir SQLite dosyasını `ATTACH` ile bağlayıp doğrudan SQL sorgulamanıza izin verir, veri kopyalamaya gerek kalmaz. Aynı şekilde `postgres_scanner` uzantısı canlı bir Postgres veritabanına da bağlanabilir.

### Turso'nun embedded replica'sı geleneksel SQLite replikasyonundan farkı nedir?

Geleneksel SQLite tek dosyalık ve tek makinelidir; çoklu makine senkronu yerleşik değildir. Turso'nun libSQL tabanlı embedded replica modeli, uzak bir birincil veritabanını uygulamanızın içinde çalışan yerel bir kopyayla senkronize eder; okumalar yerelde mikrosaniye altı sürer, yazmalar uzak birincile gider ve CDC tabanlı senkron ile geri yayılır.

### Küçük bir proje için ikisini de mi kurmalıyım?

Hayır, gerekmez. Veri hacminiz birkaç yüz bin satırı geçmiyorsa ve aggregation sorgularınız saniyeler içinde dönüyorsa tek başına SQLite yeterli. DuckDB'yi devreye almanın eşiği, bir raporlama sorgusunun kullanıcıyı gözle görülür şekilde bekletmeye başladığı an.
