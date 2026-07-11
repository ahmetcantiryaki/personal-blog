---
title: "Kesintisiz Veritabanı Şema Migrasyonları"
slug: "kesintisiz-sema-migrasyonlari"
translationKey: "zero-downtime-schema-migrations"
locale: "tr"
excerpt: "Tek bir ALTER TABLE komutu production'da bir tabloyu 40 saniye kilitledi. Expand-contract deseni, güvenli backfill ve concurrent index bu hatayı önler."
category: "software-engineering"
tags: ["databases", "sql", "deployment", "best-practices"]
publishedAt: "2026-07-11"
seoTitle: "Kesintisiz Şema Migrasyonu: Expand-Contract Rehberi"
seoDescription: "Tek bir ALTER TABLE komutu production'da bir tabloyu 40 saniyeliğine kilitledi. Expand-contract deseni, güvenli backfill ve concurrent index ile önleyin."
---

Saat 14:32'de bir mühendis `ALTER TABLE orders ADD COLUMN status_v2 VARCHAR(20) NOT NULL DEFAULT 'pending'` komutunu çalıştırdı. Migrasyon staging'de sorunsuz geçmişti; tablo küçüktü, komut milisaniyeler sürmüştü. Production'da ise `orders` tablosu 40 milyon satırdı. Postgres, her satıra varsayılan değeri yazmak için tabloyu SHARE lock ile kilitledi; 40 saniye boyunca hiçbir sipariş yazılamadı, ödeme servisi timeout'lara düştü, on-call telefonu çaldı.

Bu senaryo tanıdık geliyorsa yalnız değilsiniz — çoğu "basit" şema değişikliği tam olarak bu şekilde production'ı vuruyor. Çözüm karmaşık değil ama disiplin istiyor: [expand-contract](https://dev.to/software_mvp-factory/zero-downtime-database-migrations-a-practical-guide-for-postgresql-11af) deseni.

## Expand-contract deseni nedir

Fikir basit: şemayı tek adımda değiştirmek yerine, eski ve yeni yapının bir arada var olduğu bir geçiş penceresi yaratıyorsunuz.

1. **Expand**: Yeni sütunu nullable olarak ekleyin (varsayılan değer olmadan, NOT NULL kısıtlaması olmadan).
2. **Backfill**: Mevcut satırları küçük batch'ler halinde yeni sütuna doldurun.
3. **Dual-write**: Uygulama kodunu hem eski hem yeni sütuna yazacak şekilde deploy edin.
4. **Switch**: Okuma yolunu yeni sütuna geçirin, doğrulayın.
5. **Contract**: Eski sütunu artık hiçbir kod referans etmediğinde kaldırın.

Bu beş adım tek deploy yerine birkaç deploy'a yayılıyor, ama her adım tek başına güvenli ve geri alınabilir. Yukarıdaki olayda asıl hata, `NOT NULL DEFAULT` kombinasyonunun Postgres'e mevcut her satırı senkron olarak yeniden yazdırmasıydı — expand-contract bu adımı asla tek komutta yapmaz.

| Adım | Ne yapar | Kilit riski | Geri alınabilir mi |
|---|---|---|---|
| Expand | Nullable sütun ekler | Yok (metadata-only) | Evet, sütunu drop et |
| Backfill | Batch'ler halinde veri doldurur | Düşük (kısa satır kilitleri) | Evet, backfill'i durdur |
| Dual-write | Kod her iki sütuna da yazar | Yok | Evet, eski deploy'a dön |
| Switch | Okuma yeni sütuna geçer | Yok | Evet, flag ile geri al |
| Contract | Eski sütun silinir | Metadata-only | Hayır — dikkatli olun |

## Neden bu hikâye tanıdık geliyor

Bu tarz olaylar, çoğu ekibin "migrasyon staging'de çalıştı, production'da da çalışır" varsayımından kaynaklanıyor. Sorun şu ki staging'deki veri hacmi genellikle production'ın çok küçük bir kesri — bir tabloyu kilitleyen davranış, sadece belirli bir satır sayısının üzerinde ortaya çıkıyor. Bu yüzden migrasyon güvenliğini test etmenin en güvenilir yolu, staging'de production'a yakın hacimde bir kopya üzerinde denemek, ya da migrasyonun kilit davranışını statik olarak analiz eden bir linter kullanmak.

