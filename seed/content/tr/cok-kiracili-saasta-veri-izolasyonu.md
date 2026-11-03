---
title: "Çok Kiracılı SaaS'ta Veri İzolasyonu Nasıl Sağlanır?"
slug: "cok-kiracili-saasta-veri-izolasyonu"
translationKey: "multi-tenant-data-isolation-2026"
locale: "tr"
excerpt: "Kısa cevap: varsayılan olarak havuzlanmış Postgres'te row-level security kullanın; şema veya veritabanı başına izolasyonu ihtiyaç duyan kiracılara ayırın."
category: "software-engineering"
tags: ["postgresql", "saas", "system-design", "software-architecture"]
publishedAt: "2026-11-03"
seoTitle: "Çok Kiracılı SaaS'ta Veri İzolasyonu Nasıl Sağlanır?"
seoDescription: "RLS, şema başına kiracı ve veritabanı başına kiracı: maliyet, hata yarıçapı ve kiracı verisinin veritabanı dışında nereden sızdığı, 2026 rehberi."
---

Kısa cevap: tek bir havuzlanmış Postgres veritabanı ve her kiracı tablosunda row-level security (RLS) ile başlayın; çünkü bu en ucuz ve en yoğun seçenektir, bir hatanın yarıçapı tek bir migration değil tek bir politika hatasıdır. Belirli kiracıları şema veya veritabanı başına izolasyona geçirmek, uyumluluk, veri yerleşim zorunluluğu veya tek bir büyük "gürültülü komşu" sorunu ortaya çıktığında gereklidir.

## Kiracı verisini izole etmenin üç yolu nedir?

Üç model maliyet ve yoğunluğu izolasyon gücü karşılığında feda eder: havuzlanmış RLS en ucuz ve en yoğun seçenektir, şema başına kiracı daha zor migration ve bağlantı havuzlama karşılığında gerçek bir ayrım sağlar, veritabanı başına kiracı ise en yüksek operasyonel maliyetle en güçlü izolasyonu verir.

| Model | İzolasyon gücü | Bir hatanın yarıçapı | Migration karmaşıklığı | Uygun senaryo |
|---|---|---|---|---|
| Havuzlanmış + row-level security | Mantıksal, sorgu bazında uygulanır | Tek politika hatası tüm kiracılara sızabilir | Tek migration, bir kez çalışır | Çoğu SaaS, özellikle yüksek kiracı sayısında |
| Şema başına kiracı | Tek veritabanı içinde fiziksel ayrım | Bozuk şemadaki kiracılarla sınırlı | Her şema için ayrı çalışır, otomasyon gecikirse sapar | Bazı hesaplar için daha güçlü ayrım gereken orta ölçekli kiracı sayıları |
| Veritabanı başına kiracı | Tam fiziksel ve operasyonel ayrım | Tek kiracının veritabanıyla sınırlı | Her veritabanı için ayrı çalışır; yedekleme ve izleme çoğalır | Uyumluluk veya veri yerleşim zorunluluğu olan kurumsal kiracılar |

Çoğu ekibin varsayılanı havuzlanmış RLS olmalı; çünkü diğer iki model doğru kurulmuş bir havuzlanmış modele kıyasla farklı bir saldırı yüzeyi değil, denetçilere anlatılacak daha iyi bir hikaye satın alır.

## Postgres row-level security doğru nasıl kurulur?

Her kiracı tablosunda RLS'yi etkinleştirin, tablo sahibinin politikayı sessizce atlamasını önlemek için zorunlu kılın ve oturumda taşınan bir kiracı kimliğine göre filtreleyen politikalar yazın. Postgres, RLS açıkken eşleşen bir politika yoksa erişimi reddeder; unutulan bir politikayı yakalayan güvenlik ağı tam olarak budur.

