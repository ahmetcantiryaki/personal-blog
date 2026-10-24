---
title: "PostgreSQL 19 Nedir? Sürümde Neler Var?"
slug: "postgresql-19-beta-neler-var"
translationKey: "postgresql-19-release-candidate-2026"
locale: "tr"
excerpt: "PostgreSQL 19, Ekim 2026'da Release Candidate 1'de; GA 19 Kasım'a ertelendi. REPACK, paralel autovacuum ve 2 kat hızlı FK insert getiriyor, SQL/PGQ elendi."
category: "software-engineering"
tags: ["postgresql", "databases", "performance"]
publishedAt: "2026-10-24"
seoTitle: "PostgreSQL 19: Neler Değişti, Ne Zaman Çıkıyor?"
seoDescription: "PostgreSQL 19, 15 Ekim 2026'da Release Candidate 1'e ulaştı; kararlı sürüm şimdi 19 Kasım'da planlanıyor. Gelenler, elenen özellikler ve test etmeye değer mi?"
---

Kısa cevap: PostgreSQL 19 henüz kararlı (GA) sürüme ulaşmadı — 15 Ekim 2026'da Release Candidate 1'e (RC1) ulaştı ve yayım ekibi, önce ikinci bir aday sürüm çıkarma kararı alınca kararlı sürümü daha önce planlanan 29 Ekim'den 19 Kasım 2026'ya erteledi. Kesinleşen öne çıkan özellikler: yerleşik bir `REPACK` komutu, önceliklendirme sistemiyle gelen paralel autovacuum ve foreign key kontrolü olan tablolarda 2 kata kadar hızlı insert işlemleri.

## PostgreSQL 19 gerçekte ne zaman çıkıyor?

Kısa cevap: RC1, 15 Ekim 2026'da yayımlandı; RC2, 12 Kasım 2026'da planlanıyor; kararlı sürüm (19.0) ise şimdi 19 Kasım 2026'ya planlanmış durumda. Daha önceki plan kararlı sürüm için 29 Ekim'i hedefliyordu, ama yayım ekibi önce ikinci bir aday sürüme ihtiyaç olduğuna karar verince son tarih üç hafta geri kaydı.