## Batch'ler halinde backfill

40 milyon satırı tek transaction'da güncellemek, uzun süreli kilitler ve şişen WAL (write-ahead log) anlamına gelir. Doğru yaklaşım, birincil anahtara göre sıralı batch'ler halinde ilerlemek — örneğin her seferinde 5.000 satır, batch'ler arasında kısa bir bekleme ile:

```sql
UPDATE orders
SET status_v2 = status
WHERE id BETWEEN :batch_start AND :batch_end
  AND status_v2 IS NULL;
```

Bu döngü bir cron job ya da migrasyon script'i olarak çalıştırılır, ilerlemesi izlenir ve replikasyon lag'i belirli bir eşiği geçerse otomatik olarak durur. İlerleme durumunu kalıcı bir yerde (ayrı bir tabloda ya da bir konfigürasyon deposunda) tutmak, script bir sebepten yeniden başlatıldığında kaldığı yerden devam etmesini sağlar. [Veritabanı indeksleme](/tr/posts/veritabani-indeksleme) yazımızda bahsettiğimiz gibi, backfill sırasında ilgili sütun üzerinde eksik bir indeks varsa WHERE koşulu tüm tabloyu tarar — batch'lemenin faydasını sıfırlar.

## CREATE INDEX CONCURRENTLY: yazma kilidinden kaçınma