```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

`FORCE ROW LEVEL SECURITY` önemlidir; çünkü varsayılan olarak tablo sahibi rolü RLS politikalarını tamamen atlar. Bu komut olmadan, ORM'lerde ve migration araçlarında yaygın olan sahip rolüyle çalışan bir bağlantı, az önce yazdığınız politikadan bağımsız olarak tüm kiracıların satırlarını okur. Uygulama, her işlem başında kiracı bağlamını `SET LOCAL app.current_tenant = '<tenant-uuid>'` ile bir kez ayarlar; her politika bunu `current_setting()` üzerinden geri okur.

İki rol için açık sınır gerekir. Birincisi, `BYPASSRLS` sadece dar kapsamlı bir migration veya operasyon rolüne verilmeli, uygulamanın çalışma zamanı rolüne asla verilmemelidir; gerçek bir kiracılar-arası yönetici erişimine ihtiyaç varsa bypass bayrağı dağıtmak yerine açık bir yönetici politikası yazın. İkincisi, RLS'yi derinlemesine savunma olarak ele alın, uygulama sorgularınızda `tenant_id` ile filtrelemenin yerine geçen bir şey olarak değil: RLS, birinin `WHERE` koşulunu unuttuğu günü yakalayan güvenlik ağıdır, onu yazmayı bırakmanın gerekçesi değildir. Kiracı tablolarında `tenant_id`'yi öncü sütun olarak indeksleyin; aksi halde RLS filtreli her sorgu, politika kontrolünün üzerine bir de tam tarama maliyeti öder. [PostgreSQL'in row security policies dokümantasyonu](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), `FOR SELECT`/`FOR ALL` kapsamları ve yazma işlemleri için `WITH CHECK` ile birleşen politikalar dahil tam politika söz dizimini kapsar.

## Bağlantı havuzlama neden saf kiracı bağlamını bozar?

PgBouncer gibi transaction-pooling modunda çalışan bir bağlantı havuzlayıcı, aynı fiziksel bağlantıyı art arda farklı mantıksal işlemlere devreder; dolayısıyla bir işlemde `SET LOCAL` ile ayarlanan kiracı bağlamı, o bağlantıdaki sonraki işleme otomatik olarak taşınmaz. `SET LOCAL` işleme özgüdür ve bu tam olarak istediğiniz güvenlik özelliğidir, ama yalnızca uygulama kodunuz her işlemin başında bunu gerçekten yeniden ayarlıyorsa; uzun ömürlü bir bağlantının tek bir kiracıya "sabitlenmiş" kaldığını varsaymak yerine.

Gerçek dünyadaki hata senaryosu, bir isteğin ortasında havuza geri bırakılan ve farklı bir kiracının isteği tarafından devralınan bir bağlantıdır; kod yolu `SET LOCAL`'i yeniden çalıştırmak yerine önbelleğe alınmış oturum durumundan okursa sızıntı gerçekleşir. [AWS'in çok kiracılı PostgreSQL SaaS için RLS rehberi](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/rls.html), bu havuzlama tuzağını tam olarak tanımlar; çözüm mimari değil prosedüreldir: kiracı oturum değişkenini her bağlantı alımında sıfırlayın veya yeniden başlatın, yeniden kullanılan bir bağlantının önceki isteğin bağlamını taşıdığını asla varsaymayın. Zaten [PgBouncer ile Postgres bağlantı havuzlaması](/tr/posts/pgbouncer-postgres-baglanti-havuzu) kullanıyorsanız, çok kiracılılığın normal havuzlama disiplinine eklediği tek fazlalık budur.

## Kiracı verisi veritabanı dışında nereden sızar?

Gerçek kiracı veri olaylarının çoğu, hiçbir kiracı sınırı düşünülmeden tasarlanmış sistemlerde, sorgu katmanının tamamen dışında gerçekleşir. Sadece kaynak kimliğiyle (tenant:kaynak değil) anahtarlanmış paylaşımlı bir önbellek (Redis, Memcached), A kiracısı ile B kiracısı aynı kimlikli bir kaynağa dokunduğu anda A'nın önbelleğe alınmış değerini B'nin isteğine döndürür. Log satırları ikinci yaygın sızıntı noktasıdır: tam bir istek veya yanıt nesnesini döken bir log ifadesi, bir destek mühendisinin ilgisiz bir vaka için takip ettiği log akışına başka bir kiracının verisini karıştırabilir.

Arka plan iş kuyrukları kiracı bağlamını en sık kaybeder; çünkü bir iş kuyruktan çekilip orijinal istekten bir adım uzak bir worker sürecinde çalıştırılır. İş yükü (payload) kiracı kimliğini açıkça taşımıyorsa ve worker'ın veritabanı bağlantısı bunu yeniden ayarlamıyorsa, iş bağlantının son taşıdığı kiracı bağlamıyla çalışır. Paylaşımlı arama indeksleri de aynı şekle sahiptir: tüm kiracılar için tek bir Elasticsearch veya OpenSearch indeksi, bir sorguda kiracı filtresi eksik olana kadar sorunsuzdur; eksik olduğu anda tek bir kiracının değil tüm kiracıların belgelerini döndürür. Bunların hiçbiri daha iyi RLS politikalarıyla çözülmez; veritabanı dışında da aynı disiplinin (her sınırda açıkça kiracı etiketleme ve kontrol etme) uygulanması gerekir.

## Hangi izolasyon modeli sizin aşamanıza ve mevzuat ihtiyacınıza uyar?

Maliyet ve kiracı yoğunluğu için optimize ediyorsanız varsayılanınız havuzlanmış RLS olsun; bu erken aşamada neredeyse her zaman doğru karardır ve genellikle 100 kiracıyı geçtikten sonra da doğru kalır. Belirli kurumsal veya regüle kiracılar daha güçlü garantiler istediğinde hibrit bir yapıya geçin: çoğu kiracıyı RLS ile havuzlanmış tutun, ihtiyacı olan az sayıdaki kiracıya kendi şemasını, katı veri yerleşimi veya uyumluluk gereksinimleri için ise kendi veritabanını verin. Test etmek, model seçimi kadar önemlidir: sadece aynı kiracı erişiminin çalıştığını değil, kiracılar arası erişimin reddedildiğini açıkça test edin; çünkü mantık hatası taşıyan ama "var olan" bir politika, ancak biri onu aradığında ortaya çıkan türden bir açıktır.

Dürüst görüşüm şu: çoğu ekip, bunu zorunlu kılan gerçek bir uyumluluk gereksinimi olmadan veritabanı başına kiracıya yönelir; çünkü bir satış görüşmesinde "row-level security kullanıyoruz" demekten daha savunulabilir hissettirir. Bu içgüdü, altındaki RLS uygulaması baştan doğru kurulmuş olsaydı kazandıracağı gerçek güvenlikten daha fazlasını operasyonel yük olarak geri alır. Postgres'in neyi barındırması gerektiğini ayrı bir önbellek veya kuyruğa karşı yeniden düşünüyorsanız, [Her Şey İçin Postgres](/tr/posts/her-sey-icin-postgres) ve [cache stratejileri ve geçersiz kılma](/tr/posts/cache-stratejileri-gecersiz-kilma) yazıları, aynı kiracı sınırı sorununa farklı bir açıdan baktığı için bu yazıyla birlikte okunmaya değer.

## Sıkça Sorulan Sorular

### Postgres row-level security sorguları yavaşlatır mı?

RLS her sorguya bir politika kontrolü ekler, ama `tenant_id` öncü sütun olarak indekslenmişse pratikte bu ek yük küçüktür; büyük maliyet genellikle eksik indeksten gelir, RLS'nin kendisinden değil. Önemsiz olduğunu varsaymadan önce kendi iş yükünüzde ölçün.

### Veritabanı sahibi row-level security politikalarını atlayabilir mi?

Evet, varsayılan olarak tablo sahibi rolü RLS'yi tamamen atlar. Bu açığı kapatmak için her kiracı tablosunda `ALTER TABLE ... FORCE ROW LEVEL SECURITY` çalıştırın; çünkü birçok ORM ve migration aracı sahip rolüyle bağlanır.

### İzolasyon için şema başına kiracı mı row-level security mi daha iyidir?

Şema başına kiracı daha güçlü fiziksel ayrım verir, ama kiracı sayısı büyüdükçe migration ve bağlantı havuzlamayı zorlaştırır; çünkü her şema kendi migration çalıştırmasını gerektirir. Çoğu ekip, zorunlu kılınmış doğru bir RLS'den operasyonel maliyetin bir kesriyle eşdeğer gerçek dünya güvenliği elde eder.

### Kiracı verisinin önbellek veya arka plan işlerinden sızmasını nasıl durdururum?

Her önbellek girdisini sadece kaynak kimliğiyle değil kiracı kimliğini de anahtarın parçası yaparak anahtarlayın; arka plan işlerinin kiracı kimliğini worker'ın kalan bağlantı durumuna güvenmek yerine iş yükünde açıkça taşımasını sağlayın. İkisi de disiplin sorunudur, bir RLS politikasının sizin için çözemeyeceği türden.