| Kilometre taşı | Tarih |
| --- | --- |
| Beta 1 | 2026 ortası (postgresql.org'a göre) |
| Beta 3 | `GROUP BY ALL` geri alındı |
| Beta 4 | 24 Eylül 2026 — SQL/PGQ dahil altı özellik çıkarıldı |
| RC1 | 15 Ekim 2026 |
| RC2 (planlanan) | 12 Kasım 2026 |
| GA (19.0, planlanan) | 19 Kasım 2026 |

Bu, yükseltme penceresi planlıyorsanız önemli: bugün, 24 Ekim 2026 itibarıyla PostgreSQL 19 hâlâ yayın öncesi (pre-release) bir yazılım. Aday sürümler özellik olarak donduğu için RC1'de test ettiğiniz davranış GA'da da aynı kalmalı, ama RC durumu kural olarak hâlâ "üretimde desteklenmiyor" anlamına geliyor.

## PostgreSQL 19'da gerçekte ne değişti?

Kısa cevap: RC1'e kadar hayatta kalan kesinleşmiş özellikler şunlar: yerel bir `REPACK` komutu, iş yükü önceliklendirmesiyle paralel autovacuum, foreign key kontrollü insert işlemlerinde 2 kata kadar hız artışı, mantıksal replikasyonda sequence değerlerinin kopyalanması ve kendini otomatik ölçeklendiren I/O worker'ları. Bunlar tek bir gösterişli özellik değil, somut ve artımlı operasyonel kazanımlar.

`REPACK`, şişmiş tablo alanını geri kazanmak için `VACUUM FULL` ya da `CLUSTER` çalıştırma alışkanlığının yerini alıyor. `CONCURRENTLY` seçeneği, işlemin büyük bölümünde tabloyu okunabilir ve yazılabilir tutuyor; bu da alan geri kazanmanın tabloyu kilitlemek anlamına geldiği uzun süredir devam eden ödünleşmeyi ortadan kaldırıyor. Autovacuum, yeni `autovacuum_max_parallel_workers` ayarıyla yapılandırılabilen paralel indeks işleme kazandı; ayrıca hangi tabloların en acil vakumlamaya ihtiyacı olduğuna, geliş sırasına göre değil bir puanlama sistemine göre karar veren yeni bir mekanizma geldi.

```sql
-- PostgreSQL 19: tabloyu tam kilitlemeden alan geri kazanma
REPACK (CONCURRENTLY) orders;

-- Paralel autovacuum worker sayısını ayarlama
ALTER SYSTEM SET autovacuum_max_parallel_workers = 4;
```

Replikasyon tarafında, mantıksal replikasyon artık sequence değerlerini de taşıyabiliyor; böylece subscriber'ın sequence'leri publisher ile senkron kalıyor — bu, daha önce failover sonrası elle sequence sıfırlaması gerektiren bir eksiklikti. `io_method=worker` ayarı da akıllandı: sabit, elle ayarlanan bir sayı yerine yeni `io_min_workers` ve `io_max_workers` ayarlarını kullanarak worker sayısını otomatik ölçeklendiriyor.

## PostgreSQL 19'dan çıkış öncesi neler elendi?

Kısa cevap: proje, 24 Eylül 2026'da Beta 4'te altı planlanmış özelliği çıkardı; bunlar arasında uzun süredir beklenen SQL/PGQ özellik grafiği sorgu desteği, partition `MERGE`/`SPLIT` komutları ve çevrimiçi checksum açma/kapama da var. `GROUP BY ALL` ise ayrıca Beta 3'te geri alınmıştı. Bunların hiçbiri PostgreSQL 19.0'da yer almayacak.

Bunu özellikle bilmekte fayda var çünkü SQL/PGQ — ilişkisel tabloları özellik grafiği (property graph) olarak sorgulamanın standart bir yolu — önceki önizlemelerde PostgreSQL 19'un en çok beklenen özelliklerinden biriydi. Gelişiyle birlikte bir grafik sorgu geçişi planlıyorsanız, bu plan artık PostgreSQL 20'yi ya da sonraki bir sürümü beklemek zorunda — yeniden işlenmiş bir versiyonun ne zaman (ya da gerçekten) geri döneceğine dair kesin bir tarih yok.

## Yükseltirken sessizce neler bozulabilir?

Kısa cevap: Yükseltmeden önce kontrol edilmesi gereken üç davranış değişikliği var — Just-In-Time (JIT) derleme artık varsayılan olarak kapalı, RADIUS kimlik doğrulama yöntemi tamamen kaldırıldı ve `standard_conforming_strings` ayarı artık zorunlu. Bunların hiçbiri geri çekilen bir özellik değil; üçü de 19.0'da yer alacak kesinleşmiş, bilinçli değişiklikler.

JIT'in varsayılan olarak kapalı gelmesinin nedeni, planlayıcının JIT maliyet modelinin güvenilmez çıkması — iş yükünüz JIT'in otomatik devreye girmesine güvenen büyük analitik sorgular çalıştırıyorsa, `postgresql.conf` içinde `jit = on` ayarını elle açmanız gerekiyor, yoksa bu sorgular hiçbir uyarı vermeden ölçülebilir şekilde yavaşlıyor. RADIUS kimlik doğrulaması kaldırıldı çünkü proje, PostgreSQL'in desteklediği tek varyant olan RADIUS-over-UDP'yi düzeltilemeyecek kadar güvensiz görüyor; hâlâ bunu kullananların yükseltmeden önce LDAP ya da SCRAM'e geçmesi gerekiyor. `standard_conforming_strings`'in zorunlu hale gelmesinin de bir dump uyumluluğu sonucu var: bu ayar kapalıyken 19 öncesi bir `pg_dump` ya da `pg_dumpall` ile oluşturulan dump, PostgreSQL 19'a temiz şekilde yüklenmiyor — önce aracın güncel sürümüyle yeniden dump almanız gerekiyor.

PostgreSQL 19 ayrıca iki yeni planlayıcı kontrol eklentisi getiriyor: belirli bir sorgu için planlayıcının hangi yürütme planını seçeceğini sabitlemenizi sağlayan `pg_plan_advice`, ve bu tavsiyeyi sorgu kimliklerini kullanarak otomatik uygulayan `pg_stash_advice`. Üretimde beklenmedik bir plan regresyonundan zarar görmüş ekipler artık `pg_hint_plan` gibi üçüncü parti bir eklentiye bağımlı kalmadan bilinen iyi bir planı sabitleyecek yerleşik bir araca sahip.

## PostgreSQL 19'u şimdi mi test etmeli, yoksa GA'yı mı beklemeli?

Kısa cevap: iş yükünüz `REPACK`, paralel autovacuum ya da daha hızlı FK kontrollü insert'lerden fayda görecekse RC1'i şimdi üretim dışı bir ortamda test edin, ama 19 Kasım'da 19.0 çıkana kadar üretime almayın. Aday sürümler özellik olarak dondurulduğu için RC1'de gördüğünüz operasyonel davranış GA ile eşleşmeli, ama RC durumu proje kuralına göre hâlâ "üretim için desteklenmiyor" anlamına geliyor.

Ekibiniz eski bir ana sürümde kalmaya devam edip etmeme konusunda tartışıyorsa, [yığınınızın daha büyük bir kısmı için doğrudan Postgres kullanma savunumuza](/tr/posts/her-sey-icin-postgres) göz atın — 19'daki REPACK ve autovacuum iyileştirmeleri, vakum kaynaklı kesintiyi bir önbellek ya da kuyruk katmanı ekleyerek dolanan ekipler için bu savı biraz daha güçlendiriyor. Postgres'in iç mimarisinde işlerin ne kadar ileri gittiğini merak edenler için [Postgres bileşenlerini Rust'a yeniden yazma girişimi pgrust](/tr/posts/pgrust-postgres-rust-yeniden-yazimi) hakkındaki yazımız da faydalı bir bağlam sunuyor — farklı bir proje olsa da motorun çekirdek performans ve güvenliğine yapılan yatırımın aynı yönde ilerlediğini gösteriyor.

Kişisel değerlendirmem: `REPACK CONCURRENTLY` ve daha akıllı autovacuum önceliklendirmesi yayımlamak manşetlere çıkacak bir özellik değil, ama büyük ve yüksek değişim hızına sahip tablolar çalıştıran ekipler için gece yarısı gelen alarmları ölçülebilir şekilde azaltacak türden bir sürüm — bu, SQL/PGQ'yu yarım yamalak bırakıp sonra çıkarmaktan daha iyi bir tercih. Ekibiniz özellikle grafik sorguları bekliyorsa, PostgreSQL 19 yükseltmenizi buna bağlamayın; vakum ve insert performansı kazanımlarını şimdi benimseyin, SQL/PGQ'yu ayrı takip edin.

Daha fazla veritabanı ve performans içeriği için [Yazılım Mühendisliği kategorimize](/tr/category/yazilim-muhendisligi) bakabilirsiniz.

## Sıkça Sorulan Sorular

### PostgreSQL 19 kararlı sürüme ulaştı mı?

Hayır. 24 Ekim 2026 itibarıyla PostgreSQL 19, 15 Ekim'de yayımlanan Release Candidate 1 aşamasında. İkinci bir aday sürüm 12 Kasım'da planlanıyor; kararlı sürüm (19.0) şimdi 19 Kasım 2026'ya hedefleniyor.

### PostgreSQL 19, SQL/PGQ grafik sorgu desteğini içeriyor mu?

Hayır. SQL/PGQ, partition `MERGE`/`SPLIT` ve çevrimiçi checksum açma/kapama ile birlikte 24 Eylül 2026'da Beta 4'te sürümden çıkarıldı. Bu özellikler PostgreSQL 19.0'da yer almayacak.

### PostgreSQL 19'a yükseltmeden önce neye dikkat etmeliyim?

İş yükünüzün varsayılan olarak açık JIT derlemeye bağlı olup olmadığını, RADIUS ile kimlik doğrulama yapıp yapmadığınızı ve herhangi bir istemcinin `standard_conforming_strings` kapalıyken veri dump'ı alıp almadığını kontrol edin. JIT artık varsayılan olarak kapalı, RADIUS kimlik doğrulaması tamamen kaldırıldı ve `standard_conforming_strings` zorunlu hale geldi — üçü de önceden kontrol etmezseniz davranışı sessizce değiştirebilir ya da bir geri yüklemeyi bozabilir.

### PostgreSQL 19'da insert işlemleri ne kadar hızlanıyor?

Resmi Beta 1 duyurusuna göre, özellikle foreign key kontrolü olan tablolardaki insert'lerde 2 kata kadar. Bu, tüm yazma iş yüklerine değil, insert sırasındaki foreign key doğrulama yoluna özgü bir iyileştirme.

Kaynaklar:
- [PostgreSQL 19 Beta 1 Released (postgresql.org)](https://www.postgresql.org/about/news/postgresql-19-beta-1-released-3313/)
- [PostgreSQL 19 Release Candidate 1 (postgresql.org)](https://www.postgresql.org/about/news/postgresql-19-rc-1-released-3409/)
- [Updated PostgreSQL RC / GA dates (postgresql.org mailing list)](https://www.postgresql.org/message-id/f161fbb7-e193-42eb-bec7-4cfc1af74a50@postgresql.org)