Yeni sütuna bir indeks eklemeniz gerekiyorsa, sıradan `CREATE INDEX` tabloya SHARE lock koyar ve INSERT/UPDATE/DELETE işlemlerini indeks oluşturulana kadar bloklar. [Postgres dokümantasyonuna göre](https://www.postgresql.org/docs/current/sql-createindex.html), `CREATE INDEX CONCURRENTLY` bunun yerine SHARE UPDATE EXCLUSIVE kilidi kullanır — yazma işlemlerine izin verirken çakışan DDL komutlarını engeller.

Bunun bedeli var: `CONCURRENTLY` bir transaction bloğu içinde çalışamaz ve nadiren de olsa başarısız olup elle temizlik gerektirebilir. Migrasyon aracınızın bu komutu otomatik olarak bir transaction'a sarmadığından emin olun — birçok ORM migrasyon aracı bunu varsayılan olarak yapar ve komutu sessizce başarısız kılar.

## Replikasyon lag'ini izlemek

Backfill script'i her batch'i tamamladığında bir sonrakine geçmeden önce replikasyon lag'ini kontrol etmesi gerekiyor. Nedeni basit: birincil veritabanına yazılan her UPDATE, replica'lara WAL üzerinden akıyor; backfill çok agresif çalışırsa replica'lar geride kalır ve okuma trafiğinizi replica'lara yönlendiren servisler eski veri döndürmeye başlar. Pratik eşik olarak, lag belirli bir saniyeyi (örneğin 2-3 saniye) geçtiğinde script'in otomatik olarak duraklaması ve lag normale dönene kadar beklemesi öneriliyor.

Bu izleme mantığını backfill script'ine gömmek yerine ayrı bir gözlemlenebilirlik katmanından beslemek daha sürdürülebilir — script sadece bir metrik uç noktasını sorguluyor, karar mantığı basit kalıyor. Böylece backfill'i durdurmak için script'i öldürmeniz gerekmiyor, script kendi kendine yavaşlıyor ve trafik normale döndüğünde otomatik olarak hızlanıyor.

## Uygulama ve şema rollout'unu koordine etmek

Expand-contract'ın en kırılgan noktası, uygulama deploy'u ile şema migrasyonunun sırası. Kural şu: şema her zaman uygulamadan önce genişler, uygulamadan sonra daralır. Yani yeni sütunu okuyan kod deploy edilmeden önce sütun mevcut olmalı; eski sütunu silen migrasyon ise onu kullanan son kod kaldırıldıktan sonra çalışmalı.

Bu koordinasyonu elle takip etmek yerine, [sıfırdan CI/CD pipeline nasıl kurulur](/tr/posts/cicd-pipeline-nasil-kurulur) yazımızdaki pipeline aşamalarına bir "migrasyon durumu" kontrolü eklemek işe yarıyor — pipeline, hedef sütunun mevcut olduğunu doğrulamadan yeni kodu production'a almıyor. Dual-write aşamasını bir [feature flag](/tr/posts/feature-flag-teknik-borc) arkasında tutmak, sorun çıkarsa tek deploy beklemeden anında eski davranışa dönmenizi sağlar.

## Her aşamada geri dönüş

Expand-contract'ı seçmenin asıl nedeni, [kesintisiz deployment](/tr/posts/kesintisiz-deployment) yazımızda savunduğumuz "her adım tek başına güvenli" prensibiyle birebir örtüşmesi. Backfill yarıda kaldıysa durdurabilirsiniz, tablo hâlâ tutarlı. Dual-write'ta sorun çıkarsa flag'i kapatıp eski koda dönebilirsiniz. Tek geri dönüşü olmayan adım contract — eski sütunu silmek — bu yüzden en son, en soğukkanlı ve genellikle günler sonra atılan adım olmalı.

## Sıkça Sorulan Sorular

### Backfill ne kadar sürmeli?

Tablo boyutuna ve trafiğe bağlı ama genel kural: her batch'in kilit süresi milisaniyeler mertebesinde kalmalı. 40 milyon satırlık bir tablo için batch'ler arasında 100-200ms bekleme ile toplam süre saatler alabilir — bu normal, aceleye getirmeyin.

### NOT NULL kısıtlamasını hiç ekleyemez miyim?

Ekleyebilirsiniz ama iki adımda: önce `NOT VALID` ile kısıtlamayı ekleyin (mevcut satırları taramaz), sonra ayrı bir `VALIDATE CONSTRAINT` komutuyla doğrulayın. Bu, tek adımlı `NOT NULL` eklemenin tetiklediği tam tablo taramasını böler.

### Contract adımını ne zaman güvenle atabilirim?

Eski sütuna hiçbir kod, hiçbir rapor, hiçbir üçüncü parti entegrasyon referans etmediğinden emin olduktan sonra — genellikle switch adımından en az bir-iki hafta sonra, sorun çıkmadığını gözlemleyerek.

### Backfill sırasında uygulama hâlâ eski sütuna mı yazmalı?

Evet — dual-write aşamasında uygulama her iki sütuna da yazmalı, backfill script'i ise sadece henüz doldurulmamış eski satırları kapsamalı. Bu iki mekanizmanın çakışmaması için backfill sorgusuna `WHERE status_v2 IS NULL` gibi bir koşul eklemek, zaten güncel olan satırları tekrar yazmayı önler.

### Küçük tablolar için bu kadar disiplin gerekli mi?

Birkaç bin satırlık bir tabloda sıradan `ALTER TABLE` muhtemelen milisaniyeler sürer, expand-contract gereksiz karmaşıklık katar. Eşik olarak: tablo trafiği yüksekse veya satır sayısı yüz binleri geçiyorsa, expand-contract'a geçmenin maliyeti risk almaktan daha düşüktür.

### Migrasyon aracım (Prisma, Rails, Django) expand-contract'ı otomatik destekliyor mu?

Çoğu migrasyon aracı beş adımı otomatik olarak yönetmez — her adımı ayrı bir migrasyon dosyası olarak elle tanımlamanız gerekir. Bazı araçlar `CONCURRENTLY` gibi komutları transaction dışında çalıştırmayı destekler, bazıları desteklemez; kullandığınız aracın dokümantasyonunu bu adım için mutlaka kontrol edin, aksi halde komut sessizce transaction'a sarılıp başarısız olabilir. Bu kontrolü migrasyon eklemeden önce bir kereliğine yapmak, üretimde sürpriz yaşamanızı önler.
